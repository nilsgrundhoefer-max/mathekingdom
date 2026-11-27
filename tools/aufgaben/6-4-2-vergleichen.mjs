// Aufgaben zu 6.4.2 „Dezimalzahlen vergleichen und ordnen“ (Lernziele V1, V2) nach ADR 0015 und ADR 0047.
// V1: Vergleichen und Ordnen, Fehlvorstellung „mehr Ziffern heißt größer“. V2: Zahlenstrahl ablesen und eintragen, ab M mit Lupe.
// Staffel: F Zehntel und Hundertstel, G bis Tausendstel, M bis Zehntausendstel und gemischte Größen, E Dichte, Fehlersuche, rückwärts.

import { sechs, auswahl, ordnen, dezimal, strahl, Z, h1, h2, h3 } from '../werkzeug.mjs';
import { B, opt, zz, wahl, mische, kind, fehlerliste, T, dfe, VGL, URTEIL, ZEICHEN, vgl, alsPaar, strahlSpec, lupe, KONTEXTE } from './6-4-dezimal.mjs';

const V1 = '6.4.2-V1', V2 = '6.4.2-V2';
// Vergleich zweier Zahltexte („0,7“, „0,65“): < 0, 0, > 0.
const d = (a, c) => vgl(alsPaar(a), alsPaar(c));
const sortiere = (liste) => [...liste].sort((a, c) => d(a, c));
const verschieden = (liste) => new Set(liste.map((t) => Number(t.replace(',', '.')))).size === liste.length;
// Zwei oder drei Zahlen in der Stellenwerttafel, Komma unter Komma.
const tafelVon = (spalten, zahlen) => {
  const zeile = (t) => { const [z, k] = alsPaar(t), e = spalten.indexOf('E'), nach = spalten.length - 1 - e, s = String(z * 10 ** (nach - k)).padStart(spalten.length, ' ');
    return [...s].map((c, i) => (c === ' ' ? (i >= e ? 0 : null) : Number(c))); };
  return B.kommaTafel(spalten, zeile(zahlen[0]), zahlen.slice(1).map(zeile));
};
const richtigZuerst = (liste) => liste.map((o) => (o.richtig ? opt(o.text, true) : o));

