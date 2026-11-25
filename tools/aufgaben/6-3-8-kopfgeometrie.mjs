// Aufgaben zu 6.3.8 „Kopfgeometrie“ (Lernziele K1 und K2) nach ADR 0015 und ADR 0045. 3.7 (Medienkompetenz) entfällt.
// K1: Würfelnetze im Kopf falten, gegenüberliegende Flächen, Spielwürfel (gegenüber zusammen 7). K2: Würfelbauten zählen, Ansichten, Würfel kippen.
// Wortspeicher: F „Würfelbau“, „falten“ (ohne „Würfelnetz“ und „gegenüber“); ab G „Würfelnetz“, „gegenüber“; ab M „kippen“.
// Würfelbauten: Jeder Würfel steht auf dem Boden oder auf einem Würfel. Wird gezählt, ist jeder Turm oben sichtbar (hinten höher als vorne).
import { sechs } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, Z, H, zahl, opt, auswahl, kind, U, GEGEN, NETZ, KIPP, WZ, ANSICHT, wuerfelBild, bau, bildkarten, WUERFELNETZE, KREUZ, zufallsLage, netzBild,
  gegenueberVon, keinNetz, spielwuerfel, kippe, zufallsBau, grundrissMitZahlen, risseBild, riss, ansicht } from './6-3-koerper.mjs';
import { netzAufgabe } from './6-3-1-quader.mjs';

const K1 = '6.3.8-K1', K2 = '6.3.8-K2';

// ---------- Netze mit Namen und Spielwürfelnetze ----------
const namenNetz = (z) => { const namen = mische(['A', 'B', 'C', 'D', 'E', 'F']); return { namen, bild: netzBild(z, { namen }) }; };
// Zahlen 1 bis 6 so verteilt, dass gegenüber zusammen 7 ergibt. falsch: zwei Zahlen aus verschiedenen Paaren getauscht.
function spielNetz(z, { falsch = false } = {}) {
  const paare = []; for (let i = 0; i < 6; i++) { const j = gegenueberVon(z, i); if (i < j) paare.push([i, j]); }
  const werte = mische([[1, 6], [2, 5], [3, 4]]), zahlen = [];
  paare.forEach(([i, j], k) => { const [u, v] = zz(0, 1) ? werte[k] : [werte[k][1], werte[k][0]]; zahlen[i] = u; zahlen[j] = v; });
  if (falsch) { const [i] = paare[0], [j] = paare[1]; [zahlen[i], zahlen[j]] = [zahlen[j], zahlen[i]]; }
  return zahlen;
}
const hSieben = (n) => H(n, 'Bei einem Spielwürfel ergeben die Augen oben und unten zusammen 7.', 'Das gilt auch für vorne und hinten, links und rechts.', 'Rechne 7 minus die Zahl, die du kennst.');

