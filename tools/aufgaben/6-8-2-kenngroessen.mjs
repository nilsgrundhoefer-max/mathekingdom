// Aufgaben zu 6.8.2 „Daten mithilfe von Kenngrößen auswerten“ (Lernziele K1, K2) nach ADR 0058.
// K1: Minimum, Maximum, Spannweite. F ganze Zahlen, G Zehntel (Weitsprung, Lauf), M vergleicht Gruppen und rechnet rückwärts, E begründet.
// K2: Mittelwert und Zentralwert. F nur Mittelwert mit ganzen Zahlen, der aufgeht. G eine Stelle nach dem Komma, Zentralwert bei ungerader Anzahl.
// M Zentralwert bei gerader Anzahl, neuer Wert, auf zwei Stellen gerundet, Heftaufgaben. E rückwärts, Ausreißer, Datensätze erfinden.

import { zz, wahl, mische, Z, opt, auswahl, kind, sechs, H, FREI, zahl, luecken, datensatz, summe, sortiert, zentral, mittel, dz, messung, namenFuer, werte, wt, wv, tab, ME, KENN, URTEIL, WERT } from './6-8-daten.mjs';

const K1 = '6.8.2-K1', K2 = '6.8.2-K2';
const GANZ = ['ballwurf', 'bogen', 'temperatur', 'taschengeld', 'groesse'], ZEHNTEL = ['weitsprung', 'lauf'];
const TW = (m, l) => l.map((v) => wt(m, v));
// Wert einer Messung als Lösung: in Zehnteln gespeichert, Lösung als Zahl der Messung.
const L = (m, v) => wv(m, v);
const st = (m) => (m.stellen ? 2 : 0);