export function vergleichen6() {
  // ================= V1: Vergleichen und ordnen =================
  const tF = h3('Vergleiche zuerst die Einer. Dann die Zehntel, dann die Hundertstel.', '0,7 und 0,65: Die Zehntel sind 7 und 6. Also ist 0,7 größer.', 'Schreibe die Zahlen untereinander, Komma unter Komma. Vergleiche von links.');
  sechs(V1, 'F', [
    () => { const a = zz(1, 9), c = zz(1, 9);
      if (a === c) return null;
      const st = strahlSpec(0, 10, 10, 5, { punkte: [a, c] });
      return auswahl(Z('Am Zahlenstrahl siehst du zwei Zahlen.', `Kreuze das passende Zeichen an: ${T(a, 1)} ▢ ${T(c, 1)}`), ZEICHEN(a - c, 'zeichen-verwechselt'), tF,
        { bild: B.strahl(st), nachweis: [VGL(T(a, 1), T(c, 1))] }); },
    () => { const z = zz(2, 8), a = T(z, 1), c = T(wahl([z - 1, z]) * 10 + zz(1, 9), 2);
      if (d(a, c) === 0 || c === a || !/^0,\d\d$/.test(c)) return null;
      return auswahl(Z('Beide Zahlen stehen in der Stellenwerttafel.', `Kreuze das passende Zeichen an: ${a} ▢ ${c}`), ZEICHEN(d(a, c), 'dezimal-mehr-ziffern'), tF,
        { bild: tafelVon(['E', 'z', 'h'], [a, c]), nachweis: [VGL(a, c)] }); },
    () => { const z = zz(2, 8), zahlen = mische([T(z, 1), T(z * 10 + zz(1, 9), 2), T((z - 1) * 10 + zz(1, 9), 2)]);
      if (!verschieden(zahlen)) return null;
      return auswahl(Z('Drei Zahlen stehen in der Stellenwerttafel.', 'Kreuze die größte Zahl an.'), richtigZuerst(zahlen.map((t) => opt(t, t === sortiere(zahlen).at(-1), 'dezimal-mehr-ziffern'))), tF,
        { bild: tafelVon(['E', 'z', 'h'], zahlen), nachweis: [{ art: 'extrem', was: 'groesste' }] }); },
    () => { const z = zz(2, 7), zahlen = mische([T(z, 1), T(z * 10 + zz(1, 9), 2), T((z + 1) * 10 + zz(1, 9), 2), T(z * 10 - zz(1, 9), 2)]);
      if (!verschieden(zahlen)) return null;
      return ordnen(Z('Ordne die Zahlen der Größe nach.', 'Beginne mit der kleinsten Zahl.'), sortiere(zahlen), tF,
        { bild: tafelVon(['E', 'z', 'h'], zahlen), nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'dezimal-mehr-ziffern' }); },
    () => { const z = zz(3, 9), h = zz(11, 99), a = T(z, 1), c = T(h, 2), kn = kind();
      if (Math.floor(h / 10) >= z || h % 10 === 0) return null;
      return auswahl(Z(`${kn} sagt: „${a} < ${c}“`, `${kn} meint: ${h} ist mehr als ${z}.`, 'Beurteile die Aussage.'), [opt(`Falsch. Es gilt ${a} > ${c}.`, true), opt('Stimmt.', false, 'dezimal-mehr-ziffern'), opt(`Stimmt, denn ${h} > ${z}.`, false, 'dezimal-wie-natuerlich')], tF,
        { bild: tafelVon(['E', 'z', 'h'], [a, c]), nachweis: [URTEIL(false, `${a} < ${c}`)] }); },
    () => { const e = zz(2, 3), z = zz(1, 8), a = T(e * 10 + z, 1), c = T(e * 100 + z * 10 + zz(1, 9), 2), [n1, n2] = [kind(), kind()];
      if (n1 === n2) return null;
      return auswahl(Z(`${n1} und ${n2} springen weit.`, 'Kreuze die größere Weite an.'), richtigZuerst([opt(`${a} m`, d(a, c) > 0, 'dezimal-mehr-ziffern'), opt(`${c} m`, d(c, a) > 0, 'dezimal-mehr-ziffern')]), tF,
        { daten: { kopf: ['Kind', 'Weite'], zeilen: [[n1, `${a} m`], [n2, `${c} m`]] }, nachweis: [{ art: 'extrem', was: 'groesste' }] }); },
  ]);
  const tG = h3('Hänge Endnullen an. Dann haben beide Zahlen gleich viele Stellen.', '0,7 und 0,705 werden zu 0,700 und 0,705. Also ist 0,705 größer.', 'Vergleiche Stelle für Stelle von links. Die erste verschiedene Ziffer entscheidet.');
  sechs(V1, 'G', [
    () => { const g = zz(1, 9), z = zz(1, 8), a = T(g * 100 + z * 10 + zz(1, 9), 2), c = T(g * 1000 + z * 100 + zz(1, 9), 3);
      return auswahl(Z('Kreuze das passende Zeichen an.', `${a} ▢ ${c}`), ZEICHEN(d(a, c), 'dezimal-mehr-ziffern'), tG, { bild: tafelVon(['E', 'z', 'h', 't'], [a, c]), nachweis: [VGL(a, c)] }); },
    () => { const g = zz(1, 8), z = zz(1, 8), zahlen = mische([T(g * 10 + z, 1), T(g * 1000 + z * 100 + zz(1, 9) * 10 + zz(1, 9), 3), T(g * 100 + z * 10 + zz(1, 9), 2), T(g * 1000 + (z - 1) * 100 + zz(1, 9) * 10 + zz(1, 9), 3)]);
      if (!verschieden(zahlen)) return null;
      return ordnen(Z('Ordne die Zahlen der Größe nach.', 'Beginne mit der kleinsten Zahl.'), sortiere(zahlen), tG,
        { bild: tafelVon(['E', 'z', 'h', 't'], zahlen), nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'dezimal-mehr-ziffern' }); },
    () => { const z = zz(2, 7), von = T(z, 1), bis = T(z + 1, 1), richtig = T(z * 100 + zz(1, 9) * 10 + zz(1, 9), 3), unter = T(z * 10 - zz(1, 9), 2), ueber = T((z + 1) * 100 + zz(1, 9), 3);
      return auswahl(Z(`Kreuze die Zahl zwischen ${von} und ${bis} an.`), [opt(richtig, true), opt(unter, false, 'dezimal-mehr-ziffern'), opt(ueber, false, 'dezimal-mehr-ziffern')], tG,
        { nachweis: [{ art: 'zwischen', von, bis }] }); },
    () => { const namen = mische(['Ali', 'Emma', 'Paul', 'Lina']).slice(0, 3), g = zz(13, 14), zeiten = mische([T(g * 100 + zz(1, 9) * 10 + zz(1, 9), 2), T(g * 10 + zz(1, 9), 1), T(g * 100 + zz(1, 9) * 10 + zz(1, 9), 2)]);
      if (!verschieden(zeiten)) return null;
      return auswahl(Z('Drei Kinder laufen 100 m.', 'Die Tabelle zeigt ihre Zeiten in Sekunden.', 'Kreuze die schnellste Zeit an.'), richtigZuerst(zeiten.map((t) => opt(`${t} s`, t === sortiere(zeiten)[0], 'dezimal-mehr-ziffern'))), tG,
        { daten: { kopf: ['Kind', 'Zeit'], zeilen: namen.map((n, i) => [n, `${zeiten[i]} s`]) }, nachweis: [{ art: 'extrem', was: 'kleinste' }] }); },
    () => { const g = zz(1, 4), zahlen = mische([T(g * 1000 + zz(1, 9) * 100 + zz(1, 9), 3), T(g * 10 + zz(1, 9), 1), T(g * 100 + zz(1, 9) * 10 + zz(1, 9), 2), T(g * 1000 + zz(1, 9) * 10 + zz(1, 9), 3)]);
      if (!verschieden(zahlen)) return null;
      return ordnen(Z('Vier Pakete werden gewogen.', 'Ordne die Gewichte der Größe nach.', 'Beginne mit dem schwersten Paket.'), sortiere(zahlen).reverse().map((t) => `${t} kg`), tG,
        { nachweis: [{ art: 'ordnung', richtung: 'ab' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'dezimal-mehr-ziffern' }); },
    () => { const z = zz(5, 9), a = T(z, 1), c = T((z - 1) * 10 + zz(5, 9), 2), kn = kind();
      return auswahl(Z(`${kn} sagt: „Mehr Stellen nach dem Komma machen eine Zahl größer.“`, `${kn} meint deshalb: ${c} > ${a}`, 'Beurteile die Aussage.'), [opt(`Falsch. Es gilt ${a} > ${c}.`, true), opt('Stimmt.', false, 'dezimal-mehr-ziffern'), opt(`Stimmt, denn ${c} hat mehr Stellen.`, false, 'dezimal-mehr-ziffern')], tG,
        { nachweis: [URTEIL(false, `${c} > ${a}`)] }); },
  ]);
  const tM = h2('Fülle mit Endnullen auf, bis alle Zahlen gleich viele Stellen haben. Bei Größen rechne zuerst in dieselbe Einheit um.', 'Vergleiche dann Stelle für Stelle von links. Die erste verschiedene Ziffer entscheidet.');
  sechs(V1, 'M', [
    () => { const g = zz(1, 9), k = zz(101, 999), a = T(g * 10000 + k * 10 + zz(1, 9), 4), c = T(g * 1000 + k, 3);
      if (k % 10 === 0) return null;
      return auswahl(Z('Kreuze das passende Zeichen an.', `${a} ▢ ${c}`), ZEICHEN(d(a, c), 'dezimal-mehr-ziffern'), tM, { nachweis: [VGL(a, c)] }); },
    () => { const km = zz(1, 4), m = zz(1, 9) * 100 + zz(1, 9) * 10, mix = zz(1, 9) * 10 + zz(1, 9);
      const x = zz(1, 9), karten = [`${T(km * 1000 + m, 3)} km`, `${km} km ${mix} m`, `${km * 1000 + m + 5} m`, `${km},0${x} km`];
      const werte = [km * 1000 + m, km * 1000 + mix, km * 1000 + m + 5, km * 1000 + x * 10];
      if (new Set(werte).size !== 4) return null;
      const sortiert = karten.map((t, i) => [t, werte[i]]).sort((x, y) => x[1] - y[1]).map(([t]) => t);
      return ordnen(Z('Ordne die Längen der Größe nach.', 'Beginne mit der kürzesten.'), sortiert, tM, { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'null-platzhalter' }); },
    () => { const z = zz(2, 7), grenze = T(z * 10 + 5, 2), liste = [T(z * 100 + 6 * 10 + zz(1, 9), 3), T(z * 10 + 4, 2) + '9', T(z * 1000 + 5 * 100 + 1, 4), T(z + 1, 1), `${grenze}0`];
      const texte = mische(liste).slice(0, 5);
      if (!verschieden(texte) || texte.every((t) => d(t, grenze) > 0) || texte.every((t) => d(t, grenze) < 0)) return null;
      return auswahl(Z(`Kreuze alle Zahlen an, die größer sind als ${grenze}.`), texte.map((t) => opt(t, d(t, grenze) > 0, d(t, grenze) > 0 ? undefined : 'dezimal-mehr-ziffern')), tM,
        { mehrfach: true, nachweis: [{ art: 'schwelle', wert: grenze, zeichen: '>' }] }); },
    () => { const z = zz(1, 9), zahlen = mische([`0,0${z}0${z}`, `0,0${z}`, `0,0${z}${z}`, `0,${z}00${z}`]);
      return auswahl(Z('Kreuze die kleinste Zahl an.'), richtigZuerst(zahlen.map((t) => opt(t, t === `0,0${z}`, 'dezimal-mehr-ziffern'))), tM, { nachweis: [{ art: 'extrem', was: 'kleinste' }] }); },
    () => { const [name, einheit] = wahl([KONTEXTE.weit, KONTEXTE.wurf]), g = einheit === 'm' && name === 'Weitsprung' ? zz(3, 4) : zz(20, 35), namen = mische(['Ali', 'Emma', 'Paul', 'Lina']);
      const weiten = mische([T(g * 100 + zz(1, 9) * 10 + zz(1, 9), 2), T(g * 10 + zz(1, 9), 1), T(g * 100 + zz(1, 9), 2), T(g * 100 + zz(1, 9) * 10 + zz(1, 9), 2)]);
      if (!verschieden(weiten)) return null;
      return ordnen(Z(`Vier Kinder messen beim ${name} ihre Weiten.`, 'Ordne die Weiten. Beginne mit der größten Weite.'), sortiere(weiten).reverse().map((t) => `${t} ${einheit}`), tM,
        { daten: { kopf: ['Kind', 'Weite'], zeilen: namen.map((n, i) => [n, `${weiten[i]} ${einheit}`]) }, nachweis: [{ art: 'ordnung', richtung: 'ab' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'dezimal-mehr-ziffern' }); },
    () => { const g = zz(2, 9), z = zz(1, 9), a = `${g},0${z}00`, c = `${g},0${z}`, kn = kind();
      return auswahl(Z(`${kn} sagt: „${a} > ${c}“`, `${kn} meint: ${a} hat mehr Stellen.`, 'Beurteile die Aussage.'), [opt(`Falsch. Es gilt ${a} = ${c}.`, true), opt('Stimmt.', false, 'dezimal-mehr-ziffern'), opt(`Falsch. Es gilt ${a} < ${c}.`, false, 'dezimal-endnull'), opt(`Stimmt, denn ${g}0${z}00 > ${g}0${z}.`, false, 'dezimal-wie-natuerlich')], tM,
        { nachweis: [URTEIL(false, `${a} > ${c}`)] }); },
  ]);
  sechs(V1, 'E', [
    () => { const km = zz(2, 8), z = zz(1, 9), a = `${km},${z} km`, rest = wahl([z * 10, z * 100 + wahl([5, 50]), (z - 1) * 100 + 99]), m = km * 1000 + rest;
      if (rest <= 0) return null;
      return auswahl(Z('Kreuze das passende Zeichen an.', `${a} ▢ ${m} m`), ZEICHEN(z * 100 - rest, 'null-platzhalter'), h1('Rechne beide Längen in Meter um. 1 km = 1000 m.'), { nachweis: [VGL(a, `${m} m`)] }); },
    () => { const z = zz(2, 7), von = T(z, 1), bis = T(z * 10 + 1, 2);
      const liste = [[T(z * 100 + 5, 3), true], [T(z * 1000 + 1, 4), true], [T(z * 1000 + 99, 4), true], [bis, false], [T((z - 1) * 100 + 99, 3), false], [T(z * 10 + 2, 2), false]];
      const texte = mische(liste).slice(0, 5);
      if (!texte.some(([, r]) => r) || texte.every(([, r]) => r)) return null;
      return auswahl(Z(`Kreuze alle Zahlen an, die zwischen ${von} und ${bis} liegen.`), texte.map(([t, r]) => opt(t, r, r ? undefined : 'dezimal-mehr-ziffern')),
        h1(`Schreibe ${von} und ${bis} mit vier Stellen nach dem Komma. Dann siehst du, wie viele Zahlen noch Platz haben.`), { mehrfach: true, nachweis: [{ art: 'zwischen', von, bis }] }); },
    () => { const g = zz(2, 8), u = zz(3, 6), grenze = T(g * 100 + u * 10 + 7, 2), liste = [0, 2, 4, 5, 6, 7, 8, 9].map((x) => `${g},${x}7`);
      const texte = mische(liste).slice(0, 5);
      if (!texte.some((t) => d(t, grenze) > 0) || texte.every((t) => d(t, grenze) > 0)) return null;
      return auswahl(Z(`Für ▢ wird eine Ziffer eingesetzt: ${g},▢7 > ${grenze}`, 'Kreuze alle Zahlen an, die so entstehen können.'), texte.map((t) => opt(t, d(t, grenze) > 0, d(t, grenze) > 0 ? undefined : 'zeichen-verwechselt')),
        h1('Die Einer und die Hundertstel sind gleich. Also entscheiden die Zehntel.'), { mehrfach: true, nachweis: [{ art: 'schwelle', wert: grenze, zeichen: '>' }] }); },
    () => { const z = zz(3, 8), k = zz(1, 4), a = T(z, 1), c = T(z * 10 + k, 2), e = T(z * 100 + k, 3), kn = kind();
      return auswahl(Z(`${kn} ordnet drei Zahlen: ${a} < ${c} < ${e}`, 'Finde den Fehler.'), [opt(`Falsch. Es gilt ${a} < ${e} < ${c}.`, true), opt('Stimmt.', false, 'dezimal-mehr-ziffern'), opt(`Falsch. Es gilt ${e} < ${c} < ${a}.`, false, 'dezimal-mehr-ziffern'), opt('Stimmt, denn mehr Stellen machen die Zahl größer.', false, 'dezimal-mehr-ziffern')],
        h1('Fülle alle Zahlen mit Endnullen auf drei Stellen auf und vergleiche dann.'), { nachweis: [URTEIL(false, `${a} < ${c} < ${e}`)] }); },
    () => { const g = zz(1, 3), werte = mische([g * 1000 + zz(1, 9) * 100 + zz(1, 9), g * 1000 + zz(1, 9) * 10, g * 1000 + zz(1, 9) * 100 + zz(1, 9) * 10 + zz(1, 9), g * 1000 + zz(1, 9)]);
      if (new Set(werte).size !== 4) return null;
      const karten = werte.map((w, i) => (i === 0 ? `${w} g` : i === 1 ? `${g} kg ${w - g * 1000} g` : `${T(w, 3)} kg`));
      const sortiert = karten.map((t, i) => [t, werte[i]]).sort((x, y) => x[1] - y[1]).map(([t]) => t);
      return ordnen(Z('Ordne die Gewichte der Größe nach.', 'Beginne mit dem leichtesten.'), sortiert, h1('Rechne alle Gewichte in Gramm um. 1 kg = 1000 g.'), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'null-platzhalter' }); },
    () => { const g = zz(1, 9), z = zz(1, 8), a = T(g * 100 + z * 10 + zz(1, 8), 2), [w] = alsPaar(a), c = T(w + 1, 2), mitte = T(w * 10 + 5, 3);
      return dezimal(Z(`Gib die Zahl an, die genau in der Mitte zwischen ${a} und ${c} liegt.`), mitte, dfe(mitte, [[T(w * 10 + 1, 3), 'dezimal-mehr-ziffern'], [T(w, 2), 'dezimal-mehr-ziffern'], [T(w * 10 + 15, 3), 'dezimal-stelle']]),
        h1(`Hänge an beide Zahlen eine Endnull an. Dann liegen zwischen ihnen 10 Tausendstel.`), { nachweis: [`(${a} + ${c}) : 2 = ${mitte}`] }); },
  ]);

  // ================= V2: Zahlenstrahl ablesen und eintragen =================
  const sF = h3('Schau dir zuerst die beschrifteten Striche an. Zähle die Schritte von Strich zu Strich.', 'Von 0 bis 1 sind es 10 Schritte. Ein Schritt ist dann 0,1.', 'Zähle vom letzten beschrifteten Strich bis zum Pfeil.');
  sechs(V2, 'F', [
    () => { const p = wahl([zz(1, 9), zz(11, 19)]);
      if (p % 5 === 0) return null;
      return strahl('ablesen', Z('Lies die Zahl am Pfeil ab.'), strahlSpec(0, 20, 10, 5, { pfeil: p }), T(p, 1), dfe(T(p, 1), [[p, 'strahl-einerschritte'], [T(p, 2), 'dezimal-stelle']]), sF, { nachweis: [{ art: 'strahl', zahl: T(p, 1) }] }); },
    () => { const p = zz(1, 19);
      if (p % 5 === 0) return null;
      return strahl('markieren', Z(`Markiere ${T(p, 1)} am Zahlenstrahl.`), strahlSpec(0, 20, 10, 5), p, fehlerliste(p, [[p + 1, 'strahl-einerschritte'], [p - 1, 'strahl-einerschritte']].filter(([w]) => w > 0 && w < 20)), sF, { nachweis: [{ art: 'strahl', zahl: T(p, 1) }] }); },
    () => { const z = zz(1, 8), p = z * 10 + zz(1, 9);
      if (p % 5 === 0) return null;
      return strahl('ablesen', Z('Der Zahlenstrahl zeigt nur ein Stück.', 'Lies die Zahl am Pfeil ab.'), strahlSpec(z * 10, z * 10 + 10, 100, 5, { pfeil: p }), T(p, 2), dfe(T(p, 2), [[T(p, 1), 'dezimal-stelle'], [T(z * 100 + (p % 10), 3), 'null-platzhalter']]),
        h3('Hier geht der Strahl von einem Zehntel zum nächsten.', 'Von 0,3 bis 0,4 sind es 10 Schritte. Ein Schritt ist 0,01.', 'Zähle die Hundertstel vom linken Strich bis zum Pfeil.'), { nachweis: [{ art: 'strahl', zahl: T(p, 2) }] }); },
    () => { const z = zz(1, 8), p = z * 10 + zz(1, 9);
      if (p % 5 === 0) return null;
      return strahl('markieren', Z('Der Zahlenstrahl zeigt nur ein Stück.', `Markiere ${T(p, 2)}.`), strahlSpec(z * 10, z * 10 + 10, 100, 5), p, fehlerliste(p, [[z * 10 + (10 - (p % 10)), 'strahl-gespiegelt']]),
        h3('Hier geht der Strahl von einem Zehntel zum nächsten.', '0,37 liegt 7 Schritte rechts von 0,3.', 'Suche das passende Zehntel links. Zähle dann die Hundertstel ab.'), { nachweis: [{ art: 'strahl', zahl: T(p, 2) }] }); },
    () => { const z = zz(1, 8), h = zz(1, 9), p = z * 10 + h;
      if (h === 5 || h === z) return null;
      return auswahl(Z('Der Pfeil zeigt auf eine Zahl.', 'Kreuze die passende Zahl an.'), [opt(T(p, 2), true), opt(T(h * 10 + z, 2), false, 'stellenwert'), opt(T(z * 10 + 10 - h, 2), false, 'strahl-gespiegelt')],
        h3('Lies zuerst das Zehntel links vom Pfeil ab.', 'Steht links 0,3 und sind es 7 Schritte, zeigt der Pfeil auf 0,37.', 'Zähle die kleinen Schritte vom linken Strich bis zum Pfeil.'), { bild: B.strahl(strahlSpec(z * 10, z * 10 + 10, 100, 5, { pfeil: p })), nachweis: [{ art: 'strahl', zahl: T(p, 2) }, { art: 'wert', wert: T(p, 2) }] }); },
    () => { const p = wahl([5, 15, 25, 35, 45, 55, 65, 85, 95]);
      return strahl('ablesen', Z('Lies die Zahl am Pfeil ab.', 'Achte auf die Schrittweite.'), strahlSpec(0, 100, 100, 50, { schritt: 5, pfeil: p }), T(p, 2), dfe(T(p, 2), [[T(p / 5, 2), 'strahl-einerschritte'], [T(p / 5, 1), 'strahl-einerschritte']]),
        h3('Von 0 bis 0,5 sind es 10 Schritte.', 'Dann ist ein Schritt 0,05. Zwei Schritte sind 0,1.', 'Rechne aus, wie groß ein Schritt ist. Zähle dann bis zum Pfeil.'), { nachweis: [{ art: 'strahl', zahl: T(p, 2) }] }); },
  ]);
  const sG = h3('Ein Schritt zwischen zwei Hundertsteln ist ein Tausendstel.', 'Von 2,34 bis 2,35 sind es 10 Schritte. Ein Schritt ist 0,001.', 'Lies den beschrifteten Strich links vom Pfeil ab. Zähle dann die Schritte.');
  sechs(V2, 'G', [
    () => { const h = zz(101, 899), p = h * 10 + zz(1, 9);
      if (p % 5 === 0 || h % 10 === 0) return null;
      return strahl('ablesen', Z('Lies die Zahl am Pfeil ab.'), strahlSpec(h * 10, h * 10 + 10, 1000, 5, { pfeil: p }), T(p, 3), dfe(T(p, 3), [[T(h * 10 + (p % 10) * 100, 3), 'stellenwert'], [T(p, 2), 'dezimal-stelle']]), sG, { nachweis: [{ art: 'strahl', zahl: T(p, 3) }] }); },
    () => { const h = zz(101, 899), p = h * 10 + zz(1, 9);
      if (p % 5 === 0 || h % 10 === 0) return null;
      return strahl('markieren', Z(`Markiere ${T(p, 3)} am Zahlenstrahl.`), strahlSpec(h * 10, h * 10 + 10, 1000, 5), p, fehlerliste(p, [[h * 10 + 10 - (p % 10), 'strahl-gespiegelt']]), sG, { nachweis: [{ art: 'strahl', zahl: T(p, 3) }] }); },
    () => { const z = zz(1, 8), p = z * 100 + wahl([2, 4, 6, 8, 12, 14, 16, 18]);
      return strahl('ablesen', Z('Lies die Zahl am Pfeil ab.', 'Achte auf die Schrittweite.'), strahlSpec(z * 100, z * 100 + 20, 1000, 10, { schritt: 2, pfeil: p }), T(p, 3), dfe(T(p, 3), [[T(z * 100 + (p - z * 100) / 2, 3), 'strahl-einerschritte'], [T(p, 2), 'dezimal-stelle']]),
        h3('Von einem beschrifteten Strich zum nächsten sind es 5 Schritte.', 'Von 0,1 bis 0,11 sind es 10 Tausendstel. Ein Schritt ist dann 0,002.', 'Rechne zuerst aus, wie groß ein Schritt ist.'), { nachweis: [{ art: 'strahl', zahl: T(p, 3) }] }); },
    () => { const g = zz(1, 8), p = g * 100 + zz(1, 19), von = g * 100;
      if (p % 5 === 0) return null;
      return strahl('markieren', Z(`Markiere ${T(p, 2)} am Zahlenstrahl.`), strahlSpec(von, von + 20, 100, 10), p, fehlerliste(p, [[von + 20 - (p - von), 'strahl-gespiegelt']]),
        h3('Zwischen zwei beschrifteten Strichen liegen 10 Hundertstel.', `Von ${T(von, 2)} bis ${T(von + 10, 2)} sind es 10 Schritte.`, 'Suche den passenden beschrifteten Strich. Zähle dann ab.'), { nachweis: [{ art: 'strahl', zahl: T(p, 2) }] }); },
    () => { const z = zz(11, 89), t = zz(1, 9), p = z * 10 + t;
      if (z % 10 === 0 || t === 5) return null;
      return auswahl(Z('Der Pfeil zeigt auf eine Zahl.', 'Kreuze die passende Zahl an.'), [opt(T(p, 3), true), opt(T(Math.floor(z / 10) * 100 + t, 3), false, 'null-platzhalter'), opt(T(z * 10 + 10 - t, 3), false, 'strahl-gespiegelt')],
        sG, { bild: B.strahl(strahlSpec(z * 10, z * 10 + 10, 1000, 5, { pfeil: p })), nachweis: [{ art: 'strahl', zahl: T(p, 3) }, { art: 'wert', wert: T(p, 3) }] }); },
    () => { const g = zz(1, 8), h = zz(1, 9), p = g * 10 + h, falsch = `0,${g}0${h}`, kn = kind();
      if (h === 5) return null;
      return auswahl(Z(`${kn} liest am Pfeil ${falsch} ab.`, 'Beurteile das Ergebnis.'), [opt(`Falsch. Der Pfeil zeigt auf ${T(p, 2)}.`, true), opt('Stimmt.', false, 'null-platzhalter'), opt(`Stimmt, denn ${h} Schritte sind ${h} Tausendstel.`, false, 'dezimal-stelle')],
        h3('Von einem beschrifteten Strich zum nächsten ist es ein Zehntel.', 'Von Strich zu Strich sind es 10 Schritte. Ein Schritt ist 0,01.', 'Zähle die Schritte und prüfe, wie groß einer ist.'), { bild: B.strahl(strahlSpec(g * 10, g * 10 + 10, 100, 5, { pfeil: p })), nachweis: [{ art: 'strahl', zahl: T(p, 2) }, URTEIL(false, `${falsch} = ${T(p, 2)}`)] }); },
  ]);
  const sM = h2('Die Lupe vergrößert einen kleinen Abschnitt des Strahls zehnfach. Unten siehst du die nächste Stelle nach dem Komma.', 'Lies zuerst oben ab, wo die Lupe liegt. Zähle dann unten die Schritte bis zum Pfeil.');
  sechs(V2, 'M', [
    () => { const z = zz(1, 8), h = z * 10 + zz(1, 8), p = h * 10 + zz(1, 9);
      if (p % 5 === 0) return null;
      return dezimal(Z('Die Lupe vergrößert einen Abschnitt.', 'Lies die Zahl am Pfeil ab.'), T(p, 3), dfe(T(p, 3), [[T(h, 2), 'strahl-zu-grob'], [T(z * 100 + (p % 10), 3), 'null-platzhalter']]), sM,
        { bild: lupe(z * 10, z * 10 + 10, 100, h, { pfeil: p }), nachweis: [{ art: 'strahl', zahl: T(p, 3) }] }); },
    () => { const t = zz(1001, 8999), p = t * 10 + zz(1, 9);
      if (p % 5 === 0 || t % 10 === 0) return null;
      return strahl('markieren', Z(`Markiere ${T(p, 4)} am Zahlenstrahl.`), strahlSpec(t * 10, t * 10 + 10, 10000, 5), p, fehlerliste(p, [[t * 10 + 10 - (p % 10), 'strahl-gespiegelt']]),
        h2('Zwischen zwei beschrifteten Strichen liegen hier Zehntausendstel.', 'Lies den linken Strich ab. Die letzte Ziffer sagt, wie viele Schritte du nach rechts gehst.'), { nachweis: [{ art: 'strahl', zahl: T(p, 4) }] }); },
    () => { const g = zz(1, 8), h = g * 10 + zz(1, 8), t = zz(1, 9), p = h * 10 + t;
      if (t === 5) return null;
      return auswahl(Z('Die Lupe vergrößert einen Abschnitt.', 'Kreuze die Zahl am Pfeil an.'), [opt(T(p, 3), true), opt(T(h, 2), false, 'strahl-zu-grob'), opt(T(g * 100 + t, 3), false, 'null-platzhalter'), opt(T(h * 10 + 10 - t, 3), false, 'strahl-gespiegelt')], sM,
        { bild: lupe(g * 10, g * 10 + 10, 100, h, { pfeil: p }), nachweis: [{ art: 'strahl', zahl: T(p, 3) }, { art: 'wert', wert: T(p, 3) }] }); },
    () => { const t = zz(1001, 8999), p = t * 10 + zz(1, 9);
      if (p % 5 === 0 || t % 10 === 0) return null;
      return strahl('ablesen', Z('Lies die Zahl am Pfeil ab.'), strahlSpec(t * 10, t * 10 + 10, 10000, 5, { pfeil: p }), T(p, 4), dfe(T(p, 4), [[T(t, 3), 'strahl-zu-grob'], [T(t * 10 + 10 - (p % 10), 4), 'strahl-gespiegelt']]),
        h2('Der Strahl geht von einem Tausendstel zum nächsten. Ein Schritt ist ein Zehntausendstel.', 'Lies den linken Strich ab und hänge die Anzahl der Schritte als vierte Stelle an.'), { nachweis: [{ art: 'strahl', zahl: T(p, 4) }] }); },
    () => { const z = zz(11, 89), von = z * 10, p = von + wahl([5, 15]);
      if (z % 10 === 0) return null;
      return strahl('markieren', Z(`Markiere ${T(p, 3)} am Zahlenstrahl.`, 'Achte auf die Schrittweite.'), strahlSpec(von, von + 20, 1000, 10, { schritt: 5 }), p, fehlerliste(p, [[von + 10, 'strahl-einerschritte']]),
        h2('Zwischen zwei beschrifteten Strichen liegen hier nur 2 Schritte. Ein Schritt ist 0,005.', 'Rechne aus, wie viele Schritte du vom linken Strich gehen musst.'), { nachweis: [{ art: 'strahl', zahl: T(p, 3) }] }); },
    () => { const g = zz(1, 8), h = g * 10 + zz(1, 8), t = zz(1, 9), p = h * 10 + t, kn = kind(), falsch = T(g * 10 + t, 2);
      if (t === 5 || falsch === T(p, 3)) return null;
      return auswahl(Z(`${kn} liest unten an der Lupe ${falsch} ab.`, 'Beurteile das Ergebnis.'), [opt(`Falsch. Der Pfeil zeigt auf ${T(p, 3)}.`, true), opt('Stimmt.', false, 'null-platzhalter'), opt(`Stimmt, denn unten sind es ${t} Schritte.`, false, 'dezimal-stelle')], sM,
        { bild: lupe(g * 10, g * 10 + 10, 100, h, { pfeil: p }), nachweis: [{ art: 'strahl', zahl: T(p, 3) }, URTEIL(false, `${falsch} = ${T(p, 3)}`)] }); },
  ]);
  sechs(V2, 'E', [
    () => { const g = zz(1, 8), h = g * 100 + zz(11, 89), t = h * 10 + zz(1, 9);
      if (t % 5 === 0 || h % 10 === 0) return null;
      return dezimal(Z('Die Lupe vergrößert einen Abschnitt.', 'Lies die Zahl am Pfeil ab.'), T(t, 4), dfe(T(t, 4), [[T(h, 3), 'strahl-zu-grob'], [T(h * 10 + 10 - (t % 10), 4), 'strahl-gespiegelt']]),
        h1('Oben zählt der Strahl in Tausendsteln, unten in Zehntausendsteln. Lies erst oben, dann unten ab.'), { bild: lupe(Math.floor(h / 10) * 10, Math.floor(h / 10) * 10 + 10, 1000, h, { pfeil: t }), nachweis: [{ art: 'strahl', zahl: T(t, 4) }] }); },
    () => { const t = zz(1001, 8999), p = t * 10 + wahl([2, 4, 6, 8, 12, 14, 16, 18]);
      if (t % 10 === 0) return null;
      return strahl('markieren', Z(`Markiere ${T(p, 4)} am Zahlenstrahl.`), strahlSpec(t * 10, t * 10 + 20, 10000, 10, { schritt: 2 }), p, fehlerliste(p, [[t * 10 + (p - t * 10) / 2 + ((p - t * 10) / 2) % 2, 'strahl-einerschritte']].filter(([w]) => w !== p && (w - t * 10) % 2 === 0)),
        h1('Rechne aus, wie groß ein Schritt ist: Von einem beschrifteten Strich zum nächsten sind es 5 Schritte.'), { nachweis: [{ art: 'strahl', zahl: T(p, 4) }] }); },
    () => { const z = zz(11, 89), a = T(z, 2), c = T(z + 1, 2), m = z * 10 + 5;
      if (z % 10 === 9) return null;
      return strahl('markieren', Z(`Markiere die Zahl, die genau in der Mitte zwischen ${a} und ${c} liegt.`), strahlSpec(z * 10, z * 10 + 10, 1000, 10), m, [],
        h1('Hänge an beide Zahlen eine Endnull an. Zwischen ihnen liegen 10 Tausendstel.'), { nachweis: [`(${a} + ${c}) : 2 = ${T(m, 3)}`, { art: 'strahl', zahl: T(m, 3), rechnung: true }] }); },
    () => { const z = zz(11, 89), p = z * 10 + wahl([2, 4, 6, 8, 12, 14, 16, 18]), kn = kind(), falsch = T(z * 10 + (p - z * 10) / 2, 3);
      if (z % 10 === 0 || falsch === T(p, 3)) return null;
      return auswahl(Z(`${kn} liest am Pfeil ${falsch} ab.`, 'Beurteile das Ergebnis und begründe.'), [opt(`Falsch. Ein Schritt ist 0,002. Der Pfeil zeigt auf ${T(p, 3)}.`, true), opt('Stimmt.', false, 'strahl-einerschritte'), opt('Stimmt, denn jeder Strich ist ein Tausendstel.', false, 'strahl-einerschritte')],
        h1('Prüfe zuerst, wie groß ein Schritt ist. Rechne dann nach.'), { bild: B.strahl(strahlSpec(z * 10, z * 10 + 20, 1000, 10, { schritt: 2, pfeil: p })), nachweis: [{ art: 'strahl', zahl: T(p, 3) }, URTEIL(false, `${falsch} = ${T(p, 3)}`)] }); },
    () => { const g = zz(1, 8), h = g * 100 + zz(11, 89), t = h * 10 + wahl([2, 4, 6, 8]);
      if (h % 10 === 0) return null;
      return dezimal(Z('Die Lupe vergrößert einen Abschnitt.', 'Unten ist nur jeder zweite Schritt gezeichnet.', 'Lies die Zahl am Pfeil ab.'), T(t, 4), dfe(T(t, 4), [[T(h * 10 + (t % 10) / 2, 4), 'strahl-einerschritte'], [T(h, 3), 'strahl-zu-grob']]),
        h1('Unten liegen zwischen zwei Tausendsteln 5 Schritte. Ein Schritt ist 0,0002.'), { bild: lupe(Math.floor(h / 10) * 10, Math.floor(h / 10) * 10 + 10, 1000, h, { schritt: 2, beschriftung: 10, pfeil: t }), nachweis: [{ art: 'strahl', zahl: T(t, 4) }] }); },
    () => { const z = zz(2, 7), a = T(z, 1), c = T(z + 1, 1);
      const liste = [[`${a} < ${T(z * 10 + 5, 2)} < ${c}`, true], [`${a} < ${T(z * 100 + 5, 3)} < ${c}`, true], [`${a} < ${T(z * 1000 + 999, 4)} < ${c}`, true], [`${a} < ${T((z + 1) * 1000 + 5, 4)} < ${c}`, false], [`${a} < ${T(z * 10 - 1, 2)} < ${c}`, false]];
      return auswahl(Z(`Zwischen ${a} und ${c} liegen viele Dezimalzahlen.`, 'Kreuze alle Aussagen an, die stimmen.'), liste.map(([t, r]) => opt(t, r, r ? undefined : 'dezimal-mehr-ziffern')),
        h1('Hänge Endnullen an, bis alle Zahlen vier Stellen haben. Vergleiche dann.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
  ]);
}
