// Aufgaben zu 6.1.6 „Brüche am Zahlenstrahl“ (Lernziele Z1, Z2) nach ADR 0015 und ADR 0037.
// Z1: Brüche am Zahlenstrahl ablesen. Z2: Brüche am Zahlenstrahl eintragen.
// Grilling mit Nils (2026-11-24): Am Bruchstrahl stehen nur die Ganzen. F bleibt zwischen 0 und 1, G geht über 1 hinaus,
// M arbeitet mit Ausschnitten und feineren Einteilungen, E mit ungewohnten Einteilungen. Heftaufgaben gibt es nur
// in „Brüche eintragen“ auf M und E (je zwei von sechs). Ein abgelesener Bruch ist vollständig gekürzt (gekuerzt: true).

import { sechs, auswahl, luecken, zahl, bruch, strahl, Z, h1, h2, h3, fehlerliste, zweiKinder } from '../werkzeug.mjs';
import { vorn, WERT, UMF, HILFS, bstrahl, ggt, B, br, opt, zz, wahl, mische } from './6-1-brueche.mjs';

const Z1 = '6.1.6-Z1', Z2 = '6.1.6-Z2';
const S = (zahlText, rechnung = false) => ({ art: 'strahl', zahl: zahlText, ...(rechnung ? { rechnung: true } : {}) });
const fremd = (T, von = 1, bis = T - 1) => wahl(vorn(bis - von + 1, von).filter((p) => p % T !== 0 && ggt(p, T) === 1));
const kuerzbar = (T, von = 1, bis = T - 1) => wahl(vorn(bis - von + 1, von).filter((p) => p % T !== 0 && ggt(p, T) > 1));
const gem = (p, T) => (p > T ? br(p % T, T, Math.floor(p / T)) : br(p, T));
const gek = (p, T) => { const g = ggt(p, T); return [p / g, T / g]; };
const gemGek = (p, T) => { const [z, n] = gek(p, T); return gem(z, n); };
const ausschnitt = (T, g, ganze = 1, extra = {}) => ({ von: g * T, bis: (g + ganze) * T, schritt: 1, beschriftung: T, teiler: T, ausschnitt: true, ...extra });
// Tippfehler beim Eintragen: Nachbarstriche und der Strich, bei dem die Striche statt der Abstände gezählt wurden.
const daneben = (st, p, weitere = []) => fehlerliste(p, [[p - 1, 'bruchstrahl-striche'], [p + 1, 'bruchstrahl-striche'], ...weitere]).filter((f) => f.wert >= st.von && f.wert <= st.bis && (f.wert - st.von) % st.schritt === 0);

