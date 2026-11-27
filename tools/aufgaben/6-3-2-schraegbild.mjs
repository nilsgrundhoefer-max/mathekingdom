// Aufgaben zu 6.3.2 „Schrägbilder von Quadern“ (Lernziele S1 und S2) nach ADR 0015 und ADR 0045. Pflicht ab Gold, Aufgaben auf allen Stufen.
// S1: Schrägbilder lesen (sichtbare und verdeckte Kanten, Ecken, Maße). S2: im Gitter vervollständigen; Heftaufgaben nur auf M und E (je 2 von 6)
// mit dem Kontrollwert „Breite in Kästchen = 2 · a + b“ oder „Höhe = 2 · c + b“.
// Stolpersteine aus der Niveauübersicht: verdeckte Kanten durchgezogen oder weggelassen, Tiefe nicht verkürzt oder im falschen Winkel.
import { sechs } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, Z, H, zahl, opt, auswahl, kind, U, SB, SICHT, KL, QF, quader, wuerfelBild, prisma, pyramide, bildkarten,
  schraegGitter, gitterEcke, streckeVon, gitterLinie, gitterPunkte, B } from './6-3-koerper.mjs';

const S1 = '6.3.2-S1', S2 = '6.3.2-S2';
const dreiMasse = () => suche(() => [zz(3, 5), zz(2, 4), zz(2, 4)], ([a, b, c]) => new Set([a, b, c]).size === 3 && b < a && b !== 2 * c); // nicht tiefer als breit: sonst fallen D und F im Bild fast zusammen. b = 2c legt D genau auf EF.
const masseVon = (a, b, c) => [{ von: 'A', bis: 'B', t: `${a} cm` }, { von: 'B', bis: 'C', t: `${b} cm` }, { von: 'A', bis: 'E', t: `${c} cm` }];
const PARALLEL = { AB: ['DC', 'EF', 'HG'], BC: ['AD', 'FG', 'EH'], AE: ['BF', 'CG', 'DH'] };
const SICHTBAR = ['AB', 'BC', 'EF', 'FG', 'GH', 'HE', 'AE', 'BF', 'CG'];
const VERDECKT = ['CD', 'DA', 'DH'];
const hVerdeckt = (n) => H(n, 'Gestrichelte Kanten liegen hinten. Man sieht sie nicht.', 'Beim Quader sind es die drei Kanten an der Ecke hinten links unten.', 'Zähle nur die gestrichelten Linien.');
const kantenText = (k) => k;

