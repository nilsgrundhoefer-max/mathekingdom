// Aufgaben zu 6.7.7 „Antiproportionale Zuordnungen“ (Lernziele A1, A2) und 6.7.8 „Dreisatz bei antiproportionalen Zuordnungen“ (U1, U2)
// nach ADR 0015 und ADR 0050. Beide Stationen sind Niveau-Meilensteine mit der Marke E: je Lernziel 24 Aufgaben auf E.
// A1: antiproportionale Zuordnungen erkennen (Tabelle, Text, Schaubild). Die gekrümmte Kurve wird nur erkannt und abgelesen, nie gezeichnet.
//     Gegenbeispiele: proportionale Zuordnungen und fallende Geraden („je mehr, desto weniger“ reicht nicht).
// A2: mit dem gleichen Produkt rechnen und Wertetabellen ergänzen.
// U1: Dreisatz mit Gegenrechnung, acht der 24 Aufgaben im Heft. U2: erst entscheiden (proportional, antiproportional, keines von beiden),
//     dann rechnen; etwa ein Viertel der Aufgaben ist „keines von beiden“.

import { zz, wahl, mische, suche, Z, opt, auswahl, kind, sechs, H, FREI, E, t, g, zahl, luecken, lk, LK, PF, wertetabelle, dreisatz, mitEinheit, wbild, dbild, achsen, sbild, kurve, karten,
  TAB, DS, EIN, ABL, WERT, URTEIL, KARTE, KONTEXTE, ANTI, fy, je, teiler, paarText } from './6-7-zuordnungen.mjs';

const A1 = '6.7.7-A1', A2 = '6.7.7-A2', U1 = '6.7.8-U1', U2 = '6.7.8-U2';
const AK = (...namen) => { const name = wahl(namen.length ? namen : Object.keys(ANTI)); return { name, ...ANTI[name] }; };
const STUECK = ['pumpen', 'handwerker', 'futter', 'bus', 'lkw'], ALLE = Object.keys(ANTI);
const Y = (k, v) => `${fy(k)(v)} ${k.ye}`;
const kopf = (k) => [k.xn.replace(/ in .+$/, ''), k.yn.replace(/ in .+$/, '')];
// Wertepaare einer antiproportionalen Zuordnung: Produkt p (ganze Zahl), `anzahl` Teiler als erste Werte, alle zweiten Werte mindestens 2.
function antiPaare(k, anzahl, { max = 12, halbe = false } = {}) {
  return suche(() => { const p = wahl(k.k), xs = mische((k.xs ?? teiler(p, 2, max)).filter((x) => p % x === 0 && p / x >= 2)).slice(0, anzahl).sort((a, b) => a - b); return { p, paare: xs.map((x) => [E(x), E(p / x)]) }; }, (r) => r.paare.length === anzahl && (halbe || true));
}
const pt = (k, paare) => paarText(paare, fy(k));
const tab = (k, paare, n) => ({ ...(n ? { n } : {}), namen: [k.xn, k.yn], paare: pt(k, paare) });
const produkt = (k, [x, y]) => `${t(x)} · ${fy(k)(y)}`;
const ANTW = { anti: (p) => `Antiproportional. Das Produkt ist immer ${p}.`, prop: (q) => `Proportional. Der Quotient ist immer ${q}.`, keines: 'Keines von beiden. Weder das Produkt noch der Quotient bleibt gleich.' };

