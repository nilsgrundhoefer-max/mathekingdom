// Aufgaben zu 6.7.5 „Schaubilder proportionaler Zuordnungen“ (Lernziele S1, S2) nach ADR 0015 und ADR 0050.
// S1: proportionale Zuordnungen am Schaubild erkennen (Gerade durch den Nullpunkt). Die Hälfte der Schaubilder ist nicht proportional:
// eine Gerade, die nicht im Nullpunkt beginnt (fester Betrag), eine Linie mit Knick, Punkte auf einer gebogenen Linie.
// S2: Werte ablesen und Punkte eintragen. Abgelesen wird nur auf Gitterlinien. Stückzahlen zeigen nur Punkte, messbare Größen eine Linie.
// F hat ganze Schritte, ab G gibt es halbe Schritte und verschiedene Einteilungen je Achse. Auf M und E zeichnen vier Aufgaben im Heft.

import { zz, wahl, mische, Z, opt, auswahl, kind, sechs, H, FREI, E, t, g, zahl, LK, wertetabelle, wbild, achsen, sbild, punkteEintragen, karten,
  TAB, DS, EIN, ABL, PKT, WERT, URTEIL, KARTE, KONTEXTE, fy, je, paarText } from './6-7-zuordnungen.mjs';

const S1 = '6.7.5-S1', S2 = '6.7.5-S2', PM = [2000, 4000, 10000, 20000];
const PROP = 'Die Zuordnung ist proportional.', NICHT = 'Die Zuordnung ist nicht proportional.';
const K = (...namen) => KONTEXTE[wahl(namen)];
const STUECK = ['hefte', 'broetchen', 'eis', 'hafer'], LINIE = ['kartoffeln', 'aepfel', 'wandern', 'hahn', 'rad'], GELDL = ['kartoffeln', 'aepfel'];
// Achsen für die Zuordnung y = j · x bis xmax (x in ganzen Einheiten, sx: Schritt der Achse nach rechts in Tausendsteln).
// Der Schritt nach oben ist der kleinste aus der Liste, mit dem jeder Wert an einem Schritt nach rechts auf einer Gitterlinie liegt und das Bild höchstens `hoch` Kästchen hoch wird.
function achsenFuer(k, j, xmax, { sx = 1000, hoch = 12, fest = 0, schritte = [1000, 2000, 5000, 10000, 20000, 50000, 500] } = {}) {
  const jeSchritt = (j * sx) / 1000, zellen = (s) => (j * xmax + fest) / s, moeglich = schritte.filter((s) => jeSchritt % s === 0 && fest % s === 0 && zellen(s) <= hoch);
  // Am liebsten 4 bis 10 Kästchen hoch, dann so hoch wie möglich.
  const sy = moeglich.filter((s) => zellen(s) <= 10 && zellen(s) >= 4).sort((p, q) => zellen(q) - zellen(p))[0] ?? moeglich.sort((p, q) => zellen(p) - zellen(q))[0];
  if (!sy) return null;
  const h = Math.ceil((j * xmax + fest) / sy) + 1, st = k.geld && sy % 1000 !== 0 ? 2 : undefined;
  return achsen([k.xn, sx], [k.yn, sy, h > 10 ? 2 : undefined, st], Math.round((xmax * 1000) / sx) + 1, h);
}
// Schaubild der proportionalen Zuordnung: Punkte bei Stückzahlen, sonst eine Gerade ab dem Nullpunkt.
const propBild = (k, a, j, xmax) => sbild(a, k.stueck ? { punkte: Array.from({ length: xmax }, (_, i) => [E(i + 1), (i + 1) * j]) } : { zuege: [{ punkte: [[0, 0], [E(xmax), xmax * j]] }] });
// Nicht proportional: Gerade mit festem Betrag, Linie mit Knick, Punkte mit wachsendem Abstand.
const festBild = (k, a, j, xmax, fest) => sbild(a, k.stueck ? { punkte: Array.from({ length: xmax }, (_, i) => [E(i + 1), (i + 1) * j + fest]) } : { zuege: [{ punkte: [[0, fest], [E(xmax), xmax * j + fest]] }] });
const knickBild = (a, j, xmax) => sbild(a, { zuege: [{ punkte: [[0, 0], [E(xmax / 2), xmax * j], [E(xmax), xmax * j + (xmax / 2) * (j / 2)]] }] });
const PASSEND = { Gewicht: 'das passende Gewicht', Zeit: 'die passende Zeit', Anzahl: 'die passende Anzahl', Benzin: 'die passende Menge' };
const WENN = { prop: PROP, gerade: NICHT, sonst: NICHT };
const kurzY = (k, y) => `${fy(k)(y)} ${k.ye}`;