// ---------- S1: Schrägbilder lesen ----------
function s1() {
  sechs(S1, 'F', [
    () => { const [a, b, c] = dreiMasse();
      return zahl(Z('Das Bild zeigt einen Quader.', 'Zähle die gestrichelten Kanten.'), 3, [[9, 'verdeckt-nicht-gezaehlt'], [12, 'verdeckte-kante-durchgezogen'], [4, 'ecken-kanten-verwechselt']], hVerdeckt('F'),
        { bild: quader(a, b, c), nachweis: [SICHT('kanten', 3)] }); },
    () => { const v = zz(0, 1), k = v ? wahl(VERDECKT) : wahl(SICHTBAR), [a, b, c] = dreiMasse();
      return auswahl(Z(`Die Kante ${k} ist rot.`, 'Kreuze an.'), [opt('Man sieht die Kante.', !v, v ? 'verdeckte-kante-durchgezogen' : undefined), opt('Die Kante ist hinten verdeckt.', Boolean(v), v ? undefined : 'verdeckte-kante-durchgezogen')],
        H('F', 'Schau, ob die rote Linie gestrichelt ist.', 'Gestrichelt heißt: Die Kante liegt hinten.', 'Durchgezogen heißt: Man sieht sie.'), { bild: quader(a, b, c, { namen: true, markiert: { kanten: [k.split('')] } }), nachweis: [{ art: 'kantensicht', kante: k }] }); },
    () => { const [a, b, c] = dreiMasse(), andere = mische(['A', 'B', 'C', 'E', 'F', 'G', 'H']).slice(0, 2);
      return auswahl(Z('Eine Ecke liegt hinten verdeckt.', 'An ihr treffen sich drei gestrichelte Kanten.', 'Kreuze sie an.'), [opt('D', true), ...andere.map((e) => opt(e, false, 'verdeckt-nicht-gezaehlt'))],
        H('F', 'Suche die gestrichelten Linien.', 'Sie treffen sich in einem Punkt.', 'Lies den Buchstaben an diesem Punkt.'), { bild: quader(a, b, c, { namen: true }), nachweis: [{ art: 'eckensicht' }] }); },
    () => { const [a, b, c] = dreiMasse(), [k, w] = wahl([['AB', a], ['BC', b], ['AE', c]]);
      return zahl(Z('Am Quader stehen die Längen.', `Lies die Länge der Kante ${k} ab.`), w, [[a, 'kante-falsch-abgelesen'], [b, 'kante-falsch-abgelesen'], [c, 'kante-falsch-abgelesen']],
        H('F', `Suche die Kante ${k}.`, 'Neben ihr steht eine Zahl mit cm.', 'Das ist ihre Länge.'), { einheit: 'cm', bild: quader(a, b, c, { namen: true, masse: masseVon(a, b, c) }), nachweis: [KL(k, w)] }); },
    () => { const [a, b, c] = dreiMasse();
      return zahl(Z('Manche Flächen des Quaders sieht man.', 'Zähle sie.'), 3, [[6, 'verdeckt-nicht-gezaehlt'], [2, 'verdeckt-nicht-gezaehlt'], [1, 'verdeckt-nicht-gezaehlt']],
        H('F', 'Man sieht die Fläche vorne.', 'Dazu die Fläche oben und die Fläche rechts.', 'Zähle die Flächen mit Farbe.'), { bild: quader(a, b, c), nachweis: [SICHT('flaechen', 3, { verdeckt: false })] }); },
    () => { const [a, b, c] = dreiMasse();
      return bildkarten(Z('Ein Bild ist richtig gezeichnet.', 'Die Kanten hinten sind dort gestrichelt.', 'Kreuze es an.'), [[quader(a, b, c), true], [quader(a, b, c, { verdeckt: 'durchgezogen' }), false, 'verdeckte-kante-durchgezogen'], [quader(a, b, c, { verdeckt: 'ohne' }), false, 'verdeckte-kante-durchgezogen']],
        H('F', 'Suche die Kanten hinten links unten.', 'Sie müssen gestrichelt sein.', 'Prüfe jedes Bild.'), { nachweis: [{ art: 'darstellung' }] }); },
  ]);
  sechs(S1, 'G', [
    () => { const [a, b, c] = dreiMasse();
      return zahl(Z('Das Schrägbild zeigt einen Quader.', 'Gib an, wie viele Kanten verdeckt sind.'), 3, [[9, 'verdeckt-nicht-gezaehlt'], [12, 'verdeckte-kante-durchgezogen'], [1, 'ecken-kanten-verwechselt']], hVerdeckt('G'),
        { bild: quader(a, b, c, { namen: true }), nachweis: [SICHT('kanten', 3)] }); },
    () => { const v = zz(0, 1), k = v ? wahl(VERDECKT) : wahl(SICHTBAR), [a, b, c] = dreiMasse();
      return auswahl(Z(`Schau dir die Kante ${k} an.`, 'Kreuze an.'), [opt(`${k} ist sichtbar.`, !v, v ? 'verdeckte-kante-durchgezogen' : undefined), opt(`${k} ist eine verdeckte Kante.`, Boolean(v), v ? undefined : 'verdeckte-kante-durchgezogen')],
        H('G', 'Verdeckte Kanten sind gestrichelt.', 'Beim Quader sind CD, DA und DH verdeckt.', `Suche die Kante ${k} im Bild.`), { bild: quader(a, b, c, { namen: true }), nachweis: [{ art: 'kantensicht', kante: k }] }); },
    () => { const [a, b, c] = dreiMasse(), [z, w] = wahl([['AB', a], ['BC', b], ['AE', c]]), k = wahl(PARALLEL[z].filter((x) => x !== 'DC' || z !== 'AB'));
      return zahl(Z('Am Quader stehen drei Längen.', `Gib an, wie lang die Kante ${k} ist.`), w, [[a, 'kante-falsch-abgelesen'], [b, 'kante-falsch-abgelesen'], [c, 'kante-falsch-abgelesen']],
        H('G', 'Gleich lange Kanten sind parallel.', `${k} ist parallel zu ${z}.`, `Lies die Länge an ${z} ab.`), { einheit: 'cm', bild: quader(a, b, c, { namen: true, masse: masseVon(a, b, c) }), nachweis: [KL(k, w)] }); },
    () => { const [a, b, c] = dreiMasse(), andere = mische(['A', 'B', 'C', 'E', 'F', 'G', 'H']).slice(0, 2);
      return auswahl(Z('Im Schrägbild ist eine Ecke verdeckt.', 'Kreuze sie an.'), [opt('D', true), ...andere.map((e) => opt(e, false, 'verdeckt-nicht-gezaehlt'))],
        H('G', 'An der verdeckten Ecke treffen sich nur gestrichelte Kanten.', 'Das ist die Ecke hinten links unten.', 'Lies ihren Buchstaben ab.'), { bild: quader(a, b, c, { namen: true }), nachweis: [{ art: 'eckensicht' }] }); },
    () => { const [a, b, c] = dreiMasse();
      return bildkarten(Z('Nur ein Schrägbild ist richtig.', 'Kreuze es an.'), [[quader(a, b, c), true], [quader(a, b, c, { tiefe: 1, fehlerbild: true }), false, 'tiefe-nicht-verkuerzt'], [quader(a, b, c, { verdeckt: 'durchgezogen' }), false, 'verdeckte-kante-durchgezogen']],
        H('G', 'Prüfe zwei Dinge: gestrichelte Kanten und Kanten nach hinten.', 'Kanten nach hinten sind kürzer als in Wirklichkeit.', 'Streiche zuerst das Bild ohne gestrichelte Kanten.'), { nachweis: [{ art: 'darstellung' }] }); },
    () => { const k = kind(), [satz, stimmt, grund, f1, f2] = wahl([
      ['Im Schrägbild sieht man 3 Flächen des Quaders.', true, 'Man sieht vorne, oben und rechts.', 'Man sieht alle 6 Flächen.', 'Man sieht nur die Vorderfläche.'],
      ['Im Schrägbild sind die Kanten nach hinten so lang wie in Wirklichkeit.', false, 'Sie werden kürzer gezeichnet.', 'Alle Kanten haben ihre wahre Länge.', 'Nur die verdeckten Kanten sind kürzer.'],
      ['Verdeckte Kanten lässt man im Schrägbild weg.', false, 'Man zeichnet sie gestrichelt.', 'Man sieht sie ja nicht.', 'Man zeichnet sie dick.']]);
      return auswahl(Z(`${k} sagt: „${satz}“`, 'Prüfe die Aussage.'), [opt(`${stimmt ? 'Stimmt' : 'Stimmt nicht'}. ${grund}`, true), opt(`${stimmt ? 'Stimmt nicht' : 'Stimmt'}. ${f1}`, false, stimmt ? 'verdeckt-nicht-gezaehlt' : 'tiefe-nicht-verkuerzt'), opt(`${stimmt ? 'Stimmt nicht' : 'Stimmt'}. ${f2}`, false, 'verdeckte-kante-durchgezogen')],
        H('G', 'Schau dir ein Schrägbild genau an.', 'Die Vorderfläche hat ihre wahre Größe. Kanten nach hinten laufen schräg.', 'Vergleiche die Aussage mit dem Bild.'), { bild: quader(4, 3, 2), nachweis: [U(stimmt), SICHT('flaechen', 3, { verdeckt: false })] }); },
  ]);
  sechs(S1, 'M', [
    () => { const [a, b, c] = dreiMasse(), [k, w] = wahl([['CD', a], ['DH', c], ['DA', b]]);
      return zahl(`Gib an, wie lang die verdeckte Kante ${k} ist.`, w, [[a, 'kante-falsch-abgelesen'], [b, 'kante-falsch-abgelesen'], [c, 'kante-falsch-abgelesen']],
        H('M', 'Suche die beschriftete Kante, die zu ihr parallel ist.', `${k} ist so lang wie ihre parallele Kante.`), { einheit: 'cm', bild: quader(a, b, c, { namen: true, masse: masseVon(a, b, c) }), nachweis: [KL(k, w)] }); },
    () => { const n = wahl([5, 6]);
      return zahl(`Das Schrägbild zeigt ein ${n === 5 ? 'fünfseitiges' : 'sechsseitiges'} Prisma. Gib an, wie viele Kanten verdeckt sind.`, 5, [[3, 'verdeckt-nicht-gezaehlt'], [3 * n, 'verdeckte-kante-durchgezogen']],
        H('M', 'Zähle die gestrichelten Linien. Denk auch an die Kanten der Grundfläche.', 'Hinten liegen drei gestrichelte Kanten der Grundfläche und zwei Seitenkanten.'), { bild: prisma(n), nachweis: [SICHT('kanten', 5)] }); },
    () => { const n = 4;
      return zahl('Das Schrägbild zeigt eine vierseitige Pyramide. Gib an, wie viele ihrer Flächen man nicht sieht.', 3, [[1, 'verdeckt-nicht-gezaehlt'], [5, 'verdeckt-nicht-gezaehlt'], [2, 'verdeckt-nicht-gezaehlt']],
        H('M', 'Denk an die Grundfläche unten und an die Dreiecke hinten.', 'Sichtbar sind nur die Dreiecke vorne und rechts.'), { bild: pyramide(n, { namen: true }), nachweis: [SICHT('flaechen', 3)] }); },
    () => { const [a, b, c] = dreiMasse(), alle = ['ABCD', 'EFGH', 'ABFE', 'DCGH', 'BCGF', 'ADHE'], weg = wahl(['EFGH', 'ABFE', 'BCGF']);
      return auswahl('Kreuze alle Flächen an, die im Schrägbild verdeckt sind.', alle.filter((f) => f !== weg).map((f) => opt(f, f.includes('D'), f.includes('D') ? undefined : 'verdeckt-nicht-gezaehlt')),
        H('M', 'Verdeckte Flächen haben die verdeckte Ecke D.', 'Es sind der Boden, die Rückseite und die linke Seite.'), { mehrfach: true, bild: quader(a, b, c, { namen: true }), nachweis: [QF('ABCD', 'verdeckt')] }); },
    () => { const [a, b, c] = dreiMasse();
      return zahl(`Der Quader ist a = ${a} cm lang, b = ${b} cm tief und c = ${c} cm hoch. Im Heft zeichnest du für einen Zentimeter Tiefe eine Kästchendiagonale. Gib an, wie viele Kästchendiagonalen die Kante BC lang ist.`, b,
        [[2 * b, 'tiefe-nicht-verkuerzt'], [a, 'kante-falsch-abgelesen'], [c, 'kante-falsch-abgelesen']], H('M', 'BC ist eine Kante nach hinten. Sie ist b cm lang.', 'Für jeden Zentimeter Tiefe eine Kästchendiagonale.'),
        { bild: quader(a, b, c, { namen: true }), nachweis: [SB(a, b, c, [0, 0], { frage: 'tiefe', wert: b })] }); },
    () => { const k = kind(), [a, b, c] = dreiMasse();
      return auswahl(`${k} hat das Schrägbild eines Quaders gezeichnet. Beurteile die Zeichnung.`, [opt('Sie ist falsch. Die verdeckten Kanten müssen gestrichelt sein.', true), opt('Sie ist richtig. Alle 12 Kanten sind zu sehen.', false, 'verdeckte-kante-durchgezogen'),
        opt('Sie ist falsch. Die Kanten nach hinten müssen waagerecht sein.', false, 'tiefe-nicht-verkuerzt'), opt('Sie ist richtig. Ein Schrägbild zeigt alle Kanten gleich.', false, 'verdeckte-kante-durchgezogen')],
        H('M', 'Prüfe die Kanten an der Ecke hinten links unten.', 'Sieht man diese Kanten in Wirklichkeit?'), { bild: quader(a, b, c, { verdeckt: 'durchgezogen' }), nachweis: [{ art: 'darstellung', stimmt: false }, U(false), { zahl: 12, grund: 'Kanten des Quaders' }] }); },
  ]);
  sechs(S1, 'E', [
    () => { const n = wahl([3, 6]), b = prisma(n), w = n === 3 ? 1 : 2;
      return zahl(`Das Schrägbild zeigt ein ${n === 3 ? 'dreiseitiges' : 'sechsseitiges'} Prisma. Gib an, wie viele Ecken verdeckt sind.`, w, [[0, 'verdeckt-nicht-gezaehlt'], [w + 2, 'verdeckt-nicht-gezaehlt']],
        H('E', 'Eine Ecke ist verdeckt, wenn an ihr nur gestrichelte Kanten liegen.'), { bild: b, nachweis: [SICHT('ecken', w)] }); },
    () => { const [a, b, c] = dreiMasse(), w = 2 * c + b;
      return zahl(`Ein Quader hat a = ${a} cm, b = ${b} cm und c = ${c} cm. Du zeichnest sein Schrägbild ins Heft: Ein Zentimeter sind zwei Kästchen. Ein Zentimeter Tiefe ist eine Kästchendiagonale. Gib an, wie viele Kästchen hoch das Schrägbild ist.`, w,
        [[2 * c, 'tiefe-nicht-verkuerzt'], [2 * c + 2 * b, 'tiefe-nicht-verkuerzt'], [c + b, 'tiefe-nicht-verkuerzt']], H('E', 'Die Höhe der Vorderfläche und dazu, wie weit die Kanten nach hinten oben gehen.'),
        { nachweis: [SB(a, b, c, [0, 0], { frage: 'hoehe', wert: w }), `2 · ${c} + ${b} = ${w}`] }); },
    () => { const a = zz(3, 6), b = zz(2, 5), c = zz(2, 4), breit = 2 * a + b;
      return zahl(`Das Schrägbild eines Quaders ist im Heft ${breit} Kästchen breit. Die Vorderfläche ist ${2 * a} Kästchen breit. Gib an, wie viele Zentimeter tief der Quader ist.`, b,
        [[b * 2, 'tiefe-nicht-verkuerzt'], [Math.round(b / 2) || 1, 'tiefe-nicht-verkuerzt']].filter(([x]) => x !== b), H('E', 'Was über die Vorderfläche hinausgeht, kommt von den Kanten nach hinten.'),
        { nachweis: [SB(a, b, c, [0, 0], { frage: 'breite', wert: breit }), `${breit} − ${2 * a} = ${b}`] }); },
    () => { const k = kind(), [satz, stimmt, grund] = wahl([
      ['Im Schrägbild eines Quaders sind immer genau 3 Kanten verdeckt.', true, 'Verdeckt sind die drei Kanten an der Ecke hinten links unten.'],
      ['Im Schrägbild eines Quaders kann man 4 Flächen sehen.', false, 'Man sieht nur vorne, oben und rechts. Das sind 3 Flächen.'],
      ['Im Schrägbild eines Würfels sind alle Kanten gleich lang gezeichnet.', false, 'Die Kanten nach hinten werden kürzer gezeichnet.']]);
      return auswahl(`${k} sagt: „${satz}“ Beurteile die Aussage.`, [opt(`${stimmt ? 'Stimmt' : 'Stimmt nicht'}. ${grund}`, true), opt(`${stimmt ? 'Stimmt nicht' : 'Stimmt'}. Das hängt davon ab, wie groß der Quader ist.`, false, 'verdeckt-nicht-gezaehlt'),
        opt(`${stimmt ? 'Stimmt nicht' : 'Stimmt'}. Im Schrägbild sieht man alle Teile gleich gut.`, false, 'verdeckte-kante-durchgezogen')],
        H('E', 'Denk an die Regel: Wir schauen immer von vorne, rechts und oben auf den Körper.'), { nachweis: [U(stimmt), SICHT('kanten', 3), { zahl: 4, grund: 'Behauptung' }] , bild: quader(3, 2, 2) }); },
    () => { const n = wahl([4, 5, 6]), b = pyramide(n);
      const w = { 4: 3, 5: 5, 6: 5 }[n];
      return zahl(`Das Schrägbild zeigt eine ${n === 4 ? 'vierseitige' : n === 5 ? 'fünfseitige' : 'sechsseitige'} Pyramide. Gib an, wie viele Kanten verdeckt sind.`, w, [[w - 1, 'verdeckt-nicht-gezaehlt'], [w + 1, 'verdeckt-nicht-gezaehlt']],
        H('E', 'Zähle die gestrichelten Linien: an der Grundfläche und hinauf zur Spitze.'), { bild: b, nachweis: [SICHT('kanten', w)] }); },
    () => { const [a, b, c] = dreiMasse();
      return bildkarten('Genau ein Schrägbild ist richtig gezeichnet. Kreuze es an.', [[quader(a, b, c), true], [quader(a, b, c, { tiefe: 1, fehlerbild: true }), false, 'tiefe-nicht-verkuerzt'], [quader(a, b, c, { verdeckt: 'durchgezogen' }), false, 'verdeckte-kante-durchgezogen'],
        [quader(a, b, c, { verdeckt: 'ohne' }), false, 'verdeckte-kante-durchgezogen'], [quader(a, b, c, { tiefe: 0.25, fehlerbild: true }), false, 'tiefe-nicht-verkuerzt']],
        H('E', 'Prüfe bei jedem Bild: Verdeckte Kanten gestrichelt? Ist die Tiefe halb so lang wie in Wirklichkeit?'), { nachweis: [{ art: 'darstellung' }] }); },
  ]);
}

