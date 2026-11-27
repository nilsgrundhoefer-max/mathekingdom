// Aufgaben zu 6.3.4 „Prisma“ (Lernziele P1 und P2) nach ADR 0015 und ADR 0045.
// P1: Prismen erkennen, benennen, Ecken, Kanten und Flächen zählen. P2: Netze von Prismen erkennen und prüfen.
// Wortspeicher: F ohne „Prisma“ und „Grundfläche“ (der Körper heißt dort „Zelt“), ab G „Prisma“, ab M „Mantelfläche“.
// Prismennetze sind immer Streifen aus Rechtecken mit je einem Vieleck oben und unten (sonst kann der Prüfer sie nicht falten).
// Kein vierseitiges Prisma in Netzaufgaben: Sein Netz ist ein Quadernetz.
import { sechs } from '../werkzeug.mjs';
import { zz, wahl, mische, Z, H, zahl, opt, auswahl, kind, U, KZ, KA, NETZ, AF, NT, prisma, pyramide, quader, rund, bildkarten, prismaNetz, ECK } from './6-3-koerper.mjs';

const P1 = '6.3.4-P1', P2 = '6.3.4-P2';
const NETZMASS = { 3: [2, 3], 5: [1.5, 3], 6: [1.4, 2.6], 8: [1, 2.5] };
const netz = (n, o = {}) => prismaNetz(n, ...NETZMASS[n], o);
const zelt = () => prisma(3);
const PN = { 3: 'dreiseitiges', 5: 'fünfseitiges', 6: 'sechsseitiges', 8: 'achtseitiges' };
const nameOpts = (n, liste) => liste.map((m) => opt(`${PN[m]} Prisma`, m === n, m === n ? undefined : 'name-nach-seitenflaeche'));
const hZaehlen = (n, was) => H(n, `Zähle die ${was} der Reihe nach.`, 'Fange vorne an und markiere in Gedanken, was du schon gezählt hast.', 'Denk auch an die Teile hinten.');

