// Aufgaben zu 5.7.4 „Winkel messen und zeichnen“ (Lernziele W1 und W2) nach ADR 0034.
// W1: Messen am maßstabsgetreuen Geodreieck im Bild. F in Zehnerschritten mit waagerechtem Schenkel, G in Fünferschritten und gedreht,
//     M gradgenau mit überstumpfen Winkeln (360° minus), E findet Fehler beim Anlegen. M und E messen zweimal im Heft mit 2° Spielraum.
// W2: Winkeldrehen ohne Gradanzeige mit 2° Spielraum. Überstumpfe Winkel brauchen das Umlegen des Geodreiecks. M und E zeichnen zweimal im Heft.
import { sechs, zahl, auswahl, opt, winkelDrehen, N, U, HILFSZAHL, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, W, mitGeo, bildAus, GEO_R, dir, norm } from './5-7-winkel.mjs';

const r1 = Math.round;
// ---------- Messen ----------
// Ein Winkel mit angelegtem Geodreieck. Die lange Seite liegt auf dem ersten Schenkel (vorn) oder auf dem zweiten (hinten).
function messbild(g, von, { hinten = false, versatz = null, schief = 0 } = {}) {
  const grund = (hinten ? von + g - 180 : von) - schief;
  return mitGeo(W(g, von, { n: 'α' }), norm(grund), versatz);
}
const winkelFuer = (niveau) => (niveau === 'F' ? 10 * zz(2, 16) : niveau === 'G' ? 5 * zz(5, 34) : suche(() => zz(12, 170), (x) => x !== 90));
const richtungFuer = (niveau) => (niveau === 'F' ? 0 : niveau === 'G' ? 5 * zz(0, 71) : zz(0, 359));
function messen(text, niveau, hilfen, { hinten = null, stumpf = null } = {}) {
  const g = suche(() => winkelFuer(niveau), (x) => stumpf == null || (stumpf ? x > 90 : x < 90)), hi = hinten ?? (niveau !== 'F' && zz(0, 1) === 1);
  const von = niveau === 'F' ? (hi ? 180 - g : 0) : richtungFuer(niveau);
  return zahl(text, g, fehlerliste(g, [[180 - g, 'skala-falsch']]), hilfen, { einheit: '°', bild: messbild(g, von, { hinten: hi }), nachweis: [{ art: 'geoAblesen', winkel: 'α', wert: g }] });
}
// Überstumpf: Das Geodreieck misst den kleinen Winkel außen herum, gerechnet wird 360° minus.
function ueberstumpf(text, hilfen) {
  const g = zz(195, 345), klein = 360 - g, von = zz(0, 359);
  const bild = mitGeo(W(g, von, { n: 'α', rb: 30 }), norm(von + g));
  return zahl(text, g, fehlerliste(g, [[klein, 'ueberstumpf-klein'], [180 + klein, 'skala-falsch'], [180 - klein, 'skala-falsch']].filter(([x]) => x > 0)), hilfen,
    { einheit: '°', bild, nachweis: [{ art: 'geoAblesen', winkel: 'α', wert: klein }, HILFSZAHL(360, 'Ein Vollwinkel hat 360°'), ...N(`360 − ${klein}`)] });
}
// Ein Kind liest falsch ab oder legt falsch an. Die Antworten nennen den Fehler.
const FEHLERTEXT = { nullpunkt: 'Der Nullpunkt liegt nicht auf dem Scheitel.', grundlinie: 'Die lange Seite liegt auf keinem Schenkel.', skala: 'Auf der falschen Skala abgelesen.' };
function fehlerSuche(text, niveau, fehler, hilfen) {
  const g = suche(() => winkelFuer(niveau), (x) => Math.abs(x - 90) >= 20 && x <= 150), von = richtungFuer(niveau);
  const bild = fehler === 'nullpunkt' ? messbild(g, von, { versatz: (([x, y]) => [r1(x * 26), r1(y * 26)])(dir(von + wahl([0, 180]))) })
    : fehler === 'grundlinie' ? messbild(g, von, { schief: wahl([12, 15, 18]) }) : messbild(g, von);
  if (fehler === 'grundlinie' && norm(von + g - bild.geo.grund) > 180) return null;
  const k = kind(), gelesen = 180 - g;
  return auswahl(text(k, gelesen), [...Object.entries(FEHLERTEXT).map(([f, t]) => opt(t, f === fehler, f === fehler ? undefined : 'geodreieck-angelegt')), opt('Nichts. Es ist alles richtig.', false, fehler === 'skala' ? 'skala-falsch' : 'geodreieck-angelegt')],
    hilfen, { bild, nachweis: [{ art: 'falschAngelegt', fehler }, ...(fehler === 'skala' ? [{ art: 'geoAblesen', winkel: 'α', wert: g }, ...N(`180 − ${g}`)] : [])] });
}
// Heftaufgabe: Dreieck aus drei Punkten im Koordinatensystem (1 cm je Einheit), gemessen wird der Winkel bei A.
function heftMessen(text, hilfen) {
  const [A, Bp, C, w] = suche(() => { const A = [zz(1, 3), zz(1, 3)], Bp = [zz(6, 11), zz(1, 5)], C = [zz(1, 9), zz(6, 10)];
    const u = [Bp[0] - A[0], Bp[1] - A[1]], v = [C[0] - A[0], C[1] - A[1]], w = (Math.acos((u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)) * 180) / Math.PI;
    return [A, Bp, C, w]; }, ([, , , w]) => Math.abs(w - r1(w)) <= 0.3 && w > 25 && w < 150 && r1(w) % 5 !== 0 && r1(w) !== 90);
  const wert = r1(w);
  return zahl(text(A, Bp, C), wert, fehlerliste(wert, [[180 - wert, 'skala-falsch']]), hilfen, { einheit: '°', toleranz: 2, nachweis: [HILFSZAHL(1, '1 cm je Einheit'), { art: 'heftKoordWinkel', a: A, b: Bp, c: C, wert }] });
}
const P = (p) => `(${p[0]}|${p[1]})`;

