// Aufgaben zu 6.7.1 „Zuordnungen und ihre Darstellungen“ (Lernziele D1, D2) nach ADR 0015 und ADR 0050.
// D1: Zuordnungen aus Tabelle und Schaubild lesen. D2: zwischen Text, Tabelle und Schaubild wechseln.
// Hier kommen bewusst auch Zuordnungen vor, die nicht proportional sind (Temperatur, Füllstand, Wanderung mit Pause).
// F liest an Achsen mit Einerschritten, G mit Einteilung 2, 5 oder 10, M auch mit 0,5 und zwei Linien, E deutet und beurteilt Verläufe.

import { zz, wahl, mische, suche, Z, opt, auswahl, kind, sechs, H, FREI, E, t, g, zahl, luecken, lk, LK, wertetabelle, wbild, achsen, sbild, punkteEintragen,
  TAB, ABL, PKT, WERT, URTEIL, karten, KPAARE } from './6-7-zuordnungen.mjs';

const D1 = '6.7.1-D1', D2 = '6.7.1-D2';
// Nachweise zum Lesen: ein Wertepaar der Tabelle im Bild; der höchste oder tiefste Punkt; das waagrechte Stück; der steilste Abschnitt.
const TW = (x, y, extra = {}) => ({ art: 'tabellenwert', x: String(x), y: String(y), ...extra });
const BX = (was, x, y, extra = {}) => ({ art: 'bildextrem', was, x: String(x), y: String(y), ...extra });
const FLACH = (von, bis, extra = {}) => ({ art: 'flach', von: String(von), bis: String(bis), ...extra });
const STEIL = (von, bis, extra = {}) => ({ art: 'steilst', von: String(von), bis: String(bis), ...extra });
const TABWAHL = (regel) => ({ art: 'tabwahl', regel });

// Temperaturen über den Tag: steigen bis zum Nachmittag und fallen dann. Alle Werte verschieden.
function temperaturen(zeiten, gipfel) {
  return suche(() => { let w = zz(6, 12); return zeiten.map((z, i) => { if (i > 0) w += zeiten[i - 1] < gipfel ? zz(2, 4) : -zz(1, 3); return w; }); }, (l) => new Set(l).size === l.length && Math.min(...l) >= 4 && Math.max(...l) <= 24);
}
const tempTab = (zeiten, werte) => wbild({ namen: ['Uhrzeit', 'Temperatur in °C'], paare: zeiten.map((z, i) => [`${z} Uhr`, String(werte[i])]) });
const A_TEMP = (h) => achsen(['Uhrzeit', 2000], ['Temperatur in °C', 2000], 10, h);
const tempBild = (zeiten, werte) => sbild(A_TEMP(Math.ceil(Math.max(...werte) / 2) + 1), { zuege: [{ punkte: zeiten.map((z, i) => [E(z), E(werte[i])]) }] });
// Gerade Temperaturen für das Schaubild (jeder Wert auf einer Gitterlinie).
const geradeTemp = (zeiten, gipfel) => suche(() => { let w = 2 * zz(2, 5); return zeiten.map((z, i) => { if (i > 0) w += zeiten[i - 1] < gipfel ? wahl([2, 4, 6]) : -wahl([2, 4]); return w; }); },
  (l) => Math.min(...l) >= 2 && Math.max(...l) <= 22 && l.filter((x) => x === Math.max(...l)).length === 1 && l.filter((x) => x === Math.min(...l)).length === 1);
// Wanderung mit Pause: Strecke in km nach jeder Stunde. Liefert [[h, km]] und die Stunde, in der die Pause beginnt.
function wanderung(stunden, tempo = [3, 4, 5]) {
  const pause = zz(2, stunden - 2), pts = [[0, 0]]; let km = 0;
  for (let h = 1; h <= stunden; h++) { if (h !== pause + 1) km += wahl(tempo); pts.push([h, km]); }
  return { pts, pause };
}
const A_WEG = (pts, sy = 2000, sx = 1000) => achsen(['Zeit in h', sx], ['Strecke in km', sy], Math.round((pts.at(-1)[0] * 1000) / sx) + 1, Math.ceil((pts.at(-1)[1] * 1000) / sy) + 1);
const zug = (pts, extra = {}) => ({ punkte: pts.map(([x, y]) => [E(x), E(y)]), ...extra });
// Regentonne: Wasser in Litern nach jeder Minute (steigt, bleibt nie stehen).
const tonne = (minuten, je = [1, 2, 3]) => { const pts = [[0, 0]]; let l = 0; for (let m = 1; m <= minuten; m++) { l += wahl(je); pts.push([m, l]); } return pts; };
// Größe eines Kindes nach Alter.
const groessen = (alter) => { let cm = zz(100, 110); return alter.map((a, i) => { if (i > 0) cm += zz(5, 8) * (a - alter[i - 1]); return cm; }); };

