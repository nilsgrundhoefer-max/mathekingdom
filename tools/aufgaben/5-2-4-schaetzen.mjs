// Aufgaben zu 5.2.4 „Schätzen“ (Lernziele S1 und S2) nach ADR 0015 und ADR 0030.
// S1 mit einem Raster schätzen, S2 Schätzungen beurteilen und gezählte, gerundete und geschätzte Angaben unterscheiden.
// F und G: Das Raster ist eingezeichnet, bewertet wird der Rechenweg (Anzahl im Feld mal Zahl der Felder).
// Ab M blendet das Kind das Raster selbst ein, und es zählt der Schätzbereich: ein Fünftel nach oben und nach unten.
// Nach der Antwort zeigt das Dashboard immer die wahre Anzahl.

import { sechs, zahl, auswahl, opt, luecken, sach, teil, zuordnen, schaetzen, Z, N, B, h1, h2, h3, zz, wahl, suche, mische, fehlerliste, kind, zweiKinder, U, HILFSZAHL, summe } from '../werkzeug.mjs';

const S_ = (kurz) => `5.2.4-${kurz}`;
const NAME = { punkt: 'Punkte', schaf: 'Schafe', apfel: 'Äpfel', kind: 'Menschen', vogel: 'Vögel', stern: 'Sterne' };
const symbol = () => wahl(Object.keys(NAME));
const bw = (was, wert) => ({ art: 'bildwert', was, wert });
// Gleichmäßiges Schätzbild: In jedem Feld liegen etwa `basis` Symbole, im markierten Feld genau `basis`.
function gleich(reihen, spalten, basis, streu, extra = {}) {
  const felder = Array.from({ length: reihen }, () => Array.from({ length: spalten }, () => Math.max(1, Math.min(40, basis + zz(-streu, streu)))));
  const markiert = [zz(0, reihen - 1), zz(0, spalten - 1)];
  felder[markiert[0]][markiert[1]] = basis;
  const sym = extra.symbol ?? symbol();
  return { sym, name: NAME[sym], felder, n: summe(felder.flat()), anzahl: reihen * spalten, bild: B.schaetz(sym, felder, { raster: extra.raster ?? 'fest', markiert: extra.ohneMarke ? null : markiert, gezaehlt: extra.gezaehlt ?? false, grob: extra.grob ?? null }) };
}
// Ungleich dichtes Schätzbild: links dicht, rechts dünn (oder umgekehrt).
function ungleich(reihen, spalten, dicht, duenn, extra = {}) {
  const dreh = wahl([true, false]);
  const felder = Array.from({ length: reihen }, () => Array.from({ length: spalten }, (_, j) => { const anteil = (dreh ? spalten - 1 - j : j) / (spalten - 1); return Math.max(1, Math.min(40, Math.round(dicht + (duenn - dicht) * anteil) + zz(-2, 2))); }));
  const sym = extra.symbol ?? symbol();
  return { sym, name: NAME[sym], felder, n: summe(felder.flat()), anzahl: reihen * spalten, bild: { ...B.schaetz(sym, felder, { raster: extra.raster ?? 'wahl', markiert: extra.markiert ?? null, grob: extra.grob ?? null }), ...(extra.fest ? { fest: true } : {}) } };
}
const produktFehler = (feld, felder) => fehlerliste(feld * felder, [[feld, 'schaetzen-nicht-hochgerechnet'], [feld + felder, 'schaetzen-addiert']]);
// Typische Fehler beim Schätzen mit Schätzbereich: nur ein Feld genannt, oder Feld und Felderzahl addiert.
function bereichFehler(b) {
  const alle = b.felder.flat(), unten = Math.ceil(b.n * 0.8), f = [];
  const kl = Math.min(...alle), gr = Math.min(Math.max(...alle), unten - 1);
  if (kl <= gr) f.push([kl, gr, 'schaetzen-nicht-hochgerechnet']);
  const von = gr + 1, bis = Math.min(Math.max(...alle) + b.anzahl, unten - 1);
  if (von <= bis) f.push([von, bis, 'schaetzen-addiert']);
  return f;
}
const GITTER_F = [[2, 2], [2, 3], [2, 4], [3, 3], [2, 5]];
const GITTER_G = [[3, 4], [2, 6], [3, 5], [4, 4], [3, 6]];

