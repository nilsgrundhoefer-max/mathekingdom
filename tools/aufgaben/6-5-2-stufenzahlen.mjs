// Aufgaben zu 6.5.2 „Mit Stufenzahlen multiplizieren und dividieren“ (Lernziele S1, S2) nach ADR 0015 und ADR 0048.
// S1: mal und durch 10, 100, 1000 (Kommaverschiebung), ab M auch mal 0,1 und 0,01. S2: Größen umrechnen und Sachaufgaben.
// F und G sehen die Stellenwerttafel mit Verschiebepfeilen.

import { sechs, auswahl, luecken, dezimal, Z, h1, h2, h3 } from '../werkzeug.mjs';
import { B, zz, wahl, mische, kind, opt, T, dfe, URTEIL, FREI, P, mal, durch, dez, euro, schiebe, wert } from './6-5-rechnen.mjs';
import { ziffernFuer } from './6-4-dezimal.mjs';
import { geldStuecke } from './6-5-1-addieren.mjs';

const S1 = '6.5.2-S1', S2 = '6.5.2-S2';
const H = (wert, grund) => ({ wert: String(wert), grund });
const num = (t) => (/^\d+$/.test(String(t)) ? Number(t) : t);
// Die Zahl t in einer Stellenwerttafel mit den Spalten `spalten`. Nach der letzten Ziffer hinter dem Komma bleiben die Felder leer.
const zeileVon = (spalten, t) => { const [z, k] = P(t), e = spalten.indexOf('E'), zeile = ziffernFuer(spalten, z, k);
  return zeile.map((x, i) => (i > e && i - e > k ? null : x)); };
const tafel = (spalten, t, rechnung) => B.schiebeTafel(spalten, zeileVon(spalten, t), rechnung);
const SP = ['T', 'H', 'Z', 'E', 'z', 'h', 't'];
// Nur so viele Spalten, wie die Zahl vorher und nachher braucht.
const spaltenFuer = (...zahlen) => { const g = Math.max(...zahlen.map((t) => String(Math.floor(wert(t))).length)), k = Math.max(1, ...zahlen.map((t) => P(t)[1]));
  return SP.slice(4 - g, 4 + k); };
const stufe = (s) => 10 ** Math.abs(s);
const rechenzeichen = (s) => (s > 0 ? `· ${stufe(s)}` : `: ${stufe(s)}`);
// Typische Fehler bei der Kommaverschiebung: falsche Richtung, Null angehängt, um eine Stelle zu wenig.
const schiebeFehler = (t, s) => [[schiebe(t, -s), 'komma-falsche-richtung'], ...(s > 0 ? [[`${t}${'0'.repeat(s)}`.includes(',') ? `${t}${'0'.repeat(s)}` : null, 'stufe-null-angehaengt']] : []), [schiebe(t, s > 0 ? s - 1 : s + 1), 'dezimal-stelle']];

const tF = h3('Schau auf die Pfeile in der Tafel.', 'Bei 2,5 · 10 rückt die 2 zu den Zehnern und die 5 zu den Einern. Das ist 25.', 'Jede Ziffer rückt so viele Stellen weiter, wie die Stufenzahl Nullen hat.');
const tG = h3('Zähle die Nullen der Stufenzahl.', '3,45 · 100: Zwei Nullen, also rückt das Komma zwei Stellen nach rechts. Das ist 345.', 'Mal: Komma nach rechts. Durch: Komma nach links. Fehlende Stellen füllst du mit Nullen.');
const tM = h2('Mal 10, 100, 1000 verschiebt das Komma nach rechts, durch 10, 100, 1000 nach links.', 'Mal 0,1 ist dasselbe wie durch 10, mal 0,01 dasselbe wie durch 100.');

