// Aufgaben zu 6.3.1 „Quader und ihre Netze“ (Lernziele Q1 und Q2) nach ADR 0015 und ADR 0045.
// Q1: Quader und Würfel beschreiben (Ecken, Kanten, Flächen, Lage der Kanten und Flächen). Q2: Netze erkennen, ergänzen und prüfen.
// Stolperstein aus der Niveauübersicht: Bei Netzen wird nur gezählt, ob es sechs Quadrate sind, nicht wie sie liegen.
import { sechs } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, Z, H, zahl, opt, auswahl, luecken, lk, kind, U, KZ, KA, NETZ, GEGEN, QF, LAGE, quader, wuerfelBild, prisma, rund,
  WUERFELNETZE, KREUZ, keinNetz, netzBild, zufallsLage, normiere, gegenueberVon, gitterZellen, GT, bildkarten, quaderNetz, ohneUndefined } from './6-3-koerper.mjs';

const Q1 = '6.3.1-Q1', Q2 = '6.3.1-Q2';
const ECKEN = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const PARALLEL = { AB: ['DC', 'EF', 'HG'], BC: ['AD', 'FG', 'EH'], AE: ['BF', 'CG', 'DH'] };
const QUER = { AB: ['BC', 'AE', 'BF', 'AD', 'FG', 'CG'], BC: ['AB', 'CG', 'BF', 'CD', 'EF', 'DH'], AE: ['AB', 'AD', 'EF', 'EH', 'BC', 'GH'] };
const FLAECHEN = { ABCD: 'EFGH', EFGH: 'ABCD', ABFE: 'DCGH', DCGH: 'ABFE', BCGF: 'ADHE', ADHE: 'BCGF' };
const masse = (a, b, c) => [{ von: 'A', bis: 'B', t: `${a} cm` }, { von: 'B', bis: 'C', t: `${b} cm` }, { von: 'A', bis: 'E', t: `${c} cm` }];
const dreiMasse = () => suche(() => [zz(2, 6), zz(2, 5), zz(2, 4)], ([a, b, c]) => new Set([a, b, c]).size === 3 && a > b);
const hZaehlen = (n, was) => H(n, `Zeige beim Zählen auf jede ${was === 'Ecken' ? 'Ecke' : was === 'Kanten' ? 'Kante' : 'Fläche'}. Hake sie in Gedanken ab.`,
  { Ecken: 'Oben hat der Würfel 4 Ecken, unten auch 4.', Kanten: 'Oben 4 Kanten, unten 4 Kanten und 4 Kanten nach oben.', Flächen: 'Vorne, hinten, links, rechts, oben und unten.' }[was],
  'Denk auch an die gestrichelten Linien hinten.');

