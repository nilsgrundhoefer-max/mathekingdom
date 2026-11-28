// Aufgaben zu 6.8.6 „Daten darstellen“ (Niveau-Meilenstein, nur M und E) nach ADR 0058.
// D1 Streifendiagramm erstellen: Ein Streifen hat 20 Kästchen, ein Kästchen sind 5 %. M aus Prozenten und aus 20 oder 40 Befragten,
// E aus Anzahlen mit anderen Gesamtzahlen, Längen in cm, irreführende Streifen und rückwärts.
// D2 Kreisdiagramm erstellen: M Winkel aus Prozent und aus Anzahlen, E aus Anzahlen, rückwärts, Irreführung, passendes Diagramm.
// Heftaufgaben (Grilling 2026-11-28): Das Kreisdiagramm wird im Heft gezeichnet, ein Kontrollwert wird eingegeben.

import { zz, wahl, mische, Z, opt, auswahl, kind, zwoelf, H, FREI, zahl, tabelle, LU, streifenFaerben, daten, summe, dz, umfrage, kreis, streifen, ANTEIL, ANZAHL, URTEIL } from './6-8-daten.mjs';

const D1 = '6.8.6-D1', D2 = '6.8.6-D2';
// k Teile in Schritten von `schritt`, zusammen `ganz`, alle verschieden.
function teile(ganz, k, schritt, { min = 1 } = {}) {
  for (let v = 0; v < 500; v++) {
    const l = Array.from({ length: k - 1 }, () => schritt * zz(min, Math.floor(ganz / schritt / k) + 2)), rest = ganz - summe(l);
    if (rest >= schritt * min && new Set([...l, rest]).size === k) return mische([...l, rest]);
  }
  return null;
}
const antworten = (u, k) => mische(u.antworten).slice(0, k);

