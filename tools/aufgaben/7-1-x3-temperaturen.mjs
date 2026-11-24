// Aufgaben zum Abstecher 7.1.X3 „Celsius und Fahrenheit“ (Lernziel C1) nach ADR 0015 und ADR 0043.
// Nils (2026-11-24): „Wir befinden uns im metrischen System, Fahrenheit und Kelvin nur als Ausnahme für eine Umrechnung.“
// Deshalb dreht sich der Abstecher um Grad Celsius: ablesen, Änderungen, Temperaturunterschiede. Fahrenheit und Kelvin kommen
// nur in je einer Aufgabe auf M und auf E vor, immer mit der Formel dabei.
// Typische Fehler: den Unterschied über die Null hinweg als Differenz der Beträge rechnen, steigen und fallen verwechseln.

import { sechs, auswahl, luecken, Z } from '../werkzeug.mjs';
import { Q, D, plus, minus, mal, durch, neg, betrag, zt, dt, opt, zz, wahl, mische, antwort, lkd, thermo, H, AUSSAGEN, istGanz, summe } from './7-1-rational.mjs';

const C1 = '7.1.X3-C1';
const ORTE = ['Oslo', 'Kiruna', 'Zermatt', 'Moskau', 'Rom', 'Wien'];
const unterschied = (hoch, tief) => [[minus(betrag(hoch), betrag(tief)), 'abstand-ueber-null'], [minus(betrag(tief), betrag(hoch)), 'abstand-ueber-null'], [neg(minus(hoch, tief)), 'vorzeichen-vergessen']].filter(([w]) => w[0] !== 0);

