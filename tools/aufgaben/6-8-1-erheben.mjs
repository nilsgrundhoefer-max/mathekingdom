// Aufgaben zu 6.8.1 „Daten erheben und Stichproben auswählen“ (Lernziele E1, E2) nach ADR 0058.
// E1: Daten erheben und in einer Häufigkeitstabelle ordnen. F zählt eine Liste mit 15 bis 20 Antworten, G mit 25 bis 30.
// Ab M kommen die Art der Erhebung (Umfrage, Beobachtung, Messung) und Fehler im Fragebogen dazu.
// E2: Stichproben beurteilen, auf allen Stufen als Auswahl. F und G einfache Fragen, M plant mit Hilfe, E begründet und schlägt Besseres vor.

import { zz, wahl, mische, Z, opt, auswahl, kind, sechs, H, FREI, zahl, tabelle, LU, daten, summe, umfrage, ZAEHL, KENN, URTEIL, WERT } from './6-8-daten.mjs';

const E1 = '6.8.1-E1', E2 = '6.8.1-E2';
// Urliste mit gegebenen Anzahlen, gemischt.
const urliste = (antworten, anzahlen) => mische(antworten.flatMap((a, i) => Array(anzahlen[i]).fill(a)));
// k verschiedene Antworten mit Anzahlen, zusammen zwischen von und bis, alle verschieden und mindestens 1.
function ziehe(u, k, von, bis, min = 1) {
  for (;;) {
    const antworten = mische(u.antworten).slice(0, k), anzahlen = antworten.map(() => zz(min, Math.ceil(bis / k) + 2));
    if (new Set(anzahlen).size !== k) continue;
    const s = summe(anzahlen);
    if (s >= von && s <= bis) return { antworten, anzahlen, gesamt: s };
  }
}
const KLASSEN = ['5a', '5b', '5c', '6a', '6b', '6c'];