export function darstellen6() {
  // ================= D1: Streifendiagramm erstellen =================
  // Aus Prozenten: Kästchen = Prozent : 5.
  const ausProzent = (n, k) => () => { const u = umfrage(), p = teile(100, k, 5), a = antworten(u, k), kae = p.map((x) => x / 5);
    return streifenFaerben(Z(`Eine Umfrage ${u.zum} ergibt die Anteile in der Tabelle.`, 'Färbe den Streifen passend. Der ganze Streifen sind 100 %.'), a.map((x, i) => [x, kae[i]]),
      [[p.map((x) => Math.floor(x / 10)), 'streifen-laenge-als-anteil'], [p.map((x) => Math.round(x / 10) * 2), 'sach-falsche-rechnung']],
      H(n, 'Der Streifen hat 20 Kästchen. Ein Kästchen sind 100 % : 20 = 5 %.', `${p[0]} % sind ${p[0]} : 5 = ${kae[0]} Kästchen.`), { daten: daten(['Antwort', 'Anteil'], a.map((x, i) => [x, `${p[i]} %`])), nachweis: a.map((_, i) => ANZAHL(p[i], 'prozent', 20, kae[i])) }); };
  // Aus Anzahlen bei 20 oder 40 Befragten.
  const ausAnzahl = (n, g, k = 3) => () => { const u = umfrage(), f = g / 20, kae = teile(20, k, 1), a = antworten(u, k), anz = kae.map((x) => x * f);
    return streifenFaerben(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, 'Färbe den Streifen passend. Der ganze Streifen sind alle Befragten.'), a.map((x, i) => [x, kae[i]]),
      [[anz, 'relativ-absolut-verwechselt'], [kae.map((x) => Math.floor(x / 2)), 'streifen-laenge-als-anteil']],
      H(n, `Der Streifen hat 20 Kästchen für ${g} ${u.wer}.`, g === 20 ? 'Ein Kästchen ist hier genau ein Kind.' : 'Ein Kästchen sind hier 2 Befragte.'), { daten: daten(['Antwort', 'Anzahl'], a.map((x, i) => [x, anz[i]])), nachweis: a.map((_, i) => ANTEIL(anz[i], g, kae[i] * 5, 'prozent', { zwischen: true })).concat(a.map((_, i) => ANZAHL(kae[i] * 5, 'prozent', 20, kae[i]))) }); };
  // Länge eines Abschnitts in einem 10-cm- oder 20-cm-Streifen.
  const laenge = (n, cm) => () => { const u = umfrage(), p = teile(100, 3, 5), a = antworten(u, 3), i = zz(0, 2), l = (p[i] * cm) / 100;
    return zahl(Z(`Eine Umfrage ${u.zum} ergibt: ${a.map((x, j) => `${x} ${p[j]} %`).join(', ')}.`, `Das Streifendiagramm soll ${cm} cm lang werden.`, `Bestimme, wie lang der Abschnitt für „${a[i]}“ wird.`), l, 'cm',
      [[p[i], 'streifen-laenge-als-anteil'], [p[i] / 10 === l ? p[i] / 5 : p[i] / 10, 'streifen-laenge-als-anteil']],
      H(n, `Der ganze Streifen ist 100 %. ${cm === 10 ? '10 % sind 1 cm.' : '5 % sind 1 cm.'}`, `${p[i]} % von ${cm} cm.`), { nachweis: [ANZAHL(p[i], 'prozent', cm * 10, l * 10, { einheit: 'mm' })] }, 1); };
  const kaestchenWahl = (n) => () => { const p = wahl([15, 35, 45, 55, 65, 85]), k = p / 5;
    return auswahl(Z('Ein Streifen hat 20 Kästchen. Der ganze Streifen sind 100 %.', `Kreuze an, wie viele Kästchen ${p} % sind.`), [opt(String(k), true), opt(String(Math.floor(p / 10)), false, 'streifen-laenge-als-anteil'), opt(String(p), false, 'prozent-als-zaehler'), opt(String(20 - k), false)],
      H(n, 'Ein Kästchen sind 5 %.', `Rechne ${p} : 5.`), { nachweis: [ANZAHL(p, 'prozent', 20, k)] }); };
  zwoelf(D1, 'M', [ausProzent('M', 3), ausProzent('M', 4), ausAnzahl('M', 20), ausProzent('M', 3), laenge('M', 10), ausAnzahl('M', 40),
    ausProzent('M', 4), kaestchenWahl('M'), ausProzent('M', 3), ausAnzahl('M', 40, 4), laenge('M', 20), ausProzent('M', 4)]);

  // E: andere Gesamtzahlen.
  const ausAnzahlE = (n, gesamte, k) => () => { const u = umfrage(), g = wahl(gesamte), f = g / 20, kae = teile(20, k, 1), a = antworten(u, k), anz = kae.map((x) => x * f);
    if (!anz.every(Number.isInteger)) return null;
    return streifenFaerben(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, 'Färbe den Streifen mit 20 Kästchen passend.'), a.map((x, i) => [x, kae[i]]),
      [[anz.map((x) => Math.min(x, 20)), 'relativ-absolut-verwechselt'], [kae.map((x) => Math.max(0, x - 1)), 'sach-falsche-rechnung']],
      H(n, `Bestimme zuerst, wie viele Befragte ein Kästchen sind: ${g} : 20.`), { daten: daten(['Antwort', 'Anzahl'], a.map((x, i) => [x, anz[i]])), nachweis: a.map((_, i) => ANTEIL(anz[i], g, kae[i] * 5, 'prozent', { zwischen: true })).concat(a.map((_, i) => ANZAHL(kae[i] * 5, 'prozent', 20, kae[i]))) }); };
  const laengeE = (n) => () => { const u = umfrage(), g = wahl([40, 80, 200]), kae = teile(20, 3, 1), a = antworten(u, 3), anz = kae.map((x) => (x * g) / 20), i = zz(0, 2), l = kae[i];
    return zahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt: ${a.map((x, j) => `${x} ${anz[j]}`).join(', ')}.`, 'Das Streifendiagramm soll 20 cm lang werden.', `Bestimme, wie lang der Abschnitt für „${a[i]}“ wird.`), l, 'cm',
      [[anz[i], 'streifen-laenge-als-anteil'], [(anz[i] * 10) / g, 'sach-falsche-rechnung']],
      H(n, 'Bestimme zuerst den Anteil. Nimm diesen Anteil von 20 cm.'), { nachweis: [ANTEIL(anz[i], g, kae[i] * 5, 'prozent', { zwischen: true }), ANZAHL(kae[i] * 5, 'prozent', 200, l * 10, { einheit: 'mm' })] }, 1); };
  const gesamtRueck = (n) => () => { const u = umfrage(), g = wahl([40, 60, 80, 100, 120]), a = antworten(u, 1)[0], k = zz(2, 9), anz = (k * g) / 20;
    if (!Number.isInteger(anz)) return null;
    return zahl(Z(`Ein Streifen hat 20 Kästchen. „${a}“ hat ${k} Kästchen.`, `${anz} ${u.wer} haben „${a}“ genannt.`, 'Bestimme, wie viele befragt wurden.'), g, null, [[anz * k, 'sach-falsche-rechnung'], [anz + 20, 'sach-falsche-rechnung'], [anz * 20, 'relativ-absolut-verwechselt']],
      H(n, `${k} Kästchen sind ${anz} ${u.wer}. Bestimme zuerst, wie viele ein Kästchen sind.`), { nachweis: [ANZAHL(k * 5, 'prozent', g, anz)] }); };
  const falscheLaenge = (n) => () => { const u = umfrage(), p = teile(100, 3, 10), a = antworten(u, 3), i = p.indexOf(Math.max(...p)), j = p.indexOf(Math.min(...p)), mm = p.map((x, x2) => (x2 === i ? x - 10 : x2 === j ? x + 10 : x)), kn = kind();
    if (mm[j] === mm[i]) return null;
    return auswahl(Z(`${kn} zeichnet ein Streifendiagramm ${u.zum}. Der Streifen ist 10 cm lang.`, 'Beurteile die Darstellung.'), [opt(`Fehlerhaft. „${a[i]}“ hat ${p[i]} %, müsste also ${p[i] / 10} cm lang sein.`, true), opt('In Ordnung. Die Prozente in der Beschriftung ergeben zusammen 100 %.', false), opt('In Ordnung. Die Abschnitte füllen den ganzen Streifen von 10 cm.', false), opt(`Fehlerhaft. „${a[j]}“ müsste ${p[j] + 20} % sein.`, false)],
      H(n, 'Prüfe für jeden Abschnitt, ob die Länge zum Prozentwert passt. Bei 10 cm sind 10 % genau 1 cm.'), { bild: streifen(10, a.map((x, x2) => [x, mm[x2], `${p[x2]} %`])), nachweis: [`${p.join(' + ')} = 100`, ANZAHL(p[i], 'prozent', 100, p[i], { einheit: 'mm' }), URTEIL(false)] }); };
  const zweiLaengen = (n) => () => { const cm = wahl([3, 4, 6]), kn = kind();
    return auswahl(Z(`${kn} zeichnet zwei Streifendiagramme nebeneinander: für die 6a einen 20-cm-Streifen, für die 6b einen 10-cm-Streifen.`, `In beiden Streifen ist „Fahrrad“ ${cm} cm lang.`, `${kn} schreibt darunter: „In beiden Klassen fährt der gleiche Anteil mit dem Fahrrad.“`, 'Beurteile die Darstellung.'),
      [opt(`Irreführend. In der 6a sind es ${cm * 5} %, in der 6b ${cm * 10} %.`, true), opt('In Ordnung. Gleich lange Abschnitte zeigen immer gleiche Anteile.', false, 'streifen-laenge-als-anteil'), opt(`Irreführend. In der 6a sind es ${cm * 10} %, in der 6b ${cm * 5} %.`, false), opt('In Ordnung. Streifendiagramme dürfen verschieden lang sein.', false)],
      H(n, 'Ein Abschnitt zeigt einen Anteil am ganzen Streifen. Vergleiche, wie lang die ganzen Streifen sind.'), { nachweis: [`${cm} · 5 = ${cm * 5}`, `${cm} · 10 = ${cm * 10}`, URTEIL(false)] }); };
  zwoelf(D1, 'E', [ausAnzahlE('E', [60, 80, 100], 3), ausAnzahlE('E', [100, 200, 120], 4), laengeE('E'), gesamtRueck('E'), ausAnzahlE('E', [60, 140, 160], 4), falscheLaenge('E'),
    ausAnzahlE('E', [80, 200, 60], 4), ausAnzahlE('E', [120, 100, 180], 5), laengeE('E'), zweiLaengen('E'), ausAnzahlE('E', [60, 80, 140], 3), gesamtRueck('E')]);

  // ================= D2: Kreisdiagramm erstellen =================
  const namen = (k) => Array.from({ length: k }, (_, i) => `w${i + 1}`);
  const tabProzent = (n, k) => () => { const u = umfrage(), p = teile(100, k, 5), a = antworten(u, k), w = p.map((x) => x * 3.6), nm = namen(k);
    return tabelle(Z(`Eine Umfrage ${u.zum} ergibt die Anteile in der Tabelle.`, 'Berechne für jede Antwort den Winkel im Kreisdiagramm.'), ['Antwort', 'Anteil', 'Winkel in °'],
      [...a.map((x, i) => [x, `${p[i]} %`, LU(nm[i])]), ['zusammen', '100 %', '360']], Object.fromEntries(nm.map((x, i) => [x, [w[i], [[p[i], 'prozent-als-grad'], [p[i] * 3, 'sach-falsche-rechnung']]]])),
      H(n, 'Der ganze Kreis hat 360°. 1 % sind 360° : 100 = 3,6°.', `${p[0]} % sind ${p[0]} · 3,6° = ${dz(w[0], 1)}°.`), { nachweis: a.map((_, i) => ANTEIL(p[i], 100, w[i], 'grad')) }); };
  const winkelAnzahl = (n, gesamte) => () => { const u = umfrage(), g = wahl(gesamte), a = antworten(u, 1)[0], anz = zz(2, g / 2), w = (anz * 360) / g;
    if (!Number.isInteger(w)) return null;
    return zahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt. ${anz} nennen „${a}“.`, `Berechne den Winkel für „${a}“ im Kreisdiagramm.`), w, '°', [[anz, 'prozent-als-grad'], ...(Number.isInteger((anz * 100) / g) ? [[(anz * 100) / g, 'prozent-als-grad']] : []), [anz * 10, 'sach-falsche-rechnung']],
      H(n, `Alle ${g} ${u.wer} sind der ganze Kreis mit 360°.`, `Ein Befragter sind 360° : ${g} = ${dz(360 / g, 1)}°.`), { nachweis: [ANTEIL(anz, g, w, 'grad')] }); };
  const winkelProzent = (n) => () => { const u = umfrage(), a = antworten(u, 1)[0], p = wahl([5, 10, 15, 20, 30, 35, 40, 45, 55, 60, 65, 70]), w = p * 3.6;
    return zahl(Z(`Bei einer Umfrage ${u.zum} nennen ${p} % „${a}“.`, `Berechne den Winkel für „${a}“ im Kreisdiagramm.`), w, '°', [[p, 'prozent-als-grad'], [p * 3, 'sach-falsche-rechnung']],
      H(n, 'Der ganze Kreis hat 360°. 1 % sind 3,6°.', `Rechne ${p} · 3,6°.`), { nachweis: [ANTEIL(p, 100, dz(w, 1), 'grad')] }, 1); };
  // Heftaufgabe: Kreisdiagramm zeichnen, ein Winkel als Kontrollwert.
  const heftKreis = (n, ausAnzahl) => () => { const u = umfrage(), k = wahl([3, 4]), a = antworten(u, k);
    let zeilen, w, nach;
    if (ausAnzahl) { const g = wahl([24, 36, 40, 60, 72, 90]), anz = teile(g, k, 1); if (!anz) return null; w = anz.map((x) => (x * 360) / g); if (!w.every(Number.isInteger)) return null; zeilen = a.map((x, i) => [x, anz[i]]); nach = anz.map((x, i) => ANTEIL(x, g, w[i], 'grad')); }
    else { const p = teile(100, k, 10); w = p.map((x) => x * 3.6); zeilen = a.map((x, i) => [x, `${p[i]} %`]); nach = p.map((x, i) => ANTEIL(x, 100, w[i], 'grad')); }
    const i = w.indexOf(Math.max(...w));
    nach = nach.map((x, j) => (j === i ? x : { ...x, zwischen: true }));
    return zahl(Z(`Eine Umfrage ${u.zum} ergibt die Werte in der Tabelle.`, 'Zeichne das Kreisdiagramm mit Geodreieck und Zirkel in dein Heft. Beschrifte die Ausschnitte.', `Gib zur Kontrolle den Winkel für „${a[i]}“ an.`), w[i], '°',
      [[ausAnzahl ? zeilen[i][1] : w[i] / 3.6, 'prozent-als-grad']],
      H(n, 'Berechne zuerst alle Winkel. Zusammen müssen es 360° sein. Beginne oben und trage die Winkel nacheinander ab.', ausAnzahl ? 'Ein Befragter ist 360° durch die Gesamtzahl.' : '10 % sind 36°.'), { daten: daten(['Antwort', ausAnzahl ? 'Anzahl' : 'Anteil'], zeilen), nachweis: nach }); };
  const gradWahl = (n) => () => { const p = wahl([25, 20, 40, 15, 30]), w = p * 3.6;
    return auswahl(Z(`Bei einer Umfrage nennen ${p} % „Pizza“.`, 'Kreuze den Winkel an, den „Pizza“ im Kreisdiagramm bekommt.'), [opt(`${dz(w, 1)}°`, true), opt(`${p}°`, false, 'prozent-als-grad'), opt(`${p * 3}°`, false), opt(`${360 - w}°`, false)],
      H(n, 'Der ganze Kreis hat 360°, nicht 100°.', `Rechne ${p} · 3,6°.`), { nachweis: [ANTEIL(p, 100, dz(w, 1), 'grad')] }); };
  zwoelf(D2, 'M', [tabProzent('M', 3), tabProzent('M', 4), winkelAnzahl('M', [24, 36, 40, 60]), tabProzent('M', 3), winkelProzent('M'), heftKreis('M', false),
    tabProzent('M', 4), winkelAnzahl('M', [72, 90, 120, 30]), tabProzent('M', 4), gradWahl('M'), winkelProzent('M'), heftKreis('M', true)]);

  // E: aus Anzahlen.
  const tabAnzahl = (n, gesamte, k) => () => { const u = umfrage(), g = wahl(gesamte), anz = teile(g, k, 1), a = antworten(u, k), nm = namen(k);
    if (!anz) return null;
    const w = anz.map((x) => (x * 360) / g);
    if (!w.every(Number.isInteger)) return null;
    return tabelle(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, 'Berechne für jede Antwort den Winkel im Kreisdiagramm.'), ['Antwort', 'Anzahl', 'Winkel in °'],
      [...a.map((x, i) => [x, String(anz[i]), LU(nm[i])]), ['zusammen', String(g), '360']], Object.fromEntries(nm.map((x, i) => [x, [w[i], [[anz[i], 'prozent-als-grad'], ...(Number.isInteger((anz[i] * 100) / g) ? [[(anz[i] * 100) / g, 'prozent-als-grad']] : [])]]])),
      H(n, `Ein Befragter ist 360° : ${g} = ${dz(360 / g, 1)}°.`), { nachweis: a.map((_, i) => ANTEIL(anz[i], g, w[i], 'grad')) }); };
  const gesamtWinkel = (n) => () => { const u = umfrage(), a = antworten(u, 1)[0], w = wahl([30, 36, 40, 45, 60, 72, 90, 120]), anz = zz(2, 12), g = (anz * 360) / w;
    if (!Number.isInteger(g) || g > 200) return null;
    return zahl(Z(`Im Kreisdiagramm ${u.zum} hat „${a}“ einen Winkel von ${w}°.`, `Das sind ${anz} ${u.wer}.`, 'Bestimme, wie viele befragt wurden.'), g, null, [[(anz * w) / 10, 'sach-falsche-rechnung'], [anz * 100 / w, 'prozent-als-grad'], [360 - w, 'sach-frage-verfehlt']].filter(([x]) => Number.isInteger(x)),
      H(n, `Bestimme, der wievielte Teil von 360° der Winkel ${w}° ist.`), { nachweis: [ANTEIL(anz, g, w, 'grad')] }); };
  const falscherKreis = (n) => () => { const u = umfrage(), p = wahl([[40, 30, 30], [50, 30, 20], [60, 20, 20], [45, 30, 25]]), a = antworten(u, 3), kn = kind();
    return auswahl(Z(`Eine Umfrage ${u.zum} ergibt: ${a.map((x, i) => `${x} ${p[i]} %`).join(', ')}.`, `${kn} zeichnet dazu das Kreisdiagramm im Bild.`, 'Beurteile die Darstellung.'),
      [opt(`Irreführend. „${a[0]}“ müsste ${dz(p[0] * 3.6, 1)}° bekommen, nicht 120°.`, true), opt('In Ordnung. Die Prozente in der Legende ergeben zusammen 100 %.', false), opt('In Ordnung. Drei Antworten bekommen immer drei gleiche Ausschnitte.', false), opt(`Irreführend. „${a[0]}“ müsste ${p[0]}° bekommen.`, false, 'prozent-als-grad')],
      H(n, 'Prüfe für jeden Ausschnitt, ob der Winkel zum Prozentwert passt.'), { bild: kreis(a.map((x, i) => [x, 120, `${p[i]} %`])), nachweis: [`${p[0]} · 3,6 = ${dz(p[0] * 3.6, 1)}`, URTEIL(false)] }); };
  const falscheGesamt = (n) => () => { const u = umfrage(), g = wahl([20, 25, 40, 50]), a = antworten(u, 1)[0], anz = zz(3, g / 2), w = (anz * 360) / g, kn = kind();
    if (!Number.isInteger(w) || anz * 3.6 === w) return null;
    return auswahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt. ${anz} nennen „${a}“.`, `${kn} rechnet für das Kreisdiagramm: ${anz} · 3,6° = ${dz(anz * 3.6, 1)}°.`, 'Beurteile die Rechnung.'),
      [opt(`Falsch. Ein Befragter ist hier ${dz(360 / g, 1)}°, also sind es ${w}°.`, true), opt('Richtig. Ein Befragter ist bei jeder Umfrage genau 3,6°.', false, 'haeufigkeit-falsche-gesamtzahl'), opt(`Falsch. Es sind ${anz}°, ein Grad für jeden Befragten.`, false, 'prozent-als-grad'), opt(`Falsch. Es sind ${360 - w}°, der Rest vom ganzen Kreis.`, false)],
      H(n, 'Der ganze Kreis sind alle Befragten. Prüfe, wie viele es sind.'), { nachweis: [ANTEIL(anz, g, w, 'grad'), URTEIL(false)] }); };
  // Je Lage: richtige Darstellung mit Grund, zwei falsche mit einem Grund, der nicht trägt.
  const SITUATIONEN = [
    ['Die Klasse will zeigen, wie sich alle Kinder auf die Schulwege verteilen.', ['Ein Kreisdiagramm.', 'Es zeigt Anteile an einem Ganzen.'],
      [['Ein Säulendiagramm.', 'Säulen passen zu jeder Umfrage am besten.'], ['Eine Strichliste.', 'Striche sind leichter zu zählen als Winkel.']]],
    ['Die Klasse will die Temperatur an jedem Tag der Woche zeigen.', ['Ein Säulendiagramm.', 'Jeder Tag hat einen eigenen Wert.'],
      [['Ein Kreisdiagramm.', 'Die Woche ist ein Ganzes aus sieben Tagen.'], ['Ein Streifendiagramm.', 'Die Tage liegen nebeneinander wie Abschnitte.']]],
    ['Die Klasse will die Lieblingsfächer von zwei Klassen vergleichen.', ['Zwei gleich lange Streifendiagramme.', 'Man vergleicht Abschnitt für Abschnitt.'],
      [['Zwei Kreisdiagramme mit verschiedenen Radien.', 'Größere Klassen bekommen größere Kreise.'], ['Ein Streifendiagramm für beide Klassen.', 'Dann ist alles in einem Bild.']]],
    ['Die Knappen wollen zeigen, wie viele Punkte jeder beim Turnier erreicht hat.', ['Ein Säulendiagramm.', 'Jeder Knappe hat eine eigene Punktzahl.'],
      [['Ein Kreisdiagramm.', 'Alle Knappen zusammen sind ein Ganzes.'], ['Ein Streifendiagramm.', 'Jeder Knappe bekommt einen Abschnitt.']]],
  ];
  const diagrammWahl = (n) => () => { const [lage, [richtig, grund], falsch] = wahl(SITUATIONEN);
    return auswahl(Z(lage, 'Kreuze an, welche Darstellung am besten passt.'), [opt(`${richtig} ${grund}`, true), ...falsch.map(([f, g]) => opt(`${f} ${g}`))],
      H(n, 'Kreis- und Streifendiagramme zeigen Anteile an einem Ganzen. Säulendiagramme zeigen einzelne Werte.'), { nachweis: [FREI(`${richtig} ${grund}`)] }); };
  zwoelf(D2, 'E', [tabAnzahl('E', [24, 36, 40], 3), tabAnzahl('E', [45, 60, 72], 4), gesamtWinkel('E'), falscherKreis('E'), tabAnzahl('E', [90, 72, 60], 4), heftKreis('E', true),
    tabAnzahl('E', [36, 40, 45], 4), gesamtWinkel('E'), diagrammWahl('E'), falscheGesamt('E'), diagrammWahl('E'), heftKreis('E', true)]);
}
