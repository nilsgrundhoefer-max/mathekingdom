// Aufgaben zu 6.5.1 „Dezimalzahlen addieren und subtrahieren“ (Lernziele A1, A2) nach ADR 0015 und ADR 0048.
// A1: im Kopf (Zehntel wie Einer, Ergänzen zum Ganzen), ohne Heftband, ohne Raster. A2: schriftlich, Komma unter Komma.
// F und G rechnen im Rechenraster mit Kommaspalte (F: Endnullen grau vorgezeichnet, G: im Notizfeld selbst ergänzen), ab M im Heft.

import { sechs, auswahl, luecken, dezimal, rasterKomma, Z, h1, h2, h3 } from '../werkzeug.mjs';
const HILFSZAHL = (wert, grund) => ({ wert: String(wert), grund });
const num = (t) => (/^\d+$/.test(String(t)) ? Number(t) : t);
import { B, zz, wahl, mische, kind, opt, T, dfe, URTEIL, FREI, bild, fig, vorn, P, plus, minus, dez, euro, rechtsbuendig, endnullFehler, stellen } from './6-5-rechnen.mjs';

const A1 = '6.5.1-A1', A2 = '6.5.1-A2';
const streifen = (k) => bild(fig('streifen', 10, vorn(k)));
const hundert = (k) => bild(fig('hundert', null, vorn(k)));
const zwei = (a, b) => bild({ n: 'A', ...fig('streifen', 10, vorn(a)) }, { n: 'B', ...fig('streifen', 10, vorn(b)) });
// Geldbild für einen Betrag in Cent: Scheine, dann Münzen.
const STUECKE = [2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
export const geldStuecke = (ct) => { const l = []; for (const s of STUECKE) while (ct >= s) { l.push(s); ct -= s; } return l; };
const geldBild = (t) => B.geld(geldStuecke(P(euro(t))[0]));
const strahl = (von, bis, extra = {}) => B.strahl({ von, bis, schritt: 1, beschriftung: 10, teiler: 10, ...(von > 0 ? { ausschnitt: true } : {}), ...extra });

const tF1 = h3('Rechne mit Zehnteln wie mit Einern.', '0,6 + 0,3: 6 Zehntel und 3 Zehntel sind 9 Zehntel, also 0,9.', 'Zähle die Zehntel zusammen. 10 Zehntel sind 1 Ganzes.');
const tF1m = h3('Rechne mit Zehnteln wie mit Einern.', '0,8 − 0,3: 8 Zehntel weniger 3 Zehntel sind 5 Zehntel, also 0,5.', 'Nimm die Zehntel weg und zähle, was übrig bleibt.');
const tFg = h3('Rechne erst die Euro, dann die Cent.', '2,30 € + 1,20 € sind 3 € und 50 ct, also 3,50 €.', 'Schreibe das Ergebnis mit Komma: Euro vor dem Komma, Cent dahinter.');
const tG1 = h3('Rechne Zehntel mit Zehnteln und Hundertstel mit Hundertsteln.', '2,4 + 0,7 = 3,1, denn 4 Zehntel und 7 Zehntel sind 11 Zehntel.', 'Sind es 10 Zehntel oder mehr, wird daraus ein Ganzes.');
const tM1 = h2('Zerlege: erst die Ganzen, dann die Zehntel und Hundertstel.', 'Ergänze bis zum nächsten Ganzen, wenn es leichter geht.');

const tF2 = h3('Rechne von rechts nach links, Stelle für Stelle.', 'Bei 2,35 + 1,4 steht unter der 5 eine graue 0. Also 5 + 0 = 5.', 'Die grauen Nullen sind Endnullen. Rechne mit ihnen wie mit jeder Ziffer.');
const tG2 = h3('Schreibe Komma unter Komma. Fülle fehlende Stellen mit Endnullen.', '3,5 + 1,25: Schreibe 3,50 + 1,25 = 4,75.', 'Trage die Endnullen in die kleinen Felder ein. Rechne dann von rechts nach links.');
const tM2 = h2('Schreibe Komma unter Komma und ergänze Endnullen.', 'Rechne von rechts nach links. Das Komma im Ergebnis steht unter den anderen Kommas.');

export function addieren6() {
  // ================= A1: im Kopf =================
  sechs(A1, 'F', [
    () => { const a = zz(3, 8), b = zz(3, 9) ; if (a + b <= 10 || a + b > 15) return null; const l = T(a + b, 1);
      return dezimal(Z(`Streifen A zeigt ${T(a, 1)}.`, `Streifen B zeigt ${T(b, 1)}.`, `Rechne: ${T(a, 1)} + ${T(b, 1)}`), l, dfe(l, [[T(a + b, 2), 'dezimal-stelle'], [a + b, 'dezimal-stelle']]), tF1, { bild: zwei(a, b), nachweis: [`${T(a, 1)} + ${T(b, 1)} = ${l}`] }); },
    () => { const [e1, c1] = [zz(1, 4), wahl([10, 20, 30, 50])], [e2, c2] = [zz(1, 3), wahl([10, 20, 40])], a = euro(T(e1 * 100 + c1, 2)), b = euro(T(e2 * 100 + c2, 2)), l = euro(plus(a, b)), kn = kind();
      if (c1 + c2 >= 100) return null;
      return dezimal(Z(`${kn} hat ${a} €.`, `${kn} bekommt ${b} € dazu.`, 'Gib an, wie viel Geld es jetzt ist.'), l, dfe(l, [[T(e1 + e2, 0), 'dezimal-stelle']]), tFg, { einheit: '€', bild: geldBild(a), nachweis: [`${a} € + ${b} € = ${l} €`] }); },
    () => { const a = zz(25, 69), b = zz(1, 2) * 10; if (a % 10 === 0 || a < b + 5) return null; const l = T(a - b, 2);
      return dezimal(Z(`Das Feld zeigt ${T(a, 2)}.`, `Nimm ${T(b, 2)} weg.`, 'Gib an, wie viel übrig bleibt.'), l, dfe(l, [[T(a - b / 10, 2), 'dezimal-stelle'], [T(a + b, 2), 'sub-addiert']]), tF1m, { bild: hundert(a), nachweis: [`${T(a, 2)} − ${T(b, 2)} = ${l}`] }); },
    () => { const a = zz(6, 9), b = zz(2, a - 1), l = T(a - b, 1);
      return dezimal(Z(`Der Streifen zeigt ${T(a, 1)}.`, `Rechne: ${T(a, 1)} − ${T(b, 1)}`), l, dfe(l, [[T(a + b, 1), 'sub-addiert'], [a - b, 'dezimal-stelle']]), tF1m, { bild: streifen(a), nachweis: [`${T(a, 1)} − ${T(b, 1)} = ${l}`] }); },
    () => { const a = zz(2, 8), l = T(10 - a, 1);
      return dezimal(Z(`Der Streifen zeigt ${T(a, 1)}.`, 'Ein ganzer Streifen ist 1.', 'Gib an, wie viel bis 1 fehlt.'), l, dfe(l, [[10 - a, 'dezimal-stelle'], [T(a, 1), 'sub-addiert']]),
        h3('Zähle die weißen Teile.', 'Sind 7 Teile gefärbt, fehlen 3 Zehntel. Das sind 0,3.', 'Ein ganzer Streifen hat 10 Zehntel.'), { bild: streifen(a), nachweis: [`1 − ${T(a, 1)} = ${l}`] }); },
    () => { const p = euro(T(wahl([1, 2, 3]) * 100 + wahl([20, 50, 80]), 2)), l = euro(minus('5', p)), kn = kind();
      return dezimal(Z(`${kn} hat 5 €.`, `Ein Heft kostet ${p} €.`, 'Gib an, wie viel Geld übrig bleibt.'), l, dfe(l, [[endnullFehler('5', p), 'endnull-nicht-ergaenzt'], [euro(plus('5', p)), 'sub-addiert']]),
        h3('Rechne erst die Euro, dann die Cent.', '5 € − 1,20 €: 5 € − 1 € = 4 €. Dann 4 € − 20 ct = 3,80 €.', 'Von 1 € bleiben nach 20 ct noch 80 ct.'), { einheit: '€', bild: B.geld([500]), nachweis: [`5 € − ${p} € = ${l} €`] }); },
  ]);
  sechs(A1, 'G', [
    () => { const g = zz(1, 9), z = zz(1, 9), a = T(g * 10 + z, 1), b = T(10 - z, 1), l = g + 1;
      return dezimal(Z(`Rechne im Kopf: ${a} + ${b}`), l, dfe(l, [[T(g * 10 + 10, 2), 'dezimal-stelle'], [T(g * 10 + z + 10 - z, 2), 'dezimal-stelle']]), tG1, { bild: strahl(g * 10, g * 10 + 10), nachweis: [`${a} + ${b} = ${l}`] }); },
    () => { const a = dez(1, 1.2, 8.9), b = dez(1, 0.3, 0.9), l = plus(a, b); if (P(a)[0] % 10 + P(b)[0] < 10) return null;
      return dezimal(Z(`Rechne im Kopf: ${a} + ${b}`), l, dfe(l, [[rechtsbuendig(a, b) === l ? null : T(Math.floor(wert0(a)) + 0, 0), 'dezimal-stelle'], [T(P(a)[0] + P(b)[0] - 10, 1), 'add-uebertrag-vergessen']]), tG1, { bild: strahl(Math.floor(P(a)[0] / 10) * 10, Math.floor(P(a)[0] / 10) * 10 + 20), nachweis: [`${a} + ${b} = ${l}`] }); },
    () => { const a = dez(1, 3.1, 9.4), b = dez(1, 0.5, 2.9), l = minus(a, b); if (!l || P(a)[0] % 10 >= P(b)[0] % 10) return null;
      return dezimal(Z(`Rechne im Kopf: ${a} − ${b}`), l, dfe(l, [[minus(T(P(a)[0] + 10, 1), b), 'sub-uebertrag-vergessen'], [plus(a, b), 'sub-addiert']]),
        h3('Rechne in zwei Schritten: erst die Ganzen, dann die Zehntel.', '6,2 − 1,5: 6,2 − 1 = 5,2. Dann 5,2 − 0,5 = 4,7.', 'Musst du mehr Zehntel abziehen, als da sind, nimm ein Ganzes dazu.'), { nachweis: [`${a} − ${b} = ${l}`] }); },
    () => { const a = dez(2, 0.11, 0.89), b = dez(2, 0.05, 0.6), l = plus(a, b); if (wert0(l) >= 1) return null;
      return dezimal(Z(`Rechne im Kopf: ${a} + ${b}`), l, dfe(l, [[T(P(a)[0] + P(b)[0], 3), 'dezimal-stelle']]), h3('Rechne Hundertstel mit Hundertsteln.', '0,25 + 0,13 = 0,38, denn 25 Hundertstel + 13 Hundertstel = 38 Hundertstel.', 'Zähle die Hundertstel zusammen. Schreibe dann 0 Komma.'), { bild: hundert(P(a)[0]), nachweis: [`${a} + ${b} = ${l}`] }); },
    () => { const p1 = euro(dez(2, 1.15, 3.95)), p2 = euro(dez(1, 0.5, 2.5)), s = euro(plus(p1, p2)), kn = kind(); if (wert0(s) >= 10) return null; const l = euro(minus('10', s));
      return dezimal(Z(`${kn} kauft ein Buch für ${p1} € und einen Stift für ${p2} €.`, `${kn} bezahlt mit 10 €.`, 'Gib an, wie viel Geld zurückkommt.'), l, dfe(l, [[s, 'sach-falsche-rechnung'], [euro(minus('10', p1)), 'sach-schritt-vergessen']]),
        h3('Rechne zuerst, was alles zusammen kostet.', '3 € + 1,50 € = 4,50 €. Dann 10 € − 4,50 € = 5,50 €.', 'Ziehe den Preis von 10 € ab. Ergänze dazu bis 10.'), { einheit: '€', bild: B.geld([1000]), nachweis: [`${p1} € + ${p2} € = ${s} €`, `10 € − ${s} € = ${l} €`] }); },
    () => { const a = dez(1, 2.1, 7.9), b = dez(1, 0.2, 0.9), r = plus(a, b), falsch = T(P(a)[0] + P(b)[0] % 10 - (P(a)[0] % 10 + P(b)[0] >= 10 ? 10 : 0), 1), kn = kind();
      if (P(a)[0] % 10 + P(b)[0] < 10) return null;
      return auswahl(Z(`${kn} rechnet im Kopf: ${a} + ${b} = ${falsch}`, 'Beurteile die Rechnung.'), [opt(`Falsch. Es gilt ${a} + ${b} = ${r}.`, true), opt('Stimmt.', false, 'add-uebertrag-vergessen'), opt(`Falsch. Es gilt ${a} + ${b} = ${T(P(a)[0] + P(b)[0], 2)}.`, false, 'dezimal-stelle')],
        h3('Rechne selbst nach.', '5,8 + 0,4: 8 Zehntel und 4 Zehntel sind 12 Zehntel. Das ist 1,2.', 'Aus 10 Zehnteln wird ein Ganzes. Hat es das bedacht?'), { nachweis: [URTEIL(false, `${a} + ${b} = ${falsch}`)] }); },
  ]);
  sechs(A1, 'M', [
    () => { const a = dez(2, 2.01, 8.99), b = T(100 - (P(a)[0] % 100), 2), l = plus(a, b);
      return dezimal(Z(`Rechne im Kopf: ${a} + ${b}`), l, dfe(l, [[T(P(a)[0] + P(b)[0] - 100, 2), 'add-uebertrag-vergessen']]), tM1, { nachweis: [`${a} + ${b} = ${l}`] }); },
    () => { const a = dez(1, 10.5, 19.9), b = dez(2, 2.15, 5.95), l = minus(a, b);
      return dezimal(Z(`Rechne im Kopf: ${a} − ${b}`), l, dfe(l, [[endnullFehler(a, b), 'endnull-nicht-ergaenzt'], [plus(a, b), 'sub-addiert']]), h2('Ziehe zuerst die Ganzen ab, dann den Rest.', `Oder ergänze von ${b} bis ${a}.`), { nachweis: [`${a} − ${b} = ${l}`] }); },
    () => { const z = zz(1, 9), b = T(100 - z * 10 - zz(1, 9), 2), a = T(z, 1), l = plus(a, b); if (wert0(l) >= 1) return null;
      return luecken(Z('Ergänze zu 1.', `${a} + {{a}} = 1`), { a: [minus('1', a), dfe(minus('1', a), [[T(10 - z, 2), 'dezimal-stelle'], [T(10 - z, 0), 'dezimal-stelle']])] }, tM1, { nachweis: [`1 − ${a} = ${minus('1', a)}`] }); },
    () => { const a = dez(2, 0.15, 0.95), b = dez(2, 0.15, 0.95), c = dez(2, 0.15, 0.95), l = plus(plus(a, b), c); if ((P(a)[0] + P(b)[0]) % 100 !== 0 && (P(a)[0] + P(c)[0]) % 100 !== 0) return null;
      return dezimal(Z(`Rechne geschickt im Kopf: ${a} + ${b} + ${c}`), l, dfe(l, [[T(P(a)[0] + P(b)[0] + P(c)[0], 3), 'dezimal-stelle']]), h2('Suche zwei Zahlen, die zusammen ein Ganzes ergeben.', 'Rechne diese zuerst. Addiere dann den Rest.'), { nachweis: [`${a} + ${b} + ${c} = ${l}`] }); },
    () => { const z = euro(dez(2, 12.05, 18.95)), l = euro(minus('20', z)), kn = kind();
      return dezimal(Z(`${kn} kauft auf dem Markt für ${z} € ein.`, `${kn} bezahlt mit 20 €.`, 'Gib das Rückgeld an.'), l, dfe(l, [[endnullFehler('20', z), 'endnull-nicht-ergaenzt'], [euro(minus('20', T(P(z)[0] - P(z)[0] % 100, 2))), 'sach-schritt-vergessen']]),
        h2('Ergänze bis zum nächsten Euro und dann bis 20 €.', 'Zähle die beiden Schritte zusammen.'), { einheit: '€', nachweis: [`20 € − ${z} € = ${l} €`] }); },
    () => { const a = dez(1, 3.2, 9.8), b = dez(2, 0.11, 0.99), falsch = T(P(a)[0] + P(b)[0], 2), r = plus(a, b), kn = kind();
      return auswahl(Z(`${kn} rechnet: ${a} + ${b} = ${falsch}`, 'Beurteile die Rechnung und begründe.'), [opt(`Falsch. ${a} hat Zehntel, ${b} hat Hundertstel. Es gilt ${a} + ${b} = ${r}.`, true), opt('Stimmt. Man schreibt die Ziffern rechtsbündig untereinander und rechnet.', false, 'komma-nicht-untereinander'), opt(`Stimmt, denn ${a} + ${b} = ${falsch}.`, false, 'komma-nicht-untereinander')],
        h2('Schreibe die Zahlen mit gleich vielen Stellen nach dem Komma.', `Rechne dann ${T(P(a)[0] * 10, 2)} + ${b}.`), { nachweis: [URTEIL(false, `${a} + ${b} = ${falsch}`)] }); },
  ]);
  sechs(A1, 'E', [
    () => { const a = dez(3, 0.101, 0.899), l = minus('1', a);
      return luecken(Z('Ergänze zu 1.', `${a} + {{a}} = 1`), { a: [l, dfe(l, [[T(1000 - P(a)[0] - 1, 3) === l ? null : T(999 - P(a)[0], 3), 'ergaenzen-zu-viel']])] }, h1('Ergänze erst bis zum nächsten Hundertstel, dann bis 1.'), { nachweis: [`1 − ${a} = ${l}`] }); },
    () => { const l = dez(2, 3.05, 9.95), b = dez(2, 1.05, 4.95), c = plus(l, b);
      return luecken(Z('Ergänze die fehlende Zahl.', `{{a}} − ${b} = ${l}`), { a: [c, dfe(c, [[minus(l, b), 'probe-falsche-umkehr']])] }, h1('Rechne rückwärts mit der Umkehraufgabe.'), { nachweis: [`${l} + ${b} = ${c}`] }); },
    () => { const a = dez(1, 0.1, 0.9), b = dez(2, 0.01, 0.09), c = dez(3, 0.001, 0.009), l = plus(plus(a, b), c);
      return dezimal(Z(`Rechne im Kopf: ${a} + ${b} + ${c}`), l, dfe(l, [[T(P(a)[0] + P(b)[0] + P(c)[0], 3), 'komma-nicht-untereinander']]), h1('Schreibe jede Zahl in Tausendsteln. Dann siehst du die Stellen.'), { nachweis: [`${a} + ${b} + ${c} = ${l}`] }); },
    () => { const opts = [['Die Summe kann auch weniger Stellen nach dem Komma haben, wenn hinten eine Null entsteht.', true], ['Die Summe hat immer genau zwei Stellen nach dem Komma, wie die beiden Zahlen.', false], ['Die Summe hat immer vier Stellen nach dem Komma, denn zwei und zwei sind vier.', false]];
      return auswahl(Z('Zwei Zahlen haben je zwei Stellen nach dem Komma.', 'Kreuze die Aussage an, die stimmt.'), opts.map(([t, r]) => opt(t, r, r ? undefined : 'dezimal-mehr-ziffern')), h1('Probiere es aus: 1,25 + 2,75 = 4.'), { nachweis: [FREI('Stellenzahl einer Summe')] }); },
    () => { const z = [dez(2, 11.5, 12.6), dez(2, 11.5, 12.6), dez(1, 11.5, 12.6), dez(2, 11.5, 12.6)], s = z.reduce((x, y) => plus(x, y));
      return dezimal(Z(`Eine Staffel läuft 4 · 100 m. Die Zeiten sind ${z[0]} s, ${z[1]} s, ${z[2]} s und ${z[3]} s.`, 'Gib die Zeit der ganzen Staffel an.'), s, dfe(s, [[T(z.reduce((x, y) => x + P(y)[0], 0), 2), 'komma-nicht-untereinander']]),
        h1('Addiere zwei Zeiten, die zusammen glatt werden, zuerst.'), { einheit: 's', nachweis: [`${z[0]} s + ${z[1]} s + ${z[2]} s + ${z[3]} s = ${s} s`, HILFSZAHL(4, 'Anzahl der Läufer'), HILFSZAHL('100 m', 'Länge einer Strecke')] }); },
    () => { const a = dez(0, 4, 9), b = dez(2, 1.11, 3.99), falsch = endnullFehler(a, b), r = minus(a, b), kn = kind();
      return auswahl(Z(`${kn} rechnet: ${a} − ${b} = ${falsch}`, 'Kreuze die Erklärung für den Fehler an.'), [opt('Die Endnullen fehlen. Die Hundertstel wurden einfach abgeschrieben.', true), opt('Das Komma steht an der falschen Stelle. Die Ziffern selbst stimmen.', false, 'komma-nicht-untereinander'), opt('Es wurde addiert statt subtrahiert. Darum ist das Ergebnis zu groß.', false, 'sub-addiert')],
        h1(`Schreibe ${a} mit Endnullen. Rechne dann selbst: ${a} − ${b} = ${r}.`), { nachweis: [FREI('Fehler beim Subtrahieren erklären')] }); },
  ]);

  // ================= A2: schriftlich, Komma unter Komma =================
  const rasterF = (zeichen) => () => { const a = zeichen === '+' ? dez(wahl([1, 2]), 1.1, 9.9) : dez(wahl([0, 1]), 4, 9.9), b = dez(wahl([1, 2]), 0.11, 3.99), l = zeichen === '+' ? plus(a, b) : minus(a, b);
    if (!l || stellen(a) === stellen(b) || /,\d*0$/.test(T(P(l)[0] * 10 ** (Math.max(stellen(a), stellen(b)) - stellen(l)), Math.max(stellen(a), stellen(b)), Math.max(stellen(a), stellen(b))))) return null;
    return rasterKomma(Z('Rechne im Raster.', 'Komma steht unter Komma.'), zeichen, [a, b], zeichen === '+' ? tF2 : h3('Rechne von rechts nach links, Stelle für Stelle.', 'Bei 5,00 − 2,35 rechnest du 0 − 5. Das geht nicht. Nimm 1 von links dazu.', 'Die grauen Nullen sind Endnullen. Mit ihnen kannst du abziehen.'), { endnullen: 'grau' }); };
  const glatt = (l) => !/,\d*0$/.test(String(l));
  sechs(A2, 'F', [
    rasterF('+'), rasterF('+'), rasterF('−'), rasterF('−'),
    () => { const p1 = euro(dez(2, 2.15, 6.95)), p2 = euro(dez(1, 1.1, 2.9)), l = plus(p1, p2), kn = kind(); if (!glatt(euro(l))) return null;
      const t = rasterKomma(Z(`${kn} kauft eine Mütze für ${p1} € und Socken für ${p2} €.`, 'Rechne im Raster, wie viel alles kostet.'), '+', [p1, p2], tF2, { endnullen: 'grau' });
      t.nachweis.push(`${p1} € + ${p2} € = ${euro(l)} €`);
      return t; },
    rasterF('+'),
  ]);
  const rasterG = (zeichen) => () => { const a = zeichen === '+' ? dez(wahl([1, 2]), 10.1, 59.9) : dez(wahl([0, 1]), 12, 60), b = dez(wahl([2, 3]), 1.11, 9.99), l = zeichen === '+' ? plus(a, b) : minus(a, b);
    if (!l || stellen(a) === stellen(b)) return null;
    return rasterKomma(Z(zeichen === '+' ? 'Addiere schriftlich im Raster.' : 'Subtrahiere schriftlich im Raster.', 'Ergänze zuerst die Endnullen in den kleinen Feldern.'), zeichen, [a, b], tG2, { endnullen: 'notiz' }); };
  sechs(A2, 'G', [
    rasterG('+'), rasterG('−'),
    () => { const a = dez(0, 3, 8), b = dez(2, 1.05, 2.95), l = minus(a, b);
      return dezimal(Z(`Ein Seil ist ${a} m lang.`, `${kind()} schneidet ${b} m ab.`, 'Berechne, wie lang der Rest ist.'), l, dfe(l, [[endnullFehler(a, b), 'endnull-nicht-ergaenzt'], [plus(a, b), 'sub-addiert']]), tG2, { einheit: 'm', nachweis: [`${a} m − ${b} m = ${l} m`] }); },
    rasterG('+'),
    () => { const a = dez(1, 2.1, 9.9), b = dez(2, 1.11, 9.99), c = dez(3, 0.101, 0.999), l = plus(plus(a, b), c);
      return rasterKomma(Z('Addiere schriftlich im Raster.', 'Ergänze zuerst die Endnullen in den kleinen Feldern.'), '+', [a, b, c], tG2, { endnullen: 'notiz' }); },
    () => { const a = dez(1, 4.1, 9.9), b = dez(2, 1.11, 3.99), falsch = rechtsbuendig(a, b), r = plus(a, b), kn = kind();
      return auswahl(Z(`${kn} rechnet schriftlich: ${a} + ${b} = ${falsch}`, 'Beurteile die Rechnung.'), [opt(`Falsch. Komma muss unter Komma stehen. Es gilt ${a} + ${b} = ${r}.`, true), opt('Stimmt. Man schreibt die Ziffern rechtsbündig untereinander und rechnet.', false, 'komma-nicht-untereinander'), opt(`Stimmt, denn ${a} + ${b} = ${falsch}.`, false, 'komma-nicht-untereinander')],
        h3('Schreibe die Zahlen untereinander, Komma unter Komma.', `${a} wird zu ${T(P(a)[0] * 10, 2)}.`, 'Rechne dann selbst und vergleiche.'), { nachweis: [URTEIL(false, `${a} + ${b} = ${falsch}`)] }); },
  ]);
  sechs(A2, 'M', [
    () => { const a = dez(2, 10.01, 99.99), b = dez(1, 1.1, 49.9), l = plus(a, b);
      return dezimal(Z(`Addiere schriftlich im Heft: ${a} + ${b}`), l, dfe(l, [[rechtsbuendig(a, b), 'komma-nicht-untereinander']]), tM2, { nachweis: [`${a} + ${b} = ${l}`] }); },
    () => { const a = dez(1, 20.1, 99.9), b = dez(3, 1.001, 19.999), l = minus(a, b);
      return dezimal(Z(`Subtrahiere schriftlich im Heft: ${a} − ${b}`), l, dfe(l, [[endnullFehler(a, b), 'endnull-nicht-ergaenzt'], [rechtsbuendig(a, b, '−'), 'komma-nicht-untereinander']]), tM2, { nachweis: [`${a} − ${b} = ${l}`] }); },
    () => { const p = [euro(dez(2, 1.05, 4.95)), euro(dez(2, 5.05, 12.95)), euro(dez(1, 0.5, 0.9))], s = euro(p.reduce((x, y) => plus(x, y))), l = euro(minus('20', s)), kn = kind();
      if (!l) return null;
      return dezimal(Z(`${kn} kauft drei Dinge für ${p[0]} €, ${p[1]} € und ${p[2]} €.`, `${kn} bezahlt mit 20 €.`, 'Berechne das Rückgeld.'), l, dfe(l, [[s, 'sach-falsche-rechnung']]), tM2, { einheit: '€', nachweis: [`${p[0]} € + ${p[1]} € + ${p[2]} € = ${s} €`, `20 € − ${s} € = ${l} €`] }); },
    () => { const a = dez(2, 10.51, 29.49), b = dez(1, 3.6, 9.4), l = plus(a, b), ga = String(Math.round(wert0(a))), gb = String(Math.round(wert0(b))), u = String(Number(ga) + Number(gb));
      const auch = [...new Set([String(Math.round(wert0(a) / 10) * 10 + Number(gb))])].filter((x) => x !== u);
      const t = luecken(Z('Überschlage zuerst. Berechne dann genau.', `Überschlag: ${a} + ${b} ≈ {{u}}`, `Genau: ${a} + ${b} = {{e}}`), { u: [num(u), dfe(u, [[l, 'ueberschlag-nicht-gerundet']])], e: [l, dfe(l, [[rechtsbuendig(a, b), 'komma-nicht-untereinander']])] },
        h2('Runde beide Zahlen auf Ganze und addiere sie.', 'Rechne dann genau. Das Ergebnis muss in der Nähe des Überschlags liegen.'),
        { nachweis: [HILFSZAHL(ga, `${a} auf Ganze gerundet`), HILFSZAHL(gb, `${b} auf Ganze gerundet`), `${ga} + ${gb} = ${u}`, ...(auch.length ? [HILFSZAHL(String(Math.round(wert0(a) / 10) * 10), `${a} auf Zehner gerundet`), `${Math.round(wert0(a) / 10) * 10} + ${gb} = ${auch[0]}`] : []), `${a} + ${b} = ${l}`] });
      if (auch.length) t.luecken.u.auch = auch.map(num);
      return t; },
    () => { const c = dez(0, 10, 20), b = dez(2, 2.05, 7.95), l = minus(c, b);
      return luecken(Z('Ergänze die fehlende Zahl.', `${b} + {{a}} = ${c}`), { a: [l, dfe(l, [[endnullFehler(c, b), 'endnull-nicht-ergaenzt']])] }, h2('Rechne mit der Umkehraufgabe.', `Rechne ${c} − ${b}. Ergänze dazu Endnullen.`), { nachweis: [`${c} − ${b} = ${l}`] }); },
    () => { const a = dez(0, 6, 12), b = dez(2, 2.11, 4.99), falsch = endnullFehler(a, b), r = minus(a, b), kn = kind();
      return auswahl(Z(`${kn} rechnet schriftlich: ${a} − ${b} = ${falsch}`, 'Beurteile die Rechnung und begründe.'), [opt(`Falsch. ${a} = ${a},00. Es gilt ${a} − ${b} = ${r}.`, true), opt('Stimmt. Wo oben keine Ziffer steht, schreibt man die untere einfach ab.', false, 'endnull-nicht-ergaenzt'), opt(`Stimmt, denn die Hundertstel von ${b} bleiben stehen.`, false, 'endnull-nicht-ergaenzt')],
        h2('Ergänze bei der oberen Zahl Endnullen.', 'Rechne dann Stelle für Stelle und vergleiche.'), { nachweis: [URTEIL(false, `${a} − ${b} = ${falsch}`)] }); },
  ]);
  sechs(A2, 'E', [
    () => { const b = dez(3, 10.001, 89.999), l = minus('100', b);
      return dezimal(Z(`Subtrahiere schriftlich im Heft: 100 − ${b}`), l, dfe(l, [[endnullFehler('100', b), 'endnull-nicht-ergaenzt']]), h1('Schreibe 100 mit drei Endnullen.'), { nachweis: [`100 − ${b} = ${l}`] }); },
    () => { const b = dez(2, 2.05, 6.95), l = dez(1, 8.1, 15.9), a = plus(l, b);
      return luecken(Z('Ergänze die fehlende Zahl.', `{{a}} − ${b} = ${l}`), { a: [a, dfe(a, [[minus(l, b), 'probe-falsche-umkehr']])] }, h1('Rechne rückwärts mit der Umkehraufgabe.'), { nachweis: [`${l} + ${b} = ${a}`] }); },
    () => { const a = dez(3, 1.001, 8.999), l = minus('10', a);
      return dezimal(Z(`Zwei Zahlen ergeben zusammen 10. Die eine Zahl ist ${a}.`, 'Rechne im Heft.', 'Gib die andere Zahl an.'), l, dfe(l, [[endnullFehler('10', a), 'endnull-nicht-ergaenzt'], [T(9999 - P(a)[0], 3), 'ergaenzen-zu-viel']]), h1('Rechne 10 minus die Zahl. Ergänze dafür Endnullen.'), { nachweis: [`10 − ${a} = ${l}`] }); },
    () => { const opts = [['Er hat die Zahlen rechtsbündig geschrieben und nicht Komma unter Komma.', true], ['Er hat beim Addieren der Zehntel einen Übertrag vergessen.', false], ['Er hat das Komma im Ergebnis an die falsche Stelle gesetzt.', false]], a = dez(1, 3.1, 8.9), b = dez(3, 1.001, 4.999), falsch = rechtsbuendig(a, b);
      return auswahl(Z(`Ben rechnet schriftlich: ${a} + ${b} = ${falsch}`, 'Kreuze die Erklärung für seinen Fehler an.'), opts.map(([t, r]) => opt(t, r, r ? undefined : t.includes('Übertrag') ? 'add-uebertrag-vergessen' : 'div-komma-vergessen')), h1(`Rechne selbst: ${a} + ${b} = ${plus(a, b)}. Woher kommt die falsche Zahl?`), { nachweis: [FREI('Fehler beim schriftlichen Addieren erklären')] }); },
    () => { const p = [euro(dez(2, 2.15, 4.95)), euro(dez(2, 1.05, 2.95)), euro(dez(1, 0.5, 0.9))], s = euro(p.reduce((x, y) => plus(x, y))), l = euro(minus('50', T(P(s)[0] * 3, 2)));
      if (!l) return null;
      return dezimal(Z(`Auf dem Burgmarkt kauft eine Familie drei Mal dasselbe: Brot für ${p[0]} €, Käse für ${p[1]} € und einen Apfel für ${p[2]} €.`, 'Sie bezahlt mit 50 €.', 'Berechne das Rückgeld.'), l, dfe(l, [[euro(minus('50', s)), 'sach-schritt-vergessen']]), h1('Rechne zuerst einen Einkauf aus. Nimm ihn dann dreimal.'),
        { einheit: '€', nachweis: [`${p[0]} € + ${p[1]} € + ${p[2]} € = ${s} €`, `${s} € + ${s} € + ${s} € = ${euro(T(P(s)[0] * 3, 2))} €`, `50 € − ${euro(T(P(s)[0] * 3, 2))} € = ${l} €`, HILFSZAHL(3, 'drei Einkäufe')] }); },
    () => { const opts = [['Es klappt immer. Mit Endnullen rechnet man wie mit natürlichen Zahlen.', true], ['Es klappt nur, wenn man vorher alle Zahlen auf Zehntel rundet.', false], ['Es klappt nur bei Zahlen mit gleich vielen Stellen nach dem Komma.', false]];
      return auswahl(Z('Lena sagt: „Komma unter Komma, Endnullen ergänzen, dann rechne ich wie gewohnt.“', 'Beurteile, ob das immer klappt.'), opts.map(([t, r]) => opt(t, r, r ? undefined : 'komma-nicht-untereinander')), h1('Denke an die Stellenwerttafel: Zehntel stehen unter Zehnteln.'), { nachweis: [FREI('Verfahren begründen')] }); },
  ]);
}
const wert0 = (t) => { const [z, k] = P(t); return z / 10 ** k; };
