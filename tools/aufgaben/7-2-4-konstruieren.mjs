// Aufgaben zu 7.2.4 „Dreiecke konstruieren“ (Lernziele K1 und K2) nach ADR 0015 und ADR 0044.
// Grilling mit Nils (2026-11-25): Konstruiert wird am Karogitter (Ecke antippen, Seite zeichnen) und im Heft.
// Auf F und G sind die Zirkelbögen vorgegeben, es gibt keinen Bildschirmzirkel. Heftaufgaben mit Kontrollwert
// (Seiten auf 2 mm, Winkel auf 2° genau) sind auf G bis E je 2 von 6. Kongruenzsatz, sss, sws, wsw ab M.
// E: Dreiecksungleichung, SsW, Lösungsvielfalt, Fehlersuche.
import { sechs } from '../werkzeug.mjs';
import { zz, wahl, suche, mische, dreieckAus, dreieckSws, dreieckSss, dreieckWsw, dreieckFigur, winkelBei, seiteVon, cm, WERT, NAME, H, grad, zahl, auswahl, opt, Z, sach, teilWahl, ordnen, gitterPunkte, gitterLinie, GT, PT, LN, kind, drehFuer, winkelFuer } from './7-2-figur.mjs';

const K1 = '7.2.4-K1', K2 = '7.2.4-K2';
const GRIECH = { A: 'α', B: 'β', C: 'γ' };
// Die drei Arten von Angaben. Lage: Bei sws liegt der Winkel zwischen den Seiten, bei wsw die Seite zwischen den Winkeln.
const ART_TEXT = { sss: 'drei Seiten', sws: 'zwei Seiten und der Winkel dazwischen', wsw: 'eine Seite und die beiden Winkel daran' };
const artOptionen = (art, mitNamen = false) => Object.entries(ART_TEXT).map(([k, t]) => opt(mitNamen ? k : t, k === art, k === art ? undefined : 'kongruenz-verwechselt'));
// Zufällige Angaben einer Art, mit passendem Dreieck (maßstabsgetreu für die Planfigur).
function angaben(art, n) {
  const ecke = wahl(['A', 'B', 'C']), [p, q] = { A: ['B', 'C'], B: ['C', 'A'], C: ['A', 'B'] }[ecke], s = { A: 'a', B: 'b', C: 'c' };
  if (art === 'sss') { const l = suche(() => [zz(3, 8), zz(3, 8), zz(3, 8)], ([a, b, c]) => a + b > c + 1 && a + c > b + 1 && b + c > a + 1 && new Set([a, b, c]).size === 3); return { art, a: l[0], b: l[1], c: l[2], E: dreieckSss(l[0], l[1], l[2], drehFuer(n)) }; }
  if (art === 'sws') { // Winkel bei `ecke`, die beiden anliegenden Seiten
    const w = winkelFuer(n, 30, 110), x = zz(3, 7), y = zz(3, 7);
    const o = { art, [GRIECH[ecke]]: w, [s[q]]: x, [s[p]]: y, ecke };
    const D = dreieckSws(y, x, w, drehFuer(n)); // A=Scheitel, B auf der ersten, C auf der zweiten Seite
    return { ...o, E: umbenennen(D, ecke) };
  }
  const w1 = winkelFuer(n, 30, 75), w2 = winkelFuer(n, 30, 75), l = zz(4, 8); // wsw: Seite zwischen den Ecken p und q... hier: Seite s[ecke] liegt zwischen p und q
  const D = dreieckWsw(l, w1, w2, drehFuer(n));
  return { art, [s[ecke]]: l, [GRIECH[p]]: w1, [GRIECH[q]]: w2, ecke, E: umbenennen(D, p, true) };
}
// dreieckSws und dreieckWsw liefern A als Scheitel. Umbenennen, damit die Namen zur Lage passen (gegen den Uhrzeigersinn bleibt erhalten).
function umbenennen(D, start) {
  const folge = { A: ['A', 'B', 'C'], B: ['B', 'C', 'A'], C: ['C', 'A', 'B'] }[start];
  return { [folge[0]]: D.A, [folge[1]]: D.B, [folge[2]]: D.C };
}
const angabenText = (g) => [['a', 'b', 'c'].filter((k) => g[k] != null).map((k) => `${k} = ${cm(g[k])}`), ['α', 'β', 'γ'].filter((k) => g[k] != null).map((k) => `${k} = ${g[k]}°`)].flat().join(', ');
// Planfigur: alle gegebenen Stücke markiert. Seiten mit Länge, Winkel mit Größe.
function planfigur(g) {
  const m = Object.fromEntries(['a', 'b', 'c'].filter((k) => g[k] != null).map((k) => [k, cm(g[k])]));
  const w = Object.fromEntries([['A', 'α'], ['B', 'β'], ['C', 'γ']].filter(([, k]) => g[k] != null).map(([e, k]) => [e, WERT(g[k])]));
  return dreieckFigur(g.E, { m, w, titel: 'Planfigur' });
}
const hArt = (n) => ({ F: 1, G: 1 }[n] ? H(n, 'Zähle die gegebenen Seiten und Winkel.', 'Liegt der Winkel zwischen zwei gegebenen Seiten, heißt es: zwei Seiten und der Winkel dazwischen.', 'Schau, wo der gegebene Winkel liegt.') : H(n, 'sss: drei Seiten. sws: der Winkel liegt zwischen den Seiten. wsw: die Seite liegt zwischen den Winkeln.', 'Schau auf die Lage der Stücke.'));

