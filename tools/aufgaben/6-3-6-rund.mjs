// Aufgaben zu 6.3.6 „Zylinder, Kegel und Kugel“ (Lernziele R1 und R2) nach ADR 0015 und ADR 0045.
// R1: runde Körper erkennen, auch an Gegenständen aus dem Alltag. R2: Netze von Zylinder und Kegel, Körper nach Eigenschaften ordnen.
// Wortspeicher: F „Zylinder“, „Kegel“, „Kugel“; ab G „gekrümmte Fläche“; ab M „Kreisausschnitt“.
// Festlegungen (Grilling 2026-11-25): Zylinder 3 Flächen und 2 Kanten, Kegel 2 Flächen, 1 Kante, 1 Spitze und keine Ecke, Kugel 1 Fläche.
import { sechs } from '../werkzeug.mjs';
import { wahl, mische, zz, Z, H, zahl, opt, auswahl, kind, U, KZ, KA, NETZ, AF, NT, EIG, prisma, pyramide, quader, rund, bildkarten, zylinderNetz, kegelNetz, prismaNetz, pyramideNetz, GEGENSTAENDE } from './6-3-koerper.mjs';

const R1 = '6.3.6-R1', R2 = '6.3.6-R2';
const NAME = { zylinder: 'Zylinder', kegel: 'Kegel', kugel: 'Kugel', prisma: 'Prisma' };
const EINEN = ['Ball', 'Globus', 'Pylon', 'Partyhut']; // männliche Gegenstände
const RUND = ['zylinder', 'kegel', 'kugel'];
const namenOpts = (soll, liste = RUND, fv = 'koerper-verwechselt') => liste.map((f) => opt(NAME[f] ?? f, f === soll, f === soll ? undefined : fv));
const zNetz = (o = {}) => zylinderNetz(0.8, 2.5, o);
const kNetz = (o = {}) => kegelNetz(1, 2.5, o);
const dieForm = (f) => (f === 'kugel' ? 'einer Kugel' : `eines ${NAME[f]}s`);

