// Aufgaben zum Abstecher 7.1.X4 „Girokonto“ (Lernziel B1) nach ADR 0015 und ADR 0043.
// Grilling mit Nils (2026-11-24, „ein Nebenthema, aber ja“): Jede Aufgabe zeigt einen Kontoauszug als Tabelle.
// F eine Buchung, G mehrere Buchungen, M eine fehlende Buchung und Soll und Haben, E Fehler im Auszug und Kommabeträge.
// Das Wort „Betrag“ gehört in diesem Kapitel zum Abstand zur Null (ab M). Hier heißt es deshalb „Buchung“ und „Euro“.
// Typische Fehler: Schulden und Guthaben zusammenzählen, das Vorzeichen des Kontostands vergessen, eine Buchung auslassen.

import { sechs, auswahl, luecken, Z } from '../werkzeug.mjs';
import { Q, D, plus, minus, mal, neg, zt, dt, opt, zz, wahl, mische, antwort, lk, lkd, konto, H, urteil, FREI, kind, summe } from './7-1-rational.mjs';

const B1 = '7.1.X4-B1';
const KOPF = ['Buchung', 'Euro'];
const AUS = ['Kino', 'Schuhe', 'Handy', 'Sportverein', 'Geschenk', 'Bücher', 'Fahrkarte', 'Musikschule'];
const EIN = ['Taschengeld', 'Geburtstagsgeld', 'Zeitungen austragen', 'Flohmarkt', 'Babysitten'];
const AUS_M = ['Kleidung', 'Strom', 'Versicherung', 'Einkauf', 'Tanken', 'Handy', 'Möbel', 'Reparatur'];
const EIN_M = ['Kindergeld', 'Rückzahlung', 'Verkauf', 'Nebenjob'];
const geld = (x) => dt(x, 2);