export function temperaturen() {
  sechs(C1, 'F', [
    () => { const ws = mische([-zz(2, 9), zz(1, 4), zz(5, 9)]), orte = mische(ORTE).slice(0, 3), kalt = Math.min(...ws);
      return auswahl(Z('Die Thermometer zeigen die Temperatur in drei Orten.', 'Wo herrscht Frost?'), ws.map((w, i) => opt(orte[i], w === kalt, w === kalt ? undefined : 'vorzeichen-vergessen')),
        H(0, 'Frost herrscht bei Temperaturen unter 0 °C.', '−3 °C liegt unter null. Dort herrscht Frost.', 'Suche das Thermometer, bei dem die Säule unter der Null endet.'), { bild: thermo(-10, 10, 1, 5, ...ws.map((w, i) => [w, orte[i]])), nachweis: [{ art: 'thermowahl', was: 'kaeltestes' }] }); },
    () => { const a = -zz(2, 8), b = zz(2, 8), d = b - a;
      return antwort(Z('Die Thermometer zeigen die Temperatur morgens und mittags.', 'Um wie viel Grad ist die Temperatur gestiegen?'), d, 'd', unterschied(Q(b), Q(a)),
        H(0, 'Zähle die Grade von der unteren Säule bis zur oberen. Zähle über die Null hinweg.', 'Von −3 °C bis 4 °C sind es 7 Grad.', 'Zähle erst bis zur Null. Zähle dann weiter nach oben.'), [`${b} − (${zt(a)}) = ${d}`], { einheit: 'Grad', bild: thermo(-10, 10, 1, 5, [a, 'morgens'], [b, 'mittags']) }); },
    () => { const a = -zz(5, 9), k = zz(2, 4), z = a + k;
      return antwort(Z(`In der Nacht sind es ${zt(a)} °C.`, `Bis zum Morgen steigt die Temperatur um ${k} Grad.`, 'Wie kalt ist es am Morgen?'), z, 'd', [[a - k, 'richtung-vertauscht'], [-z, 'vorzeichen-vergessen'], [-a + k, 'vorzeichen-vergessen']],
        H(0, 'Steigt die Temperatur, geht die Säule nach oben.', 'Von −7 °C aus 3 Grad nach oben: −4 °C.', 'Zähle am Thermometer von der Säule aus nach oben. Es bleibt unter null.'), [`${zt(a)} + ${k} = ${zt(z)}`], { einheit: '°C', bild: thermo(-10, 10, 1, 5, [a, 'nachts']) }); },
    () => { const ws = mische([-zz(7, 9), -zz(4, 6), -zz(1, 3)]), tage = ['Montag', 'Dienstag', 'Mittwoch'], warm = Math.max(...ws);
      return auswahl(Z('Die Thermometer zeigen die Temperatur an drei Tagen.', 'An welchem Tag war es am wärmsten?'), ws.map((w, i) => opt(tage[i], w === warm, w === warm ? undefined : 'negativ-groesser')),
        H(0, 'Je weiter oben die Säule endet, desto wärmer ist es.', '−2 °C ist wärmer als −8 °C.', 'Suche das Thermometer mit der höchsten Säule. Die Zahl ohne Minus täuscht.'), { bild: thermo(-10, 10, 1, 5, ...ws.map((w, i) => [w, tage[i]])), nachweis: [{ art: 'thermowahl', was: 'waermstes' }] }); },
    () => { const a = zz(1, 6), b = -zz(2, 8), d = a - b;
      return antwort(Z('Die Thermometer zeigen die Temperatur abends und nachts.', 'Um wie viel Grad ist die Temperatur gefallen?'), d, 'd', unterschied(Q(a), Q(b)),
        H(0, 'Zähle die Grade von der oberen Säule bis zur unteren. Zähle über die Null hinweg.', 'Von 3 °C bis −5 °C sind es 8 Grad.', 'Zähle erst bis zur Null. Zähle dann weiter nach unten.'), [`${a} − (${zt(b)}) = ${d}`], { einheit: 'Grad', bild: thermo(-10, 10, 1, 5, [a, 'abends'], [b, 'nachts']) }); },
    () => { const a = -zz(15, 19), k = zz(20, 27), z = a + k;
      return antwort(Z(`Im Gefrierfach sind es ${zt(a)} °C.`, `Im Kühlschrank ist es ${k} Grad wärmer.`, 'Wie warm ist es im Kühlschrank?'), z, 'd', [[a - k, 'richtung-vertauscht'], [-z, 'vorzeichen-vergessen'], [-a + k, 'vorzeichen-vergessen']],
        H(0, 'Wärmer heißt: Die Säule steigt. Hier geht es über die Null hinweg.', 'Von −18 °C aus 25 Grad nach oben: erst 18 bis zur Null, dann noch 7.', 'Zähle erst bis zur Null. Zähle dann den Rest nach oben.'), [`${zt(a)} + ${k} = ${z}`], { einheit: '°C', bild: thermo(-20, 10, 1, 5, [a, 'Gefrierfach']) }); },
  ]);
  sechs(C1, 'G', [
    () => { const a = -zz(11, 19), b = zz(6, 19), [o1, o2] = wahl([['Kiruna', 'Rom'], ['Oslo', 'Wien'], ['Moskau', 'Rom']]), d = b - a;
      return antwort(Z(`Die Thermometer zeigen die Temperatur in ${o1} und in ${o2}.`, 'Wie groß ist der Temperaturunterschied?'), d, 'd', unterschied(Q(b), Q(a)),
        H(1, 'Der Temperaturunterschied geht über die Null hinweg.', 'Von −17 °C bis 14 °C: erst 17 Grad bis zur Null, dann noch 14 Grad. Das sind 31 Grad.', 'Lies beide Temperaturen ab. Zähle von der tiefen bis zur Null und dann weiter bis zur hohen.'), [`${b} − (${zt(a)}) = ${d}`], { einheit: 'Grad', bild: thermo(-20, 20, 1, 5, [a, o1], [b, o2]) }); },
    () => { const a = D(-zz(12, 58)), k = D(zz(35, 95)), z = plus(a, k);
      if (istGanz(a) || istGanz(k) || z[0] === 0) return null;
      return antwort(Z(`Morgens sind es ${dt(a)} °C.`, `Bis mittags steigt die Temperatur um ${dt(k)} Grad.`, 'Wie warm ist es mittags?'), z, 'd', [[minus(a, k), 'richtung-vertauscht'], [neg(z), 'vorzeichen-vergessen'], [plus(betrag(a), k), 'betraege-addiert']],
        H(1, 'Steigt die Temperatur, rechnest du plus.', '−2,5 + 6 = 3,5. Mittags sind es 3,5 °C.', 'Gehe erst bis zur Null. Gehe dann den Rest des Anstiegs weiter.'), [`${dt(a)} + ${dt(k)} = ${dt(z)}`], { einheit: '°C' }); },
    () => { const z = zz(1, 8), k = zz(z + 2, z + 12), a = z - k;
      return antwort(Z(`Die Temperatur ist um ${k} Grad gestiegen.`, 'Das Thermometer zeigt die Temperatur jetzt.', 'Wie kalt war es vorher?'), a, 'd', [[z + k, 'richtung-vertauscht'], [-a, 'vorzeichen-vergessen']],
        H(1, 'Rechne rückwärts: Vorher war es kälter.', 'Jetzt 4 °C, vorher 9 Grad weniger: 4 − 9 = −5.', 'Lies die Temperatur ab. Gehe den Anstieg wieder nach unten zurück.'), [`${z} − ${k} = ${zt(a)}`], { einheit: '°C', bild: thermo(-20, 20, 1, 5, [z, 'jetzt']) }); },
    () => { const t = D(-zz(25, 95)), h = D(zz(15, 85)), d = minus(h, t);
      if (istGanz(t) || istGanz(h)) return null;
      return antwort(Z(`Der tiefste Wert des Tages war ${dt(t)} °C.`, `Der höchste Wert war ${dt(h)} °C.`, 'Wie groß ist der Temperaturunterschied?'), d, 'd', unterschied(h, t),
        H(1, 'Der Temperaturunterschied geht über die Null hinweg.', 'Von −2,5 °C bis 3 °C: erst 2,5 Grad bis zur Null, dann noch 3 Grad. Das sind 5,5 Grad.', 'Addiere die Abstände der beiden Temperaturen zur Null.'), [`${dt(h)} − (${dt(t)}) = ${dt(d)}`], { einheit: 'Grad' }); },
    () => { const a = -zz(2, 8), auf = zz(6, 14), ab = zz(8, 18), m = a + auf, n = m - ab;
      if (m <= 0 || n >= 0 || n < -20) return null;
      return luecken(Z(`Um 6 Uhr sind es ${zt(a)} °C.`, `Bis 12 Uhr steigt die Temperatur um ${auf} Grad.`, 'Um 12 Uhr sind es {{a}} °C.', `Bis 22 Uhr fällt sie um ${ab} Grad.`, 'Um 22 Uhr sind es {{b}} °C.'), { a: lkd(Q(m), [[Q(a - auf), 'richtung-vertauscht'], [Q(-a + auf), 'vorzeichen-vergessen']]), b: lkd(Q(n), [[Q(m + ab), 'richtung-vertauscht'], [Q(-n), 'vorzeichen-vergessen']]) },
        H(1, 'Steigen heißt plus, fallen heißt minus. Rechne einen Schritt nach dem anderen.', '−4 + 9 = 5 und 5 − 12 = −7.', 'Rechne erst bis 12 Uhr. Rechne mit diesem Ergebnis weiter bis 22 Uhr.'), { bild: thermo(-20, 20, 1, 5, [a, '6 Uhr']), nachweis: [`${zt(a)} + ${auf} = ${m}`, `${m} − ${ab} = ${zt(n)}`] }); },
    () => { const a = -2 * zz(2, 6), b = 2 * zz(2, 9), m = (a + b) / 2;
      if (m === 0) return null;
      return antwort(Z(`Morgens sind es ${zt(a)} °C, mittags sind es ${b} °C.`, 'Die Temperatur steigt gleichmäßig.', 'Welche Temperatur ist nach der halben Zeit erreicht?'), m, 'd', [[(b - a) / 2, 'abstand-ueber-null'], [-m, 'vorzeichen-vergessen'], [a + b, 'sach-schritt-vergessen']],
        H(1, 'Nach der halben Zeit ist die Temperatur um den halben Unterschied gestiegen.', 'Von −6 °C bis 8 °C sind es 14 Grad. Die Hälfte ist 7. −6 + 7 = 1.', 'Berechne den Temperaturunterschied. Addiere die Hälfte davon zur Temperatur am Morgen.'), [`(${zt(a)} + ${b}) : 2 = ${zt(m)}`], { einheit: '°C' }); },
  ]);
  sechs(C1, 'M', [
    () => { const t = D(-zz(105, 295)), h = D(zz(42, 188)), d = minus(h, t);
      if (istGanz(t) || istGanz(h)) return null;
      return antwort(`In einer Winternacht sinkt die Temperatur auf ${dt(t)} °C. Am Mittag sind es ${dt(h)} °C. Wie groß ist der Temperaturunterschied?`, d, 'd', unterschied(h, t), H(2, 'Der Unterschied ist: hohe Temperatur minus tiefe Temperatur.', 'Eine negative Zahl subtrahieren heißt, ihre Gegenzahl zu addieren.'), [`${dt(h)} − (${dt(t)}) = ${dt(d)}`], { einheit: 'Grad' }); },
    () => { const c = -5 * zz(1, 7), f = (c * 9) / 5 + 32;
      return antwort(`In den USA misst man Temperaturen in Grad Fahrenheit. Die Formel für die Umrechnung ist: °F = °C · 1,8 + 32. Wie viel Grad Fahrenheit sind ${zt(c)} °C?`, f, 'd', [[(c + 32) * 1.8, 'punkt-vor-strich'], [-c * 1.8 + 32, 'vorzeichen-vergessen'], [c * 1.8 - 32, 'richtung-vertauscht']].filter(([w]) => Number.isInteger(w)),
        H(2, 'Setze die Temperatur in die Formel ein. Es gilt Punkt vor Strich.', 'Multipliziere zuerst mit 1,8. Das Produkt ist negativ. Addiere dann 32.'), [`${zt(c)} · 1,8 + 32 = ${zt(f)}`], { einheit: '°F' }); },
    () => { const st = wahl([8, 10, 12]), pro = D(wahl([5, 15, 25])), a = D(zz(15, 65)), z = minus(a, mal(pro, st));
      if (z[0] >= 0 || istGanz(a)) return null;
      return antwort(`Um 18 Uhr sind es ${dt(a)} °C. In den nächsten ${st} Stunden fällt die Temperatur gleichmäßig auf ${dt(z)} °C. Um wie viel Grad fällt sie pro Stunde?`, pro, 'd', [[durch(minus(a, betrag(z)), st), 'abstand-ueber-null'], [minus(a, z), 'sach-schritt-vergessen']],
        H(2, 'Berechne zuerst den ganzen Temperaturunterschied. Verteile ihn dann auf die Stunden.', 'Der Unterschied geht über die Null hinweg. Teile ihn durch die Anzahl der Stunden.'), [`(${dt(a)} − (${dt(z)})) : ${st} = ${dt(pro)}`], { einheit: 'Grad' }); },
    () => { const c = -zz(15, 95), kel = c + 273;
      return antwort(`In der Wissenschaft misst man Temperaturen in Kelvin. Die Formel für die Umrechnung ist: K = °C + 273. Wie viel Kelvin sind ${zt(c)} °C?`, kel, 'd', [[273 - c, 'vorzeichen-vergessen'], [c - 273, 'richtung-vertauscht']],
        H(2, 'Setze die Temperatur in die Formel ein.', 'Zu einer negativen Zahl wird 273 addiert. Das Ergebnis ist kleiner als 273.'), [`${zt(c)} + 273 = ${kel}`], { einheit: 'K' }); },
    () => { const auf = D(zz(32, 78)), ab = D(zz(81, 128)), z = D(-zz(12, 48)), a = plus(minus(z, auf), ab);
      if ([auf, ab, z].some(istGanz)) return null;
      return antwort(`Die Temperatur steigt erst um ${dt(auf)} Grad und fällt dann um ${dt(ab)} Grad. Danach sind es ${dt(z)} °C. Wie warm war es am Anfang?`, a, 'd', [[minus(plus(z, auf), ab), 'richtung-vertauscht'], [plus(z, ab), 'sach-schritt-vergessen'], [neg(a), 'vorzeichen-vergessen']],
        H(2, 'Rechne rückwärts: Mache erst das Fallen rückgängig, dann das Steigen.', 'Addiere zur Endtemperatur, was gefallen ist. Subtrahiere dann, was gestiegen ist.'), [`${dt(z)} + ${dt(ab)} − ${dt(auf)} = ${dt(a)}`], { einheit: '°C' }); },
    () => { const [o1, o2] = mische(ORTE).slice(0, 2), t1 = D(zz(12, 58)), n1 = D(-zz(21, 88)), t2 = D(-zz(5, 35)), n2 = D(-zz(95, 168));
      if ([t1, n1, t2, n2].some(istGanz)) return null;
      const d1 = minus(t1, n1), d2 = minus(t2, n2);
      return luecken(`${o1}: am Tag ${dt(t1)} °C, in der Nacht ${dt(n1)} °C.\n${o2}: am Tag ${dt(t2)} °C, in der Nacht ${dt(n2)} °C.\nTemperaturunterschied in ${o1}: {{a}} Grad\nTemperaturunterschied in ${o2}: {{b}} Grad`, { a: lkd(d1, [[minus(t1, betrag(n1)), 'abstand-ueber-null'], [plus(t1, n1), 'minus-minus-uebersehen']]), b: lkd(d2, [[plus(betrag(t2), betrag(n2)), 'betraege-addiert'], [plus(t2, n2), 'minus-minus-uebersehen']]) },
        H(2, 'Temperaturunterschied: höhere Temperatur minus tiefere Temperatur.', 'Sind beide Temperaturen negativ, liegt keine Null dazwischen. Dann subtrahierst du die Beträge.'), { nachweis: [`${dt(t1)} − (${dt(n1)}) = ${dt(d1)}`, `${dt(t2)} − (${dt(n2)}) = ${dt(d2)}`] }); },
  ]);
  sechs(C1, 'E', [
    () => antwort('Auf dem Mond kann es am Tag 127 °C heiß und in der Nacht −173 °C kalt werden. Wie groß ist der Temperaturunterschied?', 300, 'd', [[46, 'abstand-ueber-null'], [-300, 'vorzeichen-vergessen'], [-46, 'abstand-ueber-null']],
      H(3, 'Der Unterschied geht über die Null hinweg. Die Beträge addieren sich.'), ['127 − (−173) = 300'], { einheit: 'Grad' }),
    () => { const c = -5 * zz(2, 8), f = (c * 9) / 5 + 32, ort = wahl(['Chicago', 'Boston', 'Denver', 'Detroit']);
      return antwort(`Die Formel für die Umrechnung in Grad Fahrenheit ist: °F = °C · 1,8 + 32. In ${ort} sind es ${zt(f)} °F. Wie viel Grad Celsius sind das?`, c, 'd', [[-c, 'vorzeichen-division'], [Math.round((f / 1.8 - 32) * 100) / 100, 'punkt-vor-strich']].filter(([w]) => Number.isInteger(w)),
        H(3, 'Rechne rückwärts: erst 32 subtrahieren, dann durch 1,8 dividieren.'), [`(${zt(f)} − 32) : 1,8 = ${zt(c)}`], { einheit: '°C' }); },
    () => antwort('Die Formel für die Umrechnung in Kelvin ist: K = °C + 273. Stickstoff wird bei 77 K flüssig. Wie viel Grad Celsius sind das?', -196, 'd', [[196, 'vorzeichen-vergessen'], [350, 'richtung-vertauscht']],
      H(3, 'Stelle die Formel um: Grad Celsius sind Kelvin minus 273.'), ['77 − 273 = −196'], { einheit: '°C' }),
    () => { const falsche = mische([-32, 0, 40, 32]).slice(0, 3);
      return auswahl('Die Formel für die Umrechnung in Grad Fahrenheit ist: °F = °C · 1,8 + 32. Bei einer einzigen Temperatur zeigen beide Skalen dieselbe Zahl. Welche Rechnung stimmt?', [opt('(−40) · 1,8 + 32 = −40', true), ...falsche.map((x) => opt(`${x < 0 ? `(${zt(x)})` : x} · 1,8 + 32 = ${zt(x)}`, false, x === 40 ? 'vorzeichen-vergessen' : 'punkt-vor-strich'))],
        H(3, 'Setze jede Temperatur in die Formel ein und rechne nach. Es gilt Punkt vor Strich.'), { nachweis: [AUSSAGEN] }); },
    () => { const boden = D(zz(85, 185)), hoehe = 1000 * zz(2, 5), z = minus(boden, mal(D(65, 2), hoehe / 100));
      if (z[0] >= 0 || istGanz(boden)) return null;
      return antwort(`Ein Wetterballon steigt auf. Je 100 m Höhe fällt die Temperatur um 0,65 Grad. Am Boden sind es ${dt(boden)} °C. Wie kalt ist es in ${hoehe} m Höhe?`, z, 'd', [[plus(boden, mal(D(65, 2), hoehe / 100)), 'richtung-vertauscht'], [neg(z), 'vorzeichen-vergessen'], [minus(boden, D(65, 2)), 'sach-schritt-vergessen']],
        H(3, 'Berechne zuerst, wie oft 100 m in die Höhe passen. So oft fällt die Temperatur um 0,65 Grad.'), [`${dt(boden)} − ${hoehe} : 100 · 0,65 = ${dt(z)}`], { einheit: '°C' }); },
    () => { const n = 5, m = D(-zz(12, 38)), ws = [D(-zz(31, 68)), D(-zz(15, 45)), D(zz(4, 18)), D(-zz(5, 25))], letzte = minus(mal(m, n), summe(ws));
      if (istGanz(letzte) || Math.abs(letzte[0] / letzte[1]) > 9 || [m, ...ws].some(istGanz)) return null;
      return antwort(`Die Durchschnittstemperatur von ${n} Tagen ist ${dt(m)} °C. An 4 Tagen wurden ${ws.map((x) => `${dt(x)} °C`).join('; ')} gemessen. Wie warm war es am fünften Tag?`, letzte, 'd', [[neg(letzte), 'vorzeichen-vergessen'], [minus(m, summe(ws)), 'sach-schritt-vergessen'], [durch(summe(ws), 4), 'sach-frage-verfehlt']],
        H(3, 'Die Summe aller Temperaturen ist Durchschnitt mal Anzahl der Tage. Subtrahiere davon die vier bekannten Werte.'), [`${n} · (${dt(m)}) − (${dt(ws[0])}) − (${dt(ws[1])}) − ${dt(ws[2])} − (${dt(ws[3])}) = ${dt(letzte)}`], { einheit: '°C' }); },
  ]);
}
