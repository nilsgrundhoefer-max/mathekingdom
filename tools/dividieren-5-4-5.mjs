// Aufgaben für 4.5 Dividieren nach den Regeln aus docs/adr/0009-niveaustufen-nach-anforderung.md.
//
// Die Niveaustufen unterscheiden sich in der Art der Anforderung, nicht in der Zahlengröße:
//   F  eine Handlung, ein Rechenschritt, kleines Einmaleins und glatte Zahlen, nie schriftlich, einfache Sprache
//   G  ein Standardverfahren (schriftlich durch einstellige Zahlen, ohne Rest), bis 1000, einfache Sprache
//   M  mehrere Schritte, zweistelliger Divisor, Rest deuten, Text in Rechnung übersetzen
//   E  Strukturen, Ziffernrätsel, Behauptungen beurteilen; keine größeren Zahlen als M
// Je Lernziel und Stufe sechs Aufgaben in der Folge AFB I, II, II, I, II, III.
// Hilfekärtchen: F und G drei, M zwei (Tipp, Lösungsschritt), E eines (Tipp als Rückfrage).

const AFB_FOLGE = [1, 2, 2, 1, 2, 3];
const zeilen = (...z) => z.join('\n'); // einfache Sprache: jeder Satz in einer eigenen Zeile
const h3 = (tipp, beispiel, loesungsschritt) => ({ tipp, beispiel, loesungsschritt });
const h2 = (tipp, loesungsschritt) => ({ tipp, loesungsschritt });
const h1 = (tipp) => ({ tipp });

export const fehlvorstellungenDiv = {
  'div-vertauscht': { beschreibung: 'Vertauscht bei der Division die beiden Zahlen.', hinweis: 'Beim Teilen darfst du die Zahlen nicht tauschen. Die erste Zahl wird geteilt.' },
  'div-falsche-rechenart': { beschreibung: 'Wählt statt der Division eine andere Rechenart.', hinweis: 'Überlege: Wird hier gerecht verteilt oder in gleiche Gruppen aufgeteilt? Dann wird geteilt.' },
  'div-rest-zu-gross': { beschreibung: 'Lässt einen Rest stehen, der so groß wie der Divisor oder größer ist.', hinweis: 'Der Rest muss kleiner sein als die Zahl, durch die du teilst. Passt sie noch einmal hinein?' },
  'div-einmaleins': { beschreibung: 'Irrt sich im kleinen Einmaleins.', hinweis: 'Prüfe mit der Mal-Aufgabe: Ergebnis mal die zweite Zahl muss die erste Zahl ergeben.' },
  'teilbar-summe': { beschreibung: 'Erkennt nicht, dass die Summe zweier Vielfacher wieder ein Vielfaches ist.', hinweis: 'Zerlege in Päckchen: Was passiert, wenn du zu vollen Päckchen weitere volle Päckchen legst?' },
};

