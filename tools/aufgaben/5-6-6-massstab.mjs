// Aufgaben zu 5.6.6 „Maßstab“ (Lernziele K1 und K2) nach ADR 0015 und ADR 0033.
// K1: von der Karte zur Wirklichkeit. K2: von der Wirklichkeit zur Karte und den Maßstab bestimmen.
// F: Maßstabsleiste (1 cm auf der Karte sind 100 m). G: 1:100 und 1:1000. M: 1:25 000 und 1:50 000. E: Maßstab bestimmen, Ausblick 10:1.
// Nur Verkleinerungen. Auf K2 sind auf M und E je zwei Aufgaben Heftaufgaben mit Kontrollwert.

import { fz, sechs, zahl, auswahl, opt, luecken, sach, teil, zuordnen, groesse, Z, B, G, BG, h1, h2, h3, zz, wahl, mische, fehlerliste, kind, HILFSGROESSE } from '../werkzeug.mjs';
import { gr, FAKTOR, zweiOrte, dreiOrte } from './5-6-groessen.mjs';

const S_ = (kurz) => `5.6.6-${kurz}`;
const CM = FAKTOR.cm, M = FAKTOR.m, KM = FAKTOR.km;
const E_L = ['mm', 'cm', 'm', 'km'];
// Maßstabsleisten für F: 1 cm auf der Karte sind …
const LEISTEN = [['100 m', 100 * M], ['50 m', 50 * M], ['10 m', 10 * M], ['1 km', KM], ['200 m', 200 * M]];
const VON = { Burg: 'von der Burg', Dorf: 'vom Dorf', Mühle: 'von der Mühle', Hafen: 'vom Hafen', Wald: 'vom Wald', Turm: 'vom Turm', Brücke: 'von der Brücke' };
const ZU = { Burg: 'zur Burg', Dorf: 'zum Dorf', Mühle: 'zur Mühle', Hafen: 'zum Hafen', Wald: 'zum Wald', Turm: 'zum Turm', Brücke: 'zur Brücke' };
const gross = (t) => t[0].toUpperCase() + t.slice(1);
const H_LEISTE = h3('Die Leiste zeigt: So viel ist 1 cm auf der Karte in Wirklichkeit.', '3 cm auf der Karte sind 3 · 100 m = 300 m.', 'Miss die Strecke in cm. Rechne dann für jeden cm einmal die Länge der Leiste.');
// Zwei Schritte auf F: Wie oft passt 1 cm hinein, dann mal die Länge der Leiste.
const hoch = (cm, je, teilNr) => [G(`${cm} cm : 1 cm = ${cm}`), G(`${cm} · ${gr(je, je % KM === 0 ? 'km' : 'm')} = ${gr(cm * je, je % KM === 0 ? 'km' : 'm')}`, teilNr)];
const zimmer = () => wahl(['Zimmer', 'Klassenraum', 'Garten', 'Stall', 'Saal']);
const massstabTabelle = (...zeilen) => ({ kopf: ['Maßstab', '1 cm im Plan sind in Wirklichkeit'], zeilen });
const leisteTabelle = (je, e) => ({ kopf: ['Auf der Karte', 'In Wirklichkeit'], zeilen: [1, 2, 3].map((n) => [`${n} cm`, gr(n * je, e)]) });
const mOpt = (n) => `1:${fz(n)}`;

