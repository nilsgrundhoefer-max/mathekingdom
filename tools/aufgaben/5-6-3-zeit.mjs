// Aufgaben zu 5.6.3 „Zeit“ (Lernziele Z1 und Z2) nach ADR 0015 und ADR 0033.
// Z1: Zeitspannen umwandeln (s, min, h, d). Die Umrechnungszahl ist 60 oder 24, darum gibt es hier keine Einheitentafel.
// Z2: Zeitpunkte und Zeitspannen. Zeigeruhr nur auf F. F und G: innerhalb einer Stunde oder volle Stunden.
// Ab M über die volle Stunde und über Mitternacht. E: Fahrplan mit Umsteigen.

import { sechs, zahl, auswahl, opt, luecken, zuordnen, ordnen, umwandeltabelle, L, Z, B, G, frage, h1, h2, h3, zz, wahl, mische, fehlerliste, kind, HILFSGROESSE } from '../werkzeug.mjs';
import { uhr, uhrKurz, dauer, merktabelle, MERK, zweiOrte, dreiOrte } from './5-6-groessen.mjs';

const S_ = (kurz) => `5.6.3-${kurz}`;
const MERK_ZEIT = merktabelle(MERK.hmin, MERK.mins, MERK.tag);
const H_HMIN = h3('1 h sind 60 min.', '2 h sind 2 · 60 min = 120 min.', 'Rechne die Stunden mal 60.');
const H_MINS = h3('1 min sind 60 s.', '2 min sind 2 · 60 s = 120 s.', 'Rechne die Minuten mal 60.');
// Uhrzeit als zwei Lücken „▢:▢ Uhr“. Die Minuten sind mindestens 10, damit keine führende Null nötig ist.
const uhrLuecken = (minuten, fehler = []) => ({ a: Math.floor(minuten / 60) % 24, b: [minuten % 60, fehlerliste(minuten % 60, fehler)] });
const ANLASS = [['Das Training', 'es'], ['Die Probe', 'sie'], ['Der Film', 'er'], ['Die Pause', 'sie'], ['Das Spiel', 'es'], ['Der Kurs', 'er']];
const fahrplan = (halte) => ({ kopf: ['Halt', 'Abfahrt'], zeilen: halte.map(([ort, t]) => [ort, uhrKurz(t)]) });