// ---------- P1: Prismen erkennen und zählen ----------
function p1() {
  sechs(P1, 'F', [
    () => zahl(Z('Das Bild zeigt einen Körper wie ein Zelt.', 'Zähle seine Flächen.'), 5, [[2, 'runde-koerper-zaehlen'], [3, 'koerper-unvollstaendig-gezaehlt'], [6, 'wuerfel-kein-quader']],
      H('F', 'Vorne und hinten ist je ein Dreieck.', 'Dazu kommen die Rechtecke: zwei Dachflächen und der Boden.', 'Zähle Dreiecke und Rechtecke zusammen.'), { bild: zelt(), nachweis: [KZ('prisma', 'flaechen', 5, { n: 3, bild: true })] }),
    () => zahl(Z('Das Bild zeigt einen Körper wie ein Zelt.', 'Zähle seine Ecken.'), 6, [[3, 'koerper-unvollstaendig-gezaehlt'], [5, 'koerper-unvollstaendig-gezaehlt'], [9, 'ecken-kanten-verwechselt']],
      H('F', 'Jedes Dreieck hat drei Ecken.', 'Vorne und hinten ist je ein Dreieck.', 'Zähle die Ecken vorne und hinten zusammen.'), { bild: zelt(), nachweis: [KZ('prisma', 'ecken', 6, { n: 3, bild: true })] }),
    () => bildkarten(Z('Ein Körper hat zwei Dreiecke und drei Rechtecke als Flächen.', 'Kreuze ihn an.'), [[zelt(), true], [pyramide(4), false, 'prisma-pyramide'], [quader(4, 2, 2), false, 'koerper-verwechselt']],
      H('F', 'Suche die Dreiecke in den Bildern.', 'Der Körper hat genau zwei davon.', 'Die anderen Flächen sind Rechtecke.'), { nachweis: [KA('prisma', { n: 3 }), { zahl: 2, grund: 'Dreiecke' }, { zahl: 3, grund: 'Rechtecke' }] }),
    () => auswahl(Z('Du schaust von vorne auf das Zelt.', 'Kreuze die Form der Ansicht an.'), ['Dreieck', 'Rechteck', 'Kreis'].map((f) => opt(f, f === 'Dreieck', f === 'Dreieck' ? undefined : 'riss-verwechselt')),
      H('F', 'Vorne ist der Eingang des Zelts.', 'Er hat drei Ecken.', 'Welche Form hat drei Ecken?'), { bild: zelt(), nachweis: [AF('prisma', 'vorne', { n: 3, liegend: true })] }),
    () => zahl(Z('Das Bild zeigt einen Körper wie ein Zelt.', 'Zähle seine Kanten.'), 9, [[6, 'koerper-unvollstaendig-gezaehlt'], [8, 'koerper-unvollstaendig-gezaehlt'], [5, 'ecken-kanten-verwechselt']],
      H('F', 'Zähle zuerst die Kanten am Dreieck vorne.', 'Dann die Kanten am Dreieck hinten.', 'Dazu kommen die Kanten von vorne nach hinten.'), { bild: zelt(), nachweis: [KZ('prisma', 'kanten', 9, { n: 3, bild: true })] }),
    () => auswahl(Z('Du schaust von oben auf das Zelt.', 'Kreuze die Form der Ansicht an.'), ['Rechteck', 'Dreieck', 'Kreis'].map((f) => opt(f, f === 'Rechteck', f === 'Rechteck' ? undefined : 'riss-verwechselt')),
      H('F', 'Von oben siehst du die beiden Dachflächen.', 'Zusammen sind sie so lang und so breit wie der Boden.', 'Der Boden ist ein Rechteck.'), { bild: zelt(), nachweis: [AF('prisma', 'oben', { n: 3, liegend: true })] }),
  ]);
  sechs(P1, 'G', [
    () => zahl(Z('Das Bild zeigt ein fünfseitiges Prisma.', 'Gib an, wie viele Ecken es hat.'), 10, [[5, 'koerper-unvollstaendig-gezaehlt'], [7, 'koerper-unvollstaendig-gezaehlt'], [15, 'ecken-kanten-verwechselt']],
      H('G', 'Oben und unten ist je ein Fünfeck.', 'Jedes Fünfeck hat fünf Ecken.', 'Zähle die Ecken oben und unten zusammen.'), { bild: prisma(5), nachweis: [KZ('prisma', 'ecken', 10, { n: 5, bild: true })] }),
    () => zahl(Z('Das Bild zeigt ein sechsseitiges Prisma.', 'Gib an, wie viele Flächen es hat.'), 8, [[6, 'koerper-unvollstaendig-gezaehlt'], [2, 'koerper-unvollstaendig-gezaehlt'], [12, 'ecken-kanten-verwechselt']],
      H('G', 'Oben und unten ist je eine Grundfläche.', 'Rundherum liegt an jeder Seite des Sechsecks ein Rechteck.', 'Zähle die Rechtecke und die zwei Grundflächen zusammen.'), { bild: prisma(6), nachweis: [KZ('prisma', 'flaechen', 8, { n: 6, bild: true })] }),
    () => { const n = wahl([3, 5, 6]);
      return auswahl(Z('Das Bild zeigt ein Prisma.', 'Kreuze seinen Namen an.'), nameOpts(n, [3, 5, 6]),
        H('G', 'Der Name kommt von der Grundfläche.', 'Zähle die Ecken der Grundfläche.', 'Drei Ecken: dreiseitig, fünf Ecken: fünfseitig.'), { bild: prisma(n), nachweis: [KA('prisma', { n, bild: true })] }); },
    () => bildkarten(Z('Ein Prisma hat zwei gleiche Grundflächen.', 'Kreuze alle Prismen an.'), [[prisma(wahl([3, 5])), true], [prisma(6), true], [pyramide(wahl([4, 5])), false, 'prisma-pyramide'], [rund('kegel'), false, 'koerper-verwechselt']],
      H('G', 'Suche Körper mit einer Grundfläche oben und einer gleichen unten.', 'Die Seitenflächen dazwischen sind Rechtecke.', 'Ein Körper mit Spitze ist kein Prisma.'), { mehrfach: true, nachweis: [KA('prisma')] }),
    () => { const n = wahl([5, 6]);
      return zahl(Z(`Die Grundfläche eines Prismas ist ein ${ECK[n]}.`, 'Gib an, wie viele Kanten das Prisma hat.'), 3 * n, [[2 * n, 'koerper-unvollstaendig-gezaehlt'], [n, 'koerper-unvollstaendig-gezaehlt'], [2 * n, 'ecken-kanten-verwechselt']],
        H('G', `Oben und unten hat das ${ECK[n]} je ${n} Kanten.`, 'Dazu kommt an jeder Ecke eine Kante von unten nach oben.', `Rechne: ${n} + ${n} + ${n}.`), { nachweis: [KZ('prisma', 'kanten', 3 * n, { n })] }); },
    () => { const n = wahl([5, 6, 8]);
      return zahl(Z(`Ein Prisma hat ein ${ECK[n]} als Grundfläche.`, 'Gib an, wie viele Ecken es hat.'), 2 * n, [[n, 'koerper-unvollstaendig-gezaehlt'], [3 * n, 'ecken-kanten-verwechselt'], [n + 2, 'ecken-kanten-verwechselt']],
        H('G', 'Ecken gibt es nur an den beiden Grundflächen.', `Jedes ${ECK[n]} hat ${n} Ecken.`, `Rechne: ${n} + ${n}.`), { nachweis: [KZ('prisma', 'ecken', 2 * n, { n })] }); },
  ]);
  sechs(P1, 'M', [
    () => zahl('Das Bild zeigt ein sechsseitiges Prisma. Gib an, wie viele Kanten es hat.', 18, [[12, 'koerper-unvollstaendig-gezaehlt'], [15, 'koerper-unvollstaendig-gezaehlt'], [8, 'ecken-kanten-verwechselt']],
      H('M', 'Zähle getrennt: Kanten oben, Kanten unten, Kanten dazwischen.', '6 + 6 + 6 = 18'), { bild: prisma(6), nachweis: [KZ('prisma', 'kanten', 18, { n: 6, bild: true })] }),
    () => { const n = wahl([5, 6, 8]), k = 3 * n;
      return zahl(`Ein Prisma hat ${k} Kanten. Gib an, wie viele Ecken seine Grundfläche hat.`, n, [[k / 3 * 2, 'ecken-kanten-verwechselt'], [k / 2, 'koerper-unvollstaendig-gezaehlt']].filter(([x]) => Number.isInteger(x)),
        H('M', 'Ein Prisma mit n Ecken an der Grundfläche hat 3 · n Kanten.', `${k} : 3 = ${n}`), { nachweis: [KZ('prisma', 'kanten', k, { n }), `${k} : 3 = ${n}`] }); },
    () => { const n = wahl([5, 6, 8]);
      return zahl(`Die Mantelfläche eines Prismas besteht aus ${n} Rechtecken. Gib an, wie viele Flächen das Prisma insgesamt hat.`, n + 2, [[n, 'koerper-unvollstaendig-gezaehlt'], [n + 1, 'koerper-unvollstaendig-gezaehlt'], [2 * n, 'ecken-kanten-verwechselt']],
        H('M', 'Die Mantelfläche ist der Streifen um das Prisma herum.', `Dazu kommen die beiden Grundflächen: ${n} + 2.`), { nachweis: [KZ('prisma', 'flaechen', n + 2, { n })] }); },
    () => { const n = wahl([5, 6]);
      return bildkarten(`Kreuze das Prisma mit ${2 * n} Ecken an.`, mische([[prisma(n), true], [prisma(n === 5 ? 6 : 5), false, 'koerper-unvollstaendig-gezaehlt'], [prisma(3), false, 'koerper-unvollstaendig-gezaehlt'], [pyramide(n), false, 'prisma-pyramide']]),
        H('M', 'Die Ecken liegen je zur Hälfte oben und unten.', `${2 * n} : 2 = ${n} Ecken hat eine Grundfläche.`), { nachweis: [KA('prisma', { n }), KZ('prisma', 'ecken', 2 * n, { n })] }); },
    () => { const k = kind(), [satz, stimmt, grund, falsch] = wahl([
      ['Jeder Quader ist ein Prisma.', true, 'Stimmt. Seine Grundflächen sind zwei gleiche Rechtecke.', 'Stimmt nicht. Ein Prisma hat immer Dreiecke.'],
      ['Ein Prisma hat immer eine gerade Anzahl von Ecken.', true, 'Stimmt. Oben und unten sind gleich viele Ecken.', 'Stimmt nicht. Ein fünfseitiges Prisma hat 5 Ecken.'],
      ['Die Mantelfläche eines Prismas besteht aus Dreiecken.', false, 'Stimmt nicht. Die Mantelfläche besteht aus Rechtecken.', 'Stimmt. Die Seitenflächen laufen oben spitz zu.']]);
      return auswahl(`${k} sagt: „${satz}“ Beurteile die Aussage.`, [opt(grund, true), opt(falsch, false, 'prisma-pyramide'), opt(stimmt ? 'Stimmt nicht. Das gilt nur für dreiseitige Prismen.' : 'Stimmt. Das gilt für alle Prismen.', false, 'koerper-verwechselt')],
        H('M', 'Denk an ein Prisma, das du kennst, und prüfe daran.', 'Ein Gegenbeispiel genügt, um eine Aussage zu widerlegen.'), { nachweis: [U(stimmt), { zahl: 5, grund: 'Behauptung' }] }); },
    () => auswahl('Du schaust von oben auf das sechsseitige Prisma. Kreuze die Form der Ansicht an.', ['Sechseck', 'Rechteck', 'Dreieck', 'Kreis'].map((f) => opt(f, f === 'Sechseck', f === 'Sechseck' ? undefined : 'riss-verwechselt')),
      H('M', 'Von oben siehst du die obere Grundfläche.', 'Sie hat sechs Ecken.'), { bild: prisma(6), nachweis: [AF('prisma', 'oben', { n: 6 })] }),
  ]);
  sechs(P1, 'E', [
    () => { const n = wahl([7, 9, 10, 12]);
      return zahl(`Ein Prisma hat ${3 * n} Kanten. Gib an, wie viele Ecken es hat.`, 2 * n, [[n, 'koerper-unvollstaendig-gezaehlt'], [n + 2, 'ecken-kanten-verwechselt'], [3 * n - 2, 'ecken-kanten-verwechselt']],
        H('E', 'Finde zuerst heraus, wie viele Ecken die Grundfläche hat.'), { nachweis: [KZ('prisma', 'kanten', 3 * n, { n }), `${3 * n} : 3 = ${n}`, `2 · ${n} = ${2 * n}`, KZ('prisma', 'ecken', 2 * n, { n })] }); },
    () => { const n = wahl([5, 6]), z = { e: 2 * n, k: 3 * n, f: n + 2 };
      return zahl(`Zähle am ${PN[n] === 'fünfseitiges' ? 'fünfseitigen' : 'sechsseitigen'} Prisma Ecken, Flächen und Kanten. Rechne dann Ecken plus Flächen minus Kanten. Gib das Ergebnis an.`, 2, [[0, 'koerper-unvollstaendig-gezaehlt'], [4, 'koerper-unvollstaendig-gezaehlt'], [z.e + z.f, 'koerper-unvollstaendig-gezaehlt']],
        H('E', 'Zähle sorgfältig, auch die verdeckten Teile.'), { bild: prisma(n), nachweis: [KZ('prisma', 'ecken', z.e, { n, bild: true, zwischen: true }), KZ('prisma', 'flaechen', z.f, { n, zwischen: true }), KZ('prisma', 'kanten', z.k, { n, zwischen: true }), `${z.e} + ${z.f} − ${z.k} = 2`] }); },
    () => { const n = wahl([7, 9, 10]);
      return zahl(`Ein Prisma hat ${n + 2} Flächen. Gib an, wie viele Kanten es hat.`, 3 * n, [[3 * (n + 2), 'koerper-unvollstaendig-gezaehlt'], [2 * n, 'ecken-kanten-verwechselt'], [2 * (n + 2), 'ecken-kanten-verwechselt']],
        H('E', 'Zwei der Flächen sind Grundflächen. Wie viele Ecken hat dann eine Grundfläche?'), { nachweis: [KZ('prisma', 'flaechen', n + 2, { n }), `${n + 2} − 2 = ${n}`, `3 · ${n} = ${3 * n}`, KZ('prisma', 'kanten', 3 * n, { n })] }); },
    () => { const k = kind(), [zahlK, stimmt] = wahl([[16, false], [20, false], [21, true], [24, true]]);
      return auswahl(`${k} sagt: „Ein Prisma kann ${zahlK} Kanten haben.“ Beurteile die Aussage.`, [opt(stimmt ? `Stimmt. ${zahlK} : 3 = ${zahlK / 3}, die Grundfläche hat ${zahlK / 3} Ecken.` : `Stimmt nicht. Die Anzahl der Kanten ist immer durch 3 teilbar.`, true),
        opt(stimmt ? 'Stimmt nicht. Ein Prisma hat höchstens 18 Kanten.' : 'Stimmt. Ein Prisma kann jede Anzahl von Kanten haben.', false, 'koerper-unvollstaendig-gezaehlt'), opt(stimmt ? 'Stimmt nicht. Die Anzahl der Kanten ist immer gerade.' : 'Stimmt. Die Anzahl der Kanten ist immer gerade.', false, 'ecken-kanten-verwechselt')],
        H('E', 'Ein Prisma mit n Ecken an der Grundfläche hat 3 · n Kanten.'), { nachweis: [U(stimmt), { zahl: zahlK, grund: 'Behauptung' }, { zahl: 3, grund: 'Kanten je Ecke der Grundfläche' }, { zahl: 18, grund: 'falsche Begründung' }, ...(stimmt ? [`${zahlK} : 3 = ${zahlK / 3}`] : [])] }); },
    () => bildkarten('Kreuze alle Körper an, die Prismen sind.', [[prisma(3), true], [prisma(5), true], [prisma(6), true], [pyramide(5), false, 'prisma-pyramide'], [rund('zylinder'), false, 'koerper-verwechselt']],
      H('E', 'Ein Prisma hat zwei gleiche Vielecke als Grundflächen und Rechtecke dazwischen.'), { mehrfach: true, nachweis: [KA('prisma')] }),
    () => { const n = wahl([5, 6]);
      return auswahl(`Ein ${PN[n]} Prisma steht auf einer Grundfläche. Du schaust von vorne darauf. Kreuze die Form der Ansicht an.`, ['Rechteck', ECK[n], 'Dreieck', 'Kreis'].map((f) => opt(f, f === 'Rechteck', f === 'Rechteck' ? undefined : 'riss-verwechselt')),
        H('E', 'Von vorne siehst du die Seitenflächen hintereinander, nicht die Grundfläche.'), { bild: prisma(n), nachweis: [AF('prisma', 'vorne', { n })] }); },
  ]);
}