export function antiproportional6() {
  // ================= A1: erkennen =================
  // Tabelle einordnen. art: 'anti', 'prop' oder 'fallend' (gleichmäßig fallend, also keines von beiden).
  const FALLEND = [{ xn: 'Zeit in h', yn: 'Höhe der Kerze in cm' }, { xn: 'Anzahl verkaufter Karten', yn: 'Anzahl freier Plätze' }, { xn: 'Zeit in min', yn: 'Wasser im Fass in l' }];
  const fallendPaare = () => { const xs = mische([1, 2, 3, 4, 6]).slice(0, 3).sort((a, b) => a - b), d = wahl([1, 2, 3]), start = d * xs[2] + zz(3, 9); return xs.map((x) => [E(x), E(start - d * x)]); };
  const einordnen = (art, namen) => () => { const anti = art === 'anti' ? AK(...namen) : null, q = wahl([2, 3, 4, 5]);
    const k = anti ?? (art === 'prop' ? { ...KONTEXTE[wahl(['hafer', 'schmied', 'hahn', 'wandern'])] } : wahl(FALLEND)), r = anti ? antiPaare(anti, 3) : null;
    const paare = anti ? r.paare : art === 'prop' ? mische([2, 3, 4, 5, 6]).slice(0, 3).sort((a, b) => a - b).map((x) => [E(x), E(q * x)]) : fallendPaare();
    const f = (v) => t(v), prod = (paare[0][0] * paare[0][1]) / 1e6, quot = (paare[0][1] * 1000) / paare[0][0];
    if (art === 'fallend' && paare.every(([x, y]) => x * y === paare[0][0] * paare[0][1])) return null;
    const optionen = [opt(ANTW.anti(prod), art === 'anti', art === 'fallend' ? 'je-mehr-proportional' : undefined), Number.isInteger(quot) ? opt(ANTW.prop(t(quot)), art === 'prop') : opt('Proportional. Zum Doppelten gehört das Doppelte.', false), opt(ANTW.keines, art === 'fallend'), opt(art === 'prop' ? 'Antiproportional. Beide Werte werden größer.' : 'Antiproportional. Der zweite Wert wird kleiner. Mehr muss man nicht prüfen.', false, 'je-mehr-proportional')];
    return auswahl(Z('Prüfe die Wertepaare der Tabelle mit dem Produkt und mit dem Quotienten.', 'Entscheide und begründe.'), optionen,
      H('E', 'Antiproportional: Das Produkt der Wertepaare ist immer gleich. Proportional: Der Quotient ist immer gleich.'), { bild: wbild({ namen: [k.xn, k.yn], paare: paarText(paare, f) }), nachweis: [EIN(paarText(paare, f), { anti: ANTW.anti(prod), prop: ANTW.prop(t(quot)), keines: ANTW.keines }), ...(art === 'anti' ? paare.slice(0, 2).map((x) => `${t(x[0])} · ${t(x[1])} = ${prod}`) : [])] }); };
  // Passendes Wertepaar: Zum Doppelten gehört die Hälfte.
  const passend = (namen) => () => { const k = AK(...namen), { p, paare } = antiPaare(k, 2), [[x0, y0], [x1, y1]] = paare, o = (y) => `${k.kurz(x1)} → ${Y(k, y)}`;
    const falsch = [[(y0 * x1) / x0, 'anti-proportional-gerechnet'], [y0 - (x1 - x0), 'prop-addiert'], [y0, undefined], [y1 + 1000, undefined]].filter(([v], i, l) => Number.isInteger(v) && v > 0 && v !== y1 && l.findIndex(([w]) => w === v) === i).slice(0, 3);
    return auswahl(Z(`${k.bed} ${k.geg(x0, y0)}`, 'Kreuze die Zuordnung an, die zu dieser antiproportionalen Zuordnung passt.'), [opt(o(y1), true), ...falsch.map(([v, fv]) => opt(o(v), false, fv))],
      H('E', 'Bei antiproportionalen Zuordnungen gehört zum Doppelten die Hälfte und zum Dreifachen ein Drittel. Das Produkt bleibt gleich.'), { nachweis: [DS('anti', pt(k, [[x0, y0]])[0], t(x1), fy(k)(y1))] }); };
  // Bildkarten: Welches Schaubild zeigt eine antiproportionale Zuordnung?
  const A_KARTE = (k) => achsen([k.xn, 1000], [k.yn, 1000], 8, 8);
  const kartenwahl = (namen, mitProp) => () => { const k = AK(...namen), a = A_KARTE(k), p = wahl([6, 8, 12]), namenK = mische(['A', 'B', 'C', 'D']);
    const liste = [[sbild(a, { zuege: [{ punkte: kurve(a, p * 1e6) }] }), true], [sbild(a, { zuege: [{ punkte: [[0, 8000], [8000, 0]] }] }), false, 'je-mehr-proportional'], [sbild(a, { zuege: [{ punkte: [[0, 0], [8000, mitProp ? 8000 : 4000]] }] }), false, 'anti-proportional-gerechnet'], [sbild(a, { zuege: [{ punkte: [[0, 6000], [4000, 2000], [8000, 2000]] }] }), false]];
    return karten(Z(k.bed, 'Kreuze das Schaubild an, das zu einer antiproportionalen Zuordnung passt.'), liste.map(([bild, r, fv], i) => [namenK[i], bild, r, fv]),
      H('E', 'Das Schaubild einer antiproportionalen Zuordnung ist eine gebogene Kurve, die fällt und keine Achse berührt. Prüfe ein Wertepaar: Zum Doppelten gehört die Hälfte.'), { nachweis: [KARTE('anti')] }); };
  // Aussage beurteilen: „Je mehr, desto weniger“ reicht nicht.
  const jeMehr = (antiWahr) => () => { const k = antiWahr ? AK(...ALLE) : wahl(FALLEND), kn = kind(), r = antiWahr ? antiPaare(k, 3) : null, paare = antiWahr ? r.paare : fallendPaare(), f = (v) => t(v);
    if (!antiWahr && paare.every(([x, y]) => x * y === paare[0][0] * paare[0][1])) return null;
    return auswahl(Z(`${kn} sagt: „Je größer der erste Wert, desto kleiner der zweite. Also ist die Zuordnung antiproportional.“`, 'Beurteile die Begründung mit der Tabelle.'),
      [opt(antiWahr ? `Falsch. Die Begründung reicht nicht. Die Zuordnung ist zwar antiproportional, aber nur, weil das Produkt immer ${r.p} ist.` : 'Falsch. Die Produkte der Wertepaare sind verschieden. Die Zuordnung ist nicht antiproportional.', true), opt('Stimmt. „Je mehr, desto weniger“ gilt nur bei antiproportionalen Zuordnungen.', false, 'je-mehr-proportional'), opt(antiWahr ? 'Falsch. Die Produkte der Wertepaare sind verschieden. Die Zuordnung ist nicht antiproportional.' : `Stimmt. Das Produkt ist immer ${(paare[0][0] * paare[0][1]) / 1e6}.`, false), opt('Falsch. Die Zuordnung ist proportional.', false, 'anti-proportional-gerechnet')],
      H('E', '„Je mehr, desto weniger“ gilt auch für andere Zuordnungen. Prüfe das Produkt der Wertepaare.'), { bild: wbild({ namen: [k.xn, k.yn], paare: paarText(paare, f) }), nachweis: [EIN(paarText(paare, f), null, { ist: antiWahr ? 'anti' : 'keines' }), ...paare.slice(0, 2).map((x) => `${t(x[0])} · ${t(x[1])} = ${(x[0] * x[1]) / 1e6}`), URTEIL(false)] }); };
  // An der Kurve ablesen.
  const anKurve = (namen, gesucht) => () => { const k = AK(...namen), p = wahl([12, 24]), sy = p === 12 ? 1000 : 2000, a = achsen([k.xn, 1000], [k.yn, sy], 13, 13), x = wahl(p === 12 ? [2, 3, 4, 6, 12] : [2, 3, 4, 6, 12]), y = p / x;
    if ((y * 1000) % sy !== 0) return null;
    const bild = sbild(a, { zuege: [{ punkte: kurve(a, p * 1e6) }] });
    return gesucht === 'y' ? zahl(Z(`${k.bed} Das Schaubild zeigt die Zuordnung.`, `Lies den Wert für ${k.kurz(E(x))} ab.`), E(y), k.ye, [[E(x), 'schaubild-achsen-vertauscht'], [E(y / (sy / 1000)), 'einteilung-uebersehen'], ...(p % (x + 1) === 0 ? [[E(p / (x + 1)), 'tabelle-falsche-zeile']] : [])], H('E', 'Gehe vom Wert an der Achse nach rechts hoch zur Kurve und von dort nach links zur anderen Achse.'), { bild, nachweis: [ABL(x, y)] }, fy(k))
      : zahl(Z(`${k.bed} Das Schaubild zeigt die Zuordnung.`, k.rueck(E(y), 'Lies am Schaubild ab')), E(x), k.xe, [[E(y), 'schaubild-achsen-vertauscht'], [E(y / (sy / 1000)), 'einteilung-uebersehen']], H('E', 'Suche den Wert an der Achse nach oben, gehe nach rechts zur Kurve und von dort nach unten.'), { bild, nachweis: [ABL(x, y, { gesucht: 'x' })] }); };
  // Situationen: Welche Zuordnung ist antiproportional?
  const SITU = [['Anzahl der Pumpen → Zeit zum Leeren eines Beckens (alle Pumpen arbeiten gleich schnell)', true], ['Anzahl der Personen → Preis je Person für einen Bus (die Miete bleibt gleich)', true], ['Geschwindigkeit → Fahrzeit für dieselbe Strecke', true], ['Anzahl der Pferde → Tage, die ein Hafervorrat reicht', true], ['Länge eines Rechtecks → Breite bei gleichem Flächeninhalt', true],
    ['Anzahl der Hefte → Preis (jedes Heft kostet gleich viel)', false, 'anti-proportional-gerechnet'], ['Brenndauer → Höhe einer Kerze', false, 'je-mehr-proportional'], ['Alter eines Kindes → Körpergröße', false], ['Zeit → Strecke bei gleichem Tempo', false, 'anti-proportional-gerechnet'], ['gelesene Seiten → Seiten, die im Buch noch übrig sind', false, 'je-mehr-proportional'], ['Anzahl der Kinder → Anzahl der Stühle im Zimmer', false]];
  const situation = (mehrfach) => () => { const ja = mische(SITU.filter((s) => s[1])).slice(0, mehrfach ? 2 : 1), nein = mische(SITU.filter((s) => !s[1])).slice(0, mehrfach ? 3 : 3);
    return auswahl(Z(mehrfach ? 'Kreuze alle antiproportionalen Zuordnungen an.' : 'Kreuze die antiproportionale Zuordnung an.'), [...ja, ...nein].map(([text, r, fv]) => opt(text, r, fv)), H('E', 'Frage dich: Gehört zum Doppelten die Hälfte? Dann bleibt das Produkt gleich.'), { mehrfach: mehrfach || undefined, nachweis: [FREI('Sachlogik: Eine feste Gesamtgröße wird aufgeteilt (Produkt bleibt gleich)')] }); };
  sechs(A1, 'E', [
    einordnen('anti', STUECK), passend(['pumpen', 'handwerker']), kartenwahl(['pumpen', 'handwerker'], false), jeMehr(false), anKurve(['pumpen', 'handwerker', 'lkw'], 'y'), situation(false),
    einordnen('prop', []), passend(['futter', 'lkw']), kartenwahl(['rechteck', 'futter'], true), jeMehr(true), anKurve(['pumpen', 'lkw'], 'x'), situation(true),
    einordnen('fallend', []), passend(['bus', 'rechteck']), einordnen('anti', ['tempo', 'rechteck', 'flaschen']), situation(false), anKurve(['futter', 'bus'], 'y'), jeMehr(false),
    einordnen('anti', ['bus', 'futter']), passend(['tempo', 'flaschen']), einordnen('fallend', []), situation(true), anKurve(['handwerker', 'futter'], 'x'), jeMehr(true),
  ], 24);

  // ================= A2: mit dem Produkt rechnen, Tabellen ergänzen =================
  const ergaenze = (namen, anzahl, offenX = []) => () => { const k = AK(...namen), { p, paare } = antiPaare(k, anzahl), geg = offenX.includes(0) ? 1 : 0, f = fy(k), [xg, yg] = paare[geg];
    const spalten = paare.map(([x, y], i) => (i === geg ? [t(x), f(y)] : offenX.includes(i) ? [LK(`x${i}`, x, [[(xg * y) / yg, 'anti-proportional-gerechnet'], [y, 'schaubild-achsen-vertauscht']]), f(y)] : [t(x), LK(`y${i}`, y, [[(yg * x) / xg, 'anti-proportional-gerechnet'], [yg - (x - xg), 'prop-addiert']], f)]));
    return wertetabelle(Z(`${k.bed} Die Zuordnung ist antiproportional.`, 'Ergänze die Tabelle.'), [k.xn, k.yn], spalten, H('E', `Das Produkt der Wertepaare bleibt gleich: ${produkt(k, paare[geg])}. Teile dieses Produkt durch den gegebenen Wert.`), { nachweis: [TAB('anti')] }); };
  // Wert für 1 bestimmen (das Produkt deuten).
  const fuerEins = (namen) => () => { const k = AK(...namen), { p, paare } = antiPaare(k, 1), [x0, y0] = paare[0];
    return zahl(Z(`${k.bed} ${k.geg(x0, y0)}`, k.auf(1000)), E(p), k.ye, [[y0 / (x0 / 1000), 'anti-proportional-gerechnet'], [y0, 'sach-schritt-vergessen']], H('E', 'Zum dritten Teil gehört bei antiproportionalen Zuordnungen das Dreifache.'), { nachweis: [DS('anti', pt(k, [[x0, y0]])[0], '1', fy(k)(E(p)), { frei: true })] }, fy(k)); };
  // Fehlersuche in einer Tabelle.
  const fehlerInTabelle = (namen) => () => { const k = AK(...namen), { p, paare } = antiPaare(k, 4), i = zz(1, 3), d = wahl([1000, 2000]), falsch = paare.map((x, n) => (n === i ? [x[0], x[1] + d] : x)), kn = kind();
    return zahl(Z(`${k.bed} ${kn} hat eine Tabelle zu dieser antiproportionalen Zuordnung geschrieben. Ein Wert in der zweiten Zeile ist falsch.`, 'Bestimme den richtigen Wert.'), paare[i][1], k.ye, [[falsch[i][1], 'sach-frage-verfehlt'], [E(p), 'sach-schritt-vergessen']], H('E', 'Berechne für jede Spalte das Produkt. Eine Spalte weicht ab.'), { bild: wbild(tab(k, falsch)), nachweis: [`${produkt(k, paare[0])} = ${p}`, `${p} : ${t(paare[i][0])} = ${fy(k)(paare[i][1])}`, WERT(fy(k)(paare[i][1]))] }, fy(k)); };
  // Produkte im Lückentext.
  const produkte = (namen) => () => { const k = AK(...namen), { p, paare } = antiPaare(k, 3), z = (v) => v / 1000;
    return luecken(Z(`${k.bed} ${k.geg(...paare[0])}`, 'Ergänze die Rechnungen mit dem gleichen Produkt.', `${z(paare[0][0])} · ${z(paare[0][1])} = {{a}}`, `${z(paare[1][0])} · {{b}} = ${p}`, `{{c}} · ${z(paare[2][1])} = ${p}`), { a: lk(E(p), [[paare[0][0] + paare[0][1], 'begriffe-verwechselt']]), b: lk(paare[1][1], [[(paare[0][1] * paare[1][0]) / paare[0][0], 'anti-proportional-gerechnet']]), c: lk(paare[2][0], []) },
      H('E', 'Bei einer antiproportionalen Zuordnung hat jedes Wertepaar dasselbe Produkt.'), { bild: wbild(tab(k, [paare[0]])), nachweis: [`${z(paare[0][0])} · ${z(paare[0][1])} = ${p}`] }); };
  // Rückwärts: Der erste Wert ist gesucht.
  const rueck = (namen) => () => { const k = AK(...namen), { paare } = antiPaare(k, 2), [[x0, y0], [x1, y1]] = paare;
    return zahl(Z(`${k.bed} ${k.geg(x0, y0)}`, k.rueck(y1)), x1, k.xe, [[(x0 * y1) / y0, 'anti-proportional-gerechnet'], [y1, 'schaubild-achsen-vertauscht']], H('E', 'Berechne zuerst das Produkt des gegebenen Wertepaars und teile es dann durch den bekannten zweiten Wert.'), { nachweis: [DS('anti', pt(k, [[x0, y0]])[0], t(x1), fy(k)(y1), { gesucht: 'x' })] }); };
  sechs(A2, 'E', [
    ergaenze(STUECK, 3), ergaenze(['tempo', 'rechteck', 'flaschen'], 4), fuerEins(['pumpen', 'handwerker', 'lkw']), fehlerInTabelle(STUECK), produkte(['pumpen', 'handwerker']), rueck(['pumpen', 'handwerker', 'futter']),
    ergaenze(['futter', 'bus', 'lkw'], 4), ergaenze(STUECK, 4, [3]), fuerEins(['futter', 'bus']), fehlerInTabelle(['tempo', 'rechteck', 'flaschen']), produkte(['rechteck', 'flaschen']), rueck(['tempo', 'rechteck']),
    ergaenze(['pumpen', 'handwerker'], 4), ergaenze(['tempo', 'rechteck'], 4, [2, 3]), produkte(['futter', 'lkw']), rueck(['bus', 'lkw']), ergaenze(['flaschen', 'bus'], 4, [1]), fehlerInTabelle(['pumpen', 'futter']),
    ergaenze(['rechteck', 'tempo'], 3), ergaenze(['handwerker', 'futter', 'lkw'], 4, [0, 3]), produkte(['tempo', 'bus']), rueck(['flaschen', 'handwerker']), ergaenze(['pumpen', 'bus'], 4, [1, 2]), fehlerInTabelle(['handwerker', 'lkw']),
  ], 24);

  // ================= U1: Dreisatz mit Gegenrechnung =================
  const dreiZahlen = (k) => { const { p, paare } = antiPaare(k, 2), [[x0, y0], [x1, y1]] = mische(paare); return { p, x0, y0, x1, y1 }; };
  const fehlerAnti = (z) => [[(z.y0 * z.x1) / z.x0, 'anti-proportional-gerechnet'], [E(z.p), 'dreisatz-zwischenwert'], [z.y0 - (z.x1 - z.x0), 'prop-addiert']];
  const dsTabelle = (namen) => () => { const k = AK(...namen), z = dreiZahlen(k), f = fy(k), a1 = z.x0 / 1000, a2 = z.x1 / 1000;
    return dreisatz(Z(`${k.bed} ${k.geg(z.x0, z.y0)}`, 'Ergänze die Dreisatztabelle und die Rechenpfeile. Achte auf die Gegenrechnung.'), kopf(k), [[k.kurz(z.x0), Y(k, z.y0)], [k.kurz(1000), mitEinheit(LK('ym', E(z.p), [[z.y0 / a1, 'anti-proportional-gerechnet']], f), k.ye)], [k.kurz(z.x1), mitEinheit(LK('y1', z.y1, fehlerAnti(z), f), k.ye)]],
      [[PF(':', 'pl1', a1), PF('·', 'pr1', a1)], [PF('·', 'pl2', a2), PF(':', 'pr2', a2)]], H('E', 'Links wird geteilt, rechts wird mit derselben Zahl malgenommen. In der zweiten Zeile ist es umgekehrt.'), { nachweis: [TAB('anti')] }); };
  const dsZahl = (namen, heft = false) => () => { const k = AK(...namen), z = dreiZahlen(k), kn = kind();
    return zahl(Z(`${k.bed} ${k.geg(z.x0, z.y0)}`, heft ? 'Im Heft: Schreibe den Dreisatz als Tabelle mit Rechenpfeilen und Gegenrechnung.' : null, k.auf(z.x1)), z.y1, k.ye, fehlerAnti(z), H('E', 'Rechne zuerst auf 1 zurück: Dabei wird der zweite Wert größer. Rechne dann auf den gesuchten Wert.'), { nachweis: [DS('anti', pt(k, [[z.x0, z.y0]])[0], t(z.x1), fy(k)(z.y1))] }, fy(k)); };
  const dsRueck = (namen, heft = false) => () => { const k = AK(...namen), z = dreiZahlen(k);
    return zahl(Z(`${k.bed} ${k.geg(z.x0, z.y0)}`, heft ? 'Im Heft: Schreibe den Dreisatz als Tabelle mit Rechenpfeilen und Gegenrechnung.' : null, k.rueck(z.y1)), z.x1, k.xe, [[(z.x0 * z.y1) / z.y0, 'anti-proportional-gerechnet'], [E(z.p), 'dreisatz-zwischenwert']], H('E', 'Schreibe die gegebene zweite Größe in die linke Spalte und rechne über 1 mit der Gegenrechnung.'), { nachweis: [DS('anti', pt(k, [[z.x0, z.y0]])[0], t(z.x1), fy(k)(z.y1), { gesucht: 'x' })] }); };
  // Fehlersuche: proportional gerechnet.
  const propGerechnet = (namen) => () => { const k = AK(...namen), z = suche(() => dreiZahlen(k), (r) => r.x1 > r.x0 && Number.isInteger((r.y0 * r.x1) / r.x0)), kn = kind(), falsch = (z.y0 * z.x1) / z.x0;
    return auswahl(Z(`${k.bed} ${k.geg(z.x0, z.y0)} ${kn} rechnet für ${k.kurz(z.x1)}: „Erst geteilt durch ${z.x0 / 1000}, dann mal ${z.x1 / 1000}. Das ergibt ${Y(k, falsch)}.“`, 'Beurteile die Rechnung.'),
      [opt(`Falsch. ${kn} hat proportional gerechnet. Richtig ist die Gegenrechnung: ${Y(k, z.y1)}.`, true), opt(`Stimmt. Zu ${k.kurz(z.x1)} gehören ${Y(k, falsch)}.`, false, 'anti-proportional-gerechnet'), opt(`Falsch. Richtig sind ${Y(k, E(z.p))}.`, false, 'dreisatz-zwischenwert'), opt('Stimmt. Beim Dreisatz wird immer erst geteilt und dann malgenommen.', false, 'anti-proportional-gerechnet')],
      H('E', 'Überlege zuerst: Wird der zweite Wert größer oder kleiner? Bei einer antiproportionalen Zuordnung steht rechts die Gegenrechnung.'), { nachweis: [DS('anti', pt(k, [[z.x0, z.y0]])[0], t(z.x1), fy(k)(z.y1), { hilf: true }), URTEIL(false)] }); };
  // Zwei Schritte: Ein Teil der Arbeit ist schon getan oder es kommen Helfer dazu.
  const zweiSchritte = (name, heft = false) => () => { const k = AK(name), z = suche(() => dreiZahlen(k), (r) => r.x1 > r.x0), mehr = (z.x1 - z.x0) / 1000, spart = z.y0 - z.y1;
    return zahl(Z(`${k.bed} ${k.geg(z.x0, z.y0)} Es kommen ${mehr === 1 ? 'noch 1' : `noch ${mehr}`} ${k.xe} dazu.`, heft ? 'Im Heft: Schreibe den Dreisatz als Tabelle mit Rechenpfeilen und Gegenrechnung.' : null, (k.name === 'lkw' ? 'Bestimme, wie viele Fahrten jeder Lastwagen dadurch weniger braucht.' : `Bestimme, um wie viele ${k.ye === 'h' ? 'Stunden' : k.ye} die Arbeit dadurch kürzer wird.`)), spart, k.ye, [[z.y1, 'sach-schritt-vergessen'], [E(mehr), 'sach-falsche-rechnung']], H('E', 'Bestimme zuerst die neue Anzahl. Rechne dann mit dem Dreisatz und vergleiche mit dem alten Wert.'),
      { nachweis: [`${z.x0 / 1000} + ${mehr} = ${z.x1 / 1000}`, DS('anti', pt(k, [[z.x0, z.y0]])[0], t(z.x1), fy(k)(z.y1), { zwischen: true, frei: true }), `${z.y0 / 1000} − ${z.y1 / 1000} = ${spart / 1000}`, WERT(spart / 1000)] }); };
  sechs(U1, 'E', [
    dsTabelle(['pumpen', 'handwerker']), dsZahl(['pumpen', 'lkw']), dsZahl(['handwerker', 'futter'], true), dsRueck(['pumpen', 'handwerker']), propGerechnet(['pumpen', 'handwerker', 'lkw']), zweiSchritte('pumpen', true),
    dsTabelle(['futter', 'lkw']), dsZahl(['tempo', 'bus']), dsZahl(['rechteck', 'flaschen'], true), zweiSchritte('handwerker'), propGerechnet(['futter', 'bus']), dsRueck(['tempo', 'futter'], true),
    dsTabelle(['rechteck', 'futter']), dsZahl(['futter', 'handwerker']), dsZahl(['bus', 'tempo'], true), dsRueck(['bus', 'lkw']), propGerechnet(['tempo', 'rechteck']), dsRueck(['rechteck', 'flaschen'], true),
    dsTabelle(['bus', 'flaschen']), dsZahl(['rechteck', 'flaschen']), dsZahl(['pumpen', 'lkw'], true), zweiSchritte('lkw'), dsRueck(['flaschen', 'futter']), zweiSchritte('handwerker', true),
  ], 24);

  // ================= U2: entscheiden und rechnen =================
  const O = { prop: 'proportional', anti: 'antiproportional', keines: 'keines von beiden' };
  // Nur entscheiden: Auswahl aus drei.
  const entscheide = (art) => () => { const kn = kind();
    const text = art === 'anti' ? (() => { const k = AK(...ALLE), z = dreiZahlen(k); return `${k.bed} ${k.geg(z.x0, z.y0)} Gesucht ist der Wert für ${k.kurz(z.x1)}.`; })()
      : art === 'prop' ? (() => { const k = KONTEXTE[wahl(['hefte', 'kartoffeln', 'wandern', 'hahn', 'hafer', 'mehl'])], j = je(k, 'G'), x0 = zz(2, 6), x1 = x0 + zz(1, 4); return `${k.bed} ${k.geg(E(x0), x0 * j)} Gesucht ist der Wert für ${k.kurz(E(x1))}.`; })()
        : wahl([`${kn} ist mit 6 Jahren 120 cm groß. Gesucht ist die Größe mit 12 Jahren.`, 'Ein Ei kocht in 8 Minuten hart. Gesucht ist die Kochzeit für 4 Eier im selben Topf.', 'Eine Kerze ist nach 2 Stunden noch 18 cm hoch. Gesucht ist die Höhe nach 4 Stunden.', 'Ein Handtuch trocknet auf der Leine in 3 Stunden. Gesucht ist die Zeit für 6 Handtücher nebeneinander.', `Eine Taxifahrt über 4 km kostet 11 €, darin stecken 3 € Grundgebühr. Gesucht ist der Preis für 8 km.`, '5 Musiker spielen ein Lied in 4 Minuten. Gesucht ist die Zeit, die 10 Musiker für das Lied brauchen.']);
    return auswahl(Z(text, 'Entscheide, welche Zuordnung vorliegt.'), [opt(O.prop, art === 'prop', art === 'anti' ? 'anti-proportional-gerechnet' : art === 'keines' ? 'je-mehr-proportional' : undefined), opt(O.anti, art === 'anti', art === 'prop' ? 'prop-antiproportional-gerechnet' : undefined), opt(O.keines, art === 'keines')].sort((p, q) => Object.values(O).indexOf(p.text) - Object.values(O).indexOf(q.text)),
      H('E', 'Prüfe: Gehört zum Doppelten das Doppelte (proportional), die Hälfte (antiproportional) oder keines von beiden?'), { nachweis: [FREI('Sachlogik der Situation')] }); };
  // Entscheiden und rechnen: Die Antworten nennen die Art und das Ergebnis.
  const entscheideUndRechne = (art) => () => {
    if (art === 'anti') { const k = AK(...ALLE), z = suche(() => dreiZahlen(k), (r) => Number.isInteger((r.y0 * r.x1) / r.x0) && (r.y0 * r.x1) / r.x0 !== r.y1), falsch = (z.y0 * z.x1) / z.x0;
      return auswahl(Z(`${k.bed} ${k.geg(z.x0, z.y0)}`, `Entscheide zuerst, welche Zuordnung vorliegt. ${k.auf(z.x1)}`), [opt(`antiproportional: ${Y(k, z.y1)}`, true), opt(`proportional: ${Y(k, falsch)}`, false, 'anti-proportional-gerechnet'), opt(`antiproportional: ${Y(k, falsch)}`, false, 'anti-proportional-gerechnet'), opt(`proportional: ${Y(k, z.y1)}`, false), opt('keines von beiden: Der Wert lässt sich so nicht berechnen.', false)],
        H('E', 'Überlege zuerst, ob der zweite Wert größer oder kleiner werden muss.'), { nachweis: [DS('anti', pt(k, [[z.x0, z.y0]])[0], t(z.x1), fy(k)(z.y1)), FREI('antiproportional, weil die Gesamtgröße gleich bleibt')] }); }
    const k = KONTEXTE[wahl(['hefte', 'kartoffeln', 'wandern', 'hahn', 'hafer', 'mehl'])], j = je(k, 'G'), [x0, x1] = mische([2, 3, 4, 6, 8, 12]).slice(0, 2), y0 = x0 * j, y1 = x1 * j, falsch = (y0 * x0) / x1, f = fy(k);
    if (!Number.isInteger(falsch) || (k.geld && falsch % 10)) return null;
    return auswahl(Z(`${k.bed} ${k.geg(E(x0), y0)}`, `Entscheide zuerst, welche Zuordnung vorliegt. ${k.auf(E(x1))}`), [opt(`proportional: ${f(y1)} ${k.ye}`, true), opt(`antiproportional: ${f(falsch)} ${k.ye}`, false, 'prop-antiproportional-gerechnet'), opt(`proportional: ${f(falsch)} ${k.ye}`, false, 'prop-antiproportional-gerechnet'), opt(`antiproportional: ${f(y1)} ${k.ye}`, false), opt('keines von beiden: Der Wert lässt sich so nicht berechnen.', false)],
      H('E', 'Überlege zuerst, ob der zweite Wert größer oder kleiner werden muss.'), { nachweis: [DS('prop', [t(E(x0)), f(y0)], t(E(x1)), f(y1)), FREI('proportional, weil jede Einheit gleich viel beiträgt')] }); };
  // Keines von beiden, mit Begründung.
  const KEINES = [
    (kn) => [`${kn} ist mit 6 Jahren 120 cm groß. ${kn} rechnet: „Mit 12 Jahren bin ich 240 cm groß.“`, 'Falsch. Ein Kind wächst nicht in jedem Jahr gleich viel. Die Zuordnung ist weder proportional noch antiproportional.', 'Stimmt. Zum doppelten Alter gehört die doppelte Größe.', 'Falsch. Die Zuordnung ist antiproportional: Mit 12 Jahren sind es 60 cm.'],
    () => ['Ein Ei kocht in 8 Minuten hart. Jemand rechnet: „4 Eier im selben Topf brauchen 32 Minuten.“', 'Falsch. Die Kochzeit hängt nicht von der Anzahl der Eier ab. Auch 4 Eier brauchen 8 Minuten.', 'Stimmt. Zur vierfachen Anzahl gehört die vierfache Zeit.', 'Falsch. Die Zuordnung ist antiproportional: 4 Eier brauchen 2 Minuten.'],
    () => ['5 Musiker spielen ein Lied in 4 Minuten. Jemand rechnet: „10 Musiker brauchen dafür 2 Minuten.“', 'Falsch. Das Lied dauert immer gleich lang. Die Zuordnung ist weder proportional noch antiproportional.', 'Stimmt. Zur doppelten Anzahl gehört die halbe Zeit.', 'Falsch. Die Zuordnung ist proportional: 10 Musiker brauchen 8 Minuten.'],
    () => ['Ein Handtuch trocknet auf der Leine in 3 Stunden. Jemand rechnet: „6 Handtücher nebeneinander brauchen 18 Stunden.“', 'Falsch. Alle Handtücher trocknen gleichzeitig. Auch 6 Handtücher brauchen 3 Stunden.', 'Stimmt. Zur sechsfachen Anzahl gehört die sechsfache Zeit.', 'Falsch. Die Zuordnung ist antiproportional: 6 Handtücher brauchen eine halbe Stunde.'],
    () => ['Eine Kerze ist am Anfang 24 cm hoch und nach 2 Stunden noch 18 cm. Jemand rechnet antiproportional: „Nach 4 Stunden ist sie noch 9 cm hoch.“', 'Falsch. Die Kerze wird in jeder Stunde um 3 cm kürzer. Nach 4 Stunden ist sie 12 cm hoch. Das Produkt bleibt nicht gleich.', 'Stimmt. Zur doppelten Zeit gehört die halbe Höhe.', 'Falsch. Die Zuordnung ist proportional: Nach 4 Stunden sind es 36 cm.'],
    () => ['Eine Taxifahrt über 4 km kostet 11 €, darin stecken 3 € Grundgebühr. Jemand rechnet: „8 km kosten 22 €.“', 'Falsch. Wegen der Grundgebühr ist die Zuordnung nicht proportional. 8 km kosten 19 €.', 'Stimmt. Zur doppelten Strecke gehört der doppelte Preis.', 'Falsch. Die Zuordnung ist antiproportional: 8 km kosten 5,50 €.'],
  ];
  const NACH = [['2 · 120 = 240'], ['4 · 8 = 32'], ['4 : 2 = 2'], ['6 · 3 = 18'], ['24 − 18 = 6', '6 : 2 = 3', '24 − 4 · 3 = 12'], ['11 − 3 = 8', '8 : 4 = 2', '3 + 8 · 2 = 19']];
  const keines = (i) => () => { const [text, richtig, f1, f2] = KEINES[i](kind());
    return auswahl(Z(text, 'Beurteile die Rechnung.'), [opt(richtig, true), opt(f1, false, i === 2 || i === 4 ? 'anti-proportional-gerechnet' : 'je-mehr-proportional'), opt(f2, false), opt('Stimmt. Mit dem Dreisatz lässt sich jede Zuordnung berechnen.', false, 'je-mehr-proportional')], H('E', 'Prüfe an der Sache, ob zum Doppelten wirklich das Doppelte oder die Hälfte gehört.'), { nachweis: [...NACH[i], URTEIL(false)] }); };
  // Nur das Ergebnis, die Art muss das Kind selbst erkennen.
  const rechne = (art) => () => {
    if (art === 'anti') { const k = AK(...ALLE), z = dreiZahlen(k); return zahl(Z(k.geg(z.x0, z.y0), `${k.bed} Entscheide zuerst: proportional oder antiproportional. ${k.auf(z.x1)}`), z.y1, k.ye, fehlerAnti(z), H('E', 'Überlege zuerst, ob der zweite Wert größer oder kleiner werden muss.'), { nachweis: [DS('anti', pt(k, [[z.x0, z.y0]])[0], t(z.x1), fy(k)(z.y1))] }, fy(k)); }
    const k = KONTEXTE[wahl(['hefte', 'kartoffeln', 'wandern', 'hahn', 'hafer', 'mehl'])], j = je(k, 'G'), [x0, x1] = mische([2, 3, 4, 5, 6, 8]).slice(0, 2), y0 = x0 * j, y1 = x1 * j, f = fy(k);
    return zahl(Z(k.geg(E(x0), y0), `${k.bed} Entscheide zuerst: proportional oder antiproportional. ${k.auf(E(x1))}`), y1, k.ye, [[(y0 * x0) / x1, 'prop-antiproportional-gerechnet'], [j, 'dreisatz-zwischenwert']].filter(([v]) => Number.isInteger(v) && (!k.geld || v % 10 === 0)), H('E', 'Überlege zuerst, ob der zweite Wert größer oder kleiner werden muss.'), { nachweis: [DS('prop', [t(E(x0)), f(y0)], t(E(x1)), f(y1))] }, f); };
  sechs(U2, 'E', [
    entscheide('anti'), entscheideUndRechne('prop'), entscheideUndRechne('anti'), keines(0), rechne('anti'), keines(5),
    entscheide('prop'), entscheideUndRechne('anti'), rechne('prop'), keines(1), entscheideUndRechne('prop'), rechne('anti'),
    entscheide('keines'), entscheideUndRechne('anti'), rechne('prop'), keines(2), entscheideUndRechne('prop'), keines(4),
    entscheide('anti'), entscheideUndRechne('prop'), rechne('anti'), keines(3), entscheideUndRechne('anti'), rechne('prop'),
  ], 24);
}
