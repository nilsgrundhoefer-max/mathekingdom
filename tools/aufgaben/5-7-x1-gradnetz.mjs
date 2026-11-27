// Aufgaben zum Abstecher 5.7.X1 „Gradnetz“ (Lernziel N1) nach ADR 0034.
// Ein rechteckiges Gradnetz ohne Kontinente mit echten Städten, ihre Lage auf ganze Grad gerundet. Geschrieben wird „52° N, 13° O“: zuerst die Breite.
// F: nur Nord und Ost, Linien alle 10°. G: alle Richtungen. M: Gradunterschiede. E: Fehler finden.
import { sechs, zahl, auswahl, opt, B, N, U, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { zz, wahl, mische, suche } from './5-7-winkel.mjs';

// Städte [Name, Breite, Länge]; Süden und Westen negativ. Auf ganze Grad gerundet.
const OSTEUROPA = [['Sankt Petersburg', 60, 30], ['Krakau', 50, 20], ['Baku', 40, 50], ['Moskau', 56, 38], ['Ankara', 40, 33], ['Helsinki', 60, 25], ['Riga', 57, 24], ['Minsk', 54, 28], ['Bukarest', 44, 26], ['Athen', 38, 24], ['Tiflis', 42, 45], ['Wien', 48, 16], ['Prag', 50, 14], ['Warschau', 52, 21], ['Stockholm', 59, 18], ['Oslo', 60, 11], ['Kopenhagen', 56, 13]];
const AUF_LINIE = ['Sankt Petersburg', 'Krakau', 'Baku'];
const AFRIKA = [['Kapstadt', -34, 18], ['Kairo', 30, 31], ['Lagos', 7, 3], ['Dakar', 15, -17], ['Nairobi', -1, 37], ['Johannesburg', -26, 28], ['Casablanca', 34, -8], ['Luanda', -9, 13], ['Daressalam', -7, 39], ['Antananarivo', -19, 48], ['Riad', 25, 47], ['Madrid', 40, -4], ['Lissabon', 39, -9]];
const AMERIKA = [['Rio de Janeiro', -23, -43], ['Lima', -12, -77], ['Buenos Aires', -35, -58], ['Mexiko-Stadt', 19, -99], ['Bogotá', 5, -74], ['Santiago', -33, -71], ['Havanna', 23, -82], ['Caracas', 10, -67], ['São Paulo', -24, -47], ['Miami', 26, -80], ['Recife', -8, -35]];
const ASIEN = [['Sydney', -34, 151], ['Perth', -32, 116], ['Tokio', 36, 140], ['Manila', 15, 121], ['Jakarta', -6, 107], ['Singapur', 1, 104], ['Darwin', -12, 131], ['Hongkong', 22, 114], ['Seoul', 38, 127], ['Bangkok', 14, 100]];
const ATLANTIK = [['New York', 41, -74], ['Madrid', 40, -4], ['Lissabon', 39, -9], ['Rom', 42, 12], ['Reykjavik', 64, -22], ['Paris', 49, 2], ['München', 48, 12], ['Toronto', 44, -79], ['Chicago', 42, -88], ['Dublin', 53, -6], ['Neapel', 41, 14]];
const NETZE = {
  ost: { liste: OSTEUROPA, breite: [30, 70], laenge: [0, 60], schritt: 10 },
  afrika: { liste: AFRIKA, breite: [-40, 40], laenge: [-20, 60], schritt: 20 },
  amerika: { liste: AMERIKA, breite: [-40, 40], laenge: [-120, -20], schritt: 20 },
  asien: { liste: ASIEN, breite: [-40, 40], laenge: [100, 180], schritt: 20 },
  atlantik: { liste: ATLANTIK, breite: [20, 80], laenge: [-100, 20], schritt: 20 },
};
const breiteText = (b) => `${Math.abs(b)}° ${b >= 0 ? 'N' : 'S'}`, laengeText = (l) => `${Math.abs(l)}° ${l >= 0 ? 'O' : 'W'}`;
const lage = (o) => `${breiteText(o.b)}, ${laengeText(o.l)}`;
// Ortsnamen ohne Überlappung: rechts vom Punkt, sonst links, oben oder unten.
function beschrifte(netz, orte, namen = false) {
  const k = 560 / (netz.laenge[1] - netz.laenge[0]), X = (l) => 64 + (l - netz.laenge[0]) * k, Y = (b) => 16 + (netz.breite[1] - b) * k;
  const kaesten = [], breite = (n) => n.length * 8.6 + 4;
  // Die Namen „Äquator“ und „Nullmeridian“ stehen am Rand des Netzes und brauchen ihren Platz.
  if (namen && netz.breite[0] < 0 && netz.breite[1] > 0) kaesten.push([64 + 560 - 6 - 70, Y(0) - 22, 64 + 560, Y(0) - 2]);
  if (namen && netz.laenge[0] < 0 && netz.laenge[1] > 0) kaesten.push([X(0) + 2, 16, X(0) + 6 + 100, 16 + 22]);
  const kasten = (o, pos) => { const x = X(o.l), y = Y(o.b), w = breite(o.n);
    return pos === 'r' ? [x + 7, y - 9, x + 9 + w, y + 7] : pos === 'l' ? [x - 9 - w, y - 9, x - 7, y + 7] : pos === 'o' ? [x - w / 2, y - 23, x + w / 2, y - 6] : [x - w / 2, y + 5, x + w / 2, y + 22]; };
  // Kein Name liegt auf einem Breitenkreis (waagerechte Linie); senkrechte Linien verdeckt der helle Rand der Schrift.
  const kreise = []; for (let b = netz.breite[0]; b <= netz.breite[1]; b += netz.schritt) kreise.push(Y(b));
  const frei = (q) => kreise.every((y) => y <= q[1] - 3 || y >= q[3] + 3) && q[0] >= 66 && q[2] <= 64 + 560 + 30 && q[1] >= 2 && q[3] <= Y(netz.breite[0]) + 2 && kaesten.every((p) => q[2] < p[0] || q[0] > p[2] || q[3] < p[1] || q[1] > p[3]) && orte.every((o) => { const x = X(o.l), y = Y(o.b); return x < q[0] - 5 || x > q[2] + 5 || y < q[1] - 5 || y > q[3] + 5; });
  return orte.map((o) => { const pos = ['r', 'l', 'o', 'u'].find((p) => frei(kasten(o, p))); if (!pos) return null; kaesten.push(kasten(o, pos)); return { ...o, pos }; });
}
// Ein Gradnetz mit n Orten, die mindestens 6° auseinanderliegen. pflicht: Namen, die dabei sein müssen.
function netzMit(name, n, { pflicht = [], passt = () => true, namen = false } = {}) {
  const netz = NETZE[name];
  for (let v = 0; v < 200; v++) {
    // Orte liegen mindestens 3° innerhalb des Rahmens, nicht auf dem Rand.
    const innen = ([, b, l]) => b >= netz.breite[0] + 3 && b <= netz.breite[1] - 3 && l >= netz.laenge[0] + 3 && l <= netz.laenge[1] - 3;
    const alle = mische(netz.liste.filter((o) => !pflicht.includes(o[0]) && innen(o)));
    const wahl_ = [...netz.liste.filter(([x]) => pflicht.includes(x)), ...alle].slice(0, n).map(([x, b, l]) => ({ n: x, b, l }));
    if (!wahl_.every((o, i) => wahl_.every((p, j) => i === j || Math.abs(o.b - p.b) + Math.abs(o.l - p.l) >= 8)) || !passt(wahl_)) continue;
    const orte = beschrifte(netz, mische(wahl_), namen);
    if (orte.some((o) => !o)) continue;
    return { orte, bild: B.gradnetz(netz.breite, netz.laenge, netz.schritt, orte, { namen }) };
  }
  throw new Error(`Kein Gradnetz für ${name}`);
}
// Wo liegt der Ort? Antworten sind Lagen; die falschen vertauschen Breite und Länge oder die Richtung.
function lageFrage(text, netz, hilfen, { niveau = 'G', ort = null, namen = false } = {}) {
  const x = netzMit(netz, 4, { pflicht: ort ? [ort] : [], namen }), o = ort ? x.orte.find((y) => y.n === ort) : wahl(x.orte);
  const vertauscht = `${Math.abs(o.l)}° ${o.b >= 0 ? 'N' : 'S'}, ${Math.abs(o.b)}° ${o.l >= 0 ? 'O' : 'W'}`;
  const richtung = niveau === 'F' ? `${breiteText(o.b + 10)}, ${laengeText(o.l)}` : `${breiteText(-o.b)}, ${laengeText(o.l)}`;
  const richtung2 = niveau === 'F' ? `${breiteText(o.b)}, ${laengeText(o.l + 10)}` : `${breiteText(o.b)}, ${laengeText(-o.l)}`;
  const optionen = [opt(lage(o), true), ...(Math.abs(o.b) !== Math.abs(o.l) ? [opt(vertauscht, false, 'gradnetz-vertauscht')] : []), opt(richtung, false, niveau === 'F' ? 'gradnetz-vertauscht' : 'gradnetz-richtung'), opt(richtung2, false, niveau === 'F' ? 'gradnetz-vertauscht' : 'gradnetz-richtung')];
  return auswahl(text(o.n), optionen, hilfen, { bild: x.bild, nachweis: [{ art: 'gradnetz', ort: o.n, b: o.b, l: o.l }] });
}
const WERT = { nord: (o) => o.b, sued: (o) => -o.b, ost: (o) => o.l, west: (o) => -o.l };
function ortFrage(text, netz, was, hilfen, { mehrfach = false, n = 3, namen = false } = {}) {
  const halb = { suedhalb: (o) => o.b < 0, nordhalb: (o) => o.b > 0, westhalb: (o) => o.l < 0, osthalb: (o) => o.l > 0 };
  const trifft = (orte) => (was in WERT ? (o) => WERT[was](o) === Math.max(...orte.map(WERT[was])) : halb[was]);
  const x = netzMit(netz, n, { namen, passt: (orte) => { const t = orte.filter(trifft(orte)).length; return mehrfach ? t >= 1 && t < orte.length : t === 1 && (was in WERT ? new Set(orte.map(WERT[was])).size === orte.length : true); } });
  const fv = was === 'nord' || was === 'sued' ? 'gradnetz-richtung' : was in WERT ? 'gradnetz-vertauscht' : 'gradnetz-richtung';
  return auswahl(text, x.orte.map((o) => { const ok = trifft(x.orte)(o); return opt(o.n, ok, ok ? undefined : fv); }), hilfen, { mehrfach, bild: x.bild, nachweis: [{ art: 'ortwahl', was }] });
}
// Welcher Ort liegt bei …? Antworten sind Ortsnamen.
function welcherOrt(text, netz, hilfen, { niveau = 'G' } = {}) {
  const x = netzMit(netz, 3, { pflicht: niveau === 'F' ? [wahl(AUF_LINIE)] : [] }), o = niveau === 'F' ? x.orte.find((y) => AUF_LINIE.includes(y.n)) : wahl(x.orte);
  if (x.orte.some((p) => p !== o && Math.abs(p.b) === Math.abs(o.b) && Math.abs(p.l) === Math.abs(o.l))) return null;
  return auswahl(text(lage(o)), x.orte.map((p) => opt(p.n, p === o, p === o ? undefined : 'gradnetz-vertauscht')), hilfen, { bild: x.bild, nachweis: [{ art: 'ortwahl', was: 'lage', b: o.b, l: o.l, grad: [Math.abs(o.b), Math.abs(o.l)] }] });
}
// Gradunterschied zwischen zwei Orten in Breite (b) oder Länge (l). Die Lagen stehen im Text.
function unterschied(text, netz, achse, hilfen, { ueber = null } = {}) {
  const x = netzMit(netz, 3, { passt: (orte) => { const [p, q] = orte; if (p[achse] === q[achse]) return false; const quer = Math.sign(p[achse]) !== Math.sign(q[achse]); return ueber == null || ueber === quer; } });
  const [p, q] = x.orte.slice(0, 2), wert = Math.abs(p[achse] - q[achse]), falsch = Math.abs(Math.abs(p[achse]) - Math.abs(q[achse]));
  const rechnung = Math.sign(p[achse]) !== Math.sign(q[achse]) ? `${Math.abs(p[achse])} + ${Math.abs(q[achse])}` : `${Math.max(Math.abs(p[achse]), Math.abs(q[achse]))} − ${Math.min(Math.abs(p[achse]), Math.abs(q[achse]))}`;
  return zahl(text(p, q, lage), wert, fehlerliste(wert, [[falsch, 'gradnetz-richtung'], [Math.abs(p[achse === 'b' ? 'l' : 'b'] - q[achse === 'b' ? 'l' : 'b']), 'gradnetz-vertauscht']]), hilfen,
    { einheit: '°', bild: x.bild, nachweis: [{ art: 'gradnetz', ort: p.n, b: p.b, l: p.l, grad: [Math.abs(p.b), Math.abs(p.l)] }, { art: 'gradnetz', ort: q.n, b: q.b, l: q.l, grad: [Math.abs(q.b), Math.abs(q.l)] }, ...N(rechnung), { art: 'gradunterschied', von: p.n, nach: q.n, achse, wert }] });
}
// Fehlersuche: Ein Kind nennt die Lage eines Ortes falsch.
function fehler(text, netz, art, hilfen) {
  const gut = (y) => Math.abs(y.b) !== Math.abs(y.l) && y.b !== 0 && y.l !== 0, x = netzMit(netz, 4, { passt: (orte) => orte.some(gut) }), o = x.orte.find(gut);
  const falsch = art === 'vertauscht' ? `${laengeText(o.l)}, ${breiteText(o.b)}` : art === 'ns' ? `${breiteText(-o.b)}, ${laengeText(o.l)}` : `${breiteText(o.b)}, ${laengeText(-o.l)}`;
  const optionen = [
    opt('Breite und Länge sind vertauscht. Zuerst kommt die Breite.', art === 'vertauscht', art === 'vertauscht' ? undefined : 'gradnetz-vertauscht'),
    opt(`Nord und Süd sind verwechselt. ${o.n} liegt ${o.b > 0 ? 'nördlich' : 'südlich'} vom Äquator.`, art === 'ns', art === 'ns' ? undefined : 'gradnetz-richtung'),
    opt(`Ost und West sind verwechselt. ${o.n} liegt ${o.l > 0 ? 'östlich' : 'westlich'} vom Nullmeridian.`, art === 'ow', art === 'ow' ? undefined : 'gradnetz-richtung'),
    opt('Nichts. Die Angabe ist richtig.', false, art === 'vertauscht' ? 'gradnetz-vertauscht' : 'gradnetz-richtung'),
  ];
  return auswahl(text(kind(), o.n, falsch), optionen, hilfen, { bild: x.bild, nachweis: [U(false), { art: 'gradnetz', ort: o.n, b: o.b, l: o.l }] });
}

export function gradnetz() {
  const N1 = '5.7.X1-N1';
  sechs(N1, 'F', [
    () => { const x = netzMit('ost', 4, { pflicht: [wahl(AUF_LINIE)] }), o = x.orte.find((y) => AUF_LINIE.includes(y.n));
      return zahl(Z(`Schau dir ${o.n} im Gradnetz an.`, 'Auf welchem Breitengrad liegt die Stadt?'), o.b, fehlerliste(o.b, [[o.l, 'gradnetz-vertauscht'], [o.b + 10, 'gradnetz-vertauscht'], [o.b - 10, 'gradnetz-vertauscht']]),
        h3('Breitengrade laufen waagerecht von links nach rechts.', 'Ihre Zahlen stehen am linken Rand.', 'Folge der Linie durch die Stadt nach links.'), { einheit: '° N', bild: x.bild, nachweis: [{ art: 'gradnetz', ort: o.n, b: o.b }] }); },
    () => { const x = netzMit('ost', 4, { pflicht: [wahl(AUF_LINIE)] }), o = x.orte.find((y) => AUF_LINIE.includes(y.n));
      return zahl(Z(`Schau dir ${o.n} im Gradnetz an.`, 'Auf welchem Längengrad liegt die Stadt?'), o.l, fehlerliste(o.l, [[o.b, 'gradnetz-vertauscht'], [o.l + 10, 'gradnetz-vertauscht'], [o.l - 10, 'gradnetz-vertauscht']]),
        h3('Längengrade laufen senkrecht von oben nach unten.', 'Ihre Zahlen stehen am unteren Rand.', 'Folge der Linie durch die Stadt nach unten.'), { einheit: '° O', bild: x.bild, nachweis: [{ art: 'gradnetz', ort: o.n, l: o.l }] }); },
    () => lageFrage((n) => Z(`Wo liegt ${n}?`, 'Zuerst kommt die Breite, dann die Länge.'), 'ost', h3('Die Breite liest du am linken Rand ab.', 'Die Länge liest du am unteren Rand ab.', 'Schreibe zuerst die Breite.'), { niveau: 'F', ort: wahl(AUF_LINIE) }),
    () => ortFrage(Z('Welche Stadt liegt am weitesten im Norden?'), 'ost', 'nord', h3('Norden ist im Gradnetz oben.', 'Vergleiche, wie hoch die Punkte liegen.', 'Die Stadt ganz oben liegt am weitesten im Norden.')),
    () => welcherOrt((l) => Z(`Welche Stadt liegt bei ${l}?`), 'ost', h3('Zuerst steht die Breite.', 'Suche diese Linie am linken Rand.', 'Suche dann die Länge am unteren Rand.'), { niveau: 'F' }),
    () => ortFrage(Z('Welche Stadt liegt am weitesten im Osten?'), 'ost', 'ost', h3('Osten ist im Gradnetz rechts.', 'Vergleiche, wie weit rechts die Punkte liegen.', 'Die Stadt ganz rechts liegt am weitesten im Osten.'), { n: 4 }),
  ]);
  sechs(N1, 'G', [
    () => lageFrage((n) => Z(`Wo liegt ${n} ungefähr?`, 'Achte auf N, S, O und W.'), 'afrika', h3('Über dem Äquator heißt es N, darunter S.', 'Rechts vom Nullmeridian heißt es O, links W.', 'Schreibe zuerst die Breite.'), { namen: true }),
    () => ortFrage(Z('Welche Stadt liegt am weitesten im Süden?'), 'afrika', 'sued', h3('Süden ist im Gradnetz unten.', 'Vergleiche, wie tief die Punkte liegen.', 'Die Stadt ganz unten liegt am weitesten im Süden.'), { namen: true }),
    () => ortFrage(Z('Welche Städte liegen auf der Südhalbkugel?', 'Kreuze alle an.'), 'afrika', 'suedhalb', h3('Der Äquator teilt die Erde in zwei Hälften.', 'Die Südhalbkugel liegt unter dem Äquator.', 'Kreuze alle Städte unter dem Äquator an.'), { mehrfach: true, n: 4, namen: true }),
    () => lageFrage((n) => Z(`Wo liegt ${n} ungefähr?`), 'amerika', h3('Alle Städte liegen westlich vom Nullmeridian.', 'Prüfe dann: über oder unter dem Äquator?', 'Schreibe zuerst die Breite.')),
    () => welcherOrt((l) => Z(`Welche Stadt liegt bei ${l}?`), wahl(['afrika', 'amerika']), h3('Suche zuerst die Breite am linken Rand.', 'Achte auf N und S.', 'Suche dann die Länge am unteren Rand.')),
    () => { const x = netzMit('amerika', 4, { passt: (l) => l.some((y) => y.b < 0) }), o = x.orte.find((y) => y.b < 0), k = kind();
      return auswahl(Z(`${k} sagt: „${o.n} liegt bei ${breiteText(-o.b)}, ${laengeText(o.l)}.“`, `Hat ${k} recht?`), [opt(`Nein.\n${o.n} liegt südlich vom Äquator.\nRichtig ist ${lage(o)}.`, true), opt('Ja.\nDie Angabe stimmt.', false, 'gradnetz-richtung')],
        h3('Schau, ob die Stadt über oder unter dem Äquator liegt.', 'Unter dem Äquator heißt es S.', 'Vergleiche mit der Angabe des Kindes.'), { bild: x.bild, nachweis: [U(false), { art: 'gradnetz', ort: o.n, b: o.b, l: o.l }] }); },
  ]);
  sechs(N1, 'M', [
    () => lageFrage((n) => `Wo liegt ${n}? Wähle die Angabe, die am besten passt.`, wahl(['asien', 'atlantik', 'afrika']), h2('Lies zuerst die Breite ab und dann die Länge.', 'Achte auf N oder S und auf O oder W.')),
    () => unterschied((p, q, l) => `${p.n} liegt bei ${l(p)}, ${q.n} bei ${l(q)}. Wie viele Grad liegen die beiden Städte in der Breite auseinander?`, wahl(['ost', 'atlantik']), 'b', h2('Vergleiche nur die Breiten.', 'Liegen beide nördlich vom Äquator, ziehst du die kleinere von der größeren ab.')),
    () => unterschied((p, q, l) => `${p.n} liegt bei ${l(p)}, ${q.n} bei ${l(q)}. Wie viele Grad liegen die beiden Städte in der Länge auseinander?`, wahl(['afrika', 'atlantik']), 'l', h2('Vergleiche nur die Längen.', 'Liegt der Nullmeridian dazwischen, zählst du beide Längen zusammen.'), { ueber: true }),
    () => ortFrage('Welche Städte liegen auf der Westhalbkugel? Kreuze alle an.', wahl(['afrika', 'atlantik']), 'westhalb', h2('Der Nullmeridian teilt die Erde in eine West- und eine Osthälfte.', 'Westlich davon steht W hinter der Länge.'), { mehrfach: true, n: 4 }),
    () => unterschied((p, q, l) => `${p.n} liegt bei ${l(p)}, ${q.n} bei ${l(q)}. Wie groß ist der Gradunterschied in der Breite?`, wahl(['afrika', 'amerika', 'asien']), 'b', h2('Liegt der Äquator zwischen den Städten?', 'Dann zählst du beide Breiten zusammen.'), { ueber: true }),
    () => { const b0 = 10 * zz(1, 4), l0 = 10 * zz(1, 8), weg = b0 + 10 * zz(1, 4), b1 = weg - b0, w = zz(0, 1);
      const ziel = `${b1}° N, ${l0}° ${w ? 'W' : 'O'}`;
      return auswahl(`Ein Schiff liegt bei ${b0}° S, ${l0}° ${w ? 'W' : 'O'}. Es fährt genau ${weg}° nach Norden. Wo ist es dann?`, [opt(ziel, true), opt(`${weg + b0}° N, ${l0}° ${w ? 'W' : 'O'}`, false, 'gradnetz-richtung'), opt(`${b1}° S, ${l0}° ${w ? 'W' : 'O'}`, false, 'gradnetz-richtung'), opt(`${l0}° N, ${b1}° ${w ? 'W' : 'O'}`, false, 'gradnetz-vertauscht')],
        h2('Bis zum Äquator fährt das Schiff erst ein Stück nach Norden.', 'Den Rest fährt es auf der Nordhalbkugel weiter.'), { nachweis: [{ art: 'gradfahrt', von: [-b0, w ? -l0 : l0], nord: weg }, ...N(`${weg} − ${b0}`)] }); },
  ]);
  sechs(N1, 'E', [
    () => lageFrage((n) => `Wo liegt ${n}? Wähle die Angabe, die am besten passt.`, 'asien', h1('Lies zuerst die Breite mit N oder S ab, dann die Länge mit O oder W.')),
    () => unterschied((p, q, l) => `${p.n} liegt bei ${l(p)}, ${q.n} bei ${l(q)}. Wie groß ist der Gradunterschied in der Breite?`, wahl(['afrika', 'amerika', 'asien']), 'b', h1('Prüfe zuerst, ob der Äquator zwischen den Städten liegt.'), { ueber: true }),
    () => unterschied((p, q, l) => `${p.n} liegt bei ${l(p)}, ${q.n} bei ${l(q)}. Wie groß ist der Gradunterschied in der Länge?`, 'atlantik', 'l', h1('Prüfe zuerst, ob der Nullmeridian zwischen den Städten liegt.')),
    () => fehler((k, n, f) => `${k} schreibt für ${n}: „${f}“. Was ist der Fehler?`, wahl(['asien', 'afrika', 'amerika']), 'vertauscht', h1('Prüfe die Reihenfolge und die Buchstaben N, S, O und W.')),
    () => fehler((k, n, f) => `${k} gibt die Lage von ${n} mit „${f}“ an. Was ist falsch?`, wahl(['afrika', 'amerika', 'asien']), wahl(['ns', 'ow']), h1('Vergleiche die Angabe mit dem Gradnetz: Über oder unter dem Äquator? Links oder rechts vom Nullmeridian?')),
    () => { const b0 = 10 * zz(1, 3), l0 = 10 * zz(1, 4), s = 10 * zz(b0 / 10 + 1, 5), o = 10 * zz(l0 / 10 + 1, 8), b1 = s - b0, l1 = o - l0;
      return auswahl(`Ein Flugzeug startet bei ${b0}° N, ${l0}° W. Es fliegt ${s}° nach Süden und dann ${o}° nach Osten. Wo landet es?`, [opt(`${b1}° S, ${l1}° O`, true), opt(`${b1}° N, ${l1}° W`, false, 'gradnetz-richtung'), opt(`${l1}° S, ${b1}° O`, false, 'gradnetz-vertauscht'), opt(`${s + b0}° S, ${o + l0}° O`, false, 'gradnetz-richtung')].filter((x, i, l) => l.findIndex((y) => y.text === x.text) === i),
        h1('Zerlege jeden Weg in das Stück bis zum Äquator oder Nullmeridian und den Rest.'), { nachweis: [{ art: 'gradfahrt', von: [b0, -l0], nord: -s, ost: o }, ...N(`${s} − ${b0}`, `${o} − ${l0}`)] }); },
  ]);
}