// ---------- K1: Würfelnetze im Kopf falten ----------
function k1() {
  sechs(K1, 'F', [
    () => { const z = zufallsLage(wahl(WUERFELNETZE.slice(0, 6))), { namen, bild } = namenNetz(z), i = zz(0, 5), j = gegenueberVon(z, i);
      bild.flaechen[i].farbe = 1;
      return auswahl(Z(`Die gelbe Fläche ${namen[i]} ist der Boden.`, 'Du faltest einen Würfel.', 'Kreuze die obere Fläche an.'), [opt(namen[j], true), ...mische(namen.filter((_, k) => k !== i && k !== j)).slice(0, 2).map((x) => opt(x, false, 'gegenueber-benachbart'))],
        H('F', 'Die Flächen am Boden klappen hoch.', 'Sie werden die Seiten.', 'Oben liegt die Fläche, die den Boden nicht berührt.'), { bild, nachweis: [GEGEN(namen[i], { welche: 'gegen' })] }); },
    () => { const ok = zz(0, 1) === 1, z = ok ? zufallsLage(wahl(WUERFELNETZE)) : zufallsLage(keinNetz());
      return auswahl(Z('Du willst aus dem Netz einen Würfel falten.', 'Kreuze die richtige Antwort an.'), [opt('Ja.\nJede Seite kommt genau einmal vor.', ok, ok ? undefined : 'netz-nur-gezaehlt'), opt('Nein.\nZwei Quadrate landen an derselben Stelle.', !ok, ok ? 'netz-nur-gezaehlt' : undefined)],
        H('F', 'Lege ein Quadrat als Boden fest.', 'Klappe die anderen Quadrate in Gedanken hoch.', 'Prüfe, ob zwei Quadrate an dieselbe Stelle kommen.'), { bild: netzBild(z), nachweis: [NETZ('wuerfel', { faltbar: ok }), U(ok)] }); },
    () => { const w = spielwuerfel();
      return zahl(Z('Das Bild zeigt einen Spielwürfel.', 'Oben und unten ergeben zusammen 7.', 'Gib die Zahl auf der unteren Fläche an.'), 7 - w.oben, [[w.oben, 'gegenueber-benachbart'], [w.vorne, 'gegenueber-benachbart'], [w.rechts, 'gegenueber-benachbart']],
        hSieben('F'), { bild: wuerfelBild(2, { augen: w }), nachweis: [`7 − ${w.oben} = ${7 - w.oben}`] }); },
    () => netzAufgabe('F', Z('Ein Quadrat fehlt noch.', 'Färbe es.', 'Dann kannst du einen Würfel falten.'), wahl(WUERFELNETZE), H('F', 'Falte in Gedanken.', 'Welche Seite des Würfels fehlt?', 'Färbe das Quadrat dort, wo diese Seite hinklappt.')),
    () => { const z = zufallsLage(KREUZ), { namen, bild } = namenNetz(z), i = zz(0, 5), j = gegenueberVon(z, i), nb = mische(namen.filter((_, k) => k !== i && k !== j)).slice(0, 2);
      bild.flaechen[i].farbe = 1;
      return auswahl(Z(`Du faltest einen Würfel.`, `Kreuze alle Nachbarn der gelben Fläche ${namen[i]} an.`), mische([opt(namen[j], false, 'gegenueber-benachbart'), ...nb.map((x) => opt(x, true))]),
        H('F', 'Jede Fläche stößt an vier andere.', 'Nur eine Fläche stößt nicht an die gelbe.', 'Diese Fläche liegt ihr beim Würfel genau entgegen.'), { mehrfach: true, bild, nachweis: [GEGEN(namen[i], { welche: 'nachbar' })] }); },
    () => { const w = spielwuerfel();
      return zahl(Z('Das Bild zeigt einen Spielwürfel.', 'Vorne und hinten ergeben zusammen 7.', 'Gib die Zahl auf der hinteren Fläche an.'), 7 - w.vorne, [[w.vorne, 'gegenueber-benachbart'], [w.oben, 'gegenueber-benachbart'], [w.rechts, 'gegenueber-benachbart']],
        hSieben('F'), { bild: wuerfelBild(2, { augen: w }), nachweis: [`7 − ${w.vorne} = ${7 - w.vorne}`] }); },
  ]);
  sechs(K1, 'G', [
    () => { const z = zufallsLage(wahl(WUERFELNETZE.slice(6))), { namen, bild } = namenNetz(z), i = zz(0, 5), j = gegenueberVon(z, i);
      return auswahl(Z('Das Würfelnetz wird gefaltet.', `Kreuze die Fläche gegenüber von ${namen[i]} an.`), [opt(namen[j], true), ...mische(namen.filter((_, k) => k !== i && k !== j)).slice(0, 3).map((x) => opt(x, false, 'gegenueber-benachbart'))],
        H('G', 'Gegenüberliegende Flächen berühren sich im Netz nie.', 'In einer Reihe aus drei Quadraten liegen die äußeren gegenüber.', `Falte in Gedanken mit ${namen[i]} als Boden.`), { bild, nachweis: [GEGEN(namen[i], { welche: 'gegen' })] }); },
    () => { const z = zufallsLage(wahl(WUERFELNETZE)), zahlen = spielNetz(z), i = zz(0, 5), j = gegenueberVon(z, i), namen = zahlen.map((x, k) => (k === i ? 'A' : String(x)));
      return zahl(Z('Das Würfelnetz gehört zu einem Spielwürfel.', 'Gegenüber ergibt immer zusammen 7.', 'Gib die Zahl für die Fläche A an.'), zahlen[i], [[zahlen[j], 'gegenueber-benachbart'], [7 - zahlen[(i + 1) % 6], 'gegenueber-benachbart']],
        hSieben('G'), { bild: netzBild(z, { namen }), nachweis: [GEGEN('A', { gegen: String(zahlen[j]) }), `7 − ${zahlen[j]} = ${zahlen[i]}`] }); },
    () => { const z = zufallsLage(wahl(WUERFELNETZE));
      return bildkarten(Z('Nur ein Netz ist ein richtiger Spielwürfel.', 'Gegenüber ergibt dort immer 7.', 'Kreuze es an.'), [[netzBild(z, { namen: spielNetz(z) }), true], [netzBild(z, { namen: spielNetz(z, { falsch: true }) }), false, 'gegenueber-benachbart'], [netzBild(z, { namen: spielNetz(z, { falsch: true }) }), false, 'gegenueber-benachbart']],
        hSieben('G'), { nachweis: [{ art: 'spielnetz' }, { zahl: 7, grund: 'Summe gegenüber' }] }); },
    () => { const w = spielwuerfel(), s = 7 - w.oben;
      return zahl(Z('Das Bild zeigt einen Spielwürfel.', 'Gib an, wie viele Augen auf der Fläche unten sind.'), s, [[w.oben, 'gegenueber-benachbart'], [7 - w.vorne, 'gegenueber-benachbart'], [7 - w.rechts, 'gegenueber-benachbart']],
        hSieben('G'), { bild: wuerfelBild(2, { augen: w }), nachweis: [`7 − ${w.oben} = ${s}`, { zahl: 7, grund: 'Summe gegenüber' }] }); },
    () => bildkarten(Z('Kreuze das Würfelnetz an.'), [[netzBild(zufallsLage(wahl(WUERFELNETZE.slice(6)))), true], ...[0, 1, 2].map(() => [netzBild(zufallsLage(keinNetz())), false, 'netz-nur-gezaehlt'])],
      H('G', 'Lege ein Quadrat als Boden fest.', 'Klappe die anderen hoch.', 'Kommen zwei Quadrate an dieselbe Stelle, ist es kein Würfelnetz.'), { nachweis: [NETZ('wuerfel')] }),
    () => { const z = zufallsLage(wahl(WUERFELNETZE)), { namen, bild } = namenNetz(z), i = zz(0, 5), j = gegenueberVon(z, i), k = wahl([0, 1, 2, 3, 4, 5].filter((x) => x !== i && x !== j));
      return auswahl(Z('Das Würfelnetz wird gefaltet.', `${namen[i]} ist der Boden.`, `Kreuze eine Nachbarfläche von ${namen[i]} an.`),
        [opt(namen[k], true), opt(namen[j], false, 'gegenueber-benachbart')],
        H('G', `Falte mit ${namen[i]} als Boden.`, 'Die hochgeklappten Flächen stoßen alle an den Boden.', 'Nur die Fläche oben stößt nicht an ihn.'), { bild, nachweis: [GEGEN(namen[i], { welche: 'nachbar' })] }); },
  ]);
  sechs(K1, 'M', [
    () => { const z = zufallsLage(wahl([WUERFELNETZE[9], WUERFELNETZE[10], WUERFELNETZE[7]])), { namen, bild } = namenNetz(z), i = zz(0, 5), j = gegenueberVon(z, i);
      return auswahl(`Das Würfelnetz wird gefaltet. Kreuze die Fläche an, die ${namen[i]} gegenüberliegt.`, [opt(namen[j], true), ...mische(namen.filter((_, k) => k !== i && k !== j)).slice(0, 3).map((x) => opt(x, false, 'gegenueber-benachbart'))],
        H('M', 'Bei Treppen-Netzen hilft es, Quadrat für Quadrat abzurollen.', 'Notiere für jedes Quadrat: Boden, vorne, hinten, links, rechts oder oben.'), { bild, nachweis: [GEGEN(namen[i], { welche: 'gegen' })] }); },
    () => { const w = spielwuerfel(), s = w.oben + w.vorne + w.rechts;
      return zahl('Das Bild zeigt einen Spielwürfel. Gib an, wie viele Augen auf den drei Flächen zusammen sind, die man nicht sieht.', 21 - s, [[s, 'verdeckt-nicht-gezaehlt'], [21, 'verdeckt-nicht-gezaehlt'], [7, 'gegenueber-benachbart']],
        H('M', 'Alle sechs Flächen zusammen haben 1 + 2 + 3 + 4 + 5 + 6 = 21 Augen.', 'Oder: Jede verdeckte Fläche hat 7 minus die Zahl gegenüber.'), { bild: wuerfelBild(2, { augen: w }), nachweis: [`${w.oben} + ${w.vorne} + ${w.rechts} = ${s}`, `21 − ${s} = ${21 - s}`, '1 + 2 + 3 + 4 + 5 + 6 = 21'] }); },
    () => { const z = zufallsLage(wahl(WUERFELNETZE));
      return bildkarten('Kreuze alle Netze an, die zu einem richtigen Spielwürfel gehören. Gegenüber muss immer zusammen 7 ergeben.', [[netzBild(z, { namen: spielNetz(z) }), true], [netzBild(zufallsLage(wahl(WUERFELNETZE)), { namen: [1, 2, 3, 4, 5, 6] }), false, 'gegenueber-benachbart'], ...[0, 1].map(() => { const y = zufallsLage(wahl(WUERFELNETZE)); return [netzBild(y, { namen: spielNetz(y, { falsch: true }) }), false, 'gegenueber-benachbart']; }), (() => { const y = zufallsLage(wahl(WUERFELNETZE)); return [netzBild(y, { namen: spielNetz(y) }), true]; })()],
        H('M', 'Suche bei jedem Netz die drei Paare gegenüberliegender Flächen.', 'Prüfe jedes Paar: Ergibt es zusammen 7?'), { mehrfach: true, nachweis: [{ art: 'spielnetz' }, { zahl: 7, grund: 'Summe gegenüber' }] }); },
    () => { const z = zufallsLage(wahl(WUERFELNETZE.slice(6))), zahlen = spielNetz(z), i = zz(0, 5), j = gegenueberVon(z, i), namen = zahlen.map((x, k) => (k === i ? 'A' : String(x)));
      return zahl('Das Würfelnetz gehört zu einem Spielwürfel. Gegenüber ergibt immer zusammen 7. Gib die Zahl an, die auf die Fläche A gehört.', zahlen[i], [[zahlen[j], 'gegenueber-benachbart'], ...[0, 1, 2, 3, 4, 5].filter((k) => k !== i && k !== j).slice(0, 2).map((k) => [7 - zahlen[k], 'gegenueber-benachbart'])],
        H('M', 'Finde zuerst die Fläche, die A gegenüberliegt.', 'Rechne dann 7 minus ihre Zahl.'), { bild: netzBild(z, { namen }), nachweis: [GEGEN('A', { gegen: String(zahlen[j]) }), `7 − ${zahlen[j]} = ${zahlen[i]}`] }); },
    () => { const z = zufallsLage(wahl(WUERFELNETZE.slice(6))), { namen, bild } = namenNetz(z), i = zz(0, 5), j = gegenueberVon(z, i);
      return auswahl(`Das Würfelnetz wird gefaltet. Kreuze alle Flächen an, die an ${namen[i]} stoßen.`, namen.filter((_, k) => k !== i).map((x) => opt(x, x !== namen[j], x === namen[j] ? 'gegenueber-benachbart' : undefined)),
        H('M', 'Jede Fläche stößt an vier andere.', 'Die gegenüberliegende Fläche stößt nicht an sie.'), { mehrfach: true, bild, nachweis: [GEGEN(namen[i], { welche: 'nachbar' })] }); },
    () => netzAufgabe('M', 'Im Würfelnetz fehlen zwei Quadrate. Färbe zwei Kästchen so, dass ein Würfelnetz entsteht.', wahl(WUERFELNETZE.slice(6)), H('M', 'Bestimme zuerst, welche zwei Seiten des Würfels fehlen.', 'Setze die Quadrate dort an, wo diese Seiten beim Falten hinklappen.'), 2),
  ]);
  sechs(K1, 'E', [
    () => { const z = zufallsLage(wahl(WUERFELNETZE)), zahlen = spielNetz(z), i = zz(0, 5), j = gegenueberVon(z, i), rest = [0, 1, 2, 3, 4, 5].filter((k) => k !== i && k !== j), k = wahl(rest), l = gegenueberVon(z, k);
      const namen = zahlen.map((x, m) => (m === i ? 'A' : m === k ? 'B' : String(x)));
      return zahl('Das Würfelnetz gehört zu einem Spielwürfel. Gib an, welche Zahl du erhältst, wenn du die Zahlen auf A und B addierst.', zahlen[i] + zahlen[k], [[zahlen[j] + zahlen[l], 'gegenueber-benachbart'], [7, 'gegenueber-benachbart'], [14 - zahlen[i] - zahlen[k], 'gegenueber-benachbart']],
        H('E', 'Finde für A und für B die gegenüberliegende Fläche.'), { bild: netzBild(z, { namen }), nachweis: [GEGEN('A', { gegen: String(zahlen[j]) }), GEGEN('B', { gegen: String(zahlen[l]) }), `7 − ${zahlen[j]} = ${zahlen[i]}`, `7 − ${zahlen[l]} = ${zahlen[k]}`, `${zahlen[i]} + ${zahlen[k]} = ${zahlen[i] + zahlen[k]}`] }); },
    () => { const k = kind(), [satz, stimmt, grund, f1] = wahl([
      ['Bei einem Spielwürfel können 1, 2 und 3 an einer Ecke zusammenstoßen.', true, 'Stimmt. Keine zwei der drei Zahlen liegen gegenüber.', 'Stimmt nicht. 1 und 2 liegen immer gegenüber.'],
      ['Bei einem Spielwürfel können 1 und 6 nebeneinander liegen.', false, 'Stimmt nicht. 1 und 6 ergeben zusammen 7, sie liegen gegenüber.', 'Stimmt. Jede Zahl kann neben jeder anderen liegen.'],
      ['Bei einem Spielwürfel ist die Summe der Augen oben und unten immer gleich.', true, 'Stimmt. Oben und unten ergeben immer zusammen 7.', 'Stimmt nicht. Sie hängt davon ab, wie der Würfel liegt.']]);
      return auswahl(`${k} sagt: „${satz}“ Beurteile die Aussage.`, [opt(grund, true), opt(f1, false, 'gegenueber-benachbart'), opt(stimmt ? 'Stimmt nicht. An einer Ecke stoßen immer gerade und ungerade Zahlen zusammen.' : 'Stimmt. Neben der 1 liegt immer die 6.', false, 'gegenueber-benachbart')],
        H('E', 'Schreibe die drei Paare auf, die zusammen 7 ergeben.'), { nachweis: [U(stimmt), '1 + 6 = 7', '2 + 5 = 7', '3 + 4 = 7'] }); },
    () => { const z = zufallsLage(wahl(WUERFELNETZE.slice(6))), { namen, bild } = namenNetz(z), paare = [];
      for (let i = 0; i < 6; i++) { const j = gegenueberVon(z, i); if (i < j) paare.push([namen[i], namen[j]].sort().join(' und ')); }
      const falsch = [0, 1].map(() => suche(() => mische(namen).slice(0, 2).sort().join(' und '), (p) => !paare.includes(p)));
      if (falsch[0] === falsch[1]) return null;
      return auswahl('Das Würfelnetz wird gefaltet. Kreuze alle Paare von Flächen an, die sich dann gegenüberliegen.', mische([...paare.map((p) => opt(p, true)), ...falsch.map((p) => opt(p, false, 'gegenueber-benachbart'))]),
        H('E', 'Ein Würfel hat genau drei Paare gegenüberliegender Flächen.'), { mehrfach: true, bild, nachweis: [GEGEN(null, { welche: 'paare' })] }); },
    () => zahl('Es gibt verschiedene Würfelnetze. Netze, die durch Drehen oder Umklappen gleich werden, zählen nur einmal. Gib an, wie viele verschiedene Würfelnetze es gibt.', 11, [[6, 'netz-nur-gezaehlt'], [8, 'netz-nur-gezaehlt'], [12, 'netz-nur-gezaehlt']],
      H('E', 'Ordne nach der längsten Reihe: vier, drei oder zwei Quadrate in einer Reihe.'), { nachweis: ['6 + 3 + 1 + 1 = 11', { zahl: 4, grund: 'Reihe aus vier Quadraten' }, { zahl: 6, grund: 'Netze mit Viererreihe' }] }),
    () => netzAufgabe('E', 'Im Würfelnetz fehlen drei Quadrate. Färbe drei Kästchen so, dass ein Würfelnetz entsteht.', wahl(WUERFELNETZE.slice(6)), H('E', 'Bestimme zuerst, welche drei Seiten des Würfels fehlen.'), 3),
    () => { const z = zufallsLage(wahl(WUERFELNETZE));
      return bildkarten('Kreuze alle Netze an, die zu einem richtigen Spielwürfel gehören.', [[netzBild(z, { namen: spielNetz(z) }), true], ...[0, 1, 2].map(() => { const y = zufallsLage(wahl(WUERFELNETZE)); return [netzBild(y, { namen: spielNetz(y, { falsch: true }) }), false, 'gegenueber-benachbart']; }), (() => { const y = zufallsLage(wahl(WUERFELNETZE.slice(6))); return [netzBild(y, { namen: spielNetz(y) }), true]; })()],
        H('E', 'Bei einem Spielwürfel ergeben gegenüberliegende Flächen zusammen 7.'), { mehrfach: true, nachweis: [{ art: 'spielnetz' }, { zahl: 7, grund: 'Summe gegenüber' }] }); },
  ]);
}

