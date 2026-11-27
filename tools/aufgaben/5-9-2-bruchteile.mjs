// Aufgaben zu 5.9.2 „Bruchteile von Größen“ (Lernziele T1, T2) nach ADR 0015 und ADR 0036.
// T1: den Bruchteil einer Größe berechnen. T2: das Ganze oder den Anteil bestimmen, Sachaufgaben.
// Grilling mit Nils (2026-11-22): Geld, Zeit, Gewicht, Länge. Kein Liter, keine Flächen. Es geht immer auf.
// F Stammbrüche mit Bild, G mehrere Teile, M mit Umwandeln, E Ganzes oder Anteil gesucht. Kontexte: Königreich und Alltag.

import { sechs, auswahl, luecken, zahl, ordnen, zuordnen, sach, teil, bruch, Z, h1, h2, h3, fehlerliste, kind, zweiKinder } from '../werkzeug.mjs';
import { vorn, fig, bild, WERT, ggt, br, opt, zz, wahl, mische } from './5-9-brueche.mjs';

const T1 = '5.9.2-T1', T2 = '5.9.2-T2';
const VGL = (l, r) => ({ art: 'vergleich', links: l, rechts: r });
const streifen = (n, k = 1) => bild(fig('streifen', n, vorn(k)));
const richtigZuerst = (liste) => liste.map((o) => (o.richtig ? opt(o.text, true) : o));
// Stammbruch auf F: Nenner 2, 3, 4 und eine Größe, die aufgeht.
const stammF = (einheitMal = 1) => { const n = zz(2, 4), e = zz(2, 9) * einheitMal; return { n, e, G: n * e }; };
// Bruch z⁄n mit einem Teil e: G = n · e, Bruchteil = z · e.
const teilG = (nenner, eListe) => { const n = wahl(nenner), z = zf(n, 2), e = wahl(eListe); return { n, z, e, G: n * e, x: z * e }; };
const NENNER_G = [3, 4, 5, 6, 8, 10];
// Zähler, der sich mit dem Nenner nicht kürzen lässt: In Sachaufgaben stehen Brüche wie im Schulbuch.
const zf = (n, von = 1, bis = n - 1) => wahl(vorn(bis - von + 1, von).filter((z) => ggt(z, n) === 1));