export function zeit() {
  // =====================================================================
  // Z1 Zeitspannen umwandeln
  // =====================================================================
  sechs(S_('Z1'), 'F', [
    () => { const n = zz(2, 5);
      return luecken(Z('Schau in die Tabelle.', `${n} h = {{a}} min`), { a: [n * 60, fehlerliste(n * 60, [[n * 100, 'zeit-zehnersystem'], [n * 10, 'zeit-zehnersystem'], [n * 24, 'umrechnungszahl']])] }, H_HMIN, { daten: MERK_ZEIT, nachweis: [G(`${n} h = ${n * 60} min`)] }); },
    () => { const n = zz(2, 5);
      return luecken(Z('Schau in die Tabelle.', `${n} min = {{a}} s`), { a: [n * 60, fehlerliste(n * 60, [[n * 100, 'zeit-zehnersystem'], [n * 10, 'zeit-zehnersystem']])] }, H_MINS, { daten: MERK_ZEIT, nachweis: [G(`${n} min = ${n * 60} s`)] }); },
    () => { const h = zz(1, 3), m = zz(1, 11) * 5, n = h * 60 + m;
      return luecken(Z('Schau in die Tabelle.', `${h} h ${m} min = {{a}} min`), { a: [n, fehlerliste(n, [[h * 100 + m, 'zeit-zehnersystem'], [h + m, 'masszahlen-addiert']])] },
        h3('Wandle zuerst die Stunden in Minuten um. Zähle dann die Minuten dazu.', '1 h 10 min sind 60 min + 10 min = 70 min.', '1 h sind 60 min.'), { daten: MERK_ZEIT, nachweis: [G(`${h} h ${m} min = ${n} min`)] }); },
    () => { const n = zz(2, 4);
      return auswahl(Z('Schau in die Tabelle.', `Was ist genauso viel wie ${n} h?`), [opt(`${n * 60} min`, true), opt(`${n * 100} min`, false, 'zeit-zehnersystem'), opt(`${n * 10} min`, false, 'zeit-zehnersystem')], H_HMIN, { daten: MERK_ZEIT, nachweis: [{ art: 'gleichwert', groesse: `${n} h` }] }); },
    () => { const h = zz(1, 2), m = zz(2, 10) * 5, n = h * 60 + m;
      return luecken(Z('Schau in die Tabelle.', `${n} min = {{a}} h {{b}} min`), { a: h, b: [m, fehlerliste(m, [[n - h * 100, 'zeit-zehnersystem']])] },
        h3('60 min sind 1 h. Ziehe für jede Stunde 60 min ab.', '70 min sind 1 h 10 min.', 'Der Rest bleibt in Minuten stehen.'), { daten: MERK_ZEIT, nachweis: [G(`${n} min = ${h} h ${m} min`)] }); },
    () => { const n = zz(2, 4), paare = [[`${n} h`, `${n * 60} min`], [`${n + 1} min`, `${(n + 1) * 60} s`], ['2 Tage', '48 h']];
      return zuordnen(Z('Schau in die Tabelle.', 'Was ist gleich viel?'), paare, h3('Suche die passende Zeile in der Tabelle.', '2 h sind 2 · 60 min = 120 min.', 'Bei Stunden und Minuten rechnest du mal 60. Bei Tagen rechnest du mal 24.'), { daten: MERK_ZEIT, nachweis: paare.map(([l, r]) => G(`${l} = ${r}`)) }); },
  ]);
  sechs(S_('Z1'), 'G', [
    () => { const n = zz(4, 12);
      return luecken(Z('Wandle um.', `${n} h = {{a}} min`), { a: [n * 60, fehlerliste(n * 60, [[n * 100, 'zeit-zehnersystem'], [n * 10, 'zeit-zehnersystem']])] }, H_HMIN, { daten: MERK_ZEIT, nachweis: [G(`${n} h = ${n * 60} min`)] }); },
    () => { const n = zz(3, 9), d = zz(2, 5);
      return luecken(Z('Wandle um.', `${n * 60} min = {{a}} h`, `${d} d = {{b}} h`), { a: [n, fehlerliste(n, [[n * 6, 'zeit-zehnersystem']])], b: [d * 24, fehlerliste(d * 24, [[d * 60, 'umrechnungszahl'], [d * 12, 'umrechnungszahl']])] },
        h3('60 min sind 1 h. 1 d ist ein Tag und hat 24 h.', '120 min sind 2 h. 2 d sind 2 · 24 h = 48 h.', 'Teile die Minuten durch 60. Rechne die Tage mal 24.'), { daten: MERK_ZEIT, nachweis: [G(`${n * 60} min = ${n} h`), G(`${d} d = ${d * 24} h`)] }); },
    () => { const h = zz(2, 4), m = zz(3, 11) * 5, h2_ = zz(2, 4), m2 = zz(1, 11) * 5;
      return luecken(Z('Wandle um.', `${h} h ${m} min = {{a}} min`, `${h2_ * 60 + m2} min = {{b}} h {{c}} min`), { a: [h * 60 + m, fehlerliste(h * 60 + m, [[h * 100 + m, 'zeit-zehnersystem']])], b: h2_, c: m2 },
        h3('1 h sind 60 min. Rechne nicht mit 100.', '2 h 10 min sind 120 min + 10 min = 130 min.', 'Wandle die Stunden um und zähle den Rest dazu.'), { daten: MERK_ZEIT, nachweis: [G(`${h} h ${m} min = ${h * 60 + m} min`), G(`${h2_ * 60 + m2} min = ${h2_} h ${m2} min`)] }); },
    () => { const a = zz(2, 5), b = zz(6, 9), c = zz(10, 12);
      return umwandeltabelle('Fülle die Tabelle aus.', ['h', 'min'], [[a, L('a')], [L('b'), b * 60], [c, L('c')]], { a: [a * 60, fehlerliste(a * 60, [[a * 100, 'zeit-zehnersystem']])], b, c: c * 60 }, H_HMIN, { nachweis: [G(`${a} h = ${a * 60} min`), G(`${b * 60} min = ${b} h`), G(`${c} h = ${c * 60} min`)] }); },
    () => { const h = zz(1, 3), werte = [[h * 60 - 10, 'min'], [h * 60 + 5, 'mix'], [h * 60 + 30, 'min'], [(h + 1) * 60, 'h']];
      return ordnen(Z('Ordne die Zeitspannen.', 'Beginne mit der kürzesten Zeitspanne.'), werte.map(([w, wie]) => (wie === 'min' ? `${w} min` : wie === 'h' ? `${w / 60} h` : dauer(w))), h3('Wandle alles in Minuten um. Vergleiche dann.', '1 h 5 min sind 65 min.', '1 h sind 60 min.'), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], links: 'kurz', rechts: 'lang' }); },
    () => { const h = zz(1, 3), m = zz(2, 5) * 10, richtig = h * 60 + m, stimmt = wahl([true, false, false]), behauptet = stimmt ? richtig : h * 100 + m, kn = kind();
      return auswahl(Z(`${kn} sagt: ${h} h ${m} min = ${behauptet} min.`, 'Stimmt das?'), [opt('Stimmt.', stimmt), opt(`Falsch. Es sind ${stimmt ? h * 100 + m : richtig} min.`, !stimmt, stimmt ? 'zeit-zehnersystem' : undefined), opt(`Falsch. Es sind ${h * 10 + m} min.`, false, 'zeit-zehnersystem')],
        h3('1 h sind 60 min und nicht 100 min.', '1 h 20 min sind 60 min + 20 min = 80 min.', 'Wandle die Stunden um. Zähle dann die Minuten dazu.'), { nachweis: [{ art: 'urteil', stimmt, behauptung: `${h} h ${m} min = ${behauptet} min` }, G(`${h} h ${m} min = ${richtig} min`), HILFSGROESSE(`${h * 100 + m} min`, 'mit 100 statt mit 60 gerechnet'), HILFSGROESSE(`${h * 10 + m} min`, 'mit 10 statt mit 60 gerechnet')] }); },
  ]);
  sechs(S_('Z1'), 'M', [
    () => { const n = zz(2, 5), d = zz(2, 3);
      return luecken(Z('Wandle in zwei Schritten um.', `${n} h = {{a}} s`, `${d} d = {{b}} min`), { a: [n * 3600, fehlerliste(n * 3600, [[n * 60, 'sach-schritt-vergessen'], [n * 1000, 'zeit-zehnersystem']])], b: [d * 1440, fehlerliste(d * 1440, [[d * 24, 'sach-schritt-vergessen']])] },
        h2('Gehe über die Einheit dazwischen: erst in Minuten, dann in Sekunden.', '1 h sind 60 min. 1 min sind 60 s. Also sind 1 h genau 3600 s.'), { nachweis: [G(`${n} h = ${n * 3600} s`), G(`${d} d = ${d * 1440} min`)] }); },
    () => { const [b1, m1] = wahl([['½', 30], ['¼', 15], ['¾', 45]]), n = zz(1, 3), [b2, m2] = wahl([['½', 30], ['¼', 15], ['¾', 45]]);
      return luecken(Z('Wandle um.', `${b1} h = {{a}} min`, `${n}${b2} h = {{b}} min`), { a: [m1, fehlerliste(m1, [[{ 30: 50, 15: 25, 45: 75 }[m1], 'zeit-zehnersystem']])], b: [n * 60 + m2, fehlerliste(n * 60 + m2, [[n * 100 + { 30: 50, 15: 25, 45: 75 }[m2], 'zeit-zehnersystem']])] },
        h2('Eine halbe Stunde sind 30 min. Eine Viertelstunde sind 15 min.', 'Wandle erst die ganzen Stunden um und zähle dann den Bruchteil dazu.'), { nachweis: [G(`${b1} h = ${m1} min`), G(`${n}${b2} h = ${n * 60 + m2} min`)] }); },
    () => { const d = zz(2, 4), h = zz(2, 20), n = zz(2, 4) * 24 + zz(3, 21);
      return luecken(Z('Wandle um.', `${d} d ${h} h = {{a}} h`, `${n} h = {{b}} d {{c}} h`), { a: [d * 24 + h, fehlerliste(d * 24 + h, [[d * 60 + h, 'umrechnungszahl'], [d * 10 + h, 'zeit-zehnersystem']])], b: Math.floor(n / 24), c: n % 24 },
        h2('1 d sind 24 h.', 'Rechne die Tage mal 24 und zähle die Stunden dazu.'), { nachweis: [G(`${d} d ${h} h = ${d * 24 + h} h`), G(`${n} h = ${Math.floor(n / 24)} d ${n % 24} h`)] }); },
    () => { const m = zz(4, 15), s = zz(1, 11) * 5, n = m * 60 + s;
      return zahl(`Wie viel s sind ${m} min ${s} s?`, n, fehlerliste(n, [[m * 100 + s, 'zeit-zehnersystem'], [m + s, 'masszahlen-addiert']]), h2('1 min sind 60 s.', 'Rechne die Minuten mal 60 und zähle die Sekunden dazu.'), { einheit: 's', nachweis: [G(`${m} min ${s} s = ${n} s`)] }); },
    () => { const werte = mische([[45 * 60, '¾ h'], [50 * 60, '50 min'], [2400, '2400 s'], [65 * 60, '1 h 5 min'], [3500, '3500 s']]).sort((x, y) => x[0] - y[0]);
      const v = wahl([0, 1]), liste = v ? werte : [[30 * 60, '½ h'], [25 * 60, '25 min'], [2000, '2000 s'], [75 * 60, '1¼ h'], [4000, '4000 s']].sort((x, y) => x[0] - y[0]);
      return ordnen(Z('Ordne die Zeitspannen.', 'Beginne mit der kürzesten Zeitspanne.'), liste.map(([, t]) => t), h2('Wandle alles in dieselbe Einheit um.', 'Schreibe jede Zeitspanne in Sekunden oder in Minuten auf.'), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], links: 'kurz', rechts: 'lang' }); },
    () => { const h = zz(1, 3), m = zz(2, 5) * 10, falsch = h * 100 + m, richtig = h * 60 + m, kn = kind();
      return auswahl(Z(`${kn} rechnet: ${h} h ${m} min = ${falsch} min.`, 'Welcher Fehler steckt in der Rechnung?'), [opt(`Es wurde mit 100 statt mit 60 gerechnet. Richtig sind ${richtig} min.`, true), opt(`Es wurde mit 60 statt mit 24 gerechnet. Richtig sind ${h * 24 + m} min.`, false, 'umrechnungszahl'), opt(`Die Minuten wurden vergessen. Richtig sind ${h * 60} min.`, false, 'sach-schritt-vergessen'), opt('Die Rechnung enthält keinen Fehler.', false, 'zeit-zehnersystem')],
        h2('Die Umrechnungszahl ist bei der Zeit nicht 100.', '1 h sind 60 min. Rechne nach.'), { nachweis: [G(`${h} h ${m} min = ${richtig} min`), HILFSGROESSE(`${falsch} min`, 'falsches Ergebnis aus dem Text'), { zahl: 60, grund: '1 h sind 60 min' }] }); },
  ]);
  sechs(S_('Z1'), 'E', [
    () => { const [k, m] = wahl([['1,5', 90], ['2,5', 150], ['0,5', 30], ['3,5', 210]]), [k2, m2] = wahl([['0,25', 15], ['0,75', 45], ['1,25', 75], ['2,75', 165]]);
      return luecken(Z('Wandle um.', `${k} h = {{a}} min`, `${k2} h = {{b}} min`), { a: [m, fehlerliste(m, [[Number(k.replace(',', '')) * 10, 'zeit-zehnersystem']])], b: [m2, fehlerliste(m2, [[Number(k2.replace(',', '')), 'zeit-zehnersystem']])] },
        h1('0,5 h ist eine halbe Stunde, 0,25 h ist eine Viertelstunde. Die Zahl nach dem Komma zählt keine Minuten.'), { nachweis: [G(`${k} h = ${m} min`), G(`${k2} h = ${m2} min`)] }); },
    () => { const n = zz(2, 5), falsch = wahl([`${n},5 h = ${n} h 50 min`, `${n} h 15 min = ${n * 100 + 15} min`, `${n * 100} min = ${n} h`]);
      return auswahl('Welche Umwandlung ist falsch?', [opt(falsch, true), opt(`${n + 1} h = ${(n + 1) * 60} min`), opt(`${n},5 h = ${n * 60 + 30} min`), opt(`${n * 60 + 45} min = ${n} h 45 min`), opt(`${n} d = ${n * 24} h`)], h1('Rechne jede Umwandlung nach. Bei der Zeit ist die Umrechnungszahl 60 oder 24.'), { nachweis: [{ art: 'gleichungswahl', falsche: true }] }); },
    () => { const h = zz(1, 3), m = zz(2, 55), s = zz(1, 11) * 5, n = h * 3600 + m * 60 + s;
      return luecken(`Wandle um: ${n >= 10000 ? String(n).replace(/\B(?=(\d{3})+$)/g, ' ') : n} s = {{a}} h {{b}} min {{c}} s`, { a: [h, fehlerliste(h, [[Math.floor(n / 1000), 'zeit-zehnersystem']])], b: m, c: s }, h1('Teile zuerst durch 3600. Den Rest teilst du durch 60.'), { nachweis: [G(`${n >= 10000 ? String(n).replace(/\B(?=(\d{3})+$)/g, ' ') : n} s = ${h} h ${m} min ${s} s`)] }); },
    () => { const n = zz(1, 4), [k, m] = wahl([['25', 15], ['75', 45], ['5', 30]]), stimmt = wahl([true, false, false]), falschM = Number(k.padEnd(2, '0')), kn = kind();
      return auswahl(`${kn} behauptet: ${n},${k} h = ${n} h ${stimmt ? m : falschM} min. Stimmt das?`, [opt(`Stimmt, denn 0,${k} h sind ${m} min.`, stimmt), opt(`Falsch, denn ${n},${k} h sind ${n} h ${stimmt ? falschM : m} min.`, !stimmt, stimmt ? 'zeit-zehnersystem' : undefined), opt('Stimmt, denn nach dem Komma stehen die Minuten.', false, 'zeit-zehnersystem'), opt(`Falsch, denn ${n},${k} h sind ${n * 100 + falschM} min.`, false, 'zeit-zehnersystem')],
        h1('Wandle den Teil nach dem Komma einzeln in Minuten um.'), { nachweis: [{ art: 'urteil', stimmt, behauptung: `${n},${k} h = ${n} h ${stimmt ? m : falschM} min` }, G(`${n},${k} h = ${n} h ${m} min`), HILFSGROESSE(`0,${k} h`, 'der Teil nach dem Komma'), HILFSGROESSE(`${m} min`, 'der Teil nach dem Komma in Minuten'), HILFSGROESSE(`${n} h ${falschM} min`, 'Nachkommastellen als Minuten gelesen'), HILFSGROESSE(`${n * 100 + falschM} min`, 'mit 100 gerechnet')] }); },
    () => { const [k, m] = wahl([['0,75', 45], ['1,5', 90], ['0,25', 15], ['1,25', 75]]), r = m + wahl([-5, 0, 5, 30]);
      return auswahl(Z('Welches Zeichen passt?', `${k} h ▢ ${r} min`), [opt('<', m < r), opt('>', m > r), opt('=', m === r)].map((o) => (o.richtig ? o : { ...o, fehlvorstellung: 'zeit-zehnersystem' })), h1('Wandle beide Zeitspannen in Minuten um.'), { nachweis: [{ art: 'vergleich', links: `${k} h`, rechts: `${r} min` }] }); },
    () => { const [m, s] = wahl([[2, 30], [3, 20], [4, 0], [2, 24], [3, 45], [7, 30]]), n = 3600 / (m * 60 + s), lang = s ? `${m} min ${s} s` : `${m} min`;
      return zahl(`Ein Lied dauert ${lang}. Es läuft ohne Pause immer wieder. Wie oft läuft es in 2 h ganz durch?`, 2 * n, fehlerliste(2 * n, [[n, 'sach-schritt-vergessen']]), h1('Wandle beide Zeitspannen in Sekunden um und teile.'), { einheit: 'mal', nachweis: [G(`2 h : ${lang} = ${2 * n}`)] }); },
  ]);

  // =====================================================================
  // Z2 Zeitpunkte und Zeitspannen
  // =====================================================================
  sechs(S_('Z2'), 'F', [
    () => { const h = zz(6, 11), m = wahl([10, 20, 25, 35, 40, 50]), vertauscht = `${m / 5}:${String((h % 12) * 5).padStart(2, '0')} Uhr`;
      if (m / 5 === h) return null;
      return auswahl(Z('Schau auf die Uhr.', 'Es ist Vormittag.', 'Wie spät ist es?'), [opt(uhr(h * 60 + m), true), opt(vertauscht, false, 'zeitpunkt-zeitspanne'), opt(`${h}:${String(m / 5).padStart(2, '0')} Uhr`, false, 'zeitpunkt-zeitspanne')],
        h3('Der kurze Zeiger zeigt die Stunde. Der lange Zeiger zeigt die Minuten.', 'Der lange Zeiger steht auf der 3. Das sind 15 min.', 'Jede Zahl auf der Uhr steht für 5 min beim langen Zeiger.'), { bild: B.uhr([h, m]), nachweis: [{ art: 'bildgroesse', groesse: uhr(h * 60 + m) }] }); },
    () => { const start = zz(7, 17) * 60 + zz(2, 6) * 5, d = zz(2, 5) * 5, [was, pron] = wahl(ANLASS);
      return luecken(Z(`${was} beginnt um ${uhr(start)}.`, `${pron[0].toUpperCase() + pron.slice(1)} dauert ${d} min.`, `${pron[0].toUpperCase() + pron.slice(1)} endet um {{a}}:{{b}} Uhr.`), uhrLuecken(start + d, [[(start % 60) - d, 'sub-addiert'], [d, 'zeitpunkt-zeitspanne']]),
        h3('Schau auf das Bild. Gehe vom Beginn nach rechts.', 'Von 8:10 Uhr sind es 20 min bis 8:30 Uhr.', 'Zähle die Minuten zu den Minuten der Uhrzeit dazu.'), { bild: B.zeitleiste([uhrKurz(start), frage(uhrKurz(start + d))], [`${d} min`]), nachweis: [G(`${uhr(start)} + ${d} min = ${uhr(start + d)}`)] }); },
    () => { const start = zz(7, 17) * 60 + zz(1, 5) * 5, d = zz(3, 6) * 5, wer = wahl(['Der Bus', 'Der Zug', 'Die Fähre']);
      return zahl(Z(`${wer} fährt um ${uhr(start)} ab.`, `${wer === 'Die Fähre' ? 'Sie' : 'Er'} kommt um ${uhr(start + d)} an.`, 'Wie lange dauert die Fahrt?'), d, fehlerliste(d, [[(start % 60) + ((start + d) % 60), 'sub-addiert'], [(start + d) % 60, 'zeitpunkt-zeitspanne']]),
        h3('Schau auf das Bild. Zähle vom Anfang bis zum Ende.', 'Von 8:10 Uhr bis 8:30 Uhr sind es 20 min.', 'Ziehe die Minuten voneinander ab.'), { einheit: 'min', bild: B.zeitleiste([uhrKurz(start), uhrKurz(start + d)], [frage(`${d} min`)]), nachweis: [G(`${uhr(start + d)} − ${uhr(start)} = ${d} min`)] }); },
    () => { const a = zz(7, 9), d = zz(3, 6), was = wahl(['Die Schule', 'Der Markt', 'Der Ausflug']);
      return zahl(Z('Schau auf die Uhren.', `${was} beginnt um ${uhr(a * 60)}.`, `${was === 'Die Schule' ? 'Sie' : 'Er'} endet um ${uhr((a + d) * 60)}.`, 'Wie viele Stunden sind das?'), d, fehlerliste(d, [[a + d, 'zeitpunkt-zeitspanne'], [a + a + d, 'sub-addiert']]),
        h3('Zähle die vollen Stunden vom Beginn bis zum Ende.', 'Von 8:00 Uhr bis 11:00 Uhr sind es 3 h.', 'Ziehe die Stunden voneinander ab.'), { einheit: 'h', bild: B.uhr([a, 0, 'Beginn'], [a + d, 0, 'Ende']), nachweis: [G(`${uhr((a + d) * 60)} − ${uhr(a * 60)} = ${d} h`)] }); },
    () => { const ende = zz(8, 18) * 60 + zz(7, 11) * 5, d = zz(2, 4) * 5, [was, pron] = wahl(ANLASS), P = pron[0].toUpperCase() + pron.slice(1);
      return luecken(Z(`${was} dauert ${d} min.`, `${P} endet um ${uhr(ende)}.`, `${P} beginnt um {{a}}:{{b}} Uhr.`), uhrLuecken(ende - d, [[(ende % 60) + d, 'sub-addiert']].filter(([x]) => x < 60)),
        h3('Schau auf das Bild. Gehe vom Ende nach links.', 'Von 8:30 Uhr sind es 20 min zurück bis 8:10 Uhr.', 'Ziehe die Minuten von den Minuten der Uhrzeit ab.'), { bild: B.zeitleiste([frage(uhrKurz(ende - d)), uhrKurz(ende)], [`${d} min`]), nachweis: [G(`${uhr(ende)} − ${d} min = ${uhr(ende - d)}`)] }); },
    () => { const h = zz(7, 11), m1 = zz(1, 5) * 5, d = zz(2, 6) * 5;
      return zahl(Z('Schau auf die Uhren.', 'Es ist Vormittag.', 'Wie viele Minuten liegen zwischen den Uhrzeiten?'), d, fehlerliste(d, [[m1 + d, 'zeitpunkt-zeitspanne'], [d / 5, 'liste-verzaehlt']]),
        h3('Lies beide Uhrzeiten ab. Zähle dann die Minuten dazwischen.', 'Von 9:10 Uhr bis 9:25 Uhr sind es 15 min.', 'Der lange Zeiger wandert von Zahl zu Zahl in 5 min.'), { einheit: 'min', bild: B.uhr([h, m1, 'vorher'], [h, m1 + d, 'nachher']), nachweis: [G(`${uhr(h * 60 + m1 + d)} − ${uhr(h * 60 + m1)} = ${d} min`)] }); },
  ]);
  sechs(S_('Z2'), 'G', [
    () => { const start = zz(7, 19) * 60 + zz(2, 6) * 5, d = zz(3, 5) * 5, [was, pron] = wahl(ANLASS), P = pron[0].toUpperCase() + pron.slice(1);
      return luecken(Z(`${was} beginnt um ${uhr(start)}.`, `${P} dauert ${d} min.`, `${P} endet um {{a}}:{{b}} Uhr.`), uhrLuecken(start + d, [[d, 'zeitpunkt-zeitspanne']]),
        h3('Zähle die Zeitspanne zur Uhrzeit dazu.', '16:10 Uhr + 25 min = 16:35 Uhr', 'Zähle die Minuten zusammen. Die Stunde bleibt gleich.'), { bild: B.zeitleiste([uhrKurz(start), frage(uhrKurz(start + d))], [`${d} min`]), nachweis: [G(`${uhr(start)} + ${d} min = ${uhr(start + d)}`)] }); },
    () => { const start = zz(7, 19) * 60 + zz(1, 4) * 5 + zz(0, 4), d = zz(12, 34), wer = wahl(['Der Bus', 'Der Zug']);
      return zahl(Z(`${wer} fährt um ${uhr(start)} ab.`, `Er kommt um ${uhr(start + d)} an.`, 'Wie lange dauert die Fahrt?'), d, fehlerliste(d, [[(start % 60) + ((start + d) % 60), 'sub-addiert'], [(start + d) % 60, 'zeitpunkt-zeitspanne']]),
        h3('Eine Zeitspanne ist das Ende minus der Anfang.', 'Von 9:20 Uhr bis 9:55 Uhr sind es 55 min − 20 min = 35 min.', 'Ziehe die Minuten voneinander ab.'), { einheit: 'min', bild: B.zeitleiste([uhrKurz(start), uhrKurz(start + d)], [frage(`${d} min`)]), nachweis: [G(`${uhr(start + d)} − ${uhr(start)} = ${d} min`)] }); },
    () => { const an = zz(12, 20) * 60 + zz(2, 11) * 5, d = zz(2, 5), wer = wahl(['Die Fahrt', 'Die Wanderung', 'Der Flug']);
      return luecken(Z(`${wer} dauert ${d} h.`, `Die Ankunft ist um ${uhr(an)}.`, 'Der Start war um {{a}}:{{b}} Uhr.'), { a: [Math.floor(an / 60) - d, fehlerliste(Math.floor(an / 60) - d, [[Math.floor(an / 60) + d, 'sub-addiert']])], b: an % 60 },
        h3('Gehe vom Ende um die Zeitspanne zurück.', '15:30 Uhr − 2 h = 13:30 Uhr', 'Bei vollen Stunden bleiben die Minuten gleich.'), { bild: B.zeitleiste([frage(uhrKurz(an - d * 60)), uhrKurz(an)], [`${d} h`]), nachweis: [G(`${uhr(an)} − ${d} h = ${uhr(an - d * 60)}`)] }); },
    () => { const auf = zz(7, 10) * 60 + wahl([0, 30]), d = zz(6, 10), wer = wahl(['Der Laden', 'Das Schwimmbad', 'Der Markt']);
      return zahl(Z(`${wer} öffnet um ${uhr(auf)}.`, `${wer === 'Das Schwimmbad' ? 'Es' : 'Er'} schließt um ${uhr(auf + d * 60)}.`, 'Wie viele Stunden ist geöffnet?'), d, fehlerliste(d, [[Math.floor(auf / 60) + d, 'zeitpunkt-zeitspanne'], [d + 1, 'liste-verzaehlt']]),
        h3('Zähle die vollen Stunden vom Öffnen bis zum Schließen.', 'Von 9:30 Uhr bis 12:30 Uhr sind es 3 h.', 'Ziehe die Stunden voneinander ab.'), { einheit: 'h', nachweis: [G(`${uhr(auf + d * 60)} − ${uhr(auf)} = ${d} h`)] }); },
    () => { const start = zz(8, 18) * 60 + zz(0, 3) * 5 + 5, d1 = zz(2, 4) * 5, d2 = zz(1, 3) * 5;
      return luecken(Z(`Der Zug fährt um ${uhr(start)} ab.`, `Er fährt ${d1} min bis zum nächsten Halt.`, `Dort steht er ${d2} min.`, 'Er fährt um {{a}}:{{b}} Uhr weiter.'), uhrLuecken(start + d1 + d2, [[(start + d1) % 60, 'sach-schritt-vergessen']]),
        h3('Rechne in zwei Schritten.', '10:05 Uhr + 20 min = 10:25 Uhr. Dann 10:25 Uhr + 10 min = 10:35 Uhr.', 'Zähle erst die Fahrzeit dazu. Zähle dann die Wartezeit dazu.'), { bild: B.zeitleiste([uhrKurz(start), uhrKurz(start + d1), frage(uhrKurz(start + d1 + d2))], [`${d1} min`, `${d2} min`]), nachweis: [G(`${uhr(start)} + ${d1} min = ${uhr(start + d1)}`), G(`${uhr(start + d1)} + ${d2} min = ${uhr(start + d1 + d2)}`)] }); },
    () => { const start = zz(8, 18) * 60 + zz(1, 3) * 5, d = zz(4, 7) * 5, ende = start + d, stimmt = wahl([true, false, false]), falsch = (start % 60) + (ende % 60), behauptet = stimmt ? d : falsch, kn = kind();
      if (falsch === d) return null;
      return auswahl(Z(`${kn} sagt: Von ${uhr(start)} bis ${uhr(ende)} sind es ${behauptet} min.`, 'Stimmt das?'), [opt('Stimmt.', stimmt), opt(`Falsch. Es sind ${stimmt ? falsch : d} min.`, !stimmt, stimmt ? 'sub-addiert' : undefined), opt(`Falsch. Es sind ${ende % 60} min.`, false, 'zeitpunkt-zeitspanne')],
        h3('Eine Zeitspanne ist das Ende minus der Anfang.', 'Von 14:10 Uhr bis 14:45 Uhr sind es 45 min − 10 min = 35 min.', 'Ziehe die Minuten voneinander ab.'), { nachweis: [G(`${uhr(ende)} − ${uhr(start)} = ${d} min`), { art: 'urteil', stimmt, behauptet: `${behauptet} min` }, HILFSGROESSE(`${falsch} min`, 'Minuten addiert'), HILFSGROESSE(`${ende % 60} min`, 'Minuten der Uhrzeit abgelesen')] }); },
  ]);
  sechs(S_('Z2'), 'M', [
    () => { const start = zz(7, 18) * 60 + zz(7, 11) * 5, d = zz(1, 3) * 60 + zz(6, 10) * 5, [o1, o2] = zweiOrte();
      if ((start % 60) + (d % 60) < 60) return null;
      return luecken(Z(`Der Bus fährt um ${uhr(start)} am Halt ${o1[0]} ab.`, `Er kommt um ${uhr(start + d)} am Halt ${o2[0]} an.`, 'Die Fahrt dauert {{a}} h {{b}} min.'), { a: [Math.floor(d / 60), fehlerliste(Math.floor(d / 60), [[Math.floor(d / 60) + 1, 'sub-kleiner-von-groesser']])], b: [d % 60, fehlerliste(d % 60, [[(start % 60) - ((start + d) % 60), 'sub-kleiner-von-groesser']])] },
        h2('Rechne in Schritten: erst bis zur vollen Stunde, dann die ganzen Stunden, dann den Rest.', 'Zeichne eine Zeitleiste und trage die Schritte als Bögen ein.'), { nachweis: [G(`${uhr(start + d)} − ${uhr(start)} = ${dauer(d)}`)] }); },
    () => { const start = zz(7, 19) * 60 + zz(8, 11) * 5, d = zz(1, 2) * 60 + zz(5, 10) * 5, [was, pron] = wahl(ANLASS), P = pron[0].toUpperCase() + pron.slice(1), ende = start + d;
      if (ende % 60 < 10 || (start % 60) + (d % 60) < 60) return null;
      return luecken(Z(`${was} beginnt um ${uhr(start)}.`, `${P} dauert ${dauer(d)}.`, `${P} endet um {{a}}:{{b}} Uhr.`), { a: [Math.floor(ende / 60), fehlerliste(Math.floor(ende / 60), [[Math.floor(start / 60) + Math.floor(d / 60), 'add-uebertrag-vergessen']])], b: [ende % 60, fehlerliste(ende % 60, [[((start % 60) + (d % 60)) % 100, 'zeit-zehnersystem']])] },
        h2('Zähle erst die Stunden dazu, dann die Minuten. Bei 60 min beginnt eine neue Stunde.', 'Gehe erst bis zur vollen Stunde und zähle dann den Rest der Minuten dazu.'), { nachweis: [G(`${uhr(start)} + ${dauer(d)} = ${uhr(ende)}`)] }); },
    () => { const ab = zz(21, 23) * 60 + zz(2, 11) * 5, d = zz(5, 9) * 60 + zz(2, 11) * 5;
      return luecken(Z(`Der Nachtzug fährt um ${uhr(ab)} ab.`, `Er kommt am nächsten Morgen um ${uhr(ab + d)} an.`, 'Die Fahrt dauert {{a}} h {{b}} min.'), { a: [Math.floor(d / 60), fehlerliste(Math.floor(d / 60), [[Math.floor(ab / 60) - Math.floor(((ab + d) % 1440) / 60), 'sub-kleiner-von-groesser']])], b: d % 60 },
        h2('Rechne erst bis Mitternacht, also bis 24:00 Uhr. Rechne dann ab 0:00 Uhr weiter.', 'Zähle am Ende beide Zeitspannen zusammen.'), { nachweis: [G(`${uhr(ab + d)} − ${uhr(ab)} = ${dauer(d)}`)] }); },
    () => { const ende = zz(9, 20) * 60 + zz(0, 3) * 5 + 5, d = zz(6, 11) * 5, [was, pron] = wahl(ANLASS), P = pron[0].toUpperCase() + pron.slice(1), start = ende - d;
      if (start % 60 < 10 || Math.floor(start / 60) === Math.floor(ende / 60)) return null;
      return luecken(Z(`${was} dauert ${d} min.`, `${P} endet um ${uhr(ende)}.`, `${P} beginnt um {{a}}:{{b}} Uhr.`), { a: [Math.floor(start / 60), fehlerliste(Math.floor(start / 60), [[Math.floor(ende / 60), 'add-uebertrag-vergessen']])], b: [start % 60, fehlerliste(start % 60, [[d - (ende % 60), 'sub-kleiner-von-groesser']])] },
        h2('Gehe vom Ende zurück: erst bis zur vollen Stunde, dann den Rest.', 'Ziehe zuerst die Minuten bis zur vollen Stunde ab.'), { nachweis: [G(`${uhr(ende)} − ${d} min = ${uhr(start)}`)] }); },
    () => { const [o1, o2, o3] = dreiOrte(), t1 = zz(7, 17) * 60 + zz(1, 11) * 5 + zz(1, 4), t2 = t1 + zz(14, 28), t3 = t2 + zz(35, 55);
      if (Math.floor(t2 / 60) === Math.floor(t3 / 60)) return null;
      return zahl(Z('Schau in den Fahrplan.', `Wie viele Minuten fährt der Bus von ${o2[0]} bis ${o3[0]}?`), t3 - t2, fehlerliste(t3 - t2, [[t3 - t1, 'sach-frage-verfehlt'], [t2 - t1, 'sach-frage-verfehlt']]),
        h2('Suche im Fahrplan die beiden Zeilen, die zur Frage passen.', 'Rechne erst bis zur vollen Stunde und dann den Rest.'), { einheit: 'min', daten: fahrplan([[o1[0], t1], [o2[0], t2], [o3[0], t3]]), nachweis: [G(`${uhr(t3)} − ${uhr(t2)} = ${t3 - t2} min`)] }); },
    () => { const an = zz(7, 9) * 60 + zz(2, 11) * 5, weg = zz(3, 7) * 5, vorher = 60 - weg + wahl([0, 60]) , kn = kind();
      if (vorher < 20) return null;
      return luecken(Z(`${kn} muss um ${uhr(an)} in der Schule sein.`, `Der Schulweg dauert ${weg} min.`, `Vorher braucht ${kn} ${vorher} min zum Waschen, Anziehen und Frühstücken.`, `${kn} muss spätestens um {{a}}:{{b}} Uhr aufstehen.`), uhrLuecken(an - weg - vorher, [[(an - weg) % 60, 'sach-schritt-vergessen']].filter(([x]) => x !== (an - weg - vorher) % 60)),
        h2('Zähle zuerst die beiden Zeitspannen zusammen.', 'Gehe dann von der Uhrzeit um diese Zeitspanne zurück.'), { nachweis: [G(`${weg} min + ${vorher} min = ${dauer(weg + vorher)}`), G(`${uhr(an)} − ${dauer(weg + vorher)} = ${uhr(an - weg - vorher)}`)] }); },
  ]);
  // Fahrplan mit Umsteigen: Zug A von o1 nach o2, dann zwei Anschlüsse von o2 nach o3.
  const umstieg = () => { const [o1, o2, o3] = dreiOrte(), ab = zz(7, 16) * 60 + zz(3, 50), an = ab + zz(38, 58), warte = zz(4, 14), ab2 = an + warte, d2 = zz(32, 52), ab3 = ab2 + 30;
    return { o1: o1[0], o2: o2[0], o3: o3[0], ab, an, ab2, an2: ab2 + d2, ab3, an3: ab3 + d2, warte,
      daten: { kopf: ['Zug', 'Strecke', 'Abfahrt', 'Ankunft'], zeilen: [['A', `${o1[0]} bis ${o2[0]}`, uhrKurz(ab), uhrKurz(an)], ['B', `${o2[0]} bis ${o3[0]}`, uhrKurz(ab2), uhrKurz(ab2 + d2)], ['C', `${o2[0]} bis ${o3[0]}`, uhrKurz(ab3), uhrKurz(ab3 + d2)]] } }; };
  sechs(S_('Z2'), 'E', [
    () => { const ab = 23 * 60 + zz(31, 56), d = zz(1, 3) * 60 + zz(11, 48);
      return luecken(`Ein Nachtbus fährt um ${uhr(ab)} los und ist um ${uhr(ab + d)} am Ziel. Die Fahrt dauert {{a}} h {{b}} min.`, { a: Math.floor(d / 60), b: [d % 60, fehlerliste(d % 60, [[Math.abs((ab % 60) - ((ab + d) % 60)), 'sub-kleiner-von-groesser']])] }, h1('Rechne erst bis Mitternacht und dann ab 0:00 Uhr weiter.'), { nachweis: [G(`${uhr(ab + d)} − ${uhr(ab)} = ${dauer(d)}`)] }); },
    () => { const u = umstieg(), d = u.an2 - u.ab;
      return luecken(`Du fährst mit Zug A von ${u.o1} nach ${u.o2} und steigst dort in Zug B nach ${u.o3} um. Die ganze Reise dauert {{a}} h {{b}} min.`, { a: Math.floor(d / 60), b: [d % 60, fehlerliste(d % 60, [[(d - u.warte) % 60, 'sach-schritt-vergessen']])] }, h1('Die Reise beginnt mit der Abfahrt von Zug A und endet mit der Ankunft von Zug B. Die Wartezeit gehört dazu.'), { daten: u.daten, nachweis: [G(`${uhr(u.an2)} − ${uhr(u.ab)} = ${dauer(d)}`)] }); },
    () => { const u = umstieg();
      return zahl(`Du kommst mit Zug A in ${u.o2} an und fährst mit Zug B weiter. Wie viele Minuten hast du zum Umsteigen?`, u.warte, fehlerliste(u.warte, [[u.ab2 - u.ab, 'sach-frage-verfehlt'], [u.warte + 30, 'sach-frage-verfehlt']]), h1('Die Umsteigezeit liegt zwischen der Ankunft von Zug A und der Abfahrt von Zug B.'), { einheit: 'min', daten: u.daten, nachweis: [G(`${uhr(u.ab2)} − ${uhr(u.an)} = ${u.warte} min`)] }); },
    () => { const u = umstieg(), brauch = u.warte + wahl([-3, -2, 2, 3, 5]), schafft = brauch <= u.warte;
      if (brauch < 2) return null;
      return auswahl(`Du kommst mit Zug A in ${u.o2} an. Für den Weg zum anderen Bahnsteig brauchst du ${brauch} min. Mit welchem Zug kommst du in ${u.o3} an, und wann?`, [opt(`mit Zug B um ${uhr(u.an2)}`, schafft, 'sach-frage-verfehlt'), opt(`mit Zug C um ${uhr(u.an3)}`, !schafft, 'sach-frage-verfehlt'), opt(`mit Zug B um ${uhr(u.ab2)}`, false, 'zeitpunkt-zeitspanne'), opt(`mit Zug C um ${uhr(u.ab3)}`, false, 'zeitpunkt-zeitspanne')].map((o) => (o.richtig ? { text: o.text, richtig: true } : o)),
        h1('Rechne aus, wann du am anderen Bahnsteig bist. Vergleiche mit den Abfahrten.'), { daten: u.daten, nachweis: [G(`${uhr(u.an)} + ${brauch} min = ${uhr(u.an + brauch)}`), { art: 'anschluss', zug: 'A', ab: uhr(u.an + brauch) }, HILFSGROESSE(uhr(schafft ? u.an2 : u.an3), 'Ankunft des erreichten Zuges laut Fahrplan')] }); },
    () => { const start = zz(8, 10) * 60 + wahl([15, 30, 45]), [k, m] = wahl([['2,5', 150], ['3,5', 210], ['1,5', 90], ['2,25', 135], ['3,75', 225]]), pause = wahl([20, 35, 40, 50]), ende = start + m + pause;
      if (ende % 60 < 10) return null;
      return luecken(`Eine Wanderung beginnt um ${uhr(start)}. Die reine Gehzeit beträgt ${k} h, dazu kommen ${pause} min Pause. Die Gruppe ist um {{a}}:{{b}} Uhr am Ziel.`, uhrLuecken(ende, [[(start + m) % 60, 'sach-schritt-vergessen']].filter(([x]) => x !== ende % 60)), h1('Wandle die Gehzeit in Stunden und Minuten um. Zähle dann die Pause dazu.'), { nachweis: [G(`${k} h + ${pause} min = ${dauer(m + pause)}`), G(`${uhr(start)} + ${dauer(m + pause)} = ${uhr(ende)}`)] }); },
    () => { const [t1, t2, tage] = wahl([['Montag', 'Freitag', 4], ['Dienstag', 'Samstag', 4], ['Montag', 'Donnerstag', 3], ['Mittwoch', 'Sonntag', 4], ['Freitag', 'Sonntag', 2]]), a = zz(14, 17), b = zz(9, 12), n = tage * 24 - (a - b);
      return zahl(`Ein Zeltlager beginnt am ${t1} um ${uhr(a * 60)} und endet am ${t2} derselben Woche um ${uhr(b * 60)}. Wie viele Stunden dauert das Zeltlager?`, n, fehlerliste(n, [[tage * 24, 'sach-schritt-vergessen'], [tage * 24 + (a - b), 'sub-addiert'], [a - b, 'sach-schritt-vergessen']]), h1('Rechne zuerst mit ganzen Tagen bis zur selben Uhrzeit. Korrigiere dann um die fehlenden Stunden.'),
        { einheit: 'h', nachweis: [HILFSGROESSE(`${tage} d`, `Von ${t1} bis ${t2} sind es ${tage} Tage`), G(`${tage} d = ${tage * 24} h`), G(`${uhr(a * 60)} − ${uhr(b * 60)} = ${a - b} h`), G(`${tage * 24} h − ${a - b} h = ${n} h`)] }); },
  ]);
}
