// Aufgaben zu 7.2.3 „Dreiecksformen“ (Lernziele D1 und D2) nach ADR 0015 und ADR 0044.
// Grilling mit Nils (2026-11-25): Ecken gegen den Uhrzeigersinn A, B, C, die Seite a liegt A gegenüber, α liegt bei A.
// Basis, Schenkel, Spitze und Basiswinkel ab G. Den Basiswinkelsatz gibt es erst ab M: Auf G sind gleich große Winkel markiert.
// D1: nach Seiten und Winkeln einteilen, richtig beschriften. D2: gleichschenklige und gleichseitige Dreiecke, Basiswinkelsatz.
import { sechs } from '../werkzeug.mjs';
import { zz, wahl, suche, mische, figur, dreieckAus, dreieckBild, dreieckSss, dreieckFigur, plus, vek, cm, WERT, GESUCHT, NAME, H, grad, zahl, auswahl, opt, luecken, lk, Z, sach, teilWahl, zuordnen, ordnen, FIG, R, winkelFuer, dreiWinkel, drehFuer, kind, gitterBild, GT, PT, FG } from './7-2-figur.mjs';

const D1 = '7.2.3-D1', D2 = '7.2.3-D2';
const WART = { spitz: 'spitzwinklig', recht: 'rechtwinklig', stumpf: 'stumpfwinklig' };
const SART = { seitig: 'gleichseitig', schenklig: 'gleichschenklig', un: 'unregelmäßig' };
const winkelArt = (w) => (Math.max(...w) === 90 ? 'recht' : Math.max(...w) > 90 ? 'stumpf' : 'spitz');
const seitenArt = (w) => { const g = (w[0] === w[1]) + (w[1] === w[2]) + (w[0] === w[2]); return g === 3 ? 'seitig' : g ? 'schenklig' : 'un'; };
const wOptionen = (art) => Object.entries(WART).map(([k, t]) => opt(t, k === art, k === art ? undefined : 'dreieck-art'));
const sOptionen = (art) => Object.entries(SART).map(([k, t]) => opt(t, k === art, k === art ? undefined : art === 'seitig' && k === 'schenklig' ? 'dreieck-sonderfall' : 'dreieck-art'));
// Winkel für eine verlangte Art nach Winkeln (Seiten unregelmäßig).
function winkelFuerArt(n, art) {
  return suche(() => { const a = winkelFuer(n, 25, 80); const b = art === 'recht' ? 90 : art === 'stumpf' ? winkelFuer(n, 100, 130) : winkelFuer(n, 40, 85); return mische([a, b, 180 - a - b]); },
    (w) => Math.min(...w) >= 20 && winkelArt(w) === art && seitenArt(w) === 'un' && (art !== 'spitz' || Math.max(...w) <= 85) && Math.abs(w[0] - w[1]) >= 8 && Math.abs(w[1] - w[2]) >= 8 && Math.abs(w[0] - w[2]) >= 8);
}
const alleWerte = (w) => ({ A: WERT(w[0]), B: WERT(w[1]), C: WERT(w[2]) });
// Gleichschenkliges Dreieck mit Basis AB: Basiswinkel b, Spitze bei C.
const gsBild = (b, dreh, zeige, o = {}) => dreieckBild(dreieckAus(b, b, dreh, 5), zeige, { gleich: o.ohneStriche ? {} : { a: 1, b: 1 }, ...o });
const hBegriffe = (n) => H(n, 'Im gleichschenkligen Dreieck sind zwei Seiten gleich lang. Das sind die Schenkel. Die dritte Seite ist die Basis.', 'Die Ecke gegenüber der Basis heißt Spitze.', 'Suche die Seite ohne Strich.');

