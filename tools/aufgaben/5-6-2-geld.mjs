// Aufgaben zu 5.6.2 „Geld“ (Lernziele B1 und B2) nach ADR 0015 und ADR 0033.
// B1: Beträge schreiben und umwandeln. B2: mit Beträgen rechnen.
// F: gemischte Schreibweise (3 € 50 ct), gerechnet wird in Cent. Ab G steht der Betrag mit Komma und zwei Stellen (3,50 €).

import { fz, sechs, zahl, auswahl, opt, luecken, sach, teil, zuordnen, ordnen, groesse, einheitentafel, Z, B, G, BG, h1, h2, h3, zz, wahl, mische, fehlerliste, kind, HILFSGROESSE } from '../werkzeug.mjs';
import { eur, eurK, geldF, geldBild, tafelBild, tafelZeile, TAFELN, merktabelle, MERK, WAREN } from './5-6-groessen.mjs';

const S_ = (kurz) => `5.6.2-${kurz}`;
const ct = (n) => `${n} ct`;
const preisliste = (waren, schreibe) => ({ kopf: ['Ware', 'Preis'], zeilen: waren.map(([n, p]) => [n, schreibe(p)]) });
const dreiWaren = (min, max) => mische(WAREN.filter(([, p]) => p >= min && p <= max)).slice(0, 3);
const EINHEITEN_GELD = ['ct', '€', 'm', 'kg'];
const H_UM = h3('1 € sind 100 ct.', '2 € 30 ct sind 200 ct + 30 ct = 230 ct.', 'Rechne die Euro in Cent um. Zähle dann die Cent dazu.');

