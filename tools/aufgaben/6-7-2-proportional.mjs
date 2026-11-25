// Aufgaben zu 6.7.2 „Proportionale Zuordnungen“ (Lernziele P1, P2) nach ADR 0015 und ADR 0050.
// P1: proportionale Zuordnungen erkennen. Die Hälfte der Erkenn-Aufgaben ist nicht proportional (fester Betrag, Angebot, Wachstum).
// Jede Aufgabe nennt die Bedingung („Jedes Heft kostet gleich viel.“) oder zeigt Werte, an denen sich die Zuordnung prüfen lässt.
// P2: Wertetabellen proportionaler Zuordnungen ergänzen. F verdoppelt und halbiert, G rechnet bis zum Zehnfachen und mit Cent,
// M rechnet über den Wert für 1 mit Dezimalzahlen, E ergänzt in beiden Zeilen und rückwärts.

import { zz, wahl, mische, Z, opt, auswahl, kind, sechs, H, FREI, E, t, g, zahl, luecken, lk, LK, wertetabelle, wbild, TAB, DS, EIN, WERT, URTEIL,
  KONTEXTE, fy, je, paarText } from './6-7-zuordnungen.mjs';

const P1 = '6.7.2-P1', P2 = '6.7.2-P2';
const PROP = 'Die Zuordnung ist proportional.', NICHT = 'Die Zuordnung ist nicht proportional.';
const K = (...namen) => KONTEXTE[wahl(namen)];
const GELD = ['hefte', 'broetchen', 'eis', 'kartoffeln', 'aepfel'], BURG = ['hafer', 'schmied'], ALLE = [...GELD, 'wandern', 'hahn', 'hafer', 'schmied'];
// Wertepaare [x, y] in Tausendsteln. fest: ein fester Betrag, der dazukommt (dann ist die Zuordnung nicht proportional).
const paareVon = (j, xs, fest = 0) => xs.map((x) => [E(x), Math.round(x * j) + fest]);
const tab = (k, paare, n) => ({ ...(n ? { n } : {}), namen: [k.xn, k.yn], paare: paarText(paare, fy(k)) });
const PT = (k, paare) => paarText(paare, fy(k));
const fest = (k, n) => (k.geld ? wahl(n === 'F' ? [1000, 2000] : [500, 1000, 1500]) : wahl([1000, 2000, 3000]));
// Körpergröße nach Alter: wächst, aber nicht proportional.
const wachstum = () => { const alter = [2, 4, 8], start = zz(84, 90); return alter.map((a, i) => [E(a), E(start + [0, 16, 40][i] + zz(0, 3))]); };
const ALTER = { xn: 'Alter in Jahren', yn: 'Größe in cm' };