export function bruecheAmZahlenstrahl() {
  // ================= Z1: ablesen =================
  const tZ1 = h3('Zähle die Abstände von 0 bis 1. Das ist der Nenner.', 'Von 0 bis 1 sind es 4 Abstände. Der Pfeil steht nach 3 Abständen. Das ist 3⁄4.', 'Zähle dann die Abstände von 0 bis zum Pfeil. Das ist der Zähler.');
  const lies = (p, T) => [[br(p, T + 1), 'bruchstrahl-striche'], [br(T - p, T), 'bruch-teil-zu-rest'], [br(T, p), 'bruch-vertauscht']].filter(([x]) => { const [a, c] = x.split('⁄').map(Number); return a * T !== c * p; });
  sechs(Z1, 'F', [
    () => { const T = wahl([3, 4, 5]), p = fremd(T);
      return bruch(Z('Auf welche Zahl zeigt der Pfeil?', 'Schreibe die Zahl als Bruch.'), br(p, T), lies(p, T), tZ1, { gekuerzt: true, bild: B.strahl(bstrahl(T, 1, { pfeil: p })), nachweis: [S(br(p, T))] }); },
    () => { const T = wahl([3, 4, 5, 6, 7, 8, 9, 10].filter((x) => x !== 10)), p = zz(1, T - 1);
      return zahl(Z('Schau auf den Zahlenstrahl.', 'Wie viele Abstände sind es von 0 bis 1?'), T, fehlerliste(T, [[T + 1, 'bruchstrahl-striche'], [T - 1, 'bruchstrahl-striche'], [p, 'sach-frage-verfehlt']]),
        h3('Zähle die Abstände zwischen den Strichen, nicht die Striche.', 'Bei 5 Strichen von 0 bis 1 sind es 4 Abstände.', 'Tippe beim Zählen auf jeden Abstand. Beginne bei der 0.'), { bild: B.strahl(bstrahl(T, 1, { pfeil: p })), nachweis: [{ art: 'abstaende', zahl: T }, HILFS(0, 'Anfang der Strecke'), HILFS(1, 'Ende der Strecke')] }); },
    () => { const T = wahl([5, 6, 7, 8, 9]), p = fremd(T, 2, T - 2);
      if (!p || 2 * p === T) return null;
      return auswahl(Z('Welcher Bruch gehört zum Pfeil?'), [opt(br(p, T), true), opt(br(p, T + 1), false, 'bruchstrahl-striche'), opt(br(T - p, T), false, 'bruch-teil-zu-rest')], tZ1, { bild: B.strahl(bstrahl(T, 1, { pfeil: p })), nachweis: [S(br(p, T)), WERT(br(p, T), true)] }); },
    () => { const T = wahl([6, 7, 8, 9]), p = fremd(T);
      return bruch(Z('Auf welche Zahl zeigt der Pfeil?', 'Schreibe die Zahl als Bruch.'), br(p, T), lies(p, T), tZ1, { gekuerzt: true, bild: B.strahl(bstrahl(T, 1, { pfeil: p })), nachweis: [S(br(p, T))] }); },
    () => { const T = wahl([4, 6, 8, 9]), p = kuerzbar(T), [z, n] = gek(p, T);
      return bruch(Z('Auf welche Zahl zeigt der Pfeil?', 'Schreibe die Zahl als Bruch.', 'Kürze so weit wie möglich.'), br(z, n), lies(p, T),
        h3('Lies zuerst den Bruch ab. Kürze ihn dann.', 'Der Pfeil steht bei 2⁄4. Gekürzt ist das 1⁄2.', `Der Pfeil steht bei ${br(p, T)}. Teile Zähler und Nenner durch ${p / z}.`), { gekuerzt: true, bild: B.strahl(bstrahl(T, 1, { pfeil: p })), nachweis: [S(br(p, T))] }); },
    () => { const T = wahl([5, 7, 8, 9]), p = fremd(T);
      return luecken(Z('Der Pfeil zeigt auf einen Bruch.', 'Der Zähler heißt {{a}}.', 'Der Nenner heißt {{b}}.'), { a: [p, fehlerliste(p, [[T - p, 'bruch-teil-zu-rest'], [p + 1, 'bruchstrahl-striche'], [T, 'bruch-vertauscht']])], b: [T, fehlerliste(T, [[T + 1, 'bruchstrahl-striche'], [p, 'bruch-vertauscht']])] }, tZ1,
        { bild: B.strahl(bstrahl(T, 1, { pfeil: p })), nachweis: [S(br(p, T)), { art: 'abstaende', zahl: T }, { art: 'teil', bruch: br(p, T), was: 'zaehler', zahl: p }] }); },
  ]);
  const tZ1G = h3('Zähle die Abstände von 0 bis 1. Das ist der Nenner. Er gilt auch hinter der 1.', 'Von 0 bis 1 sind es 4 Abstände. Der Pfeil steht 3 Abstände hinter der 1. Das ist 1 3⁄4.', 'Schreibe zuerst die Ganzen. Zähle dann die Abstände vom letzten Ganzen bis zum Pfeil.');
  sechs(Z1, 'G', [
    () => { const T = wahl([2, 3, 4, 5, 6]), bis = wahl([2, 3]), p = fremd(T, T + 1, bis * T - 1);
      return bruch(Z('Auf welche Zahl zeigt der Pfeil?', 'Schreibe als gemischte Zahl.'), gem(p, T), [[br(p % T, T + 1, Math.floor(p / T)), 'bruchstrahl-striche'], [br(p % T, bis * T, Math.floor(p / T)), 'bruch-ganzes-teil']], tZ1G,
        { gekuerzt: true, form: 'gemischt', bild: B.strahl(bstrahl(T, bis, { pfeil: p })), nachweis: [S(gem(p, T))] }); },
    () => { const T = wahl([3, 4, 5, 6, 8]), p = fremd(T, T + 1, 2 * T - 1);
      return bruch(Z('Auf welche Zahl zeigt der Pfeil?', 'Schreibe als Bruch.'), br(p, T), [[br(p, 2 * T), 'bruch-ganzes-teil'], [br(p - T, T), 'gemischt-umwandeln'], [br(T, p), 'bruch-vertauscht']],
        h3('Zähle alle Abstände von 0 bis zum Pfeil. Das ist der Zähler.', 'Von 0 bis 1 sind es 4 Abstände. Der Pfeil steht nach 7 Abständen. Das ist 7⁄4.', 'Der Nenner ist die Zahl der Abstände von 0 bis 1.'), { gekuerzt: true, bild: B.strahl(bstrahl(T, 2, { pfeil: p })), nachweis: [S(br(p, T))] }); },
    () => { const T = wahl([6, 8, 12]), bis = T === 12 ? 1 : wahl([1, 2]), p = kuerzbar(T, 1, bis * T - 1), [z, n] = gek(p, T);
      return bruch(Z('Auf welche Zahl zeigt der Pfeil?', 'Kürze vollständig.'), gem(z, n), [[br(p % T, T + 1, Math.floor(p / T)), 'bruchstrahl-striche']].filter(([x]) => !x.startsWith('0')),
        h3('Lies zuerst ab. Kürze dann den Bruch.', 'Der Pfeil steht bei 6⁄8. Gekürzt ist das 3⁄4.', `Der Pfeil steht bei ${gem(p, T)}. Kürze den Bruch mit ${p / z}.`), { gekuerzt: true, bild: B.strahl(bstrahl(T, bis, { pfeil: p })), nachweis: [S(gem(p, T))] }); },
    () => { const T = wahl([3, 4, 5, 6, 8, 12]), bis = T > 6 ? 2 : wahl([2, 3]), p = zz(T + 1, bis * T - 1);
      return zahl(Z('Schau auf den Zahlenstrahl.', 'In wie viele Abstände ist ein Ganzes geteilt?'), T, fehlerliste(T, [[T + 1, 'bruchstrahl-striche'], [bis * T, 'bruch-ganzes-teil'], [T - 1, 'bruchstrahl-striche']]),
        h3('Ein Ganzes reicht von 0 bis 1. Zähle dort die Abstände.', 'Von 0 bis 1 sind es 4 Abstände. Die Einteilung ist in Viertel.', 'Zähle nur von 0 bis 1 und nicht weiter.'), { bild: B.strahl(bstrahl(T, bis, { pfeil: p })), nachweis: [{ art: 'abstaende', zahl: T }] }); },
    () => { const T = wahl([3, 4, 5]), p = fremd(T, T + 1, 2 * T - 1), [a, c] = zweiKinder();
      return auswahl(Z(`${a} liest am Pfeil ${br(p, 2 * T)} ab.`, `${c} liest ${br(p, T)} ab.`, 'Welcher Bruch stimmt?'), [opt(br(p, T), true), opt(br(p, 2 * T), false, 'bruch-ganzes-teil'), opt(br(p, T + 1), false, 'bruchstrahl-striche')],
        h3('Der Nenner zählt die Abstände von 0 bis 1 und nicht bis 2.', 'Von 0 bis 1 sind es 4 Abstände. Der Pfeil steht nach 5 Abständen. Das ist 5⁄4 und nicht 5⁄8.', 'Zähle zuerst die Abstände von 0 bis 1. Zähle dann von 0 bis zum Pfeil.'), { bild: B.strahl(bstrahl(T, 2, { pfeil: p })), nachweis: [S(br(p, T)), WERT(br(p, T), true), HILFS(br(p, 2 * T), 'falsch abgelesener Bruch aus dem Text')] }); },
    () => { const T = wahl([3, 4, 5, 6]), p = fremd(T, T + 1, 2 * T - 1), g = 1, k = p - T, kn = zweiKinder()[0], stimmt = wahl([true, false, false]), falle = br(k, T, 10 + k === p ? 2 : Math.floor(p / 10) || 2), gesagt = stimmt ? br(k, T, g) : falle, glg = (x) => `${br(p, T)} = ${x}`;
      return auswahl(Z(`Der Pfeil zeigt auf ${br(p, T)}.`, `${kn} sagt: „Das ist dasselbe wie ${gesagt}.“`, 'Stimmt das?'), [opt('Stimmt.', stimmt, stimmt ? undefined : 'gemischt-umwandeln'), opt(`Falsch. Es gilt ${glg(stimmt ? falle : br(k, T, g))}.`, !stimmt, stimmt ? 'gemischt-umwandeln' : undefined), opt(`Falsch. Es gilt ${glg(br(T - k, T, g))}.`, false, 'bruch-teil-zu-rest')].filter((o, i, l) => l.findIndex((x) => x.text === o.text) === i),
        h3('Am Zahlenstrahl siehst du die Ganzen. Zähle die Abstände hinter dem letzten Ganzen.', '7⁄4 liegt 3 Abstände hinter der 1. Also 7⁄4 = 1 3⁄4.', 'Suche das letzte Ganze vor dem Pfeil. Zähle von dort die Abstände.'), { bild: B.strahl(bstrahl(T, 2, { pfeil: p })), nachweis: [{ art: 'urteil', stimmt, behauptung: glg(gesagt) }] }); },
  ]);
  sechs(Z1, 'M', [
    () => { const T = wahl([3, 4, 5, 6, 7, 8, 9]), g = zz(3, 9), ganze = T <= 5 ? 2 : 1, p = g * T + fremd(T, 1, T - 1) + (ganze === 2 ? wahl([0, T]) : 0);
      return bruch('Der Zahlenstrahl zeigt einen Ausschnitt. Auf welche Zahl zeigt der Pfeil? Schreibe als gemischte Zahl.', gem(p, T), [[br(p % T, T + 1, Math.floor(p / T)), 'bruchstrahl-striche'], [br(p % T, T), 'gemischt-umwandeln'], [br(p % T, T, Math.floor(p / T) + 1), 'gemischt-umwandeln']],
        h2('Der Strahl beginnt nicht bei 0. Zähle die Abstände zwischen zwei benachbarten Ganzen: Das ist der Nenner.', `Zwischen zwei Ganzen liegen ${T} Abstände. Schreibe das letzte Ganze vor dem Pfeil auf und zähle von dort die Abstände bis zum Pfeil.`), { gekuerzt: true, form: 'gemischt', bild: B.strahl(ausschnitt(T, g, ganze, { pfeil: p })), nachweis: [S(gem(p, T))] }); },
    () => { const T = wahl([12, 15, 16, 20]), bis = T <= 16 ? 2 : 1, p = kuerzbar(T, 1, bis * T - 1), [z, n] = gek(p, T);
      return bruch('Auf welche Zahl zeigt der Pfeil? Kürze vollständig.', gem(z, n), [[br(p % T, T + 1, Math.floor(p / T)), 'bruchstrahl-striche']].filter(([x]) => !x.startsWith('0')),
        h2('Lies zuerst mit dem Nenner der Einteilung ab und kürze dann vollständig.', `Ein Ganzes hat ${T} Abstände. Der Pfeil steht bei ${gem(p, T)}. Kürze den Bruch mit ${p / z}.`), { gekuerzt: true, bild: B.strahl(bstrahl(T, bis, { pfeil: p })), nachweis: [S(gem(p, T))] }); },
    () => { const T = wahl([3, 4, 5, 6, 8]), k = wahl([2, 3, 4, 5]), p = fremd(T);
      return luecken(`Der Pfeil zeigt auf einen Bruch. Schreibe ihn mit dem Nenner ${T * k}: {{a}}⁄${T * k}`, { a: [p * k, fehlerliste(p * k, [[p, 'erweitern-nur-ein-teil'], [p + T * k - T, 'erweitern-addiert'], [k, 'sach-frage-verfehlt']])] },
        h2('Lies zuerst den Bruch ab. Erweitere ihn dann auf den verlangten Nenner.', `Der Pfeil steht bei ${br(p, T)}. Erweitere mit ${k}.`), { bild: B.strahl(bstrahl(T, 1, { pfeil: p })), nachweis: [S(br(p, T)), `${T * k} : ${T} = ${k}`, UMF([p, T], k, 'erweitern')] }); },
    () => { const T = wahl([5, 6, 7, 9]), p = fremd(T, T + 1, 3 * T - 1);
      return bruch('Auf welche Zahl zeigt der Pfeil? Schreibe als Bruch.', br(p, T), [[br(p, 3 * T), 'bruch-ganzes-teil'], [br(p % T, T), 'gemischt-umwandeln'], [br(T, p), 'bruch-vertauscht']],
        h2('Der Nenner ist die Zahl der Abstände von 0 bis 1. Der Zähler zählt alle Abstände von 0 bis zum Pfeil.', `Ein Ganzes hat ${T} Abstände. Vor dem Pfeil liegen ${Math.floor(p / T)} Ganze und noch ${p % T} ${p % T === 1 ? 'Abstand' : 'Abstände'}.`), { gekuerzt: true, bild: B.strahl(bstrahl(T, 3, { pfeil: p })), nachweis: [S(br(p, T))] }); },
    () => { const T = wahl([4, 5, 6, 8]), p = zz(2, 2 * T - 3), d = 2 * T - p, [z, n] = gek(d, T);
      if (p % T === 0 || d % T === 0) return null;
      return bruch('Der Pfeil zeigt auf eine Zahl. Wie weit ist es von dieser Zahl bis zur 2? Schreibe als Bruch oder gemischte Zahl und kürze vollständig.', gem(z, n), [[gemGek(p, T), 'sach-frage-verfehlt']].filter(([x]) => x !== gem(z, n)),
        h2('Zähle die Abstände vom Pfeil bis zur 2. Der Nenner ist die Zahl der Abstände in einem Ganzen.', `Vom Pfeil bis zur 2 sind es ${d} Abstände. Ein Ganzes hat ${T} Abstände.`), { gekuerzt: true, bild: B.strahl(bstrahl(T, 2, { pfeil: p })), nachweis: [S(gem(p, T)), `2 − ${gem(p, T)} = ${gem(z, n)}`] }); },
    () => { const striche = wahl([4, 5, 6, 7, 8, 10, 11]), T = striche + 1, k = fremd(T, 2, T - 1);
      return bruch(`Zwischen 0 und 1 liegen an einem Zahlenstrahl ${striche} Teilstriche in gleichen Abständen. Auf welche Zahl zeigt der ${k}. Teilstrich nach der 0?`, br(k, T), [[br(k, striche), 'bruchstrahl-striche'], [br(k, striche + 2), 'bruchstrahl-striche']].filter(([x]) => { const [a, c] = x.split('⁄').map(Number); return a < c; }),
        h2('Zwischen 0 und 1 gibt es einen Abstand mehr als Teilstriche. Die Zahl der Abstände ist der Nenner.', `Es sind ${striche} + 1 = ${T} Abstände. Der ${k}. Teilstrich liegt ${k} Abstände hinter der 0.`), { gekuerzt: true, nachweis: [`${striche} + 1 = ${T}`, `${k} : ${T} = ${br(k, T)}`, HILFS(0, 'Anfang der Strecke')] }); },
  ]);
  sechs(Z1, 'E', [
    () => { const [G, m] = wahl([[2, 5], [2, 7], [3, 4], [3, 5], [2, 9], [3, 8], [4, 5], [3, 7]]), k = zz(1, m - 1), p = G * k;
      return bruch(`Die Strecke von 0 bis ${G} ist in ${m} gleich große Abstände geteilt. Auf welche Zahl zeigt der Pfeil? Kürze vollständig.`, gem(p, m), [[br(k, m), 'bruch-ganzes-teil'], [br(k, m + 1), 'bruchstrahl-striche']],
        h1(`Wie lang ist ein Abstand, wenn ${G} Ganze in ${m} gleich große Abstände geteilt werden? Zähle dann die Abstände bis zum Pfeil.`), { gekuerzt: true, bild: B.strahl({ von: 0, bis: G * m, schritt: G, beschriftung: G * m, teiler: m, pfeil: p }), nachweis: [S(gem(p, m)), HILFS(G, 'Ende des Strahls'), HILFS(m, 'Anzahl der Abstände')] }); },
    () => { const T = wahl([12, 15, 16, 18, 20]), g = zz(4, 12), r = kuerzbar(T), p = g * T + r, [z, n] = gek(r, T);
      return bruch('Der Zahlenstrahl zeigt einen Ausschnitt. Auf welche Zahl zeigt der Pfeil? Schreibe als vollständig gekürzte gemischte Zahl.', br(z, n, g), [[br(z, n, g + 1), 'gemischt-umwandeln'], [br(z, n), 'gemischt-umwandeln']],
        h1('Zähle die Abstände zwischen zwei benachbarten Ganzen. Lies ab und kürze den Bruchteil vollständig.'), { gekuerzt: true, form: 'gemischt', bild: B.strahl(ausschnitt(T, g, 1, { pfeil: p })), nachweis: [S(br(r, T, g))] }); },
    () => { const T = wahl([4, 5, 6, 8, 10, 12].filter((x) => x !== 10)), p = zz(1, T - 2), z = p + T, n = 2 * T, g = ggt(z, n);
      return bruch('Der Pfeil zeigt auf eine Zahl. Welche Zahl liegt genau in der Mitte zwischen dieser Zahl und 1? Kürze vollständig.', br(z / g, n / g), [[gemGek(p, T), 'sach-frage-verfehlt']].filter(([x]) => x !== br(z / g, n / g)),
        h1('Liegt kein Teilstrich genau in der Mitte, dann verfeinere die Einteilung: Teile jeden Abstand in zwei gleich große Abstände.'), { gekuerzt: true, bild: B.strahl(bstrahl(T, 1, { pfeil: p })), nachweis: [S(br(p, T)), `(${br(p, T)} + 1) : 2 = ${br(z / g, n / g)}`] }); },
    () => { const striche = wahl([6, 7, 9, 10, 11, 14]), T = striche + 1, g = zz(2, 9), k = fremd(T, 2, T - 1);
      return bruch(`An einem Zahlenstrahl liegen zwischen ${g} und ${g + 1} genau ${striche} Teilstriche in gleichen Abständen. Auf welche Zahl zeigt der ${k}. Teilstrich nach der ${g}? Schreibe als gemischte Zahl.`, br(k, T, g), [[br(k, striche, g), 'bruchstrahl-striche'], [br(k, striche + 2, g), 'bruchstrahl-striche']].filter(([x]) => { const [a, c] = x.split(' ')[1].split('⁄').map(Number); return a < c; }),
        h1('Zwischen zwei Ganzen gibt es einen Abstand mehr als Teilstriche.'), { gekuerzt: true, form: 'gemischt', nachweis: [`${striche} + 1 = ${T}`, `${k} : ${T} = ${br(k, T)}`, `${g} + ${br(k, T)} = ${br(k, T, g)}`, HILFS(g + 1, 'das nächste Ganze')] }); },
    () => { const T = wahl([3, 4, 5, 6, 8]), k = wahl([2, 3, 4, 5]), p = zz(1, 2 * T - 1);
      if (p % T === 0) return null;
      return zahl(`Der Pfeil zeigt auf eine Zahl. Jetzt wird die Einteilung verfeinert: Jeder Abstand wird in ${k} gleich große Abstände geteilt. Der wievielte Teilstrich nach der 0 ist dann der Strich am Pfeil?`, p * k, fehlerliste(p * k, [[p, 'erweitern-nur-ein-teil'], [p + k, 'erweitern-addiert'], [T * k, 'sach-frage-verfehlt']]),
        h1('Verfeinern ist Erweitern: Aus jedem Abstand werden mehrere, also wachsen Zähler und Nenner mit derselben Zahl.'), { bild: B.strahl(bstrahl(T, 2, { pfeil: p })), nachweis: [S(br(p, T)), UMF([p, T], k, 'erweitern'), HILFS(0, 'Anfang des Strahls')] }); },
    () => { const T = wahl([4, 6, 8, 12]), p = zz(1, T - 1), ziel = (3 * T) / 2, k = ziel - p;
      return zahl(`Der Pfeil zeigt auf eine Zahl. Wie viele Abstände weiter rechts liegt ${br(1, 2, 1)}?`, k, fehlerliste(k, [[k + 1, 'bruchstrahl-striche'], [k - 1, 'bruchstrahl-striche'], [T / 2, 'gemischt-umwandeln'], [ziel, 'sach-frage-verfehlt']]),
        h1(`Schreibe ${br(1, 2, 1)} mit dem Nenner der Einteilung. Der wievielte Teilstrich ist das?`), { bild: B.strahl(bstrahl(T, 2, { pfeil: p })), nachweis: [S(br(p, T)), HILFS(br(1, T), 'ein Abstand am Zahlenstrahl'), `(${br(1, 2, 1)} − ${br(p, T)}) : ${br(1, T)} = ${k}`] }); },
  ]);

  // ================= Z2: eintragen =================
  const tZ2 = h3('Der Nenner sagt, in wie viele Abstände die Strecke von 0 bis 1 geteilt ist.', 'Für 3⁄4 gehst du von 0 aus 3 Abstände weit.', 'Gehe von 0 aus so viele Abstände, wie der Zähler sagt.');
  const mark = (text, st, p, zahlText, hilfen, weitere = [], rechnung = null) => strahl('markieren', text, st, p, daneben(st, p, weitere), hilfen, { nachweis: [...(rechnung ?? []), S(zahlText, Boolean(rechnung))] });
  sechs(Z2, 'F', [
    () => { const T = wahl([3, 4, 5]), p = zz(2, T - 1);
      return mark(Z(`Markiere ${br(p, T)} am Zahlenstrahl.`), bstrahl(T, 1), p, br(p, T), tZ2, [[T - p, 'bruch-teil-zu-rest']]); },
    () => { const T = wahl([6, 7, 8, 9]), p = fremd(T, 2, T - 1);
      return mark(Z(`Markiere ${br(p, T)} am Zahlenstrahl.`), bstrahl(T, 1), p, br(p, T), tZ2, [[T - p, 'bruch-teil-zu-rest']]); },
    () => { const T = wahl([4, 5, 6, 7, 8, 9]);
      return mark(Z(`Markiere ${br(1, T)} am Zahlenstrahl.`), bstrahl(T, 1), 1, br(1, T), h3('Der Zähler ist 1. Du gehst nur einen Abstand weit.', '1⁄4 liegt einen Abstand hinter der 0.', 'Gehe von 0 aus einen Abstand nach rechts.'), [[T - 1, 'bruch-teil-zu-rest']]); },
    () => { const T = wahl([5, 6, 7, 8, 9]), p = T - 1;
      return mark(Z(`Markiere ${br(p, T)} am Zahlenstrahl.`, 'Der Bruch liegt nahe bei der 1.'), bstrahl(T, 1), p, br(p, T), h3('Fast alle Abstände bis zur 1 gehören dazu. Nur einer fehlt.', '3⁄4 liegt einen Abstand vor der 1.', 'Gehe von der 1 aus einen Abstand nach links.'), [[1, 'bruch-teil-zu-rest']]); },
    () => { const [a, k] = wahl([[[1, 2], 2], [[1, 2], 3], [[1, 2], 4], [[1, 3], 2], [[2, 3], 2], [[1, 3], 3], [[2, 3], 3], [[1, 4], 2], [[3, 4], 2]]), T = a[1] * k, p = a[0] * k;
      return mark(Z(`Der Zahlenstrahl hat ${T} Abstände von 0 bis 1.`, `Markiere ${br(...a)}.`), bstrahl(T, 1), p, br(...a), h3('Der Zahlenstrahl hat mehr Abstände als der Nenner sagt. Erweitere den Bruch.', '1⁄2 = 4⁄8. Bei 8 Abständen gehst du 4 Abstände weit.', `Erweitere ${br(...a)} mit ${k}. Gehe dann von 0 aus so viele Abstände.`), [[a[0], 'erweitern-nur-ein-teil']]); },
    () => { const T = wahl([4, 5, 6, 8]), p = zz(2, T - 2);
      if (p * 2 === T) return null;
      return mark(Z(`Von 0 bis 1 sind es ${T} Abstände.`, `Markiere ${br(p, T)} am Zahlenstrahl.`), bstrahl(T, 1), p, br(p, T), tZ2, [[T - p, 'bruch-teil-zu-rest']]); },
  ]);
  const tZ2G = h3('Gehe zuerst zu den Ganzen. Gehe von dort so viele Abstände weiter, wie der Zähler sagt.', '1 3⁄4: Gehe zur 1 und dann noch 3 Abstände weiter.', 'Suche zuerst das Ganze. Zähle dann die Abstände dahinter.');
  sechs(Z2, 'G', [
    () => { const T = wahl([2, 3, 4, 5]), k = zz(1, T - 1), p = T + k;
      return mark(Z(`Markiere ${br(k, T, 1)} am Zahlenstrahl.`), bstrahl(T, 2), p, br(k, T, 1), tZ2G, [[k, 'gemischt-umwandeln']]); },
    () => { const T = wahl([3, 4, 5, 6]), p = fremd(T, T + 1, 2 * T - 1);
      return mark(Z(`Markiere ${br(p, T)} am Zahlenstrahl.`), bstrahl(T, 2), p, br(p, T), h3('Der Zähler ist größer als der Nenner. Der Bruch liegt hinter der 1.', '5⁄4: Gehe von 0 aus 5 Abstände weit. Das ist 1 Abstand hinter der 1.', 'Zähle von 0 aus so viele Abstände, wie der Zähler sagt.'), [[p - T, 'gemischt-umwandeln']]); },
    () => { const [a, k] = wahl([[[1, 2], 3], [[1, 2], 4], [[1, 2], 5], [[1, 3], 2], [[2, 3], 2], [[1, 3], 4], [[2, 3], 4], [[1, 4], 2], [[3, 4], 2], [[3, 4], 3], [[2, 5], 2], [[3, 5], 2]]), T = a[1] * k, p = a[0] * k;
      return mark(Z(`Ein Ganzes hat hier ${T} Abstände.`, `Markiere ${br(...a)}.`), bstrahl(T, 1), p, br(...a), h3('Erweitere den Bruch auf den Nenner der Einteilung.', '3⁄4 = 6⁄8. Bei Achteln gehst du 6 Abstände weit.', `Erweitere ${br(...a)} mit ${k}. Gehe dann von 0 aus so viele Abstände.`), [[a[0], 'erweitern-nur-ein-teil']]); },
    () => { const T = wahl([2, 3, 4, 5]), g = zz(1, 2), k = zz(1, T - 1), p = g * T + k;
      if (g === 1 && T <= 5 && k === 1) return null;
      return mark(Z(`Markiere ${br(k, T, g)} am Zahlenstrahl.`), bstrahl(T, 3), p, br(k, T, g), tZ2G, [[k, 'gemischt-umwandeln'], [g + k, 'gemischt-umwandeln']]); },
    () => { const [a, k] = wahl([[[1, 2], 2], [[1, 2], 3], [[1, 2], 4], [[1, 3], 2], [[2, 3], 2], [[1, 4], 2], [[3, 4], 2]]), T = a[1] * k, p = T + a[0] * k;
      return mark(Z(`Ein Ganzes hat hier ${T} Abstände.`, `Markiere ${br(a[0], a[1], 1)}.`), bstrahl(T, 2), p, br(a[0], a[1], 1), h3('Gehe zuerst zur 1. Erweitere dann den Bruch auf den Nenner der Einteilung.', '1 1⁄2 bei Vierteln: Gehe zur 1. Dann 1⁄2 = 2⁄4, also noch 2 Abstände.', `Erweitere ${br(...a)} mit ${k}. Gehe von der 1 aus so viele Abstände.`), [[T + a[0], 'erweitern-nur-ein-teil'], [a[0] * k, 'gemischt-umwandeln']]); },
    () => { const T = wahl([5, 6, 7, 8, 9]), p = zz(1, T - 3), d = zz(2, T - 1 - p), q = p + d;
      return mark(Z('Markiere eine Zahl am Zahlenstrahl.', `Sie ist um ${br(d, T)} größer als ${br(p, T)}.`), bstrahl(T, 1), q, br(q, T), h3('Suche zuerst den zweiten Bruch am Zahlenstrahl. Gehe von dort weiter nach rechts.', 'Um 2⁄8 größer als 3⁄8: Gehe von 3⁄8 aus 2 Abstände weiter.', `Gehe von ${br(p, T)} aus ${d} Abstände nach rechts.`), [[p, 'sach-schritt-vergessen'], [d, 'sach-schritt-vergessen']], [`${br(p, T)} + ${br(d, T)} = ${br(q, T)}`]); },
  ]);
  const heft = (text, loesung, fehler, hilfen, nachweis) => zahl(`Zeichne in dein Heft einen Zahlenstrahl. ${text}`, loesung, fehlerliste(loesung, fehler), hilfen, { nachweis });
  sechs(Z2, 'M', [
    () => { const [a, k] = wahl([[[2, 3], 4], [[3, 4], 3], [[5, 6], 2], [[3, 4], 4], [[2, 5], 3], [[3, 5], 4], [[5, 8], 2], [[4, 5], 3], [[1, 6], 3], [[3, 8], 2]]), T = a[1] * k, p = a[0] * k;
      return mark(`Ein Ganzes hat hier ${T} Abstände. Markiere ${br(...a)} am Zahlenstrahl.`, bstrahl(T, T > 16 ? 1 : 2), p, br(...a), h2('Die Einteilung ist feiner als der Bruch. Erweitere den Bruch auf den Nenner der Einteilung.', `Erweitere ${br(...a)} mit ${k}. Gehe dann von 0 aus so viele Abstände, wie der neue Zähler sagt.`), [[a[0], 'erweitern-nur-ein-teil']]); },
    () => { const T = wahl([4, 6, 8]), n = T, z = wahl(vorn(2 * T - 1, T + 1).filter((x) => x % T !== 0 && ggt(x, T) > 1));
      return mark(`Markiere ${br(z, n)} am Zahlenstrahl.`, bstrahl(T, 3), z, br(z, n), h2('Der Bruch ist größer als 1. Wie viele Ganze stecken darin?', `Ein Ganzes hat ${T} Abstände. In ${br(z, T)} stecken ${Math.floor(z / T)} Ganze, dazu kommen noch ${z % T} Abstände.`), [[z % T, 'gemischt-umwandeln']]); },
    () => { const [a, K] = wahl([[[5, 6], 12], [[3, 4], 12], [[2, 3], 12], [[3, 5], 10], [[7, 10], 20], [[3, 4], 16], [[5, 8], 16], [[2, 5], 20], [[5, 6], 18], [[4, 9], 18]]), x = (K / a[1]) * a[0];
      return heft(`Die Strecke von 0 bis 1 soll ${K} Kästchen lang sein. Trage ${br(...a)} ein. Beim wievielten Kästchen nach der 0 liegt ${br(...a)}?`, x, [[K / a[1], 'bruchteil-zaehler-vergessen'], [a[0], 'erweitern-nur-ein-teil'], [K - x, 'bruch-teil-zu-rest']],
        h2('Jedes Kästchen ist ein Abstand. Erweitere den Bruch auf den Nenner der Kästchenzahl.', `Rechne ${K} : ${a[1]} = ${K / a[1]}. So viele Kästchen gehören zu einem Teil. Nimm das mit ${a[0]} mal.`), [`${br(...a)} von ${K} = ${x}`, HILFS(0, 'Anfang des Strahls'), HILFS(1, 'Ende der Strecke')]); },
    () => { const T = wahl([3, 4, 5, 6, 8]), g = zz(3, 9), ganze = T <= 5 ? 2 : 1, k = fremd(T), p = g * T + k + (ganze === 2 ? wahl([0, T]) : 0);
      return mark(`Der Zahlenstrahl zeigt einen Ausschnitt. Markiere ${gem(p, T)}.`, ausschnitt(T, g, ganze), p, gem(p, T), h2('Suche zuerst das Ganze am Strahl. Gehe von dort so viele Abstände weiter, wie der Zähler sagt.', `Gehe zur ${Math.floor(p / T)}. Von dort sind es noch ${k} Abstände.`), [[p - k + (T - k), 'bruch-teil-zu-rest']]); },
    () => { const [a, K] = wahl([[[3, 5], 10], [[1, 2], 8], [[3, 4], 8], [[2, 3], 6], [[1, 4], 12], [[5, 6], 12], [[2, 5], 10]]), g = zz(1, 2), x = g * K + (K / a[1]) * a[0];
      return heft(`Die Strecke von 0 bis 1 soll ${K} Kästchen lang sein. Trage ${br(a[0], a[1], g)} ein. Beim wievielten Kästchen nach der 0 liegt ${br(a[0], a[1], g)}?`, x, [[(K / a[1]) * a[0], 'gemischt-umwandeln'], [g * K + a[0], 'erweitern-nur-ein-teil'], [g + (K / a[1]) * a[0], 'gemischt-umwandeln']],
        h2('Jedes Ganze ist so viele Kästchen lang wie die Strecke von 0 bis 1. Dazu kommt der Bruchteil.', `${g === 1 ? 'Ein Ganzes ist' : `${g} Ganze sind`} ${g * K} Kästchen. Dazu kommen ${br(...a)} von ${K} Kästchen.`), [`${br(a[0], a[1], g)} von ${K} = ${x}`, HILFS(0, 'Anfang des Strahls'), HILFS(1, 'Ende der Strecke')]); },
    () => { const [a, c, N] = wahl([[[2, 3], [3, 4], 12], [[1, 2], [2, 3], 6], [[3, 4], [5, 6], 12], [[1, 4], [5, 6], 12], [[2, 3], [4, 5], 15], [[1, 6], [3, 8], 24], [[1, 2], [3, 5], 10], [[5, 6], [7, 8], 24], [[3, 4], [7, 10], 20]]);
      return zahl(`Du willst ${br(...a)} und ${br(...c)} am selben Zahlenstrahl eintragen. Beide Brüche sollen genau auf einem Teilstrich liegen. In wie viele Abstände teilst du die Strecke von 0 bis 1 mindestens?`, N, fehlerliste(N, [[a[1] * c[1], 'sach-frage-verfehlt'], [a[1] + c[1], 'erweitern-addiert'], [Math.max(a[1], c[1]), 'sach-schritt-vergessen']]),
        h2('Die Zahl der Abstände muss ein gemeinsamer Nenner beider Brüche sein.', `Gesucht ist das kleinste gemeinsame Vielfache von ${a[1]} und ${c[1]}.`), { nachweis: [{ art: 'kgv', zahlen: [a[1], c[1]], zahl: N }, HILFS(br(...a), 'erster Bruch'), HILFS(br(...c), 'zweiter Bruch'), HILFS(0, 'Anfang der Strecke'), HILFS(1, 'Ende der Strecke')] }); },
  ]);
  sechs(Z2, 'E', [
    () => { const [a, T] = wahl([[[5, 6], 24], [[3, 8], 24], [[7, 12], 24], [[2, 3], 18], [[5, 9], 18], [[4, 5], 20], [[7, 10], 20], [[3, 4], 28], [[5, 7], 28], [[5, 6], 30], [[7, 15], 30], [[5, 9], 36], [[7, 12], 36]]), p = (T / a[1]) * a[0];
      return mark(`Ein Ganzes hat hier ${T} Abstände. Markiere ${br(...a)}.`, bstrahl(T, 1), p, br(...a), h1('Erweitere den Bruch auf den Nenner der Einteilung. Die Zahlen am Strahl helfen beim Abzählen wenig, rechne lieber.'), [[a[0], 'erweitern-nur-ein-teil'], [T / a[1], 'bruchteil-zaehler-vergessen']]); },
    () => { const [l, r, T] = wahl([[[1, 3], [1, 2], 12], [[1, 2], [2, 3], 12], [[1, 4], [1, 3], 24], [[1, 2], [3, 4], 8], [[2, 3], [3, 4], 24], [[1, 4], [1, 2], 8], [[1, 3], [2, 3], 6], [[1, 6], [1, 2], 12], [[1, 2], [5, 6], 12]]), z = l[0] * r[1] + r[0] * l[1], n = 2 * l[1] * r[1], g = ggt(z, n), p = (T / (n / g)) * (z / g);
      if (!Number.isInteger(p)) return null;
      return mark(`Ein Ganzes hat hier ${T} Abstände. Markiere die Zahl, die genau in der Mitte zwischen ${br(...l)} und ${br(...r)} liegt.`, bstrahl(T, 1), p, br(z / g, n / g), h1('Suche zuerst beide Brüche am Zahlenstrahl. Erweitere sie dazu auf den Nenner der Einteilung.'), [[(T / l[1]) * l[0], 'sach-schritt-vergessen'], [(T / r[1]) * r[0], 'sach-schritt-vergessen']], [`(${br(...l)} + ${br(...r)}) : 2 = ${br(z / g, n / g)}`]); },
    () => { const [a, c, K] = wahl([[[5, 8], [5, 6], 24], [[1, 3], [5, 8], 24], [[1, 4], [2, 3], 12], [[2, 5], [3, 4], 20], [[1, 6], [7, 9], 18], [[3, 10], [3, 4], 20], [[1, 3], [4, 5], 30], [[3, 8], [5, 6], 24]]), x = (K / a[1]) * a[0], y = (K / c[1]) * c[0];
      return heft(`Die Strecke von 0 bis 1 soll ${K} Kästchen lang sein. Trage ${br(...a)} und ${br(...c)} ein. Wie viele Kästchen liegen zwischen den beiden Brüchen?`, y - x, [[y, 'sach-schritt-vergessen'], [x, 'sach-schritt-vergessen'], [c[0] - a[0], 'erweitern-nur-ein-teil'], [x + y, 'sach-falsche-rechnung']],
        h1('Rechne für jeden Bruch aus, beim wievielten Kästchen er liegt. Bilde dann den Unterschied.'), [`${br(...a)} von ${K} = ${x}`, `${br(...c)} von ${K} = ${y}`, `${y} − ${x} = ${y - x}`, HILFS(0, 'Anfang des Strahls'), HILFS(1, 'Ende der Strecke')]); },
    () => { const [a, c, d, N] = wahl([[[1, 2], [2, 3], [5, 8], 24], [[3, 4], [5, 6], [7, 8], 24], [[1, 2], [3, 5], [5, 6], 30], [[2, 3], [3, 4], [4, 5], 60], [[1, 4], [5, 6], [3, 10], 60], [[2, 3], [5, 9], [1, 6], 18], [[3, 4], [2, 5], [7, 10], 20], [[5, 6], [3, 8], [7, 12], 24]]);
      return heft(`Du sollst ${br(...a)}, ${br(...c)} und ${br(...d)} eintragen. Alle drei Brüche sollen genau auf einer Kästchenlinie liegen. Wie viele Kästchen lang zeichnest du die Strecke von 0 bis 1 mindestens?`, N, [[a[1] * c[1] * d[1], 'sach-frage-verfehlt'], [a[1] + c[1] + d[1], 'erweitern-addiert'], [Math.max(a[1], c[1], d[1]), 'sach-schritt-vergessen']],
        h1('Die Kästchenzahl muss ein gemeinsamer Nenner aller drei Brüche sein. Gesucht ist der kleinste, also der Hauptnenner.'), [{ art: 'kgv', zahlen: [a[1], c[1], d[1]], zahl: N }, HILFS(br(...a), 'erster Bruch'), HILFS(br(...c), 'zweiter Bruch'), HILFS(br(...d), 'dritter Bruch'), HILFS(0, 'Anfang der Strecke'), HILFS(1, 'Ende der Strecke')]); },
    () => { const [G, m] = wahl([[2, 5], [2, 7], [3, 4], [3, 5], [2, 9], [3, 8], [4, 5], [3, 7]]), k = zz(1, m - 1), p = G * k, st = { von: 0, bis: G * m, schritt: G, beschriftung: G * m, teiler: m };
      return strahl('markieren', `Die Strecke von 0 bis ${G} ist in ${m} gleich große Abstände geteilt. Markiere ${gem(p, m)}.`, st, p, fehlerliste(p, [[p - G, 'bruchstrahl-striche'], [p + G, 'bruchstrahl-striche']]).filter((f) => f.wert > 0 && f.wert < G * m),
        h1(`Wie lang ist ein Abstand, wenn ${G} Ganze in ${m} gleich große Abstände geteilt werden? Der wievielte Teilstrich passt dann zum Bruch?`), { nachweis: [S(gem(p, m)), HILFS(G, 'Ende des Strahls'), HILFS(m, 'Anzahl der Abstände'), HILFS(0, 'Anfang des Strahls')] }); },
    () => { const T = wahl([12, 16, 18, 20, 24]), [z, n] = wahl([[1, 4], [1, 3], [3, 8], [5, 12], [2, 9], [3, 10], [1, 6], [2, 5], [5, 16]].filter(([, x]) => T % x === 0)), p = (T / n) * z * 2, g = ggt(2 * z, n);
      if (p >= T) return null;
      return mark(`Ein Ganzes hat hier ${T} Abstände. Markiere die Zahl, die doppelt so weit von der 0 entfernt ist wie ${br(z, n)}.`, bstrahl(T, 1), p, br((2 * z) / g, n / g), h1('Suche zuerst den Bruch am Zahlenstrahl. Gehe dann von der 0 aus doppelt so viele Abstände.'), [[p / 2, 'sach-schritt-vergessen']], [`2 · ${br(z, n)} = ${br((2 * z) / g, n / g)}`, { wert: '0', grund: 'Anfang des Strahls' }]); },
  ]);
}