// ---------- Winkeldrehen ----------
// Ein Feld, in das Geodreieck (auch umgelegt), fester Schenkel und gesuchter Schenkel passen.
function feldFuer(von, loesung, umlegen) {
  const l = 262, rand = 14, pts = [[0, 0]];
  for (const grund of umlegen ? [von, von + 180] : [von]) for (const r of [grund, grund + 90, grund + 180]) pts.push(dir(r).map((x) => x * (GEO_R + 6)));
  pts.push(dir(von).map((x) => x * (l + 26)), dir(von + loesung).map((x) => x * (l + 14)));
  const x0 = Math.min(...pts.map((p) => p[0])), x1 = Math.max(...pts.map((p) => p[0])), y0 = Math.min(...pts.map((p) => p[1])), y1 = Math.max(...pts.map((p) => p[1]));
  const b = Math.max(300, r1(x1 - x0 + 2 * rand)), h = Math.max(200, r1(y1 - y0 + 2 * rand));
  return { b, h, s: [r1(rand - x0 + (b - (x1 - x0 + 2 * rand)) / 2), r1(rand - y0 + (h - (y1 - y0 + 2 * rand)) / 2)], von: norm(von), l, ...(umlegen ? { umlegen: true } : {}) };
}
// Auf F liegt der feste Schenkel waagerecht nach rechts, das Geodreieck steht aufrecht darüber.
function drehen(text, niveau, g, hilfen, { vorher = [], fehler = null } = {}) {
  // Sonst liegt er schräg, aber höchstens 50° gegen die Waagerechte geneigt, damit das Feld nicht zu hoch wird.
  const von = niveau === 'F' ? 0 : suche(() => richtungFuer(niveau), (r) => Math.abs(Math.sin((r * Math.PI) / 180)) <= Math.sin((50 * Math.PI) / 180)), um = g > 180;
  return winkelDrehen(text, feldFuer(von, g, um), g, fehler ?? (um ? [[360 - g, 'ueberstumpf-klein'], [540 - g, 'skala-falsch']] : [[180 - g, 'skala-falsch']]), hilfen, { nachweis: [...vorher, { art: 'drehen', wert: g }] });
}
// Heftaufgabe: Winkel mit zwei gleich langen Schenkeln zeichnen; gemessen wird die Verbindung der Endpunkte.
function heftZeichnen(text, hilfen) {
  const [s, w, wert] = suche(() => { const s = 10 * zz(4, 8), w = zz(25, 160), x = 2 * s * Math.sin((w * Math.PI) / 360); return [s, w, x]; }, ([, w, x]) => Math.abs(x - r1(x)) <= 0.3 && w !== 90 && w % 10 !== 0);
  const mm = r1(wert);
  return zahl(text(w, s / 10), mm, fehlerliste(mm, [[r1(2 * s * Math.sin(((180 - w) * Math.PI) / 360)), 'skala-falsch']]), hilfen, { einheit: 'mm', toleranz: 2, nachweis: [...N(`${s / 10} · 10`), { art: 'heftWinkel', schenkel: s, winkel: w, wert: mm }] });
}

