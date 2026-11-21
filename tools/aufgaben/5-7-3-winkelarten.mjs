// Aufgaben zu 5.7.3 „Winkelarten“ (Lernziele A1 und A2) nach ADR 0034.
// A1: spitz, recht und stumpf ab F, gestreckt und Vollwinkel ab G, überstumpf ab M. Einen Nullwinkel gibt es nicht. E übt die Grenzfälle und die Uhrzeiger.
// A2: Schätzen. F wählt unter Knöpfen, G trifft auf 20° genau, M und E auf 10° genau, E mit Stützgrößen 45° und 90°.
// Nach jeder Schätzung zeigt das Dashboard die genaue Größe.
import { sechs, zahl, auswahl, opt, B, N, U, HILFSZAHL, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, W, bildAus, reihe, GRIECH, richtungFuer, art, ARTNAME } from './5-7-winkel.mjs';

const FV_ART = (richtig, falsch) => (richtig === 'recht' ? 'rechter-winkel-lage' : ['gestreckt', 'voll'].includes(richtig) || ['gestreckt', 'voll'].includes(falsch) ? 'gestreckt-kein-winkel' : richtig === 'überstumpf' ? 'ueberstumpf-klein' : 'winkelart-grenze');
const optArten = (g, arten) => arten.map((x) => opt(ARTNAME[x], x === art(g), x === art(g) ? undefined : FV_ART(art(g), x)));
// Größen je Winkelart (in ganzen Grad; auf F und G in Zehner- oder Fünferschritten).
const GROESSE = {
  spitz: (n) => (n === 'F' ? 10 * zz(2, 7) : n === 'G' ? 5 * zz(4, 16) : zz(15, 85)),
  recht: () => 90,
  stumpf: (n) => (n === 'F' ? 10 * zz(11, 16) : n === 'G' ? 5 * zz(20, 33) : zz(95, 170)),
  gestreckt: () => 180,
  'überstumpf': (n) => (n === 'G' ? 5 * zz(40, 68) : zz(200, 340)),
  voll: () => 360,
};
const einBild = (g, niveau, o = {}) => bildAus([[W(g, richtungFuer(niveau, g), { l1: 130, l2: 125, n: 'α', ...o })]]);
function artFrage(text, sorte, niveau, arten, hilfen) {
  const g = GROESSE[sorte](niveau);
  return auswahl(text, optArten(g, arten), hilfen, { bild: einBild(g, niveau), nachweis: [{ art: 'groesse', winkel: 'α', wert: g }] });
}
const textArt = (text, g, arten, hilfen, vorher = []) => auswahl(text(g), optArten(g, arten), hilfen, { nachweis: [...vorher, { art: 'groesse', wert: g }] });
function artWahl(text, sorten, was, niveau, hilfen, { mehrfach = false } = {}) {
  const groessen = suche(() => sorten.map((s) => GROESSE[s](niveau)), (l) => new Set(l).size === l.length || l.every((x) => x === 90 || l.filter((y) => y === x).length === 1));
  const winkel = groessen.map((g) => W(g, richtungFuer(niveau, g), { l1: zz(100, 120), l2: zz(100, 120) }));
  const bild = reihe(winkel);
  return auswahl(text, bild.winkel.map((w) => opt(w.n, art(w.groesse) === was, art(w.groesse) === was ? undefined : FV_ART(was, art(w.groesse)))), hilfen, { mehrfach, bild, nachweis: [{ art: 'winkelwahl', was }] });
}
// Zeigeruhr: Der Winkel zwischen den Zeigern. Der Stundenzeiger wandert in einer Stunde 30°, in einer halben 15°.
const zeiger = (h, min) => { const x = Math.abs((h % 12) * 30 + min / 2 - min * 6); return Math.min(x, 360 - x); };
function uhrArt(text, zeiten, arten, hilfen) {
  const [h, min] = wahl(zeiten), g = zeiger(h, min);
  return auswahl(text(h, min), optArten(g, arten), hilfen, { bild: B.uhr([h, min]), nachweis: [{ art: 'uhrwinkel', h, min, wert: g }] });
}
// ---------- Schätzen ----------
function schaetzKnopf(text, niveau, hilfen, { stumpf = null } = {}) {
  const ziel = stumpf === null ? 10 * zz(2, 16) : stumpf ? 10 * zz(10, 16) : 10 * zz(2, 8);
  const g = ziel + wahl([-4, -3, -2, 2, 3, 4, 0]), andere = mische([20, 30, 45, 60, 90, 120, 150, 170].filter((x) => Math.abs(x - g) >= 40)).slice(0, 2);
  return auswahl(text, [opt(`etwa ${ziel}°`, true), ...andere.map((x) => opt(`etwa ${x}°`, false, 'winkel-ohne-stuetze'))], hilfen, { bild: einBild(g, niveau), nachweis: [{ art: 'schaetzwahl', winkel: 'α' }] });
}
function schaetzZahl(text, niveau, tol, hilfen, { von = 20, bis = 160, recht = false, bild = null, stuetze = [] } = {}) {
  const g = suche(() => zz(von, bis), (x) => x !== 90 && x !== 180 && (niveau !== 'G' || x % 5 === 0));
  const b = bild ? bild(g) : recht ? reihe([W(g, richtungFuer(niveau, g), { l1: 130, l2: 125 }), W(90, richtungFuer(niveau, 90), { l1: 90, l2: 90 })]) : einBild(g, niveau);
  return zahl(text, g, fehlerliste(g, [[180 - g, 'winkel-ohne-stuetze'], [360 - g, 'ueberstumpf-klein']].filter(([x]) => x > 0 && Math.abs(x - g) > tol)), hilfen, { einheit: '°', toleranz: tol, bild: b, nachweis: [HILFSZAHL(tol, 'Spielraum beim Schätzen'), ...stuetze, { art: 'groesse', winkel: 'α', wert: g }] });
}
function etwa(text, wert, niveau, hilfen, vorher = []) {
  const gs = suche(() => [wert + zz(-8, 8), ...[0, 1].map(() => zz(20, 170))], (l) => l.slice(1).every((x) => Math.abs(x - wert) >= 35) && Math.abs(l[1] - l[2]) >= 15 && l[0] !== 90);
  const g = niveau === 'G' || niveau === 'F' ? gs.map((x) => 5 * Math.round(x / 5)) : gs;
  if (Math.abs(g[0] - wert) > 10 || g.slice(1).some((x) => Math.abs(x - wert) < 30)) return null;
  const bild = reihe(mische(g).map((x) => W(x, richtungFuer(niveau, x), { l1: 105, l2: 105 })));
  return auswahl(text, bild.winkel.map((w) => opt(w.n, w.groesse === g[0], w.groesse === g[0] ? undefined : 'winkel-ohne-stuetze')), hilfen, { bild, nachweis: [...vorher, { art: 'ungefaehr', wert }] });
}

