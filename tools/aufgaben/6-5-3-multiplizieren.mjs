// Aufgaben zu 6.5.3 „Dezimalzahlen multiplizieren“ (Lernziele M1, M2) nach ADR 0015 und ADR 0048.
// M1: Dezimalzahl mal natürliche Zahl. M2: Dezimalzahl mal Dezimalzahl, mit Überschlag.
// F und G rechnen im Rechenraster ohne Komma und setzen danach das Komma im eigenen Feld. Ab M im Heft.
// Überschlag: F und G wählen unter drei Ergebnissen mit verschiedenem Komma, M trägt ihn in ein Feld ein, E beurteilt ihn.
// F zeigt Zehntel mal Zehntel im Hunderterfeld: hell der erste Faktor, kräftig der Teil davon.

import { sechs, auswahl, luecken, dezimal, rasterMalKomma, Z, h1, h2, h3 } from '../werkzeug.mjs';
import { B, zz, wahl, mische, kind, opt, T, dfe, URTEIL, FREI, bild, fig, P, mal, dez, euro, schiebe, wert, kommaWiePlus, grob, ersteStelle, stellen } from './6-5-rechnen.mjs';
import { geldStuecke } from './6-5-1-addieren.mjs';

const M1 = '6.5.3-M1', M2 = '6.5.3-M2';
const H = (w, grund) => ({ wert: String(w), grund });
const num = (t) => (/^\d+$/.test(String(t)) ? Number(t) : t);
const WERT = (w) => ({ art: 'wert', wert: String(w) });
const geldBild = (t) => B.geld(geldStuecke(P(euro(t))[0]));
// Das Komma um eine Stelle falsch: typische Fehler beim Komma im Produkt.
const kommaDaneben = (l) => [[schiebe(l, -1), 'dezimal-stelle'], [schiebe(l, 1), 'dezimal-stelle']];
// Das Ergebnis endet ohne Komma auf 0: Dann gibt es beim Komma setzen nichts zu entscheiden.
const ohneEndnull = (...zahlen) => zahlen.reduce((p, t) => p * P(t)[0], 1) % 10 !== 0 && zahlen.every((t) => P(t)[0] % 10 !== 0);
// Zehntel mal Zehntel im Hunderterfeld (gezählt spaltenweise: Teil i liegt in Spalte i / 10, Zeile i % 10).
// Hell: die ersten a Spalten (der erste Faktor). Kräftig: davon die oberen b Zeilen (b Zehntel davon).
const feld = (a, b) => { const kraeftig = [], hell = [];
  for (let s = 0; s < a; s++) for (let z = 0; z < 10; z++) (z < b ? kraeftig : hell).push(s * 10 + z);
  return bild(fig('hundert', null, kraeftig, { hell })); };
// Überschlag eines Produkts: Jeder Faktor auf Ganze oder auf seine erste Stelle gerundet. Alle Kombinationen zählen.
const ueberschlag = (a, b) => {
  const ra = [...new Set([grob(a), ersteStelle(a)])], rb = [...new Set([grob(b), ersteStelle(b)])];
  const hilfen = [...ra.filter((x) => x !== a).map((x) => H(x, `${a} gerundet`)), ...rb.filter((x) => x !== b).map((x) => H(x, `${b} gerundet`))];
  const werte = [], rechnungen = [];
  for (const x of ra) for (const y of rb) { const p = mal(x, y); rechnungen.push(`${x} · ${y} = ${p}`); if (!werte.includes(p)) werte.push(p); }
  return { u: werte[0], auch: werte.slice(1), nachweis: [...hilfen, ...rechnungen], ra, rb };
};
// Überschlag und genaues Ergebnis in zwei Feldern (M). `vorn` sind die Zeilen davor.
const mitUeberschlag = (vorn, a, b, hilfen, fehler = []) => {
  const l = mal(a, b), ue = ueberschlag(a, b);
  const t = luecken(Z(...vorn, `Überschlag: ${a} · ${b} ≈ {{u}}`, `Genau: ${a} · ${b} = {{e}}`),
    { u: [num(ue.u), dfe(ue.u, [[l, 'ueberschlag-nicht-gerundet']])], e: [num(l), dfe(l, [[kommaWiePlus(a, b), 'mal-komma-wie-plus'], ...kommaDaneben(l), ...fehler])] }, hilfen,
    { nachweis: [...ue.nachweis, `${a} · ${b} = ${l}`] });
  if (ue.auch.length) t.luecken.u.auch = ue.auch.map(num);
  return t;
};