export function massstab() {
  // =====================================================================
  // K1 Von der Karte zur Wirklichkeit
  // =====================================================================
  sechs(S_('K1'), 'F', [
    () => { const [o1, o2] = zweiOrte(), a = zz(1, 3) * 10, d = zz(3, 7), [lt, je] = wahl(LEISTEN.slice(0, 3)), e = 'm';
      return zahl(Z('Schau auf die Karte.', `1 cm auf der Karte sind ${lt} in Wirklichkeit.`, `Wie weit ist es ${VON[o1[0]]} bis ${ZU[o2[0]]}?`), (d * je) / M, fehlerliste((d * je) / M, [[d, 'massstab-einheit'], [d + je / M, 'masszahlen-addiert'], [((a / 10 + d) * je) / M, 'liste-verzaehlt']]), H_LEISTE,
        { einheit: e, bild: B.karte([[o1[0], a, o1[1]], [o2[0], a + d * 10, o2[1]]], { lang: 100, leiste: [10, lt] }), nachweis: [BG(`${d} cm`), ...hoch(d, je)] }); },
    () => { const [o1, o2] = zweiOrte(), a = zz(0, 2) * 10, d = zz(4, 8), [lt, je] = wahl(LEISTEN.slice(0, 2));
      return luecken(Z('Schau auf die Karte.', `1 cm auf der Karte sind ${lt} in Wirklichkeit.`, `${gross(VON[o1[0]])} bis ${ZU[o2[0]]} sind es auf der Karte {{a}} cm.`, 'In Wirklichkeit sind das {{b}} m.'), { a: [d, fehlerliste(d, [[a / 10 + d, 'liste-verzaehlt']])], b: [(d * je) / M, fehlerliste((d * je) / M, [[d, 'massstab-einheit']])] }, H_LEISTE,
        { bild: B.karte([[o1[0], a, o1[1]], [o2[0], a + d * 10, o2[1]]], { lang: 100, leiste: [10, lt] }), nachweis: [BG(`${d} cm`), ...hoch(d, je)] }); },
    () => { const [o1, o2] = zweiOrte(), a = zz(1, 2) * 10, d = zz(3, 8);
      return zahl(Z('Schau auf die Karte.', '1 cm auf der Karte ist 1 km in Wirklichkeit.', `Wie weit ist es ${VON[o1[0]]} bis ${ZU[o2[0]]}?`), d, fehlerliste(d, [[a / 10 + d, 'liste-verzaehlt'], [d * 10, 'umrechnungszahl']]), h3('Jeder cm auf der Karte ist 1 km in Wirklichkeit.', '4 cm auf der Karte sind 4 km.', 'Miss die Strecke zwischen den beiden Orten in cm.'),
        { einheit: 'km', bild: B.karte([[o1[0], a, o1[1]], [o2[0], a + d * 10, o2[1]]], { lang: 110, leiste: [10, '1 km'] }), nachweis: [BG(`${d} cm`), ...hoch(d, KM)] }); },
    () => { const b = zz(4, 8), h = zz(2, b - 1), name = zimmer();
      return zahl(Z('Schau auf den Plan.', '1 cm im Plan ist 1 m in Wirklichkeit.', `Wie lang ist der ${name === 'Zimmer' ? 'Raum' : name} in Wirklichkeit?`.replace('der Raum', 'das Zimmer')), b, fehlerliste(b, [[h, 'sach-frage-verfehlt'], [b * 100, 'umrechnungszahl']]), h3('Jeder cm im Plan ist 1 m in Wirklichkeit.', '5 cm im Plan sind 5 m.', 'Lies die lange Seite im Plan ab.'),
        { einheit: 'm', bild: B.grundriss(name, b * 10, h * 10, { leiste: [10, '1 m'] }), nachweis: [BG(`${b} cm`), G(`${b} cm : 1 cm = ${b}`), G(`${b} · 1 m = ${b} m`), HILFSGROESSE(`${h} cm`, 'die kurze Seite im Plan')] }); },
    () => { const [o1, o2, o3] = dreiOrte(), a = zz(0, 1) * 10, d1 = zz(2, 4), d2 = zz(2, 4), [lt, je] = wahl(LEISTEN.slice(0, 2));
      return sach(Z('Schau auf die Karte.', `1 cm auf der Karte sind ${lt} in Wirklichkeit.`, `Der Weg führt ${VON[o1[0]]} über ${o2[0] === 'Burg' || o2[0] === 'Mühle' || o2[0] === 'Brücke' ? 'die' : o2[0] === 'Dorf' ? 'das' : 'den'} ${o2[0]} bis ${ZU[o3[0]]}.`), [teil('Wie viele cm ist der ganze Weg auf der Karte lang?', d1 + d2, 'cm', fehlerliste(d1 + d2, [[d1, 'sach-schritt-vergessen']])), teil('Wie viele m sind das in Wirklichkeit?', ((d1 + d2) * je) / M, 'm', fehlerliste(((d1 + d2) * je) / M, [[d1 + d2, 'massstab-einheit']]))], H_LEISTE,
        { bild: B.karte([[o1[0], a, o1[1]], [o2[0], a + d1 * 10, o2[1]], [o3[0], a + (d1 + d2) * 10, o3[1]]], { lang: 100, leiste: [10, lt] }), nachweis: [BG(`${d1 + d2} cm`, 1), G(`${d1 + d2} cm : 1 cm = ${d1 + d2}`), G(`${d1 + d2} · ${lt} = ${((d1 + d2) * je) / M} m`, 2)] }); },
    () => { const [o1, o2] = zweiOrte(), a = zz(1, 2) * 10, d = zz(3, 7), je = 100 * M;
      return auswahl(Z('Schau auf die Karte.', '1 cm auf der Karte sind 100 m in Wirklichkeit.', `Wie weit ist es ${VON[o1[0]]} bis ${ZU[o2[0]]}?`), [opt(`${d * 100} m`, true), opt(`${d} m`, false, 'massstab-einheit'), opt(`${100 + d} m`, false, 'masszahlen-addiert')], H_LEISTE,
        { bild: B.karte([[o1[0], a, o1[1]], [o2[0], a + d * 10, o2[1]]], { lang: 100, leiste: [10, '100 m'] }), nachweis: [BG(`${d} cm`), ...hoch(d, je)] }); },
  ]);
  const H_100 = h3('Maßstab 1:100 heißt: 1 cm im Plan sind 100 cm in Wirklichkeit.', '3 cm im Plan sind 3 cm · 100 = 300 cm. Das sind 3 m.', 'Rechne die Länge im Plan mal 100. Wandle dann in m um.');
  const H_1000 = h3('Maßstab 1:1000 heißt: 1 cm auf der Karte sind 1000 cm in Wirklichkeit.', '3 cm auf der Karte sind 3 cm · 1000 = 3000 cm. Das sind 30 m.', 'Rechne die Länge auf der Karte mal 1000. Wandle dann in m um.');
  sechs(S_('K1'), 'G', [
    () => { const b = zz(4, 9), h = zz(2, b - 1), name = zimmer();
      return zahl(Z('Schau auf den Plan.', 'Der Plan hat den Maßstab 1:100.', 'Wie viele m ist die lange Seite in Wirklichkeit?'), b, fehlerliste(b, [[b * 100, 'massstab-einheit'], [h, 'sach-frage-verfehlt']]), H_100,
        { einheit: 'm', bild: B.grundriss(name, b * 10, h * 10, { massstab: 100 }), nachweis: [G(`${b} cm · 100 = ${b} m`), HILFSGROESSE(`${h} cm`, 'die kurze Seite im Plan')] }); },
    () => { const n = zz(2, 9);
      return luecken(Z('Eine Karte hat den Maßstab 1:1000.', `${n} cm · 1000 = {{a}} cm = {{b}} m`), { a: [n * 1000, fehlerliste(n * 1000, [[n * 100, 'umrechnungszahl']])], b: [n * 10, fehlerliste(n * 10, [[n * 100, 'umrechnungszahl'], [n, 'umrechnungszahl']])] }, H_1000,
        { daten: massstabTabelle(['1:100', '1 m'], ['1:1000', '10 m']), nachweis: [G(`${n} cm · 1000 = ${fz(n * 1000)} cm = ${n * 10} m`)] }); },
    () => { const [o1, o2] = zweiOrte(), a = zz(0, 2) * 10, d = zz(3, 8);
      return zahl(Z('Schau auf die Karte.', 'Die Karte hat den Maßstab 1:1000.', `Wie viele m sind es ${VON[o1[0]]} bis ${ZU[o2[0]]}?`), d * 10, fehlerliste(d * 10, [[d * 1000, 'massstab-einheit'], [d * 100, 'umrechnungszahl'], [d, 'umrechnungszahl']]), H_1000,
        { einheit: 'm', bild: B.karte([[o1[0], a, o1[1]], [o2[0], a + d * 10, o2[1]]], { lang: 100, massstab: 1000 }), nachweis: [BG(`${d} cm`), G(`${d} cm · 1000 = ${d * 10} m`)] }); },
    () => { const mm = zz(6, 12), was = wahl(['Eine Tür', 'Ein Fenster', 'Ein Schrank']);
      return zahl(Z('Ein Plan hat den Maßstab 1:100.', `${was} ist im Plan ${mm} mm breit.`, 'Wie viele cm sind das in Wirklichkeit?'), mm * 10, fehlerliste(mm * 10, [[mm * 100, 'massstab-einheit'], [mm, 'umrechnungszahl']]), h3('Rechne die Länge im Plan mal 100.', '5 mm · 100 = 500 mm. Das sind 50 cm.', 'Rechne erst in mm. Wandle dann in cm um.'), { einheit: 'cm', nachweis: [G(`${mm} mm · 100 = ${mm * 10} cm`)] }); },
    () => { const b = zz(5, 9), h = zz(3, b - 1), name = zimmer();
      return sach(Z('Schau auf den Plan.', 'Der Plan hat den Maßstab 1:100.'), [teil('Wie viele m ist die lange Seite in Wirklichkeit?', b, 'm', fehlerliste(b, [[b * 100, 'massstab-einheit']])), teil('Wie viele m ist die kurze Seite in Wirklichkeit?', h, 'm', fehlerliste(h, [[h * 100, 'massstab-einheit']]))], H_100,
        { bild: B.grundriss(name, b * 10, h * 10, { massstab: 100 }), nachweis: [G(`${b} cm · 100 = ${b} m`, 1), G(`${h} cm · 100 = ${h} m`, 2)] }); },
    () => { const n = zz(2, 9), stimmt = wahl([true, false, false]), behauptet = stimmt ? n * 10 : wahl([n, n * 100]), kn = kind();
      return auswahl(Z('Eine Karte hat den Maßstab 1:1000.', `${kn} sagt: ${n} cm auf der Karte sind ${behauptet} m in Wirklichkeit.`, 'Stimmt das?'), [opt('Stimmt.', stimmt), opt(`Falsch. Es sind ${stimmt ? n * 100 : n * 10} m.`, !stimmt, stimmt ? 'umrechnungszahl' : undefined), opt(`Falsch. Es sind ${stimmt ? n : behauptet === n ? n * 100 : n} m.`, false, 'umrechnungszahl')], H_1000,
        { nachweis: [G(`${n} cm · 1000 = ${n * 10} m`), { art: 'urteil', stimmt, behauptet: `${behauptet} m` }, HILFSGROESSE(`${n} m`, 'falsch umgewandelt'), HILFSGROESSE(`${n * 100} m`, 'falsch umgewandelt')] }); },
  ]);
  const H2_M = h2('Rechne die Länge auf der Karte mal die Maßstabszahl.', 'Wandle das Ergebnis aus cm erst in m und dann in km um.');
  sechs(S_('K1'), 'M', [
    () => { const n = wahl([2, 4, 6, 8, 10, 12]);
      return groesse(Z('Eine Wanderkarte hat den Maßstab 1:25 000.'.replace('25 000', fz(25000)), `Ein Weg ist auf der Karte ${n} cm lang.`, 'Wie lang ist der Weg in Wirklichkeit?'), 'laenge', n * 25000 * CM, 'km', [[n * 25000 * CM * 10, 'umrechnungszahl'], [n * 25000 * CM / 10, 'umrechnungszahl']], H2_M, { einheiten: E_L, nachweis: [G(`${n} cm · ${fz(25000)} = ${gr(n * 25000 * CM, 'km')}`)] }); },
    () => { const n = zz(3, 13);
      return groesse(Z(`Eine Karte hat den Maßstab 1:${fz(50000)}.`, `Zwei Orte liegen auf der Karte ${n} cm auseinander.`, 'Wie weit sind sie in Wirklichkeit voneinander entfernt?'), 'laenge', n * 50000 * CM, 'km', [[n * 50000 * CM * 10, 'umrechnungszahl'], [n * 50000 * CM / 10, 'umrechnungszahl']], H2_M, { einheiten: E_L, nachweis: [G(`${n} cm · ${fz(50000)} = ${gr(n * 50000 * CM, 'km')}`)] }); },
    () => { const [o1, o2, o3] = dreiOrte(), a = zz(0, 1) * 10, d1 = zz(2, 5), d2 = zz(2, 5), ms = wahl([25000, 50000]);
      return groesse(Z('Schau auf die Karte.', `Wie weit ist es in Wirklichkeit ${VON[o1[0]]} bis ${ZU[o3[0]]}?`), 'laenge', (d1 + d2) * ms * CM, 'km', [[d1 * ms * CM, 'sach-frage-verfehlt'], [d2 * ms * CM, 'sach-frage-verfehlt']], H2_M,
        { einheiten: E_L, bild: B.karte([[o1[0], a, o1[1]], [o2[0], a + d1 * 10, o2[1]], [o3[0], a + (d1 + d2) * 10, o3[1]]], { lang: 110, massstab: ms }), nachweis: [BG(`${d1 + d2} cm`), G(`${d1 + d2} cm · ${fz(ms)} = ${gr((d1 + d2) * ms * CM, 'km')}`)] }); },
    () => zuordnen(Z('Wie lang ist 1 cm auf der Karte in Wirklichkeit?', 'Ordne jedem Maßstab die passende Länge zu.'), mische([['1:100', '1 m'], ['1:1000', '10 m'], [mOpt(10000), '100 m'], [mOpt(25000), '250 m'], [mOpt(50000), '500 m']]).slice(0, 4), h2('Die Maßstabszahl sagt, wie viele cm in Wirklichkeit zu 1 cm auf der Karte gehören.', 'Wandle die cm in m um: 100 cm sind 1 m.'), {}),
    () => { const a = wahl([4, 6, 8, 10]), b = wahl([3, 5, 7, 9]), la = a * 25000 * CM, lb = b * 50000 * CM;
      if (la === lb) return null;
      return groesse(Z(`Auf einer Karte im Maßstab 1:${fz(25000)} ist der Weg zum See ${a} cm lang.`, `Auf einer Karte im Maßstab 1:${fz(50000)} ist der Weg zur Hütte ${b} cm lang.`, 'Um wie viel ist einer der Wege in Wirklichkeit länger als der andere?'), 'laenge', Math.abs(la - lb), 'km', [[Math.abs(a - b) * 25000 * CM, 'sach-schritt-vergessen'], [la + lb, 'sub-addiert']].filter(([x]) => x > 0 && x !== Math.abs(la - lb)),
        h2('Rechne beide Wege einzeln in die Wirklichkeit um.', 'Vergleiche erst danach. Die Karten haben verschiedene Maßstäbe.'), { einheiten: E_L, nachweis: [G(`${a} cm · ${fz(25000)} = ${gr(la, 'km')}`), G(`${b} cm · ${fz(50000)} = ${gr(lb, 'km')}`), G(`${gr(Math.max(la, lb), 'km')} − ${gr(Math.min(la, lb), 'km')} = ${gr(Math.abs(la - lb), 'km')}`)] }); },
    () => { const etappe = wahl([2, 3, 4]), n = zz(2, 4), cm = (n * etappe * KM) / (50000 * CM);
      return zahl(Z(`Eine Wanderung ist auf einer Karte im Maßstab 1:${fz(50000)} genau ${cm} cm lang.`, `Die Gruppe macht nach jeweils ${etappe} km eine Rast, auch am Ziel.`, 'Wie oft rastet die Gruppe?'), n, fehlerliste(n, [[n * 10, 'umrechnungszahl'], [cm / etappe, 'massstab-einheit']].filter(([x]) => Number.isInteger(x))), h2('Rechne zuerst aus, wie lang die Wanderung in Wirklichkeit ist.', 'Teile dann die ganze Strecke durch die Länge bis zur nächsten Rast.'), { einheit: 'mal', nachweis: [G(`${cm} cm · ${fz(50000)} = ${n * etappe} km`), G(`${n * etappe} km : ${etappe} km = ${n}`)] }); },
  ]);
  sechs(S_('K1'), 'E', [
    () => { const n = wahl([5, 7, 9, 11, 13, 15]), ms = 25000;
      return groesse(`Eine Karte hat den Maßstab 1:${fz(ms)}. Ein Radweg ist auf der Karte ${n} cm lang. Wie lang ist er in Wirklichkeit?`, 'laenge', n * ms * CM, 'km', [[n * ms * CM * 10, 'umrechnungszahl'], [n * ms * CM / 10, 'umrechnungszahl']], h1('Rechne mal die Maßstabszahl und wandle in eine passende Einheit um.'), { einheiten: E_L, nachweis: [G(`${n} cm · ${fz(ms)} = ${gr(n * ms * CM, 'km')}`)] }); },
    () => { const [cm, km, ms] = wahl([[4, 2, 50000], [8, 2, 25000], [6, 3, 50000], [12, 3, 25000], [5, 5, 100000], [3, 6, 200000], [10, 1, 10000]]);
      return auswahl(`Auf einer Karte sind zwei Orte ${cm} cm voneinander entfernt. In Wirklichkeit sind es ${km} km. Welchen Maßstab hat die Karte?`, [opt(mOpt(ms), true), opt(mOpt(ms / 10), false, 'umrechnungszahl'), opt(mOpt(ms * 10), false, 'umrechnungszahl'), opt(mOpt(ms * cm), false, 'sach-schritt-vergessen'), opt(`${fz(ms)}:1`, false, 'massstab-verkehrt')], h1('Wandle beide Längen in cm um. Wie viele cm in Wirklichkeit gehören zu 1 cm auf der Karte?'), { nachweis: [{ art: 'massstab', plan: `${cm} cm`, wirklich: `${km} km` }] }); },
    () => { const cm = zz(3, 9), tier = wahl(['eine Ameise', 'einen Floh', 'eine Milbe', 'einen Käfer']);
      return groesse(`Ein Bild zeigt ${tier} vergrößert im Maßstab 10:1. Auf dem Bild ist das Tier ${cm} cm lang. Wie lang ist es in Wirklichkeit?`, 'laenge', cm * CM / 10, 'mm', [[cm * CM * 10, 'massstab-verkehrt'], [cm * CM, 'sach-schritt-vergessen']], h1('Bei 10:1 ist das Bild 10-mal so groß wie das Tier. Du musst also teilen.'.replace('10-mal', 'zehnmal')), { einheiten: E_L, nachweis: [G(`${cm} cm : 10 = ${cm} mm`)] }); },
    () => { const km = wahl([2, 3, 4, 5]), cm50 = km * 2, cm25 = km * 4, stimmt = wahl([true, false, false]), behauptet = stimmt ? cm25 : wahl([km, cm50]), kn = kind();
      return auswahl(`Ein Weg von ${km} km ist auf einer Karte im Maßstab 1:${fz(50000)} genau ${cm50} cm lang. ${kn} behauptet: „Auf einer Karte im Maßstab 1:${fz(25000)} ist derselbe Weg ${behauptet} cm lang.“ Stimmt das?`, [opt('Stimmt, denn bei der kleineren Maßstabszahl wird alles größer gezeichnet.', stimmt), opt(`Falsch, denn der Weg ist dort ${stimmt ? km : cm25} cm lang.`, !stimmt, stimmt ? 'massstab-verkehrt' : undefined), opt('Stimmt, denn der Weg ist auf jeder Karte gleich lang.', false, 'massstab-verkehrt'), opt(`Falsch, denn der Weg ist dort ${cm25 * 10} cm lang.`, false, 'umrechnungszahl')],
        h1('Rechne die Länge für die zweite Karte aus: Wirklichkeit geteilt durch die Maßstabszahl.'), { nachweis: [G(`${km} km : ${fz(50000)} = ${cm50} cm`), G(`${km} km : ${fz(25000)} = ${cm25} cm`), { art: 'urteil', stimmt, behauptet: `${behauptet} cm` }, HILFSGROESSE(`${km} cm`, 'halbiert statt verdoppelt'), HILFSGROESSE(`${cm25 * 10} cm`, 'falsche Umrechnung')] }); },
    () => { const [mm, text, ms] = wahl([[20, '10 m', 500], [10, '2 m', 200], [20, '5 m', 250], [10, '5 m', 500], [20, '4 m', 200]]), b = zz(5, 9) * 10, h = zz(3, 4) * 10, name = zimmer();
      return auswahl(`Schau auf den Plan und auf die Maßstabsleiste. Welchen Maßstab hat der Plan?`, [opt(mOpt(ms), true), opt(mOpt(ms / 10), false, 'umrechnungszahl'), opt(mOpt(ms * 10), false, 'umrechnungszahl'), opt(mOpt(ms * (mm / 10) === ms ? ms * 2 : ms * (mm / 10)), false, 'sach-schritt-vergessen'), opt(`${ms}:1`, false, 'massstab-verkehrt')], h1('Miss die Leiste und wandle ihre Länge in Wirklichkeit in cm um. Teile dann.'),
        { bild: B.grundriss(name, b, h, { leiste: [mm, text] }), nachweis: [{ art: 'massstab', plan: `${mm / 10} cm`, wirklich: text }] }); },
    () => { const cm = wahl([4, 6, 8]), ms = 50000, cm2 = wahl([cm * 2, cm * 5]), ms2 = (ms * cm) / cm2;
      return auswahl(`Ein Weg ist auf einer Karte im Maßstab 1:${fz(ms)} genau ${cm} cm lang. Auf einer zweiten Karte ist derselbe Weg ${cm2} cm lang. Welchen Maßstab hat die zweite Karte?`, [opt(mOpt(ms2), true), opt(mOpt((ms * cm2) / cm), false, 'massstab-verkehrt'), opt(mOpt(ms), false, 'sach-schritt-vergessen'), opt(mOpt(ms2 / 10), false, 'umrechnungszahl'), opt(mOpt(ms2 * 10 === (ms * cm2) / cm ? ms2 * 100 : ms2 * 10), false, 'umrechnungszahl')], h1('Rechne zuerst aus, wie lang der Weg in Wirklichkeit ist. Bestimme dann den Maßstab der zweiten Karte.'),
        { nachweis: [G(`${cm} cm · ${fz(ms)} = ${gr(cm * ms * CM, 'km')}`), { art: 'massstab', plan: `${cm2} cm`, wirklich: gr(cm * ms * CM, 'km') }] }); },
  ]);

  // =====================================================================
  // K2 Von der Wirklichkeit zur Karte, Maßstab bestimmen
  // =====================================================================
  const H_RUECK = h3('Die Tabelle zeigt: So viel ist 1 cm auf der Karte in Wirklichkeit.', '300 m in Wirklichkeit sind 3 cm auf der Karte.', 'Wie oft passt die Länge für 1 cm in die ganze Strecke?');
  const runter = (wirk, je, e, teilNr) => [G(`${gr(wirk, e)} : ${gr(je, e)} = ${wirk / je}`), G(`${wirk / je} · 1 cm = ${wirk / je} cm`, teilNr)];
  sechs(S_('K2'), 'F', [
    () => { const n = zz(3, 9), je = 100 * M;
      return zahl(Z('Schau in die Tabelle.', '1 cm auf der Karte sind 100 m in Wirklichkeit.', `Ein Weg ist in Wirklichkeit ${n * 100} m lang.`, 'Wie viele cm ist der Weg auf der Karte lang?'), n, fehlerliste(n, [[n * 100, 'massstab-verkehrt'], [n * 10, 'umrechnungszahl']]), H_RUECK, { einheit: 'cm', daten: leisteTabelle(je, 'm'), nachweis: runter(n * je, je, 'm') }); },
    () => { const n = zz(4, 9), k = zz(2, 3), je = 50 * M;
      return luecken(Z('Schau in die Tabelle.', '1 cm auf der Karte sind 50 m in Wirklichkeit.', `${n * 50} m in Wirklichkeit sind {{a}} cm auf der Karte.`, `${k * 50 * 2} m in Wirklichkeit sind {{b}} cm auf der Karte.`), { a: [n, fehlerliste(n, [[n * 50, 'massstab-verkehrt']])], b: k * 2 }, h3('Die Tabelle zeigt: 1 cm auf der Karte sind 50 m.', '150 m in Wirklichkeit sind 3 cm auf der Karte.', 'Wie oft passen 50 m in die ganze Strecke?'),
        { daten: leisteTabelle(je, 'm'), nachweis: [...runter(n * je, je, 'm'), ...runter(k * 2 * je, je, 'm')] }); },
    () => { const n = zz(4, 9), je = 100 * M;
      return auswahl(Z('Schau in die Tabelle.', '1 cm auf der Karte sind 100 m in Wirklichkeit.', `Eine Straße ist in Wirklichkeit ${n * 100} m lang.`, 'Wie lang ist sie auf der Karte?'), [opt(`${n} cm`, true), opt(`${n * 100} cm`, false, 'massstab-verkehrt'), opt(`${n * 10} cm`, false, 'umrechnungszahl')], H_RUECK, { daten: leisteTabelle(je, 'm'), nachweis: runter(n * je, je, 'm') }); },
    () => { const n = zz(3, 12);
      return zahl(Z('Schau in die Tabelle.', '1 cm auf der Karte ist 1 km in Wirklichkeit.', `Zwei Dörfer liegen ${n} km auseinander.`, 'Wie viele cm sind das auf der Karte?'), n, fehlerliste(n, [[n * 1000, 'massstab-verkehrt'], [n * 10, 'umrechnungszahl']]), h3('Jeder km in Wirklichkeit ist 1 cm auf der Karte.', '4 km in Wirklichkeit sind 4 cm auf der Karte.', 'Die Zahl bleibt gleich. Nur die Einheit ändert sich.'), { einheit: 'cm', daten: leisteTabelle(KM, 'km'), nachweis: runter(n * KM, KM, 'km') }); },
    () => { const a = zz(2, 4), b = zz(2, 5), je = 100 * M, [o1, o2, o3] = dreiOrte();
      return sach(Z('Schau in die Tabelle.', '1 cm auf der Karte sind 100 m in Wirklichkeit.', `${gross(VON[o1[0]])} bis ${ZU[o2[0]]} sind es ${a * 100} m.`, `Von dort bis ${ZU[o3[0]]} sind es noch ${b * 100} m.`), [teil('Wie viele m ist der ganze Weg in Wirklichkeit lang?', (a + b) * 100, 'm', fehlerliste((a + b) * 100, [[a * 100, 'sach-schritt-vergessen']])), teil('Wie viele cm ist der ganze Weg auf der Karte lang?', a + b, 'cm', fehlerliste(a + b, [[(a + b) * 100, 'massstab-verkehrt']]))], H_RUECK,
        { daten: leisteTabelle(je, 'm'), nachweis: [G(`${a * 100} m + ${b * 100} m = ${(a + b) * 100} m`, 1), G(`${(a + b) * 100} m : 100 m = ${a + b}`), G(`${a + b} · 1 cm = ${a + b} cm`, 2)] }); },
    () => { const ns = mische([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), je = 100 * M;
      return zuordnen(Z('Schau in die Tabelle.', '1 cm auf der Karte sind 100 m in Wirklichkeit.', 'Was gehört zusammen?'), ns.map((n) => [`${n * 100} m in Wirklichkeit`, `${n} cm auf der Karte`]), H_RUECK, { daten: leisteTabelle(je, 'm'), nachweis: ns.flatMap((n) => runter(n * je, je, 'm')) }); },
  ]);
  const H_R100 = h3('Maßstab 1:100 heißt: Im Plan ist alles 100-mal so klein.'.replace('100-mal so klein', 'durch 100 geteilt'), '3 m sind 300 cm. Dann 300 cm : 100 = 3 cm.', 'Wandle in cm um. Teile dann durch 100.');
  const H_R1000 = h3('Maßstab 1:1000 heißt: Auf der Karte ist alles durch 1000 geteilt.', '30 m sind 3000 cm. Dann 3000 cm : 1000 = 3 cm.', 'Wandle in cm um. Teile dann durch 1000.');
  const MT = massstabTabelle(['1:100', '1 m'], ['1:1000', '10 m']);
  sechs(S_('K2'), 'G', [
    () => { const n = zz(3, 9), name = zimmer();
      return zahl(Z('Ein Plan hat den Maßstab 1:100.', `${name === 'Zimmer' ? 'Das' : name === 'Klassenraum' || name === 'Garten' || name === 'Stall' || name === 'Saal' ? 'Der' : 'Die'} ${name} ist in Wirklichkeit ${n} m lang.`, 'Wie viele cm sind das im Plan?'), n, fehlerliste(n, [[n * 100, 'massstab-verkehrt'], [n * 10, 'umrechnungszahl']]), H_R100, { einheit: 'cm', daten: MT, nachweis: [G(`${n} m : 100 = ${n} cm`)] }); },
    () => { const n = zz(2, 9) * 10;
      return zahl(Z('Eine Karte hat den Maßstab 1:1000.', `Eine Brücke ist in Wirklichkeit ${n} m lang.`, 'Wie viele cm sind das auf der Karte?'), n / 10, fehlerliste(n / 10, [[n, 'umrechnungszahl'], [n * 10, 'massstab-verkehrt']]), H_R1000, { einheit: 'cm', daten: MT, nachweis: [G(`${n} m : 1000 = ${n / 10} cm`)] }); },
    () => { const b = zz(5, 9), h = zz(3, b - 1);
      return sach(Z('Ein Zimmer wird im Maßstab 1:100 gezeichnet.', `Es ist ${b} m lang und ${h} m breit.`), [teil('Wie viele cm ist das Zimmer im Plan lang?', b, 'cm', fehlerliste(b, [[b * 100, 'massstab-verkehrt']])), teil('Wie viele cm ist das Zimmer im Plan breit?', h, 'cm', fehlerliste(h, [[h * 100, 'massstab-verkehrt']]))], H_R100, { nachweis: [G(`${b} m : 100 = ${b} cm`, 1), G(`${h} m : 100 = ${h} cm`, 2)] }); },
    () => { const cm = zz(6, 12) * 10, was = wahl(['Eine Tür', 'Ein Fenster', 'Ein Tisch']);
      return zahl(Z('Ein Plan hat den Maßstab 1:100.', `${was} ist in Wirklichkeit ${cm} cm breit.`, 'Wie viele mm sind das im Plan?'), cm / 10, fehlerliste(cm / 10, [[cm, 'umrechnungszahl'], [cm / 100, 'umrechnungszahl']].filter(([x]) => Number.isInteger(x))), h3('Teile die Länge durch 100.', '80 cm sind 800 mm. Dann 800 mm : 100 = 8 mm.', 'Wandle erst in mm um. Teile dann durch 100.'), { einheit: 'mm', nachweis: [G(`${cm} cm : 100 = ${cm / 10} mm`)] }); },
    () => { const a = zz(2, 9) * 10, b = zz(2, 9);
      return luecken(Z('Eine Karte hat den Maßstab 1:1000.', `${a} m in Wirklichkeit sind {{a}} cm auf der Karte.`, `${b} cm auf der Karte sind {{b}} m in Wirklichkeit.`), { a: [a / 10, fehlerliste(a / 10, [[a, 'umrechnungszahl']])], b: [b * 10, fehlerliste(b * 10, [[b * 1000, 'massstab-einheit'], [b * 100, 'umrechnungszahl']])] }, H_R1000, { daten: MT, nachweis: [G(`${a} m : 1000 = ${a / 10} cm`), G(`${b} cm · 1000 = ${b * 10} m`)] }); },
    () => { const n = zz(2, 9) * 10, stimmt = wahl([true, false, false]), behauptet = stimmt ? n : n / 10, kn = kind();
      return auswahl(Z(`${kn} zeichnet einen Schulhof im Maßstab 1:100.`, `Der Schulhof ist in Wirklichkeit ${n} m lang.`, `${kn} sagt: Im Plan ist er ${behauptet} cm lang.`, 'Stimmt das?'), [opt('Stimmt.', stimmt), opt(`Falsch. Es sind ${stimmt ? n / 10 : n} cm.`, !stimmt, stimmt ? 'umrechnungszahl' : undefined), opt(`Falsch. Es sind ${n * 100} cm.`, false, 'massstab-verkehrt')], H_R100,
        { nachweis: [G(`${n} m : 100 = ${n} cm`), { art: 'urteil', stimmt, behauptet: `${behauptet} cm` }, HILFSGROESSE(`${n / 10} cm`, 'falsch umgewandelt'), HILFSGROESSE(`${fz(n * 100)} cm`, 'mal statt geteilt')] }); },
  ]);
  const H2_R = h2('Wandle die Länge in cm um und teile durch die Maßstabszahl.', '1 km sind 100 000 cm.'.replace('100 000', fz(100000)));
  sechs(S_('K2'), 'M', [
    () => { const km = zz(1, 4), ms = 25000;
      return groesse(Z(`Eine Karte hat den Maßstab 1:${fz(ms)}.`, `Ein See ist in Wirklichkeit ${km} km lang.`, 'Wie lang ist der See auf der Karte?'), 'laenge', (km * KM) / ms, 'cm', [[(km * KM) / ms / 10, 'umrechnungszahl'], [(km * KM) / ms * 10, 'umrechnungszahl']], H2_R, { einheiten: E_L, nachweis: [G(`${km} km : ${fz(ms)} = ${gr((km * KM) / ms, 'cm')}`)] }); },
    () => { const halb = zz(3, 13), ms = 50000;
      return groesse(Z(`Eine Karte hat den Maßstab 1:${fz(ms)}.`, `Zwei Orte sind in Wirklichkeit ${gr(halb * 500 * M, 'km')} voneinander entfernt.`, 'Wie weit liegen sie auf der Karte auseinander?'), 'laenge', (halb * 500 * M) / ms, 'cm', [[(halb * 500 * M) / ms * 10, 'umrechnungszahl'], [(halb * 500 * M) / 25000, 'sach-falsche-rechnung']], H2_R, { einheiten: E_L, nachweis: [G(`${gr(halb * 500 * M, 'km')} : ${fz(ms)} = ${gr((halb * 500 * M) / ms, 'cm')}`)] }); },
    () => { const mm = zz(5, 14) * 5, ms = wahl([5000, 2000]), wirk = (mm * ms) / M;
      return zahl(`Im Heft: Ein Weg ist in Wirklichkeit ${wirk} m lang. Zeichne ihn als Strecke im Maßstab 1:${ms}. Wie viele mm ist deine Strecke lang?`, mm, fehlerliste(mm, [[mm * 10, 'umrechnungszahl'], [mm / 10, 'umrechnungszahl']].filter(([x]) => Number.isInteger(x))), h2('Wandle die Länge in mm um und teile durch die Maßstabszahl.', '1 m sind 1000 mm.'), { einheit: 'mm', nachweis: [G(`${wirk} m : ${ms} = ${mm} mm`)] }); },
    () => { const zehntel = zz(6, 18), ms = 10000;
      return groesse(Z(`Ein Stadtplan hat den Maßstab 1:${fz(ms)}.`, `Eine Straße ist in Wirklichkeit ${gr(zehntel * 100 * M, 'km')} lang.`, 'Wie lang ist die Straße auf dem Stadtplan?'), 'laenge', (zehntel * 100 * M) / ms, 'cm', [[(zehntel * 100 * M) / ms * 10, 'umrechnungszahl'], [(zehntel * 100 * M) / ms / 10, 'umrechnungszahl']], H2_R, { einheiten: E_L, nachweis: [G(`${gr(zehntel * 100 * M, 'km')} : ${fz(ms)} = ${gr((zehntel * 100 * M) / ms, 'cm')}`)] }); },
    () => { const [l, b, ms] = wahl([[4, 3, 50], [6, 4, 100], [8, 5, 100], [5, 3, 50], [10, 6, 200], [12, 8, 200]]), lc = (l * 100) / ms, bc = (b * 100) / ms;
      return zahl(`Im Heft: Ein Zimmer ist ${l} m lang und ${b} m breit. Zeichne seinen Grundriss im Maßstab 1:${ms}. Wie viele cm sind alle vier Seiten deiner Zeichnung zusammen lang?`, 2 * lc + 2 * bc, fehlerliste(2 * lc + 2 * bc, [[lc + bc, 'sach-schritt-vergessen'], [2 * l + 2 * b, 'massstab-einheit']]), h2('Rechne zuerst Länge und Breite für die Zeichnung aus.', 'Das Rechteck hat zwei lange und zwei kurze Seiten.'), { einheit: 'cm', nachweis: [G(`${l} m : ${ms} = ${lc} cm`), G(`${b} m : ${ms} = ${bc} cm`), G(`2 · ${lc} cm + 2 · ${bc} cm = ${2 * lc + 2 * bc} cm`)] }); },
    () => { const halb = wahl([5, 10, 15, 20]), wirk = halb * 500 * M;
      return groesse(Z(`Zwei Orte sind in Wirklichkeit ${gr(wirk, 'km')} voneinander entfernt.`, `Karte A hat den Maßstab 1:${fz(25000)}, Karte B den Maßstab 1:${fz(50000)}.`, 'Um wie viel ist die Strecke auf Karte A länger als auf Karte B?'), 'laenge', wirk / 25000 - wirk / 50000, 'cm', [[wirk / 25000, 'sach-schritt-vergessen'], [wirk / 25000 + wirk / 50000, 'sub-addiert']], h2('Rechne die Strecke für beide Karten einzeln aus.', 'Ziehe dann die kürzere Strecke von der längeren ab.'),
        { einheiten: E_L, nachweis: [G(`${gr(wirk, 'km')} : ${fz(25000)} = ${gr(wirk / 25000, 'cm')}`), G(`${gr(wirk, 'km')} : ${fz(50000)} = ${gr(wirk / 50000, 'cm')}`), G(`${gr(wirk / 25000, 'cm')} − ${gr(wirk / 50000, 'cm')} = ${gr(wirk / 25000 - wirk / 50000, 'cm')}`)] }); },
  ]);
  sechs(S_('K2'), 'E', [
    () => { const [m, cm, ms] = wahl([[4, 8, 50], [6, 3, 200], [5, 10, 50], [9, 3, 300], [12, 6, 200], [8, 4, 200], [3, 12, 25]]);
      return auswahl(`Ein Zimmer ist in Wirklichkeit ${m} m lang. In einem Plan ist es ${cm} cm lang. Welchen Maßstab hat der Plan?`, [opt(mOpt(ms), true), opt(mOpt(ms * 10), false, 'umrechnungszahl'), opt(`${ms}:1`, false, 'massstab-verkehrt'), opt(mOpt(ms * 100), false, 'umrechnungszahl'), opt(mOpt(m * cm === ms ? ms * 2 : m * cm), false, 'masszahlen-addiert')], h1('Wandle beide Längen in dieselbe Einheit um und teile die Wirklichkeit durch den Plan.'), { nachweis: [{ art: 'massstab', plan: `${cm} cm`, wirklich: `${m} m` }] }); },
    () => { const [km, cm, ms] = wahl([[3, 12, 25000], [5, 10, 50000], [6, 3, 200000], [2, 20, 10000], [9, 18, 50000], [4, 16, 25000]]);
      return auswahl(`Eine Strecke von ${km} km ist auf einer Karte ${cm} cm lang. Welchen Maßstab hat die Karte?`, [opt(mOpt(ms), true), opt(mOpt(ms / 10), false, 'umrechnungszahl'), opt(mOpt(ms * 10), false, 'umrechnungszahl'), opt(`${fz(ms)}:1`, false, 'massstab-verkehrt'), opt(mOpt(ms / 100), false, 'umrechnungszahl')], h1('1 km sind 100 000 cm. Teile die Wirklichkeit durch die Länge auf der Karte.'.replace('100 000', fz(100000))), { nachweis: [{ art: 'massstab', plan: `${cm} cm`, wirklich: `${km} km` }] }); },
    () => { const [l, b, ms] = wahl([[30, 18, 200], [45, 20, 500], [24, 16, 200], [50, 35, 500], [36, 24, 400]]), lc = (l * 1000) / ms, bc = (b * 1000) / ms;
      return zahl(`Im Heft: Eine Turnhalle ist ${l} m lang und ${b} m breit. Zeichne ihren Grundriss im Maßstab 1:${ms}. Wie viele mm sind alle vier Seiten deiner Zeichnung zusammen lang?`, 2 * lc + 2 * bc, fehlerliste(2 * lc + 2 * bc, [[lc + bc, 'sach-schritt-vergessen'], [(2 * lc + 2 * bc) / 10, 'umrechnungszahl']].filter(([x]) => Number.isInteger(x))), h1('Rechne Länge und Breite für die Zeichnung in mm aus. Das Rechteck hat zwei lange und zwei kurze Seiten.'), { einheit: 'mm', nachweis: [G(`${l} m : ${ms} = ${lc} mm`), G(`${b} m : ${ms} = ${bc} mm`), G(`2 · ${lc} mm + 2 · ${bc} mm = ${2 * lc + 2 * bc} mm`)] }); },
    () => { const [l, b, ms] = wahl([[6, 4, 250], [8, 5, 200], [7, 4, 500], [9, 6, 250], [5, 3, 400]]), L_ = l * CM * ms, B_ = b * CM * ms;
      return groesse(`Im Heft: Zeichne ein Rechteck mit ${l} cm Länge und ${b} cm Breite. Es zeigt einen Garten im Maßstab 1:${ms}. Wie lang ist der Zaun, der in Wirklichkeit um den ganzen Garten führt?`, 'laenge', 2 * L_ + 2 * B_, 'm', [[L_ + B_, 'sach-schritt-vergessen'], [(2 * l + 2 * b) * CM, 'massstab-einheit']], h1('Rechne Länge und Breite in die Wirklichkeit um. Der Zaun führt um alle vier Seiten.'), { einheiten: E_L, nachweis: [G(`${l} cm · ${ms} = ${gr(L_, 'm')}`), G(`${b} cm · ${ms} = ${gr(B_, 'm')}`), G(`2 · ${gr(L_, 'm')} + 2 · ${gr(B_, 'm')} = ${gr(2 * L_ + 2 * B_, 'm')}`)] }); },
    () => { const mm = zz(3, 9), tier = wahl(['Ein Marienkäfer', 'Eine Ameise', 'Ein Samenkorn', 'Eine Blattlaus']);
      return groesse(`${tier} ist in Wirklichkeit ${mm} mm lang. Für ein Plakat wird ${tier.startsWith('Eine') ? 'sie' : tier.startsWith('Ein Samen') ? 'es' : 'er'} vergrößert im Maßstab 10:1 gezeichnet. Wie lang ist die Zeichnung?`, 'laenge', mm * 10, 'cm', [[mm, 'sach-schritt-vergessen']], h1('Bei 10:1 steht die größere Zahl vorn. Die Zeichnung ist größer als das Ding.'), { einheiten: E_L, nachweis: [G(`${mm} mm · 10 = ${mm} cm`)] }); },
    () => { const [modell, echt, ms, hoehe] = wahl([[9, '4,5 m', 50, '1,5 m'], [20, '5 m', 25, '1,5 m'], [12, '12 m', 100, '3 m'], [8, '4 m', 50, '2 m'], [30, '6 m', 20, '2,4 m']]), hmm = Number(hoehe.replace(' m', '').replace(',', '.')) * 1000 / ms;
      return groesse(`Ein Modell eines Busses ist ${modell} cm lang. Der echte Bus ist ${echt} lang und ${hoehe} hoch. Wie hoch ist das Modell?`.replace('eines Busses', modell < 15 && echt !== '12 m' ? 'eines Autos' : 'eines Busses').replace('Der echte Bus', modell < 15 && echt !== '12 m' ? 'Das echte Auto' : 'Der echte Bus'), 'laenge', hmm, 'cm', [[hmm * 10, 'umrechnungszahl']], h1('Bestimme zuerst den Maßstab aus den beiden Längen. Teile dann die Höhe durch die Maßstabszahl.'), { einheiten: E_L, nachweis: [G(`${echt} : ${modell} cm = ${ms}`), G(`${hoehe} : ${ms} = ${gr(hmm, 'cm')}`)] }); },
  ]);
}