export function dividieren({ gruppe, zahl, auswahl, opt, zz, wahl, suche, fz, fehlerliste, teil }) {
  const D = (kurz) => `5.4.5-${kurz}`;
  // Verteilt die sechs Plätze einer Gruppe auf die Erzeuger je Anforderungsbereich. k zählt die Aufgaben desselben Bereichs.
  const stufen = (kurz, niveau, je) => gruppe(D(kurz), niveau, (i) => {
    const afb = AFB_FOLGE[i];
    const k = AFB_FOLGE.slice(0, i).filter((x) => x === afb).length;
    const a = { ...je[afb](k), afb };
    // Einfache Sprache auf F und G: auch in den Antworten steht jeder Satz in einer eigenen Zeile.
    if ((niveau === 'F' || niveau === 'G') && a.optionen) a.optionen = a.optionen.map((o) => ({ ...o, text: o.text.replace(/(?<=[.?!]) (?=[A-ZÄÖÜ„\d])/g, '\n') }));
    return a;
  });
  const luecken = (text, werte, hilfen) => ({ format: 'luecken', text, hilfen,
    luecken: Object.fromEntries(Object.entries(werte).map(([n, w]) => [n, Array.isArray(w) ? { loesung: w[0], typischeFehler: w[1] } : { loesung: w, typischeFehler: [] }])) });
  const einmaleins = (dMin = 2, dMax = 9, qMin = 2, qMax = 9) => { const d = zz(dMin, dMax), q = zz(qMin, qMax); return [d * q, d, q]; };
  const mitRest = (dMin, dMax, qMin, qMax) => { const d = zz(dMin, dMax), q = zz(qMin, qMax), r = zz(1, d - 1); return [d * q + r, d, q, r]; };
  const reihe = (d, bis) => Array.from({ length: bis }, (_, i) => `${i + 1} · ${d} = ${(i + 1) * d}`).join(', ');
  const efehler = (q, d) => fehlerliste(q, [[q + 1, 'div-einmaleins'], [q - 1, 'div-einmaleins']]);

  // ===================================================================
  // D1 Fachbegriffe. Jede Stufe fragt nur die Wörter ihres Wortspeichers ab.
  // ===================================================================
  stufen('D1', 'F', {
    1: (k) => {
      const [a, d, q] = einmaleins();
      const hilfen = h3('Das Zeichen : liest du „geteilt durch“. Hinter dem = steht das Ergebnis.',
        '12 : 3 = 4. Du liest: 12 geteilt durch 3 ist gleich 4. Das Ergebnis ist 4.',
        `Lies die Aufgabe laut: ${a} geteilt durch ${d} ist gleich ${q}.`);
      return k === 0
        ? zahl(zeilen(`${a} : ${d} = ${q}`, 'Welche Zahl ist das Ergebnis?'), q, fehlerliste(q, [[a, 'begriffe-verwechselt'], [d, 'begriffe-verwechselt']]), hilfen)
        : auswahl(zeilen(`${a} : ${d}`, 'Wie liest du die Aufgabe?'), [opt(`${a} geteilt durch ${d}`, true), opt(`${a} mal ${d}`, false, 'begriffe-verwechselt'),
          opt(`${d} geteilt durch ${a}`, false, 'div-vertauscht'), opt(`${a} minus ${d}`, false, 'begriffe-verwechselt')], hilfen);
    },
    2: (k) => {
      const [a, d, q] = suche(() => einmaleins(), ([, x, y]) => x !== y);
      if (k === 0) return auswahl(zeilen(`${a} geteilt durch ${d}`, 'Welche Aufgabe passt?'),
        [opt(`${a} : ${d}`, true), opt(`${d} : ${a}`, false, 'div-vertauscht'), opt(`${a} · ${d}`, false, 'begriffe-verwechselt'), opt(`${a} − ${d}`, false, 'begriffe-verwechselt')],
        h3('„Geteilt durch“ schreibst du mit dem Zeichen :. Die Zahl, die geteilt wird, steht vorn.', '10 geteilt durch 2 schreibst du so: 10 : 2.', `Die Zahl ${a} wird geteilt. Sie steht vorn.`));
      if (k === 1) return auswahl(zeilen(`Die Mal-Aufgabe ist ${q} · ${d} = ${a}.`, 'Welche Geteilt-Aufgabe passt dazu?'),
        [opt(`${a} : ${d} = ${q}`, true), opt(`${d} : ${a} = ${q}`, false, 'div-vertauscht'), opt(`${q} : ${d} = ${a}`, false, 'div-vertauscht'), opt(`${a} : ${d} = ${a}`)],
        h3('Mal und geteilt gehören zusammen. Bei geteilt steht die größte Zahl vorn.', '3 · 5 = 15. Dazu passt 15 : 5 = 3.', `Die größte Zahl ist ${a}. Sie steht bei der Geteilt-Aufgabe vorn.`));
      return zahl(zeilen(`Eine Zahl wird durch ${d} geteilt.`, `Das Ergebnis ist ${q}.`, 'Wie heißt die Zahl?'), a, fehlerliste(a, [[q + d, 'div-falsche-rechenart']]),
        h3('Rechne rückwärts mit einer Mal-Aufgabe.', 'Eine Zahl geteilt durch 2 ist 6. Rechne 6 · 2 = 12. Die Zahl heißt 12.', `Rechne ${q} · ${d}.`));
    },
    3: () => {
      const [a, d] = suche(() => einmaleins(2, 5, 3, 6), ([, x, y]) => x !== y);
      return auswahl(zeilen('Tim sagt:', `„${a} : ${d} ist dasselbe wie ${d} : ${a}.“`, 'Stimmt das?'),
        [opt(`Nein. ${a} Dinge kann man an ${d} Kinder verteilen. ${d} Dinge reichen nicht für ${a} Kinder.`, true),
          opt('Ja. Beim Teilen darf man die Zahlen tauschen.', false, 'div-vertauscht'), opt('Ja. Es sind beide Male die gleichen Zahlen.', false, 'div-vertauscht'),
          opt(`Nein. ${d} : ${a} ist größer.`)],
        h3('Stell dir Bonbons und Kinder vor. Lege Wendeplättchen.', '6 : 2 heißt: 6 Bonbons für 2 Kinder. Jedes Kind bekommt 3. Bei 2 : 6 sind es nur 2 Bonbons für 6 Kinder.',
          `Lege ${a} Plättchen. Verteile sie an ${d} Kinder. Lege dann nur ${d} Plättchen. Reichen sie für ${a} Kinder?`));
    },
  });

  stufen('D1', 'G', {
    1: (k) => {
      const [a, d, q] = einmaleins(3, 9, 3, 9);
      const hilfen = h3('Das Ergebnis einer Geteilt-Aufgabe heißt Quotient.', '20 : 4 = 5. Der Quotient ist 5.', `Du rechnest ${a} : ${d}. Das Ergebnis ist der Quotient.`);
      return k === 0
        ? auswahl(zeilen(`${a} : ${d} = ${q}`, `Wie heißt die Zahl ${q}?`), [opt('Quotient', true), opt('Summe', false, 'begriffe-verwechselt'), opt('Differenz', false, 'begriffe-verwechselt'), opt('Produkt', false, 'begriffe-verwechselt')], hilfen)
        : zahl(zeilen('Berechne den Quotienten.', `${a} : ${d}`), q, efehler(q, d), hilfen);
    },
    2: (k) => {
      if (k === 0) {
        const [a, d, q] = suche(() => einmaleins(3, 9, 3, 9), ([x, y, w]) => x - y !== w && y !== w);
        const [b, e] = suche(() => einmaleins(3, 9, 3, 9), ([, , w]) => w !== q);
        return auswahl(zeilen(`Der Quotient ist ${q}.`, 'Welche Aufgabe passt?'),
          [opt(`${a} : ${d}`, true), opt(`${a} − ${d}`, false, 'begriffe-verwechselt'), opt(`${q} · ${d}`, false, 'begriffe-verwechselt'), opt(`${b} : ${e}`, false, 'div-einmaleins')],
          h3('Der Quotient ist das Ergebnis einer Geteilt-Aufgabe. Rechne die Geteilt-Aufgaben aus.', 'Der Quotient ist 4. Dazu passt 12 : 3, denn 12 : 3 = 4.', `Suche die Geteilt-Aufgabe mit dem Ergebnis ${q}.`));
      }
      if (k === 1) {
        const [a, d] = suche(() => einmaleins(2, 6, 2, 9), ([x, y]) => x !== y * 2);
        return { format: 'zuordnen', text: 'Ordne jedem Ergebnis den richtigen Namen zu.',
          paare: [{ links: `${a} + ${d}`, rechts: 'Summe' }, { links: `${a} − ${d}`, rechts: 'Differenz' }, { links: `${a} · ${d}`, rechts: 'Produkt' }, { links: `${a} : ${d}`, rechts: 'Quotient' }],
          hilfen: h3('Schau in den Wortspeicher: Zu jeder Rechenart gehört ein Name für das Ergebnis.', 'Bei 8 + 2 heißt das Ergebnis Summe. Bei 8 : 2 heißt es Quotient.', 'Plus gehört zu Summe. Geteilt gehört zu Quotient.') };
      }
      const [a, d, q] = einmaleins(3, 9, 3, 9);
      return zahl(zeilen(`Eine Zahl wird durch ${d} geteilt.`, `Der Quotient ist ${q}.`, 'Wie heißt die Zahl?'), a, fehlerliste(a, [[q + d, 'div-falsche-rechenart']]),
        h3('Rechne rückwärts mit einer Mal-Aufgabe.', 'Eine Zahl geteilt durch 5 ist 6. Rechne 6 · 5 = 30.', `Rechne ${q} · ${d}.`));
    },
    3: () => {
      const a = zz(6, 9);
      return auswahl(zeilen('Lea sagt:', '„Der Quotient ist immer kleiner als die erste Zahl.“', `Prüfe mit ${a} : 1.`, 'Stimmt das?'),
        [opt(`Nein. ${a} : 1 = ${a}. Der Quotient ist hier genauso groß.`, true), opt('Ja. Beim Teilen wird jede Zahl kleiner.'),
          opt(`Ja. ${a} : 1 = ${a - 1}.`, false, 'div-einmaleins'), opt('Nein. Der Quotient ist immer größer als die erste Zahl.')],
        h3('Rechne die Aufgabe aus. Vergleiche das Ergebnis mit der ersten Zahl.', '5 : 1 = 5. Fünf Äpfel für ein Kind: Das Kind bekommt alle 5.', `Rechne ${a} : 1. Wie viel bekommt ein Kind, wenn es alles allein bekommt?`));
    },
  });

  stufen('D1', 'M', {
    1: (k) => {
      const [d, q] = suche(() => [zz(6, 14), zz(6, 14)], ([x, y]) => x !== y && x !== 10 && y !== 10), a = d * q;
      if (k === 0) {
        const [gesucht, name] = wahl([[a, 'Dividend'], [d, 'Divisor'], [q, 'Quotient']]);
        return auswahl(`In der Aufgabe ${a} : ${d} = ${q}: Wie heißt die Zahl ${gesucht}?`,
          ['Dividend', 'Divisor', 'Quotient', 'Subtrahend'].map((n) => opt(n, n === name, n === name ? undefined : 'begriffe-verwechselt')),
          h2('Der Dividend wird geteilt, der Divisor teilt, der Quotient ist das Ergebnis.', `Die Zahl ${a} wird geteilt. Sie ist der Dividend.`));
      }
      return zahl(`Der Dividend ist ${a}, der Divisor ist ${d}. Berechne den Quotienten.`, q, fehlerliste(q, [[a - d, 'begriffe-verwechselt'], [a * d, 'begriffe-verwechselt']]),
        h2('Dividend : Divisor = Quotient.', `Rechne ${a} : ${d}.`));
    },
    2: (k) => {
      const d = zz(6, 12, 0), q = suche(() => zz(11, 25), (x) => x % 10 !== 0), a = d * q;
      if (k === 0) return zahl(`Der Quotient ist ${q}, der Divisor ist ${d}. Wie groß ist der Dividend?`, a, fehlerliste(a, [[q + d, 'begriffe-verwechselt']]),
        h2('Die Umkehraufgabe hilft: Quotient · Divisor = Dividend.', `Rechne ${q} · ${d}.`));
      if (k === 1) return zahl(`Der Dividend ist ${a}, der Quotient ist ${q}. Wie groß ist der Divisor?`, d, fehlerliste(d, [[a - q, 'begriffe-verwechselt']]),
        h2('Dividend : Quotient = Divisor.', `Rechne ${a} : ${q}.`));
      const t = zz(6, 9), e = zz(8, 15), x = suche(() => zz(20, t * e - 20), (v) => v !== t * e - v);
      return zahl(`Dividiere die Summe von ${x} und ${t * e - x} durch ${t}.`, e, fehlerliste(e, [[(t * e - x) % t === 0 ? x + (t * e - x) / t : -1, 'sach-schritt-vergessen']]),
        h2('Berechne zuerst die Summe. Sie ist der Dividend.', `Die Summe ist ${x} + ${t * e - x} = ${t * e}.`));
    },
    3: () => {
      const [frage, richtig, falsch] = wahl([
        ['Der Dividend wird verdoppelt, der Divisor bleibt gleich.', 'Er verdoppelt sich.', ['Er halbiert sich.', 'Er bleibt gleich.', 'Er wird um 2 größer.']],
        ['Der Divisor wird verdoppelt, der Dividend bleibt gleich.', 'Er halbiert sich.', ['Er verdoppelt sich.', 'Er bleibt gleich.', 'Er wird um 2 kleiner.']],
      ]);
      return auswahl(`${frage} Was passiert mit dem Quotienten? Prüfe an einem eigenen Beispiel.`, [opt(richtig, true), ...falsch.map((f) => opt(f))],
        h2('Probiere es mit kleinen Zahlen aus, zum Beispiel mit 24 : 4.', 'Rechne 24 : 4 und dann die veränderte Aufgabe. Vergleiche die beiden Quotienten.'));
    },
  });

  stufen('D1', 'E', {
    1: (k) => {
      if (k === 0) {
        const d = zz(3, 6), b = zz(2, 5) * d, a = zz(2, 5) * d;
        return auswahl('Welcher Term ist ein Quotient?', [opt(`(${a} + ${b}) : ${d}`, true), opt(`${a} + ${b} : ${d}`, false, 'begriffe-verwechselt'),
          opt(`${a} · (${b} : ${d})`, false, 'begriffe-verwechselt'), opt(`${a} − ${b} : ${d}`, false, 'begriffe-verwechselt')],
          h1('Welche Rechnung wird in jedem Term zuletzt ausgeführt?'));
      }
      const x = zz(3, 6), y = zz(3, 6), q = zz(11, 19);
      return zahl(`Berechne den Wert des Quotienten aus ${q * x * y} und dem Produkt von ${x} und ${y}.`, q, fehlerliste(q, [[q * y, 'sach-schritt-vergessen'], [q * x, 'sach-schritt-vergessen']]),
        h1('Was ist hier der Divisor: eine Zahl oder ein Term?'));
    },
    2: (k) => {
      if (k === 0) {
        const d = zz(11, 19), q = zz(12, 35), r = zz(2, d - 1);
        return zahl(`Der Divisor ist ${d}, der Quotient ${q} und der Rest ${r}. Bestimme den Dividenden.`, d * q + r, fehlerliste(d * q + r, [[d * q, 'div-rest-vergessen']]),
          h1('Wie lautet die Probe bei einer Division mit Rest?'));
      }
      if (k === 1) {
        const q = zz(12, 28);
        const [was, loesung] = wahl([['Dividend und Divisor werden beide verdoppelt.', q], ['Der Dividend wird vervierfacht, der Divisor verdoppelt.', 2 * q]]);
        return zahl(`Ein Quotient hat den Wert ${q}. ${was} Welchen Wert hat der neue Quotient?`, loesung, fehlerliste(loesung, [[2 * q, 'div-stellenwert'], [4 * q, 'div-stellenwert'], [q / 2, 'div-stellenwert'], [q, 'div-stellenwert']]),
          h1('Was passiert bei 24 : 4, wenn du beide Zahlen in gleicher Weise veränderst?'));
      }
      const d = zz(8, 15), q = zz(3, 7);
      return zahl(`Die Summe aus Dividend und Divisor ist ${d * (q + 1)}. Der Quotient ist ${q}. Wie groß ist der Dividend?`, d * q, fehlerliste(d * q, [[d, 'begriffe-verwechselt']]),
        h1(`Der Dividend ist das ${q}-Fache des Divisors. Wie viele gleich große Teile stecken dann in der Summe?`));
    },
    3: () => auswahl('Welche Aussage gilt für jede Division natürlicher Zahlen, die ohne Rest aufgeht (Divisor nicht 0)?',
      [opt('Quotient · Divisor = Dividend', true), opt('Der Quotient ist immer kleiner als der Dividend.'), opt('Dividend und Divisor darf man vertauschen.', false, 'div-vertauscht'),
        opt('Der Quotient ist immer größer als der Divisor.')],
      h1('Suche zu jeder Aussage ein Gegenbeispiel. Denke auch an den Divisor 1.')),
  });

  // ===================================================================
  // D2 Dividieren durch einstellige Zahlen
  // F: kleines Einmaleins und glatte Zehner, im Kopf. G: schriftlich, ohne Rest, Dividend bis 1000.
  // ===================================================================
  stufen('D2', 'F', {
    1: () => {
      const [a, d, q] = einmaleins();
      return zahl(zeilen('Rechne.', `${a} : ${d}`), q, efehler(q, d),
        h3(`Nimm ${a} Wendeplättchen. Lege immer ${d} zusammen. Zähle die Häufchen.`, `Bei 12 : 3 hilft die 3er-Reihe: ${reihe(3, 4)}. Also ist 12 : 3 = 4.`,
          `Nutze die ${d}er-Reihe: ${reihe(d, Math.max(2, q - 1))}, … Wie oft brauchst du die ${d}, bis du bei ${a} bist?`));
    },
    2: (k) => {
      const [a, d, q] = einmaleins();
      if (k === 0) return zahl(zeilen('Welche Zahl fehlt?', `▢ : ${d} = ${q}`), a, fehlerliste(a, [[q + d, 'div-falsche-rechenart']]),
        h3('Rechne rückwärts mit einer Mal-Aufgabe.', '▢ : 2 = 5. Rechne 5 · 2 = 10. Die Zahl ist 10.', `Rechne ${q} · ${d}.`));
      if (k === 1) return zahl(zeilen('Welche Zahl fehlt?', `${a} : ▢ = ${q}`), d, fehlerliste(d, [[a - q, 'div-falsche-rechenart']]),
        h3(`Frage dich: ${q} mal welche Zahl ergibt ${a}?`, '12 : ▢ = 4. Du weißt: 4 · 3 = 12. Die Zahl ist 3.', `Gehe die ${q}er-Reihe durch, bis du bei ${a} bist.`));
      const e = zz(2, 4), w = zz(2, 4);
      return zahl(zeilen(`${e * w} : ${e} = ${w}`, `Wie viel ist ${e * w * 10} : ${e}?`), w * 10, fehlerliste(w * 10, [[w, 'div-stellenwert'], [w * 100, 'div-stellenwert']]),
        h3(`${e * w * 10} sind ${e * w} Zehner. Teile die Zehner.`, '6 : 2 = 3. Dann ist 60 : 2 = 30. Aus 3 Einern werden 3 Zehner.', `${e * w} Zehner geteilt durch ${e} sind ${w} Zehner. Wie heißt die Zahl?`));
    },
    3: () => {
      const [a, d, q] = suche(() => einmaleins(3, 9, 3, 8), ([x, y, w]) => (w + 1) * y !== x);
      return auswahl(zeilen(`Mia rechnet: ${a} : ${d} = ${q + 1}.`, 'Prüfe mit der Mal-Aufgabe.', 'Was stimmt?'),
        [opt(`Falsch. ${q + 1} · ${d} = ${(q + 1) * d}. Richtig ist ${q}.`, true), opt(`Richtig. ${q + 1} · ${d} = ${a}.`, false, 'div-einmaleins'),
          opt(`Falsch. Richtig ist ${q + 2}.`, false, 'div-einmaleins'), opt(`Richtig. ${a} − ${d} = ${a - d}.`, false, 'div-falsche-rechenart')],
        h3('Die Mal-Aufgabe prüft die Geteilt-Aufgabe: Ergebnis mal zweite Zahl.', '20 : 4 = 6? Prüfe: 6 · 4 = 24. Das ist nicht 20. Also ist 6 falsch.',
          `Rechne ${q + 1} · ${d}. Kommt ${a} heraus?`));
    },
  });

  const schriftlichG = () => suche(() => { const d = zz(2, 9), q = zz(12, 199); return [d * q, d, q]; }, ([a, , q]) => a >= 100 && a <= 1000 && !String(q).includes('0'));
  const ablauf = (a, d) => {
    const s = String(a); let i = 1;
    while (Number(s.slice(0, i)) < d) i++;
    const p = Number(s.slice(0, i)), z = Math.floor(p / d);
    return `Beginne links. Wie oft passt die ${d} in die ${p}? ${z}-mal, denn ${z} · ${d} = ${z * d}. Rechne ${p} − ${z * d} = ${p - z * d}. Hole die nächste Ziffer herunter.`;
  };
  stufen('D2', 'G', {
    1: () => {
      const [a, d, q] = schriftlichG();
      return zahl(zeilen('Dividiere schriftlich.', `${a} : ${d}`), q, fehlerliste(q, [[q * 10, 'div-stellenwert'], [String(q).includes('0') ? Number(String(q).replace(/0/g, '')) : -1, 'div-null-vergessen']]),
        h3('Rechne der Reihe nach: teilen, malnehmen, abziehen, nächste Ziffer herunterholen.', '138 : 6: Die 6 passt 2-mal in die 13. 2 · 6 = 12. 13 − 12 = 1. Hole die 8 herunter: 18 : 6 = 3. Ergebnis 23.', ablauf(a, d)));
    },
    2: (k) => {
      if (k === 0) {
        const d = zz(3, 8), z = zz(1, 9), e = zz(2, 9), a = d * (z * 10 + e);
        const text = zeilen(`Rechne ${a} : ${d} in 2 Schritten.`, `${d * z * 10} : ${d} = {{zehner}}`, `${d * e} : ${d} = {{einer}}`, 'Zusammen: {{ergebnis}}');
        return luecken(text, { zehner: [z * 10, [{ wert: z, fehlvorstellung: 'div-stellenwert' }]], einer: e, ergebnis: z * 10 + e },
          h3(`Die Zahl ${a} wurde zerlegt in ${d * z * 10} und ${d * e}. Teile beide Zahlen einzeln.`, '138 : 6: 120 : 6 = 20 und 18 : 6 = 3. Zusammen 20 + 3 = 23.', `${d * z} : ${d} = ${z}. Also ist ${d * z * 10} : ${d} = ${z * 10}.`));
      }
      const [a, d, q] = schriftlichG();
      if (k === 1) return zahl(zeilen('Welche Zahl fehlt?', `▢ : ${d} = ${q}`), a, fehlerliste(a, [[q + d, 'div-falsche-rechenart']]),
        h3('Rechne rückwärts mit einer Mal-Aufgabe.', '▢ : 4 = 21. Rechne 21 · 4 = 84.', `Rechne ${q} · ${d}. Rechne erst ${q - (q % 10)} · ${d}, dann ${q % 10} · ${d}.`));
      const [x, y] = wahl([[2, 4], [3, 6], [4, 8], [2, 6], [3, 9]]);
      const n = zz(4, 11) * x * y;
      return auswahl(zeilen('Welche Aufgabe hat das größere Ergebnis?', 'Überlege zuerst.', 'Rechne dann nach.'),
        [opt(`${n} : ${x}`, true), opt(`${n} : ${y}`), opt('Beide Ergebnisse sind gleich.')],
        h3('Stell dir vor: Die gleiche Menge wird an wenige oder an viele Kinder verteilt.', '12 : 2 = 6 und 12 : 4 = 3. Bei weniger Kindern bekommt jedes Kind mehr.', `${n} wird einmal durch ${x} geteilt und einmal durch ${y}. Wann bekommt jeder mehr?`));
    },
    3: () => {
      const d = zz(3, 8), h = zz(1, Math.floor(9 / d) || 1), e = zz(2, 9), q = h * 100 + e, a = q * d;
      return auswahl(zeilen(`Ben rechnet: ${a} : ${d} = ${h * 10 + e}.`, 'Was hat Ben falsch gemacht?'),
        [opt(`Er hat die 0 im Ergebnis vergessen. Richtig ist ${q}.`, true), opt('Er hat die Zahlen vertauscht.', false, 'div-vertauscht'),
          opt('Nichts. Das Ergebnis stimmt.', false, 'div-null-vergessen'), opt('Er hat mal gerechnet statt geteilt.', false, 'div-falsche-rechenart')],
        h3('Prüfe mit der Mal-Aufgabe oder mit einem Überschlag.', '412 : 4: Die 4 passt 0-mal in die 1. Dann gehört eine 0 ins Ergebnis: 103.',
          `Rechne ${h * 10 + e} · ${d}. Kommt ${a} heraus? Schau, an welcher Stelle die ${d} nicht hineinpasst.`));
    },
  });

  const schriftlichM = () => suche(() => { const d = zz(3, 9), q = zz(1005, 9909); return [d * q, d, q]; }, ([, , q]) => String(q).includes('0') && q % 10 !== 0);
  stufen('D2', 'M', {
    1: () => {
      const [a, d, q] = schriftlichM();
      return zahl(`Dividiere schriftlich: ${fz(a)} : ${d}`, q, fehlerliste(q, [[Number(String(q).replace(/0/g, '')), 'div-null-vergessen'], [q * 10, 'div-stellenwert']]),
        h2('Passt der Divisor einmal nicht hinein, gehört an diese Stelle eine 0 in den Quotienten.', ablauf(a, d)));
    },
    2: (k) => {
      if (k === 0) {
        const [a, d, q] = schriftlichM();
        return zahl(`Bestimme den fehlenden Dividenden: ▢ : ${d} = ${fz(q)}`, a, fehlerliste(a, [[q + d, 'begriffe-verwechselt']]),
          h2('Die Umkehraufgabe der Division ist die Multiplikation.', `Rechne ${fz(q)} · ${d}.`));
      }
      if (k === 1) {
        const x = zz(4, 8), y = suche(() => zz(3, 9), (v) => v !== x), q = zz(52, 148);
        return zahl(`Dividiere ${fz(q * x * y)} zuerst durch ${x}. Dividiere das Ergebnis dann durch ${y}.`, q, fehlerliste(q, [[q * y, 'sach-schritt-vergessen']]),
          h2('Rechne zwei Divisionen nacheinander. Das erste Ergebnis ist der neue Dividend.', `Erster Schritt: ${fz(q * x * y)} : ${x} = ${fz(q * y)}.`));
      }
      const [x, y] = wahl([[4, 8], [3, 6], [6, 9], [2, 8]]), n = zz(40, 110) * (x * y / (x === 6 && y === 9 ? 3 : x === 4 && y === 8 ? 4 : x === 3 && y === 6 ? 3 : 2));
      return zahl(`Um wie viel ist ${fz(n)} : ${x} größer als ${fz(n)} : ${y}?`, n / x - n / y, fehlerliste(n / x - n / y, [[n / x, 'sach-schritt-vergessen'], [n / y, 'sach-schritt-vergessen']]),
        h2('Berechne beide Quotienten und bilde dann die Differenz.', `Erster Quotient: ${fz(n)} : ${x} = ${fz(n / x)}.`));
    },
    3: () => {
      const d = zz(4, 9), h = zz(3, 9), e = zz(2, 9), q = h * 100 + e, a = q * d;
      return auswahl(`Jana erhält bei ${fz(a)} : ${d} das Ergebnis ${h * 10 + e}. Prüfe mit einem Überschlag und entscheide.`,
        [opt(`Falsch: ${h * 100 * d} : ${d} = ${h * 100}, der Quotient muss dreistellig sein. Richtig ist ${q}.`, true),
          opt(`Richtig: ${h * 10 + e} · ${d} = ${fz(a)}.`, false, 'div-null-vergessen'), opt('Falsch: Der Quotient muss vierstellig sein.', false, 'div-stellenwert'),
          opt('Richtig: Der Überschlag bestätigt ein zweistelliges Ergebnis.', false, 'div-stellenwert')],
        h2('Runde den Dividenden so, dass du im Kopf teilen kannst. Wie viele Stellen hat der Quotient dann?', `Überschlage mit ${h * 100 * d} : ${d}.`));
    },
  });

  const ziffernraetsel = () => suche(() => {
    const d = zz(6, 9), h = zz(2, 9), e = zz(1, 9);
    const passend = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((m) => (h * 100 + m * 10 + e) % d === 0);
    return { d, h, e, passend };
  }, (x) => x.passend.length >= 1);
  stufen('D2', 'E', {
    1: () => {
      const [a, d, q] = suche(() => { const x = zz(6, 9), y = zz(1005, 9909); return [x * y, x, y]; }, ([, , y]) => (String(y).match(/0/g) || []).length >= 1 && y % 10 !== 0);
      return zahl(`Dividiere schriftlich: ${fz(a)} : ${d}`, q, fehlerliste(q, [[Number(String(q).replace(/0/g, '')), 'div-null-vergessen'], [q * 10, 'div-stellenwert']]),
        h1('Wie viele Stellen muss der Quotient nach einem Überschlag haben?'));
    },
    2: (k) => {
      if (k === 0) {
        const r = suche(ziffernraetsel, (x) => x.passend.length === 1);
        return zahl(`Bei einer Division wurde gekleckert: ${r.h}▢${r.e} : ${r.d}. Welche Ziffer muss in der Lücke stehen, damit die Division ohne Rest aufgeht?`, r.passend[0], [],
          h1(`Welche Vielfachen von ${r.d} liegen zwischen ${r.h}00 und ${r.h}99 und enden auf ${r.e}?`));
      }
      if (k === 1) {
        const r = suche(ziffernraetsel, (x) => x.passend.length >= 2);
        return zahl(`Die Zahl ${r.h}▢${r.e} soll ohne Rest durch ${r.d} teilbar sein. Wie viele verschiedene Ziffern kommen für die Lücke in Frage?`, r.passend.length, fehlerliste(r.passend.length, [[1, 'teilbar-summe']]),
          h1(`Wenn du eine passende Zahl gefunden hast: Um wie viel musst du sie verändern, damit sie wieder durch ${r.d} teilbar ist und die Einerziffer gleich bleibt?`));
      }
      const d = zz(6, 9);
      const [text, loesung] = wahl([[`Bestimme die kleinste vierstellige Zahl, die ohne Rest durch ${d} teilbar ist.`, Math.ceil(1000 / d) * d],
        [`Bestimme die größte dreistellige Zahl, die ohne Rest durch ${d} teilbar ist.`, Math.floor(999 / d) * d]]);
      return zahl(text, loesung, [], h1('Welchen Rest lässt die Grenze selbst, also 1000 oder 999?'));
    },
    3: () => {
      const d = zz(6, 9), m = zz(3, 5) * d;
      return auswahl(`Jonas behauptet: „Wenn ich zu einer Zahl, die ohne Rest durch ${d} teilbar ist, die Zahl ${m} addiere, ist das Ergebnis wieder ohne Rest durch ${d} teilbar.“ Beurteile, ohne eine bestimmte Zahl auszurechnen.`,
        [opt(`Stimmt immer, weil ${m} = ${m / d} · ${d} selbst ein Vielfaches von ${d} ist.`, true), opt('Stimmt nur manchmal: Es hängt von der Ausgangszahl ab.', false, 'teilbar-summe'),
          opt('Stimmt nie: Durch das Addieren entsteht ein Rest.', false, 'teilbar-summe'), opt(`Stimmt immer, weil jede Zahl plus ${m} durch ${d} teilbar ist.`, false, 'teilbar-summe')],
        h1(`Stell dir ${d}er-Päckchen vor. Was geschieht, wenn du weitere volle Päckchen dazulegst?`));
    },
  });

  // ===================================================================
  // D3 Dividieren durch zweistellige Zahlen
  // F: durch 10. G: durch Zehnerzahlen, ohne Rest. M: schriftlich. E: Strukturen.
  // ===================================================================
  stufen('D3', 'F', {
    1: () => {
      const q = wahl([zz(2, 9), zz(2, 9), zz(1, 9) * 10]), a = q * 10;
      return zahl(zeilen('Rechne.', `${a} : 10`), q, fehlerliste(q, [[a, 'div-stellenwert'], [q * 100, 'div-stellenwert']]),
        h3(`${a} sind ${q} Zehner. Zeichne für jeden Zehner einen Strich auf dein Schmierblatt.`, '70 : 10 = 7. In 70 stecken 7 Zehner.', `Wie viele Zehner stecken in ${a}? Zähle in Zehnerschritten bis ${a}.`));
    },
    2: (k) => {
      const q = zz(2, 9);
      if (k === 0) return zahl(zeilen('Welche Zahl fehlt?', `▢ : 10 = ${q}`), q * 10, fehlerliste(q * 10, [[q, 'div-stellenwert'], [q + 10, 'div-falsche-rechenart']]),
        h3('Rechne rückwärts mit einer Mal-Aufgabe.', '▢ : 10 = 4. Rechne 4 · 10 = 40.', `Rechne ${q} · 10.`));
      if (k === 1) {
        const [ding] = wahl([['Sticker'], ['Murmeln'], ['Karten']]);
        return zahl(zeilen(`10 Kinder teilen ${q * 10} ${ding} gerecht.`, `Wie viele ${ding} bekommt 1 Kind?`), q, fehlerliste(q, [[q * 10 - 10, 'div-falsche-rechenart']]),
          h3(`Verteile ${q * 10} Plättchen an 10 Plätze. Jeder Platz bekommt gleich viele.`, '10 Kinder teilen 30 Sticker. 30 : 10 = 3. Jedes Kind bekommt 3.', `Rechne ${q * 10} : 10.`), ding);
      }
      return zahl(zeilen(`${q * 10} : 10 = ${q}`, `Wie viel ist ${q * 100} : 10?`), q * 10, fehlerliste(q * 10, [[q, 'div-stellenwert'], [q * 100, 'div-stellenwert']]),
        h3(`${q * 100} sind ${q * 10} Zehner.`, '50 : 10 = 5. Dann ist 500 : 10 = 50.', `In ${q * 100} stecken ${q * 10} Zehner. Das ist das Ergebnis.`));
    },
    3: () => {
      const a = zz(3, 9) * 10, b = zz(2, 9) * 100;
      return auswahl(zeilen('Ali sagt:', '„Teile ich eine Zehnerzahl durch 10, fällt eine Null weg.“', `Prüfe mit ${a} : 10 und ${b} : 10.`, 'Stimmt das?'),
        [opt(`Ja. ${a} : 10 = ${a / 10} und ${b} : 10 = ${b / 10}.`, true), opt(`Nein. ${a} : 10 = ${a}.`, false, 'div-stellenwert'),
          opt(`Nein. ${b} : 10 = ${b / 100}.`, false, 'div-stellenwert'), opt(`Ja. ${a} : 10 = ${a * 10}.`, false, 'div-falsche-rechenart')],
        h3('Rechne beide Aufgaben aus. Vergleiche die Zahlen vorher und nachher.', '40 : 10 = 4. Aus 40 wird 4. Eine Null ist weg.', `In ${a} stecken ${a / 10} Zehner. In ${b} stecken ${b / 10} Zehner.`));
    },
  });

  const zehnerG = () => suche(() => { const d = zz(2, 9) * 10, q = zz(2, 30); return [d * q, d, q]; }, ([a, , q]) => a <= 1000 && q % 10 !== 0);
  stufen('D3', 'G', {
    1: () => {
      const [a, d, q] = zehnerG();
      return zahl(zeilen('Rechne.', `${a} : ${d}`), q, fehlerliste(q, [[q * 10, 'div-stellenwert']]),
        h3(`Teile erst durch 10. Teile dann durch ${d / 10}.`, '180 : 20: 180 : 10 = 18. Dann 18 : 2 = 9.', `${a} : 10 = ${a / 10}. Rechne jetzt ${a / 10} : ${d / 10}.`));
    },
    2: (k) => {
      const [a, d, q] = zehnerG();
      if (k === 0) return luecken(zeilen(`Rechne ${a} : ${d} in 2 Schritten.`, `${a} : 10 = {{erst}}`, `Dann geteilt durch ${d / 10}: {{dann}}`),
        { erst: a / 10, dann: [q, [{ wert: q * 10, fehlvorstellung: 'div-stellenwert' }]] },
        h3(`Durch ${d} teilen heißt: erst durch 10, dann durch ${d / 10}.`, '240 : 30: 240 : 10 = 24. Dann 24 : 3 = 8.', `${a} : 10 = ${a / 10}. Bei geteilt durch 10 fällt die letzte Null weg.`));
      if (k === 1) return zahl(zeilen('Welche Zahl fehlt?', `▢ : ${d} = ${q}`), a, fehlerliste(a, [[q * d / 10, 'div-stellenwert']]),
        h3('Rechne rückwärts mit einer Mal-Aufgabe.', '▢ : 20 = 6. Rechne 6 · 20 = 120.', `Rechne ${q} · ${d}. Rechne erst ${q} · ${d / 10}, hänge dann eine 0 an.`));
      return zahl(zeilen(`${d} Kinder zahlen zusammen ${a} € für einen Ausflug.`, 'Alle zahlen gleich viel.', 'Wie viel Euro zahlt 1 Kind?'), q, fehlerliste(q, [[a - d, 'div-falsche-rechenart'], [q * 10, 'div-stellenwert']]),
        h3('Das Geld wird gerecht aufgeteilt. Du musst teilen.', '20 Kinder zahlen zusammen 100 €. 100 : 20 = 5. Jedes Kind zahlt 5 €.', `Rechne ${a} : ${d}. Teile erst durch 10, dann durch ${d / 10}.`), '€');
    },
    3: () => {
      const [d, q] = suche(() => [zz(2, 6) * 10, zz(2, 9) * 10], ([x, y]) => x * y <= 1000), a = d * q;
      return auswahl(zeilen(`Emma rechnet: ${a} : ${d} = ${q / 10}.`, 'Prüfe mit der Mal-Aufgabe.', 'Was stimmt?'),
        [opt(`Falsch. ${q / 10} · ${d} = ${q / 10 * d}. Richtig ist ${q}.`, true), opt(`Richtig. ${q / 10} · ${d} = ${a}.`, false, 'div-stellenwert'),
          opt(`Falsch. Richtig ist ${q * 10}.`, false, 'div-stellenwert'), opt('Richtig. Bei Zehnerzahlen fallen alle Nullen weg.', false, 'div-stellenwert')],
        h3('Die Mal-Aufgabe prüft: Ergebnis mal zweite Zahl muss die erste Zahl ergeben.', '600 : 20 = 3? Prüfe: 3 · 20 = 60. Das ist nicht 600. Richtig ist 30.', `Rechne ${q / 10} · ${d}. Kommt ${a} heraus?`));
    },
  });

  const zweistelligM = () => suche(() => { const d = zz(12, 48), q = zz(104, 480); return [d * q, d, q]; }, ([, d]) => d % 10 !== 0);
  stufen('D3', 'M', {
    1: () => {
      const [a, d, q] = zweistelligM();
      return zahl(`Dividiere schriftlich: ${fz(a)} : ${d}`, q, fehlerliste(q, [[q * 10, 'div-stellenwert'], [String(q).includes('0') ? Number(String(q).replace(/0/g, '')) : -1, 'div-null-vergessen']]),
        h2(`Notiere dir zuerst die Reihe ${d}, ${2 * d}, ${3 * d}, … am Rand. Sie hilft bei jedem Schritt.`, ablauf(a, d)));
    },
    2: (k) => {
      if (k === 0) {
        const [a, d, q] = zweistelligM();
        return zahl(`Bestimme den fehlenden Dividenden: ▢ : ${d} = ${q}`, a, fehlerliste(a, [[q + d, 'begriffe-verwechselt']]),
          h2('Die Umkehraufgabe der Division ist die Multiplikation.', `Rechne ${q} · ${d}.`));
      }
      if (k === 1) {
        const x = zz(3, 8), y = zz(11, 15), q = zz(104, 260);
        return zahl(`Dividiere ${fz(q * x * y)} durch das Produkt aus ${x} und ${y}.`, q, fehlerliste(q, [[q * y, 'sach-schritt-vergessen'], [q * x, 'sach-schritt-vergessen']]),
          h2('Berechne zuerst das Produkt. Es ist der Divisor.', `Das Produkt ist ${x} · ${y} = ${x * y}.`));
      }
      const [a, d, q] = suche(zweistelligM, ([, x]) => x >= 21 && (x % 10 >= 8 || x % 10 <= 2));
      const dr = Math.round(d / 10) * 10, ar = dr * Math.round(q / 10) * 10;
      return auswahl(`Welcher Überschlag passt am besten zu ${fz(a)} : ${d}?`,
        [opt(`${fz(ar)} : ${dr} = ${ar / dr}`, true), opt(`${fz(ar)} : 10 = ${ar / 10}`, false, 'div-stellenwert'),
          opt(`${fz(ar * 10)} : ${dr} = ${ar * 10 / dr}`, false, 'div-stellenwert'), opt(`${fz(ar)} : 100 = ${ar / 100}`, false, 'div-stellenwert')],
        h2('Runde den Divisor auf Zehner. Runde den Dividenden so, dass die Division glatt aufgeht.', `Der Divisor ${d} wird zu ${dr}. Der genaue Quotient ist ${q}.`));
    },
    3: () => {
      const d = zz(12, 28), h = zz(2, 4), e = zz(3, 9), q = h * 100 + e, a = q * d;
      return auswahl(`Tom erhält bei ${fz(a)} : ${d} das Ergebnis ${h * 10 + e}. Prüfe mit einem Überschlag und entscheide.`,
        [opt(`Falsch: ${fz(h * 100 * d)} : ${d} = ${h * 100}, der Quotient muss dreistellig sein. Richtig ist ${q}.`, true),
          opt(`Richtig: ${h * 10 + e} · ${d} = ${fz(a)}.`, false, 'div-null-vergessen'), opt('Falsch: Der Quotient muss vierstellig sein.', false, 'div-stellenwert'),
          opt('Richtig: Bei einem zweistelligen Divisor ist auch der Quotient zweistellig.', false, 'div-stellenwert')],
        h2('Wie oft passt der Divisor ungefähr in den Dividenden? Schätze mit glatten Zahlen.', `Überschlage mit ${fz(h * 100 * d)} : ${d}.`));
    },
  });

  const teiler = { 12: [[3, 4], 24, 8], 15: [[3, 5], 30, 10], 18: [[2, 9], 36, 12], 20: [[4, 5], 40, 8] };
  stufen('D3', 'E', {
    1: () => {
      const [a, d, q] = suche(() => { const x = zz(26, 79), y = zz(1004, 4090); return [x * y, x, y]; }, ([, x, y]) => x % 10 !== 0 && String(y).includes('0') && y % 10 !== 0);
      return zahl(`Dividiere schriftlich: ${fz(a)} : ${d}`, q, fehlerliste(q, [[Number(String(q).replace(/0/g, '')), 'div-null-vergessen'], [q * 10, 'div-stellenwert']]),
        h1('Wie viele Stellen muss der Quotient nach einem Überschlag haben?'));
    },
    2: (k) => {
      if (k === 0) {
        const d = zz(6, 24) * 2, q = zz(25, 125);
        return zahl(`Es gilt ${fz(d * q)} : ${d} = ${q}. Bestimme ohne schriftliche Rechnung: ${fz(d * q)} : ${d / 2}`, 2 * q, fehlerliste(2 * q, [[q % 2 === 0 ? q / 2 : -1, 'div-stellenwert'], [q, 'div-stellenwert']]),
          h1('Der Divisor ist nur noch halb so groß. Wie oft passt er dann hinein?'));
      }
      if (k === 1) {
        const [d, unten] = suche(() => [wahl([13, 14, 15, 16, 17, 18]), zz(20, 60) * 10], ([x, u]) => u % x !== 0), m = Math.ceil((unten + 1) / d) * d;
        return zahl(`Genau eine Zahl zwischen ${unten} und ${unten + d} ist ohne Rest durch ${d} teilbar. Welche?`, m, [],
          h1(`Welchen Rest lässt ${unten} bei Division durch ${d}? Wie viel fehlt bis zum nächsten Vielfachen?`));
      }
      const d = zz(12, 19), q = zz(21, 48);
      return zahl(`Eine Zahl ergibt bei Division durch ${d} den Quotienten ${q} und den größtmöglichen Rest. Wie heißt die Zahl?`, d * q + d - 1, fehlerliste(d * q + d - 1, [[d * q, 'div-rest-vergessen'], [d * q + d, 'div-rest-zu-gross']]),
        h1(`Wie groß kann ein Rest bei Division durch ${d} höchstens sein?`));
    },
    3: () => {
      const d = wahl(Object.keys(teiler).map(Number)), [[x, y], doppelt, anders] = teiler[d];
      return auswahl(`Eine Zahl ist ohne Rest durch ${d} teilbar. Welche Aussage gilt dann immer?`,
        [opt(`Sie ist auch durch ${x} und durch ${y} teilbar.`, true), opt(`Sie ist auch durch ${doppelt} teilbar.`, false, 'teilbar-summe'),
          opt(`Sie ist auch durch ${anders} teilbar.`, false, 'teilbar-summe'), opt('Sie ist größer als 100.')],
        h1(`Prüfe jede Aussage an der Zahl ${d} selbst.`));
    },
  });

  // ===================================================================
  // D4 Division mit Rest
  // F: handelnd im Zahlenraum bis 40. G: Rest im kleinen Einmaleins. M: Rest deuten. E: Reste untersuchen.
  // ===================================================================
  const restF = () => mitRest(2, 5, 2, 6);
  stufen('D4', 'F', {
    1: (k) => {
      const [a, d, q, r] = restF();
      if (k === 0) return zahl(zeilen(`Du hast ${a} Plättchen.`, `Du legst immer ${d} zusammen.`, 'Wie viele Plättchen bleiben übrig?'), r, fehlerliste(r, [[q, 'div-rest-vergessen'], [0, 'div-rest-vergessen']]),
        h3(`Nimm ${a} Wendeplättchen. Lege ${d}er-Häufchen. Was nicht mehr für ein Häufchen reicht, bleibt übrig.`, '14 Plättchen, immer 4 zusammen: 3 Häufchen sind 12 Plättchen. 2 bleiben übrig.',
          `${q} Häufchen sind ${q} · ${d} = ${q * d} Plättchen. Wie viele fehlen bis ${a}?`), 'Plättchen');
      return luecken(`${a} : ${d} = {{q}} Rest {{r}}`, { q: [q, [{ wert: q + 1, fehlvorstellung: 'div-einmaleins' }]], r: [r, [{ wert: r + d, fehlvorstellung: 'div-rest-zu-gross' }]] },
        h3(`Suche in der ${d}er-Reihe die größte Zahl, die noch in die ${a} passt.`, '17 : 5: 3 · 5 = 15 passt. Bis 17 fehlen 2. Also 3 Rest 2.',
          `${q} · ${d} = ${q * d}. Das passt in die ${a}. Wie viel bleibt übrig?`));
    },
    2: (k) => {
      const [a, d, q, r] = restF();
      if (k === 0) return zahl(zeilen('Welche Zahl fehlt?', `▢ : ${d} = ${q} Rest ${r}`), a, fehlerliste(a, [[q * d, 'div-rest-vergessen']]),
        h3('Rechne rückwärts: erst mal, dann den Rest dazu.', '▢ : 3 = 4 Rest 1. Rechne 4 · 3 = 12. Dann 12 + 1 = 13.', `Rechne ${q} · ${d} = ${q * d}. Zähle dann den Rest ${r} dazu.`));
      if (k === 1) return zahl(zeilen(`${a} Kinder bilden ${d}er-Gruppen.`, 'Wie viele Kinder bleiben übrig?'), r, fehlerliste(r, [[q, 'div-rest-vergessen']]),
        h3(`Zeichne ${a} Kreise auf dein Schmierblatt. Kreise immer ${d} ein.`, '13 Kinder, 4er-Gruppen: 3 Gruppen sind 12 Kinder. 1 Kind bleibt übrig.', `${q} Gruppen sind ${q * d} Kinder. Wie viele Kinder sind noch nicht in einer Gruppe?`), 'Kinder');
      const t = zz(3, 5), basis = zz(2, 5) * t;
      return auswahl(zeilen('Bei welcher Aufgabe bleibt ein Rest?'), [opt(`${basis + zz(1, t - 1)} : ${t}`, true), opt(`${basis} : ${t}`), opt(`${basis + t} : ${t}`), opt(`${basis + 2 * t} : ${t}`)],
        h3(`Sage die ${t}er-Reihe auf. Welche Zahl kommt in der Reihe nicht vor?`, 'Die 3er-Reihe: 3, 6, 9, 12. Die 10 kommt nicht vor. Bei 10 : 3 bleibt ein Rest.', `Die ${t}er-Reihe: ${Array.from({ length: 8 }, (_, i) => (i + 1) * t).join(', ')}.`));
    },
    3: () => {
      const [a, d, q, r] = suche(restF, ([, , w]) => w >= 3);
      return auswahl(zeilen(`Paul rechnet: ${a} : ${d} = ${q - 1} Rest ${r + d}.`, 'Was stimmt?'),
        [opt(`Falsch. Der Rest ${r + d} ist zu groß. Die ${d} passt noch 1-mal hinein. Richtig ist ${q} Rest ${r}.`, true),
          opt(`Richtig. ${q - 1} · ${d} + ${r + d} = ${a}.`, false, 'div-rest-zu-gross'), opt(`Falsch. Richtig ist ${q + 1} Rest ${r}.`, false, 'div-einmaleins'),
          opt('Falsch. Beim Teilen gibt es nie einen Rest.', false, 'div-rest-vergessen')],
        h3('Der Rest muss kleiner sein als die Zahl, durch die du teilst.', '14 : 4 = 2 Rest 6? Der Rest 6 ist größer als 4. Es passt noch ein Häufchen. Richtig ist 3 Rest 2.',
          `Paul hat ${r + d} Plättchen übrig. Kann er daraus noch ein ${d}er-Häufchen legen?`));
    },
  });

  const restG = () => mitRest(3, 9, 3, 9);
  stufen('D4', 'G', {
    1: () => {
      const [a, d, q, r] = restG();
      return luecken(`${a} : ${d} = {{q}} Rest {{r}}`, { q: [q, [{ wert: q + 1, fehlvorstellung: 'div-einmaleins' }]], r: [r, [{ wert: r + d, fehlvorstellung: 'div-rest-zu-gross' }]] },
        h3(`Suche in der ${d}er-Reihe die größte Zahl, die noch in die ${a} passt.`, '47 : 6: 7 · 6 = 42 passt. Bis 47 fehlen 5. Also 7 Rest 5.', `${q} · ${d} = ${q * d}. Rechne ${a} − ${q * d}.`));
    },
    2: (k) => {
      const [a, d, q, r] = restG();
      if (k === 0) return zahl(zeilen('Welche Zahl fehlt?', `▢ : ${d} = ${q} Rest ${r}`), a, fehlerliste(a, [[q * d, 'div-rest-vergessen']]),
        h3('Mache die Probe: Ergebnis mal Teiler, dann den Rest dazu.', '▢ : 6 = 7 Rest 5. Rechne 7 · 6 = 42. Dann 42 + 5 = 47.', `Rechne ${q} · ${d} = ${q * d}. Zähle den Rest ${r} dazu.`));
      if (k === 1) {
        const [ding, platz] = wahl([['Eier', 'Karton'], ['Flaschen', 'Kasten'], ['Stifte', 'Dose']]);
        return zahl(zeilen(`Es gibt ${a} ${ding}.`, `In 1 ${platz} passen ${d} ${ding}.`, `Wie viele ${platz === 'Dose' ? 'Dosen' : platz === 'Kasten' ? 'Kästen' : 'Kartons'} werden ganz voll?`), q,
          fehlerliste(q, [[q + 1, 'div-rest-nicht-gedeutet'], [r, 'div-rest-vergessen']]),
          h3(`Teile ${a} durch ${d}. Nur volle ${platz === 'Dose' ? 'Dosen' : platz === 'Kasten' ? 'Kästen' : 'Kartons'} zählen.`, '50 Eier, 6 in einem Karton: 50 : 6 = 8 Rest 2. 8 Kartons werden voll. 2 Eier bleiben übrig.', `Rechne ${a} : ${d} = ${q} Rest ${r}. Der Rest füllt nichts ganz.`));
      }
      const t = zz(4, 8);
      return auswahl(zeilen(`Du teilst durch ${t}.`, 'Welcher Rest ist nicht möglich?'), [opt(String(t), true, undefined), opt(String(t - 1), false, 'div-rest-zu-gross'), opt('1', false, 'div-rest-zu-gross'), opt(String(t - 2), false, 'div-rest-zu-gross')],
        h3('Der Rest ist immer kleiner als die Zahl, durch die du teilst.', `Bleiben beim Teilen durch 4 noch 4 übrig, passt die 4 noch einmal hinein. Dann ist der Rest 0.`, `Kann beim Teilen durch ${t} genau ${t} übrig bleiben?`));
    },
    3: () => {
      const [a, d, q, r] = suche(restG, ([, , w]) => w >= 4);
      return auswahl(zeilen(`Nina rechnet: ${a} : ${d} = ${q - 1} Rest ${r + d}.`, 'Was stimmt?'),
        [opt(`Falsch. Der Rest ${r + d} ist größer als ${d}. Richtig ist ${q} Rest ${r}.`, true), opt(`Richtig. Die Probe stimmt: ${q - 1} · ${d} + ${r + d} = ${a}.`, false, 'div-rest-zu-gross'),
          opt(`Falsch. Richtig ist ${q + 1} Rest ${r}.`, false, 'div-einmaleins'), opt('Richtig. Der Rest darf beliebig groß sein.', false, 'div-rest-zu-gross')],
        h3('Vergleiche den Rest mit der Zahl, durch die geteilt wird.', '58 : 7 = 7 Rest 9? Der Rest 9 ist größer als 7. Richtig ist 8 Rest 2.', `Der Rest ist ${r + d}. Passt die ${d} noch einmal hinein?`));
    },
  });

  const restM = () => suche(() => mitRest(6, 24, 12, 48), ([a, d]) => a >= 100 && d % 10 !== 0);
  const kontexteAuf = [ // der Rest braucht einen weiteren Behälter: aufrunden
    (a, d) => [`${a} Muffins sollen in Schachteln verpackt werden. In jede Schachtel passen genau ${d} Muffins.`, 'Wie viele Schachteln werden vollständig gefüllt?', 'Schachteln', 'Wie viele Muffins bleiben übrig?', 'Muffins', 'Wie viele Schachteln werden insgesamt benötigt, damit alle Muffins eingepackt sind?'],
    (a, d) => [`${a} Kinder fahren mit Kleinbussen ins Schullandheim. In jeden Kleinbus passen ${d} Kinder.`, 'Wie viele Kleinbusse sind voll besetzt?', 'Kleinbusse', 'Wie viele Kinder sitzen im letzten Bus?', 'Kinder', 'Wie viele Kleinbusse werden insgesamt gebraucht?'],
    (a, d) => [`${a} Bücher werden in Kisten gepackt. In jede Kiste passen ${d} Bücher.`, 'Wie viele Kisten werden ganz voll?', 'Kisten', 'Wie viele Bücher bleiben übrig?', 'Bücher', 'Wie viele Kisten braucht man, damit alle Bücher verpackt sind?'],
  ];
  const kontexteAb = [ // der Rest reicht nicht für ein weiteres Stück: abrunden
    (a, d) => [`Aus einem ${a} cm langen Brett sollen Regalbretter von je ${d} cm Länge gesägt werden. Wie viele Regalbretter erhält man?`, 'Regalbretter'],
    (a, d) => [`Ein Armband braucht ${d} Perlen. Lina hat ${a} Perlen. Wie viele vollständige Armbänder kann sie fädeln?`, 'Armbänder'],
    (a, d) => [`Eine Eintrittskarte kostet ${d} €. Die Klassenkasse enthält ${a} €. Wie viele Karten kann die Klasse höchstens kaufen?`, 'Karten'],
  ];
  stufen('D4', 'M', {
    1: () => {
      const [a, d, q, r] = restM();
      return luecken(`${fz(a)} : ${d} = {{q}} Rest {{r}}`, { q: [q, [{ wert: q + 1, fehlvorstellung: 'div-rest-nicht-gedeutet' }]], r: [r, [{ wert: 0, fehlvorstellung: 'div-rest-vergessen' }]] },
        h2('Der Rest ist das, was nach dem letzten Abziehen übrig bleibt. Er ist kleiner als der Divisor.', ablauf(a, d)));
    },
    2: (k) => {
      const [a, d, q, r] = restM();
      if (k === 0) {
        const [text, f1, e1, f2, e2] = kontexteAuf[zz(0, 2)](a, d);
        return { format: 'sachaufgabe', text, teile: [teil(f1, q, e1, fehlerliste(q, [[q + 1, 'div-rest-nicht-gedeutet']])), teil(f2, r, e2, fehlerliste(r, [[0, 'div-rest-vergessen']]))],
          hilfen: h2('Dividiere mit Rest. Der Quotient und der Rest beantworten je eine Frage.', `Rechne ${fz(a)} : ${d}. Der Quotient ist ${q}.`) };
      }
      if (k === 1) {
        const [text, , e1, , , f3] = kontexteAuf[zz(0, 2)](a, d);
        return zahl(`${text} ${f3}`, q + 1, fehlerliste(q + 1, [[q, 'div-rest-nicht-gedeutet'], [r, 'div-rest-vergessen']]),
          h2('Rechne zuerst mit Rest. Überlege dann: Was geschieht mit dem Rest?', `${fz(a)} : ${d} = ${q} Rest ${r}. Der Rest braucht auch noch Platz.`), e1);
      }
      const [text, einheit] = kontexteAb[zz(0, 2)](a, d);
      return zahl(text, q, fehlerliste(q, [[q + 1, 'div-rest-nicht-gedeutet'], [r, 'div-rest-vergessen']]),
        h2('Rechne zuerst mit Rest. Überlege dann: Reicht der Rest für ein weiteres Stück?', `${fz(a)} : ${d} = ${q} Rest ${r}. Der Rest reicht nicht für ein weiteres Stück.`), einheit);
    },
    3: () => {
      const [a, d, q, r] = suche(() => mitRest(28, 52, 3, 8), ([, x, , rest]) => rest > x / 2);
      return auswahl(`${a} Kinder fahren mit Bussen zum Wandertag. Ein Bus hat ${d} Plätze. Lars rechnet ${a} : ${d} = ${q} Rest ${r} und bestellt ${q} Busse. Beurteile seine Entscheidung.`,
        [opt(`Falsch: ${r} Kinder hätten keinen Platz. Es werden ${q + 1} Busse gebraucht.`, true), opt(`Richtig: ${q} Busse sind voll, das genügt.`, false, 'div-rest-nicht-gedeutet'),
          opt(`Falsch: Es werden ${r} Busse gebraucht.`, false, 'div-rest-vergessen'), opt('Richtig: Bei Sachaufgaben lässt man den Rest weg.', false, 'div-rest-nicht-gedeutet')],
        h2('Was bedeutet der Rest in dieser Situation? Wer oder was ist das?', `Der Rest ${r} steht für ${r} Kinder, die in den ${q} Bussen keinen Platz finden.`));
    },
  });

  stufen('D4', 'E', {
    1: () => {
      const [a, d, q, r] = suche(() => mitRest(13, 48, 105, 480), ([, x]) => x % 10 !== 0);
      return luecken(`${fz(a)} : ${d} = {{q}} Rest {{r}}`, { q: [q, []], r: [r, [{ wert: 0, fehlvorstellung: 'div-rest-vergessen' }]] },
        h1('Wie kannst du dein Ergebnis mit einer Probe sichern?'));
    },
    2: (k) => {
      const d = zz(6, 9), r = zz(2, d - 1);
      if (k === 0) {
        const m = Math.floor((999 - r) / d) * d + r;
        return zahl(`Bestimme die größte dreistellige Zahl, die bei Division durch ${d} den Rest ${r} lässt.`, m, fehlerliste(m, [[Math.floor(999 / d) * d, 'div-rest-vergessen']]),
          h1(`Suche zuerst das größte dreistellige Vielfache von ${d}. Was musst du noch beachten?`));
      }
      if (k === 1) {
        const f = wahl([2, 3]);
        return zahl(`Eine Zahl lässt bei Division durch ${d} den Rest ${r}. Welchen Rest lässt das ${f === 2 ? 'Doppelte' : 'Dreifache'} dieser Zahl bei Division durch ${d}?`, (f * r) % d,
          fehlerliste((f * r) % d, [[f * r, 'div-rest-zu-gross'], [r, 'teilbar-summe']]),
          h1(`Schreibe die Zahl als „Vielfaches von ${d} plus ${r}“. Was geschieht mit beiden Teilen?`));
      }
      const bis = wahl([50, 60, 80]);
      const anzahl = Array.from({ length: bis }, (_, i) => i + 1).filter((n) => n % d === r).length;
      return zahl(`Wie viele natürliche Zahlen von 1 bis ${bis} lassen bei Division durch ${d} den Rest ${r}?`, anzahl, fehlerliste(anzahl, [[Math.floor(bis / d), 'div-rest-vergessen']]),
        h1(`Die kleinste solche Zahl ist ${r}. In welchen Abständen folgen die nächsten?`));
    },
    3: () => {
      const d = zz(5, 9), r = zz(2, d - 1), m = zz(2, 4) * d;
      return auswahl(`Eine Zahl lässt bei Division durch ${d} den Rest ${r}. Jonas addiert ${m} zu dieser Zahl. Welche Aussage über den neuen Rest bei Division durch ${d} stimmt?`,
        [opt(`Der Rest bleibt ${r}, weil ${m} ein Vielfaches von ${d} ist.`, true), opt(`Der Rest wird ${r + m}.`, false, 'div-rest-zu-gross'),
          opt(`Der Rest wird 0, weil ${m} durch ${d} teilbar ist.`, false, 'teilbar-summe'), opt('Das hängt von der Ausgangszahl ab.', false, 'teilbar-summe')],
        h1(`Stell dir ${d}er-Päckchen und ${r} einzelne Teile vor. Was kommt durch die ${m} hinzu?`));
    },
  });

  // ===================================================================
  // D5 Überschlag und Probe
  // F: Probe mit der Mal-Aufgabe. G: Probe und Überschlag mit Hundertern. M und E: beides gezielt einsetzen und bewerten.
  // ===================================================================
  stufen('D5', 'F', {
    1: (k) => {
      const [a, d, q] = suche(() => einmaleins(), ([, x, y]) => x !== y);
      const hilfen = h3('Zu jeder Geteilt-Aufgabe gehört eine Mal-Aufgabe: Ergebnis mal zweite Zahl.', '28 : 4 = 7. Die Probe ist 7 · 4 = 28.', `Die Probe beginnt mit dem Ergebnis ${q}. Rechne ${q} · ${d}.`);
      return k === 0
        ? auswahl(zeilen(`${a} : ${d} = ${q}`, 'Welche Mal-Aufgabe ist die Probe?'), [opt(`${q} · ${d} = ${a}`, true), opt(`${a} · ${d} = ${q}`, false, 'probe-falsche-umkehr'),
          opt(`${a} · ${q} = ${d}`, false, 'probe-falsche-umkehr'), opt(`${q} + ${d} = ${q + d}`, false, 'probe-falsche-umkehr')], hilfen)
        : zahl(zeilen('Mache die Probe.', `${a} : ${d} = ${q}`, `${q} · ${d} = ▢`), a, fehlerliste(a, [[q + d, 'div-falsche-rechenart']]), hilfen);
    },
    2: (k) => {
      const [a, d, q] = suche(() => einmaleins(3, 9, 3, 9), ([, x, y]) => x !== y);
      if (k === 0) return auswahl(zeilen(`Die Probe ist ${q} · ${d} = ${a}.`, 'Welche Geteilt-Aufgabe wurde geprüft?'),
        [opt(`${a} : ${d} = ${q}`, true), opt(`${q} : ${d} = ${a}`, false, 'div-vertauscht'), opt(`${d} : ${a} = ${q}`, false, 'div-vertauscht'), opt(`${a} : ${d} = ${a}`)],
        h3('Bei der Geteilt-Aufgabe steht die größte Zahl vorn.', 'Probe 8 · 3 = 24. Geprüft wurde 24 : 3 = 8.', `Die größte Zahl ist ${a}. Sie wird geteilt.`));
      if (k === 1) return auswahl(zeilen('Welche Rechnung ist richtig?', 'Prüfe mit der Mal-Aufgabe.'),
        [opt(`${a} : ${d} = ${q}`, true), opt(`${a} : ${d} = ${q + 1}`, false, 'div-einmaleins'), opt(`${a} : ${d} = ${q - 1}`, false, 'div-einmaleins'), opt(`${a} : ${d} = ${q + 2}`, false, 'div-einmaleins')],
        h3('Rechne zu jeder Antwort die Mal-Aufgabe: Ergebnis mal zweite Zahl.', '42 : 6 = 7? Probe: 7 · 6 = 42. Das stimmt.', `Bei der richtigen Antwort ergibt Ergebnis mal ${d} genau ${a}.`));
      const e = zz(2, 5), grenze = 10, wert = wahl([zz(11, 19), zz(3, 9)]) * e;
      return auswahl(zeilen(`${wert} : ${e}`, `Ist das Ergebnis größer oder kleiner als ${grenze}?`, 'Überlege mit der Mal-Aufgabe.'),
        [opt(`größer als ${grenze}`, wert > grenze * e), opt(`kleiner als ${grenze}`, wert < grenze * e), opt(`genau ${grenze}`)],
        h3(`Rechne ${grenze} · ${e}. Vergleiche mit ${wert}.`, '80 : 4: 10 · 4 = 40. 80 ist mehr als 40. Das Ergebnis ist größer als 10.', `${grenze} · ${e} = ${grenze * e}. Ist ${wert} mehr oder weniger?`));
    },
    3: () => {
      const [a, d, q] = suche(() => einmaleins(3, 9, 4, 9), ([, x, y]) => x !== y);
      return auswahl(zeilen(`Lena rechnet: ${a} : ${d} = ${q - 1}.`, `Sie macht die Probe: ${q - 1} · ${d} = ${(q - 1) * d}.`, 'Was zeigt die Probe?'),
        [opt(`${(q - 1) * d} ist nicht ${a}. Das Ergebnis ${q - 1} ist falsch. Richtig ist ${q}.`, true), opt(`Die Probe passt. ${q - 1} ist richtig.`, false, 'probe-falsche-umkehr'),
          opt(`Die Probe ist falsch gerechnet. ${q - 1} · ${d} = ${a}.`, false, 'div-einmaleins'), opt('Mit einer Mal-Aufgabe kann man nicht prüfen.', false, 'probe-falsche-umkehr')],
        h3('Bei der Probe muss wieder die erste Zahl herauskommen.', '45 : 5 = 8? Probe: 8 · 5 = 40. Das ist nicht 45. Also stimmt 8 nicht.', `Vergleiche ${(q - 1) * d} mit ${a}. Sind die Zahlen gleich?`));
    },
  });

  const ueberschlagG = () => suche(() => { const d = zz(2, 9), h = zz(1, 4), q = h * 100 + zz(2, 9) * (zufallVorzeichen()), a = q * d; return [a, d, q, h * 100]; }, ([a, d, q]) => a >= 180 && a <= 1000 && q > 0 && a % 100 !== 0 && Math.round(a / (d * 100)) * d * 100 === Math.round(q / 100) * 100 * d);
  function zufallVorzeichen() { return zz(0, 1) ? 1 : -1; }
  stufen('D5', 'G', {
    1: (k) => {
      if (k === 0) {
        const [a, d, q] = schriftlichG();
        return zahl(zeilen('Mache die Probe.', `${a} : ${d} = ${q}`, `${q} · ${d} = ▢`), a, fehlerliste(a, [[q + d, 'div-falsche-rechenart']]),
          h3('Die Probe ist die Mal-Aufgabe: Ergebnis mal Teiler.', '96 : 4 = 24. Probe: 24 · 4 = 96.', `Rechne ${q - (q % 10)} · ${d} = ${(q - (q % 10)) * d}. Rechne dann ${q % 10} · ${d} dazu.`));
      }
      const [a, d, , hq] = ueberschlagG();
      return zahl(zeilen('Überschlage.', `${a} : ${d}`, `Rechne mit ${hq * d} : ${d}.`), hq, fehlerliste(hq, [[a / d, 'ueberschlag-nicht-gerundet'], [hq / 10, 'div-stellenwert']]),
        h3('Beim Überschlag rechnest du mit einer runden Zahl. Das geht im Kopf.', 'Überschlag zu 418 : 4: Rechne 400 : 4 = 100.', `${hq * d / 100} Hunderter geteilt durch ${d} sind ${hq / 100} Hunderter.`));
    },
    2: (k) => {
      if (k === 0) {
        const [a, d, , hq] = ueberschlagG();
        return auswahl(zeilen(`Welcher Überschlag passt zu ${a} : ${d}?`), [opt(`${hq * d} : ${d} = ${hq}`, true), opt(`${hq * d} : 10 = ${hq * d / 10}`, false, 'falsch-gerundet'),
          opt(`${hq * d / 10} : ${d} = ${hq / 10}`, false, 'div-stellenwert')],
          h3('Runde nur die erste Zahl. Sie soll nahe bei der echten Zahl bleiben.', 'Zu 594 : 6 passt 600 : 6 = 100. Denn 594 liegt nahe bei 600.', `Welche runde Zahl liegt nahe bei ${a} und lässt sich gut durch ${d} teilen?`));
      }
      const [a, d, q] = schriftlichG();
      if (k === 1) return auswahl(zeilen(`${a} : ${d}`, 'Welches Ergebnis stimmt?', 'Prüfe mit der Mal-Aufgabe.'),
        [opt(String(q), true), opt(String(q + 10), false, 'div-einmaleins'), opt(String(q - 10 > 0 ? q - 10 : q + 20), false, 'div-einmaleins'), opt(String(q + 1), false, 'div-einmaleins')],
        h3('Rechne zu jeder Antwort: Antwort mal Teiler.', '252 : 7 = 36? Probe: 36 · 7 = 252. Das stimmt.', `Bei der richtigen Antwort ergibt Antwort mal ${d} genau ${a}.`));
      return auswahl(zeilen(`Die Probe ist ${q} · ${d} = ${a}.`, 'Welche Geteilt-Aufgabe wurde geprüft?'),
        [opt(`${a} : ${d} = ${q}`, true), opt(`${q} : ${d} = ${a}`, false, 'div-vertauscht'), opt(`${a} : ${q} = ${a}`), opt(`${d} : ${q} = ${a}`, false, 'div-vertauscht')],
        h3('Bei der Geteilt-Aufgabe steht die größte Zahl vorn.', 'Probe 23 · 6 = 138. Geprüft wurde 138 : 6 = 23.', `Die größte Zahl ist ${a}. Sie wird geteilt.`));
    },
    3: () => {
      const d = zz(2, 4), h = zz(1, Math.floor(9 / d) - 0 || 1), e = zz(2, 9), q = h * 100 + e, a = q * d;
      return auswahl(zeilen(`Tom rechnet: ${a} : ${d} = ${h * 10 + e}.`, `Sein Überschlag ist ${h * 100 * d} : ${d} = ${h * 100}.`, 'Was zeigt der Überschlag?'),
        [opt(`${h * 10 + e} ist viel zu klein. Das Ergebnis muss nahe bei ${h * 100} liegen. Richtig ist ${q}.`, true), opt(`${h * 10 + e} passt zum Überschlag.`, false, 'div-null-vergessen'),
          opt(`Der Überschlag ist falsch. ${h * 100 * d} : ${d} = ${h * 10}.`, false, 'div-stellenwert'), opt(`${h * 10 + e} ist zu groß.`)],
        h3('Vergleiche das Ergebnis mit dem Überschlag. Die Zahlen müssen nahe beieinander liegen.', '824 : 4 = 26? Der Überschlag ist 800 : 4 = 200. 26 ist viel kleiner als 200. Richtig ist 206.', `Liegt ${h * 10 + e} nahe bei ${h * 100}?`));
    },
  });

  stufen('D5', 'M', {
    1: (k) => {
      if (k === 0) {
        const d = zz(3, 9), t = zz(2, 9), a = d * t * 1000 + zz(40, 380) * (zz(0, 1) ? 1 : -1);
        return zahl(`Überschlage: Runde den Dividenden auf Tausender und rechne dann. ${fz(a)} : ${d} ≈ ?`, t * 1000, fehlerliste(t * 1000, [[t * 100, 'div-stellenwert'], [Number.isInteger(a / d) ? a / d : -1, 'ueberschlag-nicht-gerundet']]),
          h2('Runde so, dass du die Division im Kopf lösen kannst.', `Der Dividend wird zu ${fz(d * t * 1000)}.`));
      }
      const [a, d, q] = zweistelligM();
      return auswahl(`Welche Rechnung ist die Probe zu ${fz(a)} : ${d} = ${q}?`, [opt(`${q} · ${d} = ${fz(a)}`, true), opt(`${fz(a)} · ${d} = ${q}`, false, 'probe-falsche-umkehr'),
        opt(`${fz(a)} − ${q} = ${d}`, false, 'probe-falsche-umkehr'), opt(`${q} : ${d} = ${fz(a)}`, false, 'probe-falsche-umkehr')],
        h2('Die Probe ist die Umkehraufgabe. Sie führt zurück zum Dividenden.', 'Quotient · Divisor = Dividend.'));
    },
    2: (k) => {
      if (k === 0) {
        const d = zz(4, 9), q = suche(() => zz(105, 980), (x) => x % 10 !== 0), a = d * q;
        return auswahl(`Nur ein Ergebnis kann stimmen. Entscheide mit einem Überschlag: ${fz(a)} : ${d}`,
          [opt(String(q), true), opt(String(Math.floor(q / 10)), false, 'div-stellenwert'), opt(fz(q * 10), false, 'div-stellenwert'), opt(fz(q + 1000), false, 'div-stellenwert')],
          h2('Überschlage zuerst, wie groß der Quotient ungefähr sein muss.', `Überschlag: ${fz(Math.round(q / 100) * 100 * d)} : ${d} = ${Math.round(q / 100) * 100}.`));
      }
      if (k === 1) {
        const [a, d, q, r] = restM();
        return zahl(`Bei einer Division durch ${d} ist der Quotient ${q} und der Rest ${r}. Bestimme mit der Probe den Dividenden.`, a, fehlerliste(a, [[d * q, 'div-rest-vergessen']]),
          h2('Probe bei einer Division mit Rest: Quotient · Divisor, dann den Rest addieren.', `Rechne ${q} · ${d} = ${fz(q * d)}.`));
      }
      const d = suche(() => zz(23, 78), (x) => x % 10 !== 0), q = zz(21, 98), a = d * q, u = Math.floor(q / 10) * 10;
      return auswahl(`Zwischen welchen Zahlen liegt ${fz(a)} : ${d}? Entscheide mit einem Überschlag.`,
        [opt(`zwischen ${u} und ${u + 10}`, true), opt(`zwischen ${u / 10} und ${u / 10 + 1}`, false, 'div-stellenwert'), opt(`zwischen ${u * 10} und ${u * 10 + 100}`, false, 'div-stellenwert'),
          opt(`zwischen ${u + 20} und ${u + 30}`, false, 'falsch-gerundet')],
        h2('Multipliziere die Grenzen mit dem Divisor und vergleiche mit dem Dividenden.', `${u} · ${d} = ${fz(u * d)} und ${u + 10} · ${d} = ${fz((u + 10) * d)}.`));
    },
    3: () => {
      const d = wahl([14, 15, 16, 24, 25, 26]), q = zz(18, 42) * 10 + zz(2, 9), a = d * q;
      const dr = Math.ceil(d / 10) * 10, ar = Math.floor(a / 1000) * 1000;
      return auswahl(`Mona rechnet ${fz(a)} : ${d} = ${q}. Ihre Probe ${q} · ${d} = ${fz(a)} stimmt. Ihr Überschlag ${fz(ar)} : ${dr} = ${Math.round(ar / dr)} weicht aber deutlich ab. Was folgt daraus?`,
        [opt(`Das Ergebnis ${q} stimmt. Der Überschlag ist nur grob, weil stark gerundet wurde.`, true), opt(`Das Ergebnis ist falsch, weil der Überschlag ${Math.round(ar / dr)} ergibt.`, false, 'ueberschlag-nicht-gerundet'),
          opt('Die Probe muss falsch sein.', false, 'probe-falsche-umkehr'), opt('Man nimmt den Mittelwert aus Ergebnis und Überschlag.')],
        h2('Welche Prüfung ist genau, welche nur ungefähr?', 'Die Probe rechnet genau zurück. Der Überschlag zeigt nur die Größenordnung.'));
    },
  });

  stufen('D5', 'E', {
    1: (k) => {
      if (k === 0) {
        const dr = zz(3, 8) * 10, t = zz(4, 12) * 100, d = dr + zz(1, 3) * (zz(0, 1) ? 1 : -1), a = dr * t + zz(40, 300) * (zz(0, 1) ? 1 : -1);
        return zahl(`Überschlage sinnvoll: ${fz(a)} : ${d} ≈ ? Runde den Divisor auf Zehner und den Dividenden auf Tausender.`, t, fehlerliste(t, [[t * 10, 'div-stellenwert'], [t / 10, 'div-stellenwert']]),
          h1('Auf welche glatten Zahlen kannst du runden, sodass die Division im Kopf aufgeht?'));
      }
      const [a, d, q, r] = suche(() => mitRest(13, 48, 105, 480), ([, x]) => x % 10 !== 0);
      return auswahl(`Welche Rechnung ist die Probe zu ${fz(a)} : ${d} = ${q} Rest ${r}?`, [opt(`${q} · ${d} + ${r} = ${fz(a)}`, true), opt(`${q} · ${d} − ${r} = ${fz(a)}`, false, 'probe-falsche-umkehr'),
        opt(`(${q} + ${r}) · ${d} = ${fz(a)}`, false, 'probe-falsche-umkehr'), opt(`${q} · ${r} + ${d} = ${fz(a)}`, false, 'probe-falsche-umkehr')],
        h1('Wo steckt der Rest: im Vielfachen des Divisors oder daneben?'));
    },
    2: (k) => {
      if (k === 0) {
        const d = suche(() => zz(62, 88), (x) => x % 10 !== 0), a = d * 100 + zz(150, 600);
        return auswahl('Entscheide ohne schriftliche Rechnung: Welcher Quotient ist größer als 100?',
          [opt(`${fz(a)} : ${d}`, true), opt(`${fz(a - 1000)} : ${d}`, false, 'div-stellenwert'), opt(`${fz(a)} : ${d + 10}`, false, 'div-stellenwert'), opt(`${fz(d * 100 - d)} : ${d}`, false, 'div-stellenwert')],
          h1('Wie groß wäre der Dividend, wenn der Quotient genau 100 wäre?'));
      }
      if (k === 1) {
        const [a, d, q, r] = suche(() => mitRest(23, 48, 105, 280), ([, x]) => x % 10 !== 0);
        return zahl(`Bei einer Division durch ${d} ist der Quotient ${q} und der Rest ${r}. Bestimme den Dividenden.`, a, fehlerliste(a, [[d * q, 'div-rest-vergessen']]),
          h1('Wie lautet die Probe bei einer Division mit Rest?'));
      }
      const dr = zz(3, 6) * 10, t = zz(2, 6) * 100, d = dr - zz(1, 2), a = dr * t + zz(60, 240);
      return auswahl(`Der Überschlag zu einer Division lautet ${fz(dr * t)} : ${dr} = ${t}. Welche Aufgabe wurde überschlagen?`,
        [opt(`${fz(a)} : ${d}`, true), opt(`${fz(a)} : ${d + 60 > 99 ? d + 40 : d + 60}`, false, 'falsch-gerundet'), opt(`${fz(Math.round(a / 10))} : ${d}`, false, 'div-stellenwert'), opt(`${fz(a * 10)} : ${d}`, false, 'div-stellenwert')],
        h1('Runde bei jeder Aufgabe Dividend und Divisor. Bei welcher entstehen genau diese glatten Zahlen?'));
    },
    3: () => auswahl('Paula rundet bei einem Überschlag zur Division sowohl den Dividenden als auch den Divisor auf. Welche Aussage über ihren Überschlag gilt?',
      [opt('Er kann zu groß oder zu klein sein, weil die beiden Rundungen in entgegengesetzte Richtungen wirken.', true), opt('Er ist dann immer zu groß.', false, 'falsch-gerundet'),
        opt('Er ist dann immer zu klein.', false, 'falsch-gerundet'), opt('Er stimmt dann immer genau.', false, 'ueberschlag-nicht-gerundet')],
      h1('Was bewirkt ein größerer Dividend, was ein größerer Divisor? Probiere 100 : 20, 120 : 20 und 100 : 25.')),
  });

  // ===================================================================
  // D6 Sachaufgaben
  // ===================================================================
  const dingeF = [['Äpfel', 'Tüte', 'Tüten', 'packt'], ['Kekse', 'Dose', 'Dosen', 'legt'], ['Stifte', 'Becher', 'Becher', 'stellt'], ['Bälle', 'Netz', 'Netze', 'packt']];
  const namenF = ['Herr Keller', 'Frau Demir', 'Mila', 'Jonas'];
  stufen('D6', 'F', {
    1: (k) => {
      const [a, d, q] = einmaleins(2, 6, 2, 9), [ding, platz, plaetze, verb] = wahl(dingeF), wer = wahl(namenF);
      if (k === 0) return zahl(zeilen(`${wer} ${verb} ${a} ${ding} in ${plaetze}.`, `In jede${platz === 'Netz' ? 's' : platz === 'Becher' ? 'n' : ''} ${platz} kommen ${d} ${ding}.`, `Wie viele ${plaetze} werden voll?`), q,
        fehlerliste(q, [[a - d, 'div-falsche-rechenart'], [a + d, 'div-falsche-rechenart']]),
        h3(`Nimm ${a} Wendeplättchen. Lege immer ${d} Plättchen zusammen. Zähle die Häufchen.`, `24 Äpfel, immer 4 in eine Tüte: 24 : 4 = 6. Es werden 6 Tüten.`,
          `Nutze die ${d}er-Reihe: ${reihe(d, 2)}, … ▢ · ${d} = ${a}.`), plaetze);
      return zahl(zeilen(`${d} Kinder teilen ${a} ${ding} gerecht.`, `Wie viele ${ding} bekommt 1 Kind?`), q, fehlerliste(q, [[a - d, 'div-falsche-rechenart']]),
        h3(`Zeichne ${d} Kinder auf dein Schmierblatt. Verteile ${a} Striche reihum.`, '3 Kinder teilen 15 Kekse: 15 : 3 = 5. Jedes Kind bekommt 5.', `Rechne ${a} : ${d}. Frage dich: Wie oft passt die ${d} in die ${a}?`), ding);
    },
    2: (k) => {
      const [a, d, q] = suche(() => einmaleins(2, 6, 3, 9), ([x, y, w]) => y !== w && x !== 2 * y), [ding, platz, plaetze] = wahl(dingeF.slice(0, 2));
      if (k === 0) return auswahl(zeilen(`${a} ${ding}.`, `Immer ${d} kommen in eine ${platz}.`, `Wie viele ${plaetze} sind es?`, 'Welche Rechnung passt?'),
        [opt(`${a} : ${d}`, true), opt(`${a} − ${d}`, false, 'div-falsche-rechenart'), opt(`${a} + ${d}`, false, 'div-falsche-rechenart'), opt(`${a} · ${d}`, false, 'div-falsche-rechenart')],
        h3('Hier wird in gleiche Gruppen aufgeteilt. Dazu passt geteilt.', '12 Kekse, immer 3 in eine Dose. Die Rechnung ist 12 : 3.', `Du legst immer ${d} zusammen, bis alle ${a} verteilt sind. Das ist Teilen.`));
      if (k === 1) return auswahl(zeilen(`Die Rechnung ist ${a} : ${d} = ${q}.`, 'Welche Geschichte passt?'),
        [opt(`${a} Kekse werden an ${d} Kinder gerecht verteilt.`, true), opt(`Zu ${a} Keksen kommen ${d} Kekse dazu.`, false, 'div-falsche-rechenart'),
          opt(`${d} Kinder haben jedes ${a} Kekse.`, false, 'div-falsche-rechenart'), opt(`Von ${a} Keksen werden ${d} gegessen.`, false, 'div-falsche-rechenart')],
        h3('Geteilt bedeutet: gerecht verteilen.', '10 : 2 = 5 passt zu: 10 Äpfel werden an 2 Kinder verteilt.', 'Suche die Geschichte, in der etwas gerecht verteilt wird.'));
      return auswahl(zeilen(`${a} Kinder gehen in ${d} gleich große Gruppen.`, `Leo rechnet ${a} : ${d} = ${q}.`, `Was bedeutet die ${q}?`),
        [opt(`In jeder Gruppe sind ${q} Kinder.`, true), opt(`Es gibt ${q} Gruppen.`, false, 'sach-falsche-rechnung'), opt(`${q} Kinder bleiben übrig.`, false, 'div-rest-vergessen'), opt(`Es fehlen ${q} Kinder.`)],
        h3('Lies noch einmal: Wie viele Gruppen gibt es? Was wurde ausgerechnet?', '12 Kinder in 3 Gruppen: 12 : 3 = 4. In jeder Gruppe sind 4 Kinder.', `Die Zahl der Gruppen kennst du schon: ${d}. Die ${q} sagt etwas über eine Gruppe.`));
    },
    3: () => {
      const [a, d, q] = suche(() => einmaleins(3, 5, 3, 8), ([x, y, w]) => x - y !== w);
      return auswahl(zeilen(`Sara hat ${a} Bonbons für ${d} Kinder.`, 'Jedes Kind soll gleich viele bekommen.', `Sara rechnet ${a} − ${d} = ${a - d}.`, 'Was stimmt?'),
        [opt(`Falsch. Sie muss teilen: ${a} : ${d} = ${q}. Jedes Kind bekommt ${q}.`, true), opt(`Richtig. Jedes Kind bekommt ${a - d} Bonbons.`, false, 'div-falsche-rechenart'),
          opt(`Falsch. Sie muss mal rechnen: ${a} · ${d} = ${a * d}.`, false, 'div-falsche-rechenart'), opt(`Richtig. Es bleiben ${a - d} Bonbons übrig.`, false, 'div-falsche-rechenart')],
        h3('Gerecht verteilen heißt teilen. Lege es mit Wendeplättchen nach.', '12 Bonbons für 3 Kinder: 12 : 3 = 4. Jedes Kind bekommt 4.', `Verteile ${a} Plättchen reihum an ${d} Plätze. Wie viele liegen an jedem Platz?`));
    },
  });

  const kaufG = [['Springseile', 'Springseil'], ['Bälle', 'Ball'], ['Bücher', 'Buch'], ['Trikots', 'Trikot']];
  // Preise, die zu den Dingen passen: ein Stück kostet höchstens 29 €.
  const preisG = () => suche(() => { const d = zz(3, 9), q = zz(12, 29); return [d * q, d, q]; }, ([a, , q]) => a >= 100 && q % 10 !== 0);
  stufen('D6', 'G', {
    1: () => {
      const [a, d, q] = preisG(), [viele, eins] = wahl(kaufG);
      return zahl(zeilen(`Die Klasse kauft ${d} ${viele}.`, 'Alle kosten gleich viel.', `Zusammen kosten sie ${a} €.`, `Wie viel Euro kostet 1 ${eins}?`), q, fehlerliste(q, [[a - d, 'div-falsche-rechenart'], [q * 10, 'div-stellenwert']]),
        h3(`Der Preis wird gerecht auf ${d} ${viele} verteilt. Du musst teilen.`, '6 Springseile kosten 138 €. Zerlege: 120 : 6 = 20 und 18 : 6 = 3. Ein Seil kostet 23 €.', ablauf(a, d)), '€');
    },
    2: (k) => {
      if (k === 0) {
        const [a, d] = preisG(), [viele] = wahl(kaufG);
        return auswahl(zeilen(`${d} ${viele} kosten zusammen ${a} €.`, 'Alle kosten gleich viel.', 'Gesucht ist der Preis für 1 Stück.', 'Welche Rechnung passt?'),
          [opt(`${a} : ${d}`, true), opt(`${a} · ${d}`, false, 'div-falsche-rechenart'), opt(`${a} − ${d}`, false, 'div-falsche-rechenart'), opt(`${d} : ${a}`, false, 'div-vertauscht')],
          h3('Der Gesamtpreis wird gerecht aufgeteilt.', '4 Bälle kosten 48 €. Ein Ball kostet 48 : 4 = 12 €.', `Der Gesamtpreis ${a} wird geteilt. Er steht vorn.`));
      }
      if (k === 1) {
        const w = zz(4, 26);
        return zahl(zeilen('1 Woche hat 7 Tage.', `Wie viele Wochen sind ${w * 7} Tage?`), w, fehlerliste(w, [[w * 7 - 7, 'div-falsche-rechenart']]),
          h3('Du bildest 7er-Gruppen aus den Tagen. Du musst teilen.', '21 Tage sind 3 Wochen, denn 21 : 7 = 3.', `Rechne ${w * 7} : 7.`), 'Wochen');
      }
      const [a, d, q] = schriftlichG();
      return auswahl(zeilen(`${a} Flaschen stehen in ${d} gleich vollen Regalen.`, `Mara rechnet ${a} : ${d} = ${q}.`, `Was bedeutet die ${q}?`),
        [opt(`In jedem Regal stehen ${q} Flaschen.`, true), opt(`Es gibt ${q} Regale.`, false, 'sach-falsche-rechnung'), opt(`${q} Flaschen bleiben übrig.`, false, 'div-rest-vergessen'), opt(`Es fehlen ${q} Flaschen.`)],
        h3('Lies noch einmal: Was ist gegeben? Was wurde ausgerechnet?', '60 Flaschen in 5 Regalen: 60 : 5 = 12. In jedem Regal stehen 12 Flaschen.', `Die Zahl der Regale kennst du schon: ${d}. Die ${q} sagt etwas über ein Regal.`));
    },
    3: () => {
      const [a, d, q] = preisG(), [viele, eins] = wahl(kaufG);
      return auswahl(zeilen(`${d} ${viele} kosten zusammen ${a} €.`, `Finn sagt: „1 ${eins} kostet ${a - d} €.“`, 'Er hat minus gerechnet.', 'Was stimmt?'),
        [opt(`Falsch. Er muss teilen: ${a} : ${d} = ${q}. 1 ${eins} kostet ${q} €.`, true), opt(`Richtig. ${a} − ${d} = ${a - d}.`, false, 'div-falsche-rechenart'),
          opt(`Falsch. Er muss mal rechnen: ${a} · ${d}.`, false, 'div-falsche-rechenart'), opt(`Richtig. Ein Stück kostet fast so viel wie alle zusammen.`, false, 'div-falsche-rechenart')],
        h3('Überlege: Kann ein Stück fast so viel kosten wie alle zusammen?', `4 Bälle kosten 48 €. Ein Ball kostet 48 : 4 = 12 €. Nicht 48 − 4 = 44 €.`, `Prüfe Finns Antwort: ${d} mal ${a - d} € wäre viel mehr als ${a} €.`));
    },
  });

  const zweischrittM = [
    (a, b, n) => ({ text: `Ein Bauer erntet ${fz(a)} kg Kartoffeln. ${fz(b)} kg behält er selbst. Den Rest füllt er gleichmäßig in ${n} Säcke.`, f1: 'Wie viel Kilogramm füllt er in Säcke?', e1: 'kg', f2: 'Wie viel Kilogramm sind in einem Sack?', e2: 'kg' }),
    (a, b, n) => ({ text: `Ein Ausflug kostet ${fz(a)} €. Der Förderverein übernimmt ${fz(b)} €. Den Rest teilen sich ${n} Kinder gleichmäßig.`, f1: 'Wie viel Geld müssen die Kinder zusammen zahlen?', e1: '€', f2: 'Wie viel zahlt jedes Kind?', e2: '€' }),
    (a, b, n) => ({ text: `Eine Schule bekommt ${fz(a)} Hefte. ${fz(b)} Hefte kommen ins Lager. Die übrigen werden gleichmäßig an ${n} Klassen verteilt.`, f1: 'Wie viele Hefte werden verteilt?', e1: 'Hefte', f2: 'Wie viele Hefte bekommt jede Klasse?', e2: 'Hefte' }),
  ];
  stufen('D6', 'M', {
    1: () => {
      const d = zz(12, 28), q = zz(24, 148), a = d * q;
      const [text, einheit] = wahl([[`Eine Reise kostet für ${d} Personen zusammen ${fz(a)} €. Alle zahlen gleich viel. Wie viel zahlt eine Person?`, '€'],
        [`${fz(a)} Flaschen werden gleichmäßig auf ${d} Kästen verteilt. Wie viele Flaschen kommen in einen Kasten?`, 'Flaschen'],
        [`Ein Lkw legt in ${d} Tagen ${fz(a)} km zurück, jeden Tag gleich viel. Wie viele Kilometer fährt er an einem Tag?`, 'km']]);
      return zahl(text, q, fehlerliste(q, [[q * 10, 'div-stellenwert'], [a - d, 'sach-falsche-rechnung']]), h2('Hier wird gleichmäßig verteilt. Welche Rechenart passt?', `Rechne ${fz(a)} : ${d}.`), einheit);
    },
    2: (k) => {
      const n = zz(12, 28), q = zz(35, 180), b = zz(15, 90) * 10, a = q * n + b, i = zz(0, 2), kx = zweischrittM[i](a, b, n);
      if (k === 0) return { format: 'sachaufgabe', text: kx.text,
        teile: [teil(kx.f1, a - b, kx.e1), teil(kx.f2, q, kx.e2, fehlerliste(q, [[a % n === 0 ? a / n : -1, 'sach-schritt-vergessen']]))],
        hilfen: h2('Rechne Schritt für Schritt: erst abziehen, dann gleichmäßig teilen.', `Für die erste Frage rechnest du ${fz(a)} − ${fz(b)}.`) };
      if (k === 1) return auswahl(`${kx.text} ${kx.f2} Welcher Rechenausdruck passt?`,
        [opt(`(${fz(a)} − ${fz(b)}) : ${n}`, true), opt(`${fz(a)} − ${fz(b)} : ${n}`, false, 'sach-schritt-vergessen'), opt(`${fz(a)} : ${n} − ${fz(b)}`, false, 'sach-falsche-rechnung'),
          opt(`(${fz(a)} + ${fz(b)}) : ${n}`, false, 'sach-falsche-rechnung')],
        h2('Was muss zuerst berechnet werden? Das gehört in die Klammer.', 'Erst wird abgezogen, dann wird das Ergebnis geteilt.'));
      const p = zz(6, 18), je = wahl([12, 24]), pal = wahl([20, 30, 40]);
      return zahl(`In einer Fabrik werden ${fz(p * je * pal)} Flaschen in Kästen zu je ${je} Flaschen gepackt. Je ${pal} Kästen kommen auf eine Palette. Wie viele Paletten werden voll?`, p,
        fehlerliste(p, [[p * pal, 'sach-schritt-vergessen']]), h2('Berechne zuerst die Zahl der Kästen, dann die Zahl der Paletten.', `Kästen: ${fz(p * je * pal)} : ${je} = ${fz(p * pal)}.`), 'Paletten');
    },
    3: () => {
      const n = zz(18, 27), q = zz(16, 24), a = n * q, weniger = q - zz(2, 4);
      return auswahl(`Der Ausflug kostet für ${n} Kinder zusammen ${fz(a)} €. Mira sagt: „Wenn jedes Kind ${weniger} € mitbringt, reicht das Geld.“ Beurteile ihre Aussage.`,
        [opt(`Falsch: ${n} · ${weniger} € = ${fz(n * weniger)} €, es fehlen ${fz(a - n * weniger)} €. Nötig sind ${q} € pro Kind.`, true),
          opt(`Richtig: ${weniger} € sind fast ${q} €, das genügt.`, false, 'div-rest-nicht-gedeutet'), opt(`Richtig: ${fz(a)} : ${weniger} ist mehr als ${n}.`, false, 'sach-falsche-rechnung'),
          opt(`Falsch: Jedes Kind muss ${n} € zahlen.`, false, 'div-vertauscht')],
        h2('Berechne, wie viel jedes Kind zahlen muss, oder wie viel bei Miras Vorschlag zusammenkommt.', `Rechne ${fz(a)} : ${n} oder ${n} · ${weniger}.`));
    },
  });

  const unnoetigE = [
    (k, m, d, n) => [`Ein Obsthof erntet ${k} Kisten mit je ${m} kg Äpfeln. Die Äpfel werden in Säcke zu je ${d} kg umgefüllt. Die Ernte dauert ${n} Tage. Wie viele Säcke werden gefüllt?`, 'Säcke'],
    (k, m, d, n) => [`Eine Firma liefert ${k} Paletten mit je ${m} Dosen. Die Dosen werden in Kartons zu je ${d} Dosen verpackt. Der Lkw fährt ${n} km weit. Wie viele Kartons werden gebraucht?`, 'Kartons'],
    (k, m, d, n) => [`Für ein Schulfest werden ${k} Packungen mit je ${m} Bechern gekauft. Die Becher werden gleichmäßig auf ${d} Stände verteilt. Das Fest dauert ${n} Stunden. Wie viele Becher bekommt jeder Stand?`, 'Becher'],
  ];
  stufen('D6', 'E', {
    1: () => {
      const d = zz(12, 28), q = zz(24, 148), a = d * q, n = suche(() => zz(3, 9), (x) => a % x !== 0 || a / x !== q);
      const [text, einheit] = wahl([[`Eine Reisegruppe aus ${d} Personen zahlt zusammen ${fz(a)} € für eine Fahrt, die ${n} Tage dauert. Alle zahlen gleich viel. Wie viel zahlt eine Person?`, '€'],
        [`${fz(a)} Flaschen werden gleichmäßig auf ${d} Kästen verteilt. Der Transport dauert ${n} Stunden. Wie viele Flaschen kommen in einen Kasten?`, 'Flaschen']]);
      return zahl(text, q, fehlerliste(q, [[a % n === 0 ? a / n : -1, 'sach-unnoetige-angabe'], [q * 10, 'div-stellenwert']]), h1('Welche Angaben brauchst du für die Frage, welche nicht?'), einheit);
    },
    2: (k) => {
      if (k === 0) {
        const d = wahl([12, 15, 16, 18, 24, 25]);
        const [kk, m] = suche(() => [zz(14, 48), zz(15, 60)], ([x, y]) => (x * y) % d === 0 && x % d !== 0 && y % d !== 0);
        const n = zz(3, 9), [text, einheit] = unnoetigE[zz(0, 2)](kk, m, d, n), loesung = (kk * m) / d;
        return zahl(text, loesung, fehlerliste(loesung, [[kk * m, 'sach-schritt-vergessen'], [(kk * m) % n === 0 ? (kk * m) / n : -1, 'sach-unnoetige-angabe']]),
          h1('Welche Gesamtmenge wird verteilt? Welche Zahl im Text spielt für die Frage keine Rolle?'), einheit);
      }
      if (k === 1) {
        const [n, unten, oben, t] = suche(() => { const x = zz(20, 60) * 12, u = wahl([10, 20, 30]); return [x, u, u + 10]; },
          ([x, u, o]) => Array.from({ length: o - u - 1 }, (_, i) => u + 1 + i).filter((v) => x % v === 0).length === 1)
          .concat([0]);
        const reihen = Array.from({ length: oben - unten - 1 }, (_, i) => unten + 1 + i).find((v) => n % v === 0);
        void t;
        return zahl(`${n} Stühle sollen in gleich lange Reihen gestellt werden. Es sollen mehr als ${unten} und weniger als ${oben} Reihen sein, und kein Stuhl darf übrig bleiben. Wie viele Reihen sind es?`, reihen, [],
          h1(`Welche Zahlen zwischen ${unten} und ${oben} teilen ${n} ohne Rest? Teilbarkeitsregeln sparen Rechenarbeit.`), 'Reihen');
      }
      const [p, je, ab] = suche(() => [zz(10, 24), zz(15, 60), zz(2, 6)], ([x, y, w]) => x > w + 4 && (x * y) % (x - w) === 0);
      return zahl(`Ein Betrag wird gleichmäßig auf ${p} Personen verteilt. Jede müsste ${je} € zahlen. Dann sagen ${ab} Personen ab. Wie viel zahlt nun jede der übrigen Personen?`, (p * je) / (p - ab),
        fehlerliste((p * je) / (p - ab), [[je, 'sach-schritt-vergessen'], [p * je, 'sach-schritt-vergessen']]), h1('Welche Größe bleibt gleich, wenn Personen absagen?'), '€');
    },
    3: () => {
      const [was, richtig, falsch] = wahl([
        ['Die Gruppe wird doppelt so groß.', 'Jede Person zahlt nur noch die Hälfte.', ['Jede Person zahlt doppelt so viel.', 'Jede Person zahlt 2 € weniger.', 'Der Betrag pro Person bleibt gleich.']],
        ['Die Gruppe wird halb so groß.', 'Jede Person zahlt doppelt so viel.', ['Jede Person zahlt nur noch die Hälfte.', 'Jede Person zahlt 2 € mehr.', 'Der Betrag pro Person bleibt gleich.']],
      ]);
      return auswahl(`Eine Rechnung wird gleichmäßig auf eine Gruppe verteilt. ${was} Welche Aussage gilt immer, egal wie hoch die Rechnung ist?`, [opt(richtig, true), ...falsch.map((f) => opt(f, false, 'sach-falsche-rechnung'))],
        h1('Prüfe an zwei verschiedenen Beträgen. Was bleibt gleich, was ändert sich?'));
    },
  });
}
