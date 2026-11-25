// Aufgaben zu 6.7.6 „Dreisatz“ (Lernziele R1, R2) nach ADR 0015 und ADR 0050. Pflicht ab M.
// R1: der Dreisatz in seiner Grundform. R2: Sachaufgaben mit dem Dreisatz lösen.
// F: Dreisatztabelle mit vorgegebenen Rechenpfeilen, die mittlere Zeile steht fest bei 1. G: Das Kind trägt die Zahlen an den Rechenpfeilen selbst ein.
// M: nur das Ergebnis, mit Dezimalzahlen und über einen gemeinsamen Teiler; einzelne Tabellen geben die mittlere Zeile vor.
// E: rückwärts, in zwei Schritten und mit Fehlersuche. Der Wert „für 1“ als Antwort ist ein typischer Fehler.
// Auf M und E werden je zwei Aufgaben im Heft gerechnet (Dreisatz als Tabelle mit Rechenpfeilen), mit Kontrollwert im Spiel.

import { zz, wahl, mische, suche, Z, opt, auswahl, kind, sechs, H, FREI, E, t, g, zahl, LK, PF, dreisatz, mitEinheit, dbild, TAB, DS, WERT, URTEIL,
  KONTEXTE, fy, je } from './6-7-zuordnungen.mjs';