export function bruchteile() {
  // ================= T1: Bruchteil einer Größe =================
  const tT1 = h3('Der Nenner sagt: In so viele gleich große Teile wird geteilt.', '1⁄2 von 8 kg: 8 kg : 2 = 4 kg.', 'Teile die Größe durch den Nenner.');
  sechs(T1, 'F', [
    () => { const { n, e, G } = stammF(), [wer, wem] = wahl([['Der Müller', 'dem Bäcker'], ['Die Bäuerin', 'der Köchin'], ['Der Händler', 'dem Wirt']]);
      return zahl(Z(`${wer} hat ${G} kg Mehl.`, `${wer} gibt ${br(1, n)} davon ${wem}.`, 'Wie viel kg sind das?'), e, fehlerliste(e, [[G - n, 'div-falsche-rechenart'], [G, 'bruch-ganzes-teil']]), tT1,
        { einheit: 'kg', bild: streifen(n), nachweis: [`${br(1, n)} von ${G} kg = ${e} kg`] }); },
    () => { const { n, e, G } = stammF(), kn = kind();
      return zahl(Z(`${kn} hat ${G} €.`, `${br(1, n)} davon gibt ${kn} auf dem Markt aus.`, 'Wie viel Euro sind das?'), e, fehlerliste(e, [[G - n, 'div-falsche-rechenart'], [G - e, 'sach-frage-verfehlt']]), tT1,
        { einheit: '€', bild: streifen(n), nachweis: [`${br(1, n)} von ${G} € = ${e} €`] }); },
    () => { const { n, e, G } = stammF();
      return luecken(Z('Teile gerecht.', `${br(1, n)} von ${G} m = {{a}} m`), { a: [e, fehlerliste(e, [[G - n, 'div-falsche-rechenart'], [G * n, 'bruch-ganzes-teil']])] }, tT1, { bild: streifen(n), nachweis: [`${br(1, n)} von ${G} m = ${e} m`] }); },
    () => { const { n, e, G } = stammF(), einheit = wahl(['kg', 'm', '€']);
      if (G - n === e) return null;
      return auswahl(Z(`Du suchst ${br(1, n)} von ${G} ${einheit}.`, 'Welche Rechnung passt?'), [opt(`${G} ${einheit} : ${n}`, true), opt(`${G} ${einheit} − ${n} ${einheit}`, false, 'div-falsche-rechenart'), opt(`${G} ${einheit} · ${n}`, false, 'bruch-ganzes-teil')], tT1,
        { bild: streifen(n), nachweis: [`${br(1, n)} von ${G} ${einheit} = ${e} ${einheit}`, WERT(`${e} ${einheit}`, false)] }); },
    () => { const { n, e, G } = stammF(), kn = kind(), [ding, tat] = wahl([['Eine Schnur', 'schneidet'], ['Ein Band', 'schneidet'], ['Ein Seil', 'schneidet']]);
      if (n === 2) return null;
      return zahl(Z(`${ding} ist ${G} m lang.`, `${kn} ${tat} ${br(1, n)} davon ab.`, 'Wie viele Meter bleiben übrig?'), G - e, fehlerliste(G - e, [[e, 'sach-schritt-vergessen'], [G - n, 'div-falsche-rechenart']]),
        h3('Rechne zuerst das Stück aus, das abgeschnitten wird. Ziehe es dann ab.', '1⁄2 von 8 m sind 4 m. Es bleiben 8 m − 4 m = 4 m.', 'Teile die Länge durch den Nenner. Ziehe das Ergebnis von der ganzen Länge ab.'),
        { einheit: 'm', bild: streifen(n), nachweis: [`${br(1, n)} von ${G} m = ${e} m`, `${G} m − ${e} m = ${G - e} m`] }); },
    () => { const n = zz(2, 4), [was, G] = wahl([['Eine Stunde', 60], ['Das Training', 60], ['Der Film', 120], ['Die Probe', 60]]), text = was === 'Eine Stunde' ? [`Eine Stunde hat ${G} min.`, `Wie viele Minuten sind ${br(1, n)} davon?`] : [`${was} dauert ${G} min.`, `Wie viele Minuten sind ${br(1, n)} davon?`];
      return zahl(Z(...text), G / n, fehlerliste(G / n, [[G - n, 'div-falsche-rechenart'], [n * 10, 'bruch-als-komma']]), tT1, { einheit: 'min', bild: streifen(n), nachweis: [`${br(1, n)} von ${G} min = ${G / n} min`] }); },
  ]);
  const tT1G = h3('Teile zuerst durch den Nenner. Nimm das Ergebnis dann mit dem Zähler mal.', '3⁄4 von 8 kg: 8 kg : 4 = 2 kg und 2 kg · 3 = 6 kg.', 'Rechne zuerst einen Teil aus. Wie viele Teile sind gemeint?');
  sechs(T1, 'G', [
    () => { const { n, z, e, G, x } = teilG(NENNER_G, [2, 3, 4, 5, 6]), [ding, einheit] = wahl([['Ein Sack Korn wiegt', 'kg'], ['Ein Fass Äpfel wiegt', 'kg'], ['Ein Tuch ist', 'm']]);
      return zahl(Z(`${ding} ${G} ${einheit}${einheit === 'm' ? ' lang' : ''}.`, `Wie viel sind ${br(z, n)} davon?`), x, fehlerliste(x, [[e, 'bruchteil-zaehler-vergessen'], [G - x, 'sach-frage-verfehlt']]), tT1G,
        { einheit, bild: streifen(n, z), nachweis: [`${br(z, n)} von ${G} ${einheit} = ${x} ${einheit}`] }); },
    () => { const { n, z, e, G, x } = teilG(NENNER_G, [2, 3, 4, 5, 6, 7]);
      return luecken(Z(`Berechne ${br(z, n)} von ${G} m in zwei Schritten.`, `Ein Teil: ${G} m : ${n} = {{a}} m`, `${z} Teile: ${br(z, n)} von ${G} m = {{b}} m`), { a: [e, fehlerliste(e, [[G - n, 'div-falsche-rechenart']])], b: [x, fehlerliste(x, [[e, 'bruchteil-zaehler-vergessen'], [e + z, 'sach-falsche-rechnung']])] }, tT1G,
        { bild: streifen(n, z), nachweis: [`${G} m : ${n} = ${e} m`, `${br(z, n)} von ${G} m = ${x} m`] }); },
    () => { const { n, z, e, G, x } = teilG([4, 5, 8, 10], [50, 100, 200]), kn = kind(), ziel = wahl(['zur Burg', 'zur Schule', 'zum Markt', 'zur Mühle']);
      return zahl(Z(`Der Weg ${ziel} ist ${G} m lang.`, `${kn} ist schon ${br(z, n)} des Weges gegangen.`, 'Wie viele Meter fehlen noch?'), G - x, fehlerliste(G - x, [[x, 'sach-schritt-vergessen'], [e, 'bruchteil-zaehler-vergessen'], [G - e, 'bruchteil-zaehler-vergessen']]),
        h3('Rechne zuerst aus, wie weit der Weg schon gegangen ist. Ziehe das vom ganzen Weg ab.', '3⁄4 von 800 m sind 600 m. Es fehlen noch 800 m − 600 m = 200 m.', 'Teile durch den Nenner und nimm mit dem Zähler mal. Ziehe das Ergebnis vom ganzen Weg ab.'),
        { einheit: 'm', bild: streifen(n, z), nachweis: [`${br(z, n)} von ${G} m = ${x} m`, `${G} m − ${x} m = ${G - x} m`] }); },
    () => { const n = wahl([4, 5, 6, 10]), z = zf(n, 2), x = (60 / n) * z;
      return zahl(Z('Eine Stunde hat 60 min.', `Wie viele Minuten sind ${br(z, n)} davon?`), x, fehlerliste(x, [[60 / n, 'bruchteil-zaehler-vergessen'], [z * 10 + n, 'bruch-als-komma'], [60 - x, 'sach-frage-verfehlt']]), tT1G, { einheit: 'min', nachweis: [`${br(z, n)} von 60 min = ${x} min`] }); },
    () => { const { n, z, e, G, x } = teilG(NENNER_G, [2, 3, 4, 5, 6, 8]), kn = kind();
      return zahl(Z(`${kn} hat ${G} € gespart.`, `${br(z, n)} davon gibt ${kn} für ein Geschenk aus.`, `Wie viel Euro hat ${kn} noch?`), G - x, fehlerliste(G - x, [[x, 'sach-schritt-vergessen'], [G - e, 'bruchteil-zaehler-vergessen'], [e, 'bruchteil-zaehler-vergessen']]),
        h3('Rechne zuerst aus, wie viel Geld ausgegeben wird. Ziehe es dann ab.', '3⁄4 von 8 € sind 6 €. Es bleiben 8 € − 6 € = 2 €.', 'Teile durch den Nenner und nimm mit dem Zähler mal. Ziehe das Ergebnis vom Ersparten ab.'),
        { einheit: '€', nachweis: [`${br(z, n)} von ${G} € = ${x} €`, `${G} € − ${x} € = ${G - x} €`] }); },
    () => { const { n, z, e, G, x } = teilG(NENNER_G, [2, 3, 4, 5, 6]), stimmt = wahl([true, false, false]), kn = kind(), einheit = wahl(['kg', 'm', '€']), gesagt = stimmt ? x : e, g = (w) => `${br(z, n)} von ${G} ${einheit} = ${w} ${einheit}`;
      const falsch2 = stimmt ? G - x || G : G - n;
      if (falsch2 === x || falsch2 === e || falsch2 <= 0) return null;
      return auswahl(Z(`${kn} rechnet: ${g(gesagt)}`, 'Stimmt das?'), richtigZuerst([opt('Stimmt.', stimmt, 'bruchteil-zaehler-vergessen'), opt(`Falsch. Es gilt ${g(stimmt ? e : x)}.`, !stimmt, 'bruchteil-zaehler-vergessen'), opt(`Falsch. Es gilt ${g(falsch2)}.`, false, 'div-falsche-rechenart')]),
        h3('Prüfe beide Schritte: teilen durch den Nenner, dann mal den Zähler.', '3⁄4 von 8 kg: 8 kg : 4 = 2 kg und 2 kg · 3 = 6 kg.', `Rechne ${G} : ${n}. Nimm das Ergebnis mal ${z}.`),
        { nachweis: [{ art: 'urteil', stimmt, behauptung: g(gesagt) }] }); },
  ]);
  // Umwandeln ab M: [große Einheit, kleine Einheit, Umrechnungszahl, erlaubte Nenner]
  const UM = [['km', 'm', 1000, [2, 4, 5, 8, 10]], ['kg', 'g', 1000, [2, 4, 5, 8, 10]], ['h', 'min', 60, [2, 3, 4, 5, 6, 10, 12]], ['m', 'cm', 100, [2, 4, 5, 10]], ['€', 'ct', 100, [2, 4, 5, 10]]];
  const tUm = (g, k, f) => h2(`Wandle zuerst um: 1 ${g} = ${f} ${k}. Dann kannst du teilen.`, 'Teile durch den Nenner und nimm das Ergebnis mit dem Zähler mal.');
  const NAME = { m: 'Meter', g: 'Gramm', min: 'Minuten', cm: 'Zentimeter', ct: 'Cent' };
  sechs(T1, 'M', [
    () => { const [g, k, f, ns] = wahl(UM.filter(([x]) => x === 'km' || x === 'kg' || x === 'm')), n = wahl(ns), z = zf(n), x = (f / n) * z;
      return zahl(`Wie viele ${NAME[k]} sind ${br(z, n)} ${g}?`, x, fehlerliste(x, [[f / n, 'bruchteil-zaehler-vergessen'], [(f / 10 / n) * z, 'umrechnungszahl'], [z * 100 + n * 10, 'bruch-als-komma']]), tUm(g, k, f), { einheit: k, nachweis: [`1 ${g} = ${f} ${k}`, `${br(z, n)} von ${f} ${k} = ${x} ${k}`] }); },
    () => { const n = wahl([3, 4, 5, 6, 10, 12]), z = zf(n, 2), x = (60 / n) * z;
      return zahl(`Wie viele Minuten sind ${br(z, n)} h?`, x, fehlerliste(x, [[60 / n, 'bruchteil-zaehler-vergessen'], [(100 / n) * z, 'umrechnungszahl'], [z * 10 + n, 'bruch-als-komma']]), tUm('h', 'min', 60), { einheit: 'min', nachweis: ['1 h = 60 min', `${br(z, n)} von 60 min = ${x} min`] }); },
    () => { const [g, k, f, ns] = wahl(UM), n = wahl(ns), z = zf(n), ganze = zz(1, 2), x = ganze * f + (f / n) * z;
      return zahl(`Wie viele ${NAME[k]} sind ${br(z, n, ganze)} ${g}?`, x, fehlerliste(x, [[(f / n) * z, 'bruch-ganzes-teil'], [ganze * f + f / n, 'bruchteil-zaehler-vergessen']]),
        h2(`Eine gemischte Zahl besteht aus Ganzen und einem Bruchteil. Wandle beide einzeln um: 1 ${g} = ${f} ${k}.`, `Rechne zuerst ${br(z, n)} von ${f} ${k}. Zähle dann ${ganze === 1 ? `${f} ${k} für das Ganze` : `${ganze} · ${f} ${k} für die Ganzen`} dazu.`),
        { einheit: k, nachweis: [`1 ${g} = ${f} ${k}`, `${br(z, n, ganze)} ${g} = ${x} ${k}`] }); },
    () => { const [g, k, f, ns] = wahl(UM), paare = [];
      for (const n of mische(ns)) { const z = zf(n), x = (f / n) * z; if (paare.length < 4 && !paare.some((p) => p[1] === `${x} ${k}`)) paare.push([`${br(z, n)} ${g}`, `${x} ${k}`]); }
      if (paare.length < 4) return null;
      return zuordnen(Z('Welche Größen sind gleich?', 'Ordne zu.'), paare, tUm(g, k, f), { nachweis: [{ art: 'paare' }] }); },
    () => { const [was, pause] = wahl([['Ein Film', 'gibt es eine Pause'], ['Ein Ritterturnier', 'gibt es eine Pause'], ['Eine Wanderung', 'macht die Gruppe Rast']]), std = zz(2, 3), n = wahl([3, 4, 5, 6]), z = zf(n), G = std * 60, x = (G / n) * z;
      return zahl(`${was} dauert ${std} h. Nach ${br(z, n)} der Zeit ${pause}. Nach wie vielen Minuten ist das?`, x, fehlerliste(x, [[G / n, 'bruchteil-zaehler-vergessen'], [(60 / n) * z, 'sach-schritt-vergessen'], [G - x, 'sach-frage-verfehlt']]),
        h2('Wandle die Dauer zuerst in Minuten um.', `${std} h sind ${G} min. Teile durch den Nenner und nimm mit dem Zähler mal.`), { einheit: 'min', nachweis: [`${std} h = ${G} min`, `${br(z, n)} von ${G} min = ${x} min`] }); },
    () => { const [g, k, f, ns] = wahl(UM.filter(([x]) => x !== '€')), [n1, n2] = mische(ns).slice(0, 2), z1 = zf(n1), z2 = zf(n2), a = (f / n1) * z1, c = (f / n2) * z2;
      const d1 = a + wahl([-1, 1]) * (f === 60 ? 2 : f / 20), d2 = c + wahl([-1, 1]) * (f === 60 ? 3 : f / 25), werte = [a, c, d1, d2];
      if (new Set(werte).size !== 4 || werte.some((w) => w <= 0)) return null;
      const gross = wahl([true, false]), ziel = gross ? Math.max(...werte) : Math.min(...werte);
      return auswahl(`Welche Angabe ist am ${gross ? 'größten' : 'kleinsten'}?`, [opt(`${br(z1, n1)} ${g}`, a === ziel), opt(`${br(z2, n2)} ${g}`, c === ziel), opt(`${d1} ${k}`, d1 === ziel), opt(`${d2} ${k}`, d2 === ziel)],
        h2(`Wandle alle Angaben in ${NAME[k]} um, dann kannst du vergleichen.`, `1 ${g} = ${f} ${k}. Rechne die beiden Bruchteile davon aus.`), { nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
  ]);
  sechs(T1, 'E', [
    () => { const [g, k, f, ns] = wahl(UM.filter(([x]) => x === 'km' || x === 'kg')), n = wahl(ns.filter((x) => x > 2)), z = zf(n, 2), mal = zz(2, 4), G = mal * f, x = (G / n) * z;
      return zahl(`Wie viele ${NAME[k]} sind ${br(z, n)} von ${mal} ${g}?`, x, fehlerliste(x, [[(f / n) * z, 'sach-schritt-vergessen'], [G / n, 'bruchteil-zaehler-vergessen']]), h1(`Wandle ${mal} ${g} zuerst in ${NAME[k]} um. Berechne dann den Bruchteil.`),
        { einheit: k, nachweis: [`${mal} ${g} = ${G} ${k}`, `${br(z, n)} von ${G} ${k} = ${x} ${k}`] }); },
    () => { const einheit = wahl(['€', 'kg', 'm']), a = teilG([3, 4, 5, 6, 8], [6, 8, 10, 12, 15]), c = teilG([3, 4, 5, 6, 8], [6, 8, 10, 12, 15]);
      if (a.n === c.n || a.G === c.G) return null;
      const l = `${br(a.z, a.n)} von ${a.G} ${einheit}`, r = `${br(c.z, c.n)} von ${c.G} ${einheit}`;
      return auswahl(Z('Welches Zeichen passt?', `${l} ▢ ${r}`), richtigZuerst([opt('<', a.x < c.x, 'bruch-nenner-groesse'), opt('>', a.x > c.x, 'bruch-nenner-groesse'), opt('=', a.x === c.x, 'bruch-nenner-groesse')]),
        h1('Rechne beide Bruchteile aus. Vergleiche erst dann.'), { nachweis: [VGL(l, r)] }); },
    () => { const [ding, tat] = wahl([['Ein Seil', 'werden abgeschnitten'], ['Ein Brett', 'werden abgesägt'], ['Eine Stoffbahn', 'werden verkauft']]), m = zz(2, 4), n = wahl([4, 5, 10]), z = zf(n), G = m * 100, x = (G / n) * z;
      return zahl(`${ding} ist ${m} m lang. ${br(z, n)} davon ${z === 1 ? tat.replace('werden', 'wird') : tat}. Wie viele Zentimeter bleiben übrig?`, G - x, fehlerliste(G - x, [[x, 'sach-schritt-vergessen'], [G - G / n, 'bruchteil-zaehler-vergessen'], [(100 / n) * (n - z), 'sach-schritt-vergessen']]),
        h1('Wandle die Länge in Zentimeter um. Berechne den Bruchteil und ziehe ihn von der ganzen Länge ab.'), { einheit: 'cm', nachweis: [`${m} m = ${G} cm`, `${br(z, n)} von ${G} cm = ${x} cm`, `${G} cm − ${x} cm = ${G - x} cm`] }); },
    () => { const [z, n] = wahl([[3, 5], [2, 5], [3, 4], [1, 4], [2, 3], [5, 6], [1, 6]]), x = (60 / n) * z, stimmt = wahl([true, false, false]), kn = kind(), falle = z * 10 + n, gesagt = stimmt ? x : falle, g = (w) => `${br(z, n)} h = ${w} min`;
      if (falle === x) return null;
      return auswahl(`${kn} sagt: „${br(z, n)} h sind ${gesagt} min.“ Stimmt das?`, richtigZuerst([opt('Stimmt.', stimmt, 'bruch-als-komma'), opt(`Falsch. Es gilt ${g(stimmt ? falle : x)}.`, !stimmt, 'bruch-als-komma'), opt(`Falsch. Es gilt ${g(60 / n)}.`, false, 'bruchteil-zaehler-vergessen')].filter((o, i, l) => l.findIndex((p) => p.text === o.text) === i)),
        h1('Eine Stunde hat 60 min. Berechne den Bruchteil von 60 min.'), { nachweis: [{ art: 'urteil', stimmt, behauptung: g(gesagt) }] }); },
    () => { const [g, k, f] = wahl([['kg', 'g', 1000], ['km', 'm', 1000], ['m', 'cm', 100]]), basis = mische([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [3, 10], [7, 10], [9, 10]]).slice(0, 3), werte = basis.map(([z, n]) => (f / n) * z);
      const extra = [werte[0] + f / 20, werte[1] - f / 20].filter((w) => w > 0), alle = [...basis.map(([z, n], i) => [werte[i], `${br(z, n)} ${g}`]), ...extra.map((w) => [w, `${w} ${k}`])];
      if (new Set(alle.map(([w]) => w)).size !== alle.length || alle.length !== 5) return null;
      return ordnen(Z('Ordne die Größen.', 'Beginne mit der kleinsten.'), alle.sort((a, c) => a[0] - c[0]).map(([, t]) => t), h1(`Wandle alle Bruchteile in ${NAME[k]} um. Dann kannst du die Zahlen vergleichen.`), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt' }); },
    () => { const [n1, z1] = wahl([[3, 2], [4, 3], [5, 3], [5, 4], [2, 1]]), [n2, z2] = wahl([[3, 1], [4, 3], [2, 1], [3, 2], [4, 1]]), e = wahl([10, 20, 30, 50]), G = n1 * n2 * e, a = (G / n1) * z1, c = (a / n2) * z2;
      const [was, erst, dann, frage] = wahl([['Die Burgmauer', 'davon sind fertig gebaut', 'Vom fertigen Stück', 'schon verputzt. Wie viele Meter sind verputzt?'], ['Ein Feldweg', 'davon sind schon gepflastert', 'Vom gepflasterten Stück', 'mit Laternen beleuchtet. Wie viele Meter sind beleuchtet?']]);
      return zahl(`${was} ist ${G} m lang. ${br(z1, n1)} ${erst}. ${dann} ${z2 === 1 ? 'ist' : 'sind'} ${br(z2, n2)} ${frage}`, c, fehlerliste(c, [[a, 'sach-schritt-vergessen'], [(G / n2) * z2, 'sach-schritt-vergessen'], [a - c, 'sach-frage-verfehlt']]),
        h1('Rechne in zwei Schritten: zuerst den ersten Bruchteil von der ganzen Länge, dann den zweiten Bruchteil von diesem Ergebnis.'), { einheit: 'm', nachweis: [`${br(z1, n1)} von ${G} m = ${a} m`, `${br(z2, n2)} von ${a} m = ${c} m`] }); },
  ]);

  // ================= T2: Ganzes oder Anteil bestimmen, Sachaufgaben =================
  const tT2 = h3('Der Nenner sagt: In so viele gleich große Gruppen wird geteilt.', '1⁄2 von 8 Kindern: 8 : 2 = 4. Es sind 4 Kinder.', 'Teile die Anzahl durch den Nenner.');
  sechs(T2, 'F', [
    () => { const { n, G } = stammF(), e = G / n, [wer, tut, einheit] = wahl([['Kinder', 'singt im Chor', 'Kinder'], ['Kinder', 'kommt mit dem Bus', 'Kinder'], ['Ritter', 'reitet zum Turnier', 'Ritter']]);
      if (G < 12 || G > 30) return null;
      return zahl(Z(`${wer === 'Ritter' ? 'Auf der Burg leben' : 'In der Klasse sind'} ${G} ${wer}.`, `${br(1, n)} der ${wer} ${tut}.`, `Wie viele ${wer} sind das?`), e, fehlerliste(e, [[G - n, 'div-falsche-rechenart'], [G - e, 'sach-frage-verfehlt']]), tT2, { einheit, bild: streifen(n), nachweis: [`${br(1, n)} von ${G} = ${e}`] }); },
    () => { const { n, e, G } = stammF(), kn = kind(), ding = wahl(['Ein Buch', 'Ein Spiel', 'Ein Ball']);
      return zahl(Z(`${ding} kostet ${G} €.`, `${kn} hat schon ${br(1, n)} davon gespart.`, 'Wie viel Euro sind das?'), e, fehlerliste(e, [[G - n, 'div-falsche-rechenart'], [G - e, 'sach-frage-verfehlt']]), tT2, { einheit: '€', bild: streifen(n), nachweis: [`${br(1, n)} von ${G} € = ${e} €`] }); },
    () => { const n = zz(2, 4), e = zz(2, 4), G = n * e, [ding, farbe, farbige] = wahl([['Äpfel', 'rot', 'rote'], ['Birnen', 'gelb', 'gelbe'], ['Bälle', 'blau', 'blaue']]);
      return luecken(Z(`Im Korb liegen ${G} ${ding}.`, `${br(1, n)} davon ist ${farbe}.`, `Rechnung: ${G} : ${n} = {{a}}`, `Es sind {{b}} ${farbige} ${ding}.`), { a: [e, fehlerliste(e, [[G - n, 'div-falsche-rechenart']])], b: [e, fehlerliste(e, [[G - e, 'sach-frage-verfehlt']])] }, tT2,
        { bild: bild(fig('menge', G, [])), nachweis: [`${br(1, n)} von ${G} = ${e}`] }); },
    () => { const { n, e, G } = stammF(), [wer, tut] = wahl([['Ritter stehen am Tor', 'trägt einen Schild'], ['Kinder spielen im Hof', 'spielt Fangen'], ['Pferde stehen im Stall', 'ist weiß']]);
      if (G - n === e) return null;
      return auswahl(Z(`${G} ${wer}.`, `${br(1, n)} von ihnen ${tut}.`, 'Welche Rechnung passt?'), [opt(`${G} : ${n}`, true), opt(`${G} − ${n}`, false, 'div-falsche-rechenart'), opt(`${G} · ${n}`, false, 'bruch-ganzes-teil')], tT2,
        { bild: streifen(n), nachweis: [`${br(1, n)} von ${G} = ${e}`, WERT(String(e), false)] }); },
    () => { const n = zz(2, 4), e = zz(2, 9), einheit = wahl(['cm', 'm']);
      return zahl(Z(`${br(1, n)} des Streifens ist gefärbt.`, `Dieses Teil ist ${e} ${einheit} lang.`, 'Wie lang ist der ganze Streifen?'), n * e, fehlerliste(n * e, [[e, 'bruch-ganzes-teil'], [e + n, 'sach-falsche-rechnung']]),
        h3('Der ganze Streifen besteht aus lauter gleich langen Teilen. Zähle sie im Bild.', 'Ein Teil ist 3 cm lang. 2 Teile sind 3 cm · 2 = 6 cm lang.', 'Nimm die Länge eines Teils mal den Nenner.'),
        { einheit, bild: streifen(n), nachweis: [`${e} ${einheit} · ${n} = ${n * e} ${einheit}`] }); },
    () => { const n = zz(2, 4), [was, tut] = wahl([['Das Training', 'wird gelaufen'], ['Die Musikstunde', 'wird gesungen'], ['Das Fest', 'wird getanzt']]);
      return zahl(Z(`${was} dauert 60 min.`, `${br(1, n)} der Zeit ${tut}.`, 'Wie viele Minuten sind das?'), 60 / n, fehlerliste(60 / n, [[60 - n, 'div-falsche-rechenart'], [60 - 60 / n, 'sach-frage-verfehlt']]), tT2, { einheit: 'min', bild: streifen(n), nachweis: [`${br(1, n)} von 60 min = ${60 / n} min`] }); },
  ]);
  const tT2G = h3('Teile zuerst durch den Nenner. Nimm das Ergebnis dann mit dem Zähler mal.', '3⁄4 von 8 Kindern: 8 : 4 = 2 und 2 · 3 = 6.', 'Rechne zuerst einen Teil aus. Wie viele Teile sind gemeint?');
  sechs(T2, 'G', [
    () => { const { n, z, e, G, x } = teilG([3, 4, 5, 6, 8], [3, 4, 5, 6, 7]), tut = wahl(['kommen zu Fuß', 'spielen ein Instrument', 'haben ein Haustier']);
      if (G < 15 || G > 30) return null;
      return zahl(Z(`In der Klasse sind ${G} Kinder.`, `${br(z, n)} der Kinder ${tut}.`, 'Wie viele Kinder sind das?'), x, fehlerliste(x, [[e, 'bruchteil-zaehler-vergessen'], [G - x, 'sach-frage-verfehlt']]), tT2G, { einheit: 'Kinder', bild: streifen(n, z), nachweis: [`${br(z, n)} von ${G} = ${x}`] }); },
    () => { const { n, z, e, G, x } = teilG([4, 5, 6, 8, 10], [3, 4, 5, 6]), [ort, tiere] = wahl([['Im Stall der Burg stehen', 'Pferde'], ['Auf der Weide stehen', 'Schafe'], ['Auf dem Hof leben', 'Hühner']]);
      return sach(Z(`${ort} ${G} Tiere.`, `${br(z, n)} davon sind ${tiere}.`), [teil(`Wie viele Tiere sind ${br(1, n)} davon?`, e, 'Tiere', fehlerliste(e, [[G - n, 'div-falsche-rechenart']])), teil(`Wie viele ${tiere} sind es?`, x, tiere, fehlerliste(x, [[e, 'bruchteil-zaehler-vergessen'], [G - x, 'sach-frage-verfehlt']]))], tT2G,
        { bild: streifen(n, z), nachweis: [`${br(1, n)} von ${G} = ${e}`, `${br(z, n)} von ${G} = ${x}`] }); },
    () => { const { n, z, e, G, x } = teilG([3, 4, 5, 6, 8, 10], [10, 12, 15, 20, 25, 30]), kn = kind();
      return zahl(Z(`Ein Buch hat ${G} Seiten.`, `${kn} hat schon ${br(z, n)} davon gelesen.`, 'Wie viele Seiten fehlen noch?'), G - x, fehlerliste(G - x, [[x, 'sach-schritt-vergessen'], [e, 'bruchteil-zaehler-vergessen'], [G - e, 'bruchteil-zaehler-vergessen']]),
        h3('Rechne zuerst die gelesenen Seiten aus. Ziehe sie dann von allen Seiten ab.', '3⁄4 von 8 Seiten sind 6 Seiten. Es fehlen noch 8 − 6 = 2 Seiten.', 'Teile durch den Nenner und nimm mit dem Zähler mal. Ziehe das Ergebnis ab.'),
        { einheit: 'Seiten', bild: streifen(n, z), nachweis: [`${br(z, n)} von ${G} = ${x}`, `${G} − ${x} = ${G - x}`] }); },
    () => { const { n, z, G, x } = teilG([3, 4, 5, 6, 8], [3, 4, 5, 6]), [wer, tut] = wahl([['Kinder', 'fahren mit dem Rad'], ['Ritter', 'tragen ein Schwert'], ['Händler', 'verkaufen Obst']]);
      return auswahl(Z(`${br(z, n)} von ${G} ${wer}n ${tut}.`, 'Welche Rechnung passt?'), [opt(`${G} : ${n} · ${z}`, true), opt(`${G} − ${n} · ${z}`, false, 'div-falsche-rechenart'), opt(`${G} : ${n}`, false, 'bruchteil-zaehler-vergessen')], tT2G,
        { nachweis: [`${br(z, n)} von ${G} = ${x}`, WERT(String(x), false)] }); },
    () => { const n = wahl([3, 4, 5, 6, 8, 10]), e = wahl([20, 30, 40, 50, 60]), [was, ganz] = wahl([['der Strecke', 'die ganze Strecke'], ['des Weges', 'der ganze Weg'], ['der Mauer', 'die ganze Mauer']]), einheit = 'm';
      return zahl(Z(`${br(1, n)} ${was} ist ${e} ${einheit} lang.`, `Wie lang ist ${ganz}?`), n * e, fehlerliste(n * e, [[e, 'bruch-ganzes-teil'], [e + n, 'sach-falsche-rechnung']]),
        h3('Das Ganze besteht aus lauter gleich langen Teilen. Wie viele sind es?', 'Ein Teil ist 3 m lang. 5 Teile sind 3 m · 5 = 15 m lang.', 'Nimm die Länge eines Teils mal den Nenner.'),
        { einheit, bild: streifen(n), nachweis: [`${e} ${einheit} · ${n} = ${n * e} ${einheit}`] }); },
    () => { const n1 = wahl([4, 8]), n2 = wahl([2, 4, 5].filter((x) => x !== n1)), G = 40, z1 = zf(n1, 2), z2 = zf(n2), a = (G / n1) * z1, c = (G / n2) * z2, [k1, k2] = zweiKinder();
      if (a === c) return null;
      const [mehr, wenig, km, kw] = a > c ? [a, c, k1, k2] : [c, a, k2, k1];
      return zahl(Z(`${k1} und ${k2} haben je ${G} €.`, `${k1} gibt ${br(z1, n1)} davon aus.`, `${k2} gibt ${br(z2, n2)} davon aus.`, `Wie viel Euro gibt ${km} mehr aus als ${kw}?`), mehr - wenig, fehlerliste(mehr - wenig, [[mehr, 'sach-schritt-vergessen'], [wenig, 'sach-schritt-vergessen'], [mehr + wenig, 'sub-addiert']]),
        h3('Rechne für jedes Kind einzeln aus, wie viel Geld es ausgibt. Vergleiche dann.', '3⁄4 von 8 € sind 6 €. 1⁄2 von 8 € sind 4 €. Der Unterschied ist 2 €.', 'Rechne beide Bruchteile aus. Ziehe den kleineren Betrag vom größeren ab.'),
        { einheit: '€', nachweis: [`${br(z1, n1)} von ${G} € = ${a} €`, `${br(z2, n2)} von ${G} € = ${c} €`, `${mehr} € − ${wenig} € = ${mehr - wenig} €`] }); },
  ]);
  const tGanz = h2('Der Bruchteil besteht aus mehreren gleich großen Teilen. Rechne zuerst einen Teil aus: Teile durch den Zähler.', 'Das Ganze hat so viele Teile, wie der Nenner sagt. Nimm einen Teil mal den Nenner.');
  sechs(T2, 'M', [
    () => { const n = wahl([3, 4, 5, 6, 8, 10]), z = zf(n, 2), e = wahl([50, 100, 200, 300]), [was, ganz] = wahl([['einer Strecke', 'die ganze Strecke'], ['eines Weges', 'der ganze Weg'], ['einer Mauer', 'die ganze Mauer']]);
      return zahl(`${br(z, n)} ${was} sind ${z * e} m lang. Wie lang ist ${ganz}?`, n * e, fehlerliste(n * e, [[e, 'sach-schritt-vergessen'], [(z * e * z) / n, 'bruch-ganzes-teil'], [z * e * n, 'bruchteil-zaehler-vergessen']]), tGanz, { einheit: 'm', nachweis: [`${z * e} m : ${z} = ${e} m`, `${e} m · ${n} = ${n * e} m`] }); },
    () => { const [ding, tat] = wahl([['Ein Käse', 'werden verkauft'], ['Ein Sack Mehl', 'werden verbacken'], ['Ein Korb Äpfel', 'werden verschenkt']]), kg = zz(2, 4), n = wahl([4, 5, 8, 10]), z = zf(n, 2), G = kg * 1000, x = (G / n) * z;
      return zahl(`${ding} wiegt ${kg} kg. ${br(z, n)} davon ${tat}. Wie viel Gramm bleiben übrig?`, G - x, fehlerliste(G - x, [[x, 'sach-schritt-vergessen'], [G - G / n, 'bruchteil-zaehler-vergessen'], [(G - x) / 10, 'umrechnungszahl']]),
        h2('Wandle zuerst in Gramm um: 1 kg = 1000 g. Berechne dann den Bruchteil.', `${kg} kg sind ${G} g. Rechne ${br(z, n)} davon aus und ziehe das Ergebnis von ${G} g ab.`), { einheit: 'g', nachweis: [`${kg} kg = ${G} g`, `${br(z, n)} von ${G} g = ${x} g`, `${G} g − ${x} g = ${G - x} g`] }); },
    () => { const n = wahl([3, 4, 5, 8, 10]), z = zf(n, 2), e = wahl([5, 10, 15, 20, 25]), kn = kind(), ding = wahl(['das Fahrrad', 'das Zelt', 'der Roller']);
      return zahl(`${kn} hat schon ${br(z, n)} des Preises gespart, das sind ${z * e} €. Wie viel kostet ${ding}?`, n * e, fehlerliste(n * e, [[e, 'sach-schritt-vergessen'], [(n - z) * e, 'sach-frage-verfehlt'], [z * e * n, 'bruchteil-zaehler-vergessen']]), tGanz, { einheit: '€', nachweis: [`${z * e} € : ${z} = ${e} €`, `${e} € · ${n} = ${n * e} €`] }); },
    () => { const [n1, n2] = wahl([[4, 5], [3, 4], [4, 6], [5, 10], [3, 5], [2, 5]]), e = zz(1, 3), G = n1 * n2 * e, z2 = zf(n2, 2), a = G / n1, c = (G / n2) * z2;
      if (a + c >= G || G > 100) return null;
      return sach(`Auf dem Hof leben ${G} Tiere. ${br(1, n1)} davon sind Kühe, ${br(z2, n2)} sind Schafe.`, [teil('Wie viele Kühe sind es?', a, 'Kühe', fehlerliste(a, [[G - n1, 'div-falsche-rechenart']])), teil('Wie viele Schafe sind es?', c, 'Schafe', fehlerliste(c, [[G / n2, 'bruchteil-zaehler-vergessen']]))],
        h2('Rechne jeden Bruchteil einzeln von allen Tieren aus.', 'Teile durch den Nenner und nimm das Ergebnis mit dem Zähler mal.'), { nachweis: [`${br(1, n1)} von ${G} = ${a}`, `${br(z2, n2)} von ${G} = ${c}`] }); },
    () => { const [n1, n2] = wahl([[4, 3], [3, 6], [4, 6], [2, 3], [2, 5], [4, 5]]), e = zz(1, 4), G = n1 * n2 * e, a = G / n1, c = G / n2, [ort, t1, t2, t3] = wahl([['Auf dem Hof leben', 'Kühe', 'Schafe', 'Hühner'], ['Im Burggarten wachsen', 'Apfelbäume', 'Birnbäume', 'Kirschbäume']]);
      if (G > 100) return null;
      return zahl(`${ort} ${G} ${t1 === 'Kühe' ? 'Tiere' : 'Bäume'}. ${br(1, n1)} davon sind ${t1}, ${br(1, n2)} sind ${t2}. Der Rest sind ${t3}. Wie viele ${t3} sind es?`, G - a - c, fehlerliste(G - a - c, [[a + c, 'sach-frage-verfehlt'], [G - a, 'sach-schritt-vergessen'], [G - c, 'sach-schritt-vergessen']]),
        h2('Rechne zuerst die beiden Bruchteile aus.', `Es sind ${a} ${t1} und ${c} ${t2}. Ziehe beide Zahlen von ${G} ab.`), { einheit: t3, nachweis: [`${br(1, n1)} von ${G} = ${a}`, `${br(1, n2)} von ${G} = ${c}`, `${G} − ${a} − ${c} = ${G - a - c}`] }); },
    () => { const n = wahl([3, 4, 5, 6, 8]), z = zf(n, 2), e = wahl([10, 15, 20, 25, 30]), kn = kind();
      return zahl(`${kn} hat schon ${br(z, n)} eines Buches gelesen, das sind ${z * e} Seiten. Wie viele Seiten muss ${kn} noch lesen?`, (n - z) * e, fehlerliste((n - z) * e, [[n * e, 'sach-frage-verfehlt'], [e, 'sach-schritt-vergessen'], [z * e, 'bruch-ganzes-teil']]),
        h2('Rechne zuerst rückwärts zum Ganzen: Wie viele Seiten hat ein Teil, wie viele das ganze Buch?', `Ein Teil sind ${z * e} : ${z} = ${e} Seiten. Das Buch hat ${n} solche Teile. Ziehe am Ende die gelesenen Seiten ab.`),
        { einheit: 'Seiten', nachweis: [`${z * e} : ${z} = ${e}`, `${e} · ${n} = ${n * e}`, `${n * e} − ${z * e} = ${(n - z) * e}`] }); },
  ]);
  sechs(T2, 'E', [
    () => { const [min, z, n] = wahl([[15, 1, 4], [10, 1, 6], [12, 1, 5], [20, 1, 3], [40, 2, 3], [45, 3, 4], [50, 5, 6], [36, 3, 5], [5, 1, 12], [24, 2, 5]]);
      return bruch(`Welcher Bruchteil einer Stunde sind ${min} min?`, br(z, n), [[br(min, 100), 'umrechnungszahl'], [br(n, z), 'bruch-vertauscht']], h1('Eine Stunde hat 60 min. Wie oft passt die Zeit in eine Stunde, oder in wie viele gleich große Teile kannst du die Stunde teilen?'),
        { nachweis: ['1 h = 60 min', `${min} min : 60 min = ${br(z, n)}`] }); },
    () => { const G = wahl([12, 15, 16, 18, 20]), x = zz(3, G - 3), [wer, verb, rest] = wahl([['Kindern', 'kommen', 'mit dem Bus'], ['Rittern', 'haben', 'ein Pferd'], ['Marktständen', 'verkaufen', 'Obst'], ['Kindern', 'können', 'schwimmen']]);
      return bruch(`Von ${G} ${wer} ${verb} ${x} ${rest}. Welcher Bruchteil ist das?`, br(x, G), [[br(x, G - x), 'bruch-teil-zu-rest'], [br(G, x), 'bruch-vertauscht'], [br(G - x, G), 'sach-frage-verfehlt']],
        h1('Das Ganze sind alle zusammen: Diese Zahl ist der Nenner. Der Zähler ist die Zahl derer, um die es geht.'), { nachweis: [`${x} : ${G} = ${br(x, G)}`] }); },
    () => { const n = wahl([5, 8, 6, 10, 12]), z = wahl(vorn(n - 2, 2).filter((x) => n % x !== 0 || x === 1)), e = wahl([100, 200, 250, 500]), [was, ganz, einheit] = wahl([['des Weges', 'der ganze Weg', 'm'], ['der Ladung', 'die ganze Ladung', 'kg'], ['der Strecke', 'die ganze Strecke', 'm']]);
      return zahl(`${br(z, n)} ${was} sind ${z * e} ${einheit}. Wie ${einheit === 'kg' ? 'schwer' : 'lang'} ist ${ganz}?`, n * e, fehlerliste(n * e, [[e, 'sach-schritt-vergessen'], [(n - z) * e, 'sach-frage-verfehlt'], [z * e * n, 'bruchteil-zaehler-vergessen']]),
        h1('Berechne zuerst einen einzelnen Teil: Teile durch den Zähler. Das Ganze hat so viele Teile, wie der Nenner sagt.'), { einheit, nachweis: [`${z * e} ${einheit} : ${z} = ${e} ${einheit}`, `${e} ${einheit} · ${n} = ${n * e} ${einheit}`] }); },
    () => { const [ding, G, g, teilT, k, f, n, tat] = wahl([['Ein Brett', 2, 'm', 50, 'cm', 100, 4, 'sägt'], ['Ein Brett', 2, 'm', 40, 'cm', 100, 5, 'sägt'], ['Ein Brot', 3, 'kg', 500, 'g', 1000, 6, 'schneidet'], ['Ein Seil', 4, 'm', 50, 'cm', 100, 8, 'schneidet'], ['Ein Käse', 2, 'kg', 250, 'g', 1000, 8, 'schneidet'], ['Ein Band', 3, 'm', 25, 'cm', 100, 12, 'schneidet']]), kn = kind();
      return bruch(`${ding} ${g === 'kg' ? 'wiegt' : 'ist'} ${G} ${g}${g === 'kg' ? '' : ' lang'}. ${kn} ${tat} ${teilT} ${k} ab. Welcher Bruchteil ist das?`, br(1, n), [[br(teilT, f), 'sach-schritt-vergessen']],
        h1(`Wandle zuerst in dieselbe Einheit um. Überlege dann: Wie oft passen ${teilT} ${k} in das Ganze?`), { nachweis: [`${G} ${g} = ${G * f} ${k}`, `${teilT} ${k} : ${G * f} ${k} = ${br(1, n)}`] }); },
    () => { const [G, n1, n2] = wahl([[12, 3, 2], [12, 4, 2], [12, 3, 4], [24, 4, 6], [12, 6, 2], [18, 3, 6], [24, 3, 4], [20, 4, 2], [18, 3, 2]]), a = G / n1, c = G / n2;
      if (!Number.isInteger(a) || !Number.isInteger(c) || G - a - c <= 0) return null;
      return zahl(`Eine Wanderung ist ${G} km lang. Vor der Rast schafft die Gruppe ${br(1, n1)} der Strecke, nach der Rast noch einmal ${br(1, n2)} der Strecke. Wie viele Kilometer fehlen dann noch?`, G - a - c, fehlerliste(G - a - c, [[a + c, 'sach-frage-verfehlt'], [G - a, 'sach-schritt-vergessen'], [G - c, 'sach-schritt-vergessen']]),
        h1('Beide Bruchteile beziehen sich auf die ganze Strecke. Rechne beide aus und ziehe sie von der ganzen Strecke ab.'), { einheit: 'km', nachweis: [`${br(1, n1)} von ${G} km = ${a} km`, `${br(1, n2)} von ${G} km = ${c} km`, `${G} km − ${a} km − ${c} km = ${G - a - c} km`] }); },
    () => { const n = wahl([3, 4, 5, 8, 10]), z = zf(n, 1, n - 2), e = wahl([2, 3, 4, 5, 6]), rest = (n - z) * e, kn = kind();
      return zahl(`${kn} gibt ${br(z, n)} des Taschengelds aus. Danach sind noch ${rest} € übrig. Wie viel Taschengeld hatte ${kn} am Anfang?`, n * e, fehlerliste(n * e, [[z * e, 'sach-frage-verfehlt'], [e, 'sach-schritt-vergessen'], [(rest / z) * n, 'bruch-ganzes-teil']]),
        h1('Welcher Bruchteil des Taschengelds ist noch übrig? Von diesem Bruchteil kennst du den Betrag.'), { einheit: '€', nachweis: [`1 − ${br(z, n)} = ${br(n - z, n)}`, `${n} − ${z} = ${n - z}`, `${rest} € : ${n - z} = ${e} €`, `${e} € · ${n} = ${n * e} €`] }); },
  ]);
}