// ---------- R1: runde Körper erkennen ----------
function r1() {
  sechs(R1, 'F', [
    () => { const f = wahl(RUND), g = wahl(GEGENSTAENDE[f]);
      return bildkarten(Z(`Denk an ${EINEN.includes(g) ? 'einen' : 'eine'} ${g}.`, 'Kreuze die passende Form an.'), RUND.map((x) => [rund(x), x === f, 'koerper-verwechselt']),
        H('F', 'Stell dir den Gegenstand vor dir vor.', 'Läuft er oben spitz zu? Hat er oben und unten einen Kreis? Ist er ganz rund?', 'Spitz: Kegel. Zwei Kreise: Zylinder. Ganz rund: Kugel.'), { nachweis: [KA(f, { gegenstand: g })] }); },
    () => { const f = wahl(RUND);
      return auswahl(Z('Das Bild zeigt einen Körper.', 'Kreuze seinen Namen an.'), namenOpts(f),
        H('F', 'Schau, ob der Körper oben spitz zuläuft.', 'Schau, ob oben und unten ein Kreis ist.', 'Eine Kugel ist überall rund.'), { bild: rund(f), nachweis: [KA(f, { bild: true })] }); },
    () => { const f = wahl(RUND);
      return bildkarten(Z(`Kreuze ${f === 'kugel' ? 'die' : 'den'} ${NAME[f]} an.`), RUND.map((x) => [rund(x), x === f, 'koerper-verwechselt']),
        H('F', 'Ein Kegel läuft oben spitz zu.', 'Ein Zylinder hat oben und unten einen Kreis.', 'Eine Kugel ist ganz rund.'), { nachweis: [KA(f)] }); },
    () => zahl(Z('Das Bild zeigt einen Zylinder.', 'Zähle seine Flächen.'), 3, [[2, 'runde-koerper-zaehlen'], [1, 'runde-koerper-zaehlen'], [6, 'wuerfel-kein-quader']],
      H('F', 'Oben ist ein Kreis.', 'Unten ist auch ein Kreis.', 'Dazu kommt die runde Fläche rundherum.'), { bild: rund('zylinder'), nachweis: [KZ('zylinder', 'flaechen', 3, { bild: true })] }),
    () => auswahl(Z('Du schaust von oben auf den Zylinder.', 'Kreuze die Form der Ansicht an.'), ['Kreis', 'Rechteck', 'Dreieck'].map((f) => opt(f, f === 'Kreis', f === 'Kreis' ? undefined : 'riss-verwechselt')),
      H('F', 'Von oben siehst du den Deckel.', 'Der Deckel ist rund.', 'Welche Form ist rund?'), { bild: rund('zylinder'), nachweis: [AF('zylinder', 'oben')] }),
    () => zahl(Z('Das Bild zeigt einen Kegel.', 'Zähle seine Flächen.'), 2, [[1, 'runde-koerper-zaehlen'], [3, 'runde-koerper-zaehlen']],
      H('F', 'Unten ist ein Kreis.', 'Dazu kommt die runde Fläche bis nach oben.', 'Zähle beide Flächen.'), { bild: rund('kegel'), nachweis: [KZ('kegel', 'flaechen', 2, { bild: true })] }),
  ]);
  sechs(R1, 'G', [
    () => zahl(Z('Das Bild zeigt einen Zylinder.', 'Gib an, wie viele Kanten er hat.'), 2, [[1, 'runde-koerper-zaehlen'], [3, 'ecken-kanten-verwechselt'], [4, 'runde-koerper-zaehlen']],
      H('G', 'Eine Kante ist da, wo zwei Flächen zusammenstoßen.', 'Oben stößt der Kreis an die gekrümmte Fläche.', 'Unten auch.'), { bild: rund('zylinder'), nachweis: [KZ('zylinder', 'kanten', 2, { bild: true })] }),
    () => { const f = wahl(RUND), richtige = mische(GEGENSTAENDE[f]).slice(0, 2), falsche = mische(RUND.filter((x) => x !== f).map((x) => wahl(GEGENSTAENDE[x])));
      return auswahl(Z(`Kreuze alle Gegenstände in Form ${dieForm(f)} an.`), [...richtige.map((g) => opt(g, true)), ...falsche.map((g) => opt(g, false, 'koerper-verwechselt'))],
        H('G', 'Stell dir jeden Gegenstand vor.', f === 'kegel' ? 'Ein Kegel hat einen Kreis und eine Spitze.' : f === 'zylinder' ? 'Ein Zylinder hat zwei gleiche Kreise.' : 'Eine Kugel ist überall gleich rund.', 'Kreuze nur die passenden an.'), { mehrfach: true, nachweis: [KA(f)] }); },
    () => auswahl(Z('Du schaust von vorne auf den Kegel.', 'Kreuze die Form der Ansicht an.'), ['Kreis', 'Dreieck', 'Rechteck'].map((f) => opt(f, f === 'Dreieck', f === 'Dreieck' ? undefined : 'riss-verwechselt')),
      H('G', 'Von vorne siehst du seinen Umriss.', 'Unten ist er breit, oben spitz.', 'Welche Form ist unten breit und oben spitz?'), { bild: rund('kegel'), nachweis: [AF('kegel', 'vorne')] }),
    () => zahl(Z('Das Bild zeigt einen Kegel.', 'Gib an, wie viele Kanten er hat.'), 1, [[2, 'runde-koerper-zaehlen'], [3, 'runde-koerper-zaehlen']],
      H('G', 'Eine Kante ist da, wo zwei Flächen zusammenstoßen.', 'Der Kreis unten stößt an die gekrümmte Fläche.', 'Die Spitze ist keine Kante.'), { bild: rund('kegel'), nachweis: [KZ('kegel', 'kanten', 1, { bild: true })] }),
    () => auswahl(Z('Kreuze alle Körper mit einer gekrümmten Fläche an.'), mische([['Zylinder', true], ['Kugel', true], ['Quader', false], ['Prisma', false]]).map(([t, r]) => opt(t, r, r ? undefined : 'koerper-verwechselt')),
      H('G', 'Eine gekrümmte Fläche ist nicht eben.', 'Ein Körper damit kann rollen.', 'Quader und Prisma haben nur ebene Flächen.'), { mehrfach: true, nachweis: [EIG('gekruemmt')] }),
    () => { const f = wahl(['zylinder', 'kegel']), g = wahl(GEGENSTAENDE[f].filter((x) => !['Dose', 'Eistüte'].includes(x)));
      return auswahl(Z(`Ein Gegenstand heißt ${g}.`, 'Kreuze seine Form an.'), namenOpts(f, ['zylinder', 'kegel', 'kugel', 'prisma']),
        H('G', 'Stell dir den Gegenstand vor.', 'Hat er eine Spitze?', 'Hat er oben und unten einen Kreis?'), { nachweis: [KA(f, { gegenstand: g })] }); },
  ]);
  sechs(R1, 'M', [
    () => auswahl('Du schaust von oben auf den Kegel. Kreuze die Form der Ansicht an.', ['Dreieck', 'Kreis', 'Rechteck', 'Quadrat'].map((f) => opt(f, f === 'Kreis', f === 'Kreis' ? undefined : 'riss-verwechselt')),
      H('M', 'Von oben siehst du den Kreis unten, die Spitze liegt in der Mitte.', 'Der Umriss ist rund.'), { bild: rund('kegel'), nachweis: [AF('kegel', 'oben')] }),
    () => { const k = kind();
      return auswahl(`${k} sagt: „Die Spitze eines Kegels ist eine Ecke.“ Beurteile die Aussage.`,
        [opt('Stimmt nicht. An einer Ecke treffen sich Kanten. Der Kegel hat nur eine Kante.', true), opt('Stimmt. Alles Spitze ist eine Ecke.', false, 'runde-koerper-zaehlen'), opt('Stimmt. Der Kegel hat eine Ecke und zwei Kanten.', false, 'runde-koerper-zaehlen')],
        H('M', 'Bei einer Pyramide treffen sich an der Spitze Kanten.', 'Wie ist das beim Kegel?'), { nachweis: [U(false), KZ('kegel', 'kanten', 1, { zwischen: true }), { zahl: 2, grund: 'falsche Begründung' }] }); },
    () => bildkarten('Kreuze den Körper mit genau zwei Flächen an.', [[rund('kegel'), true], [rund('zylinder'), false, 'runde-koerper-zaehlen'], [rund('kugel'), false, 'runde-koerper-zaehlen'], [pyramide(4), false, 'runde-koerper-zaehlen']],
      H('M', 'Zähle bei jedem Körper die ebenen und die gekrümmten Flächen.', 'Der Zylinder hat drei, die Kugel nur eine.'), { nachweis: [KA('kegel'), KZ('kegel', 'flaechen', 2, { zwischen: true })] }),
    () => bildkarten('Kreuze alle Körper an, die rollen können.', [[rund('zylinder'), true], [rund('kugel'), true], [rund('kegel'), true], [prisma(5), false, 'koerper-verwechselt'], [quader(3, 2, 2), false, 'koerper-verwechselt']],
      H('M', 'Ein Körper kann rollen, wenn er eine gekrümmte Fläche hat.', 'Auch ein Kegel rollt, aber nur im Kreis.'), { mehrfach: true, nachweis: [EIG('gekruemmt')] }),
    () => { const g = wahl(['Kerze', 'Trommel', 'Litfaßsäule']);
      return zahl(`Eine ${g} hat die Form eines Zylinders. Gib an, wie viele Kanten sie hat.`, 2, [[1, 'runde-koerper-zaehlen'], [3, 'ecken-kanten-verwechselt']],
        H('M', 'Kanten sind dort, wo zwei Flächen aneinanderstoßen.', 'Oben und unten stößt je ein Kreis an die gekrümmte Fläche.'), { nachweis: [KA('zylinder', { gegenstand: g }), KZ('zylinder', 'kanten', 2)] }); },
    () => { const k = kind(), [satz, stimmt, grund, f1, f2] = wahl([
      ['Eine Kugel hat keine Kante.', true, 'Stimmt. Sie hat nur eine Fläche, also stoßen keine Flächen aneinander.', 'Stimmt nicht. Sie hat eine Kante rundherum.', 'Stimmt nicht. Sie hat unendlich viele Kanten.'],
      ['Ein Zylinder hat eine Spitze.', false, 'Stimmt nicht. Oben und unten ist je eine Kreisfläche.', 'Stimmt. Die Spitze ist in der Mitte des Deckels.', 'Stimmt. Jeder runde Körper hat eine Spitze.']]);
      return auswahl(`${k} sagt: „${satz}“ Beurteile die Aussage.`, [opt(grund, true), opt(f1, false, 'runde-koerper-zaehlen'), opt(f2, false, 'koerper-verwechselt')],
        H('M', 'Stell dir den Körper genau vor oder nimm einen Gegenstand in die Hand.', 'Wo stoßen Flächen aneinander?'), { nachweis: [U(stimmt)] }); },
  ]);
  sechs(R1, 'E', [
    () => auswahl('Kreuze alle Körper an, die eine Spitze haben.', mische([['Kegel', true], ['Pyramide', true], ['Zylinder', false], ['Kugel', false], ['Prisma', false], ['Quader', false]]).map(([t, r]) => opt(t, r, r ? undefined : 'koerper-verwechselt')),
      H('E', 'Eine Spitze ist ein Punkt, an dem der Körper zusammenläuft.'), { mehrfach: true, nachweis: [EIG('spitze')] }),
    () => auswahl('Kreuze alle Körper an, die nur ebene Flächen haben.', mische([['Quader', true], ['Prisma', true], ['Pyramide', true], ['Zylinder', false], ['Kegel', false], ['Kugel', false]]).map(([t, r]) => opt(t, r, r ? undefined : 'koerper-verwechselt')),
      H('E', 'Eine ebene Fläche ist flach wie ein Blatt Papier.'), { mehrfach: true, nachweis: [EIG('nurEben')] }),
    () => { const k = kind();
      return auswahl(`${k} sagt: „Zylinder und Kegel haben gleich viele Kanten.“ Beurteile die Aussage.`,
        [opt('Stimmt nicht. Der Zylinder hat 2 Kanten, der Kegel nur 1.', true), opt('Stimmt. Beide haben 2 Kanten.', false, 'runde-koerper-zaehlen'), opt('Stimmt. Runde Körper haben keine Kanten.', false, 'runde-koerper-zaehlen')],
        H('E', 'Zähle die Stellen, an denen ein Kreis an die gekrümmte Fläche stößt.'), { nachweis: [U(false), KZ('zylinder', 'kanten', 2, { zwischen: true }), KZ('kegel', 'kanten', 1, { zwischen: true })] }); },
    () => zahl('Ein Turm besteht aus einem Zylinder. Oben sitzt ein Kegel als Dach genau auf dem Deckel. Gib an, wie viele Flächen man am Turm von außen sieht, den Boden mitgezählt.', 3, [[5, 'runde-koerper-zaehlen'], [4, 'runde-koerper-zaehlen'], [2, 'runde-koerper-zaehlen']],
      H('E', 'Wo Kegel und Zylinder aufeinandersitzen, verschwinden zwei Kreise.'), { nachweis: [KZ('zylinder', 'flaechen', 3, { zwischen: true }), KZ('kegel', 'flaechen', 2, { zwischen: true }), '3 + 2 − 2 = 3'] }),
    () => { const [f, vorne] = wahl([['kegel', 'Dreieck'], ['zylinder', 'Rechteck'], ['kugel', 'Kreis']]);
      return auswahl(`Ein Körper sieht von vorne aus wie ein ${vorne}. Von oben sieht er aus wie ein Kreis. Kreuze den Körper an.`, namenOpts(f, ['zylinder', 'kegel', 'kugel']),
        H('E', 'Prüfe für jeden Körper beide Ansichten.'), { nachweis: [KA(f)] }); },
    () => { const f = 'zylinder', richtige = mische(GEGENSTAENDE.zylinder).slice(0, 3), falsche = [wahl(GEGENSTAENDE.kugel), wahl(GEGENSTAENDE.kegel), wahl(GEGENSTAENDE.quader)];
      return auswahl('Kreuze alle Gegenstände in Form eines Zylinders an.', mische([...richtige.map((g) => opt(g, true)), ...falsche.map((g) => opt(g, false, 'koerper-verwechselt'))]),
        H('E', 'Ein Zylinder hat zwei gleiche Kreise und dazwischen eine gekrümmte Fläche.'), { mehrfach: true, nachweis: [KA(f)] }); },
  ]);
}