export function erheben6() {
  // ================= E1: Daten erheben und ordnen =================
  // Häufigkeitstabelle zu einer Liste ausfüllen. mitGesamt: auch die Zeile „Gesamt“.
  const tabelleZurListe = (n, k, von, bis, mitGesamt = false) => () => { const u = umfrage(), { antworten, anzahlen, gesamt } = ziehe(u, k, von, bis), liste = urliste(antworten, anzahlen);
    const namen = 'abcdef'.split(''), werte = Object.fromEntries(antworten.map((a, i) => [namen[i], [anzahlen[i], [[anzahlen[i] + 1, 'liste-verzaehlt'], [anzahlen[i] - 1, 'liste-verzaehlt']]]]));
    if (mitGesamt) werte.g = [gesamt, [[gesamt - 1, 'liste-verzaehlt']]];
    return tabelle(Z(`${gesamt} ${u.wer} nennen ${u.ihr}.`, 'Zähle die Antworten.', 'Ergänze die Häufigkeitstabelle.'), ['Antwort', 'Anzahl'], [...antworten.map((a, i) => [a, LU(namen[i])]), ...(mitGesamt ? [['Gesamt', LU('g')]] : [])], werte,
      H(n, 'Mache für jede Antwort einen Strich. Zähle dann die Striche.', 'Hund, Katze, Hund: Hund 2, Katze 1.', `Zähle zuerst nur „${antworten[0]}“.`), { urliste: liste, nachweis: [...antworten.map((a, i) => ZAEHL(a, anzahlen[i], { luecke: namen[i] })), ...(mitGesamt ? [KENN('anzahl', liste.map(() => '1'), gesamt, { luecke: 'g' })] : [])] }); };
  // Wie oft kommt eine Antwort vor?
  const wieOft = (n, k, von, bis) => () => { const u = umfrage(), { antworten, anzahlen, gesamt } = ziehe(u, k, von, bis), i = zz(0, k - 1);
    return zahl(Z(`${gesamt} ${u.wer} nennen ${u.ihr}.`, `Zähle, wie oft „${antworten[i]}“ vorkommt.`), anzahlen[i], null, [[anzahlen[i] + 1, 'liste-verzaehlt'], [anzahlen[i] - 1, 'liste-verzaehlt'], [gesamt, 'haeufigkeit-falsche-gesamtzahl']],
      H(n, 'Gehe die Liste von vorn bis hinten durch.', 'Klicke jedes gezählte Kärtchen an.', `Zähle nur die Kärtchen „${antworten[i]}“.`), { urliste: urliste(antworten, anzahlen), nachweis: [ZAEHL(antworten[i], anzahlen[i])] }); };
  // Welche Antwort kommt am häufigsten vor?
  const haeufigste = (n, k, von, bis) => () => { const u = umfrage(), { antworten, anzahlen, gesamt } = ziehe(u, k, von, bis), max = Math.max(...anzahlen), min = Math.min(...anzahlen), i = anzahlen.indexOf(max), j = anzahlen.indexOf(min);
    return auswahl(Z(`${gesamt} ${u.wer} nennen ${u.ihr}.`, 'Kreuze die häufigste Antwort an.'), [opt(antworten[i], true), opt(antworten[j], false, 'extrem-verwechselt'), ...antworten.filter((_, x) => x !== i && x !== j).slice(0, 1).map((a) => opt(a))],
      H(n, 'Zähle für jede Antwort, wie oft sie vorkommt.', 'Hund 5, Katze 3: Hund kommt häufiger vor.', `Zähle „${antworten[i]}“ und „${antworten[j]}“ und vergleiche.`), { urliste: urliste(antworten, anzahlen), nachweis: antworten.map((a, x) => ZAEHL(a, anzahlen[x], { zwischen: true })).concat([FREI('Die häufigste Antwort folgt aus den gezählten Anzahlen')]) }); };
  // Wie viele mehr?
  const unterschied = (n, k, von, bis) => () => { const u = umfrage(), { antworten, anzahlen, gesamt } = ziehe(u, k, von, bis), [i, j] = [0, 1].sort((x, y) => anzahlen[y] - anzahlen[x]), d = anzahlen[i] - anzahlen[j];
    return zahl(Z(`${gesamt} ${u.wer} nennen ${u.ihr}.`, `Bestimme, wie viele ${u.wer} mehr „${antworten[i]}“ als „${antworten[j]}“ nennen.`), d, null, [[anzahlen[i] + anzahlen[j], 'unterschied-addiert'], [anzahlen[i], 'sach-schritt-vergessen']],
      H(n, 'Zähle beide Antworten. Rechne dann die größere Anzahl minus die kleinere.', 'Hund 7, Katze 4: 7 − 4 = 3.', `Zähle „${antworten[i]}“ und „${antworten[j]}“.`), { urliste: urliste(antworten, anzahlen), nachweis: [ZAEHL(antworten[i], anzahlen[i], { zwischen: true }), ZAEHL(antworten[j], anzahlen[j], { zwischen: true }), `${anzahlen[i]} − ${anzahlen[j]} = ${d}`] }); };
  // Gesamtzahl aus der Häufigkeitstabelle.
  const gesamtzahl = (n, k) => () => { const u = umfrage(), { antworten, anzahlen, gesamt } = ziehe(u, k, 12, n === 'F' ? 20 : 40);
    return zahl(Z(`Die Tabelle zeigt eine Umfrage ${u.zum}.`, `Bestimme, wie viele ${u.wer} insgesamt gefragt wurden.`), gesamt, null, [[Math.max(...anzahlen), 'extrem-verwechselt'], [k, 'liste-verzaehlt']],
      H(n, 'Jede Antwort kommt von einem anderen Kind. Zähle alle Anzahlen zusammen.', 'Hund 4, Katze 3: 4 + 3 = 7 Kinder.', `Rechne ${anzahlen.join(' + ')}.`), { daten: daten(['Antwort', 'Anzahl'], antworten.map((a, i) => [a, anzahlen[i]])), nachweis: [`${anzahlen.join(' + ')} = ${gesamt}`] }); };
  sechs(E1, 'F', [tabelleZurListe('F', 3, 15, 18), wieOft('F', 3, 15, 20), gesamtzahl('F', 3), haeufigste('F', 3, 15, 20), unterschied('F', 3, 15, 20), tabelleZurListe('F', 4, 17, 20)]);

  // Passende Frage für eine Umfrage.
  const frageWahl = (n) => () => { const [thema, gut, schlecht1, schlecht2] = wahl([
    ['welches Obst die Klasse am liebsten mag', 'Welches Obst magst du am liebsten?', 'Magst du Obst?', 'Wie viel Obst isst du?'],
    ['wie die Kinder zur Schule kommen', 'Wie kommst du meistens zur Schule?', 'Kommst du gern zur Schule?', 'Wie weit ist dein Schulweg?'],
    ['welches Tier die Kinder am liebsten mögen', 'Welches Tier magst du am liebsten?', 'Hast du ein Tier?', 'Magst du Tiere?'],
    ['welchen Sport die Kinder am liebsten machen', 'Welchen Sport machst du am liebsten?', 'Machst du Sport?', 'Wie oft machst du Sport?'],
  ]), kn = kind();
    return auswahl(Z(`${kn} will wissen, ${thema}.`, 'Kreuze die passende Frage für die Umfrage an.'), [opt(`„${gut}“`, true), opt(`„${schlecht1}“`, false, 'umfrage-unpassend'), opt(`„${schlecht2}“`, false, 'umfrage-unpassend')],
      H(n, 'Die Frage muss genau zu dem passen, was man wissen will.', '„Welche Farbe magst du am liebsten?“ passt zu „Lieblingsfarbe“.', 'Lies jede Frage. Kann man aus den Antworten die Lieblingssache ablesen?'), { daten: daten(['Umfrage', 'Antwort'], [['Frage', '?'], ['Antworten', '…']]), nachweis: [FREI('Passende Frage zur Umfrage')] }); };
  // Die Tabelle passt nicht zur Anzahl der Befragten.
  const verzaehlt = (n) => () => { const u = umfrage(), { antworten, anzahlen, gesamt } = ziehe(u, 4, 22, 30), d = zz(1, 3), kn = kind();
    return auswahl(Z(`${kn} hat ${gesamt + d} ${u.wer} nach ${u.dem} gefragt.`, 'Die Tabelle zeigt die gezählten Antworten.', 'Kreuze an, was passiert ist.'),
      [opt(`${kn} hat ${d} ${d === 1 ? 'Antwort' : 'Antworten'} nicht gezählt.`, true), opt(`${kn} hat ${d} ${d === 1 ? 'Antwort' : 'Antworten'} doppelt gezählt.`, false), opt('Die Tabelle stimmt.', false, 'liste-verzaehlt')],
      H(n, 'Zähle alle Anzahlen in der Tabelle zusammen. Vergleiche mit der Anzahl der Befragten.', 'Gefragt: 20. In der Tabelle: 18. Es fehlen 2.', `Rechne ${anzahlen.join(' + ')}.`), { daten: daten(['Antwort', 'Anzahl'], antworten.map((a, i) => [a, anzahlen[i]])), nachweis: [`${anzahlen.join(' + ')} = ${gesamt}`, `${gesamt + d} − ${gesamt} = ${d}`] }); };
  // Nicht gewählt: Gesamt minus Anzahl.
  const nicht = (n, k, von, bis) => () => { const u = umfrage(), { antworten, anzahlen, gesamt } = ziehe(u, k, von, bis), i = zz(0, k - 1);
    return zahl(Z(`${gesamt} ${u.wer} nennen ${u.ihr}.`, `Bestimme, wie viele ${u.wer} nicht „${antworten[i]}“ nennen.`), gesamt - anzahlen[i], null, [[anzahlen[i], 'sach-frage-verfehlt'], [gesamt, 'sach-schritt-vergessen']],
      H(n, 'Zähle „nicht“: alle anderen Antworten zusammen.', 'Von 20 Kindern nennen 6 Hund. 20 − 6 = 14 nennen etwas anderes.', `Zähle „${antworten[i]}“. Rechne dann ${gesamt} minus diese Anzahl.`), { urliste: urliste(antworten, anzahlen), nachweis: [ZAEHL(antworten[i], anzahlen[i], { zwischen: true }), `${gesamt} − ${anzahlen[i]} = ${gesamt - anzahlen[i]}`] }); };
  sechs(E1, 'G', [tabelleZurListe('G', 4, 25, 30), tabelleZurListe('G', 3, 25, 30, true), verzaehlt('G'), wieOft('G', 4, 25, 30), nicht('G', 4, 25, 30), frageWahl('G')]);

  // Ab M: Art der Erhebung.
  const ERHEBUNGEN = [
    ['zählt eine Stunde lang die Autos vor der Schule.', 'Beobachtung'], ['notiert in der Pause, welche Spiele die Kinder auf dem Hof spielen.', 'Beobachtung'],
    ['misst die Weite jedes Wurfs beim Sportfest.', 'Messung'], ['misst jeden Mittag die Temperatur auf dem Schulhof.', 'Messung'],
    ['fragt alle Kinder der Klasse nach ihrem Lieblingsbuch.', 'Umfrage'], ['verteilt einen Fragebogen zum Schulessen.', 'Umfrage'],
    ['zählt auf der Burg, wie viele Pfeile jeder Knappe ins Ziel schießt.', 'Beobachtung'], ['misst mit der Stoppuhr, wie lange jeder Knappe für den Burggraben braucht.', 'Messung'],
  ];
  const erhebungsart = (n, zwei = false) => () => { const [a, b] = mische(ERHEBUNGEN).filter((x, i, l) => !zwei || i === 0 || x[1] !== l[0][1]), kn = kind(), art = a[1];
    if (zwei) { const k2 = kind(); if (k2 === kn) return null;
      return auswahl(Z(`${kn} ${a[0]}`, `${k2} ${b[0]}`, 'Kreuze an, welche Art der Erhebung die beiden nutzen.'), [opt(`${kn}: ${a[1]}, ${k2}: ${b[1]}`, true), opt(`${kn}: ${b[1]}, ${k2}: ${a[1]}`, false), opt(`Beide machen eine Umfrage.`, false), opt(`Beide machen eine ${a[1] === 'Umfrage' ? 'Messung' : 'Umfrage'}.`, false)],
        H(n, 'Bei einer Umfrage fragt man. Bei einer Beobachtung schaut man zu und zählt. Bei einer Messung misst man eine Größe.'), { nachweis: [FREI('Art der Erhebung aus der Beschreibung')] }); }
    return auswahl(Z(`${kn} ${a[0]}`, 'Kreuze an, welche Art der Erhebung das ist.'), ['Umfrage', 'Beobachtung', 'Messung'].map((x) => opt(x, x === art)),
      H(n, 'Bei einer Umfrage fragt man. Bei einer Beobachtung schaut man zu und zählt. Bei einer Messung misst man eine Größe.', 'Wer mit dem Maßband die Weite bestimmt, macht eine Messung.'), { nachweis: [FREI('Art der Erhebung aus der Beschreibung')] }); };
  // Fragebogen mit Fehler.
  const FRAGEBOGEN = [
    ['Wie kommst du zur Schule?', '☐ Bus\n☐ Fahrrad\n☐ zu Fuß', 'Es fehlt eine Antwort für Kinder, die mit dem Auto kommen.', ['Die Frage ist zu kurz.', 'Es gibt zu viele Antworten.', 'Der Fragebogen ist in Ordnung.']],
    ['Magst du Äpfel und Bananen?', '☐ ja\n☐ nein', 'Es sind zwei Fragen in einer. Wer nur Äpfel mag, kann nicht richtig antworten.', ['Es fehlt die Antwort „vielleicht“.', 'Obst passt nicht in eine Umfrage.', 'Der Fragebogen ist in Ordnung.']],
    ['Wie viele Minuten brauchst du für den Schulweg?', '☐ 0 bis 10\n☐ 10 bis 20\n☐ 20 bis 30', 'Die Antworten überschneiden sich: 10 und 20 Minuten passen in zwei Kästchen. Und für mehr als 30 Minuten fehlt ein Kästchen.', ['Die Zahlen sind zu groß.', 'Es fehlt eine Antwort „gar nicht“.', 'Der Fragebogen ist in Ordnung.']],
    ['Findest du nicht auch, dass Pizza das beste Essen ist?', '☐ ja\n☐ nein', 'Die Frage drängt zu einer Antwort. Besser: „Was ist dein Lieblingsessen?“', ['Es fehlt die Antwort „vielleicht“.', 'Die Frage ist zu kurz.', 'Der Fragebogen ist in Ordnung.']],
    ['Welche Farbe hat dein Fahrrad?', '☐ rot\n☐ blau\n☐ schwarz', 'Es fehlen Antworten für andere Farben und für Kinder ohne Fahrrad.', ['Fahrräder passen nicht in eine Umfrage.', 'Es gibt zu viele Antworten.', 'Der Fragebogen ist in Ordnung.']],
  ];
  const fragebogen = (n, liste) => () => { const [frage, antworten, richtig, falsch] = wahl(liste), kn = kind();
    return auswahl(Z(`${kn} hat diese Frage in einen Fragebogen geschrieben:`, `„${frage}“\n${antworten}`, 'Kreuze an, was an der Frage nicht gut ist.'), [opt(richtig, true), ...falsch.map((f, i) => opt(f, false, i === 2 ? 'umfrage-unpassend' : undefined))],
      H(n, 'Jedes Kind muss genau eine passende Antwort finden können. Die Frage darf keine Antwort vorgeben.', 'Prüfe: Kann jedes Kind ehrlich und eindeutig antworten?'), { nachweis: [FREI('Fehler im Fragebogen')] }); };
  // Zwei Klassen zusammen.
  const zweiKlassen = (n) => () => { const u = umfrage('sport', 'obst', 'tier', 'essen'), antworten = mische(u.antworten).slice(0, 4), a = antworten.map(() => zz(2, 9)), b = antworten.map(() => zz(2, 9)), i = zz(0, 3), [k1, k2] = mische(['6a', '6b', '6c']).slice(0, 2);
    return zahl(Z(`Die Tabelle zeigt eine Umfrage ${u.zum} in der ${k1} und der ${k2}.`, `Bestimme, wie viele Kinder in beiden Klassen zusammen „${antworten[i]}“ nennen.`), a[i] + b[i], null, [[a[i], 'sach-schritt-vergessen'], [summe(a) + summe(b), 'sach-frage-verfehlt']],
      H(n, 'Lies in der Zeile der Antwort beide Zahlen ab und addiere sie.', `Lies die Zeile „${antworten[i]}“ ab.`), { daten: daten(['Antwort', k1, k2], antworten.map((x, j) => [x, a[j], b[j]])), nachweis: [`${a[i]} + ${b[i]} = ${a[i] + b[i]}`] }); };
  sechs(E1, 'M', [erhebungsart('M'), fragebogen('M', FRAGEBOGEN.slice(0, 2)), fragebogen('M', FRAGEBOGEN.slice(3, 5)), tabelleZurListe('M', 5, 28, 32, true), zweiKlassen('M'), fragebogen('M', FRAGEBOGEN.slice(2, 3))]);

  // E: Werte in Gruppen zählen.
  const gruppen = (n) => () => { const zeiten = Array.from({ length: 16 }, () => zz(3, 29)), [von, bis] = wahl([[10, 19], [20, 29], [0, 9]]), k = zeiten.filter((x) => x >= von && x <= bis).length;
    if (k < 3) return null;
    return zahl(Z('16 Kinder nennen, wie viele Minuten sie für den Schulweg brauchen.', 'Die Lehrkraft will die Zeiten in Gruppen ordnen: 0 bis 9 Minuten, 10 bis 19 Minuten, 20 bis 29 Minuten.', `Bestimme, wie viele Kinder in die Gruppe ${von} bis ${bis} Minuten gehören.`), k, null, [[zeiten.filter((x) => x > von && x < bis).length, 'liste-verzaehlt']],
      H(n, 'Prüfe jede Zeit einzeln: Liegt sie in der Gruppe? Auch die Grenzen gehören dazu.'), { urliste: zeiten.map((x) => `${x} min`), nachweis: [FREI(`In ${von} bis ${bis} liegen ${k} der Zeiten`), WERT(k)] }); };
  // Rückwärts: Eine Anzahl fehlt in der Tabelle.
  const fehlende = (n) => () => { const u = umfrage(), { antworten, anzahlen, gesamt } = ziehe(u, 5, 30, 40), i = zz(0, 4);
    return zahl(Z(`${gesamt} ${u.wer} wurden nach ${u.dem} gefragt.`, 'In der Tabelle fehlt eine Anzahl.', 'Bestimme die fehlende Anzahl.'), anzahlen[i], null, [[gesamt - summe(anzahlen) + 2 * anzahlen[i] + 1, 'liste-verzaehlt'], [summe(anzahlen) - anzahlen[i], 'sach-frage-verfehlt']],
      H(n, 'Alle Anzahlen zusammen ergeben die Anzahl der Befragten.'), { daten: daten(['Antwort', 'Anzahl'], antworten.map((a, j) => [a, j === i ? '?' : anzahlen[j]])), nachweis: [`${gesamt} − ${summe(anzahlen) - anzahlen[i]} = ${anzahlen[i]}`] }); };
  // Aussage über die Hälfte prüfen.
  const haelfte = (n) => () => { const u = umfrage('weg'), anzahlen = [zz(10, 14), zz(5, 8), zz(3, 6)], g = summe(anzahlen), mehr = 2 * anzahlen[0] > g, kn = kind();
    if (2 * anzahlen[0] === g) return null;
    return auswahl(Z(`Die Tabelle zeigt den Schulweg von ${g} Kindern.`, `${kn} sagt: „Mehr als die Hälfte der Kinder fährt mit dem Bus.“`, 'Beurteile die Aussage.'),
      [opt(mehr ? `Stimmt. ${anzahlen[0]} ist mehr als die Hälfte von ${g}.` : `Falsch. Die Hälfte von ${g} ist ${String(g / 2).replace('.', ',')}. ${anzahlen[0]} ist weniger.`, true),
        opt(mehr ? `Falsch. Die meisten fahren nicht mit dem Bus.` : 'Stimmt. Mit dem Bus fahren die meisten Kinder.', false, mehr ? undefined : 'anteil-nicht-beachtet'),
        opt(mehr ? 'Falsch. Dafür müssten es alle Kinder sein.' : `Stimmt. ${anzahlen[0]} ist mehr als ${anzahlen[1]}.`, false, mehr ? undefined : 'anteil-nicht-beachtet')],
      H(n, '„Die meisten“ heißt nicht „mehr als die Hälfte“. Vergleiche mit der Hälfte aller Kinder.'), { daten: daten(['Schulweg', 'Anzahl'], [['Bus', anzahlen[0]], ['Fahrrad', anzahlen[1]], ['zu Fuß', anzahlen[2]]]), nachweis: [`${anzahlen.join(' + ')} = ${g}`, URTEIL(mehr)] }); };
  // Passende Erhebung zu einer Frage.
  const passendeErhebung = (n) => () => { const [frage, art] = wahl([['wie weit die Kinder der 6b springen', 'Messung'], ['wie viele Radfahrer morgens am Schultor vorbeifahren', 'Beobachtung'], ['welche Musik die Kinder der 6b hören', 'Umfrage'], ['wie schwer die Schulranzen der 6a sind', 'Messung']]), kn = kind();
    return auswahl(Z(`${kn} will herausfinden, ${frage}.`, 'Kreuze an, welche Erhebung am besten passt, und begründe.'),
      [['Messung', 'Man bestimmt eine Größe mit einem Messgerät.'], ['Beobachtung', 'Man schaut zu und zählt, ohne zu fragen.'], ['Umfrage', 'Man fragt die Personen und schreibt die Antworten auf.']].map(([x, w]) => opt(`${x}. ${w}`, x === art)).concat([opt('Schätzen. Das geht am schnellsten.', false)]),
      H(n, 'Überlege, ob man die Antwort am besten fragt, sieht oder misst.'), { nachweis: [FREI('Passende Erhebung zur Frage')] }); };
  sechs(E1, 'E', [tabelleZurListe('E', 5, 30, 36, true), passendeErhebung('E'), fragebogen('E', FRAGEBOGEN.slice(3, 4).concat(FRAGEBOGEN.slice(2, 3))), fehlende('E'), gruppen('E'), haelfte('E')]);

  // ================= E2: Stichproben beurteilen =================
  // Tabelle: Wie viele Kinder aus welcher Klasse wurden gefragt?
  const gefragt = (verteilung) => daten(['Klasse', 'gefragte Kinder'], KLASSEN.map((k, i) => [k, verteilung[i]]));
  // Nur eine Klasse gefragt, Frage zur ganzen Schule.
  const nurEine = (n, stichwort = false) => () => { const kn = kind(), i = zz(0, 5), v = KLASSEN.map((_, j) => (j === i ? zz(20, 26) : 0)), thema = wahl(['welches Eis die Kinder der Schule mögen', 'wie die Kinder der Schule zur Schule kommen', 'welche AG die Kinder der Schule wählen']);
    return auswahl(Z(`${kn} will wissen, ${thema}.`, `Die Tabelle zeigt, wen ${kn} gefragt hat.`, `Beurteile die ${stichwort ? 'Stichprobe' : 'Umfrage'}.`),
      [opt(`Nein. ${kn} hat nur Kinder aus der ${KLASSEN[i]} gefragt.`, true), opt(`Ja. ${v[i]} Kinder sind genug.`, false, 'stichprobe-einseitig'), opt('Ja. Die Kinder sind alle in derselben Schule.', false, 'stichprobe-einseitig')],
      H(n, 'Es geht um die ganze Schule. Dann müssen Kinder aus allen Klassen dabei sein.', 'Wer nur die 5a fragt, weiß nur etwas über die 5a.', 'Schau in der Tabelle: Aus welchen Klassen wurden Kinder gefragt?'), { daten: gefragt(v), nachweis: [URTEIL(false), FREI('Nur eine Klasse gefragt')] }); };
  // Aus jeder Klasse einige: passt.
  const ausJeder = (n, stichwort = false) => () => { const kn = kind(), v = KLASSEN.map(() => zz(4, 6)), thema = wahl(['welches Eis die Kinder der Schule mögen', 'welche AG die Kinder der Schule wählen', 'wie lange die Kinder der Schule schlafen']);
    return auswahl(Z(`${kn} will wissen, ${thema}.`, `Die Tabelle zeigt, wen ${kn} gefragt hat.`, `Beurteile die ${stichwort ? 'Stichprobe' : 'Umfrage'}.`),
      [opt('Ja. Aus jeder Klasse wurden einige Kinder gefragt.', true), opt('Nein. Man muss alle Kinder der Schule fragen.', false), opt('Nein. Aus jeder Klasse wurden zu viele gefragt.', false)],
      H(n, 'Kinder aus allen Klassen sind dabei. Dann zeigt die Umfrage gut, was die ganze Schule denkt.', 'Aus jeder Klasse 5 Kinder: Alle Klassen sind dabei.', 'Schau in der Tabelle: Fehlt eine Klasse?'), { daten: gefragt(v), nachweis: [`${v.join(' + ')} = ${summe(v)}`, URTEIL(true)] }); };
  // Zu wenige gefragt.
  const zuWenige = (n, stichwort = false) => () => { const kn = kind(), v = KLASSEN.map(() => 0), a = zz(0, 2), b = zz(3, 5); v[a] = 1; v[b] = 1;
    return auswahl(Z(`${kn} will wissen, welchen Sport die Kinder der Schule mögen.`, `Die Tabelle zeigt, wen ${kn} gefragt hat.`, `Beurteile die ${stichwort ? 'Stichprobe' : 'Umfrage'}.`),
      [opt('Nein. 2 Kinder sind viel zu wenige.', true), opt('Ja. Die Kinder sind aus zwei Klassen.', false, 'stichprobe-einseitig'), opt('Ja. Jedes Kind sagt seine Meinung.', false, 'stichprobe-einseitig')],
      H(n, 'Zähle, wie viele Kinder gefragt wurden. Sind es genug für die ganze Schule?', 'Fragt man nur 2 Kinder, kann das Ergebnis Zufall sein.', 'Zähle die gefragten Kinder zusammen.'), { daten: gefragt(v), nachweis: ['1 + 1 = 2', URTEIL(false)] }); };
  // Frage nur zur eigenen Klasse, ganze Klasse gefragt: passt.
  const eigeneKlasse = (n, stichwort = false) => () => { const kn = kind(), i = zz(0, 5), v = KLASSEN.map((_, j) => (j === i ? zz(22, 28) : 0));
    return auswahl(Z(`${kn} will wissen, welches Obst die Kinder der ${KLASSEN[i]} mögen.`, `Die Tabelle zeigt, wen ${kn} gefragt hat.`, `Beurteile die ${stichwort ? 'Stichprobe' : 'Umfrage'}.`),
      [opt(`Ja. Es geht nur um die ${KLASSEN[i]}, und dort wurden alle gefragt.`, true), opt('Nein. Kinder aus anderen Klassen fehlen.', false), opt('Nein. Eine Klasse ist zu klein für eine Umfrage.', false)],
      H(n, 'Lies genau: Um wen geht es in der Frage?', 'Geht es nur um die 6a, reicht es, die 6a zu fragen.', `Die Frage ist nur zur ${KLASSEN[i]}.`), { daten: gefragt(v), nachweis: [URTEIL(true)] }); };
  // Wen fragen?
  const wenFragen = (n, stichwort = false) => () => { const kn = kind(), [thema, gut, einseitig1, einseitig2] = wahl([
    ['welchen Sport die Kinder der Schule mögen', 'Einige Kinder aus jeder Klasse', 'Nur die Kinder aus dem Fußballverein', 'Nur seine besten Freunde'],
    ['wie viele Kinder der Schule ein Haustier haben', 'Einige Kinder aus jeder Klasse', 'Nur die Kinder beim Tierarzt', 'Nur die Kinder aus seiner Straße'],
    ['welche Bücher die Kinder der Schule lesen', 'Einige Kinder aus jeder Klasse', 'Nur die Kinder in der Bücherei', 'Nur die Kinder der 5a'],
  ]);
    return auswahl(Z(`${kn} will wissen, ${thema}.`, `Kreuze an, wen ${kn} am besten fragt.`), [opt(gut, true), opt(einseitig1, false, 'stichprobe-einseitig'), opt(einseitig2, false, 'stichprobe-einseitig')],
      H(n, 'Gut ist eine Gruppe, in der alle Kinder der Schule vorkommen können.', 'Nur Kinder aus dem Schwimmbad zu fragen, ob sie gern schwimmen, passt nicht.', 'Überlege bei jeder Gruppe: Denken diese Kinder vielleicht alle gleich?'), { daten: daten(['Schule', 'Kinder'], KLASSEN.map((k) => [k, zz(22, 28)])), nachweis: [FREI('Einseitige Stichproben erkennen')] }); };
  // Einseitige Gruppe: Sportverein und Lieblingssport.
  const verein = (n, stichwort = false) => () => { const kn = kind(), [gruppe, thema] = wahl([['Fußballmannschaft', 'welchen Sport die Kinder der Schule mögen'], ['Schwimm-AG', 'wie gern die Kinder der Schule schwimmen'], ['Bücherei-AG', 'wie gern die Kinder der Schule lesen']]), v = KLASSEN.map(() => zz(1, 4));
    return auswahl(Z(`${kn} will wissen, ${thema}.`, `${kn} fragt nur die Kinder der ${gruppe}.`, `Die Tabelle zeigt die Klassen dieser Kinder.`, `Beurteile die ${stichwort ? 'Stichprobe' : 'Umfrage'}.`),
      [opt(`Nein. Kinder der ${gruppe} antworten anders als die anderen Kinder.`, true), opt('Ja. Kinder aus allen Klassen sind dabei.', false, 'stichprobe-einseitig'), opt(`Ja. Die ${gruppe} kennt sich gut aus.`, false, 'stichprobe-einseitig')],
      H(n, 'Alle Klassen sind dabei. Aber denken diese Kinder anders als die anderen?', 'Kinder im Schwimmverein schwimmen meist gern. Sie sind keine gute Gruppe für die Frage „Schwimmst du gern?“.', `Überlege: Was mögen Kinder der ${gruppe} wohl am liebsten?`), { daten: gefragt(v), nachweis: [URTEIL(false), FREI('Einseitige Gruppe trotz aller Klassen')] }); };
  sechs(E2, 'F', [nurEine('F'), ausJeder('F'), zuWenige('F'), eigeneKlasse('F'), wenFragen('F'), verein('F')]);
  sechs(E2, 'G', [nurEine('G', true), ausJeder('G', true), eigeneKlasse('G', true), zuWenige('G', true), wenFragen('G', true), verein('G', true)]);

  // M: Erhebung planen mit Hilfe.
  const PLAENE = [
    ['wie viele Kinder der Schule ein Haustier haben', 'Sie fragt aus jeder der 8 Klassen 5 Kinder, die sie auslost.', ['Sie fragt 40 Kinder vor der Zoohandlung.', 'Sie fragt ihre 5 besten Freundinnen.', 'Sie fragt alle Kinder ihrer eigenen Klasse.']],
    ['wie lange die Kinder der Schule abends lesen', 'Sie fragt in jeder Klasse jedes fünfte Kind auf der Namensliste.', ['Sie fragt nur die Kinder in der Bücherei.', 'Sie fragt 3 Kinder auf dem Schulhof.', 'Sie fragt nur die Kinder der 5a.']],
    ['welches Schulessen die Kinder am liebsten mögen', 'Sie fragt an drei verschiedenen Tagen einige Kinder aus allen Klassen.', ['Sie fragt nur an dem Tag, an dem es Pizza gibt.', 'Sie fragt nur die Kinder, die nie in der Mensa essen.', 'Sie fragt nur die Köchin.']],
  ];
  const planen = (n) => () => { const [thema, gut, schlecht] = wahl(PLAENE), kn = wahl(['Mia', 'Lena', 'Mara', 'Ida', 'Lina', 'Elif', 'Sara']);
    return auswahl(Z(`${kn} will wissen, ${thema}.`, 'Kreuze den besten Plan für die Stichprobe an.'), [opt(gut, true), ...schlecht.map((s, i) => opt(s, false, i < 2 ? 'stichprobe-einseitig' : undefined))],
      H(n, 'Eine gute Stichprobe ist groß genug und hat Kinder aus allen Gruppen. Am besten entscheidet der Zufall, wer gefragt wird.', 'Prüfe jeden Plan: Werden manche Kinder bevorzugt?'), { nachweis: [FREI('Bester Plan für die Stichprobe')] }); };
  // M: Wie viele aus jeder Klasse?
  const jeKlasse = (n) => () => { const klassen = wahl([6, 8, 10]), je = wahl([3, 4, 5]), kn = kind();
    return zahl(Z(`Die Schule hat ${klassen} Klassen.`, `${kn} will aus jeder Klasse ${je} Kinder zufällig auslosen.`, 'Bestimme, wie viele Kinder in der Stichprobe sind.'), klassen * je, null, [[klassen + je, 'sach-falsche-rechnung'], [je, 'sach-schritt-vergessen']],
      H(n, 'Aus jeder Klasse gleich viele Kinder: Rechne mal.', `Rechne ${klassen} · ${je}.`), { nachweis: [`${klassen} · ${je} = ${klassen * je}`] }); };
  sechs(E2, 'M', [nurEine('M', true), planen('M'), jeKlasse('M'), verein('M', true), planen('M'), wenFragen('M', true)]);

  // E: begründen und besseren Vorschlag wählen. Mit heft: zuerst im Heft einen eigenen Vorschlag schreiben.
  const besser = (n, heft = false) => () => { const kn = kind(), [plan, gut, schlecht] = wahl([
    ['fragt nur seine Fußballmannschaft, wie die Kinder der Schule zur Schule kommen.', 'Aus jeder Klasse einige Kinder zufällig auslosen und fragen.', ['Die ganze Fußballmannschaft zweimal fragen.', 'Nur die Kinder fragen, die mit dem Rad kommen.', 'Die Lehrkräfte fragen, wie die Kinder kommen.']],
    ['fragt morgens am Fahrradständer 30 Kinder, wie sie zur Schule kommen.', 'Morgens an allen Eingängen und an der Bushaltestelle einige Kinder fragen.', ['Am Fahrradständer 60 Kinder fragen.', 'Nur die Kinder fragen, die zu Fuß kommen.', 'Am Nachmittag am Fahrradständer fragen.']],
    ['fragt im Schwimmbad 50 Kinder, ob die Kinder der Stadt gern schwimmen.', 'In mehreren Schulen der Stadt einige Kinder aus jeder Klasse fragen.', ['Im Schwimmbad 100 Kinder fragen.', 'Nur die Kinder im Schwimmkurs fragen.', 'Die Bademeister fragen.']],
  ]);
    return auswahl(Z(`${kn} ${plan}`, heft ? 'Im Heft: Begründe, warum die Stichprobe nicht passt. Schreibe einen besseren Vorschlag auf.' : 'Die Stichprobe passt nicht.', heft ? 'Kreuze dann an, welcher Vorschlag deinem am nächsten kommt.' : 'Kreuze den besseren Vorschlag an.'),
      [opt(gut, true), ...schlecht.map((s, i) => opt(s, false, i < 2 ? 'stichprobe-einseitig' : undefined))],
      H(n, 'Die Stichprobe ist einseitig: Bestimmte Kinder sind öfter dabei. Ein größerer Umfang hilft dann nicht.'), { nachweis: [FREI('Besserer Vorschlag für eine einseitige Stichprobe')] }); };
  // E: Größe hilft nicht gegen Einseitigkeit.
  const groesse = (n) => () => { const kn = kind(), [k1, k2] = [zz(150, 200), zz(30, 50)];
    return auswahl(Z(`Zwei Kinder wollen wissen, welchen Sport die Kinder der Stadt mögen.`, `${kn} fragt ${k1} Kinder im Fußballstadion.`, `Lena fragt ${k2} Kinder, die sie in fünf Schulen der Stadt auslost.`, 'Beurteile die beiden Stichproben.'),
      [opt(`Lenas Stichprobe passt besser. Im Stadion sind vor allem Fußballfans.`, true), opt(`${kn}s Stichprobe passt besser. Sie ist größer.`, false, 'stichprobe-einseitig'), opt('Beide passen gleich gut. Es sind in beiden Fällen Kinder aus der Stadt.', false, 'stichprobe-einseitig'), opt('Keine passt. Man muss alle Kinder der Stadt fragen.', false)],
      H(n, 'Eine große Stichprobe ist nur gut, wenn sie nicht einseitig ist.'), { nachweis: [FREI('Größe gegen Einseitigkeit abwägen')] }); };
  // E: Ergebnis einer einseitigen Stichprobe deuten.
  const deuten = (n) => () => { const ja = zz(18, 24), g = 25, kn = kind();
    return auswahl(Z(`${kn} fragt ${g} Kinder in der Schwimm-AG: „Schwimmst du gern?“`, `${ja} Kinder sagen ja.`, `${kn} schreibt: „Fast alle Kinder der Schule schwimmen gern.“`, 'Beurteile die Aussage.'),
      [opt('Falsch. In der Schwimm-AG sind Kinder, die gern schwimmen. Für die Schule sagt das wenig.', true), opt(`Stimmt. ${ja} von ${g} sind fast alle.`, false, 'stichprobe-einseitig'), opt(`Stimmt. ${g} Kinder sind genug.`, false, 'stichprobe-einseitig'), opt(`Falsch. ${ja} von ${g} ist weniger als die Hälfte.`, false)],
      H(n, 'Überlege, wer in der Stichprobe ist. Kann man von dieser Gruppe auf alle schließen?'), { nachweis: [URTEIL(false), FREI('Schluss aus einseitiger Stichprobe')] }); };
  sechs(E2, 'E', [nurEine('E', true), besser('E', true), groesse('E'), besser('E'), deuten('E'), besser('E', true)]);
}