// ---------- Q1: Quader und Würfel beschreiben ----------
function q1() {
  sechs(Q1, 'F', [
    () => zahl(Z('Das ist ein Würfel.', 'Die Ecken sind rot.', 'Zähle die Ecken.'), 8, [[7, 'verdeckt-nicht-gezaehlt'], [12, 'ecken-kanten-verwechselt'], [6, 'ecken-kanten-verwechselt']], hZaehlen('F', 'Ecken'),
      { bild: wuerfelBild(zz(2, 3), { alleEcken: true }), nachweis: [KZ('wuerfel', 'ecken', 8, { bild: true })] }),
    () => { const [a, b, c] = dreiMasse();
      return zahl(Z('Das ist ein Quader.', 'Zähle seine Flächen.', 'Denk auch an die Flächen hinten.'), 6, [[3, 'verdeckt-nicht-gezaehlt'], [4, 'verdeckt-nicht-gezaehlt'], [8, 'ecken-kanten-verwechselt']], hZaehlen('F', 'Flächen'),
        { bild: quader(a, b, c), nachweis: [KZ('quader', 'flaechen', 6, { bild: true })] }); },
    () => zahl(Z('Das ist ein Würfel.', 'Zähle seine Kanten.', 'Die gestrichelten Kanten zählen mit.'), 12, [[9, 'verdeckt-nicht-gezaehlt'], [8, 'ecken-kanten-verwechselt'], [6, 'ecken-kanten-verwechselt']], hZaehlen('F', 'Kanten'),
      { bild: wuerfelBild(zz(2, 3)), nachweis: [KZ('wuerfel', 'kanten', 12, { bild: true })] }),
    () => { const w = zz(0, 1), [a, b, c] = dreiMasse(), bild = w ? wuerfelBild(zz(2, 3)) : quader(a, b, c);
      return auswahl(Z('Schau dir den Körper an.', 'Kreuze seinen Namen an.'), [opt(w ? 'Würfel' : 'Quader', true), opt(w ? 'Zylinder' : 'Würfel', false, 'koerper-verwechselt'), opt('Kugel', false, 'koerper-verwechselt')],
        H('F', w ? 'Sind alle Kanten gleich lang?' : 'Sind alle Kanten gleich lang? Oder gibt es kurze und lange?', w ? 'Ein Würfel hat 6 gleich große Quadrate.' : 'Ein Quader hat 6 Rechtecke.', w ? 'Alle Kanten sind gleich lang.' : 'Die Kanten sind verschieden lang.'),
        { bild, nachweis: [KA(w ? 'wuerfel' : 'quader', { bild: true })] }); },
    () => { const k = kind();
      return zahl(Z(`${k} bastelt einen Würfel aus Pappe.`, 'Jede Fläche ist ein Quadrat.', 'Gib an, wie viele Quadrate ${k} braucht.'), 6, [[4, 'verdeckt-nicht-gezaehlt'], [3, 'verdeckt-nicht-gezaehlt'], [8, 'ecken-kanten-verwechselt']], hZaehlen('F', 'Flächen'),
        { bild: wuerfelBild(2), nachweis: [KZ('wuerfel', 'flaechen', 6, { bild: true })] }); },
    () => { const w = zz(0, 1), [a, b, c] = dreiMasse(), f = wahl(['ABFE', 'ABCD', 'BCGF']), bild = w ? wuerfelBild(3, { markiert: { flaechen: [f.split('')] } }) : quader(a, b, c, { markiert: { flaechen: [f.split('')] } });
      return auswahl(Z('Eine Fläche ist gelb.', 'Kreuze ihre Form an.'), [opt(w ? 'Quadrat' : 'Rechteck', true), opt('Dreieck', false, 'koerper-verwechselt'), opt('Kreis', false, 'koerper-verwechselt')],
        H('F', 'Zähle die Ecken der gelben Fläche.', 'Vier Ecken und gerade Seiten: ein Viereck.', w ? 'Alle Seiten sind gleich lang.' : 'Zwei Seiten sind lang, zwei sind kurz.'),
        { bild, nachweis: [{ art: 'flaechenform', flaeche: f }] }); },
  ]);
  sechs(Q1, 'G', [
    () => { const [a, b, c] = dreiMasse();
      return zahl(Z('Das ist ein Quader.', 'Gib an, wie viele Kanten er hat.'), 12, [[9, 'verdeckt-nicht-gezaehlt'], [8, 'ecken-kanten-verwechselt'], [6, 'ecken-kanten-verwechselt']], hZaehlen('G', 'Kanten'),
        { bild: quader(a, b, c), nachweis: [KZ('quader', 'kanten', 12, { bild: true })] }); },
    () => { const [a, b, c] = dreiMasse();
      return luecken(Z('Ergänze die Zahlen.', 'Ein Quader hat {{e}} Ecken.', 'Er hat {{k}} Kanten und {{f}} Flächen.'), { e: lk(8, [[7, 'verdeckt-nicht-gezaehlt'], [12, 'ecken-kanten-verwechselt']]), k: lk(12, [[9, 'verdeckt-nicht-gezaehlt'], [8, 'ecken-kanten-verwechselt']]), f: lk(6, [[3, 'verdeckt-nicht-gezaehlt']]) },
        H('G', 'Ecken sind Punkte, Kanten sind Linien, Flächen sind die Seiten.', 'Oben 4 Ecken und unten 4 Ecken.', 'Zähle auch, was hinten verdeckt ist.'),
        { bild: quader(a, b, c), nachweis: [KZ('quader', 'ecken', 8, { luecke: 'e' }), KZ('quader', 'kanten', 12, { luecke: 'k' }), KZ('quader', 'flaechen', 6, { luecke: 'f' })] }); },
    () => { const [a, b, c] = dreiMasse(), l = wahl([a, b, c]);
      return zahl(Z('Der Quader ist beschriftet.', `Gib an, wie viele Kanten ${l} cm lang sind.`), 4, [[1, 'kanten-teilweise'], [2, 'kanten-teilweise'], [3, 'verdeckt-nicht-gezaehlt']],
        H('G', 'Gleich lange Kanten sind parallel.', 'Die Kante AB ist so lang wie DC, EF und HG.', 'Suche alle Kanten, die parallel zur beschrifteten Kante sind.'),
        { bild: quader(a, b, c, { masse: masse(a, b, c) }), nachweis: [{ art: 'kantenzahl', laenge: l, wert: 4 }] }); },
    () => { const [a, b, c] = dreiMasse(), d = zz(2, 3), fast = wahl([[d, d, d + 1], [d + 1, d, d]]);
      return bildkarten(Z('Kreuze das Bild an.', 'Es soll einen Würfel zeigen.'), [[wuerfelBild(d), true], [quader(...fast), false, 'koerper-verwechselt'], [quader(a, b, c), false, 'koerper-verwechselt']],
        H('G', 'Beim Würfel sind alle Kanten gleich lang.', 'Vergleiche die Kante vorne unten mit der Kante vorne links.', 'Prüfe jedes Bild: Ist die Vorderfläche ein Quadrat?'), { nachweis: [KA('wuerfel')] }); },
    () => { const z = wahl(['AB', 'BC', 'AE']), [a, b, c] = dreiMasse(), richtig = wahl(PARALLEL[z]), falsch = mische(QUER[z]).slice(0, 2);
      return auswahl(Z(`Die Kante ${z} ist rot.`, `Eine Kante ist parallel zu ${z}.`, 'Kreuze sie an.'), [opt(richtig, true), ...falsch.map((k) => opt(k, false, 'ecken-kanten-verwechselt'))],
        H('G', 'Parallele Kanten zeigen in dieselbe Richtung.', `Zu ${z} parallel sind ${PARALLEL[z].join(', ')}.`, 'Fahre die rote Kante mit dem Finger nach. Suche eine Kante mit derselben Richtung.'),
        { bild: quader(a, b, c, { namen: true, markiert: { kanten: [z.split('')] } }), nachweis: [LAGE(z, 'parallel')] }); },
    () => { const k = kind(), [satz, stimmt, grund, f1, f2] = wahl([
      ['Ein Würfel ist auch ein Quader.', true, 'Ein Quadrat ist ein besonderes Rechteck.', 'Ein Würfel hat nur Quadrate.', 'Ein Würfel hat weniger Ecken.'],
      ['Jeder Quader ist ein Würfel.', false, 'Beim Quader können die Kanten verschieden lang sein.', 'Beide haben 8 Ecken.', 'Beide haben 6 Flächen.'],
      ['Ein Würfel hat 12 gleich lange Kanten.', true, 'Alle Flächen sind gleich große Quadrate.', 'Nur 4 Kanten sind gleich lang.', 'Ein Würfel hat 8 Kanten.']]);
      return auswahl(Z(`${k} sagt: „${satz}“`, 'Prüfe die Aussage.', 'Kreuze die richtige Antwort an.'),
        [opt(`${stimmt ? 'Stimmt' : 'Stimmt nicht'}. ${grund}`, true), opt(`${stimmt ? 'Stimmt nicht' : 'Stimmt'}. ${f1}`, false, stimmt ? 'wuerfel-kein-quader' : 'koerper-verwechselt'), opt(`${stimmt ? 'Stimmt nicht' : 'Stimmt'}. ${f2}`, false, 'ecken-kanten-verwechselt')],
        H('G', 'Ein Quader hat 6 Rechtecke als Flächen.', 'Ein Quadrat ist ein Rechteck mit 4 gleich langen Seiten.', 'Vergleiche die Flächen von Würfel und Quader.'), { nachweis: [U(stimmt), KZ('wuerfel', 'kanten', 12)] }); },
  ]);
  sechs(Q1, 'M', [
    () => { const [a, b, c] = dreiMasse(), l = wahl([a, b, c]);
      return zahl(`Ein Quader hat die Kanten a = ${a} cm, b = ${b} cm und c = ${c} cm. Gib an, wie viele Kanten ${l} cm lang sind.`, 4, [[1, 'kanten-teilweise'], [3, 'verdeckt-nicht-gezaehlt'], [12, 'kanten-teilweise']],
        H('M', 'Jede Kantenlänge kommt beim Quader viermal vor.', 'Die vier Kanten nach oben sind alle so lang wie c.'), { nachweis: [{ art: 'kantenzahl', quader: { a, b, c }, laenge: l, wert: 4 }] }); },
    () => { const [a, b, c] = dreiMasse(), s = 4 * (a + b + c), k = kind();
      return zahl(`${k} baut aus Draht das Kantenmodell eines Quaders mit a = ${a} cm, b = ${b} cm und c = ${c} cm. Gib an, wie viel Zentimeter Draht ${k} braucht.`, s,
        [[a + b + c, 'kanten-teilweise'], [2 * (a + b + c), 'kanten-teilweise'], [3 * (a + b + c), 'verdeckt-nicht-gezaehlt']],
        H('M', 'Ein Quader hat 12 Kanten: je 4 mit der Länge a, b und c.', `4 · ${a} + 4 · ${b} + 4 · ${c} = ${s}`), { einheit: 'cm', nachweis: [`4 · ${a} + 4 · ${b} + 4 · ${c} = ${s}`, KZ('quader', 'kanten', 12)] }); },
    () => { const f = wahl(Object.keys(FLAECHEN)), [a, b, c] = dreiMasse(), andere = mische(Object.keys(FLAECHEN).filter((x) => x !== f && x !== FLAECHEN[f])).slice(0, 3);
      return auswahl(`Kreuze die Fläche an, die der Fläche ${f} gegenüberliegt.`, [opt(FLAECHEN[f], true), ...andere.map((x) => opt(x, false, 'gegenueber-benachbart'))],
        H('M', 'Gegenüberliegende Flächen haben keine Ecke gemeinsam.', `${f} und ${FLAECHEN[f]} haben keinen gemeinsamen Buchstaben.`), { bild: quader(a, b, c, { namen: true, markiert: { flaechen: [f.split('')] } }), nachweis: [QF(f, 'gegenueber')] }); },
    () => { const a = zz(3, 9), s = 12 * a;
      return luecken('Ergänze die Zahlen. Ein Würfel hat {{k}} Kanten. Jede ist ' + a + ' cm lang. Zusammen sind die Kanten {{s}} cm lang.', { k: lk(12, [[8, 'ecken-kanten-verwechselt'], [6, 'ecken-kanten-verwechselt']]), s: lk(s, [[8 * a, 'ecken-kanten-verwechselt'], [6 * a, 'ecken-kanten-verwechselt'], [4 * a, 'kanten-teilweise']]) },
        H('M', 'Zähle zuerst die Kanten. Alle sind gleich lang.', `12 · ${a} = ${s}`), { nachweis: [KZ('wuerfel', 'kanten', 12, { luecke: 'k' }), `12 · ${a} = ${s}`] }); },
    () => { const a = zz(3, 8), d = 12 * a + zz(4, 20), k = kind(), r = d - 12 * a;
      return zahl(`${k} hat ${d} cm Draht und baut daraus das Kantenmodell eines Würfels mit ${a} cm Kantenlänge. Gib an, wie viel Draht übrig bleibt.`, r,
        [[d - 4 * a, 'kanten-teilweise'], [d - 8 * a, 'ecken-kanten-verwechselt'], [d - 6 * a, 'ecken-kanten-verwechselt']],
        H('M', 'Berechne zuerst, wie viel Draht das Modell braucht.', `12 · ${a} = ${12 * a}, dann ${d} − ${12 * a} = ${r}`), { einheit: 'cm', nachweis: [KZ('wuerfel', 'kanten', 12), `12 · ${a} = ${12 * a}`, `${d} − ${12 * a} = ${r}`] }); },
    () => { const k = kind(), [anzahl, stimmt] = wahl([[8, true], [6, false], [4, true], [10, false]]), b = zz(2, 4), c = b + zz(1, 3);
      const ja = anzahl === 8 ? `Stimmt. Zum Beispiel mit a = b = ${b} cm und c = ${c} cm.` : 'Stimmt. Das ist bei jedem Quader so, der kein Würfel ist.';
      return auswahl(`${k} behauptet: „Ein Quader kann genau ${anzahl} gleich lange Kanten haben.“ Beurteile die Aussage.`,
        [opt(stimmt ? ja : 'Stimmt nicht. Gleich lange Kanten gibt es immer zu viert: 4, 8 oder 12.', true), opt(stimmt ? 'Stimmt nicht. Gleich lang sind immer alle 12 Kanten.' : `Stimmt. Zum Beispiel mit a = b = ${b} cm.`, false, 'kanten-teilweise'),
          opt('Stimmt nicht. Dann wäre der Quader ein Würfel.', false, 'wuerfel-kein-quader')],
        H('M', 'Je 4 Kanten eines Quaders sind parallel und gleich lang.', 'Sind a und b gleich, gibt es 8 gleich lange Kanten.'),
        { nachweis: [U(stimmt), { zahl: b, grund: 'Beispiel' }, { zahl: c, grund: 'Beispiel' }, '4 + 4 = 8', '4 + 4 + 4 = 12'] }); },
  ]);
  sechs(Q1, 'E', [
    () => { const a = zz(4, 15), s = 12 * a;
      return zahl(`Die Kanten eines Würfels sind zusammen ${s} cm lang. Gib die Kantenlänge an.`, a, [[s / 4, 'kanten-teilweise'], [s / 6, 'ecken-kanten-verwechselt']].filter(([x]) => Number.isInteger(x)),
        H('E', 'Ein Würfel hat 12 gleich lange Kanten.'), { einheit: 'cm', nachweis: [KZ('wuerfel', 'kanten', 12), `${s} : 12 = ${a}`] }); },
    () => { const [a, b, c] = suche(() => [zz(4, 12), zz(3, 9), zz(2, 8)], (l) => new Set(l).size === 3), s = 4 * (a + b + c);
      return zahl(`Die Kanten eines Quaders sind zusammen ${s} cm lang. Zwei Kanten sind a = ${a} cm und b = ${b} cm lang. Gib die Länge der Kante c an.`, c,
        [[s - a - b, 'kanten-teilweise'], [s / 4 - a, 'kanten-teilweise']], H('E', 'Jede Länge kommt viermal vor. Teile zuerst durch 4.'),
        { einheit: 'cm', nachweis: [`${s} : 4 = ${a + b + c}`, `${a + b + c} − ${a} − ${b} = ${c}`] }); },
    () => { const w = wahl([['Ecken', 'ecken', 8, [[16, 'verdeckt-nicht-gezaehlt'], [12, 'ecken-kanten-verwechselt']]], ['Flächen', 'flaechen', 6, [[12, 'verdeckt-nicht-gezaehlt'], [10, 'verdeckt-nicht-gezaehlt']]], ['Kanten', 'kanten', 12, [[24, 'verdeckt-nicht-gezaehlt'], [20, 'kanten-teilweise']]]]);
      return zahl(`Zwei gleich große Würfel werden mit einer Fläche aneinandergeklebt. Es entsteht ein Quader. Gib an, wie viele ${w[0]} dieser Quader hat.`, w[2], w[3],
        H('E', 'Zeichne die beiden Würfel als Schrägbild. Was verschwindet beim Kleben?'), { bild: quader(4, 2, 2), nachweis: [KZ('quader', w[1], w[2], { bild: true })] }); },
    () => { const anz = zz(3, 6), rest = zz(1, 11), h = 12 * anz + rest, k = kind();
      return zahl(`${k} hat ${h} Strohhalme. Für das Kantenmodell eines Würfels braucht ${k} für jede Kante einen Strohhalm. Gib an, wie viele Würfelmodelle ${k} vollständig bauen kann.`, anz,
        [[anz + 1, 'kanten-teilweise'], [Math.floor(h / 8), 'ecken-kanten-verwechselt'], [Math.floor(h / 6), 'ecken-kanten-verwechselt']], H('E', 'Überlege zuerst, wie viele Strohhalme ein Modell braucht.'),
        { nachweis: [KZ('wuerfel', 'kanten', 12), `${h} : 12 = ${anz} Rest ${rest}`] }); },
    () => { const [a, b, c] = dreiMasse();
      return zahl('Eine Raumdiagonale verbindet zwei Ecken eines Quaders quer durch den Körper. Gib an, wie viele Raumdiagonalen ein Quader hat.', 4, [[8, 'ecken-kanten-verwechselt'], [2, 'verdeckt-nicht-gezaehlt'], [12, 'ecken-kanten-verwechselt']],
        H('E', 'Von jeder Ecke geht genau eine Raumdiagonale aus. Jede hat zwei Enden.'), { bild: quader(a, b, c, { namen: true }), nachweis: [KZ('quader', 'ecken', 8), '8 : 2 = 4'] }); },
    () => { const k = kind(), d = zz(2, 5), [satz, stimmt, grund, rechnung] = wahl([
      [`Verlängere ich nur die Kante a um ${d} cm, wird die Kantensumme um ${d} cm länger.`, false, `Es gibt 4 Kanten der Länge a. Die Summe wächst um 4 · ${d} = ${4 * d} cm.`, `4 · ${d} = ${4 * d}`],
      [`Verlängere ich jede Kante um ${d} cm, wird die Kantensumme um ${12 * d} cm länger.`, true, `Ein Quader hat 12 Kanten. 12 · ${d} = ${12 * d}`, `12 · ${d} = ${12 * d}`],
      ['Verdopple ich alle Kanten, verdoppelt sich auch die Kantensumme.', true, 'Jede der 12 Kanten wird doppelt so lang. Also auch ihre Summe.', '2 · 12 = 24'],
      [`Verlängere ich nur die Kante c um ${d} cm, wird die Kantensumme um ${12 * d} cm länger.`, false, `Nur 4 Kanten werden länger. Die Summe wächst um 4 · ${d} = ${4 * d} cm.`, `4 · ${d} = ${4 * d}`]]);
      return auswahl(`${k} sagt: „${satz}“ Beurteile die Aussage.`, [opt(`${stimmt ? 'Stimmt' : 'Stimmt nicht'}. ${grund}`, true), opt(stimmt ? 'Stimmt nicht. Es werden nur 4 Kanten länger.' : 'Stimmt. Es ändert sich ja nur eine Kantenlänge.', false, 'kanten-teilweise'),
        opt(stimmt ? 'Stimmt nicht. Die Kantensumme bleibt gleich.' : 'Stimmt. Jede Kante kommt nur einmal vor.', false, 'kanten-teilweise')],
        H('E', 'Überlege, wie viele Kanten von der Änderung betroffen sind.'), { nachweis: [U(stimmt), rechnung, KZ('quader', 'kanten', 12)] }); },
  ]);
}

