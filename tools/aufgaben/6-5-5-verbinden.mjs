// Aufgaben zu 6.5.5 „Verbindung der Rechenarten“ (Lernziele V1, V2) nach ADR 0015 und ADR 0048.
// V1: Punkt vor Strich und Klammern, ab E Klammern setzen. V2: geschickt rechnen und mehrschrittige Sachaufgaben.
// F rechnet am Geld: Preise, Rückgeld und Teilen. Ab G auch ohne Sachbezug.

import { sechs, auswahl, luecken, dezimal, Z, h1, h2, h3 } from '../werkzeug.mjs';
import { B, zz, wahl, mische, kind, opt, T, dfe, URTEIL, FREI, P, plus, minus, mal, durch, dez, euro, wert } from './6-5-rechnen.mjs';
import { geldStuecke } from './6-5-1-addieren.mjs';

const V1 = '6.5.5-V1', V2 = '6.5.5-V2';
const num = (t) => (/^\d+$/.test(String(t)) ? Number(t) : t);
const WERT = (w) => ({ art: 'wert', wert: String(w) });
const geldBild = (t) => B.geld(geldStuecke(P(euro(t))[0]));
const E = (t) => euro(t);
// Ein Preis in Cent mit glatten 5 oder 10 ct.
const preis = (von, bis, schritt = 5) => E(T(zz(Math.ceil(von * 100 / schritt), Math.floor(bis * 100 / schritt)) * schritt, 2));

const tF1 = h3('Rechne zuerst mal, dann plus.', '2 · 1,20 € + 0,90 € = 2,40 € + 0,90 € = 3,30 €.', 'Punkt vor Strich: Mal kommt vor plus.');
const tFk = h3('Rechne zuerst, was in der Klammer steht.', '10 € − (2,50 € + 3,20 €) = 10 € − 5,70 € = 4,30 €.', 'Was in der Klammer steht, ist ein Preis für zwei Dinge zusammen.');
const tG1 = h3('Unterstreiche zuerst, was du als Erstes rechnest.', '2,5 + 1,5 · 4 = 2,5 + 6 = 8,5.', 'Klammer zuerst, dann Punkt vor Strich, sonst von links nach rechts.');
const tM1 = h2('Klammer zuerst, dann Punkt vor Strich, sonst von links nach rechts.', 'Schreibe jeden Schritt in eine neue Zeile.');
const tFg = h3('Rechne Schritt für Schritt.', 'Erst: Was kostet alles? Dann: Was bleibt übrig?', 'Schreibe jeden Schritt mit dem Euro-Zeichen.');
const tG2 = h3('Suche Zahlen, die zusammen eine glatte Zahl ergeben.', '2,7 + 4,6 + 1,3 = 2,7 + 1,3 + 4,6 = 4 + 4,6 = 8,6.', 'Beim Addieren und Malnehmen darfst du tauschen.');
const tM2 = h2('Tausche und fasse so zusammen, dass glatte Zahlen entstehen.', 'Nutze das Verteilungsgesetz: 4 · 2,35 = 4 · 2 + 4 · 0,35.');