// ---------- R2: Netze und Eigenschaften ----------
function r2() {
  sechs(R2, 'F', [
    () => zahl(Z('Das Netz gehört zu einer Dose.', 'Zähle die Kreise im Netz.'), 2, [[1, 'netz-nur-gezaehlt'], [3, 'netz-nur-gezaehlt']],
      H('F', 'Kreise sind rund.', 'Einer liegt oben, einer unten.', 'Zähle sie.'), { bild: zNetz(), nachweis: [NT(2, { kreise: true })] }),
    () => bildkarten(Z('Das Bild zeigt eine Dose.', 'Kreuze das Netz an, aus dem du sie falten kannst.'), [[zNetz(), true], [zNetz({ gleicheSeite: true }), false, 'netz-nur-gezaehlt'], [kNetz(), false, 'koerper-verwechselt']],
      H('F', 'Eine Dose ist ein Zylinder.', 'Sie hat einen Deckel und einen Boden.', 'Ein Kreis muss oben, einer unten liegen.'), { bild: rund('zylinder'), nachweis: [KA('zylinder')] }),
    () => auswahl(Z('Du faltest das Netz.', 'Kreuze den passenden Körper an.'), namenOpts('kegel'),
      H('F', 'Das große Stück wird rund gebogen.', 'Es läuft oben spitz zu.', 'Unten kommt der Kreis dran.'), { bild: kNetz(), nachweis: [KA('kegel', { netz: true })] }),
    () => zahl(Z('Das Netz gehört zu einer Eistüte mit Deckel.', 'Zähle alle Teile im Netz.'), 2, [[1, 'netz-nur-gezaehlt'], [3, 'netz-nur-gezaehlt']],
      H('F', 'Ein Teil ist ein Kreis.', 'Das andere Teil sieht aus wie ein Stück Kuchen.', 'Zähle beide Teile.'), { bild: kNetz(), nachweis: [NT(2)] }),
    () => { const ok = zz(0, 1) === 1;
      return auswahl(Z('Du willst aus dem Netz eine Dose falten.', 'Kreuze die richtige Antwort an.'), [opt('Ja.\nOben und unten liegt ein Kreis.', ok, ok ? undefined : 'netz-nur-gezaehlt'), opt('Nein.\nBeide Kreise liegen oben.', !ok, ok ? 'netz-nur-gezaehlt' : undefined)],
        H('F', 'Rolle das Rechteck in Gedanken zu einer Röhre.', 'Oben und unten braucht die Röhre einen Kreis.', 'Schau, wo die Kreise liegen.'), { bild: ok ? zNetz() : zNetz({ gleicheSeite: true }), nachweis: [NETZ('zylinder', { faltbar: ok }), U(ok)] }); },
    () => bildkarten(Z('Manche Körper können rollen.', 'Kreuze sie alle an.'), [[rund('kugel'), true], [rund('zylinder'), true], [quader(2, 2, 2), false, 'koerper-verwechselt'], [quader(4, 2, 2), false, 'koerper-verwechselt']],
      H('F', 'Ein Körper rollt, wenn er rund ist.', 'Ein Würfel hat nur flache Flächen.', 'Kreuze die runden Körper an.'), { mehrfach: true, nachweis: [EIG('gekruemmt')] }),
  ]);
  sechs(R2, 'G', [
    () => bildkarten(Z('Kreuze das Netz eines Kegels an.'), [[kNetz(), true], [kNetz({ falschR: 1.6 }), false, 'netz-nur-gezaehlt'], [zNetz(), false, 'koerper-verwechselt']],
      H('G', 'Ein Kegel hat eine gekrümmte Fläche und einen Kreis.', 'Die gekrümmte Fläche sieht im Netz aus wie ein Stück Kuchen.', 'Der Kreis muss so groß sein, dass er unten passt.'), { nachweis: [KA('kegel')] }),
    () => { const ok = zz(0, 1) === 1;
      return auswahl(Z('Du willst das Netz zu einem Kegel falten.', 'Kreuze die richtige Antwort an.'), [opt('Ja, es lässt sich falten.', ok, ok ? undefined : 'netz-nur-gezaehlt'), opt('Nein.\nDer Kreis passt nicht.', !ok, ok ? 'netz-nur-gezaehlt' : undefined)],
        H('G', 'Der runde Rand der gekrümmten Fläche wird zum Kreisrand.', 'Beide müssen gleich lang sein.', 'Ist der Kreis viel größer, passt er nicht.'), { bild: ok ? kNetz() : kNetz({ falschR: 1.7 }), nachweis: [NETZ('kegel', { faltbar: ok }), U(ok)] }); },
    () => zahl(Z('Das Netz gehört zu einem Zylinder.', 'Gib an, wie viele Flächen das Netz hat.'), 3, [[2, 'netz-nur-gezaehlt'], [1, 'netz-nur-gezaehlt']],
      H('G', 'Zähle die Kreise.', 'Zähle das Rechteck dazu.', 'Das Rechteck wird zur gekrümmten Fläche.'), { bild: zNetz(), nachweis: [NT(3)] }),
    () => auswahl(Z('Kreuze alle Körper ohne gekrümmte Fläche an.'), mische([['Würfel', true], ['Pyramide', true], ['Kegel', false], ['Kugel', false]]).map(([t, r]) => opt(t, r, r ? undefined : 'koerper-verwechselt')),
      H('G', 'Ohne gekrümmte Fläche heißt: alle Flächen sind eben.', 'Ebene Flächen sind flach.', 'Kegel und Kugel sind teilweise rund.'), { mehrfach: true, nachweis: [EIG('nurEben')] }),
    () => bildkarten(Z('Kreuze alle Körper mit gekrümmter Fläche an.'), [[rund('zylinder'), true], [rund('kugel'), true], [prisma(3), false, 'koerper-verwechselt'], [pyramide(4), false, 'koerper-verwechselt']],
      H('G', 'Suche Körper mit runden Teilen.', 'Eine gekrümmte Fläche ist nicht flach.', 'Prisma und Pyramide haben nur ebene Flächen.'), { mehrfach: true, nachweis: [EIG('gekruemmt')] }),
    () => { const f = wahl(['zylinder', 'kegel']);
      return auswahl(Z('Aus dem Netz entsteht ein Körper.', 'Kreuze seinen Namen an.'), namenOpts(f),
        H('G', 'Zähle die Kreise im Netz.', 'Zwei Kreise und ein Rechteck: Zylinder.', 'Ein Kreis und ein Stück Kuchen: Kegel.'), { bild: f === 'zylinder' ? zNetz() : kNetz(), nachweis: [KA(f, { netz: true })] }); },
  ]);
  sechs(R2, 'M', [
    () => zahl('Im Netz eines Kegels ist die gekrümmte Fläche ein Kreisausschnitt. Gib an, wie viele Flächen das Netz hat.', 2, [[1, 'netz-nur-gezaehlt'], [3, 'netz-nur-gezaehlt']],
      H('M', 'Zum Kreisausschnitt kommt die Grundfläche.', 'Die Grundfläche ist ein Kreis.'), { bild: kNetz(), nachweis: [NT(2)] }),
    () => { const art = wahl(['ok', 'schmal', 'seite']), b = art === 'ok' ? zNetz() : art === 'schmal' ? zNetz({ umfang: 2.2 }) : zNetz({ gleicheSeite: true });
      return auswahl('Prüfe, ob sich das Netz zu einem Zylinder falten lässt. Kreuze die richtige Antwort an.', [opt('Ja, es lässt sich falten.', art === 'ok', art === 'ok' ? undefined : 'netz-nur-gezaehlt'),
        opt('Nein, das Rechteck ist zu schmal für den Rand der Kreise.', art === 'schmal', art === 'schmal' ? undefined : 'netz-nur-gezaehlt'), opt('Nein, beide Kreise liegen an derselben Seite.', art === 'seite', art === 'seite' ? undefined : 'netz-nur-gezaehlt')],
        H('M', 'Das Rechteck wird zur Röhre gerollt.', 'Seine Breite muss so lang sein wie der Rand eines Kreises.'), { bild: b, nachweis: [NETZ('zylinder', { faltbar: art === 'ok', gruende: true }), U(art === 'ok')] }); },
    () => bildkarten('Kreuze das Netz eines Zylinders an.', [[zNetz(), true], [zNetz({ umfang: 2.2 }), false, 'netz-nur-gezaehlt'], [zNetz({ gleicheSeite: true }), false, 'netz-nur-gezaehlt'], [kNetz(), false, 'koerper-verwechselt']],
      H('M', 'Prüfe die Lage der Kreise und die Breite des Rechtecks.', 'Das Rechteck muss um den Kreis ganz herumreichen.'), { nachweis: [KA('zylinder')] }),
    () => { const k = kind();
      return auswahl(`${k} sagt: „Das Netz eines Kegels besteht aus einem Dreieck und einem Kreis.“ Beurteile die Aussage.`,
        [opt('Stimmt nicht. Die gekrümmte Fläche ist im Netz ein Kreisausschnitt.', true), opt('Stimmt. Von vorne sieht der Kegel aus wie ein Dreieck.', false, 'riss-verwechselt'), opt('Stimmt. Das Dreieck wird zur Spitze gefaltet.', false, 'prisma-pyramide')],
        H('M', 'Ein Dreieck hat gerade Seiten.', 'Kann es den runden Rand des Kreises umschließen?'), { nachweis: [U(false)] }); },
    () => bildkarten('Kreuze alle Körper an, die keine Ecke haben.', [[rund('zylinder'), true], [rund('kegel'), true], [rund('kugel'), true], [quader(2, 2, 2), false, 'runde-koerper-zaehlen'], [pyramide(4), false, 'runde-koerper-zaehlen']],
      H('M', 'Eine Ecke entsteht, wo sich Kanten treffen.', 'Die Spitze des Kegels zählt nicht als Ecke.'), { mehrfach: true, nachweis: [EIG('ohneEcke')] }),
    () => { const f = wahl(['zylinder', 'kegel']);
      return auswahl('Aus dem Netz entsteht ein Körper. Kreuze seinen Namen an.', namenOpts(f, ['zylinder', 'kegel', 'kugel']).concat([opt('Pyramide', false, 'prisma-pyramide')]),
        H('M', 'Ein Kreisausschnitt wird zu einer Fläche mit Spitze.', 'Ein Rechteck wird zu einer Röhre.'), { bild: f === 'zylinder' ? zNetz() : kNetz(), nachweis: [KA(f, { netz: true })] }); },
  ]);
  sechs(R2, 'E', [
    () => { const art = wahl(['ok', 'gross', 'klein']), b = art === 'ok' ? kNetz() : kNetz({ falschR: art === 'gross' ? 1.4 : 0.6 });
      return auswahl('Prüfe, ob sich das Netz zu einem Kegel falten lässt. Kreuze die richtige Antwort an.', [opt('Ja, es lässt sich falten.', art === 'ok', art === 'ok' ? undefined : 'netz-nur-gezaehlt'),
        opt('Nein, der Kreis ist zu groß für den Rand des Kreisausschnitts.', art === 'gross', art === 'gross' ? undefined : 'netz-nur-gezaehlt'), opt('Nein, der Kreis ist zu klein für den Rand des Kreisausschnitts.', art === 'klein', art === 'klein' ? undefined : 'netz-nur-gezaehlt')],
        H('E', 'Der gebogene Rand des Kreisausschnitts muss genau einmal um den Kreis passen.'), { bild: b, nachweis: [NETZ('kegel', { faltbar: art === 'ok', gruende: true }), U(art === 'ok')] }); },
    () => bildkarten('Kreuze alle Netze an, aus denen sich ein Zylinder falten lässt.', [[zNetz(), true], [zylinderNetz(0.6, 2), true], [zNetz({ umfang: 1.6 }), false, 'netz-nur-gezaehlt'], [zNetz({ gleicheSeite: true }), false, 'netz-nur-gezaehlt'], [kNetz(), false, 'koerper-verwechselt']],
      H('E', 'Prüfe Lage der Kreise und Breite des Rechtecks bei jedem Netz.'), { mehrfach: true, nachweis: [KA('zylinder')] }),
    () => auswahl('Kreuze alle Körper an, die genau eine Kante haben.', mische([['Kegel', true], ['Zylinder', false], ['Kugel', false], ['Würfel', false], ['Pyramide', false]]).map(([t, r]) => opt(t, r, r ? undefined : 'runde-koerper-zaehlen')),
      H('E', 'Eine Kante entsteht, wo zwei Flächen zusammenstoßen. Zähle bei jedem Körper.'), { mehrfach: true, nachweis: [EIG('eineKante')] }),
    () => { const k = kind();
      return auswahl(`${k} sagt: „Im Netz eines Zylinders ist das Rechteck genau so breit, wie der Rand eines Kreises lang ist.“ Beurteile die Aussage.`,
        [opt('Stimmt. Das Rechteck wird einmal um den Kreis herumgerollt.', true), opt('Stimmt nicht. Das Rechteck ist so breit wie der Kreis.', false, 'netz-nur-gezaehlt'), opt('Stimmt nicht. Das Rechteck ist doppelt so breit wie der Rand.', false, 'netz-nur-gezaehlt')],
        H('E', 'Wickle in Gedanken ein Blatt Papier einmal um eine Dose.'), { nachweis: [U(true)] }); },
    () => zahl('Gib an, wie viele Flächen ein Zylinder, ein Kegel und eine Kugel zusammen haben.', 6, [[3, 'runde-koerper-zaehlen'], [5, 'runde-koerper-zaehlen'], [4, 'runde-koerper-zaehlen']],
      H('E', 'Zähle zuerst für jeden Körper einzeln.'), { nachweis: [KZ('zylinder', 'flaechen', 3, { zwischen: true }), KZ('kegel', 'flaechen', 2, { zwischen: true }), KZ('kugel', 'flaechen', 1, { zwischen: true }), '3 + 2 + 1 = 6'] }),
    () => bildkarten('Kreuze alle Netze an, aus denen ein Körper mit Spitze entsteht.', [[kNetz(), true], [pyramideNetz(4, 2, 2.2), true], [zNetz(), false, 'koerper-verwechselt'], [prismaNetz(3, 2, 3), false, 'prisma-pyramide'], [kNetz({ falschR: 1.5 }), false, 'netz-nur-gezaehlt']],
      H('E', 'Falte jedes Netz in Gedanken. Achte auch darauf, ob es sich überhaupt falten lässt.'), { mehrfach: true, nachweis: [EIG('spitze')] }),
  ]);
}

export function rundeKoerper() { r1(); r2(); }