// ---------- Q2: Netze von Würfel und Quader ----------
const ecke = (zellen) => new Set(zellen.flatMap(([x, y]) => [[x, y], [x + 1, y], [x, y + 1], [x + 1, y + 1]].map(String))).size;
// Ein Netz mit einem fehlenden Kästchen im Gitter: gegeben, Lösung und ein typischer Fehler (sechs Kästchen, aber kein Netz).
function netzLuecke(netz, fehlt = 1) {
  return suche(() => {
    const n = zufallsLage(netz).map(([x, y]) => [x + 1, y + 1]), weg = mische(n.map((_, i) => i)).slice(0, fehlt), gegeben = n.filter((_, i) => !weg.includes(i)), loesung = n.filter((_, i) => weg.includes(i));
    const b = Math.max(...n.map((p) => p[0])) + 2, h = Math.max(...n.map((p) => p[1])) + 2;
    const frei = []; for (let x = 0; x < b; x++) for (let y = 0; y < h; y++) if (!n.some((p) => p[0] === x && p[1] === y)) frei.push([x, y]);
    const nachbar = (p) => gegeben.some((q) => Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]) === 1);
    const falsch = fehlt === 1 ? frei.filter(nachbar).find((p) => !istNetz([...gegeben, p])) : null;
    return { gegeben, loesung, b, h, falsch };
  }, (x) => x.gegeben.length && (fehlt > 1 || x.falsch) && zusammen(x.gegeben));
}
import { istWuerfelnetz as istNetz, zusammenhaengend as zusammen } from './6-3-koerper.mjs';
export const netzAufgabe = (n, text, netz, hilfen, fehlt = 1) => {
  const l = netzLuecke(netz, fehlt);
  return gitterZellen(text, GT(Math.max(l.b, 6), Math.max(l.h, 5), { zellen: l.gegeben }), l.loesung, l.falsch ? [[[l.falsch], 'netz-nur-gezaehlt']] : [], hilfen,
    { bedingung: { art: 'netz', gegeben: l.gegeben, fehlt }, nachweis: [NETZ('wuerfel')] });
};
const hNetz = (n) => H(n, 'Lege in Gedanken eine Fläche als Boden fest. Klappe dann die anderen hoch.', 'Beim Kreuz sind die vier Quadrate in der Reihe Boden, Vorderseite, Deckel und Rückseite.', 'Prüfe: Fehlt danach noch eine Seite, links oder rechts, oben oder unten?');
const namenNetz = (zellen) => { const namen = mische(['A', 'B', 'C', 'D', 'E', 'F']); return { namen, bild: netzBild(zellen, { namen }) }; };