export function darstellungen6() {
  // ================= D1: Zuordnungen lesen =================
  sechs(D1, 'F', [
    () => { const z = [8, 10, 12, 14], w = temperaturen(z, 13), i = zz(1, 3);
      return zahl(Z('Die Tabelle zeigt die Temperatur an einem Tag.', `Lies die Temperatur um ${z[i]} Uhr ab.`), E(w[i]), '°C', [[E(w[i - 1]), 'tabelle-falsche-zeile'], [E(z[i]), 'schaubild-achsen-vertauscht']],
        H('F', 'Suche oben die Uhrzeit. Darunter steht die Temperatur.', 'Unter „8 Uhr“ steht die Temperatur um 8 Uhr.', `Suche oben „${z[i]} Uhr“. Lies die Zahl darunter.`), { bild: tempTab(z, w), nachweis: [TW(z[i], w[i])] }); },
    () => { const preis = wahl([1, 2]), n = zz(2, 5), a = achsen(['Anzahl Kugeln', 1000], ['Preis in €', 1000], 6, 5 * preis + 1), pts = [1, 2, 3, 4, 5].map((x) => [E(x), E(x * preis)]);
      return zahl(Z('Das Schaubild zeigt die Preise für Eis.', `Lies den Preis für ${n} Kugeln ab.`), E(n * preis), '€', [[E(n), 'schaubild-achsen-vertauscht'], [E((n - 1) * preis), 'tabelle-falsche-zeile']],
        H('F', 'Gehe an der Achse nach rechts bis zur Anzahl. Gehe dann nach oben bis zum Punkt.', 'Vom Punkt gehst du nach links. Dort steht der Preis.', `Gehe nach rechts bis ${n}. Gehe hoch zum Punkt und dann nach links.`), { bild: sbild(a, { punkte: pts }), nachweis: [ABL(n, n * preis)] }); },
    () => { const pts = tonne(7, [1, 2]), m = zz(2, 6), a = achsen(['Zeit in min', 1000], ['Wasser in l', 1000], 8, pts.at(-1)[1] + 1);
      return zahl(Z('Es regnet in eine Tonne.', 'Das Schaubild zeigt das Wasser in der Tonne.', `Lies ab, wie viel Wasser nach ${m} Minuten in der Tonne ist.`), E(pts[m][1]), 'l', [[E(m), 'schaubild-achsen-vertauscht'], [E(pts[m - 1][1]), 'tabelle-falsche-zeile']],
        H('F', 'Gehe an der Achse nach rechts bis zur Zeit. Gehe dann nach oben bis zur Linie.', 'Von der Linie gehst du nach links. Dort steht das Wasser in Litern.', `Gehe nach rechts bis ${m}. Gehe hoch zur Linie und dann nach links.`), { bild: sbild(a, { zuege: [zug(pts)] }), nachweis: [ABL(m, pts[m][1])] }); },
    () => { const z = [8, 10, 12, 14], w = temperaturen(z, 15), i = zz(0, 3);
      return zahl(Z('Die Tabelle zeigt die Temperatur an einem Tag.', `Gib die Uhrzeit an, zu der es ${w[i]} °C warm ist.`), E(z[i]), 'Uhr', [[E(w[i]), 'schaubild-achsen-vertauscht'], [E(z[(i + 1) % 4]), 'tabelle-falsche-zeile']],
        H('F', 'Suche unten die Temperatur. Darüber steht die Uhrzeit.', 'Über „12“ steht die Uhrzeit, zu der es 12 °C warm ist.', `Suche unten die Zahl ${w[i]}. Lies die Uhrzeit darüber.`), { bild: tempTab(z, w), nachweis: [TW(z[i], w[i], { gesucht: 'x' })] }); },
    () => { const alter = [6, 7, 8, 9, 10], cm = groessen(alter), kn = kind(), i = zz(1, 3), d = cm[i + 1] - cm[i];
      return zahl(Z(`Die Tabelle zeigt die Körpergröße von ${kn}.`, `Berechne, wie viel ${kn} von ${alter[i]} bis ${alter[i + 1]} Jahren gewachsen ist.`), E(d), 'cm', [[E(cm[i + 1]), 'sach-schritt-vergessen'], [E(cm[i]), 'sach-schritt-vergessen']],
        H('F', 'Lies beide Größen aus der Tabelle ab.', 'Von 100 cm bis 106 cm sind es 6 cm.', `Rechne ${cm[i + 1]} cm − ${cm[i]} cm.`), { bild: wbild({ namen: ['Alter in Jahren', 'Größe in cm'], paare: alter.map((x, j) => [x, cm[j]]) }), nachweis: [TW(alter[i], cm[i], { hilf: true }), TW(alter[i + 1], cm[i + 1], { hilf: true }), `${cm[i + 1]} cm − ${cm[i]} cm = ${d} cm`, WERT(d)] }); },
    () => { const preis = wahl([2, 3]), a = achsen(['Anzahl Hefte', 1000], ['Preis in €', 1000], 5, 4 * preis + 1), n = zz(2, 4);
      return auswahl(Z('Das Schaubild zeigt die Preise für Hefte.', 'Kreuze die passende Zuordnung an.'), [opt(`${n} Hefte → ${n * preis} €`, true), opt(`${n * preis} Hefte → ${n} €`, false, 'schaubild-achsen-vertauscht'), opt(`${n} Hefte → ${n * preis + 1} €`, false)],
        H('F', 'Der Pfeil zeigt von der Anzahl zum Preis.', '„2 Hefte → 4 €“ heißt: 2 Hefte kosten 4 €.', `Lies im Schaubild den Preis für ${n} Hefte ab.`), { bild: sbild(a, { punkte: [1, 2, 3, 4].map((x) => [E(x), E(x * preis)]) }), nachweis: [ABL(n, n * preis)] }); },
  ]);
  sechs(D1, 'G', [
    () => { const { pts } = wanderung(5, [2, 4, 6]), h = zz(2, 5);
      return zahl(Z('Eine Gruppe wandert.', 'Das Schaubild zeigt die Strecke.', 'Achte auf die Einteilung der Achsen.', `Lies ab, wie viele Kilometer die Gruppe nach ${h} h geschafft hat.`), E(pts[h][1]), 'km', [[E(pts[h][1] / 2), 'einteilung-uebersehen'], [E(h), 'schaubild-achsen-vertauscht']],
        H('G', 'Schau zuerst, wie viel ein Kästchen an jeder Achse wert ist.', 'Nach oben ist ein Kästchen 2 km wert.', `Gehe nach rechts bis ${h}. Gehe hoch zur Linie und lies links ab.`), { bild: sbild(A_WEG(pts), { zuege: [zug(pts)] }), nachweis: [ABL(h, pts[h][1])] }); },
    () => { const z = [8, 10, 12, 14, 16], w = temperaturen(z, 13), d = w[2] - w[0];
      return zahl(Z('Die Tabelle zeigt die Temperatur an einem Tag.', 'Berechne, um wie viel Grad es von 8 Uhr bis 12 Uhr wärmer wird.'), E(d), '°C', [[E(w[2]), 'sach-schritt-vergessen'], [E(w[1] - w[0]), 'tabelle-falsche-zeile']],
        H('G', 'Lies beide Temperaturen aus der Tabelle ab.', 'Von 9 °C auf 15 °C sind es 6 °C mehr.', `Rechne ${w[2]} °C − ${w[0]} °C.`), { bild: tempTab(z, w), nachweis: [TW(8, w[0], { hilf: true }), TW(12, w[2], { hilf: true }), `${w[2]} − ${w[0]} = ${d}`, WERT(d)] }); },
    () => { const pts = suche(() => tonne(6, [10, 20]), (p) => new Set(p.map((x) => x[1])).size === p.length), m = zz(2, 5), a = achsen(['Zeit in min', 1000], ['Wasser in l', 10000], 7, pts.at(-1)[1] / 10 + 1);
      return zahl(Z('Eine Wanne läuft voll.', 'Das Schaubild zeigt das Wasser in der Wanne.', `Gib die Zeit an, nach der ${pts[m][1]} l in der Wanne sind.`), E(m), 'min', [[E(pts[m][1] / 10), 'einteilung-uebersehen'], [E(pts[m][1]), 'schaubild-achsen-vertauscht']],
        H('G', 'Suche die Liter an der Achse nach oben. Gehe nach rechts bis zur Linie.', 'Von der Linie gehst du nach unten. Dort steht die Zeit.', `Suche ${pts[m][1]} an der Achse nach oben. Gehe zur Linie und dann nach unten.`), { bild: sbild(a, { zuege: [zug(pts)] }), nachweis: [ABL(m, pts[m][1], { gesucht: 'x' })] }); },
    () => { const alter = [6, 8, 10, 12], cm = groessen(alter), i = zz(0, 3), j = (i + 1) % 4;
      return auswahl(Z('Die Tabelle zeigt die Körpergröße von einem Kind.', 'Kreuze die passende Zuordnung an.'), [opt(`${alter[i]} Jahre → ${cm[i]} cm`, true), opt(`${alter[i]} Jahre → ${cm[j]} cm`, false, 'tabelle-falsche-zeile'), opt(`${cm[i]} Jahre → ${alter[i]} cm`, false, 'schaubild-achsen-vertauscht')],
        H('G', 'Ein Wertepaar steht in der Tabelle untereinander.', '„6 Jahre → 110 cm“ heißt: Mit 6 Jahren ist das Kind 110 cm groß.', `Suche oben ${alter[i]} und lies die Zahl darunter.`), { bild: wbild({ namen: ['Alter in Jahren', 'Größe in cm'], paare: alter.map((x, k) => [x, cm[k]]) }), nachweis: [TW(alter[i], cm[i])] }); },
    () => { const { pts, pause } = wanderung(6, [2, 4]);
      return auswahl(Z('Eine Gruppe wandert.', 'Das Schaubild zeigt die Strecke.', 'Kreuze an, wann die Gruppe Pause macht.'), [opt(`von ${pause} h bis ${pause + 1} h`, true), opt(`von ${pause - 1} h bis ${pause} h`, false), opt(`von ${pause + 1} h bis ${pause + 2} h`, false)],
        H('G', 'In der Pause kommt kein Kilometer dazu.', 'Dann läuft die Linie waagrecht.', 'Suche das Stück der Linie, das nicht steigt.'), { bild: sbild(A_WEG(pts), { zuege: [zug(pts)] }), nachweis: [FLACH(pause, pause + 1)] }); },
    () => { const z = [8, 10, 12, 14, 16], w = suche(() => geradeTemp(z, 13), (l) => l.filter((x) => x === Math.max(...l)).length === 1), max = Math.max(...w), im = w.indexOf(max), kn = kind(), sagt = wahl([12, 14]), stimmt = z[im] === sagt;
      return auswahl(Z('Das Schaubild zeigt die Temperatur an einem Tag.', `${kn} sagt: „Um ${sagt} Uhr war es am wärmsten.“`, 'Beurteile die Aussage.'), [opt(stimmt ? `Stimmt. Um ${sagt} Uhr sind es ${max} °C.` : `Falsch. Am wärmsten ist es um ${z[im]} Uhr mit ${max} °C.`, true), opt(stimmt ? `Falsch. Am wärmsten ist es um ${z[im === 2 ? 3 : 2]} Uhr.` : `Stimmt. Um ${sagt} Uhr sind es ${max} °C.`, false), opt('Falsch. Am wärmsten ist es um 16 Uhr.', false)],
        H('G', 'Am wärmsten ist es am höchsten Punkt der Linie.', 'Gehe vom höchsten Punkt nach unten. Dort steht die Uhrzeit.', 'Suche den höchsten Punkt. Lies die Uhrzeit und die Temperatur ab.'), { bild: tempBild(z, w), nachweis: [BX('max', z[im], max, { hilf: true }), URTEIL(stimmt)] }); },
  ]);
  sechs(D1, 'M', [
    () => { const je = wahl([2000, 4000]), a = achsen(['Gewicht in kg', 500], ['Preis in €', je / 4, 2, 2], 5, 9), x = wahl([500, 1500]);
      return zahl(Z('Das Schaubild zeigt den Preis für Kirschen.', `Lies den Preis für ${t(x)} kg ab.`), (x * je) / 1000, '€', [[(x / 500) * 1000, 'einteilung-uebersehen'], [x, 'schaubild-achsen-vertauscht']],
        H('M', 'Bestimme zuerst, wie viel ein Kästchen an jeder Achse wert ist.', `Gehe nach rechts bis ${t(x)}, hoch zur Geraden und dann nach links zur Achse.`), { bild: sbild(a, { zuege: [{ punkte: [[0, 0], [2000, 2 * je]] }] }), nachweis: [ABL(t(x), g((x * je) / 1000))] }, g); },
    () => { const ta = wahl([4, 5]), tb = ta - wahl([1, 2]), h = zz(2, 4), a = achsen(['Zeit in h', 1000], ['Strecke in km', 2000], 5, ta * 2 + 1), d = (ta - tb) * h;
      return zahl(Z('Das Schaubild zeigt die Wanderungen von Gruppe A und Gruppe B.', `Bestimme, wie viele Kilometer Gruppe A nach ${h} h mehr geschafft hat als Gruppe B.`), E(d), 'km', [[E(ta * h), 'sach-schritt-vergessen'], [E(tb * h), 'sach-schritt-vergessen'], [E(d / 2), 'einteilung-uebersehen']],
        H('M', 'Lies für beide Gruppen die Strecke nach derselben Zeit ab.', `Gruppe A: ${ta * h} km, Gruppe B: ${tb * h} km. Bilde den Unterschied.`), { bild: sbild(a, { zuege: [{ punkte: [[0, 0], [4000, E(ta * 4)]], n: 'A' }, { punkte: [[0, 0], [4000, E(tb * 4)]], n: 'B', stil: 'zweite' }] }),
          nachweis: [ABL(h, ta * h, { zug: 0, hilf: true }), ABL(h, tb * h, { zug: 1, hilf: true }), `${ta * h} km − ${tb * h} km = ${d} km`, WERT(d)] }); },
    () => { const z = [6, 8, 10, 12, 14, 16], w = suche(() => geradeTemp(z, 13), (l) => { const d = l.slice(1).map((x, i) => x - l[i]); return d.filter((x) => x === Math.max(...d)).length === 1; }), d = w.slice(1).map((x, i) => x - w[i]), i = d.indexOf(Math.max(...d));
      const o = (k) => `von ${z[k]} Uhr bis ${z[k + 1]} Uhr`, andere = mische([0, 1, 2, 3, 4].filter((k) => k !== i)).slice(0, 3);
      return auswahl(Z('Das Schaubild zeigt den Verlauf der Temperatur an einem Tag.', 'Kreuze den Abschnitt an, in dem die Temperatur am stärksten steigt.'), [opt(o(i), true), ...andere.map((k) => opt(o(k), false))],
        H('M', 'Am stärksten steigt die Temperatur dort, wo die Linie am steilsten nach oben läuft.', `Vergleiche, um wie viel Grad die Temperatur in jedem Abschnitt steigt. Von ${z[i]} Uhr bis ${z[i + 1]} Uhr sind es ${d[i]} °C.`), { bild: tempBild(z, w), nachweis: [STEIL(z[i], z[i + 1])] }); },
    () => { const stufen = [[20, 950], [50, 1100], [500, 1800], [1000, 2900]], gw = wahl([30, 45, 120, 250, 400, 600, 750]), s = stufen.find(([bis]) => gw <= bis), kn = kind();
      return zahl(Z(`Die Tabelle zeigt das Porto für Briefe. ${kn} verschickt einen Brief mit ${gw} g.`, 'Gib das Porto an.'), s[1], '€', stufen.filter((x) => x !== s).map(([, p]) => [p, 'tabelle-falsche-zeile']),
        H('M', 'Jede Spalte gilt für alle Briefe bis zu diesem Gewicht.', `${gw} g ist höchstens ${s[0]} g. Lies das Porto in dieser Spalte ab.`), { bild: wbild({ namen: ['Gewicht', 'Porto in €'], paare: stufen.map(([bis, p]) => [`bis ${bis} g`, g(p)]) }), nachweis: [TW(s[0], g(s[1]))] }, g); },
    () => { const { pts, pause } = suche(() => { const w = wanderung(6, [2, 4]); const lang = zz(1, 2); if (lang === 2 && w.pause <= 4) { for (let h = w.pause + 2; h <= 6; h++) w.pts[h][1] = w.pts[h - 1][1] + (h === w.pause + 2 ? 0 : 2); } return { ...w, lang }; }, (w) => w.pts.at(-1)[1] <= 20);
      const flach = pts.filter((p, i) => i > 0 && p[1] === pts[i - 1][1]).length;
      return zahl(Z('Das Schaubild zeigt eine Wanderung mit einer Pause.', 'Bestimme, wie lange die Pause dauert.'), E(flach), 'h', [[E(pause), 'schaubild-achsen-vertauscht'], [E(pause + flach), 'sach-schritt-vergessen']],
        H('M', 'In der Pause läuft die Linie waagrecht.', `Die Linie ist von ${pause} h bis ${pause + flach} h waagrecht. Berechne die Dauer.`), { bild: sbild(A_WEG(pts), { zuege: [zug(pts)] }), nachweis: [FLACH(pause, pause + flach, { hilf: true }), `${pause + flach} h − ${pause} h = ${flach} h`, WERT(flach)] }); },
    () => { const ta = 4, tb = wahl([2, 3]), vor = wahl([4, 6]), a = achsen(['Zeit in h', 1000], ['Strecke in km', 2000], 5, 9), kn = kind(), h = (vor / (ta - tb));
      const stimmt = Number.isInteger(h) && h <= 4;
      return auswahl(Z(`Gruppe B startet ${vor} km vor Gruppe A. ${kn} sagt: „Gruppe A holt Gruppe B innerhalb von 4 Stunden ein.“`, 'Beurteile die Aussage mit dem Schaubild.'), [opt(stimmt ? `Stimmt. Nach ${h} h haben beide Gruppen ${ta * h} km erreicht.` : 'Falsch. Nach 4 h liegt Gruppe B noch vor Gruppe A.', true), opt(stimmt ? 'Falsch. Die Linie von B liegt immer über der Linie von A.' : 'Stimmt. Die Linie von A ist steiler, also holt A sofort ein.', false), opt('Falsch. Gruppe A ist langsamer als Gruppe B.', false), opt('Stimmt. Gruppe A ist von Anfang an vor Gruppe B.', false)],
        H('M', 'Wo sich die beiden Linien treffen, sind beide Gruppen gleich weit.', 'Suche den Punkt, an dem sich die Linien schneiden, und lies die Zeit ab.'), { bild: sbild(a, { zuege: [{ punkte: [[0, 0], [4000, E(16)]], n: 'A' }, { punkte: [[0, E(vor)], [4000, E(vor + 4 * tb)]], n: 'B', stil: 'zweite' }] }),
          nachweis: stimmt ? [ABL(h, ta * h, { zug: 0, hilf: true }), ABL(h, ta * h, { zug: 1, hilf: true }), URTEIL(true)] : [ABL(4, 16, { zug: 0, hilf: true }), ABL(4, vor + 4 * tb, { zug: 1, hilf: true }), URTEIL(false)] }); },
  ]);
  sechs(D1, 'E', [
    () => { const je = wahl([40, 100, 200]), sx = 5000, a = achsen(['Zeit in min', sx], ['Wasser in l', je * 5000, 2], 8, 9), x = wahl([10000, 15000, 25000, 30000, 35000]);
      return zahl(Z('Das Schaubild zeigt, wie ein Schwimmbecken gefüllt wird.', `Lies die Wassermenge nach ${t(x)} min ab.`), x * je, 'l', [[(x / sx) * 1000, 'einteilung-uebersehen'], [x, 'schaubild-achsen-vertauscht']],
        H('E', 'Bestimme zuerst die Einteilung beider Achsen.'), { bild: sbild(a, { zuege: [{ punkte: [[0, 0], [40000, 40000 * je]] }] }), nachweis: [ABL(t(x), t(x * je))] }); },
    () => { const ta = wahl([4, 6]), tb = ta / 2, vor = wahl([4, 6, 8].filter((v) => v % tb === 0 && v / tb <= 4)), h = vor / tb, a = achsen(['Zeit in h', 1000], ['Strecke in km', 2000], 5, Math.max(ta * 2, (vor + 4 * tb) / 2) + 1);
      return zahl(Z(`Gruppe B startet ${vor} km vor Gruppe A. Das Schaubild zeigt beide Wanderungen.`, 'Bestimme, nach wie vielen Stunden Gruppe A die Gruppe B einholt.'), E(h), 'h', [[E(ta * h), 'schaubild-achsen-vertauscht'], [E(vor), 'sach-schritt-vergessen']],
        H('E', 'Am Schnittpunkt der beiden Linien sind beide Gruppen gleich weit.'), { bild: sbild(a, { zuege: [{ punkte: [[0, 0], [4000, E(ta * 4)]], n: 'A' }, { punkte: [[0, E(vor)], [4000, E(vor + 4 * tb)]], n: 'B', stil: 'zweite' }] }),
          nachweis: [ABL(h, ta * h, { zug: 0, gesucht: 'x' }), ABL(h, ta * h, { zug: 1, gesucht: 'x' })] }); },
    () => { const z = [6, 8, 10, 12, 14, 16, 18], w = geradeTemp(z, 13), max = Math.max(...w), min = Math.min(...w), d = max - min;
      return zahl(Z('Das Schaubild zeigt den Verlauf der Temperatur an einem Tag.', 'Bestimme den Unterschied zwischen der höchsten und der tiefsten Temperatur.'), E(d), '°C', [[E(max), 'sach-schritt-vergessen'], [E(Math.abs(w.at(-1) - w[0])), 'tabelle-falsche-zeile'], [E(d / 2), 'einteilung-uebersehen']],
        H('E', 'Suche den höchsten und den tiefsten Punkt der Linie und lies beide Temperaturen ab.'), { bild: tempBild(z, w), nachweis: [BX('max', z[w.indexOf(max)], max, { hilf: true }), BX('min', z[w.indexOf(min)], min, { hilf: true }), `${max} − ${min} = ${d}`, WERT(d)] }); },
    () => { const z = [6, 8, 10, 12, 14, 16], w = suche(() => geradeTemp(z, 11), (l) => { const d = l.slice(1).map((x, i) => x - l[i]); return d.filter((x) => x === Math.max(...d)).length === 1 && d[0] !== Math.max(...d); }), d = w.slice(1).map((x, i) => x - w[i]), i = d.indexOf(Math.max(...d)), kn = kind();
      return auswahl(Z(`Das Schaubild zeigt die Temperatur an einem Tag. ${kn} sagt: „Die Linie steigt von 6 Uhr bis ${z[w.indexOf(Math.max(...w))]} Uhr. Also wird es in dieser Zeit in jeder Stunde gleich schnell wärmer.“`, 'Beurteile die Aussage.'),
        [opt(`Falsch. Die Linie ist verschieden steil. Von ${z[i]} Uhr bis ${z[i + 1]} Uhr steigt die Temperatur um ${d[i]} °C, von ${z[0]} Uhr bis ${z[1]} Uhr nur um ${d[0]} °C.`, true), opt('Stimmt. Eine Linie, die steigt, steigt immer gleichmäßig.', false, 'je-mehr-proportional'), opt('Stimmt. Zwischen zwei Messungen liegen immer 2 Stunden.', false), opt('Falsch. Die Temperatur fällt in dieser Zeit.', false)],
        H('E', 'Vergleiche, wie steil die Linie in den einzelnen Abschnitten ist.'), { bild: tempBild(z, w), nachweis: [STEIL(z[i], z[i + 1], { hilf: true }), URTEIL(false)] }); },
    () => { const gb = zz(2, 5), km = wahl([2, 3]), xs = [1, 2, 3, 4], tab = (f) => ({ namen: ['Strecke in km', 'Preis in €'], paare: xs.map((x) => [x, f(x)]) });
      const [na, nb, nc] = mische(['A', 'B', 'C']), tabs = [{ n: na, f: (x) => gb + km * x }, { n: nb, f: (x) => (gb + km) * x }, { n: nc, f: (x) => km * x }].sort((p, q) => p.n.localeCompare(q.n));
      return auswahl(Z(`Eine Taxifahrt kostet ${gb} € Grundgebühr und dazu ${km} € für jeden Kilometer.`, 'Kreuze die Tabelle an, die zu dieser Zuordnung passt.'), [opt(`Tabelle ${na}`, true), opt(`Tabelle ${nb}`, false, 'grundgebuehr-uebersehen'), opt(`Tabelle ${nc}`, false, 'grundgebuehr-uebersehen')],
        H('E', 'Berechne den Preis für 1 km und für 2 km und vergleiche mit den Tabellen.'), { bild: wbild(...tabs.map((x) => ({ n: `Tabelle ${x.n}`, ...tab(x.f) }))), nachweis: [TABWAHL({ m: String(km), b: String(gb) })] }); },
    () => { const ta = wahl([4, 6]), tb = ta - 2, h = zz(2, 3), a = achsen(['Zeit in h', 1000], ['Strecke in km', 2000], 5, ta * 2 + 1), kn = kind(), d = (ta - tb) * h;
      return auswahl(Z(`Das Schaubild zeigt die Wanderungen von Gruppe A und Gruppe B. ${kn} sagt: „Der Abstand zwischen den Gruppen bleibt immer gleich.“`, 'Beurteile die Aussage.'),
        [opt(`Falsch. Nach ${h} h beträgt der Abstand ${d} km, nach 4 h schon ${(ta - tb) * 4} km.`, true), opt('Stimmt. Beide Linien sind Geraden.', false), opt('Stimmt. Beide Gruppen starten am selben Ort.', false), opt(`Falsch. Nach ${h} h beträgt der Abstand ${d / 2} km, nach 4 h nur noch ${(ta - tb) * 2 - 1} km.`, false, 'einteilung-uebersehen'), opt('Falsch. Gruppe B überholt Gruppe A.', false)],
        H('E', 'Lies den Abstand der beiden Linien zu zwei verschiedenen Zeiten ab.'), { bild: sbild(a, { zuege: [{ punkte: [[0, 0], [4000, E(ta * 4)]], n: 'A' }, { punkte: [[0, 0], [4000, E(tb * 4)]], n: 'B', stil: 'zweite' }] }),
          nachweis: [ABL(h, ta * h, { zug: 0, hilf: true }), ABL(h, tb * h, { zug: 1, hilf: true }), `${ta * h} km − ${tb * h} km = ${d} km`, ABL(4, ta * 4, { zug: 0, hilf: true }), ABL(4, tb * 4, { zug: 1, hilf: true }), `${ta * 4} km − ${tb * 4} km = ${(ta - tb) * 4} km`, URTEIL(false)] }); },
  ]);

  // ================= D2: Darstellung wechseln =================
  const A_HEFT = (preis, n) => achsen(['Anzahl Hefte', 1000], ['Preis in €', 1000], n + 1, n * preis + 1);
  sechs(D2, 'F', [
    () => { const preis = wahl([1, 2]), xs = mische([1, 2, 3, 4, 5]).slice(0, 2).sort(), a = A_HEFT(preis, 5), paare = xs.map((x) => [E(x), E(x * preis)]);
      return punkteEintragen(Z('Die Tabelle zeigt die Preise für Hefte.', 'Trage zu jeder Spalte einen Punkt ein.'), a, paare, [[paare.map(([x, y]) => [y, x]), 'schaubild-achsen-vertauscht']],
        H('F', 'Gehe zuerst nach rechts bis zur Anzahl. Gehe dann nach oben bis zum Preis.', 'Für 2 Hefte und 4 € gehst du 2 nach rechts und 4 nach oben.', `Beginne mit ${xs[0]} nach rechts und ${xs[0] * preis} nach oben.`), { bild: wbild({ namen: ['Anzahl Hefte', 'Preis in €'], paare: xs.map((x) => [x, x * preis]) }), nachweis: [PKT(paare.map(([x, y]) => [t(x), t(y)]))] }); },
    () => { const pts = tonne(6, [1, 2]), i = zz(1, 4), namen = ['Zeit in min', 'Wasser in l'], a = achsen([namen[0], 1000], [namen[1], 1000], 7, pts.at(-1)[1] + 1);
      return wertetabelle(Z('Das Schaubild zeigt das Wasser in einer Tonne.', 'Lies die Werte ab und ergänze die Tabelle.'), namen, [i, i + 1, i + 2].map((m) => [m, LK(`y${m}`, E(pts[m][1]), [[E(m), 'schaubild-achsen-vertauscht']])]),
        H('F', 'Gehe für jede Zeit nach rechts und dann hoch zur Linie.', 'Links an der Achse liest du das Wasser ab.', `Beginne mit ${i} Minuten.`), { bild: sbild(a, { zuege: [zug(pts)] }), nachweis: [TAB('bild')] }); },
    () => { const preis = wahl([2, 3]), n = zz(2, 4), kn = kind();
      return luecken(Z('Eine Kugel Eis kostet überall gleich viel.', `${kn} zahlt für ${n} Kugeln ${n * preis} €.`, 'Schreibe die Zuordnung mit Pfeil.', `{{a}} Kugeln → {{b}} €`), { a: lk(E(n), [[E(n * preis), 'schaubild-achsen-vertauscht']]), b: lk(E(n * preis), [[E(n), 'schaubild-achsen-vertauscht']]) },
        H('F', 'Vor dem Pfeil steht die Anzahl. Nach dem Pfeil steht der Preis.', '„2 Kugeln → 4 €“ heißt: 2 Kugeln kosten 4 €.', 'Suche im Text die Anzahl der Kugeln und den Preis.'), { bild: wbild({ namen: ['Anzahl Kugeln', 'Preis in €'], paare: [[n, n * preis], [n + 1, (n + 1) * preis]] }), nachweis: [TW(n, n * preis, { luecken: ['a', 'b'] })] }); },
    () => { const preis = wahl([1, 2]), a = achsen(['Anzahl Kugeln', 1000], ['Preis in €', 1000], 6, 5 * preis + 1), xs = mische([1, 2, 3, 4, 5]).slice(0, 3).sort(), namen = ['Anzahl Kugeln', 'Preis in €'];
      return wertetabelle(Z('Das Schaubild zeigt die Preise für Eis.', 'Lies die Preise ab und ergänze die Tabelle.'), namen, xs.map((x) => [x, LK(`y${x}`, E(x * preis), [[E(x), 'schaubild-achsen-vertauscht']])]),
        H('F', 'Gehe für jede Anzahl nach rechts und dann hoch zum Punkt.', 'Links an der Achse liest du den Preis ab.', `Beginne mit ${xs[0]} ${xs[0] === 1 ? 'Kugel' : 'Kugeln'}.`), { bild: sbild(a, { punkte: [1, 2, 3, 4, 5].map((x) => [E(x), E(x * preis)]) }), nachweis: [TAB('bild')] }); },
    () => { const preis = wahl([1, 2]), a = A_HEFT(preis, 5), n = zz(2, 4), b1 = sbild(a, { punkte: [[E(n), E(n * preis)]] }), kn = kind();
      return auswahl(Z(`${kn} kauft ${n} Hefte für ${n * preis} €.`, `${kn} hat dazu einen Punkt eingetragen.`, 'Prüfe den Punkt.'), [opt('Der Punkt liegt richtig.', true), opt(`Der Punkt liegt falsch. Er gehört zu ${n * preis} Heften.`, false, 'schaubild-achsen-vertauscht'), opt('Der Punkt liegt falsch. Er muss auf der Achse liegen.', false)],
        H('F', 'Gehe vom Punkt nach unten zur Anzahl und nach links zum Preis.', 'Für 3 Hefte und 6 € liegt der Punkt 3 nach rechts und 6 nach oben.', `Prüfe: Liegt der Punkt ${n} nach rechts und ${n * preis} nach oben?`), { bild: b1, nachweis: [ABL(n, n * preis, { hilf: true }), FREI('Lage des Punkts im Schaubild prüfen')] }); },
    () => { const z = [8, 9, 10, 11], w = suche(() => z.map(() => zz(3, 9)), (l) => new Set(l).size === 4), a = achsen(['Uhrzeit', 1000], ['Temperatur in °C', 1000], 12, 10), ix = mische([0, 1, 2, 3]).slice(0, 2).sort(), paare = ix.map((i) => [E(z[i]), E(w[i])]);
      return punkteEintragen(Z('Die Tabelle zeigt die Temperatur an einem Morgen.', `Trage die Punkte für ${z[ix[0]]} Uhr und ${z[ix[1]]} Uhr ein.`), a, paare, [[paare.map(([x, y]) => [y, x]), 'schaubild-achsen-vertauscht']],
        H('F', 'Gehe zuerst nach rechts bis zur Uhrzeit. Gehe dann nach oben bis zur Temperatur.', 'Für 8 Uhr und 5 °C gehst du 8 nach rechts und 5 nach oben.', `Beginne mit ${z[ix[0]]} nach rechts und ${w[ix[0]]} nach oben.`), { bild: wbild({ namen: ['Uhrzeit', 'Temperatur in °C'], paare: z.map((x, i) => [`${x} Uhr`, w[i]]) }), nachweis: [PKT(paare.map(([x, y]) => [t(x), t(y)]))] }); },
  ]);
  const NF_GERADE = (ja) => ({ text: 'Liegen die Punkte auf einer Geraden durch den Nullpunkt?', optionen: [opt('Ja', ja), opt('Nein', !ja, ja ? undefined : 'je-mehr-proportional')].map((o) => ({ ...o, ...(o.richtig ? { fehlvorstellung: undefined } : {}) })) });
  sechs(D2, 'G', [
    () => { const preis = wahl([2, 4, 6]), xs = mische([1, 2, 3, 4, 5]).slice(0, 3).sort(), a = achsen(['Anzahl Karten', 1000], ['Preis in €', 2000], 6, (5 * preis) / 2 + 1), paare = xs.map((x) => [E(x), E(x * preis)]);
      return punkteEintragen(Z('Die Tabelle zeigt die Preise für Eintrittskarten.', 'Trage die drei Wertepaare als Punkte ein.', 'Achte auf die Einteilung der Achsen.'), a, paare, [[paare.map(([x, y]) => [x, y * 2]), 'einteilung-uebersehen']],
        H('G', 'Nach oben ist ein Kästchen 2 € wert.', 'Für 3 Karten und 12 € gehst du 3 nach rechts und bis zur 12 nach oben.', `Beginne mit ${xs[0]} nach rechts und bis ${xs[0] * preis} nach oben.`), { bild: wbild({ namen: ['Anzahl Karten', 'Preis in €'], paare: xs.map((x) => [x, x * preis]) }), nachfrage: NF_GERADE(true), nachweis: [PKT(paare.map(([x, y]) => [t(x), t(y)]))] }); },
    () => { const { pts } = wanderung(5, [2, 4, 6]), namen = ['Zeit in h', 'Strecke in km'], hs = [1, 2, 3, 4, 5];
      return wertetabelle(Z('Das Schaubild zeigt eine Wanderung.', 'Lies die Strecken ab und ergänze die Tabelle.', 'Achte auf die Einteilung der Achsen.'), namen, hs.map((h) => [h, h % 2 ? LK(`y${h}`, E(pts[h][1]), [[E(pts[h][1] / 2), 'einteilung-uebersehen']]) : String(pts[h][1])]),
        H('G', 'Nach oben ist ein Kästchen 2 km wert.', 'Gehe für jede Zeit nach rechts und dann hoch zur Linie.', 'Beginne mit 1 h.'), { bild: sbild(A_WEG(pts), { zuege: [zug(pts)] }), nachweis: [TAB('bild')] }); },
    () => { const gb = wahl([2, 4]), km = 2, xs = [1, 2, 3], a = achsen(['Strecke in km', 1000], ['Preis in €', 2000], 5, 6), paare = xs.map((x) => [E(x), E(gb + km * x)]);
      return punkteEintragen(Z(`Eine Taxifahrt kostet ${gb} € Grundgebühr.`, `Dazu kommen ${km} € für jeden Kilometer.`, 'Trage die Punkte für 1 km, 2 km und 3 km ein.'), a, paare, [[xs.map((x) => [E(x), E(km * x)]), 'grundgebuehr-uebersehen']],
        H('G', 'Berechne zuerst die drei Preise.', `1 km kostet ${gb} € + ${km} € = ${gb + km} €.`, 'Trage dann jeden Preis über seiner Strecke ein.'), { nachfrage: NF_GERADE(false), nachweis: [`${gb} € + ${km} € = ${gb + km} €`, `${gb} € + 2 · ${km} € = ${gb + 2 * km} €`, `${gb} € + 3 · ${km} € = ${gb + 3 * km} €`, PKT(paare.map(([x, y]) => [t(x), t(y)]), { frei: true })] }); },
    () => { const preis = wahl([5, 10]), a = achsen(['Anzahl Karten', 1000], ['Preis in €', preis], 6, 6), namen = ['Anzahl Karten', 'Preis in €'];
      return wertetabelle(Z('Das Schaubild zeigt die Preise für Kinokarten.', 'Lies die Preise ab und ergänze die Tabelle.'), namen, [1, 2, 4, 5].map((x) => [x, LK(`y${x}`, E(x * preis), [[E(x), 'einteilung-uebersehen']])]),
        H('G', `Nach oben ist ein Kästchen ${preis} € wert.`, 'Gehe für jede Anzahl nach rechts und dann hoch zum Punkt.', 'Beginne mit 1 Karte.'), { bild: sbild(achsen(['Anzahl Karten', 1000], ['Preis in €', E(preis)], 6, 6), { punkte: [1, 2, 3, 4, 5].map((x) => [E(x), E(x * preis)]) }), nachweis: [TAB('bild')] }); },
    () => { const pts = suche(() => tonne(4, [5, 10]), (p) => p[4][1] <= 30), f = zz(1, 3), falsch = pts.map(([x, y]) => [x, x === f ? y + 5 : y]), ax2 = achsen(['Zeit in min', 1000], ['Wasser in l', 5000], 5, 7), [na, nb] = mische(['A', 'B']);
      return karten(Z('Eine Wanne läuft voll.', `${pts.slice(1, 4).map(([x, y]) => `${x} min → ${y} l`).join(', ')}.`, 'Kreuze das passende Schaubild an.'), [[na, sbild(ax2, { zuege: [zug(pts)] }), true], [nb, sbild(ax2, { zuege: [zug(falsch)] }), false]],
        H('G', 'Prüfe jedes Wertepaar in beiden Schaubildern.', 'Zu jedem Wertepaar gehört ein Punkt auf der Linie.', `Lies in beiden Schaubildern das Wasser nach ${f} min ab.`), { nachweis: [KPAARE(pts.slice(1, 4).map(([x, y]) => [String(x), String(y)]))] }); },
    () => { const z = [8, 10, 12, 14], w = geradeTemp(z, 13), kn = kind(), i = zz(1, 2), stimmt = zz(0, 1) === 1, a = achsen(['Uhrzeit', 2000], ['Temperatur in °C', 2000], 12, 12);
      const pkt = stimmt ? [E(z[i]), E(w[i])] : [E(w[i]), E(z[i])];
      if (w[i] === z[i]) return null;
      return auswahl(Z(`Um ${z[i]} Uhr sind es ${w[i]} °C.`, `${kn} trägt dazu einen Punkt ein.`, 'Beurteile den Punkt im Schaubild.'), [opt(stimmt ? 'Stimmt. Der Punkt liegt richtig.' : 'Falsch. Die Uhrzeit und die Temperatur sind vertauscht.', true), opt(stimmt ? 'Falsch. Die Uhrzeit und die Temperatur sind vertauscht.' : 'Stimmt. Der Punkt liegt richtig.', false, stimmt ? undefined : 'schaubild-achsen-vertauscht'), opt('Falsch. Der Punkt muss auf einer Achse liegen.', false)],
        H('G', 'Die Uhrzeit steht an der Achse nach rechts.', 'Die Temperatur steht an der Achse nach oben.', `Prüfe: Liegt der Punkt über ${z[i]} Uhr auf der Höhe ${w[i]} °C?`), { bild: sbild(a, { punkte: [pkt] }), nachweis: [ABL(t(pkt[0]), t(pkt[1]), { hilf: true }), URTEIL(stimmt)] }); },
  ]);
  sechs(D2, 'M', [
    () => { const je = wahl([1500, 2500]), xs = [2, 4, 6], sy = je === 1500 ? 1000 : 5000, a = achsen(['Gewicht in kg', 1000], ['Preis in €', sy], 7, (6 * je) / sy + 1), paare = xs.map((x) => [E(x), x * je]);
      return punkteEintragen(Z('Die Tabelle zeigt den Preis für Erdbeeren.', 'Trage die drei Wertepaare als Punkte in das Schaubild ein.'), a, paare, [[paare.map(([x, y]) => [y, x]), 'schaubild-achsen-vertauscht']],
        H('M', 'Bestimme zuerst die Einteilung der Achse nach oben.', `Ein Kästchen nach oben ist ${g(sy)} € wert. Für ${xs[0]} kg gehst du bis ${g(xs[0] * je)} € nach oben.`), { bild: wbild({ namen: ['Gewicht in kg', 'Preis in €'], paare: xs.map((x) => [x, g(x * je)]) }), nachfrage: NF_GERADE(true), nachweis: [PKT(paare.map(([x, y]) => [t(x), g(y)]))] }); },
    () => { const fix = wahl([5, 10]), jeM = wahl([5]), xs = [1, 2, 3, 4], namen = ['Monate', 'Kosten in €'].map((x, i) => (i ? x : 'Anzahl Monate'));
      return wertetabelle(Z(`Ein Sportverein verlangt einmal ${fix} € für die Anmeldung und dann ${jeM} € für jeden Monat.`, 'Ergänze die Tabelle der Kosten.'), namen, xs.map((x) => [x, LK(`y${x}`, E(fix + jeM * x), [[E(jeM * x), 'grundgebuehr-uebersehen'], [E((fix + jeM) * x), 'grundgebuehr-uebersehen']])]),
        H('M', 'Die Anmeldung wird nur einmal bezahlt, der Monatsbeitrag jeden Monat.', `Für 2 Monate: ${fix} € + 2 · ${jeM} € = ${fix + 2 * jeM} €.`), { nachweis: [TAB({ m: String(jeM), b: String(fix) })] }); },
    () => { const { pts } = wanderung(5, [2, 4]), namen = ['Zeit in h', 'Strecke in km'], a = achsen([namen[0], 500, 2, 0], [namen[1], 2000], 11, Math.ceil(pts.at(-1)[1] / 2) + 1);
      if (pts.some(([, y]) => y % 2) || pts.at(-1)[1] > 20) return null;
      return wertetabelle(Z('Das Schaubild zeigt den Verlauf einer Wanderung.', 'Lies die Strecken ab und ergänze die Tabelle.'), namen, [1, 2, 3, 4, 5].map((h) => [h, LK(`y${h}`, E(pts[h][1]), [[E(pts[h][1] / 2), 'einteilung-uebersehen']])]),
        H('M', 'Bestimme zuerst die Einteilung beider Achsen.', 'Nach rechts sind zwei Kästchen 1 h, nach oben ist ein Kästchen 2 km wert.'), { bild: sbild(a, { zuege: [zug(pts)] }), nachweis: [TAB('bild')] }); },
    () => { const je = wahl([10, 20]), [na, nb, nc] = mische(['A', 'B', 'C']), a = (m, b0) => sbild(achsen(['Zeit in min', 1000], ['Wasser in l', je * 1000], 5, 6), { zuege: [{ punkte: [[0, E(b0)], [4000, E(b0 + 4 * m)]] }] });
      return karten(Z(`In eine leere Wanne fließen gleichmäßig ${je} l Wasser in jeder Minute.`, 'Kreuze das Schaubild an, das zu diesem Text passt.'), [[na, a(je, 0), true], [nb, a(je / 2, 0), false], [nc, a(je / 2, je), false]],
        H('M', 'Berechne ein Wertepaar aus dem Text und suche es in den Schaubildern.', `Nach 2 min sind ${2 * je} l in der Wanne. Die Wanne ist am Anfang leer.`), { nachweis: [`2 · ${je} l = ${2 * je} l`, KPAARE([['0', '0'], ['2', String(2 * je)]], { frei: true })] }); },
    () => { const start = wahl([20, 24]), ab = wahl([2, 4]), xs = [0, 1, 2, 3, 4], namen = ['Zeit in h', 'Höhe in cm'];
      return wertetabelle(Z(`Eine Kerze ist am Anfang ${start} cm hoch. In jeder Stunde brennt sie um ${ab} cm ab.`, 'Ergänze die Tabelle.'), namen, xs.map((x) => [x, x === 0 ? String(start) : LK(`y${x}`, E(start - ab * x), [[E(ab * x), 'sach-schritt-vergessen'], [E(start + ab * x), 'prop-addiert']])]),
        H('M', 'Ziehe für jede Stunde dieselbe Länge ab.', `Nach 2 h: ${start} cm − 2 · ${ab} cm = ${start - 2 * ab} cm.`), { nachweis: [TAB({ fallend: true, m: String(ab), b: String(start) })] }); },
    () => { const gb = wahl([3, 4]), km = wahl([2]), kn = kind(), xs = [1, 2, 4], falsch = xs.map((x) => [x, (gb + km) * x]), tb = wbild({ namen: ['Strecke in km', 'Preis in €'], paare: falsch });
      return auswahl(Z(`Eine Taxifahrt kostet ${gb} € Grundgebühr und ${km} € für jeden Kilometer. ${kn} schreibt dazu die Tabelle.`, 'Beurteile die Tabelle.'), [opt(`Falsch. Nur der Preis für 1 km stimmt. 2 km kosten ${gb + 2 * km} € und 4 km kosten ${gb + 4 * km} €.`, true), opt('Stimmt. Zur doppelten Strecke gehört der doppelte Preis.', false, 'grundgebuehr-uebersehen'), opt(`Falsch. Schon der Preis für 1 km ist falsch. Richtig sind ${km} €.`, false, 'grundgebuehr-uebersehen'), opt('Stimmt. Die Grundgebühr wird bei jedem Kilometer neu bezahlt.', false, 'grundgebuehr-uebersehen')],
        H('M', 'Die Grundgebühr wird bei jeder Fahrt nur einmal bezahlt.', `Rechne für 2 km: ${gb} € + 2 · ${km} € = ${gb + 2 * km} €. Vergleiche mit der Tabelle.`), { bild: tb, nachweis: [`${gb} € + 2 · ${km} € = ${gb + 2 * km} €`, `${gb} € + 4 · ${km} € = ${gb + 4 * km} €`, URTEIL(false)] }); },
  ]);
  sechs(D2, 'E', [
    () => { const je = wahl([750, 1250]), xs = [4, 8, 12, 16], sy = je === 750 ? 1000 : 5000, a = achsen(['Gewicht in kg', 2000], ['Preis in €', sy], 9, (16 * je) / sy + 1), paare = xs.map((x) => [E(x), x * je]);
      return punkteEintragen(Z(`1 kg Trauben kostet ${g(je)} €. Jedes Kilogramm kostet gleich viel.`, `Trage die Punkte für ${xs.slice(0, 3).join(' kg, ')} kg und ${xs[3]} kg in das Schaubild ein.`), a, paare, [[paare.map(([x, y]) => [x / 2, y]), 'einteilung-uebersehen']],
        H('E', 'Berechne zuerst die vier Preise und bestimme dann die Einteilung der Achsen.'), { nachfrage: NF_GERADE(true), nachweis: [...xs.map((x) => `${x} · ${g(je)} € = ${g(x * je)} €`), PKT(paare.map(([x, y]) => [t(x), g(y)]), { frei: true })] }); },
    () => { const start = wahl([18, 24, 30]), ab = wahl([1.5, 2.5]), namen = ['Zeit in h', 'Höhe in cm'], xs = [2, 4, 6, 8].filter((x) => start - ab * x >= 0);
      return wertetabelle(Z(`Eine Kerze ist ${start} cm hoch. In jeder Stunde brennt sie um ${t(E(ab))} cm ab.`, 'Ergänze die Tabelle.'), namen, xs.map((x) => [x, LK(`y${x}`, E(start - ab * x), [[E(ab * x), 'sach-schritt-vergessen'], [E(start - ab), 'sach-schritt-vergessen']])]),
        H('E', 'Berechne zuerst, um wie viel die Kerze in der jeweiligen Zeit kürzer wird.'), { nachweis: [TAB({ fallend: true, m: t(E(ab)), b: String(start) })] }); },
    () => { const m = wahl([5, 10]), b0 = wahl([m, 2 * m]), [na, nb, nc, nd] = mische(['A', 'B', 'C', 'D']), bild = (mm, bb, fall = false) => sbild(achsen(['Zeit in min', 1000], ['Wasser in l', m * 1000], 5, 7), { zuege: [{ punkte: fall ? [[0, E(b0 + 4 * m)], [4000, E(b0)]] : [[0, E(bb)], [4000, E(bb + 4 * mm)]] }] });
      return karten(Z(`In einer Wanne sind schon ${b0} l Wasser. Dann fließen gleichmäßig ${m} l in jeder Minute dazu.`, 'Kreuze das passende Schaubild an.'), [[na, bild(m, b0), true], [nb, bild(m, 0), false, 'grundgebuehr-uebersehen'], [nc, bild(m / 2, b0), false], [nd, bild(m, b0, true), false]],
        H('E', 'Berechne die Wassermenge am Anfang und nach 2 min und suche beide Punkte im Schaubild.'), { nachweis: [`${b0} l + 2 · ${m} l = ${b0 + 2 * m} l`, KPAARE([['0', String(b0)], ['2', String(b0 + 2 * m)]], { frei: true })] }); },
    () => { const kn = kind(), preis = wahl([3, 4]);
      return auswahl(Z(`${kn} zeichnet ein Schaubild zu den Wertepaaren 1 → ${preis}, 2 → ${2 * preis} und 4 → ${4 * preis}. An die Achse nach rechts schreibt ${kn} die Zahlen 1, 2, 4 in gleichen Abständen.`, 'Beurteile die Achse.'),
        [opt('Falsch. Die Achse ist ungleichmäßig eingeteilt: Von 1 bis 2 ist es ein Schritt, von 2 bis 4 sind es zwei Schritte. Die 3 fehlt.', true), opt('Stimmt. An die Achse kommen genau die Zahlen aus der Tabelle.', false, 'achse-ungleichmaessig'), opt('Stimmt. Die Abstände sind gleich, also ist die Achse gleichmäßig eingeteilt.', false, 'achse-ungleichmaessig'), opt('Falsch. Die Achse nach rechts muss bei 1 beginnen.', false)],
        H('E', 'An einer Achse ist jeder Schritt gleich viel wert.'), { nachweis: [URTEIL(false), FREI('gleichmäßige Einteilung einer Achse')] }); },
    () => { const fix = wahl([10, 20]), jeM = wahl([5, 8]), ziel = fix + jeM * zz(5, 9);
      return zahl(Z(`Ein Sportverein verlangt einmal ${fix} € für die Anmeldung und dann ${jeM} € für jeden Monat.`, `Bestimme, nach wie vielen Monaten insgesamt ${ziel} € bezahlt sind.`), E((ziel - fix) / jeM), 'Monaten', [[E(ziel / jeM), 'grundgebuehr-uebersehen'], [E(ziel - fix), 'sach-schritt-vergessen']].filter(([v]) => Number.isInteger(v / 1000)),
        H('E', 'Ziehe zuerst die Anmeldung ab und teile dann durch den Monatsbeitrag.'), { nachweis: [`${ziel} € − ${fix} € = ${ziel - fix} €`, `${ziel - fix} € : ${jeM} € = ${(ziel - fix) / jeM}`, WERT((ziel - fix) / jeM)] }); },
    () => { const ta = wahl([3, 4, 5]), kn = kind(), a = achsen(['Zeit in h', 1000], ['Strecke in km', 2000], 5, ta * 2 + 2), vor = 2;
      return auswahl(Z(`Das Schaubild zeigt die Wanderungen von Gruppe A und Gruppe B. ${kn} sagt: „Beide Linien sind gleich steil. Also sind beide Gruppen nach 2 Stunden gleich weit.“`, 'Beurteile die Aussage.'),
        [opt(`Falsch. Beide Gruppen sind gleich schnell, aber Gruppe B hat ${vor} km Vorsprung. Nach 2 h hat A ${ta * 2} km und B ${ta * 2 + vor} km erreicht.`, true), opt('Stimmt. Gleich steile Linien zeigen immer dieselbe Strecke.', false), opt('Falsch. Gruppe A ist schneller als Gruppe B.', false), opt(`Stimmt. Nach 2 h haben beide Gruppen ${ta * 2} km erreicht.`, false), opt('Falsch. Gruppe B wandert rückwärts.', false)],
        H('E', 'Gleich steile Linien zeigen dasselbe Tempo. Prüfe außerdem, wo die Linien beginnen.'), { bild: sbild(a, { zuege: [{ punkte: [[0, 0], [4000, E(ta * 4)]], n: 'A' }, { punkte: [[0, E(vor)], [4000, E(ta * 4 + vor)]], n: 'B', stil: 'zweite' }] }),
          nachweis: [ABL(2, ta * 2, { zug: 0, hilf: true }), ABL(2, ta * 2 + vor, { zug: 1, hilf: true }), URTEIL(false)] }); },
  ]);
}
