// Gemeinsame Aufgabenmuster für Gewicht (5.6.4) und Länge (5.6.5): Einheiten umwandeln und mit Größen rechnen (ADR 0033).
// F und G: Nachbareinheiten, F mit Einheitentafel zum Eintragen, G mit der Tafel im Tipp. M: zwei Stufen und Komma. E: Fehlersuche und Vergleich.

import { sechs, zahl, auswahl, opt, luecken, sach, teil, zuordnen, ordnen, groesse, einheitentafel, umwandeltabelle, L, Z, B, G, BG, frage, h1, h2, h3, zz, wahl, mische, fehlerliste, kind, HILFSGROESSE } from '../werkzeug.mjs';
import { gr, mix, FAKTOR, TAFELN, tafelBild, tafelZeile, merktabelle, gewichtsstuecke } from './5-6-groessen.mjs';

// ---------- Umwandeln ----------
// cfg: { art, nachbarn: [[groß, klein, tafel]], nachbarnG, zweiStufen: [[groß, klein]], komma: [[groß, klein]], merk: (groß, klein) => Zeile }
export function umwandeln(lz, cfg) {
  const f = (gross, klein) => FAKTOR[gross] / FAKTOR[klein];
  const merk = (...paare) => merktabelle(...paare.map(([g, k]) => [`1 ${g}`, `${f(g, k)} ${k}`]));
  const alleMerk = merk(...cfg.nachbarn);
  const umFehler = (richtig, n, faktor) => fehlerliste(richtig, [[n * (faktor === 1000 ? 100 : faktor === 100 ? 1000 : 100), 'umrechnungszahl'], [n * faktor * 10, 'umrechnungszahl'], [Number.isInteger(n / faktor) ? n / faktor : -1, 'umrechnungsrichtung']]);
  const H3 = (g, k) => h3(`1 ${g} sind ${f(g, k)} ${k}.`, `2 ${g} sind 2 · ${f(g, k)} ${k} = ${2 * f(g, k)} ${k}.`, `In der kleineren Einheit wird die Zahl größer. Rechne mal ${f(g, k)}.`);
  const H3r = (g, k) => h3(`${f(g, k)} ${k} sind 1 ${g}.`, `${3 * f(g, k)} ${k} sind 3 ${g}.`, `In der größeren Einheit wird die Zahl kleiner. Teile durch ${f(g, k)}.`);
  const tippTafel = (name, wert) => (name ? { tippBild: tafelBild(name, wert) } : {});
  // Ein gemischter Wert: n große Einheiten und ein Rest in der kleinen, der Rest hat eine 0 an der kritischen Stelle, wenn `mitNull`.
  const gemischt = (g, k, maxGross, mitNull = false) => { const fak = f(g, k), rest = mitNull ? zz(1, Math.min(9, fak / 10 - 1)) * (fak === 10 ? 1 : wahl([1, 5])) : fak === 10 ? zz(1, 9) : zz(1, 19) * (fak / 20); return zz(1, maxGross) * FAKTOR[g] + Math.min(rest, fak - 1) * FAKTOR[k]; };

  sechs(lz, 'F', [
    () => { const [g, k, tafel] = wahl(cfg.nachbarn), n = zz(2, 9);
      return luecken(Z('Die Tafel hilft dir.', `${n} ${g} = {{a}} ${k}`), { a: [n * f(g, k), umFehler(n * f(g, k), n, f(g, k))] }, H3(g, k), { bild: tafelBild(tafel, n * FAKTOR[g]), nachweis: [G(`${n} ${g} = ${gr(n * FAKTOR[g], k)}`)] }); },
    () => { const [g, k, tafel] = wahl(cfg.nachbarn), w = gemischt(g, k, 9, f(g, k) > 10), z = tafelZeile(tafel, w), n = w / FAKTOR[k];
      return einheitentafel(Z(`Trage ${mix(w, g, k)} in die Tafel ein.`, `Lies dann in ${k} ab.`), TAFELN[tafel].gruppen, TAFELN[tafel].kopf, [z.zeile], { ...z.werte, x: [n, fehlerliste(n, [[Math.floor(w / FAKTOR[g]) * 10 + (w % FAKTOR[g]) / FAKTOR[k], 'null-platzhalter'], [Math.floor(w / FAKTOR[g]) + (w % FAKTOR[g]) / FAKTOR[k], 'masszahlen-addiert']])] },
        h3('Jede Spalte bekommt genau eine Ziffer. Leere Stellen in der Mitte bekommen eine 0.', `Für 2 ${g} 5 ${k} steht bei ${g} eine 2. Bei ${k} ${f(g, k) === 10 ? 'steht eine 5' : `stehen ${[...String(5).padStart(String(f(g, k)).length - 1, '0')].join(f(g, k) === 100 ? ' und ' : ', ').replace(/, (\d)$/, ' und $1')}`}.`, `Schreibe die Zahl für ${k} rechtsbündig in ihre Spalten.`),
        { nachweis: [{ art: 'einheitentafel', zeile: 0, groesse: mix(w, g, k) }] }, { text: 'Das sind', luecke: 'x', einheit: k }); },
    () => { const [g, k] = wahl(cfg.nachbarn), w = gemischt(g, k, 9), n = w / FAKTOR[k];
      return luecken(Z('Wandle um.', `${mix(w, g, k)} = {{a}} ${k}`), { a: [n, fehlerliste(n, [[Math.floor(w / FAKTOR[g]) + (w % FAKTOR[g]) / FAKTOR[k], 'masszahlen-addiert'], [Math.floor(w / FAKTOR[g]) * (f(g, k) === 1000 ? 100 : 1000) + (w % FAKTOR[g]) / FAKTOR[k], 'umrechnungszahl']])] },
        h3(`Wandle zuerst die ${g} in ${k} um. Zähle dann den Rest dazu.`, `Für 2 ${g} ${f(g, k) === 10 ? 3 : 30} ${k} rechnest du ${2 * f(g, k)} ${k} + ${f(g, k) === 10 ? 3 : 30} ${k} = ${2 * f(g, k) + (f(g, k) === 10 ? 3 : 30)} ${k}.`, `1 ${g} sind ${f(g, k)} ${k}.`), { daten: alleMerk, nachweis: [G(`${mix(w, g, k)} = ${gr(w, k)}`)] }); },
    () => { const [g, k, tafel] = wahl(cfg.nachbarn), w = gemischt(g, k, 9), n = w / FAKTOR[k];
      return luecken(Z('Die Tafel hilft dir.', `${n} ${k} = {{a}} ${g} {{b}} ${k}`), { a: [Math.floor(w / FAKTOR[g]), fehlerliste(Math.floor(w / FAKTOR[g]), [[Math.floor(n / 10), 'umrechnungszahl']])], b: (w % FAKTOR[g]) / FAKTOR[k] }, H3r(g, k), { bild: tafelBild(tafel, w), nachweis: [G(`${n} ${k} = ${mix(w, g, k)}`)] }); },
    () => { const [g, k] = wahl(cfg.nachbarn), n = zz(2, 9), fak = f(g, k);
      return auswahl(Z('Schau in die Tabelle.', `Was ist genauso viel wie ${n} ${g}?`), [opt(`${n * fak} ${k}`, true), opt(`${n * (fak === 1000 ? 100 : 1000)} ${k}`, false, 'umrechnungszahl'), opt(`${n * (fak === 10 ? 100 : 10)} ${k}`, false, 'umrechnungszahl')], H3(g, k), { daten: alleMerk, nachweis: [{ art: 'gleichwert', groesse: `${n} ${g}` }] }); },
    () => { const n = zz(2, 9), paare = cfg.nachbarn.slice(0, 3).map(([g, k], i) => [`${n + i} ${g}`, `${(n + i) * f(g, k)} ${k}`]);
      if (paare.length < 3) paare.push([`${n * 10} ${cfg.nachbarn[0][0]}`, `${n * 10 * f(...cfg.nachbarn[0])} ${cfg.nachbarn[0][1]}`]);
      return zuordnen(Z('Schau in die Tabelle.', 'Was ist gleich viel?'), paare, h3('Wandle die linke Seite in die kleinere Einheit um.', `1 ${cfg.nachbarn[0][0]} sind ${f(...cfg.nachbarn[0])} ${cfg.nachbarn[0][1]}.`, 'Suche die passende Zeile in der Tabelle. Rechne dann mal.'), { daten: alleMerk, nachweis: paare.map(([l, r]) => G(`${l} = ${r}`)) }); },
  ]);
  const NG = cfg.nachbarnG;
  sechs(lz, 'G', [
    () => { const [g, k, tafel] = wahl(NG), n = zz(11, 60);
      return luecken(Z('Wandle um.', `${n} ${g} = {{a}} ${k}`), { a: [n * f(g, k), umFehler(n * f(g, k), n, f(g, k))] }, H3(g, k), { daten: merk([g, k]), ...tippTafel(tafel, 7 * FAKTOR[g]), nachweis: [G(`${n} ${g} = ${gr(n * FAKTOR[g], k)}`)] }); },
    () => { const [g, k, tafel] = wahl(NG), n = zz(2, 40);
      return luecken(Z('Wandle um.', `${gr(n * FAKTOR[g], k)} = {{a}} ${g}`), { a: [n, fehlerliste(n, [[n * 10, 'umrechnungszahl'], [n * f(g, k) * f(g, k), 'umrechnungsrichtung']])] }, H3r(g, k), { daten: merk([g, k]), ...tippTafel(tafel, 4 * FAKTOR[g]), nachweis: [G(`${gr(n * FAKTOR[g], k)} = ${n} ${g}`)] }); },
    () => { const [g, k, tafel] = wahl(NG.filter(([x, y]) => f(x, y) >= 100)), w1 = gemischt(g, k, 12, true), w2 = gemischt(g, k, 12, true);
      return luecken(Z('Wandle um.', `${mix(w1, g, k)} = {{a}} ${k}`, `${gr(w2, k)} = {{b}} ${g} {{c}} ${k}`), { a: [w1 / FAKTOR[k], fehlerliste(w1 / FAKTOR[k], [[Math.floor(w1 / FAKTOR[g]) * (f(g, k) / 10) + (w1 % FAKTOR[g]) / FAKTOR[k], 'null-platzhalter']])], b: Math.floor(w2 / FAKTOR[g]), c: (w2 % FAKTOR[g]) / FAKTOR[k] },
        h3('Achte auf die Nullen in der Mitte.', `3 ${g} 5 ${k} sind ${3 * f(g, k) + 5} ${k}.`, 'Stell dir die Einheitentafel vor. Jede Spalte bekommt eine Ziffer.'), { daten: merk([g, k]), ...tippTafel(tafel, 3 * FAKTOR[g] + 5 * FAKTOR[k]), nachweis: [G(`${mix(w1, g, k)} = ${gr(w1, k)}`), G(`${gr(w2, k)} = ${mix(w2, g, k)}`)] }); },
    () => { const [g, k] = wahl(NG), a = zz(2, 9), b = zz(11, 40), c = zz(41, 90);
      return umwandeltabelle('Fülle die Tabelle aus.', [g, k], [[a, L('a')], [L('b'), b * f(g, k)], [c, L('c')]], { a: [a * f(g, k), umFehler(a * f(g, k), a, f(g, k))], b, c: c * f(g, k) }, H3(g, k), { nachweis: [G(`${a} ${g} = ${gr(a * FAKTOR[g], k)}`), G(`${gr(b * FAKTOR[g], k)} = ${b} ${g}`), G(`${c} ${g} = ${gr(c * FAKTOR[g], k)}`)] }); },
    () => { const [g, k] = wahl(NG.filter(([x, y]) => f(x, y) >= 100)), n = zz(2, 8), fak = f(g, k), werte = [[n * fak - fak / 10, k], [n * fak, g], [n * fak + fak / 2, 'mix'], [(n + 1) * fak + fak / 10, k]];
      const text = ([w, e]) => (e === 'mix' ? mix(w * FAKTOR[k], g, k) : e === g ? `${w / fak} ${g}` : `${w} ${k}`);
      return ordnen(Z('Ordne die Größen.', 'Beginne mit der kleinsten Größe.'), werte.map(text), h3('Wandle alles in dieselbe Einheit um. Vergleiche dann.', `1 ${g} sind ${fak} ${k}.`, `Schreibe jede Größe in ${k} auf.`), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], links: 'klein', rechts: 'groß' }); },
    () => { const [g, k] = wahl(NG), n = zz(2, 9), fak = f(g, k), stimmt = wahl([true, false, false]), rechts = stimmt ? n * fak : n * (fak === 1000 ? 100 : fak === 100 ? 10 : 100), kn = kind();
      return auswahl(Z(`${kn} sagt: ${n} ${g} = ${rechts} ${k}.`, 'Stimmt das?'), [opt('Stimmt.', stimmt), opt(`Falsch. ${n} ${g} sind ${stimmt ? n * (fak === 1000 ? 100 : 1000) : n * fak} ${k}.`, !stimmt, stimmt ? 'umrechnungszahl' : undefined), opt(`Falsch. ${n} ${g} sind ${n * fak * 100} ${k}.`, false, 'umrechnungszahl')],
        H3(g, k), { nachweis: [{ art: 'urteil', stimmt, behauptung: `${n} ${g} = ${rechts} ${k}` }, G(`${n} ${g} = ${gr(n * FAKTOR[g], k)}`), HILFSGROESSE(`${n * (fak === 1000 ? 100 : 1000)} ${k}`, 'falsche Umrechnungszahl'), HILFSGROESSE(`${fz2(n * fak * 100)} ${k}`, 'falsche Umrechnungszahl')] }); },
  ]);
  const ZS = cfg.zweiStufen, KO = cfg.komma;
  // Kommazahl: n große Einheiten und ein Bruchteil, der in der kleinen Einheit aufgeht.
  const kommaWert = (g, k) => { const fak = f(g, k); return zz(1, 12) * FAKTOR[g] + (fak === 10 ? zz(1, 9) : fak === 100 ? wahl([5, 25, 50, 75, 8, 60]) : wahl([500, 250, 750, 50, 5, 125])) * FAKTOR[k]; };
  sechs(lz, 'M', [
    () => { const [g, k] = wahl(KO), w = kommaWert(g, k);
      return groesse(Z(`Schreibe mit Komma in ${g}.`, mix(w, g, k)), cfg.art, w, g, [[Math.floor(w / FAKTOR[g]) * FAKTOR[g] + ((w % FAKTOR[g]) / FAKTOR[k]) * (FAKTOR[g] / 10 ** String((w % FAKTOR[g]) / FAKTOR[k]).length), 'komma-falsch-gelesen']].filter(([x]) => Number.isInteger(x)),
        h2(`Nach dem Komma stehen die ${k}. Bei ${g} und ${k} gehören ${String(f(g, k)).length - 1} Stellen nach dem Komma.`, 'Fülle fehlende Stellen nach dem Komma mit Nullen auf.'), { nachweis: [G(`${mix(w, g, k)} = ${gr(w, g)}`)] }); },
    () => { const [g, k] = wahl(ZS), n = zz(2, 9), [g2, k2] = wahl(ZS.filter(([x]) => x !== g).concat([ZS[0]])), n2 = zz(2, 9);
      return luecken(Z('Wandle in zwei Schritten um.', `${n} ${g} = {{a}} ${k}`, `${gr(n2 * FAKTOR[g2], k2)} = {{b}} ${g2}`), { a: [n * f(g, k), fehlerliste(n * f(g, k), [[n * f(g, k) / 10, 'umrechnungszahl'], [n * f(g, k) * 10, 'umrechnungszahl']])], b: n2 },
        h2('Gehe über die Einheit dazwischen.', 'Wandle erst in die Nachbareinheit um, dann noch einmal.'), { nachweis: [G(`${n} ${g} = ${gr(n * FAKTOR[g], k)}`), G(`${gr(n2 * FAKTOR[g2], k2)} = ${n2} ${g2}`)] }); },
    () => { const [g, k] = wahl(KO), w = kommaWert(g, k);
      return zahl(Z('Wandle um.', `Wie viele ${k} sind ${gr(w, g)}?`), w / FAKTOR[k], fehlerliste(w / FAKTOR[k], [[Math.floor(w / FAKTOR[g]) * f(g, k) + Number(String(w % FAKTOR[g] / FAKTOR[k]).replace(/0+$/, '')), 'komma-falsch-gelesen'], [(w / FAKTOR[k]) * 10, 'umrechnungszahl']]),
        h2(`1 ${g} sind ${f(g, k)} ${k}. Das Komma rückt um ${String(f(g, k)).length - 1} Stellen.`, `Schreibe die Größe mit zwei Einheiten: so viele ${g} und so viele ${k}.`), { einheit: k, nachweis: [G(`${gr(w, g)} = ${gr(w, k)}`)] }); },
    () => { const [g, k] = wahl(KO.filter(([x, y]) => f(x, y) >= 100)), w = kommaWert(g, k);
      return luecken(Z('Schreibe mit zwei Einheiten.', `${gr(w, g)} = {{a}} ${g} {{b}} ${k}`), { a: Math.floor(w / FAKTOR[g]), b: [(w % FAKTOR[g]) / FAKTOR[k], fehlerliste((w % FAKTOR[g]) / FAKTOR[k], [[Number(String((w % FAKTOR[g]) / FAKTOR[k]).replace(/0+$/, '')), 'komma-falsch-gelesen']])] },
        h2(`Vor dem Komma stehen die ${g}. Nach dem Komma stehen die ${k}.`, `Fülle nach dem Komma auf ${String(f(g, k)).length - 1} Stellen auf.`), { nachweis: [G(`${gr(w, g)} = ${mix(w, g, k)}`)] }); },
    () => { const [g, k] = wahl(KO.filter(([x, y]) => f(x, y) >= 100)), n = zz(2, 8), fak = f(g, k), basis = n * FAKTOR[g];
      const werte = [[basis + (fak / 20) * FAKTOR[k], 'komma'], [basis + (fak / 2) * FAKTOR[k], 'mix'], [basis - (fak / 10) * FAKTOR[k], 'klein'], [basis + (fak / 4) * FAKTOR[k], 'klein'], [basis + (fak / 5) * FAKTOR[k], 'komma']].sort((x, y) => y[0] - x[0]);
      return ordnen(Z('Ordne die Größen.', 'Beginne mit der größten Größe.'), werte.map(([w, wie]) => (wie === 'komma' ? gr(w, g) : wie === 'mix' ? mix(w, g, k) : gr(w, k))), h2('Wandle alles in dieselbe Einheit um.', `Schreibe jede Größe in ${k} auf.`), { nachweis: [{ art: 'ordnung', richtung: 'ab' }], links: 'groß', rechts: 'klein' }); },
    () => { const [g, k] = wahl(KO.filter(([x, y]) => f(x, y) === 1000)), n = zz(2, 9), w = n * FAKTOR[g] + 50 * FAKTOR[k];
      return auswahl(Z(`Welche Angaben sind gleich ${gr(w, g)}?`, 'Kreuze alle an.'), [opt(gr(w, k), true), opt(mix(w, g, k), true), opt(mix(n * FAKTOR[g] + 5 * FAKTOR[k], g, k), false, 'komma-falsch-gelesen'), opt(gr(n * FAKTOR[g] + 500 * FAKTOR[k], k), false, 'komma-falsch-gelesen'), opt(gr(w / 10, k), false, 'umrechnungszahl')],
        h2('Wandle jede Angabe in die kleinere Einheit um.', `Nach dem Komma stehen bei ${g} und ${k} drei Stellen.`), { mehrfach: true, nachweis: [{ art: 'gleichwert', groesse: gr(w, g) }] }); },
  ]);
  sechs(lz, 'E', [
    () => { const [g, k] = wahl(KO.filter(([x, y]) => f(x, y) === 1000)), n = zz(2, 9), [g2, k2] = wahl(ZS), falsch = wahl([`${gr(n * FAKTOR[g] + 50 * FAKTOR[k], g)} = ${gr(n * FAKTOR[g] + 500 * FAKTOR[k], k)}`, `${n} ${g2} = ${gr(n * FAKTOR[g2] / 10, k2)}`, `${gr(n * 100 * FAKTOR[k], k)} = ${gr(n * FAKTOR[g], g)}`]);
      return auswahl('Welche Umwandlung ist falsch?', [opt(falsch, true), opt(`${gr(n * FAKTOR[g] + 500 * FAKTOR[k], g)} = ${gr(n * FAKTOR[g] + 500 * FAKTOR[k], k)}`), opt(`${n + 1} ${g2} = ${gr((n + 1) * FAKTOR[g2], k2)}`), opt(`${gr(250 * FAKTOR[k], k)} = ${gr(250 * FAKTOR[k], g)}`), opt(`${mix(n * FAKTOR[g] + 5 * FAKTOR[k], g, k)} = ${gr(n * FAKTOR[g] + 5 * FAKTOR[k], g)}`)],
        h1('Rechne jede Umwandlung nach. Achte auf die Umrechnungszahl und auf die Stellen nach dem Komma.'), { nachweis: [{ art: 'gleichungswahl', falsche: true }] }); },
    () => { const [g, k] = wahl(ZS), w = (zz(1, 9) * 100 + wahl([25, 50, 75, 5])) * (FAKTOR[g] / 100);
      if (w % FAKTOR[k]) return null;
      return zahl(`Wie viele ${k} sind ${gr(w, g)}?`, w / FAKTOR[k], fehlerliste(w / FAKTOR[k], [[w / FAKTOR[k] / 10, 'umrechnungszahl'], [(w / FAKTOR[k]) * 10, 'umrechnungszahl']]), h1('Wandle in zwei Schritten um. Gehe über die Einheit dazwischen.'), { einheit: k, nachweis: [G(`${gr(w, g)} = ${gr(w, k)}`)] }); },
    () => { const [g, k] = wahl(KO.filter(([x, y]) => f(x, y) === 1000)), n = zz(2, 8), basis = n * FAKTOR[g], [g2] = ZS[0];
      const werte = [[basis + 5 * FAKTOR[k], 'komma'], [basis + 50 * FAKTOR[k], 'mix'], [basis + 500 * FAKTOR[k], 'komma'], [basis - 1 * FAKTOR[k], 'klein'], [basis + 55 * FAKTOR[k], 'klein'], [basis / 10, 'komma']].sort((x, y) => x[0] - y[0]);
      return ordnen('Ordne die Größen. Beginne mit der kleinsten Größe.', werte.map(([w, wie]) => (wie === 'komma' ? gr(w, g) : wie === 'mix' ? mix(w, g, k) : gr(w, k))), h1(`Wandle alles in ${k} um.`), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], links: 'klein', rechts: 'groß', ...(g2 ? {} : {}) }); },
    () => { const [g, k] = wahl(KO.filter(([x, y]) => f(x, y) === 1000)), n = zz(2, 9), w = n * FAKTOR[g] + 5 * wahl([1, 10]) * FAKTOR[k], stimmt = wahl([true, false, false]), falschW = n * FAKTOR[g] + 500 * FAKTOR[k], kn = kind();
      return auswahl(`${kn} behauptet: ${gr(w, g)} = ${gr(stimmt ? w : falschW, k)}. Stimmt das?`, [opt(`Stimmt, denn nach dem Komma stehen drei Stellen für ${k}.`, stimmt), opt(`Falsch, denn ${gr(w, g)} sind ${gr(stimmt ? falschW : w, k)}.`, !stimmt, stimmt ? 'komma-falsch-gelesen' : undefined), opt(`Falsch, denn ${gr(w, g)} sind ${gr(w / 10, k)}.`, false, 'umrechnungszahl'), opt('Stimmt, denn Nullen nach dem Komma darf man weglassen.', false, 'komma-falsch-gelesen')],
        h1('Schreibe die Größe mit zwei Einheiten und wandle dann um.'), { nachweis: [{ art: 'urteil', stimmt, behauptung: `${gr(w, g)} = ${gr(stimmt ? w : falschW, k)}` }, G(`${gr(w, g)} = ${gr(w, k)}`), HILFSGROESSE(gr(falschW, k), 'falsche Lesart'), HILFSGROESSE(gr(w / 10, k), 'falsche Umrechnungszahl')] }); },
    () => { const [g, k] = wahl(KO.filter(([x, y]) => f(x, y) === 1000)), n = zz(2, 9), l = n * FAKTOR[g] + wahl([5, 50, 500]) * FAKTOR[k], r = n * FAKTOR[g] + wahl([5, 50, 500]) * FAKTOR[k];
      return auswahl(Z('Welches Zeichen passt?', `${gr(l, g)} ▢ ${gr(r, k)}`), [opt('<', l < r, 'komma-falsch-gelesen'), opt('>', l > r, 'komma-falsch-gelesen'), opt('=', l === r, 'komma-falsch-gelesen')].map((o) => (o.richtig ? { text: o.text, richtig: true } : o)),
        h1('Wandle beide Größen in dieselbe Einheit um.'), { nachweis: [{ art: 'vergleich', links: gr(l, g), rechts: gr(r, k) }] }); },
    cfg.knobel,
  ]);
}
const fz2 = (n) => (n >= 10000 ? String(n).replace(/\B(?=(\d{3})+$)/g, ' ') : String(n));