function q2() {
  sechs(Q2, 'F', [
    () => netzAufgabe('F', Z('Das Netz von einem Würfel ist nicht fertig.', 'Es fehlt ein Quadrat.', 'Färbe es.'), KREUZ, hNetz('F')),
    () => { const n = zufallsLage(wahl(WUERFELNETZE));
      return zahl(Z('Aus dem Netz wird ein Würfel gefaltet.', 'Zähle die Flächen des Würfels.'), 6, [[5, 'verdeckt-nicht-gezaehlt'], [8, 'ecken-kanten-verwechselt']],
        H('F', 'Jedes Quadrat im Netz wird eine Fläche des Würfels.', 'Zähle die Quadrate im Netz.', 'Es sind so viele Flächen wie Quadrate.'), { bild: netzBild(n), nachweis: [NETZ('wuerfel', { faltbar: true }), KZ('wuerfel', 'flaechen', 6)] }); },
    () => { const gut = zufallsLage(wahl(WUERFELNETZE)), fuenf = zufallsLage(wahl(WUERFELNETZE)).slice(0, 5);
      return bildkarten(Z('Nur ein Bild zeigt das Netz von einem Würfel.', 'Kreuze es an.'), [[netzBild(gut), true], [netzBild(zufallsLage(keinNetz())), false, 'netz-nur-gezaehlt'], [netzBild(normiere(fuenf)), false, 'verdeckt-nicht-gezaehlt']],
        hNetz('F'), { nachweis: [NETZ('wuerfel')] }); },
    () => netzAufgabe('F', Z('Hier fehlt ein Quadrat im Netz.', 'Färbe das fehlende Quadrat.', 'Dann kannst du einen Würfel falten.'), wahl(WUERFELNETZE.slice(0, 6)), hNetz('F')),
    () => { const [a, b, c] = [zz(2, 3), zz(1, 2), zz(1, 2)];
      return zahl(Z('Das ist das Netz von einem Quader.', 'Jede Fläche ist ein Rechteck.', 'Zähle die Rechtecke.'), 6, [[5, 'verdeckt-nicht-gezaehlt'], [4, 'verdeckt-nicht-gezaehlt']],
        H('F', 'Zeige auf jedes Rechteck und zähle.', 'Ein Quader hat oben, unten, vorne, hinten, links und rechts eine Fläche.', 'Jedes Rechteck wird eine Fläche.'), { bild: quaderNetz(a + 1, b, c), nachweis: [NETZ('quader', { faltbar: true }), KZ('quader', 'flaechen', 6)] }); },
    () => { const z = zufallsLage(KREUZ), { namen, bild } = namenNetz(z), i = zz(0, 5), j = gegenueberVon(z, i);
      bild.flaechen[i].farbe = 1;
      return auswahl(Z(`Die gelbe Fläche ${namen[i]} ist der Boden.`, 'Das Netz wird zum Würfel gefaltet.', 'Eine Fläche liegt dann oben.', 'Kreuze sie an.'),
        [opt(namen[j], true), ...mische(namen.filter((_, k) => k !== i && k !== j)).slice(0, 2).map((x) => opt(x, false, 'gegenueber-benachbart'))],
        H('F', 'Die Flächen neben dem Boden werden die Seiten.', 'Sie klappen hoch.', 'Oben liegt die Fläche, die den Boden nicht berührt.'), { bild, nachweis: [GEGEN(namen[i], { welche: 'gegen' })] }); },
  ]);
  sechs(Q2, 'G', [
    () => bildkarten(Z('Kreuze das Würfelnetz an.'), [[netzBild(zufallsLage(wahl(WUERFELNETZE))), true], [netzBild(zufallsLage(keinNetz())), false, 'netz-nur-gezaehlt'], [netzBild(zufallsLage(keinNetz())), false, 'netz-nur-gezaehlt']], hNetz('G'), { nachweis: [NETZ('wuerfel')] }),
    () => netzAufgabe('G', Z('Ergänze das Würfelnetz.', 'Färbe ein Quadrat.'), wahl(WUERFELNETZE.slice(6)), hNetz('G')),
    () => { const z = zufallsLage(wahl(WUERFELNETZE)), { namen, bild } = namenNetz(z), i = zz(0, 5), j = gegenueberVon(z, i);
      return auswahl(Z('Aus dem Netz wird ein Würfel gefaltet.', `Eine Fläche liegt dann ${namen[i]} gegenüber.`, 'Kreuze sie an.'), [opt(namen[j], true), ...mische(namen.filter((_, k) => k !== i && k !== j)).slice(0, 2).map((x) => opt(x, false, 'gegenueber-benachbart'))],
        H('G', 'Gegenüberliegende Flächen berühren sich im Netz nie.', 'Liegen drei Flächen in einer Reihe, sind die beiden äußeren gegenüber.', `Suche die Reihe, in der ${namen[i]} liegt.`), { bild, nachweis: [GEGEN(namen[i], { welche: 'gegen' })] }); },
    () => { const [a, b, c] = wahl([[3, 2, 1], [2, 2, 1], [3, 1, 2], [2, 1, 1], [3, 2, 2]]);
      return bildkarten(Z('Das Bild zeigt einen Quader.', 'Kreuze sein Netz an.'), [[quaderNetz(a, b, c), true], [quaderNetz(a, b, c, { fehlerArt: 'deckel-falsch' }), false, 'netz-nur-gezaehlt'], [quaderNetz(a, b, c, { fehlerArt: 'zu-kurz' }), false, 'netz-nur-gezaehlt']],
        H('G', 'Im Netz müssen Kanten gleich lang sein, die beim Falten aneinanderstoßen.', 'Der Deckel liegt dem Boden gegenüber.', 'Prüfe jedes Netz: Passt beim Falten jede Kante?'), { bild: quader(a, b, c), nachweis: [NETZ('quader', { bild: true })] }); },
    () => { const n = zufallsLage(wahl(WUERFELNETZE)), e = ecke(n);
      return zahl(Z('Aus dem Netz wird ein Würfel gefaltet.', 'Gib an, wie viele Ecken der Würfel hat.'), 8, [[e, 'netz-ecken-gezaehlt'], [12, 'ecken-kanten-verwechselt'], [6, 'ecken-kanten-verwechselt']],
        H('G', 'Zähle nicht im Netz. Stell dir den fertigen Würfel vor.', 'Beim Falten treffen sich drei Ecken des Netzes in einer Ecke.', 'Ein Würfel hat oben 4 und unten 4 Ecken.'), { bild: netzBild(n), nachweis: [NETZ('wuerfel', { faltbar: true }), KZ('wuerfel', 'ecken', 8)] }); },
    () => { const k = kind(), n = [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1]];
      return auswahl(Z('Vier Quadrate liegen in einer Reihe.', 'Über den ersten beiden liegt je ein Quadrat.', `${k} sagt: „6 Quadrate ergeben immer ein Würfelnetz.“`, 'Prüfe die Aussage.'),
        [opt('Stimmt nicht. Beim Falten liegen zwei Quadrate aufeinander. Eine Seite fehlt.', true), opt('Stimmt. 6 Quadrate ergeben immer einen Würfel.', false, 'netz-nur-gezaehlt'), opt('Stimmt. Alle Quadrate hängen zusammen.', false, 'netz-nur-gezaehlt')],
        H('G', 'Falte in Gedanken. Die vier Quadrate in der Reihe werden Boden und Seiten.', 'Die beiden oberen Quadrate klappen beide nach oben.', 'Wo landen die beiden oberen Quadrate?'), { bild: netzBild(n), nachweis: [NETZ('wuerfel', { faltbar: false }), U(false)] }); },
  ]);
  sechs(Q2, 'M', [
    () => bildkarten('Kreuze das Netz an, aus dem sich ein Würfel falten lässt.', [[netzBild(zufallsLage(wahl(WUERFELNETZE))), true], ...[0, 1, 2].map(() => [netzBild(zufallsLage(keinNetz())), false, 'netz-nur-gezaehlt'])],
      H('M', 'Lege eine Fläche als Boden fest und klappe die anderen hoch.', 'Kommen zwei Flächen an dieselbe Stelle, ist es kein Würfelnetz.'), { nachweis: [NETZ('wuerfel')] }),
    () => netzAufgabe('M', 'Im Würfelnetz fehlen zwei Quadrate. Färbe zwei Kästchen so, dass ein Würfelnetz entsteht.', wahl(WUERFELNETZE), H('M', 'Falte in Gedanken: Welche zwei Seiten des Würfels fehlen noch?', 'Setze jedes fehlende Quadrat an eine Kante, an der beim Falten diese Seite entsteht.'), 2),
    () => { const z = zufallsLage(wahl(WUERFELNETZE.slice(6))), { namen, bild } = namenNetz(z), i = zz(0, 5), j = gegenueberVon(z, i);
      return auswahl(`Das Netz wird zu einem Würfel gefaltet. Kreuze die Fläche an, die ${namen[i]} gegenüberliegt.`, [opt(namen[j], true), ...mische(namen.filter((_, k) => k !== i && k !== j)).slice(0, 3).map((x) => opt(x, false, 'gegenueber-benachbart'))],
        H('M', 'Benachbarte Flächen haben im Netz oder beim Falten eine gemeinsame Kante.', 'Gegenüber liegt die einzige Fläche, die nie an die andere stößt.'), { bild, nachweis: [GEGEN(namen[i], { welche: 'gegen' })] }); },
    () => { const [a, b, c] = wahl([[3, 2, 1], [3, 1, 2], [2, 1, 2], [3, 2, 2], [4, 2, 1]]);
      return bildkarten(`Ein Quader hat die Kanten a = ${a} cm, b = ${b} cm und c = ${c} cm. Ein Kästchen steht für 1 cm. Kreuze das Netz des Quaders an.`,
        [[quaderNetz(a, b, c), true], [quaderNetz(a, b, c, { fehlerArt: 'deckel-falsch' }), false, 'netz-nur-gezaehlt'], [quaderNetz(a, b, c, { fehlerArt: 'zu-kurz' }), false, 'netz-nur-gezaehlt'], [quaderNetz(a + 1, b, c), false, 'netz-nur-gezaehlt']],
        H('M', 'Miss in jedem Netz die Rechtecke aus.', 'Es muss zweimal a × b, zweimal a × c und zweimal b × c geben.'), { nachweis: [NETZ('quader', { quader: { a, b, c } })] }); },
    () => { const z = zufallsLage(wahl(WUERFELNETZE)), { namen, bild } = namenNetz(z), i = zz(0, 5), j = gegenueberVon(z, i);
      return auswahl(`Das Netz wird zu einem Würfel gefaltet. Kreuze alle Flächen an, die an ${namen[i]} grenzen.`, namen.filter((_, k) => k !== i).map((x, k) => opt(x, x !== namen[j], x === namen[j] ? 'gegenueber-benachbart' : undefined)),
        H('M', 'Jede Fläche eines Würfels grenzt an vier andere.', 'Nur die gegenüberliegende Fläche grenzt nicht an sie.'), { mehrfach: true, bild, nachweis: [GEGEN(namen[i], { welche: 'nachbar' })] }); },
    () => { const k = kind(), n = zufallsLage(keinNetz());
      return auswahl(`${k} sagt: „Das Netz hat 6 Quadrate und alle hängen zusammen. Also lässt sich ein Würfel falten.“ Beurteile die Aussage.`,
        [opt('Stimmt nicht. Beim Falten kommen zwei Quadrate an dieselbe Stelle.', true), opt('Stimmt. Ein Würfel hat 6 Flächen.', false, 'netz-nur-gezaehlt'), opt('Stimmt. Zusammenhängende Quadrate lassen sich immer falten.', false, 'netz-nur-gezaehlt')],
        H('M', 'Falte das Netz in Gedanken Quadrat für Quadrat.', 'Notiere für jedes Quadrat: Boden, Deckel, vorne, hinten, links oder rechts.'), { bild: netzBild(n), nachweis: [NETZ('wuerfel', { faltbar: false }), U(false)] }); },
  ]);
  sechs(Q2, 'E', [
    () => bildkarten('Genau eines dieser Netze ist ein Würfelnetz. Kreuze es an.', [[netzBild(zufallsLage(wahl(WUERFELNETZE.slice(6)))), true], ...[0, 1, 2, 3].map(() => [netzBild(zufallsLage(keinNetz())), false, 'netz-nur-gezaehlt'])],
      H('E', 'Liegen vier Quadrate in einer Reihe, darf links und rechts davon nur je eines liegen.'), { nachweis: [NETZ('wuerfel')] }),
    () => netzAufgabe('E', 'Im Würfelnetz fehlen drei Quadrate. Färbe drei Kästchen so, dass ein Würfelnetz entsteht.', wahl(WUERFELNETZE), H('E', 'Bestimme zuerst, welche drei Seiten des Würfels fehlen.'), 3),
    () => { const z = zufallsLage(wahl(WUERFELNETZE.slice(6))), { namen, bild } = namenNetz(z), paare = [];
      for (let i = 0; i < 6; i++) { const j = gegenueberVon(z, i); if (i < j) paare.push([namen[i], namen[j]].sort().join(' und ')); }
      const falsch = suche(() => mische(namen).slice(0, 2).sort().join(' und '), (p) => !paare.includes(p));
      return auswahl('Das Netz wird zu einem Würfel gefaltet. Kreuze alle Paare von Flächen an, die sich dann gegenüberliegen.', [...paare.map((p) => opt(p, true)), opt(falsch, false, 'gegenueber-benachbart')],
        H('E', 'Ein Würfel hat genau drei Paare gegenüberliegender Flächen.'), { mehrfach: true, bild, nachweis: [GEGEN(null, { welche: 'paare' })] }); },
    () => { const k = kind();
      return auswahl(`${k} sagt: „Ein Würfelnetz kann nie fünf Quadrate in einer Reihe haben.“ Beurteile die Aussage.`,
        [opt('Stimmt. In einer Reihe falten sich nur vier Quadrate rundherum. Das fünfte liegt auf dem ersten.', true), opt('Stimmt nicht. Mit dem sechsten Quadrat daneben geht es.', false, 'netz-nur-gezaehlt'),
          opt('Stimmt nicht. Fünf Quadrate in einer Reihe sind der Mantel eines Würfels.', false, 'netz-nur-gezaehlt')],
        H('E', 'Rolle einen Würfel über vier Flächen in einer Richtung. Wo landet er beim fünften Mal?'), { nachweis: [U(true), KZ('wuerfel', 'flaechen', 6), '4 + 1 = 5'] }); },
    () => { const n = zufallsLage(wahl(WUERFELNETZE));
      return zahl('Ein Würfelnetz hat 5 Knickkanten zwischen den Quadraten. Beim Falten wird jede andere Kante des Würfels aus zwei Randstücken zusammengeklebt. Gib an, wie viele Kanten geklebt werden.', 7,
        [[14, 'netz-ecken-gezaehlt'], [12, 'kanten-teilweise'], [6, 'netz-nur-gezaehlt']], H('E', 'Ein Würfel hat 12 Kanten. Einige davon sind schon im Netz da.'),
        { bild: netzBild(n), nachweis: [NETZ('wuerfel', { faltbar: true }), KZ('wuerfel', 'kanten', 12), '12 − 5 = 7'] }); },
    () => { const k = kind(), [a, b, c] = wahl([[3, 2, 1], [4, 2, 1], [3, 2, 2]]);
      return auswahl(`${k} hat das Netz eines Quaders mit a = ${a} cm, b = ${b} cm und c = ${c} cm gezeichnet. Ein Kästchen steht für 1 cm. Beurteile das Netz.`,
        [opt('Es ist falsch. Der Deckel liegt neben der Vorderseite und hat die falsche Größe.', true), opt('Es ist richtig. Es hat 6 Rechtecke.', false, 'netz-nur-gezaehlt'), opt('Es ist richtig. Gleich große Rechtecke kommen doppelt vor.', false, 'netz-nur-gezaehlt')],
        H('E', 'Falte in Gedanken. Welche Kanten stoßen aneinander, und sind sie gleich lang?'), { bild: quaderNetz(a, b, c, { fehlerArt: 'deckel-falsch' }), nachweis: [NETZ('quader', { faltbar: false, quader: { a, b, c } }), U(false)] }); },
  ]);
}

export function quaderUndNetze() { q1(); q2(); }