const R1 = '6.7.6-R1', R2 = '6.7.6-R2';
const K = (...namen) => KONTEXTE[wahl(namen)];
const GELD = ['hefte', 'broetchen', 'eis', 'kartoffeln', 'aepfel'], MASS = ['wandern', 'hahn', 'rad'], BURG = ['hafer', 'schmied'], LINIE = ['kartoffeln', 'aepfel', 'wandern', 'hahn', 'rad', 'benzin'];
const kopf = (k) => [k.xn.replace(/ in .+$/, ''), k.yn.replace(/ in .+$/, '')];
const Y = (k, v) => `${fy(k)(v)} ${k.ye}`;
const ok = (k, ...werte) => werte.every((v) => Number.isInteger(v) && v > 0 && (!k.geld || v % 10 === 0));
const fach = (f) => (f === 2 ? 'das Doppelte' : f === 3 ? 'das Dreifache' : `das ${f}-Fache`);
// Zahlen für einen Dreisatz: von x0 über xm nach x1 (Tausendstel). j: Wert für 1.
function zahlen(n, k, art = 'eins') {
  return suche(() => {
    if (art === 'teiler') { const d = wahl(k.stueck ? [2, 3, 4, 5] : [2, 3, 4, 5, 0.5]), [a, b] = mische([2, 3, 4, 5, 7]).slice(0, 2), j = je(k, n === 'E' ? 'M' : 'G'); return { x0: E(d * a), xm: E(d), x1: E(d * b), j }; }
    if (art === 'halb') { const [a, b] = mische([3, 5, 7, 8, 9]).slice(0, 2), j = wahl(k.geld ? [1200, 1600, 2400, 2800, 3600] : k.je.G); return { x0: 500 * a, xm: 500, x1: 500 * b, j }; }
    const max = n === 'F' ? 5 : n === 'G' ? 10 : 12, [x0, x1] = mische(Array.from({ length: max - 1 }, (_, i) => i + 2)).slice(0, 2);
    return { x0: E(x0), xm: 1000, x1: E(x1), j: je(k, n === 'E' ? 'M' : n) };
  }, (z) => { const w = [z.x0, z.xm, z.x1].map((x) => (x * z.j) / 1000); return ok(k, ...w) && (n !== 'F' || w.every((v) => v % 500 === 0)) && w[0] <= 500000 && (!k.stueck || [z.x0, z.xm, z.x1].every((x) => x % 1000 === 0)) && (z.x0 / z.xm) % 1 === 0 && (z.x1 / z.xm) % 1 === 0
    && (art === 'eins' || ([z.x0, z.x1].every((x) => x <= (k.xe === 'h' ? 8000 : 20000) && x !== 1000) && z.x1 % z.x0 !== 0 && z.x0 % z.x1 !== 0)); });
}
const yVon = (z, x) => (x * z.j) / 1000;
// Typische Fehler für das Ergebnis und für die mittlere Zeile.
const fehlerY1 = (z) => [[yVon(z, z.xm), 'dreisatz-zwischenwert'], [(yVon(z, z.x0) * z.x0) / z.x1, 'dreisatz-falsch-herum'], [yVon(z, z.x0) + (z.x1 - z.x0), 'prop-addiert'], [(yVon(z, z.x0) * z.x1) / 1000, 'dreisatz-falsch-herum']];
const fehlerYm = (z) => [[(yVon(z, z.x0) * z.x0) / z.xm, 'dreisatz-falsch-herum'], [yVon(z, z.x0) - (z.x0 - z.xm), 'prop-addiert']];
// Dreisatztabelle. pfeile: 'fest' (vorgegeben), 'luecke' (das Kind trägt die Zahlen ein), 'ohne'.
function tabelle(n, k, z, text, pfeile, hilfen) {
  const f = fy(k), a1 = z.x0 / z.xm, a2 = z.x1 / z.xm;
  const pf = pfeile === 'fest' ? [[`: ${a1}`, `: ${a1}`], [`· ${a2}`, `· ${a2}`]] : pfeile === 'luecke' ? [[PF(':', 'pl1', a1), PF(':', 'pr1', a1)], [PF('·', 'pl2', a2), PF('·', 'pr2', a2)]] : [[null, null], [null, null]];
  return dreisatz(text, kopf(k), [[k.kurz(z.x0), Y(k, yVon(z, z.x0))], [k.kurz(z.xm), mitEinheit(LK('ym', yVon(z, z.xm), fehlerYm(z), f), k.ye)], [k.kurz(z.x1), mitEinheit(LK('y1', yVon(z, z.x1), fehlerY1(z), f), k.ye)]], pf, hilfen, { nachweis: [TAB('prop')] });
}
const hilfeTab = (n, k, z) => { const a1 = z.x0 / z.xm, a2 = z.x1 / z.xm; return H(n, 'Rechne in beiden Spalten dasselbe.', 'Aus „4 Hefte → 6 €“ wird mit „: 4“ die Zeile „1 Heft → 1,50 €“.', `Rechne zuerst ${Y(k, yVon(z, z.x0))} : ${a1}. Rechne das Ergebnis dann mal ${a2}.`); };
const hilfeZahl = (n, k, z) => { const a1 = z.x0 / z.xm, a2 = z.x1 / z.xm; return H(n, z.xm === 1000 ? 'Rechne zuerst auf 1 zurück.' : `Rechne zuerst auf ${k.kurz(z.xm)} zurück.`, 'Rechne in beiden Spalten dasselbe.', `Rechne ${Y(k, yVon(z, z.x0))} : ${a1} und dann das Ergebnis mal ${a2}.`); };
const nachweisDS = (k, z, extra) => DS('prop', [t(z.x0), fy(k)(yVon(z, z.x0))], t(z.x1), fy(k)(yVon(z, z.x1)), extra);
// Einleitungssätze für Sachaufgaben.
const INTRO = { hefte: (kn) => `${kn} kauft Hefte für die Klasse.`, broetchen: (kn) => `${kn} holt Brötchen beim Bäcker.`, eis: (kn) => `${kn} lädt Freunde zum Eis ein.`, kartoffeln: (kn) => `${kn} kauft auf dem Markt Kartoffeln.`, aepfel: (kn) => `${kn} kauft auf dem Markt Äpfel.`,
  wandern: () => 'Die Klasse 6b wandert zur Burg.', rad: (kn) => `${kn} macht eine Radtour.`, hahn: () => 'Im Burggarten läuft Wasser in einen Trog.', hafer: () => 'Im Burgstall werden die Pferde gefüttert.', schmied: () => 'In der Burgschmiede wird gearbeitet.',
  mehl: (kn) => `${kn} backt Pfannkuchen.`, benzin: () => 'Ein Auto tankt.', akku: (kn) => `${kn} lädt ein Tablet.` };