export function girokonto() {
  const hF = (beispiel, schritt) => H(0, 'Kommt Geld dazu, rechnest du plus. Geht Geld weg, rechnest du minus.', beispiel, schritt);
  sechs(B1, 'F', [
    () => { const alt = zz(5, 30), b = zz(alt + 3, alt + 40), neu = alt - b;
      return antwort(Z('Die Tabelle zeigt ein Konto.', 'Es geht Geld weg.', 'Wie hoch ist der neue Kontostand?'), neu, 'd', [[-neu, 'vorzeichen-vergessen'], [alt + b, 'betraege-addiert']],
        hF('20 − 35 = −15. Der neue Kontostand ist −15 €.', 'Die Buchung hat ein Minus: Das Geld geht weg. Ziehe es vom alten Kontostand ab.'), [`${alt} − ${b} = ${zt(neu)}`], { einheit: '€', daten: konto(KOPF, [['alter Kontostand', alt], [wahl(AUS), zt(-b)]]) }); },
    () => { const alt = -zz(5, 40), b = zz(-alt + 3, -alt + 40), neu = alt + b;
      return antwort(Z('Die Tabelle zeigt ein Konto.', 'Es kommt Geld dazu.', 'Wie hoch ist der neue Kontostand?'), neu, 'd', [[-neu, 'vorzeichen-vergessen'], [-alt + b, 'betraege-addiert'], [alt - b, 'richtung-vertauscht']],
        hF('−15 + 40 = 25. Der neue Kontostand ist 25 €.', 'Der alte Kontostand ist negativ: Das sind Schulden. Zähle das neue Geld dazu.'), [`${zt(alt)} + ${b} = ${neu}`], { einheit: '€', daten: konto(KOPF, [['alter Kontostand', zt(alt)], [wahl(EIN), b]]) }); },
    () => { const alt = -zz(5, 40), b = zz(5, 40), neu = alt - b;
      return antwort(Z('Die Tabelle zeigt ein Konto mit Schulden.', 'Es geht noch mehr Geld weg.', 'Wie hoch ist der neue Kontostand?'), neu, 'd', [[-neu, 'vorzeichen-vergessen'], [alt + b, 'richtung-vertauscht'], [-alt + b, 'vorzeichen-vergessen']],
        hF('−15 − 20 = −35. Der neue Kontostand ist −35 €.', 'Es sind schon Schulden da. Mit der Buchung werden die Schulden noch größer.'), [`${zt(alt)} − ${b} = ${zt(neu)}`], { einheit: '€', daten: konto(KOPF, [['alter Kontostand', zt(alt)], [wahl(AUS), zt(-b)]]) }); },
    () => { const n = zz(5, 60);
      return auswahl(Z('Die Tabelle zeigt ein Konto.', 'Was bedeutet der Kontostand?'), [opt(`${n} € Schulden`, true), opt(`${n} € Guthaben`, false, 'vorzeichen-vergessen'), opt('kein Geld und keine Schulden', false, 'vorzeichen-vergessen')],
        H(0, 'Ein negativer Kontostand bedeutet Schulden. Ein positiver Kontostand ist ein Guthaben.', '−12 € heißt: 12 € Schulden bei der Bank.', 'Schau auf das Vorzeichen. Steht ein Minus davor?'), { daten: konto(KOPF, [['Kontostand', zt(-n)]]), nachweis: [FREI('Ein negativer Kontostand bedeutet Schulden in Höhe der Zahl ohne Vorzeichen.')] }); },
    () => { const alt = zz(5, 30), neu = -zz(5, 30), b = neu - alt;
      return antwort(Z('Die Tabelle zeigt ein Konto.', 'Eine Buchung fehlt.', 'Welche Zahl gehört an die Stelle mit dem Fragezeichen?'), b, 'd', [[-b, 'vorzeichen-vergessen'], [neu + alt, 'abstand-ueber-null'], [-(neu + alt) || null, 'abstand-ueber-null']].filter(([w]) => w),
        hF('Von 15 € auf −10 €: Es gehen 25 € weg. Die Buchung ist −25.', 'Zähle vom alten Kontostand bis zur Null. Zähle dann weiter bis zum neuen Kontostand.'), [`${zt(neu)} − ${alt} = ${zt(b)}`], { einheit: '€', daten: konto(KOPF, [['alter Kontostand', alt], ['Buchung', '?'], ['neuer Kontostand', zt(neu)]]) }); },
    () => { const n = zz(5, 60), name = kind();
      return antwort(Z(`Die Tabelle zeigt das Konto von ${name}.`, 'Der Kontostand soll 0 € sein.', 'Wie viel Euro müssen dazukommen?'), n, 'd', [[-n, 'vorzeichen-vergessen'], [2 * n, 'betrag-gegenzahl']],
        H(0, 'Bei 0 € gibt es keine Schulden mehr.', 'Bei −8 € fehlen 8 € bis zur Null.', 'Die Schulden müssen genau ausgeglichen werden. Wie groß sind sie?'), [`0 − (${zt(-n)}) = ${n}`], { einheit: '€', daten: konto(KOPF, [['Kontostand', zt(-n)]]) }); },
  ]);

  // Mehrere Buchungen: [Name, Zahl] in Euro. Liefert die Zeilen des Auszugs und die Rechnung.
  const buchungen = (alt, liste) => ({ zeilen: [['alter Kontostand', zt(alt)], ...liste.map(([n, b]) => [n, zt(b)])], rechnung: [zt(alt), ...liste.map(([, b]) => `${b < 0 ? '−' : '+'} ${Math.abs(b)}`)].join(' '), neu: alt + liste.reduce((s, [, b]) => s + b, 0) });
  const drei = () => { const [a1, a2] = mische(AUS), e = wahl(EIN); return mische([[`Abbuchung ${a1}`, -5 * zz(4, 18)], [`Gutschrift ${e}`, 5 * zz(4, 24)], [`Abbuchung ${a2}`, -5 * zz(3, 15)]]); };
  const hG = H(1, 'Eine Gutschrift rechnest du plus, eine Abbuchung rechnest du minus.', '20 − 45 + 30 − 15 = −10. Der neue Kontostand ist −10 €.', 'Rechne eine Buchung nach der anderen. Schreibe nach jeder Zeile den Kontostand auf.');
  sechs(B1, 'G', [
    () => { const alt = 5 * zz(2, 12), k = buchungen(alt, drei());
      if (k.neu >= 0) return null;
      return antwort(Z('Der Kontoauszug zeigt drei Buchungen.', 'Wie hoch ist der neue Kontostand?'), k.neu, 'd', [[-k.neu, 'vorzeichen-vergessen'], [alt + k.zeilen.slice(1).reduce((s, z) => s + Math.abs(Number(z[1].replace('−', '-'))), 0), 'betraege-addiert']], hG, [`${k.rechnung} = ${zt(k.neu)}`], { einheit: '€', daten: konto(KOPF, k.zeilen) }); },
    () => { const alt = -5 * zz(2, 12), liste = drei(), s = [alt + liste[0][1], alt + liste[0][1] + liste[1][1], alt + liste[0][1] + liste[1][1] + liste[2][1]];
      if (s.some((x) => x === 0) || new Set(s).size < 3) return null;
      const f = (x, b) => [[x - 2 * b, 'richtung-vertauscht'], [-x, 'vorzeichen-vergessen']];
      return luecken(Z('Der Kontoauszug zeigt drei Buchungen.', 'Schreibe nach jeder Buchung den Kontostand auf.', 'Nach der ersten Buchung: {{a}} €', 'Nach der zweiten Buchung: {{b}} €', 'Nach der dritten Buchung: {{c}} €'), { a: lk(s[0], f(s[0], liste[0][1])), b: lk(s[1], f(s[1], liste[1][1])), c: lk(s[2], f(s[2], liste[2][1])) }, hG,
        { daten: konto(KOPF, buchungen(alt, liste).zeilen), nachweis: liste.map(([, b], i) => `${zt(i ? s[i - 1] : alt)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${zt(s[i])}`) }); },
    () => { const liste = drei(), z = liste.reduce((s, [, b]) => s + b, 0);
      if (z >= 0) return null;
      return antwort(Z('Der Kontoauszug zeigt drei Buchungen.', 'Um wie viel Euro ändert sich der Kontostand insgesamt?', 'Schreibe das Ergebnis mit Vorzeichen.'), z, 'd', [[-z, 'vorzeichen-vergessen'], [liste.reduce((s, [, b]) => s + Math.abs(b), 0), 'betraege-addiert']],
        H(1, 'Fasse alle Buchungen zusammen: Gutschriften plus, Abbuchungen minus.', '−45 + 30 − 15 = −30. Der Kontostand sinkt um 30 €.', 'Addiere erst alle Abbuchungen. Verrechne sie dann mit der Gutschrift.'), [`${liste.map(([, b], i) => (i ? `${b < 0 ? '−' : '+'} ${Math.abs(b)}` : zt(b))).join(' ')} = ${zt(z)}`], { einheit: '€', daten: konto(KOPF, liste.map(([n, b]) => [n, zt(b)])) }); },
    () => { const alt = -5 * zz(4, 15), g = 10 * zz(6, 15), ab = 5 * zz(8, 22), neu = alt + g - ab;
      if (neu === 0 || neu === alt) return null;
      return antwort(Z('Der Kontoauszug zeigt eine Gutschrift und eine Abbuchung.', 'Wie hoch ist der neue Kontostand?'), neu, 'd', [[-neu, 'vorzeichen-vergessen'], [alt - g + ab, 'richtung-vertauscht'], [-alt + g - ab, 'vorzeichen-vergessen']], hG, [`${zt(alt)} + ${g} − ${ab} = ${zt(neu)}`],
        { einheit: '€', daten: konto(KOPF, [['alter Kontostand', zt(alt)], [`Gutschrift ${wahl(EIN)}`, g], [`Abbuchung ${wahl(AUS)}`, zt(-ab)]]) }); },
    () => { const g = 5 * zz(6, 16), ab = 5 * zz(10, 24), neu = -5 * zz(3, 15), alt = neu + ab - g;
      if (alt === 0) return null;
      return antwort(Z('Im Kontoauszug fehlt der alte Kontostand.', 'Wie hoch war er?'), alt, 'd', [[neu - ab + g, 'richtung-vertauscht'], [-alt, 'vorzeichen-vergessen'], [neu + ab, 'sach-schritt-vergessen']],
        H(1, 'Rechne rückwärts: Mache jede Buchung rückgängig.', 'Neuer Kontostand −45 €, vorher Abbuchung 80 € und Gutschrift 50 €: −45 + 80 − 50 = −15.', 'Starte beim neuen Kontostand. Zähle die Abbuchung wieder dazu und ziehe die Gutschrift wieder ab.'), [`${zt(neu)} + ${ab} − ${g} = ${zt(alt)}`],
        { einheit: '€', daten: konto(KOPF, [['alter Kontostand', '?'], [`Gutschrift ${wahl(EIN)}`, g], [`Abbuchung ${wahl(AUS)}`, zt(-ab)], ['neuer Kontostand', zt(neu)]]) }); },
    () => { const alt = 5 * zz(2, 8), [a1, a2] = mische(AUS), b1 = 5 * zz(8, 16), b2 = 5 * zz(6, 14), st = alt - b1 - b2, ziel = 50, z = ziel - st;
      return antwort(Z('Der Kontoauszug zeigt zwei Abbuchungen.', `Danach soll der Kontostand wieder ${ziel} € sein.`, 'Wie viel Euro müssen dazukommen?'), z, 'd', [[-st, 'sach-schritt-vergessen'], [ziel + st, 'abstand-ueber-null'], [st, 'sach-frage-verfehlt']],
        H(1, 'Berechne erst den Kontostand nach den Abbuchungen. Überlege dann, wie viel bis zum Ziel fehlt.', 'Kontostand −65 €, Ziel 50 €: Es fehlen 65 € bis zur Null und dann noch 50 €.', 'Rechne erst die beiden Abbuchungen. Zähle dann vom neuen Kontostand bis zum Ziel.'), [`${alt} − ${b1} − ${b2} = ${zt(st)}`, `${ziel} − (${zt(st)}) = ${z}`],
        { einheit: '€', daten: konto(KOPF, [['alter Kontostand', alt], [`Abbuchung ${a1}`, zt(-b1)], [`Abbuchung ${a2}`, zt(-b2)]]) }); },
  ]);

  const SH = ['Buchung', 'Euro', 'S/H'];
  sechs(B1, 'M', [
    () => { const alt = 10 * zz(12, 45), miete = 10 * zz(48, 75), lohn = 10 * zz(95, 180), strom = 5 * zz(12, 25), neu = alt - miete + lohn - strom;
      return antwort('Auf dem Kontoauszug steht S für Soll (Minus) und H für Haben (Plus). Berechne den neuen Kontostand.', neu, 'd', [[alt + miete + lohn + strom, 'betraege-addiert'], [-neu, 'vorzeichen-vergessen'], [alt - miete - lohn - strom, 'richtung-vertauscht']],
        H(2, 'Soll heißt: Geld geht ab. Haben heißt: Geld kommt dazu.', 'Schreibe jede Buchung mit ihrem Vorzeichen auf: S wird Minus, H wird Plus. Rechne dann der Reihe nach.'), [`${alt} − ${miete} + ${lohn} − ${strom} = ${zt(neu)}`],
        { einheit: '€', daten: konto(SH, [['alter Kontostand', alt, 'H'], ['Miete', miete, 'S'], ['Lohn', lohn, 'H'], ['Strom', strom, 'S']]) }); },
    () => { const alt = -5 * zz(12, 60), b1 = 5 * zz(20, 90), neu = 5 * zz(-40, 60), b3 = -5 * zz(8, 40), x = neu - alt - b1 - b3;
      if (x === 0 || neu === 0) return null;
      return antwort('Im Kontoauszug fehlt eine Buchung. Wie hoch ist sie? Schreibe eine Abbuchung mit Minus.', x, 'd', [[-x, 'vorzeichen-vergessen'], [neu - alt, 'sach-schritt-vergessen'], [neu + alt - b1 - b3, 'minus-minus-uebersehen']],
        H(2, 'Berechne erst, wie hoch der Kontostand ohne die fehlende Buchung wäre.', 'Vergleiche diesen Stand mit dem neuen Kontostand. Der Unterschied ist die fehlende Buchung.'), [`${zt(neu)} − (${zt(alt)}) − ${b1} − (${zt(b3)}) = ${zt(x)}`],
        { einheit: '€', daten: konto(KOPF, [['alter Kontostand', zt(alt)], [`Gutschrift ${wahl(EIN_M)}`, b1], ['fehlende Buchung', '?'], [`Abbuchung ${wahl(AUS_M)}`, zt(b3)], ['neuer Kontostand', zt(neu)]]) }); },
    () => { const rahmen = 100 * zz(3, 9), stand = -10 * zz(12, 28), z = stand + rahmen;
      return antwort(`Ein Konto darf um höchstens ${rahmen} € überzogen werden. Der Kontoauszug zeigt den Kontostand. Wie viel Euro können noch abgehoben werden?`, z, 'd', [[rahmen - stand, 'minus-minus-uebersehen'], [-stand, 'sach-frage-verfehlt'], [rahmen, 'sach-schritt-vergessen']],
        H(2, 'Der tiefste erlaubte Kontostand ist negativ. Gesucht ist der Abstand bis dorthin.', 'Schreibe die Grenze als negative Zahl. Berechne den Unterschied zwischen Kontostand und Grenze.'), [`${zt(stand)} − (−${rahmen}) = ${z}`], { einheit: '€', daten: konto(KOPF, [['Kontostand', zt(stand)]]) }); },
    () => { const alt = -10 * zz(15, 60), [a1, a2] = mische(AUS_M), e = wahl(EIN_M), bs = [[`Gutschrift ${e}`, 10 * zz(20, 90)], [`Abbuchung ${a1}`, -5 * zz(15, 70)], [`Abbuchung ${a2}`, -5 * zz(9, 40)], ['Gutschrift Lohn', 10 * zz(40, 120)]], k = buchungen(alt, bs);
      if (k.neu === 0) return null;
      return antwort('Berechne den neuen Kontostand.', k.neu, 'd', [[-k.neu, 'vorzeichen-vergessen'], [-alt + bs.reduce((s, [, b]) => s + b, 0), 'vorzeichen-vergessen']], H(2, 'Fasse erst alle Gutschriften und dann alle Abbuchungen zusammen.', 'Der alte Kontostand ist negativ. Er gehört zu den Zahlen mit Minus.'), [`${k.rechnung} = ${zt(k.neu)}`], { einheit: '€', daten: konto(KOPF, k.zeilen) }); },
    () => { const s1 = 5 * zz(15, 60), s2 = 5 * zz(9, 40), h1 = 10 * zz(20, 60), h2 = 5 * zz(5, 30), soll = s1 + s2, haben = h1 + h2, d = haben - soll;
      if (d === 0) return null;
      return luecken('Auf dem Kontoauszug steht S für Soll und H für Haben. Alle Buchungen im Soll ergeben zusammen {{a}} €. Alle Buchungen im Haben ergeben zusammen {{b}} €. Der Kontostand ändert sich insgesamt um {{c}} €.', { a: lk(soll), b: lk(haben), c: lk(d, [[-d, 'vorzeichen-vergessen'], [soll + haben, 'betraege-addiert']]) },
        H(2, 'Sortiere die Buchungen nach S und H. Soll zählt als Minus, Haben als Plus.', 'Addiere die Buchungen im Soll und die Buchungen im Haben getrennt. Ziehe dann die Soll-Summe von der Haben-Summe ab.'),
        { daten: konto(SH, mische([[wahl(AUS_M.slice(0, 4)), s1, 'S'], [wahl(AUS_M.slice(4)), s2, 'S'], ['Lohn', h1, 'H'], [wahl(EIN_M), h2, 'H']])), nachweis: [`${s1} + ${s2} = ${soll}`, `${h1} + ${h2} = ${haben}`, `${haben} − ${soll} = ${zt(d)}`] }); },
    () => { const ein = 10 * zz(9, 15), aus = 10 * zz(3, 6), n = zz(6, 14), stand = -n * (ein - aus);
      return antwort(`Der Kontoauszug zeigt den Kontostand. Jeden Monat gibt es eine Gutschrift von ${ein} € und eine Abbuchung von ${aus} €. Nach wie vielen Monaten ist das Konto ausgeglichen?`, n, 'd', [[-stand / ein, 'sach-schritt-vergessen'], [-n, 'vorzeichen-vergessen']].filter(([w]) => Number.isInteger(w)),
        H(2, 'Berechne erst, um wie viel Euro der Kontostand jeden Monat steigt.', 'Teile die Schulden durch den monatlichen Anstieg.'), [`${-stand} : (${ein} − ${aus}) = ${n}`], { daten: konto(KOPF, [['Kontostand', zt(stand)]]) }); },
  ]);

  const cent = (von, bis) => D(zz(von, bis) * 5, 2);
  sechs(B1, 'E', [
    () => { const alt = neg(cent(1200, 4800)), g = cent(4000, 9000), a1 = neg(cent(900, 2400)), a2 = neg(cent(500, 1900)), neu = summe([alt, g, a1, a2]);
      if (neu[1] === 1) return null;
      return antwort('Berechne den neuen Kontostand.', neu, 'd', [[neg(neu), 'vorzeichen-vergessen'], [summe([neg(alt), g, a1, a2]), 'vorzeichen-vergessen']], H(3, 'Fasse die Gutschrift und alle Zahlen mit Minus getrennt zusammen. Achte auf die Cent.'),
        [`${dt(alt)} + ${dt(g)} − ${dt(neg(a1))} − ${dt(neg(a2))} = ${dt(neu)}`], { einheit: '€', geld: true, daten: konto(KOPF, [['alter Kontostand', geld(alt)], [`Gutschrift ${wahl(EIN)}`, geld(g)], [`Abbuchung ${wahl(AUS.slice(0, 4))}`, geld(a1)], [`Abbuchung ${wahl(AUS.slice(4))}`, geld(a2)]]) }); },
    () => { const alt = cent(800, 3000), a1 = cent(1200, 3800), g = cent(400, 1500), neu = plus(minus(alt, a1), g), stimmt = wahl([true, false, false]), falsch = wahl([neg(neu), minus(minus(alt, a1), g)]);
      if (neu[0] >= 0 || neu[1] === 1) return null;
      const r = (x) => `${dt(alt)} − ${dt(a1)} + ${dt(g)} = ${dt(x)}`, beh = stimmt ? neu : falsch, andere = [neg(neu), minus(minus(alt, a1), g), plus(plus(alt, a1), g)].filter((x) => String(x) !== String(neu) && String(x) !== String(beh));
      return urteil('Im Kontoauszug hat die Bank den neuen Kontostand ausgerechnet. Stimmt er?', stimmt, r(beh), stimmt ? r(andere[0]) : r(neu), [r(andere[stimmt ? 1 : 0])], 'vorzeichen-vergessen', H(3, 'Rechne den Auszug Zeile für Zeile nach. Vergleiche auch das Vorzeichen.'),
        { daten: konto(KOPF, [['alter Kontostand', geld(alt)], [`Abbuchung ${wahl(AUS)}`, geld(neg(a1))], [`Gutschrift ${wahl(EIN)}`, geld(g)], ['neuer Kontostand', geld(beh)]]) }); },
    () => { const alt = neg(cent(600, 2600)), g = cent(3000, 7000), neu = cent(300, 2000), x = minus(minus(neu, alt), g);
      if (x[0] >= 0) return null;
      return antwort('Im Kontoauszug fehlt eine Buchung. Wie hoch ist sie? Schreibe eine Abbuchung mit Minus.', x, 'd', [[neg(x), 'vorzeichen-vergessen'], [minus(plus(neu, alt), g), 'minus-minus-uebersehen'], [minus(neu, alt), 'sach-schritt-vergessen']], H(3, 'Berechne den Kontostand ohne die fehlende Buchung. Der Unterschied zum neuen Kontostand ist die gesuchte Buchung.'),
        [`${dt(neu)} − (${dt(alt)}) − ${dt(g)} = ${dt(x)}`], { einheit: '€', geld: true, daten: konto(KOPF, [['alter Kontostand', geld(alt)], [`Gutschrift ${wahl(EIN)}`, geld(g)], ['fehlende Buchung', '?'], ['neuer Kontostand', geld(neu)]]) }); },
    () => { const alt = cent(400, 1600), bs = [neg(cent(700, 2200)), cent(500, 1800), neg(cent(600, 2000))], namen = [`Abbuchung ${AUS[zz(0, 3)]}`, `Gutschrift ${wahl(EIN)}`, `Abbuchung ${AUS[zz(4, 7)]}`], i = zz(0, 2);
      const st = [plus(alt, bs[0])]; st.push(plus(st[0], bs[1])); st.push(plus(st[1], bs[2]));
      const vor = i ? st[i - 1] : alt, gut = st[i], falsch = minus(vor, bs[i]);
      if (st.some((x) => x[0] === 0) || gut[1] === 1) return null;
      // Die Bank rechnet in einer Zeile in die falsche Richtung. Danach rechnet sie mit dem falschen Stand richtig weiter.
      const gezeigt = [...st]; let lauf = falsch; for (let j = i; j < 3; j++) { gezeigt[j] = lauf; if (j < 2) lauf = plus(lauf, bs[j + 1]); }
      return antwort('Der Kontoauszug nennt nach jeder Buchung den Kontostand. In einer Zeile hat sich die Bank verrechnet. Wie hoch ist der richtige Kontostand in dieser Zeile?', gut, 'd', [[falsch, 'richtung-vertauscht'], [neg(gut), 'vorzeichen-vergessen'], [st[2], 'sach-frage-verfehlt']],
        H(3, 'Rechne jede Zeile nach: Kontostand der Zeile davor plus oder minus die Buchung. Die erste Zeile, die nicht stimmt, ist die gesuchte.'), [`${dt(vor)} ${bs[i][0] < 0 ? '−' : '+'} ${dt(Q(Math.abs(bs[i][0]), bs[i][1]))} = ${dt(gut)}`],
        { einheit: '€', geld: true, daten: konto(['Buchung', 'Euro', 'Kontostand'], [['alter Kontostand', '', geld(alt)], ...bs.map((b, j) => [namen[j], geld(b), geld(gezeigt[j])])]) }); },
    () => { const alt = cent(3000, 6000), rate = cent(900, 1400), n = zz(5, 9), neu = minus(alt, mal(rate, n)), was = wahl(['Handy', 'Sportverein', 'Musikschule', 'Fahrkarte']);
      if (neu[0] >= 0) return null;
      return antwort(`Der Kontoauszug zeigt den Kontostand und eine Abbuchung. Die Abbuchung wiederholt sich jeden Monat. Wie hoch ist der Kontostand nach ${n} Monaten, wenn sonst nichts gebucht wird?`, neu, 'd', [[neg(neu), 'vorzeichen-vergessen'], [minus(alt, rate), 'sach-schritt-vergessen'], [plus(alt, mal(rate, n)), 'richtung-vertauscht']], H(3, 'Berechne zuerst, wie viel in allen Monaten zusammen abgebucht wird.'),
        [`${dt(alt)} − ${n} · ${dt(rate)} = ${dt(neu)}`], { einheit: '€', geld: true, daten: konto(KOPF, [['Kontostand', geld(alt)], [`Abbuchung ${was}`, geld(neg(rate))]]) }); },
    () => { const s1 = cent(1500, 4000), h1 = cent(5000, 12000), s2 = cent(800, 2500), neu = neg(cent(300, 1800)), alt = minus(plus(plus(neu, s1), s2), h1);
      if (alt[0] >= 0) return null;
      return antwort('Auf dem Kontoauszug steht S für Soll und H für Haben. Der alte Kontostand fehlt. Wie hoch war er? Schreibe einen Kontostand im Soll mit Minus.', alt, 'd', [[neg(alt), 'vorzeichen-vergessen'], [plus(minus(minus(neu, s1), s2), h1), 'richtung-vertauscht'], [minus(plus(plus(neg(neu), s1), s2), h1), 'vorzeichen-vergessen']], H(3, 'Rechne rückwärts: Mache jede Buchung rückgängig. Aus Soll wird dabei Plus, aus Haben wird Minus.'),
        [`${dt(neu)} + ${dt(s1)} + ${dt(s2)} − ${dt(h1)} = ${dt(alt)}`], { einheit: '€', geld: true, daten: konto(['Buchung', 'Euro', 'S/H'], [['alter Kontostand', '?', '?'], ['Miete', geld(s1), 'S'], ['Lohn', geld(h1), 'H'], ['Strom', geld(s2), 'S'], ['neuer Kontostand', geld(neg(neu)), 'S']]) }); },
  ]);
}
