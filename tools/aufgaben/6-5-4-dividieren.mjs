// Aufgaben zu 6.5.4 „Dezimalzahlen dividieren“ (Lernziele D1, D2) nach ADR 0015 und ADR 0048.
// D1: Dezimalzahl durch natürliche Zahl. D2: durch eine Dezimalzahl (Komma in beiden Zahlen gleich weit verschieben), mit Überschlag.
// Kein Divisionsraster: F füllt einen Lückentext, in dem das Komma schon steht, G gibt das Ergebnis ein, ab M im Heft.
// Die Divisionen gehen auf F bis M immer auf, mit höchstens drei Stellen nach dem Komma. Nur E rundet (auf Cent oder Zehntel).
// Nach zwei Fehlversuchen zeigt die App bei Aufgaben mit `division` die schriftliche Division als Lösungsbild.

import { sechs, auswahl, luecken, dezimal, Z, h1, h2, h3 } from '../werkzeug.mjs';
import { B, zz, wahl, mische, kind, opt, T, dfe, URTEIL, FREI, bild, fig, vorn, P, mal, durch, dez, euro, schiebe, wert, grob, ersteStelle, stellen } from './6-5-rechnen.mjs';
import { geldStuecke } from './6-5-1-addieren.mjs';
import { tafel, spaltenFuer } from './6-5-2-stufenzahlen.mjs';

const D1 = '6.5.4-D1', D2 = '6.5.4-D2';
const H = (w, grund) => ({ wert: String(w), grund });
const num = (t) => (/^\d+$/.test(String(t)) ? Number(t) : t);
const WERT = (w) => ({ art: 'wert', wert: String(w) });
const RN = (zahl, stelle, ergebnis, extra = {}) => ({ art: 'runden', zahl, stelle, ergebnis, ...extra });
const geldBild = (t) => B.geld(geldStuecke(P(euro(t))[0]));
const streifen = (k) => bild(fig('streifen', 10, vorn(k)));
const hundert = (k) => bild(fig('hundert', null, vorn(k)));
// Die Stellenwerttafel mit dem Dividenden, ohne Verschiebepfeile.
const ohnePfeile = (t) => { const sp = spaltenFuer(t); return { art: 'tafel', spalten: sp, werte: tafel(sp, t, ': 10').werte, komma: sp.indexOf('E') }; };
// Lösungsbild: die schriftliche Division. Bei einem Dezimalbruch als Divisor steht in `vorher` die Aufgabe vor dem Verschieben.
const DIV = (dividend, divisor, vorher) => ({ division: { dividend: num(dividend), divisor: Number(divisor), ...(vorher ? { vorher } : {}) } });
// Das Komma um eine Stelle falsch oder vergessen: typische Fehler beim Komma im Quotienten.
const kommaFehler = (l) => [[String(P(l)[0]), 'div-komma-vergessen'], [schiebe(l, 1), 'div-stellenwert'], [schiebe(l, -1), 'div-stellenwert']];
// Stellen nach dem Komma im Divisor: um so viele Stellen wird in beiden Zahlen verschoben.
const verschiebe = (a, b) => { const s = stellen(b); return [schiebe(a, s), schiebe(b, s), s]; };
// Überschlag einer Division: Jede Zahl auf Ganze oder auf ihre erste Stelle gerundet. Es zählen die Kombinationen, die aufgehen.
const ueberschlag = (a, b) => {
  const ra = [...new Set([ersteStelle(a), grob(a)])], rb = [...new Set([ersteStelle(b), grob(b)])];
  const werte = [], rechnungen = [], gebraucht = new Set();
  for (const x of ra) for (const y of rb) { const q = durch(x, y, 2); if (q == null || wert(q) === 0) continue; rechnungen.push(`${x} : ${y} = ${q}`); gebraucht.add(`${x}|a`).add(`${y}|b`); if (!werte.includes(q)) werte.push(q); }
  const hilfen = [...ra.filter((x) => x !== a && gebraucht.has(`${x}|a`)).map((x) => H(x, `${a} gerundet`)), ...rb.filter((x) => x !== b && gebraucht.has(`${x}|b`)).map((x) => H(x, `${b} gerundet`))];
  return werte.length ? { u: werte[0], auch: werte.slice(1), nachweis: [...hilfen, ...rechnungen] } : null;
};
const mitUeberschlag = (vorn, a, b, hilfen, fehler, extra = {}) => {
  const l = durch(a, b, 3), ue = ueberschlag(a, b);
  if (l == null || !ue || ue.u === l || ue.auch.includes(l)) return null;
  const t = luecken(Z(...vorn, `Überschlag: ${a} : ${b} ≈ {{u}}`, `Genau: ${a} : ${b} = {{e}}`),
    { u: [num(ue.u), dfe(ue.u, [[l, 'ueberschlag-nicht-gerundet']])], e: [num(l), dfe(l, fehler)] }, hilfen, { ...extra, nachweis: [...ue.nachweis, `${a} : ${b} = ${l}`] });
  if (ue.auch.length) t.luecken.u.auch = ue.auch.map(num);
  return t;
};
// Lückentext mit vorgegebenem Komma (F): Ganze und Ziffern nach dem Komma in eigenen Feldern.
const kommaLuecken = (l) => { const [g, k = ''] = String(l).split(','); return k && !k.startsWith('0') ? { g: Number(g), k: Number(k) } : null; };