// ---------- P2: Netze von Prismen ----------
const hNetzF = () => H('F', 'Falte das Netz in Gedanken.', 'Die Rechtecke bilden die Seiten.', 'Ein Dreieck muss oben und eines unten anliegen.');
function p2() {
  sechs(P2, 'F', [
    () => zahl(Z('Das Netz gehört zu einem Zelt.', 'Zähle die Dreiecke im Netz.'), 2, [[3, 'netz-nur-gezaehlt'], [5, 'netz-nur-gezaehlt']],
      H('F', 'Dreiecke haben drei Ecken.', 'Suche oben und unten am Streifen.', 'Zähle sie.'), { bild: netz(3), nachweis: [NT(2, { ecken: 3 })] }),
    () => zahl(Z('Das Netz gehört zu einem Zelt.', 'Zähle die Rechtecke im Netz.'), 3, [[2, 'netz-nur-gezaehlt'], [5, 'netz-nur-gezaehlt']],
      H('F', 'Die Rechtecke liegen in einer Reihe.', 'Zähle von links nach rechts.', 'Die Dreiecke zählst du nicht mit.'), { bild: netz(3), nachweis: [NT(3, { ecken: 4 })] }),
    () => bildkarten(Z('Das Bild zeigt ein Zelt.', 'Kreuze das Netz an, aus dem du es falten kannst.'), [[netz(3), true], [netz(3, { gleicheSeite: true }), false, 'netz-nur-gezaehlt'], [netz(3, { seiten: 2 }), false, 'netz-nur-gezaehlt']],
      hNetzF(), { bild: zelt(), nachweis: [KA('prisma', { n: 3 })] }),
    () => { const ok = zz(0, 1) === 1, b = ok ? netz(3, { unten: zz(0, 2), oben: zz(0, 2) }) : netz(3, { gleicheSeite: true });
      return auswahl(Z('Du willst aus dem Netz ein Zelt falten.', 'Kreuze die richtige Antwort an.'), [opt('Ja.\nDie Dreiecke liegen oben und unten am Streifen.', ok, ok ? undefined : 'netz-nur-gezaehlt'), opt('Nein.\nBeide Dreiecke liegen an derselben Seite.', !ok, ok ? 'netz-nur-gezaehlt' : undefined)],
        hNetzF(), { bild: b, nachweis: [NETZ('prisma', { faltbar: ok }), U(ok)] }); },
    () => zahl(Z('Das Netz gehört zu einem Zelt.', 'Zähle alle Flächen im Netz.'), 5, [[3, 'netz-nur-gezaehlt'], [2, 'netz-nur-gezaehlt'], [6, 'wuerfel-kein-quader']],
      H('F', 'Zähle zuerst die Rechtecke.', 'Zähle dann die Dreiecke.', 'Addiere beide Zahlen.'), { bild: netz(3, { unten: 1, oben: 2 }), nachweis: [NT(5)] }),
    () => bildkarten(Z('Du faltest das Netz.', 'Kreuze den passenden Körper an.'), [[zelt(), true], [pyramide(4), false, 'prisma-pyramide'], [quader(4, 2, 2), false, 'koerper-verwechselt']],
      H('F', 'Im Netz sind zwei Dreiecke.', 'Sie werden vorne und hinten.', 'Suche den Körper mit zwei Dreiecken.'), { bild: netz(3), nachweis: [KA('prisma', { n: 3, netz: true })] }),
  ]);
  sechs(P2, 'G', [
    () => bildkarten(Z('Kreuze das Netz eines fünfseitigen Prismas an.'), [[netz(5), true], [netz(5, { gleicheSeite: true }), false, 'netz-nur-gezaehlt'], [netz(6), false, 'name-nach-seitenflaeche'], [netz(5, { seiten: 4 }), false, 'netz-nur-gezaehlt']],
      H('G', 'Das Prisma hat zwei Fünfecke als Grundflächen.', 'Rundherum liegen fünf Rechtecke.', 'Die Fünfecke liegen oben und unten am Streifen.'), { nachweis: [KA('prisma', { n: 5 })] }),
    () => { const n = wahl([5, 6]), ok = zz(0, 1) === 1, b = ok ? netz(n, { unten: zz(0, n - 1), oben: zz(0, n - 1) }) : wahl([netz(n, { gleicheSeite: true }), netz(n, { seiten: n - 1 })]);
      return auswahl(Z('Du willst das Netz zu einem Prisma falten.', 'Kreuze die richtige Antwort an.'), [opt('Ja, es lässt sich falten.', ok, ok ? undefined : 'netz-nur-gezaehlt'), opt('Nein, es lässt sich nicht falten.', !ok, ok ? 'netz-nur-gezaehlt' : undefined)],
        H('G', 'Zähle die Rechtecke und die Ecken der Grundfläche.', 'Beide Zahlen müssen gleich sein.', 'Die Grundflächen müssen oben und unten anliegen.'), { bild: b, nachweis: [NETZ('prisma', { faltbar: ok }), U(ok)] }); },
    () => { const n = wahl([5, 6]);
      return zahl(Z('Das Netz gehört zu einem Prisma.', 'Gib an, wie viele Flächen das Netz hat.'), n + 2, [[n, 'netz-nur-gezaehlt'], [2, 'netz-nur-gezaehlt'], [n + 1, 'netz-nur-gezaehlt']],
        H('G', 'Zähle die Rechtecke im Streifen.', 'Zähle dann die beiden Grundflächen.', 'Addiere.'), { bild: netz(n), nachweis: [NT(n + 2)] }); },
    () => { const n = wahl([3, 5, 6]);
      return auswahl(Z('Aus dem Netz entsteht ein Prisma.', 'Kreuze seinen Namen an.'), nameOpts(n, [3, 5, 6]),
        H('G', 'Der Name kommt von der Grundfläche.', 'Zähle die Ecken eines Vielecks im Netz.', 'Fünf Ecken heißt fünfseitig.'), { bild: netz(n), nachweis: [KA('prisma', { n, netz: true })] }); },
    () => { const n = wahl([5, 6, 8]);
      return zahl(Z(`Das Netz eines Prismas hat ${n} Rechtecke.`, 'Gib an, wie viele Flächen das Prisma hat.'), n + 2, [[n, 'netz-nur-gezaehlt'], [n + 1, 'netz-nur-gezaehlt']],
        H('G', 'Die Rechtecke bilden die Seiten.', 'Dazu kommen zwei Grundflächen.', `${n} + 2`), { nachweis: [KZ('prisma', 'flaechen', n + 2, { n })] }); },
    () => bildkarten(Z('Das Bild zeigt ein sechsseitiges Prisma.', 'Kreuze sein Netz an.'), [[netz(6), true], [netz(5), false, 'name-nach-seitenflaeche'], [netz(6, { gleicheSeite: true }), false, 'netz-nur-gezaehlt']],
      H('G', 'Die Grundfläche ist ein Sechseck.', 'Im Netz brauchst du sechs Rechtecke.', 'Die Sechsecke liegen oben und unten.'), { bild: prisma(6), nachweis: [KA('prisma', { n: 6 })] }),
  ]);
  sechs(P2, 'M', [
    () => { const n = wahl([5, 6]);
      return zahl('Im Netz ist die Mantelfläche der Streifen aus Rechtecken. Gib an, aus wie vielen Rechtecken die Mantelfläche besteht.', n, [[n + 2, 'netz-nur-gezaehlt'], [2, 'netz-nur-gezaehlt']],
        H('M', 'Die Grundflächen gehören nicht zur Mantelfläche.', 'Zähle nur die Rechtecke.'), { bild: netz(n, { unten: 1 }), nachweis: [NT(n, { ecken: 4 })] }); },
    () => { const n = wahl([5, 6]), art = wahl(['ok', 'ecken', 'seite']), b = art === 'ok' ? netz(n, { unten: zz(0, n - 1), oben: zz(0, n - 1) }) : art === 'ecken' ? netz(n, { eckenzahl: n === 5 ? 6 : 5 }) : netz(n, { gleicheSeite: true });
      return auswahl('Prüfe, ob sich das Netz zu einem Prisma falten lässt. Kreuze die richtige Antwort an.', [opt('Ja, es lässt sich falten.', art === 'ok', art === 'ok' ? undefined : 'netz-nur-gezaehlt'),
        opt('Nein, die Grundflächen haben nicht so viele Ecken, wie es Rechtecke gibt.', art === 'ecken', art === 'ecken' ? undefined : 'netz-nur-gezaehlt'), opt('Nein, beide Grundflächen liegen an derselben Seite.', art === 'seite', art === 'seite' ? undefined : 'netz-nur-gezaehlt')],
        H('M', 'Prüfe zwei Dinge: Anzahl der Rechtecke und Lage der Grundflächen.', 'Zähle die Ecken eines Vielecks.'), { bild: b, nachweis: [NETZ('prisma', { faltbar: art === 'ok', gruende: true }), U(art === 'ok')] }); },
    () => { const n = wahl([5, 6]);
      return bildkarten(`Kreuze das Netz eines ${PN[n] === 'fünfseitiges' ? 'fünfseitigen' : 'sechsseitigen'} Prismas an.`, [[netz(n, { unten: zz(0, n - 1) }), true], [netz(n, { eckenzahl: n === 5 ? 6 : 5 }), false, 'netz-nur-gezaehlt'], [netz(n, { gleicheSeite: true }), false, 'netz-nur-gezaehlt'], [netz(n === 5 ? 6 : 5), false, 'name-nach-seitenflaeche']],
        H('M', 'Prüfe bei jedem Netz die Anzahl der Rechtecke und die Ecken der Grundflächen.', 'Prüfe dann, ob die Grundflächen oben und unten liegen.'), { nachweis: [KA('prisma', { n })] }); },
    () => { const n = wahl([5, 6]), s = zz(2, 4);
      return zahl(`Ein ${PN[n]} Prisma hat Grundkanten von ${s} cm Länge. Gib an, wie lang der Streifen der Mantelfläche im Netz ist.`, n * s, [[s, 'mantel-streifen'], [(n + 2) * s, 'netz-nur-gezaehlt'], [2 * n * s, 'mantel-streifen']],
        H('M', 'Jedes Rechteck der Mantelfläche ist so breit wie eine Grundkante.', `Es sind ${n} Rechtecke.`), { einheit: 'cm', nachweis: [`${n} · ${s} = ${n * s}`] }); },
    () => { const k = kind();
      return auswahl(`${k} sagt: „Im Netz eines Prismas dürfen beide Grundflächen an derselben Seite der Mantelfläche liegen.“ Beurteile die Aussage.`,
        [opt('Stimmt nicht. Dann gibt es beim Falten zwei Deckel und keinen Boden.', true), opt('Stimmt. Beim Falten kann man sie umklappen.', false, 'netz-nur-gezaehlt'), opt('Stimmt. Es kommt beim Netz nur auf die Anzahl der Flächen an.', false, 'netz-nur-gezaehlt')],
        H('M', 'Falte den Streifen in Gedanken zu einem Ring.', 'Wo liegen dann die beiden Grundflächen?'), { nachweis: [U(false)] }); },
    () => bildkarten('Kreuze alle Netze an, aus denen sich ein dreiseitiges Prisma falten lässt.', [[netz(3, { unten: 0, oben: 1 }), true], [netz(3, { unten: 2, oben: 0 }), true], [netz(3, { gleicheSeite: true }), false, 'netz-nur-gezaehlt'], [netz(3, { seiten: 2 }), false, 'netz-nur-gezaehlt']],
      H('M', 'Wo die Dreiecke anliegen, ist egal.', 'Eines muss oben und eines unten am Streifen liegen.'), { mehrfach: true, nachweis: [KA('prisma', { n: 3 })] }),
  ]);
  sechs(P2, 'E', [
    () => { const n = wahl([6, 8]);
      return zahl(`Das Netz eines Prismas besteht aus ${n + 2} Flächen. Gib an, wie viele Ecken das Prisma hat.`, 2 * n, [[n + 2, 'netz-ecken-gezaehlt'], [n, 'koerper-unvollstaendig-gezaehlt'], [3 * n, 'ecken-kanten-verwechselt']],
        H('E', 'Zwei Flächen sind Grundflächen. Die übrigen sind Rechtecke.'), { nachweis: [`${n + 2} − 2 = ${n}`, `2 · ${n} = ${2 * n}`, KZ('prisma', 'ecken', 2 * n, { n })] }); },
    () => { const n = wahl([5, 6]), ok = zz(0, 1) === 1, b = ok ? netz(n, { unten: zz(0, n - 1), oben: zz(0, n - 1) }) : netz(n, { eckenzahl: n === 5 ? 6 : 5 });
      return auswahl('Prüfe, ob sich das Netz zu einem Prisma falten lässt. Kreuze die richtige Antwort an.', [opt('Ja, es lässt sich falten.', ok, ok ? undefined : 'netz-nur-gezaehlt'), opt('Nein, es lässt sich nicht falten.', !ok, ok ? 'netz-nur-gezaehlt' : undefined)],
        H('E', 'Vergleiche die Anzahl der Rechtecke mit den Ecken der Grundflächen.'), { bild: b, nachweis: [NETZ('prisma', { faltbar: ok }), U(ok)] }); },
    () => bildkarten('Kreuze alle Netze an, aus denen sich ein fünfseitiges Prisma falten lässt.', [[netz(5, { unten: 0, oben: 2 }), true], [netz(5, { unten: 3, oben: 1 }), true], [netz(5, { eckenzahl: 6 }), false, 'netz-nur-gezaehlt'], [netz(5, { gleicheSeite: true }), false, 'netz-nur-gezaehlt'], [netz(6), false, 'name-nach-seitenflaeche']],
      H('E', 'Prüfe jedes Netz: fünf Rechtecke, zwei Fünfecke, eines oben und eines unten.'), { mehrfach: true, nachweis: [KA('prisma', { n: 5 })] }),
    () => { const k = kind(), n = wahl([6, 8]), f = wahl([n + 2, 2 * n]), stimmt = f === n + 2;
      return auswahl(`${k} sagt: „Das Netz eines ${n === 6 ? 'sechsseitigen' : 'achtseitigen'} Prismas hat ${f} Flächen.“ Beurteile die Aussage.`,
        [opt(stimmt ? `Stimmt. Es sind ${n} Rechtecke und 2 Grundflächen.` : `Stimmt nicht. Es sind ${n} Rechtecke und 2 Grundflächen, also ${n + 2}.`, true), opt(stimmt ? 'Stimmt nicht. Jede Ecke gibt eine Fläche.' : 'Stimmt. Jede Ecke gibt eine Fläche.', false, 'netz-ecken-gezaehlt'),
          opt(stimmt ? 'Stimmt nicht. Die Grundflächen zählen nicht mit.' : 'Stimmt. Die Grundflächen zählen doppelt.', false, 'netz-nur-gezaehlt')],
        H('E', 'Zähle Rechtecke der Mantelfläche und Grundflächen getrennt.'), { nachweis: [U(stimmt), { zahl: f, grund: 'Behauptung' }, KZ('prisma', 'flaechen', n + 2, { n }), { zahl: 2, grund: 'Grundflächen' }] }); },
    () => { const n = wahl([5, 6]), s = zz(2, 4), l = n * s;
      return zahl(`Die Mantelfläche eines ${n === 5 ? 'fünfseitigen' : 'sechsseitigen'} Prismas ist im Netz ein Streifen von ${l} cm Länge. Alle Grundkanten sind gleich lang. Gib an, wie lang eine Grundkante ist.`, s, [[l / 2, 'mantel-streifen'], [l - n, 'mantel-streifen']].filter(([x]) => Number.isInteger(x)),
        H('E', 'Der Streifen besteht aus gleich breiten Rechtecken. Wie viele sind es?'), { einheit: 'cm', nachweis: [`${l} : ${n} = ${s}`] }); },
    () => { const n = wahl([3, 5, 6]), k = 3 * n, f = n + 2, w = k - (f - 1);
      return zahl(`Du faltest das Netz eines ${n === 3 ? 'dreiseitigen' : n === 5 ? 'fünfseitigen' : 'sechsseitigen'} Prismas. Im Netz hängen die ${f} Flächen an ${f - 1} Faltkanten zusammen. Gib an, wie viele Kanten du noch zukleben musst.`, w, [[k, 'netz-kleben'], [f - 1, 'netz-kleben'], [k - f, 'netz-kleben']],
        H('E', 'Jede Kante des Prismas ist entweder eine Faltkante oder eine Klebekante.'), { nachweis: [KZ('prisma', 'kanten', k, { n, zwischen: true }), KZ('prisma', 'flaechen', f, { n, zwischen: true }), `${f} − 1 = ${f - 1}`, `${k} − ${f - 1} = ${w}`] }); },
  ]);
}

export function prismen() { p1(); p2(); }