export function schaetzenAufgaben() {
  // =====================================================================
  // S1 Mit einem Raster schätzen
  // =====================================================================
  sechs(S_('S1'), 'F', [
    () => { const [r, c] = wahl(GITTER_F), b = gleich(r, c, zz(4, 8), 1, { gezaehlt: true });
      return sach(Z('Schau auf das Bild.', `Im gelben Feld sind ${b.felder[b.bild.markiert[0]][b.bild.markiert[1]]} ${b.name}.`), [
        teil('Wie viele Felder hat das Raster?', b.anzahl, 'Felder', fehlerliste(b.anzahl, [[r, 'schaetzen-nicht-hochgerechnet'], [c, 'schaetzen-nicht-hochgerechnet']])),
        teil(`Wie viele ${b.name} sind es ungefähr?`, b.felder[b.bild.markiert[0]][b.bild.markiert[1]] * b.anzahl, b.name, produktFehler(b.felder[b.bild.markiert[0]][b.bild.markiert[1]], b.anzahl))],
      h3('Rechne: Anzahl im Feld mal Zahl der Felder.', 'Im Feld sind 5. Das Raster hat 6 Felder. Dann sind es ungefähr 5 · 6 = 30.', `Zähle zuerst die Felder. Rechne dann mal ${b.felder[b.bild.markiert[0]][b.bild.markiert[1]]}.`),
      { bild: b.bild, nachweis: [bw('feld', b.felder[b.bild.markiert[0]][b.bild.markiert[1]]), bw('felder', b.anzahl), ...N(`${b.felder[b.bild.markiert[0]][b.bild.markiert[1]]} · ${b.anzahl}`)] }); },
    () => { const [r, c] = wahl(GITTER_F), b = gleich(r, c, zz(3, 9), 1, { gezaehlt: true }), f = b.felder[b.bild.markiert[0]][b.bild.markiert[1]];
      return zahl(Z(`Das Raster hat ${b.anzahl} Felder.`, `Im gelben Feld sind ${f} ${b.name}.`, `Wie viele ${b.name} sind es ungefähr?`), f * b.anzahl, produktFehler(f, b.anzahl),
        h3('In jedem Feld sind ungefähr gleich viele. Rechne mal.', 'Im Feld sind 4. Das Raster hat 8 Felder. Dann sind es ungefähr 4 · 8 = 32.', `Rechne ${f} mal ${b.anzahl}.`), { bild: b.bild, nachweis: [bw('feld', f), bw('felder', b.anzahl), ...N(`${f} · ${b.anzahl}`)], einheit: b.name }); },
    () => { const [r, c] = wahl(GITTER_F.filter(([x, y]) => x * y !== 4)), b = suche(() => gleich(r, c, zz(3, 9), 1, { gezaehlt: true }), (x) => x.felder[x.bild.markiert[0]][x.bild.markiert[1]] !== x.anzahl), f = b.felder[b.bild.markiert[0]][b.bild.markiert[1]];
      return auswahl(Z(`Im gelben Feld sind ${f} ${b.name}.`, `Das Raster hat ${b.anzahl} Felder.`, 'Welche Rechnung passt zum Schätzen?'), [opt(`${f} · ${b.anzahl}`, true), opt(`${f} + ${b.anzahl}`, false, 'schaetzen-addiert'), opt(`${b.anzahl} − ${Math.min(f, b.anzahl - 1)}`, false)],
        h3('In jedem Feld sind ungefähr gleich viele. Dafür rechnet man mal.', '6 Felder mit je 5: Das sind 6 mal 5.', `Jedes der ${b.anzahl} Felder hat ungefähr ${f}.`), { bild: b.bild, nachweis: [bw('feld', f), bw('felder', b.anzahl), ...N(`${f} · ${b.anzahl}`)] }); },
    () => { const b = gleich(2, 2, zz(6, 12), 1, { gezaehlt: true }), f = b.felder[b.bild.markiert[0]][b.bild.markiert[1]];
      return zahl(Z('Das Raster hat 4 Felder.', `Im gelben Feld sind ${f} ${b.name}.`, `Wie viele ${b.name} sind es ungefähr?`), f * 4, produktFehler(f, 4),
        h3('Rechne: Anzahl im Feld mal Zahl der Felder.', 'Im Feld sind 7. Das Raster hat 4 Felder. Dann sind es ungefähr 7 · 4 = 28.', `Rechne ${f} mal 4.`), { bild: b.bild, nachweis: [bw('feld', f), bw('felder', 4), ...N(`${f} · 4`)], einheit: b.name }); },
    () => { const k = kind(), [r, c] = wahl(GITTER_F), b = gleich(r, c, zz(4, 9), 1, { gezaehlt: true }), f = b.felder[b.bild.markiert[0]][b.bild.markiert[1]];
      return auswahl(Z(`${k} zählt nur das gelbe Feld.`, `${k} sagt: „Es sind ungefähr ${f} ${b.name}.“`, `Was hat ${k} vergessen?`), [opt(`${k} muss noch mal die Zahl der Felder rechnen.`, true), opt(`${k} muss noch die Zahl der Felder dazuzählen.`, false, 'schaetzen-addiert'), opt('Nichts. Die Antwort passt so.', false, 'schaetzen-nicht-hochgerechnet')],
        h3('Das Bild hat mehrere Felder. In jedem Feld sind ungefähr gleich viele.', 'Im Feld sind 5. Bei 6 Feldern sind es ungefähr 5 · 6 = 30.', `${f} sind es nur in einem Feld. Das Bild hat aber ${b.anzahl} Felder.`), { bild: b.bild, nachweis: [bw('feld', f), bw('felder', b.anzahl)] }); },
    () => { const [r, c] = wahl(GITTER_F), b = gleich(r, c, zz(5, 9), 1, { gezaehlt: true }), f = b.felder[b.bild.markiert[0]][b.bild.markiert[1]];
      return zahl(Z('Schau auf das Bild.', 'Zähle die Felder.', `Wie viele ${b.name} sind es ungefähr?`), f * b.anzahl, produktFehler(f, b.anzahl),
        h3('Unter dem Bild steht die Anzahl im gelben Feld. Rechne mal die Zahl der Felder.', 'Im Feld sind 6. Das Raster hat 4 Felder. Dann sind es ungefähr 6 · 4 = 24.', `Das Raster hat ${b.anzahl} Felder. Im gelben Feld sind ${f}.`), { bild: b.bild, nachweis: [bw('feld', f), bw('felder', b.anzahl), ...N(`${f} · ${b.anzahl}`)], einheit: b.name }); },
  ]);
  sechs(S_('S1'), 'G', [
    () => { const [r, c] = wahl(GITTER_G), b = gleich(r, c, zz(5, 9), 2), f = b.felder[b.bild.markiert[0]][b.bild.markiert[1]];
      return sach(Z('Schätze mit dem Raster.', 'Das gelbe Feld hilft dir.'), [
        teil(`Wie viele ${b.name} zählst du im gelben Feld?`, f, b.name),
        teil('Wie viele Felder hat das Raster?', b.anzahl, 'Felder', fehlerliste(b.anzahl, [[r, 'schaetzen-nicht-hochgerechnet'], [c, 'schaetzen-nicht-hochgerechnet']])),
        teil(`Wie viele ${b.name} sind es ungefähr auf dem ganzen Bild?`, f * b.anzahl, b.name, produktFehler(f, b.anzahl))],
      h3('Zähle ein Feld genau. Rechne dann hoch: Anzahl im Feld mal Zahl der Felder.', 'Im Feld sind 8. Das Raster hat 12 Felder. Schätzwert: 8 · 12 = 96.', `Das Raster hat ${r} Reihen mit je ${c} Feldern.`), { bild: b.bild, nachweis: [bw('feld', f), bw('felder', b.anzahl), ...N(`${f} · ${b.anzahl}`)] }); },
    () => { const [r, c] = wahl(GITTER_G), b = gleich(r, c, zz(4, 10), 2), f = b.felder[b.bild.markiert[0]][b.bild.markiert[1]];
      return zahl(Z('Zähle das gelbe Feld aus.', 'Rechne dann hoch.', `Wie viele ${b.name} sind es ungefähr?`), f * b.anzahl, produktFehler(f, b.anzahl),
        h3('Rechne: Anzahl im Feld mal Zahl der Felder.', 'Im Feld sind 7. Das Raster hat 15 Felder. Schätzwert: 7 · 15 = 105.', `Im gelben Feld sind ${f}. Das Raster hat ${b.anzahl} Felder.`), { bild: b.bild, nachweis: [bw('feld', f), bw('felder', b.anzahl), ...N(`${f} · ${b.anzahl}`)], einheit: b.name }); },
    () => { const [r, c] = wahl(GITTER_G), b = suche(() => gleich(r, c, zz(6, 12), 2), (x) => (x.felder[x.bild.markiert[0]][x.bild.markiert[1]] * x.anzahl) % 10 !== 0), f = b.felder[b.bild.markiert[0]][b.bild.markiert[1]], p = f * b.anzahl, rund = Math.round(p / 10) * 10;
      return sach(Z('Schätze mit dem Raster.', 'Gib die Schätzung als runde Zahl an.'), [
        teil(`Wie viele ${b.name} zählst du im gelben Feld?`, f, b.name),
        teil('Rechne hoch: Wie groß ist der Schätzwert?', p, b.name, produktFehler(f, b.anzahl)),
        teil('Runde den Schätzwert auf Zehner.', rund, b.name, fehlerliste(rund, [[Math.floor(p / 10) * 10, 'falsch-gerundet'], [Math.round(p / 100) * 100, 'runden-falsche-stelle']]))],
      h3('Eine Schätzung ist nie ganz genau. Deshalb gibt man sie als runde Zahl an.', 'Schätzwert 96: Das sind rund 100.', `Das Raster hat ${b.anzahl} Felder. Rechne ${f} mal ${b.anzahl}.`), { bild: b.bild, nachweis: [bw('feld', f), bw('felder', b.anzahl), ...N(`${f} · ${b.anzahl}`), `${p} ≈ ${rund}`] }); },
    () => { const b = gleich(4, 5, zz(5, 9), 2), f = b.felder[b.bild.markiert[0]][b.bild.markiert[1]];
      return zahl(Z('Das Raster hat 20 Felder.', 'Zähle das gelbe Feld aus.', `Wie viele ${b.name} sind es ungefähr?`), f * 20, produktFehler(f, 20),
        h3('Rechne hoch: Anzahl im Feld mal 20.', 'Im Feld sind 6. Schätzwert: 6 · 20 = 120.', `Im gelben Feld sind ${f}.`), { bild: b.bild, nachweis: [bw('feld', f), bw('felder', 20), ...N(`${f} · 20`)], einheit: b.name }); },
    () => { const [x, y] = zweiKinder(), [r, c] = wahl(GITTER_G), b = suche(() => gleich(r, c, zz(5, 9), 2), (q) => q.felder[q.bild.markiert[0]][q.bild.markiert[1]] !== q.anzahl), f = b.felder[b.bild.markiert[0]][b.bild.markiert[1]];
      return auswahl(Z(`Im gelben Feld sind ${f} ${b.name}.`, `${x} rechnet ${f} + ${b.anzahl}.`, `${y} rechnet ${f} · ${b.anzahl}.`, 'Wer rechnet richtig hoch?'), [opt(`${y}. In jedem der ${b.anzahl} Felder sind ungefähr ${f}.`, true), opt(`${x}. Man zählt die Felder dazu.`, false, 'schaetzen-addiert'), opt('Beide. Es kommt dasselbe heraus.', false, 'schaetzen-addiert')],
        h3('Hochrechnen heißt: von einem Feld auf alle Felder schließen.', '12 Felder mit je 8: Das sind 12 mal 8.', `Stell dir vor: ${b.anzahl} Felder, in jedem liegen ${f}.`), { bild: b.bild, nachweis: [bw('feld', f), bw('felder', b.anzahl), ...N(`${f} · ${b.anzahl}`)] }); },
    () => { const k = kind(), [r, c] = wahl(GITTER_G), b = suche(() => gleich(r, c, zz(5, 9), 2), (q) => q.n !== q.felder[q.bild.markiert[0]][q.bild.markiert[1]] * q.anzahl), f = b.felder[b.bild.markiert[0]][b.bild.markiert[1]];
      return auswahl(Z(`${k} schätzt mit dem Raster: ${f * b.anzahl} ${b.name}.`, `Dann zählt ${k} alle einzeln nach: Es sind genau ${b.n}.`, `${k} sagt: „Dann war meine Schätzung falsch.“`, 'Stimmt das?'), [opt('Stimmt. Eine gute Schätzung trifft die genaue Zahl immer.', false, 'gezaehlt-geschaetzt'), opt('Falsch. Eine Schätzung muss nur nah an der genauen Zahl liegen.', true), opt('Falsch. Beim Nachzählen macht man immer Fehler.', false)],
        h3('Schätzen heißt: ungefähr angeben. Genau muss es nicht stimmen.', 'Geschätzt 96, gezählt 101: Das ist eine gute Schätzung.', `Vergleiche ${f * b.anzahl} und ${b.n}. Die Zahlen liegen nah beieinander.`), { bild: b.bild, nachweis: [U(false), bw('gesamt', b.n), bw('feld', f), bw('felder', b.anzahl), ...N(`${f} · ${b.anzahl}`)] }); },
  ]);
  sechs(S_('S1'), 'M', [
    () => { const b = gleich(4, 6, zz(8, 14), 3, { raster: 'wahl', ohneMarke: true, grob: [3, 2] });
      return schaetzen(`Schätze: Wie viele ${b.name} sind auf dem Bild? Blende dazu ein Raster ein.`, b.bild, b.name, bereichFehler(b),
        h2('Zähle ein Feld aus, das typisch aussieht, und rechne hoch.', 'Schätzwert: Anzahl im Feld mal Zahl der Felder.'), { nachweis: [bw('gesamt', b.n)] }); },
    () => { const b = gleich(4, 8, zz(10, 18), 4, { raster: 'wahl', ohneMarke: true, grob: [4, 2] });
      return schaetzen(`Auf dem Bild sind sehr viele ${b.name}. Schätze ihre Anzahl mit einem Raster.`, b.bild, b.name, bereichFehler(b),
        h2('Mit dem groben Raster zählst du länger an einem Feld, mit dem feinen musst du mit einer größeren Felderzahl rechnen.', 'Das feine Raster hat 32 Felder, das grobe hat 8 Felder.'), { nachweis: [bw('gesamt', b.n)] }); },
    () => { const k = kind(), f = zz(12, 28), n = wahl([12, 15, 20, 24, 30]), p = f * n;
      if (p % 100 === 0) return null;
      return luecken(`${k} zählt in einem Feld ${f} Ameisen. Das Raster hat ${n} Felder. Der Schätzwert ist {{a}}. Auf Hunderter gerundet sind das {{b}} Ameisen.`, { a: [p, produktFehler(f, n)], b: [Math.round(p / 100) * 100, fehlerliste(Math.round(p / 100) * 100, [[Math.floor(p / 100) * 100, 'falsch-gerundet'], [Math.round(p / 10) * 10, 'runden-falsche-stelle']])] },
        h2('Rechne zuerst hoch und runde danach. Eine Schätzung gibt man als runde Zahl an.', `Rechne ${f} · ${n}.`), { nachweis: [...N(`${f} · ${n}`), `${p} ≈ ${Math.round(p / 100) * 100}`] }); },
    () => { const b = gleich(3, 4, zz(6, 10), 2, { raster: 'ohne', ohneMarke: true });
      return schaetzen(`Hier gibt es kein Raster. Schätze trotzdem: Wie viele ${b.name} sind es?`, b.bild, b.name, [],
        h2('Teile das Bild in Gedanken in gleich große Teile, zum Beispiel in Viertel.', 'Zähle ein Viertel aus und nimm die Anzahl mal 4.'), { nachweis: [bw('gesamt', b.n)] }); },
    () => { const [satz, frage, a, b, einheit] = wahl([
      (x, y) => [`In einem Glas liegen Murmeln in Schichten. In einer Schicht zählt man ${x} Murmeln. Das Glas hat ${y} Schichten.`, 'Wie viele Murmeln sind ungefähr im Glas?', x, y, 'Murmeln'],
      (x, y) => [`Auf einem Parkplatz stehen in einer Reihe ${x} Autos. Der Parkplatz hat ${y} Reihen, die etwa gleich voll sind.`, 'Wie viele Autos stehen ungefähr auf dem Parkplatz?', x, y, 'Autos'],
      (x, y) => [`Die Köchin des Königs zählt auf einem Blech ${x} Brötchen. Im Ofen liegen ${y} Bleche, die etwa gleich voll sind.`, 'Wie viele Brötchen sind ungefähr im Ofen?', x, y, 'Brötchen']])(zz(21, 38), zz(11, 19));
      return zahl(`${satz} ${frage}`, a * b, produktFehler(a, b), h2('Die eine Schicht oder Reihe ist deine Stichprobe. Rechne von ihr auf das Ganze hoch.', `Rechne ${a} · ${b}.`), { nachweis: N(`${a} · ${b}`), einheit, toleranz: Math.ceil(a * b * 0.12) }); },
    () => { const k = kind(), b = suche(() => ungleich(3, 4, zz(16, 22), 4, { fest: true, raster: 'fest' }), (x) => x.felder.flat().filter((v) => v === Math.min(...x.felder.flat())).length === 1 && Math.min(...x.felder.flat()) >= 2), kl = Math.min(...b.felder.flat());
      const ort = b.felder.flatMap((z, i) => z.map((v, j) => [v, i, j])).find(([v]) => v === kl);
      b.bild.markiert = [ort[1], ort[2]];
      return auswahl(`${k} zählt das gelbe Feld aus: ${kl} ${b.name}. ${k} rechnet ${kl} · ${b.anzahl} = ${kl * b.anzahl} und sagt: „Auf dem Bild sind ungefähr ${kl * b.anzahl} ${b.name}.“ Warum ist diese Schätzung schlecht?`, [
        opt('Das Feld ist keine gute Stichprobe: In den meisten anderen Feldern sind viel mehr.', true),
        opt(`${k} hätte die beiden Zahlen addieren müssen.`, false, 'schaetzen-addiert'),
        opt('Das Raster hat zu viele Felder für eine Schätzung.', false),
        opt('Die Schätzung ist gut, denn gerechnet wurde richtig. Auf das Feld kommt es nicht an.', false, 'schaetzen-nicht-hochgerechnet')],
      h2('Vergleiche das gelbe Feld mit den anderen Feldern.', 'Eine Stichprobe soll typisch für das ganze Bild sein.'), { bild: b.bild, nachweis: [bw('kleinstes', kl), bw('felder', b.anzahl), ...N(`${kl} · ${b.anzahl}`)] }); },
  ]);
  sechs(S_('S1'), 'E', [
    () => { const b = ungleich(4, 6, zz(18, 26), zz(4, 8), { grob: [3, 2] });
      return schaetzen(`Die ${b.name} sind ungleich verteilt. Schätze ihre Anzahl so gut wie möglich.`, b.bild, b.name, [], h1('Ein einzelnes Feld reicht hier nicht. Zähle ein dichtes und ein dünnes Feld und rechne mit einem mittleren Wert.'), { nachweis: [bw('gesamt', b.n)] }); },
    () => { const d = zz(3, 6), dn = zz(22, 34), u = zz(8, 14), un = zz(6, 12);
      return zahl(`Auf einem Luftbild sind ${d} Felder dicht besetzt mit je etwa ${dn} Zelten. Weitere ${u} Felder sind dünn besetzt mit je etwa ${un} Zelten. Wie viele Zelte stehen ungefähr auf dem Platz?`, d * dn + u * un, fehlerliste(d * dn + u * un, [[(d + u) * dn, 'schaetzen-nicht-hochgerechnet'], [(d + u) * un, 'schaetzen-nicht-hochgerechnet'], [dn + un, 'schaetzen-addiert']]),
        h1('Rechne die dichten und die dünnen Felder getrennt hoch und addiere dann.'), { nachweis: N(`${d} · ${dn}`, `${u} · ${un}`, `${d * dn} + ${u * un}`), einheit: 'Zelte' }); },
    () => { const b = gleich(4, 6, zz(7, 12), 3, { raster: 'ohne', ohneMarke: true });
      return schaetzen(`Zu diesem Bild gibt es kein Raster. Schätze die Anzahl der ${b.name}.`, b.bild, b.name, [], h1('Teile das Bild in Gedanken in gleich große Teile und zähle einen davon aus.'), { nachweis: [bw('gesamt', b.n)] }); },
    () => { const b = suche(() => ungleich(3, 4, zz(24, 32), zz(4, 8), { fest: true, raster: 'fest' }), (x) => { const a = x.felder.flat(); return a.filter((v) => v === Math.max(...a)).length === 1 && a.filter((v) => v === Math.min(...a)).length === 1; }), a = b.felder.flat(), gr = Math.max(...a), kl = Math.min(...a);
      return luecken(`Suche im Bild das vollste und das leerste Feld und zähle beide aus. Rechnet man mit dem vollsten Feld hoch, erhält man {{a}} ${b.name}. Rechnet man mit dem leersten Feld hoch, erhält man {{b}} ${b.name}. Die wahre Anzahl liegt dazwischen.`, { a: [gr * b.anzahl, fehlerliste(gr * b.anzahl, [[gr, 'schaetzen-nicht-hochgerechnet'], [gr + b.anzahl, 'schaetzen-addiert']])], b: [kl * b.anzahl, fehlerliste(kl * b.anzahl, [[kl, 'schaetzen-nicht-hochgerechnet'], [kl + b.anzahl, 'schaetzen-addiert']])] },
        h1('Das Raster hat zwölf Felder. Multipliziere die Anzahl im Feld jeweils mit der Zahl der Felder.'), { bild: b.bild, nachweis: [bw('groesstes', gr), bw('kleinstes', kl), bw('felder', b.anzahl), ...N(`${gr} · ${b.anzahl}`, `${kl} · ${b.anzahl}`)] }); },
    () => { const l = wahl([40, 50, 60, 80]), br = wahl([20, 30, 25]), je = wahl([2, 3, 4]);
      return zahl(`Bei einem Fest stehen die Menschen dicht gedrängt, etwa ${je} auf jedem Quadratmeter. Der Platz ist ${l} m lang und ${br} m breit. Wie viele Menschen sind ungefähr auf dem Platz?`, l * br * je, fehlerliste(l * br * je, [[l * br, 'schaetzen-nicht-hochgerechnet'], [(l + br) * je, 'schaetzen-addiert'], [l * br + je, 'schaetzen-addiert']]),
        h1('Bestimme zuerst, wie viele Quadratmeter der Platz hat. Jeder Quadratmeter ist dann ein Feld deines Rasters.'), { nachweis: N(`${l} · ${br}`, `${l * br} · ${je}`), einheit: 'Menschen' }); },
    () => { const [x, y] = zweiKinder(), a = zz(22, 28) * 10, b = a + zz(4, 7) * 10;
      return auswahl(`${x} und ${y} schätzen die Anzahl auf demselben Bild. Beide rechnen richtig hoch, aber mit verschiedenen Feldern. ${x} erhält ${a}, ${y} erhält ${b}. Kann beides eine brauchbare Schätzung sein?`, [
        opt('Ja. Die Felder sind nie genau gleich voll, deshalb führt jedes Feld zu einem etwas anderen Schätzwert.', true),
        opt('Nein. Wenn zwei Ergebnisse verschieden sind, hat sich einer von beiden sicher verrechnet.', false, 'gezaehlt-geschaetzt'),
        opt('Nein. Beim Schätzen mit einem Raster kommt immer dieselbe Zahl heraus.', false, 'gezaehlt-geschaetzt'),
        opt('Ja, aber nur, wenn beide zufällig dasselbe Feld gezählt haben.', false)],
      h1('Überlege, wovon der Schätzwert abhängt, wenn man nur ein einziges Feld auszählt.'), { nachweis: [U(true), HILFSZAHL(a, 'erster Schätzwert'), HILFSZAHL(b, 'zweiter Schätzwert')] }); },
  ]);

  // =====================================================================
  // S2 Schätzungen beurteilen, gezählt, gerundet und geschätzt unterscheiden
  // =====================================================================
  const dreiZahlen = (n) => { const gut = Math.round(n / 10) * 10; return mische([gut, Math.max(5, Math.round(n / 4 / 5) * 5), Math.round(n * 3 / 10) * 10]); };
  sechs(S_('S2'), 'F', [
    () => { const [r, c] = wahl(GITTER_F), b = gleich(r, c, zz(5, 9), 1, { gezaehlt: true }), l = dreiZahlen(b.n), d = l.map((x) => Math.abs(x - b.n));
      if (new Set(l).size < 3 || d.filter((x) => x === Math.min(...d)).length > 1) return null;
      return auswahl(Z('Schau auf das Bild.', `Wie viele ${b.name} sind es ungefähr?`), l.map((x) => opt(String(x), Math.abs(x - b.n) === Math.min(...d), x < b.n / 2 ? 'schaetzen-nicht-hochgerechnet' : undefined)),
        h3('Zähle die Felder. Rechne mal die Anzahl im gelben Feld.', 'Im Feld sind 5. Bei 6 Feldern sind es ungefähr 30.', `Das Raster hat ${b.anzahl} Felder.`), { bild: b.bild, nachweis: [{ art: 'naechste' }] }); },
    () => { const [x, y] = zweiKinder(), [r, c] = wahl(GITTER_F), b = suche(() => gleich(r, c, zz(5, 9), 1, { gezaehlt: true }), (q) => q.n !== q.felder[q.bild.markiert[0]][q.bild.markiert[1]] * q.anzahl), f = b.felder[b.bild.markiert[0]][b.bild.markiert[1]];
      return auswahl(Z(`${x} zählt alle ${b.name} einzeln: ${b.n}.`, `${y} zählt nur ein Feld und rechnet: ${f * b.anzahl}.`, 'Wer hat geschätzt?'), [opt(y, true), opt(x, false, 'gezaehlt-geschaetzt'), opt('beide', false, 'gezaehlt-geschaetzt')],
        h3('Schätzen heißt: nicht alles zählen. Man rechnet von einem Teil auf alles.', 'Ein Feld zählen und mal rechnen: Das ist schätzen.', `${y} hat nur ein Feld gezählt.`), { bild: b.bild, nachweis: [bw('gesamt', b.n), bw('feld', f), bw('felder', b.anzahl), ...N(`${f} · ${b.anzahl}`)] }); },
    () => { const b = gleich(3, 3, zz(8, 14), 2, { gezaehlt: true }), l = dreiZahlen(b.n), d = l.map((x) => Math.abs(x - b.n));
      if (new Set(l).size < 3 || d.filter((x) => x === Math.min(...d)).length > 1) return null;
      return auswahl(Z('Das Raster hat 9 Felder.', `Welche Zahl passt am besten zur Anzahl der ${b.name}?`), l.map((x) => opt(String(x), Math.abs(x - b.n) === Math.min(...d), x < b.n / 2 ? 'schaetzen-nicht-hochgerechnet' : undefined)),
        h3('Rechne: Anzahl im gelben Feld mal 9.', 'Im Feld sind 10. Bei 9 Feldern sind es ungefähr 90.', `Im gelben Feld sind ${b.felder[b.bild.markiert[0]][b.bild.markiert[1]]}.`), { bild: b.bild, nachweis: [{ art: 'naechste' }, bw('felder', 9)] }); },
    () => { const k = kind(), [r, c] = wahl(GITTER_F), b = suche(() => gleich(r, c, zz(5, 9), 1, { gezaehlt: true }), (q) => q.n !== q.felder[q.bild.markiert[0]][q.bild.markiert[1]] * q.anzahl), p = b.felder[b.bild.markiert[0]][b.bild.markiert[1]] * b.anzahl;
      return zahl(Z(`${k} schätzt mit dem Raster: ${p} ${b.name}.`, `Nachgezählt sind es genau ${b.n}.`, 'Um wie viel liegt die Schätzung daneben?'), Math.abs(b.n - p), fehlerliste(Math.abs(b.n - p), [[b.n + p, 'sub-addiert']]),
        h3('Rechne den Unterschied der beiden Zahlen aus.', 'Geschätzt 30, gezählt 33: Der Unterschied ist 3.', `Rechne ${Math.max(b.n, p)} − ${Math.min(b.n, p)}.`), { bild: b.bild, nachweis: [bw('gesamt', b.n), ...N(`${Math.max(b.n, p)} − ${Math.min(b.n, p)}`)] }); },
    () => { const k = kind(), [r, c] = wahl(GITTER_F.filter(([x, y]) => x * y > 4)), b = gleich(r, c, zz(5, 9), 1, { gezaehlt: true }), f = b.felder[b.bild.markiert[0]][b.bild.markiert[1]];
      return auswahl(Z(`${k} schätzt: „Auf dem Bild sind ungefähr ${f} ${b.name}.“`, 'Wie ist diese Schätzung?'), [opt('viel zu klein', true), opt('viel zu groß', false), opt('gut', false, 'schaetzen-nicht-hochgerechnet')],
        h3('Schau auf das ganze Bild, nicht nur auf ein Feld.', 'In einem Feld sind 5. Auf dem ganzen Bild sind es viel mehr.', `${f} sind es schon im gelben Feld allein.`), { bild: b.bild, nachweis: [bw('feld', f), { art: 'vergleich', links: String(f), rechts: String(b.n), zeichen: '<' }] }); },
    () => { const [r, c] = wahl(GITTER_F), b = gleich(r, c, zz(5, 9), 1, { gezaehlt: true }), p = b.felder[b.bild.markiert[0]][b.bild.markiert[1]] * b.anzahl;
      return auswahl(Z(`Unter einem Bild steht: „Ungefähr ${p} ${b.name}.“`, 'Was bedeutet das?'), [opt('Die Zahl ist geschätzt.', true), opt('Die Zahl ist genau gezählt.', false, 'gezaehlt-geschaetzt'), opt('Die Zahl ist falsch.', false, 'gezaehlt-geschaetzt')],
        h3('Das Wort ungefähr zeigt: Es wurde nicht alles gezählt.', 'Ungefähr 30 Schafe: Es können auch 28 oder 33 sein.', 'Achte auf das Wort ungefähr.'), { bild: b.bild, nachweis: [bw('feld', b.felder[b.bild.markiert[0]][b.bild.markiert[1]]), bw('felder', b.anzahl), ...N(`${b.felder[b.bild.markiert[0]][b.bild.markiert[1]]} · ${b.anzahl}`)] }); },
  ]);
  sechs(S_('S2'), 'G', [
    () => auswahl(Z('Welche Zahl ist geschätzt?'), [opt(`Auf der Wiese blühen etwa ${zz(2, 9) * 100} Blumen.`, true), opt(`Im Bus sitzen ${zz(21, 38)} Kinder.`, false, 'gezaehlt-geschaetzt'), opt('Eine Woche hat 7 Tage.', false, 'gezaehlt-geschaetzt')],
      h3('Was kann man leicht einzeln zählen? Was nicht?', 'Die Kinder im Bus kann man zählen. Die Blumen auf einer Wiese schätzt man.', 'Achte auf das Wort etwa.')),
    () => { const [r, c] = wahl(GITTER_G), b = gleich(r, c, zz(5, 10), 2), l = dreiZahlen(b.n), d = l.map((x) => Math.abs(x - b.n));
      if (new Set(l).size < 3 || d.filter((x) => x === Math.min(...d)).length > 1) return null;
      return auswahl(Z('Schätze mit dem Raster.', `Welcher Schätzwert passt am besten zur Anzahl der ${b.name}?`), l.map((x) => opt(String(x), Math.abs(x - b.n) === Math.min(...d), x < b.n / 2 ? 'schaetzen-nicht-hochgerechnet' : undefined)),
        h3('Zähle das gelbe Feld aus und rechne hoch.', 'Im Feld sind 8. Bei 12 Feldern ist der Schätzwert 96.', `Das Raster hat ${b.anzahl} Felder.`), { bild: b.bild, nachweis: [{ art: 'naechste' }] }); },
    () => { const n = zz(21, 29), g = zz(2, 9) * 100, s = zz(2, 9) * 100 + 50;
      return zuordnen(Z('Was passt zusammen?'), mische([[`In der Klasse sind ${n} Kinder.`, 'genau gezählt'], [`Am Tor steht statt ${g + zz(11, 39)} Einwohnern die Zahl ${g}.`, 'gerundet'], [`Im Glas sind wohl an die ${s} Erbsen.`, 'geschätzt']]),
        h3('Gerundet heißt: Man kennt die genaue Zahl und macht sie glatt.', 'Geschätzt heißt: Man hat nicht alles gezählt.', 'Bei einer Zahl steht die genaue Zahl direkt daneben.')); },
    () => { const k = kind(), [r, c] = wahl(GITTER_G), b = suche(() => gleich(r, c, zz(5, 9), 2), (q) => q.n !== q.felder[q.bild.markiert[0]][q.bild.markiert[1]] * q.anzahl), p = b.felder[b.bild.markiert[0]][b.bild.markiert[1]] * b.anzahl;
      return zahl(Z(`${k} rechnet mit dem gelben Feld hoch.`, `Der Schätzwert ist ${p}.`, `Nachgezählt sind es genau ${b.n} ${b.name}.`, 'Wie groß ist der Unterschied?'), Math.abs(b.n - p), fehlerliste(Math.abs(b.n - p), [[b.n + p, 'sub-addiert']]),
        h3('Rechne den Unterschied zwischen Schätzwert und genauer Zahl aus.', 'Schätzwert 96, gezählt 101: Der Unterschied ist 5.', `Rechne ${Math.max(b.n, p)} − ${Math.min(b.n, p)}.`), { bild: b.bild, nachweis: [bw('gesamt', b.n), bw('feld', p / b.anzahl), bw('felder', b.anzahl), ...N(`${p / b.anzahl} · ${b.anzahl}`, `${Math.max(b.n, p)} − ${Math.min(b.n, p)}`)] }); },
    () => { const [x, y] = zweiKinder(), [r, c] = wahl(GITTER_G), b = gleich(r, c, zz(6, 10), 2), nah = Math.round(b.n / 10) * 10 + wahl([-10, 10]), fern = Math.round(b.n * wahl([14, 16]) / 100) * 10, klein = Math.round(b.n / 30) * 10 + 10, l = [nah, fern, klein], d = l.map((v) => Math.abs(v - b.n));
      if (new Set(l).size < 3 || d.filter((v) => v === Math.min(...d)).length > 1 || Math.min(...d) !== d[0]) return null;
      return auswahl(Z('3 Kinder schätzen die Anzahl auf dem Bild.', 'Welcher Schätzwert liegt am nächsten an der genauen Zahl?'), mische(l).map((v) => opt(String(v), v === nah)),
        h3('Schätze zuerst selbst mit dem Raster. Vergleiche dann.', 'Schätzwert 96: Dann passt 100 besser als 150.', `Zähle das gelbe Feld aus. Das Raster hat ${b.anzahl} Felder.`), { bild: b.bild, nachweis: [{ art: 'naechste' }] }); },
    () => { const k = kind(), h = zz(3, 9) * 100;
      return auswahl(Z(`In der Zeitung steht: „Ungefähr ${h} Gäste kamen zum Fest.“`, `${k} sagt: „Das hat jemand einzeln gezählt.“`, 'Stimmt das?'), [opt('Stimmt. In der Zeitung stehen nur gezählte Zahlen.', false, 'gezaehlt-geschaetzt'), opt('Falsch. Das Wort ungefähr zeigt: Die Zahl ist geschätzt.', true), opt(`Falsch. Es waren genau ${h + 1} Gäste.`, false, 'gezaehlt-geschaetzt')],
        h3('Achte auf kleine Wörter wie ungefähr, etwa oder rund.', 'Etwa 200 Blumen: Niemand hat jede Blume gezählt.', 'In dem Satz steht das Wort ungefähr.'), { nachweis: [U(false)] }); },
  ]);
  sechs(S_('S2'), 'M', [
    () => { const f = zz(11, 19), n = wahl([200, 300, 400, 500]);
      return auswahl(`Eine Försterin zählt auf einer kleinen Probefläche ${f} Bäume. Sie rechnet auf den ganzen Wald hoch und nennt ${f * n} Bäume. Wie ist diese Zahl entstanden?`, [opt('Sie ist geschätzt: Von einer Stichprobe wurde auf das Ganze geschlossen.', true), opt('Sie ist genau gezählt.', false, 'gezaehlt-geschaetzt'), opt('Sie ist gerundet: Die genaue Zahl war bekannt und wurde vereinfacht.', false, 'gezaehlt-geschaetzt'), opt('Sie ist geraten, ganz ohne Rechnung.', false)],
        h2('Überlege, was genau gezählt wurde und was nur berechnet wurde.', 'Gezählt wurde nur die Probefläche.'), { nachweis: [HILFSZAHL(n, 'so oft passt die Probefläche in den Wald'), ...N(`${f} · ${n}`)] }); },
    () => { const k = kind(), f = zz(12, 24), n = wahl([12, 15, 20, 24]), p = f * n, wahr = p + wahl([-1, 1]) * zz(11, 29);
      return zahl(`${k} zählt in einem Feld ${f} Vögel und rechnet mit ${n} Feldern hoch. Auf einem Foto werden später genau ${wahr} Vögel gezählt. Um wie viel weicht der Schätzwert von der genauen Zahl ab?`, Math.abs(wahr - p), fehlerliste(Math.abs(wahr - p), [[p, 'begriffe-verwechselt'], [wahr + p, 'sub-addiert']]),
        h2('Berechne zuerst den Schätzwert und dann den Unterschied zur genauen Zahl.', `Der Schätzwert ist ${p}.`), { nachweis: N(`${f} · ${n}`, `${Math.max(p, wahr)} − ${Math.min(p, wahr)}`) }); },
    () => { const n = wahl([250, 400, 150, 350, 500, 450]);
      return luecken(`Eine Schätzung gilt hier als gut, wenn sie höchstens ein Fünftel von der genauen Zahl abweicht. Die genaue Zahl ist ${n}. Der Schätzbereich reicht dann von {{a}} bis {{b}}.`, { a: [n - n / 5, fehlerliste(n - n / 5, [[n - 5, 'begriffe-verwechselt'], [n / 5, 'begriffe-verwechselt']])], b: [n + n / 5, fehlerliste(n + n / 5, [[n + 5, 'begriffe-verwechselt']])] },
        h2('Ein Fünftel erhältst du, wenn du durch 5 teilst.', `Ein Fünftel von ${n} ist ${n / 5}.`), { nachweis: N(`${n} : 5`, `${n} − ${n / 5}`, `${n} + ${n / 5}`) }); },
    () => { const b = gleich(4, 6, zz(8, 14), 3, { raster: 'wahl', ohneMarke: true, grob: [3, 2] }), gut = Math.round(b.n / 10) * 10, l = [gut, Math.round(b.n / 20) * 10, Math.round(b.n * 17 / 100) * 10, Math.round(b.n / 24 / 5) * 5 + 5], d = l.map((x) => Math.abs(x - b.n));
      if (new Set(l).size < 4 || d.filter((x) => x === Math.min(...d)).length > 1) return null;
      return auswahl(`Vier Kinder schätzen die Anzahl der ${b.name} auf dem Bild. Welcher Schätzwert liegt am nächsten an der genauen Zahl?`, mische(l).map((x) => opt(String(x), x === gut, x === l[3] ? 'schaetzen-nicht-hochgerechnet' : undefined)),
        h2('Schätze zuerst selbst mit dem Raster und vergleiche dann.', 'Blende das Raster ein und zähle ein typisches Feld aus.'), { bild: b.bild, nachweis: [{ art: 'naechste' }] }); },
    () => { const k = kind(), m = zz(12, 24), d = zz(2, 4), n = wahl([20, 24, 30]);
      return zahl(`${k} zählt drei Felder als Stichprobe aus: ${m - d}, ${m} und ${m + d} Ameisen. ${k} rechnet mit dem mittleren Wert und ${n} Feldern hoch. Wie groß ist der Schätzwert?`, m * n, fehlerliste(m * n, [[3 * m, 'schaetzen-nicht-hochgerechnet'], [3 * m * n, 'begriffe-verwechselt'], [(m - d) * n, 'begriffe-verwechselt']]),
        h2('Der mittlere Wert ist die Summe der drei Zahlen geteilt durch 3.', `Der mittlere Wert ist ${m}.`), { nachweis: N(`${m - d} + ${m} + ${m + d}`, `${3 * m} : 3`, `${m} · ${n}`) }); },
    () => { const a = zz(3, 8) * 1000, b = a + wahl([200, 300, 400]);
      return auswahl(`Nach einem Stadtfest schreibt eine Zeitung „etwa ${a} Besucher“, eine andere „etwa ${b} Besucher“. Jemand sagt: „Eine der beiden Zeitungen lügt.“ Stimmt das?`, [
        opt('Falsch. Beide Zahlen sind Schätzungen. Sie liegen nah beieinander und können beide vernünftig sein.', true),
        opt('Stimmt. Nur eine Zahl kann die richtige sein.', false, 'gezaehlt-geschaetzt'),
        opt('Stimmt. Die größere Zahl ist bestimmt übertrieben.', false),
        opt('Falsch. Beide Zeitungen haben die Besucher einzeln gezählt, eine hat sich dabei verzählt.', false, 'gezaehlt-geschaetzt')],
      h2('Überlege, wie man die Besucher eines Stadtfests überhaupt ermitteln kann.', 'Achte auf das Wort „etwa“ in beiden Meldungen.'), { nachweis: [U(false)] }); },
  ]);
  sechs(S_('S2'), 'E', [
    () => { const km = wahl([[42, 'Ein Marathonlauf ist rund 42 km lang.'], [100, 'Die Burgmauer ist rund 100 m lang.'], [300, 'Der Turm des Königs ist rund 300 Stufen hoch.']]);
      return auswahl(`${km[1]} Wie ist eine solche Angabe am ehesten entstanden?`, [opt('Die Größe wurde genau bestimmt und danach gerundet.', true), opt('Sie wurde mit einem Raster geschätzt.', false, 'gezaehlt-geschaetzt'), opt('Sie ist genau, das Wort „rund“ hat keine Bedeutung.', false, 'gezaehlt-geschaetzt'), opt('Sie wurde aus einer Stichprobe hochgerechnet.', false, 'gezaehlt-geschaetzt')],
        h1('Unterscheide: Beim Runden kennt man die genaue Zahl, beim Schätzen nicht.')); },
    () => { const n = wahl([1250, 2400, 3500, 850, 1750]);
      return luecken(`Eine Schätzung gilt als gut, wenn sie höchstens ein Fünftel von der genauen Zahl abweicht. Die genaue Zahl ist ${n}. Der Schätzbereich reicht von {{a}} bis {{b}}.`, { a: [n - n / 5, fehlerliste(n - n / 5, [[n / 5, 'begriffe-verwechselt'], [n - 5, 'begriffe-verwechselt']])], b: [n + n / 5, fehlerliste(n + n / 5, [[n + 5, 'begriffe-verwechselt']])] },
        h1('Berechne zuerst ein Fünftel der genauen Zahl.'), { nachweis: N(`${n} : 5`, `${n} − ${n / 5}`, `${n} + ${n / 5}`) }); },
    () => { const f = zz(14, 28), n = wahl([24, 30, 32, 40]);
      return zahl(`Ein Schätzwert von ${f * n} Sternen wurde mit einem Raster aus ${n} Feldern berechnet. Wie viele Sterne wurden im ausgezählten Feld gezählt?`, f, fehlerliste(f, [[f * n * n, 'begriffe-verwechselt'], [f * n - n, 'schaetzen-addiert']]),
        h1('Kehre die Rechnung um: Der Schätzwert ist das Produkt aus der Anzahl im Feld und der Zahl der Felder.'), { nachweis: N(`${f * n} : ${n}`), einheit: 'Sterne' }); },
    () => auswahl('In welchem Fall liefert das Hochrechnen aus einem einzigen Feld eine schlechte Schätzung?', [
      opt('wenn die Dinge sehr ungleich verteilt sind', true),
      opt('wenn das Raster aus sehr vielen Feldern besteht', false),
      opt('wenn man das Feld besonders sorgfältig auszählt', false),
      opt('wenn die Anzahl im Feld eine ungerade Zahl ist', false),
      opt('wenn die Dinge auf dem Bild sehr klein sind', false)],
    h1('Überlege, was das ausgezählte Feld über die anderen Felder aussagen soll.')),
    () => { const n = wahl([450, 350, 550, 650]), f = n / 5, a = n - f - zz(1, 3) * 10, b = n + f - zz(1, 3) * 10;
      return auswahl(`Die genaue Zahl ist ${n}. Eine Schätzung gilt als gut, wenn sie höchstens ein Fünftel davon abweicht. Zwei Kinder schätzen ${a} und ${b}. Welche Schätzung ist gut?`, [opt(`nur die Schätzung ${b}`, true), opt(`nur die Schätzung ${a}`, false), opt('beide Schätzungen', false, 'gezaehlt-geschaetzt'), opt('keine der beiden Schätzungen', false, 'gezaehlt-geschaetzt')],
        h1('Bestimme zuerst den Schätzbereich: ein Fünftel nach unten und ein Fünftel nach oben.'), { nachweis: [...N(`${n} : 5`, `${n} − ${f}`, `${n} + ${f}`), HILFSZAHL(a, 'erste Schätzung'), HILFSZAHL(b, 'zweite Schätzung')] }); },
    () => auswahl('Warum wird eine Schätzung meist besser, wenn man mehrere Felder auszählt und mit ihrem mittleren Wert hochrechnet?', [
      opt('Ein einzelnes Feld kann zufällig besonders voll oder leer sein. Mehrere Felder gleichen das aus.', true),
      opt('Weil man dann mehr rechnet, und mehr Rechnen ist immer genauer als wenig Rechnen.', false),
      opt('Sie wird nicht besser, denn es bleibt eine Schätzung.', false, 'gezaehlt-geschaetzt'),
      opt('Weil man die Felderzahl dann nicht mehr braucht.', false, 'schaetzen-nicht-hochgerechnet')],
    h1('Überlege, was geschieht, wenn das eine ausgezählte Feld nicht typisch ist.')),
  ]);
}