const tF1 = h3('Rechne zuerst ohne Komma.', '1,2 · 3: Rechne 12 · 3 = 36. Dann ist 1,2 · 3 = 3,6.', 'Das Ergebnis hat so viele Stellen nach dem Komma wie die Dezimalzahl.');
const tFg = h3('Nimm den Preis so oft, wie Dinge gekauft werden.', '1,20 € · 3: Das sind 3 € und 60 ct, also 3,60 €.', 'Rechne erst die Euro, dann die Cent.');
const tG1 = h3('Rechne ohne Komma. Setze dann das Komma.', '3,45 · 6: Rechne 345 · 6 = 2070. Also 3,45 · 6 = 20,70 = 20,7.', 'Die Dezimalzahl hat zwei Stellen nach dem Komma. Das Ergebnis auch.');
const tM1 = h2('Rechne ohne Komma und setze dann das Komma.', 'Das Ergebnis hat so viele Nachkommastellen wie die Dezimalzahl. Prüfe mit einem Überschlag.');
const tF2 = h3('Rechne ohne Komma. Zähle dann die Stellen nach dem Komma in beiden Zahlen.', '0,3 · 0,4: 3 · 4 = 12. Beide Zahlen haben eine Stelle, zusammen zwei. Also 0,12.', 'Zehntel mal Zehntel ergibt Hundertstel.');
const tFfeld = h3('Zähle die kräftig gefärbten Felder.', 'Jedes Feld ist ein Hundertstel. 12 Felder sind 0,12.', 'Zehntel mal Zehntel ergibt Hundertstel.');
const tG2 = h3('Rechne ohne Komma. Zähle dann die Stellen nach dem Komma in beiden Faktoren zusammen.', '2,3 · 1,4: 23 · 14 = 322. Zusammen zwei Stellen, also 3,22.', 'So viele Stellen hat das Ergebnis nach dem Komma.');
const tM2 = h2('Runde jeden Faktor auf Ganze oder auf seine erste Stelle. Rechne damit den Überschlag.', 'Rechne dann ohne Komma. Das Ergebnis hat so viele Nachkommastellen wie beide Faktoren zusammen.');