// ---------- K1: Kongruenzsätze erkennen, Planfigur ----------
function k1() {
  const welcheArt = (n, text, mitNamen) => { const art = wahl(['sss', 'sws', 'wsw']), g = angaben(art, n);
    return auswahl(text, artOptionen(art, mitNamen), hArt(n), { bild: planfigur(g), nachweis: [{ art: 'kongruenz', angaben: angabenText(g), satz: art }] }); };
  sechs(K1, 'F', [
    () => welcheArt('F', Z('In der Planfigur ist markiert, was gegeben ist.', 'Was ist gegeben?', 'Kreuze an.')),
    () => { const [e, g, s] = wahl([['A', 'α', ['b', 'c']], ['B', 'β', ['a', 'c']], ['C', 'γ', ['a', 'b']]]);
      return auswahl(Z(`Welcher Winkel liegt zwischen den Seiten ${s[0]} und ${s[1]}?`, 'Kreuze an.'), ['α', 'β', 'γ'].map((x) => opt(x, x === g, x === g ? undefined : 'seite-ecke-vertauscht')),
        H('F', 'Zwei Seiten treffen sich in einer Ecke. Dort liegt der Winkel.', 'Die Seiten b und c treffen sich in A. Dort liegt α.', `Suche die Ecke, an der ${s[0]} und ${s[1]} zusammenstoßen.`), { bild: dreieckFigur(dreieckAus(60, 50, 0), {}), nachweis: [{ art: 'name', winkel: g, seiten: s }] }); },
    () => { const [g1, g2, s] = wahl([['α', 'β', 'c'], ['β', 'γ', 'a'], ['α', 'γ', 'b']]);
      return auswahl(Z(`Welche Seite liegt zwischen den Winkeln ${g1} und ${g2}?`, 'Kreuze an.'), ['a', 'b', 'c'].map((x) => opt(x, x === s, x === s ? undefined : 'seite-ecke-vertauscht')),
        H('F', 'Die Seite verbindet die beiden Ecken mit den Winkeln.', 'α liegt bei A, β bei B. Dazwischen liegt c.', 'Suche die Ecken der beiden Winkel.'), { bild: dreieckFigur(dreieckAus(55, 65, 0), {}), nachweis: [{ art: 'name', seite: s, winkel: [g1, g2] }] }); },
    () => welcheArt('F', Z('Schau dir die Planfigur an.', 'Was ist gegeben?', 'Kreuze an.')),
    () => { const g = angaben('sws', 'F');
      return auswahl(Z(`Gegeben: ${angabenText(g)}.`, 'Welche Planfigur-Beschreibung passt?', 'Kreuze an.'), artOptionen('sws'), hArt('F'), { bild: planfigur(g), nachweis: [{ art: 'kongruenz', angaben: angabenText(g), satz: 'sws' }] }); },
    () => { const [a, b, c] = wahl([[3, 4, 5], [5, 5, 6], [4, 6, 7], [6, 8, 10], [5, 12, 13]]);
      return auswahl(Z('Ein Beet hat die Form eines Dreiecks.', `Die Seiten sind ${a} m, ${b} m und ${c} m lang.`, 'Was ist gegeben?', 'Kreuze an.'), artOptionen('sss'), hArt('F'),
        { bild: dreieckFigur(dreieckSss(a, b, c), { m: { a: `${a} m`, b: `${b} m`, c: `${c} m` }, titel: 'Planfigur' }), nachweis: [{ art: 'kongruenz', angaben: `a = ${a}, b = ${b}, c = ${c}`, satz: 'sss' }] }); },
  ]);
  sechs(K1, 'G', [
    () => welcheArt('G', Z('Was ist in der Planfigur gegeben?', 'Kreuze an.')),
    () => { const art = wahl(['sws', 'wsw']), g = angaben(art, 'G');
      return auswahl(Z(`Gegeben ist ${angabenText(g)}.`, 'Was ist gegeben?', 'Kreuze an.'), artOptionen(art), hArt('G'), { bild: planfigur(g), nachweis: [{ art: 'kongruenz', angaben: angabenText(g), satz: art }] }); },
    () => { const [x, y, fehlt] = wahl([['b = 5 cm', 'α = 40°', 'c'], ['a = 4 cm', 'γ = 70°', 'b'], ['c = 6 cm', 'β = 55°', 'a'], ['a = 5 cm', 'β = 65°', 'c']]);
      return auswahl(Z(`Gegeben sind ${x} und ${y}.`, 'Der Winkel soll zwischen zwei Seiten liegen.', 'Welche Seite fehlt noch?', 'Kreuze an.'), ['a', 'b', 'c'].filter((s) => !x.startsWith(s)).concat(['α']).map((s) => opt(s, s === fehlt, s === fehlt ? undefined : 'kongruenz-verwechselt')),
        H('G', 'Der Winkel liegt an einer Ecke. Dort treffen sich zwei Seiten.', 'α liegt bei A. Dort treffen sich b und c.', 'Welche zwei Seiten treffen sich an der Ecke des Winkels?'), { nachweis: [{ art: 'kongruenz', angaben: `${x}, ${y}, ${fehlt}`, satz: 'sws' }] }); },
    () => welcheArt('G', Z('Schau dir die Planfigur an.', 'Was ist gegeben?', 'Kreuze an.')),
    () => { const zwei = wahl([['a = 5 cm', 'b = 4 cm'], ['α = 50°', 'c = 6 cm'], ['β = 40°', 'γ = 60°']]);
      return auswahl(Z(`Gegeben sind nur ${zwei[0]} und ${zwei[1]}.`, 'Kann man damit genau ein Dreieck zeichnen?', 'Kreuze die richtige Antwort an.'), [opt('Nein. Man braucht drei passende Angaben.', true), opt('Ja. Zwei Angaben reichen.', false, 'kongruenz-verwechselt'), opt('Ja. Die dritte Seite ergibt sich von selbst.', false, 'kongruenz-verwechselt')],
        H('G', 'Probiere es im Kopf: Kannst du mehrere verschiedene Dreiecke zeichnen?', 'Mit a und b allein kannst du den Winkel dazwischen frei wählen.', 'Zähle die Angaben.'), { nachweis: [{ art: 'urteil', stimmt: false }] }); },
    () => { const k = kind(), [w, s1, s2, ja] = wahl([['γ', 'a', 'b', true], ['α', 'b', 'c', true], ['β', 'a', 'c', true], ['α', 'a', 'b', false], ['γ', 'b', 'c', false]]);
      return auswahl(Z(`${k} sagt: „Mit ${s1}, ${s2} und ${w} kenne ich zwei Seiten und den Winkel dazwischen.“`, 'Kreuze die richtige Begründung an.'),
        [opt(ja ? `Stimmt. ${w} liegt an der Ecke, an der ${s1} und ${s2} zusammenstoßen.` : `Stimmt nicht. ${w} liegt nicht an der Ecke zwischen ${s1} und ${s2}.`, true), opt(ja ? `Stimmt nicht. ${w} liegt gegenüber von ${s1}.` : 'Stimmt. Jeder Winkel liegt zwischen zwei Seiten.', false, 'kongruenz-verwechselt'), opt('Das kann man nur mit einer Zeichnung entscheiden.', false, 'kongruenz-verwechselt')],
        H('G', 'Ein Winkel liegt an einer Ecke. An der Ecke A treffen sich b und c.', 'γ liegt bei C. Dort treffen sich a und b.', `An welcher Ecke liegt ${w}?`), { nachweis: [{ art: 'urteil', stimmt: ja }] }); },
  ]);
  sechs(K1, 'M', [
    () => { const art = wahl(['sss', 'sws', 'wsw']), g = angaben(art, 'M');
      return auswahl(`Gegeben ist ${angabenText(g)}. Welcher Kongruenzsatz passt? Kreuze an.`, artOptionen(art, true), hArt('M'), { nachweis: [{ art: 'kongruenz', angaben: angabenText(g), satz: art }] }); },
    () => { const [x, y, fehlt] = wahl([['b = 5 cm', 'α = 40°', 'c'], ['a = 4 cm', 'γ = 70°', 'b'], ['c = 6 cm', 'β = 55°', 'a'], ['α = 50°', 'β = 60°', 'c'], ['β = 45°', 'γ = 75°', 'a'], ['α = 35°', 'γ = 80°', 'b']]);
      const satz = x.startsWith('α') || x.startsWith('β') ? 'wsw' : 'sws';
      return auswahl(`Gegeben sind ${x} und ${y}. Ergänze eine Seite, sodass der Kongruenzsatz ${satz} passt. Kreuze an.`, ['a', 'b', 'c'].filter((s) => !x.startsWith(s)).map((s) => opt(s, s === fehlt, s === fehlt ? undefined : 'kongruenz-verwechselt')),
        hArt('M'), { nachweis: [{ art: 'kongruenz', angaben: `${x}, ${y}, ${fehlt}`, satz }] }); },
    () => { const art = wahl(['sws', 'wsw', 'sss']), g = angaben(art, 'M');
      return auswahl(`Tom und Lena zeichnen beide ein Dreieck mit ${angabenText(g)}. Sind ihre Dreiecke kongruent? Kreuze die richtige Antwort an.`,
        [opt(`Ja. Die Angaben passen zum Kongruenzsatz ${art}.`, true), opt('Nein. Jeder zeichnet anders.', false, 'kongruenz-verwechselt'), opt('Nur, wenn beide das Dreieck gleich drehen.', false, 'kongruenz-verwechselt')],
        hArt('M'), { nachweis: [{ art: 'kongruenz', angaben: angabenText(g), satz: art }, { art: 'urteil', stimmt: true }] }); },
    () => welcheArt('M', 'Welcher Kongruenzsatz passt zu den Angaben in der Planfigur? Kreuze an.', true),
    () => { const w = suche(() => [winkelFuer('M', 30, 90), winkelFuer('M', 30, 90)], ([a, b]) => a + b < 150 && a !== b), g = 180 - w[0] - w[1];
      return auswahl(`Gegeben sind α = ${w[0]}°, β = ${w[1]}° und γ = ${g}°. Überprüfe, ob das Dreieck damit eindeutig festgelegt ist. Kreuze an.`,
        [opt('Nein. Es kann groß oder klein sein. Es fehlt eine Seite.', true), opt('Ja. Drei Angaben reichen immer.', false, 'drei-winkel-eindeutig'), opt('Ja. Das ist der Kongruenzsatz wsw.', false, 'kongruenz-verwechselt'), opt(`Nein. Die Winkel ergeben nicht 180°.`, false, 'winkelsumme')],
        H('M', 'Zeichne in Gedanken ein kleines und ein großes Dreieck mit denselben Winkeln.', 'Gleiche Winkel legen nur die Form fest. Für die Größe brauchst du eine Seite.'), { nachweis: [{ art: 'urteil', stimmt: false }, { art: 'kongruenz', angaben: `α = ${w[0]}°, β = ${w[1]}°, γ = ${g}°`, satz: 'keiner' }] }); },
    () => { const k = kind(), [s1, s2, w] = wahl([['a', 'b', 'α'], ['b', 'c', 'β'], ['a', 'c', 'γ'], ['a', 'b', 'β']]);
      return auswahl(`${k} sagt: „${s1} = 5 cm, ${s2} = 4 cm und ${w} = 30° passen zu sws.“ Erkläre den Fehler. Kreuze die richtige Erklärung an.`,
        [opt(`${w} liegt nicht zwischen ${s1} und ${s2}. Bei sws muss der Winkel zwischen den beiden Seiten liegen.`, true), opt('Es fehlt eine dritte Seite.', false, 'kongruenz-verwechselt'), opt('Der Winkel ist zu klein.', false, 'kongruenz-verwechselt'), opt('Das ist kein Fehler.', false, 'kongruenz-verwechselt')],
        hArt('M'), { nachweis: [{ art: 'kongruenz', angaben: `${s1}, ${s2}, ${w}`, satz: 'SsW' }, { art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(K1, 'E', [
    () => { const l = suche(() => [zz(2, 9), zz(2, 9), zz(2, 12)], ([a, b, c]) => new Set([a, b, c]).size === 3), [a, b, c] = l, s = [...l].sort((x, y) => x - y), geht = s[0] + s[1] > s[2];
      return auswahl(`Kann man ein Dreieck mit a = ${cm(a)}, b = ${cm(b)} und c = ${cm(c)} konstruieren? Begründe. Kreuze an.`,
        [opt(geht ? `Ja. Die beiden kürzeren Seiten sind zusammen ${s[0] + s[1]} cm, das ist länger als ${s[2]} cm.` : `Nein. ${s[0]} cm + ${s[1]} cm = ${s[0] + s[1]} cm ist nicht länger als ${s[2]} cm.`, true),
          opt(geht ? 'Nein. Die Seiten sind zu verschieden.' : 'Ja. Mit drei Seiten geht es immer (sss).', false, 'dreiecksungleichung'), opt(geht ? 'Nur, wenn ein rechter Winkel vorkommt.' : 'Ja, wenn man genau zeichnet.', false, 'dreiecksungleichung')],
        H('E', 'Prüfe: Sind die beiden kürzeren Seiten zusammen länger als die längste?'), { nachweis: [`${s[0]} + ${s[1]} = ${s[0] + s[1]}`, { art: 'konstruierbar', seiten: l, geht }, { art: 'urteil', stimmt: geht }] }); },
    () => { const a = zz(3, 7), b = zz(a + 1, 11), welche = wahl(['hoechstens', 'mindestens']), loes = welche === 'hoechstens' ? a + b - 1 : b - a + 1;
      return zahl(`Ein Dreieck hat die Seiten a = ${cm(a)} und b = ${cm(b)}. Die Seite c ist eine ganze Zahl von Zentimetern. Bestimme, wie lang c ${welche === 'hoechstens' ? 'höchstens' : 'mindestens'} sein kann.`, loes, [[welche === 'hoechstens' ? a + b : b - a, 'dreiecksungleichung']],
        H('E', 'Zwei Seiten zusammen müssen immer länger sein als die dritte.'), { einheit: 'cm', nachweis: [welche === 'hoechstens' ? `${a} + ${b} = ${a + b}` : `${b} − ${a} = ${b - a}`, { art: 'konstruierbar', seiten: [a, b, loes], geht: true }, { art: 'konstruierbar', seiten: [a, b, welche === 'hoechstens' ? a + b : b - a], geht: false }] }); },
    () => { const lang = zz(6, 8), kurz = zz(3, 5), w = winkelFuer('E', 30, 50), eindeutig = wahl([true, false]);
      const text = eindeutig ? `b = ${cm(lang)}, c = ${cm(kurz)} und β = ${w}°` : `b = ${cm(lang)}, c = ${cm(kurz)} und γ = ${w}°`;
      return auswahl(`Gegeben sind ${text}. Der Winkel liegt nicht zwischen den Seiten. Entscheide, ob das Dreieck eindeutig ist. Kreuze an.`,
        [opt(eindeutig ? 'Eindeutig. Der Winkel liegt der längeren Seite gegenüber (SsW).' : 'Nicht eindeutig. Der Winkel liegt der kürzeren Seite gegenüber, es kann zwei Dreiecke geben.', true),
          opt(eindeutig ? 'Nicht eindeutig. Zwei Seiten und ein Winkel reichen nie.' : 'Eindeutig. Das ist der Kongruenzsatz sws.', false, 'kongruenz-verwechselt'), opt('Das Dreieck lässt sich gar nicht zeichnen.', false, 'dreiecksungleichung')],
        H('E', 'Welcher Seite liegt der Winkel gegenüber: der längeren oder der kürzeren?'), { nachweis: [{ art: 'kongruenz', angaben: text, satz: eindeutig ? 'SsW' : 'SsW-kurz' }] }); },
    () => { const k = kind(), w = suche(() => [winkelFuer('E', 30, 90), winkelFuer('E', 30, 90)], ([a, b]) => a + b < 150), g = 180 - w[0] - w[1];
      return auswahl(`${k} sagt: „Mit α = ${w[0]}°, β = ${w[1]}° und γ = ${g}° ist ein Dreieck eindeutig, das sind ja drei Angaben.“ Erkläre den Fehler. Kreuze die richtige Erklärung an.`,
        [opt('Die drei Winkel legen nur die Form fest, nicht die Größe. Es fehlt eine Seite.', true), opt('Die Winkel ergeben nicht 180°.', false, 'winkelsumme'), opt('Das ist kein Fehler: www ist ein Kongruenzsatz.', false, 'drei-winkel-eindeutig'), opt('Man braucht vier Angaben.', false, 'kongruenz-verwechselt')],
        H('E', 'Vergrößere das Dreieck in Gedanken.'), { nachweis: [R3(w[0], w[1], g), { art: 'urteil', stimmt: false }] }); },
    () => { const [l, x, y, fehlt] = wahl([['a', 'α', 'β', 'γ'], ['b', 'β', 'γ', 'α'], ['c', 'α', 'γ', 'β'], ['a', 'β', 'α', 'γ']]), w1 = winkelFuer('E', 30, 70), w2 = winkelFuer('E', 30, 70);
      return auswahl(`Gegeben sind ${l} = 6 cm, ${x} = ${w1}° und ${y} = ${w2}°. Welche Größe berechnest du zuerst, damit du mit wsw konstruieren kannst? Kreuze an.`,
        ['α', 'β', 'γ'].map((g) => opt(g, g === fehlt, g === fehlt ? undefined : 'kongruenz-verwechselt')), H('E', `Bei wsw liegen die beiden Winkel an den Enden der Seite ${l}.`),
        { nachweis: [{ art: 'kongruenz', angaben: `${l} = 6 cm, ${x} = ${w1}°, ${y} = ${w2}°`, satz: 'wsw-rechnen', fehlt }] }); },
    () => { const [a, b, fall] = wahl([[100, 85, 'summe'], [95, 90, 'summe'], [120, 65, 'summe'], [3, 5, 'seiten'], [4, 6, 'seiten']]);
      if (fall === 'summe') return auswahl(`Ein Dreieck soll α = ${a}° und β = ${b}° haben. Begründe, ob man es konstruieren kann. Kreuze an.`,
        [opt(`Nein. α und β sind zusammen schon ${a + b}°, mehr als 180°.`, true), opt('Ja. Man braucht nur noch eine Seite.', false, 'winkelsumme'), opt('Ja, wenn die Seite lang genug ist.', false, 'winkelsumme')], H('E', 'Denke an die Winkelsumme.'), { nachweis: [`${a}° + ${b}° = ${a + b}°`, { art: 'urteil', stimmt: false }] });
      return auswahl(`Ein Dreieck soll die Seiten ${a} cm, ${b} cm und ${a + b} cm haben. Begründe, ob man es konstruieren kann. Kreuze an.`,
        [opt(`Nein. ${a} cm + ${b} cm = ${a + b} cm, die beiden Seiten liegen dann flach auf der dritten.`, true), opt('Ja. Mit drei Seiten geht es immer.', false, 'dreiecksungleichung'), opt('Ja, das Dreieck ist dann sehr flach.', false, 'dreiecksungleichung')],
        H('E', 'Zwei Seiten müssen zusammen länger sein als die dritte.'), { nachweis: [`${a} + ${b} = ${a + b}`, { art: 'konstruierbar', seiten: [a, b, a + b], geht: false }] }); },
  ]);
}
const R3 = (a, b, c) => `${a}° + ${b}° + ${c}° = ${a + b + c}°`;

// ---------- K2: konstruieren ----------
// Dreiecke im Gitter mit ganzzahligen Seiten: c = AB waagerecht, C = A + (x, y). Seiten in Kästchen.
const SSS = [[3, 0, 4], [3, 3, 4], [6, 3, 4], [4, 0, 3], [4, 4, 3], [8, 4, 3], [6, 0, 8], [6, 6, 8]];
function sssGitter(spiegeln = wahl([false, true])) {
  const [c, x0, y] = wahl(SSS), x = spiegeln ? c - x0 : x0, ox = zz(1, 2), oy = zz(1, 2);
  const A = [ox, oy], B = [ox + c, oy], C = [ox + x, oy + y], b = Math.hypot(x, y), a = Math.hypot(c - x, y);
  return { A, B, C, a, b, c, g: (extra = {}) => GT(ox + Math.max(c, x) + 2, oy + y + 2, extra) };
}
const hBogen = (n) => H(n, 'C ist von A so weit entfernt wie b lang ist und von B so weit wie a.', 'Der Kreis um A hat den Radius b. Auf ihm liegen alle Punkte, die von A so weit weg sind.', 'C liegt oben, wo sich die beiden Kreise schneiden.');
const SCHRITTE = {
  sss: ['Zeichne eine Planfigur und markiere die gegebenen Seiten.', 'Zeichne die Seite c von A nach B.', 'Zeichne einen Kreisbogen um A mit dem Radius b und einen um B mit dem Radius a.', 'Der Schnittpunkt der Bögen ist C. Verbinde C mit A und B.'],
  sws: ['Zeichne eine Planfigur und markiere die gegebenen Stücke.', 'Zeichne die Seite c von A nach B.', 'Trage bei A den Winkel α an.', 'Miss auf dem freien Schenkel die Länge b ab. So erhältst du C. Verbinde C mit B.'],
  wsw: ['Zeichne eine Planfigur und markiere die gegebenen Stücke.', 'Zeichne die Seite c von A nach B.', 'Trage bei A den Winkel α und bei B den Winkel β an.', 'Der Schnittpunkt der beiden freien Schenkel ist C.'],
};
const runde = (x) => Math.round(x);
// Heftaufgabe: konstruieren und einen Kontrollwert messen. gesucht: Seite (mm) oder Winkel (°).
// Heftaufgabe mit Maßstab: Der Nachweis rechnet die Längen aus der Wirklichkeit (m) in die Zeichnung (cm) um.
function massstab(a, m, seiten) {
  const k = m / 100;
  a.nachweis.push({ zahl: m, grund: `Maßstab 1 : ${m}` }, ...seiten.flatMap((x) => [{ zahl: x * k * 100, grund: `${x * k} m = ${x * k * 100} cm` }, `${x * k * 100} : ${m} = ${x}`]));
  return a;
}
function heft(n, art, gesucht, kontext, vorgabe) {
  let E, gegeben;
  if (vorgabe) { gegeben = vorgabe; E = art === 'sss' ? dreieckSss(vorgabe.a, vorgabe.b, vorgabe.c) : art === 'sws' ? dreieckSws(vorgabe.b, vorgabe.c, vorgabe.α) : dreieckWsw(vorgabe.c, vorgabe.α, vorgabe.β); }
  else if (art === 'sss') { const [a, b, c] = suche(() => [zz(4, 8), zz(4, 8), zz(5, 9)], ([p, q, r]) => p + q > r + 1.5 && p + r > q + 1.5 && q + r > p + 1.5 && new Set([p, q, r]).size >= 2); E = dreieckSss(a, b, c); gegeben = { a, b, c }; }
  else if (art === 'sws') { const b = zz(4, 7), c = zz(5, 8), al = winkelFuer(n === 'G' ? 'G' : 'M', 35, 110); E = dreieckSws(b, c, al); gegeben = { b, c, α: al }; }
  else { const c = zz(5, 8), al = winkelFuer(n === 'G' ? 'G' : 'M', 35, 75), be = winkelFuer(n === 'G' ? 'G' : 'M', 35, 75); E = dreieckWsw(c, al, be); gegeben = { c, α: al, β: be }; }
  const istWinkel = ['α', 'β', 'γ'].includes(gesucht), wert = istWinkel ? runde(winkelBei(E, { α: 'A', β: 'B', γ: 'C' }[gesucht])) : runde(seiteVon(E, gesucht) * 10);
  const liste = Object.entries(gegeben).map(([k, v]) => (['α', 'β', 'γ'].includes(k) ? `${k} = ${v}°` : `${k} = ${cm(v)}`)).join(', ');
  const text = kontext ? kontext(liste) : Z('Konstruiere im Heft ein Dreieck.', `Gegeben: ${liste}.`, istWinkel ? `Miss dann den Winkel ${gesucht}.` : `Miss dann die Seite ${gesucht} in Millimetern.`);
  return zahl(text, wert, [], H(n, `Beginne mit einer Planfigur. Die Konstruktion geht nach ${art}.`, SCHRITTE[art][1], SCHRITTE[art][2]),
    { einheit: istWinkel ? '°' : 'mm', toleranz: 2, bild: planfigur({ ...gegeben, E }), nachweis: [{ art: 'heft', gegeben, gesucht, satz: art }] });
}
function k2() {
  const tippC = (n, text, mitKreisen = true) => { const t = sssGitter();
    return gitterPunkte(text(t), t.g({ punkte: [PT('A', ...t.A), PT('B', ...t.B)], linien: [LN('c', t.A, t.B, 'strecke')], kreise: mitKreisen ? [{ m: t.A, r: t.b }, { m: t.B, r: t.a }] : [] }), [t.C], [[[[t.C[0], 2 * t.A[1] - t.C[1]]], 'innen-aussen-verwechselt']].filter(([p]) => p[0][1] >= 0),
      hBogen(n), { nachweis: [{ art: 'ort', bedingungen: [{ art: 'abstand', von: t.A, r: t.b }, { art: 'abstand', von: t.B, r: t.a }, { art: 'ueber', a: t.A, b: t.B }] }] }); };
  const wswGitter = (n, text) => { const [u, v, C0] = wahl([[[1, 1], [-1, 1], [3, 3]], [[1, 2], [-1, 1], [2, 4]], [[2, 1], [-1, 1], [4, 2]], [[1, 1], [-1, 2], [4, 4]], [[1, 1], [-1, 3], [3, 3]], [[3, 2], [-1, 2], [3, 2]], [[1, 3], [-2, 1], [2, 6]]]);
    const ox = zz(1, 2), A = [ox, 1], C = [A[0] + C0[0], A[1] + C0[1]], t = (C[1] - A[1]) / v[1], B = [C[0] - t * v[0], A[1]];
    if (!Number.isInteger(B[0]) || B[0] <= A[0] + 1) return null;
    const ende = (P, d) => [P[0] + d[0] * Math.ceil((C[1] - P[1] + 2) / d[1]), P[1] + d[1] * Math.ceil((C[1] - P[1] + 2) / d[1])];
    const EA = ende(A, u), EB = ende(B, v);
    if ([EA, EB].some((p) => p[0] < 0)) return null;
    return gitterPunkte(text, GT(Math.max(B[0], EA[0], EB[0]) + 1, Math.max(EA[1], EB[1]) + 1, { punkte: [PT('A', ...A), PT('B', ...B)], linien: [LN('c', A, B, 'strecke'), LN(null, A, EA, 'strahl'), LN(null, B, EB, 'strahl')] }), [C], [],
      H(n, 'Die beiden Winkel sind schon an A und an B angetragen.', 'C liegt auf beiden freien Schenkeln.', 'Folge beiden Schenkeln bis zu ihrem Schnittpunkt.'), { nachweis: [{ art: 'ort', bedingungen: [{ art: 'auf', a: A, b: EA }, { art: 'auf', a: B, b: EB }] }] }); };
  sechs(K2, 'F', [
    () => tippC('F', (t) => Z('Die Seite c ist schon gezeichnet.', `Der Kreis um A hat den Radius b = ${t.b} Kästchen.`, `Der Kreis um B hat den Radius a = ${t.a} Kästchen.`, 'Tippe die Ecke C oberhalb von c an.')),
    () => ordnen(Z('Ein Dreieck aus drei Seiten wird konstruiert.', 'Bringe die Schritte in die richtige Reihenfolge.'), SCHRITTE.sss, H('F', 'Zuerst kommt immer die Planfigur.', 'Danach zeichnest du die erste Seite.', 'Die Kreisbögen brauchen A und B.'), { bild: planfigur(angaben('sss', 'F')) }),
    () => wswGitter('F', Z('An A und B sind die Winkel schon angetragen.', 'Tippe die Ecke C an.')),
    () => tippC('F', (t) => Z('Die Kreise um A und B sind schon gezeichnet.', 'C liegt auf beiden Kreisen.', 'Tippe C oberhalb von c an.')),
    () => ordnen(Z('Ein Dreieck aus einer Seite und zwei Winkeln wird konstruiert.', 'Bringe die Schritte in die richtige Reihenfolge.'), SCHRITTE.wsw, H('F', 'Zuerst kommt die Planfigur.', 'Die Winkel trägst du an den Enden der Seite c an.', 'Zuletzt findest du C.'), { bild: planfigur(angaben('wsw', 'F')) }),
    () => { const t = sssGitter();
      return gitterLinie(Z('Die Ecken A, B und C sind schon da.', 'Zeichne die Seite b ein.'), t.g({ punkte: [PT('A', ...t.A), PT('B', ...t.B), PT('C', ...t.C)], linien: [LN('c', t.A, t.B, 'strecke'), LN('a', t.B, t.C, 'strecke')] }), 'strecke', { art: 'strecke', a: t.A, b: t.C }, [t.A, t.C],
        [[{ art: 'strecke', a: t.A, b: t.B }, 'seite-ecke-vertauscht']], H('F', 'Die Seite b liegt der Ecke B gegenüber.', 'Die Seite a verbindet B und C.', 'Verbinde A mit C.')); },
  ]);
  sechs(K2, 'G', [
    () => tippC('G', (t) => Z(`Die Kreise haben die Radien b = ${t.b} und a = ${t.a} Kästchen.`, 'Tippe die Ecke C oberhalb von c an.')),
    () => ordnen(Z('Ein Dreieck aus zwei Seiten und dem Winkel dazwischen wird konstruiert.', 'Bringe die Schritte in die richtige Reihenfolge.'), SCHRITTE.sws, H('G', 'Zuerst kommt die Planfigur.', 'Den Winkel α trägst du an der Ecke A an.', 'Die Länge b misst du auf dem freien Schenkel ab.'), { bild: planfigur(angaben('sws', 'F')) }),
    () => heft('G', 'sss', wahl(['α', 'β', 'γ'])),
    () => wswGitter('G', Z('An A und B sind die Winkel angetragen.', 'Tippe die Ecke C an.')),
    () => heft('G', 'wsw', wahl(['a', 'b'])),
    () => { const k = kind(), r = wahl(['a', 'c']);
      return auswahl(Z('Gegeben sind a, b und c.', `${k} hat c gezeichnet und zieht einen Kreis um A mit dem Radius ${r}.`, 'Kreuze die richtige Begründung an.'),
        [opt('Das ist falsch. Um A gehört der Radius b, denn b verbindet A und C.', true), opt('Das ist richtig. Der Radius ist egal.', false, 'seite-ecke-vertauscht'), opt(`Das ist richtig. ${r} ist die längste Seite.`, false, 'seite-ecke-vertauscht')],
        H('G', 'Welche Seite geht von A nach C?', 'Die Seite b liegt B gegenüber. Sie verbindet A und C.', 'Der Kreis um A zeigt alle Punkte im Abstand b von A.'), { nachweis: [{ art: 'name', seite: 'b', ecken: ['A', 'C'] }, { art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(K2, 'M', [
    () => { const t = sssGitter(), r3 = suche(() => zz(2, 5), (x) => x !== t.a && x !== t.b);
      return gitterPunkte(`Konstruiere das Dreieck ABC mit c = ${t.c}, b = ${t.b} und a = ${t.a} Kästchen. Drei Kreise sind vorgegeben. Tippe die Ecke C oberhalb von c an.`,
        t.g({ punkte: [PT('A', ...t.A), PT('B', ...t.B)], linien: [LN('c', t.A, t.B, 'strecke')], kreise: mische([{ m: t.A, r: t.b }, { m: t.B, r: t.a }, { m: wahl([t.A, t.B]), r: r3 }]) }), [t.C], [],
        hBogen('M'), { nachweis: [{ art: 'ort', bedingungen: [{ art: 'abstand', von: t.A, r: t.b }, { art: 'abstand', von: t.B, r: t.a }, { art: 'ueber', a: t.A, b: t.B }] }, { zahl: t.c, grund: 'c = AB ist schon gezeichnet' }] }); },
    () => heft('M', 'sws', 'a'),
    () => { const m = wahl([1000, 500, 2000]), [a, b, c] = suche(() => [zz(4, 8), zz(4, 8), zz(5, 9)], ([p, q, r]) => p + q > r + 1.5 && p + r > q + 1.5 && q + r > p + 1.5), k = m / 100;
      return massstab(heft('M', 'sss', 'γ', () => `Ein See soll vermessen werden. Die Punkte A, B und C am Ufer sind BC = ${a * k} m, AC = ${b * k} m und AB = ${c * k} m voneinander entfernt. Zeichne im Maßstab 1 : ${m} und miss den Winkel γ.`, { a, b, c }), m, [a, b, c]); },
    () => ordnen('Ein Dreieck aus einer Seite und den beiden anliegenden Winkeln wird konstruiert. Bringe die Schritte in die richtige Reihenfolge.', SCHRITTE.wsw, H('M', 'Ohne die Seite c gibt es keine Ecken, an denen du Winkel antragen kannst.', 'Planfigur, dann c, dann beide Winkel, dann C als Schnittpunkt.')),
    () => auswahl('Die beiden Kreisbögen um A und B schneiden sich oberhalb und unterhalb von c. Wie viele verschiedene Dreiecke gibt es? Kreuze die richtige Antwort an.',
      [opt('Zwei Lagen, aber sie sind kongruent. Es gibt also nur ein Dreieck.', true), opt('Zwei verschiedene Dreiecke.', false, 'kongruenz-verwechselt'), opt('Keins, weil es zwei Schnittpunkte gibt.', false, 'kongruenz-verwechselt'), opt('Unendlich viele.', false, 'kongruenz-verwechselt')],
      H('M', 'Spiegle das untere Dreieck an c.', 'Das gespiegelte Dreieck hat dieselben drei Seiten. Es ist also kongruent.'), { nachweis: [{ art: 'kongruenz', angaben: 'a, b, c', satz: 'sss' }, { art: 'urteil', stimmt: true }] }),
    () => { const k = kind(), fehler = wahl(['winkel', 'kreis']);
      return auswahl(fehler === 'winkel' ? `${k} soll ein Dreieck mit c, α und β zeichnen. Zuerst trägt ${k} den Winkel α an, danach zeichnet ${k} die Seite c. Erkläre den Fehler. Kreuze an.`
        : `${k} soll ein Dreieck aus a, b und c zeichnen. Zuerst zieht ${k} die beiden Kreise, danach zeichnet ${k} die Seite c. Erkläre den Fehler. Kreuze an.`,
      [opt(fehler === 'winkel' ? 'Ohne die Seite c gibt es keinen Schenkel, an dem man α antragen kann.' : 'Ohne die Seite c fehlen die Punkte A und B als Mittelpunkte der Kreise.', true), opt('Die Reihenfolge ist egal.', false, 'konstruktion-reihenfolge'), opt('Man muss mit C beginnen.', false, 'konstruktion-reihenfolge'), opt('Es fehlt nur die Planfigur am Ende.', false, 'konstruktion-reihenfolge')],
      H('M', 'Prüfe jeden Schritt: Gibt es schon alles, was er braucht?', 'Zuerst braucht man die Seite c. Erst dann gibt es A und B.'), { nachweis: [{ art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(K2, 'E', [
    () => heft('E', 'sws', wahl(['β', 'γ'])),
    () => { const m = wahl([1000, 2000, 5000]), k = m / 100, c = zz(5, 8), al = winkelFuer('M', 35, 70), be = winkelFuer('M', 35, 70);
      return massstab(heft('E', 'wsw', 'b', () => `Von zwei Punkten A und B am Ufer, ${c * k} m voneinander entfernt, wird ein Baum C auf einer Insel angepeilt: α = ${al}°, β = ${be}°. Zeichne im Maßstab 1 : ${m} und gib die Länge von b in der Zeichnung in Millimetern an.`, { c, α: al, β: be }), m, [c]); },
    () => { const c = zz(5, 8), al = winkelFuer('M', 35, 70), ga = winkelFuer('M', 40, 80), be = 180 - al - ga; if (be < 30) return null;
      const E = dreieckWsw(c, al, be), wert = runde(seiteVon(E, 'a') * 10);
      return zahl(`Konstruiere im Heft ein Dreieck mit c = ${cm(c)}, α = ${al}° und γ = ${ga}°. Miss dann die Seite a in Millimetern.`, wert, [], H('E', 'Berechne zuerst β. Dann geht es mit wsw.'),
        { einheit: 'mm', toleranz: 2, nachweis: [`180° − ${al}° − ${ga}° = ${be}°`, { art: 'heft', gegeben: { c, α: al, γ: ga }, gesucht: 'a', satz: 'wsw' }] }); },
    () => { const [a, b] = wahl([[3, 4], [2, 5], [3, 5], [4, 4], [2, 6]]), c = a + b + zz(0, 2), k = kind();
      return auswahl(`${k} will ein Dreieck mit a = ${cm(a)}, b = ${cm(b)} und c = ${cm(c)} konstruieren. Die Kreisbögen um A und B treffen sich nicht. Erkläre, woran das liegt. Kreuze an.`,
        [opt(`a + b = ${a + b} cm ist nicht länger als c = ${c} cm. Das Dreieck gibt es nicht.`, true), opt('Die Bögen sind zu kurz gezeichnet.', false, 'dreiecksungleichung'), opt('Man muss mit der Seite a beginnen.', false, 'konstruktion-reihenfolge'), opt('Der Zirkel ist verrutscht.', false, 'dreiecksungleichung')],
        H('E', 'Vergleiche a + b mit c.'), { nachweis: [`${a} + ${b} = ${a + b}`, { art: 'konstruierbar', seiten: [a, b, c], geht: false }] }); },
    () => { const s = wahl([1, -1]), ox = s > 0 ? 1 : 9, A = [ox, 1], B = [ox + 7 * s, 1], C1 = [ox + 3 * s, 4], C2 = [ox + 4 * s, 5], ende = [ox + 6 * s, 7];
      return gitterPunkte('Gegeben sind c = AB, der Winkel α (der Strahl von A aus) und a = 5 Kästchen (der Kreis um B). Tippe alle Punkte an, die als Ecke C in Frage kommen.',
        GT(10, 8, { punkte: [PT('A', ...A), PT('B', ...B)], linien: [LN('c', A, B, 'strecke'), LN(null, A, ende, 'strahl')], kreise: [{ m: B, r: 5 }] }), [C1, C2], [[[C1], 'kongruenz-verwechselt'], [[C2], 'kongruenz-verwechselt']],
        H('E', 'C liegt auf dem Strahl und auf dem Kreis. Zähle die Schnittpunkte.'), { nachweis: [{ art: 'ort', bedingungen: [{ art: 'abstand', von: B, r: 5 }, { art: 'auf', a: A, b: ende }] }] }); },
    () => auswahl('Gegeben sind b, c und γ, und c ist kürzer als b. Begründe, warum es zwei verschiedene Dreiecke geben kann. Kreuze an.',
      [opt('Der Kreis um A mit dem Radius c kann den freien Schenkel von γ zweimal schneiden.', true), opt('Weil sws immer zwei Lösungen hat.', false, 'kongruenz-verwechselt'), opt('Weil man das Dreieck spiegeln kann.', false, 'kongruenz-verwechselt'), opt('Weil γ zwischen b und c liegt.', false, 'kongruenz-verwechselt')],
      H('E', 'Zeichne zuerst b und γ bei C, dann einen Kreis um A.'), { nachweis: [{ art: 'kongruenz', angaben: 'b, c, γ mit c < b', satz: 'SsW-kurz' }, { art: 'urteil', stimmt: true }] }),
  ]);
}

export function konstruieren() { k1(); k2(); }