export function geld() {
  // =====================================================================
  // B1 Beträge schreiben und umwandeln
  // =====================================================================
  sechs(S_('B1'), 'F', [
    () => { const n = wahl([100, 200]) + wahl([50, 20, 10, 70, 60]);
      return zahl(Z('Schau auf das Geld.', 'Wie viel Cent sind das?'), n, fehlerliste(n, [[Math.floor(n / 100) + (n % 100), 'masszahlen-addiert'], [n % 100, 'umrechnungszahl']]), H_UM, { einheit: 'ct', bild: geldBild(n), nachweis: [BG(geldF(n)), G(`${geldF(n)} = ${ct(n)}`)] }); },
    () => { const n = wahl([500, 700, 1000, 1200, 1500]) + wahl([100, 200, 300]) + wahl([5, 15, 25, 35, 45, 55, 65, 75]);
      return luecken(Z('Schau auf das Geld.', 'Es sind {{a}} € {{b}} ct.'), { a: [Math.floor(n / 100), fehlerliste(Math.floor(n / 100), [[geldBild(n).stuecke.filter((x) => x >= 100).length, 'liste-verzaehlt']])], b: n % 100 },
        h3('Zähle zuerst die Scheine und die Euro-Münzen. Zähle dann die Cent.', 'Ein Schein mit 5 € und zwei Münzen mit 1 €: Das sind 7 €.', 'Die großen Stücke sind Euro. Die kleinen Münzen sind Cent.'), { bild: geldBild(n), nachweis: [BG(geldF(n))] }); },
    () => { const n = zz(1, 9) * 100 + zz(1, 19) * 5;
      return luecken(Z('Wandle um.', `${geldF(n)} = {{a}} ct`), { a: [n, fehlerliste(n, [[Math.floor(n / 100) + (n % 100), 'masszahlen-addiert'], [Math.floor(n / 100) * 10 + (n % 100), 'umrechnungszahl']])] }, H_UM, { bild: geldBild(n), nachweis: [G(`${geldF(n)} = ${ct(n)}`)] }); },
    () => { const n = zz(1, 9) * 100 + zz(2, 19) * 5;
      return luecken(Z('Die Tafel hilft dir.', `${ct(n)} = {{a}} € {{b}} ct`), { a: [Math.floor(n / 100), fehlerliste(Math.floor(n / 100), [[Math.floor(n / 10), 'umrechnungszahl']])], b: n % 100 },
        h3('100 ct sind 1 €.', '340 ct sind 3 € 40 ct.', 'Die Hunderter der Cent sind die Euro.'), { bild: tafelBild('€-ct', n), nachweis: [G(`${ct(n)} = ${geldF(n)}`)] }); },
    () => { const ziel = wahl([100, 200]), richtig = ziel === 100 ? wahl(['50 ct + 50 ct', '50 ct + 20 ct + 20 ct + 10 ct']) : wahl(['1 € + 1 €', '1 € + 50 ct + 50 ct']);
      const falsch = ziel === 100 ? ['50 ct + 20 ct + 20 ct', '20 ct + 20 ct + 20 ct + 20 ct', '50 ct + 10 ct + 10 ct'] : ['1 € + 50 ct + 20 ct', '50 ct + 50 ct + 50 ct', '1 € + 20 ct + 20 ct'];
      return auswahl(Z('Schau auf die Münze.', `Welche Münzen sind zusammen auch ${geldF(ziel)}?`), [opt(richtig, true), ...mische(falsch).slice(0, 2).map((f) => opt(f))],
        h3('Zähle die Münzen zusammen.', '50 ct + 50 ct = 100 ct. Das ist 1 €.', 'Rechne jede Antwort aus.'), { bild: B.geld([ziel]), nachweis: [{ art: 'gleichwert', groesse: geldF(ziel) }] }); },
    () => { const n = zz(1, 9) * 100 + zz(1, 9), z = tafelZeile('€-ct', n);
      return einheitentafel(Z(`Trage ${geldF(n)} in die Tafel ein.`, 'Lies dann in Cent ab.'), TAFELN['€-ct'].gruppen, TAFELN['€-ct'].kopf, [z.zeile], { ...z.werte, x: [n, fehlerliste(n, [[Math.floor(n / 100) * 10 + (n % 100), 'null-platzhalter']])] },
        h3('Jede Spalte bekommt genau eine Ziffer. Leere Stellen in der Mitte bekommen eine 0.', '2 € 5 ct: Bei den Euro steht 2. Bei den Cent stehen 0 und 5.', 'Die Cent haben zwei Spalten. Bei weniger als 10 ct steht vorn eine 0.'),
        { nachweis: [{ art: 'einheitentafel', zeile: 0, groesse: geldF(n) }] }, { text: 'Das sind', luecke: 'x', einheit: 'ct' }); },
  ]);
  sechs(S_('B1'), 'G', [
    () => { const n = zz(1, 19) * 100 + zz(1, 9);
      return groesse(Z('Schreibe den Betrag mit Komma.', geldF(n)), 'geld', n, '€', [[Math.floor(n / 100) * 100 + (n % 100) * 10, 'komma-falsch-gelesen']],
        h3('Vor dem Komma stehen die Euro. Nach dem Komma stehen die Cent, immer mit zwei Ziffern.', '4 € 5 ct schreibst du 4,05 €.', 'Bei weniger als 10 ct steht nach dem Komma zuerst eine 0.'), { bild: geldBild(n), nachweis: [G(`${geldF(n)} = ${eurK(n)}`)] }); },
    () => { const n = zz(1, 19) * 100 + zz(1, 19) * 5;
      return luecken(Z('Wandle um.', `${eurK(n)} = {{a}} € {{b}} ct`), { a: Math.floor(n / 100), b: [n % 100, fehlerliste(n % 100, [[(n % 100) / 10, 'komma-falsch-gelesen']])] },
        h3('Vor dem Komma stehen die Euro. Nach dem Komma stehen die Cent.', '3,50 € = 3 € 50 ct', 'Lies die zwei Ziffern nach dem Komma als Cent.'), { bild: tafelBild('€-ct', n), nachweis: [G(`${eurK(n)} = ${geldF(n)}`)] }); },
    () => { const e = zz(2, 9), paare = [[eurK(e * 100 + 5), geldF(e * 100 + 5)], [eurK(e * 100 + 50), geldF(e * 100 + 50)], [eurK(e * 10 + 5), ct(e * 10 + 5)]];
      return zuordnen('Was ist gleich viel?', paare, h3('Lies die zwei Ziffern nach dem Komma als Cent.', '2,05 € sind 2 € 5 ct. Aber 2,50 € sind 2 € 50 ct.', 'Achte auf die 0 nach dem Komma.'), { nachweis: paare.map(([l, r]) => G(`${l} = ${r}`)) }); },
    () => { const n = zz(11, 99) * 5 + 100;
      return groesse(Z('Schreibe in Euro.', ct(n)), 'geld', n, '€', [[n * 100, 'umrechnungsrichtung'], [n * 10, 'umrechnungszahl']],
        h3('100 ct sind 1 €. Das Komma trennt Euro und Cent.', '275 ct = 2,75 €', 'Die letzten zwei Ziffern sind die Cent.'), { bild: geldBild(n), nachweis: [G(`${ct(n)} = ${eurK(n)}`)] }); },
    () => { const e = zz(1, 8), werte = [e * 100 - 5, e * 100 + 5, e * 100 + 50, e * 100 + 95].map((n) => [n, wahl([eurK(n), n % 100 && n > 100 ? geldF(n) : ct(n)])]);
      return ordnen(Z('Ordne die Beträge.', 'Beginne mit dem kleinsten Betrag.'), werte.map(([, t]) => t), h3('Wandle alle Beträge in Cent um. Vergleiche dann.', '1,05 € sind 105 ct. 95 ct sind weniger.', 'Schreibe zu jedem Betrag die Cent auf.'), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], links: 'wenig', rechts: 'viel' }); },
    () => { const e = zz(2, 9), c = zz(1, 9), n = e * 100 + c, k = kind(), stimmt = wahl([true, false, false]), rechts = stimmt ? n : e * 100 + c * 10;
      return auswahl(Z(`${k} sagt: ${eurK(n)} = ${geldF(rechts)}.`, 'Stimmt das?'), [opt('Stimmt.', stimmt), opt(`Falsch. ${eurK(n)} sind ${geldF(stimmt ? e * 100 + c * 10 : n)}.`, !stimmt, stimmt ? 'komma-falsch-gelesen' : undefined), opt(`Falsch. ${eurK(n)} sind ${geldF(e * 1000 + c)}.`, false, 'komma-falsch-gelesen')],
        h3('Lies die zwei Ziffern nach dem Komma als Cent.', '2,05 € sind 2 € 5 ct.', 'Die 0 nach dem Komma gehört zu den Cent.'), { nachweis: [{ art: 'urteil', stimmt, behauptung: `${eurK(n)} = ${geldF(rechts)}` }, G(`${eurK(n)} = ${geldF(n)}`), HILFSGROESSE(geldF(e * 100 + c * 10), 'falsche Lesart'), HILFSGROESSE(geldF(e * 1000 + c), 'falsche Lesart')] }); },
  ]);
  sechs(S_('B1'), 'M', [
    () => { const n = zz(10, 99) * 100 + zz(1, 9);
      return groesse(Z('Schreibe als einen Betrag.', geldF(n)), 'geld', n, '€', [[Math.floor(n / 100) * 100 + (n % 100) * 10, 'komma-falsch-gelesen']], h2('Mit Komma: Nach dem Komma stehen immer zwei Ziffern.', 'Bei weniger als 10 ct steht nach dem Komma zuerst eine 0.'), { einheiten: EINHEITEN_GELD, nachweis: [G(`${geldF(n)} = ${eurK(n)}`)] }); },
    () => { const n = zz(1, 9);
      return luecken(Z('Wandle um.', `${eurK(n)} = {{a}} ct`, `${eurK(n * 10)} = {{b}} ct`, `${eurK(n * 100 + n)} = {{c}} ct`), { a: [n, fehlerliste(n, [[n * 10, 'komma-falsch-gelesen']])], b: [n * 10, fehlerliste(n * 10, [[n, 'komma-falsch-gelesen']])], c: n * 100 + n },
        h2('Nach dem Komma stehen die Cent mit zwei Ziffern.', '0,07 € sind 7 ct, aber 0,70 € sind 70 ct.'), { nachweis: [G(`${eurK(n)} = ${ct(n)}`), G(`${eurK(n * 10)} = ${ct(n * 10)}`), G(`${eurK(n * 100 + n)} = ${ct(n * 100 + n)}`)] }); },
    () => { const e = zz(2, 9), c = zz(1, 9), n = e * 100 + c;
      return auswahl(Z(`Welche Beträge sind gleich ${eurK(n)}?`, 'Kreuze alle an.'), [opt(ct(n), true), opt(geldF(n), true), opt(geldF(e * 100 + c * 10), false, 'komma-falsch-gelesen'), opt(ct(e * 10 + c), false, 'umrechnungszahl'), opt(geldF(e * 1000 + c), false, 'komma-falsch-gelesen')],
        h2('Wandle jeden Betrag in Cent um.', `${eurK(n)} sind ${ct(n)}.`), { mehrfach: true, nachweis: [{ art: 'gleichwert', groesse: eurK(n) }] }); },
    () => { const n = zz(101, 999) * 10 + zz(1, 9);
      return groesse(Z('Schreibe in Euro.', `${n} ct`), 'geld', n, '€', [[n * 100, 'umrechnungsrichtung'], [n * 10, 'umrechnungszahl']], h2('100 ct sind 1 €.', 'Die letzten zwei Ziffern sind die Cent.'), { einheiten: EINHEITEN_GELD, nachweis: [G(`${n} ct = ${eurK(n)}`)] }); },
    () => { const e = zz(1, 8), werte = mische([e * 100 - 1, e * 100 + 1, e * 100 + 10, e * 100 + 9, e * 10 + 9]).map((n, i) => [n, i % 2 ? eur(n) : n >= 100 ? wahl([geldF(n), ct(n)]) : eurK(n)]);
      return ordnen(Z('Ordne die Beträge.', 'Beginne mit dem größten Betrag.'), werte.sort((x, y) => y[0] - x[0]).map(([, t]) => t), h2('Wandle alle Beträge in Cent um.', 'Schreibe zu jedem Betrag die Cent auf und vergleiche.'), { nachweis: [{ art: 'ordnung', richtung: 'ab' }], links: 'viel', rechts: 'wenig' }); },
    () => { const m = wahl([5, 10, 20, 50]), anzahl = zz(4, 9) * (m === 50 ? 1 : 2) + (m === 50 ? 0 : 1) * 0, n = anzahl * m;
      return zahl(`Wie viele Münzen zu ${m} ct ergeben zusammen ${eur(n)}?`, anzahl, fehlerliste(anzahl, [[anzahl * 10, 'umrechnungszahl'], [n / 100, 'einheit-fehlt']]), h2('Wandle zuerst in Cent um.', `${eur(n)} sind ${ct(n)}. Wie oft passt ${m} ct hinein?`), { einheit: 'Münzen', nachweis: [G(`${eur(n)} : ${m} ct = ${anzahl}`)] }); },
  ]);
  sechs(S_('B1'), 'E', [
    () => { const e = zz(2, 9), c = zz(1, 9), falsch = wahl([`${eurK(e * 100 + c)} = ${ct(e * 100 + c * 10)}`, `${ct(e * 100 + c * 10)} = ${eurK(e * 1000 + c * 100)}`, `${eurK(c)} = ${ct(c * 10)}`]);
      return auswahl('Welche Umwandlung ist falsch?', [opt(falsch, true), opt(`${eurK(e * 100 + c * 10)} = ${ct(e * 100 + c * 10)}`), opt(`${ct(e * 1000 + c)} = ${eurK(e * 1000 + c)}`), opt(`${eurK(e * 10)} = ${ct(e * 10)}`), opt(`${geldF(e * 100 + c)} = ${eurK(e * 100 + c)}`)],
        h1('Rechne jede Umwandlung nach. Achte auf die zwei Ziffern nach dem Komma.'), { nachweis: [{ art: 'gleichungswahl', falsche: true }] }); },
    () => { const n = zz(101, 999) * 100 + zz(1, 9) * wahl([1, 10]);
      return groesse(Z('Schreibe in Euro.', `${fz(n)} ct`), 'geld', n, '€', [[n * 10, 'umrechnungszahl'], [Math.floor(n / 1000) * 100, 'umrechnungszahl']], h1('100 ct sind 1 €. Die letzten zwei Ziffern sind die Cent.'), { einheiten: EINHEITEN_GELD, nachweis: [G(`${fz(n)} ct = ${eurK(n)}`)] }); },
    () => { const e = zz(1, 8), werte = mische([e * 100 - 1, e * 100 + 1, e * 100 + 10, e * 100 + 9, e * 10 + 9, e * 1000 + 1]).map((n, i) => [n, i % 3 === 0 ? eur(n) : i % 3 === 1 ? ct(n) : n >= 100 ? geldF(n) : eurK(n)]);
      return ordnen(Z('Ordne die Beträge.', 'Beginne mit dem kleinsten Betrag.'), werte.sort((x, y) => x[0] - y[0]).map(([, t]) => t), h1('Wandle alle Beträge in Cent um.'), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], links: 'wenig', rechts: 'viel' }); },
    () => { const e = zz(11, 49), c = zz(1, 9), n = e * 100 + c, k = kind(), stimmt = wahl([true, false, false]), rechts = stimmt ? n : e * 100 + c * 10;
      return auswahl(Z(`${k} behauptet: ${ct(rechts)} = ${eurK(n)}.`, 'Stimmt das?'), [opt('Stimmt, denn die letzten zwei Ziffern sind die Cent.', stimmt), opt(`Falsch, denn ${eurK(n)} sind ${ct(stimmt ? e * 100 + c * 10 : n)}.`, !stimmt, stimmt ? 'komma-falsch-gelesen' : undefined), opt(`Falsch, denn ${eurK(n)} sind ${ct(e * 10 + c)}.`, false, 'umrechnungszahl'), opt('Stimmt, denn nach dem Komma darf man eine 0 weglassen.', false, 'komma-falsch-gelesen')],
        h1('Wandle den Betrag mit Komma in Cent um und vergleiche.'), { nachweis: [{ art: 'urteil', stimmt, behauptung: `${ct(rechts)} = ${eurK(n)}` }, G(`${eurK(n)} = ${ct(n)}`), HILFSGROESSE(ct(e * 100 + c * 10), 'falsche Lesart'), HILFSGROESSE(ct(e * 10 + c), 'falsche Lesart')] }); },
    () => { const m = wahl([2, 5]), anzahl = zz(3, 9) * 50, n = anzahl * m;
      return groesse(`In einer Spardose liegen ${anzahl} Münzen zu ${m} ct. Wie viel Geld ist das?`, 'geld', n, '€', [[n * 100, 'umrechnungsrichtung'], [n * 10, 'umrechnungszahl']], h1('Rechne zuerst in Cent. Wandle dann in Euro um.'), { einheiten: EINHEITEN_GELD, nachweis: [G(`${anzahl} · ${m} ct = ${ct(n)} = ${eur(n)}`)] }); },
    () => { const m = wahl([5, 20]), n = zz(21, 79) * 20 + (m === 5 ? wahl([5, 15]) : 0), anzahl = n / m;
      return zahl(`Wie viele Münzen zu ${m} ct braucht man für ${eurK(n)}?`, anzahl, fehlerliste(anzahl, [[anzahl * 10, 'umrechnungszahl'], [Math.floor(n / 100), 'einheit-fehlt']]), h1('Wandle zuerst in Cent um. Teile dann.'), { einheit: 'Münzen', nachweis: [G(`${eurK(n)} : ${m} ct = ${anzahl}`)] }); },
  ]);

  // =====================================================================
  // B2 Mit Geldbeträgen rechnen
  // =====================================================================
  const H_PLUS = h3('Rechne alles in Cent um. Rechne dann wie immer.', '1 € 20 ct + 50 ct sind 120 ct + 50 ct = 170 ct.', 'Wandle zuerst die Euro in Cent um.');
  sechs(S_('B2'), 'F', [
    () => { const n = wahl([100, 200]) + wahl([10, 20, 30]), dazu = wahl([20, 50, 60]), k = kind();
      return zahl(Z(`${k} hat dieses Geld.`, `${k} bekommt ${ct(dazu)} dazu.`, 'Wie viel Cent sind es jetzt?'), n + dazu, fehlerliste(n + dazu, [[Math.floor(n / 100) + (n % 100) + dazu, 'masszahlen-addiert'], [n, 'sach-schritt-vergessen']]), H_PLUS, { einheit: 'ct', bild: geldBild(n), nachweis: [BG(geldF(n)), G(`${geldF(n)} + ${ct(dazu)} = ${ct(n + dazu)}`)] }); },
    () => { const w = dreiWaren(40, 190), [a, b] = w, sum = a[1] + b[1], k = kind();
      if (sum % 100 === 0) return null;
      return luecken(Z('Schau in die Preisliste.', `${k} kauft: ${a[0]} und ${b[0]}.`, 'Das kostet zusammen {{a}} € {{b}} ct.'), { a: Math.floor(sum / 100), b: [sum % 100, fehlerliste(sum % 100, [[(a[1] % 100) + (b[1] % 100), 'add-uebertrag-vergessen']])] },
        h3('Rechne beide Preise in Cent um. Zähle sie zusammen.', '80 ct + 1 € 50 ct sind 80 ct + 150 ct = 230 ct. Das sind 2 € 30 ct.', '100 ct sind 1 €.'), { daten: preisliste(w, geldF), nachweis: [G(`${geldF(a[1])} + ${geldF(b[1])} = ${geldF(sum)}`)] }); },
    () => { const [name, p] = wahl(WAREN.filter(([, x]) => x < 100)), n = zz(2, 5), k = kind();
      return zahl(Z(`Das Bild zeigt den Preis für 1 ${name}.`, `${k} kauft ${n} Stück.`, 'Wie viel Cent kostet das?'), n * p, fehlerliste(n * p, [[n + p, '1x1-addiert'], [p, 'sach-schritt-vergessen']]),
        h3('Rechne mal.', '3 Stück zu je 40 ct kosten 3 · 40 ct = 120 ct.', `Rechne ${n} mal ${p} ct.`), { einheit: 'ct', bild: geldBild(p), nachweis: [BG(ct(p)), G(`${n} · ${ct(p)} = ${ct(n * p)}`)] }); },
    () => { const gegeben = wahl([200, 500]), p = gegeben === 200 ? wahl([120, 150, 170, 80]) : wahl([320, 350, 280, 410]), k = kind();
      return zahl(Z(`${k} zahlt mit diesem Geld.`, `Der Einkauf kostet ${geldF(p)}.`, `Wie viel Cent bekommt ${k} zurück?`), gegeben - p, fehlerliste(gegeben - p, [[p, 'rueckgeld-preis'], [gegeben + p, 'rueckgeld-preis']]),
        h3('Rechne beide Beträge in Cent um. Ziehe dann ab.', '2 € − 1 € 50 ct sind 200 ct − 150 ct = 50 ct.', 'Du gibst mehr Geld, als es kostet. Den Rest bekommst du zurück.'), { einheit: 'ct', bild: B.geld([gegeben]), nachweis: [BG(geldF(gegeben)), G(`${geldF(gegeben)} − ${geldF(p)} = ${ct(gegeben - p)}`)] }); },
    () => { const w = dreiWaren(40, 190), [a, b] = w, sum = a[1] + b[1], k = kind();
      return sach(Z('Schau in die Preisliste.', `${k} kauft: ${a[0]} und ${b[0]}.`, `${k} zahlt mit 5 €.`), [teil('Wie viel Cent kostet der Einkauf?', sum, 'ct', fehlerliste(sum, [[a[1], 'sach-schritt-vergessen']])), teil(`Wie viel Cent bekommt ${k} zurück?`, 500 - sum, 'ct', fehlerliste(500 - sum, [[sum, 'rueckgeld-preis'], [500 + sum, 'rueckgeld-preis']]))],
        h3('Rechne zuerst den Preis aus. Ziehe ihn dann von 500 ct ab.', 'Der Einkauf kostet 230 ct. Zurück gibt es 500 ct − 230 ct = 270 ct.', '5 € sind 500 ct.'), { daten: preisliste(w, geldF), nachweis: [G(`${geldF(a[1])} + ${geldF(b[1])} = ${ct(sum)}`, 1), G(`5 € − ${ct(sum)} = ${ct(500 - sum)}`, 2)] }); },
    () => { const p = wahl([300, 400, 500]), hat = p - wahl([50, 70, 120, 150]), k = kind();
      return zahl(Z(`${k} hat dieses Geld.`, `Ein Buch kostet ${geldF(p)}.`, 'Wie viel Cent fehlen noch?'), p - hat, fehlerliste(p - hat, [[hat, 'rueckgeld-preis'], [p + hat, 'sub-addiert']]),
        h3('Rechne beide Beträge in Cent um. Ziehe dann ab.', '3 € − 2 € 50 ct sind 300 ct − 250 ct = 50 ct.', 'Gesucht ist der Unterschied.'), { einheit: 'ct', bild: geldBild(hat), nachweis: [BG(geldF(hat)), G(`${geldF(p)} − ${geldF(hat)} = ${ct(p - hat)}`)] }); },
  ]);
  const H_KOMMA = h3('Schreibe die Beträge untereinander: Komma unter Komma.', '2,80 € + 1,50 € sind 280 ct + 150 ct = 430 ct. Das sind 4,30 €.', 'Du kannst auch alles in Cent umrechnen.');
  sechs(S_('B2'), 'G', [
    () => { const w = dreiWaren(60, 320), [a, b] = w, sum = a[1] + b[1], k = kind();
      return groesse(Z('Schau in die Preisliste.', `${k} kauft: ${a[0]} und ${b[0]}.`, 'Wie viel kostet das zusammen?'), 'geld', sum, '€', [[Math.floor(a[1] / 100) * 100 + Math.floor(b[1] / 100) * 100 + ((a[1] + b[1]) % 100), 'add-uebertrag-vergessen'], [a[1], 'sach-schritt-vergessen']], H_KOMMA, { daten: preisliste(w, eurK), nachweis: [G(`${eurK(a[1])} + ${eurK(b[1])} = ${eurK(sum)}`)] }); },
    () => { const w = dreiWaren(60, 320), [a] = w, gegeben = a[1] > 180 ? 500 : wahl([200, 500]), k = kind();
      if (gegeben <= a[1]) return null;
      return groesse(Z('Schau in die Preisliste.', `${k} kauft: ${a[0]}.`, `${k} zahlt mit ${eur(gegeben)}.`, 'Wie viel Rückgeld gibt es?'), 'geld', gegeben - a[1], '€', [[a[1], 'rueckgeld-preis'], [gegeben + a[1], 'rueckgeld-preis']],
        h3('Rückgeld: gegebener Betrag minus Preis.', '5 € − 3,20 € sind 500 ct − 320 ct = 180 ct. Das sind 1,80 €.', 'Rechne in Cent. Schreibe das Ergebnis dann mit Komma.'), { daten: preisliste(w, eurK), nachweis: [G(`${eur(gegeben)} − ${eurK(a[1])} = ${eurK(gegeben - a[1])}`)] }); },
    () => { const w = dreiWaren(60, 290), [a, b] = w, n = zz(2, 4), sum = n * a[1] + b[1], k = kind();
      return sach(Z('Schau in die Preisliste.', `${k} kauft ${n}-mal ${a[0]} und dazu ${b[0]}.`), [teil(`Wie viel Cent kostet ${n}-mal ${a[0]}?`, n * a[1], 'ct', fehlerliste(n * a[1], [[a[1], 'sach-schritt-vergessen'], [n + a[1], '1x1-addiert']])), teil('Wie viel Cent kostet alles zusammen?', sum, 'ct', fehlerliste(sum, [[a[1] + b[1], 'sach-schritt-vergessen'], [n * a[1], 'sach-schritt-vergessen']]))],
        h3('Rechne in zwei Schritten: erst mal, dann plus.', '3 · 80 ct = 240 ct. Dann 240 ct + 120 ct = 360 ct.', 'Wandle die Preise zuerst in Cent um.'), { daten: preisliste(w, eurK), nachweis: [G(`${n} · ${eurK(a[1])} = ${ct(n * a[1])}`, 1), G(`${ct(n * a[1])} + ${eurK(b[1])} = ${ct(sum)}`, 2)] }); },
    () => { const p = wahl([150, 250, 350, 125, 175]), n = wahl(p % 50 ? [4, 8] : [2, 4, 6]), k = kind();
      return zahl(Z(`Eine Kugel Eis kostet ${eurK(p)}.`, `${k} kauft ${n} Kugeln.`, 'Wie viel Euro kostet das?'), (n * p) / 100, fehlerliste((n * p) / 100, [[n * Math.floor(p / 100), 'komma-falsch-gelesen'], [n * p, 'einheit-fehlt']]),
        h3('Rechne in Cent. Wandle am Ende in Euro um.', '4 · 1,50 € sind 4 · 150 ct = 600 ct. Das sind 6 €.', `Rechne ${n} mal ${p} ct.`), { einheit: '€', nachweis: [G(`${n} · ${eurK(p)} = ${eur(n * p)}`)] }); },
    () => { const p = wahl([70, 80, 90, 110, 120, 130]), n = zz(3, 6);
      return groesse(Z(`${n} Hefte kosten zusammen ${eurK(n * p)}.`, 'Wie viel kostet 1 Heft?'), 'geld', p, '€', [[n * p, 'sach-schritt-vergessen'], [n * n * p, 'div-falsche-rechenart']],
        h3('Teile den Preis durch die Anzahl.', '3 Hefte kosten 2,70 €. Ein Heft kostet 270 ct : 3 = 90 ct.', 'Rechne in Cent. Schreibe das Ergebnis dann mit Komma.'), { nachweis: [G(`${eurK(n * p)} : ${n} = ${eurK(p)}`)] }); },
    () => { const w = dreiWaren(60, 190), [a, b] = w, sum = 2 * a[1] + b[1], stimmt = wahl([true, false, false]), behauptet = stimmt ? sum : a[1] + b[1], k = kind();
      return auswahl(Z('Schau in die Preisliste.', `${k} kauft 2-mal ${a[0]} und dazu ${b[0]}.`, `${k} rechnet: Das kostet zusammen ${eurK(behauptet)}.`, 'Stimmt das?'), [opt('Stimmt.', stimmt), opt(`Falsch. Es kostet ${eurK(stimmt ? a[1] + b[1] : sum)}.`, !stimmt, stimmt ? 'sach-schritt-vergessen' : undefined), opt(`Falsch. Es kostet ${eurK(sum + a[1])}.`, false)],
        h3('Rechne selbst nach. Vergleiche dann.', '2 · 0,80 € = 1,60 €. Dann 1,60 € + 1,20 € = 2,80 €.', 'Die erste Ware wird 2-mal gekauft.'), { daten: preisliste(w, eurK), nachweis: [G(`2 · ${eurK(a[1])} = ${eurK(2 * a[1])}`), G(`${eurK(2 * a[1])} + ${eurK(b[1])} = ${eurK(sum)}`), { art: 'urteil', stimmt, behauptet: eurK(behauptet) }, HILFSGROESSE(eurK(a[1] + b[1]), 'Rechnung ohne das zweite Stück'), HILFSGROESSE(eurK(sum + a[1]), 'falsche Antwort')] }); },
  ]);
  sechs(S_('B2'), 'M', [
    () => { const w = dreiWaren(60, 320), sum = w[0][1] + w[1][1] + w[2][1], k = kind();
      return groesse(Z(`${k} kauft ${w[0][0]} für ${eurK(w[0][1])}, ${w[1][0]} für ${eurK(w[1][1])} und ${w[2][0]} für ${eurK(w[2][1])}.`, 'Wie viel kostet das zusammen?'), 'geld', sum, '€', [[w[0][1] + w[1][1], 'sach-schritt-vergessen']], h2('Schreibe die Beträge untereinander: Komma unter Komma.', 'Du kannst auch alles in Cent umrechnen.'), { einheiten: EINHEITEN_GELD, nachweis: [G(`${eurK(w[0][1])} + ${eurK(w[1][1])} + ${eurK(w[2][1])} = ${eurK(sum)}`)] }); },
    () => { const w = dreiWaren(120, 320), sum = w[0][1] + w[1][1], k = kind();
      return groesse(Z(`${k} kauft ${w[0][0]} für ${eurK(w[0][1])} und ${w[1][0]} für ${eurK(w[1][1])}.`, `${k} zahlt mit 20 €.`, 'Wie viel Rückgeld gibt es?'), 'geld', 2000 - sum, '€', [[sum, 'sach-frage-verfehlt'], [2000 - w[0][1], 'sach-schritt-vergessen']], h2('Rechne zuerst den Preis aus. Ziehe ihn dann von 20 € ab.', 'Rückgeld ist der gegebene Betrag minus der Preis.'), { einheiten: EINHEITEN_GELD, nachweis: [G(`${eurK(w[0][1])} + ${eurK(w[1][1])} = ${eurK(sum)}`), G(`20 € − ${eurK(sum)} = ${eurK(2000 - sum)}`)] }); },
    () => { const p = wahl([85, 95, 115, 125, 145]), n = zz(4, 9);
      return groesse(Z(`${n} Brezeln kosten zusammen ${eurK(n * p)}.`, 'Wie viel kostet eine Brezel?'), 'geld', p, '€', [[n * p, 'sach-schritt-vergessen'], [p * 10, 'komma-falsch-gelesen']], h2('Teile den Preis durch die Anzahl.', 'Rechne in Cent und schreibe das Ergebnis mit Komma.'), { einheiten: EINHEITEN_GELD, nachweis: [G(`${eurK(n * p)} : ${n} = ${eurK(p)}`)] }); },
    () => { const p = wahl([90, 120, 150, 180, 240]), n = zz(4, 9), k = kind();
      return zahl(Z(`${k} hat ${eurK(n * p)}.`, `Ein Heft kostet ${eurK(p)}.`, `Wie viele Hefte kann ${k} kaufen?`), n, fehlerliste(n, [[n * 10, 'umrechnungszahl'], [n + 1, 'div-einmaleins']]), h2('Wie oft passt der Preis in den Betrag?', 'Rechne beide Beträge in Cent um und teile.'), { einheit: 'Hefte', nachweis: [G(`${eurK(n * p)} : ${eurK(p)} = ${n}`)] }); },
    () => { const preise = [zz(2, 4) * 100 - 5, zz(1, 3) * 100 + 10, zz(2, 5) * 100 - 11], rund = preise.map((p) => Math.round(p / 100) * 100), sum = rund[0] + rund[1] + rund[2];
      return auswahl(Z(`Ein Einkauf: ${eurK(preise[0])}, ${eurK(preise[1])} und ${eurK(preise[2])}.`, 'Überschlage: Wie viel kostet das ungefähr?'), [opt(`ungefähr ${eur(sum)}`, true), opt(`ungefähr ${eur(sum + 300)}`), opt(`ungefähr ${eur(sum - 200)}`), opt(`ungefähr ${eur(sum * 10)}`, false, 'komma-falsch-gelesen')],
        h2('Runde jeden Preis auf volle Euro.', '3,95 € sind ungefähr 4 €.'), { nachweis: [...preise.map((p, i) => G(`${eurK(p)} ≈ ${eur(rund[i])}`)), G(`${eur(rund[0])} + ${eur(rund[1])} + ${eur(rund[2])} = ${eur(sum)}`)] }); },
    () => { const p = wahl([190, 210, 230, 170]), q = wahl([130, 250, 310]), n = zz(3, 5), sum = n * p + q, k = kind();
      return groesse(Z(`${k} hat 20 €.`, `${k} kauft ${n} Hefte zu je ${eurK(p)} und ein Lineal für ${eurK(q)}.`, 'Wie viel Geld bleibt übrig?'), 'geld', 2000 - sum, '€', [[sum, 'sach-frage-verfehlt'], [2000 - p - q, 'sach-schritt-vergessen'], [2000 - n * p, 'sach-schritt-vergessen']], h2('Rechne in drei Schritten: mal, plus, minus.', `Was kosten die ${n} Hefte? Was kostet alles? Was bleibt von 20 €?`), { einheiten: EINHEITEN_GELD, nachweis: [G(`${n} · ${eurK(p)} = ${eurK(n * p)}`), G(`${eurK(n * p)} + ${eurK(q)} = ${eurK(sum)}`), G(`20 € − ${eurK(sum)} = ${eurK(2000 - sum)}`)] }); },
  ]);
  sechs(S_('B2'), 'E', [
    () => { const a = zz(11, 19) * 5, b = zz(11, 19) * 5, c = zz(21, 59) * 5, sum = a + b + c;
      return groesse(`Rechne: ${eurK(a)} + ${ct(b)} + ${eurK(c)}`, 'geld', sum, '€', [[a + b * 100 + c, 'masszahlen-addiert']], h1('Wandle zuerst alles in dieselbe Einheit um.'), { einheiten: EINHEITEN_GELD, nachweis: [G(`${eurK(a)} + ${ct(b)} + ${eurK(c)} = ${eurK(sum)}`)] }); },
    () => { const p = wahl([245, 365, 185, 425]), n = zz(3, 6), sum = n * p, gegeben = sum > 2000 ? 5000 : 2000, k = kind();
      return groesse(`${k} kauft ${n} Packungen Stifte zu je ${eurK(p)} und zahlt mit ${eur(gegeben)}. Wie viel Rückgeld gibt es?`, 'geld', gegeben - sum, '€', [[sum, 'sach-frage-verfehlt'], [gegeben - p, 'sach-schritt-vergessen']], h1('Rechne zuerst den Preis aus, dann das Rückgeld.'), { einheiten: EINHEITEN_GELD, nachweis: [G(`${n} · ${eurK(p)} = ${eurK(sum)}`), G(`${eur(gegeben)} − ${eurK(sum)} = ${eurK(gegeben - sum)}`)] }); },
    () => { const karte = wahl([650, 750, 850, 950]), getraenk = 250, n = 4, sum = n * karte + 2 * getraenk;
      return groesse(`${n} Kinokarten und 2 Getränke zu je ${eurK(getraenk)} kosten zusammen ${eur(sum)}. Wie viel kostet eine Kinokarte?`, 'geld', karte, '€', [[sum / n, 'sach-schritt-vergessen'], [(sum - getraenk) / 2, 'sach-falsche-rechnung']].filter(([w]) => Number.isInteger(w)), h1('Ziehe zuerst die Getränke ab. Teile dann durch die Anzahl der Karten.'), { einheiten: EINHEITEN_GELD, nachweis: [G(`2 · ${eurK(getraenk)} = ${eur(2 * getraenk)}`), G(`${eur(sum)} − ${eur(2 * getraenk)} = ${eur(sum - 2 * getraenk)}`), G(`${eur(sum - 2 * getraenk)} : ${n} = ${eur(karte)}`)] }); },
    () => { const a = zz(2, 6) * 100 + 50, b = wahl([60, 80, 90]), falsch = b * 100 + a, k = kind();
      return auswahl(`${k} rechnet: ${eurK(a)} + ${ct(b)} = ${eurK(falsch)}. Welcher Fehler steckt in der Rechnung?`, [opt(`Euro und Cent wurden zusammengezählt, ohne umzuwandeln. Richtig sind ${eurK(a + b)}.`, true), opt(`Der Übertrag wurde vergessen. Richtig sind ${eurK(a + b - 100)}.`, false, 'add-uebertrag-vergessen'), opt(`Es wurde abgezogen statt zusammengezählt. Richtig sind ${eurK(a + b + 100)}.`, false), opt('Die Rechnung enthält keinen Fehler.', false, 'masszahlen-addiert')],
        h1('Wandle beide Beträge in Cent um und rechne nach.'), { nachweis: [G(`${eurK(a)} + ${ct(b)} = ${eurK(a + b)}`), HILFSGROESSE(eurK(falsch), 'falsches Ergebnis aus dem Text')] }); },
    () => { const rate = wahl([250, 350, 450]), n = zz(6, 18) * 2, ziel = n * rate, k = kind();
      return zahl(`${k} spart jede Woche ${eurK(rate)}. Nach wie vielen Wochen sind ${eur(ziel)} zusammen?`, n, fehlerliste(n, [[n * 10, 'umrechnungszahl'], [n / 2, 'komma-falsch-gelesen']]), h1('Wie oft passt der Betrag einer Woche in das Sparziel? Rechne in Cent.'), { nachweis: [G(`${eur(ziel)} : ${eurK(rate)} = ${n}`)] }); },
    () => { const je = wahl([650, 750, 850, 950]), sum = 3 * je;
      return groesse(`Drei Freunde teilen sich eine Rechnung über ${eurK(sum)} gerecht. Jeder gibt 10 €. Wie viel bekommt jeder zurück?`, 'geld', 1000 - je, '€', [[je, 'sach-frage-verfehlt'], [3000 - sum, 'sach-schritt-vergessen']], h1('Rechne zuerst aus, wie viel jeder zahlen muss.'), { einheiten: EINHEITEN_GELD, nachweis: [G(`${eurK(sum)} : 3 = ${eurK(je)}`), G(`10 € − ${eurK(je)} = ${eurK(1000 - je)}`)] }); },
  ]);
}
