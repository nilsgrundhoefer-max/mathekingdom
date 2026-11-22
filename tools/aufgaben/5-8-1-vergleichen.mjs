// Aufgaben zu 5.8.1 „Flächen vergleichen“ (Lernziele Z1 und Z2) nach ADR 0015 und ADR 0035.
// Z1: Flächeninhalt durch Kästchenzählen angeben und vergleichen. Z2: Umfang in Kästchenseiten, Umfang und Flächeninhalt unterscheiden.
// In 8.1 gibt es noch keine Einheit: gezählt wird in Kästchen, der Umfang in Kästchenseiten (Grilling mit Nils, 2026-11-22).

import { sechs, zahl, auswahl, opt, luecken, gitterFlaeche, Z, GT, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { form, setze, rasterBild, NF, randStuecke, inhaltVon, zellenVon, zz, wahl, mische, suche } from './5-8-flaechen.mjs';

const Z1 = '5.8.1-Z1', Z2 = '5.8.1-Z2';
const rechnungA = (rs) => (rs.length === 1 ? `${rs[0][2] - rs[0][0]} · ${rs[0][3] - rs[0][1]}` : rs.map((r) => `${r[2] - r[0]} · ${r[3] - r[1]}`).join(' + '));
const rechnungU = (rs) => randStuecke(rs).join(' + ');
const kaestchen = (n) => `${n} Kästchen`;
// Eine Figur einer Art auf dem Kästchengitter. Liefert { bild, rs, a, u } oder null.
function eine(art, groesse, { zerlegt = false } = {}) {
  const f = form(art, groesse), g = setze([f], { zerlegt });
  if (!g) return null;
  const rs = g.figuren[0].rechtecke;
  return { bild: rasterBild('kaestchen', g), rs, a: inhaltVon(rs), u: randStuecke(rs).reduce((s, x) => s + x, 0) };
}
// Mehrere Figuren mit Namen A, B, C nebeneinander.
function mehrere(arten, groesse, passt = () => true) {
  return suche(() => { const fs = arten.map((x) => form(x, groesse)), g = setze(fs, { namen: 'ABC', maxB: 16 }); return g && { g, a: g.figuren.map((f) => inhaltVon(f.rechtecke)), u: g.figuren.map((f) => randStuecke(f.rechtecke).reduce((s, x) => s + x, 0)) }; },
    (x) => x && passt(x));
}

// ---------- Z1: Kästchen zählen ----------
function zaehlen(text, art, groesse, hilfen, { zerlegt = false } = {}) {
  const x = eine(art, groesse, { zerlegt });
  if (!x || x.a > 40) return null;
  return zahl(text, x.a, fehlerliste(x.a, [[x.u, 'umfang-flaeche-verwechselt'], ...(x.rs.length > 1 ? [[inhaltVon([x.rs[0]]), 'teilflaeche-doppelt']] : [])]), hilfen,
    { einheit: 'Kästchen', bild: x.bild, nachweis: [`${rechnungA(x.rs)} = ${x.a}`, NF('inhalt', x.a)] });
}
// Welche Figur ist größer (oder kleiner)? Mit `gleich` haben alle Figuren gleich viele Kästchen.
function welcheGroesser(text, arten, groesse, hilfen, { ziel = 'groesste', gleich = false, was = 'inhalt', fehler = 'umfang-flaeche-verwechselt', passtGleichU = false, alle = false } = {}) {
  const x = mehrere(arten, groesse, (y) => {
    const w = was === 'inhalt' ? y.a : y.u, anders = was === 'inhalt' ? y.u : y.a;
    if (gleich) return w.every((v) => v === w[0]) && new Set(anders).size > 1;
    // Gleicher Umfang, verschiedener Flächeninhalt: Wer „gleicher Umfang, gleich groß“ denkt, wählt „Beide sind gleich“.
    if (passtGleichU) return y.u.every((v) => v === y.u[0]) && new Set(y.a).size === y.a.length;
    const z = (ziel === 'groesste' ? Math.max : Math.min)(...w);
    // Die gesuchte Figur gewinnt nicht auch beim anderen Maß: So fällt die Verwechslung auf.
    const za = (ziel === 'groesste' ? Math.max : Math.min)(...anders);
    return w.filter((v) => v === z).length === 1 && w.indexOf(z) !== anders.indexOf(za) && anders.filter((v) => v === za).length === 1 && Math.abs(w[0] - w[1]) <= 6;
  });
  const namen = x.g.figuren.map((f) => f.n), w = was === 'inhalt' ? x.a : x.u, anders = was === 'inhalt' ? x.u : x.a;
  const z = (ziel === 'groesste' ? Math.max : Math.min)(...w), za = (ziel === 'groesste' ? Math.max : Math.min)(...anders);
  const optionen = [...namen.map((n, i) => opt(n, !gleich && w[i] === z, !gleich && !passtGleichU && w[i] !== z && anders[i] === za ? fehler : undefined)),
    // Bei drei Figuren gibt es „Alle sind gleich“ nur ab M (mit `alle`), sonst wären es auf F und G zu viele Antworten.
    ...(namen.length === 2 || alle ? [opt(`${namen.length === 2 ? 'Beide' : 'Alle'} sind gleich ${was === 'umfang' ? 'lang' : 'groß'}.`, gleich, passtGleichU ? fehler : undefined)] : [])];
  if (gleich) optionen.forEach((o) => { if (!o.richtig) o.fehlvorstellung = fehler; });
  return auswahl(text, optionen, hilfen, { bild: rasterBild('kaestchen', x.g), nachweis: [...namen.map((n, i) => NF(was, w[i], n)), { art: 'figurwahl', was, ziel }] });
}
// Unterschied: Wie viele Kästchen hat A mehr als B?
function unterschied(text, arten, groesse, hilfen) {
  const x = mehrere(arten, groesse, (y) => y.a[0] > y.a[1] && y.a[0] - y.a[1] <= 8);
  const [a, b] = x.a;
  return zahl(text, a - b, fehlerliste(a - b, [[a + b, 'sub-addiert'], [Math.abs(x.u[0] - x.u[1]), 'umfang-flaeche-verwechselt']]), hilfen,
    { einheit: 'Kästchen', bild: rasterBild('kaestchen', x.g), nachweis: [NF('inhalt', a, 'A'), NF('inhalt', b, 'B'), `${a} − ${b} = ${a - b}`] });
}
// Rechteck aus n Kästchen färben (rechteck) oder eine beliebige zusammenhängende Figur.
function faerben(text, n, hilfen, { rechteck = true, b = 10, h = 7 } = {}) {
  const teiler = [...Array(n + 1).keys()].filter((w) => w >= 2 && n % w === 0 && w <= b - 2 && n / w <= h - 2 && n / w >= 2);
  if (!teiler.length) return null;
  const w = wahl(teiler), hh = n / w, beispiel = zellenVon(1, 1, w, hh);
  return gitterFlaeche(text, GT(b, h), { n, ...(rechteck ? { rechteck: true } : {}) }, beispiel, [], hilfen);
}
// Wer hat richtig gezählt?
function urteilZaehlen(art, groesse, hilfen, satz) {
  const x = eine(art, groesse);
  if (!x) return null;
  const stimmt = wahl([true, false]), behauptet = stimmt ? x.a : wahl([x.u, x.a + 2, x.a - 2].filter((v) => v > 0 && v !== x.a)), k = kind();
  // Jede „Falsch“-Antwort nennt eine andere Zahl als die behauptete, sonst widerspricht sie sich selbst.
  const andere = stimmt ? [x.a + 1, x.a - 1] : [x.a, [x.a + 1, x.a - 1].find((v) => v !== behauptet && v > 0)];
  return auswahl(satz(k, behauptet), [opt('Stimmt.', stimmt, stimmt ? undefined : 'liste-verzaehlt'),
    ...andere.map((v) => opt(`Falsch. Es sind ${kaestchen(v)}.`, !stimmt && v === x.a, stimmt || v !== x.a ? 'liste-verzaehlt' : undefined))], hilfen,
    { bild: x.bild, nachweis: [`${rechnungA(x.rs)} = ${x.a}`, NF('inhalt', x.a), { art: 'urteil', stimmt, behauptet: String(behauptet) }] });
}
// Wie viele Kästchen fehlen zum Rechteck? (Ergänzen, nur bei L-Formen: Das Rechteck ist so breit wie das untere Stück.)
function fehlenZumRechteck(text, groesse, hilfen) {
  const x = eine('L', groesse);
  if (!x) return null;
  const [r1, r2] = x.rs, w = r1[2] - r1[0], h1 = r1[3] - r1[1], h2 = r2[3] - r2[1], ganz = w * (h1 + h2), fehlt = ganz - x.a;
  return zahl(text, fehlt, fehlerliste(fehlt, [[ganz, 'sach-schritt-vergessen'], [x.a, 'sach-frage-verfehlt']]), hilfen,
    { einheit: 'Kästchen', bild: x.bild, nachweis: [`${h1} + ${h2} = ${h1 + h2}`, `${w} · ${h1 + h2} = ${ganz}`, NF('inhalt', x.a), `${ganz} − ${x.a} = ${fehlt}`] });
}

// ---------- Z2: Umfang ----------
function umfang(text, art, groesse, hilfen, { quadrat = false } = {}) {
  const x = quadrat ? (() => { const s = zz(2, 4 + groesse); const g = setze([{ rechtecke: [[0, 0, s, s]] }]); return g && { bild: rasterBild('kaestchen', g), rs: g.figuren[0].rechtecke, a: s * s, u: 4 * s }; })() : eine(art, groesse);
  if (!x || x.u === x.a) return null;
  const r = x.rs[0], halb = x.rs.length === 1 ? (r[2] - r[0]) + (r[3] - r[1]) : -1, randK = x.rs.length === 1 ? x.u - 4 : -1;
  return zahl(text, x.u, fehlerliste(x.u, [[x.a, 'umfang-flaeche-verwechselt'], [halb, 'umfang-halb'], [randK, 'randkaestchen-gezaehlt']]), hilfen,
    { einheit: 'Kästchenseiten', bild: x.bild, nachweis: [`${rechnungU(x.rs)} = ${x.u}`, NF('umfang', x.u)] });
}
function beides(text, art, groesse, hilfen) {
  const x = eine(art, groesse);
  if (!x || x.u === x.a) return null;
  return luecken(text, { a: [x.a, fehlerliste(x.a, [[x.u, 'umfang-flaeche-verwechselt']])], b: [x.u, fehlerliste(x.u, [[x.a, 'umfang-flaeche-verwechselt']])] }, hilfen,
    { bild: x.bild, nachweis: [`${rechnungA(x.rs)} = ${x.a}`, NF('inhalt', x.a), `${rechnungU(x.rs)} = ${x.u}`, NF('umfang', x.u)] });
}
// Ein Rechteck mit diesem Umfang färben. Ohne `rechteck` zählt jede zusammenhängende Figur mit Umfang u und n Kästchen.
function faerbeUmfang(text, hilfen, { n = null, b = 10, h = 7, rechteck = true } = {}) {
  const moeglich = [];
  for (let w = 1; w <= b - 2; w++) for (let hh = 1; hh <= h - 2; hh++) if (n == null || w * hh === n) moeglich.push([w, hh]);
  const passend = moeglich.filter(([x, y]) => x >= 2 && y >= 2 && (n != null || x !== y));
  if (!passend.length) return null;
  const [w, hh] = wahl(passend);
  const u = 2 * w + 2 * hh;
  if (u === w * hh) return null;
  return gitterFlaeche(text(u, w * hh), GT(b, h), { umfang: u, ...(n != null ? { n } : {}), ...(rechteck ? { rechteck: true } : {}) }, zellenVon(1, 1, w, hh), n == null ? [[{ n: u, ...(rechteck ? { rechteck: true } : {}) }, 'umfang-flaeche-verwechselt']] : [], hilfen);
}
// Rechnen ohne Bild: Rechteck aus n Kästchen, w breit. Wie lang? Wie groß ist der Umfang?
const ohneBild = {
  lang: (hilfen) => { const w = zz(2, 4), l = zz(w + 1, 9), n = w * l;
    return zahl(Z(`Ein Rechteck besteht aus ${n} Kästchen.`, `Es ist ${w} Kästchen breit.`, 'Wie viele Kästchen ist es lang?'), l, fehlerliste(l, [[n - w, 'div-falsche-rechenart'], [n * w, 'div-falsche-rechenart']]), hilfen, { einheit: 'Kästchen', nachweis: [`${n} : ${w} = ${l}`] }); },
  umfang: (hilfen) => { const w = zz(2, 4), l = zz(w + 1, 9), n = w * l, u = 2 * l + 2 * w;
    return zahl(Z(`Ein Rechteck besteht aus ${n} Kästchen.`, `Es ist ${w} Kästchen breit.`, 'Wie viele Kästchenseiten ist sein Umfang?'), u, fehlerliste(u, [[l + w, 'umfang-halb'], [n, 'umfang-flaeche-verwechselt']]), hilfen, { einheit: 'Kästchenseiten', nachweis: [`${n} : ${w} = ${l}`, `2 · ${l} + 2 · ${w} = ${u}`] }); },
  ausUmfang: (hilfen) => { const l = zz(4, 9), w = zz(2, l - 1), u = 2 * l + 2 * w;
    return zahl(Z(`Ein Rechteck hat den Umfang ${u} Kästchenseiten.`, `Es ist ${l} Kästchen lang.`, 'Aus wie vielen Kästchen besteht es?'), l * w, fehlerliste(l * w, [[l * (u - l), 'umfang-halb'], [u, 'umfang-flaeche-verwechselt']]), hilfen, { einheit: 'Kästchen', nachweis: [`${u} : 2 = ${l + w}`, `${l + w} − ${l} = ${w}`, `${l} · ${w} = ${l * w}`] }); },
  breiter: (hilfen) => { const w = zz(2, 4), l = zz(4, 8), n = w * l, d = zz(1, 2), neu = l * (w + d);
    return zahl(Z(`Ein Rechteck besteht aus ${n} Kästchen und ist ${w} Kästchen breit.`, `Ein zweites Rechteck ist genauso lang, aber ${d} Kästchen breiter.`, 'Aus wie vielen Kästchen besteht das zweite Rechteck?'), neu, fehlerliste(neu, [[n + d, 'sach-schritt-vergessen'], [n + d * w, 'sach-falsche-rechnung']]), hilfen,
      { einheit: 'Kästchen', nachweis: [`${n} : ${w} = ${l}`, `${w} + ${d} = ${w + d}`, `${l} · ${w + d} = ${neu}`] }); },
};

export function flaechenVergleichen() {
  const tippZaehlen = (wie) => h3('Zähle die Kästchen Reihe für Reihe.', 'Eine Reihe hat 4 Kästchen. 3 Reihen sind 3 · 4 = 12 Kästchen.', wie);
  sechs(Z1, 'F', [
    () => zaehlen(Z('Zähle die Kästchen.', 'Wie viele Kästchen bedeckt das Rechteck?'), 'rechteck', 1, tippZaehlen('Zähle die Kästchen in einer Reihe. Rechne dann mal die Anzahl der Reihen.')),
    () => zaehlen(Z('Die Figur besteht aus zwei Teilen.', 'Wie viele Kästchen bedeckt sie?'), 'L', 1, h3('Zähle die Kästchen von jedem Teil.', 'Ein Teil hat 6 Kästchen, der andere 4. Zusammen sind es 6 + 4 = 10.', 'Zähle beide Teile zusammen.'), { zerlegt: true }),
    () => welcheGroesser(Z('Welche Figur ist größer?', 'Zähle die Kästchen.'), ['rechteck', 'L'], 1, h3('Zähle die Kästchen jeder Figur.', 'Figur A hat 8 Kästchen, Figur B hat 10. Dann ist B größer.', 'Die Figur mit mehr Kästchen ist größer.')),
    () => { const n = wahl([6, 8, 9, 10, 12]); return faerben(Z(`Färbe ${n} Kästchen.`, 'Sie sollen ein Rechteck bilden.'), n, h3('Ein Rechteck hat Reihen mit gleich vielen Kästchen.', '6 Kästchen: 2 Reihen mit je 3 Kästchen.', `Überlege: Wie viele Reihen mit wie vielen Kästchen ergeben ${n}?`)); },
    () => unterschied(Z('Zähle die Kästchen von A und von B.', 'Wie viele Kästchen hat A mehr als B?'), ['rechteck', 'rechteck'], 1, h3('Zähle zuerst beide Figuren.', 'A hat 12 Kästchen, B hat 8. Dann hat A 12 − 8 = 4 Kästchen mehr.', 'Ziehe die kleinere Zahl von der größeren ab.')),
    () => zaehlen(Z('Zähle die Kästchen.', 'Wie viele Kästchen bedeckt die Figur?'), 'T', 1, tippZaehlen('Zähle oben und unten getrennt. Zähle dann zusammen.')),
  ]);
  sechs(Z1, 'G', [
    () => zaehlen(Z('Wie viele Kästchen bedeckt das Rechteck?'), 'rechteck', 2, tippZaehlen('Rechne: Kästchen in einer Reihe mal Anzahl der Reihen.')),
    () => zaehlen(Z('Wie viele Kästchen bedeckt die Figur?'), 'L', 2, h3('Teile die Figur in zwei Rechtecke.', 'Unten 5 · 2 = 10 Kästchen, oben 2 · 3 = 6 Kästchen. Zusammen 16.', 'Zähle jedes Rechteck für sich und zähle dann zusammen.')),
    () => welcheGroesser(Z('Welche Figur ist am größten?'), ['rechteck', 'L', 'T'], 1, h3('Zähle die Kästchen jeder Figur.', 'A hat 9, B hat 12, C hat 10 Kästchen. B ist am größten.', 'Vergleiche die drei Zahlen.')),
    () => { const n = wahl([7, 10, 11, 13]); return faerben(Z(`Färbe eine Figur aus ${n} Kästchen.`, 'Die Kästchen sollen mit einer Seite aneinanderstoßen.'), n, h3('Die Figur muss kein Rechteck sein.', 'Eine Reihe mit 5 Kästchen und darüber 2 Kästchen sind 7 Kästchen.', 'Zähle beim Färben mit.'), { rechteck: false, b: 12 }); },
    () => unterschied(Z('Wie viele Kästchen hat Figur A mehr als Figur B?'), ['L', 'rechteck'], 2, h3('Zähle zuerst beide Figuren.', 'A hat 15 Kästchen, B hat 9. Dann hat A 15 − 9 = 6 Kästchen mehr.', 'Ziehe ab.')),
    () => urteilZaehlen('T', 2, h3('Zähle selbst nach.', 'Zähle Reihe für Reihe und schreibe dir jede Zahl auf.', 'Vergleiche dein Ergebnis mit der Zahl im Text.'), (k, x) => Z(`${k} hat die Kästchen der Figur gezählt.`, `${k} sagt: Es sind ${kaestchen(x)}.`, 'Stimmt das?')),
  ]);
  sechs(Z1, 'M', [
    () => zaehlen('Wie viele Kästchen bedeckt die Figur?', 'U', 2, h2('Teile die Figur in Rechtecke und zähle jedes für sich.', 'Rechne bei jedem Rechteck Kästchen in einer Reihe mal Anzahl der Reihen.')),
    () => welcheGroesser('Welche Figur ist am kleinsten?', ['L', 'T', 'rechteck'], 2, h2('Bestimme für jede Figur die Anzahl der Kästchen.', 'Vergleiche dann die drei Anzahlen.'), { ziel: 'kleinste', alle: true }),
    () => fehlenZumRechteck('Wie viele Kästchen muss man dazufärben, damit aus der Figur ein Rechteck wird?', 2, h2('Stell dir das ganze Rechteck um die Figur vor.', 'Rechne aus, wie viele Kästchen das Rechteck hat, und ziehe die Kästchen der Figur ab.')),
    () => { const n = wahl([14, 15, 17, 19]); return faerben(`Färbe eine Figur aus ${n} Kästchen, deren Kästchen mit einer Seite aneinanderstoßen.`, n, h2('Die Figur muss kein Rechteck sein.', 'Färbe zum Beispiel zuerst ein Rechteck und hänge die übrigen Kästchen an.'), { rechteck: false, b: 12, h: 8 }); },
    () => unterschied('Wie viele Kästchen hat Figur A mehr als Figur B?', ['U', 'T'], 2, h2('Zähle beide Figuren genau.', 'Ziehe dann die kleinere Anzahl von der größeren ab.')),
    () => ohneBild.lang(h2('Das Rechteck hat Reihen mit gleich vielen Kästchen.', 'Teile die Anzahl der Kästchen durch die Breite.')),
  ]);
  sechs(Z1, 'E', [
    () => zaehlen('Wie viele Kästchen bedeckt die Figur?', 'treppe', 3, h1('Teile die Figur in Rechtecke.')),
    () => welcheGroesser('Welche Figur ist am größten?', ['U', 'L', 'T'], 2, h1('Bestimme die Anzahl der Kästchen jeder Figur.'), { alle: true }),
    () => fehlenZumRechteck('Wie viele Kästchen fehlen der Figur zu einem Rechteck?', 3, h1('Rechne das ganze Rechteck aus und ziehe die Figur ab.')),
    () => ohneBild.breiter(h1('Rechne zuerst aus, wie lang das erste Rechteck ist.')),
    () => unterschied('Um wie viele Kästchen ist Figur A größer als Figur B?', ['treppe', 'L'], 2, h1('Zähle beide Figuren und vergleiche.')),
    () => urteilZaehlen('U', 3, h1('Zähle selbst nach.'), (k, x) => `${k} hat die Kästchen der Figur gezählt und sagt: Es sind ${kaestchen(x)}. Stimmt das?`),
  ]);

  const tippRand = h3('Fahre mit dem Finger den Rand entlang.', 'Ein Rechteck mit 3 und 2 Kästchen hat 3 + 2 + 3 + 2 = 10 Kästchenseiten Rand.', 'Zähle jede Kästchenseite auf dem Rand. An einer Ecke zählen zwei Seiten.');
  sechs(Z2, 'F', [
    () => umfang(Z('Wie lang ist der Rand des Rechtecks?', 'Zähle die Kästchenseiten.'), 'rechteck', 1, tippRand),
    () => umfang(Z('Wie lang ist der Rand der Figur?', 'Zähle die Kästchenseiten.'), 'L', 1, tippRand),
    () => umfang(Z('Wie lang ist der Rand des Quadrats?', 'Zähle die Kästchenseiten.'), null, 1, h3('Ein Quadrat hat vier gleich lange Seiten.', 'Bei einer Seite mit 3 Kästchen sind es 3 + 3 + 3 + 3 = 12.', 'Zähle eine Seite und rechne mal 4.'), { quadrat: true }),
    () => faerbeUmfang((u) => Z('Färbe ein Rechteck.', `Sein Rand soll ${u} Kästchenseiten lang sein.`), h3('Der Rand ist alles außen herum.', 'Ein Rechteck mit 3 und 2 Kästchen hat 3 + 2 + 3 + 2 = 10 Kästchenseiten Rand.', 'Probiere ein Rechteck und zähle seinen Rand.')),
    () => welcheGroesser(Z('Welche Figur hat den längeren Rand?', 'Zähle die Kästchenseiten.'), ['rechteck', 'rechteck'], 2, h3('Zähle den Rand jeder Figur.', 'A hat 12 Kästchenseiten Rand, B hat 14. B hat den längeren Rand.', 'Vergleiche die beiden Zahlen.'), { was: 'umfang' }),
    () => beides(Z('Zähle beim Rechteck.', 'Kästchen: {{a}}', 'Kästchenseiten am Rand: {{b}}'), 'rechteck', 1, h3('Kästchen zählst du innen, Kästchenseiten auf dem Rand.', 'Ein Rechteck mit 3 und 2 Kästchen: 6 Kästchen, 10 Kästchenseiten.', 'Zähle zuerst die Kästchen, dann den Rand.')),
  ]);
  sechs(Z2, 'G', [
    () => umfang(Z('Wie groß ist der Umfang des Rechtecks?', 'Gib ihn in Kästchenseiten an.'), 'rechteck', 2, tippRand),
    () => umfang(Z('Wie groß ist der Umfang der Figur?'), 'T', 1, tippRand),
    () => beides(Z('Bestimme Flächeninhalt und Umfang.', 'Flächeninhalt: {{a}} Kästchen', 'Umfang: {{b}} Kästchenseiten'), 'L', 2, h3('Der Flächeninhalt zählt die Kästchen innen, der Umfang die Kästchenseiten außen.', 'Ein Quadrat mit Seiten aus 2 Kästchen hat 4 Kästchen und 8 Kästchenseiten Umfang.', 'Zähle beides getrennt.')),
    () => faerbeUmfang((u) => Z(`Färbe ein Rechteck mit dem Umfang ${u} Kästchenseiten.`), h3('Der Umfang ist der Rand einmal ganz herum.', 'Ein Rechteck mit 4 und 2 Kästchen hat 4 + 2 + 4 + 2 = 12 Kästchenseiten Umfang.', 'Probiere ein Rechteck und zähle seinen Umfang.')),
    () => welcheGroesser(Z('Welche Figur hat den größeren Umfang?'), ['L', 'rechteck', 'T'], 1, h3('Zähle den Umfang jeder Figur.', 'A hat 14, B hat 12, C hat 16 Kästchenseiten. C hat den größten Umfang.', 'Vergleiche die drei Zahlen.'), { was: 'umfang' }),
    () => welcheGroesser(Z('A und B haben den gleichen Umfang.', 'Welche Figur hat den größeren Flächeninhalt?'), ['rechteck', 'rechteck'], 2, h3('Zähle bei beiden Figuren die Kästchen.', 'Zwei Rechtecke mit 12 Kästchenseiten Umfang: 5 · 1 = 5 und 3 · 3 = 9 Kästchen.', 'Gleicher Umfang heißt nicht gleich viele Kästchen.'), { fehler: 'gleicher-umfang-gleiche-flaeche', passtGleichU: true }),
  ]);
  sechs(Z2, 'M', [
    () => umfang('Wie groß ist der Umfang der Figur in Kästchenseiten?', 'T', 2, h2('Zähle jede Kästchenseite auf dem Rand.', 'Mache an einer Ecke einen Punkt und fahre einmal ganz herum.')),
    () => umfang('Wie groß ist der Umfang der Figur in Kästchenseiten?', 'U', 2, h2('Denke auch an den Rand innen in der Lücke.', 'Fahre einmal ganz herum und zähle jede Kästchenseite.')),
    () => beides(Z('Bestimme Flächeninhalt und Umfang der Figur.', 'Flächeninhalt: {{a}} Kästchen', 'Umfang: {{b}} Kästchenseiten'), 'U', 2, h2('Der Flächeninhalt zählt die Kästchen, der Umfang die Kästchenseiten auf dem Rand.', 'Zähle beides getrennt und prüfe, dass du nichts verwechselt hast.')),
    () => faerbeUmfang((u, n) => `Färbe eine Figur aus ${n} Kästchen mit dem Umfang ${u} Kästchenseiten.`, h2('Die Figur muss nicht unbedingt ein Rechteck sein.', 'Probiere zuerst ein Rechteck und zähle seinen Umfang.'), { n: wahl([6, 8, 9, 10, 12]), rechteck: false }),
    () => welcheGroesser('A und B haben den gleichen Umfang. Welche Figur hat den größeren Flächeninhalt?', ['rechteck', 'rechteck'], 2, h2('Zähle bei beiden Figuren die Kästchen.', 'Gleicher Umfang heißt nicht gleich viele Kästchen.'), { fehler: 'gleicher-umfang-gleiche-flaeche', passtGleichU: true }),
    () => ohneBild.umfang(h2('Rechne zuerst aus, wie lang das Rechteck ist.', 'Der Umfang ist zweimal die Länge und zweimal die Breite.')),
  ]);
  sechs(Z2, 'E', [
    () => umfang('Wie groß ist der Umfang der Figur in Kästchenseiten?', 'U', 3, h1('Fahre einmal ganz herum, auch in die Lücke hinein.')),
    () => welcheGroesser('Welche Figur hat den kleinsten Umfang?', ['U', 'L', 'rechteck'], 2, h1('Bestimme den Umfang jeder Figur.'), { was: 'umfang', ziel: 'kleinste', alle: true }),
    () => faerbeUmfang((u, n) => `Färbe eine Figur aus ${n} Kästchen mit dem Umfang ${u} Kästchenseiten.`, h1('Probiere verschiedene Figuren und zähle jeweils den Umfang.'), { n: wahl([8, 10, 12, 15]), rechteck: false, b: 12, h: 8 }),
    () => ohneBild.ausUmfang(h1('Die Hälfte des Umfangs ist Länge plus Breite.')),
    () => beides('Bestimme den Flächeninhalt in Kästchen und den Umfang in Kästchenseiten: {{a}} Kästchen, {{b}} Kästchenseiten', 'treppe', 3, h1('Zähle die Kästchen innen und die Kästchenseiten außen.')),
    () => welcheGroesser(`${kind()} sagt: A und B haben den gleichen Umfang, also sind sie gleich groß. Welche Figur hat den größeren Flächeninhalt?`, ['rechteck', 'rechteck'], 2, h1('Zähle bei beiden Figuren die Kästchen.'), { fehler: 'gleicher-umfang-gleiche-flaeche', passtGleichU: true }),
  ]);
}
