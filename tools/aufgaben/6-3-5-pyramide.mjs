// Aufgaben zu 6.3.5 „Pyramide“ (Lernziele Y1 und Y2) nach ADR 0015 und ADR 0045.
// Y1: Pyramiden erkennen, benennen, Ecken, Kanten und Flächen zählen. Y2: Netze von Pyramiden erkennen und prüfen.
// Wortspeicher: F ohne „Pyramide“ und „Spitze“ (der Körper heißt dort „Turmdach“), ab G „Pyramide“ und „Spitze“, ab M „Seitendreieck“.
// Pyramidennetze sind Sterne: an jeder Seite der Grundfläche ein Dreieck. Keine dreiseitige Pyramide als Netz (dort ist auch die Grundfläche ein Dreieck).
// Zu flache Seitendreiecke (Schenkel nicht länger als der Umkreisradius der Grundfläche) treffen sich nicht in einer Spitze: ein Fehler erst ab E.
import { sechs } from '../werkzeug.mjs';
import { zz, wahl, Z, H, zahl, opt, auswahl, kind, U, KZ, KA, NETZ, AF, NT, prisma, pyramide, quader, rund, bildkarten, pyramideNetz, ECK } from './6-3-koerper.mjs';

const Y1 = '6.3.5-Y1', Y2 = '6.3.5-Y2';
const NETZMASS = { 4: [2, 2.2], 5: [1.6, 1.6], 6: [1.4, 1.5] }; // niedrig genug, dass die Grundfläche im Stern gut zu sehen ist
const FLACH = { 4: 0.7, 5: 0.7, 6: 0.8 };
const netz = (n, o = {}) => pyramideNetz(n, ...NETZMASS[n], o);
const flach = (n) => pyramideNetz(n, NETZMASS[n][0], FLACH[n]);
const dach = () => pyramide(4);
const PN = { 4: 'vierseitige', 5: 'fünfseitige', 6: 'sechsseitige' };
const PND = { 4: 'vierseitigen', 5: 'fünfseitigen', 6: 'sechsseitigen' };
const nameOpts = (n, liste) => liste.map((m) => opt(`${PN[m]} Pyramide`, m === n, m === n ? undefined : 'name-nach-seitenflaeche'));
const formOpts = (soll, liste, fv = 'riss-verwechselt') => liste.map((f) => opt(f, f === soll, f === soll ? undefined : fv));