const aufgabeS = (t, s, text, hilfen, mitBild) => { const l = schiebe(t, s);
  return dezimal(text ?? Z(`Rechne: ${t} ${rechenzeichen(s)}`), l, dfe(l, schiebeFehler(t, s)), hilfen,
    { ...(mitBild ? { bild: tafel(spaltenFuer(t, l), t, rechenzeichen(s)) } : {}), nachweis: [`${t} ${rechenzeichen(s)} = ${l}`] }); };

export function stufenzahlen6() {
  // ================= S1: Kommaverschiebung =================
  sechs(S1, 'F', [
    () => aufgabeS(dez(1, 1.1, 9.9), 1, null, tF, true),
    () => aufgabeS(dez(2, 0.11, 0.99), 2, null, tF, true),
    () => aufgabeS(dez(1, 1.1, 9.9), -1, null, h3('Schau auf die Pfeile in der Tafel.', 'Bei 4,5 : 10 rückt die 4 zu den Zehnteln und die 5 zu den Hundertsteln. Das ist 0,45.', 'Vor das Komma schreibst du dann eine 0.'), true),
    () => aufgabeS(String(zz(11, 99)), -2, null, h3('Schau auf die Pfeile in der Tafel.', 'Bei 35 : 100 rückt die 3 zu den Zehnteln. Das ist 0,35.', 'Vor das Komma schreibst du eine 0.'), true),
    () => { const t = dez(1, 1.1, 9.9), l = schiebe(t, 1);
      return luecken(Z('Die Tafel zeigt oben die Zahl vorher und unten nachher.', 'Setze die Stufenzahl ein.', `${t} · {{a}} = ${l}`), { a: [10, dfe(10, [[100, 'dezimal-stelle']])] }, tF, { bild: { art: 'tafel', spalten: spaltenFuer(t, l), werte: zeileVon(spaltenFuer(t, l), t), weitere: [zeileVon(spaltenFuer(t, l), l)], komma: spaltenFuer(t, l).indexOf('E') }, nachweis: [`${l} : ${t} = 10`] }); },
    () => aufgabeS(T(zz(1, 9), 1), 1, null, h3('Schau auf die Pfeile in der Tafel.', '0,4 · 10 = 4. Aus 4 Zehnteln werden 4 Einer.', 'Eine 0 vor dem Komma fällt dann weg.'), true),
  ]);
  sechs(S1, 'G', [
    () => aufgabeS(dez(2, 1.01, 9.99), 2, null, tG, true),
    () => aufgabeS(dez(1, 10.1, 99.9), -2, null, tG, true),
    () => { const t = dez(2, 0.11, 0.99), s = wahl([2, 3]), l = schiebe(t, s);
      return luecken(Z('Setze die passende Stufenzahl ein.', `${t} · {{a}} = ${l}`), { a: [stufe(s), dfe(stufe(s), [[stufe(s - 1), 'dezimal-stelle'], [stufe(s + 1), 'dezimal-stelle']])] }, tG, { nachweis: [`${l} : ${t} = ${stufe(s)}`] }); },
    () => aufgabeS(T(zz(1, 9), 1), 3, null, tG, true),
    () => { const t = dez(1, 1.1, 9.9), a = schiebe(t, 1), l = schiebe(a, -2);
      return dezimal(Z(`Rechne von links nach rechts: ${t} · 10 : 100`), l, dfe(l, [[a, 'sach-schritt-vergessen'], [schiebe(t, 3), 'komma-falsche-richtung']]), tG, { nachweis: [`${t} · 10 = ${a}`, `${a} : 100 = ${l}`] }); },
    () => { const t = dez(2, 1.11, 9.99), falsch = `${t}0`, r = schiebe(t, 1), kn = kind();
      return auswahl(Z(`${kn} rechnet: ${t} · 10 = ${falsch}`, 'Beurteile die Rechnung.'), [opt(`Falsch. Das Komma rückt eine Stelle nach rechts. Es gilt ${t} · 10 = ${r}.`, true), opt('Stimmt. Bei mal 10 hängt man immer eine Null an die Zahl an.', false, 'stufe-null-angehaengt'), opt(`Stimmt, denn ${falsch} hat eine Null mehr.`, false, 'stufe-null-angehaengt')],
        h3('Eine Endnull ändert den Wert nicht.', `${t} und ${falsch} sind gleich viel.`, 'Mal 10 muss aber mehr ergeben.'), { nachweis: [URTEIL(false, `${t} · 10 = ${falsch}`)] }); },
  ]);
  sechs(S1, 'M', [
    () => aufgabeS(dez(3, 0.011, 0.099), 3, null, tM, false),
    () => aufgabeS(dez(1, 1.1, 9.9), -3, null, tM, false),
    () => { const t = String(zz(11, 99)), l = schiebe(t, -1);
      return dezimal(Z(`Berechne: ${t} · 0,1`), l, dfe(l, [[schiebe(t, 1), 'mal-macht-groesser'], [schiebe(t, -2), 'dezimal-stelle']]), tM, { nachweis: [`${t} · 0,1 = ${l}`] }); },
    () => { const l = dez(2, 0.11, 0.99), t = schiebe(l, 2);
      return luecken(Z('Ergänze die fehlende Zahl.', `{{a}} : 100 = ${l}`), { a: [num(t), dfe(t, [[schiebe(l, -2), 'komma-falsche-richtung']])] }, tM, { nachweis: [`${l} · 100 = ${t}`] }); },
    () => { const t = dez(1, 1.1, 9.9), l = schiebe(t, -2);
      return dezimal(Z(`Berechne: ${t} · 0,01`), l, dfe(l, [[schiebe(t, 2), 'mal-macht-groesser'], [schiebe(t, -1), 'dezimal-stelle']]), tM, { nachweis: [`${t} · 0,01 = ${l}`] }); },
    () => { const t = dez(1, 1.1, 9.9), l = schiebe(t, -1), opts = [[`${t} · 0,1`, true], [schiebe(t, 1) === l ? null : `${schiebe(t, 1)} : 100`, true], [`${t} · 10`, false], [`${schiebe(t, -2)} · 100`, false]];
      return auswahl(Z(`Kreuze alle Rechnungen an, die dasselbe Ergebnis haben wie ${t} : 10.`), opts.filter(([x]) => x).map(([x, r]) => opt(x, r, r ? undefined : x.includes('· 10') && !x.includes('100') ? 'komma-falsche-richtung' : 'dezimal-stelle')), h2('Rechne jede Rechnung aus.', `${t} : 10 = ${l}. Vergleiche damit.`), { mehrfach: true, nachweis: [`${t} : 10 = ${l}`, { art: 'wert', wert: l }] }); },
  ]);
  sechs(S1, 'E', [
    () => { const l = dez(4, 0.0101, 0.0999), t = schiebe(l, 4);
      return luecken(Z('Setze die passende Stufenzahl ein.', `${l} · {{a}} = ${t}`), { a: [10000, dfe(10000, [[1000, 'dezimal-stelle']])] }, h1('Zähle, um wie viele Stellen das Komma gerückt ist.'), { nachweis: [`${t} : ${l} = 10000`] }); },
    () => { const t = dez(1, 1.1, 9.9), l = schiebe(t, -2);
      return luecken(Z('Ergänze die fehlende Zahl.', `{{a}} · 100 = ${t}`), { a: [l, dfe(l, [[schiebe(t, 2), 'komma-falsche-richtung']])] }, h1('Rechne rückwärts: Die Umkehraufgabe von mal 100 ist durch 100.'), { nachweis: [`${t} : 100 = ${l}`] }); },
    () => { const t = T(zz(1, 9), 1), l = schiebe(t, 1);
      return dezimal(Z(`Berechne: ${t} : 0,1`), num(l), dfe(l, [[schiebe(t, -1), 'div-macht-kleiner'], [schiebe(t, 2), 'dezimal-stelle']]), h1('Überlege, wie oft 0,1 in die Zahl passt.'), { nachweis: [`${t} : 0,1 = ${l}`] }); },
    () => { const opts = [['Jede Ziffer wird zehnmal so viel wert und rückt eine Stelle nach links.', true], ['Beim Malnehmen mit zehn hängt man immer eine Null an die Zahl an.', false], ['Das Komma rückt nach rechts, weil man von rechts nach links rechnet.', false]];
      return auswahl(Z('Kreuze die Begründung an, warum bei mal 10 das Komma eine Stelle nach rechts rückt.'), opts.map(([x, r]) => opt(x, r, r ? undefined : x.includes('Null') ? 'stufe-null-angehaengt' : 'komma-falsche-richtung')), h1('Denke an die Stellenwerttafel: Was passiert mit einem Zehntel, wenn du es mal 10 nimmst?'), { nachweis: [FREI('Kommaverschiebung begründen')] }); },
    () => { const t = dez(1, 1.1, 9.9), a = schiebe(t, 2), b = schiebe(a, -3), l = schiebe(b, 1);
      return dezimal(Z(`Rechne von links nach rechts: ${t} · 100 : 1000 · 10`), num(l), dfe(l, [[b, 'sach-schritt-vergessen'], [schiebe(t, 1), 'komma-falsche-richtung']]), h1('Zähle zusammen: Wie viele Stellen nach rechts und wie viele nach links?'), { nachweis: [`${t} · 100 = ${a}`, `${a} : 1000 = ${b}`, `${b} · 10 = ${l}`] }); },
    () => { const z = zz(2, 9), opts = mische([[`${z} · 0,1 = ${T(z, 1)}`, true], [`${z} · 0,1 = ${z * 10}`, false], [`${z} : 0,1 = ${z * 10}`, true], [`${z} : 0,1 = ${T(z, 1)}`, false]]);
      return auswahl(Z('Kreuze alle Rechnungen an, die stimmen.'), opts.map(([x, r]) => opt(x, r, r ? undefined : x.includes('·') ? 'mal-macht-groesser' : 'div-macht-kleiner')), h1('Mal 0,1 ist dasselbe wie durch 10. Durch 0,1 ist dasselbe wie mal 10.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
  ]);

  // ================= S2: Größen und Sachaufgaben =================
  const ctAufgabe = (t) => { const ct = P(euro(t))[0];
    return dezimal(Z(`Das Geld ist ${euro(t)} €.`, '1 € sind 100 ct.', 'Gib den Betrag in Cent an.'), ct, dfe(ct, [[Math.floor(wert(t)) * 100 + (ct % 100) / 10, 'dezimal-stelle'], [euro(t).replace(',', ''), null]].filter(([, f]) => f)),
      h3('1 € = 100 ct. Rechne mal 100.', '2,30 € = 230 ct, denn 2,30 · 100 = 230.', 'Das Komma rückt zwei Stellen nach rechts.'), { einheit: 'ct', bild: B.geld(geldStuecke(ct)), nachweis: ['1 € = 100 ct', `${euro(t)} € = ${ct} ct`] }); };
  sechs(S2, 'F', [
    () => ctAufgabe(dez(2, 1.05, 4.95)),
    () => ctAufgabe(dez(1, 2.1, 5.9)),
    () => { const ct = zz(105, 495), l = euro(T(ct, 2));
      return dezimal(Z(`Das Geld ist ${ct} ct.`, '100 ct sind 1 €.', 'Gib den Betrag in Euro an.'), l, dfe(l, [[T(ct, 1), 'dezimal-stelle'], [ct * 100, 'komma-falsche-richtung']]),
        h3('100 ct = 1 €. Rechne durch 100.', '230 ct = 2,30 €.', 'Das Komma rückt zwei Stellen nach links.'), { einheit: '€', bild: B.geld(geldStuecke(ct)), nachweis: ['100 ct = 1 €', `${ct} ct = ${l} €`] }); },
    () => { const t = dez(1, 1.1, 4.9), l = schiebe(t, 2);
      return dezimal(Z(`Ein Brett ist ${t} m lang.`, '1 m sind 100 cm.', 'Rechne · 100 und gib die Länge in cm an.'), num(l), dfe(l, [[schiebe(t, 1), 'dezimal-stelle'], [schiebe(t, -2), 'komma-falsche-richtung']]), tF,
        { einheit: 'cm', bild: tafel(spaltenFuer(t, l), t, '· 100'), nachweis: ['1 m = 100 cm', `${t} · 100 = ${l}`, `${t} m = ${l} cm`] }); },
    () => { const p = euro(T(zz(11, 99) * 5 > 400 ? 85 : zz(11, 49), 2)), l = euro(schiebe(p, 1)), kn = kind();
      return dezimal(Z(`Ein Heft kostet ${p} €.`, `${kn} kauft 10 Hefte.`, 'Gib den Preis für alle Hefte an.'), l, dfe(l, [[euro(schiebe(p, 2)), 'dezimal-stelle'], [euro(schiebe(p, -1)), 'komma-falsche-richtung']]), tF,
        { einheit: '€', bild: B.geld(geldStuecke(P(p)[0])), nachweis: [`${p} € · 10 = ${l} €`] }); },
    () => ctAufgabe(T(zz(1, 9) * 100 + zz(1, 9) * 10, 2)),
  ]);
  sechs(S2, 'G', [
    () => { const t = dez(2, 1.11, 9.99), l = schiebe(t, 2);
      return dezimal(Z(`Gib ${t} m in cm an.`, '1 m = 100 cm.', 'Rechne also · 100.'), num(l), dfe(l, [[schiebe(t, 1), 'umrechnungszahl'], [schiebe(t, -2), 'umrechnungsrichtung']]), tG,
        { einheit: 'cm', bild: tafel(spaltenFuer(t, l), t, '· 100'), nachweis: ['1 m = 100 cm', `${t} · 100 = ${l}`, `${t} m = ${l} cm`] }); },
    () => { const t = dez(1, 1.1, 9.9), l = schiebe(t, 3);
      return dezimal(Z(`Gib ${t} kg in g an.`, '1 kg = 1000 g.', 'Rechne also · 1000.'), num(l), dfe(l, [[schiebe(t, 2), 'umrechnungszahl'], [schiebe(t, -3), 'umrechnungsrichtung']]), tG,
        { einheit: 'g', bild: tafel(spaltenFuer(t, l), t, '· 1000'), nachweis: ['1 kg = 1000 g', `${t} · 1000 = ${l}`, `${t} kg = ${l} g`] }); },
    () => { const g = zz(11, 99) * 10, l = schiebe(String(g), -3);
      return dezimal(Z(`Gib ${g} g in kg an.`, '1000 g = 1 kg.', 'Rechne also : 1000.'), l, dfe(l, [[schiebe(String(g), -2), 'umrechnungszahl'], [schiebe(String(g), 3), 'umrechnungsrichtung']]), tG,
        { einheit: 'kg', bild: tafel(spaltenFuer(String(g), l), String(g), ': 1000'), nachweis: ['1000 g = 1 kg', `${g} : 1000 = ${l}`, `${g} g = ${l} kg`] }); },
    () => { const ct = zz(1005, 4995), l = euro(T(ct, 2));
      return dezimal(Z(`Gib ${ct} ct in Euro an.`), l, dfe(l, [[T(ct, 3), 'umrechnungszahl'], [ct * 100, 'umrechnungsrichtung']]), tG, { einheit: '€', nachweis: [`${ct} ct = ${l} €`] }); },
    () => { const p = euro(dez(2, 0.51, 0.99)), l = schiebe(p, 2);
      return dezimal(Z(`Ein Stift kostet ${p} €.`, 'Berechne den Preis für 100 Stifte.'), num(l), dfe(l, [[euro(schiebe(p, 1)), 'dezimal-stelle'], [euro(schiebe(p, -2)) ?? null, 'komma-falsche-richtung']].filter(([w]) => w && !/,\d{3}/.test(w))), tG, { einheit: '€', nachweis: [`${p} € · 100 = ${l} €`] }); },
    () => { const t = T(zz(1, 9), 1), falsch = schiebe(t, 2), r = schiebe(t, 3), kn = kind();
      return auswahl(Z(`${kn} sagt: „${t} km sind ${falsch} m.“`, 'Beurteile die Aussage.'), [opt(`Falsch. 1 km = 1000 m. Es gilt ${t} km = ${r} m.`, true), opt('Stimmt. 1 km = 100 m, also rückt das Komma zwei Stellen.', false, 'umrechnungszahl'), opt(`Falsch. Es gilt ${t} km = ${schiebe(t, 1)} m.`, false, 'umrechnungszahl')],
        h3('Denke an die Umrechnungszahl.', '1 km = 1000 m. Also 2 km = 2000 m.', 'Nimm die Zahl mal 1000.'), { nachweis: [URTEIL(false, `${t} km = ${falsch} m`)] }); },
  ]);
  sechs(S2, 'M', [
    () => { const t = dez(3, 0.011, 0.099), l = schiebe(t, 3);
      return dezimal(Z(`Gib ${t} kg in g an.`), num(l), dfe(l, [[schiebe(t, 2), 'umrechnungszahl']]), tM, { einheit: 'g', nachweis: [`${t} kg = ${l} g`] }); },
    () => { const mm = zz(2, 9), l = schiebe(String(mm), -3);
      return dezimal(Z(`Gib ${mm} mm in m an.`), l, dfe(l, [[schiebe(String(mm), -2), 'umrechnungszahl'], [schiebe(String(mm), 3), 'umrechnungsrichtung']]), tM, { einheit: 'm', nachweis: [`${mm} mm = ${l} m`] }); },
    () => { const kg = dez(1, 2.1, 5.9), l = kg;
      return dezimal(Z(`1000 Blatt Papier wiegen zusammen ${kg} kg.`, 'Gib das Gewicht eines Blattes in Gramm an.'), l, dfe(l, [[schiebe(kg, -3), 'umrechnungszahl'], [schiebe(kg, 3), 'umrechnungsrichtung']]), h2('Teile zuerst durch 1000. Rechne dann in Gramm um.', `${kg} kg : 1000 = ${schiebe(kg, -3)} kg = ${kg} g.`),
        { einheit: 'g', nachweis: [`${kg} kg : 1000 = ${kg} g`] }); },
    () => { const t = dez(1, 1.1, 4.9), l = schiebe(t, 3);
      return dezimal(Z(`Gib ${t} l in ml an.`), num(l), dfe(l, [[schiebe(t, 2), 'umrechnungszahl']]), tM, { einheit: 'ml', nachweis: [`${t} l = ${l} ml`] }); },
    () => { const p = euro(dez(2, 1.51, 1.99)), n = wahl([10, 100]), l = euro(T(P(p)[0] * n, 2));
      return dezimal(Z(`Ein Liter Benzin kostet ${p} €.`, `Berechne den Preis für ${n} Liter.`), l, dfe(l, [[euro(T(P(p)[0] * n / 10, 2)), 'dezimal-stelle']]), tM, { einheit: '€', nachweis: [`${p} € · ${n} = ${l} €`] }); },
    () => { const werte = mische([['0,45 km', 450], ['4600 cm', 46], ['47 000 mm', 47], ['0,048 km', 48]].map(([t, m]) => [t, m])), max = werte.reduce((x, y) => (y[1] > x[1] ? y : x));
      return auswahl(Z('Kreuze die größte Länge an.'), werte.map(([t]) => opt(t, t === max[0], t === max[0] ? undefined : 'umrechnungszahl')), h2('Rechne alle Längen in Meter um.', 'Vergleiche dann die Zahlen.'), { nachweis: [{ art: 'extrem', was: 'groesste' }] }); },
  ]);
  sechs(S2, 'E', [
    () => { const t = dez(4, 0.0011, 0.0099), l = schiebe(t, 3);
      return dezimal(Z(`Gib ${t} t in kg an.`), l, dfe(l, [[schiebe(t, 2), 'umrechnungszahl'], [schiebe(t, -3), 'umrechnungsrichtung']]), h1('1 t = 1000 kg.'), { einheit: 'kg', nachweis: [`${t} t = ${l} kg`] }); },
    () => { const cm = dez(1, 15.1, 29.9), l = schiebe(cm, -1);
      return dezimal(Z(`Ein Stapel aus 100 gleichen Münzen ist ${cm} cm hoch.`, 'Gib an, wie dick eine Münze in Millimetern ist.'), l, dfe(l, [[schiebe(cm, -2), 'umrechnungszahl']]), h1('Teile durch 100. Rechne dann in Millimeter um.'), { einheit: 'mm', nachweis: [`${cm} cm : 100 = ${l} mm`] }); },
    () => { const l = zz(2, 9) * 100 + wahl([0, 50]), liter = String(l);
      return dezimal(Z(`Für 1000 gleiche Flaschen Saft braucht eine Firma ${liter} l.`, 'Gib an, wie viel Milliliter in einer Flasche sind.'), l, dfe(l, [[schiebe(liter, -3), 'umrechnungszahl']]), h1('Teile durch 1000. Rechne dann in Milliliter um.'), { einheit: 'ml', nachweis: [`${liter} l : 1000 = ${l} ml`] }); },
    () => { const t = dez(1, 1.1, 9.9), falsch = schiebe(t, -2), kn = kind(), opts = [['Sie hat geteilt statt malgenommen. Es müssen mehr Zentimeter als Meter sein.', true], ['Sie hat mit zehn statt mit hundert gerechnet. Sonst stimmt die Rechnung.', false], ['Sie hat richtig gerechnet. Zentimeter sind kleiner, also wird die Zahl kleiner.', false]];
      return auswahl(Z(`${kn} rechnet ${t} m in Zentimeter um: ${t} : 100 = ${falsch}`, 'Kreuze die Erklärung für den Fehler an.'), opts.map(([x, r]) => opt(x, r, r ? undefined : x.includes('10 statt') ? 'umrechnungszahl' : 'umrechnungsrichtung')), h1('Überlege: Sind es mehr Zentimeter oder mehr Meter?'), { nachweis: [FREI('Umrechnungsfehler erklären')] }); },
    () => { const d = T(wahl([1, 2, 5]), 1), n = 1000, l = schiebe(d, 2);
      return dezimal(Z(`Ein Blatt Papier ist ${d} mm dick.`, `Gib an, wie hoch ein Stapel aus ${n} Blatt in Zentimetern ist.`), num(l), dfe(l, [[schiebe(d, 3), 'umrechnungszahl'], [schiebe(d, 1), 'dezimal-stelle']]), h1('Rechne zuerst in Millimetern. Rechne dann in Zentimeter um.'),
        { einheit: 'cm', nachweis: [`${d} mm · ${n} = ${schiebe(d, 3)} mm`, `${schiebe(d, 3)} mm = ${l} cm`] }); },
    () => { const t = dez(1, 1.1, 9.9), l = schiebe(t, -1);
      return luecken(Z('Setze die passende Zahl ein.', `${t} · {{a}} = ${l}`), { a: ['0,1', dfe('0,1', [[10, 'komma-falsche-richtung'], ['0,01', 'dezimal-stelle']])] }, h1('Das Ergebnis ist kleiner. Mit welcher Zahl unter 1 musst du malnehmen?'), { nachweis: [`${l} : ${t} = 0,1`] }); },
  ]);
}
export { tafel, spaltenFuer };
