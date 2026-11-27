// Aufgaben zu 5.8.2 „Flächeneinheiten“ (Lernziele H1 und H2) nach ADR 0015 und ADR 0035.
// H1: Flächeneinheiten kennen und passend wählen. H2: Flächeneinheiten umwandeln, die Umrechnungszahl ist 100.
// Grilling mit Nils (2026-11-22): F cm², dm², m²; G dazu mm² und km²; M dazu a und ha. Umwandeln: F Nachbareinheit ohne Rest,
// G gemischt („3 m² 25 dm²“), M zwei Stufen, E Fehlersuche (10 statt 100). Flächen stehen nie mit Komma.

import { sechs, zahl, auswahl, opt, luecken, zuordnen, ordnen, groesse, umwandeltabelle, L, Z, G, HILFSGROESSE, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { merktabelle } from './5-6-groessen.mjs';
import { QF, q, qmix, R, setze, rasterBild, NF, inhaltVon, form, zz, wahl, mische, fz } from './5-8-flaechen.mjs';

const H1 = '5.8.2-H1', H2 = '5.8.2-H2';
const SG = (extra) => ({ art: 'stuetzgroesse', ...extra });
// Nachbareinheiten mit der Umrechnungszahl 100, von groß nach klein.
const NACHBARN_F = [['m²', 'dm²'], ['dm²', 'cm²']];
const NACHBARN_G = [...NACHBARN_F, ['cm²', 'mm²']];
const NACHBARN_M = [...NACHBARN_G, ['ha', 'a'], ['a', 'm²'], ['km²', 'ha']];
const merk = (...paare) => merktabelle(...paare.map(([g, k]) => [`1 ${g}`, `100 ${k}`]));
const MERK_F = merk(...NACHBARN_F), MERK_G = merk(['m²', 'dm²'], ['dm²', 'cm²'], ['cm²', 'mm²']);
const gq = (w, e) => q(w / QF[e], e); // Wert in mm² als Text in der Einheit e
// Vorstellungen zu den Einheiten (auf F als Tabelle, damit jede Aufgabe ein Bild hat).
export const VORSTELLUNG_G = { kopf: ['Einheit', 'So groß ist etwa'], zeilen: [['mm²', 'ein Stecknadelkopf'], ['cm²', 'ein Fingernagel'], ['dm²', 'eine Handfläche'], ['m²', 'eine große Zeitung, aufgeklappt'], ['km²', 'ein Dorf mit Feldern']] };
export const VORSTELLUNG = { kopf: ['Einheit', 'So groß ist etwa'], zeilen: [['cm²', 'ein Fingernagel'], ['dm²', 'eine Handfläche'], ['m²', 'eine große Zeitung, aufgeklappt']] };
// Dinge mit einer typischen Fläche: [Ding, Satz mit Lücke, Zahl, Einheit, falsche Einheiten]
export const DINGE = {
  F: [['Briefmarke', 'Eine Briefmarke ist ungefähr ▢ groß.', 6, 'cm²', ['dm²', 'm²']], ['Heftseite', 'Eine Heftseite ist ungefähr ▢ groß.', 6, 'dm²', ['cm²', 'm²']],
    ['Klassenzimmer', 'Ein Klassenzimmer ist ungefähr ▢ groß.', 60, 'm²', ['cm²', 'dm²']], ['Postkarte', 'Eine Postkarte ist ungefähr ▢ groß.', 150, 'cm²', ['dm²', 'm²']],
    ['Kinderzimmer', 'Ein Kinderzimmer ist ungefähr ▢ groß.', 12, 'm²', ['cm²', 'dm²']], ['Tafel', 'Die Tafel ist ungefähr ▢ groß.', 5, 'm²', ['cm²', 'dm²']]],
  G: [['Stadt', 'Eine Stadt ist ungefähr ▢ groß.', 90, 'km²', ['m²', 'dm²']], ['Fingernagel', 'Ein Fingernagel ist ungefähr ▢ groß.', 80, 'mm²', ['cm²', 'dm²']],
    ['Bodensee', 'Der Bodensee ist ungefähr ▢ groß.', 536, 'km²', ['m²', 'dm²']], ['Tischplatte', 'Eine Tischplatte ist ungefähr ▢ groß.', 80, 'dm²', ['mm²', 'm²']]],
  M: [['Garten', 'Ein Garten ist ungefähr ▢ groß.', 4, 'a', ['ha', 'm²', 'km²']], ['Schulhof', 'Ein Schulhof ist ungefähr ▢ groß.', 20, 'a', ['ha', 'm²', 'km²']],
    ['Bauernhof', 'Ein Bauernhof ist ungefähr ▢ groß.', 40, 'ha', ['a', 'm²', 'km²']], ['Fußballfeld', 'Ein Fußballfeld ist ungefähr ▢ groß.', 70, 'a', ['ha', 'm²', 'km²']]],
  E: [['Wald', 'Der Wald ist ungefähr ▢ groß.', 30, 'km²', ['a', 'm²', 'dm²', 'cm²']], ['Bodensee', 'Der Bodensee ist ungefähr ▢ groß.', 536, 'km²', ['ha', 'a', 'm²', 'dm²']],
    ['Klassenzimmer', 'Ein Klassenzimmer ist ungefähr ▢ groß.', 60, 'm²', ['a', 'ha', 'dm²', 'cm²']], ['Garten', 'Ein Garten ist ungefähr ▢ groß.', 4, 'a', ['ha', 'm²', 'km²', 'dm²']]],
};
// Welche Einheit passt? Die Antworten sind Einheiten.
export function einheitWaehlen(stufe, hilfen, { frage = 'Welche Einheit passt?', extra = {} } = {}) {
  const [ding, satz, n, e, falsch] = wahl(DINGE[stufe]);
  return auswahl(Z(satz.replace('▢', `${n} ▢`), frage), [opt(e, true), ...falsch.map((f) => opt(f, false, 'groesse-ohne-vorstellung'))], hilfen, { ...extra, nachweis: [SG({ ding, zahl: n })] });
}
// Welche Angabe passt? Die Antworten sind Größen mit derselben Zahl.
export function angabeWaehlen(stufe, hilfen, extra = {}) {
  const [ding, satz, n, e, falsch] = wahl(DINGE[stufe]);
  const wer = satz.replace(' ist ungefähr ▢ groß.', '');
  return auswahl(Z(`Wie groß ist ${wer[0].toLowerCase()}${wer.slice(1)} ungefähr?`, 'Wähle die passende Angabe.'),
    [opt(q(n, e), true), ...falsch.map((f) => opt(q(n, f), false, 'groesse-ohne-vorstellung'))], hilfen, { ...extra, nachweis: [SG({ ding })] });
}
// Zuordnen: jedes Ding zu seiner Fläche.
export function dingeZuordnen(stufen, anzahl, hilfen, extra = {}) {
  const liste = mische(stufen.flatMap((s) => DINGE[s])), paare = [];
  for (const d of liste) if (paare.length < anzahl && !paare.some((p) => p[3] === d[3])) paare.push(d);
  return zuordnen(Z('Welche Fläche passt zu welchem Ding?', 'Ordne zu.'), paare.map(([ding, , n, e]) => [ding, q(n, e)]), hilfen, { ...extra, nachweis: [SG({})] });
}
// Rechteck oder Figur auf dem Zentimeterraster (nur F und G).
function rasterFlaeche(text, art, groesse_, hilfen, fehler = []) {
  const f = form(art, groesse_), g = setze([f], { maxB: 14 });
  if (!g) return null;
  const a = inhaltVon(g.figuren[0].rechtecke);
  return zahl(text, a, fehlerliste(a, fehler.map(([w, fv]) => [w(a, g), fv])), hilfen, { einheit: 'cm²', bild: rasterBild('cm', g), nachweis: [NF('inhalt', q(a, 'cm²'))] });
}

// Stimmt die Angabe eines Kindes zu einem Ding? Mit `stimmt` nennt das Kind die passende Einheit.
export function urteilDing(dinge, stimmt, hilfen, zeilen = false) {
  const [ding, satz, n, e, falsch] = wahl(dinge), [f1, f2] = mische(falsch), kn = kind(), gesagt = q(n, stimmt ? e : f1);
  const optionen = [opt('Stimmt.', stimmt, stimmt ? undefined : 'groesse-ohne-vorstellung'), opt(`Falsch. Es sind ungefähr ${q(n, stimmt ? f1 : e)}.`, !stimmt, stimmt ? 'groesse-ohne-vorstellung' : undefined), opt(`Falsch. Es sind ungefähr ${q(n, f2)}.`, false, 'groesse-ohne-vorstellung')];
  const text = zeilen ? Z(`${kn} sagt: ${satz.replace('▢', gesagt)}`, 'Stimmt das?') : `${kn} sagt: ${satz.replace('▢', gesagt)} Stimmt das?`;
  return auswahl(text, optionen, hilfen, { nachweis: [{ art: 'urteil', stimmt, ding, groesse: gesagt }, HILFSGROESSE(q(n, e), 'passende Größe'), HILFSGROESSE(q(n, f1), 'unpassende Größe'), HILFSGROESSE(q(n, f2), 'unpassende Größe')] });
}

export function flaechenmasse() {
  // ---------- H1: Einheiten kennen und wählen ----------
  const tippE = h3('Denke an die Tabelle: 1 cm² ist so groß wie ein Fingernagel.', 'Ein Heft ist größer als ein Fingernagel, aber kleiner als eine Zeitung. Also passt dm².', 'Stell es dir genau vor. Vergleiche mit der Tabelle.');
  sechs(H1, 'F', [
    () => rasterFlaeche(Z('Jedes Feld ist 1 cm² groß.', 'Wie groß ist das Rechteck?'), 'rechteck', 1, h3('Zähle die Felder. Jedes Feld ist 1 cm².', 'Ein Rechteck mit 6 Feldern ist 6 cm² groß.', 'Zähle die Felder in einer Reihe. Rechne mal die Anzahl der Reihen.')),
    () => einheitWaehlen('F', tippE, { extra: { daten: VORSTELLUNG } }),
    () => dingeZuordnen(['F'], 3, h3('Kleine Dinge haben cm², große Räume m².', 'Eine Briefmarke ist ungefähr 6 cm² groß.', 'Beginne mit dem kleinsten Ding.'), { daten: VORSTELLUNG }),
    () => { const n = zz(2, 9);
      return auswahl(Z('Welche Fläche ist am größten?', 'Schau in die Tabelle.'), mische([opt(q(n, 'm²'), true), opt(q(n, 'dm²'), false, 'groesse-ohne-vorstellung'), opt(q(n, 'cm²'), false, 'groesse-ohne-vorstellung')]),
        h3('Die Zahl ist überall gleich. Vergleiche die Einheiten.', '1 m² ist viel größer als 1 cm².', 'Suche die größte Einheit in der Tabelle.'), { daten: VORSTELLUNG, nachweis: [{ art: 'extrem', was: 'groesste' }] }); },
    () => { const x = (() => { for (let i = 0; i < 200; i++) { const g = setze([form('rechteck', 1), form('L', 1)], { namen: 'AB', maxB: 14 }); if (!g) continue; const [a, b] = g.figuren.map((f) => inhaltVon(f.rechtecke)); if (a > b) return { g, a, b }; } return null; })();
      if (!x) return null;
      return zahl(Z('Jedes Feld ist 1 cm² groß.', 'Wie viel cm² ist A größer als B?'), x.a - x.b, fehlerliste(x.a - x.b, [[x.a + x.b, 'sub-addiert'], [x.a, 'sach-schritt-vergessen']]),
        h3('Zähle zuerst die Felder von A und von B.', 'A hat 12 cm², B hat 8 cm². Dann ist A 12 cm² − 8 cm² = 4 cm² größer.', 'Ziehe die kleinere Zahl von der größeren ab.'),
        { einheit: 'cm²', bild: rasterBild('cm', x.g), nachweis: [NF('inhalt', q(x.a, 'cm²'), 'A'), NF('inhalt', q(x.b, 'cm²'), 'B'), G(`${q(x.a, 'cm²')} − ${q(x.b, 'cm²')} = ${q(x.a - x.b, 'cm²')}`)] }); },
    () => angabeWaehlen('F', tippE, { daten: VORSTELLUNG }),
  ]);
  sechs(H1, 'G', [
    () => einheitWaehlen('G', h3('mm² nimmt man für sehr kleine Flächen, km² für sehr große.', 'Ein Fingernagel ist ungefähr 80 mm² groß.', 'Stell es dir genau vor. Ist es sehr klein oder sehr groß?'), { extra: { daten: VORSTELLUNG_G } }),
    () => dingeZuordnen(['F', 'G'], 3, h3('Kleine Dinge haben kleine Einheiten.', 'Eine Stadt ist ungefähr 90 km² groß.', 'Ordne zuerst das kleinste und das größte Ding zu.')),
    () => rasterFlaeche(Z('Jedes Feld ist 1 cm² groß.', 'Wie groß ist die Figur?'), wahl(['L', 'T']), 2, h3('Zähle die Felder Reihe für Reihe.', 'Unten 5 Felder, oben 2 Felder. Das sind 7 cm².', 'Teile die Figur in Rechtecke. Zähle jedes für sich.')),
    () => { const n = zz(2, 9), werte = ['mm²', 'cm²', 'dm²', 'm²', 'km²'].map((e) => q(n, e));
      return ordnen(Z('Ordne die Flächen.', 'Beginne mit der kleinsten Fläche.'), werte, h3('Die Zahl ist überall gleich. Es kommt auf die Einheit an.', 'mm² ist die kleinste Einheit, km² die größte.', 'Ordne die Einheiten von klein nach groß.'), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], links: 'klein', rechts: 'groß' }); },
    () => angabeWaehlen('G', h3('Vergleiche mit Dingen, die du kennst.', 'Eine Tischplatte ist ungefähr 80 dm² groß.', 'Stell es dir genau vor. Welche Einheit passt?'), { daten: VORSTELLUNG_G }),
    () => urteilDing([...DINGE.F, ...DINGE.G], false, h3('Stell es dir genau vor.', '1 m² ist so groß wie eine aufgeklappte Zeitung.', 'Passt die Einheit zur Größe des Dings?'), true),
  ]);
  sechs(H1, 'M', [
    () => einheitWaehlen('M', h2('1 a ist ein Quadrat mit 10 m Länge und 10 m Breite, 1 ha eines mit 100 m Länge und 100 m Breite.', 'Stell es dir genau vor und vergleiche.')),
    () => dingeZuordnen(['F', 'G', 'M'], 4, h2('Kleine Dinge haben kleine Einheiten, große Flächen a, ha oder km².', 'Ordne zuerst das kleinste und das größte Ding zu.')),
    () => { const n = zz(2, 9), werte = ['dm²', 'm²', 'a', 'ha', 'km²'].map((e) => q(n, e));
      return ordnen('Ordne die Flächen. Beginne mit der größten Fläche.', [...werte].reverse(), h2('Die Zahl ist überall gleich. Es kommt auf die Einheit an.', 'Von m² zu a, von a zu ha und von ha zu km² ist es jeweils mal 100.'), { nachweis: [{ art: 'ordnung', richtung: 'ab' }], links: 'groß', rechts: 'klein' }); },
    () => { const s = wahl([10, 100]), e = s === 10 ? 'a' : 'ha', n = s * s;
      return groesse(Z(`Ein Quadrat ist ${s} m lang und ${s} m breit.`, 'Wie groß ist seine Fläche?', `Gib sie in ${e === 'a' ? 'Ar' : 'Hektar'} an.`), 'flaeche', n * QF['m²'], e, [[2 * s * QF['m²'], 'umfang-halb'], [4 * s * QF['m²'], 'umfang-flaeche-verwechselt'], [n * QF['m²'] * 100, 'umrechnungszahl-flaeche']],
        h2(`Rechne erst ${s} m · ${s} m in m².`, `${e === 'a' ? '100 m² sind 1 a' : '10 000 m² sind 1 ha'}.`), { nachweis: [G(`${s} m · ${s} m = ${q(n, 'm²')}`), G(`${q(n, 'm²')} = 1 ${e}`)] }); },
    () => { const [ding, , n, e, falsch] = wahl(DINGE.M);
      return auswahl(`Welche Angabe passt zu einem ${ding}?`, [opt(q(n, e), true), ...falsch.map((f) => opt(q(n, f), false, 'groesse-ohne-vorstellung'))], h2('Vergleiche mit Flächen, die du kennst.', 'Ein Klassenzimmer ist ungefähr 60 m², ein Fußballfeld ungefähr 70 a groß.'), { nachweis: [SG({ ding })] }); },
    () => urteilDing([...DINGE.G, ...DINGE.M], wahl([true, false]), h2('Stell es dir genau vor.', 'Vergleiche mit Flächen, die du kennst: Klassenzimmer, Fußballfeld, Stadt.')),
  ]);
  sechs(H1, 'E', [
    () => einheitWaehlen('E', h1('Vergleiche mit Flächen, die du kennst.')),
    () => { const w = wahl([[QF.ha, [QF.a * 90, QF['m²'] * 9500, QF.a * 105]], [QF['km²'], [QF.ha * 99, QF.a * 9000, QF['m²'] * 999000]]]), werte = [w[0], ...w[1]].sort((x, y) => x - y);
      const text = (v) => (v % QF['km²'] === 0 ? gq(v, 'km²') : v % QF.ha === 0 ? gq(v, 'ha') : v === QF.a * 105 ? qmix(v, 'ha', 'a') : v % QF.a === 0 ? gq(v, 'a') : gq(v, 'm²'));
      return ordnen('Ordne die Flächen. Beginne mit der kleinsten Fläche.', werte.map(text), h1('Wandle alle Flächen in dieselbe Einheit um.'), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], links: 'klein', rechts: 'groß' }); },
    () => dingeZuordnen(['F', 'G', 'M'], 5, h1('Ordne zuerst das kleinste und das größte Ding zu.')),
    () => { const l = wahl([200, 250, 400, 500]), b = wahl([50, 100, 200]), n = l * b;
      if (n % 10000) return null;
      return groesse(`Ein Feld ist ${l} m lang und ${b} m breit. Wie groß ist es? Gib die Fläche in Hektar an.`, 'flaeche', n * QF['m²'], 'ha', [[n * QF['m²'] * 100, 'umrechnungszahl-flaeche'], [(n / 100) * QF['m²'], 'umrechnungszahl-flaeche'], [2 * (l + b) * QF['m²'], 'umfang-flaeche-verwechselt']],
        h1('Rechne zuerst in m². 10 000 m² sind 1 ha.'), { nachweis: [G(`${l} m · ${b} m = ${q(n, 'm²')}`), G(`${q(n, 'm²')} = ${q(n / 10000, 'ha')}`)] }); },
    () => { const werte = mische([QF['km²'], QF.ha * 99, QF.a * 9000, QF['m²'] * 999000]);
      const text = (v) => (v === QF['km²'] ? '1 km²' : v === QF.ha * 99 ? '99 ha' : v === QF.a * 9000 ? q(9000, 'a') : q(999000, 'm²'));
      return auswahl('Welche Fläche ist am größten?', werte.map((v) => opt(text(v), v === QF['km²'], v === QF['km²'] ? undefined : 'umrechnungszahl-flaeche')), h1('Wandle alle Flächen in ha um.'), { nachweis: [{ art: 'extrem', was: 'groesste' }] }); },
    () => { const [, satz, n, e] = wahl(DINGE.M), stimmt = wahl([true, false]), kn = kind(), klein = e === 'ha' ? 'a' : 'm²', richtigK = n * 100, behauptet = stimmt ? richtigK : richtigK / 10;
      const beh = `${q(n, e)} = ${q(behauptet, klein)}`;
      return auswahl(`${kn} sagt: ${satz.replace('▢', q(n, e))} Also gilt ${beh}. Stimmt das?`,
        [opt(`Stimmt, denn 1 ${e} sind 100 ${klein}.`, stimmt), opt(`Falsch, denn ${q(n, e)} sind ${q(stimmt ? richtigK / 10 : richtigK, klein)}.`, !stimmt, stimmt ? 'umrechnungszahl-flaeche' : undefined), opt(`Falsch, denn ${q(n, e)} sind ${q(richtigK * 10, klein)}.`, false, 'umrechnungszahl-flaeche')],
        h1('Die Umrechnungszahl bei Flächen ist 100.'), { nachweis: [{ art: 'urteil', stimmt, behauptung: beh }, G(`${q(n, e)} = ${q(richtigK, klein)}`), HILFSGROESSE(`1 ${e}`, 'Einheit'), HILFSGROESSE(`100 ${klein}`, 'Umrechnungszahl'), HILFSGROESSE(q(richtigK * 10, klein), 'falsche Umrechnungszahl'), HILFSGROESSE(q(richtigK / 10, klein), 'falsche Umrechnungszahl')] }); },
  ]);

  // ---------- H2: Umwandeln ----------
  const H3 = (g, k) => h3(`1 ${g} sind 100 ${k}.`, `3 ${g} sind 3 · 100 ${k} = 300 ${k}.`, 'In der kleineren Einheit wird die Zahl größer. Rechne mal 100.');
  const H3r = (g, k) => h3(`100 ${k} sind 1 ${g}.`, `500 ${k} sind 5 ${g}.`, 'In der größeren Einheit wird die Zahl kleiner. Teile durch 100.');
  const umF = (n, w) => fehlerliste(w, [[n * 10, 'umrechnungszahl-flaeche'], [n * 1000, 'umrechnungszahl-flaeche']]);
  sechs(H2, 'F', [
    () => { const [g, k] = wahl(NACHBARN_F), n = zz(2, 9);
      return luecken(Z('Wandle um.', `${q(n, g)} = {{a}} ${k}`), { a: [n * 100, umF(n, n * 100)] }, H3(g, k), { daten: MERK_F, nachweis: [G(`${q(n, g)} = ${q(n * 100, k)}`)] }); },
    () => { const [g, k] = wahl(NACHBARN_F), n = zz(2, 9);
      return luecken(Z('Wandle um.', `${q(n * 100, k)} = {{a}} ${g}`), { a: [n, fehlerliste(n, [[n * 10, 'umrechnungszahl-flaeche'], [n * 10000, 'umrechnungsrichtung']])] }, H3r(g, k), { daten: MERK_F, nachweis: [G(`${q(n * 100, k)} = ${q(n, g)}`)] }); },
    () => { const [g, k] = wahl(NACHBARN_F), n = zz(2, 9);
      return auswahl(Z('Schau in die Tabelle.', `Was ist genauso viel wie ${q(n, g)}?`), [opt(q(n * 100, k), true), opt(q(n * 10, k), false, 'umrechnungszahl-flaeche'), opt(q(n * 1000, k), false, 'umrechnungszahl-flaeche')], H3(g, k), { daten: MERK_F, nachweis: [{ art: 'gleichwert', groesse: q(n, g) }] }); },
    () => { const z = mische([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), paare = z.map((n, i) => { const [g, k] = NACHBARN_F[i % 2]; return [q(n, g), q(n * 100, k)]; });
      return zuordnen(Z('Schau in die Tabelle.', 'Was ist gleich viel?'), paare, h3('Wandle die linke Seite in die kleinere Einheit um.', '1 m² sind 100 dm².', 'Rechne mal 100.'), { daten: MERK_F, nachweis: paare.map(([l, r]) => G(`${l} = ${r}`)) }); },
    () => { const [g, k] = wahl(NACHBARN_F), a = zz(2, 9), b = zz(11, 20), c = zz(21, 40);
      return umwandeltabelle('Fülle die Tabelle aus.', [g, k], [[a, L('a')], [L('b'), b * 100], [c, L('c')]], { a: [a * 100, umF(a, a * 100)], b, c: c * 100 }, H3(g, k),
        { daten: MERK_F, nachweis: [G(`${q(a, g)} = ${q(a * 100, k)}`), G(`${q(b * 100, k)} = ${q(b, g)}`), G(`${q(c, g)} = ${q(c * 100, k)}`)] }); },
    () => { const n = zz(2, 9), m = zz(2, 9);
      return luecken(Z('Wandle um.', `${q(n, 'm²')} = {{a}} dm²`, `${q(m, 'dm²')} = {{b}} cm²`), { a: [n * 100, umF(n, n * 100)], b: [m * 100, umF(m, m * 100)] }, H3('m²', 'dm²'), { daten: MERK_F, nachweis: [G(`${q(n, 'm²')} = ${q(n * 100, 'dm²')}`), G(`${q(m, 'dm²')} = ${q(m * 100, 'cm²')}`)] }); },
  ]);
  const gemischt = (g, k, max) => zz(1, max) * QF[g] + zz(1, 99) * QF[k];
  sechs(H2, 'G', [
    () => { const [g, k] = wahl(NACHBARN_G), n = zz(11, 60);
      return luecken(Z('Wandle um.', `${q(n, g)} = {{a}} ${k}`), { a: [n * 100, umF(n, n * 100)] }, H3(g, k), { daten: MERK_G, nachweis: [G(`${q(n, g)} = ${q(n * 100, k)}`)] }); },
    () => { const [g, k] = wahl(NACHBARN_G), w = gemischt(g, k, 9), a = Math.floor(w / QF[g]), b = (w % QF[g]) / QF[k];
      return luecken(Z('Wandle um.', `${qmix(w, g, k)} = {{a}} ${k}`), { a: [w / QF[k], fehlerliste(w / QF[k], [[a * 10 + b, 'umrechnungszahl-flaeche'], [a + b, 'masszahlen-addiert'], [a * 1000 + b, 'umrechnungszahl-flaeche']])] },
        h3(`Wandle zuerst die ${g} in ${k} um. Zähle dann den Rest dazu.`, `3 ${g} 25 ${k} sind 300 ${k} + 25 ${k} = 325 ${k}.`, `1 ${g} sind 100 ${k}.`), { daten: MERK_G, nachweis: [G(`${qmix(w, g, k)} = ${gq(w, k)}`)] }); },
    () => { const [g, k] = wahl(NACHBARN_G), w = gemischt(g, k, 12);
      return luecken(Z('Schreibe mit zwei Einheiten.', `${gq(w, k)} = {{a}} ${g} {{b}} ${k}`), { a: [Math.floor(w / QF[g]), fehlerliste(Math.floor(w / QF[g]), [[Math.floor(w / QF[k] / 10), 'umrechnungszahl-flaeche']])], b: (w % QF[g]) / QF[k] },
        h3('Die letzten zwei Ziffern gehören zur kleineren Einheit.', `425 ${k} sind 4 ${g} 25 ${k}.`, 'Teile durch 100. Der Rest bleibt in der kleineren Einheit.'), { daten: MERK_G, nachweis: [G(`${gq(w, k)} = ${qmix(w, g, k)}`)] }); },
    () => { const [g, k] = wahl(NACHBARN_G), a = zz(2, 9), b = zz(11, 40), c = zz(41, 90);
      return umwandeltabelle('Fülle die Tabelle aus.', [g, k], [[a, L('a')], [L('b'), b * 100], [c, L('c')]], { a: [a * 100, umF(a, a * 100)], b, c: c * 100 }, H3(g, k),
        { daten: merk([g, k]), nachweis: [G(`${q(a, g)} = ${q(a * 100, k)}`), G(`${q(b * 100, k)} = ${q(b, g)}`), G(`${q(c, g)} = ${q(c * 100, k)}`)] }); },
    () => { const [g, k] = wahl(NACHBARN_G), n = zz(2, 8), werte = [n * 100 - 10, n * 100 + 5, n * 100 + 30, (n + 1) * 100 - 5].map((v) => v * QF[k]);
      const text = [gq(werte[0], k), qmix(werte[1], g, k), gq(werte[2], k), qmix(werte[3], g, k)];
      return ordnen(Z('Ordne die Flächen.', 'Beginne mit der kleinsten Fläche.'), text, h3('Wandle alles in dieselbe Einheit um.', `3 ${g} 5 ${k} sind 305 ${k}.`, `Schreibe jede Fläche in ${k} auf.`), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], links: 'klein', rechts: 'groß' }); },
    () => { const [g, k] = wahl(NACHBARN_G), n = zz(2, 9), stimmt = wahl([true, false, false]), rechts = stimmt ? n * 100 : n * 10, kn = kind();
      return auswahl(Z(`${kn} sagt: ${q(n, g)} = ${q(rechts, k)}.`, 'Stimmt das?'), [opt('Stimmt.', stimmt, stimmt ? undefined : 'umrechnungszahl-flaeche'), opt(`Falsch. ${q(n, g)} sind ${q(stimmt ? n * 10 : n * 100, k)}.`, !stimmt, stimmt ? 'umrechnungszahl-flaeche' : undefined), opt(`Falsch. ${q(n, g)} sind ${q(n * 1000, k)}.`, false, 'umrechnungszahl-flaeche')],
        H3(g, k), { nachweis: [{ art: 'urteil', stimmt, behauptung: `${q(n, g)} = ${q(rechts, k)}` }, G(`${q(n, g)} = ${q(n * 100, k)}`), HILFSGROESSE(q(n * 10, k), 'falsche Umrechnungszahl'), HILFSGROESSE(q(n * 1000, k), 'falsche Umrechnungszahl')] }); },
  ]);
  const ZWEI = [['m²', 'cm²'], ['dm²', 'mm²'], ['km²', 'a'], ['ha', 'm²'], ['m²', 'mm²'], ['km²', 'm²']];
  const stufen = (g, k) => (QF[g] / QF[k] === 10000 ? 2 : 3);
  sechs(H2, 'M', [
    () => { const [g, k] = wahl(ZWEI.filter(([x, y]) => stufen(x, y) === 2)), n = zz(2, 9), w = n * 10000;
      return luecken(Z('Wandle in zwei Schritten um.', `${q(n, g)} = {{a}} ${k}`), { a: [w, fehlerliste(w, [[n * 100, 'umrechnungszahl-flaeche'], [n * 1000, 'umrechnungszahl-flaeche']])] },
        h2('Gehe über die Einheit dazwischen.', 'Bei jedem Schritt rechnest du mal 100.'), { nachweis: [G(`${q(n, g)} = ${q(w, k)}`)] }); },
    () => { const ha = zz(1, 9), a = zz(1, 99), w = ha * QF.ha + a * QF.a;
      return luecken(Z('Schreibe mit zwei Einheiten.', `${gq(w, 'm²')} = {{a}} ha {{b}} a`), { a: [ha, fehlerliste(ha, [[Math.floor(w / QF['m²'] / 1000), 'umrechnungszahl-flaeche']])], b: a },
        h2('100 m² sind 1 a, 100 a sind 1 ha.', 'Wandle zuerst in a um. Teile dann durch 100.'), { nachweis: [G(`${gq(w, 'm²')} = ${qmix(w, 'ha', 'a')}`)] }); },
    () => { const n = zz(2, 9), m = zz(11, 60);
      return luecken(Z('Wandle um.', `${q(n, 'km²')} = {{a}} ha`, `${q(m, 'ha')} = {{b}} a`), { a: [n * 100, umF(n, n * 100)], b: [m * 100, umF(m, m * 100)] },
        h2('Auch bei km², ha und a ist die Umrechnungszahl 100.', '1 km² sind 100 ha, 1 ha sind 100 a.'), { nachweis: [G(`${q(n, 'km²')} = ${q(n * 100, 'ha')}`), G(`${q(m, 'ha')} = ${q(m * 100, 'a')}`)] }); },
    () => { const n = zz(2, 9), w = n * QF.ha;
      return auswahl(Z(`Welche Angaben sind gleich ${q(n, 'ha')}?`, 'Kreuze alle an.'), [opt(q(n * 100, 'a'), true), opt(gq(w, 'm²'), true), opt(q(n * 1000, 'm²'), false, 'umrechnungszahl-flaeche'), opt(q(n * 10, 'a'), false, 'umrechnungszahl-flaeche')],
        h2('Wandle jede Angabe in a um.', '1 ha sind 100 a, 1 a sind 100 m².'), { mehrfach: true, nachweis: [{ art: 'gleichwert', groesse: q(n, 'ha') }] }); },
    () => { const n = zz(1, 8), werte = [n * 100 - 10, n * 100 - 5, n * 100, n * 100 + 5].map((v) => v * QF.a);
      const text = [gq(werte[0], 'a'), gq(werte[1], 'm²'), gq(werte[2], 'ha'), qmix(werte[3], 'ha', 'a')];
      return ordnen('Ordne die Flächen. Beginne mit der größten Fläche.', [...text].reverse(), h2('Wandle alles in dieselbe Einheit um.', 'Schreibe jede Fläche in a auf.'), { nachweis: [{ art: 'ordnung', richtung: 'ab' }], links: 'groß', rechts: 'klein' }); },
    () => { const n = zz(2, 6), werte = mische([[n * QF.ha, 'ha'], [(n * 100 - 50) * QF.a, 'a'], [(n * 10000 + 5000) * QF['m²'], 'm²'], [(n - 1) * QF.ha + 90 * QF.a, 'mix']]);
      const max = Math.max(...werte.map(([v]) => v));
      return auswahl('Welche Fläche ist am größten?', werte.map(([v, e]) => opt(e === 'mix' ? qmix(v, 'ha', 'a') : gq(v, e), v === max, v === max ? undefined : 'umrechnungszahl-flaeche')),
        h2('Wandle alle Flächen in dieselbe Einheit um.', 'Schreibe zum Beispiel alles in m².'), { nachweis: [{ art: 'extrem', was: 'groesste' }] }); },
  ]);
  sechs(H2, 'E', [
    () => { const n = zz(2, 9), [gf, kf] = wahl(NACHBARN_M), falsch = `${q(n, gf)} = ${q(n * 10, kf)}`;
      const richtig = mische(NACHBARN_M.filter(([g]) => g !== gf)).slice(0, 3).map(([g, k], i) => (i === 2 ? `${q((n + i) * 100, k)} = ${q(n + i, g)}` : `${q(n + i + 1, g)} = ${q((n + i + 1) * 100, k)}`));
      return auswahl('Welche Umwandlung ist falsch?', mische([opt(falsch, true), ...richtig.map((t) => opt(t))]), h1('Rechne jede Umwandlung nach. Achte auf die Umrechnungszahl.'), { nachweis: [{ art: 'gleichungswahl', falsche: true }] }); },
    () => { const w = zz(2, 9) * QF['m²'] + zz(1, 99) * QF['dm²'];
      return zahl(`Wie viel cm² sind ${qmix(w, 'm²', 'dm²')}?`, w / QF['cm²'], fehlerliste(w / QF['cm²'], [[w / QF['dm²'], 'umrechnungsrichtung'], [w / QF['dm²'] * 10, 'umrechnungszahl-flaeche'], [Math.floor(w / QF['m²']) * 10000 + (w % QF['m²']) / QF['dm²'], 'masszahlen-addiert']]),
        h1('Wandle zuerst alles in dm² um, dann in cm².'), { einheit: 'cm²', nachweis: [G(`${qmix(w, 'm²', 'dm²')} = ${gq(w, 'dm²')}`), G(`${gq(w, 'dm²')} = ${gq(w, 'cm²')}`)] }); },
    () => { const [g, k] = wahl(ZWEI.filter(([x, y]) => stufen(x, y) === 3)), n = zz(2, 9), w = n * 1000000;
      return luecken(Z('Wandle um.', `${q(n, g)} = {{a}} ${k}`), { a: [w, fehlerliste(w, [[n * 10000, 'umrechnungszahl-flaeche'], [n * 1000, 'umrechnungszahl-flaeche']])] }, h1('Zähle, wie viele Schritte es von einer Einheit zur anderen sind.'), { nachweis: [G(`${q(n, g)} = ${q(w, k)}`)] }); },
    () => { const [g, k] = wahl([['m²', 'dm²'], ['ha', 'a'], ['dm²', 'cm²']]), a = zz(2, 9), b = zz(1, 9), w = a * QF[g] + b * QF[k], stimmt = wahl([true, false, false]), falschW = a * 10 + b, behauptet = stimmt ? w / QF[k] : falschW, kn = kind();
      const beh = `${qmix(w, g, k)} = ${q(behauptet, k)}`;
      return auswahl(`${kn} rechnet: ${beh}. Stimmt das?`, [opt('Stimmt.', stimmt, stimmt ? undefined : 'umrechnungszahl-flaeche'), opt(`Falsch, denn ${qmix(w, g, k)} sind ${q(stimmt ? falschW : w / QF[k], k)}.`, !stimmt, stimmt ? 'umrechnungszahl-flaeche' : undefined), opt(`Falsch, denn ${qmix(w, g, k)} sind ${q(a * 100 + b * 10, k)}.`, false, 'null-platzhalter')],
        h1('Schreibe den Rest in der kleineren Einheit mit zwei Stellen.'), { nachweis: [{ art: 'urteil', stimmt, behauptung: beh }, G(`${qmix(w, g, k)} = ${gq(w, k)}`), HILFSGROESSE(q(falschW, k), 'falsche Umrechnungszahl'), HILFSGROESSE(q(a * 100 + b * 10, k), 'falsche Lesart')] }); },
    () => { const [g, k] = wahl([['ha', 'm²'], ['m²', 'cm²'], ['km²', 'a']]), n = zz(2, 9), r = n * (QF[g] / QF[k]) * wahl([1, 10]) / 100, links = q(n, g), rechts = q(r, k), z = n * QF[g] < r * QF[k] ? '<' : n * QF[g] > r * QF[k] ? '>' : '=';
      return auswahl(Z('Welches Zeichen passt?', `${links} ▢ ${rechts}`), ['<', '>', '='].map((x) => opt(x, x === z, x === z ? undefined : 'umrechnungszahl-flaeche')), h1('Wandle beide Flächen in dieselbe Einheit um.'), { nachweis: [{ art: 'vergleich', links, rechts }, G(`${links} = ${gq(n * QF[g], k)}`)] }); },
    () => { const s = zz(2, 9), w = s * s * 100;
      return zahl(`Ein Quadrat ist ${s} m lang und ${s} m breit. Wie viel dm² ist es groß?`, w, fehlerliste(w, [[s * s * 10, 'umrechnungszahl-flaeche'], [s * s, 'umrechnungsrichtung'], [4 * s * 10, 'umfang-flaeche-verwechselt']]),
        h1('Wandle zuerst die Seiten in dm um oder rechne zuerst in m².'), { einheit: 'dm²', nachweis: [G(`${s} m · ${s} m = ${q(s * s, 'm²')}`), G(`${q(s * s, 'm²')} = ${q(w, 'dm²')}`)] }); },
  ]);
}