// ---------- Y1: Pyramiden erkennen und zählen ----------
function y1() {
  sechs(Y1, 'F', [
    () => zahl(Z('Das Bild zeigt ein Turmdach.', 'Zähle seine Flächen.'), 5, [[4, 'koerper-unvollstaendig-gezaehlt'], [3, 'koerper-unvollstaendig-gezaehlt'], [8, 'ecken-kanten-verwechselt']],
      H('F', 'Unten ist ein Quadrat.', 'Rundherum sind Dreiecke.', 'Zähle das Quadrat und alle Dreiecke.'), { bild: dach(), nachweis: [KZ('pyramide', 'flaechen', 5, { n: 4, bild: true })] }),
    () => zahl(Z('Das Bild zeigt ein Turmdach.', 'Zähle seine Ecken.'), 5, [[4, 'koerper-unvollstaendig-gezaehlt'], [8, 'ecken-kanten-verwechselt'], [1, 'koerper-unvollstaendig-gezaehlt']],
      H('F', 'Unten hat das Quadrat vier Ecken.', 'Oben treffen sich alle Dreiecke in einer Ecke.', 'Zähle unten und oben zusammen.'), { bild: dach(), nachweis: [KZ('pyramide', 'ecken', 5, { n: 4, bild: true })] }),
    () => zahl(Z('Das Bild zeigt ein Turmdach.', 'Zähle seine Kanten.'), 8, [[4, 'koerper-unvollstaendig-gezaehlt'], [6, 'koerper-unvollstaendig-gezaehlt'], [5, 'ecken-kanten-verwechselt']],
      H('F', 'Zähle zuerst die Kanten am Quadrat unten.', 'Zähle dann die Kanten nach oben.', 'Denk an die gestrichelten Kanten.'), { bild: dach(), nachweis: [KZ('pyramide', 'kanten', 8, { n: 4, bild: true })] }),
    () => bildkarten(Z('Ein Körper hat ein Quadrat und vier Dreiecke als Flächen.', 'Kreuze ihn an.'), [[dach(), true], [prisma(3), false, 'prisma-pyramide'], [quader(4, 2, 2), false, 'koerper-verwechselt']],
      H('F', 'Suche das Bild mit vielen Dreiecken.', 'Die Dreiecke treffen sich oben.', 'Unten liegt das Quadrat.'), { nachweis: [KA('pyramide', { n: 4 }), { zahl: 4, grund: 'Dreiecke' }] }),
    () => auswahl(Z('Du schaust von oben auf das Turmdach.', 'Kreuze die Form der Ansicht an.'), formOpts('Quadrat', ['Quadrat', 'Dreieck', 'Kreis']),
      H('F', 'Von oben siehst du den Rand des Dachs.', 'Er ist so groß wie der Boden.', 'Der Boden ist ein Quadrat.'), { bild: dach(), nachweis: [AF('pyramide', 'oben', { n: 4 })] }),
    () => auswahl(Z('Du schaust von vorne auf das Turmdach.', 'Kreuze die Form der Ansicht an.'), formOpts('Dreieck', ['Quadrat', 'Dreieck', 'Kreis']),
      H('F', 'Von vorne siehst du ein Dreieck des Dachs.', 'Unten ist es breit.', 'Oben läuft es zusammen.'), { bild: dach(), nachweis: [AF('pyramide', 'vorne', { n: 4 })] }),
  ]);
  sechs(Y1, 'G', [
    () => zahl(Z('Das Bild zeigt eine fünfseitige Pyramide.', 'Gib an, wie viele Ecken sie hat.'), 6, [[5, 'koerper-unvollstaendig-gezaehlt'], [10, 'ecken-kanten-verwechselt'], [4, 'koerper-unvollstaendig-gezaehlt']],
      H('G', 'Die Grundfläche ist ein Fünfeck.', 'Dazu kommt die Spitze.', 'Rechne 5 + 1.'), { bild: pyramide(5), nachweis: [KZ('pyramide', 'ecken', 6, { n: 5, bild: true })] }),
    () => zahl(Z('Das Bild zeigt eine sechsseitige Pyramide.', 'Gib an, wie viele Kanten sie hat.'), 12, [[6, 'koerper-unvollstaendig-gezaehlt'], [9, 'koerper-unvollstaendig-gezaehlt'], [7, 'ecken-kanten-verwechselt']],
      H('G', 'Das Sechseck unten hat sechs Kanten.', 'Von jeder Ecke geht eine Kante zur Spitze.', 'Rechne 6 + 6.'), { bild: pyramide(6), nachweis: [KZ('pyramide', 'kanten', 12, { n: 6, bild: true })] }),
    () => { const n = wahl([4, 5, 6]);
      return auswahl(Z('Das Bild zeigt eine Pyramide.', 'Kreuze ihren Namen an.'), nameOpts(n, [4, 5, 6]),
        H('G', 'Der Name kommt von der Grundfläche.', 'Zähle ihre Ecken.', 'Vier Ecken heißt vierseitig.'), { bild: pyramide(n), nachweis: [KA('pyramide', { n, bild: true })] }); },
    () => bildkarten(Z('Eine Pyramide hat eine Grundfläche und Dreiecke bis zur Spitze.', 'Kreuze alle Pyramiden an.'), [[pyramide(4), true], [pyramide(wahl([5, 6])), true], [prisma(5), false, 'prisma-pyramide'], [rund('kegel'), false, 'koerper-verwechselt']],
      H('G', 'Suche Körper mit einer Spitze.', 'Die Flächen zur Spitze müssen Dreiecke sein.', 'Ein Körper mit runder Fläche ist keine Pyramide.'), { mehrfach: true, nachweis: [KA('pyramide')] }),
    () => { const n = wahl([5, 6]);
      return zahl(Z(`Die Grundfläche einer Pyramide ist ein ${ECK[n]}.`, 'Gib an, wie viele Kanten die Pyramide hat.'), 2 * n, [[n, 'koerper-unvollstaendig-gezaehlt'], [3 * n, 'prisma-pyramide'], [n + 1, 'ecken-kanten-verwechselt']],
        H('G', `Die Grundfläche hat ${n} Kanten.`, 'Von jeder Ecke geht eine Kante zur Spitze.', `Rechne: ${n} + ${n}.`), { nachweis: [KZ('pyramide', 'kanten', 2 * n, { n })] }); },
    () => { const n = wahl([5, 6, 8]);
      return zahl(Z(`Eine Pyramide hat ein ${ECK[n]} als Grundfläche.`, 'Gib an, wie viele Flächen sie hat.'), n + 1, [[n, 'koerper-unvollstaendig-gezaehlt'], [n + 2, 'prisma-pyramide'], [2 * n, 'ecken-kanten-verwechselt']],
        H('G', `An jeder Seite des ${ECK[n]}s liegt ein Dreieck.`, 'Dazu kommt die Grundfläche.', `Rechne: ${n} + 1.`), { nachweis: [KZ('pyramide', 'flaechen', n + 1, { n })] }); },
  ]);
  sechs(Y1, 'M', [
    () => { const n = wahl([7, 9, 10]);
      return zahl(`Eine Pyramide hat ${n} Seitendreiecke. Gib an, wie viele Ecken sie hat.`, n + 1, [[n, 'koerper-unvollstaendig-gezaehlt'], [2 * n, 'prisma-pyramide'], [3 * n, 'ecken-kanten-verwechselt']],
        H('M', 'Jedes Seitendreieck liegt an einer Kante der Grundfläche.', `Die Grundfläche hat ${n} Ecken, dazu kommt die Spitze.`), { nachweis: [KZ('pyramide', 'ecken', n + 1, { n })] }); },
    () => { const n = wahl([7, 8, 9]), k = 2 * n;
      return zahl(`Eine Pyramide hat ${k} Kanten. Gib an, wie viele Ecken ihre Grundfläche hat.`, n, [[k / 3, 'prisma-pyramide'], [k - 1, 'koerper-unvollstaendig-gezaehlt'], [n + 1, 'ecken-kanten-verwechselt']].filter(([x]) => Number.isInteger(x)),
        H('M', 'Die Hälfte der Kanten liegt an der Grundfläche.', `${k} : 2 = ${n}`), { nachweis: [KZ('pyramide', 'kanten', k, { n }), `${k} : 2 = ${n}`] }); },
    () => bildkarten('Kreuze die Pyramide mit 6 Ecken an.', [[pyramide(5), true], [pyramide(4), false, 'koerper-unvollstaendig-gezaehlt'], [pyramide(6), false, 'koerper-unvollstaendig-gezaehlt'], [prisma(3), false, 'prisma-pyramide']],
      H('M', 'Eine Ecke ist die Spitze.', 'Die übrigen Ecken gehören zur Grundfläche.'), { nachweis: [KA('pyramide', { n: 5 }), KZ('pyramide', 'ecken', 6, { n: 5 })] }),
    () => { const k = kind(), [satz, stimmt, grund, falsch1, falsch2] = wahl([
      ['Eine Pyramide hat immer gleich viele Ecken wie Flächen.', true, 'Stimmt. Zu jedem Seitendreieck gehört eine Ecke unten, dazu Spitze und Grundfläche.', 'Stimmt nicht. Eine Pyramide hat immer mehr Kanten als Ecken und Flächen.', 'Stimmt nicht. Nur die vierseitige Pyramide hat das.'],
      ['Jede Pyramide hat eine gerade Anzahl von Kanten.', true, 'Stimmt. Unten sind es so viele Kanten wie zur Spitze.', 'Stimmt nicht. Die fünfseitige Pyramide hat 15 Kanten.', 'Stimmt nicht. Das gilt nur für Prismen.'],
      ['Bei jeder Pyramide sind alle Flächen Dreiecke.', false, 'Stimmt nicht. Bei der vierseitigen Pyramide ist die Grundfläche ein Viereck.', 'Stimmt. Alle Flächen laufen zur Spitze.', 'Stimmt. Eine Pyramide hat nur Seitendreiecke.']]);
      return auswahl(`${k} sagt: „${satz}“ Beurteile die Aussage.`, [opt(grund, true), opt(falsch1, false, 'prisma-pyramide'), opt(falsch2, false, 'ecken-kanten-verwechselt')],
        H('M', 'Prüfe die Aussage an zwei Pyramiden, die du kennst.', 'Ein Gegenbeispiel genügt, um eine Aussage zu widerlegen.'), { nachweis: [U(stimmt), { zahl: 15, grund: 'falsche Begründung' }] }); },
    () => { const n = wahl([5, 6]);
      return zahl(`Ein ${n === 5 ? 'fünfseitiges' : 'sechsseitiges'} Prisma und eine ${PN[n]} Pyramide stehen nebeneinander. Gib an, wie viele Kanten das Prisma mehr hat.`, n, [[3 * n, 'prisma-pyramide'], [2 * n, 'prisma-pyramide'], [1, 'koerper-unvollstaendig-gezaehlt']],
        H('M', 'Zähle die Kanten beider Körper.', `${3 * n} − ${2 * n} = ${n}`), { nachweis: [KZ('prisma', 'kanten', 3 * n, { n, zwischen: true }), KZ('pyramide', 'kanten', 2 * n, { n, zwischen: true }), `${3 * n} − ${2 * n} = ${n}`] }); },
    () => auswahl('Du schaust von oben auf die sechsseitige Pyramide. Kreuze die Form des Umrisses an.', formOpts('Sechseck', ['Dreieck', 'Sechseck', 'Kreis', 'Quadrat']),
      H('M', 'Von oben siehst du die ganze Grundfläche.', 'Die Spitze liegt in der Mitte.'), { bild: pyramide(6), nachweis: [AF('pyramide', 'oben', { n: 6 })] }),
  ]);
  sechs(Y1, 'E', [
    () => { const n = wahl([8, 10, 12]);
      return zahl(`Eine Pyramide hat ${n + 1} Flächen. Gib an, wie viele Kanten sie hat.`, 2 * n, [[2 * (n + 1), 'koerper-unvollstaendig-gezaehlt'], [3 * n, 'prisma-pyramide'], [n + 1, 'ecken-kanten-verwechselt']],
        H('E', 'Eine der Flächen ist die Grundfläche.'), { nachweis: [KZ('pyramide', 'flaechen', n + 1, { n }), `${n + 1} − 1 = ${n}`, `2 · ${n} = ${2 * n}`, KZ('pyramide', 'kanten', 2 * n, { n })] }); },
    () => { const n = wahl([5, 6]), z = { e: n + 1, k: 2 * n, f: n + 1 };
      return zahl(`Zähle an der ${PND[n]} Pyramide Ecken, Flächen und Kanten. Rechne dann Ecken plus Flächen minus Kanten. Gib das Ergebnis an.`, 2, [[0, 'koerper-unvollstaendig-gezaehlt'], [4, 'koerper-unvollstaendig-gezaehlt'], [z.e + z.f, 'koerper-unvollstaendig-gezaehlt']],
        H('E', 'Zähle sorgfältig, auch die verdeckten Teile.'), { bild: pyramide(n), nachweis: [KZ('pyramide', 'ecken', z.e, { n, bild: true, zwischen: true }), KZ('pyramide', 'flaechen', z.f, { n, zwischen: true }), KZ('pyramide', 'kanten', z.k, { n, zwischen: true }), `${z.e} + ${z.f} − ${z.k} = 2`] }); },
    () => { const k = kind(), [zahlK, stimmt] = wahl([[15, false], [21, false], [18, true], [22, true]]);
      return auswahl(`${k} sagt: „Eine Pyramide kann ${zahlK} Kanten haben.“ Beurteile die Aussage.`, [opt(stimmt ? `Stimmt. Die Grundfläche hat dann ${zahlK / 2} Ecken.` : 'Stimmt nicht. Eine Pyramide hat immer eine gerade Anzahl von Kanten.', true),
        opt(stimmt ? 'Stimmt nicht. Die Anzahl der Kanten ist immer durch 3 teilbar.' : 'Stimmt. Die Anzahl der Kanten ist immer ungerade.', false, 'prisma-pyramide'), opt(stimmt ? 'Stimmt nicht. Eine Pyramide hat höchstens 12 Kanten.' : 'Stimmt. Eine Pyramide kann jede Anzahl von Kanten haben.', false, 'koerper-unvollstaendig-gezaehlt')],
        H('E', 'Eine Pyramide mit n Ecken an der Grundfläche hat 2 · n Kanten.'), { nachweis: [U(stimmt), { zahl: zahlK, grund: 'Behauptung' }, { zahl: 3, grund: 'falsche Begründung' }, { zahl: 12, grund: 'falsche Begründung' }, ...(stimmt ? [`${zahlK} : 2 = ${zahlK / 2}`] : [])] }); },
    () => bildkarten('Kreuze alle Körper an, die gleich viele Ecken wie Flächen haben.', [[pyramide(4), true], [pyramide(6), true], [prisma(5), false, 'prisma-pyramide'], [quader(3, 2, 2), false, 'ecken-kanten-verwechselt'], [prisma(3), false, 'prisma-pyramide']],
      H('E', 'Zähle bei jedem Körper Ecken und Flächen. Welche Körperart hat immer gleich viele?'), { mehrfach: true, nachweis: [KA('pyramide')] }),
    () => { const n = wahl([5, 6, 7]), s = 5 * n;
      return zahl(`Ein Prisma und eine Pyramide haben dieselbe Grundfläche. Zusammen haben sie ${s} Kanten. Gib an, wie viele Ecken die Grundfläche hat.`, n, [[s / 2, 'koerper-unvollstaendig-gezaehlt'], [s / 3, 'prisma-pyramide']].filter(([x]) => Number.isInteger(x)),
        H('E', 'Das Prisma hat 3 · n Kanten, die Pyramide 2 · n Kanten.'), { nachweis: [`3 · ${n} + 2 · ${n} = ${s}`, `${s} : 5 = ${n}`, { zahl: 5, grund: 'n-mal 5 Kanten' }] }); },
    () => auswahl('Du schaust von vorne auf die sechsseitige Pyramide. Kreuze die Form des Umrisses an.', formOpts('Dreieck', ['Sechseck', 'Dreieck', 'Rechteck', 'Kreis']),
      H('E', 'Von vorne siehst du nicht die Grundfläche, sondern den Umriss bis zur Spitze.'), { bild: pyramide(6), nachweis: [AF('pyramide', 'vorne', { n: 6 })] }),
  ]);
}