export function winkelarten() {
  const A1 = '5.7.3-A1', F3 = ['spitz', 'recht', 'stumpf'];
  sechs(A1, 'F', [
    () => artFrage(Z('Schau dir den Winkel α an.', 'Welche Art von Winkel ist α?'), 'spitz', 'F', F3,
      h3('Vergleiche mit einer Heftecke.', 'Ein spitzer Winkel ist kleiner als die Heftecke.', 'Passt α ganz in die Heftecke?')),
    () => artFrage(Z('Schau dir den Winkel α an.', 'Welche Art von Winkel ist α?'), 'stumpf', 'F', F3,
      h3('Vergleiche mit einer Heftecke.', 'Ein stumpfer Winkel ist größer als die Heftecke.', 'Öffnet sich α weiter als die Heftecke?')),
    () => artFrage(Z('Schau dir den Winkel α an.', 'Welche Art von Winkel ist α?'), 'recht', 'F', F3,
      h3('Das kleine Quadrat mit Punkt ist ein Zeichen.', 'Es steht nur bei einer besonderen Winkelgröße.', 'Ein rechter Winkel ist genau so groß wie eine Heftecke.')),
    () => artWahl(Z('Schau dir die drei Winkel an.', 'Welcher Winkel ist stumpf?'), mische(['spitz', 'recht', 'stumpf']), 'stumpf', 'F',
      h3('Ein stumpfer Winkel ist größer als ein rechter Winkel.', 'Ein gerader Strich ist er aber noch nicht.', 'Suche den Winkel mit der weitesten Öffnung.')),
    () => artWahl(Z('Welche Winkel sind spitz?', 'Kreuze alle an.'), mische(['spitz', 'spitz', wahl(['stumpf', 'recht'])]), 'spitz', 'F',
      h3('Ein spitzer Winkel ist kleiner als ein rechter Winkel.', 'Prüfe jeden Winkel mit der Heftecke.', 'Kreuze alle an, die ganz in die Heftecke passen.'), { mehrfach: true }),
    () => artWahl(Z('Schau dir die drei Winkel an.', 'Welcher ist ein rechter Winkel?'), mische(['spitz', 'recht', 'stumpf']), 'recht', 'F',
      h3('Ein rechter Winkel ist so groß wie eine Heftecke.', 'Er hat ein kleines Quadrat mit Punkt.', 'Suche dieses Zeichen.')),
  ]);
  sechs(A1, 'G', [
    () => artFrage(Z('Schau dir den Winkel α an.', 'Welche Winkelart ist α?'), 'gestreckt', 'G', ['stumpf', 'gestreckt', 'spitz'],
      h3('Beide Schenkel bilden zusammen eine gerade Linie.', 'Das ist ein halber Kreis um den Scheitel.', 'Ein solcher Winkel hat 180°.')),
    () => artFrage(Z('Der Winkel α liegt schräg.', 'Welche Winkelart ist α?'), 'recht', 'G', ['spitz', 'recht', 'stumpf'],
      h3('Dreh das Bild in Gedanken.', 'Achte auf das kleine Quadrat mit Punkt.', 'Ein rechter Winkel bleibt in jeder Lage ein rechter Winkel.')),
    () => textArt((g) => Z(`Ein Winkel ist ${g}° groß.`, 'Welche Winkelart ist das?'), 5 * wahl([19, 20, 21, 25, 30, 34, 35]), ['spitz', 'stumpf', 'gestreckt'],
      h3('Vergleiche mit 90° und mit 180°.', 'Zwischen 90° und 180° liegen die stumpfen Winkel.', 'Prüfe, wo die Zahl liegt.')),
    () => artWahl(Z('Welche Winkel sind stumpf?', 'Kreuze alle an.'), mische(['stumpf', 'stumpf', 'spitz', 'recht']), 'stumpf', 'G',
      h3('Ein stumpfer Winkel ist größer als ein rechter Winkel.', 'Dreh die Winkel in Gedanken.', 'Vergleiche jeden mit einer Heftecke.'), { mehrfach: true }),
    () => { const g = wahl([180, 360]), name = g === 180 ? 'gestreckter Winkel' : 'Vollwinkel';
      return auswahl(Z(`Ein Winkel ist ${g}° groß.`, 'Welche Aussage stimmt?'), [opt(`Das ist ein ${name}.`, true), opt('Das ist kein Winkel.\nDie Schenkel liegen auf einer Linie.', false, 'gestreckt-kein-winkel'), opt('Das ist ein stumpfer Winkel.', false, 'winkelart-grenze')],
        h3('Auch 180° und 360° sind Winkel.', 'Bei 180° bilden die Schenkel eine gerade Linie.', 'Bei 360° liegen die Schenkel aufeinander.'), { bild: einBild(g, 'G'), nachweis: [{ art: 'groesse', winkel: 'α', wert: g }] }); },
    () => uhrArt((h) => Z(`Die Uhr zeigt ${h} Uhr.`, 'Welche Winkelart bilden die beiden Zeiger?'), [[3, 0], [9, 0], [6, 0], [1, 0], [2, 0], [4, 0], [5, 0], [10, 0], [8, 0], [11, 0], [7, 0]], ['spitz', 'recht', 'stumpf', 'gestreckt'],
      h3('Von einer Zahl zur nächsten sind es 30°.', 'Zähle die Zahlen zwischen den Zeigern.', 'Vergleiche das Ergebnis mit 90° und 180°.')),
  ]);
  sechs(A1, 'M', [
    () => artFrage('Welche Winkelart ist α? Achte auf den Bogen.', 'überstumpf', 'M', ['spitz', 'stumpf', 'überstumpf', 'gestreckt'],
      h2('Der Bogen zeigt, welcher Winkel gemeint ist: hier der große Winkel außen herum.', 'Ein überstumpfer Winkel ist größer als 180° und kleiner als 360°.')),
    () => textArt((g) => `Ein Winkel ist ${g}° groß. Welche Winkelart ist das?`, zz(181, 359), ['stumpf', 'gestreckt', 'überstumpf', 'voll'],
      h2('Vergleiche mit 180° und 360°.', 'Zwischen 180° und 360° liegen die überstumpfen Winkel.')),
    () => artWahl('Welche Winkel sind überstumpf? Kreuze alle an.', mische(['überstumpf', 'überstumpf', 'stumpf', 'spitz']), 'überstumpf', 'M',
      h2('Achte auf die Bögen: Ein überstumpfer Winkel öffnet sich weiter als eine gerade Linie.', 'Er ist größer als 180°.'), { mehrfach: true }),
    () => artFrage('Welche Winkelart ist α?', 'recht', 'M', ['spitz', 'recht', 'stumpf', 'gestreckt'],
      h2('Dreh das Bild in Gedanken.', 'Das Quadrat mit Punkt kennzeichnet eine besondere Winkelgröße.')),
    () => { const a = zz(95, 175), b = 360 - a;
      return zahl(`Der Winkel α ist ${a}° groß. Der Winkel β ergänzt α zu einem Vollwinkel. Wie groß ist β?`, b, fehlerliste(b, [[a, 'ueberstumpf-klein'], [180 - a, 'winkelart-grenze']].filter(([x]) => x > 0)),
        h2('Ein Vollwinkel hat 360°.', `Rechne 360 − ${a}.`), { einheit: '°', bild: ((v) => bildAus([[W(a, v, { l1: 120, l2: 120, n: 'α' }), W(b, v + a, { l1: 120, l2: 120, n: 'β', rb: 52 })]]))(zz(0, 359)), nachweis: [HILFSZAHL(360, 'Ein Vollwinkel hat 360°'), ...N(`360 − ${a}`)] }); },
    () => uhrArt((h, min) => `Welche Winkelart bilden die beiden Zeiger der Uhr um ${h}:${String(min).padStart(2, '0')} Uhr?`, [[9, 30], [7, 0], [2, 30], [4, 30], [10, 30], [1, 30], [5, 0], [8, 30]], ['spitz', 'recht', 'stumpf', 'gestreckt'],
      h2('Zwischen zwei Zahlen auf dem Zifferblatt liegen 30°.', 'Um halb wandert der Stundenzeiger bis in die Mitte zwischen zwei Zahlen.')),
  ]);
  sechs(A1, 'E', [
    () => { const sorte = wahl(['spitz', 'stumpf', 'überstumpf', 'recht']); return artFrage('Welche Winkelart ist α?', sorte, 'E', ['spitz', 'recht', 'stumpf', 'gestreckt', 'überstumpf'],
      h1('Achte darauf, welchen Winkel der Bogen zeigt.')); },
    () => { const d = zz(1, 3), oben = zz(0, 1), basis = wahl([90, 180]), g = oben ? basis + d : basis - d;
      return textArt((x) => `Ein Winkel ist um ${d}° ${oben ? 'größer' : 'kleiner'} als ein ${basis === 90 ? 'rechter' : 'gestreckter'} Winkel. Welche Winkelart ist das?`, g, ['spitz', 'recht', 'stumpf', 'gestreckt', 'überstumpf'],
        h1('Rechne zuerst die Größe aus und vergleiche dann mit den Grenzen.'), N(`${basis} ${oben ? '+' : '−'} ${d}`)); },
    () => { const werte = mische([wahl([89, 90, 91]), wahl([179, 180, 181]), zz(100, 170), zz(10, 80), zz(185, 350)]);
      return auswahl('Welche Winkelgrößen gehören zu stumpfen Winkeln? Kreuze alle an.', werte.map((x) => opt(`${x}°`, art(x) === 'stumpf', art(x) === 'stumpf' ? undefined : FV_ART('stumpf', art(x)))),
        h1('Stumpf heißt: größer als 90° und kleiner als 180°. Die Grenzen selbst gehören nicht dazu.'), { mehrfach: true, nachweis: [{ art: 'artwahl', was: 'stumpf' }] }); },
    () => uhrArt((h, min) => `Welche Winkelart bilden die Zeiger der Uhr um ${h}:${String(min).padStart(2, '0')} Uhr?`, [[2, 30], [3, 30], [9, 30], [11, 30], [6, 30], [12, 30], [3, 15], [9, 45]], ['spitz', 'recht', 'stumpf', 'gestreckt', 'überstumpf'],
      h1('Der Stundenzeiger steht nicht genau auf der Zahl: In einer halben Stunde wandert er 15°.')),
    () => { const a = zz(15, 80), b = 180 - a;
      return textArt(() => `Die Winkel α und β liegen nebeneinander und bilden zusammen einen gestreckten Winkel. α ist ${a}° groß. Welche Winkelart ist β?`, b, ['spitz', 'recht', 'stumpf', 'gestreckt', 'überstumpf'],
        h1('Ein gestreckter Winkel hat 180°.'), N(`180 − ${a}`)); },
    () => auswahl('Zwei spitze Winkel liegen mit gemeinsamem Scheitel nebeneinander. Welche Winkelart kann der Winkel sein, den sie zusammen bilden? Kreuze alle an, die möglich sind.',
      [opt('spitzer Winkel', true), opt('rechter Winkel', true), opt('stumpfer Winkel', true), opt('gestreckter Winkel', false, 'winkelart-grenze'), opt('überstumpfer Winkel', false, 'winkelart-grenze')],
      h1('Jeder spitze Winkel ist kleiner als 90°. Wie groß können beide zusammen höchstens werden?'), { mehrfach: true, nachweis: [U(true)] }),
  ]);

  const A2 = '5.7.3-A2';
  sechs(A2, 'F', [
    () => schaetzKnopf(Z('Schätze den Winkel α.', 'Welche Größe passt am besten?'), 'F', h3('Vergleiche mit einer Heftecke.', 'Eine Heftecke hat 90°.', 'Ist α viel kleiner, etwas kleiner oder größer?'), { stumpf: false }),
    () => schaetzKnopf(Z('Schätze den Winkel α.', 'Welche Größe passt am besten?'), 'F', h3('Vergleiche mit einer Heftecke.', 'Eine Heftecke hat 90°.', 'Ist α größer oder kleiner als die Heftecke?'), { stumpf: true }),
    () => schaetzKnopf(Z('Schätze den Winkel α.', 'Welche Größe passt am besten?'), 'F', h3('Eine Heftecke hat 90°.', 'Eine gerade Linie hat 180°.', 'Liegt α näher an 0°, 90° oder 180°?')),
    () => schaetzKnopf(Z('Wie groß ist der Winkel α ungefähr?'), 'F', h3('Eine Heftecke hat 90°.', 'Die halbe Heftecke hat 45°.', 'Vergleiche α mit diesen Winkeln.'), { stumpf: false }),
    () => etwa(Z('Schau dir die drei Winkel an.', 'Welcher Winkel ist etwa 90° groß?'), 90, 'F', h3('90° ist so groß wie eine Heftecke.', 'Halte die Heftecke an jeden Winkel.', 'Der passende Winkel füllt die Ecke fast genau.')),
    () => schaetzKnopf(Z('Wie groß ist der Winkel α ungefähr?'), 'F', h3('Eine gerade Linie hat 180°.', 'Eine Heftecke hat 90°.', 'Liegt α näher an der Heftecke oder an der geraden Linie?'), { stumpf: true }),
  ]);
  sechs(A2, 'G', [
    () => schaetzZahl(Z('Schätze den Winkel α.', 'Du darfst bis zu 20° daneben liegen.'), 'G', 20, h3('Vergleiche mit 90°.', 'Die Hälfte von 90° sind 45°.', 'Schätze dann in Zehnerschritten.'), { bis: 85 }),
    () => schaetzZahl(Z('Schätze den Winkel α.', 'Du darfst bis zu 20° daneben liegen.'), 'G', 20, h3('Vergleiche mit 90° und 180°.', 'Liegt α genau dazwischen, sind es etwa 135°.', 'Schätze dann in Zehnerschritten.'), { von: 95 }),
    () => etwa(Z('Welcher Winkel ist etwa 45° groß?'), 45, 'G', h3('45° ist ein halber rechter Winkel.', 'Falte eine Heftecke in Gedanken in der Mitte.', 'Suche den Winkel, der dazu passt.')),
    () => schaetzZahl(Z('Wie groß ist der Winkel α ungefähr?', 'Du darfst bis zu 20° daneben liegen.'), 'G', 20, h3('Dreh den Winkel in Gedanken.', 'Vergleiche ihn dann mit 90°.', 'Schätze in Zehnerschritten.')),
    () => schaetzZahl(Z('β ist ein rechter Winkel.', 'Schätze mit seiner Hilfe den Winkel α.', 'Du darfst bis zu 20° daneben liegen.'), 'G', 20, h3('β hat genau 90°.', 'Vergleiche α mit β.', 'Ist α die Hälfte, etwas weniger oder mehr?'), { recht: true }),
    () => { const g = 5 * zz(22, 32), k = kind(), falsch = 180 - g;
      return auswahl(Z(`${k} schätzt den Winkel α auf ${falsch}°.`, 'Was ist der Fehler?'), [opt(`α ist stumpf.\nEr ist größer als 90°.\n${falsch}° ist viel zu klein.`, true), opt(`Kein Fehler.\n${falsch}° passt gut.`, false, 'winkel-ohne-stuetze'), opt(`α ist spitz.\n${falsch}° ist zu groß.`, false, 'winkelart-grenze')],
        h3('Vergleiche α zuerst mit einer Heftecke.', 'Ist α größer oder kleiner als 90°?', 'Prüfe dann die Schätzung.'), { bild: einBild(g, 'G'), nachweis: [U(false), { art: 'groesse', winkel: 'α', wert: g }, ...N(`180 − ${g}`)] }); },
  ]);
  sechs(A2, 'M', [
    () => schaetzZahl('Schätze den Winkel α. Du darfst bis zu 10° daneben liegen.', 'M', 10, h2('Vergleiche mit 90° und mit 45°, der Hälfte davon.', 'Schätze dann so genau wie möglich.'), { bis: 88 }),
    () => schaetzZahl('Schätze den überstumpfen Winkel α. Du darfst bis zu 10° daneben liegen.', 'M', 10, h2('Schätze zuerst den kleinen Winkel außen herum.', 'Ziehe ihn dann von 360° ab.'), { von: 195, bis: 345 }),
    () => etwa('Welcher Winkel ist etwa 120° groß?', 120, 'M', h2('120° ist ein rechter Winkel und noch ein Drittel davon.', 'Vergleiche jeden Winkel mit 90° und 180°.')),
    () => schaetzZahl('Wie groß ist der Winkel α ungefähr? Du darfst bis zu 10° daneben liegen.', 'M', 10, h2('Vergleiche mit 90° und mit 180°.', 'Teile den Bereich in Gedanken in Stücke von 45°.'), { von: 95, bis: 175 }),
    () => schaetzZahl('β ist ein rechter Winkel. Schätze mit seiner Hilfe den Winkel α. Du darfst bis zu 10° daneben liegen.', 'M', 10, h2('Lege β in Gedanken an α an.', 'Schätze, um wie viel α größer oder kleiner ist.'), { recht: true }),
    () => { const a = zz(25, 60), ziel = 2 * a;
      return etwa(`Der Winkel α ist ${a}° groß. Welcher der Winkel ist etwa doppelt so groß wie α?`, ziel, 'M', h2('Rechne zuerst aus, wie groß der gesuchte Winkel ungefähr ist.', 'Vergleiche dann mit 90°.'), N(`2 · ${a}`)); },
  ]);
  sechs(A2, 'E', [
    () => schaetzZahl('Ein halber rechter Winkel hat 45°. Nutze ihn als Stütze und schätze α auf 10° genau.', 'E', 10, h1('Liegt α näher an 45° oder an 90°?'), { bis: 88, stuetze: [HILFSZAHL(45, 'ein halber rechter Winkel')] }),
    () => schaetzZahl('Schätze den überstumpfen Winkel α auf 10° genau.', 'E', 10, h1('Schätze den kleinen Winkel außen herum und rechne 360° minus.'), { von: 195, bis: 345 }),
    () => etwa('Welcher Winkel ist etwa 135° groß?', 135, 'E', h1('135° ist ein rechter und ein halber rechter Winkel.')),
    () => { const a = zz(80, 150), ziel = a % 2 ? a - 1 : a;
      return etwa(`Der Winkel α ist ${ziel}° groß. Welcher der Winkel ist etwa halb so groß wie α?`, ziel / 2, 'E', h1('Rechne zuerst die Hälfte aus und vergleiche mit 45°.'), N(`${ziel} : 2`)); },
    () => schaetzZahl('β ist ein rechter Winkel. Schätze α auf 10° genau.', 'E', 10, h1('Vergleiche α mit β und mit der Hälfte von β.'), { recht: true, von: 100, bis: 170 }),
    () => { const [h, min] = wahl([[4, 0], [5, 0], [1, 0], [2, 0], [10, 0], [8, 0], [7, 0], [11, 0]]), g = zeiger(h, min);
      return zahl(`Wie groß ist der Winkel zwischen den beiden Zeigern um ${h} Uhr? Nutze als Stütze: Von einer Zahl zur nächsten sind es 30°.`, g, fehlerliste(g, [[360 - g, 'ueberstumpf-klein'], [g + 30, 'winkel-ohne-stuetze'], [g - 30, 'winkel-ohne-stuetze']].filter(([x]) => x > 0)),
        h1('Zähle die Zahlenabstände zwischen den Zeigern.'), { einheit: '°', bild: B.uhr([h, min]), nachweis: [HILFSZAHL(30, 'Von einer Zahl zur nächsten sind es 30°'), { art: 'uhrwinkel', h, min, wert: g }] }); },
  ]);
}