export function schaubilder6() {
  // ================= S1: am Schaubild erkennen =================
  // art: 'prop', 'fest' (Gerade neben dem Nullpunkt) oder 'knick'.
  const bildVon = (n, namen, art, xmax = 4) => { const k = K(...namen), j = je(k, n === 'F' ? 'F' : 'G'), fest = art === 'fest' ? wahl([1, 2].map((v) => v * (j >= 4000 ? 2000 : 1000))) : 0;
    const a = achsenFuer(k, art === 'knick' ? j / 2 : j, art === 'knick' ? xmax * 2.5 : xmax, { fest, sx: 1000 });
    if (!a || (n === 'F' && a.y[1] % 1000 !== 0)) return null;
    return { k, j, fest, a, bild: art === 'prop' ? propBild(k, a, j, xmax) : art === 'fest' ? festBild(k, a, j, xmax, fest) : knickBild(achsen(a.x, a.y, xmax + 1, a.h), j / 2, xmax) }; };
  const erkenne = (n, namen, art) => () => { const b = bildVon(n, namen, art); if (!b) return null;
    const ist = art === 'prop' ? 'prop' : art === 'fest' ? 'gerade' : 'sonst';
    return auswahl(Z('Prüfe das Schaubild.', 'Entscheide.'), [opt(PROP, art === 'prop', art === 'prop' ? undefined : 'je-mehr-proportional'), opt(NICHT, art !== 'prop')],
      H(n, b.k.stueck ? 'Proportional heißt: Die Punkte liegen auf einer Geraden durch den Nullpunkt.' : 'Proportional heißt: Die Linie ist eine Gerade durch den Nullpunkt.', 'Der Nullpunkt ist der Punkt (0|0) unten links.', art === 'knick' ? 'Achte auf den Knick in der Linie.' : 'Lege ein Lineal an und schau auf den Nullpunkt.'), { bild: b.bild, nachweis: [{ art: 'bildart', ist, wenn: WENN }] }); };
  // Begründung wählen.
  const begruende = (n, namen, art) => () => { const b = bildVon(n, namen, art); if (!b || b.k.stueck) return null;
    const ist = art === 'prop' ? 'prop' : art === 'fest' ? 'gerade' : 'sonst';
    const richtig = art === 'prop' ? 'Proportional. Die Linie ist eine Gerade durch den Nullpunkt.' : art === 'fest' ? 'Nicht proportional. Die Gerade geht nicht durch den Nullpunkt.' : 'Nicht proportional. Die Linie hat einen Knick.';
    const falsch = [art === 'prop' ? opt('Nicht proportional. Die Gerade berührt die Achse nach oben.', false) : opt('Proportional. Die Linie steigt.', false, 'je-mehr-proportional'), art === 'fest' ? opt('Proportional. Die Linie ist gerade.', false, 'je-mehr-proportional') : opt('Nicht proportional. Die Linie steigt zu steil.', false), art === 'knick' ? opt('Proportional. Die Linie beginnt im Nullpunkt.', false, 'je-mehr-proportional') : opt('Nicht proportional. Die Achsen haben verschiedene Einteilungen.', false)];
    return auswahl(Z('Prüfe das Schaubild.', n === 'G' ? 'Kreuze die richtige Begründung an.' : 'Entscheide und begründe.'), [opt(richtig, true), ...falsch],
      H(n, 'Proportional heißt: Die Linie ist eine Gerade durch den Nullpunkt.', 'Beides muss stimmen: gerade und durch den Nullpunkt.', 'Prüfe zuerst den Nullpunkt und dann die ganze Linie.'), { bild: b.bild, nachweis: [{ art: 'bildart', ist }, FREI('Begründung: Gerade durch den Nullpunkt')] }); };
  // Bildkarten: Welches Schaubild ist proportional?
  const kleine = (m, b0 = 0, knick = false, name = ['Zeit in min', 'Wasser in l']) => sbild(achsen([name[0], 1000], [name[1], 2000], 5, 7), { zuege: [{ punkte: knick ? [[0, 0], [2000, E(4 * m)], [4000, E(5 * m)]] : [[0, E(b0)], [4000, E(b0 + 4 * m)]] }] });
  const kartenwahl = (n, anzahl, mehrfach = false) => () => { const namenT = mische(['A', 'B', 'C', 'D'].slice(0, anzahl)), m = wahl([1, 2]), m2 = m === 1 ? 2 : 3;
    const alle = [[kleine(m), true], [kleine(m, wahl([2, 4])), false], [kleine(2, 0, true), false], [mehrfach ? kleine(m2) : kleine(1, 6), mehrfach]].slice(0, anzahl);
    const liste = alle.map(([bild, r], i) => [namenT[i], bild, r, r ? undefined : 'je-mehr-proportional']);
    const a = karten(Z(mehrfach ? 'Kreuze alle Schaubilder von proportionalen Zuordnungen an.' : 'Kreuze das Schaubild der proportionalen Zuordnung an.'), liste,
      H(n, 'Proportional heißt: Die Linie ist eine Gerade durch den Nullpunkt.', 'Der Nullpunkt ist der Punkt (0|0) unten links.', 'Prüfe bei jedem Schaubild zuerst den Nullpunkt.'), { nachweis: [KARTE('prop')] });
    return mehrfach ? { ...a, mehrfach: true } : a; };
  // Aussage beurteilen: „Die Linie ist gerade, also proportional.“
  const urteilGerade = (n, namen, art) => () => { const b = bildVon(n, namen, art); if (!b || b.k.stueck) return null; const kn = kind(), stimmt = art === 'prop';
    return auswahl(Z(`${kn} sagt: „Die Linie ist gerade, also ist die Zuordnung proportional.“`, 'Beurteile die Aussage mit dem Schaubild.'), [opt(stimmt ? 'Stimmt. Die Gerade geht auch durch den Nullpunkt.' : 'Falsch. Die Gerade geht nicht durch den Nullpunkt.', true), opt(stimmt ? 'Falsch. Die Gerade geht nicht durch den Nullpunkt.' : 'Stimmt. Jede Gerade zeigt eine proportionale Zuordnung.', false, stimmt ? undefined : 'je-mehr-proportional'), opt('Falsch. Die Linie ist nicht gerade.', false)],
      H(n, 'Eine Gerade allein reicht nicht.', 'Die Gerade muss durch den Nullpunkt gehen.', 'Suche den Anfang der Geraden an der Achse nach oben.'), { bild: b.bild, nachweis: [{ art: 'bildart', ist: stimmt ? 'prop' : 'gerade' }, URTEIL(stimmt)] }); };
  sechs(S1, 'F', [erkenne('F', LINIE, 'prop'), erkenne('F', LINIE, 'fest'), kartenwahl('F', 2), erkenne('F', STUECK, 'prop'), urteilGerade('F', ['wandern', 'hahn', 'kartoffeln'], 'fest'), erkenne('F', ['wandern', 'hahn'], 'knick')]);
  sechs(S1, 'G', [
    erkenne('G', LINIE, 'prop'), erkenne('G', STUECK, 'fest'), kartenwahl('G', 3), begruende('G', LINIE, 'prop'), urteilGerade('G', LINIE, 'prop'),
    // Punkte auf einer Geraden, die nicht durch den Nullpunkt geht.
    () => { const c = wahl([1, 2]), m = wahl([1, 2]), kn = kind(), a = achsen(['Anzahl Fahrten', 1000], ['Preis in €', 1000], 5, 4 * m + c + 1), pts = [1, 2, 3, 4].map((x) => [E(x), E(m * x + c)]);
      return auswahl(Z(`${kn} sagt: „Die Punkte liegen auf einer Geraden, also ist die Zuordnung proportional.“`, 'Beurteile die Aussage mit dem Schaubild.'), [opt(`Falsch. Zu 2 gehört ${2 * m + c}, zu 4 gehört aber nicht das Doppelte.`, true), opt('Stimmt. Die Punkte liegen auf einer Geraden.', false, 'je-mehr-proportional'), opt('Falsch. Die Punkte liegen nicht auf einer Geraden.', false)],
        H('G', 'Verlängere die Gerade bis zur Achse nach oben.', 'Bei proportionalen Zuordnungen geht die Gerade durch den Nullpunkt.', 'Vergleiche die Werte für 2 und für 4.'), { bild: sbild(a, { punkte: pts }), nachweis: [ABL(2, 2 * m + c, { hilf: true }), ABL(4, 4 * m + c, { hilf: true }), EIN(pts.map(([x, y]) => [t(x), t(y)]), null, { ist: 'keines' }), URTEIL(false)] }); },
  ]);
  // Zwei Linien in einem Schaubild.
  const zweiLinien = (n, welche) => () => { const m = wahl([2, 3]), c = wahl([2, 4]), a = achsen(['Zeit in h', 1000], ['Kosten in €', 2000], 5, (4 * m + c) / 2 + 2);
    const linien = { beideProp: [[[0, 0], [4000, E(4 * m)]], [[0, 0], [4000, E(4 * (m - 1))]]], nurA: [[[0, 0], [4000, E(4 * m)]], [[0, E(c)], [4000, E(c + 4 * (m - 1))]]], nurB: [[[0, E(c)], [4000, E(c + 4 * m)]], [[0, 0], [4000, E(4 * (m - 1))]]] }[welche];
    const text = { beideProp: 'Beide Zuordnungen sind proportional.', nurA: 'Nur die Zuordnung A ist proportional.', nurB: 'Nur die Zuordnung B ist proportional.' };
    return auswahl(Z('Das Schaubild zeigt die Kosten bei zwei Bootsverleihen A und B.', 'Entscheide, welche Zuordnung proportional ist.'), [opt(text.beideProp, welche === 'beideProp', welche === 'beideProp' ? undefined : 'je-mehr-proportional'), opt(text.nurA, welche === 'nurA'), opt(text.nurB, welche === 'nurB'), opt('Keine der beiden Zuordnungen ist proportional.', false)],
      H(n, 'Prüfe für jede Gerade, ob sie durch den Nullpunkt geht.', 'Eine Gerade, die an der Achse nach oben über dem Nullpunkt beginnt, zeigt einen festen Betrag.'), { bild: sbild(a, { zuege: [{ punkte: linien[0], n: 'A' }, { punkte: linien[1], n: 'B', stil: 'zweite' }] }),
        nachweis: [ABL(0, linien[0][0][1] / 1000, { zug: 0, hilf: true }), ABL(0, linien[1][0][1] / 1000, { zug: 1, hilf: true }), FREI('proportional ist genau die Gerade, die im Nullpunkt beginnt')] }); };
  // Tabelle: Wie sieht das Schaubild aus?
  const ausTabelle = (n, prop) => () => { const k = K('kartoffeln', 'aepfel', 'hahn', 'wandern'), j = je(k, 'M'), fest = prop ? 0 : wahl([1000, 2000]), xs = [2, 4, 5], paare = xs.map((x) => [E(x), x * j + fest]);
    const o = { prop: 'eine Gerade durch den Nullpunkt', keines: 'eine Gerade, die nicht durch den Nullpunkt geht' };
    return auswahl(Z('Die Wertepaare der Tabelle werden in ein Schaubild eingetragen und verbunden.', 'Entscheide, welche Linie entsteht.'), [opt(o.prop, prop, prop ? undefined : 'je-mehr-proportional'), opt(o.keines, !prop), opt('eine Linie mit Knick', false), opt('eine waagrechte Gerade', false)],
      H(n, 'Prüfe mit dem Quotienten, ob die Zuordnung proportional ist.', `Rechne ${kurzY(k, paare[0][1])} : 2 und ${kurzY(k, paare[1][1])} : 4. Bei gleichen Quotienten geht die Gerade durch den Nullpunkt.`), { bild: wbild({ namen: [k.xn, k.yn], paare: paarText(paare, fy(k)) }), nachweis: [EIN(paarText(paare, fy(k)), o), FREI('gleiche Abstände in der Tabelle geben eine Gerade')] }); };
  sechs(S1, 'M', [begruende('M', LINIE, 'prop'), begruende('M', LINIE, 'fest'), kartenwahl('M', 4), zweiLinien('M', 'nurA'), ausTabelle('M', true), ausTabelle('M', false)]);
  sechs(S1, 'E', [
    begruende('E', ['wandern', 'hahn', 'rad'], 'knick'),
    kartenwahl('E', 4, true),
    zweiLinien('E', 'nurB'),
    zweiLinien('E', 'beideProp'),
    // Ein Punkt ist bekannt: Welcher zweite Punkt liegt auf der Geraden durch den Nullpunkt?
    () => { const [x0, y0] = wahl([[2, 3], [2, 5], [4, 6], [4, 2], [2, 1]]), f = wahl([2, 3]), a = achsen(['Zeit in h', 1000], ['Strecke in km', 1000], 13, 16);
      const o = (x, y) => `(${t(E(x))} | ${t(E(y))})`;
      return auswahl(Z(`Eine proportionale Zuordnung hat im Schaubild den Punkt ${o(x0, y0)}.`, 'Kreuze den Punkt an, der auch zu dieser Zuordnung gehört.'), [opt(o(x0 * f, y0 * f), true), opt(o(x0 * f, y0 + x0 * (f - 1)), false, 'prop-addiert'), opt(o(y0 * f, x0 * f), false, 'schaubild-achsen-vertauscht'), opt(o(x0 * f, y0), false), opt(o(x0 + 1, y0 + 1), false, 'prop-addiert')].filter((x, i, l) => l.findIndex((y) => y.text === x.text) === i),
        H('E', 'Alle Punkte einer proportionalen Zuordnung liegen auf der Geraden durch den Nullpunkt und den gegebenen Punkt.'), { bild: sbild(achsen(a.x, a.y, Math.max(x0, y0) * f + 1 > 13 ? 13 : Math.max(x0 * f, 6) + 1, y0 * f + 2), { punkte: [[E(x0), E(y0)]] }), nachweis: [DS('prop', [String(x0), String(y0)], String(x0 * f), String(y0 * f))] }); },
    // Tarife vergleichen: eine proportionale Zuordnung und eine mit Grundgebühr.
    () => { const m = wahl([3, 4]), c = wahl([4, 6]), mb = m - 2, xs = c / 2, a = achsen(['Zeit in h', 1000], ['Kosten in €', 2000], 7, (6 * m) / 2 + 1), kn = kind();
      if ((m * xs) % 2) return null;
      return auswahl(Z(`Das Schaubild zeigt die Kosten bei zwei Fahrradverleihen A und B. ${kn} sagt: „A ist proportional und deshalb immer billiger.“`, 'Beurteile die Aussage.'), [opt(`Falsch. A ist proportional, aber nur bis ${xs} h billiger. Ab ${xs} h kostet B weniger.`, true), opt('Stimmt. Die Gerade von A beginnt im Nullpunkt und bleibt darunter.', false), opt('Falsch. B ist proportional, weil die Gerade flacher ist.', false, 'je-mehr-proportional'), opt('Stimmt. Proportionale Zuordnungen haben keine Grundgebühr.', false), opt(`Falsch. A ist erst ab ${xs} h billiger.`, false)],
        H('E', 'Lies am Schnittpunkt der beiden Geraden ab, wann beide Verleihe gleich viel kosten.'), { bild: sbild(a, { zuege: [{ punkte: [[0, 0], [6000, E(6 * m)]], n: 'A' }, { punkte: [[0, E(c)], [6000, E(c + 6 * mb)]], n: 'B', stil: 'zweite' }] }),
          nachweis: [ABL(xs, m * xs, { zug: 0, hilf: true }), ABL(xs, m * xs, { zug: 1, hilf: true }), ABL(6, 6 * m, { zug: 0, hilf: true }), ABL(6, c + 6 * mb, { zug: 1, hilf: true }), URTEIL(false)] }); },
  ]);

  // ================= S2: ablesen und Punkte eintragen =================
  // Ablesen: gesucht 'y' (Wert zu x) oder 'x' (zu welchem x gehört y). xWahl in ganzen oder halben Einheiten.
  const ablesen = (n, namen, xmax, xWahl, gesucht = 'y', opts = {}) => () => { const k = K(...namen), j = opts.preise ? wahl(opts.preise) : je(k, n === 'E' ? 'M' : n), a = achsenFuer(k, j, xmax, opts);
    if (!a || (n === 'F' && a.y[1] % 1000 !== 0)) return null;
    const x = E(wahl(xWahl)), y = (x * j) / 1000, f1 = fy(k), nachbar = ((x + a.x[1]) * j) / 1000;
    const hilfen = H(n, gesucht === 'y' ? `Gehe an der Achse nach rechts bis ${t(x)}. Gehe dann hoch ${k.stueck ? 'zum Punkt' : 'zur Geraden'}.` : `Suche ${f1(y)} an der Achse nach oben. Gehe nach rechts ${k.stueck ? 'zum Punkt' : 'zur Geraden'}.`, gesucht === 'y' ? 'Links an der Achse liest du den Wert ab.' : 'Unten an der Achse liest du den Wert ab.', 'Bestimme zuerst den Wert von einem Kästchen an jeder Achse.');
    const bild = propBild(k, a, j, xmax);
    if (gesucht === 'y') return zahl(Z(k.bed, `Lies den Wert für ${k.kurz(x)} am Schaubild ab.`), y, k.ye, [[(x / a.x[1]) * 1000 === x ? (y / a.y[1]) * 1000 : (x / a.x[1]) * 1000, 'einteilung-uebersehen'], [x, 'schaubild-achsen-vertauscht'], [nachbar, 'tabelle-falsche-zeile']], hilfen, { bild, nachweis: [ABL(t(x), f1(y))] }, f1);
    return zahl(Z(k.bed, `Gegeben: ${kurzY(k, y)}.`, `Lies am Schaubild ${PASSEND[k.xn.split(' ')[0]]} ab.`), x, k.xe, [[y, 'schaubild-achsen-vertauscht'], [(y / a.y[1]) * 1000, 'einteilung-uebersehen']], hilfen, { bild, nachweis: [ABL(t(x), f1(y), { gesucht: 'x' })] }); };
  // Punkte aus Tabelle oder Text eintragen.
  const eintragen = (n, namen, xmax, xsWahl, ausText = false, opts = {}) => () => { const k = K(...namen), j = opts.preise ? wahl(opts.preise) : je(k, n === 'E' ? 'M' : n), a = achsenFuer(k, j, xmax, opts);
    if (!a || (n === 'F' && a.y[1] % 1000 !== 0)) return null;
    const xs = wahl(xsWahl), paare = xs.map((x) => [E(x), Math.round(x * j)]), f1 = fy(k), nf = n === 'F' ? null : { text: 'Liegen die Punkte auf einer Geraden durch den Nullpunkt?', optionen: [opt('Ja', true), opt('Nein', false)] };
    const fehler = [[paare.map(([x, y]) => [y, x]), 'schaubild-achsen-vertauscht'], [paare.map(([x, y]) => [x, (y / a.y[1]) * 1000 === y ? y : (y * a.y[1]) / 1000]), 'einteilung-uebersehen']];
    const text = ausText ? Z(k.bed, k.geg(1000, j), `Trage die Punkte für ${xs.slice(0, -1).map((x) => t(E(x))).join(', ')} und ${k.kurz(E(xs.at(-1)))} ein.`) : Z('Die Tabelle zeigt eine proportionale Zuordnung.', n === 'F' ? 'Trage zu jeder Spalte einen Punkt ein.' : `Trage die ${xs.length === 3 ? 'drei' : 'vier'} Wertepaare als Punkte ein.`);
    return punkteEintragen(text, a, paare, fehler, H(n, 'Gehe zuerst nach rechts bis zum ersten Wert. Gehe dann nach oben bis zum zweiten Wert.', 'Für „2 → 6“ gehst du bis zur 2 nach rechts und bis zur 6 nach oben.', ausText ? `Berechne zuerst die Werte. Beginne mit ${k.kurz(E(xs[0]))}.` : `Beginne mit ${t(paare[0][0])} nach rechts und ${f1(paare[0][1])} nach oben.`),
      { bild: ausText ? null : wbild({ namen: [k.xn, k.yn], paare: paarText(paare, f1) }), nachfrage: nf, nachweis: [...(ausText ? paare.map(([x, y]) => `${t(x)} · ${f1(j)} ${k.ye} = ${f1(y)} ${k.ye}`) : []), PKT(paarText(paare, f1), { frei: ausText })] }); };
  // Tabelle aus dem Schaubild ergänzen.
  const tabelleAusBild = (n, namen, xmax, xs, opts = {}) => () => { const k = K(...namen), j = je(k, n), a = achsenFuer(k, j, xmax, opts);
    if (!a || (n === 'F' && a.y[1] % 1000 !== 0)) return null;
    return wertetabelle(Z(k.bed, 'Lies die Werte am Schaubild ab und ergänze die Tabelle.'), [k.xn, k.yn], xs.map((x) => [t(E(x)), LK(`y${x}`.replace('.', '_'), Math.round(x * j), [[E(x), 'schaubild-achsen-vertauscht'], [(Math.round(x * j) / a.y[1]) * 1000, 'einteilung-uebersehen']], fy(k))]),
      H(n, `Gehe für jeden Wert nach rechts und dann hoch ${k.stueck ? 'zum Punkt' : 'zur Geraden'}.`, 'Links an der Achse liest du den zweiten Wert ab.', `Beginne mit ${k.kurz(E(xs[0]))}.`), { bild: propBild(k, a, j, xmax), nachweis: [TAB('bild')] }); };
  // Ablesen und weiterrechnen: Der gesuchte Wert liegt außerhalb des Schaubilds.
  const weiter = (n, namen, xmax, xab, faktor, preise = null) => () => { const k = K(...namen), j = preise ? wahl(preise) : je(k, n), a = achsenFuer(k, j, xmax, n === 'G' ? {} : { sx: 500 });
    if (!a) return null; const x = E(xab), y = (x * j) / 1000, f1 = fy(k), x2 = x * faktor, y2 = y * faktor;
    return zahl(Z(k.bed, `Lies den Wert für ${k.kurz(x)} am Schaubild ab.`, `Berechne damit den Wert für ${k.kurz(x2)}.`), y2, k.ye, [[y, 'sach-schritt-vergessen'], [y + (x2 - x), 'prop-addiert']],
      H(n, `${t(x2)} steht nicht mehr im Schaubild.`, `${t(x2)} ist das ${faktor}-Fache von ${t(x)}.`, `Lies den Wert für ${t(x)} ab und rechne mal ${faktor}.`), { bild: propBild(k, a, j, xmax), nachweis: [ABL(t(x), f1(y), { hilf: true }), DS('prop', [t(x), f1(y)], t(x2), f1(y2), { frei: true })] }, f1); };
  // Heftaufgabe: Schaubild zeichnen, Einteilung selbst wählen, Kontrollwert ablesen.
  const heft = (n, namen, x0, xk, preise) => () => { const k = K(...namen), j = wahl(preise), y0 = x0 * j, f1 = fy(k), yk = Math.round(xk * j);
    if (k.geld && yk % 10 !== 0) return null;
    return zahl(Z(`${k.bed} ${k.geg(E(x0), y0)}`, `Zeichne das Schaubild der Zuordnung in dein Heft. Wähle die Einteilung der Achsen selbst und zeichne die Gerade durch den Nullpunkt und den Punkt (${t(E(x0))} | ${f1(y0)}).`, `Lies an deinem Schaubild den Wert für ${k.kurz(E(xk))} ab und gib ihn an.`), yk, k.ye, [[y0, 'sach-schritt-vergessen'], [y0 + E(xk - x0), 'prop-addiert']],
      H(n, 'Wähle die Einteilung so, dass alle Werte auf das Blatt passen und jeder Schritt gleich viel wert ist.', `Zeichne die Achsen mit dem Lineal. Kontrolliere mit einer Rechnung: Der Wert für 1 ist ${f1(y0)} ${k.ye} : ${t(E(x0))}.`), { nachweis: [DS('prop', [t(E(x0)), f1(y0)], t(E(xk)), f1(yk))] }, f1); };
  sechs(S2, 'F', [
    ablesen('F', LINIE, 5, [2, 3, 4]),
    ablesen('F', ['wandern', 'hahn', 'kartoffeln'], 5, [2, 3, 4], 'x'),
    eintragen('F', ['hefte', 'eis', 'hafer'], 5, [[1, 3], [2, 4], [2, 5], [3, 4]]),
    ablesen('F', STUECK, 5, [2, 3, 4, 5]),
    tabelleAusBild('F', ['wandern', 'hahn', 'hafer'], 5, [1, 2, 4]),
    eintragen('F', ['hefte', 'eis', 'hafer'], 5, [[2, 3], [3, 5], [2, 4]], true),
  ]);
  sechs(S2, 'G', [
    ablesen('G', LINIE, 5, [2, 3, 4]),
    ablesen('G', LINIE, 6, [3, 4, 5], 'x'),
    eintragen('G', ['hefte', 'eis', 'hafer', 'broetchen'], 6, [[1, 3, 5], [2, 4, 6], [2, 3, 5]]),
    tabelleAusBild('G', LINIE, 6, [1, 3, 5]),
    eintragen('G', ['hefte', 'eis', 'hafer'], 6, [[2, 4, 5], [1, 3, 6]], true),
    weiter('G', ['kartoffeln', 'aepfel', 'hahn'], 5, 2, 10, [2000, 4000, 5000, 10000]),
  ]);
  sechs(S2, 'M', [
    ablesen('M', ['wandern', 'hahn', 'rad'], 4, [1.5, 2.5, 3.5], 'y', { sx: 500, preise: PM }),
    ablesen('M', ['wandern', 'hahn'], 4, [1.5, 2.5, 3.5], 'x', { sx: 500, preise: PM }),
    eintragen('M', GELDL, 4, [[0.5, 2, 3.5], [1, 1.5, 3, 4], [0.5, 1.5, 2.5]], false, { sx: 500, preise: [2000, 4000] }),
    heft('M', GELDL, 2, 3.5, [2400, 2800, 3200, 3600]),
    weiter('M', ['hahn', 'kartoffeln', 'aepfel'], 4, 2.5, 4, [2000, 4000]),
    heft('M', ['wandern', 'rad', 'hahn'], 4, 2.5, [3000, 4000, 5000, 6000, 12000, 15000]),
  ]);
  sechs(S2, 'E', [
    ablesen('E', ['wandern', 'hahn', 'rad'], 4, [0.5, 1.5, 2.5, 3.5], 'y', { sx: 500, preise: PM }),
    ablesen('E', ['wandern', 'hahn', 'rad'], 4, [0.5, 1.5, 2.5, 3.5], 'x', { sx: 500, preise: PM }),
    eintragen('E', GELDL, 4, [[0.5, 1.5, 2.5, 4], [1, 2.5, 3, 3.5]], true, { sx: 500, preise: [2000, 4000] }),
    heft('E', GELDL, 4, 2.5, [2400, 2800, 3200, 3600]),
    // Fehlersuche: Ein eingetragener Punkt passt nicht zur proportionalen Zuordnung.
    () => { const k = K('hefte', 'eis', 'hafer'), j = wahl([2000, 3000]), a = achsenFuer(k, j, 5, { hoch: 12 }), i = zz(1, 3), xs = [1, 2, 3, 4], kn = kind();
      if (!a) return null; const pts = xs.map((x, n) => [E(x), x * j + (n === i ? a.y[1] : 0)]), o = ([x, y]) => `(${t(x)} | ${t(y)})`;
      return auswahl(Z(`${k.bed} ${kn} hat vier Punkte eingetragen. Ein Punkt liegt falsch.`, 'Kreuze den falschen Punkt an.'), pts.map((p, n) => opt(o(p), n === i)),
        H('E', 'Die Punkte einer proportionalen Zuordnung liegen auf einer Geraden durch den Nullpunkt.'), { bild: sbild(a, { punkte: pts }), nachweis: [EIN(pts.filter((_, n) => n !== i).map(([x, y]) => [t(x), t(y)]), null, { ist: 'prop' }), EIN(pts.map(([x, y]) => [t(x), t(y)]), null, { ist: 'keines' }), FREI('Der abweichende Punkt hat einen anderen Quotienten als die drei übrigen')] }); },
    heft('E', ['wandern', 'rad', 'hahn'], 2.5, 4, [3000, 4000, 5000, 6000, 12000, 15000]),
  ]);
}