// ---------- S2: im Gitter vervollständigen und im Heft zeichnen ----------
const P = (a, b, c, o, e) => gitterEcke(a, b, c, o, e);
const plus = (p, d) => [p[0] + d[0], p[1] + d[1]];
// Eine Kante fehlt: zeichnen. fehler: [[endpunkt statt des richtigen, fehlvorstellung]] (vom ersten Punkt der Kante aus).
function kanteZeichnen(text, [a, b, c], k, hilfen, { namen = false, fehler = [] } = {}) {
  const { o, gitter } = schraegGitter(a, b, c, { ohne: [k], namen });
  const bed = streckeVon(a, b, c, o, k), p = bed.a;
  const fl = fehler.map(([d, fv]) => [{ art: 'strecke', a: p, b: plus(p, d) }, fv]).filter(([x]) => !(x.b[0] === bed.b[0] && x.b[1] === bed.b[1]) && x.b[0] <= gitter.b && x.b[1] <= gitter.h);
  return gitterLinie(text, gitter, 'strecke', bed, [bed.a, bed.b], fl, hilfen, { nachweis: [{ art: 'linie' }, SB(a, b, c, o, { kante: k })] });
}
function eckeTippen(text, [a, b, c], e, kanten, hilfen, { namen = false, fehler = [] } = {}) {
  const { o, gitter } = schraegGitter(a, b, c, { kanten, namen, extraB: 1, extraH: 1 }), l = P(a, b, c, o, e);
  const fl = fehler.map(([q, fv]) => [[q(o)], fv]).filter(([[q]]) => !(q[0] === l[0] && q[1] === l[1]) && q[0] <= gitter.b && q[1] <= gitter.h);
  return gitterPunkte(text, gitter, [l], fl, hilfen, { nachweis: [SB(a, b, c, o, { ecke: e, kanten })] });
}
const VORNE = ['AB', 'BF', 'EF', 'AE'];
const hKante = (n) => H(n, 'Kanten nach hinten gehen schräg nach rechts oben.', 'Für 1 cm Tiefe geht es 1 Kästchen nach rechts und 1 nach oben.', 'Parallele Kanten haben im Bild dieselbe Richtung.');