// ---------- Y2: Netze von Pyramiden ----------
const hNetzF = () => H('F', 'Falte das Netz in Gedanken.', 'Das Quadrat ist der Boden.', 'Die Dreiecke klappen hoch und treffen sich oben.');
function y2() {
  sechs(Y2, 'F', [
    () => zahl(Z('Das Netz gehört zu einem Turmdach.', 'Zähle die Dreiecke im Netz.'), 4, [[5, 'netz-nur-gezaehlt'], [1, 'netz-nur-gezaehlt'], [3, 'netz-nur-gezaehlt']],
      H('F', 'Dreiecke haben drei Ecken.', 'Sie liegen rund um das Quadrat.', 'Zähle sie im Kreis herum.'), { bild: netz(4), nachweis: [NT(4, { ecken: 3 })] }),
    () => zahl(Z('Das Netz gehört zu einem Turmdach.', 'Zähle alle Flächen im Netz.'), 5, [[4, 'netz-nur-gezaehlt'], [1, 'netz-nur-gezaehlt'], [6, 'wuerfel-kein-quader']],
      H('F', 'Zähle die Dreiecke.', 'Zähle das Quadrat dazu.', 'Addiere beide Zahlen.'), { bild: netz(4), nachweis: [NT(5)] }),
    () => bildkarten(Z('Das Bild zeigt ein Turmdach.', 'Kreuze das Netz an, aus dem du es falten kannst.'), [[netz(4), true], [netz(4, { fehlt: 1 }), false, 'netz-nur-gezaehlt'], [netz(4, { extra: 1 }), false, 'netz-nur-gezaehlt']],
      hNetzF(), { bild: dach(), nachweis: [KA('pyramide', { n: 4 })] }),
    () => { const ok = zz(0, 1) === 1;
      return auswahl(Z('Du willst aus dem Netz ein Turmdach falten.', 'Kreuze die richtige Antwort an.'), [opt('Ja.\nAn jeder Seite des Quadrats liegt ein Dreieck.', ok, ok ? undefined : 'netz-nur-gezaehlt'), opt('Nein.\nEin Dreieck fehlt.', !ok, ok ? 'netz-nur-gezaehlt' : undefined)],
        hNetzF(), { bild: ok ? netz(4) : netz(4, { fehlt: 1 }), nachweis: [NETZ('pyramide', { faltbar: ok }), U(ok)] }); },
    () => bildkarten(Z('Du faltest das Netz.', 'Kreuze den passenden Körper an.'), [[dach(), true], [prisma(3), false, 'prisma-pyramide'], [quader(4, 2, 2), false, 'koerper-verwechselt']],
      H('F', 'Im Netz liegen vier Dreiecke um ein Quadrat.', 'Sie treffen sich oben in einem Punkt.', 'Suche diesen Körper.'), { bild: netz(4), nachweis: [KA('pyramide', { n: 4, netz: true })] }),
    () => zahl(Z('Im Netz fehlt ein Dreieck.', 'Zähle die Dreiecke im Netz.'), 3, [[4, 'netz-nur-gezaehlt'], [5, 'netz-nur-gezaehlt']],
      H('F', 'Dreiecke haben drei Ecken.', 'Das Quadrat zählst du nicht mit.', 'Zähle rund um das Quadrat.'), { bild: netz(4, { fehlt: 1 }), nachweis: [NT(3, { ecken: 3 }), NETZ('pyramide', { faltbar: false }), { zahl: 1, grund: 'fehlendes Dreieck' }] }),
  ]);
  sechs(Y2, 'G', [
    () => bildkarten(Z('Kreuze das Netz einer fünfseitigen Pyramide an.'), [[netz(5), true], [netz(5, { fehlt: 1 }), false, 'netz-nur-gezaehlt'], [netz(6), false, 'name-nach-seitenflaeche'], [netz(5, { extra: 1 }), false, 'netz-nur-gezaehlt']],
      H('G', 'Die Grundfläche ist ein Fünfeck.', 'An jeder Seite liegt genau ein Dreieck.', 'Zähle die Dreiecke: Es müssen fünf sein.'), { nachweis: [KA('pyramide', { n: 5 })] }),
    () => { const n = wahl([5, 6]), art = wahl(['ok', 'ok', 'fehlt', 'extra']), b = art === 'ok' ? netz(n) : art === 'fehlt' ? netz(n, { fehlt: 1 }) : netz(n, { extra: 1 }), ok = art === 'ok';
      return auswahl(Z('Du willst das Netz zu einer Pyramide falten.', 'Kreuze die richtige Antwort an.'), [opt('Ja, es lässt sich falten.', ok, ok ? undefined : 'netz-nur-gezaehlt'), opt('Nein, es lässt sich nicht falten.', !ok, ok ? 'netz-nur-gezaehlt' : undefined)],
        H('G', 'Zähle die Ecken der Grundfläche.', 'Zähle die Dreiecke.', 'Beide Zahlen müssen gleich sein.'), { bild: b, nachweis: [NETZ('pyramide', { faltbar: ok }), U(ok)] }); },
    () => { const n = wahl([4, 5, 6]);
      return auswahl(Z('Aus dem Netz entsteht eine Pyramide.', 'Kreuze ihren Namen an.'), nameOpts(n, [4, 5, 6]),
        H('G', 'Der Name kommt von der Grundfläche.', 'Zähle die Ecken des Vielecks in der Mitte.', 'Fünf Ecken heißt fünfseitig.'), { bild: netz(n), nachweis: [KA('pyramide', { n, netz: true })] }); },
    () => { const n = wahl([5, 6]);
      return zahl(Z('Das Netz gehört zu einer Pyramide.', 'Gib an, wie viele Flächen das Netz hat.'), n + 1, [[n, 'netz-nur-gezaehlt'], [n + 2, 'prisma-pyramide'], [1, 'netz-nur-gezaehlt']],
        H('G', 'Zähle die Dreiecke.', 'Zähle die Grundfläche dazu.', 'Addiere.'), { bild: netz(n), nachweis: [NT(n + 1)] }); },
    () => { const n = wahl([7, 8]);
      return zahl(Z(`Das Netz einer Pyramide hat ${n} Dreiecke um die Grundfläche.`, 'Gib an, wie viele Ecken die Pyramide hat.'), n + 1, [[n, 'koerper-unvollstaendig-gezaehlt'], [2 * n, 'prisma-pyramide'], [n + 2, 'netz-ecken-gezaehlt']],
        H('G', 'So viele Dreiecke, so viele Ecken hat die Grundfläche.', 'Dazu kommt die Spitze.', `Rechne: ${n} + 1.`), { nachweis: [KZ('pyramide', 'ecken', n + 1, { n })] }); },
    () => bildkarten(Z('Das Bild zeigt eine sechsseitige Pyramide.', 'Kreuze ihr Netz an.'), [[netz(6), true], [netz(5), false, 'name-nach-seitenflaeche'], [netz(6, { fehlt: 1 }), false, 'netz-nur-gezaehlt']],
      H('G', 'Die Grundfläche ist ein Sechseck.', 'Im Netz brauchst du sechs Dreiecke.', 'Zähle bei jedem Netz die Dreiecke.'), { bild: pyramide(6), nachweis: [KA('pyramide', { n: 6 })] }),
  ]);
  sechs(Y2, 'M', [
    () => { const n = wahl([5, 6]), f = zz(1, 2);
      return zahl(`Das Netz soll eine ${PN[n]} Pyramide ergeben. Gib an, wie viele Seitendreiecke noch fehlen.`, f, [[n - f, 'netz-nur-gezaehlt'], [n, 'netz-nur-gezaehlt'], [f + 1, 'netz-nur-gezaehlt']],
        H('M', 'An jeder Seite der Grundfläche muss ein Seitendreieck liegen.', 'Zähle die freien Seiten.'), { bild: netz(n, { fehlt: f }), nachweis: [NT(n - f, { ecken: 3, zwischen: true }), `${n} − ${n - f} = ${f}`] }); },
    () => { const n = wahl([4, 5, 6]), art = wahl(['ok', 'fehlt', 'extra']), b = art === 'ok' ? netz(n) : art === 'fehlt' ? netz(n, { fehlt: 1 }) : netz(n, { extra: 1 });
      return auswahl('Prüfe, ob sich das Netz zu einer Pyramide falten lässt. Kreuze die richtige Antwort an.', [opt('Ja, es lässt sich falten.', art === 'ok', art === 'ok' ? undefined : 'netz-nur-gezaehlt'),
        opt('Nein, an einer Seite der Grundfläche fehlt ein Seitendreieck.', art === 'fehlt', art === 'fehlt' ? undefined : 'netz-nur-gezaehlt'), opt('Nein, es gibt ein Seitendreieck zu viel.', art === 'extra', art === 'extra' ? undefined : 'netz-nur-gezaehlt')],
        H('M', 'Vergleiche die Anzahl der Seitendreiecke mit den Ecken der Grundfläche.', 'Jede Seite der Grundfläche braucht genau ein Seitendreieck.'), { bild: b, nachweis: [NETZ('pyramide', { faltbar: art === 'ok', gruende: true }), U(art === 'ok')] }); },
    () => bildkarten('Kreuze das Netz einer fünfseitigen Pyramide an.', [[netz(5), true], [netz(5, { fehlt: 1 }), false, 'netz-nur-gezaehlt'], [netz(5, { extra: 1 }), false, 'netz-nur-gezaehlt'], [netz(4), false, 'name-nach-seitenflaeche']],
      H('M', 'Prüfe Grundfläche und Seitendreiecke.', 'Fünf Ecken, fünf Seitendreiecke.'), { nachweis: [KA('pyramide', { n: 5 })] }),
    () => { const k = kind();
      return auswahl(`${k} sagt: „Im Netz einer Pyramide müssen alle Seitendreiecke an der Grundfläche liegen.“ Beurteile die Aussage.`,
        [opt('Stimmt nicht. Ein Seitendreieck kann auch an einem anderen Seitendreieck hängen.', true), opt('Stimmt. Sonst kann man das Netz nicht falten.', false, 'netz-nur-gezaehlt'), opt('Stimmt. Die Grundfläche hält alle Dreiecke fest, sonst fällt das Netz auseinander.', false, 'netz-nur-gezaehlt')],
        H('M', 'Denk an ein Würfelnetz: Nicht alle Quadrate liegen am Boden.', 'Beim Falten kommt es darauf an, dass am Ende alles zusammenpasst.'), { nachweis: [U(false)] }); },
    () => { const n = wahl([4, 5]), k = 2 * n, f = n + 1;
      return zahl(`Du faltest das Netz einer ${PND[n]} Pyramide. Im Netz hängen die ${f} Flächen an ${f - 1} Faltkanten zusammen. Gib an, wie viele Kanten du noch zukleben musst.`, k - (f - 1), [[k, 'netz-kleben'], [f, 'netz-kleben'], [n + 1, 'netz-kleben']],
        H('M', 'Jede Kante der Pyramide ist eine Faltkante oder eine Klebekante.', `${k} − ${f - 1} = ${k - f + 1}`), { nachweis: [KZ('pyramide', 'kanten', k, { n, zwischen: true }), KZ('pyramide', 'flaechen', f, { n, zwischen: true }), `${f} − 1 = ${f - 1}`, `${k} − ${f - 1} = ${k - f + 1}`] }); },
    () => bildkarten('Kreuze alle Netze an, aus denen sich eine vierseitige Pyramide falten lässt.', [[pyramideNetz(4, 2, 2.2), true], [pyramideNetz(4, 2, 3), true], [netz(4, { fehlt: 1 }), false, 'netz-nur-gezaehlt'], [netz(5), false, 'name-nach-seitenflaeche']],
      H('M', 'Die Seitendreiecke dürfen verschieden hoch sein.', 'Wichtig ist: vier Seitendreiecke um ein Quadrat.'), { mehrfach: true, nachweis: [KA('pyramide', { n: 4 })] }),
  ]);
  sechs(Y2, 'E', [
    () => { const n = wahl([4, 5, 6]), ok = zz(0, 1) === 1;
      return auswahl('Prüfe, ob sich das Netz zu einer Pyramide falten lässt. Kreuze die richtige Antwort an.', [opt('Ja, es lässt sich falten.', ok, ok ? undefined : 'netz-nur-gezaehlt'), opt('Nein, die Seitendreiecke sind zu flach und treffen sich nicht in einer Spitze.', !ok, ok ? 'netz-nur-gezaehlt' : undefined),
        opt('Nein, es fehlt ein Seitendreieck, denn die Grundfläche hat mehr Seiten.', false, 'netz-nur-gezaehlt')],
        H('E', 'Stell dir vor, du klappst zwei Seitendreiecke hoch. Reichen ihre Spitzen bis zur Mitte?'), { bild: ok ? netz(n) : flach(n), nachweis: [NETZ('pyramide', { faltbar: ok, gruende: true }), U(ok)] }); },
    () => { const n = wahl([7, 8, 9]);
      return zahl(`Das Netz einer Pyramide besteht aus ${n + 1} Flächen. Gib an, wie viele Kanten die Pyramide hat.`, 2 * n, [[2 * (n + 1), 'koerper-unvollstaendig-gezaehlt'], [n + 1, 'ecken-kanten-verwechselt'], [3 * n, 'prisma-pyramide']],
        H('E', 'Eine Fläche ist die Grundfläche, die anderen sind Seitendreiecke.'), { nachweis: [`${n + 1} − 1 = ${n}`, `2 · ${n} = ${2 * n}`, KZ('pyramide', 'kanten', 2 * n, { n })] }); },
    () => bildkarten('Kreuze alle Netze an, aus denen sich eine sechsseitige Pyramide falten lässt.', [[netz(6), true], [pyramideNetz(6, 1.4, 2.6), true], [flach(6), false, 'netz-nur-gezaehlt'], [netz(6, { fehlt: 1 }), false, 'netz-nur-gezaehlt'], [netz(6, { extra: 1 }), false, 'netz-nur-gezaehlt']],
      H('E', 'Prüfe die Anzahl der Seitendreiecke und ob sie hoch genug für eine Spitze sind.'), { mehrfach: true, nachweis: [KA('pyramide', { n: 6 })] }),
    () => { const k = kind();
      return auswahl(`${k} sagt: „Das Netz einer Pyramide hat immer eine ungerade Anzahl von Flächen.“ Beurteile die Aussage.`,
        [opt('Stimmt nicht. Die fünfseitige Pyramide hat 6 Flächen.', true), opt('Stimmt. Zur Grundfläche kommen immer gerade viele Dreiecke.', false, 'netz-nur-gezaehlt'), opt('Stimmt. Eine Pyramide hat immer 5 Flächen.', false, 'koerper-verwechselt')],
        H('E', 'Zähle die Flächen bei zwei verschiedenen Pyramiden.'), { nachweis: [U(false), KZ('pyramide', 'flaechen', 6, { n: 5, zwischen: true }), { zahl: 5, grund: 'falsche Begründung' }] }); },
    () => { const n = wahl([6, 8]), k = 2 * n, f = n + 1;
      return zahl(`Du faltest das Netz einer Pyramide mit ${n} Seitendreiecken. Gib an, wie viele Kanten du zukleben musst.`, k - (f - 1), [[k, 'netz-kleben'], [f - 1, 'netz-kleben'], [k - f, 'netz-kleben']],
        H('E', 'Im Netz hängen die Flächen an Faltkanten zusammen. Alle anderen Kanten werden geklebt.'), { nachweis: [KZ('pyramide', 'kanten', k, { n, zwischen: true }), KZ('pyramide', 'flaechen', f, { n, zwischen: true }), `${f} − 1 = ${f - 1}`, `${k} − ${f - 1} = ${k - f + 1}`] }); },
    () => { const n = wahl([5, 6, 7]), s = 2 * n + 3;
      return zahl(`Ein Prisma und eine Pyramide haben dieselbe Grundfläche. Ihre Netze haben zusammen ${s} Flächen. Gib an, wie viele Ecken die Grundfläche hat.`, n, [[s / 2, 'koerper-unvollstaendig-gezaehlt'], [s - 3, 'netz-nur-gezaehlt']].filter(([x]) => Number.isInteger(x)),
        H('E', 'Das Prismennetz hat zwei Flächen mehr als die Grundfläche Ecken hat, das Pyramidennetz eine mehr.'), { nachweis: [`${n} + 2 + ${n} + 1 = ${s}`, `${s} − 3 = ${2 * n}`, `${2 * n} : 2 = ${n}`, { zahl: 3, grund: 'Grundflächen' }] }); },
  ]);
}

export function pyramiden() { y1(); y2(); }