const tF = h3('Teile zuerst die Ganzen, dann die Zehntel.', '8,4 : 4: 8 : 4 = 2 und 4 Zehntel : 4 = 1 Zehntel. Also 2,1.', 'Das Komma steht im Ergebnis an derselben Stelle.');
const tFg = h3('Teile zuerst die Euro, dann die Cent.', '6,40 € : 2: 6 € : 2 = 3 € und 40 ct : 2 = 20 ct. Also 3,20 €.', 'Schreibe das Ergebnis mit Komma: Euro vor dem Komma, Cent dahinter.');
const tG1 = h3('Dividiere wie mit natürlichen Zahlen.', '7,56 : 3: Die 3 passt zweimal in 7, es bleibt 1 Rest. Komma setzen. 15 : 3 = 5 und 6 : 3 = 2. Also 2,52.', 'Überschreitest du das Komma, setzt du im Ergebnis das Komma.');
const tM1 = h2('Dividiere schriftlich. Überschreitest du das Komma, setzt du im Quotienten das Komma.', 'Mache zuerst einen Überschlag. Der Quotient muss in der Nähe liegen.');
const tF2 = h3('Rechne beide Zahlen in Zehntel um.', '0,8 : 0,2 = 8 Zehntel : 2 Zehntel = 8 : 2 = 4.', 'Wie oft passt die zweite Zahl in die erste?');
const tG2 = h3('Verschiebe das Komma in beiden Zahlen gleich weit nach rechts.', '4,2 : 0,7 = 42 : 7 = 6.', 'Der Divisor darf danach keine Stelle nach dem Komma haben.');
const tM2 = h2('Verschiebe das Komma in Dividend und Divisor gleich weit nach rechts, bis der Divisor eine natürliche Zahl ist.', 'Runde für den Überschlag jede Zahl auf Ganze oder auf ihre erste Stelle.');