export function multiplizieren6() {
  // ================= M1: Dezimalzahl mal natürliche Zahl =================
  sechs(M1, 'F', [
    () => { const p = euro(T(zz(11, 29) * 5, 2)), n = zz(2, 4), l = euro(mal(p, String(n))), kn = kind();
      return dezimal(Z(`Ein Heft kostet ${p} €.`, `${kn} kauft ${n} Hefte.`, 'Gib den Preis für alle Hefte an.'), l, dfe(l, [[euro(schiebe(l, 1)), 'dezimal-stelle'], [euro(T(P(p)[0] + n, 2)), '1x1-addiert']]), tFg,
        { einheit: '€', bild: geldBild(p), nachweis: [`${p} € · ${n} = ${l} €`] }); },
    () => { const a = dez(1, 1.1, 4.9), n = String(zz(2, 5)); if (!ohneEndnull(a, n)) return null; const l = mal(a, n);
      return rasterMalKomma(Z(`Berechne ${a} · ${n}.`, 'Rechne im Raster ohne Komma.', 'Setze dann das Komma im Ergebnis.'), a, n, tF1, { fehler: [[P(l)[0], 'dezimal-stelle'], [schiebe(l, -1), 'dezimal-stelle']] }); },
    () => { const k = zz(1, 3), n = zz(2, 3); if (k * n > 9) return null; const l = T(k * n, 1);
      return luecken(Z(`Der Streifen zeigt ${n} · 0,${k}.`, 'Rechne in Zehnteln.', `${n} · 0,${k} = ${n} · ${k} Zehntel = {{a}} Zehntel = {{b}}`), { a: [k * n, dfe(k * n, [[k + n, '1x1-addiert']])], b: [l, dfe(l, [[T(k * n, 2), 'dezimal-stelle'], [k * n, 'dezimal-stelle']])] },
        h3('Zähle die gefärbten Zehntel.', '2 · 0,3 = 2 · 3 Zehntel = 6 Zehntel = 0,6.', 'Rechne mit Zehnteln wie mit Einern.'), { bild: bild(fig('streifen', 10, Array.from({ length: k * n }, (_, i) => i))), nachweis: [`${n} · ${k} Zehntel = ${k * n} Zehntel`, `${n} · 0,${k} = ${l}`, { art: 'bild', bruch: `${k * n}⁄10` }] }); },
    () => { const a = dez(2, 0.11, 0.49), n = String(zz(2, 4)); if (!ohneEndnull(a, n)) return null; const l = mal(a, n);
      return rasterMalKomma(Z(`Berechne ${a} · ${n}.`, 'Rechne im Raster ohne Komma.', 'Setze dann das Komma im Ergebnis.'), a, n, tF1, { fehler: [[P(l)[0], 'dezimal-stelle'], [schiebe(l, 1), 'dezimal-stelle']] }); },
    () => { const p = euro(T(zz(11, 39) * 10, 2)), n = zz(3, 4), l = euro(mal(p, String(n))), kn = kind(), o = mische([[l, true], [euro(schiebe(l, -1)), false], [euro(schiebe(l, 1)), false]]);
      return auswahl(Z(`Ein Brot kostet ${p} €.`, `${kn} kauft ${n} Brote.`, 'Schätze zuerst.', 'Kreuze den passenden Preis an.'), o.map(([x, r]) => opt(`${x} €`, r, r ? undefined : 'dezimal-stelle')),
        h3('Runde den Preis auf ganze Euro.', '2,40 € · 3 ist etwa 2 € · 3 = 6 €.', 'Der Preis muss in der Nähe deiner Schätzung liegen.'), { bild: geldBild(p), nachweis: [`${p} € · ${n} = ${l} €`, WERT(`${l} €`)] }); },
    () => { const a = dez(2, 1.11, 2.49), n = String(zz(2, 3)); if (!ohneEndnull(a, n)) return null; const l = mal(a, n);
      const t = rasterMalKomma(Z(`Ein Band ist ${a} m lang.`, `Gib die Länge von ${n} Bändern an.`, 'Rechne im Raster ohne Komma.', 'Setze dann das Komma.'), a, n, tF1, { fehler: [[P(l)[0], 'dezimal-stelle'], [schiebe(l, -1), 'dezimal-stelle']], extra: { einheit: 'm' } });
      t.nachweis.push(`${a} m · ${n} = ${l} m`); return t; },
  ]);
  sechs(M1, 'G', [
    () => { const a = dez(2, 1.11, 9.99), n = String(zz(3, 9)); if (!ohneEndnull(a, n)) return null; const l = mal(a, n);
      return rasterMalKomma(Z(`Multipliziere ${a} · ${n} im Raster.`, 'Setze dann das Komma im Ergebnis.'), a, n, tG1, { fehler: [[P(l)[0], 'dezimal-stelle'], ...kommaDaneben(l)] }); },
    () => { const a = dez(1, 1.1, 9.9), n = String(zz(1, 2) * 10 + zz(1, 9)); if (!ohneEndnull(a, n)) return null; const l = mal(a, n);
      return rasterMalKomma(Z(`Multipliziere ${a} · ${n} im Raster.`, 'Setze dann das Komma im Ergebnis.'), a, n, tG1, { fehler: [[P(l)[0], 'dezimal-stelle'], ...kommaDaneben(l)] }); },
    () => { const a = dez(1, 2.1, 9.9), n = String(zz(11, 29)), l = mal(a, n), o = mische([[l, true], [schiebe(l, -1), false], [schiebe(l, 1), false]]), ga = grob(a), u = mal(ga, n);
      return auswahl(Z(`Überschlage ${a} · ${n}.`, 'Kreuze das passende Ergebnis an.'), o.map(([x, r]) => opt(x, r, r ? undefined : 'dezimal-stelle')),
        h3('Runde die Dezimalzahl auf Ganze.', '4,8 · 12 ist etwa 5 · 12 = 60.', 'Das Ergebnis muss in der Nähe von deinem Überschlag liegen.'), { nachweis: [H(ga, `${a} gerundet`), `${ga} · ${n} = ${u}`, `${a} · ${n} = ${l}`, WERT(l)] }); },
    () => { const p = euro(dez(2, 1.11, 1.99)), n = zz(4, 9), l = euro(mal(p, String(n))), kn = kind();
      return dezimal(Z(`Ein Liter Milch kostet ${p} €.`, `${kn} kauft ${n} Liter.`, 'Berechne den Preis.'), l, dfe(l, [[euro(schiebe(l, 1)), 'dezimal-stelle'], [euro(schiebe(l, -1)), 'dezimal-stelle']]), tG1,
        { einheit: '€', bild: geldBild(p), nachweis: [`${p} € · ${n} = ${l} €`] }); },
    () => { const n = wahl([4, 5, 8]), a = T(wahl({ 4: [25, 75, 125], 5: [12, 14, 16, 18], 8: [125, 375] }[n]), n === 5 ? 1 : n === 4 ? 2 : 3), l = mal(a, String(n));
      if (stellen(a) > 2) return null;
      return luecken(Z('Ergänze die fehlende Zahl.', `${a} · {{a}} = ${l}`), { a: [n, dfe(n, [[n * 10, 'dezimal-stelle']])] }, h3('Probiere kleine Zahlen aus.', '0,25 · 4 = 1, denn 25 · 4 = 100.', 'Rechne ohne Komma und setze dann das Komma.'), { nachweis: [`${a} · ${n} = ${l}`] }); },
    () => { const a = dez(1, 1.1, 4.9), n = zz(3, 9), r = mal(a, String(n)), falsch = schiebe(r, -1), kn = kind();
      if (!ohneEndnull(a, String(n))) return null;
      return auswahl(Z(`${kn} rechnet: ${a} · ${n} = ${falsch}`, 'Beurteile die Rechnung.'), [opt(`Falsch. ${a} · ${n} = ${r}.`, true), opt('Stimmt.', false, 'dezimal-stelle'), opt(`Stimmt, denn ${P(a)[0]} · ${n} = ${P(r)[0]}.`, false, 'dezimal-stelle')],
        h3('Mache einen Überschlag.', '2,4 · 3 ist etwa 2 · 3 = 6. Das Ergebnis ist größer als 1.', 'Vergleiche mit dem Überschlag.'), { nachweis: [`${P(a)[0]} · ${n} = ${P(r)[0]}`, `${a} · ${n} = ${r}`, URTEIL(false, `${a} · ${n} = ${falsch}`)] }); },
  ]);
  sechs(M1, 'M', [
    () => { const a = dez(2, 1.01, 9.99), n = String(zz(12, 49)); if (n.includes('0')) return null; const l = mal(a, n);
      return dezimal(Z(`Multipliziere schriftlich im Heft: ${a} · ${n}`), num(l), dfe(l, kommaDaneben(l)), tM1, { nachweis: [`${a} · ${n} = ${l}`] }); },
    () => mitUeberschlag(['Überschlage zuerst. Berechne dann genau.'], dez(1, 2.1, 9.9), String(zz(12, 39)), tM1),
    () => { const p = euro(dez(2, 1.51, 1.89)), n = zz(25, 48), l = euro(mal(p, String(n))), kn = kind();
      return dezimal(Z(`Ein Liter Benzin kostet ${p} €.`, `Die Mutter von ${kn} tankt ${n} Liter.`, 'Rechne im Heft den Preis aus.'), l, dfe(l, [[euro(schiebe(l, 1)), 'dezimal-stelle'], [euro(schiebe(l, -1)), 'dezimal-stelle']]), tM1,
        { einheit: '€', nachweis: [`${p} € · ${n} = ${l} €`] }); },
    () => { const a = wahl(['0,25', '0,5', '0,75', '1,5', '2,5']), n = String(zz(1, 9) * 40), l = mal(a, n);
      return dezimal(Z(`Rechne im Kopf: ${a} · ${n}`), num(l), dfe(l, kommaDaneben(l)), h2('Denke an Bruchteile: 0,5 ist die Hälfte, 0,25 ein Viertel.', 'Rechne zum Beispiel 0,25 · 80 = 80 : 4 = 20.'), { nachweis: [`${a} · ${n} = ${l}`] }); },
    () => { const a = dez(1, 1.1, 4.9), n = zz(2, 9), l = mal(a, String(n)), o = [[`${a} · ${n}`, true], [`${schiebe(a, -1)} · ${n * 10}`, true], [`${schiebe(a, 1)} · ${n * 10}`, false], [`${schiebe(a, -1)} · ${n}`, false]];
      return auswahl(Z(`Kreuze alle Rechnungen an, deren Ergebnis ${l} ist.`), mische(o).map(([x, r]) => opt(x, r, r ? undefined : 'dezimal-stelle')), h2('Rechne jede Rechnung ohne Komma aus.', 'Zähle dann die Nachkommastellen.'), { mehrfach: true, nachweis: [`${a} · ${n} = ${l}`, WERT(l)] }); },
    () => { const a = dez(1, 2.1, 9.9), n = String(zz(12, 39)), r = mal(a, n), falsch = schiebe(r, -1), kn = kind(), ga = grob(a), u = mal(ga, n);
      if (falsch === r || n.includes('0')) return null;
      return auswahl(Z(`${kn} rechnet: ${a} · ${n} = ${falsch}`, 'Prüfe das Ergebnis mit einem Überschlag.'), [opt(`Falsch. Der Überschlag ist ${ga} · ${n} = ${u}. Es gilt ${a} · ${n} = ${r}.`, true), opt('Stimmt.', false, 'dezimal-stelle'), opt(`Falsch. Es gilt ${a} · ${n} = ${schiebe(r, 1)}.`, false, 'dezimal-stelle')],
        h2('Runde die Dezimalzahl auf Ganze.', 'Vergleiche den Überschlag mit dem Ergebnis.'), { nachweis: [H(ga, `${a} gerundet`), `${ga} · ${n} = ${u}`, `${a} · ${n} = ${r}`, URTEIL(false, `${a} · ${n} = ${falsch}`)] }); },
  ]);
  sechs(M1, 'E', [
    () => { const n = zz(3, 9), a = dez(2, 1.01, 2.99), l = mal(a, String(n));
      return luecken(Z('Ergänze die fehlende Zahl.', `{{a}} · ${n} = ${l}`), { a: [a, dfe(a, kommaDaneben(a))] }, h1('Rechne rückwärts mit der Umkehraufgabe.'), { nachweis: [`${l} : ${n} = ${a}`] }); },
    () => { const a = dez(3, 0.101, 0.999), n = String(zz(12, 99)); if (n.includes('0')) return null; const l = mal(a, n); if (stellen(l) > 4) return null;
      return dezimal(Z(`Multipliziere schriftlich im Heft: ${a} · ${n}`), num(l), dfe(l, kommaDaneben(l)), h1('Schreibe die Zahlen ohne Komma untereinander. Setze das Komma am Ende.'), { nachweis: [`${a} · ${n} = ${l}`] }); },
    () => { const a = dez(2, 1.05, 3.95), n = zz(105, 160), l = mal(a, String(n));
      return dezimal(Z(`Ein Paket wiegt ${a} kg.`, `Ein Lieferwagen bringt ${n} solche Pakete.`, 'Rechne im Heft.', 'Gib das Gewicht aller Pakete an.'), num(l), dfe(l, kommaDaneben(l)), h1('Mache zuerst einen Überschlag.'), { einheit: 'kg', nachweis: [`${a} kg · ${n} = ${l} kg`] }); },
    () => { const n = zz(12, 29), opts = [['Weniger als ein Ganzes mehrmals genommen ergibt weniger als die Zahl der Ganzen.', true], ['Ein Ergebnis mit Komma ist immer klein.', false], ['Beim Malnehmen rückt das Komma immer nach links.', false]];
      return auswahl(Z(`Kreuze die Begründung an, warum 0,9 · ${n} kleiner als ${n} ist.`), opts.map(([x, r]) => opt(x, r, r ? undefined : x.includes('klein.') ? 'dezimal-stelle' : 'komma-falsche-richtung')), h1(`Vergleiche mit 1 · ${n}.`), { nachweis: [FREI('Faktor unter 1 begründen')] }); },
    () => { const a = dez(2, 1.01, 4.99), n = zz(3, 9), r = mal(a, String(n)), falsch = schiebe(r, -1), kn = kind();
      if (!ohneEndnull(a, String(n))) return null;
      return dezimal(Z(`${kn} rechnet: ${a} · ${n} = ${falsch}`, 'Das stimmt nicht.', 'Berechne das richtige Ergebnis.'), num(r), dfe(r, [[falsch, 'dezimal-stelle']]), h1('Prüfe mit einem Überschlag, wo das Komma stehen muss.'), { nachweis: [`${a} · ${n} = ${r}`, `${r} : 10 = ${falsch}`] }); },
    () => { const a = dez(1, 1.1, 9.9), n = zz(11, 19), o = mische([`${a} · ${n * 10}`, `${schiebe(a, 1)} · ${T(n, 2)}`, `${schiebe(a, -1)} · ${n * 10}`, `${a} · ${n}`]);
      return auswahl(Z('Rechne nicht genau.', 'Kreuze die Rechnung mit dem größten Ergebnis an.'), o.map((x) => opt(x, x === `${a} · ${n * 10}`, x === `${a} · ${n * 10}` ? undefined : 'dezimal-stelle')),
        h1('Überlege, um wie viele Stellen das Komma in jeder Rechnung rückt.'), { nachweis: [{ art: 'extrem', was: 'groesste' }] }); },
  ]);

  // ================= M2: Dezimalzahl mal Dezimalzahl =================
  sechs(M2, 'F', [
    () => { const a = zz(2, 9), b = zz(2, 9), l = T(a * b, 2);
      return dezimal(Z(`Das Hunderterfeld zeigt 0,${a} · 0,${b}.`, `Hell gefärbt sind ${a} Zehntel.`, `Davon sind ${b} Zehntel kräftig gefärbt.`, 'Gib das Ergebnis an.'), l, dfe(l, [[kommaWiePlus(`0,${a}`, `0,${b}`), 'mal-komma-wie-plus']]), tFfeld,
        { bild: feld(a, b), nachweis: [{ art: 'bild', bruch: `${a * b}⁄100` }, `0,${a} · 0,${b} = ${l}`] }); },
    () => { const a = dez(1, 1.1, 4.9), b = T(zz(2, 9), 1); if (!ohneEndnull(a, b)) return null;
      return rasterMalKomma(Z(`Berechne ${a} · ${b}.`, 'Rechne im Raster ohne Komma.', 'Setze dann das Komma im Ergebnis.'), a, b, tF2, { fehler: [[kommaWiePlus(a, b), 'mal-komma-wie-plus'], [P(mal(a, b))[0], 'dezimal-stelle']] }); },
    () => { const a = zz(2, 9), b = zz(2, 9), l = T(a * b, 2);
      return luecken(Z(`Das Hunderterfeld zeigt 0,${a} · 0,${b}.`, 'Zähle die kräftig gefärbten Felder.', `0,${a} · 0,${b} = {{z}} Hundertstel = {{d}}`), { z: [a * b, dfe(a * b, [[a + b, '1x1-addiert']])], d: [l, dfe(l, [[kommaWiePlus(`0,${a}`, `0,${b}`), 'mal-komma-wie-plus']])] }, tFfeld,
        { bild: feld(a, b), nachweis: [{ art: 'bild', bruch: `${a * b}⁄100` }, `0,${a} · 0,${b} = ${l}`] }); },
    () => { const a = T(zz(2, 9), 1), b = dez(1, 1.1, 2.9); if (!ohneEndnull(a, b)) return null;
      return rasterMalKomma(Z(`Berechne ${b} · ${a}.`, 'Rechne im Raster ohne Komma.', 'Setze dann das Komma im Ergebnis.'), b, a, tF2, { fehler: [[kommaWiePlus(a, b), 'mal-komma-wie-plus'], [P(mal(a, b))[0], 'dezimal-stelle']] }); },
    () => { const a = zz(2, 9), b = zz(2, 9), l = T(a * b, 2), o = mische([[l, true], [kommaWiePlus(`0,${a}`, `0,${b}`), false], [String(a * b), false]]);
      if (a * b < 10) return null;
      return auswahl(Z(`Das Hunderterfeld zeigt 0,${a} · 0,${b}.`, 'Kreuze das richtige Ergebnis an.'), o.map(([x, r]) => opt(x, r, r ? undefined : x.includes(',') ? 'mal-komma-wie-plus' : 'dezimal-stelle')), tFfeld,
        { bild: feld(a, b), nachweis: [{ art: 'bild', bruch: `${a * b}⁄100` }, `0,${a} · 0,${b} = ${l}`, WERT(l)] }); },
    () => { const p = euro(T(zz(11, 49) * 20, 2)), l = euro(mal(p, '0,5')), kn = kind();
      return dezimal(Z(`1 kg Tomaten kostet ${p} €.`, `${kn} kauft 0,5 kg.`, 'Gib den Preis an.'), l, dfe(l, [[kommaWiePlus(p, '0,5'), 'mal-komma-wie-plus'], [euro(schiebe(l, 1)), 'dezimal-stelle']]),
        h3('0,5 kg ist ein halbes Kilogramm.', 'Ein halbes Kilogramm kostet die Hälfte.', 'Teile den Preis durch 2.'), { einheit: '€', bild: geldBild(p), nachweis: ['0,5 kg : 1 kg = 0,5', `${p} € · 0,5 = ${l} €`] }); },
  ]);
  sechs(M2, 'G', [
    () => { const a = dez(1, 1.1, 9.9), b = dez(1, 1.1, 9.9); if (!ohneEndnull(a, b)) return null;
      return rasterMalKomma(Z(`Multipliziere ${a} · ${b} im Raster.`, 'Setze dann das Komma im Ergebnis.'), a, b, tG2, { fehler: [[kommaWiePlus(a, b), 'mal-komma-wie-plus'], [P(mal(a, b))[0], 'dezimal-stelle']] }); },
    () => { const a = dez(2, 0.11, 0.99), b = T(zz(2, 9), 1); if (!ohneEndnull(a, b)) return null;
      return rasterMalKomma(Z(`Multipliziere ${a} · ${b} im Raster.`, 'Setze dann das Komma im Ergebnis.'), a, b, tG2, { fehler: [[kommaWiePlus(a, b), 'mal-komma-wie-plus'], [schiebe(mal(a, b), 1), 'dezimal-stelle']] }); },
    () => { const a = dez(1, 2.1, 9.9), b = dez(1, 2.1, 9.9), l = mal(a, b), ga = grob(a), gb = grob(b), u = mal(ga, gb), o = mische([[l, true], [schiebe(l, -1), false], [schiebe(l, 1), false]]);
      return auswahl(Z(`Überschlage ${a} · ${b}.`, 'Kreuze das passende Ergebnis an.'), o.map(([x, r]) => opt(x, r, r ? undefined : 'mal-komma-wie-plus')),
        h3('Runde beide Faktoren auf Ganze.', '4,8 · 2,1 ist etwa 5 · 2 = 10.', 'Das Ergebnis muss in der Nähe von deinem Überschlag liegen.'), { nachweis: [H(ga, `${a} gerundet`), H(gb, `${b} gerundet`), `${ga} · ${gb} = ${u}`, `${a} · ${b} = ${l}`, WERT(l)] }); },
    () => { const p = euro(T(zz(11, 39) * 10, 2)), w = T(zz(11, 39), 1), l = euro(mal(p, w)), kn = kind();
      if (w.endsWith('0')) return null;
      return dezimal(Z(`1 kg Bananen kostet ${p} €.`, `${kn} kauft ${w} kg.`, 'Berechne den Preis.'), l, dfe(l, [[kommaWiePlus(p, w), 'mal-komma-wie-plus'], [euro(schiebe(l, 1)), 'dezimal-stelle']]), tG2,
        { einheit: '€', bild: geldBild(p), nachweis: [`${w} kg : 1 kg = ${w}`, `${p} € · ${w} = ${l} €`] }); },
    () => { const x = zz(12, 49), y = zz(11, 29), a = T(x, 1), b = T(y, 1), c = T(x, 2), l1 = mal(a, b), l2 = mal(c, b);
      if (x % 10 === 0 || y % 10 === 0 || (x * y) % 10 === 0) return null;
      return luecken(Z(`Ohne Komma gilt: ${x} · ${y} = ${x * y}`, `Berechne damit ${a} · ${b} = {{a}}`, `Berechne damit ${c} · ${b} = {{b}}`), { a: [l1, dfe(l1, [[kommaWiePlus(a, b), 'mal-komma-wie-plus']])], b: [l2, dfe(l2, [[kommaWiePlus(c, b), 'mal-komma-wie-plus'], [l1, 'dezimal-stelle']])] },
        tG2, { nachweis: [`${x} · ${y} = ${x * y}`, `${a} · ${b} = ${l1}`, `${c} · ${b} = ${l2}`] }); },
    () => { const x = zz(2, 4), y = zz(2, 4), a = T(x, 1), b = T(y, 1), r = mal(a, b), falsch = kommaWiePlus(a, b), kn = kind();
      return auswahl(Z(`${kn} rechnet: ${a} · ${b} = ${falsch}`, 'Beurteile die Rechnung.'), [opt(`Falsch. Zehntel mal Zehntel ergibt Hundertstel. Es gilt ${a} · ${b} = ${r}.`, true), opt('Stimmt.', false, 'mal-komma-wie-plus'), opt(`Stimmt, denn ${x} · ${y} = ${x * y}.`, false, 'mal-komma-wie-plus')],
        h3('Zähle die Stellen nach dem Komma in beiden Faktoren zusammen.', '0,4 · 0,2: zusammen zwei Stellen. Also 0,08.', 'So viele Stellen braucht das Ergebnis.'), { nachweis: [`${x} · ${y} = ${x * y}`, `${a} · ${b} = ${r}`, URTEIL(false, `${a} · ${b} = ${falsch}`)] }); },
  ]);
  sechs(M2, 'M', [
    () => { const a = dez(2, 1.01, 9.99), b = dez(1, 1.1, 9.9); if (b.includes('0') || stellen(mal(a, b)) > 3) return null;
      return mitUeberschlag(['Multipliziere schriftlich im Heft.', 'Mache zuerst einen Überschlag.'], a, b, tM2); },
    () => { const a = dez(1, 2.1, 19.9), b = dez(1, 1.1, 9.9); return mitUeberschlag(['Überschlage zuerst. Berechne dann genau.'], a, b, tM2); },
    () => { const p = euro(T(2 * zz(70, 95), 2)), n = zz(25, 45), w = `${n},5`, l = euro(mal(p, w)), kn = kind();
      return dezimal(Z(`Ein Liter Diesel kostet ${p} €.`, `Der Vater von ${kn} tankt ${w} Liter.`, 'Rechne im Heft den Preis aus.'), l, dfe(l, [[euro(schiebe(l, 1)), 'dezimal-stelle'], [euro(schiebe(l, -1)), 'dezimal-stelle']]), tM2,
        { einheit: '€', nachweis: [`${p} € · ${w} = ${l} €`] }); },
    () => { const a = T(zz(2, 9), 1), b = T(zz(2, 9), 2), l = mal(a, b);
      return dezimal(Z(`Berechne: ${a} · ${b}`), l, dfe(l, [[kommaWiePlus(a, b), 'mal-komma-wie-plus'], [schiebe(l, -1), 'dezimal-stelle']]), h2('Rechne ohne Komma.', 'Zähle dann die Nachkommastellen beider Faktoren zusammen.'), { nachweis: [`${a} · ${b} = ${l}`] }); },
    () => { const a = dez(1, 1.1, 4.9), b = dez(1, 1.1, 4.9), l = mal(a, b), o = [[`${schiebe(a, 1)} · ${schiebe(b, -1)}`, true], [`${schiebe(a, -1)} · ${schiebe(b, 1)}`, true], [`${schiebe(a, 1)} · ${b}`, false], [`${schiebe(a, -1)} · ${schiebe(b, -1)}`, false]];
      return auswahl(Z(`Kreuze alle Rechnungen an, die dasselbe Ergebnis haben wie ${a} · ${b}.`), mische(o).map(([x, r]) => opt(x, r, r ? undefined : 'mal-komma-wie-plus')),
        h2('Zähle in jeder Rechnung die Nachkommastellen beider Faktoren zusammen.', 'Gleiche Ziffern und gleich viele Nachkommastellen ergeben dasselbe Ergebnis.'), { mehrfach: true, nachweis: [`${a} · ${b} = ${l}`, WERT(l)] }); },
    () => { const a = dez(1, 2.1, 9.9), b = dez(1, 2.1, 9.9), r = mal(a, b), falsch = schiebe(r, 1), kn = kind(), ga = grob(a), gb = grob(b), u = mal(ga, gb);
      return auswahl(Z(`${kn} rechnet: ${a} · ${b} = ${falsch}`, 'Prüfe das Ergebnis mit einem Überschlag.'), [opt(`Falsch. Der Überschlag ist ${ga} · ${gb} = ${u}. Es gilt ${a} · ${b} = ${r}.`, true), opt('Stimmt.', false, 'mal-komma-wie-plus'), opt(`Falsch. Es gilt ${a} · ${b} = ${schiebe(r, -1)}.`, false, 'dezimal-stelle')],
        h2('Runde beide Faktoren auf Ganze.', 'Vergleiche den Überschlag mit dem Ergebnis.'), { nachweis: [H(ga, `${a} gerundet`), H(gb, `${b} gerundet`), `${ga} · ${gb} = ${u}`, `${a} · ${b} = ${r}`, URTEIL(false, `${a} · ${b} = ${falsch}`)] }); },
  ]);
  sechs(M2, 'E', [
    () => { const a = dez(1, 1.1, 9.9), b = T(zz(2, 9), 1), l = mal(a, b);
      return luecken(Z('Ergänze die fehlende Zahl.', `{{a}} · ${b} = ${l}`), { a: [a, dfe(a, kommaDaneben(a))] }, h1('Rechne rückwärts mit der Umkehraufgabe.'), { nachweis: [`${l} : ${b} = ${a}`] }); },
    () => { const a = dez(2, 0.11, 0.99), b = dez(2, 0.11, 0.99), l = mal(a, b); if (stellen(l) > 4) return null;
      return dezimal(Z(`Multipliziere schriftlich im Heft: ${a} · ${b}`), l, dfe(l, [[kommaWiePlus(a, b), 'mal-komma-wie-plus'], ...kommaDaneben(l)]), h1('Beide Faktoren sind kleiner als 1. Das Ergebnis ist kleiner als jeder Faktor.'), { nachweis: [`${a} · ${b} = ${l}`] }); },
    () => { const p = euro(T(4 * zz(150, 300), 2)), m = wahl(['0,75', '0,25', '1,25']), l = euro(mal(p, m)), kn = kind();
      return dezimal(Z(`1 m Stoff kostet ${p} €.`, `${kn} braucht ${m} m Stoff.`, 'Rechne im Heft.', 'Berechne den Preis.'), l, dfe(l, [[kommaWiePlus(p, m), 'mal-komma-wie-plus'], [euro(schiebe(l, 1)), 'dezimal-stelle']]), h1('Überlege zuerst: Ist der Preis höher oder niedriger als für einen Meter?'),
        { einheit: '€', nachweis: [`${m} m : 1 m = ${m}`, `${p} € · ${m} = ${l} €`] }); },
    () => { const x = zz(2, 3), a = T(x, 1), kn = kind(), opts = [['Das Komma wurde wie beim Addieren gesetzt. Das Ergebnis braucht so viele Nachkommastellen wie beide Faktoren zusammen.', true], ['Beim Einmaleins wurde falsch gerechnet.', false], ['Hier hätte man plus rechnen müssen.', false]];
      return auswahl(Z(`${kn} rechnet: ${a} · ${a} = ${kommaWiePlus(a, a)}`, 'Kreuze die Erklärung für den Fehler an.'), opts.map(([t, r]) => opt(t, r, r ? undefined : t.includes('Einmaleins') ? '1x1-nachbar' : '1x1-addiert')), h1(`Rechne selbst: ${a} · ${a} = ${mal(a, a)}.`), { nachweis: [FREI('Fehler beim Komma im Produkt erklären')] }); },
    () => { const a = dez(1, 1.1, 2.9), b = T(zz(2, 9), 1), r = mal(a, b), falsch = kommaWiePlus(a, b), kn = kind();
      if (falsch === r || !ohneEndnull(a, b)) return null;
      return dezimal(Z(`${kn} rechnet: ${a} · ${b} = ${falsch}`, 'Das stimmt nicht.', 'Berechne das richtige Ergebnis.'), r, dfe(r, [[falsch, 'mal-komma-wie-plus']]), h1('Zähle die Nachkommastellen beider Faktoren zusammen.'), { nachweis: [`${a} · ${b} = ${r}`, `${r} · 10 = ${falsch}`] }); },
    () => { const n = zz(6, 9), o = mische([`0,9 · ${n}`, `${n} · 1,2`, `0,99 · ${n}`, `1,01 · ${n}`]);
      return auswahl(Z('Rechne nicht genau.', `Kreuze alle Rechnungen an, deren Ergebnis kleiner als ${n} ist.`), o.map((x) => opt(x, x.startsWith('0,'), x.startsWith('0,') ? undefined : 'mal-macht-groesser')),
        h1(`Vergleiche jeden Faktor mit 1. Was ist 1 · ${n}?`), { mehrfach: true, nachweis: [{ art: 'schwelle', zeichen: '<', wert: String(n) }] }); },
  ]);
}