export function kenngroessen6() {
  // ================= K1: Minimum, Maximum, Spannweite =================
  const minMax = (n, namen, anzahl, mitSpann = false) => () => { const m = messung(...namen), l = werte(m, anzahl), nm = namenFuer(m, anzahl), mx = Math.max(...l), mn = Math.min(...l);
    const w = { a: [L(m, mn), [[L(m, l[0]), 'liste-verzaehlt'], [L(m, mx), 'extrem-verwechselt']], st(m)], b: [L(m, mx), [[L(m, mn), 'extrem-verwechselt']], st(m)] };
    if (mitSpann) w.c = [L(m, mx - mn), [[L(m, mx), 'spannweite-groesster-wert'], [L(m, mx + mn), 'unterschied-addiert']], st(m)];
    return luecken(Z(m.satz, mitSpann ? 'Bestimme Minimum, Maximum und Spannweite.' : 'Bestimme Minimum und Maximum.', `Minimum: {{a}} ${m.einheit}`, `Maximum: {{b}} ${m.einheit}`, mitSpann ? `Spannweite: {{c}} ${m.einheit}` : null), w,
      H(n, 'Das Minimum ist der kleinste Wert. Das Maximum ist der größte Wert.', 'Bei 4, 9 und 2 ist das Minimum 2 und das Maximum 9.', 'Gehe die Tabelle von oben nach unten durch.'), { daten: tab(m, nm, l), nachweis: [KENN('minimum', TW(m, l), wt(m, mn), { luecke: 'a' }), KENN('maximum', TW(m, l), wt(m, mx), { luecke: 'b' }), ...(mitSpann ? [KENN('spannweite', TW(m, l), wt(m, mx - mn), { luecke: 'c' })] : [])] }); };
  const spannweite = (n, namen, anzahl) => () => { const m = messung(...namen), l = werte(m, anzahl), nm = namenFuer(m, anzahl), mx = Math.max(...l), mn = Math.min(...l);
    return zahl(Z(m.satz, 'Bestimme die Spannweite.'), L(m, mx - mn), m.einheit, [[L(m, mx), 'spannweite-groesster-wert'], [L(m, mx + mn), 'unterschied-addiert'], [L(m, l[0] - l.at(-1)), 'extrem-verwechselt']],
      H(n, 'Spannweite = Maximum − Minimum.', 'Bei 4, 9 und 2: 9 − 2 = 7.', `Suche zuerst den größten und den kleinsten Wert.`), { daten: tab(m, nm, l), nachweis: [KENN('spannweite', TW(m, l), wt(m, mx - mn))] }, st(m)); };
  const einzeln = (n, namen, anzahl, was) => () => { const m = messung(...namen), l = werte(m, anzahl), nm = namenFuer(m, anzahl), v = was === 'maximum' ? Math.max(...l) : Math.min(...l), g = was === 'maximum' ? Math.min(...l) : Math.max(...l);
    return zahl(Z(m.satz, `Bestimme das ${was === 'maximum' ? 'Maximum' : 'Minimum'}.`), L(m, v), m.einheit, [[L(m, g), 'extrem-verwechselt'], [L(m, l.at(-1)), 'liste-verzaehlt']],
      H(n, was === 'maximum' ? 'Das Maximum ist der größte Wert.' : 'Das Minimum ist der kleinste Wert.', 'Bei 4, 9 und 2 ist das Maximum 9 und das Minimum 2.', 'Vergleiche alle Werte der Tabelle.'), { daten: tab(m, nm, l), nachweis: [KENN(was, TW(m, l), wt(m, v))] }, st(m)); };
  const wer = (n, namen, anzahl, was) => () => { const m = messung(...namen), l = werte(m, anzahl), nm = namenFuer(m, anzahl), i = l.indexOf(was === 'maximum' ? Math.max(...l) : Math.min(...l)), j = l.indexOf(was === 'maximum' ? Math.min(...l) : Math.max(...l)), k = [0, 1, 2, 3].find((x) => x !== i && x !== j);
    const lauf = m.name === 'lauf', wort = lauf ? (was === 'minimum' ? 'am schnellsten gelaufen' : 'am langsamsten gelaufen') : m.name === 'temperatur' ? (was === 'maximum' ? 'am wärmsten' : 'am kältesten') : was === 'maximum' ? 'den größten Wert' : 'den kleinsten Wert';
    const satz = m.name === 'temperatur' ? `Kreuze den Tag an, an dem es ${wort} war.` : lauf ? `Kreuze an, wer ${wort} ist.` : `Kreuze an, wer ${wort} hat.`;
    return auswahl(Z(m.satz, satz), [opt(nm[i], true), opt(nm[j], false, 'extrem-verwechselt'), opt(nm[k])],
      H(n, lauf ? 'Wer am schnellsten läuft, braucht die kürzeste Zeit.' : 'Suche den größten oder den kleinsten Wert in der Tabelle.', lauf ? '7,5 s ist schneller als 8,0 s.' : 'Bei 4, 9 und 2 ist 9 der größte Wert.', `Vergleiche die Werte von ${nm[i]} und ${nm[j]}.`), { daten: tab(m, nm, l), nachweis: [KENN(was, TW(m, l), wt(m, l[i]), { zwischen: true }), FREI(`${nm[i]} hat das ${was === 'maximum' ? 'Maximum' : 'Minimum'}`)] }); };
  sechs(K1, 'F', [minMax('F', GANZ, 5), spannweite('F', GANZ, 5), einzeln('F', GANZ, 6, 'maximum'), wer('F', ['ballwurf', 'bogen', 'temperatur'], 5, 'minimum'), spannweite('F', GANZ, 6), einzeln('F', GANZ, 6, 'minimum')]);

  // Neuer Wert: neue Spannweite.
  const neuerWert = (n, namen, anzahl) => () => { const m = messung(...namen), l = werte(m, anzahl), nm = namenFuer(m, anzahl + 1), mx = Math.max(...l), mn = Math.min(...l), neu = wahl([mx + zz(2, 6), Math.max(m.von - 6, mn - zz(2, 6))]);
    if (neu <= 0 || l.includes(neu)) return null;
    const l2 = [...l, neu], s2 = Math.max(...l2) - Math.min(...l2);
    return zahl(Z(m.satz, `${nm[anzahl]} kommt dazu: ${ME(m, neu)}.`, 'Bestimme die neue Spannweite.'), L(m, s2), m.einheit, [[L(m, mx - mn), 'sach-schritt-vergessen'], [L(m, Math.max(...l2)), 'spannweite-groesster-wert']],
      H(n, 'Der neue Wert kann ein neues Maximum oder ein neues Minimum sein.', 'Werte 4 bis 9, neu 12: 12 − 4 = 8.', `Prüfe: Ist ${ME(m, neu)} größer als alle oder kleiner als alle?`), { daten: tab(m, nm, l), nachweis: [KENN('spannweite', TW(m, l2), wt(m, s2))] }, st(m)); };
  // Aussage zur Spannweite beurteilen (die Spannweite als größter Wert).
  const spannUrteil = (n, namen, anzahl) => () => { const m = messung(...namen), l = werte(m, anzahl), nm = namenFuer(m, anzahl), mx = Math.max(...l), mn = Math.min(...l), kn = kind();
    return auswahl(Z(m.satz, `${kn} sagt: „Die Spannweite ist ${ME(m, mx)}.“`, 'Beurteile die Aussage.'), [opt(`Falsch. ${ME(m, mx)} ist das Maximum. Die Spannweite ist ${ME(m, mx - mn)}.`, true), opt(`Stimmt. ${ME(m, mx)} ist der größte Wert.`, false, 'spannweite-groesster-wert'), opt(`Falsch. Die Spannweite ist ${ME(m, mn)}.`, false, 'extrem-verwechselt')],
      H(n, 'Die Spannweite ist der Abstand zwischen dem größten und dem kleinsten Wert.', 'Bei 4, 9 und 2: 9 − 2 = 7.', `Rechne ${wt(m, mx)} − ${wt(m, mn)}.`), { daten: tab(m, nm, l), nachweis: [KENN('spannweite', TW(m, l), wt(m, mx - mn)), URTEIL(false)] }); };
  sechs(K1, 'G', [minMax('G', ZEHNTEL, 6, true), spannweite('G', ZEHNTEL, 7), wer('G', ['lauf'], 6, 'minimum'), einzeln('G', ZEHNTEL, 7, 'maximum'), neuerWert('G', ZEHNTEL, 6), spannUrteil('G', ZEHNTEL, 6)]);

  // M: zwei Gruppen vergleichen.
  const zweiGruppen = (n, frage) => () => { const m = messung(...ZEHNTEL), a = werte(m, 6), b = werte(m, 6), sa = Math.max(...a) - Math.min(...a), sb = Math.max(...b) - Math.min(...b), [ga, gb] = mische(['6a', '6b', '6c']).slice(0, 2);
    if (sa === sb) return null;
    const d = { kopf: ['', ga, gb], zeilen: [0, 1, 2, 3, 4, 5].map((i) => [`${i + 1}. Kind`, wt(m, a[i]), wt(m, b[i])]) };
    if (frage === 'unterschied') return zahl(Z(`${m.satz} Die Tabelle zeigt Werte aus zwei Klassen.`, `Bestimme, um wie viel ${m.einheit} die Spannweite der ${ga} größer oder kleiner ist als die der ${gb}.`), L(m, Math.abs(sa - sb)), m.einheit, [[L(m, Math.abs(Math.max(...a) - Math.max(...b))), 'spannweite-groesster-wert']],
      H(n, 'Bestimme zuerst für jede Klasse die Spannweite. Vergleiche dann.', `${ga}: ${wt(m, Math.max(...a))} − ${wt(m, Math.min(...a))}.`), { daten: d, nachweis: [KENN('spannweite', TW(m, a), wt(m, sa), { zwischen: true }), KENN('spannweite', TW(m, b), wt(m, sb), { zwischen: true }), `${wt(m, Math.max(sa, sb))} − ${wt(m, Math.min(sa, sb))} = ${wt(m, Math.abs(sa - sb))}`] }, st(m));
    const enger = sa < sb ? ga : gb, weiter = sa < sb ? gb : ga;
    return auswahl(Z(`${m.satz} Die Tabelle zeigt Werte aus zwei Klassen.`, 'Kreuze an, in welcher Klasse die Werte näher beieinanderliegen, und begründe.'), [opt(`${enger}. Ihre Spannweite ist kleiner.`, true), opt(`${weiter}. Ihre Spannweite ist größer.`, false), opt(`${weiter}. Sie hat den größten Wert.`, false, 'spannweite-groesster-wert'), opt('Das kann man mit der Spannweite nicht sagen.', false)],
      H(n, 'Eine kleine Spannweite heißt: Die Werte liegen nah beieinander.', 'Berechne für beide Klassen die Spannweite.'), { daten: d, nachweis: [KENN('spannweite', TW(m, a), wt(m, sa), { zwischen: true }), KENN('spannweite', TW(m, b), wt(m, sb), { zwischen: true }), FREI('Kleinere Spannweite heißt näher beieinander')] }); };
  // M: rückwärts: Maximum aus Minimum und Spannweite.
  const rueckMax = (n) => () => { const m = messung(...ZEHNTEL, 'bogen', 'ballwurf'), mn = zz(m.von, m.von + 6), s = zz(6, 14), kn = kind();
    return zahl(Z(m.satz, `Das Minimum ist ${ME(m, mn)}. Die Spannweite ist ${ME(m, s)}.`, 'Bestimme das Maximum.'), L(m, mn + s), m.einheit, [[L(m, Math.abs(s - mn)), 'unterschied-addiert'], [L(m, s), 'spannweite-groesster-wert']],
      H(n, 'Spannweite = Maximum − Minimum. Also ist das Maximum = Minimum + Spannweite.', `Rechne ${wt(m, mn)} + ${wt(m, s)}.`), { nachweis: [`${wt(m, mn)} + ${wt(m, s)} = ${wt(m, mn + s)}`] }, st(m)); };
  // M: Neuer Wert innerhalb: Spannweite bleibt.
  const bleibt = (n) => () => { const m = messung(...ZEHNTEL), l = werte(m, 6), nm = namenFuer(m, 7), mx = Math.max(...l), mn = Math.min(...l), neu = zz(mn + 1, mx - 1);
    if (l.includes(neu)) return null;
    return auswahl(Z(m.satz, `${nm[6]} kommt dazu: ${ME(m, neu)}.`, 'Kreuze an, wie sich die Spannweite ändert, und begründe.'), [opt(`Sie bleibt gleich. ${ME(m, neu)} liegt zwischen Minimum und Maximum.`, true), opt('Sie wird größer. Es sind jetzt mehr Werte.', false), opt('Sie wird kleiner. Der neue Wert liegt in der Mitte.', false), opt(`Sie wird ${ME(m, neu)} größer.`, false, 'unterschied-addiert')],
      H(n, 'Die Spannweite hängt nur vom größten und vom kleinsten Wert ab.', 'Prüfe, ob sich Minimum oder Maximum ändern.'), { daten: tab(m, nm, l), nachweis: [KENN('spannweite', TW(m, [...l, neu]), wt(m, mx - mn), { zwischen: true }), FREI('Spannweite bleibt, wenn der neue Wert innen liegt')] }); };
  sechs(K1, 'M', [minMax('M', [...ZEHNTEL, 'groesse'], 8, true), zweiGruppen('M', 'unterschied'), zweiGruppen('M', 'naeher'), spannweite('M', [...ZEHNTEL, 'temperatur'], 9), rueckMax('M'), bleibt('M')]);

  // E: rückwärts mit fehlendem Wert in der Tabelle.
  const fehlt = (n) => () => { const m = messung(...ZEHNTEL), l = werte(m, 6), nm = namenFuer(m, 6), i = l.indexOf(Math.max(...l)), rest = l.filter((_, j) => j !== i), mn = Math.min(...l), s = Math.max(...l) - mn;
    if (Math.max(...rest) === l[i]) return null;
    return zahl(Z(m.satz, `Ein Wert in der Tabelle fehlt. Die Spannweite ist ${ME(m, s)}.`, `${nm[i]} hat den größten Wert.`, `Bestimme den Wert von ${nm[i]}.`), L(m, l[i]), m.einheit, [[L(m, s), 'spannweite-groesster-wert'], [L(m, Math.max(...rest) + s), 'extrem-verwechselt']],
      H(n, 'Das Maximum ist das Minimum plus die Spannweite.'), { daten: { kopf: m.kopf, zeilen: l.map((v, j) => [nm[j], j === i ? '?' : wt(m, v)]) }, nachweis: [`${wt(m, mn)} + ${wt(m, s)} = ${wt(m, l[i])}`] }, st(m)); };
  // E: Ausreißer verändert die Spannweite stark.
  const ausreisser = (n) => () => { const m = messung('ballwurf', 'bogen'), l = werte(m, 6).map((v) => Math.min(v, m.von + 10)), nm = namenFuer(m, 7), mx = Math.max(...l), mn = Math.min(...l), neu = mx + zz(15, 25);
    if (new Set(l).size < 6) return null;
    return auswahl(Z(m.satz, `${nm[6]} kommt dazu: ${ME(m, neu)}.`, 'Beurteile, was dieser Wert mit der Spannweite macht.'), [opt(`Die Spannweite wächst von ${ME(m, mx - mn)} auf ${ME(m, neu - mn)}. Ein einzelner Ausreißer macht sie viel größer.`, true), opt(`Die Spannweite bleibt ${ME(m, mx - mn)}. Ein Wert ändert nichts.`, false), opt(`Die Spannweite ist jetzt ${ME(m, neu)}.`, false, 'spannweite-groesster-wert'), opt(`Die Spannweite wächst um ${ME(m, neu)}.`, false, 'unterschied-addiert')],
      H(n, 'Die Spannweite hängt nur vom größten und vom kleinsten Wert ab. Ein einziger Ausreißer kann sie stark verändern.'), { daten: tab(m, nm, l), nachweis: [KENN('spannweite', TW(m, l), wt(m, mx - mn), { zwischen: true }), KENN('spannweite', TW(m, [...l, neu]), wt(m, neu - mn)), FREI('Wirkung eines Ausreißers auf die Spannweite')] }); };
  // E: Aussage: Spannweite 0.
  const null0 = (n) => () => { const [aussage, stimmt, grund] = wahl([['Ist die Spannweite 0, sind alle Werte gleich.', true, 'Maximum und Minimum sind dann gleich, also auch alle Werte dazwischen.'], ['Zwei Gruppen mit gleicher Spannweite haben auch das gleiche Maximum.', false, 'Bei 2 bis 6 und bei 10 bis 14 ist die Spannweite beide Male 4.'], ['Ist die Spannweite groß, sind alle Werte groß.', false, 'Bei 1 und 50 ist die Spannweite 49, aber 1 ist klein.']]), kn = kind();
    return auswahl(Z(`${kn} sagt: „${aussage}“`, 'Beurteile die Aussage.'), [opt(`${stimmt ? 'Stimmt' : 'Falsch'}. ${grund}`, true), opt(`${stimmt ? 'Falsch' : 'Stimmt'}. ${stimmt ? 'Es kann trotzdem verschiedene Werte geben.' : 'Das folgt aus der Spannweite.'}`, false), opt('Das kann man nicht entscheiden.', false)],
      H(n, 'Probiere die Aussage mit eigenen Zahlen aus.'), { nachweis: [URTEIL(stimmt), FREI('Allgemeine Aussage über die Spannweite')] }); };
  // E: Spannweite aus zwei Gruppen zusammen.
  const zusammen = (n) => () => { const m = messung(...ZEHNTEL), a = werte(m, 5), b = werte(m, 5), alle = [...a, ...b], s = Math.max(...alle) - Math.min(...alle), sa = Math.max(...a) - Math.min(...a), sb = Math.max(...b) - Math.min(...b), [ga, gb] = mische(['6a', '6b', '6c']).slice(0, 2);
    if (s === sa || s === sb || s === sa + sb) return null;
    return zahl(Z(`${m.satz} Die Tabelle zeigt Werte aus zwei Klassen.`, 'Bestimme die Spannweite für beide Klassen zusammen.'), L(m, s), m.einheit, [[L(m, sa + sb), 'unterschied-addiert'], [L(m, Math.max(sa, sb)), 'sach-frage-verfehlt']],
      H(n, 'Suche das Maximum und das Minimum aller zehn Werte.'), { daten: { kopf: ['', ga, gb], zeilen: [0, 1, 2, 3, 4].map((i) => [`${i + 1}. Kind`, wt(m, a[i]), wt(m, b[i])]) }, nachweis: [KENN('spannweite', TW(m, alle), wt(m, s))] }, st(m)); };
  sechs(K1, 'E', [minMax('E', [...ZEHNTEL, 'groesse'], 10, true), fehlt('E'), zusammen('E'), null0('E'), ausreisser('E'), null0('E')]);

  // ================= K2: Mittelwert und Zentralwert =================
  const mittelwert = (n, namen, anzahl, rund = false) => () => { const m = messung(...namen), l = werte(m, anzahl, { summeTeilbar: !rund }), nm = namenFuer(m, anzahl), s = summe(l), mw = s / anzahl;
    const v = rund ? Math.round((wv(m, mw)) * 100) / 100 : wv(m, mw);
    if (rund && Math.abs(v - wv(m, mw)) < 1e-9) return null;
    const mitte = sortiert(l)[Math.floor(anzahl / 2)], mitteListe = l[Math.floor(anzahl / 2)];
    const fehler = [[wv(m, mitteListe), 'mittelwert-mitte'], [Math.round(wv(m, s / (anzahl - 1)) * 100) / 100, 'mittelwert-falsche-anzahl'], [wv(m, s), 'sach-schritt-vergessen']];
    return zahl(Z(m.satz, rund ? 'Bestimme den Mittelwert. Runde auf zwei Stellen nach dem Komma.' : 'Bestimme den Mittelwert.'), v, m.einheit, fehler,
      H(n, 'Zähle alle Werte zusammen. Teile die Summe durch die Anzahl der Werte.', 'Bei 2, 4 und 6: 12 : 3 = 4.', `Rechne ${TW(m, l).join(' + ')} und teile durch ${anzahl}.`), { daten: tab(m, nm, l), nachweis: [KENN('mittelwert', TW(m, l), dz(v, 2), rund ? { gerundet: 2 } : {})] }, 2); };
  const summeMittel = (n, namen, anzahl) => () => { const m = messung(...namen), l = werte(m, anzahl, { summeTeilbar: true }), nm = namenFuer(m, anzahl), s = summe(l);
    return luecken(Z(m.satz, 'Bestimme den Mittelwert in zwei Schritten.', `Summe: {{a}} ${m.einheit}`, `Mittelwert: {{b}} ${m.einheit}`), { a: [wv(m, s), [[wv(m, s - l[0]), 'liste-verzaehlt']], 2], b: [wv(m, s / anzahl), [[wv(m, l[Math.floor(anzahl / 2)]), 'mittelwert-mitte'], [Math.round(wv(m, s / (anzahl - 1)) * 100) / 100, 'mittelwert-falsche-anzahl']], 2] },
      H(n, 'Erst alle Werte addieren, dann durch die Anzahl teilen.', 'Bei 2, 4 und 6: Summe 12, Mittelwert 12 : 3 = 4.', `Es sind ${anzahl} Werte.`), { daten: tab(m, nm, l), nachweis: [KENN('summe', TW(m, l), wt(m, s), { luecke: 'a' }), KENN('mittelwert', TW(m, l), dz(wv(m, s / anzahl), 2), { luecke: 'b' })] }); };
  // Welche Rechnung ergibt den Mittelwert?
  const rechnung = (n) => () => { const m = messung('bogen', 'taschengeld', 'temperatur'), l = werte(m, 4, { summeTeilbar: true }), nm = namenFuer(m, 4);
    return auswahl(Z(m.satz, 'Kreuze die richtige Rechnung für den Mittelwert an.'), [opt(`(${l.join(' + ')}) : 4`, true), opt(`(${Math.max(...l)} + ${Math.min(...l)}) : 2`, false), opt(`${l.join(' + ')}`, false, 'sach-schritt-vergessen')],
      H(n, 'Beim Mittelwert zählen alle Werte. Danach teilst du durch die Anzahl.', 'Bei 2, 4 und 6: (2 + 4 + 6) : 3.', 'Zähle die Werte in der Tabelle. Durch diese Zahl wird geteilt.'), { daten: tab(m, nm, l), nachweis: [KENN('mittelwert', l.map(String), String(summe(l) / 4), { zwischen: true }), FREI('Rechenweg des Mittelwerts')] }); };
  sechs(K2, 'F', [mittelwert('F', ['bogen', 'taschengeld'], 3), mittelwert('F', ['bogen', 'temperatur', 'taschengeld'], 4), summeMittel('F', ['bogen', 'taschengeld', 'temperatur'], 4), mittelwert('F', ['bogen', 'ballwurf'], 5), rechnung('F'), mittelwert('F', ['temperatur', 'taschengeld'], 4)]);

  // Zentralwert bei ungerader (G) oder gerader Anzahl (ab M).
  const zentralwert = (n, namen, anzahl) => () => { const m = messung(...namen), l = werte(m, anzahl), nm = namenFuer(m, anzahl), z = zentral(l), s = sortiert(l);
    const unsort = anzahl % 2 ? l[(anzahl - 1) / 2] : (l[anzahl / 2 - 1] + l[anzahl / 2]) / 2;
    const fehler = [[wv(m, unsort), 'zentralwert-unsortiert'], ...(anzahl % 2 ? [] : [[wv(m, s[anzahl / 2 - 1]), 'zentralwert-unsortiert'], [wv(m, s[anzahl / 2]), 'zentralwert-unsortiert']]), [Math.round(wv(m, summe(l) / anzahl) * 100) / 100, 'mittelwert-mitte']];
    return zahl(Z(m.satz, 'Bestimme den Zentralwert.'), wv(m, z), m.einheit, fehler,
      H(n, 'Ordne die Werte der Größe nach. Der Zentralwert steht in der Mitte.', 'Bei 7, 2, 5: geordnet 2, 5, 7. Der Zentralwert ist 5.', `Ordne zuerst: ${TW(m, s.slice(0, 2)).join(', ')}, …`), { daten: tab(m, nm, l), nachweis: [KENN('zentralwert', TW(m, l), dz(wv(m, z), 2))] }, 2); };
  const beide = (n, namen, anzahl) => () => { const m = messung(...namen), l = werte(m, anzahl, { summeTeilbar: true }), nm = namenFuer(m, anzahl), z = zentral(l), mw = summe(l) / anzahl;
    if (z === mw) return null;
    return luecken(Z(m.satz, 'Bestimme Mittelwert und Zentralwert.', `Mittelwert: {{a}} ${m.einheit}`, `Zentralwert: {{b}} ${m.einheit}`), { a: [wv(m, mw), [[wv(m, z), 'mittelwert-mitte']], 2], b: [wv(m, z), [[wv(m, mw), 'mittelwert-mitte'], [wv(m, l[Math.floor(anzahl / 2)]), 'zentralwert-unsortiert']], 2] },
      H(n, 'Mittelwert: Summe geteilt durch Anzahl. Zentralwert: der Wert in der Mitte der geordneten Liste.', 'Bei 2, 3, 7: Mittelwert 12 : 3 = 4, Zentralwert 3.', 'Ordne die Werte für den Zentralwert.'), { daten: tab(m, nm, l), nachweis: [KENN('mittelwert', TW(m, l), dz(wv(m, mw), 2), { luecke: 'a' }), KENN('zentralwert', TW(m, l), dz(wv(m, z), 2), { luecke: 'b' })] }); };
  // Mittelwert deuten: Keiner hat genau den Mittelwert.
  const deuten = (n) => () => { const m = messung(...ZEHNTEL), l = werte(m, 4, { summeTeilbar: true }), nm = namenFuer(m, 4), mw = summe(l) / 4, kn = kind();
    if (l.includes(mw)) return null;
    return auswahl(Z(m.satz, `Der Mittelwert ist ${ME(m, mw)}.`, `${kn} sagt: „Also hat ein Kind genau ${ME(m, mw)} erreicht.“`, 'Beurteile die Aussage.'), [opt(`Falsch. Kein Kind hat genau ${ME(m, mw)}.`, true), opt('Stimmt. Der Mittelwert ist einer der Werte.', false, 'mittelwert-mitte'), opt(`Stimmt. ${ME(m, mw)} steht in der Mitte der Tabelle.`, false, 'mittelwert-mitte')],
      H(n, 'Der Mittelwert ist ein ausgerechneter Wert. Er muss nicht in der Tabelle stehen.', 'Bei 2 und 4 ist der Mittelwert 3. Die 3 kommt gar nicht vor.', 'Suche den Mittelwert in der Tabelle.'), { daten: tab(m, nm, l), nachweis: [KENN('mittelwert', TW(m, l), wt(m, mw)), URTEIL(false)] }); };
  sechs(K2, 'G', [mittelwert('G', ZEHNTEL, 4), zentralwert('G', [...ZEHNTEL, 'ballwurf'], 5), beide('G', ['bogen', 'ballwurf', 'groesse'], 5), mittelwert('G', ['ballwurf', 'groesse', 'bogen'], 5), zentralwert('G', ZEHNTEL, 7), deuten('G')]);

  // M: neuer Wert verändert den Mittelwert (gerundet auf zwei Stellen). heft: im Heft beschreiben, Kontrollwert eingeben.
  const neuerMittelwert = (n, heft = false) => () => { const m = messung(...ZEHNTEL), l = werte(m, 5, { summeTeilbar: true }), nm = namenFuer(m, 6), neu = Math.max(...l) + zz(3, 8), l2 = [...l, neu], v = Math.round(wv(m, summe(l2) / 6) * 100) / 100, alt = wv(m, summe(l) / 5);
    if (Math.abs(v - wv(m, summe(l2) / 6)) < 1e-9) return null;
    return zahl(Z(m.satz, `Der Mittelwert ist ${dz(alt, 2)} ${m.einheit}.`, `${nm[5]} kommt dazu: ${ME(m, neu)}.`, heft ? 'Im Heft: Berechne den neuen Mittelwert. Beschreibe in einem Satz, wie er sich ändert.' : null, `${heft ? 'Gib' : 'Bestimme'} den neuen Mittelwert${heft ? ' an' : ''}. Runde auf zwei Stellen nach dem Komma.`), v, m.einheit,
      [[Math.round(wv(m, summe(l2) / 5) * 100) / 100, 'mittelwert-falsche-anzahl'], [alt, 'sach-schritt-vergessen'], [Math.round(((alt + wv(m, neu)) / 2) * 100) / 100, 'mittelwert-falsche-anzahl']],
      H(n, 'Rechne die neue Summe aus allen sechs Werten und teile durch 6.', `Die alte Summe ist ${dz(alt, 2)} · 5.`), { daten: tab(m, nm, l), nachweis: [KENN('mittelwert', TW(m, l2), dz(v, 2), { gerundet: 2 })] }, 2); };
  sechs(K2, 'M', [zentralwert('M', [...ZEHNTEL, 'groesse'], 6), neuerMittelwert('M'), neuerMittelwert('M', true), mittelwert('M', ZEHNTEL, 6, true), neuerMittelwert('M', true), beide('M', ['groesse', 'ballwurf'], 6)]);

  // E: fehlender Wert bei gegebenem Mittelwert.
  const rueckwaerts = (n) => () => { const m = messung('bogen', 'ballwurf', 'taschengeld'), l = werte(m, 5, { summeTeilbar: true }), nm = namenFuer(m, 5), mw = summe(l) / 5, i = zz(0, 4);
    return zahl(Z(m.satz, `Ein Wert in der Tabelle fehlt. Der Mittelwert ist ${ME(m, mw)}.`, `Bestimme den Wert von ${nm[i]}.`), l[i], m.einheit, [[mw, 'mittelwert-mitte'], [5 * mw, 'sach-schritt-vergessen']],
      H(n, 'Mittelwert mal Anzahl ergibt die Summe aller Werte.'), { daten: { kopf: m.kopf, zeilen: l.map((v, j) => [nm[j], j === i ? '?' : String(v)]) }, nachweis: [`${mw} · 5 = ${5 * mw}`, `${5 * mw} − ${summe(l) - l[i]} = ${l[i]}`] }); };
  // E: Ausreißer: Welche Kenngröße beschreibt besser?
  const ausreisserK2 = (n) => () => { const m = messung('taschengeld'), l = [...werte(m, 6).map((v) => Math.min(v, 10)), zz(45, 60)], nm = namenFuer(m, 7), mw = summe(l) / 7, z = zentral(l);
    if (!Number.isInteger(mw * 100) || new Set(l).size < 6) return null;
    return auswahl(Z(m.satz, 'Beurteile, ob der Mittelwert oder der Zentralwert das Taschengeld der meisten Kinder besser beschreibt.'), [opt(`Der Zentralwert (${z} €). Der Ausreißer zieht den Mittelwert nach oben.`, true), opt(`Der Mittelwert (${dz(mw, 2)} €). Er nimmt alle Werte gleich wichtig.`, false), opt('Beide gleich gut. Es sind dieselben Daten.', false), opt(`Das Maximum (${Math.max(...l)} €). Es ist der wichtigste Wert.`, false, 'extrem-verwechselt')],
      H(n, 'Ein Ausreißer verschiebt den Mittelwert stark, den Zentralwert kaum.'), { daten: tab(m, nm, l), nachweis: [KENN('zentralwert', l.map(String), String(z)), FREI('Zentralwert bei Ausreißern')] }); };
  // E: Datensatz erfinden.
  const erfinden = (n, art) => () => {
    if (art === 'spannweite') { const mw = zz(4, 8), s = zz(5, 9), b = [mw - Math.floor(s / 2), mw, mw, mw, mw - Math.floor(s / 2) + s];
      const korr = 5 * mw - summe(b); b[2] += korr; if (Math.max(...b) - Math.min(...b) !== s || b.some((x) => x < 0)) return null;
      return datensatz(Z(`Finde fünf natürliche Zahlen mit dem Mittelwert ${mw} und der Spannweite ${s}.`, 'Trage sie ein.'), 5, { mittelwert: mw, spannweite: s }, b, H(n, `Die fünf Zahlen müssen zusammen ${5 * mw} ergeben. Größte minus kleinste Zahl ist ${s}.`), { nachweis: [FREI('Jeder Datensatz mit den verlangten Kenngrößen ist richtig'), KENN('mittelwert', b.map(String), String(mw), { beispiel: true }), KENN('spannweite', b.map(String), String(s), { beispiel: true })] }, 0, 50); }
    const mw = zz(5, 9), z = mw + wahl([-2, -1, 1, 2]), b = [z - 3, z - 1, z, z + 1, 0]; b[4] = 5 * mw - summe(b.slice(0, 4));
    if (b[4] < z || sortiert(b)[2] !== z) return null;
    return datensatz(Z(`Finde fünf natürliche Zahlen mit dem Mittelwert ${mw} und dem Zentralwert ${z}.`, 'Trage sie ein.'), 5, { mittelwert: mw, zentralwert: z }, b, H(n, `Die mittlere Zahl der geordneten Reihe ist ${z}. Alle zusammen ergeben ${5 * mw}.`), { nachweis: [FREI('Jeder Datensatz mit den verlangten Kenngrößen ist richtig'), KENN('mittelwert', b.map(String), String(mw), { beispiel: true }), KENN('zentralwert', b.map(String), String(z), { beispiel: true })] }, 0, 50); };
  sechs(K2, 'E', [mittelwert('E', ZEHNTEL, 7, true), rueckwaerts('E'), erfinden('E', 'spannweite'), erfinden('E', 'zentralwert'), ausreisserK2('E'), erfinden('E', 'spannweite')]);
}