// ---------- K2: Würfelbauten ----------
const hoehe = (w, x, y) => w.filter((p) => p[0] === x && p[1] === y).length;
// Jeder Turm ist oben zu sehen: Er ist höher als alle Türme davor in derselben Spalte.
const sichtbar = (w) => w.every(([x, y]) => [...Array(y).keys()].every((v) => hoehe(w, x, v) < hoehe(w, x, y)));
const bauMit = (b, t, hmax, n, pruefe = () => true) => suche(() => zufallsBau(b, t, hmax, n), (w) => Math.max(...w.map((p) => p[0])) === b - 1 && Math.max(...w.map((p) => p[1])) === t - 1 && pruefe(w));
const hZaehlen = (n) => H(n, 'Jeder Würfel steht auf dem Boden oder auf einem anderen Würfel.', 'Zähle Turm für Turm von unten nach oben.', 'Addiere die Höhen aller Türme.');
const hKippen = (n) => H(n, 'Beim Kippen nach rechts kommt die linke Fläche nach oben.', 'Gegenüber ergibt immer zusammen 7.', 'Links liegt 7 minus die Zahl rechts.');
const RICHTUNG = { rechts: 'nach rechts', links: 'nach links', vorne: 'nach vorne', hinten: 'nach hinten' };
const kippText = (s) => s.map((r) => RICHTUNG[r]).join(', dann ');
function kippAufgabe(n, schritte, hilfen) {
  const w = spielwuerfel(), ende = schritte.reduce((x, r) => kippe(x, r), w);
  const t = schritte.length === 1 ? `Du kippst den Spielwürfel einmal ${RICHTUNG[schritte[0]]}.` : `Du kippst den Spielwürfel ${schritte.length === 2 ? 'zweimal' : 'dreimal'}: ${kippText(schritte)}.`;
  return zahl(`${t} Gib an, welche Zahl dann oben liegt.`, ende.oben, [[w.oben, 'kippen-richtung'], [7 - ende.oben, 'kippen-richtung'], [w.rechts, 'kippen-richtung'], [7 - w.rechts, 'kippen-richtung']],
    hilfen, { bild: wuerfelBild(2, { augen: w }), nachweis: [KIPP(w, schritte, ende.oben)] });
}
function k2() {
  sechs(K2, 'F', [
    () => { const w = bauMit(4, 1, 3, zz(5, 8)); return zahl(Z('Das Bild zeigt einen Würfelbau.', 'Zähle alle Würfel.'), w.length, [[w.length - 1, 'wuerfel-verdeckt'], [ansicht(w, 'oben').length, 'wuerfel-verdeckt']], hZaehlen('F'), { bild: bau(w), nachweis: [WZ(w.length)] }); },
    () => { const w = bauMit(3, 2, 3, zz(5, 7), sichtbar);
      return zahl(Z('Das Bild zeigt einen Würfelbau.', 'Zähle alle Würfel.'), w.length, [[w.length - 1, 'wuerfel-verdeckt'], [w.length - 2, 'wuerfel-verdeckt']], hZaehlen('F'), { bild: bau(w), nachweis: [WZ(w.length)] }); },
    () => { const w = bauMit(3, 2, 3, zz(5, 8)), g = grundrissMitZahlen(w);
      return zahl(Z('Jede Zahl ist die Höhe eines Turms.', 'Zähle alle Würfel.'), w.length, [[g.zellen.length, 'wuerfel-verdeckt'], [w.length - 1, 'wuerfel-verdeckt']],
        H('F', 'Jede Zahl ist ein Turm.', 'Eine 2 heißt: zwei Würfel übereinander.', 'Addiere alle Zahlen.'), { bild: risseBild(g), nachweis: [WZ(w.length)] }); },
    () => { const n = zz(3, 5), w = bauMit(3, 1, 2, n), f = 6 - n;
      return zahl(Z('Der Würfelbau soll ein Quader werden.', 'Der Quader ist 3 Würfel lang und 2 Würfel hoch.', 'Gib an, wie viele Würfel noch fehlen.'), f, [[6, 'wuerfel-verdeckt'], [n, 'wuerfel-verdeckt'], [f + 1, 'wuerfel-verdeckt']],
        H('F', 'Der fertige Quader hat zwei Reihen mit je drei Würfeln.', 'Das sind 6 Würfel.', 'Ziehe die Würfel ab, die schon da sind.'), { bild: bau(w), nachweis: [WZ(n, { zwischen: true }), '3 · 2 = 6', `6 − ${n} = ${f}`] }); },
    () => { const w = bauMit(3, 1, 3, zz(4, 6)), n = ansicht(w, 'vorne').length;
      return zahl(Z('Du schaust von vorne auf den Würfelbau.', 'Zähle die sichtbaren Quadrate.'), n, [[ansicht(w, 'oben').length, 'riss-verwechselt'], [n + 1, 'wuerfel-verdeckt']], H('F', 'Der Würfelbau steht in einer Reihe.', 'Von vorne siehst du jeden Würfel.', 'Zähle alle Quadrate vorne.'), { bild: bau(w, { vorne: true }), nachweis: [ANSICHT('vorne', { wert: n })] }); },
    () => { const w = bauMit(4, 2, 2, zz(6, 8), sichtbar);
      return zahl(Z('Das Bild zeigt einen Würfelbau.', 'Zähle alle Würfel.'), w.length, [[w.length - 1, 'wuerfel-verdeckt'], [ansicht(w, 'vorne').length, 'wuerfel-verdeckt']], hZaehlen('F'), { bild: bau(w), nachweis: [WZ(w.length)] }); },
  ]);
  sechs(K2, 'G', [
    () => { const w = bauMit(3, 2, 3, zz(7, 10), (x) => sichtbar(x) && x.length > ansicht(x, 'vorne').length + 1);
      return zahl(Z('Das Bild zeigt einen Würfelbau.', 'Manche Würfel sind verdeckt.', 'Gib an, wie viele Würfel es sind.'), w.length, [[ansicht(w, 'vorne').length, 'wuerfel-verdeckt'], [w.length - 1, 'wuerfel-verdeckt'], [w.length - 2, 'wuerfel-verdeckt']], hZaehlen('G'), { bild: bau(w), nachweis: [WZ(w.length)] }); },
    () => { const w = bauMit(3, 3, 3, zz(9, 14)), g = grundrissMitZahlen(w);
      return zahl(Z('Im Grundriss steht die Höhe jedes Turms.', 'Gib an, wie viele Würfel der Bau hat.'), w.length, [[g.zellen.length, 'wuerfel-verdeckt'], [w.length - 1, 'wuerfel-verdeckt']],
        H('G', 'Jede Zahl ist ein Turm.', 'Addiere die Zahlen Reihe für Reihe.', 'Addiere dann die Ergebnisse der Reihen.'), { bild: risseBild(g), nachweis: [WZ(w.length)] }); },
    () => { const n = zz(6, 10), w = bauMit(3, 2, 2, n), f = 12 - n;
      return zahl(Z('Der Würfelbau soll ein Quader werden.', 'Er soll 3 Würfel lang, 2 tief und 2 hoch sein.', 'Gib an, wie viele Würfel noch fehlen.'), f, [[12, 'wuerfel-verdeckt'], [n, 'wuerfel-verdeckt'], [f - 1, 'wuerfel-verdeckt']],
        H('G', 'Der Quader hat zwei Schichten.', 'Jede Schicht hat 3 · 2 = 6 Würfel.', 'Ziehe die vorhandenen Würfel von 12 ab.'), { bild: risseBild(grundrissMitZahlen(w)), nachweis: [WZ(n, { zwischen: true }), '3 · 2 · 2 = 12', `12 − ${n} = ${f}`] }); },
    () => { const w = bauMit(3, 2, 3, zz(5, 7)), n = ansicht(w, 'links').length;
      return zahl(Z('Du schaust von links auf den Würfelbau.', 'Gib an, wie viele Quadrate du siehst.'), n, [[ansicht(w, 'vorne').length, 'riss-verwechselt'], [w.length, 'wuerfel-verdeckt']],
        H('G', 'Von links siehst du von jeder Reihe nur den höchsten Turm.', 'Vorne liegt dann rechts.', 'Zähle die Quadrate dieser Ansicht.'), { bild: bau(w, { vorne: true }), nachweis: [ANSICHT('links', { wert: n })] }); },
    () => { const w = bauMit(4, 3, 3, zz(9, 13), sichtbar);
      return zahl(Z('Das Bild zeigt einen Würfelbau.', 'Gib an, wie viele Würfel es sind.'), w.length, [[w.length - 1, 'wuerfel-verdeckt'], [ansicht(w, 'vorne').length, 'wuerfel-verdeckt']], hZaehlen('G'), { bild: bau(w), nachweis: [WZ(w.length)] }); },
    () => { const k = kind();
      return auswahl(Z(`${k} sagt: „Ein Würfelbau aus 8 Würfeln ist immer ein Würfel.“`, 'Beurteile die Aussage.'), [opt('Stimmt nicht. Die 8 Würfel können auch in einer Reihe liegen.', true), opt('Stimmt. 8 Würfel ergeben 2 · 2 · 2.', false, 'wuerfel-kein-quader'), opt('Stimmt. Jeder Würfelbau ist ein Würfel.', false, 'wuerfel-kein-quader')],
        H('G', 'Lege 8 Würfel in Gedanken in eine lange Reihe.', 'Ist das ein Würfel?', 'Ein Gegenbeispiel genügt.'), { nachweis: [U(false), '2 · 2 · 2 = 8'] }); },
  ]);
  sechs(K2, 'M', [
    () => kippAufgabe('M', [wahl(['rechts', 'links', 'vorne', 'hinten'])], hKippen('M')),
    () => kippAufgabe('M', [wahl(['rechts', 'links']), wahl(['vorne', 'hinten'])], H('M', 'Kippe Schritt für Schritt und notiere nach jedem Schritt die Zahlen oben, vorne und rechts.', 'Gegenüber ergibt immer zusammen 7.')),
    () => { const w = bauMit(3, 3, 3, zz(10, 14), (x) => sichtbar(x) && x.length > ansicht(x, 'vorne').length + 2);
      return zahl('Das Bild zeigt einen Würfelbau. Gib an, wie viele Würfel es sind.', w.length, [[ansicht(w, 'vorne').length, 'wuerfel-verdeckt'], [w.length - 1, 'wuerfel-verdeckt'], [w.length - 2, 'wuerfel-verdeckt']],
        H('M', 'Jeder Turm steht auf dem Boden.', 'Bestimme für jeden Turm die Höhe und addiere.'), { bild: bau(w), nachweis: [WZ(w.length)] }); },
    () => { const n = zz(14, 22), w = bauMit(3, 3, 3, n), f = 27 - n;
      return zahl('Der Würfelbau soll ein großer Würfel aus 3 · 3 · 3 Würfeln werden. Gib an, wie viele Würfel noch fehlen.', f, [[27, 'wuerfel-verdeckt'], [n, 'wuerfel-verdeckt'], [9 - (n % 9 || 9), 'wuerfel-verdeckt']],
        H('M', 'Der große Würfel hat 27 kleine Würfel.', 'Zähle die vorhandenen Würfel im Grundriss und ziehe sie ab.'), { bild: risseBild(grundrissMitZahlen(w)), nachweis: [WZ(n, { zwischen: true }), '3 · 3 · 3 = 27', `27 − ${n} = ${f}`] }); },
    () => kippAufgabe('M', [wahl(['vorne', 'hinten']), wahl(['vorne', 'hinten'])], H('M', 'Zweimal in dieselbe Richtung: Die Fläche unten kommt nach oben.', 'Hin und zurück: Alles liegt wie vorher.')),
    () => { const k = kind(), w = spielwuerfel(), r = wahl(['rechts', 'vorne']);
      return auswahl(`${k} sagt: „Kippst du einen Spielwürfel viermal ${RICHTUNG[r]}, liegt wieder dieselbe Zahl oben.“ Beurteile die Aussage.`,
        [opt('Stimmt. Nach vier Kippschritten hat sich der Würfel einmal ganz gedreht.', true), opt('Stimmt nicht. Nach vier Schritten liegt die Zahl unten oben.', false, 'kippen-richtung'), opt('Stimmt nicht. Es dauert sechs Schritte, bis wieder alles gleich ist.', false, 'kippen-richtung')],
        H('M', 'Verfolge die Fläche oben bei jedem Kippschritt.', 'Die Fläche wandert: oben, Seite, unten, andere Seite, oben. Nach vier Schritten ist sie wieder oben.'), { bild: wuerfelBild(2, { augen: w }), nachweis: [U(true), KIPP(w, [r, r, r, r], w.oben)] }); },
  ]);
  sechs(K2, 'E', [
    () => kippAufgabe('E', mische([wahl(['rechts', 'links']), wahl(['vorne', 'hinten']), wahl(['rechts', 'links', 'vorne', 'hinten'])]), H('E', 'Notiere nach jedem Schritt die Zahlen oben, vorne und rechts.')),
    () => { const g = suche(() => { const w = bauMit(3, 2, 3, zz(5, 8)), vorne = ansicht(w, 'vorne'), oben = ansicht(w, 'oben');
        const spalten = [0, 1, 2].map((x) => ({ h: vorne.filter((p) => p[0] === x).length, c: oben.filter((p) => p[0] === x).length })), min = spalten.reduce((s, { h, c }) => s + (c ? h + c - 1 : 0), 0);
        return { w, vorne, oben, spalten, min }; }, ({ w, min, spalten }) => min < w.length && spalten.every(({ h, c }) => c > 0));
      return zahl('Ein Würfelbau hat diesen Grundriss und diesen Aufriss. Gib an, wie viele Würfel er mindestens hat.', g.min, [[g.oben.length, 'wuerfel-verdeckt'], [g.vorne.length, 'wuerfel-verdeckt'], [g.w.length, 'wuerfel-verdeckt']],
        H('E', 'In jeder Spalte braucht ein Turm die Höhe aus dem Aufriss. Auf die anderen Kästchen der Spalte genügt je ein Würfel.'),
        { bild: risseBild(riss('von oben', g.oben), riss('von vorne', g.vorne)), nachweis: [`${g.spalten.map(({ h, c }) => (c > 1 ? `${h} + ${c - 1}` : `${h}`)).join(' + ')} = ${g.min}`, { zahl: 1, grund: 'ein Würfel je Kästchen' }] }); },
    () => { const w = bauMit(4, 3, 4, zz(14, 20), (x) => sichtbar(x) && x.length > ansicht(x, 'vorne').length + 3);
      return zahl('Das Bild zeigt einen Würfelbau. Gib an, wie viele Würfel es sind.', w.length, [[ansicht(w, 'vorne').length, 'wuerfel-verdeckt'], [w.length - 1, 'wuerfel-verdeckt'], [w.length - 2, 'wuerfel-verdeckt']],
        H('E', 'Bestimme die Höhe jedes Turms. Denk an Türme, die hinter anderen stehen.'), { bild: bau(w), nachweis: [WZ(w.length)] }); },
    () => kippAufgabe('E', [wahl(['rechts', 'links']), wahl(['vorne', 'hinten']), wahl(['rechts', 'links'])], H('E', 'Beim Kippen nach rechts kommt die linke Fläche nach oben. Links liegt 7 minus rechts.')),
    () => { const n = zz(12, 20), w = bauMit(3, 3, 3, n, sichtbar), f = 27 - n;
      return zahl('Der Würfelbau soll ein großer Würfel aus 27 kleinen Würfeln werden. Gib an, wie viele Würfel noch fehlen.', f, [[27 - ansicht(w, 'vorne').length, 'wuerfel-verdeckt'], [n, 'wuerfel-verdeckt'], [f + 1, 'wuerfel-verdeckt']],
        H('E', 'Zähle zuerst die Würfel im Bild. Jeder Turm steht auf dem Boden.'), { bild: bau(w), nachweis: [WZ(n, { zwischen: true }), `27 − ${n} = ${f}`] }); },
    () => { const k = kind(), w = spielwuerfel(), a = kippe(kippe(w, 'rechts'), 'vorne'), b = kippe(kippe(w, 'vorne'), 'rechts');
      return auswahl(`${k} sagt: „Ob ich zuerst nach rechts und dann nach vorne kippe oder umgekehrt, ist egal. Oben liegt am Ende dieselbe Zahl.“ Beurteile die Aussage für diesen Spielwürfel.`,
        [opt(`Stimmt nicht. Einmal liegt ${a.oben} oben, das andere Mal ${b.oben}.`, true), opt('Stimmt. Beim Kippen kommt es nicht auf die Reihenfolge an.', false, 'kippen-richtung'), opt(`Stimmt. In beiden Fällen liegt ${a.oben} oben.`, false, 'kippen-richtung')],
        H('E', 'Kippe beide Reihenfolgen Schritt für Schritt und vergleiche.'), { bild: wuerfelBild(2, { augen: w }), nachweis: [U(false), KIPP(w, ['rechts', 'vorne'], a.oben), KIPP(w, ['vorne', 'rechts'], b.oben)] }); },
  ]);
}

export function kopfgeometrie() { k1(); k2(); }
