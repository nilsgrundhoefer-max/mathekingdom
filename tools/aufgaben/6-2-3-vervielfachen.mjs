// Aufgaben zu 6.2.3 „Brüche vervielfachen“ (Lernziele V1, V2) nach ADR 0015 und ADR 0038.
// V1: einen Bruch mit einer natürlichen Zahl multiplizieren. V2: gemischte Zahlen vervielfachen, Sachaufgaben.
// Grilling mit Nils (2026-11-24): Auf F liegt derselbe Bruch mehrmals als Bild nebeneinander. Typische Fehler: den Nenner mitvervielfachen
// (3 · 2⁄7 = 6⁄21), bei gemischten Zahlen nur die Ganzen malnehmen (4 · 2 3⁄8 = 8 3⁄8).

import { sechs, auswahl, luecken, zahl, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { bild, benenne, FREI, WERT, ggt, br, opt, zz, wahl, mische, kz, mal, plus, T, echt, rechneB, optionen, urteil, VGL, ZEICHEN, kreis, streifen, kreise, istBruch, gleich, ganz } from './6-2-rechnen.mjs';

const V1 = '6.2.3-V1', V2 = '6.2.3-V2';
const B2 = (q) => br(q[0], q[1]);
// k gleiche Figuren nebeneinander (höchstens drei).
const mehrmals = (form, k, [z, n]) => bild(...benenne(Array.from({ length: k }, () => form(z, n))));
// k · a⁄n. passt(k, a, p) wählt aus; p ist das gekürzte Produkt.
const fach = (nenner, ks, passt = () => true) => { for (let i = 0; i < 800; i++) { const a = echt(nenner), k = wahl(ks), p = mal(ganz(k), a); if (passt(k, a, p)) return { k, a, n: a[1], p, roh: [k * a[0], a[1]] }; } return null; };
const unter1 = (k, a) => k * a[0] < a[1];
const ueber1 = (k, a, p) => k * a[0] > a[1] && istBruch(p);
const gz = (ganze, nenner) => { const a = echt(nenner), g = wahl(ganze); return [g * a[1] + a[0], a[1]]; };

export function vervielfachen() {
  // ================= V1: Bruch mal natürliche Zahl =================
  const NF = [5, 7, 8, 9, 10, 11, 12];
  const tV = h3('Der Bruch wird mehrmals genommen. Zähle alle gefärbten Teile.', `3 · ${br(2, 7)} = ${br(6, 7)}, denn 3 · 2 = 6. Der Nenner bleibt 7.`, 'Nimm nur den Zähler mal. Schreibe den Nenner ab.');
  sechs(V1, 'F', [
    () => { const { k, a, n, roh } = fach(NF, [2, 3], unter1);
      return luecken(Z(`Jeder Streifen zeigt ${B2(a)}.`, `Es sind ${k} Streifen.`, `${k} · ${B2(a)} = {{a}}⁄${n}`), { a: [roh[0], fehlerliste(roh[0], [[a[0] + k, '1x1-addiert'], [a[0], 'sach-schritt-vergessen']])] }, tV,
        { bild: mehrmals(streifen, k, a), nachweis: [`${k} · ${B2(a)} = ${B2(roh)}`] }); },
    () => { const { k, a, n, roh } = fach(NF, [2, 3], (kk, x, p) => unter1(kk, x) && ggt(kk * x[0], x[1]) === 1);
      return rechneB(Z(`Jeder Kreis zeigt ${B2(a)}.`, `Rechne ${k} · ${B2(a)}.`), roh, [[[k * a[0], k * n], 'bruch-mal-nenner-mit'], [[a[0] + k, n], '1x1-addiert']], tV, [`${k} · ${B2(a)} = ${B2(roh)}`], { bild: mehrmals(kreis, k, a) }); },
    () => { const { k, a, n, roh } = fach(NF.filter((x) => x <= 6 || x === 12), [2], (kk, x) => unter1(kk, x) && ggt(kk * x[0], x[1]) === 1 && x[0] + kk !== kk * x[0]);
      return auswahl(Z(`Jeder Streifen zeigt ${B2(a)}.`, `Wie viel ist ${k} · ${B2(a)}?`), optionen(roh, [[[k * a[0], k * n], 'bruch-mal-nenner-mit'], [[a[0] + k, n], '1x1-addiert']], B2), tV,
        { bild: mehrmals(streifen, k, a), nachweis: [`${k} · ${B2(a)} = ${B2(roh)}`, WERT(B2(roh))] }); },
    () => { const { k, a, n, roh } = fach(NF, [3], unter1);
      return luecken(Z(`Jeder Kreis zeigt ${B2(a)}.`, 'Schreibe als Malaufgabe.', `${B2(a)} + ${B2(a)} + ${B2(a)} = {{a}} · ${B2(a)} = {{b}}⁄${n}`), { a: [k, fehlerliste(k, [[a[0], 'sach-frage-verfehlt'], [n, 'sach-frage-verfehlt']])], b: [roh[0], fehlerliste(roh[0], [[a[0] + k, '1x1-addiert'], [a[0], 'sach-schritt-vergessen']])] },
        h3('Derselbe Bruch steht mehrmals da. Zähle, wie oft.', `${br(2, 9)} + ${br(2, 9)} + ${br(2, 9)} = 3 · ${br(2, 9)} = ${br(6, 9)}.`, 'Zähle die Brüche in der Plusaufgabe. Nimm dann den Zähler mal.'),
        { bild: mehrmals(kreis, k, a), nachweis: [`${B2(a)} + ${B2(a)} + ${B2(a)} = ${k} · ${B2(a)} = ${B2(roh)}`] }); },
    () => { const { k, a, roh } = fach([5, 8, 10], [2, 3], (kk, x) => x[0] === 1 && unter1(kk, x) && ggt(kk, x[1]) === 1), kn = kind(), was = wahl(['Saft', 'Wasser', 'Milch']);
      return rechneB(Z(`In ein Glas passt ${B2(a)} l ${was}.`, `${kn} füllt ${k} Gläser.`, `Wie viel ${was} ist das zusammen?`), roh, [[[k, k * a[1]], 'bruch-mal-nenner-mit'], [[1 + k, a[1]], '1x1-addiert']],
        h3('Jedes Glas ist gleich voll. Nimm den Bruch so oft, wie es Gläser gibt.', `3 Gläser mit je ${br(1, 4)} l sind 3 · ${br(1, 4)} l = ${br(3, 4)} l.`, `Rechne ${k} · ${B2(a)}.`), [`${k} · ${B2(a)} l = ${B2(roh)} l`], { einheit: 'l', bild: mehrmals(streifen, k, a) }); },
    () => { const { k, a, n, roh, p } = fach([6, 8, 9, 10, 12], [2, 3], (kk, x) => unter1(kk, x) && ggt(kk * x[0], x[1]) > 1);
      return rechneB(Z(`Jeder Kreis zeigt ${B2(a)}.`, `Rechne ${k} · ${B2(a)}.`, 'Kürze das Ergebnis.'), p, [[[k * a[0], k * n], 'bruch-mal-nenner-mit'], [[a[0] + k, n], '1x1-addiert']],
        h3('Nimm zuerst den Zähler mal. Kürze dann das Ergebnis.', `2 · ${br(3, 8)} = ${br(6, 8)}. Gekürzt ist das ${br(3, 4)}.`, `Das Ergebnis heißt zuerst ${B2(roh)}. Teile Zähler und Nenner durch dieselbe Zahl.`), [`${k} · ${B2(a)} = ${B2(roh)}`], { bild: mehrmals(kreis, k, a) }); },
  ]);
  const NG = [6, 8, 9, 10, 12, 14, 15, 16, 18, 20];
  const tVG = h3('Nimm nur den Zähler mal. Der Nenner bleibt. Kürze am Ende.', `4 · ${br(3, 10)} = ${br(12, 10)} = ${br(6, 5)} = ${T([6, 5])}.`, 'Schreibe zuerst das Ergebnis mit dem alten Nenner. Kürze dann und schreibe als gemischte Zahl.');
  sechs(V1, 'G', [
    () => { const { k, a, n, roh, p } = fach(NG, [2, 3, 4, 5], (kk, x) => unter1(kk, x) && ggt(kk * x[0], x[1]) > 1);
      return rechneB(Z(`Rechne ${k} · ${B2(a)}.`, 'Kürze das Ergebnis vollständig.'), p, [[[k * a[0], k * n], 'bruch-mal-nenner-mit'], [[a[0] + k, n], '1x1-addiert']], tVG, [`${k} · ${B2(a)} = ${B2(roh)}`]); },
    () => { const { k, a, n, roh } = fach([3, 4, 5, 6, 8], [2, 3], (kk, x, p) => ueber1(kk, x, p) && kk * x[0] <= 3 * x[1]);
      return luecken(Z(`Jeder Kreis zeigt ${B2(a)}.`, `Es sind ${k} Kreise.`, `${k} · ${B2(a)} = {{a}}⁄${n}`), { a: [roh[0], fehlerliste(roh[0], [[a[0] + k, '1x1-addiert'], [a[0], 'sach-schritt-vergessen']])] }, tVG,
        { bild: mehrmals(kreis, k, a), nachweis: [`${k} · ${B2(a)} = ${B2(roh)}`] }); },
    () => { const { k, a, n, roh } = fach(NG.filter((x) => x <= 12), [2, 3, 4, 5], (kk, x) => unter1(kk, x));
      return luecken(Z(`Im Streifen ist ${B2(roh)} gefärbt.`, 'Welche Zahl fehlt?', `{{a}} · ${B2(a)} = ${B2(roh)}`), { a: [k, fehlerliste(k, [[roh[0] - a[0], '1x1-addiert'], [n, 'sach-frage-verfehlt'], [roh[0], 'sach-frage-verfehlt']])] },
        h3('Überlege: Wie oft passt der kleine Zähler in den großen Zähler?', `? · ${br(2, 9)} = ${br(8, 9)}: Es ist die 4, denn 4 · 2 = 8.`, `Rechne ${roh[0]} : ${a[0]}.`), { bild: bild(streifen(...roh)), nachweis: [`${B2(roh)} : ${B2(a)} = ${k}`] }); },
    () => { const { k, a, roh, p } = fach(NG, [3, 4, 5, 6], (kk, x, pp) => ueber1(kk, x, pp) && x[1] % kk === 0);
      return rechneB(Z(`Rechne ${k} · ${B2(a)}.`, 'Kürze das Ergebnis vollständig.'), p, [[[k * a[0], k * a[1]], 'bruch-mal-nenner-mit'], [[roh[0] - a[1], a[1] - 1], 'gemischt-umwandeln']],
        h3('Du darfst vor dem Malnehmen kürzen: die Zahl mit dem Nenner.', `4 · ${br(3, 8)}: Kürze 4 und 8 mit 4. Dann bleibt ${br(3, 2)} = ${T([3, 2])}.`, `Teile ${k} und ${a[1]} durch ${k}. Rechne dann weiter.`), [`${k} · ${B2(a)} = ${T(p)}`]); },
    () => { const { k, a, roh, p } = fach(NG, [3, 4, 5, 6, 7], ueber1);
      return rechneB(Z(`Rechne ${B2(a)} · ${k}.`, 'Kürze das Ergebnis vollständig.'), p, [[[k * a[0], k * a[1]], 'bruch-mal-nenner-mit'], [[a[0], k * a[1]], 'bruch-mal-nenner-mit']],
        h3('Die Zahl darf auch hinter dem Bruch stehen. Du rechnest genauso.', `${br(3, 10)} · 4 = ${br(12, 10)} = ${br(6, 5)} = ${T([6, 5])}.`, `Rechne ${a[0]} · ${k} für den Zähler. Der Nenner bleibt ${a[1]}.`), [`${B2(a)} · ${k} = ${T(p)}`]); },
    () => { const { k, a, n, roh } = fach([5, 7, 8, 9, 10], [2, 3], (kk, x) => unter1(kk, x) && ggt(kk * x[0], x[1]) === 1), kn = kind(), falle = [k * a[0], k * n], stimmt = wahl([true, false, false]), g = (x) => `${k} · ${B2(a)} = ${B2(x)}`;
      return urteil(Z(`Jeder Kreis zeigt ${B2(a)}.`, `${kn} rechnet: ${g(stimmt ? roh : falle)}`, 'Stimmt das?'), stimmt, g(stimmt ? roh : falle), g(stimmt ? falle : roh), [g([a[0] + k, n])], 'bruch-mal-nenner-mit',
        h3('Die Teile bleiben gleich groß. Es werden nur mehr Teile.', `3 · ${br(2, 7)} = ${br(6, 7)}. Der Nenner bleibt 7.`, `Prüfe: Ist der Zähler ${k} · ${a[0]}? Ist der Nenner noch ${n}?`), { bild: mehrmals(kreis, k, a) }); },
  ]);
  const NM = [8, 9, 12, 14, 15, 16, 18, 20, 21, 24, 25, 30];
  sechs(V1, 'M', [
    () => { const { k, a, p } = fach(NM, [4, 5, 6, 7, 8, 9], (kk, x, pp) => ueber1(kk, x, pp) && ggt(kk, x[1]) > 1);
      return rechneB(`Berechne ${k} · ${B2(a)} und kürze vollständig.`, p, [[[k * a[0], k * a[1]], 'bruch-mal-nenner-mit'], [[a[0] + k, a[1]], '1x1-addiert']],
        h2('Multipliziere nur den Zähler. Du kannst vorher die Zahl mit dem Nenner kürzen.', `Kürze ${k} und ${a[1]} mit ${ggt(k, a[1])}. Multipliziere dann und schreibe das Ergebnis als gemischte Zahl.`), [`${k} · ${B2(a)} = ${T(p)}`]); },
    () => { const e = gz([1, 2, 3], [3, 4, 5, 6, 8]), k = zz(3, 6), p = mal(ganz(k), e), g = Math.floor(e[0] / e[1]);
      if (!istBruch(p)) return null;
      return rechneB(`Berechne ${k} · ${T(e)} und kürze vollständig.`, p, [[[k * g * e[1] + (e[0] % e[1]), e[1]], 'gemischt-getrennt-mal'], [[k * e[0], k * e[1]], 'bruch-mal-nenner-mit']],
        h2('Wandle die gemischte Zahl zuerst in einen Bruch um.', `${T(e)} = ${B2(e)}. Multipliziere dann den Zähler mit ${k}.`), [`${k} · ${T(e)} = ${T(p)}`]); },
    () => { const { k, a, p } = fach(NM.filter((x) => x <= 16), [4, 5, 6, 8, 9], ueber1);
      return zahl(`Mit welcher Zahl musst du ${B2(a)} multiplizieren, um ${T(p)} zu erhalten?`, k, fehlerliste(k, [[p[0], 'sach-frage-verfehlt'], [k + 1, 'sach-schritt-vergessen'], [a[1], 'sach-frage-verfehlt']]),
        h2('Wandle das Ergebnis in einen Bruch mit demselben Nenner um.', `${T(p)} = ${br(k * a[0], a[1])}. Wie oft passt der Zähler ${a[0]} in den Zähler ${k * a[0]}?`), { nachweis: [`${T(p)} : ${B2(a)} = ${k}`] }); },
    () => { const a = echt([3, 4, 5, 6, 8, 9, 12]), f = zz(2, 5), k = f * a[1];
      return zahl(`Berechne ${k} · ${B2(a)}.`, f * a[0], fehlerliste(f * a[0], [[k * a[0], 'sach-schritt-vergessen'], [f, 'sach-schritt-vergessen']]),
        h2('Hier lässt sich die Zahl vollständig mit dem Nenner kürzen.', `Rechne ${k} : ${a[1]} = ${f}. Multipliziere das Ergebnis mit dem Zähler ${a[0]}.`), { nachweis: [`${k} · ${B2(a)} = ${f * a[0]}`] }); },
    () => { const { k, a, p } = fach(NM.filter((x) => x <= 16), [3, 4, 5, 6, 7], ueber1), g = Math.floor(p[0] / p[1]) + wahl([0, 1]);
      return auswahl(`Welches Zeichen passt? ${k} · ${B2(a)} ▢ ${g}`, ZEICHEN(p[0] - g * p[1], 'bruch-mal-nenner-mit'), h2('Berechne zuerst das Produkt und wandle es in eine gemischte Zahl um.', `${k} · ${B2(a)} = ${br(k * a[0], a[1])}. Vergleiche das mit ${g} = ${br(g * a[1], a[1])}.`), { nachweis: [VGL(`${k} · ${B2(a)}`, String(g))] }); },
    () => { const roh = [];
      for (let i = 0; i < 4; i++) { const { k, a, p } = fach(NM.filter((x) => x <= 20), [3, 4, 5, 6, 8], ueber1), stimmt = i < 2 ? i === 0 : wahl([true, false]), g = Math.floor(p[0] / p[1]);
        const x = stimmt ? p : wahl([[k * a[0], k * a[1]], [p[0] + p[1], p[1]], [k * a[0] + a[1], a[1]]]);
        if (gleich(x, p) !== stimmt || !istBruch(x) || g < 1) return null;
        const t = `${k} · ${B2(a)} = ${T(kz(x))}`; if (roh.some(([q]) => q === t)) return null; roh.push([t, stimmt]); }
      return auswahl('Welche Gleichungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'bruch-mal-nenner-mit')), h2('Rechne jede Aufgabe nach und kürze.', 'Multipliziere nur den Zähler. Wandle das Ergebnis in eine gemischte Zahl um und vergleiche.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
  ]);
  const NE = [12, 14, 15, 16, 18, 20, 21, 24, 28, 30, 36, 40, 45];
  sechs(V1, 'E', [
    () => { const e = gz([2, 3, 4, 5], [12, 15, 16, 18, 20, 24]), k = wahl([4, 6, 8, 9, 10, 12]), p = mal(ganz(k), e), g = Math.floor(e[0] / e[1]);
      if (!istBruch(p) || ggt(k, e[1]) === 1) return null;
      return rechneB(`Berechne ${k} · ${T(e)} und kürze vollständig.`, p, [[[k * g * e[1] + (e[0] % e[1]), e[1]], 'gemischt-getrennt-mal'], [[k * e[0], k * e[1]], 'bruch-mal-nenner-mit']],
        h1('Wandle in einen unechten Bruch um und kürze vor dem Multiplizieren.'), [`${k} · ${T(e)} = ${T(p)}`]); },
    () => { const { k, a, p } = fach(NE, [6, 8, 9, 10, 12, 14, 15], (kk, x, pp) => ueber1(kk, x, pp) && ggt(kk, x[1]) > 1 && pp[1] !== x[1]);
      return luecken(`Welcher Faktor fehlt? {{a}} · ${B2(a)} = ${T(p)}`, { a: [k, fehlerliste(k, [[p[0], 'sach-frage-verfehlt'], [k / ggt(k, a[1]), 'kuerzen-nicht-vollstaendig'], [a[1], 'sach-frage-verfehlt']])] },
        h1(`Erweitere das Ergebnis auf den Nenner ${a[1]}. Vergleiche dann die Zähler.`), { nachweis: [`${T(p)} : ${B2(a)} = ${k}`] }); },
    () => { const { k, a, p } = fach(NE, [5, 6, 7, 8, 9], (kk, x, pp) => ueber1(kk, x, pp) && ggt(kk, x[1]) > 1 && x[0] > 2);
      return luecken(`Welcher Zähler fehlt? ${k} · {{a}}⁄${a[1]} = ${T(p)}`, { a: [a[0], fehlerliste(a[0], [[p[0], 'sach-frage-verfehlt'], [k * a[0], 'sach-schritt-vergessen'], [p[0] % p[1], 'gemischt-umwandeln']])] },
        h1(`Wandle das Ergebnis in einen Bruch mit dem Nenner ${a[1]} um. Teile dann seinen Zähler durch ${k}.`), { nachweis: [`${T(p)} : ${k} = ${B2(a)}`, { art: 'teil', bruch: B2(a), was: 'zaehler', zahl: a[0] }] }); },
    () => auswahl('Ein vollständig gekürzter Bruch wird mit einer natürlichen Zahl multipliziert. Wann ist das Ergebnis eine natürliche Zahl?', mische([opt('Wenn die Zahl ein Vielfaches des Nenners ist.', true), opt('Wenn die Zahl ein Vielfaches des Zählers ist.', false, 'bruch-vertauscht'), opt('Wenn die Zahl größer ist als der Nenner.', false, 'bruch-mal-nenner-mit'), opt('Nie, denn ein Bruch bleibt immer ein Bruch.', false, 'bruch-mal-nenner-mit'), opt('Immer, denn beim Multiplizieren verschwindet der Nenner.', false, 'bruch-mal-nenner-mit')]),
      h1('Probiere es mit einem Beispiel aus: Womit musst du drei Viertel multiplizieren, damit sich der Nenner wegkürzt?'), { nachweis: [FREI('Wann sich der Nenner vollständig wegkürzt')] }),
    () => { const n = wahl([7, 9, 11, 12, 13, 15]), a = zz(3, 8), c = zz(3, 8), d = wahl([0, 1, -1]);
      if (a === c || a + d < 2 || ggt(a, n) > 1 || ggt(c, n) > 1 || ggt(a + d, n) > 1) return null;
      return auswahl(`Welches Zeichen passt? ${a} · ${br(c, n)} ▢ ${c} · ${br(a + d, n)}`, ZEICHEN(-d, 'bruch-mal-nenner-mit'), h1('Vergleiche die Zähler der beiden Produkte. Die Nenner sind gleich.'), { nachweis: [VGL(`${a} · ${br(c, n)}`, `${c} · ${br(a + d, n)}`)] }); },
    () => { const roh = [];
      for (let i = 0; i < 5; i++) { const e = gz([1, 2, 3], [4, 5, 6, 8, 9, 10, 12]), k = zz(3, 9), p = mal(ganz(k), e), g = Math.floor(e[0] / e[1]), stimmt = i < 2 ? i === 0 : wahl([true, false]);
        const x = stimmt ? p : wahl([[k * g * e[1] + (e[0] % e[1]), e[1]], [p[0] + p[1], p[1]], [k * g * e[1] + k * (e[0] % e[1]) + e[1], e[1]]]);
        if (gleich(x, p) !== stimmt || !istBruch(x) || !istBruch(p)) return null;
        const t = `${k} · ${T(e)} = ${T(kz(x))}`; if (roh.some(([q]) => q === t)) return null; roh.push([t, stimmt]); }
      return auswahl('Welche Gleichungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'gemischt-getrennt-mal')), h1('Überschlage zuerst mit den Ganzen. Rechne dann mit unechten Brüchen nach.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
  ]);

  // ================= V2: gemischte Zahlen vervielfachen, Sachaufgaben =================
  const tV2 = h3('Zähle alle gefärbten Teile. Aus vollen Kreisen werden Ganze.', `2 · ${br(3, 4)} = ${br(6, 4)}. Das ist ein Ganzes und ${br(2, 4)}, also ${T([3, 2])}.`, 'Nimm den Zähler mal. Schreibe das Ergebnis dann als gemischte Zahl.');
  sechs(V2, 'F', [
    () => { const { k, a, n, roh } = fach([3, 4, 5, 6, 8], [2, 3], (kk, x, p) => ueber1(kk, x, p));
      return luecken(Z(`Jeder Kreis zeigt ${B2(a)}.`, `Es sind ${k} Kreise.`, `${k} · ${B2(a)} = {{a}}⁄${n}`), { a: [roh[0], fehlerliste(roh[0], [[a[0] + k, '1x1-addiert'], [a[0], 'sach-schritt-vergessen']])] }, tV2,
        { bild: mehrmals(kreis, k, a), nachweis: [`${k} · ${B2(a)} = ${B2(roh)}`] }); },
    () => { const k = 3, a = [1, 2], p = [3, 2], kn = kind(), was = wahl(['Saft', 'Wasser', 'Tee', 'Kakao']);
      return auswahl(Z(`${kn} trinkt ${k} Gläser ${was}.`, `In jedem Glas ist ${B2(a)} l.`, `Wie viel ${was} ist das zusammen?`), optionen(p, [[[3, 6], 'bruch-mal-nenner-mit'], [[4, 2], '1x1-addiert']]).map((o) => ({ ...o, text: `${o.text} l` })),
        h3('Jedes Glas ist gleich voll. Zwei halbe Liter sind ein ganzer Liter.', `2 Gläser mit je ${br(1, 2)} l sind 2 · ${br(1, 2)} l = 1 l.`, `Rechne ${k} · ${B2(a)}. Schreibe als gemischte Zahl.`),
        { bild: mehrmals(streifen, k, a), nachweis: [`${k} · ${B2(a)} l = ${T(p)} l`, WERT(`${T(p)} l`, false)] }); },
    () => { const { k, a, p } = fach([3, 4, 5], [2, 3], (kk, x, pp) => ueber1(kk, x, pp) && ggt(kk * x[0], x[1]) === 1), kn = kind();
      return rechneB(Z(`Ein Schritt von ${kn} ist ${B2(a)} m lang.`, `${kn} macht ${k} Schritte.`, `Wie weit kommt ${kn}?`), p, [[[k * a[0], k * a[1]], 'bruch-mal-nenner-mit'], [[a[0] + k, a[1]], '1x1-addiert']],
        h3('Jeder Schritt ist gleich lang. Nimm den Bruch so oft, wie es Schritte gibt.', `3 Schritte mit je ${br(1, 2)} m sind 3 · ${br(1, 2)} m = ${br(3, 2)} m = ${T([3, 2])} m.`, `Rechne ${k} · ${B2(a)}. Schreibe als gemischte Zahl.`), [`${k} · ${B2(a)} m = ${T(p)} m`], { einheit: 'm', bild: mehrmals(streifen, k, a) }); },
    () => { const { k, a, p } = fach([3, 4, 5, 6], [2, 3], (kk, x, pp) => ueber1(kk, x, pp) && ggt(kk * x[0], x[1]) === 1);
      return rechneB(Z(`Jeder Kreis zeigt ${B2(a)}.`, `Rechne ${k} · ${B2(a)}.`, 'Schreibe das Ergebnis als gemischte Zahl.'), p, [[[k * a[0], k * a[1]], 'bruch-mal-nenner-mit'], [[a[0] + k, a[1]], '1x1-addiert']], tV2, [`${k} · ${B2(a)} = ${T(p)}`], { bild: mehrmals(kreis, k, a) }); },
    () => { const { k, a, p } = fach([4, 8], [3], (kk, x, pp) => ueber1(kk, x, pp) && ggt(kk * x[0], x[1]) === 1);
      return rechneB(Z(`Jedes Kind isst ${B2(a)} Pizza.`, `Es sind ${k} Kinder.`, 'Wie viel Pizza essen sie zusammen?'), p, [[[k * a[0], k * a[1]], 'bruch-mal-nenner-mit'], [[a[0] + k, a[1]], '1x1-addiert']],
        h3('Jedes Kind isst gleich viel. Nimm den Bruch so oft, wie es Kinder gibt.', `3 Kinder essen je ${br(1, 2)} Pizza. Das sind 3 · ${br(1, 2)} = ${br(3, 2)} = ${T([3, 2])} Pizzen.`, `Rechne ${k} · ${B2(a)}. Schreibe als gemischte Zahl.`), [`${k} · ${B2(a)} = ${T(p)}`], { bild: mehrmals(kreis, k, a) }); },
    () => { const [a, k] = wahl([[[1, 2], 2], [[1, 3], 3], [[2, 3], 3], [[1, 2], 4], [[3, 4], 4], [[1, 4], 4]]), e = (k * a[0]) / a[1];
      if (k > 3) return null;
      return zahl(Z(`Jeder Kreis zeigt ${B2(a)}.`, `Rechne ${k} · ${B2(a)}.`, 'Das Ergebnis ist eine natürliche Zahl.'), e, fehlerliste(e, [[k * a[0], 'sach-schritt-vergessen'], [a[1], 'sach-frage-verfehlt']]),
        h3('Zähle alle gefärbten Teile. Wie viele ganze Kreise kannst du damit füllen?', `2 · ${br(1, 2)} = ${br(2, 2)} = 1. Zwei Halbe sind ein Ganzes.`, `Das Ergebnis heißt zuerst ${br(k * a[0], a[1])}. Rechne ${k * a[0]} : ${a[1]}.`), { bild: mehrmals(kreis, k, a), nachweis: [`${k} · ${B2(a)} = ${e}`] }); },
  ]);
  const tV2G = h3('Nimm den Bruch so oft, wie die Aufgabe sagt. Kürze am Ende.', `5 Runden mit je ${br(3, 4)} km sind 5 · ${br(3, 4)} km = ${br(15, 4)} km = ${T([15, 4])} km.`, 'Nimm nur den Zähler mal. Schreibe das Ergebnis als gemischte Zahl.');
  sechs(V2, 'G', [
    () => { const { k, a, p } = fach([4, 5, 8], [2, 3], (kk, x, pp) => ueber1(kk, x, pp) && x[0] > 1), kn = kind();
      return rechneB(Z(`Eine Runde im Park ist ${B2(a)} km lang.`, `${kn} läuft ${k} Runden.`, 'Wie viele Kilometer sind das?', 'Kürze das Ergebnis vollständig.'), p, [[[k * a[0], k * a[1]], 'bruch-mal-nenner-mit'], [[a[0] + k, a[1]], '1x1-addiert']], tV2G, [`${k} · ${B2(a)} km = ${T(p)} km`], { einheit: 'km', bild: mehrmals(streifen, k, a) }); },
    () => { const { k, a, p } = fach([4, 6, 8, 9, 10], [2, 3], (kk, x, pp) => ueber1(kk, x, pp) && ggt(kk * x[0], x[1]) > 1);
      return rechneB(Z(`Jeder Kreis zeigt ${B2(a)}.`, `Rechne ${k} · ${B2(a)}.`, 'Kürze das Ergebnis vollständig.'), p, [[[k * a[0], k * a[1]], 'bruch-mal-nenner-mit'], [[k * a[0] - a[1], a[1] - 1], 'gemischt-umwandeln']], tV2G, [`${k} · ${B2(a)} = ${T(p)}`], { bild: mehrmals(kreis, k, a) }); },
    () => { const { k, a, p } = fach([10, 20], [2, 3, 4, 5, 6], (kk, x) => unter1(kk, x) && x[0] > 1), kn = kind(), was = wahl(['Spielen', 'Videoschauen', 'Musikhören']);
      return rechneB(Z(`Eine Stunde ${was} verbraucht ${B2(a)} vom Akku.`, `${kn} nutzt das Handy so ${k} Stunden lang.`, 'Welcher Bruchteil vom Akku ist dann verbraucht?', 'Kürze das Ergebnis vollständig.'), p, [[[k * a[0], k * a[1]], 'bruch-mal-nenner-mit'], [[a[1] - k * a[0], a[1]], 'sach-frage-verfehlt']],
        h3('In jeder Stunde wird gleich viel verbraucht. Nimm den Bruch mal die Stunden.', `Eine Stunde verbraucht ${br(1, 10)}. In 3 Stunden sind es 3 · ${br(1, 10)} = ${br(3, 10)}.`, `Rechne ${k} · ${B2(a)}. Kürze dann.`), [`${k} · ${B2(a)} = ${T(p)}`]); },
    () => { const { k, a, p } = fach([4, 5, 8, 10], [3, 4, 5, 6], (kk, x, pp) => ueber1(kk, x, pp)), kn = kind(), [ding, zutat] = wahl([['einen Kuchen', 'Mehl'], ['ein Brot', 'Mehl'], ['einen Topf Suppe', 'Kartoffeln'], ['ein Blech Kekse', 'Zucker']]);
      return rechneB(Z(`Für ${ding} braucht man ${B2(a)} kg ${zutat}.`, `${kn} macht davon die ${k}-fache Menge.`, `Wie viel ${zutat} braucht ${kn}?`, 'Kürze das Ergebnis vollständig.'), p, [[[k * a[0], k * a[1]], 'bruch-mal-nenner-mit'], [[a[0] + k, a[1]], '1x1-addiert']], tV2G, [`${k} · ${B2(a)} kg = ${T(p)} kg`], { einheit: 'kg' }); },
    () => { const { k, a, p } = fach([4, 5, 8, 10], [3, 4, 5, 6, 7], (kk, x, pp) => ueber1(kk, x, pp)), g = Math.floor(p[0] / p[1]) + wahl([0, 1]), kn = kind();
      return auswahl(Z(`Für eine Schleife braucht ${kn} ${B2(a)} m Band.`, `${kn} bindet ${k} Schleifen.`, `Das Band ist ${g} m lang.`, `Welches Zeichen passt? ${k} · ${B2(a)} m ▢ ${g} m`), ZEICHEN(p[0] - g * p[1], 'bruch-mal-nenner-mit'),
        h3('Rechne zuerst aus, wie viel Band alle Schleifen brauchen.', `4 Schleifen mit je ${br(3, 8)} m brauchen 4 · ${br(3, 8)} m = ${br(12, 8)} m = ${T([3, 2])} m. Das ist weniger als 2 m.`, `Rechne ${k} · ${B2(a)}. Vergleiche das Ergebnis mit ${g}.`), { nachweis: [VGL(`${k} · ${B2(a)} m`, `${g} m`)] }); },
    () => { const e = gz([1, 2], [2, 3, 4]), k = wahl([2, 3]), n = e[1], g = Math.floor(e[0] / n), richtig = [k * e[0], n], falle = [k * g * n + (e[0] % n), n], kn = kind(), stimmt = wahl([true, false, false]), gl = (x) => `${k} · ${T(e)} = ${T(kz(x))}`;
      if (!istBruch(kz(richtig)) || g > 2) return null;
      return urteil(Z(`Das Bild zeigt ${T(e)}.`, `${kn} rechnet: ${gl(stimmt ? richtig : falle)}`, 'Stimmt das?'), stimmt, gl(stimmt ? richtig : falle), gl(stimmt ? falle : richtig), [gl([k * e[0] + n, n])], 'gemischt-getrennt-mal',
        h3('Auch der Bruch hinter den Ganzen wird malgenommen.', `2 · ${T([3, 2])} = 2 · ${br(3, 2)} = ${br(6, 2)} = 3.`, `Schreibe ${T(e)} als ${B2(e)}. Nimm dann den Zähler mal ${k}.`), { bild: bild(kreise(e)) }); },
  ]);
  sechs(V2, 'M', [
    () => { const e = gz([1, 2, 3, 4], [4, 6, 8, 9, 10, 12]), k = wahl([4, 6, 8, 9]), p = mal(ganz(k), e), g = Math.floor(e[0] / e[1]);
      if (!istBruch(p) || ggt(k, e[1]) === 1) return null;
      return rechneB(`Berechne ${k} · ${T(e)} und kürze vollständig.`, p, [[[k * g * e[1] + (e[0] % e[1]), e[1]], 'gemischt-getrennt-mal'], [[k * e[0], k * e[1]], 'bruch-mal-nenner-mit']],
        h2('Wandle die gemischte Zahl zuerst in einen Bruch um.', `${T(e)} = ${B2(e)}. Kürze ${k} mit dem Nenner ${e[1]}, bevor du multiplizierst.`), [`${k} · ${T(e)} = ${T(p)}`]); },
    () => { const e = gz([2, 3, 4], [2, 3, 4, 6]), k = zz(3, 7), p = mal(ganz(k), e), kn = kind(), g = Math.floor(e[0] / e[1]);
      if (!istBruch(p)) return null;
      return rechneB(`Ein Lied dauert ${T(e)} min. ${kn} hört es ${k}-mal hintereinander. Wie viele Minuten sind das? Kürze vollständig.`, p, [[[k * g * e[1] + (e[0] % e[1]), e[1]], 'gemischt-getrennt-mal'], [[e[0] + k * e[1], e[1]], '1x1-addiert']],
        h2('Multipliziere die Dauer mit der Anzahl. Wandle vorher in einen Bruch um.', `${T(e)} = ${B2(e)}. Rechne ${k} · ${B2(e)} und schreibe das Ergebnis als gemischte Zahl.`), [`${k} · ${T(e)} min = ${T(p)} min`], { einheit: 'min' }); },
    () => { const n = wahl([4, 8, 10]), a = echt([n]), c = echt([n]), k = zz(3, 7), p = mal(ganz(k), [a[0] + c[0], n]);
      if (a[0] === c[0] || !istBruch(p) || a[0] + c[0] >= n) return null;
      return rechneB(`Für eine Portion Pfannkuchen braucht man ${B2(a)} l Milch und ${B2(c)} l Wasser. Wie viel Flüssigkeit braucht man für ${k} Portionen? Kürze vollständig.`, p, [[mal(ganz(k), a), 'sach-schritt-vergessen'], [[a[0] + c[0], n], 'sach-schritt-vergessen'], [[k * (a[0] + c[0]), k * n], 'bruch-mal-nenner-mit']],
        h2('Berechne zuerst die Flüssigkeit für eine Portion.', `Eine Portion braucht ${B2(a)} l + ${B2(c)} l = ${br(a[0] + c[0], n)} l. Multipliziere das mit ${k}.`), [`${k} · (${B2(a)} l + ${B2(c)} l) = ${T(p)} l`], { einheit: 'l' }); },
    () => { const e = gz([1, 2, 3], [3, 5, 6, 8, 10, 12]), k = wahl([3, 4, 5, 6]), p = mal(ganz(k), e), g = Math.floor(e[0] / e[1]);
      if (!istBruch(p)) return null;
      return rechneB(`Berechne das ${k}-Fache von ${T(e)} und kürze vollständig.`, p, [[[k * g * e[1] + (e[0] % e[1]), e[1]], 'gemischt-getrennt-mal'], [[e[0] + k * e[1], e[1]], '1x1-addiert']],
        h2(`Das ${k}-Fache bedeutet: mal ${k}.`, `${T(e)} = ${B2(e)}. Multipliziere den Zähler mit ${k} und kürze.`), [`${k} · ${T(e)} = ${T(p)}`]); },
    () => { const e = gz([1, 2], [2, 4, 5, 10]), k = zz(3, 6), p = mal(ganz(k), e), g = Math.floor(p[0] / p[1]) + wahl([0, 1]);
      if (!istBruch(p)) return null;
      return auswahl(`Ein Kanister fasst ${g} l. Es werden ${k} Flaschen mit je ${T(e)} l hineingegossen. Welches Zeichen passt? ${k} · ${T(e)} l ▢ ${g} l`, ZEICHEN(p[0] - g * p[1], 'gemischt-getrennt-mal'),
        h2('Berechne zuerst, wie viel in allen Flaschen zusammen ist.', `${k} · ${T(e)} = ${k} · ${B2(e)}. Vergleiche das Ergebnis mit ${g}.`), { nachweis: [VGL(`${k} · ${T(e)} l`, `${g} l`)] }); },
    () => { const e = gz([2, 3], [5, 7, 8, 9]), k = zz(3, 5), g = Math.floor(e[0] / e[1]), kn = kind();
      return auswahl(`${kn} rechnet ${k} · ${T(e)} = ${T([k * g * e[1] + (e[0] % e[1]), e[1]])}. Welchen Fehler macht ${kn}?`, [opt('Nur die Ganzen werden multipliziert, der Bruch dahinter nicht.', true), opt('Der Nenner hätte auch multipliziert werden müssen.', false, 'bruch-mal-nenner-mit'), opt('Das Ergebnis ist richtig, es ist nur nicht gekürzt.', false, 'gemischt-getrennt-mal'), opt('Die Ganzen hätten addiert werden müssen.', false, '1x1-addiert')],
        h2('Eine gemischte Zahl besteht aus Ganzen und einem Bruch. Beide Teile werden vervielfacht.', `${T(e)} ist dasselbe wie ${g} + ${br(e[0] % e[1], e[1])}. Auch ${br(e[0] % e[1], e[1])} muss mit ${k} multipliziert werden.`), { nachweis: [FREI('Fehleranalyse: gemischte Zahl getrennt multipliziert')] }); },
  ]);
  sechs(V2, 'E', [
    () => { const e = gz([3, 4, 5, 6], [12, 15, 16, 18, 20, 24]), k = wahl([6, 8, 9, 10, 12, 15]), p = mal(ganz(k), e), g = Math.floor(e[0] / e[1]);
      if (!istBruch(p) || ggt(k, e[1]) === 1) return null;
      return rechneB(`Berechne ${k} · ${T(e)} und kürze vollständig.`, p, [[[k * g * e[1] + (e[0] % e[1]), e[1]], 'gemischt-getrennt-mal'], [[k * e[0], k * e[1]], 'bruch-mal-nenner-mit']],
        h1('Kürze vor dem Multiplizieren. Du kannst auch die Ganzen und den Bruch einzeln vervielfachen und dann addieren.'), [`${k} · ${T(e)} = ${T(p)}`]); },
    () => { const e = gz([1], [4, 8]), [wer, was] = wahl([['Ein Zug', 'fährt'], ['Ein Radfahrer', 'fährt'], ['Ein Auto', 'fährt auf der Autobahn']]), f = wer === 'Ein Radfahrer' ? [e[0], e[1] * 4] : e, pp = mal(ganz(15), f);
      if (!istBruch(pp)) return null;
      return rechneB(`${wer} ${was} in jeder Minute ${T(f)} km. Wie viele Kilometer sind das in einer Viertelstunde? Kürze vollständig.`, pp, [[mal(ganz(4), f), 'sach-falsche-rechnung'], [mal(ganz(60), f), 'sach-frage-verfehlt']],
        h1('Überlege zuerst, wie viele Minuten eine Viertelstunde hat.'), [{ wert: '15', grund: 'Eine Viertelstunde hat 15 Minuten' }, `15 · ${T(f)} km = ${T(pp)} km`], { einheit: 'km' }); },
    () => { const e = gz([1, 2, 3], [4, 6, 8, 9, 12]), k = zz(4, 9), p = mal(ganz(k), e);
      if (!istBruch(p) || p[1] === e[1]) return null;
      return luecken(`Welcher Faktor fehlt? {{a}} · ${T(e)} = ${T(p)}`, { a: [k, fehlerliste(k, [[Math.floor(p[0] / p[1]) - Math.floor(e[0] / e[1]), '1x1-addiert'], [Math.floor(p[0] / p[1] / Math.floor(e[0] / e[1])), 'gemischt-getrennt-mal'], [k + 1, 'sach-schritt-vergessen']])] },
        h1('Wandle beide gemischten Zahlen in Brüche mit demselben Nenner um. Vergleiche dann die Zähler.'), { nachweis: [`${T(p)} : ${T(e)} = ${k}`] }); },
    () => auswahl('Eine gemischte Zahl wird mit einer natürlichen Zahl multipliziert. Du multiplizierst die Ganzen und den Bruch einzeln und addierst die Ergebnisse. Warum ist das erlaubt?', mische([opt('Eine gemischte Zahl ist eine Summe, und jeder Summand wird multipliziert.', true), opt('Das ist nicht erlaubt, man muss immer zuerst in einen Bruch umwandeln.', false, 'gemischt-getrennt-mal'), opt('Weil die Ganzen und der Bruch nichts miteinander zu tun haben.', false, 'gemischt-getrennt-mal'), opt('Weil beim Multiplizieren der Nenner unverändert bleibt.', false, 'bruch-mal-nenner-mit'), opt('Das gilt nur, wenn der Bruch den Zähler 1 hat.', false, 'gemischt-getrennt-mal')]),
      h1('Schreibe die gemischte Zahl als Summe aus Ganzen und Bruch. Welches Rechengesetz kennst du für eine Zahl mal eine Summe?'), { nachweis: [FREI('Verteilungsgesetz bei gemischten Zahlen')] }),
    () => { const a = gz([0, 1], [2, 4]), c = gz([1], [4, 2, 5]), ka = zz(4, 8), kc = zz(3, 6), pa = mal(ganz(ka), a), pc = mal(ganz(kc), c);
      if (!(a[0] < a[1]) || gleich(pa, pc)) return null;
      const d = pa[0] * pc[1] - pc[0] * pa[1], diff = kz([Math.abs(d), pa[1] * pc[1]]);
      if (!istBruch(diff)) return null;
      return rechneB(`Paket A enthält ${ka} Flaschen mit je ${T(a)} l. Paket B enthält ${kc} Flaschen mit je ${T(c)} l. Wie viele Liter enthält das vollere Paket mehr als das andere? Kürze vollständig.`, diff, [[plus(pa, pc), 'sach-falsche-rechnung'], [d > 0 ? pa : pc, 'sach-schritt-vergessen'], [d > 0 ? pc : pa, 'sach-schritt-vergessen']],
        h1('Berechne den Inhalt beider Pakete und bilde dann die Differenz.'), [`${ka} · ${T(a)} l = ${T(pa)} l`, `${kc} · ${T(c)} l = ${T(pc)} l`, d > 0 ? `${T(pa)} l − ${T(pc)} l = ${T(diff)} l` : `${T(pc)} l − ${T(pa)} l = ${T(diff)} l`], { einheit: 'l' }); },
    () => { const roh = [];
      for (let i = 0; i < 5; i++) { const e = gz([2, 3, 4], [6, 8, 9, 12, 15]), k = wahl([4, 6, 8, 9, 10]), p = mal(ganz(k), e), g = Math.floor(e[0] / e[1]), stimmt = i < 2 ? i === 0 : wahl([true, false]);
        const x = stimmt ? p : wahl([[k * g * e[1] + (e[0] % e[1]), e[1]], [p[0] + p[1], p[1]], [p[0] - p[1], p[1]]]);
        if (gleich(x, p) !== stimmt || !istBruch(x) || !istBruch(p)) return null;
        const t = `${k} · ${T(e)} = ${T(kz(x))}`; if (roh.some(([q]) => q === t)) return null; roh.push([t, stimmt]); }
      return auswahl('Welche Gleichungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'gemischt-getrennt-mal')), h1('Überschlage zuerst mit den Ganzen. Rechne dann genau nach und kürze.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
  ]);
}