export function verbinden6() {
  // ================= V1: Punkt vor Strich und Klammern =================
  sechs(V1, 'F', [
    () => { const p = preis(0.8, 1.5, 10), q = preis(0.5, 0.95, 10), n = 2, l = E(plus(mal(String(n), p), q)), kn = kind();
      return dezimal(Z(`${kn} kauft ${n} Hefte zu je ${p} €.`, `Dazu kommt ein Stift für ${q} €.`, 'Gib den Preis für alles an.'), l, dfe(l, [[E(mal(String(n), plus(p, q))), 'punkt-vor-strich'], [E(plus(p, q)), 'sach-schritt-vergessen']]), tF1,
        { einheit: '€', bild: geldBild(p), nachweis: [`${n} · ${p} € + ${q} € = ${l} €`] }); },
    () => { const a = preis(1, 3, 10), n = zz(2, 4), b = preis(0.2, 0.9, 10), p = E(mal(String(n), b)), l = E(plus(a, p));
      return luecken(Z('Rechne zuerst die Malaufgabe.', `${a} € + ${n} · ${b} € = ${a} € + {{p}} € = {{e}} €`), { p: [p, dfe(p, [[E(plus(String(n), b)), '1x1-addiert']])], e: [l, dfe(l, [[E(mal(plus(a, String(n)), b)), 'punkt-vor-strich']])] }, tF1,
        { bild: geldBild(b), nachweis: [`${n} · ${b} € = ${p} €`, `${a} € + ${p} € = ${l} €`] }); },
    () => { const x = preis(1, 3.5, 10), y = preis(1, 3.5, 10), s = E(plus(x, y)), l = E(minus('10', s));
      return luecken(Z('Rechne zuerst die Klammer.', `10 € − (${x} € + ${y} €) = 10 € − {{s}} € = {{e}} €`), { s: [s, []], e: [l, dfe(l, [[E(plus(minus('10', x), y)), 'klammer-ignoriert']])] }, tFk,
        { bild: geldBild('10'), nachweis: [`${x} € + ${y} € = ${s} €`, `10 € − ${s} € = ${l} €`] }); },
    () => { const n = zz(3, 5), p = preis(0.3, 0.6, 10), q = preis(0.8, 1.5, 10), l = E(plus(mal(String(n), p), q)), kn = kind();
      const o = mische([[`${n} · ${p} € + ${q} €`, true, null], [`${n} · (${p} € + ${q} €)`, false, 'klammer-falsch-gesetzt'], [`${p} € + ${q} €`, false, 'sach-schritt-vergessen']]);
      return auswahl(Z(`${kn} kauft ${n} Brötchen zu je ${p} €.`, `Dazu kommt eine Milch für ${q} €.`, 'Kreuze die passende Rechnung an.'), o.map(([x, r, f]) => opt(x, r, f ?? undefined)), tF1,
        { bild: geldBild(p), nachweis: [`${n} · ${p} € + ${q} € = ${l} €`, WERT(`${l} €`)] }); },
    () => { const n = zz(3, 4), p = preis(1, 1.6, 10), s = E(mal(String(n), p)), l = E(minus('10', s)), kn = kind();
      return dezimal(Z(`${kn} kauft ${n} Kugeln Eis zu je ${p} €.`, `${kn} bezahlt mit 10 €.`, `Gib an, wie viel Geld ${kn} zurückbekommt.`), l, dfe(l, [[s, 'sach-schritt-vergessen'], [E(minus('10', p)), 'sach-schritt-vergessen']]), tFg,
        { einheit: '€', bild: geldBild('10'), nachweis: [`10 € − ${n} · ${p} € = ${l} €`] }); },
    () => { const x = preis(3, 8, 10), y = preis(1, 3, 10), s = E(plus(x, y)), l = E(durch(s, '2', 2)); if (P(s)[0] % 2) return null;
      return luecken(Z('Zwei Kinder kaufen zusammen ein Spiel und Batterien.', 'Sie teilen den Preis gerecht.', 'Rechne zuerst die Klammer.', `(${x} € + ${y} €) : 2 = {{s}} € : 2 = {{e}} €`), { s: [s, []], e: [l, dfe(l, [[E(plus(x, durch(y, '2', 2))), 'klammer-ignoriert']])] }, tFk,
        { bild: geldBild(x), nachweis: [`${x} € + ${y} € = ${s} €`, `${s} € : 2 = ${l} €`] }); },
  ]);
  sechs(V1, 'G', [
    () => { const n = 3, p = preis(0.6, 0.95), q = preis(1.2, 1.9, 10), l = E(plus(mal(String(n), p), q)), kn = kind();
      return dezimal(Z(`${kn} kauft ${n} Brezeln zu je ${p} €.`, `Dazu kommt eine Limo für ${q} €.`, 'Berechne den Preis.'), l, dfe(l, [[E(mal(String(n), plus(p, q))), 'punkt-vor-strich'], [E(plus(p, q)), 'sach-schritt-vergessen']]), tG1,
        { einheit: '€', bild: geldBild(p), nachweis: [`${n} · ${p} € + ${q} € = ${l} €`] }); },
    () => { const a = dez(1, 3.1, 9.9), b = dez(1, 1.1, 2.9), n = zz(2, 5), d = minus(a, b), l = mal(d, String(n));
      return dezimal(Z(`Berechne: (${a} − ${b}) · ${n}`), num(l), dfe(l, [[minus(a, mal(b, String(n))), 'klammer-ignoriert']]), tG1, { nachweis: [`${a} − ${b} = ${d}`, `${d} · ${n} = ${l}`, `(${a} − ${b}) · ${n} = ${l}`] }); },
    () => { const n = zz(2, 4), p = preis(0.8, 1.2), q = preis(1.2, 2, 10), l = E(plus(mal(String(n), p), q)), kn = kind();
      const o = mische([[`${n} · ${p} + ${q}`, true, null], [`${n} · (${p} + ${q})`, false, 'klammer-falsch-gesetzt'], [`${n} + ${p} + ${q}`, false, '1x1-addiert']]);
      return auswahl(Z(`${kn} kauft ${n} Hefte zu je ${p} € und einen Block zu ${q} €.`, 'Kreuze den passenden Rechenausdruck an.'), o.map(([x, r, f]) => opt(x, r, f ?? undefined)), tG1,
        { bild: geldBild(p), nachweis: [`${n} · ${p} € + ${q} € = ${l} €`, `${n} · ${p} + ${q} = ${l}`, WERT(l)] }); },
    () => { const n = zz(3, 5), p = preis(2.5, 4.5, 50), q = preis(1.5, 3, 10), l = E(plus(mal(String(n), p), q));
      return dezimal(Z(`Der Eintritt kostet ${p} € pro Person.`, `${n} Personen gehen zusammen hin.`, `Das Parken kostet ${q} €.`, 'Berechne den Preis für alles.'), l, dfe(l, [[E(mal(String(n), plus(p, q))), 'punkt-vor-strich']]), tG1,
        { einheit: '€', bild: geldBild(p), nachweis: [`${n} · ${p} € + ${q} € = ${l} €`] }); },
    () => { const n = wahl([2, 4, 5]), q = dez(1, 0.2, 0.9), b = mal(q, String(n)), a = dez(1, 3.1, 8.9), l = minus(a, q);
      return luecken(Z('Rechne zuerst die Punktrechnung.', `${a} − ${b} : ${n} = ${a} − {{q}} = {{e}}`), { q: [q, []], e: [num(l), dfe(l, [[durch(minus(a, b), String(n), 4), 'punkt-vor-strich']])] }, tG1,
        { nachweis: [`${b} : ${n} = ${q}`, `${a} − ${q} = ${l}`] }); },
    () => { const a = dez(1, 1.1, 2.9), b = T(zz(2, 9), 1), n = zz(3, 6), r = plus(a, mal(b, String(n))), falsch = mal(plus(a, b), String(n)), kn = kind();
      return auswahl(Z(`${kn} rechnet: ${a} + ${b} · ${n} = ${falsch}`, 'Beurteile die Rechnung.'), [opt(`Falsch. Punkt vor Strich: ${a} + ${b} · ${n} = ${a} + ${mal(b, String(n))} = ${r}.`, true), opt('Stimmt.', false, 'punkt-vor-strich'), opt(`Stimmt, denn ${a} + ${b} = ${plus(a, b)}.`, false, 'punkt-vor-strich')],
        h3('Unterstreiche die Malaufgabe.', 'Rechne sie zuerst.', 'Addiere dann.'), { nachweis: [`${b} · ${n} = ${mal(b, String(n))}`, `${a} + ${mal(b, String(n))} = ${r}`, `${a} + ${b} = ${plus(a, b)}`, URTEIL(false, `${a} + ${b} · ${n} = ${falsch}`)] }); },
  ]);
  sechs(V1, 'M', [
    () => { const b = dez(1, 1.1, 2.9), c = dez(1, 1.1, 3.9), p = mal(b, c), a = dez(1, Math.ceil(wert(p)) + 1, Math.ceil(wert(p)) + 9), l = minus(a, p);
      return dezimal(Z(`Berechne: ${a} − ${b} · ${c}`), num(l), dfe(l, [[mal(minus(a, b), c), 'punkt-vor-strich']]), tM1, { nachweis: [`${b} · ${c} = ${p}`, `${a} − ${p} = ${l}`] }); },
    () => { const t = preis(7.5, 9.5, 50), pc = preis(3, 4.5, 25), n = 4, m = 2, l = E(plus(mal(String(n), t), mal(String(m), pc)));
      return dezimal(Z(`Ein Kinoticket kostet ${t} €, eine Tüte Popcorn ${pc} €.`, `Eine Familie kauft ${n} Tickets und ${m} Tüten Popcorn.`, 'Berechne den Preis für alles.'), l, dfe(l, [[E(mal(String(n + m), plus(t, pc))), 'sach-falsche-rechnung'], [E(plus(t, pc)), 'sach-schritt-vergessen']]), tM1,
        { einheit: '€', nachweis: [`${n} · ${t} € + ${m} · ${pc} € = ${l} €`] }); },
    () => { const a = dez(1, 2.1, 6.9), b = dez(1, 1.1, 3.9), c = wahl(['0,5', '1,5', '2,5']), l1 = mal(plus(a, b), c), l2 = plus(a, mal(b, c));
      return luecken(Z('Berechne beide Rechnungen.', `(${a} + ${b}) · ${c} = {{a}}`, `${a} + ${b} · ${c} = {{b}}`), { a: [num(l1), dfe(l1, [[l2, 'klammer-ignoriert']])], b: [num(l2), dfe(l2, [[l1, 'punkt-vor-strich']])] }, tM1, { nachweis: [`(${a} + ${b}) · ${c} = ${l1}`, `${a} + ${b} · ${c} = ${l2}`] }); },
    () => { const x = T(zz(2, 6), 1), y = T(zz(1, 4), 1), s = plus(x, y), n = zz(2, 9), a = mal(s, String(n));
      return dezimal(Z(`Berechne: ${a} : (${x} + ${y})`), n, dfe(n, [[durch(plus(durch(a, x, 4) ?? '0', y), '1', 4), 'klammer-ignoriert']]), tM1, { nachweis: [`${x} + ${y} = ${s}`, `${a} : ${s} = ${n}`] }); },
    () => { const z = String(zz(6, 12)), b = T(zz(2, 9), 1), n = wahl([2, 5]), a = minus(z, mal(b, String(n))), c = T(zz(2, 9), 1), d = String(zz(2, 4)), q = durch(z, d, 2);
      if (!a || wert(a) <= 0 || !q) return null;
      const o = [[`${a} + ${b} · ${n}`, true], [`${mal(q, d)} : ${d} · ${d}`, true], [`(${a} + ${b}) · ${n}`, false], [`${plus(z, c)} + ${c}`, false]];
      return auswahl(Z(`Kreuze alle Rechnungen an, die ${z} ergeben.`), mische(o).map(([x, r]) => opt(x, r, r ? undefined : x.startsWith('(') ? 'klammer-falsch-gesetzt' : 'sub-addiert')), h2('Rechne jede Rechnung aus.', 'Achte auf Klammer und Punkt vor Strich.'), { mehrfach: true, nachweis: [WERT(z)] }); },
    () => { const b = T(zz(2, 9), 1), n = zz(2, 4), p = mal(b, String(n)), a = String(zz(Math.ceil(wert(p)) + 2, 12)), r = minus(a, p), falsch = mal(minus(a, b), String(n)), kn = kind();
      return auswahl(Z(`${kn} rechnet: ${a} − ${b} · ${n} = ${falsch}`, 'Beurteile die Rechnung und begründe.'), [opt(`Falsch. Mal kommt vor minus. Es gilt ${a} − ${b} · ${n} = ${a} − ${p} = ${r}.`, true), opt('Stimmt.', false, 'punkt-vor-strich'), opt(`Stimmt, denn man rechnet von links nach rechts.`, false, 'punkt-vor-strich')],
        h2('Unterstreiche die Punktrechnung.', 'Rechne sie zuerst.'), { nachweis: [`${b} · ${n} = ${p}`, `${a} − ${p} = ${r}`, URTEIL(false, `${a} − ${b} · ${n} = ${falsch}`)] }); },
  ]);
  sechs(V1, 'E', [
    () => { const a = T(zz(2, 9), 1), b = String(zz(4, 9)), c = wahl(['1,25', '1,5', '2,25', '2,5']), d = T(zz(1, 9), 1), k = minus(b, c), p = mal(a, k), l = plus(p, d);
      return dezimal(Z(`Berechne: ${a} · (${b} − ${c}) + ${d}`), num(l), dfe(l, [[plus(minus(mal(a, b), c), d), 'klammer-ignoriert']]), h1('Klammer zuerst, dann Punkt vor Strich.'), { nachweis: [`${b} − ${c} = ${k}`, `${a} · ${k} = ${p}`, `${p} + ${d} = ${l}`] }); },
    () => { const a = dez(1, 1.1, 4.9), b = dez(1, 0.5, 2.5), n = zz(2, 4), l = mal(plus(a, b), String(n));
      const o = mische([[`(${a} + ${b}) · ${n} = ${l}`, true], [`${a} + (${b} · ${n}) = ${l}`, false], [`${a} + ${b} · ${n} = ${l}`, false]]);
      return auswahl(Z(`Kreuze an, wo die Klammer stehen muss, damit das Ergebnis ${l} ist.`), o.map(([x, r]) => opt(x, r, r ? undefined : 'klammer-falsch-gesetzt')), h1('Probiere jede Möglichkeit aus.'), { nachweis: [{ art: 'aussagen' }] }); },
    () => { const a = dez(1, 1.1, 4.9), x = dez(1, 0.2, 2.9), n = zz(3, 6), l = plus(a, mal(x, String(n)));
      return luecken(Z('Ergänze die fehlende Zahl.', `${a} + {{a}} · ${n} = ${l}`), { a: [num(x), dfe(x, [[durch(minus(l, a), '1', 4), 'sach-schritt-vergessen'], [durch(l, String(n), 4) && minus(durch(l, String(n), 4), a), 'punkt-vor-strich']])] }, h1('Rechne rückwärts: Was muss die Malaufgabe ergeben?'),
        { nachweis: [`${l} − ${a} = ${mal(x, String(n))}`, `${mal(x, String(n))} : ${n} = ${x}`] }); },
    () => { const a = String(zz(2, 5)), b = '0,5', n = zz(3, 6), opts = [['Mal und geteilt rechnet man vor plus und minus. Zuerst wird also nur das Malnehmen gerechnet.', true], ['Man rechnet immer von links nach rechts.', false], ['Bei Dezimalzahlen braucht man diese Regel nicht.', false]];
      return auswahl(Z(`Kreuze die Begründung an, warum ${a} + ${b} · ${n} nicht ${mal(plus(a, b), String(n))} ergibt.`), opts.map(([t, r]) => opt(t, r, r ? undefined : 'punkt-vor-strich')), h1(`Rechne selbst: ${a} + ${b} · ${n} = ${plus(a, mal(b, String(n)))}.`), { nachweis: [FREI('Punkt vor Strich begründen')] }); },
    () => { const n = zz(3, 4), p = preis(0.95, 1.6), q = preis(0.5, 0.9), l = E(mal(String(n), plus(p, q))), kn = kind();
      return dezimal(Z(`${kn} kauft für ${n} Kinder je ein Brötchen für ${p} € und einen Saft für ${q} €.`, 'Schreibe einen Rechenausdruck mit Klammer.', 'Berechne den Preis.'), l, dfe(l, [[E(plus(mal(String(n), p), q)), 'klammer-falsch-gesetzt']]), h1('Was kostet es für ein Kind? Das kommt in die Klammer.'),
        { einheit: '€', nachweis: [`${n} · (${p} € + ${q} €) = ${l} €`] }); },
    () => { const a = dez(1, 3.1, 6.9), b = wahl(['0,5', '1,5']), c = String(zz(2, 3)), ausdr = [`${a} + ${b} · ${c}`, `(${a} + ${b}) · ${c}`, `${a} · ${b} + ${c}`, `${a} · (${b} + ${c})`];
      const w = [plus(a, mal(b, c)), mal(plus(a, b), c), plus(mal(a, b), c), mal(a, plus(b, c))].map(wert), max = Math.max(...w); if (w.filter((x) => x === max).length > 1) return null;
      return auswahl(Z('Rechne nicht alles genau.', 'Kreuze die Rechnung mit dem größten Ergebnis an.'), mische(ausdr.map((x, i) => [x, w[i] === max])).map(([x, r]) => opt(x, r, r ? undefined : 'klammer-falsch-gesetzt')), h1('Überlege bei jeder Rechnung, was du zuerst rechnest.'), { nachweis: [{ art: 'extrem', was: 'groesste' }] }); },
  ]);

  // ================= V2: Geschickt rechnen und Sachaufgaben =================
  sechs(V2, 'F', [
    () => { const x = preis(0.5, 2, 5), z = E(minus(String(Math.ceil(wert(x)) + 1), x)), y = preis(1, 3, 10), s = E(plus(x, z)), l = E(plus(s, y)); if (P(x)[0] % 100 === 0) return null;
      return luecken(Z(`Rechne zuerst ${x} € + ${z} €.`, `${x} € + ${y} € + ${z} € = {{s}} € + ${y} € = {{e}} €`), { s: [s, []], e: [l, []] }, h3('Suche zwei Preise, die zusammen ganze Euro ergeben.', '1,75 € + 0,25 € = 2 €.', 'Dann ist der Rest leicht.'),
        { bild: geldBild(x), nachweis: [`${x} € + ${z} € = ${s} €`, `${s} € + ${y} € = ${l} €`] }); },
    () => { const p = preis(0.5, 1.2, 10), q = preis(0.8, 1.6, 10), s = E(plus(p, q)), l = E(minus('5', s)), kn = kind();
      return dezimal(Z(`${kn} hat 5 €.`, `${kn} kauft eine Brezel für ${p} € und einen Saft für ${q} €.`, 'Gib an, wie viel Geld übrig bleibt.'), l, dfe(l, [[s, 'sach-schritt-vergessen'], [E(minus('5', p)), 'sach-schritt-vergessen']]), tFg,
        { einheit: '€', bild: geldBild('5'), nachweis: [`${p} € + ${q} € = ${s} €`, `5 € − ${s} € = ${l} €`] }); },
    () => { const n = 3, p = preis(0.5, 1.2, 10), a = E(mal(String(n), p)), l = E(minus('5', a)), kn = kind();
      return luecken(Z(`${kn} kauft ${n} Hefte zu je ${p} €.`, `${kn} bezahlt mit 5 €.`, 'Rechne in zwei Schritten.', `${n} · ${p} € = {{a}} €`, 'Geld zurück: {{b}} €'), { a: [a, []], b: [l, dfe(l, [[E(minus('5', p)), 'sach-schritt-vergessen']])] }, tFg,
        { bild: geldBild(p), nachweis: [`${n} · ${p} € = ${a} €`, `5 € − ${a} € = ${l} €`] }); },
    () => { const w = wahl(['2,50', '1,50', '2,00']), n = 4, s = E(mal(w, String(n))), p = preis(wert(s) - 3, wert(s) - 0.5, 5), l = E(minus(s, p)), kn = kind();
      return dezimal(Z(`${kn} spart jede Woche ${w} €.`, `Nach ${n} Wochen kauft ${kn} ein Buch für ${p} €.`, 'Gib an, wie viel Geld übrig bleibt.'), l, dfe(l, [[E(minus(w, p) ?? '0'), 'sach-schritt-vergessen']]), tFg,
        { einheit: '€', bild: geldBild(w), nachweis: [`${n} · ${w} € = ${s} €`, `${s} € − ${p} € = ${l} €`] }); },
    () => { const x = preis(1.05, 3.95, 5), y = E(minus('5', x)), d = E(plus(y, '0,10')), e = E(minus(y, '0,10')), o = mische([[`${x} € + ${y} €`, true], [`${x} € + ${d} €`, false], [`${x} € + ${e} €`, false]]); if (P(x)[0] % 10 === 0) return null;
      return auswahl(Z('Zwei Preise sollen zusammen genau 5 € ergeben.', 'Kreuze die passende Rechnung an.'), o.map(([t, r]) => opt(t, r, r ? undefined : 'ergaenzen-zu-viel')), h3('Rechne bis 5 €.', '2,35 € + 2,65 € = 5 €.', 'Rechne zuerst bis zum nächsten Euro.'), { bild: geldBild('5'), nachweis: [`${x} € + ${y} € = 5 €`, WERT('5 €')] }); },
    () => { const k = preis(2.5, 4, 50), e = preis(5, 8, 50), l = E(plus(mal('2', k), e));
      return dezimal(Z(`Ein Kind zahlt ${k} € Eintritt, ein Erwachsener ${e} €.`, 'Eine Familie mit 2 Kindern und 1 Erwachsenen geht hin.', 'Gib den Preis für die Familie an.'), l, dfe(l, [[E(plus(k, e)), 'sach-schritt-vergessen'], [E(mal('2', plus(k, e))), 'sach-falsche-rechnung']]), tFg,
        { einheit: '€', bild: geldBild(k), nachweis: [`2 · ${k} € + ${e} € = ${l} €`] }); },
  ]);
  sechs(V2, 'G', [
    () => { const a = dez(1, 1.1, 4.9), c = minus(String(Math.ceil(wert(a)) + zz(0, 2)), a), b = dez(1, 2.1, 6.9), s = plus(a, c), l = plus(s, b); if (!c || wert(c) <= 0 || P(a)[0] % 10 === 0) return null;
      return luecken(Z('Rechne geschickt.', `${a} + ${b} + ${c} = ${a} + ${c} + ${b} = {{s}} + ${b} = {{e}}`), { s: [num(s), []], e: [num(l), []] }, tG2, { nachweis: [`${a} + ${c} = ${s}`, `${s} + ${b} = ${l}`] }); },
    () => { const b = dez(1, 1.1, 9.9), [x, y] = wahl([['0,25', '4'], ['0,5', '2'], ['2,5', '4'], ['0,2', '5']]), p = mal(x, y), l = mal(p, b);
      return luecken(Z('Rechne geschickt.', `${x} · ${b} · ${y} = ${x} · ${y} · ${b} = {{p}} · ${b} = {{e}}`), { p: [num(p), []], e: [num(l), dfe(l, [[mal(mal(x, b), '1'), 'sach-schritt-vergessen']])] }, tG2, { nachweis: [`${x} · ${y} = ${p}`, `${p} · ${b} = ${l}`] }); },
    () => { const p = preis(1.6, 2.4, 20), w = T(zz(11, 39), 1), k = E(mal(p, w)), l = E(minus('10', k)), kn = kind(); if (!l || w.endsWith('0') || P(k)[0] % 1 !== 0) return null;
      return dezimal(Z(`1 kg Äpfel kostet ${p} €.`, `${kn} kauft ${w} kg und bezahlt mit 10 €.`, `Berechne, wie viel Geld ${kn} zurückbekommt.`), l, dfe(l, [[k, 'sach-schritt-vergessen']]), tFg,
        { einheit: '€', bild: geldBild('10'), nachweis: [`${w} kg : 1 kg = ${w}`, `${w} · ${p} € = ${k} €`, `10 € − ${k} € = ${l} €`] }); },
    () => { const n = 6, p = preis(1.1, 1.5), m = 3, q = preis(1.8, 2.5, 10), l = E(plus(mal(String(n), p), mal(String(m), q)));
      return dezimal(Z(`Für ein Fest kauft eine Klasse ${n} Flaschen zu je ${p} €.`, `Dazu kommen ${m} Tüten Chips zu je ${q} €.`, 'Berechne den Preis für alles.'), l, dfe(l, [[E(plus(p, q)), 'sach-schritt-vergessen'], [E(mal(String(n + m), plus(p, q))), 'sach-falsche-rechnung']]), tG1,
        { einheit: '€', bild: geldBild(p), nachweis: [`${n} · ${p} € + ${m} · ${q} € = ${l} €`] }); },
    () => { const n = 4, p = preis(1.5, 3, 50), q = E(minus(String(Math.ceil(wert(p))), p)), s = E(plus(p, q)), l = E(mal(String(n), s)), kn = kind(); if (wert(q) === 0) return null;
      return luecken(Z(`${kn} kauft ${n} Hefte zu je ${p} € und ${n} Stifte zu je ${q} €.`, 'Rechne geschickt.', `${n} · ${p} € + ${n} · ${q} € = ${n} · {{s}} € = {{e}} €`), { s: [s, []], e: [l, dfe(l, [[E(plus(mal(String(n), p), q)), 'verteilung-halb']])] }, tG2,
        { bild: geldBild(p), nachweis: [`${p} € + ${q} € = ${s} €`, `${n} · ${s} € = ${l} €`] }); },
    () => { const a = dez(1, 6.1, 9.9), b = dez(1, 1.6, 2.9), c = dez(1, 1.1, 1.5), r = minus(minus(a, b), c), falsch = minus(a, minus(b, c)), kn = kind();
      if (!r || !falsch) return null;
      return auswahl(Z(`${kn} rechnet: ${a} − ${b} − ${c} = ${a} − ${minus(b, c)} = ${falsch}`, 'Beurteile die Rechnung.'), [opt(`Falsch. Beide Zahlen werden abgezogen. Es gilt ${a} − ${b} − ${c} = ${r}.`, true), opt('Stimmt.', false, 'sub-klammerfehler'), opt('Stimmt, denn man darf beim Subtrahieren immer zusammenfassen.', false, 'gesetz-auf-subtraktion')],
        h3('Ziehe eine Zahl nach der anderen ab.', '8,5 − 2,7 − 1,5 = 5,8 − 1,5 = 4,3.', 'Du darfst auch beide Zahlen zuerst addieren und dann abziehen.'), { nachweis: [`${b} − ${c} = ${minus(b, c)}`, `${a} − ${b} − ${c} = ${r}`, URTEIL(false, `${a} − ${b} − ${c} = ${falsch}`)] }); },
  ]);
  sechs(V2, 'M', [
    () => { const b = dez(1, 1.1, 9.9), [x, y] = wahl([['0,5', '20'], ['0,25', '40'], ['2,5', '4'], ['0,2', '50']]), l = mal(mal(x, y), b);
      return dezimal(Z(`Rechne geschickt: ${x} · ${b} · ${y}`), num(l), dfe(l, [[mal(x, b), 'sach-schritt-vergessen']]), tM2, { nachweis: [`${x} · ${y} = ${mal(x, y)}`, `${mal(x, y)} · ${b} = ${l}`] }); },
    () => { const n = zz(3, 9), g = zz(1, 4), k = T(zz(11, 49), 2), a = plus(String(g), k), p1 = n * g, p2 = mal(String(n), k), l = plus(String(p1), p2); if (P(k)[0] % 10 === 0) return null;
      return luecken(Z('Rechne mit dem Verteilungsgesetz.', `${n} · ${a} = ${n} · ${g} + ${n} · {{k}} = {{a}} + {{b}} = {{e}}`), { k: [k, []], a: [p1, []], b: [num(p2), []], e: [num(l), dfe(l, [[plus(String(p1), k), 'verteilung-halb']])] }, tM2,
        { nachweis: [`${g} + ${k} = ${a}`, `${n} · ${g} = ${p1}`, `${n} · ${k} = ${p2}`, `${p1} + ${p2} = ${l}`, `${n} · ${a} = ${l}`] }); },
    () => { const lit = zz(30, 45), p = preis(1.6, 1.8, 10), w = preis(6.5, 9.5, 50), t = E(mal(String(lit), p)), s = E(plus(t, w)), l = E(minus('100', s)); if (!l) return null;
      return dezimal(Z(`Ein Vater tankt ${lit} Liter für je ${p} €.`, `Dazu kommt eine Autowäsche für ${w} €.`, 'Er bezahlt mit 100 €.', 'Berechne das Rückgeld.'), l, dfe(l, [[E(minus('100', t)), 'sach-schritt-vergessen'], [s, 'sach-frage-verfehlt']]), tM1,
        { einheit: '€', nachweis: [`${lit} · ${p} € = ${t} €`, `${t} € + ${w} € = ${s} €`, `100 € − ${s} € = ${l} €`] }); },
    () => { const [n, m, g] = wahl([[4, 10, '0,6'], [4, 6, '0,8'], [2, 5, '0,3'], [5, 8, '1,5'], [4, 10, '0,2']]), j = durch(g, String(n), 3), l = mal(j, String(m));
      return dezimal(Z(`Für ${n} Personen braucht man ${g} kg Nudeln.`, `Gib an, wie viel man für ${m} Personen braucht.`), num(l), dfe(l, [[j, 'sach-schritt-vergessen'], [mal(g, String(m)), 'sach-falsche-rechnung']]), h2('Rechne zuerst für eine Person.', 'Nimm dann mal die Zahl der Personen.'), { einheit: 'kg', nachweis: [`${g} kg : ${n} = ${j} kg`, `${j} kg · ${m} = ${l} kg`] }); },
    () => { const n = zz(3, 6), a = dez(1, 1.1, 4.9), b = minus(String(Math.ceil(wert(a)) + 1), a), s = plus(a, b), l = mal(String(n), s); if (!b || P(a)[0] % 10 === 0) return null;
      const o = [[`${n} · (${a} + ${b})`, true], [`${n} · ${s}`, true], [`${n} · ${a} + ${b}`, false], [`${n} + ${a} + ${b}`, false]];
      return auswahl(Z(`Kreuze alle Rechnungen an, die dasselbe Ergebnis haben wie ${n} · ${a} + ${n} · ${b}.`), mische(o).map(([x, r]) => opt(x, r, r ? undefined : x.includes('+ ') && x.startsWith(`${n} ·`) ? 'verteilung-halb' : '1x1-addiert')),
        h2('Nutze das Verteilungsgesetz.', 'Rechne jede Rechnung aus und vergleiche.'), { mehrfach: true, nachweis: [`${n} · ${a} + ${n} · ${b} = ${l}`, WERT(l)] }); },
    () => { const n = zz(2, 5), a = dez(1, 1.1, 4.9), b = T(zz(1, 9), 1), r = mal(String(n), plus(a, b)), falsch = plus(mal(String(n), a), b), kn = kind();
      return auswahl(Z(`${kn} rechnet: ${n} · (${a} + ${b}) = ${mal(String(n), a)} + ${b} = ${falsch}`, 'Beurteile die Rechnung und begründe.'), [opt(`Falsch. Jede Zahl in der Klammer wird malgenommen. Es gilt ${n} · (${a} + ${b}) = ${mal(String(n), a)} + ${mal(String(n), b)} = ${r}.`, true), opt('Stimmt.', false, 'verteilung-halb'), opt(`Stimmt, denn ${n} · ${a} = ${mal(String(n), a)}.`, false, 'verteilung-halb')],
        h2('Beim Verteilungsgesetz wird jeder Teil in der Klammer malgenommen.', 'Rechne zur Kontrolle zuerst die Klammer aus.'), { nachweis: [`${n} · ${a} = ${mal(String(n), a)}`, `${n} · ${b} = ${mal(String(n), b)}`, `${n} · (${a} + ${b}) = ${r}`, URTEIL(false, `${n} · (${a} + ${b}) = ${falsch}`)] }); },
  ]);
  sechs(V2, 'E', [
    () => { const b = dez(1, 1.1, 9.9), [x, y] = wahl([['1,25', '8'], ['0,125', '8'], ['2,5', '40'], ['0,04', '25']]), l = mal(mal(x, y), b);
      return dezimal(Z(`Rechne geschickt: ${x} · ${b} · ${y}`), num(l), dfe(l, [[mal(x, b), 'sach-schritt-vergessen']]), h1('Suche zwei Faktoren, die zusammen eine glatte Zahl ergeben.'), { nachweis: [`${x} · ${y} = ${mal(x, y)}`, `${mal(x, y)} · ${b} = ${l}`] }); },
    () => { const v = T(zz(45, 85), 1), km = wahl([150, 250, 350]), l = mal(durch(v, '100', 4), String(km));
      return dezimal(Z(`Ein Auto braucht auf 100 km ${v} l Benzin.`, `Gib an, wie viel es auf ${km} km braucht.`), num(l), dfe(l, [[mal(v, String(km)), 'sach-schritt-vergessen']]), h1('Rechne zuerst für 1 km oder für 50 km.'), { einheit: 'l', nachweis: [`${km} km : 100 km = ${durch(String(km), '100', 2)}`, `${v} l · ${durch(String(km), '100', 2)} = ${l} l`] }); },
    () => { const n = 3, h = preis(0.85, 1.45, 5), b = preis(1.2, 2.4, 10), s = E(plus(mal(String(n), h), b)), kn = kind();
      return dezimal(Z(`${kn} kauft ${n} gleiche Hefte und einen Block für ${b} €.`, `Zusammen kostet das ${s} €.`, 'Gib den Preis für ein Heft an.'), h, dfe(h, [[E(durch(s, String(n), 2) ?? '0'), 'sach-schritt-vergessen']]), h1('Rechne rückwärts: Ziehe zuerst den Block ab.'),
        { einheit: '€', nachweis: [`${s} € − ${b} € = ${E(mal(String(n), h))} €`, `${E(mal(String(n), h))} € : ${n} = ${h} €`] }); },
    () => { const n = zz(3, 6), opts = [['Der Preis ist fast so viel wie drei Euro. So viele Male drei Euro ist leicht zu rechnen. Danach zieht man die fehlenden Cent wieder ab.', true], ['Man lässt die Cent einfach weg.', false], ['Man rundet den Preis auf zwei Euro ab.', false]];
      return auswahl(Z(`Kreuze die Begründung an, warum man ${n} · 2,99 € als ${n} · 3 € − ${n} · 0,01 € rechnen kann.`), opts.map(([t, r]) => opt(t, r, r ? undefined : t.includes('weg') ? 'geschickt-nicht-ausgeglichen' : 'falsch-gerundet')), h1('Wie viel fehlt bei 2,99 € bis 3 €?'), { nachweis: [FREI('Geschickt rechnen begründen')] }); },
    () => { const n = zz(3, 7), p = wahl(['2,99', '4,99', '1,98', '9,95']), g = String(Math.ceil(wert(p))), d = minus(g, p), a = mal(String(n), g), b = mal(String(n), d), l = minus(a, b);
      return luecken(Z('Rechne geschickt.', `${n} · ${p} = ${n} · ${g} − ${n} · {{d}} = {{a}} − {{b}} = {{e}}`), { d: [d, []], a: [num(a), []], b: [num(b), []], e: [num(l), dfe(l, [[a, 'geschickt-nicht-ausgeglichen'], [minus(a, d), 'verteilung-halb']])] }, h1('Rechne mit dem glatten Preis und ziehe dann ab, was zu viel ist.'),
        { nachweis: [`${g} − ${p} = ${d}`, `${n} · ${g} = ${a}`, `${n} · ${d} = ${b}`, `${a} − ${b} = ${l}`, `${n} · ${p} = ${l}`] }); },
    () => { const k = wahl([20, 24, 25]), bus = wahl({ 20: [150, 180], 24: [180, 216], 25: [150, 200] }[k]), e = preis(3, 5.5, 50), l = plus(durch(String(bus), String(k), 2), e);
      const o = mische([[`${bus} : ${k} + ${e}`, true, null], [`(${bus} + ${e}) : ${k}`, false, 'klammer-falsch-gesetzt'], [`${bus} + ${e} · ${k}`, false, 'sach-falsche-rechnung'], [`${bus} : (${k} + ${e})`, false, 'klammer-falsch-gesetzt']]);
      return auswahl(Z(`Eine Klasse mit ${k} Kindern fährt ins Museum.`, `Der Bus kostet zusammen ${bus} €.`, `Der Eintritt kostet ${e} € pro Kind.`, 'Kreuze den Rechenausdruck für den Preis pro Kind an.'), o.map(([x, r, f]) => opt(x, r, f ?? undefined)), h1('Teile zuerst die Buskosten auf alle Kinder auf.'),
        { nachweis: [`${bus} € : ${k} = ${E(durch(String(bus), String(k), 2))} €`, `${E(durch(String(bus), String(k), 2))} € + ${e} € = ${E(l)} €`, `${bus} : ${k} + ${e} = ${l}`, WERT(l)] }); },
  ]);
}