// Auftrag, wenn der erste Wert gesucht ist.
const rueckAuftrag = (k, y) => (k.geld ? `Berechne, wie viele ${k.xe} es für ${Y(k, y)} gibt.` : /^Zeit/.test(k.xn) ? `Berechne die Zeit für ${Y(k, y)}.` : `Berechne die ${k.xn.replace(/ in .+$/, '').replace('Anzahl ', 'Anzahl der ')} für ${Y(k, y)}.`);
const KS = (...namen) => { const name = wahl(namen); return { name, ...KONTEXTE[name] }; };

export function dreisatz6() {
  // ---------- Bausteine ----------
  const tab = (n, namen, pfeile, sach = false, art = 'eins') => () => { const k = KS(...namen), z = zahlen(n, k, art), kn = kind();
    return tabelle(n, k, z, Z(sach ? INTRO[k.name](kn) : k.bed, k.geg(z.x0, yVon(z, z.x0)), pfeile === 'luecke' ? 'Ergänze die Dreisatztabelle und die Rechenpfeile.' : 'Ergänze die Dreisatztabelle.'), pfeile, hilfeTab(n, k, z)); };
  const nurErgebnis = (n, namen, art, sach = false, heft = false) => () => { const k = KS(...namen), z = zahlen(n, k, art), kn = kind(), f = fy(k);
    return zahl(Z(`${sach ? INTRO[k.name](kn) : k.bed} ${k.geg(z.x0, yVon(z, z.x0))}`, heft ? 'Im Heft: Schreibe den Dreisatz als Tabelle mit Rechenpfeilen.' : null, k.auf(z.x1)), yVon(z, z.x1), k.ye, fehlerY1(z), hilfeZahl(n, k, z), { nachweis: [nachweisDS(k, z)] }, f); };
  // Rückwärts: Der erste Wert ist gesucht. Gerechnet wird über einen gemeinsamen Teiler der zweiten Größe.
  const rueck = (n, namen, sach = false, heft = false) => () => { const k = KS(...namen), z = zahlen('E', k, 'teiler'), kn = kind(), f = fy(k), y1 = yVon(z, z.x1);
    return zahl(Z(`${sach ? INTRO[k.name](kn) : k.bed} ${k.geg(z.x0, yVon(z, z.x0))}`, heft ? 'Im Heft: Schreibe den Dreisatz als Tabelle mit Rechenpfeilen.' : null, rueckAuftrag(k, y1)), z.x1, k.xe, [[z.xm, 'dreisatz-zwischenwert'], [(z.x0 * yVon(z, z.x0)) / y1, 'dreisatz-falsch-herum'], [z.x0 + (y1 - yVon(z, z.x0)), 'prop-addiert']],
      H(n, `Diesmal ist der erste Wert gesucht. Schreibe ${k.ye} in die linke Spalte der Dreisatztabelle und rechne über einen gemeinsamen Teiler.`), { nachweis: [nachweisDS(k, z, { gesucht: 'x' })] }); };
  // Letzte Zeile wählen (F) oder Fehler finden (G).
  const letzteZeile = (n, namen) => () => { const k = KS(...namen), z = zahlen(n, k), f = fy(k), a1 = z.x0 / z.xm, a2 = z.x1 / z.xm, o = (y) => `${k.kurz(z.x1)} → ${Y(k, y)}`;
    return auswahl(Z(k.geg(z.x0, yVon(z, z.x0)), 'Die letzte Zeile der Dreisatztabelle fehlt.', 'Kreuze die passende Zuordnung an.'), [opt(o(yVon(z, z.x1)), true), opt(o(yVon(z, z.xm)), false, 'dreisatz-zwischenwert'), opt(o(yVon(z, z.x0) * a2), false, 'dreisatz-falsch-herum')],
      H(n, 'Der Rechenpfeil sagt die Rechnung für beide Spalten.', 'In der letzten Zeile rechnest du mit dem Wert für 1 weiter.', `Rechne ${Y(k, yVon(z, z.xm))} · ${a2}.`), { bild: dbild(kopf(k), [[k.kurz(z.x0), Y(k, yVon(z, z.x0))], [k.kurz(z.xm), Y(k, yVon(z, z.xm))], [k.kurz(z.x1), { luecke: 'offen', einheit: k.ye }]], [[`: ${a1}`, `: ${a1}`], [`· ${a2}`, `· ${a2}`]]), nachweis: [nachweisDS(k, z)] }); };
  const fehlerTabelle = (n, namen) => () => { const k = KS(...namen), z = zahlen(n, k), a1 = z.x0 / z.xm, a2 = z.x1 / z.xm, kn = kind(), falschM = yVon(z, z.x0) * a1;
    if (falschM * a2 > 2000000) return null;
    return auswahl(Z(`${kn} hat eine Dreisatztabelle ausgefüllt.`, 'Kreuze an, was falsch ist.'), [opt('In der zweiten Zeile muss rechts auch geteilt werden.', true), opt('In der ersten Zeile stehen die Werte in der falschen Spalte.', false), opt('Die Tabelle stimmt.', false, 'dreisatz-falsch-herum')],
      H(n, 'Die Rechenpfeile links und rechts zeigen dieselbe Rechnung.', 'Links steht „: 4“. Dann steht rechts auch „: 4“.', `Rechne ${Y(k, yVon(z, z.x0))} : ${a1} und vergleiche mit der zweiten Zeile.`), { bild: { ...dbild(kopf(k), [[k.kurz(z.x0), Y(k, yVon(z, z.x0))], [k.kurz(z.xm), Y(k, falschM)], [k.kurz(z.x1), Y(k, falschM * a2)]], [[`: ${a1}`, `· ${a1}`], [`· ${a2}`, `· ${a2}`]]), fehler: true },
        nachweis: [`${Y(k, yVon(z, z.x0))} : ${a1} = ${Y(k, yVon(z, z.xm))}`, FREI('links geteilt, rechts malgenommen')] }); };
  // Der Wert für 1 als Antwort: beurteilen.
  const zwischenwert = (n, namen) => () => { const k = KS(...namen), z = zahlen(n, k), kn = kind(), f = fy(k);
    return auswahl(Z(`${k.bed} ${k.geg(z.x0, yVon(z, z.x0))} ${kn} rechnet ${Y(k, yVon(z, z.x0))} : ${z.x0 / 1000} und antwortet: „Für ${k.kurz(z.x1)} sind es ${Y(k, yVon(z, z.xm))}.“`, 'Beurteile die Antwort.'),
      [opt(`Falsch. ${Y(k, yVon(z, z.xm))} ist der Wert für 1. Für ${k.kurz(z.x1)} sind es ${Y(k, yVon(z, z.x1))}.`, true), opt(`Stimmt. ${Y(k, yVon(z, z.x0))} : ${z.x0 / 1000} ist ${Y(k, yVon(z, z.xm))}.`, false, 'dreisatz-zwischenwert'), opt(`Falsch. Für ${k.kurz(z.x1)} sind es ${Y(k, yVon(z, z.x0) * (z.x1 / 1000))}.`, false, 'dreisatz-falsch-herum'), opt('Stimmt. Der Dreisatz hat nur zwei Zeilen.', false, 'dreisatz-zwischenwert')],
      H(n, 'Ein Dreisatz hat drei Zeilen. Die Rechnung endet erst in der dritten Zeile.', `Der Wert für 1 ist ${Y(k, yVon(z, z.xm))}. Rechne ihn mal ${z.x1 / 1000}.`), { nachweis: [nachweisDS(k, z, { hilf: true }), `${Y(k, yVon(z, z.x0))} : ${z.x0 / 1000} = ${Y(k, yVon(z, z.xm))}`, URTEIL(false)] }); };
  // Angebote vergleichen.
  const angebote = (n) => () => { const ware = wahl([['Hefte', 'Heft'], ['Brötchen', 'Brötchen'], ['Stifte', 'Stift']]), [xa, xb] = mische(n === 'G' ? [2, 3, 4, 5, 6] : [3, 4, 6, 8, 12]).slice(0, 2), ja = wahl(n === 'G' ? [600, 700, 800, 900] : [650, 750, 850, 950]), jb = ja + wahl([-100, 100, n === 'G' ? 200 : 50, n === 'G' ? -200 : -50]);
    const ya = xa * ja, yb = xb * jb, guenstig = ja < jb ? 'A' : 'B', teuer = guenstig === 'A' ? 'B' : 'A', jg = Math.min(ja, jb), jt = Math.max(ja, jb);
    if (jb <= 0 || (ya < yb) === (ja < jb)) return null; // Der Laden mit dem kleineren Gesamtpreis ist nicht der günstigere.
    return auswahl(Z(`Laden A: ${xa} ${ware[0]} kosten ${g(ya)} €.`, `Laden B: ${xb} ${ware[0]} kosten ${g(yb)} €.`, n === 'G' ? 'Kreuze den günstigeren Laden an.' : 'Entscheide, welcher Laden günstiger ist, und begründe.'),
      [opt(`Laden ${guenstig}. 1 ${ware[1]} kostet dort ${g(jg)} €, im anderen Laden ${g(jt)} €.`, true), opt(`Laden ${teuer}. Dort ist der Preis an der Kasse kleiner.`, false, 'sach-frage-verfehlt'), opt('Beide Läden sind gleich günstig.', false), opt(`Laden ${teuer}. 1 ${ware[1]} kostet dort ${g(jg)} €.`, false)],
      H(n, 'Vergleiche die Preise für 1 Stück.', 'Teile jeden Preis durch die Anzahl.', `Rechne ${g(ya)} € : ${xa} und ${g(yb)} € : ${xb}.`), { nachweis: [`${g(ya)} € : ${xa} = ${g(ja)} €`, `${g(yb)} € : ${xb} = ${g(jb)} €`, FREI('Vergleich der Preise für 1 Stück')] }); };

  // ================= R1: Dreisatz in der Grundform =================
  sechs(R1, 'F', [tab('F', GELD, 'fest'), tab('F', MASS, 'fest'), tab('F', BURG, 'fest'), tab('F', ['hefte', 'eis', 'mehl'], 'fest'), letzteZeile('F', GELD), tab('F', ['kartoffeln', 'aepfel', 'hahn'], 'fest')]);
  sechs(R1, 'G', [tab('G', GELD, 'luecke'), tab('G', MASS, 'luecke'), fehlerTabelle('G', GELD), tab('G', BURG, 'luecke'), letzteZeile('G', LINIE),
    // Ohne Tabelle: nur das Ergebnis.
    () => { const k = KS(...GELD), z = zahlen('G', k);
      return zahl(Z(k.bed, k.geg(z.x0, yVon(z, z.x0)), k.auf(z.x1)), yVon(z, z.x1), k.ye, fehlerY1(z), hilfeZahl('G', k, z), { bild: dbild(kopf(k), [[k.kurz(z.x0), Y(k, yVon(z, z.x0))], [k.kurz(z.xm), { luecke: 'a', einheit: k.ye }], [k.kurz(z.x1), { luecke: 'b', einheit: k.ye }]], [[`: ${z.x0 / z.xm}`, `: ${z.x0 / z.xm}`], [`· ${z.x1 / z.xm}`, `· ${z.x1 / z.xm}`]]), nachweis: [nachweisDS(k, z)] }, fy(k)); },
  ]);
  sechs(R1, 'M', [
    nurErgebnis('M', GELD, 'eins'),
    nurErgebnis('M', LINIE, 'teiler'),
    // Tabelle mit vorgegebener Mittelzeile (gemeinsamer Teiler).
    () => { const k = KS('hefte', 'eis', 'kartoffeln', 'wandern', 'hahn'), z = zahlen('M', k, 'teiler');
      return tabelle('M', k, z, Z(`${k.bed} ${k.geg(z.x0, yVon(z, z.x0))}`, `Ergänze die Dreisatztabelle. Die mittlere Zeile rechnet auf ${k.kurz(z.xm)} zurück, einen gemeinsamen Teiler.`, 'Trage auch die Zahlen an den Rechenpfeilen ein.'), 'luecke', H('M', 'Der gemeinsame Teiler spart das Rechnen mit dem Wert für 1.', `Rechne ${Y(k, yVon(z, z.x0))} : ${z.x0 / z.xm} und dann das Ergebnis mal ${z.x1 / z.xm}.`)); },
    nurErgebnis('M', GELD, 'eins', false, true),
    zwischenwert('M', GELD),
    nurErgebnis('M', ['wandern', 'hahn', 'rad', 'kartoffeln'], 'teiler', false, true),
  ]);
  sechs(R1, 'E', [
    nurErgebnis('E', ['kartoffeln', 'aepfel', 'benzin', 'wandern'], 'halb'),
    rueck('E', GELD),
    // Rückwärts in der Tabelle: Die linke Spalte ist gesucht.
    () => { const k = KS('kartoffeln', 'aepfel', 'hefte', 'eis'), z = zahlen('E', k, 'teiler'), f = fy(k), a1 = z.x0 / z.xm, a2 = z.x1 / z.xm;
      return dreisatz(Z(`${k.bed} ${k.geg(z.x0, yVon(z, z.x0))}`, `Bestimme mit der Dreisatztabelle, wie viele ${k.xe} es für ${Y(k, yVon(z, z.x1))} gibt.`, 'Ergänze die Tabelle und die Rechenpfeile.'), [kopf(k)[1], kopf(k)[0]], [[Y(k, yVon(z, z.x0)), k.kurz(z.x0)], [Y(k, yVon(z, z.xm)), mitEinheit(LK('xm', z.xm, [[yVon(z, z.xm), 'schaubild-achsen-vertauscht']]), k.xe)], [Y(k, yVon(z, z.x1)), mitEinheit(LK('x1', z.x1, [[z.xm, 'dreisatz-zwischenwert'], [z.x0 * a1 * a2, 'dreisatz-falsch-herum']]), k.xe)]],
        [[PF(':', 'pl1', a1), PF(':', 'pr1', a1)], [PF('·', 'pl2', a2), PF('·', 'pr2', a2)]], H('E', 'Hier steht der Preis links. Suche eine Zahl, durch die sich der erste Preis teilen lässt und die zum gesuchten Preis führt.'), { nachweis: [TAB('prop')] }); },
    nurErgebnis('E', ['kartoffeln', 'aepfel', 'wandern', 'rad'], 'halb', false, true),
    zwischenwert('E', LINIE),
    rueck('E', ['wandern', 'hahn', 'kartoffeln', 'aepfel'], false, true),
  ]);

  // ================= R2: Sachaufgaben =================
  sechs(R2, 'F', [tab('F', GELD, 'fest', true), tab('F', ['wandern', 'rad', 'hahn'], 'fest', true), tab('F', BURG, 'fest', true), tab('F', ['mehl', 'akku'], 'fest', true), letzteZeile('F', ['hafer', 'schmied', 'mehl']), tab('F', ['hefte', 'eis', 'broetchen'], 'fest', true)]);
  sechs(R2, 'G', [
    tab('G', GELD, 'luecke', true), tab('G', ['wandern', 'rad', 'hahn'], 'luecke', true),
    // Zwei Schritte: Preis berechnen und Rückgeld bestimmen.
    () => { const k = KS('hefte', 'eis', 'broetchen'), z = zahlen('G', k), kn = kind(), y1 = yVon(z, z.x1), schein = y1 < 5000 ? 5000 : y1 < 10000 ? 10000 : 20000, a1 = z.x0 / z.xm, a2 = z.x1 / z.xm;
      return zahl(Z(k.geg(z.x0, yVon(z, z.x0)), `${kn} kauft ${k.kurz(z.x1)} und zahlt mit ${schein / 1000} €.`, 'Berechne das Rückgeld.'), schein - y1, '€', [[y1, 'sach-schritt-vergessen'], [schein - yVon(z, z.xm), 'dreisatz-zwischenwert']],
        H('G', 'Berechne zuerst den Preis mit dem Dreisatz.', 'Ziehe den Preis dann von dem Geld ab.', `Rechne ${Y(k, yVon(z, z.x0))} : ${a1} und dann mal ${a2}.`), { bild: dbild(kopf(k), [[k.kurz(z.x0), Y(k, yVon(z, z.x0))], [k.kurz(z.xm), { luecke: 'a', einheit: k.ye }], [k.kurz(z.x1), { luecke: 'b', einheit: k.ye }]], [[`: ${a1}`, `: ${a1}`], [`· ${a2}`, `· ${a2}`]]),
          nachweis: [nachweisDS(k, z, { zwischen: true }), `${schein / 1000} € − ${g(y1)} € = ${g(schein - y1)} €`, WERT(g(schein - y1))] }, g); },
    tab('G', ['hafer', 'schmied', 'mehl'], 'luecke', true),
    fehlerTabelle('G', ['wandern', 'hahn', 'hafer']),
    angebote('G'),
  ]);
  sechs(R2, 'M', [
    // Einheiten angleichen.
    () => { const sorte = wahl(['Käse', 'Nüsse', 'Kirschen', 'Oliven']), j100 = wahl([180, 240, 320, 450]), a = wahl([200, 300, 500]), b = wahl([1.5, 2, 2.5]) * 1000, y0 = (a / 100) * j100, y1 = (b / 100) * j100, kn = kind();
      if (y0 % 10 || y1 % 10) return null;
      return zahl(Z(`${kn} kauft auf dem Markt ${sorte}. ${a} g kosten ${g(y0)} €. Jedes Gramm kostet gleich viel.`, `Berechne den Preis für ${t(b)} kg. Achte auf die Einheiten.`), y1, '€', [[(y0 * b) / 1000, 'einheiten-nicht-angeglichen'], [j100, 'dreisatz-zwischenwert']],
        H('M', 'Wandle zuerst in dieselbe Einheit um: 1 kg sind 1000 g.', `${t(b)} kg sind ${b} g. Rechne über 100 g: ${g(y0)} € : ${a / 100} = ${g(j100)} €.`), { nachweis: [`${g(y0)} € : ${a / 100} = ${g(j100)} €`, `${b / 100} · ${g(j100)} € = ${g(y1)} €`, WERT(g(y1))] }, g); },
    nurErgebnis('M', ['mehl', 'hafer', 'schmied'], 'teiler', true),
    angebote('M'),
    nurErgebnis('M', ['kartoffeln', 'aepfel', 'hefte'], 'eins', true, true),
    // Zwei Schritte mit Rückgeld.
    () => { const k = KS('kartoffeln', 'aepfel', 'hefte', 'eis'), z = zahlen('M', k, 'teiler'), kn = kind(), y1 = yVon(z, z.x1), schein = y1 < 10000 ? 10000 : y1 < 20000 ? 20000 : 50000;
      return zahl(Z(`${INTRO[k.name](kn)} ${k.geg(z.x0, yVon(z, z.x0))} ${kn} nimmt ${k.kurz(z.x1)} und zahlt mit ${schein / 1000} €.`, 'Berechne das Rückgeld.'), schein - y1, '€', [[y1, 'sach-schritt-vergessen'], [schein - yVon(z, z.xm), 'dreisatz-zwischenwert']],
        H('M', 'Berechne zuerst den Preis mit dem Dreisatz und ziehe ihn dann vom gezahlten Betrag ab.', `Rechne über ${k.kurz(z.xm)}: ${Y(k, yVon(z, z.x0))} : ${z.x0 / z.xm} und dann mal ${z.x1 / z.xm}.`), { nachweis: [nachweisDS(k, z, { zwischen: true }), `${schein / 1000} € − ${g(y1)} € = ${g(schein - y1)} €`, WERT(g(schein - y1))] }, g); },
    nurErgebnis('M', ['wandern', 'rad', 'hahn', 'akku'], 'teiler', true, true),
  ]);
  sechs(R2, 'E', [
    rueck('E', ['kartoffeln', 'aepfel', 'hefte', 'eis'], true),
    // Zwei Dreisätze hintereinander: Verbrauch und Kosten.
    () => { const verbrauch = wahl([5, 6, 7, 8]), km = wahl([150, 250, 350, 450]), preis = wahl([1600, 1800, 2000]), liter = (verbrauch * km) / 100, kosten = (liter * preis);
      if (!Number.isInteger(liter * 10) || kosten % 10) return null;
      return zahl(Z(`Ein Auto verbraucht gleichmäßig ${verbrauch} l Benzin auf 100 km. 1 l Benzin kostet ${g(preis)} €.`, `Berechne die Benzinkosten für ${km} km.`), kosten, '€', [[E(liter), 'sach-schritt-vergessen'], [verbrauch * preis, 'dreisatz-zwischenwert'], [(km * preis) / 100, 'sach-falsche-rechnung']],
        H('E', 'Rechne in zwei Schritten: erst die Liter für die Strecke, dann die Kosten für diese Liter.'), { nachweis: [DS('prop', ['100', String(verbrauch)], String(km), t(E(liter)), { zwischen: true }), `${t(E(liter))} · ${g(preis)} € = ${g(kosten)} €`, WERT(g(kosten))] }, g); },
    // Dreisatz passt nicht: Grundgebühr.
    () => { const gb = wahl([3, 4]), km = 2, x0 = wahl([3, 4, 5]), y0 = gb + km * x0, kn = kind();
      return auswahl(Z(`Eine Taxifahrt kostet ${gb} € Grundgebühr und ${km} € für jeden Kilometer. ${x0} km kosten also ${y0} €. ${kn} rechnet mit dem Dreisatz: „${2 * x0} km kosten ${2 * y0} €.“`, 'Beurteile die Rechnung.'),
        [opt(`Falsch. Die Zuordnung ist nicht proportional. ${2 * x0} km kosten ${gb + km * 2 * x0} €.`, true), opt('Stimmt. Zur doppelten Strecke gehört der doppelte Preis.', false, 'grundgebuehr-uebersehen'), opt(`Falsch. ${2 * x0} km kosten ${2 * y0 + gb} €.`, false), opt('Stimmt. Der Dreisatz gilt für jede Zuordnung.', false, 'je-mehr-proportional'), opt(`Falsch. ${2 * x0} km kosten ${km * 2 * x0} €.`, false, 'grundgebuehr-uebersehen')],
        H('E', 'Der Dreisatz gilt nur für proportionale Zuordnungen. Prüfe, ob ein fester Betrag im Preis steckt.'), { nachweis: [`${gb} € + ${2 * x0} · ${km} € = ${gb + km * 2 * x0} €`, URTEIL(false)] }); },
    nurErgebnis('E', ['kartoffeln', 'aepfel', 'benzin'], 'halb', true, true),
    // Vorrat: Reicht das Geld?
    () => { const k = KS('hefte', 'eis', 'broetchen'), z = zahlen('E', k, 'teiler'), kn = kind(), y1 = yVon(z, z.x1), geld = Math.floor(y1 / 1000) * 1000 + wahl([0, 1000, -1000]), reicht = geld >= y1;
      if (geld <= 0 || geld === y1) return null;
      return auswahl(Z(`${INTRO[k.name](kn)} ${k.geg(z.x0, yVon(z, z.x0))} ${kn} hat ${geld / 1000} € und sagt: „Das reicht für ${k.kurz(z.x1)}.“`, 'Beurteile die Aussage.'), [opt(reicht ? `Stimmt. ${k.kurz(z.x1)} kosten ${g(y1)} €.` : `Falsch. ${k.kurz(z.x1)} kosten ${g(y1)} €.`, true), opt(reicht ? `Falsch. ${k.kurz(z.x1)} kosten ${g(y1 + 2000)} €.` : `Stimmt. ${k.kurz(z.x1)} kosten ${g(geld - 500)} €.`, false), opt(`Stimmt. ${k.kurz(z.x1)} kosten ${g(yVon(z, z.xm))} €.`, false, 'dreisatz-zwischenwert'), opt(`Falsch. ${k.kurz(z.x1)} kosten ${g(yVon(z, z.x0) * (z.x1 / 1000))} €.`, false, 'dreisatz-falsch-herum')],
        H('E', 'Berechne zuerst den Preis mit dem Dreisatz und vergleiche ihn dann mit dem Geld.'), { nachweis: [nachweisDS(k, z, { hilf: true }), URTEIL(reicht)] }); },
    rueck('E', ['wandern', 'rad', 'hahn'], true, true),
  ]);
}