export function dividieren6() {
  // ================= D1: Dezimalzahl durch natürliche Zahl =================
  sechs(D1, 'F', [
    () => { const n = zz(2, 4), l = euro(T(zz(11, 49) * 10, 2)), s = euro(mal(l, String(n))), kn = kind();
      return dezimal(Z(`${kn} und Freunde teilen ${s} € gerecht.`, `Es sind ${n} Kinder.`, 'Gib an, wie viel Geld jedes Kind bekommt.'), l, dfe(l, [[euro(schiebe(l, 1)), 'div-stellenwert'], [euro(schiebe(l, -1)), 'div-stellenwert']]), tFg,
        { einheit: '€', bild: geldBild(s), nachweis: [`${s} € : ${n} = ${l} €`] }); },
    () => { const n = zz(2, 4), l = T(zz(1, 3) * 10 + zz(1, 3), 1), a = mal(l, String(n)), k = kommaLuecken(l); if (!k || P(a)[0] % 10 === 0) return null;
      return luecken(Z('Das Komma steht schon da.', `Rechne: ${a} : ${n} = {{g}},{{k}}`), { g: [k.g, []], k: [k.k, dfe(k.k, [[P(a)[0] % 10, 'div-komma-vergessen']])] }, tF,
        { bild: ohnePfeile(a), nachweis: [`${a} : ${n} = ${l}`] }); },
    () => { const n = wahl([2, 3, 4]), k = zz(1, 2), z = k * n; if (z > 9) return null; const a = T(z, 1), l = T(k, 1);
      return luecken(Z(`Der Streifen zeigt ${a}.`, 'Rechne in Zehnteln.', `${a} : ${n} = ${z} Zehntel : ${n} = {{a}} Zehntel = {{b}}`), { a: [k, dfe(k, [[z - n, 'div-falsche-rechenart']])], b: [l, dfe(l, [[k, 'div-komma-vergessen'], [T(k, 2), 'dezimal-stelle']])] },
        h3('Zähle die gefärbten Zehntel.', '0,6 : 3 = 6 Zehntel : 3 = 2 Zehntel = 0,2.', 'Rechne mit Zehnteln wie mit Einern.'), { bild: streifen(z), nachweis: [{ art: 'bild', bruch: `${z}⁄10` }, `${z} Zehntel : ${n} = ${k} Zehntel`, `${a} : ${n} = ${l}`] }); },
    () => { const n = wahl([2, 3, 4]), k = zz(11, 24), z = k * n; if (z > 99 || z % 10 === 0) return null; const a = T(z, 2), l = T(k, 2);
      return luecken(Z(`Das Hunderterfeld zeigt ${a}.`, 'Rechne in Hundertsteln.', `${a} : ${n} = ${z} Hundertstel : ${n} = {{a}} Hundertstel = {{b}}`), { a: [k, []], b: [l, dfe(l, [[k, 'div-komma-vergessen'], [T(k, 1), 'dezimal-stelle']])] },
        h3('Jedes Feld ist ein Hundertstel.', '0,48 : 4 = 48 Hundertstel : 4 = 12 Hundertstel = 0,12.', 'Rechne mit Hundertsteln wie mit Einern.'), { bild: hundert(z), nachweis: [{ art: 'bild', bruch: `${z}⁄100` }, `${z} Hundertstel : ${n} = ${k} Hundertstel`, `${a} : ${n} = ${l}`] }); },
    () => { const n = zz(3, 4), l = euro(T(zz(11, 29) * 10, 2)), s = euro(mal(l, String(n))), kn = kind(), o = mische([[l, true], [euro(schiebe(l, -1)), false], [euro(schiebe(l, 1)), false]]);
      return auswahl(Z(`${kn} und Freunde teilen ${s} € gerecht.`, `Es sind ${n} Kinder.`, 'Schätze zuerst.', 'Kreuze den passenden Betrag an.'), o.map(([x, r]) => opt(`${x} €`, r, r ? undefined : 'div-stellenwert')),
        h3('Runde den Betrag auf ganze Euro.', '9,60 € : 4 ist etwa 8 € : 4 = 2 €.', 'Jedes Kind bekommt ungefähr so viel.'), { bild: geldBild(s), nachweis: [`${s} € : ${n} = ${l} €`, WERT(`${l} €`)] }); },
    () => { const n = zz(2, 3), l = euro(T(zz(111, 299), 2)), s = euro(mal(l, String(n))), k = kommaLuecken(l); if (!k || k.k < 10) return null;
      return luecken(Z('Das Komma steht schon da.', `Rechne: ${s} € : ${n} = {{g}},{{k}} €`), { g: [k.g, []], k: [k.k, []] }, tFg, { bild: geldBild(s), nachweis: [`${s} € : ${n} = ${l} €`] }); },
  ]);
  sechs(D1, 'G', [
    () => { const n = zz(3, 9), l = dez(2, 1.11, 3.99), a = mal(l, String(n)); if (stellen(a) !== 2) return null;
      return dezimal(Z(`Dividiere: ${a} : ${n}`), l, dfe(l, kommaFehler(l)), tG1, { bild: ohnePfeile(a), ...DIV(a, n), nachweis: [`${a} : ${n} = ${l}`] }); },
    () => { const n = zz(3, 9), l = T(zz(11, 19), 2), a = mal(l, String(n)); if (wert(a) >= 1) return null;
      return dezimal(Z(`Dividiere: ${a} : ${n}`), l, dfe(l, kommaFehler(l)), h3('Vor dem Komma steht eine 0.', '0,84 : 7: Die 7 passt nicht in 0. Schreibe 0 und das Komma. Die 7 passt einmal in 8, es bleibt 1 Rest. 14 : 7 = 2. Also 0,12.', 'Schreibe im Ergebnis zuerst 0 und das Komma.'), { bild: ohnePfeile(a), ...DIV(a, n), nachweis: [`${a} : ${n} = ${l}`] }); },
    () => { const n = zz(3, 9), l = dez(1, 2.1, 9.9), a = mal(l, String(n)), o = mische([[l, true], [schiebe(l, -1), false], [schiebe(l, 1), false]]), ga = grob(a), u = durch(ga, String(n), 1);
      if (!u) return null;
      return auswahl(Z(`Überschlage ${a} : ${n}.`, 'Kreuze das passende Ergebnis an.'), o.map(([x, r]) => opt(x, r, r ? undefined : 'div-stellenwert')),
        h3('Runde auf eine Zahl, die sich leicht teilen lässt.', '38,4 : 6 ist etwa 36 : 6 = 6.', 'Das Ergebnis muss in der Nähe von deinem Überschlag liegen.'), { nachweis: [H(ga, `${a} gerundet`), `${ga} : ${n} = ${u}`, `${a} : ${n} = ${l}`, WERT(l)] }); },
    () => { const n = wahl([4, 6]), l = euro(dez(2, 0.51, 0.99)), s = euro(mal(l, String(n)));
      return dezimal(Z(`Ein Pack mit ${n} Flaschen Saft kostet ${s} €.`, 'Berechne den Preis für eine Flasche.'), l, dfe(l, [[euro(schiebe(l, 1)), 'div-stellenwert']]), tG1, { einheit: '€', bild: geldBild(s), ...DIV(s, n), nachweis: [`${s} € : ${n} = ${l} €`] }); },
    () => { const n = wahl([2, 4, 5]), a = dez(1, 2.1, 9.9), l = durch(a, String(n), 3); if (!l || stellen(l) <= 1) return null;
      return dezimal(Z(`Dividiere: ${a} : ${n}`, 'Hänge dafür Nullen an.'), l, dfe(l, [[T(Math.floor(wert(l) * 10), 1), 'div-rest-vergessen'], ...kommaFehler(l)]), h3('Bleibt ein Rest, hänge eine 0 an und teile weiter.', '6,3 : 2: 6,30 : 2 = 3,15.', 'Endnullen ändern den Wert nicht.'), { ...DIV(a, n), nachweis: [`${a} : ${n} = ${l}`] }); },
    () => { const n = zz(4, 9), l = T(zz(2, 9), 1), a = mal(l, String(n)), falsch = String(P(l)[0]), kn = kind();
      if (stellen(a) !== 1) return null;
      return auswahl(Z(`${kn} rechnet: ${a} : ${n} = ${falsch}`, 'Beurteile die Rechnung.'), [opt(`Falsch. ${a} ist kleiner als ${n}. Es gilt ${a} : ${n} = ${l}.`, true), opt('Stimmt.', false, 'div-komma-vergessen'), opt(`Stimmt, denn ${falsch} · ${n} = ${P(a)[0]}.`, false, 'div-komma-vergessen')],
        h3('Mache die Probe mit der Mal-Aufgabe.', `${falsch} · ${n} = ${P(a)[0]}. Das ist nicht ${a}.`, 'Wo fehlt das Komma?'), { nachweis: [`${falsch} · ${n} = ${P(a)[0]}`, `${a} : ${n} = ${l}`, URTEIL(false, `${a} : ${n} = ${falsch}`)] }); },
  ]);
  sechs(D1, 'M', [
    () => { const n = zz(12, 25), l = dez(1, 1.1, 9.9), a = mal(l, String(n)); if (stellen(a) !== 1) return null;
      return dezimal(Z(`Dividiere schriftlich im Heft: ${a} : ${n}`), l, dfe(l, kommaFehler(l)), tM1, { ...DIV(a, n), nachweis: [`${a} : ${n} = ${l}`] }); },
    () => { const n = String(zz(11, 19)), l = dez(1, 2.1, 9.9), a = mal(l, n); if (stellen(a) !== 1) return null;
      return mitUeberschlag(['Überschlage zuerst. Berechne dann genau.'], a, n, tM1, kommaFehler(l), DIV(a, n)); },
    () => { const n = zz(14, 28), l = euro(dez(2, 8.05, 16.95)), s = euro(mal(l, String(n)));
      return dezimal(Z(`Eine Klasse bezahlt für ${n} Eintrittskarten zusammen ${s} €.`, 'Rechne im Heft den Preis für eine Karte aus.'), l, dfe(l, [[euro(schiebe(l, 1)), 'div-stellenwert'], [euro(schiebe(l, -1)), 'div-stellenwert']]), tM1, { einheit: '€', ...DIV(s, n), nachweis: [`${s} € : ${n} = ${l} €`] }); },
    () => { const n = zz(3, 9), l = T(zz(2, 9), 1), a = mal(l, String(n));
      return dezimal(Z(`Rechne im Kopf: ${a} : ${n}`), l, dfe(l, kommaFehler(l)), h2('Denke an das Einmaleins mit Zehnteln.', '3,6 : 9: 36 Zehntel : 9 = 4 Zehntel = 0,4.'), { nachweis: [`${a} : ${n} = ${l}`] }); },
    () => { const n = zz(6, 9), l = T(zz(2, 9), 1), a = mal(l, String(n)), o = [[`${a} : ${n}`, true], [`${mal(l, String(n - 1))} : ${n - 1}`, true], [`${schiebe(a, -1)} : ${n}`, false], [`${schiebe(a, 1)} : ${n}`, false]];
      return auswahl(Z(`Kreuze alle Rechnungen an, deren Quotient ${l} ist.`), mische(o).map(([x, r]) => opt(x, r, r ? undefined : 'div-stellenwert')), h2('Rechne jede Aufgabe im Kopf.', 'Achte auf das Komma im Dividenden.'), { mehrfach: true, nachweis: [`${a} : ${n} = ${l}`, WERT(l)] }); },
    () => { const n = String(zz(11, 19)), l = dez(1, 2.1, 9.9), a = mal(l, n), falsch = String(P(l)[0]), kn = kind(), ga = String(Math.round(wert(a) / 10) * 10), gn = ersteStelle(n), u = durch(ga, gn, 2);
      if (stellen(a) !== 1 || !u) return null;
      return auswahl(Z(`${kn} rechnet: ${a} : ${n} = ${falsch}`, 'Prüfe das Ergebnis mit einem Überschlag.'), [opt(`Falsch. Der Überschlag ist ${ga} : ${gn} = ${u}. Es gilt ${a} : ${n} = ${l}.`, true), opt('Stimmt.', false, 'div-komma-vergessen'), opt(`Falsch. Es gilt ${a} : ${n} = ${schiebe(l, -1)}.`, false, 'div-stellenwert')],
        h2('Runde den Dividenden auf Zehner und den Divisor auf seine erste Stelle.', 'Vergleiche den Überschlag mit dem Ergebnis.'), { nachweis: [H(ga, `${a} auf Zehner gerundet`), H(gn, `${n} gerundet`), `${ga} : ${gn} = ${u}`, `${a} : ${n} = ${l}`, URTEIL(false, `${a} : ${n} = ${falsch}`)] }); },
  ]);
  sechs(D1, 'E', [
    () => { const n = zz(3, 9), l = dez(2, 1.01, 2.99), a = mal(l, String(n));
      return luecken(Z('Ergänze die fehlende Zahl.', `{{a}} : ${n} = ${l}`), { a: [num(a), dfe(a, [[durch(l, String(n), 4), 'probe-falsche-umkehr']])] }, h1('Rechne rückwärts mit der Umkehraufgabe.'), { nachweis: [`${l} · ${n} = ${a}`] }); },
    () => { const [s, n] = wahl([['10', 3], ['20', 3], ['10', 6], ['25', 3], ['50', 6], ['20', 7]]), q = 100 * Number(s) / n, l = euro(T(Math.round(q), 2)), kn = kind();
      return dezimal(Z(`${kn} und Freunde teilen ${s} € gerecht.`, `Es sind ${n} Kinder.`, 'Dividiere im Heft.', 'Runde auf Cent.'), l, dfe(l, [[euro(T(Math.floor(q), 2)), 'runden-abschneiden']]), h1('Rechne eine Stelle mehr, als du brauchst. Runde dann.'),
        { einheit: '€', nachweis: [RN(`${s} € : ${n}`, 2, `${l} €`, { einheit: '€' })] }); },
    () => { const n = 4, l = dez(1, 12.1, 15.9), a = mal(l, String(n)), kn = kind();
      return dezimal(Z(`Eine Staffel aus ${n} Kindern läuft zusammen ${a} s.`, `Alle laufen gleich schnell, auch ${kn}.`, 'Rechne im Heft.', 'Gib die Zeit für ein Kind an.'), l, dfe(l, kommaFehler(l)), h1('Teile die Zeit gerecht auf.'), { einheit: 's', nachweis: [`${a} s : ${n} = ${l} s`] }); },
    () => { const n = wahl([5, 6, 8]), l = T(zz(2, 9), 1), a = mal(l, String(n)), kn = kind(), opts = [['Das Komma im Quotienten fehlt. Überschreitet man das Komma im Dividenden, setzt man das Komma im Quotienten.', true], ['Beim Dividieren wird das Ergebnis immer größer.', false], ['Es wurde malgenommen statt geteilt.', false]];
      if (stellen(a) !== 1) return null;
      return auswahl(Z(`${kn} rechnet: ${a} : ${n} = ${P(l)[0]}`, 'Kreuze die Erklärung für den Fehler an.'), opts.map(([t, r]) => opt(t, r, r ? undefined : t.includes('größer') ? 'mal-macht-groesser' : 'div-falsche-rechenart')), h1(`Rechne selbst: ${a} : ${n} = ${l}.`), { nachweis: [FREI('Fehler beim Komma im Quotienten erklären')] }); },
    () => { const n = zz(6, 9), l = T(zz(2, 9), 2), a = mal(l, String(n)), falsch = schiebe(l, 1), kn = kind();
      return dezimal(Z(`${kn} rechnet: ${a} : ${n} = ${falsch}`, 'Das stimmt nicht.', 'Berechne das richtige Ergebnis.'), l, dfe(l, [[falsch, 'div-stellenwert']]), h1('Mache die Probe mit der Mal-Aufgabe.'), { nachweis: [`${a} : ${n} = ${l}`, `${l} · 10 = ${falsch}`] }); },
    () => { const n = zz(6, 9), o = mische([`${T(zz(11, n * 10 - 1), 1)} : ${n}`, `${T(zz(1, 9), 2)} : ${n}`, `${n + zz(1, 3)},${zz(1, 9)} : ${n}`, `${zz(n + 1, n + 9)} : ${n}`]);
      return auswahl(Z('Rechne nicht genau.', 'Kreuze alle Rechnungen an, deren Ergebnis kleiner als 1 ist.'), o.map((x) => opt(x, wert(x.split(' : ')[0]) < n, wert(x.split(' : ')[0]) < n ? undefined : 'div-stellenwert')),
        h1(`Vergleiche den Dividenden mit ${n}. Was ist ${n} : ${n}?`), { mehrfach: true, nachweis: [{ art: 'schwelle', zeichen: '<', wert: '1' }] }); },
  ]);

  // ================= D2: Durch eine Dezimalzahl dividieren =================
  sechs(D2, 'F', [
    () => { const p = wahl(['0,50', '0,20', '0,25']), n = zz(3, 8), s = euro(mal(p, String(n))), kn = kind();
      return dezimal(Z(`Ein Aufkleber kostet ${p} €.`, `${kn} hat ${s} €.`, 'Gib an, wie viele Aufkleber es sind.'), n, dfe(n, [[n * 10, 'div-stellenwert'], [wert(s) < 1 ? null : Math.floor(wert(s)), 'div-macht-kleiner']]),
        h3('Zähle, wie oft der Preis in das Geld passt.', '1,50 € : 0,50 € = 3, denn 0,50 € passen dreimal in 1,50 €.', 'Rechne in Cent: 150 ct : 50 ct = 3.'), { bild: geldBild(s), nachweis: [`${s} € : ${p} € = ${n}`] }); },
    () => { const b = zz(1, 3), n = zz(2, 4), z = b * n; if (z > 9) return null; const a = T(z, 1), d = T(b, 1);
      return luecken(Z(`Der Streifen zeigt ${a}.`, `Gib an, wie oft ${d} in ${a} passt.`, `${a} : ${d} = ${z} Zehntel : ${b} Zehntel = {{a}}`), { a: [n, dfe(n, [[T(n, 1), 'div-macht-kleiner'], [n * 10, 'div-stellenwert']])] }, tF2,
        { bild: streifen(z), nachweis: [{ art: 'bild', bruch: `${z}⁄10` }, `${z} Zehntel : ${b} Zehntel = ${n}`, `${a} : ${d} = ${n}`] }); },
    () => { const b = zz(2, 9), n = zz(2, 9), a = T(b * n, 1), d = T(b, 1), [x, y] = verschiebe(a, d);
      return luecken(Z(`Berechne ${a} : ${d}.`, 'Rechne beide Zahlen · 10.', `${a} : ${d} = {{x}} : ${y} = {{e}}`), { x: [num(x), dfe(x, [[a, 'div-ein-komma-verschoben']])], e: [n, dfe(n, [[T(n, 1), 'div-ein-komma-verschoben']])] }, h3('Nimm beide Zahlen mal 10.', '0,8 : 0,2 = 8 : 2 = 4.', 'Das Ergebnis bleibt gleich, wenn beide Zahlen mal 10 genommen werden.'),
        { bild: tafel(spaltenFuer(a, x), a, '· 10'), nachweis: [`${a} · 10 = ${x}`, `${d} · 10 = ${y}`, `${x} : ${y} = ${n}`, `${a} : ${d} = ${n}`] }); },
    () => { const b = zz(2, 6), n = zz(3, 9), z = b * n; if (z > 99 || z < 11) return null; const a = T(z, 2), d = T(b, 2);
      return luecken(Z(`Das Hunderterfeld zeigt ${a}.`, `Gib an, wie oft ${d} in ${a} passt.`, `${a} : ${d} = ${z} Hundertstel : ${b} Hundertstel = {{a}}`), { a: [n, dfe(n, [[T(n, 2), 'div-macht-kleiner'], [n * 10, 'div-stellenwert']])] },
        h3('Jedes Feld ist ein Hundertstel.', '0,36 : 0,04 = 36 Hundertstel : 4 Hundertstel = 9.', 'Wie oft passt die zweite Zahl in die erste?'), { bild: hundert(z), nachweis: [{ art: 'bild', bruch: `${z}⁄100` }, `${z} Hundertstel : ${b} Hundertstel = ${n}`, `${a} : ${d} = ${n}`] }); },
    () => { const s = zz(2, 5), n = 2 * s, kn = kind(), o = mische([[String(n), true], [String(s / 2 >= 1 && s % 2 === 0 ? s / 2 : 1), false], [String(n * 10), false]]);
      return auswahl(Z(`${kn} hat ${s},00 €.`, 'Ein Aufkleber kostet 0,50 €.', 'Kreuze an, wie viele Aufkleber es sind.'), o.map(([x, r]) => opt(x, r, r ? undefined : x === String(n * 10) ? 'div-stellenwert' : 'div-macht-kleiner')),
        h3('In 1 € passen zwei 50-ct-Münzen.', '2 € : 0,50 € = 4.', 'Dividieren durch eine Zahl unter 1 macht größer.'), { bild: geldBild(`${s},00`), nachweis: [`${s},00 € : 0,50 € = ${n}`, WERT(n)] }); },
    () => { const p = euro(T(zz(11, 49) * 10, 2)), l = euro(mal(p, '2')), k = kommaLuecken(l), kn = kind(); if (!k || k.k < 10) return null;
      return luecken(Z(`${kn} kauft 0,5 kg Käse für ${p} €.`, 'Berechne den Preis für 1 kg.', 'Das Komma steht schon da.', `${p} € : 0,5 = {{g}},{{k}} €`), { g: [k.g, []], k: [k.k, []] },
        h3('0,5 kg ist ein halbes Kilogramm.', '1 kg ist doppelt so viel.', 'Durch 0,5 ist dasselbe wie mal 2.'), { bild: geldBild(p), nachweis: ['1 kg : 0,5 kg = 2', `${p} € : 0,5 = ${l} €`, `${p} € · 2 = ${l} €`] }); },
  ]);
  sechs(D2, 'G', [
    () => { const b = zz(2, 9), n = zz(2, 9), a = T(b * n, 1), d = T(b, 1), [x, y] = verschiebe(a, d);
      return dezimal(Z(`Dividiere: ${a} : ${d}`, 'Rechne zuerst beide Zahlen · 10.'), n, dfe(n, [[durch(a, String(b), 3), 'div-ein-komma-verschoben'], [T(n, 1), 'div-macht-kleiner']]), tG2, { bild: tafel(spaltenFuer(a, x), a, '· 10'), ...DIV(x, y, `${a} : ${d}`), nachweis: [`${a} · 10 = ${x}`, `${d} · 10 = ${y}`, `${x} : ${y} = ${n}`, `${a} : ${d} = ${n}`] }); },
    () => { const b = zz(2, 9), l = dez(1, 1.1, 9.9), d = T(b, 1), a = mal(l, d), [x, y] = verschiebe(a, d); if (stellen(a) !== 2) return null;
      return dezimal(Z(`Dividiere: ${a} : ${d}`), l, dfe(l, [[durch(a, String(b), 3), 'div-ein-komma-verschoben'], [String(P(l)[0]), 'div-komma-vergessen']]), tG2, { ...DIV(x, y, `${a} : ${d}`), nachweis: [`${a} · 10 = ${x}`, `${d} · 10 = ${y}`, `${x} : ${y} = ${l}`, `${a} : ${d} = ${l}`] }); },
    () => { const b = zz(2, 9), n = zz(11, 49), a = T(b * n, 2), d = T(b, 2), [x, y] = verschiebe(a, d); if (P(a)[0] % 10 === 0) return null;
      return luecken(Z('Verschiebe das Komma in beiden Zahlen gleich weit.', 'Rechne dazu beide Zahlen · 100.', `${a} : ${d} = {{x}} : {{y}} = {{e}}`), { x: [num(x), dfe(x, [[schiebe(a, 1), 'div-ein-komma-verschoben']])], y: [num(y), []], e: [n, dfe(n, [[T(n, 2), 'div-ein-komma-verschoben']])] }, tG2,
        { bild: tafel(spaltenFuer(a, x), a, '· 100'), nachweis: [`${a} · 100 = ${x}`, `${d} · 100 = ${y}`, `${x} : ${y} = ${n}`, `${a} : ${d} = ${n}`] }); },
    () => { const p = euro(T(zz(5, 9) * 10 + wahl([0, 5]), 2)), n = zz(4, 9), s = euro(mal(p, String(n))), kn = kind();
      return dezimal(Z(`${kn} hat ${s} €.`, `Ein Heft kostet ${p} €.`, 'Berechne, wie viele Hefte es sind.'), n, dfe(n, [[n * 10, 'div-stellenwert']]), tG2, { bild: geldBild(s), nachweis: [`${s} € : ${p} € = ${n}`] }); },
    () => { const b = zz(3, 9), n = zz(21, 69), d = T(b, 1), a = T(b * n, 1), x = String(b * n), o = mische([[String(n), true], [T(n, 1), false], [String(n * 10), false]]), u = durch(ersteStelle(x), String(b), 0);
      return auswahl(Z(`Überschlage ${a} : ${d}.`, 'Kreuze das passende Ergebnis an.'), o.map(([w, r]) => opt(w, r, r ? undefined : w.includes(',') ? 'div-ein-komma-verschoben' : 'div-stellenwert')),
        h3('Rechne zuerst beide Zahlen · 10.', '25,2 : 0,6 = 252 : 6. Das ist etwa 240 : 6 = 40.', 'Das Ergebnis muss in der Nähe von deinem Überschlag liegen.'), { nachweis: [`${a} · 10 = ${x}`, `${d} · 10 = ${b}`, `${x} : ${b} = ${n}`, `${a} : ${d} = ${n}`, WERT(n)] }); },
    () => { const b = zz(2, 9), n = zz(11, 29), d = T(b, 1), a = T(b * n, 1), falsch = T(n, 1), kn = kind();
      if ((b * n) % 10 === 0) return null;
      return auswahl(Z(`${kn} rechnet: ${a} : ${d} = ${falsch}`, 'Beurteile die Rechnung.'), [opt(`Falsch. Das Komma muss in beiden Zahlen rücken. Es gilt ${a} : ${d} = ${b * n} : ${b} = ${n}.`, true), opt('Stimmt.', false, 'div-ein-komma-verschoben'), opt('Stimmt, denn Dividieren macht immer kleiner.', false, 'div-macht-kleiner')],
        h3('Verschiebe das Komma in beiden Zahlen.', '8,4 : 0,4 = 84 : 4 = 21.', 'Vergleiche mit der Rechnung.'), { nachweis: [`${a} · 10 = ${b * n}`, `${d} · 10 = ${b}`, `${b * n} : ${b} = ${n}`, `${a} : ${d} = ${n}`, URTEIL(false, `${a} : ${d} = ${falsch}`)] }); },
  ]);
  sechs(D2, 'M', [
    () => { const d = T(zz(11, 99), wahl([1, 2])), l = dez(1, 1.1, 9.9), a = mal(l, d), [x, y] = verschiebe(a, d); if (P(d)[0] % 10 === 0 || stellen(a) > 3) return null;
      return dezimal(Z(`Dividiere schriftlich im Heft: ${a} : ${d}`), l, dfe(l, [[durch(a, String(P(d)[0]), 4), 'div-ein-komma-verschoben'], ...kommaFehler(l)]), tM2, { ...DIV(x, y, `${a} : ${d}`), nachweis: [`${a} · ${10 ** stellen(d)} = ${x}`, `${d} · ${10 ** stellen(d)} = ${y}`, `${x} : ${y} = ${l}`, `${a} : ${d} = ${l}`] }); },
    () => { const d = dez(1, 2.1, 9.9), l = dez(1, 2.1, 9.9), a = mal(l, d), [x, y] = verschiebe(a, d);
      return mitUeberschlag(['Überschlage zuerst. Berechne dann genau.'], a, d, tM2, [[durch(a, String(P(d)[0]), 4), 'div-ein-komma-verschoben'], ...kommaFehler(l)], DIV(x, y, `${a} : ${d}`)); },
    () => { const p = euro(T(zz(15, 19) * 10, 2)), n = zz(25, 48), s = euro(mal(p, String(n))), kn = kind();
      return dezimal(Z(`Die Mutter von ${kn} bezahlt ${s} € fürs Tanken.`, `Ein Liter kostet ${p} €.`, 'Rechne im Heft aus, wie viele Liter es sind.'), n, dfe(n, [[n * 10, 'div-stellenwert'], [T(n, 1), 'div-ein-komma-verschoben']]), tM2, { einheit: 'l', nachweis: [`${s} € : ${p} € = ${n}`, `${n} · 1 l = ${n} l`] }); },
    () => { const b = zz(2, 9), n = zz(2, 9) * 10, d = T(b, 2), a = T(b * n, 2);
      return dezimal(Z(`Rechne im Kopf: ${a} : ${d}`), n, dfe(n, [[n / 10, 'div-stellenwert'], [n * 10, 'div-stellenwert']]), h2('Verschiebe das Komma in beiden Zahlen um zwei Stellen.', 'Rechne dann mit natürlichen Zahlen.'), { nachweis: [`${a} : ${d} = ${n}`] }); },
    () => { const b = zz(2, 9), n = zz(2, 9), d = T(b, 1), a = T(b * n, 1); if ((b * n) % 10 === 0) return null; const o = [[`${b * n} : ${b}`, true], [`${T(b * n, 2)} : ${T(b, 2)}`, true], [`${a} : ${b}`, false], [`${b * n} : ${d}`, false]];
      return auswahl(Z(`Kreuze alle Rechnungen an, die denselben Quotienten haben wie ${a} : ${d}.`), mische(o).map(([x, r]) => opt(x, r, r ? undefined : 'div-ein-komma-verschoben')),
        h2('Verschiebe in jeder Rechnung das Komma, bis der Divisor eine natürliche Zahl ist.', 'Gleiche Rechnungen haben denselben Quotienten.'), { mehrfach: true, nachweis: [`${a} : ${d} = ${n}`, WERT(n)] }); },
    () => { const b = zz(2, 9), n = zz(12, 49), d = T(b, 1), a = T(b * n, 1), falsch = T(n, 1), kn = kind(), ga = grob(a), u = durch(ga, d, 2);
      if (!u || (b * n) % 10 === 0 || u === String(n)) return null;
      return auswahl(Z(`${kn} rechnet: ${a} : ${d} = ${falsch}`, 'Prüfe das Ergebnis mit einem Überschlag.'), [opt(`Falsch. Der Überschlag ist ${ga} : ${d} = ${u}. Es gilt ${a} : ${d} = ${n}.`, true), opt('Stimmt.', false, 'div-macht-kleiner'), opt(`Falsch. Es gilt ${a} : ${d} = ${n * 10}.`, false, 'div-stellenwert')],
        h2('Runde den Dividenden auf Ganze.', 'Überlege: Wie oft passt der Divisor in die gerundete Zahl?'), { nachweis: [H(ga, `${a} gerundet`), `${ga} : ${d} = ${u}`, `${a} : ${d} = ${n}`, URTEIL(false, `${a} : ${d} = ${falsch}`)] }); },
  ]);
  sechs(D2, 'E', [
    () => { const d = T(zz(2, 9), 1), l = dez(1, 1.1, 9.9), a = mal(l, d);
      return luecken(Z('Ergänze die fehlende Zahl.', `{{a}} : ${d} = ${l}`), { a: [num(a), dfe(a, [[durch(l, d, 4), 'probe-falsche-umkehr']])] }, h1('Rechne rückwärts mit der Umkehraufgabe.'), { nachweis: [`${l} · ${d} = ${a}`] }); },
    () => { const [a, d] = wahl([['2,5', '0,3'], ['5,2', '0,7'], ['4,6', '0,3'], ['7,1', '0,6'], ['3,9', '0,7'], ['8,3', '0,9']]), q = wert(a) / wert(d), l = T(Math.round(q * 10), 1);
      return dezimal(Z(`Dividiere schriftlich im Heft: ${a} : ${d}`, 'Runde das Ergebnis auf Zehntel.'), l, dfe(l, [[T(Math.floor(q * 10), 1), 'runden-abschneiden'], [T(Math.round(q * 100), 2), 'falsch-gerundet']].filter(([w]) => w !== l)), h1('Rechne eine Stelle mehr, als du brauchst. Runde dann.'),
        { nachweis: [RN(`${a} : ${d}`, 1, l)] }); },
    () => { const [f, n] = wahl([['0,75', 16], ['0,25', 36], ['0,5', 27], ['0,75', 12], ['0,2', 45]]), s = mal(f, String(n));
      return dezimal(Z(`Eine Flasche fasst ${f} l.`, `Saft gibt es ${s} l.`, 'Rechne im Heft.', 'Gib an, wie viele Flaschen man damit füllen kann.'), n, dfe(n, [[durch(s, String(P(f)[0]), 4), 'div-ein-komma-verschoben'], [num(mal(s, f)), 'div-falsche-rechenart']]), h1('Wie oft passt eine Flasche in die ganze Menge?'), { nachweis: [`${s} l : ${f} l = ${n}`] }); },
    () => { const n = zz(3, 9), opts = [['Ein halbes Ganzes passt in jedes Ganze zweimal. Darum passt es öfter hinein, als es Ganze sind.', true], ['Beim Dividieren wird das Ergebnis immer kleiner.', false], ['Beim Teilen rückt das Komma immer nach rechts.', false]];
      return auswahl(Z(`Kreuze die Begründung an, warum ${n} : 0,5 größer als ${n} ist.`), opts.map(([t, r]) => opt(t, r, r ? undefined : t.includes('kleiner') ? 'div-macht-kleiner' : 'komma-falsche-richtung')), h1('Überlege, wie oft 0,5 in 1 passt.'), { nachweis: [FREI('Divisor unter 1 begründen')] }); },
    () => { const b = zz(2, 9), n = zz(2, 9), d = T(b, 1), a = T(b * n, 1), falsch = T(n, 1), kn = kind();
      if (P(a)[0] % 10 === 0) return null;
      return dezimal(Z(`${kn} rechnet: ${a} : ${d} = ${falsch}`, 'Das stimmt nicht.', 'Berechne das richtige Ergebnis.'), n, dfe(n, [[falsch, 'div-ein-komma-verschoben']]), h1('Verschiebe das Komma in beiden Zahlen.'), { nachweis: [`${a} : ${d} = ${n}`, `${a} : ${b} = ${falsch}`] }); },
    () => { const n = zz(6, 9), o = mische([`${n} : 0,5`, `${n} : 2`, `${n} : 0,9`, `${n} : 1,1`]);
      return auswahl(Z('Rechne nicht genau.', `Kreuze alle Rechnungen an, deren Ergebnis größer als ${n} ist.`), o.map((x) => opt(x, x.includes(': 0,'), x.includes(': 0,') ? undefined : 'div-macht-kleiner')),
        h1(`Vergleiche jeden Divisor mit 1. Was ist ${n} : 1?`), { mehrfach: true, nachweis: [{ art: 'schwelle', zeichen: '>', wert: String(n) }] }); },
  ]);
}