// ---------- D1: einteilen und beschriften ----------
function d1() {
  const hWinkel = (n) => H(n, 'Schau auf den größten Winkel.', 'Ist er 90°, ist das Dreieck rechtwinklig. Ist er größer, ist es stumpfwinklig.', 'Vergleiche den größten Winkel mit 90°.');
  const hSeiten = (n) => H(n, 'Zähle, wie viele Seiten gleich lang sind.', 'Drei gleich lange Seiten: gleichseitig. Zwei: gleichschenklig.', 'Vergleiche die Längen paarweise.');
  const hName = (n) => H(n, 'Die Seite a liegt der Ecke A gegenüber. Der Winkel α liegt bei A.', 'Die Seite zwischen A und B liegt C gegenüber. Sie heißt c.', 'Welche Ecke liegt der Seite gegenüber?');
  const nachWinkeln = (n, text) => { const art = wahl(['spitz', 'recht', 'stumpf']), w = winkelFuerArt(n, art);
    return auswahl(text, wOptionen(art), hWinkel(n), { bild: dreieckBild(dreieckAus(w[0], w[1], drehFuer(n)), alleWerte(w)), nachweis: [{ art: 'klasse', winkel: w, nach: 'winkel' }] }); };
  // Seiten in Zentimetern, passend zur verlangten Art; das Bild ist maßstabsgetreu.
  const seitenFuer = (art) => suche(() => (art === 'seitig' ? [zz(3, 6), 0, 0].map((x, i, l) => l[0]) : art === 'schenklig' ? (() => { const s = zz(4, 7), b = zz(3, 8); return mische([s, s, b]); })() : [zz(3, 8), zz(3, 8), zz(3, 8)]),
    (s) => seitenArtL(s) === art && s[0] + s[1] > s[2] + 0.8 && s[1] + s[2] > s[0] + 0.8 && s[0] + s[2] > s[1] + 0.8);
  const seitenArtL = seitenArt;
  const nachSeiten = (n, text, striche = false) => { const art = wahl(['seitig', 'schenklig', 'un', 'un', 'schenklig']), [a, b, c] = seitenFuer(art);
    const E = dreieckSss(a, b, c, n === 'F' ? 0 : drehFuer(n)), gl = striche ? { a: a === b || a === c ? 1 : 0, b: b === a || b === c ? 1 : 0, c: c === a || c === b ? 1 : 0 } : {};
    return auswahl(text, sOptionen(art), hSeiten(n), { bild: dreieckFigur(E, striche ? { gleich: gl } : { m: { a: cm(a), b: cm(b), c: cm(c) } }), nachweis: [{ art: 'klasse', seiten: [a, b, c], nach: 'seiten' }] }); };
  sechs(D1, 'F', [
    () => nachWinkeln('F', Z('Schau dir die Winkel an.', 'Wie heißt das Dreieck nach seinen Winkeln?', 'Kreuze an.')),
    () => nachSeiten('F', Z('Schau dir die Seiten an.', 'Wie heißt das Dreieck nach seinen Seiten?', 'Kreuze an.')),
    () => { const [p, q, s] = wahl([['B', 'C', 'a'], ['A', 'C', 'b'], ['A', 'B', 'c']]), w = dreiWinkel('F', { max: 85 });
      return auswahl(Z(`Die dicke Seite geht von ${p} nach ${q}.`, 'Wie heißt sie?', 'Kreuze an.'), ['a', 'b', 'c'].map((x) => opt(x, x === s, x === s ? undefined : 'seite-ecke-vertauscht')), hName('F'),
        { bild: dreieckBild(dreieckAus(w[0], w[1], 0), {}, { extra: { linien: [[p, q, { stil: 'dick' }]] } }), nachweis: [{ art: 'name', seite: s, ecken: [p, q] }] }); },
    () => { const [e, g] = wahl([['A', 'α'], ['B', 'β'], ['C', 'γ']]), w = dreiWinkel('F', { max: 85 });
      return auswahl(Z(`Der Winkel ${g} ist im Bild markiert.`, 'An welcher Ecke liegt er?', 'Kreuze an.'), ['A', 'B', 'C'].map((x) => opt(x, x === e, x === e ? undefined : 'seite-ecke-vertauscht')), hName('F'),
        { bild: dreieckBild(dreieckAus(w[0], w[1], 0), { [e]: NAME(g) }), nachweis: [{ art: 'name', winkel: g, ecke: e }] }); },
    () => { const art = wahl(['spitz', 'recht', 'stumpf']), w = winkelFuerArt('F', art);
      return sach(Z('Teile das Dreieck zweimal ein.', 'Kreuze jedes Mal an.'), [teilWahl('antwort', 'Nach den Winkeln ist es', wOptionen(art)), teilWahl('antwort', 'Nach den Seiten ist es', sOptionen('un'))],
        H('F', 'Schau zuerst auf den größten Winkel. Vergleiche dann die Seiten.', 'Sind alle Winkel verschieden, sind auch alle Seiten verschieden lang.', 'Vergleiche den größten Winkel mit 90°.'),
        { bild: dreieckBild(dreieckAus(w[0], w[1], 0), alleWerte(w)), nachweis: [{ art: 'klasse', winkel: w, nach: 'winkel', teil: 0 }, { art: 'klasse', winkel: w, nach: 'seiten', teil: 1 }] }); },
    () => { const a = 10 * zz(3, 6), w = [a, 90, 90 - a];
      return auswahl(Z('Ein Geodreieck hat einen rechten Winkel.', 'Wie heißt das Dreieck nach seinen Winkeln?', 'Kreuze an.'), wOptionen('recht'), hWinkel('F'),
        { bild: dreieckBild(dreieckAus(w[0], 90, 0, 4), alleWerte(w), { titel: 'Dreieck mit rechtem Winkel' }), nachweis: [{ art: 'klasse', winkel: w, nach: 'winkel' }] }); },
  ]);
  sechs(D1, 'G', [
    () => nachWinkeln('G', Z('Wie heißt das Dreieck nach seinen Winkeln?', 'Kreuze an.')),
    () => nachSeiten('G', Z('Gleich lange Seiten haben gleich viele Striche.', 'Wie heißt das Dreieck nach seinen Seiten?', 'Kreuze an.'), true),
    () => { const art = wahl(['spitz', 'recht', 'stumpf']), w = winkelFuerArt('G', art);
      return sach(Z('Teile das Dreieck nach Winkeln und nach Seiten ein.', 'Kreuze an.'), [teilWahl('antwort', 'Nach den Winkeln:', wOptionen(art)), teilWahl('antwort', 'Nach den Seiten:', sOptionen('un'))],
        H('G', 'Schau zuerst auf den größten Winkel. Vergleiche dann die Winkel.', 'Verschieden große Winkel gehören zu verschieden langen Seiten.', 'Vergleiche den größten Winkel mit 90°.'),
        { bild: dreieckBild(dreieckAus(w[0], w[1], drehFuer('G')), alleWerte(w)), nachweis: [{ art: 'klasse', winkel: w, nach: 'winkel', teil: 0 }, { art: 'klasse', winkel: w, nach: 'seiten', teil: 1 }] }); },
    () => { const [e, s] = wahl([['A', 'a'], ['B', 'b'], ['C', 'c']]), w = dreiWinkel('G', { max: 85 });
      return auswahl(Z(`Welche Seite liegt der Ecke ${e} gegenüber?`, 'Kreuze an.'), ['a', 'b', 'c'].map((x) => opt(x, x === s, x === s ? undefined : 'seite-ecke-vertauscht')), hName('G'),
        { bild: dreieckBild(dreieckAus(w[0], w[1], drehFuer('G'))), nachweis: [{ art: 'name', seite: s, ecke: e }] }); },
    () => { const b = 5 * zz(9, 15), w = [b, b, 180 - 2 * b], art = winkelArt(w);
      return auswahl(Z('Welche Namen passen zum Dreieck?', 'Kreuze alle an.'), [opt('gleichschenklig', true), opt(WART[art], true), opt('gleichseitig', false, 'dreieck-sonderfall'), ...[wahl(Object.entries(WART).filter(([k]) => k !== art))].map(([, t]) => opt(t, false, 'dreieck-art'))],
        H('G', 'Ein Dreieck hat einen Namen nach den Seiten und einen nach den Winkeln.', 'Zwei gleich lange Seiten: gleichschenklig.', 'Schau dann auf den größten Winkel.'),
        { mehrfach: true, bild: gsBild(b, drehFuer('G'), alleWerte(w)), nachweis: [{ art: 'klasse', winkel: w, nach: 'beide' }] }); },
    () => { const k = kind(), [frage, ja, grund] = wahl([['rechtwinklig und gleichschenklig', true, 'Die beiden anderen Winkel sind dann je 45°.'], ['stumpfwinklig und gleichschenklig', true, 'Zum Beispiel mit den Winkeln 120°, 30° und 30°.'],
      ['rechtwinklig und gleichseitig', false, 'Im gleichseitigen Dreieck ist jeder Winkel 60°.'], ['stumpfwinklig und gleichseitig', false, 'Im gleichseitigen Dreieck ist jeder Winkel 60°.']]);
      return auswahl(Z(`${k} fragt: „Kann ein Dreieck ${frage} sein?“`, 'Kreuze die richtige Antwort an.'),
        [opt(`${ja ? 'Ja' : 'Nein'}. ${grund}`, true), opt(`${ja ? 'Nein' : 'Ja'}. Jedes Dreieck kann jede Form haben.`, false, 'dreieck-art'), opt(`${ja ? 'Nein. Ein Dreieck hat immer nur einen Namen.' : 'Ja. Man muss es nur groß genug zeichnen.'}`, false, 'dreieck-sonderfall')],
        H('G', 'Überlege, wie groß die Winkel dann sein müssten.', 'Im gleichseitigen Dreieck sind alle drei Winkel gleich groß.', 'Gleich große Winkel: 180° : 3 = 60°.'), { nachweis: [{ art: 'urteil', stimmt: ja }, ...({ 45: ['180° − 90° = 90°', '90° : 2 = 45°'], 120: ['180° − 120° = 60°', '60° : 2 = 30°'], 60: ['180° : 3 = 60°'] }[grund.match(/(45|120|60)°/)[1]])] }); },
  ]);
  sechs(D1, 'M', [
    () => { const w = wahl([[45, 45, 90], [30, 30, 120], [40, 40, 100], [70, 70, 40], [60, 60, 60], [35, 55, 90], [25, 35, 120], [50, 60, 70], [20, 20, 140], [65, 65, 50], [36, 54, 90], [28, 28, 124]]);
      return sach(`Ein Dreieck hat die Winkel ${w[0]}°, ${w[1]}° und ${w[2]}°. Teile es ein.`, [teilWahl('antwort', 'Nach den Winkeln:', wOptionen(winkelArt(w))), teilWahl('antwort', 'Nach den Seiten:', sOptionen(seitenArt(w)))],
        H('M', 'Gleich große Winkel liegen gleich langen Seiten gegenüber.', 'Zwei gleiche Winkel: gleichschenklig. Drei gleiche Winkel: gleichseitig.'), { nachweis: [{ art: 'klasse', winkel: w, nach: 'winkel', teil: 0 }, { art: 'klasse', winkel: w, nach: 'seiten', teil: 1 }] }); },
    () => { const [p, q, r] = wahl([['K', 'L', 'M'], ['P', 'Q', 'R'], ['R', 'S', 'T'], ['D', 'E', 'F'], ['U', 'V', 'W']]), [x, y, s] = wahl([[p, q, r], [q, r, p], [p, r, q]]), kl = (z) => z.toLowerCase();
      return auswahl(`Das Dreieck heißt ${p}${q}${r}. Die Seiten heißen wie die gegenüberliegenden Ecken, nur klein. Wie heißt die Seite zwischen ${x} und ${y}? Kreuze an.`, [p, q, r].map((z) => opt(kl(z), z === s, z === s ? undefined : 'seite-ecke-vertauscht')),
        H('M', 'Welche Ecke gehört nicht zur Seite? Ihr Name, klein geschrieben, ist der Name der Seite.', `Zwischen ${x} und ${y} liegt die Seite gegenüber von ${s}.`), { nachweis: [{ art: 'name', seite: kl(s), ecken: [x, y], dreieck: [p, q, r] }] }); },
    () => auswahl('Welche Dreiecke gibt es nicht? Kreuze alle an.', [opt('rechtwinklig und gleichseitig', true), opt('stumpfwinklig und gleichseitig', true), opt('rechtwinklig und gleichschenklig', false, 'dreieck-art'), opt('stumpfwinklig und gleichschenklig', false, 'dreieck-art'), opt(wahl(['spitzwinklig und unregelmäßig', 'stumpfwinklig und unregelmäßig', 'rechtwinklig und unregelmäßig']), false, 'dreieck-art')],
      H('M', 'Im gleichseitigen Dreieck ist jeder Winkel 60°.', 'Rechtwinklig und gleichschenklig: 90°, 45°, 45°.'), { mehrfach: true, nachweis: ['180° : 3 = 60°', { art: 'urteil', stimmt: false }] }),
    () => nachWinkeln('M', 'Wie heißt das Dreieck nach seinen Winkeln? Kreuze an.'),
    () => { const [a, b] = wahl([[5, 7], [6, 4], [4, 6], [7, 5], [5, 8], [6, 9]]), E = dreieckSss(b, a, a, drehFuer('M'));
      // Die Schenkel sind b und c, die Basis ist a.
      return sach(`Im Dreieck ABC ist b = c = ${cm(a)} und a = ${cm(b)}. Teile es nach den Seiten ein und gib die Basis an.`, [teilWahl('antwort', 'Nach den Seiten:', sOptionen('schenklig')), teilWahl('antwort', 'Die Basis ist', ['a', 'b', 'c'].map((x) => opt(x, x === 'a', x === 'a' ? undefined : 'basiswinkel-falsch')))],
        H('M', 'Die Basis ist die Seite, die nicht so lang ist wie die beiden anderen.', `b und c sind gleich lang. Also ist a die Basis.`), { bild: dreieckFigur(E, { m: { a: cm(b), b: cm(a), c: cm(a) } }), nachweis: [{ art: 'klasse', seiten: [b, a, a], nach: 'seiten', teil: 0 }, { art: 'name', seite: 'a', basis: true, teil: 1 }] }); },
    () => { const k = kind(), [satz, stimmt, richtig, falsch] = wahl([
      ['Ein gleichseitiges Dreieck ist kein gleichschenkliges Dreieck.', false, 'Es hat sogar drei gleich lange Seiten. Also hat es auch zwei.', 'dreieck-sonderfall'],
      ['Ein rechtwinkliges Dreieck kann auch stumpfwinklig sein.', false, 'Zwei Winkel von 90° und mehr ergeben schon über 180°.', 'winkelsumme'],
      ['Jedes gleichseitige Dreieck ist spitzwinklig.', true, 'Jeder Winkel ist 60°, also kleiner als 90°.', 'dreieck-art']]);
      return auswahl(`${k} sagt: „${satz}“ Überprüfe die Aussage. Kreuze die richtige Antwort an.`,
        [opt(`${stimmt ? 'Stimmt' : 'Stimmt nicht'}. ${richtig}`, true), opt(`${stimmt ? 'Stimmt nicht' : 'Stimmt'}. Ein Dreieck hat nur einen Namen.`, false, falsch), opt(`${stimmt ? 'Stimmt nicht. Das hängt von der Größe ab.' : 'Stimmt. Das sieht man an der Zeichnung.'}`, false, 'dreieck-art')],
        H('M', 'Denke an die Winkelsumme und an die Bedeutung der Namen.', 'Prüfe die Aussage an einem Beispiel mit Winkeln, die zusammen 180° ergeben.'), { nachweis: [{ art: 'urteil', stimmt }, ...(stimmt ? ['180° : 3 = 60°'] : [])] }); },
  ]);
  sechs(D1, 'E', [
    () => { const g = suche(() => zz(20, 140), (x) => x % 2 === 0 && x !== 60 && x !== 90), b = (180 - g) / 2, w = [b, b, g];
      return sach(`Im Dreieck ABC ist α = β und γ = ${g}°. Teile es nach Seiten und Winkeln ein.`, [teilWahl('antwort', 'Nach den Winkeln:', wOptionen(winkelArt(w))), teilWahl('antwort', 'Nach den Seiten:', sOptionen('schenklig'))],
        H('E', 'Berechne zuerst α und β.'), { nachweis: [R(`180° − ${g}° = ${180 - g}°`), `${180 - g}° : 2 = ${b}°`, { art: 'klasse', winkel: w, nach: 'winkel', teil: 0 }, { art: 'klasse', winkel: w, nach: 'seiten', teil: 1 }] }); },
    () => { const x = wahl([100, 110, 120, 130, 95, 105, 140]);
      return auswahl(`Ein Dreieck hat einen Winkel von ${x}°. Welche Namen sind für das Dreieck möglich? Kreuze alle an.`, [opt('stumpfwinklig', true), opt('gleichschenklig', true), opt('unregelmäßig', true), opt('rechtwinklig', false, 'dreieck-art'), opt('gleichseitig', false, 'dreieck-sonderfall'), opt('spitzwinklig', false, 'dreieck-art')],
        H('E', 'Probiere: Wie groß können die anderen beiden Winkel sein?'), { mehrfach: true, nachweis: [R(`180° − ${x}° = ${180 - x}°`), { art: 'urteil', stimmt: true }] }); },
    () => { const s = zz(2, 4), h = zz(3, 6), x0 = zz(1, 3), art = wahl(['schenklig', 'un']), d = art === 'un' ? wahl([-1, 1]) : 0;
      const A = [x0, 1], Bp = [x0 + 2 * s, 1], C = [x0 + s + d, 1 + h];
      return auswahl(`Die Ecken des Dreiecks sind A(${A[0]}|${A[1]}), B(${Bp[0]}|${Bp[1]}) und C(${C[0]}|${C[1]}). Entscheide, wie es nach den Seiten heißt. Kreuze an.`, sOptionen(art),
        H('E', 'Liegt C genau über der Mitte von AB, sind AC und BC gleich lang.'), { bild: gitterBild(GT(x0 + 2 * s + 2, h + 2, { punkte: [PT('A', ...A), PT('B', ...Bp), PT('C', ...C)], figuren: [FG(null, [A, Bp, C])] })), nachweis: [{ art: 'klasse', ecken: [A, Bp, C], nach: 'seiten' }] }); },
    () => { const k = kind(), [e, f, s] = wahl([['A', 'B', 'c'], ['B', 'C', 'a'], ['A', 'C', 'b']]), falsch = wahl(['a', 'b', 'c'].filter((x) => x !== s));
      return auswahl(`${k} beschriftet die Seite zwischen ${e} und ${f} mit ${falsch}. Erkläre den Fehler. Kreuze die richtige Erklärung an.`,
        [opt(`Eine Seite heißt wie die Ecke, die ihr gegenüberliegt. Richtig ist ${s}.`, true), opt(`Eine Seite heißt wie ihre erste Ecke. Richtig ist ${e.toLowerCase()}.`, false, 'seite-ecke-vertauscht'), opt('Die Beschriftung ist frei wählbar.', false, 'seite-ecke-vertauscht'), opt(`Richtig ist ${f.toLowerCase()}.`, false, 'seite-ecke-vertauscht')].filter((o, i, l) => l.findIndex((p) => p.text === o.text) === i),
        H('E', 'Welche Ecke gehört nicht zu dieser Seite?'), { nachweis: [{ art: 'name', seite: s, ecken: [e, f] }, { art: 'urteil', stimmt: false }] }); },
    () => { const [k, w] = wahl([[2, [60, 30, 90]], [3, [67.5, 22.5, 90]], [4, [72, 18, 90]], [5, [75, 15, 90]], [2, [80, 40, 60]], [3, [90, 30, 60]], [2, [100, 50, 30]], [3, [105, 35, 40]]]); if (!w.every(Number.isInteger)) return null;
      return sach(`Im Dreieck ABC ist γ = ${w[2]}° und α ist ${k}-mal so groß wie β. Teile das Dreieck ein.`, [teilWahl('antwort', 'Nach den Winkeln:', wOptionen(winkelArt(w))), teilWahl('antwort', 'Nach den Seiten:', sOptionen(seitenArt(w)))],
        H('E', 'Berechne zuerst α und β: zusammen sind sie 180° − γ.'), { nachweis: [R(`180° − ${w[2]}° = ${180 - w[2]}°`), `${180 - w[2]}° : ${k + 1} = ${w[1]}°`, `${k} · ${w[1]}° = ${w[0]}°`, { art: 'klasse', winkel: w, nach: 'winkel', teil: 0 }, { art: 'klasse', winkel: w, nach: 'seiten', teil: 1 }] }); },
    () => ordnen(`Begründe: Ein Dreieck hat höchstens einen ${wahl(['stumpfen', 'rechten'])} Winkel. Ordne die Schritte.`,
      ['Nimm an, das Dreieck hätte zwei solche Winkel.', 'Dann wären diese beiden zusammen schon mindestens 180°.', 'Für den dritten Winkel bliebe kein Platz, denn die Summe ist genau 180°.', 'Also hat ein Dreieck höchstens einen solchen Winkel.'],
      H('E', 'Beginne mit der Annahme, es gäbe zwei.')),
  ]);
}