export function messenUndZeichnen() {
  const W1 = '5.7.4-W1';
  sechs(W1, 'F', [
    () => messen(Z('Das Geodreieck liegt am Winkel α.', 'Lies ab: Wie groß ist α?'), 'F', h3('Der Nullpunkt liegt auf dem Scheitel.', 'Ein Schenkel liegt auf der langen Seite.', 'Lies am zweiten Schenkel ab.'), { stumpf: false }),
    () => messen(Z('Das Geodreieck liegt am Winkel α.', 'Lies ab: Wie groß ist α?'), 'F', h3('Es gibt zwei Skalen.', 'Nimm die Skala, die am ersten Schenkel bei 0 beginnt.', 'Lies dort ab, wo der zweite Schenkel die Skala kreuzt.'), { stumpf: true }),
    () => messen(Z('Miss den Winkel α.', 'Wie viel Grad zeigt das Geodreieck?'), 'F', h3('Prüfe zuerst: Ist α spitz oder stumpf?', 'Ein spitzer Winkel hat weniger als 90°.', 'Lies dann auf der passenden Skala ab.'), { hinten: false }),
    () => messen(Z('Miss den Winkel α.', 'Wie viel Grad zeigt das Geodreieck?'), 'F', h3('Der erste Schenkel zeigt nach links.', 'Die Skala beginnt dann links bei 0.', 'Lies am zweiten Schenkel ab.'), { hinten: true }),
    () => { const g = 10 * zz(11, 16), k = kind();
      return auswahl(Z(`${k} misst den Winkel α.`, `Das Kind liest ${180 - g}° ab.`, 'Stimmt das?'), [opt(`Nein.\nα ist stumpf.\nEs sind ${g}°.`, true), opt(`Ja.\nα ist ${180 - g}° groß.`, false, 'skala-falsch')],
        h3('Schau dir α zuerst ohne Geodreieck an.', 'Ist α größer als eine Heftecke?', 'Dann muss die Zahl größer als 90 sein.'), { bild: messbild(g, 0), nachweis: [U(false), { art: 'geoAblesen', winkel: 'α', wert: g }, ...N(`180 − ${g}`)] }); },
    () => messen(Z('Das Geodreieck liegt am Winkel α.', 'Wie groß ist α?'), 'F', h3('Der Nullpunkt liegt auf dem Scheitel.', 'Zähle auf der Skala von 0 aus.', 'Der zweite Schenkel zeigt auf die Lösung.')),
  ]);
  sechs(W1, 'G', [
    () => messen(Z('Das Geodreieck liegt schräg am Winkel α.', 'Wie groß ist α?'), 'G', h3('Dreh das Bild in Gedanken.', 'Der Nullpunkt liegt auf dem Scheitel.', 'Lies auf der Skala ab, die am Schenkel bei 0 beginnt.'), { stumpf: false }),
    () => messen(Z('Miss den Winkel α.', 'Lies am Geodreieck ab.'), 'G', h3('Prüfe zuerst, ob α spitz oder stumpf ist.', 'Die Skalen laufen in Fünferschritten.', 'Zähle von der letzten Zehnerzahl weiter.'), { stumpf: true }),
    () => messen(Z('Der zweite Schenkel liegt auf der langen Seite.', 'Wie groß ist α?'), 'G', h3('Die Skala beginnt am Schenkel unter der langen Seite.', 'Lies am anderen Schenkel ab.', 'Prüfe: Passt die Zahl zu spitz oder stumpf?'), { hinten: true }),
    () => messen(Z('Das Geodreieck liegt am Winkel α.', 'Wie groß ist α?'), 'G', h3('Suche zuerst den Nullpunkt.', 'Nimm die Skala, die am Schenkel bei 0 beginnt.', 'Lies am zweiten Schenkel ab.')),
    () => { const g = 5 * zz(19, 32), von = 5 * zz(0, 71), k = kind();
      return auswahl(Z(`${k} misst den Winkel α.`, `Das Kind liest ${180 - g}° ab.`, 'Hat es recht?'), [opt(`Nein.\nα ist stumpf.\nRichtig sind ${g}°.`, true), opt(`Ja.\nDas Geodreieck zeigt ${180 - g}°.`, false, 'skala-falsch')],
        h3('Schau dir α ohne Geodreieck an.', 'Ein stumpfer Winkel hat mehr als 90°.', 'Lies auf der anderen Skala ab.'), { bild: messbild(g, von), nachweis: [U(false), { art: 'geoAblesen', winkel: 'α', wert: g }, ...N(`180 − ${g}`)] }); },
    () => fehlerSuche((k, x) => Z(`${k} hat α gemessen und ${x}° abgelesen.`, 'Was hat das Kind falsch gemacht?'), 'G', 'skala',
      h3('Prüfe den Nullpunkt und die lange Seite.', 'Schätze dann α.', 'Passt die abgelesene Zahl zu spitz oder stumpf?')),
  ]);
  sechs(W1, 'M', [
    () => messen('Miss den Winkel α gradgenau.', 'M', h2('Lies auf der Skala ab, die am Schenkel unter der langen Seite bei 0 beginnt.', 'Zähle die kleinen Striche nach der letzten Zehnerzahl.')),
    () => ueberstumpf('Der Bogen zeigt den überstumpfen Winkel α. Das Geodreieck misst den Winkel außen herum. Wie groß ist α?', h2('Lies zuerst den kleinen Winkel ab.', 'Ein Vollwinkel hat 360°. Ziehe den kleinen Winkel davon ab.')),
    () => heftMessen((A, B, C) => `Zeichne in dein Heft ein Koordinatensystem mit 1 cm je Einheit. Zeichne A${P(A)}, B${P(B)} und C${P(C)} und verbinde A mit B und A mit C. Miss den Winkel bei A.`,
      h2('Lege den Nullpunkt genau auf A und die lange Seite auf die Strecke AB.', 'Du darfst 2° daneben liegen. Zeichne sehr genau.')),
    () => messen('Wie groß ist der Winkel α? Miss gradgenau.', 'M', h2('Prüfe zuerst, ob α spitz oder stumpf ist.', 'Lies dann auf der passenden Skala ab.'), { hinten: true }),
    () => heftMessen((A, B, C) => `Zeichne die Punkte A${P(A)}, B${P(B)} und C${P(C)} in ein Koordinatensystem mit 1 cm je Einheit. Wie groß ist der Winkel zwischen AB und AC?`,
      h2('Der Scheitel ist A.', 'Lege die lange Seite des Geodreiecks auf einen der beiden Schenkel.')),
    () => fehlerSuche((k) => `${k} hat den Winkel α so gemessen wie im Bild. Was hat das Kind falsch gemacht?`, 'M', wahl(['nullpunkt', 'grundlinie']),
      h2('Prüfe zwei Dinge: Liegt der Nullpunkt auf dem Scheitel?', 'Liegt die lange Seite auf einem Schenkel?')),
  ]);
  sechs(W1, 'E', [
    () => messen('Miss den Winkel α gradgenau.', 'E', h1('Lies auf der Skala ab, die am Schenkel unter der langen Seite bei 0 beginnt.')),
    () => ueberstumpf('Wie groß ist der überstumpfe Winkel α?', h1('Miss den Winkel außen herum und rechne 360° minus.')),
    () => heftMessen((A, B, C) => `Das Dreieck ABC hat die Ecken A${P(A)}, B${P(B)} und C${P(C)} (1 cm je Einheit). Zeichne es in dein Heft und miss den Winkel bei A.`,
      h1('Lege den Nullpunkt genau auf A. Du darfst 2° daneben liegen.')),
    () => fehlerSuche((k) => `${k} misst den Winkel α so wie im Bild. Was ist falsch?`, 'E', wahl(['nullpunkt', 'grundlinie']), h1('Prüfe Nullpunkt und lange Seite des Geodreiecks.')),
    () => heftMessen((A, B, C) => `Zeichne A${P(A)}, B${P(B)} und C${P(C)} in ein Koordinatensystem mit 1 cm je Einheit. Miss den Winkel ∢BAC.`,
      h1('Bei ∢BAC ist A der Scheitel.')),
    () => fehlerSuche((k, x) => `${k} misst α und liest ${x}° ab. Welcher Fehler ist passiert?`, 'E', 'skala', h1('Schätze α, bevor du der Messung glaubst.')),
  ]);

  const W2 = '5.7.4-W2';
  const zehn = (a, b) => 10 * zz(a, b), fuenf = (a, b) => 5 * zz(a, b);
  sechs(W2, 'F', [
    () => { const g = zehn(2, 4); return drehen(Z(`Zeichne am festen Schenkel einen Winkel von ${g}°.`, 'Drehe dazu den zweiten Schenkel.'), 'F', g, h3('Der Nullpunkt liegt auf dem Scheitel.', 'Suche die Zahl auf der Skala, die am festen Schenkel bei 0 beginnt.', 'Drehe den Schenkel bis zu dieser Zahl.')); },
    () => { const g = zehn(10, 16); return drehen(Z(`Zeichne einen Winkel von ${g}°.`, 'Drehe den zweiten Schenkel.'), 'F', g, h3('Der Winkel ist stumpf.', 'Er ist größer als eine Heftecke.', 'Suche die Zahl auf der richtigen Skala.')); },
    () => { const g = suche(() => zehn(2, 16), (x) => x !== 90); return drehen(Z(`Zeichne einen Winkel von ${g}°.`), 'F', g, h3('Beginne am festen Schenkel bei 0.', 'Zähle auf der Skala in Zehnerschritten.', 'Drehe bis zu der gesuchten Zahl.')); },
    () => drehen(Z('Zeichne einen rechten Winkel.', 'Drehe dazu den zweiten Schenkel.'), 'F', 90, h3('Ein rechter Winkel hat 90°.', 'Die 90 steht oben in der Mitte.', 'Drehe den Schenkel bis zur 90.')),
    () => { const g = zehn(11, 16); return drehen(Z(`Zeichne einen stumpfen Winkel von ${g}°.`, 'Prüfe danach: Ist er größer als eine Heftecke?'), 'F', g, h3('Ein stumpfer Winkel ist größer als 90°.', 'Die beiden Skalen haben verschiedene Zahlen.', 'Nimm die Skala, die am festen Schenkel bei 0 beginnt.')); },
    () => { const g = zehn(5, 8); return drehen(Z(`Zeichne einen spitzen Winkel von ${g}°.`), 'F', g, h3('Ein spitzer Winkel ist kleiner als 90°.', 'Suche die Zahl am Rand des Geodreiecks.', 'Drehe den Schenkel bis dorthin.')); },
  ]);
  sechs(W2, 'G', [
    () => { const g = fuenf(5, 17); return drehen(Z(`Zeichne einen Winkel von ${g}°.`, 'Der feste Schenkel liegt schräg.'), 'G', g, h3('Das Geodreieck liegt schon richtig.', 'Nimm die Skala, die am festen Schenkel bei 0 beginnt.', 'Die kleinen Striche zeigen Fünferschritte.')); },
    () => { const g = fuenf(19, 34); return drehen(Z(`Zeichne einen Winkel von ${g}°.`), 'G', g, h3('Der Winkel ist stumpf.', 'Lies auf der Skala ab, die am festen Schenkel bei 0 beginnt.', 'Prüfe zum Schluss mit der Heftecke.')); },
    () => { const a = fuenf(6, 30), g = 180 - a; return drehen(Z(`Der Winkel α ist ${a}° groß.`, 'Zeichne den Winkel β.', 'α und β ergeben zusammen einen gestreckten Winkel.'), 'G', g,
      h3('Ein gestreckter Winkel hat 180°.', `Rechne 180 − ${a}.`, 'Zeichne dann diesen Winkel.'), { vorher: [HILFSZAHL(180, 'Ein gestreckter Winkel hat 180°'), ...N(`180 − ${a}`)] }); },
    () => { const g = fuenf(5, 34); return drehen(Z(`Zeichne einen Winkel von ${g}°.`), 'G', g, h3('Suche den Nullpunkt am Scheitel.', 'Nimm die richtige Skala.', 'Drehe den Schenkel bis zur gesuchten Zahl.')); },
    () => { const g = 5 * wahl([9, 27, 15, 21, 25, 13]); return drehen(Z(`Zeichne einen Winkel von ${g}°.`, 'Prüfe danach mit der Heftecke.'), 'G', g, h3('Ist der Winkel spitz oder stumpf?', 'Danach richtet sich die Skala.', 'Ein stumpfer Winkel öffnet sich weiter als die Heftecke.')); },
    () => { const a = fuenf(7, 20), g = 2 * a; return drehen(Z(`Ein Winkel ist ${a}° groß.`, 'Zeichne einen doppelt so großen Winkel.'), 'G', g, h3('Rechne zuerst die Größe aus.', `Doppelt so groß heißt 2 · ${a}.`, 'Zeichne dann diesen Winkel.'), { vorher: [HILFSZAHL(2, 'doppelt'), ...N(`2 · ${a}`)] }); },
  ]);
  sechs(W2, 'M', [
    () => { const g = suche(() => zz(12, 170), (x) => x % 5 !== 0); return drehen(`Zeichne einen Winkel von ${g}°.`, 'M', g, h2('Nimm die Skala, die am festen Schenkel bei 0 beginnt.', 'Zähle die Gradstriche einzeln.')); },
    () => { const g = suche(() => zz(195, 345), (x) => x % 5 !== 0); return drehen(`Zeichne einen überstumpfen Winkel von ${g}°. Lege dazu das Geodreieck um.`, 'M', g, h2(`Zeichne zuerst den kleinen Winkel außen herum: 360° − ${g}°.`, 'Lege das Geodreieck auf die andere Seite des festen Schenkels.'),
      { vorher: [HILFSZAHL(360, 'Ein Vollwinkel hat 360°'), ...N(`360 − ${g}`)] }); },
    () => heftZeichnen((w, s) => `Zeichne in dein Heft einen Winkel von ${w}°. Beide Schenkel sollen ${s} cm lang sein. Verbinde die Endpunkte der Schenkel. Wie lang ist diese Strecke in mm?`,
      h2('Zeichne zuerst einen Schenkel, lege dann das Geodreieck an.', 'Du darfst 2 mm daneben liegen. Je genauer der Winkel, desto genauer die Strecke.')),
    () => { const g = suche(() => zz(95, 175), (x) => x % 5 !== 0); return drehen(`Zeichne einen stumpfen Winkel von ${g}°.`, 'M', g, h2('Nimm die Skala, die am festen Schenkel bei 0 beginnt.', 'Ein stumpfer Winkel öffnet sich weiter als 90°.')); },
    () => heftZeichnen((w, s) => `Zeichne einen Winkel mit ${w}° und zwei ${s} cm langen Schenkeln in dein Heft. Miss die Strecke zwischen den Endpunkten in mm.`,
      h2('Miss beide Schenkel genau ab, bevor du verbindest.', 'Du darfst 2 mm daneben liegen.')),
    () => { const a = zz(100, 170), g = 360 - a; return drehen(`Der Winkel α ist ${a}° groß. Zeichne den Winkel β, der α zu einem Vollwinkel ergänzt.`, 'M', g, h2('Ein Vollwinkel hat 360°.', 'β ist überstumpf. Lege das Geodreieck um.'),
      { vorher: [HILFSZAHL(360, 'Ein Vollwinkel hat 360°'), ...N(`360 − ${a}`)] }); },
  ]);
  sechs(W2, 'E', [
    () => { const g = suche(() => zz(12, 345), (x) => x % 5 !== 0 && x !== 180); return drehen(`Zeichne einen Winkel von ${g}°.`, 'E', g, h1(g > 180 ? 'Ein überstumpfer Winkel braucht das umgelegte Geodreieck.' : 'Achte auf die richtige Skala.'), g > 180 ? { vorher: [HILFSZAHL(360, 'Ein Vollwinkel hat 360°'), ...N(`360 − ${g}`)] } : {}); },
    () => heftZeichnen((w, s) => `Zeichne einen Winkel von ${w}° mit zwei Schenkeln von je ${s} cm in dein Heft. Wie lang ist die Verbindung der Endpunkte in mm?`, h1('Zeichne genau: Du darfst 2 mm daneben liegen.')),
    () => { const [h] = wahl([[4], [5], [8], [7], [1], [2]]), g = h * 30 > 180 ? 360 - h * 30 : h * 30; return drehen(`Zeichne den kleineren Winkel zwischen den Zeigern einer Uhr um ${h} Uhr. Von einer Zahl zur nächsten sind es 30°.`, 'E', g,
      h1('Zähle die Zahlenabstände zwischen den Zeigern.'), { vorher: [...N(h * 30 > 180 ? `${12 - h} · 30` : `${h} · 30`), ...(h * 30 > 180 ? [HILFSZAHL(12, 'Das Zifferblatt hat 12 Zahlen'), ...N(`12 − ${h}`)] : [])] }); },
    () => { const a = zz(30, 80), b = zz(30, 80), g = 180 - a - b; if (g < 15) return null;
      return drehen(`Ein Dreieck hat die Winkel ${a}° und ${b}°. Zeichne den dritten Winkel. Die drei Winkel ergeben zusammen 180°.`, 'E', g, h1('Rechne zuerst den dritten Winkel aus.'), { vorher: N(`${a} + ${b}`, `180 − ${a + b}`) }); },
    () => heftZeichnen((w, s) => `Zeichne ins Heft einen Winkel von ${w}°, beide Schenkel ${s} cm lang. Miss die Verbindung der Endpunkte in mm.`, h1('Du darfst 2 mm daneben liegen.')),
    () => { const a = suche(() => zz(20, 160), (x) => x % 5 !== 0), g = 360 - a; return drehen(`Zeichne den Winkel, der zusammen mit ${a}° einen Vollwinkel ergibt.`, 'E', g, h1('Ein Vollwinkel hat 360°. Lege das Geodreieck um.'),
      { vorher: [HILFSZAHL(360, 'Ein Vollwinkel hat 360°'), ...N(`360 − ${a}`)] }); },
  ]);
}
