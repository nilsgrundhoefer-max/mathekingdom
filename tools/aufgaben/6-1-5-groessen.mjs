// Aufgaben zu 6.1.5 „Brüche und Größen“ (Lernziele T1, T2) nach ADR 0015 und ADR 0037.
// T1: den Bruchteil einer Größe berechnen. T2: vom Bruchteil auf das Ganze schließen und Anteile als Bruch angeben.
// Grilling mit Nils (2026-11-24): Der Meilenstein überschneidet sich mit Klasse 5 (5.9.2) und zieht an: Zähler über 1 schon auf F,
// ab G mit Umwandeln, auf M und E wählt das Kind die Einheit selbst. Ergebnisse sind natürliche Zahlen in der kleineren Einheit.
// Ein Anteil als Bruch ist vollständig gekürzt (gekuerzt: true).

import { sechs, auswahl, luecken, zahl, ordnen, bruch, faerben, groesse, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { vorn, fig, leer, bild, NB, WERT, VGL, ZEICHEN, gekuerzt, streifen, ggt, br, opt, zz, wahl, mische } from './6-1-brueche.mjs';

const T1 = '6.1.5-T1', T2 = '6.1.5-T2';
// Ein Bruchteil, der aufgeht: z⁄n von G, ein Teil ist e, das Ergebnis x.
const teil = (nenner, es) => { const [z, n] = gekuerzt(nenner, 2), e = wahl(es); return { z, n, e, G: n * e, x: z * e }; };
const LAENGE = ['mm', 'cm', 'm', 'km'], GEWICHT = ['mg', 'g', 'kg', 't'], ZEIT = ['s', 'min', 'h'];
const MAL = { m: 1000, km: 1000000, g: 1000, kg: 1000000, t: 1000000000, min: 60, h: 3600, cm: 10, ct: 1, '€': 100 };
// Umwandeln: [große Einheit, kleine Einheit, Umrechnungszahl, Größenart, Einheiten zur Wahl]
const PAARE = [['km', 'm', 1000, 'laenge', LAENGE], ['kg', 'g', 1000, 'gewicht', GEWICHT], ['t', 'kg', 1000, 'gewicht', GEWICHT], ['h', 'min', 60, 'zeit', ZEIT], ['m', 'cm', 100, 'laenge', LAENGE]];
const urteil = (sagt, stimmt, beh, richtigGlg, falschGlg, fv, hilfen, extra = {}) => auswahl(sagt, [opt('Stimmt.', stimmt, stimmt ? undefined : fv), opt(`Falsch. Es gilt ${richtigGlg}.`, !stimmt, stimmt ? fv : undefined), ...falschGlg.map((g) => opt(`Falsch. Es gilt ${g}.`, false, fv))], hilfen, { ...extra, nachweis: [{ art: 'urteil', stimmt, behauptung: beh }] });

export function bruecheUndGroessen() {
  // ================= T1: Bruchteil einer Größe =================
  const tT1 = h3('Teile zuerst durch den Nenner. Nimm dann mit dem Zähler mal.', '3⁄4 von 20 kg: 20 kg : 4 = 5 kg und 5 kg · 3 = 15 kg.', 'Rechne zuerst einen Teil aus. Nimm ihn dann so oft, wie der Zähler sagt.');
  const NF = [3, 4, 5, 6, 8, 10];
  sechs(T1, 'F', [
    () => { const { z, n, e, G, x } = teil(NF, [2, 3, 4, 5, 6]);
      return luecken(Z(`Berechne ${br(z, n)} von ${G} m in zwei Schritten.`, `Ein Teil: ${G} m : ${n} = {{a}} m`, `${z} Teile: ${br(z, n)} von ${G} m = {{b}} m`), { a: [e, fehlerliste(e, [[G - n, 'div-falsche-rechenart']])], b: [x, fehlerliste(x, [[e, 'bruchteil-zaehler-vergessen'], [e + z, 'sach-falsche-rechnung']])] }, tT1,
        { bild: streifen(z, n), nachweis: [`${G} m : ${n} = ${e} m`, `${br(z, n)} von ${G} m = ${x} m`] }); },
    () => { const { z, n, e, G, x } = teil(NF, [2, 3, 4, 5, 6, 7, 8]);
      return zahl(Z(`Wie viel sind ${br(z, n)} von ${G} kg?`), x, fehlerliste(x, [[e, 'bruchteil-zaehler-vergessen'], [G - x, 'sach-frage-verfehlt'], [G * z, 'bruch-ganzes-teil']]), tT1, { einheit: 'kg', bild: streifen(z, n), nachweis: [`${br(z, n)} von ${G} kg = ${x} kg`] }); },
    () => { const { z, n, e, G, x } = teil(NF, [2, 3, 4, 5, 6]);
      if (G - x === e) return null;
      return auswahl(Z(`Wie viel sind ${br(z, n)} von ${G} €?`), [opt(`${x} €`, true), opt(`${e} €`, false, 'bruchteil-zaehler-vergessen'), opt(`${G - x} €`, false, 'sach-frage-verfehlt')], tT1, { bild: streifen(z, n), nachweis: [`${br(z, n)} von ${G} € = ${x} €`, WERT(`${x} €`, true)] }); },
    () => { const [n, e] = wahl([[3, 2], [3, 3], [3, 4], [4, 2], [4, 3], [4, 4], [4, 5], [5, 2], [5, 3], [5, 4], [6, 2], [6, 3]]), z = zz(2, n - 1), N = n * e;
      if (ggt(z, n) !== 1) return null;
      return faerben(Z(`Im Bild siehst du ${N} Kugeln.`, `Färbe ${br(z, n)} der Kugeln.`), leer('menge', N), br(z, n), z * e, [[e, 'bruchteil-zaehler-vergessen'], [z, 'bruchteil-zaehler-vergessen'], [N - z * e, 'bruch-teil-zu-rest']],
        h3('Teile die Kugeln in gleich große Gruppen. Der Nenner sagt, wie viele Gruppen es sind.', '3⁄4 von 20 Kugeln: 20 : 4 = 5 und 5 · 3 = 15 Kugeln.', `Rechne ${N} : ${n}. Nimm das Ergebnis mal ${z}.`)); },
    () => { const { z, n, e, G, x } = teil(NF, [2, 3, 4, 5, 6]), kn = kind(), [ding, tat] = wahl([['Ein Seil', 'schneidet'], ['Ein Band', 'schneidet'], ['Eine Schnur', 'schneidet']]);
      return zahl(Z(`${ding} ist ${G} m lang.`, `${kn} ${tat} ${br(z, n)} davon ab.`, 'Wie lang ist das Stück?'), x, fehlerliste(x, [[e, 'bruchteil-zaehler-vergessen'], [G - x, 'sach-frage-verfehlt']]),
        h3('Das Stück ist ein Bruchteil der ganzen Länge.', '3⁄4 von 20 m: 20 m : 4 = 5 m und 5 m · 3 = 15 m.', `Rechne ${G} m : ${n}. Nimm das Ergebnis mal ${z}.`), { einheit: 'm', bild: streifen(z, n), nachweis: [`${br(z, n)} von ${G} m = ${x} m`] }); },
    () => { const { z, n, e, G, x } = teil([4, 5, 10], [5, 10, 20]);
      return zahl(Z(`Wie viel Cent sind ${br(z, n)} von ${G} ct?`), x, fehlerliste(x, [[e, 'bruchteil-zaehler-vergessen'], [G - x, 'sach-frage-verfehlt']]), tT1, { einheit: 'ct', bild: streifen(z, n), nachweis: [`${br(z, n)} von ${G} ct = ${x} ct`] }); },
  ]);
  const tT1G = h3('Wandle zuerst in die kleinere Einheit um. Teile dann durch den Nenner und nimm mit dem Zähler mal.', '3⁄4 h: 1 h = 60 min. Dann 60 min : 4 = 15 min und 15 min · 3 = 45 min.', 'Schreibe die Größe in der kleineren Einheit. Rechne dann den Bruchteil aus.');
  sechs(T1, 'G', [
    () => { const [z, n] = gekuerzt([3, 4, 5, 6, 10, 12, 15, 20], 2), x = (60 / n) * z;
      return zahl(Z(`Wie viele Minuten sind ${br(z, n)} h?`), x, fehlerliste(x, [[60 / n, 'bruchteil-zaehler-vergessen'], [(100 / n) * z, 'zeit-zehnersystem'], [z * 10 + n, 'bruch-als-komma']]), tT1G, { einheit: 'min', nachweis: ['1 h = 60 min', `${br(z, n)} von 60 min = ${x} min`] }); },
    () => { const [z, n] = gekuerzt([4, 5, 8, 10], 2), G = zz(2, 6), [gross, klein] = wahl([['kg', 'g'], ['km', 'm']]), x = (G * 1000 * z) / n;
      return luecken(Z(`Berechne ${br(z, n)} von ${G} ${gross}.`, `Wandle zuerst um: ${G} ${gross} = {{a}} ${klein}`, `Dann: ${br(z, n)} von ${G} ${gross} = {{b}} ${klein}`), { a: [G * 1000, fehlerliste(G * 1000, [[G * 100, 'umrechnungszahl'], [G * 10, 'umrechnungszahl']])], b: [x, fehlerliste(x, [[(G * 1000) / n, 'bruchteil-zaehler-vergessen'], [G * 1000 - x, 'sach-frage-verfehlt']])] }, tT1G,
        { bild: streifen(z, n), nachweis: [`${G} ${gross} = ${G * 1000} ${klein}`, `${br(z, n)} von ${G * 1000} ${klein} = ${x} ${klein}`] }); },
    () => { const n = wahl([2, 4, 5, 10]), z = wahl(vorn(n - 1, 1).filter((k) => ggt(k, n) === 1)), g = zz(1, 4), x = g * 100 + (100 / n) * z;
      return zahl(Z(`Wie viele Zentimeter sind ${br(z, n, g)} m?`), x, fehlerliste(x, [[(100 / n) * z, 'gemischt-umwandeln'], [g * 100 + z * 10 + n, 'bruch-als-komma'], [g * 100 + 100 / n, 'bruchteil-zaehler-vergessen']]),
        h3('Rechne die Ganzen und den Bruch einzeln um. Zähle dann zusammen.', '1 1⁄2 m: 1 m = 100 cm und 1⁄2 m = 50 cm. Zusammen 150 cm.', `Rechne ${g} m in Zentimeter um. Rechne dann ${br(z, n)} von 100 cm dazu.`), { einheit: 'cm', nachweis: [`${br(z, n, g)} m = ${x} cm`] }); },
    () => { const [z, n] = gekuerzt([4, 5, 8, 10], 2), G = zz(2, 5), x = (G * 1000 * z) / n, kn = kind();
      return zahl(Z(`Ein Wanderweg ist ${G} km lang.`, `${kn} hat schon ${br(z, n)} davon geschafft.`, 'Wie viele Meter sind das?'), x, fehlerliste(x, [[(G * 1000) / n, 'bruchteil-zaehler-vergessen'], [G * 1000 - x, 'sach-frage-verfehlt'], [x / 10, 'umrechnungszahl']]), tT1G,
        { einheit: 'm', bild: streifen(z, n), nachweis: [`${G} km = ${G * 1000} m`, `${br(z, n)} von ${G * 1000} m = ${x} m`] }); },
    () => { const { z, n, e, G, x } = teil([3, 4, 5, 6, 8, 12, 15, 20], [3, 4, 5, 6, 7, 8, 9]), stimmt = wahl([true, false, false]), kn = kind(), einheit = wahl(['kg', 'm', '€']), gesagt = stimmt ? x : e, g = (w) => `${br(z, n)} von ${G} ${einheit} = ${w} ${einheit}`;
      if (G - n === x || G - n === e) return null;
      return urteil(Z(`${kn} rechnet: ${g(gesagt)}`, 'Stimmt das?'), stimmt, g(gesagt), g(stimmt ? e : x), [g(G - n)], 'bruchteil-zaehler-vergessen',
        h3('Prüfe beide Schritte: teilen durch den Nenner, dann mal den Zähler.', '3⁄4 von 8 kg: 8 kg : 4 = 2 kg und 2 kg · 3 = 6 kg.', `Rechne ${G} : ${n}. Nimm das Ergebnis mal ${z}.`), { bild: streifen(z, n) }); },
    () => { const a = teil([3, 4, 5, 6, 8], [3, 4, 5, 6, 8, 10]), c = teil([3, 4, 5, 6, 8, 10], [2, 3, 4, 5, 6, 8]), l = `${br(a.z, a.n)} von ${a.G} €`, r = `${br(c.z, c.n)} von ${c.G} €`;
      if (a.n === c.n || Math.abs(a.x - c.x) > 12) return null;
      return auswahl(Z('Welches Zeichen passt?', `${l} ▢ ${r}`), ZEICHEN([a.x, 1], [c.x, 1], 'bruch-nur-zaehler-verglichen'), h3('Rechne zuerst beide Bruchteile aus. Vergleiche dann die Ergebnisse.', '1⁄2 von 10 € sind 5 €. 3⁄4 von 8 € sind 6 €. Also ist die rechte Seite größer.', 'Schreibe beide Ergebnisse auf. Setze dann das Zeichen.'), { nachweis: [`${l} = ${a.x} €`, `${r} = ${c.x} €`, VGL(l, r)] }); },
  ]);
  sechs(T1, 'M', [
    () => { const [gross, klein, mal, art, einheiten] = wahl(PAARE.slice(0, 3)), [z, n] = gekuerzt([8, 16, 20, 25, 40, 50], 3), G = zz(2, 9), x = (G * mal * z) / n;
      if (!Number.isInteger(x)) return null;
      return groesse(`Berechne ${br(z, n)} von ${G} ${gross}. Gib das Ergebnis in einer passenden Einheit an.`, art, x * MAL[klein], klein, [[((G * mal) / n) * MAL[klein], 'bruchteil-zaehler-vergessen'], [x * MAL[klein] / 10, 'umrechnungszahl'], [(G * mal - x) * MAL[klein], 'sach-frage-verfehlt']],
        h2(`In ${gross} geht die Rechnung nicht auf. Wandle deshalb zuerst in ${klein} um.`, `${G} ${gross} = ${G * mal} ${klein}. Teile durch ${n} und nimm mit ${z} mal.`), { einheiten, nachweis: [`${G} ${gross} = ${G * mal} ${klein}`, `${br(z, n)} von ${G * mal} ${klein} = ${x} ${klein}`] }); },
    () => { const [z, n] = gekuerzt([6, 12, 15, 20, 30], 5), G = zz(2, 4), x = (G * 60 * z) / n;
      return groesse(`Berechne ${br(z, n)} von ${G} h. Gib das Ergebnis in einer passenden Einheit an.`, 'zeit', x * 60, 'min', [[((G * 60) / n) * 60, 'bruchteil-zaehler-vergessen'], [((G * 100 * z) / n) * 60, 'zeit-zehnersystem'], [(G * 60 - x) * 60, 'sach-frage-verfehlt']],
        h2('Wandle die Stunden zuerst in Minuten um. Eine Stunde hat 60 Minuten, nicht 100.', `${G} h = ${G * 60} min. Teile durch ${n} und nimm mit ${z} mal.`), { einheiten: ZEIT, nachweis: [`${G} h = ${G * 60} min`, `${br(z, n)} von ${G * 60} min = ${x} min`] }); },
    () => { const g = zz(1, 4), [z, n] = gekuerzt([4, 5, 8, 10], 2), menge = g * 1000 + 500, x = (menge * z) / n, [was, tat] = wahl([['Mehl', 'verbacken'], ['Erde', 'verbraucht'], ['Futter', 'verfüttert']]);
      if (!Number.isInteger(x)) return null;
      return groesse(`Von ${br(1, 2, g)} kg ${was} werden ${br(z, n)} ${tat}. Wie viel ${was} ist das? Gib das Ergebnis in einer passenden Einheit an.`, 'gewicht', x * 1000, 'g', [[(menge / n) * 1000, 'bruchteil-zaehler-vergessen'], [(menge - x) * 1000, 'sach-frage-verfehlt'], [((g * 1000 * z) / n) * 1000, 'gemischt-umwandeln']],
        h2('Schreibe die gemischte Zahl zuerst in Gramm. Dann lässt sich der Bruchteil ausrechnen.', `${br(1, 2, g)} kg = ${menge} g. Teile durch ${n} und nimm mit ${z} mal.`), { einheiten: GEWICHT, nachweis: [`${br(1, 2, g)} kg = ${menge} g`, `${br(z, n)} von ${menge} g = ${x} g`] }); },
    () => { const [z, n] = gekuerzt([20, 25, 50], 3), G = zz(2, 9), x = (G * 100 * z) / n;
      return zahl(`Wie viele Cent sind ${br(z, n)} von ${G} €?`, x, fehlerliste(x, [[(G * 100) / n, 'bruchteil-zaehler-vergessen'], [G * 100 - x, 'sach-frage-verfehlt'], [G * z, 'umrechnungszahl']]), h2('Wandle zuerst in Cent um. Dann geht das Teilen auf.', `${G} € = ${G * 100} ct. Teile durch ${n} und nimm mit ${z} mal.`), { einheit: 'ct', nachweis: [`${G} € = ${G * 100} ct`, `${br(z, n)} von ${G * 100} ct = ${x} ct`] }); },
    () => { const [z, n] = gekuerzt([4, 5, 10, 20], 2), h = zz(1, 2), m = wahl([20, 40]), ges = h * 60 + m, x = (ges * z) / n, [was] = wahl([['Ein Film'], ['Ein Konzert'], ['Eine Zugfahrt']]);
      if (!Number.isInteger(x)) return null;
      return groesse(`${was} dauert ${h} h ${m} min. ${br(z, n)} davon sind schon vorbei. Wie lange dauert der Rest? Gib das Ergebnis in einer passenden Einheit an.`, 'zeit', (ges - x) * 60, 'min', [[x * 60, 'sach-schritt-vergessen'], [(ges / n) * 60, 'bruchteil-zaehler-vergessen'], [((h * 100 + m) - ((h * 100 + m) * z) / n) * 60, 'zeit-zehnersystem']],
        h2('Wandle die Dauer in Minuten um. Rechne den Bruchteil aus und ziehe ihn von der ganzen Dauer ab.', `${h} h ${m} min = ${ges} min. Vorbei sind ${x} min.`), { einheiten: ZEIT, nachweis: [`${h} h ${m} min = ${ges} min`, `${br(z, n)} von ${ges} min = ${x} min`, `${ges} min − ${x} min = ${ges - x} min`] }); },
    () => { const [z1, n1] = gekuerzt([4, 5, 8], 2), [z2, n2] = gekuerzt([4, 5, 8, 10], 2), G1 = zz(2, 4), G2 = wahl([1200, 1600, 2000, 2400, 3200, 4000]), x1 = (G1 * 1000 * z1) / n1, x2 = (G2 * z2) / n2, l = `${br(z1, n1)} von ${G1} km`, r = `${br(z2, n2)} von ${G2} m`;
      if (!Number.isInteger(x1) || !Number.isInteger(x2) || Math.abs(x1 - x2) > 800 || n1 === n2) return null;
      return auswahl(`Welches Zeichen passt? ${l} ▢ ${r}`, ZEICHEN([x1, 1], [x2, 1], 'bruch-nur-zaehler-verglichen'), h2('Rechne beide Seiten in Meter aus. Erst dann kannst du vergleichen.', `Die linke Seite sind ${br(z1, n1)} von ${G1 * 1000} m. Rechne beide Bruchteile aus.`), { nachweis: [`${G1} km = ${G1 * 1000} m`, `${br(z1, n1)} von ${G1 * 1000} m = ${x1} m`, `${r} = ${x2} m`, VGL(l, r)] }); },
  ]);
  sechs(T1, 'E', [
    () => { const [gross, klein, mal, art, einheiten] = wahl(PAARE.slice(0, 3)), [z, n] = gekuerzt([40, 80, 125, 200], 7), G = zz(2, 9), x = (G * mal * z) / n;
      if (!Number.isInteger(x)) return null;
      return groesse(`Berechne ${br(z, n)} von ${G} ${gross}. Gib das Ergebnis in einer passenden Einheit an.`, art, x * MAL[klein], klein, [[((G * mal) / n) * MAL[klein], 'bruchteil-zaehler-vergessen'], [(G * mal - x) * MAL[klein], 'sach-frage-verfehlt']], h1('Wandle in die kleinere Einheit um, damit das Teilen durch den Nenner aufgeht.'), { einheiten, nachweis: [`${G} ${gross} = ${G * mal} ${klein}`, `${br(z, n)} von ${G * mal} ${klein} = ${x} ${klein}`] }); },
    () => { const [z1, n1] = gekuerzt([4, 5, 8], 2), [z2, n2] = gekuerzt([3, 5, 6, 10], 2), G = zz(2, 6), x1 = (G * 1000 * z1) / n1, x2 = (x1 * z2) / n2, [weg, erst, dann] = wahl([['Radweg', 'asphaltiert', 'neu gebaut'], ['Wanderweg', 'im Wald', 'steil'], ['Fluss', 'schiffbar', 'begradigt']]);
      if (!Number.isInteger(x1) || !Number.isInteger(x2) || n1 === n2) return null;
      return groesse(`Ein ${weg} ist ${G} km lang. ${br(z1, n1)} davon sind ${erst}. Von diesem Stück sind wieder ${br(z2, n2)} ${dann}. Wie lang ist das Stück, das ${dann} ist? Gib das Ergebnis in einer passenden Einheit an.`, 'laenge', x2 * 1000, 'm', [[x1 * 1000, 'sach-schritt-vergessen'], [((G * 1000 * z2) / n2) * 1000, 'sach-schritt-vergessen']],
        h1('Rechne in zwei Schritten: erst den Bruchteil der ganzen Strecke, dann den Bruchteil von diesem Stück.'), { einheiten: LAENGE, nachweis: [`${G} km = ${G * 1000} m`, `${br(z1, n1)} von ${G * 1000} m = ${x1} m`, `${br(z2, n2)} von ${x1} m = ${x2} m`] }); },
    () => { const [n1, n2] = wahl([[3, 4], [3, 8], [4, 6], [3, 6], [4, 8], [6, 8], [3, 12], [4, 12]]), a = 24 / n1, c = 24 / n2, kn = kind();
      return groesse(`Ein Tag hat 24 h. ${kn} schläft ${br(1, n1)} des Tages und ist ${br(1, n2)} des Tages in der Schule. Wie viel Zeit bleibt ${kn} für alles andere? Gib das Ergebnis in einer passenden Einheit an.`, 'zeit', (24 - a - c) * 3600, 'h', [[(a + c) * 3600, 'sach-frage-verfehlt'], [(24 - a) * 3600, 'sach-schritt-vergessen'], [(24 - c) * 3600, 'sach-schritt-vergessen']],
        h1('Rechne beide Bruchteile des Tages in Stunden aus. Ziehe beide von 24 h ab.'), { einheiten: ZEIT, nachweis: [`${br(1, n1)} von 24 h = ${a} h`, `${br(1, n2)} von 24 h = ${c} h`, `24 h − ${a} h − ${c} h = ${24 - a - c} h`] }); },
    () => { const n = wahl([4, 5, 6, 8, 10]), [a, c] = mische([2, 3, 4, 5, 6, 7].filter((x) => x !== n)).slice(0, 2), stimmt = wahl([true, false, false]), kn = kind(), l = `${br(a, n)} von ${c} h`, r = stimmt ? `${br(c, n)} von ${a} h` : `${br(c, n)} von ${a + 1} h`, wahr = stimmt ? '=' : '<';
      return urteil(`${kn} behauptet: „${l} sind genauso lang wie ${r}.“ Stimmt das?`, stimmt, `${l} = ${r}`, `${l} ${stimmt ? '<' : wahr} ${r}`, [`${l} > ${r}`], 'bruchteil-zaehler-vergessen',
        h1('Rechne beide Seiten in Minuten aus. Oder überlege: Was passiert, wenn du Zähler und Größe vertauschst?')); },
    () => { const [z, n] = gekuerzt([4, 5, 8, 10], 2), raten = wahl([4, 5, 6, 8, 10]), rate = wahl([15, 20, 25, 30, 40, 50]), rest = raten * rate, P = (rest * n) / (n - z), an = (P * z) / n, was = wahl(['Ein Fahrrad', 'Ein Tablet', 'Eine Gitarre']);
      if (!Number.isInteger(P) || !Number.isInteger(an)) return null;
      return zahl(`${was} kostet ${P} €. ${br(z, n)} des Preises werden sofort bezahlt, der Rest in ${raten} gleich großen Raten. Wie hoch ist eine Rate?`, rate, fehlerliste(rate, [[an / raten, 'sach-frage-verfehlt'], [P / raten, 'sach-schritt-vergessen'], [rest, 'sach-schritt-vergessen']]),
        h1('Rechne zuerst die Anzahlung aus. Was dann noch fehlt, wird gleichmäßig auf die Raten verteilt.'), { einheit: '€', nachweis: [`${br(z, n)} von ${P} € = ${an} €`, `${P} € − ${an} € = ${rest} €`, `${rest} € : ${raten} = ${rate} €`] }); },
    () => { const roh = [[`${br(3, 4)} h`, 45], [`${br(2, 3)} h`, 40], [`${br(5, 6)} h`, 50], [`${br(7, 12)} h`, 35], [`${br(4, 5)} h`, 48], [`${br(3, 5)} h`, 36], [`${br(11, 12)} h`, 55], [`${br(7, 10)} h`, 42], ['44 min', 44], ['38 min', 38], ['52 min', 52], ['2400 s', 40], ['3000 s', 50], ['2760 s', 46], ['41 min', 41]];
      const karten = mische(roh).slice(0, 5).sort((a, c) => a[1] - c[1]);
      if (new Set(karten.map((k) => k[1])).size < 5 || karten.filter((k) => k[0].includes('⁄')).length < 2 || karten.filter((k) => !k[0].includes('⁄')).length < 2) return null;
      return ordnen('Ordne die Zeitspannen. Beginne mit der kürzesten.', karten.map((k) => k[0]), h1('Rechne alle Zeitspannen in Minuten um. Eine Stunde hat 60 Minuten, eine Minute hat 60 Sekunden.'), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'zeichen-verwechselt', sonst: 'zeit-zehnersystem' }); },
  ]);

  // ================= T2: zum Ganzen zurück, Anteile =================
  const tT2 = h3('Ein Teil ist bekannt. Das Ganze hat so viele Teile, wie der Nenner sagt.', '1⁄4 sind 5 kg. Das Ganze sind 4 Teile: 4 · 5 kg = 20 kg.', 'Nimm den einen Teil mit dem Nenner mal.');
  const tT2z = h3('Rechne zuerst einen Teil aus. Teile dazu durch den Zähler.', '2⁄3 sind 8 km. Ein Teil: 8 km : 2 = 4 km. Das Ganze: 3 · 4 km = 12 km.', 'Teile durch den Zähler. Nimm das Ergebnis mit dem Nenner mal.');
  sechs(T2, 'F', [
    () => { const n = wahl([3, 4, 5, 6, 8]), e = zz(2, 9);
      return zahl(Z(`${br(1, n)} der Strecke sind ${e} km.`, 'Wie lang ist die ganze Strecke?'), n * e, fehlerliste(n * e, [[e, 'bruch-ganzes-teil'], [n + e, 'sach-falsche-rechnung']]), tT2, { einheit: 'km', bild: streifen(1, n), nachweis: [`${n} · ${e} km = ${n * e} km`] }); },
    () => { const N = wahl([6, 8, 9, 10]), z = wahl(vorn(N - 3, 2).filter((x) => ggt(x, N) > 1)), g = ggt(z, N);
      return bruch(Z(`Im Bild siehst du ${N} Kugeln.`, `${z} Kugeln sind gefärbt.`, 'Welcher Anteil der Kugeln ist gefärbt?', 'Kürze so weit wie möglich.'), br(z / g, N / g), [[br(N - z, N), 'sach-frage-verfehlt']].filter(([x]) => { const [p, q] = x.split('⁄').map(Number); return p * N !== q * z; }),
        h3('Der Anteil ist ein Bruch. Oben steht der Teil, unten das Ganze.', 'Von 8 Kugeln sind 6 gefärbt. Der Anteil ist 6⁄8 = 3⁄4.', `Schreibe ${br(z, N)}. Kürze dann mit ${g}.`), { gekuerzt: true, bild: bild(fig('menge', N, vorn(z))), nachweis: [NB(br(z, N)), `${z} : ${N} = ${br(z / g, N / g)}`] }); },
    () => { const n = wahl([3, 4, 5, 10]), e = zz(2, 9);
      return zahl(Z(`${br(1, n)} des Preises sind ${e} €.`, 'Wie hoch ist der ganze Preis?'), n * e, fehlerliste(n * e, [[e, 'bruch-ganzes-teil'], [n + e, 'sach-falsche-rechnung']]), tT2, { einheit: '€', bild: streifen(1, n), nachweis: [`${n} · ${e} € = ${n * e} €`] }); },
    () => { const n = wahl([3, 4, 5, 6]), e = zz(3, 8);
      if (e % n !== 0 && n * e === n + e) return null;
      return auswahl(Z(`${br(1, n)} der Kinder sind ${e} Kinder.`, 'Wie viele Kinder sind es zusammen?'), [opt(String(n * e), true), opt(String(n + e), false, 'sach-falsche-rechnung'), opt(String(e), false, 'bruch-ganzes-teil')], tT2, { bild: streifen(1, n), nachweis: [`${n} · ${e} = ${n * e}`, WERT(String(n * e), true)] }); },
    () => { const [z, n] = gekuerzt([3, 4, 5], 2), e = zz(2, 6);
      return zahl(Z(`${br(z, n)} des Weges sind ${z * e} km.`, 'Wie lang ist der ganze Weg?'), n * e, fehlerliste(n * e, [[e, 'sach-schritt-vergessen'], [z * e * n, 'sach-schritt-vergessen'], [z * e, 'bruch-ganzes-teil']]), tT2z, { einheit: 'km', bild: streifen(z, n), nachweis: [`${z * e} km : ${z} = ${e} km`, `${n} · ${e} km = ${n * e} km`] }); },
    () => { const [r, s] = wahl([[2, 3], [2, 4], [2, 5], [3, 3], [2, 2], [3, 4]]), N = r * s, z = wahl(vorn(N - 2, 2).filter((x) => ggt(x, N) > 1)), g = ggt(z, N);
      return bruch(Z(`Von ${N} Feldern sind ${z} gefärbt.`, 'Welcher Anteil ist das?', 'Kürze so weit wie möglich.'), br(z / g, N / g), [[br(N - z, N), 'sach-frage-verfehlt']].filter(([x]) => { const [p, q] = x.split('⁄').map(Number); return p * N !== q * z; }),
        h3('Der Anteil ist ein Bruch. Oben steht der Teil, unten das Ganze.', 'Von 8 Feldern sind 6 gefärbt. Der Anteil ist 6⁄8 = 3⁄4.', `Schreibe ${br(z, N)}. Kürze dann mit ${g}.`), { gekuerzt: true, bild: bild(fig('rechteck', [r, s], vorn(z))), nachweis: [NB(br(z, N)), `${z} : ${N} = ${br(z / g, N / g)}`] }); },
  ]);
  const rueck = (nenner, es) => { const [z, n] = gekuerzt(nenner, 2), e = wahl(es); return { z, n, e, T: z * e, G: n * e }; };
  sechs(T2, 'G', [
    () => { const { z, n, e, T, G } = rueck([3, 4, 5, 6, 8, 10], [3, 4, 5, 6, 7, 8]);
      return zahl(Z(`${br(z, n)} der Strecke sind ${T} km.`, 'Wie lang ist die ganze Strecke?'), G, fehlerliste(G, [[e, 'sach-schritt-vergessen'], [T * n, 'sach-schritt-vergessen'], [(T / n) * z, 'bruch-ganzes-teil']]), tT2z, { einheit: 'km', bild: streifen(z, n), nachweis: [`${T} km : ${z} = ${e} km`, `${n} · ${e} km = ${G} km`] }); },
    () => { const { z, n, e, T, G } = rueck([3, 4, 5, 6, 8], [3, 4, 5, 6, 7, 9]);
      return luecken(Z(`${br(z, n)} vom Gewicht sind ${T} kg.`, `Ein Teil: ${T} kg : ${z} = {{a}} kg`, 'Das Ganze: {{b}} kg'), { a: [e, fehlerliste(e, [[T / n, 'bruch-ganzes-teil'], [T - z, 'div-falsche-rechenart']])], b: [G, fehlerliste(G, [[e, 'sach-schritt-vergessen'], [T * n, 'sach-schritt-vergessen']])] }, tT2z,
        { bild: streifen(z, n), nachweis: [`${T} kg : ${z} = ${e} kg`, `${n} · ${e} kg = ${G} kg`] }); },
    () => { const [z, n] = gekuerzt([3, 4, 5, 6, 8, 10], 1), k = zz(2, 6), [alle, tun] = wahl([['Kindern', 'kommen mit dem Bus'], ['Kindern', 'spielen ein Instrument'], ['Tieren', 'sind Hunde'], ['Bällen', 'sind rot']]);
      return bruch(Z(`Von ${n * k} ${alle} ${tun.replace(/^(\w+) /, `$1 ${z * k} `)}.`, 'Welcher Anteil ist das?', 'Kürze vollständig.'), br(z, n), [[br(n - z, n), 'sach-frage-verfehlt'], [br(n, z), 'bruch-vertauscht']].filter(([x]) => { const [p, q] = x.split('⁄').map(Number); return p * n !== q * z && p !== q; }),
        h3('Der Anteil ist ein Bruch. Oben steht der Teil, unten das Ganze.', 'Von 20 Kindern sind 15 da. Der Anteil ist 15⁄20 = 3⁄4.', `Schreibe ${br(z * k, n * k)}. Kürze dann vollständig.`), { gekuerzt: true, nachweis: [`${z * k} : ${n * k} = ${br(z, n)}`] }); },
    () => { const k = wahl([1, 2, 3, 4, 5, 7, 8, 9, 10, 11]), m = 5 * k, g = ggt(k, 12);
      return bruch(Z('Der Kreis zeigt eine Stunde.', `Gefärbt sind ${m} min.`, 'Welcher Anteil von 1 h ist das?', 'Kürze vollständig.'), br(k / g, 12 / g), [[br(m, 100), 'zeit-zehnersystem']].filter(([x]) => { const [p, q] = x.split('⁄').map(Number); return p * 12 !== q * k; }),
        h3('Der Kreis hat 12 gleich große Teile. Jedes Teil sind 5 Minuten.', '45 min sind 9 von 12 Teilen. Der Anteil ist 9⁄12 = 3⁄4.', 'Zähle die gefärbten Teile. Schreibe den Bruch und kürze vollständig.'), { gekuerzt: true, bild: bild(fig('kreis', 12, vorn(k))), nachweis: [NB(br(k, 12)), `${m} min : 60 min = ${br(k / g, 12 / g)}`] }); },
    () => { const { z, n, e, T, G } = rueck([3, 4, 5, 6, 8], [6, 8, 10, 12, 15, 20]), kn = kind();
      return zahl(Z(`${kn} hat ${br(z, n)} eines Buches gelesen.`, `Das sind ${T} Seiten.`, 'Wie viele Seiten hat das Buch?'), G, fehlerliste(G, [[e, 'sach-schritt-vergessen'], [T * n, 'sach-schritt-vergessen'], [(T * z) / n, 'bruch-ganzes-teil'], [G - T, 'sach-frage-verfehlt']]), tT2z, { nachweis: [`${T} : ${z} = ${e}`, `${n} · ${e} = ${G}`] }); },
    () => { const n = wahl([3, 4, 5, 6]), e = zz(4, 9), kn = kind(), stimmt = wahl([true, false, false]), gesagt = stimmt ? n * e : n + e;
      if (n * e === n + e) return null;
      return auswahl(Z(`${br(1, n)} der Klasse sind ${e} Kinder.`, `${kn} sagt: „Die Klasse hat ${gesagt} Kinder.“`, 'Stimmt das?'), [opt('Stimmt.', stimmt, stimmt ? undefined : 'sach-falsche-rechnung'), opt(`Falsch. Es gilt ${n} · ${e} = ${stimmt ? n + e : n * e}.`, !stimmt, stimmt ? 'sach-falsche-rechnung' : undefined), opt(`Falsch. Es gilt ${n} · ${e} = ${n * e + n}.`, false, 'sach-falsche-rechnung')], tT2,
        { bild: streifen(1, n), nachweis: [{ art: 'urteil', stimmt, behauptung: `${n} · ${e} = ${gesagt}` }] }); },
  ]);
  sechs(T2, 'M', [
    () => { const { z, n, e, T, G } = rueck([8, 12, 16, 20, 25], [200, 250, 400, 500]), [art, klein, einheiten] = wahl([['laenge', 'm', LAENGE], ['gewicht', 'g', GEWICHT]]);
      return groesse(`${br(z, n)} ${art === 'laenge' ? 'einer Strecke' : 'einer Lieferung'} sind ${T} ${klein}. Wie ${art === 'laenge' ? 'lang ist die ganze Strecke' : 'schwer ist die ganze Lieferung'}? Gib das Ergebnis in einer passenden Einheit an.`, art, G * 1000, klein, [[e * 1000, 'sach-schritt-vergessen'], [T * n * 1000, 'sach-schritt-vergessen'], [((T * z) / n) * 1000, 'bruch-ganzes-teil']],
        h2('Rechne rückwärts: Teile zuerst durch den Zähler. Dann kennst du einen Teil.', `Ein Teil sind ${T} ${klein} : ${z} = ${e} ${klein}. Das Ganze hat ${n} solche Teile.`), { einheiten, nachweis: [`${T} ${klein} : ${z} = ${e} ${klein}`, `${n} · ${e} ${klein} = ${G} ${klein}`] }); },
    () => { const [gross, klein, mal] = wahl([['kg', 'g', 1000], ['km', 'm', 1000], ['m', 'cm', 100]]), [z, n] = gekuerzt([4, 5, 8, 10, 20, 25, 40], 1), G = zz(2, 5), T = (G * mal * z) / n;
      if (!Number.isInteger(T)) return null;
      return bruch(`Welcher Anteil von ${G} ${gross} sind ${T} ${klein}? Kürze vollständig.`, br(z, n), [[br(T, G), 'umrechnungszahl'], [br(n - z, n), 'sach-frage-verfehlt']].filter(([x]) => { const [p, q] = x.split('⁄').map(Number); return p < q && p * n !== q * z; }),
        h2('Für einen Anteil müssen beide Größen dieselbe Einheit haben. Wandle zuerst um.', `${G} ${gross} = ${G * mal} ${klein}. Der Anteil ist ${T} durch ${G * mal}. Kürze vollständig.`), { gekuerzt: true, nachweis: [`${G} ${gross} = ${G * mal} ${klein}`, `${T} ${klein} : ${G * mal} ${klein} = ${br(z, n)}`] }); },
    () => { const { z, n, e, T, G } = rueck([3, 4, 5, 6, 8], [6, 7, 8, 9, 12, 15]), kn = kind();
      return zahl(`${kn} kauft ein und hat danach noch ${br(z, n)} des Geldes übrig. Das sind ${T} €. Wie viel Euro hatte ${kn} vor dem Einkauf?`, G, fehlerliste(G, [[e, 'sach-schritt-vergessen'], [T * n, 'sach-schritt-vergessen'], [G - T, 'sach-frage-verfehlt'], [(T * z) / n, 'bruch-ganzes-teil']]),
        h2('Das Geld vor dem Einkauf ist das Ganze. Rechne rückwärts über einen Teil.', `Ein Teil sind ${T} € : ${z} = ${e} €. Das Ganze hat ${n} solche Teile.`), { einheit: '€', nachweis: [`${T} € : ${z} = ${e} €`, `${n} · ${e} € = ${G} €`] }); },
    () => { const m = wahl([8, 14, 16, 22, 25, 26, 28, 32, 34, 35, 38, 44, 46, 52, 55, 56, 58]), g = ggt(m, 60);
      return bruch(`Welcher Anteil von 1 h sind ${m} min? Kürze vollständig.`, br(m / g, 60 / g), [[br(m, 100), 'zeit-zehnersystem']].filter(([x]) => { const [p, q] = x.split('⁄').map(Number); return p * 60 !== q * m; }),
        h2('Eine Stunde hat 60 Minuten. Der Anteil ist die Minutenzahl durch 60.', `Schreibe ${m} durch 60 als Bruch und kürze mit ${g}.`), { gekuerzt: true, nachweis: [`${m} min : 60 min = ${br(m / g, 60 / g)}`] }); },
    () => { const [z, n] = gekuerzt([4, 5, 7, 8, 9], 2), e = wahl([12, 15, 18, 21, 24, 28]), rest = (n - z) * e, kn = kind();
      return zahl(`${kn} hat schon ${br(z, n)} eines Buches gelesen. Es fehlen noch ${rest} Seiten. Wie viele Seiten hat das Buch?`, n * e, fehlerliste(n * e, [[(rest / z) * n, 'sach-schritt-vergessen'], [e, 'sach-schritt-vergessen'], [z * e, 'sach-frage-verfehlt'], [rest * n, 'sach-schritt-vergessen']]),
        h2('Die fehlenden Seiten sind der Rest zum Ganzen. Welcher Bruchteil des Buches fehlt noch?', `Es fehlen ${br(n - z, n)} des Buches. Ein Teil sind ${rest} : ${n - z} = ${e} Seiten.`), { nachweis: [`1 − ${br(z, n)} = ${br(n - z, n)}`, `${rest} : ${n - z} = ${e}`, `${n} · ${e} = ${n * e}`] }); },
    () => { const [n1, n2] = wahl([[24, 28], [25, 30], [24, 27], [28, 30], [26, 30], [20, 24], [21, 28], [24, 30]]), z1 = zz(8, n1 - 6), z2 = zz(8, n2 - 6), l = [z1, n1], r = [z2, n2];
      if (z1 * n2 === z2 * n1 || Math.abs(z1 / n1 - z2 / n2) > 0.12) return null;
      return auswahl(`In der einen Klasse kommen ${z1} von ${n1} Kindern mit dem Rad, in der anderen sind es ${z2} von ${n2} Kindern. Vergleiche die Anteile. Welches Zeichen passt? ${br(...l)} ▢ ${br(...r)}`, ZEICHEN(l, r, 'bruch-nur-zaehler-verglichen'),
        h2('Mehr Kinder heißt nicht größerer Anteil. Vergleiche die Brüche.', 'Kürze beide Brüche vollständig und mache sie dann gleichnamig.'), { nachweis: [VGL(br(...l), br(...r))] }); },
  ]);
  sechs(T2, 'E', [
    () => { const [z, n] = gekuerzt([16, 25, 40, 50], 7), e = wahl([200, 400, 600, 800]), T = z * e, km = Math.floor(T / 1000), m = T % 1000, G = n * e;
      if (km < 1 || m === 0) return null;
      return groesse(`${br(z, n)} einer Strecke sind ${km} km ${m} m. Wie lang ist die ganze Strecke? Gib das Ergebnis in einer passenden Einheit an.`, 'laenge', G * 1000, G % 1000 === 0 ? 'km' : 'm', [[e * 1000, 'sach-schritt-vergessen'], [T * n * 1000, 'sach-schritt-vergessen']],
        h1('Wandle zuerst in Meter um. Teile dann durch den Zähler und nimm mit dem Nenner mal.'), { einheiten: LAENGE, nachweis: [`${km} km ${m} m = ${T} m`, `${T} m : ${z} = ${e} m`, `${n} · ${e} m = ${G} m`] }); },
    () => { const h = zz(1, 3), m = wahl([15, 20, 30, 40, 45]), ges = h * 60 + m, [z, n] = gekuerzt([3, 4, 5, 6, 8, 9, 10, 12, 15], 1), T = (ges * z) / n;
      if (!Number.isInteger(T) || T < 10) return null;
      return bruch(`Welcher Anteil von ${h} h ${m} min sind ${T} min? Kürze vollständig.`, br(z, n), [[br(T, h * 100 + m), 'zeit-zehnersystem'], [br(n - z, n), 'sach-frage-verfehlt']].filter(([x]) => { const [p, q] = x.split('⁄').map(Number); return p < q && p * n !== q * z; }),
        h1('Wandle die ganze Zeitspanne in Minuten um. Der Anteil ist dann Teil durch Ganzes.'), { gekuerzt: true, nachweis: [`${h} h ${m} min = ${ges} min`, `${T} min : ${ges} min = ${br(z, n)}`] }); },
    () => { const [z1, n1] = gekuerzt([3, 4, 5, 8], 2), [z2, n2] = gekuerzt([3, 4, 5, 6, 10], 2), e = wahl([6, 12, 18, 24, 30]), G = n1 * e, T = z1 * e, x = (G * z2) / n2;
      if (!Number.isInteger(x) || n1 === n2) return null;
      return zahl(`${br(z1, n1)} eines Betrags sind ${T} €. Wie viel Euro sind ${br(z2, n2)} dieses Betrags?`, x, fehlerliste(x, [[G, 'sach-schritt-vergessen'], [(T * z2) / n2, 'sach-schritt-vergessen'], [e, 'sach-schritt-vergessen']]),
        h1('Rechne zuerst zurück zum ganzen Betrag. Berechne davon dann den neuen Bruchteil.'), { einheit: '€', nachweis: [`${T} € : ${z1} = ${e} €`, `${n1} · ${e} € = ${G} €`, `${br(z2, n2)} von ${G} € = ${x} €`] }); },
    () => { const [a, c, d] = wahl([[[3, 8], [3, 4], [3, 8]], [[1, 4], [5, 8], [3, 8]], [[1, 3], [5, 6], [1, 2]], [[2, 5], [7, 10], [3, 10]], [[1, 6], [2, 3], [1, 2]], [[1, 4], [5, 6], [7, 12]], [[1, 3], [3, 4], [5, 12]]]), e = zz(3, 9), dazu = d[0] * e, G = d[1] * e, was = wahl(['Ein Sack', 'Ein Silo', 'Ein Container']);
      return zahl(`${was} ist zu ${br(...a)} gefüllt. Es werden ${dazu} kg nachgefüllt. Jetzt ist er zu ${br(...c)} gefüllt. Wie viel Kilogramm passen insgesamt hinein?`, G, fehlerliste(G, [[dazu * c[1], 'sach-schritt-vergessen'], [e, 'sach-schritt-vergessen'], [dazu + G, 'sach-falsche-rechnung']]),
        h1('Welcher Bruchteil des Ganzen wurde nachgefüllt? Mache die beiden Brüche gleichnamig und bilde den Unterschied.'), { einheit: 'kg', nachweis: [`${br(...c)} − ${br(...a)} = ${br(...d)}`, `${dazu} kg : ${d[0]} = ${e} kg`, `${d[1]} · ${e} kg = ${G} kg`] }); },
    () => { const [z, n] = gekuerzt([3, 4, 5, 6, 8, 9, 10, 12], 1), k = wahl([12, 15, 18, 20, 24, 30]), G = n * k, rest = z * k, a1 = zz(2, n - z - 1) * Math.floor(k / 2), a2 = G - rest - a1, kn = kind();
      if (a1 <= 0 || a2 <= 0 || a1 === a2) return null;
      return bruch(`${kn} hat ${G} € gespart. Davon gibt ${kn} ${a1} € für ein Geschenk und ${a2} € für ein Spiel aus. Welcher Anteil des Geldes bleibt übrig? Kürze vollständig.`, br(z, n), [[br(n - z, n), 'sach-frage-verfehlt']].filter(([x]) => { const [p, q] = x.split('⁄').map(Number); return p * n !== q * z; }),
        h1('Rechne zuerst aus, wie viel Geld übrig bleibt. Der Anteil ist dann Rest durch Erspartes.'), { gekuerzt: true, nachweis: [`${G} € − ${a1} € − ${a2} € = ${rest} €`, `${rest} € : ${G} € = ${br(z, n)}`] }); },
    () => { const [z1, n1] = wahl([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6]]), [z2, n2] = wahl([[3, 4], [2, 3], [5, 6], [3, 8], [5, 8]]), e = zz(3, 9), T = z1 * e * z2, basis = (T / z2) * n2, x = n1 * e * z2;
      if (n1 === n2 || !Number.isInteger(basis) || basis > 400) return null;
      return zahl(`${br(z1, n1)} einer Zahl sind genauso viel wie ${br(z2, n2)} von ${basis}. Wie heißt die Zahl?`, x, fehlerliste(x, [[T, 'sach-schritt-vergessen'], [(T * z1) / n1, 'bruch-ganzes-teil'], [basis, 'sach-frage-verfehlt']]),
        h1('Rechne zuerst die rechte Seite aus. Schließe dann vom Bruchteil auf das Ganze.'), { nachweis: [`${br(z2, n2)} von ${basis} = ${T}`, `${T} : ${z1} = ${T / z1}`, `${n1} · ${T / z1} = ${x}`] }); },
  ]);
}