// ---------- D2: gleichschenklige und gleichseitige Dreiecke ----------
function d2() {
  const hBasis = (n, s) => H(n, 'Die beiden Basiswinkel sind gleich groß. Zusammen mit der Spitze sind es 180°.', 'Spitze 40°: (180° − 40°) : 2 = 70°.', `Rechne 180° − ${s}° und teile durch 2.`);
  const hSpitze = (n, b) => H(n, 'Die beiden Basiswinkel sind gleich groß.', 'Basiswinkel 70°: 180° − 70° − 70° = 40°.', `Rechne 180° − ${b}° − ${b}°.`);
  const basisAusSpitze = (n, s0) => { const s = s0 ?? suche(() => winkelFuer(n, 32, 130), (x) => x % 2 === 0 && x !== 60); return [s, (180 - s) / 2]; };
  sechs(D2, 'F', [
    () => { const b = 10 * zz(4, 7);
      return grad(Z('Die markierten Winkel sind gleich groß.', `α ist ${b}° groß.`, 'Gib β an.'), b, [[180 - b, 'nebenwinkel-gleich'], [180 - 2 * b, 'basiswinkel-falsch']], hSpitze('F', b),
        { bild: gsBild(b, 0, { A: WERT(b, { gleich: 1 }), B: GESUCHT('β', b, { gleich: 1 }) }), nachweis: [FIG('β')] }); },
    () => { const s = zz(3, 7), b = zz(3, 8); if (b === s || 2 * s <= b) return null; const E = dreieckSss(s, s, b);
      return zahl(Z('Die Seiten a und b haben gleich viele Striche.', 'Sie sind gleich lang.', 'Gib die Länge von b an.'), s, [[b, 'basiswinkel-falsch']], H('F', 'Gleich viele Striche heißt: gleich lang.', 'Hat a einen Strich und ist 4 cm lang, ist b mit einem Strich auch 4 cm lang.', 'Lies ab, wie lang a ist.'),
        { einheit: 'cm', bild: dreieckFigur(E, { gleich: { a: 1, b: 1 }, m: { a: cm(s), c: cm(b), b: { t: 'b = ?', frage: true } } }), nachweis: [{ art: 'seite', seite: 'b', wert: s }] }); },
    () => grad(Z('Im Dreieck sind alle drei Winkel gleich groß.', 'Zusammen sind sie 180°.', 'Berechne einen Winkel.'), 60, [[90, 'winkelsumme'], [120, 'winkelsumme']],
      H('F', 'Verteile 180° gerecht auf drei Winkel.', 'Teile 180° durch 3.', 'Rechne 180° : 3.'), { bild: dreieckBild(dreieckAus(60, 60, 0), { A: GESUCHT('α', 60, { gleich: 1 }), B: NAME('β', { gleich: 1, wert: 60, frage: true }), C: NAME('γ', { gleich: 1, wert: 60, frage: true }) }, { gleich: { a: 1, b: 1, c: 1 } }), nachweis: ['180° : 3 = 60°', FIG('α')] }),
    () => { const b = 10 * zz(4, 7);
      return grad(Z('Die beiden markierten Winkel sind gleich groß.', 'Berechne γ.'), 180 - 2 * b, [[180 - b, 'basiswinkel-falsch'], [b, 'basiswinkel-falsch']], hSpitze('F', b),
        { bild: gsBild(b, 0, { A: WERT(b, { gleich: 1 }), B: WERT(b, { gleich: 1 }), C: GESUCHT('γ', 180 - 2 * b) }), nachweis: [R(`180° − ${b}° − ${b}° = ${180 - 2 * b}°`), FIG('γ')] }); },
    () => { const [s, b] = basisAusSpitze('F', 10 * wahl([2, 4, 6, 8, 10, 12]));
      return luecken(Z('Die markierten Winkel sind gleich groß.', 'Rechne in zwei Schritten.', `α + β = {{x}}°`, 'α = {{a}}°'), { x: lk(180 - s, [[s, 'basiswinkel-falsch']]), a: lk(b, [[180 - s, 'basiswinkel-falsch'], [s, 'basiswinkel-falsch']]) }, hBasis('F', s),
        { bild: gsBild(b, 0, { A: GESUCHT('α', b, { gleich: 1 }), B: NAME('β', { gleich: 1, wert: b, frage: true }), C: WERT(s) }), nachweis: [R(`180° − ${s}° = ${180 - s}°`), `${180 - s}° : 2 = ${b}°`, FIG('α', { luecke: 'a' })] }); },
    () => { const b = 5 * zz(11, 15);
      return grad(Z('Ein Zelt sieht von vorne aus wie ein Dreieck.', 'Die beiden Winkel unten sind gleich groß.', `Einer ist ${b}° groß.`, 'Gib den anderen Winkel unten an.'), b, [[180 - 2 * b, 'basiswinkel-falsch'], [180 - b, 'nebenwinkel-gleich']], hSpitze('F', b),
        { bild: gsBild(b, 0, { A: WERT(b, { gleich: 1 }), B: GESUCHT('β', b, { gleich: 1 }) }, { titel: 'Zelt von vorne' }), nachweis: [FIG('β')] }); },
  ]);
  sechs(D2, 'G', [
    () => { const [s, b] = basisAusSpitze('G');
      return grad(Z('Das Dreieck ist gleichschenklig.', 'Die markierten Winkel sind gleich groß.', `Die Spitze hat ${s}°.`, 'Berechne α.'), b, [[180 - s, 'basiswinkel-falsch'], [s, 'basiswinkel-falsch']], hBasis('G', s),
        { bild: gsBild(b, drehFuer('G'), { A: GESUCHT('α', b, { gleich: 1 }), B: NAME('β', { gleich: 1, wert: b, frage: true }), C: WERT(s) }), nachweis: [R(`180° − ${s}° = ${180 - s}°`), `${180 - s}° : 2 = ${b}°`, FIG('α')] }); },
    () => { const b = winkelFuer('G', 35, 74);
      return grad(Z('Das Dreieck ist gleichschenklig.', `Die markierten Basiswinkel sind je ${b}° groß.`, 'Berechne den Winkel γ an der Spitze.'), 180 - 2 * b, [[180 - b, 'basiswinkel-falsch'], [b, 'basiswinkel-falsch']], hSpitze('G', b),
        { bild: gsBild(b, drehFuer('G'), { A: WERT(b, { gleich: 1 }), B: WERT(b, { gleich: 1 }), C: GESUCHT('γ', 180 - 2 * b) }), nachweis: [R(`180° − ${b}° − ${b}° = ${180 - 2 * b}°`), FIG('γ')] }); },
    () => { const [s, b] = basisAusSpitze('G');
      return luecken(Z('Das Dreieck ist gleichschenklig.', 'Die markierten Winkel sind gleich groß.', 'Berechne die Basiswinkel.', 'α = {{a}}°', 'β = {{b}}°'), { a: lk(b, [[180 - s, 'basiswinkel-falsch'], [s, 'basiswinkel-falsch']]), b: lk(b, [[s, 'basiswinkel-falsch']]) }, hBasis('G', s),
        { bild: gsBild(b, drehFuer('G'), { A: GESUCHT('α', b, { gleich: 1 }), B: GESUCHT('β', b, { gleich: 1 }), C: WERT(s) }), nachweis: [R(`180° − ${s}° = ${180 - s}°`), `${180 - s}° : 2 = ${b}°`, FIG('α', { luecke: 'a' }), FIG('β', { luecke: 'b' })] }); },
    () => { const [rest, basis] = wahl([[['a', 'b'], 'c'], [['b', 'c'], 'a'], [['a', 'c'], 'b']]), w = dreiWinkel('G', { max: 85 });
      // Ein gleichschenkliges Dreieck, dessen Basis die gesuchte Seite ist: Basiswinkel an den Enden der Basis.
      const enden = { a: ['B', 'C'], b: ['C', 'A'], c: ['A', 'B'] }[basis], bw = winkelFuer('G', 40, 75), spitze = ['A', 'B', 'C'].find((e) => !enden.includes(e));
      const ww = { [enden[0]]: bw, [enden[1]]: bw, [spitze]: 180 - 2 * bw }, E = dreieckAus(ww.A, ww.B, drehFuer('G'));
      return auswahl(Z('Das Dreieck ist gleichschenklig.', 'Welche Seite ist die Basis?', 'Kreuze an.'), ['a', 'b', 'c'].map((x) => opt(x, x === basis, x === basis ? undefined : 'basiswinkel-falsch')), hBegriffe('G'),
        { bild: dreieckBild(E, {}, { gleich: Object.fromEntries(rest.map((x) => [x, 1])) }), nachweis: [{ art: 'name', seite: basis, basis: true }] }); },
    () => { const s = zz(3, 9), u = 3 * s;
      return zahl(Z('Ein gleichseitiges Dreieck hat drei gleich lange Seiten.', `Sein Umfang ist ${u} cm.`, 'Berechne die Länge einer Seite.'), s, [[u / 2, 'dreieck-sonderfall'], [u - s, 'dreieck-sonderfall']].filter(([x]) => Number.isInteger(x)),
        H('G', 'Der Umfang ist die Summe der drei Seiten.', 'Umfang 12 cm: 12 cm : 3 = 4 cm.', `Rechne ${u} : 3.`), { hinweise: { 'dreieck-sonderfall': 'Gleichseitig heißt: Alle drei Seiten sind gleich lang. Teile den Umfang durch 3.' }, einheit: 'cm', bild: dreieckFigur(dreieckSss(s, s, s, drehFuer('G')), { gleich: { a: 1, b: 1, c: 1 } }), nachweis: [{ zahl: 3, grund: 'drei gleich lange Seiten' }, `${u} : 3 = ${s}`] }); },
    () => { const k = kind(), s = winkelFuer('G', 95, 130); if ((180 - s) % 2) return null; const b = (180 - s) / 2;
      return auswahl(Z(`${k} sagt: „Ein gleichschenkliges Dreieck kann an der Spitze ${s}° haben.“`, 'Kreuze die richtige Antwort an.'),
        [opt(`Stimmt. Dann sind die Basiswinkel je ${b}°.`, true), opt('Stimmt nicht. Die Spitze ist immer kleiner als 90°.', false, 'dreieck-art'), opt(`Stimmt nicht. Die Basiswinkel wären dann je ${s}°.`, false, 'basiswinkel-falsch')],
        hBasis('G', s), { nachweis: [R(`180° − ${s}° = ${180 - s}°`), `${180 - s}° : 2 = ${b}°`, { art: 'urteil', stimmt: true }] }); },
  ]);
  sechs(D2, 'M', [
    () => { const [s, b] = basisAusSpitze('M');
      return grad(`Das Dreieck ABC ist gleichschenklig mit der Basis c. Es ist γ = ${s}°. Berechne α.`, b, [[s, 'basiswinkel-falsch'], [180 - s, 'basiswinkel-falsch'], [180 - 2 * s > 0 ? 180 - 2 * s : 0, 'basiswinkel-falsch']],
        hBasis('M', s), { bild: gsBild(b, drehFuer('M'), { A: GESUCHT('α', b), C: WERT(s) }), nachweis: [R(`180° − ${s}° = ${180 - s}°`), `${180 - s}° : 2 = ${b}°`, FIG('α')] }); },
    () => { const b = winkelFuer('M', 30, 74), [e1, e2, sp] = wahl([['A', 'B', 'C'], ['B', 'C', 'A'], ['C', 'A', 'B']]), nm = { A: 'α', B: 'β', C: 'γ' };
      const ww = { [e1]: b, [e2]: b, [sp]: 180 - 2 * b }, E = dreieckAus(ww.A, ww.B, drehFuer('M')), seiteGegen = { A: 'a', B: 'b', C: 'c' };
      return grad(`Das Dreieck ist gleichschenklig. Der Basiswinkel ${nm[e1]} ist ${b}° groß. Berechne den Winkel ${nm[sp]} an der Spitze.`, 180 - 2 * b, [[b, 'basiswinkel-falsch'], [180 - b, 'basiswinkel-falsch'], [(180 - b) / 2, 'basiswinkel-falsch']].filter(([x]) => Number.isInteger(x)),
        hSpitze('M', b), { bild: dreieckBild(E, { [e1]: WERT(b), [sp]: GESUCHT(nm[sp], 180 - 2 * b) }, { gleich: { [seiteGegen[e1]]: 1, [seiteGegen[e2]]: 1 } }), nachweis: [R(`180° − ${b}° − ${b}° = ${180 - 2 * b}°`), FIG(nm[sp])] }); },
    () => { const [p, q, gleichS] = wahl([['α', 'β', 'a und b'], ['β', 'γ', 'b und c'], ['α', 'γ', 'a und c']]), x = winkelFuer('M', 30, 75);
      return sach(`In einem Dreieck ABC ist ${p} = ${q} = ${x}°. Gib an, welche Seiten gleich lang sind, und begründe.`, [teilWahl('antwort', 'Gleich lang sind', ['a und b', 'b und c', 'a und c'].map((t) => opt(t, t === gleichS, t === gleichS ? undefined : 'seite-ecke-vertauscht'))),
        teilWahl('antwort', 'Grund:', [opt('Umkehrung des Basiswinkelsatzes', true), opt('Winkelsummensatz', false, 'winkelsumme'), opt('Scheitelwinkel', false, 'scheitel-neben-verwechselt')])],
        H('M', 'Gleich große Winkel liegen gleich langen Seiten gegenüber.', `${p} liegt der Seite ${p === 'α' ? 'a' : p === 'β' ? 'b' : 'c'} gegenüber.`), { nachweis: [{ art: 'name', winkelGleich: [p, q], seiten: gleichS, teil: 0 }, { zahl: x, grund: `${p} = ${q} = ${x}°, gleich große Winkel` }] }); },
    () => grad(`Ein Verkehrsschild hat die Form eines gleichseitigen Dreiecks. Begründe mit dem Basiswinkelsatz und gib die Größe eines Winkels an.`, 60, [[90, 'winkelsumme'], [45, 'basiswinkel-falsch'], [180, 'winkelsumme']],
      H('M', 'Jede Seite kann Basis sein. Also sind alle drei Winkel gleich groß.', '180° : 3.'), { bild: dreieckBild(dreieckAus(60, 60, 0, 5), {}, { gleich: { a: 1, b: 1, c: 1 }, titel: 'Verkehrsschild' }), nachweis: ['180° : 3 = 60°'] }),
    () => { const b = winkelFuer('M', 35, 74), aw = 180 - b, E = dreieckAus(b, b, drehFuer('M')), D = plus(E.B, vek(E.A, E.B), 0.4);
      return grad(`Das Dreieck ABC ist gleichschenklig mit der Basis c. Die Basis ist über B verlängert. Der Außenwinkel bei B ist ${aw}° groß. Berechne γ.`, 180 - 2 * b, [[b, 'basiswinkel-falsch'], [aw, 'nebenwinkel-gleich']],
        H('M', 'Berechne zuerst β. Dann hilft der Basiswinkelsatz.', `β = 180° − ${aw}° = ${b}°.`),
        { bild: dreieckBild(E, { C: GESUCHT('γ', 180 - 2 * b) }, { gleich: { a: 1, b: 1 }, extra: { punkte: { D }, versteckt: ['D'], linien: [['B', 'D']], winkel: [['B', 'D', 'C', { wert: aw, farbe: 1 }]] } }),
          nachweis: [R(`180° − ${aw}° = ${b}°`), R(`180° − ${b}° − ${b}° = ${180 - 2 * b}°`), FIG('γ')] }); },
    () => { const k = kind(), [s, b] = basisAusSpitze('M');
      return auswahl(`Das Dreieck ABC ist gleichschenklig mit der Spitze C und γ = ${s}°. ${k} rechnet: „α = ${s}°, denn im gleichschenkligen Dreieck sind zwei Winkel gleich.“ Erkläre den Fehler. Kreuze die richtige Erklärung an.`,
        [opt(`Gleich groß sind nur die Basiswinkel α und β. Richtig ist α = (180° − ${s}°) : 2 = ${b}°.`, true), opt('Die Rechnung stimmt.', false, 'basiswinkel-falsch'), opt(`Richtig ist α = 180° − ${s}° = ${180 - s}°.`, false, 'basiswinkel-falsch'), opt('Im gleichschenkligen Dreieck sind alle Winkel gleich.', false, 'dreieck-sonderfall')],
        hBasis('M', s), { bild: gsBild(b, drehFuer('M'), { C: WERT(s), A: NAME('α') }), nachweis: [R(`180° − ${s}° = ${180 - s}°`), `${180 - s}° : 2 = ${b}°`, { art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(D2, 'E', [
    () => { const [k, s, b] = wahl([[2, 90, 45], [4, 120, 30], [1, 60, 60]]), d = suche(() => 3 * zz(2, 30), (x) => (180 - x) % 3 === 0 && x !== 0), bb = (180 - d) / 3, sp = bb + d;
      return wahl([
        grad(`Im gleichschenkligen Dreieck ABC mit der Basis c ist die Spitze γ um ${d}° größer als ein Basiswinkel. Bestimme α.`, bb, [[(180 - d) / 2, 'basiswinkel-falsch'], [sp, 'basiswinkel-falsch']].filter(([x]) => Number.isInteger(x)), H('E', 'Drei gleich große Teile und dazu die Differenz ergeben 180°.'), { nachweis: [R(`180° − ${d}° = ${180 - d}°`), `${180 - d}° : 3 = ${bb}°`] }),
        grad(`Im gleichschenkligen Dreieck ABC mit der Basis c ist γ ${k === 1 ? 'so groß wie' : `${k}-mal so groß wie`} ein Basiswinkel. Bestimme γ.`, s, [[b, 'basiswinkel-falsch'], [180 / k, 'winkelsumme']].filter(([x]) => Number.isInteger(x)), H('E', 'Zähle die gleich großen Teile.'), { nachweis: [`180° : ${k + 2} = ${b}°`, `${k} · ${b}° = ${s}°`] })]); },
    () => { const a = winkelFuer('E', 25, 55), E = dreieckAus(a, winkelFuer('E', 30, 60), drehFuer('E'), 7);
      // D auf AB mit AD = DC: gleichschenkliges Dreieck ADC mit der Spitze D.
      const AC = Math.hypot(...vek(E.A, E.C)), AD = AC / (2 * Math.cos((a * Math.PI) / 180)), D = plus(E.A, vek(E.A, E.B), AD / Math.hypot(...vek(E.A, E.B)));
      if (AD >= Math.hypot(...vek(E.A, E.B)) - 0.6) return null;
      return grad(`Im Dreieck ABC liegt D auf AB, und die Strecken AD und DC sind gleich lang. Es ist α = ${a}°. Bestimme den Winkel φ = ∢BDC.`, 2 * a, [[180 - 2 * a, 'nebenwinkel-gleich'], [a, 'basiswinkel-falsch']],
        H('E', 'Das Dreieck ADC ist gleichschenklig. Wo liegen seine Basiswinkel?'),
        { bild: figur({ punkte: { ...E, D }, linien: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['C', 'D'], ['A', 'D', { gleich: 1 }], ['D', 'C', { gleich: 1 }]], winkel: [['A', 'D', 'C', { wert: a, farbe: 0 }], ['D', 'C', 'B', { n: 'φ', wert: 2 * a, frage: true, farbe: 2 }]] }),
          nachweis: [R(`180° − ${a}° − ${a}° = ${180 - 2 * a}°`), R(`180° − ${180 - 2 * a}° = ${2 * a}°`), FIG('φ')] }); },
    () => { const k = wahl([2, 4, 7]), s = 180 / (2 * k + 1), b = k * s;
      return luecken(`Im gleichschenkligen Dreieck ist jeder Basiswinkel ${k}-mal so groß wie die Spitze. Bestimme die Winkel.\nSpitze = {{s}}°\nBasiswinkel = {{b}}°`, { s: lk(s, [[180 / (k + 2), 'basiswinkel-falsch']].filter(([x]) => Number.isInteger(x))), b: lk(b, [[180 - b, 'basiswinkel-falsch']]) },
        H('E', 'Spitze und zwei Basiswinkel: Zähle die Teile von der Größe der Spitze.'), { nachweis: [{ zahl: 2 * k + 1, grund: `1 Teil für die Spitze und 2 · ${k} Teile für die Basiswinkel` }, `180° : ${2 * k + 1} = ${s}°`, `${k} · ${s}° = ${b}°`] }); },
    () => { const k = kind(), x = winkelFuer('E', 35, 75), E = dreieckAus(x, 180 - 2 * x, drehFuer('E'));
      return auswahl(`Im Dreieck ABC ist α = γ = ${x}°. ${k} sagt: „Dann ist c die Basis.“ Erkläre den Fehler. Kreuze die richtige Erklärung an.`,
        [opt('Die Basis liegt zwischen den gleichen Winkeln, also zwischen A und C. Das ist die Seite b.', true), opt('c ist richtig, denn c ist immer die Basis.', false, 'basiswinkel-falsch'), opt('Die Basis ist a, denn a liegt bei α.', false, 'seite-ecke-vertauscht'), opt('Es gibt keine Basis, weil β fehlt.', false, 'basiswinkel-falsch')],
        H('E', 'Die Basiswinkel liegen an den Enden der Basis.'), { bild: dreieckBild(E, { A: WERT(x), C: WERT(x) }), nachweis: [{ art: 'name', seite: 'b', basis: true }, { art: 'urteil', stimmt: false }] }); },
    () => { const x = winkelFuer('E', 91, 100);
      return auswahl(`Kann ein gleichschenkliges Dreieck einen Basiswinkel von ${x}° haben? Begründe. Kreuze die richtige Antwort an.`,
        [opt(`Nein. Beide Basiswinkel wären zusammen ${2 * x}°, mehr als 180°.`, true), opt('Ja. Dann ist das Dreieck stumpfwinklig.', false, 'basiswinkel-falsch'), opt(`Ja. Die Spitze hat dann ${180 - x}°.`, false, 'basiswinkel-falsch'), opt('Nein. Basiswinkel sind immer 45°.', false, 'basiswinkel-falsch')],
        H('E', 'Es gibt zwei gleich große Basiswinkel.'), { nachweis: [`2 · ${x}° = ${2 * x}°`, { art: 'urteil', stimmt: false }] }); },
    () => ordnen('Begründe: Im gleichseitigen Dreieck ist jeder Winkel 60° groß. Ordne die Schritte.',
      ['Jede Seite ist so lang wie die anderen. Jede Seite kann Basis sein.', 'Nach dem Basiswinkelsatz ist α = β und β = γ.', 'Also sind alle drei Winkel gleich groß.', 'Mit der Winkelsumme ist jeder Winkel 180° : 3 = 60°.'],
      H('E', 'Wende den Basiswinkelsatz zweimal an.'), { nachweis: [{ art: 'schritte' }, '180° : 3 = 60°'] }),
  ]);
}

export function dreiecksformen() { d1(); d2(); }