export function proportional6() {
  // ================= P1: proportionale Zuordnungen erkennen =================
  // Tabelle prüfen und entscheiden.
  const entscheide = (n, namen, xs, prop, mitBed = false) => () => { const k = K(...namen), paare = paareVon(je(k, n), xs, prop ? 0 : fest(k, n));
    return auswahl(Z(mitBed && prop ? k.bed : null, n === 'F' ? 'Prüfe die Zahlen in der Tabelle.' : 'Prüfe die Wertepaare in der Tabelle.', 'Entscheide.'), [opt(PROP, prop, prop ? undefined : 'je-mehr-proportional'), opt(NICHT, !prop)],
      H(n, 'Proportional heißt: Zum Doppelten gehört das Doppelte.', 'Bei „2 → 6“ und „4 → 12“ gehört zum Doppelten das Doppelte.', `Vergleiche die Spalten für ${t(paare[0][0])} und ${t(paare[1][0])}.`), { bild: wbild(tab(k, paare)), nachweis: [EIN(PT(k, paare), { prop: PROP, keines: NICHT })] }); };
  // Zwei oder drei Tabellen: Genau eine ist proportional.
  const waehle = (n, namen, xs, anzahl) => () => { const k = K(...namen), j = je(k, n), namenT = mische(['A', 'B', 'C'].slice(0, anzahl));
    const tabs = [paareVon(j, xs), paareVon(j, xs, fest(k, n)), xs.map((x, i) => [E(x), Math.round(xs[0] * j) + i * (k.geld ? 1000 : 2000)])].slice(0, anzahl).map((p, i) => ({ n: namenT[i], p }));
    if (tabs.slice(1).some((x) => JSON.stringify(x.p) === JSON.stringify(tabs[0].p)) || (anzahl === 3 && JSON.stringify(tabs[1].p) === JSON.stringify(tabs[2].p))) return null;
    const sortiert = [...tabs].sort((p, q) => p.n.localeCompare(q.n));
    return { ...auswahl(Z(n === 'F' || n === 'G' ? null : k.bed, 'Kreuze die proportionale Zuordnung an.'), sortiert.map((x) => opt(`Tabelle ${x.n}`, x === tabs[0], x === tabs[0] ? undefined : 'je-mehr-proportional')),
      H(n, 'In der richtigen Tabelle gehört zum Doppelten das Doppelte.', 'Bei „2 → 6“ und „4 → 12“ gehört zum Doppelten das Doppelte.', `Vergleiche in jeder Tabelle die Spalten für ${xs[0]} und ${xs[1]}.`),
      { bild: wbild(...sortiert.map((x) => tab(k, x.p, `Tabelle ${x.n}`))), nachweis: [{ art: 'tabwahl', regel: 'prop' }] }), optionen: sortiert.map((x) => opt(`Tabelle ${x.n}`, x === tabs[0], x === tabs[0] ? undefined : 'je-mehr-proportional')) }; };
  // Das passende Wertepaar zu einer proportionalen Zuordnung.
  const passend = (n, namen, x0s, faktoren) => () => { const k = K(...namen), j = je(k, n), x0 = wahl(x0s), f = wahl(faktoren), y0 = x0 * j, x1 = x0 * f, f1 = fy(k), paar = (x, y) => `${k.kurz(E(x))} → ${f1(y)} ${k.ye}`;
    const falsch = [[y0 + (x1 - x0) * 1000, 'prop-addiert'], [y0, 'je-mehr-proportional']].filter(([y]) => y !== y0 * f);
    return auswahl(Z(k.bed, `Du weißt: ${paar(x0, y0)}`, 'Kreuze die passende Zuordnung an.'), [opt(paar(x1, y0 * f), true), ...falsch.map(([y, fv]) => opt(paar(x1, y), false, fv))],
      H(n, 'Zum Doppelten gehört das Doppelte.', 'Aus „2 → 6“ wird „4 → 12“.', `${t(E(x1))} ist das ${f === 2 ? 'Doppelte' : `${f}-Fache`} von ${t(E(x0))}. Rechne auch den zweiten Wert mal ${f}.`), { bild: wbild(tab(k, [[E(x0), y0]])), nachweis: [DS('prop', PT(k, [[E(x0), y0]])[0], t(E(x1)), f1(y0 * f))] }); };
  // Aussage beurteilen: „Zum Doppelten gehört das Doppelte.“
  const urteil = (n, namen, xs, prop) => () => { const k = K(...namen), paare = paareVon(je(k, n), xs, prop ? 0 : fest(k, n)), kn = kind(), f1 = fy(k);
    return auswahl(Z(`${kn} sagt: „Die Zuordnung ist proportional.“`, 'Beurteile die Aussage mit der Tabelle.'), [opt(prop ? 'Stimmt. Zum Doppelten gehört immer das Doppelte.' : `Falsch. Zu ${t(paare[1][0])} gehört nicht das Doppelte von ${f1(paare[0][1])}.`, true), opt(prop ? `Falsch. Zu ${t(paare[1][0])} gehört nicht das Doppelte von ${f1(paare[0][1])}.` : 'Stimmt. Zum Doppelten gehört immer das Doppelte.', false), opt(prop ? 'Falsch. Die Werte werden immer größer.' : 'Stimmt. Beide Werte werden größer.', false, prop ? undefined : 'je-mehr-proportional')],
      H(n, 'Bei proportionalen Zuordnungen gehört zum Doppelten das Doppelte.', 'Bei „2 → 6“ und „4 → 12“ gehört zum Doppelten das Doppelte.', `Verdopple ${f1(paare[0][1])} und vergleiche mit der Tabelle.`), { bild: wbild(tab(k, paare)), nachweis: [EIN(PT(k, paare), null, { ist: prop ? 'prop' : 'keines' }), URTEIL(prop)] }); };
  sechs(P1, 'F', [entscheide('F', GELD, [1, 2, 4], true, true), entscheide('F', GELD, [1, 2, 4], false), waehle('F', GELD, [2, 4, 8], 2), passend('F', GELD, [1, 2, 3], [2]), urteil('F', ['wandern', 'hahn'], [1, 2, 4], false), entscheide('F', BURG, [2, 4, 8], true, true)]);
  sechs(P1, 'G', [
    entscheide('G', GELD, [2, 4, 8], true),
    entscheide('G', ['wandern', 'hahn', 'hafer'], [1, 3, 6], false),
    // „3 zum Preis von 2“: ein Angebot macht die Zuordnung nicht proportional.
    () => { const k = K('hefte', 'eis'), p = wahl([1000, 1500, 2000]), paare = [[1000, p], [2000, 2 * p], [3000, 2 * p]], kn = kind();
      return auswahl(Z(`Angebot: 3 ${k.xe} zum Preis von 2.`, `${kn} sagt: „Die Zuordnung ist proportional.“`, 'Beurteile die Aussage mit der Tabelle.'), [opt(`Falsch. 3 ${k.xe} kosten nicht das Dreifache von ${g(p)} €.`, true), opt('Stimmt. Zum Doppelten gehört das Doppelte.', false, 'je-mehr-proportional'), opt('Stimmt. Ein Angebot ändert nichts.', false)],
        H('G', 'Prüfe auch das Dreifache.', 'Zum Dreifachen gehört bei proportionalen Zuordnungen das Dreifache.', `Rechne 3 · ${g(p)} € und vergleiche mit der Tabelle.`), { bild: wbild(tab(k, paare)), nachweis: [EIN(PT(k, paare), null, { ist: 'keines' }), URTEIL(false)] }); },
    waehle('G', GELD, [2, 4, 6], 3),
    urteil('G', GELD, [2, 4, 8], true),
    // Je mehr, desto mehr ist nicht immer proportional.
    () => { const paare = wachstum(), kn = kind();
      return auswahl(Z('Die Tabelle zeigt die Größe von einem Kind.', `${kn} sagt: „Das Kind wird immer größer, also ist die Zuordnung proportional.“`, 'Beurteile die Aussage.'), [opt(`Falsch. Mit ${t(paare[1][0])} Jahren ist das Kind nicht doppelt so groß wie mit ${t(paare[0][0])} Jahren.`, true), opt('Stimmt. Beide Werte werden größer.', false, 'je-mehr-proportional'), opt('Falsch. Das Kind wird mit den Jahren kleiner.', false)],
        H('G', 'Proportional heißt: Zum Doppelten gehört das Doppelte.', '„Je mehr, desto mehr“ reicht nicht.', `Verdopple ${t(paare[0][1])} cm und vergleiche mit der Tabelle.`), { bild: wbild({ namen: [ALTER.xn, ALTER.yn], paare: paarText(paare) }), nachweis: [EIN(paarText(paare), null, { ist: 'keines' }), URTEIL(false)] }); },
  ]);
  // Ab M: mit dem Quotienten prüfen.
  const quot = (k, [x, y]) => `${fy(k)(y)} ${k.ye} : ${t(x)}`;
  const mitQuotient = (n, namen, xs, prop, preise = null) => () => { const k = K(...namen), j = preise ? wahl(preise) : je(k, n), paare = paareVon(j, xs, prop ? 0 : fest(k, n)), f1 = fy(k);
    const q = paare.map(([x, y]) => (y * 1000) / x);
    if (q.some((v) => !Number.isInteger(v))) return null;
    return auswahl(Z('Prüfe die Tabelle mit dem Quotienten.', 'Entscheide und begründe.'), [opt(prop ? `Proportional. Der Quotient ist immer ${f1(q[0])}.` : `Nicht proportional. Die Quotienten sind verschieden: ${f1(q[0])} und ${f1(q[1])}.`, true), opt(prop ? 'Nicht proportional. Die Werte in der zweiten Zeile sind keine Vielfachen.' : `Proportional. Der Quotient ist immer ${f1(q[0])}.`, false, prop ? undefined : 'je-mehr-proportional'), opt('Proportional. Beide Werte werden größer.', false, 'je-mehr-proportional'), opt(`Nicht proportional. Zu ${t(paare[0][0])} gehört nicht ${t(paare[0][0])}.`, false)],
      H(n, 'Teile in jeder Spalte den zweiten Wert durch den ersten.', `Rechne ${quot(k, paare[0])} und ${quot(k, paare[1])}. Sind die Quotienten gleich, ist die Zuordnung proportional.`), { bild: wbild(tab(k, paare)), nachweis: [...paare.slice(0, 2).map((p, i) => `${quot(k, p)} = ${f1(q[i])} ${k.ye}`), EIN(PT(k, paare), null, { ist: prop ? 'prop' : 'keines' }), FREI('Die richtige Antwort nennt die berechneten Quotienten')] }); };
  sechs(P1, 'M', [
    // Quotienten berechnen.
    () => { const k = K(...GELD), j = je(k, 'M'), xs = mische([2, 3, 4, 5, 6, 8]).slice(0, 2).sort((p, q) => p - q), paare = paareVon(j, xs);
      return luecken(Z(k.bed, 'Berechne für beide Wertepaare den Quotienten.', `${quot(k, paare[0])} = {{a}} €`, `${quot(k, paare[1])} = {{b}} €`), { a: lk(j, [[paare[0][1], 'dreisatz-zwischenwert']], g), b: lk(j, [[paare[1][1], 'dreisatz-zwischenwert']], g) },
        H('M', 'Der Quotient ist der Preis für 1.', `Teile den Preis durch die erste Größe: ${quot(k, paare[0])}.`), { bild: wbild(tab(k, paare)), nachweis: [`${quot(k, paare[0])} = ${g(j)} €`] }); },
    mitQuotient('M', GELD, [2, 4, 5], true),
    mitQuotient('M', ['wandern', 'hahn', 'hafer'], [2, 4, 5], false),
    waehle('M', ['kartoffeln', 'aepfel', 'benzin'], [2, 3, 5], 3),
    // Mengenrabatt: Ab 10 Stück wird es billiger.
    () => { const k = K('hefte', 'broetchen'), j = wahl([800, 1200]), paare = [[2000, 2 * j], [5000, 5 * j], [10000, 10 * j - 2000]], kn = kind();
      return auswahl(Z(`${kn} sagt: „Zu 10 gehört ${g(paare[2][1])} €. Die Zuordnung ist proportional.“`, 'Beurteile die Aussage mit dem Quotienten.'), [opt(`Falsch. Für 2 und 5 ist der Quotient ${g(j)}, für 10 aber ${g(j - 200)}.`, true), opt(`Stimmt. Der Quotient ist immer ${g(j)}.`, false, 'je-mehr-proportional'), opt('Stimmt. Zum Fünffachen von 2 gehört das Fünffache.', false), opt('Falsch. Der Preis wird bei 10 kleiner als bei 5.', false)],
        H('M', 'Berechne für jede Spalte den Quotienten.', `Rechne ${g(paare[2][1])} € : 10 und vergleiche mit den anderen Quotienten.`), { bild: wbild(tab(k, paare)), nachweis: [`${g(paare[0][1])} € : 2 = ${g(j)} €`, `${g(paare[2][1])} € : 10 = ${g(j - 200)} €`, EIN(PT(k, paare), null, { ist: 'keines' }), URTEIL(false)] }); },
    // Begründen: Welche Bedingung macht die Zuordnung proportional?
    () => { const [a, b] = mische([['Anzahl der Brötchen → Preis', 'Jedes Brötchen kostet gleich viel.'], ['Zeit → Strecke beim Wandern', 'Die Gruppe wandert immer gleich schnell.'], ['Zeit → Wassermenge in der Wanne', 'Das Wasser fließt gleichmäßig.'], ['Anzahl der Pferde → Hafer am Tag', 'Jedes Pferd bekommt gleich viel Hafer.']]);
      return auswahl(Z(`Zuordnung: ${a[0]}.`, 'Kreuze die Bedingung an, unter der diese Zuordnung proportional ist.'), [opt(a[1], true), opt(b[1], false), opt('Beide Werte werden größer.', false, 'je-mehr-proportional'), opt('Die Werte stehen in einer Tabelle.', false)],
        H('M', 'Proportional ist eine Zuordnung nur, wenn für jede Einheit immer gleich viel dazukommt.', 'Überlege, was sich bei dieser Zuordnung nicht ändern darf.'), { nachweis: [FREI('Bedingung für Proportionalität im Sachzusammenhang')] }); },
  ]);
  sechs(P1, 'E', [
    mitQuotient('E', ['kartoffeln', 'aepfel', 'benzin'], [1.5, 2.5, 4], true, [1200, 1600, 2400, 2800]),
    mitQuotient('E', ['wandern', 'rad'], [1.5, 2.5, 4], false),
    // Mehrere proportionale Zuordnungen unter vier Tabellen.
    () => { const k = K('hefte', 'kartoffeln'), j1 = je(k, 'M'), j2 = je(KONTEXTE.aepfel, 'M'), xs = [2, 4, 5], namenT = mische(['A', 'B', 'C', 'D']);
      const tabs = [[paareVon(j1, xs), true], [paareVon(j2, xs), true], [paareVon(j1, xs, 500), false], [[[2000, 2 * j1], [4000, 4 * j1], [5000, 5 * j1 - 500]], false]].map(([p, r], i) => ({ n: namenT[i], p, r })).sort((p, q) => p.n.localeCompare(q.n));
      if (j1 === j2) return null;
      return { ...auswahl(Z('Prüfe jede Tabelle mit dem Quotienten.', 'Kreuze alle proportionalen Zuordnungen an.'), tabs.map((x) => opt(`Tabelle ${x.n}`, x.r)), H('E', 'Bei einer proportionalen Zuordnung haben alle Wertepaare denselben Quotienten.'), { mehrfach: true, bild: wbild(...tabs.map((x) => tab(k, x.p, `Tabelle ${x.n}`))), nachweis: [{ art: 'tabwahl', regel: 'prop', mehrere: true }] }), optionen: tabs.map((x) => opt(`Tabelle ${x.n}`, x.r, x.r ? undefined : 'je-mehr-proportional')) }; },
    // Fehlersuche: Ein Wertepaar passt nicht zur proportionalen Zuordnung.
    () => { const k = K(...GELD), j = je(k, 'M'), xs = [2, 3, 5, 8], i = zz(1, 3), paare = paareVon(j, xs), falsch = paare.map((p, n) => (n === i ? [p[0], p[1] + wahl([200, 500])] : p));
      return zahl(Z(`${k.bed} In der Tabelle ist ein Preis falsch.`, 'Bestimme den richtigen Preis für das falsche Wertepaar.'), paare[i][1], '€', [[falsch[i][1], 'je-mehr-proportional'], [j, 'dreisatz-zwischenwert']],
        H('E', 'Berechne für jede Spalte den Quotienten. Eine Spalte weicht ab.'), { bild: wbild(tab(k, falsch)), nachweis: [`${g(paare[0][1])} € : ${xs[0]} = ${g(j)} €`, `${xs[i]} · ${g(j)} € = ${g(paare[i][1])} €`, WERT(g(paare[i][1]))] }, g); },
    // Addieren erhält die Proportionalität nicht.
    () => { const k = K(...GELD), j = je(k, 'M'), paare = paareVon(j, [2, 4]), kn = kind(), neu = [3000, paare[0][1] + 1000];
      return auswahl(Z(`${k.bed} ${k.geg(...paare[0])} ${kn} rechnet: „Für ${k.kurz(3000)} ist es 1 mehr, also ${g(neu[1])} €.“`, 'Beurteile die Rechnung.'), [opt(`Falsch. ${k.kurz(1000)} kostet ${g(j)} €, also ${k.kurz(3000)} ${g(3 * j)} €.`, true), opt('Stimmt. Auf beiden Seiten kommt 1 dazu.', false, 'prop-addiert'), opt(`Falsch. ${k.kurz(3000)} kosten das Dreifache von ${g(paare[0][1])} €.`, false, 'dreisatz-zwischenwert'), opt('Stimmt. Der Preis wird größer.', false, 'je-mehr-proportional')],
        H('E', 'Bei proportionalen Zuordnungen wird auf beiden Seiten mit derselben Zahl multipliziert oder dividiert, nicht addiert.'), { nachweis: [`${g(paare[0][1])} € : 2 = ${g(j)} €`, `3 · ${g(j)} € = ${g(3 * j)} €`, URTEIL(false)] }); },
    // Quadrat: Seitenlänge → Umfang ist proportional, Seitenlänge → Flächeninhalt nicht.
    () => { const xs = [1, 2, 3, 4], [na, nb] = mische(['A', 'B']), tabs = [{ n: na, namen: ['Seitenlänge in cm', 'Umfang in cm'], paare: xs.map((x) => [x, 4 * x]), r: true }, { n: nb, namen: ['Seitenlänge in cm', 'Flächeninhalt in cm²'], paare: xs.map((x) => [x, x * x]), r: false }].sort((p, q) => p.n.localeCompare(q.n));
      const rA = tabs.find((x) => x.r).n;
      return auswahl(Z('Die Tabellen gehören zu Quadraten.', 'Entscheide, welche Zuordnung proportional ist, und begründe.'), [opt(`Nur Tabelle ${rA}. Der Quotient ist immer 4.`, true), opt(`Nur Tabelle ${rA === 'A' ? 'B' : 'A'}. Zur doppelten Seitenlänge gehört der vierfache Wert.`, false), opt('Beide. In beiden Tabellen werden die Werte größer.', false, 'je-mehr-proportional'), opt('Keine. Bei Quadraten gibt es keine proportionale Zuordnung.', false)],
        H('E', 'Berechne in beiden Tabellen die Quotienten der Wertepaare.'), { bild: wbild(...tabs.map((x) => ({ n: `Tabelle ${x.n}`, namen: x.namen, paare: x.paare }))), nachweis: ['8 : 2 = 4', '12 : 3 = 4', '4 : 2 = 2', '9 : 3 = 3', EIN(xs.map((x) => [String(x), String(4 * x)]), null, { ist: 'prop' }), EIN(xs.map((x) => [String(x), String(x * x)]), null, { ist: 'keines' }), FREI('Umfang 4 · a ist proportional, Flächeninhalt a · a nicht')] }); },
  ]);

  // ================= P2: Wertetabellen ergänzen =================
  // xs: Werte der ersten Zeile. offenY / offenX: Stellen der Lücken in der zweiten und der ersten Zeile. geg: Stelle des Wertepaars, von dem aus gerechnet wird.
  const ergaenze = (n, namen, xsWahl, offenY, offenX = [], preise = null) => () => { const k = K(...namen), j = preise ? wahl(preise) : je(k, n), zusatz = null, xs = wahl(xsWahl), paare = paareVon(j, xs), f1 = fy(k), geg = xs.findIndex((_, i) => !offenY.includes(i) && !offenX.includes(i));
    if (paare.some(([, y]) => !Number.isInteger(y) || (k.geld && y % 10 !== 0)) || (n === 'F' && paare.some(([, y]) => y % 500 !== 0))) return null;
    const [xg, yg] = paare[geg];
    const spalten = paare.map(([x, y], i) => [offenX.includes(i) ? LK(`x${i}`, x, [[y, 'schaubild-achsen-vertauscht']]) : t(x), offenY.includes(i) ? LK(`y${i}`, y, [[yg + (x - xg), 'prop-addiert'], [Math.round((yg * xg) / x), 'prop-antiproportional-gerechnet'], ...(x !== 1000 ? [[j, 'dreisatz-zwischenwert']] : [])], f1) : f1(y)]);
    const erste = offenY[0] ?? offenX[0], fak = paare[erste][0] / xg;
    const schritt = Number.isInteger(fak) ? `${t(paare[erste][0])} ist das ${fak === 2 ? 'Doppelte' : fak === 3 ? 'Dreifache' : `${fak}-Fache`} von ${t(xg)}. Rechne ${f1(yg)} ${k.ye} · ${fak}.` : Number.isInteger(1 / fak) ? `${t(paare[erste][0])} ist ${1 / fak === 2 ? 'die Hälfte' : `der ${1 / fak}. Teil`} von ${t(xg)}. Rechne ${f1(yg)} ${k.ye} : ${1 / fak}.` : `Berechne zuerst den Wert für 1: ${f1(yg)} ${k.ye} : ${t(xg)}.`;
    return wertetabelle(Z(k.bed, zusatz, 'Ergänze die Tabelle.'), [k.xn, k.yn], spalten,
      H(n, n === 'F' ? 'Zum Doppelten gehört das Doppelte. Zur Hälfte gehört die Hälfte.' : 'Rechne in beiden Zeilen mit derselben Zahl mal oder geteilt.', 'Aus „2 → 6“ wird „4 → 12“ und „1 → 3“.', schritt), { nachweis: [TAB('prop')] }); };
  sechs(P2, 'F', [
    ergaenze('F', GELD, [[1, 2, 4]], [1, 2]),
    ergaenze('F', ['wandern', 'hahn', 'hafer'], [[2, 4, 8]], [1, 2]),
    ergaenze('F', GELD, [[8, 4, 2]], [1, 2]),
    ergaenze('F', ['hefte', 'eis', 'schmied'], [[1, 2, 3, 5], [1, 2, 4, 5]], [1, 2, 3]),
    ergaenze('F', ['kartoffeln', 'aepfel', 'hafer'], [[1, 2, 4]], [0, 2]),
    ergaenze('F', BURG, [[1, 3, 5], [1, 2, 3]], [1, 2]),
  ]);
  sechs(P2, 'G', [
    ergaenze('G', GELD, [[1, 2, 5, 10]], [1, 2, 3]),
    ergaenze('G', ['wandern', 'hahn', 'rad'], [[2, 4, 6, 10]], [1, 2, 3]),
    ergaenze('G', ['hefte', 'eis'], [[1, 3, 6, 9]], [1, 2], [3]),
    ergaenze('G', ['kartoffeln', 'aepfel', 'hafer'], [[5, 1, 10, 3]], [1, 2, 3]),
    ergaenze('G', GELD, [[3, 1, 6, 9]], [1, 2, 3]),
    ergaenze('G', ['hefte', 'broetchen', 'schmied'], [[4, 2, 6, 10]], [1, 2, 3]),
  ]);
  sechs(P2, 'M', [
    ergaenze('M', GELD, [[4, 1, 3, 10]], [1, 2, 3]),
    ergaenze('M', ['kartoffeln', 'aepfel', 'benzin'], [[4, 2, 6, 10]], [1, 2, 3]),
    ergaenze('M', ['wandern', 'rad', 'hahn'], [[2, 1, 3, 5]], [1, 2], [3]),
    ergaenze('M', ['hefte', 'eis', 'hafer'], [[6, 3, 9, 15]], [1, 2, 3]),
    // Einheiten angleichen: Die Tabelle rechnet in Gramm, der Preis gilt für 1 kg.
    () => { const j = wahl([2400, 3200, 4800, 6400]), xs = [1000, 500, 250, 1500], sorte = wahl(['Käse', 'Nüsse', 'Kirschen']);
      return wertetabelle(Z(`1 kg ${sorte} kostet ${g(j)} €. Jedes Gramm kostet gleich viel.`, 'Ergänze die Tabelle. Achte auf die Einheit.'), ['Gewicht in g', 'Preis in €'], xs.map((x, i) => [String(x), i === 0 ? g(j) : LK(`y${i}`, (x * j) / 1000, [[x * j, 'einheiten-nicht-angeglichen'], [j + (x - 1000), 'prop-addiert']], g)]),
        H('M', '1 kg sind 1000 g.', `500 g sind die Hälfte von 1000 g. Rechne ${g(j)} € : 2.`), { nachweis: [TAB('prop')] }); },
    ergaenze('M', ['kartoffeln', 'aepfel', 'wandern'], [[4, 6, 10, 1.5]], [1, 2], [3]),
  ]);
  sechs(P2, 'E', [
    ergaenze('E', ['kartoffeln', 'aepfel', 'benzin'], [[2.5, 1, 4, 7.5]], [1, 2, 3], [], [1200, 1600, 2400, 2800]),
    ergaenze('E', ['wandern', 'rad'], [[1.5, 0.5, 2.5, 4]], [1, 2], [3]),
    ergaenze('E', GELD, [[6, 9, 15, 4]], [1], [2, 3]),
    // Fehlersuche in einer ausgefüllten Tabelle, dann richtig ergänzen.
    () => { const k = K(...GELD), j = je(k, 'M'), xs = [4, 6, 10, 14], paare = paareVon(j, xs), kn = kind();
      return wertetabelle(Z(`${k.bed} ${kn} hat nur das erste Wertepaar sicher: ${k.geg(...paare[0])}`, 'Ergänze die Tabelle über einen gemeinsamen Teiler.'), [k.xn, k.yn], [[t(paare[0][0]), g(paare[0][1])], ['2', LK('y1', 2 * j, [[j, 'dreisatz-zwischenwert']], g)], ...paare.slice(1).map(([x, y], i) => [t(x), LK(`y${i + 2}`, y, [[paare[0][1] + (x - 4000), 'prop-addiert']], g)])],
        H('E', 'Alle Werte der ersten Zeile lassen sich durch dieselbe Zahl teilen. Rechne zuerst auf diesen gemeinsamen Teiler zurück.'), { nachweis: [TAB('prop')] }); },
    ergaenze('E', ['hahn', 'wandern'], [[2.5, 5, 7.5, 12.5]], [1, 3], [2]),
    // Zwei Größen umrechnen: Minuten und Stunden.
    () => { const j = wahl([12, 15, 18, 24]), xs = [60, 20, 45, 100], paare = xs.map((x) => [E(x), (E(j) * x) / 60]);
      if (paare.some(([, y]) => !Number.isInteger(y))) return null;
      return wertetabelle(Z(`Ein Fahrrad fährt gleichmäßig ${j} km in einer Stunde.`, 'Ergänze die Tabelle.'), ['Zeit in min', 'Strecke in km'], [[String(xs[0]), LK('y0', paare[0][1], [[E(j) * 60, 'einheiten-nicht-angeglichen']])], [String(xs[1]), LK('y1', paare[1][1], [])], [String(xs[2]), LK('y2', paare[2][1], [])], [LK('x3', paare[3][0], [[E(j), 'schaubild-achsen-vertauscht']]), t(paare[3][1])]],
        H('E', 'Eine Stunde hat 60 Minuten. Rechne von dort auf einen gemeinsamen Teiler der Zeiten zurück.'), { nachweis: [TAB('prop')] }); },
  ]);
}