// ---------- Rechnen ----------
// cfg: { art, gross, klein (Nachbareinheiten mit Faktor 100 oder 1000), dinge: Texte für die Sachsituationen, einheiten: Auswahl ab M }
export function rechnen(lz, cfg) {
  const { gross: g, klein: k } = cfg, fak = FAKTOR[g] / FAKTOR[k], K = FAKTOR[k], GR = FAKTOR[g];
  const merk = merktabelle([`1 ${g}`, `${fak} ${k}`]);
  const T = cfg.texte;
  sechs(lz, 'F', [
    ...cfg.bilderF,
    () => { const a = zz(2, 9) * 5, b = zz(2, 9) * 5, [s1, s2, fr] = wahl(T.plus);
      return zahl(Z(s1.replace('▢', `${a} ${k}`), s2.replace('▢', `${b} ${k}`), fr), a + b, fehlerliste(a + b, [[Math.abs(a - b), 'add-subtrahiert'], [a, 'sach-schritt-vergessen']]), h3('Beide Größen haben dieselbe Einheit. Zähle zusammen.', `30 ${k} + 25 ${k} = 55 ${k}`, `Rechne ${a} + ${b}.`), { einheit: k, bild: B.streifen(frage(a + b), [a, b]), nachweis: [G(`${a} ${k} + ${b} ${k} = ${a + b} ${k}`)] }); },
    () => { const n = zz(3, 5), a = zz(2, 9) * 10, [s1, s2, fr] = wahl(T.mal);
      return zahl(Z(s1.replace('▢', `${a} ${k}`), s2.replace('▢', String(n)), fr), n * a, fehlerliste(n * a, [[n + a, '1x1-addiert'], [a, 'sach-schritt-vergessen']]), h3('Gleiche Größen mehrmals: Rechne mal.', `3 · 20 ${k} = 60 ${k}`, `Rechne ${n} mal ${a}.`), { einheit: k, bild: B.streifen(frage(n * a), Array(n).fill(a)), nachweis: [G(`${n} · ${a} ${k} = ${n * a} ${k}`)] }); },
    () => { const a = zz(1, 3), r = zz(2, 9) * (fak / 20), b = zz(2, 9) * (fak / 20), [s1, s2, fr] = wahl(T.plus);
      return zahl(Z('Die Tabelle hilft beim Umwandeln.', s1.replace('▢', `${a} ${g} ${r} ${k}`), s2.replace('▢', `${b} ${k}`), `${fr.replace('?', '')} in ${k}?`), a * fak + r + b, fehlerliste(a * fak + r + b, [[a + r + b, 'masszahlen-addiert'], [r + b, 'sach-schritt-vergessen']]),
        h3(`Wandle zuerst alles in ${k} um.`, `1 ${g} 20 ${k} sind ${fak + 20} ${k}. Dann ${fak + 20} ${k} + 30 ${k} = ${fak + 50} ${k}.`, `1 ${g} sind ${fak} ${k}.`), { einheit: k, daten: merk, nachweis: [G(`${a} ${g} ${r} ${k} + ${b} ${k} = ${a * fak + r + b} ${k}`)] }); },
    () => { const a = zz(1, 4), b = zz(2, 18) * (fak / 20), [s1, s2, fr] = wahl(T.minus);
      return sach(Z('Die Tabelle hilft beim Umwandeln.', s1.replace('▢', `${a} ${g}`), s2.replace('▢', `${b} ${k}`)), [teil(`Wie viel ${k} sind ${a} ${g}?`, a * fak, k, fehlerliste(a * fak, [[a * (fak === 1000 ? 100 : 1000), 'umrechnungszahl']])), teil(fr, a * fak - b, k, fehlerliste(a * fak - b, [[Math.abs(a - b), 'masszahlen-addiert'], [a * fak + b, 'sub-addiert']]))],
        h3(`Wandle zuerst in ${k} um. Ziehe dann ab.`, `2 ${g} sind ${2 * fak} ${k}. Dann ${2 * fak} ${k} − 50 ${k} = ${2 * fak - 50} ${k}.`, `1 ${g} sind ${fak} ${k}.`), { daten: merk, nachweis: [G(`${a} ${g} = ${a * fak} ${k}`, 1), G(`${a * fak} ${k} − ${b} ${k} = ${a * fak - b} ${k}`, 2)] }); },
    () => { const n = zz(2, 5), je = zz(2, 9) * 10, [s1, s2, fr] = wahl(T.geteilt);
      return zahl(Z(s1.replace('▢', `${n * je} ${k}`), s2.replace('▢', String(n)), fr), je, fehlerliste(je, [[n * je, 'sach-schritt-vergessen'], [n * je - n, 'div-falsche-rechenart']]), h3('Gleich große Teile: Rechne geteilt.', `80 ${k} : 4 = 20 ${k}`, `Rechne ${n * je} geteilt durch ${n}.`), { einheit: k, bild: B.streifen(n * je, Array(n).fill(frage(je)).map((x, i) => (i === 0 ? x : je))), nachweis: [G(`${n * je} ${k} : ${n} = ${je} ${k}`)] }); },
  ]);
  sechs(lz, 'G', [
    () => { const a = zz(1, 9), r = zz(3, 18) * (fak / 20), b = zz(11, 19) * (fak / 20), [s1, s2, fr] = wahl(T.plus);
      return zahl(Z(s1.replace('▢', `${a} ${g} ${r} ${k}`), s2.replace('▢', `${b} ${k}`), `${fr.replace('?', '')} in ${k}?`), a * fak + r + b, fehlerliste(a * fak + r + b, [[a + r + b, 'masszahlen-addiert'], [a * (fak === 1000 ? 100 : 1000) + r + b, 'umrechnungszahl']]),
        h3(`Wandle zuerst alles in ${k} um.`, `2 ${g} 300 ${k} sind ${2 * fak + 300} ${k}.`, `1 ${g} sind ${fak} ${k}.`), { einheit: k, daten: merk, nachweis: [G(`${a} ${g} ${r} ${k} + ${b} ${k} = ${a * fak + r + b} ${k}`)] }); },
    () => { const a = zz(3, 9), b = zz(1, 2), r = zz(2, 18) * (fak / 20), [s1, s2, fr] = wahl(T.minus);
      return zahl(Z(s1.replace('▢', `${a} ${g}`), s2.replace('▢', `${b} ${g} ${r} ${k}`), `${fr.replace('?', '')} in ${k}?`), (a - b) * fak - r, fehlerliste((a - b) * fak - r, [[(a - b) * fak + r, 'sub-kleiner-von-groesser'], [a - b - r > 0 ? a - b - r : a + b + r, 'masszahlen-addiert']]),
        h3(`Wandle beide Größen in ${k} um. Ziehe dann ab.`, `5 ${g} − 1 ${g} 250 ${k} sind ${5 * fak} ${k} − ${fak + 250} ${k} = ${4 * fak - 250} ${k}.`, `1 ${g} sind ${fak} ${k}.`), { einheit: k, daten: merk, nachweis: [G(`${a} ${g} − ${b} ${g} ${r} ${k} = ${(a - b) * fak - r} ${k}`)] }); },
    () => { const a = zz(3, 6) * (fak / 4), n = zz(3, 8), ges = n * a, b = zz(2, 9) * (fak / 10), [s1, s2, f1, f2] = wahl(T.zwei);
      return sach(Z(s1.replace('▢', String(n)).replace('◇', `${a} ${k}`), s2.replace('▢', `${b} ${k}`)), [teil(f1, ges, k, fehlerliste(ges, [[n + a, '1x1-addiert']])), teil(f2, ges - b, k, fehlerliste(ges - b, [[ges + b, 'sub-addiert'], [ges, 'sach-schritt-vergessen']]))],
        h3('Rechne in zwei Schritten: erst mal, dann minus.', `4 · 250 ${k} = 1000 ${k}. Dann 1000 ${k} − 100 ${k} = 900 ${k}.`, 'Schreibe das erste Ergebnis mit Einheit auf.'), { bild: B.streifen(ges, [b, frage(ges - b)]), nachweis: [G(`${n} · ${a} ${k} = ${ges} ${k}`, 1), G(`${ges} ${k} − ${b} ${k} = ${ges - b} ${k}`, 2)] }); },
    () => { const je = zz(3, 9) * (fak / 20) * 2, n = zz(4, 9), ges = n * je, [s1, s2] = wahl(T.mal);
      return luecken(Z(s1.replace('▢', `${je} ${k}`), s2.replace('▢', String(n)), `Das sind zusammen {{a}} ${g} {{b}} ${k}.`), { a: [Math.floor(ges / fak), fehlerliste(Math.floor(ges / fak), [[Math.floor(ges / (fak / 10)), 'umrechnungszahl']])], b: ges % fak },
        h3(`Rechne zuerst in ${k}. Wandle dann um.`, `6 · ${(fak * 2) / 5} ${k} = ${(fak * 12) / 5} ${k}. Das sind 2 ${g} ${(fak * 2) / 5} ${k}.`, `${fak} ${k} sind 1 ${g}.`), { nachweis: [G(`${n} · ${je} ${k} = ${ges} ${k} = ${mix(ges * K, g, k)}`)] }); },
    () => { const n = wahl([4, 5, 8]), a = zz(2, 6), je = (a * fak) / n, [s1, s2, fr] = wahl(T.geteilt);
      if (!Number.isInteger(je)) return null;
      return zahl(Z(s1.replace('▢', `${a} ${g}`), s2.replace('▢', String(n)), `${fr.replace('?', '')} in ${k}?`), je, fehlerliste(je, [[a * fak, 'sach-schritt-vergessen'], [(a * (fak === 1000 ? 100 : 1000)) / n, 'umrechnungszahl']].filter(([x]) => Number.isInteger(x))), h3(`Wandle zuerst in ${k} um. Teile dann.`, `2 ${g} : 4 sind ${2 * fak} ${k} : 4 = ${(2 * fak) / 4} ${k}.`, `1 ${g} sind ${fak} ${k}.`), { einheit: k, nachweis: [G(`${a} ${g} : ${n} = ${je} ${k}`)] }); },
    () => { const a = zz(2, 5), b = zz(2, 9) * (fak / 20), richtig = a * fak + b, kn = kind(), stimmt = wahl([true, false, false]), behauptet = stimmt ? richtig : a + b;
      return auswahl(Z(`${kn} rechnet: ${a} ${g} + ${b} ${k} = ${behauptet} ${k}.`, 'Stimmt das?'), [opt('Stimmt.', stimmt), opt(`Falsch. Es sind ${stimmt ? a + b : richtig} ${k}.`, !stimmt, stimmt ? 'masszahlen-addiert' : undefined), opt(`Falsch. Es sind ${a * (fak === 1000 ? 100 : 1000) + b} ${k}.`, false, 'umrechnungszahl')],
        h3(`Wandle zuerst in ${k} um. Rechne dann.`, `2 ${g} + 50 ${k} sind ${2 * fak} ${k} + 50 ${k} = ${2 * fak + 50} ${k}.`, 'Die Einheiten sind verschieden. So darfst du die Zahlen nicht zusammenzählen.'), { nachweis: [{ art: 'urteil', stimmt, behauptung: `${a} ${g} + ${b} ${k} = ${behauptet} ${k}` }, G(`${a} ${g} + ${b} ${k} = ${richtig} ${k}`), HILFSGROESSE(`${a + b} ${k}`, 'Zahlen ohne Umwandeln addiert'), HILFSGROESSE(`${a * (fak === 1000 ? 100 : 1000) + b} ${k}`, 'falsche Umrechnungszahl')] }); },
  ]);
  const E_ = cfg.einheiten;
  const kw = (teile) => zz(1, 9) * GR + wahl(teile) * (GR / 100);
  sechs(lz, 'M', [
    () => { const a = kw([25, 50, 75, 20]), b = zz(3, 18) * (fak / 20) * K, [s1, s2, fr] = wahl(T.plus);
      return groesse(Z(s1.replace('▢', gr(a, g)), s2.replace('▢', gr(b, k)), fr), cfg.art, a + b, g, [[Math.floor(a / GR) * GR + b * (GR / K) / fak + (a % GR), 'masszahlen-addiert'], [a, 'sach-schritt-vergessen']].filter(([x]) => Number.isInteger(x)), h2('Wandle zuerst in dieselbe Einheit um.', `Rechne am besten in ${k}.`), { einheiten: E_, nachweis: [G(`${gr(a, g)} + ${gr(b, k)} = ${gr(a + b, g)}`)] }); },
    () => { const a = zz(3, 9) * GR, b = kw([25, 50, 75, 5]) % (2 * GR) + GR / 4, [s1, s2, fr] = wahl(T.minus);
      return groesse(Z(s1.replace('▢', gr(a, g)), s2.replace('▢', gr(b, g)), fr), cfg.art, a - b, g, [[a + b, 'sub-addiert']], h2('Rechne in der kleineren Einheit. Dann brauchst du kein Komma.', `Wandle beide Größen in ${k} um.`), { einheiten: E_, nachweis: [G(`${gr(a, g)} − ${gr(b, g)} = ${gr(a - b, g)}`)] }); },
    () => { const je = wahl([25, 75, 125, 35, 45]) * (GR / 100), n = wahl([4, 6, 8]), [s1, s2, fr] = wahl(T.malM);
      return groesse(Z(s1.replace('▢', gr(je, g)), s2.replace('▢', String(n)), fr), cfg.art, n * je, g, [[je, 'sach-schritt-vergessen'], [n * je * 10, 'komma-falsch-gelesen']], h2('Rechne in der kleineren Einheit und wandle am Ende um.', `${gr(je, g)} sind ${gr(je, k)}.`), { einheiten: E_, nachweis: [G(`${n} · ${gr(je, g)} = ${gr(n * je, g)}`)] }); },
    () => { const je = wahl([125, 250, 200, 500, 50]) * (fak / 1000 || 1) * K, n = zz(3, 12), [s1, s2, fr, einheit] = wahl(T.wieOft);
      if (je % K || (n * je) % (GR / 4)) return null;
      return zahl(Z(s1.replace('▢', gr(n * je, g)), s2.replace('▢', gr(je, k)), fr), n, fehlerliste(n, [[n * 10, 'umrechnungszahl'], [n * je / K, 'sach-falsche-rechnung']]), h2('Wie oft passt das Kleine in das Große? Wandle zuerst um.', `Rechne beide Größen in ${k} um und teile.`), { einheit, nachweis: [G(`${gr(n * je, g)} : ${gr(je, k)} = ${n}`)] }); },
    () => { const a = wahl([120, 150, 180, 240]) * (GR / 100), b = wahl([40, 60, 80]) * (GR / 100), [s1, fr] = wahl(T.gemischtM), ges = 3 * a + 2 * b;
      return groesse(Z(s1.replace('▢', gr(a, g)).replace('◇', gr(b, k)), fr), cfg.art, ges, g, [[a + b, 'sach-schritt-vergessen'], [3 * a, 'sach-schritt-vergessen']], h2('Rechne beide Teile einzeln aus. Zähle dann zusammen.', `Wandle zuerst in ${k} um.`), { einheiten: E_, nachweis: [G(`3 · ${gr(a, g)} = ${gr(3 * a, g)}`), G(`2 · ${gr(b, k)} = ${gr(2 * b, k)}`), G(`${gr(3 * a, g)} + ${gr(2 * b, k)} = ${gr(ges, g)}`)] }); },
    () => { const werte = [zz(2, 4) * GR - GR / 10, zz(3, 5) * GR + GR / 10, zz(1, 3) * GR - GR / 20], rund = werte.map((w) => Math.round(w / GR) * GR), sum = rund[0] + rund[1] + rund[2], [s1] = wahl(T.ueberschlag);
      return auswahl(Z(s1.replace('▢', `${gr(werte[0], g)}, ${gr(werte[1], g)} und ${gr(werte[2], g)}`), 'Überschlage: Wie viel ist das zusammen ungefähr?'), [opt(`ungefähr ${gr(sum, g)}`, true), opt(`ungefähr ${gr(sum + 3 * GR, g)}`), opt(`ungefähr ${gr(sum - 2 * GR, g)}`), opt(`ungefähr ${gr(sum * 10, g)}`, false, 'komma-falsch-gelesen')],
        h2(`Runde jede Größe auf ganze ${g}.`, `${gr(werte[0], g)} sind ungefähr ${gr(rund[0], g)}.`), { nachweis: [...werte.map((w, i) => G(`${gr(w, g)} ≈ ${gr(rund[i], g)}`)), G(`${gr(rund[0], g)} + ${gr(rund[1], g)} + ${gr(rund[2], g)} = ${gr(sum, g)}`)] }); },
  ]);
  sechs(lz, 'E', [
    () => { const a = kw([40, 60, 80]), b = zz(3, 18) * (fak / 20) * K, c = zz(1, 3) * GR + wahl([50, 5]) * (fak / 1000 >= 1 ? fak / 1000 : 1) * K;
      return groesse(`Rechne: ${gr(a, g)} + ${gr(b, k)} + ${mix(c, g, k)}`, cfg.art, a + b + c, g, [[a + c, 'sach-schritt-vergessen']], h1('Wandle zuerst alles in dieselbe Einheit um.'), { einheiten: E_, nachweis: [G(`${gr(a, g)} + ${gr(b, k)} + ${mix(c, g, k)} = ${gr(a + b + c, g)}`)] }); },
    () => { const a = zz(5, 9) * GR, b = zz(5, 15) * (fak / 4) * K, c = wahl([60, 80, 40]) * (GR / 100), [s1, fr] = wahl(T.dreiE);
      if (a - b - c <= 0) return null;
      return groesse(`${s1.replace('▢', gr(a, g)).replace('◇', gr(b, k)).replace('○', gr(c, g))} ${fr}`, cfg.art, a - b - c, g, [[a - b, 'sach-schritt-vergessen'], [a - c, 'sach-schritt-vergessen']], h1('Wandle alles in dieselbe Einheit um und ziehe nacheinander ab.'), { einheiten: E_, nachweis: [G(`${gr(a, g)} − ${gr(b, k)} − ${gr(c, g)} = ${gr(a - b - c, g)}`)] }); },
    () => { const je = wahl([25, 40, 50, 125, 250]) * (fak / 1000) * K, n = zz(12, 40), [s1, s2, fr, einheit] = wahl(T.wieOftE);
      if (!Number.isInteger(je / K) || (n * je) % (GR / 20)) return null;
      return zahl(`${s1.replace('▢', gr(n * je, g))} ${s2.replace('▢', gr(je, k))} ${fr}`, n, fehlerliste(n, [[n * 10, 'umrechnungszahl'], [n / 10, 'umrechnungszahl']].filter(([x]) => Number.isInteger(x))), h1('Wandle beide Größen in dieselbe Einheit um. Teile dann.'), { einheit, nachweis: [G(`${gr(n * je, g)} : ${gr(je, k)} = ${n}`)] }); },
    () => { const a = zz(2, 6), b = zz(3, 9) * (fak / 10), falsch = a + b, richtig = a * fak + b, kn = kind();
      return auswahl(`${kn} rechnet: ${a} ${g} + ${b} ${k} = ${falsch} ${k}. Welcher Fehler steckt in der Rechnung?`, [opt(`Die Zahlen wurden zusammengezählt, ohne umzuwandeln. Richtig sind ${gr(richtig * K, k)}.`, true), opt(`Es wurde mit der falschen Umrechnungszahl gerechnet. Richtig sind ${gr((a * fak) / 10 * K + b * K, k)}.`, false, 'umrechnungszahl'), opt(`Das Ergebnis hat die falsche Einheit. Richtig sind ${falsch} ${g}.`, false, 'einheit-fehlt'), opt('Die Rechnung enthält keinen Fehler.', false, 'masszahlen-addiert')],
        h1('Wandle beide Größen in dieselbe Einheit um und rechne nach.'), { nachweis: [G(`${a} ${g} + ${b} ${k} = ${gr(richtig * K, k)}`), HILFSGROESSE(`${falsch} ${k}`, 'falsches Ergebnis aus dem Text')] }); },
    () => { const n = wahl([4, 5, 8]), je = zz(3, 9) * (fak / 20) * K, m = zz(2, n - 1), [s1, s2, fr] = wahl(T.teilenE);
      return groesse(`${s1.replace('▢', gr(n * je, g)).replace('◇', String(n))} ${s2.replace('▢', String(m))} ${fr}`, cfg.art, m * je, k, [[je, 'sach-schritt-vergessen'], [n * je, 'sach-frage-verfehlt']], h1('Rechne zuerst aus, wie groß ein Teil ist.'), { einheiten: E_, nachweis: [G(`${gr(n * je, g)} : ${n} = ${gr(je, k)}`), G(`${m} · ${gr(je, k)} = ${gr(m * je, k)}`)] }); },
    () => { const n = zz(3, 6), je = zz(3, 9) * (fak / 4) * K, fix = kw([20, 50]), [s1, fr] = wahl(T.rueckE);
      return groesse(`${s1.replace('▢', String(n)).replace('◇', gr(fix, g)).replace('○', gr(n * je + fix, g))} ${fr}`, cfg.art, je, k, [[n * je, 'sach-schritt-vergessen'], [(n * je + fix) / n, 'sach-schritt-vergessen']].filter(([x]) => Number.isInteger(x)), h1('Rechne rückwärts: Ziehe zuerst ab, was du schon kennst.'), { einheiten: E_, nachweis: [G(`${gr(n * je + fix, g)} − ${gr(fix, g)} = ${gr(n * je, g)}`), G(`${gr(n * je, g)} : ${n} = ${gr(je, k)}`)] }); },
  ]);
}
export { gewichtsstuecke, BG };