function s2() {
  sechs(S2, 'F', [
    () => kanteZeichnen(Z('Am Würfel fehlt eine Kante.', 'Sie ist vorne rechts.', 'Zeichne sie ein.'), [2, 2, 2], 'BF', H('F', 'Die Kante geht senkrecht nach oben.', 'Sie ist so lang wie die Kante vorne links.', 'Verbinde die beiden Ecken vorne rechts.')),
    () => kanteZeichnen(Z('Am Würfel fehlt eine Kante.', 'Sie liegt oben hinten.', 'Zeichne sie ein.'), [2, 2, 2], 'GH', H('F', 'Die Kante liegt waagerecht.', 'Sie ist so lang wie die Kante vorne oben.', 'Verbinde die beiden Ecken oben hinten.')),
    () => eckeTippen(Z('Am Würfel fehlt eine Ecke.', 'Sie liegt hinten rechts oben.', 'Tippe sie an.'), [2, 2, 2], 'G', ['AB', 'BC', 'CD', 'DA', 'EF', 'HE', 'AE', 'BF', 'DH'],
      H('F', 'Geh von der Ecke vorne rechts oben schräg nach hinten.', 'Genauso weit wie unten.', 'Gehe von C senkrecht nach oben.'), { fehler: [[(o) => plus(P(2, 2, 2, o, 'F'), [4, 4]), 'tiefe-nicht-verkuerzt']] }),
    () => { const d = 2; return kanteZeichnen(Z('Am Würfel fehlt eine Kante.', 'Sie geht oben rechts nach hinten.', 'Zeichne sie ein.'), [d, d, d], 'FG', hKante('F'), { fehler: [[[2 * d, 2 * d], 'tiefe-nicht-verkuerzt'], [[2 * d, 0], 'tiefe-nicht-verkuerzt']] }); },
    () => kanteZeichnen(Z('Am Würfel fehlt die Kante von D nach H.', 'Sie ist verdeckt.', 'Zeichne sie ein.'), [2, 2, 2], 'DH', H('F', 'D liegt hinten unten, H liegt hinten oben.', 'Die Kante geht senkrecht nach oben.', 'Verbinde D und H.'), { namen: true }),
    () => eckeTippen(Z('Eine Ecke liegt hinten verdeckt.', 'Tippe sie an.'), [2, 2, 2], 'D', null,
      H('F', 'An der verdeckten Ecke treffen sich gestrichelte Kanten.', 'Sie liegt hinten links unten.', 'Tippe den Punkt an, an dem die gestrichelten Linien zusammenkommen.'), { fehler: [[(o) => P(2, 2, 2, o, 'H'), 'verdeckt-nicht-gezaehlt'], [(o) => P(2, 2, 2, o, 'C'), 'verdeckt-nicht-gezaehlt']] }),
  ]);
  sechs(S2, 'G', [
    () => { const m = dreiMasse(); return kanteZeichnen(Z('Am Quader fehlt die Kante unten rechts.', 'Sie geht nach hinten.', 'Zeichne sie ein.'), m, 'BC', hKante('G'), { fehler: [[[2 * m[1], 2 * m[1]], 'tiefe-nicht-verkuerzt'], [[2 * m[1], 0], 'tiefe-nicht-verkuerzt']] }); },
    () => kanteZeichnen(Z('Am Quader fehlt die Kante von C nach G.', 'Zeichne sie ein.'), dreiMasse(), 'CG', H('G', 'Die Kante ist parallel zu BF.', 'Sie geht senkrecht nach oben.', 'Verbinde C und G.'), { namen: true }),
    () => eckeTippen(Z('Am Quader fehlt die Ecke H.', 'Tippe sie an.'), dreiMasse(), 'H', ['AB', 'BC', 'CD', 'DA', 'EF', 'FG', 'AE', 'BF', 'CG'],
      H('G', 'H liegt über D.', 'Von E aus geht es genauso schräg nach hinten wie von A nach D.', 'Gehe von D senkrecht nach oben, so weit wie von A nach E.'), { namen: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] }),
    () => kanteZeichnen(Z('Am Quader fehlt eine verdeckte Kante.', 'Sie geht von C nach D.', 'Zeichne sie ein.'), dreiMasse(), 'CD', H('G', 'Die Kante ist parallel zu AB.', 'Sie liegt hinten unten.', 'Verbinde C und D.'), { namen: true }),
    () => { const [a, b, c] = dreiMasse(), { o, gitter } = schraegGitter(a, b, c, { namen: true });
      return zahl(Z(`Der Quader ist ${b} cm tief.`, 'Die Kante BC geht nach hinten.', 'Gib an, wie viele Kästchen sie nach rechts geht.'), b, [[2 * b, 'tiefe-nicht-verkuerzt'], [b + 1, 'tiefe-nicht-verkuerzt']],
        H('G', 'Für 1 cm Tiefe geht es 1 Kästchen nach rechts und 1 nach oben.', 'Bei 2 cm Tiefe sind es 2 Kästchen nach rechts.', `Zähle die Kästchen von B bis C.`), { bild: B.gitter(gitter), nachweis: [SB(a, b, c, o, { frage: 'tiefe', wert: b })] }); },
    () => { const m = dreiMasse(); return kanteZeichnen(Z('Am Quader fehlt noch eine Kante.', 'Sie ist verdeckt.', 'Sie geht von A nach hinten.', 'Zeichne sie ein.'), m, 'DA', hKante('G'), { fehler: [[[2 * m[1], 2 * m[1]], 'tiefe-nicht-verkuerzt'], [[2 * m[1], 0], 'tiefe-nicht-verkuerzt']] }); },
  ]);
  sechs(S2, 'M', [
    () => { const m = dreiMasse(); return kanteZeichnen(`Der Quader ist ${m[0]} cm lang, ${m[1]} cm tief und ${m[2]} cm hoch. Zeichne die fehlende Kante ein.`, m, 'FG', H('M', 'Die fehlende Kante läuft nach hinten. Sie ist im Bild verkürzt.', `Für ${m[1]} cm Tiefe ${m[1]} Kästchen nach rechts und ${m[1]} nach oben.`), { fehler: [[[2 * m[1], 2 * m[1]], 'tiefe-nicht-verkuerzt'], [[2 * m[1], 0], 'tiefe-nicht-verkuerzt']] }); },
    () => { const [a, b, c] = dreiMasse(), w = 2 * a + b;
      return zahl(`Zeichne das Schrägbild eines Quaders mit a = ${a} cm, b = ${b} cm und c = ${c} cm in dein Heft. Gib an, wie viele Kästchen breit dein Schrägbild ist.`, w,
        [[2 * a + 2 * b, 'tiefe-nicht-verkuerzt'], [2 * a, 'tiefe-nicht-verkuerzt'], [a + b, 'tiefe-nicht-verkuerzt']], H('M', '1 cm sind 2 Kästchen. Für 1 cm Tiefe geht es 1 Kästchen nach rechts.', `2 · ${a} + ${b} = ${w}`),
        { nachweis: [SB(a, b, c, [0, 0], { frage: 'breite', wert: w }), `2 · ${a} + ${b} = ${w}`] }); },
    () => { const m = dreiMasse(); return eckeTippen(`Gezeichnet ist die Vorderfläche eines Quaders, der ${m[1]} cm tief ist. Tippe die Stelle an, an der die Ecke G liegt.`, m, 'G', VORNE,
      H('M', 'G liegt hinter F.', `Von F aus ${m[1]} Kästchen nach rechts und ${m[1]} nach oben.`), { namen: ['A', 'B', 'E', 'F'], fehler: [[(o) => plus(P(...m, o, 'F'), [2 * m[1], 2 * m[1]]), 'tiefe-nicht-verkuerzt'], [(o) => plus(P(...m, o, 'F'), [2 * m[1], 0]), 'tiefe-nicht-verkuerzt']] }); },
    () => kanteZeichnen('Zeichne die Kante GH ein.', dreiMasse(), 'GH', H('M', 'GH ist parallel zu EF und genauso lang.', 'Verbinde die Ecken G und H oben hinten.'), { namen: true }),
    () => { const [a, b, c] = dreiMasse(), w = 2 * c + b;
      return zahl(`Zeichne das Schrägbild eines Quaders mit a = ${a} cm, b = ${b} cm und c = ${c} cm in dein Heft. Gib an, wie viele Kästchen hoch dein Schrägbild ist.`, w,
        [[2 * c + 2 * b, 'tiefe-nicht-verkuerzt'], [2 * c, 'tiefe-nicht-verkuerzt'], [c + b, 'tiefe-nicht-verkuerzt']], H('M', 'Die Kanten nach hinten gehen auch nach oben: 1 Kästchen je cm.', `2 · ${c} + ${b} = ${w}`),
        { nachweis: [SB(a, b, c, [0, 0], { frage: 'hoehe', wert: w }), `2 · ${c} + ${b} = ${w}`] }); },
    () => { const k = kind(), b = zz(2, 5), [schritt, stimmt] = wahl([[b, true], [2 * b, false]]);
      return auswahl(`${k} zeichnet einen Quader mit ${b} cm Tiefe. Die Kanten nach hinten zeichnet ${k} ${schritt} Kästchen nach rechts und ${schritt} Kästchen nach oben. Beurteile die Zeichnung.`,
        [opt(stimmt ? `Richtig. ${b} cm Tiefe sind ${b} Kästchendiagonalen.` : `Falsch. ${b} cm Tiefe sind nur ${b} Kästchendiagonalen.`, true), opt(stimmt ? `Falsch. Es müssen ${2 * b} Kästchen sein, denn 1 cm sind 2 Kästchen.` : 'Richtig. 1 cm sind immer 2 Kästchen.', false, 'tiefe-nicht-verkuerzt'),
          opt(stimmt ? 'Falsch. Kanten nach hinten zeichnet man waagerecht.' : 'Richtig. So wird der Quader schön groß.', false, 'tiefe-nicht-verkuerzt')],
        H('M', 'Im Schrägbild wird die Tiefe verkürzt.', 'Für 1 cm Tiefe zeichnest du eine Kästchendiagonale.'), { nachweis: [U(stimmt), SB(4, b, 2, [0, 0], { frage: 'tiefe', wert: b }), `2 · ${b} = ${2 * b}`] }); },
  ]);
  sechs(S2, 'E', [
    () => { const m = suche(() => [zz(3, 5), zz(2, 4), zz(2, 3)], ([a, b, c]) => b < a && b !== 2 * c); return kanteZeichnen(`Der Quader ist ${m[0]} cm lang, ${m[1]} cm tief und ${m[2]} cm hoch. Zeichne die fehlende Kante ein.`, m, 'BC', H('E', 'Prüfe die Richtung an einer anderen Kante nach hinten.'),
      { fehler: [[[2 * m[1], 2 * m[1]], 'tiefe-nicht-verkuerzt'], [[2 * m[1], 0], 'tiefe-nicht-verkuerzt']] }); },
    () => { const a = zz(3, 5), w = 3 * a;
      return zahl(`Zeichne das Schrägbild eines Würfels mit ${a} cm Kantenlänge in dein Heft. Gib an, wie viele Kästchen breit dein Schrägbild ist.`, w,
        [[4 * a, 'tiefe-nicht-verkuerzt'], [2 * a, 'tiefe-nicht-verkuerzt']], H('E', 'Breite der Vorderfläche und dazu, wie weit die Kanten nach hinten nach rechts gehen.'),
        { nachweis: [SB(a, a, a, [0, 0], { frage: 'breite', wert: w }), `2 · ${a} + ${a} = ${w}`] }); },
    () => { const m = dreiMasse(); return eckeTippen(`Gezeichnet ist die Vorderfläche eines Quaders, der ${m[1]} cm tief ist. Tippe die Stelle an, an der die verdeckte Ecke D liegt.`, m, 'D', VORNE,
      H('E', 'D liegt hinter A.'), { namen: ['A', 'B', 'E', 'F'], fehler: [[(o) => plus(P(...m, o, 'A'), [2 * m[1], 2 * m[1]]), 'tiefe-nicht-verkuerzt'], [(o) => plus(P(...m, o, 'A'), [2 * m[1], 0]), 'tiefe-nicht-verkuerzt']] }); },
    () => { const a = zz(3, 6), w = 3 * a;
      return zahl(`Das Schrägbild eines Würfels ist im Heft ${w} Kästchen breit. Gib die Kantenlänge des Würfels an.`, a, [[w / 2 === Math.floor(w / 2) ? w / 2 : 0, 'tiefe-nicht-verkuerzt'], [Math.floor(w / 4), 'tiefe-nicht-verkuerzt']],
        H('E', 'Die Vorderfläche ist 2 Kästchen je cm breit. Dazu kommt 1 Kästchen je cm Tiefe.'), { einheit: 'cm', nachweis: [SB(a, a, a, [0, 0], { frage: 'breite', wert: w }), `${w} : 3 = ${a}`] }); },
    () => { const [a, b, c] = [zz(3, 6), zz(3, 5), zz(2, 4)], w = 2 * c + b;
      return zahl(`Zeichne das Schrägbild eines Quaders mit a = ${a} cm, b = ${b} cm und c = ${c} cm in dein Heft. Gib an, wie viele Kästchen hoch dein Schrägbild ist.`, w,
        [[2 * c + 2 * b, 'tiefe-nicht-verkuerzt'], [2 * c, 'tiefe-nicht-verkuerzt']], H('E', 'Denk daran: Kanten nach hinten gehen auch nach oben.'),
        { nachweis: [SB(a, b, c, [0, 0], { frage: 'hoehe', wert: w }), `2 · ${c} + ${b} = ${w}`] }); },
    () => { const k = kind();
      return auswahl(`${k} sagt: „Im Schrägbild ist eine Kante nach hinten genauso lang wie in Wirklichkeit. Eine Kästchendiagonale ist ja 1 cm.“ Beurteile die Aussage.`,
        [opt('Stimmt nicht. Eine Kästchendiagonale ist kürzer als 1 cm. Die Tiefe wird verkürzt gezeichnet.', true), opt('Stimmt. Eine Kästchendiagonale ist so lang wie zwei Kästchen, also genau 1 cm.', false, 'tiefe-nicht-verkuerzt'),
          opt('Stimmt. Nur die verdeckten Kanten werden kürzer.', false, 'verdeckte-kante-durchgezogen'), opt('Stimmt nicht. Die Kante wird länger gezeichnet.', false, 'tiefe-nicht-verkuerzt')],
        H('E', 'Miss eine Kästchendiagonale in deinem Heft mit dem Lineal.'), { nachweis: [U(false), { zahl: 1, grund: 'Behauptung' }] }); },
  ]);
}

export function schraegbilder() { s1(); s2(); }
