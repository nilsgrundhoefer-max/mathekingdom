// Aufgaben zu 6.3.3 „Grundriss, Aufriss, Seitenriss“ (Lernziele A1 und A2) nach ADR 0015 und ADR 0045. Pflicht ab Gold, Aufgaben auf allen Stufen.
// A1: Ansichten zuordnen (Bildkarten, Formen, Kästchen zählen). A2: Ansichten im Gitter färben, an jeder Stelle im Gitter.
// Wortspeicher: F nur „Ansicht von vorne/oben/links“, ab G „Grundriss“ und „Aufriss“, ab M „Seitenriss“. Die Seitenansicht ist immer „von links“.
// Stolpersteine aus der Niveauübersicht: Ansichten verwechselt, Ansicht gespiegelt (von hinten statt von vorne), verdeckte Würfel vergessen.
import { sechs } from '../werkzeug.mjs';
import { zz, wahl, suche, mische, zusammenhaengend, Z, H, zahl, opt, auswahl, kind, U, AF, ANSICHT, WZ, quader, wuerfelBild, bau, bildkarten, ansicht, gleicheZellen, riss, risseBild,
  grundrissMitZahlen, zufallsBau, spiegleZellen, gitterZellen, GT } from './6-3-koerper.mjs';

const A1 = '6.3.3-A1', A2 = '6.3.3-A2';
const karte = (z) => risseBild(riss(null, z));
const alleVerschieden = (liste) => liste.every((z, i) => liste.slice(i + 1).every((y) => !gleicheZellen(z, y)));
// Ein Würfelbau, dessen genannte Ansichten (und gespiegelte Ansichten) alle verschieden sind.
// Der Bau nutzt die volle Breite b und Tiefe t, sonst wäre „in einer Reihe“ oder „drei Spalten“ nur zum Teil wahr.
const bauMit = (b, t, hmax, anzahl, pruefe) => suche(() => zufallsBau(b, t, hmax, anzahl), (w) => Math.max(...w.map((p) => p[0])) === b - 1 && Math.max(...w.map((p) => p[1])) === t - 1 && pruefe(w));
const verschiedeneAnsichten = (...von) => (w) => alleVerschieden(von.map((v) => (v === 'spiegel' ? spiegleZellen(ansicht(w, 'vorne')) : v === 'spiegelLinks' ? spiegleZellen(ansicht(w, 'links')) : ansicht(w, v))));
const quaderZellen = (b, h) => { const z = []; for (let y = 0; y < h; y++) for (let x = 0; x < b; x++) z.push([x, y]); return z; };
const dreiMasse = () => suche(() => [zz(2, 5), zz(2, 4), zz(2, 4)], ([a, b, c]) => new Set([a, b, c]).size === 3 && b < a);
const masseVon = (a, b, c) => [{ von: 'A', bis: 'B', t: `${a} cm` }, { von: 'B', bis: 'C', t: `${b} cm` }, { von: 'A', bis: 'E', t: `${c} cm` }];
const VON = { vorne: 'von vorne', oben: 'von oben', links: 'von links', hinten: 'von hinten', rechts: 'von rechts' };

// Würfelbauten mit demselben Aufriss: hinten ein Würfel mehr oder weniger, der von vorne verdeckt ist.
const hoeheBei = (w, x, y) => w.filter((p) => p[0] === x && p[1] === y).length;
function versteckteAenderungen(w) {
  const neu = [];
  for (let x = 0; x < 3; x++) {
    const vorn = hoeheBei(w, x, 0), hinten = hoeheBei(w, x, 1);
    if (hinten < vorn) neu.push([...w, [x, 1, hinten]]);
    if (hinten > 0 && hinten <= vorn) neu.push(w.filter((p) => !(p[0] === x && p[1] === 1 && p[2] === hinten - 1)));
  }
  return mische(neu.filter((v) => v.length && zusammenhaengend(ansicht(v, 'oben')) && gleicheZellen(ansicht(v, 'vorne'), ansicht(w, 'vorne'))));
}
// Bildkarten zu einem Würfelbau: richtige Ansicht und Ansichten aus anderen Richtungen als Fehler.
function ansichtKarten(text, w, von, falsch, hilfen, extra = {}) {
  const soll = ansicht(w, von);
  const karten = [[karte(soll), true], ...falsch.map(([z, fv]) => [karte(z), false, fv])];
  return bildkarten(text, karten, hilfen, { bild: bau(w, { vorne: true }), nachweis: [ANSICHT(von)], ...extra });
}
// Bildkarten mit Würfelbauten zu einer gezeigten Ansicht.
function bauKarten(text, w, von, falsche, hilfen, name, extra = {}) {
  const karten = [[bau(w, { vorne: true }), true], ...falsche.map(([x, fv]) => [bau(x, { vorne: true }), false, fv])];
  return bildkarten(text, karten, hilfen, { bild: risseBild(riss(name, ansicht(w, von))), nachweis: [ANSICHT(von)], ...extra });
}
// Gitterzeichnen einer Ansicht: die Lösung liegt bei (1, 1), gefärbt werden darf an jeder Stelle.
function ansichtFaerben(text, soll, fehler, hilfen, { bild = null, nachweis, rand = 2 } = {}) {
  const b = Math.max(...soll.map((p) => p[0])) + 1, h = Math.max(...soll.map((p) => p[1])) + 1;
  const loesung = soll.map(([x, y]) => [x + 1, y + 1]);
  const fl = fehler.filter(([z]) => z && !gleicheZellen(z, soll)).map(([z, fv]) => [z.map(([x, y]) => [x + 1, y + 1]), fv]).filter(([z], i, l) => l.findIndex(([y]) => gleicheZellen(y, z)) === i);
  return gitterZellen(text, GT(Math.max(b + rand + 1, 6), Math.max(h + rand + 1, 5)), loesung, fl, hilfen, { bedingung: { art: 'form', zellen: loesung }, ...(bild ? { bild } : {}), nachweis });
}

// ---------- A1: Ansichten zuordnen ----------
const hVorne = (n) => H(n, 'Stell dich vor den Würfelbau. Der Pfeil zeigt, wo vorne ist.', 'Du siehst von jedem Turm nur seine Höhe.', 'Zähle in jeder Spalte die Würfel übereinander.');
const hOben = (n) => H(n, 'Schau von oben wie ein Vogel auf den Würfelbau.', 'Du siehst jeden Turm als ein Kästchen.', 'Vorne ist in der Ansicht unten.');
function a1() {
  sechs(A1, 'F', [
    () => { const w = bauMit(3, 1, 3, zz(4, 6), verschiedeneAnsichten('vorne', 'oben', 'spiegel'));
      return ansichtKarten(Z('Du schaust von vorne auf den Würfelbau.', 'Kreuze die passende Ansicht an.'), w, 'vorne', [[ansicht(w, 'oben'), 'riss-verwechselt'], [spiegleZellen(ansicht(w, 'vorne')), 'riss-gespiegelt']], hVorne('F')); },
    () => { const w = bauMit(3, 1, 3, zz(4, 6), (x) => true), andere = [0, 1].map(() => bauMit(3, 1, 3, zz(4, 6), (y) => !gleicheZellen(ansicht(y, 'vorne'), ansicht(w, 'vorne'))));
      if (!alleVerschieden([w, ...andere].map((x) => ansicht(x, 'vorne')))) return null;
      return bauKarten(Z('Das ist die Ansicht von vorne.', 'Kreuze den passenden Würfelbau an.'), w, 'vorne', andere.map((x) => [x, 'riss-verwechselt']),
        H('F', 'Vergleiche die Höhe der Türme.', 'Links, in der Mitte und rechts.', 'Der Würfelbau muss in jeder Spalte gleich hoch sein.'), 'von vorne'); },
    () => { const [a, b, c] = dreiMasse(), [von, soll] = wahl([['oben', a === b ? 'Quadrat' : 'Rechteck'], ['vorne', 'Rechteck']]);
      return auswahl(Z(`Du schaust ${VON[von]} auf den Quader.`, 'Kreuze die Form der Ansicht an.'), ['Rechteck', 'Dreieck', 'Kreis'].map((f) => opt(f, f === soll, f === soll ? undefined : 'riss-verwechselt')),
        H('F', 'Ein Quader hat nur Rechtecke als Flächen.', 'Du siehst genau eine Fläche.', 'Welche Form hat diese Fläche?'), { bild: quader(a, b, c), nachweis: [AF('quader', von)] }); },
    () => { const [a, b, c] = dreiMasse();
      return bildkarten(Z('Du schaust von vorne auf den Quader.', 'Ein Kästchen steht für einen Zentimeter.', 'Kreuze die passende Ansicht an.'), [[karte(quaderZellen(a, c)), true], [karte(quaderZellen(a, b)), false, 'riss-verwechselt'], [karte(quaderZellen(b, c)), false, 'riss-verwechselt']],
        H('F', 'Vorne siehst du die Fläche ABFE.', `Sie ist ${a} cm breit und ${c} cm hoch.`, 'Suche das Bild mit dieser Breite und Höhe.'), { bild: quader(a, b, c, { masse: masseVon(a, b, c), namen: true }), nachweis: [ANSICHT('vorne')] }); },
    () => { const w = bauMit(4, 1, 3, zz(4, 7), (x) => true), n = ansicht(w, 'vorne').length;
      return zahl(Z('Du schaust von vorne auf den Würfelbau.', 'Zähle die Kästchen der Ansicht.'), n, [[n + 1, 'wuerfel-verdeckt'], [ansicht(w, 'oben').length, 'riss-verwechselt']],
        hVorne('F'), { bild: bau(w, { vorne: true }), nachweis: [ANSICHT('vorne', { wert: n })] }); },
    () => { const w = bauMit(3, 2, 2, zz(4, 6), verschiedeneAnsichten('oben', 'vorne', 'links'));
      return ansichtKarten(Z('Du schaust von oben auf den Würfelbau.', 'Kreuze die passende Ansicht an.'), w, 'oben', [[ansicht(w, 'vorne'), 'riss-verwechselt'], [ansicht(w, 'links'), 'riss-verwechselt']], hOben('F')); },
  ]);
  sechs(A1, 'G', [
    () => { const w = bauMit(3, 2, 3, zz(5, 7), verschiedeneAnsichten('oben', 'vorne', 'links'));
      return ansichtKarten(Z('Der Grundriss ist die Ansicht von oben.', 'Kreuze den Grundriss an.'), w, 'oben', [[ansicht(w, 'vorne'), 'riss-verwechselt'], [ansicht(w, 'links'), 'riss-verwechselt']], hOben('G')); },
    () => { const w = bauMit(3, 2, 3, zz(5, 7), verschiedeneAnsichten('vorne', 'oben', 'spiegel'));
      return ansichtKarten(Z('Der Aufriss ist die Ansicht von vorne.', 'Kreuze den Aufriss an.'), w, 'vorne', [[ansicht(w, 'oben'), 'riss-verwechselt'], [spiegleZellen(ansicht(w, 'vorne')), 'riss-gespiegelt']], hVorne('G')); },
    () => { const w = bauMit(3, 2, 3, zz(6, 9), (x) => true), g = grundrissMitZahlen(w);
      return zahl(Z('Im Grundriss steht, wie viele Würfel übereinander stehen.', 'Gib an, wie viele Würfel es insgesamt sind.'), w.length, [[g.zellen.length, 'wuerfel-verdeckt'], [w.length - 1, 'wuerfel-verdeckt']],
        H('G', 'Jede Zahl ist ein Turm.', 'Eine 3 heißt: drei Würfel übereinander.', 'Addiere alle Zahlen.'), { bild: risseBild(g), nachweis: [WZ(w.length)] }); },
    () => { const [a, b, c] = dreiMasse(), n = a * b;
      return zahl(Z('Ein Kästchen steht für einen Zentimeter.', 'Gib an, wie viele Kästchen der Grundriss des Quaders hat.'), n, [[a * c, 'riss-verwechselt'], [b * c, 'riss-verwechselt'], [a + b, 'riss-verwechselt']],
        H('G', 'Der Grundriss ist die Fläche oben.', `Sie ist ${a} cm lang und ${b} cm tief.`, 'Das sind so viele Reihen mit so vielen Kästchen.'), { bild: quader(a, b, c, { masse: masseVon(a, b, c), namen: true }), nachweis: [ANSICHT('oben', { wert: n })] }); },
    () => { const w = bauMit(3, 2, 3, zz(5, 7), (x) => true), andere = [0, 1].map(() => bauMit(3, 2, 3, zz(5, 7), (y) => !gleicheZellen(ansicht(y, 'vorne'), ansicht(w, 'vorne'))));
      if (!alleVerschieden([w, ...andere].map((x) => ansicht(x, 'vorne')))) return null;
      return bauKarten(Z('Ein Würfelbau hat diesen Aufriss.', 'Kreuze den Würfelbau an.'), w, 'vorne', andere.map((x) => [x, 'riss-verwechselt']),
        H('G', 'Der Aufriss zeigt die Ansicht von vorne.', 'Hinten stehende Würfel siehst du nur, wenn sie höher sind.', 'Vergleiche in jeder Spalte die größte Höhe.'), 'von vorne'); },
    () => { const s = zz(2, 5), h = s + zz(1, 3);
      return auswahl(Z(`Ein Quader ist ${s} cm lang, ${s} cm tief und ${h} cm hoch.`, 'Kreuze die Form seines Grundrisses an.'), ['Quadrat', 'Rechteck', 'Dreieck'].map((f) => opt(f, f === 'Quadrat', f === 'Quadrat' ? undefined : 'riss-verwechselt')),
        H('G', 'Der Grundriss ist die Ansicht von oben.', 'Er ist so lang und so tief wie der Quader.', 'Sind Länge und Tiefe gleich, ist es ein Quadrat.'), { nachweis: [AF('quader', 'oben', { quader: { a: s, b: s, c: h } }), { zahl: h, grund: 'Höhe, für den Grundriss ohne Bedeutung' }] }); },
  ]);
  sechs(A1, 'M', [
    () => { const w = bauMit(3, 3, 3, zz(6, 9), verschiedeneAnsichten('links', 'vorne', 'spiegelLinks'));
      return ansichtKarten('Der Seitenriss ist die Ansicht von links. Kreuze den Seitenriss an.', w, 'links', [[ansicht(w, 'vorne'), 'riss-verwechselt'], [spiegleZellen(ansicht(w, 'links')), 'riss-gespiegelt']],
        H('M', 'Stell dich links neben den Würfelbau.', 'Was vorne ist, siehst du jetzt rechts.')); },
    () => { const w = bauMit(3, 3, 3, zz(6, 9), (x) => true), n = ansicht(w, 'vorne').length;
      return zahl('Im Grundriss steht, wie viele Würfel übereinander stehen. Gib an, wie viele Kästchen der Aufriss hat.', n, [[w.length, 'wuerfel-verdeckt'], [ansicht(w, 'oben').length, 'riss-verwechselt'], [ansicht(w, 'links').length, 'riss-verwechselt']],
        H('M', 'Im Aufriss zählt in jeder Spalte nur der höchste Turm.', 'Suche in jeder Spalte des Grundrisses die größte Zahl und addiere.'), { bild: risseBild(grundrissMitZahlen(w)), nachweis: [ANSICHT('vorne', { wuerfel: w, wert: n })] }); },
    () => { const w = bauMit(3, 3, 3, zz(6, 9), verschiedeneAnsichten('vorne', 'links', 'spiegel'));
      return bildkarten('Im Grundriss steht, wie viele Würfel übereinander stehen. Kreuze den Aufriss an.', [[karte(ansicht(w, 'vorne')), true], [karte(ansicht(w, 'links')), false, 'riss-verwechselt'], [karte(spiegleZellen(ansicht(w, 'vorne'))), false, 'riss-gespiegelt']],
        H('M', 'Der Aufriss ist die Ansicht von vorne.', 'In jeder Spalte zählt die größte Zahl.'), { bild: risseBild(grundrissMitZahlen(w)), nachweis: [ANSICHT('vorne', { wuerfel: w })] }); },
    () => { const [a, b, c] = dreiMasse();
      return bildkarten('Ein Kästchen steht für einen Zentimeter. Kreuze den Seitenriss des Quaders an.', [[karte(quaderZellen(b, c)), true], [karte(quaderZellen(a, c)), false, 'riss-verwechselt'], [karte(quaderZellen(a, b)), false, 'riss-verwechselt']],
        H('M', 'Der Seitenriss ist die Ansicht von links.', `Du siehst die Fläche ADHE: ${b} cm breit und ${c} cm hoch.`), { bild: quader(a, b, c, { masse: masseVon(a, b, c), namen: true }), nachweis: [ANSICHT('links')] }); },
    () => { const k = kind();
      return auswahl(`${k} sagt: „Zwei verschiedene Würfelbauten haben auch verschiedene Aufrisse.“ Beurteile die Aussage.`,
        [opt('Stimmt nicht. Hinter einem Turm können verdeckte Würfel stehen.', true), opt('Stimmt. Der Aufriss zeigt jeden Würfel.', false, 'wuerfel-verdeckt'), opt('Stimmt. Jeder Würfelbau hat seinen eigenen Aufriss.', false, 'wuerfel-verdeckt')],
        H('M', 'Denk an einen Würfel, der hinter einem anderen steht.', 'Sieht man ihn von vorne?'), { nachweis: [U(false)] }); },
    () => { const w = bauMit(3, 3, 3, zz(6, 9), (x) => true), n = ansicht(w, 'links').length;
      return zahl('Im Grundriss steht, wie viele Würfel übereinander stehen. Gib an, wie viele Kästchen der Seitenriss hat.', n, [[w.length, 'wuerfel-verdeckt'], [ansicht(w, 'vorne').length, 'riss-verwechselt'], [ansicht(w, 'oben').length, 'riss-verwechselt']],
        H('M', 'Der Seitenriss ist die Ansicht von links.', 'Suche in jeder Reihe von vorne nach hinten die größte Zahl und addiere.'), { bild: risseBild(grundrissMitZahlen(w)), nachweis: [ANSICHT('links', { wuerfel: w, wert: n })] }); },
  ]);
  sechs(A1, 'E', [
    () => { const g = suche(() => { const w = bauMit(3, 2, 3, zz(5, 7), (x) => true), vorne = ansicht(w, 'vorne'), oben = ansicht(w, 'oben');
        const hoch = (x) => vorne.filter((p) => p[0] === x).length, max = oben.reduce((s, [x]) => s + hoch(x), 0); return { w, vorne, oben, max }; }, ({ w, max }) => max > w.length);
      const spalten = g.oben.map(([x]) => g.vorne.filter((p) => p[0] === x).length);
      return zahl('Ein Würfelbau hat diesen Grundriss und diesen Aufriss. Gib an, wie viele Würfel er höchstens hat.', g.max, [[g.w.length, 'wuerfel-verdeckt'], [g.vorne.length, 'wuerfel-verdeckt'], [g.oben.length, 'riss-verwechselt']],
        H('E', 'Auf jedem Kästchen des Grundrisses steht ein Turm. Wie hoch darf er nach dem Aufriss höchstens sein?'),
        { bild: risseBild(riss('von oben', g.oben), riss('von vorne', g.vorne)), nachweis: [`${spalten.join(' + ')} = ${g.max}`] }); },
    () => { const w = bauMit(3, 2, 3, zz(5, 7), (x) => !gleicheZellen(ansicht(x, 'vorne'), ansicht(x, 'hinten')) && verschiedeneAnsichten('hinten', 'oben', 'links')(x));
      return ansichtKarten('Du gehst um den Würfelbau herum und schaust von hinten. Kreuze die passende Ansicht an.', w, 'hinten', [[ansicht(w, 'vorne'), 'riss-gespiegelt'], [ansicht(w, 'links'), 'riss-verwechselt']],
        H('E', 'Von hinten ist links und rechts vertauscht.')); },
    () => { const w = bauMit(3, 2, 3, zz(5, 7), (x) => true), gleich = versteckteAenderungen(w).slice(0, 2);
      if (gleich.length < 2) return null;
      const anders = bauMit(3, 2, 3, zz(5, 7), (y) => !gleicheZellen(ansicht(y, 'vorne'), ansicht(w, 'vorne')));
      return bildkarten('Ein Würfelbau hat diesen Aufriss. Kreuze alle Würfelbauten an, die passen.', [[bau(w, { vorne: true }), true], ...gleich.map((x) => [bau(x, { vorne: true }), true]), [bau(anders, { vorne: true }), false, 'riss-verwechselt']],
        H('E', 'Verdeckte Würfel ändern den Aufriss nicht.'), { mehrfach: true, bild: risseBild(riss('von vorne', ansicht(w, 'vorne'))), nachweis: [ANSICHT('vorne')] }); },
    () => { const k = kind();
      return auswahl(`${k} sagt: „Haben zwei Quader denselben Grundriss, dann haben sie auch denselben Aufriss.“ Beurteile die Aussage.`,
        [opt('Stimmt nicht. Die Quader können verschieden hoch sein.', true), opt('Stimmt. Grundriss und Aufriss sind immer gleich.', false, 'riss-verwechselt'), opt('Stimmt. Der Grundriss bestimmt den ganzen Quader.', false, 'riss-verwechselt')],
        H('E', 'Der Grundriss zeigt Länge und Tiefe. Was fehlt?'), { nachweis: [U(false)] }); },
    () => { const [a, b, c] = dreiMasse(), n = b * c;
      return zahl(`Der Aufriss eines Quaders hat ${a} mal ${c} Kästchen. Sein Grundriss hat ${a} mal ${b} Kästchen. Gib an, wie viele Kästchen sein Seitenriss hat.`, n, [[a * c, 'riss-verwechselt'], [a * b, 'riss-verwechselt'], [b + c, 'riss-verwechselt']],
        H('E', 'Der Seitenriss ist so breit, wie der Quader tief ist, und so hoch wie der Aufriss.'), { nachweis: [ANSICHT('links', { quader: { a, b, c }, wert: n }), `${b} · ${c} = ${n}`] }); },
    () => { const w = bauMit(3, 3, 4, zz(8, 11), verschiedeneAnsichten('links', 'vorne', 'spiegelLinks'));
      return bildkarten('Im Grundriss steht, wie viele Würfel übereinander stehen. Kreuze den Seitenriss an.', [[karte(ansicht(w, 'links')), true], [karte(ansicht(w, 'vorne')), false, 'riss-verwechselt'], [karte(spiegleZellen(ansicht(w, 'links'))), false, 'riss-gespiegelt']],
        H('E', 'Von links gesehen ist vorne rechts.'), { bild: risseBild(grundrissMitZahlen(w)), nachweis: [ANSICHT('links', { wuerfel: w })] }); },
  ]);
}

// ---------- A2: Ansichten im Gitter färben ----------
const hFaerben = (n, von) => H(n, `Stell dir vor, du schaust ${VON[von]}.`, 'Färbe für jeden Würfel, den du siehst, ein Kästchen.', 'Würfel hintereinander siehst du nur einmal.');
function faerbeBau(text, w, von, n, { bild = 'bau', hilfen = null, fehler = null } = {}) {
  const soll = ansicht(w, von), andere = { vorne: ['oben', 'links'], oben: ['vorne', 'links'], links: ['vorne', 'oben'], hinten: ['oben', 'links'], rechts: ['vorne', 'oben'] }[von];
  const fl = fehler ?? [...andere.map((v) => [ansicht(w, v), 'riss-verwechselt']), [spiegleZellen(soll), 'riss-gespiegelt']];
  return ansichtFaerben(text, soll, fl, hilfen ?? hFaerben(n, von), { bild: bild === 'bau' ? bau(w, { vorne: true }) : risseBild(grundrissMitZahlen(w)), nachweis: [ANSICHT(von, { wuerfel: w })] });
}
function faerbeQuader(text, [a, b, c], von, n, hilfen) {
  const soll = { vorne: quaderZellen(a, c), oben: quaderZellen(a, b), links: quaderZellen(b, c) }[von];
  const fl = [[quaderZellen(a, c), 'riss-verwechselt'], [quaderZellen(a, b), 'riss-verwechselt'], [quaderZellen(b, c), 'riss-verwechselt']];
  return ansichtFaerben(text, soll, fl, hilfen, { bild: quader(a, b, c, { masse: masseVon(a, b, c), namen: true }), nachweis: [ANSICHT(von)] });
}
function a2() {
  sechs(A2, 'F', [
    () => faerbeBau(Z('Der Würfelbau steht in einer Reihe.', 'Färbe die Ansicht von vorne.'), bauMit(3, 1, 3, zz(4, 6), verschiedeneAnsichten('vorne', 'spiegel')), 'vorne', 'F'),
    () => faerbeQuader(Z('Ein Kästchen steht für einen Zentimeter.', 'Färbe die Ansicht des Quaders von vorne.'), dreiMasse(), 'vorne', 'F', H('F', 'Vorne siehst du die Fläche ABFE.', 'Lies ab, wie breit und wie hoch sie ist.', 'Färbe ein Rechteck mit dieser Breite und Höhe.')),
    () => faerbeBau(Z('Der Würfelbau steht in einer Reihe.', 'Färbe die Ansicht von oben.'), bauMit(4, 1, 3, zz(4, 7), (x) => true), 'oben', 'F', { hilfen: H('F', 'Von oben siehst du jeden Turm als ein Kästchen.', 'Die Höhe siehst du von oben nicht.', 'Färbe für jeden Turm ein Kästchen.') }),
    () => faerbeBau(Z('Der Würfelbau steht in einer Reihe.', 'Färbe die Ansicht von vorne.'), bauMit(4, 1, 3, zz(5, 8), verschiedeneAnsichten('vorne', 'spiegel')), 'vorne', 'F'),
    () => faerbeQuader(Z('Ein Kästchen steht für einen Zentimeter.', 'Färbe die Ansicht des Quaders von oben.'), dreiMasse(), 'oben', 'F', H('F', 'Von oben siehst du die Fläche EFGH.', 'Sie ist so lang wie AB und so tief wie BC.', 'Färbe ein Rechteck mit diesen Seiten.')),
    () => { const a = zz(2, 4); return ansichtFaerben(Z('Ein Kästchen steht für einen Zentimeter.', 'Färbe die Ansicht des Würfels von vorne.'), quaderZellen(a, a), [[quaderZellen(a + 1, a), 'tiefe-nicht-verkuerzt']],
      H('F', 'Ein Würfel hat lauter gleiche Quadrate.', `Jede Kante ist ${a} cm lang.`, `Färbe ein Quadrat mit ${a} mal ${a} Kästchen.`), { bild: wuerfelBild(a, { masse: [{ von: 'A', bis: 'B', t: `${a} cm` }] }), nachweis: [ANSICHT('vorne', { quader: { a, b: a, c: a } })] }); },
  ]);
  sechs(A2, 'G', [
    () => faerbeBau(Z('Der Aufriss ist die Ansicht von vorne.', 'Färbe den Aufriss.'), bauMit(3, 2, 3, zz(5, 7), verschiedeneAnsichten('vorne', 'oben', 'spiegel')), 'vorne', 'G'),
    () => faerbeBau(Z('Der Grundriss ist die Ansicht von oben.', 'Färbe den Grundriss.'), bauMit(3, 2, 3, zz(5, 7), verschiedeneAnsichten('oben', 'vorne')), 'oben', 'G', { hilfen: hOben('G') }),
    () => faerbeQuader(Z('Ein Kästchen steht für einen Zentimeter.', 'Färbe den Grundriss des Quaders.'), dreiMasse(), 'oben', 'G', H('G', 'Der Grundriss ist die Ansicht von oben.', 'Du siehst die Fläche EFGH.', 'Sie ist so lang wie AB und so tief wie BC.')),
    () => faerbeBau(Z('Im Grundriss steht, wie viele Würfel übereinander stehen.', 'Färbe den Aufriss.'), bauMit(3, 2, 3, zz(5, 8), verschiedeneAnsichten('vorne', 'oben', 'spiegel')), 'vorne', 'G',
      { bild: 'zahlen', hilfen: H('G', 'Der Aufriss ist die Ansicht von vorne.', 'In jeder Spalte zählt die größte Zahl.', 'Färbe in jeder Spalte so viele Kästchen übereinander.') }),
    () => faerbeBau(Z('Der Aufriss ist die Ansicht von vorne.', 'Färbe den Aufriss.'), bauMit(4, 2, 3, zz(6, 9), verschiedeneAnsichten('vorne', 'oben', 'spiegel')), 'vorne', 'G'),
    () => faerbeBau(Z('Der Grundriss ist die Ansicht von oben.', 'Färbe den Grundriss.'), bauMit(3, 3, 2, zz(6, 9), verschiedeneAnsichten('oben', 'vorne')), 'oben', 'G', { hilfen: hOben('G') }),
  ]);
  sechs(A2, 'M', [
    () => faerbeBau('Der Seitenriss ist die Ansicht von links. Färbe den Seitenriss.', bauMit(3, 3, 3, zz(6, 9), verschiedeneAnsichten('links', 'vorne', 'spiegelLinks')), 'links', 'M',
      { hilfen: H('M', 'Stell dich links neben den Würfelbau.', 'Was vorne ist, liegt im Seitenriss rechts.') }),
    () => faerbeBau('Im Grundriss steht, wie viele Würfel übereinander stehen. Färbe den Seitenriss.', bauMit(3, 3, 3, zz(7, 10), verschiedeneAnsichten('links', 'vorne', 'spiegelLinks')), 'links', 'M',
      { bild: 'zahlen', hilfen: H('M', 'Gehe die Reihen von vorne nach hinten durch.', 'In jeder Reihe zählt die größte Zahl. Vorne liegt im Seitenriss rechts.') }),
    () => faerbeQuader('Ein Kästchen steht für einen Zentimeter. Färbe den Seitenriss des Quaders.', dreiMasse(), 'links', 'M', H('M', 'Der Seitenriss ist die Ansicht von links.', 'Du siehst die Fläche ADHE. Sie ist so tief wie BC und so hoch wie AE.')),
    () => faerbeBau('Im Grundriss steht, wie viele Würfel übereinander stehen. Färbe den Aufriss.', bauMit(3, 3, 4, zz(8, 11), verschiedeneAnsichten('vorne', 'links', 'spiegel')), 'vorne', 'M',
      { bild: 'zahlen', hilfen: H('M', 'In jeder Spalte zählt die größte Zahl.', 'Färbe in jeder Spalte so viele Kästchen übereinander.') }),
    () => faerbeBau('Färbe den Grundriss des Würfelbaus.', bauMit(3, 3, 3, zz(7, 10), verschiedeneAnsichten('oben', 'vorne', 'links')), 'oben', 'M', { hilfen: H('M', 'Jeder Turm ist im Grundriss ein Kästchen.', 'Vorne ist im Grundriss unten.') }),
    () => faerbeBau('Färbe den Seitenriss des Würfelbaus.', bauMit(4, 3, 3, zz(8, 11), verschiedeneAnsichten('links', 'vorne', 'spiegelLinks')), 'links', 'M', { hilfen: H('M', 'Der Seitenriss ist die Ansicht von links.', 'Was vorne ist, liegt im Seitenriss rechts.') }),
  ]);
  sechs(A2, 'E', [
    () => faerbeBau('Du gehst um den Würfelbau herum. Färbe die Ansicht von hinten.', bauMit(3, 2, 3, zz(5, 8), (x) => !gleicheZellen(ansicht(x, 'vorne'), ansicht(x, 'hinten')) && verschiedeneAnsichten('hinten', 'oben')(x)), 'hinten', 'E',
      { hilfen: H('E', 'Von hinten sind links und rechts vertauscht.'), fehler: null }),
    () => faerbeBau('Im Grundriss steht, wie viele Würfel übereinander stehen. Färbe die Ansicht von rechts.', bauMit(3, 3, 3, zz(7, 10), (x) => !gleicheZellen(ansicht(x, 'links'), ansicht(x, 'rechts'))), 'rechts', 'E',
      { bild: 'zahlen', hilfen: H('E', 'Von rechts gesehen ist vorne links.') }),
    () => faerbeBau('Im Grundriss steht, wie viele Würfel übereinander stehen. Färbe den Seitenriss.', bauMit(3, 3, 4, zz(9, 12), verschiedeneAnsichten('links', 'vorne', 'spiegelLinks')), 'links', 'E',
      { bild: 'zahlen', hilfen: H('E', 'In jeder Reihe von vorne nach hinten zählt die größte Zahl.') }),
    () => { const [a, b, c] = dreiMasse();
      return ansichtFaerben(`Der Aufriss eines Quaders hat ${a} mal ${c} Kästchen. Sein Grundriss hat ${a} mal ${b} Kästchen. Färbe seinen Seitenriss.`, quaderZellen(b, c), [[quaderZellen(a, c), 'riss-verwechselt'], [quaderZellen(a, b), 'riss-verwechselt'], [quaderZellen(c, b), 'riss-gespiegelt']],
        H('E', 'Der Seitenriss ist so breit, wie der Quader tief ist, und so hoch wie der Aufriss.'), { nachweis: [ANSICHT('links', { quader: { a, b, c } })] }); },
    () => { const w = bauMit(3, 2, 3, zz(5, 7), (x) => true), hinten = w.filter(([, y]) => y === 1), turm = hinten.length ? wahl(hinten.filter(([x, y, z]) => !hinten.some((p) => p[0] === x && p[2] === z + 1))) : null;
      if (!turm) return null;
      const neu = [...w, [turm[0], turm[1], turm[2] + 1]];
      if (gleicheZellen(ansicht(neu, 'vorne'), ansicht(w, 'vorne'))) return null;
      return ansichtFaerben(`Auf den Turm hinten in Spalte ${turm[0] + 1} von links kommt noch ein Würfel. Färbe den neuen Aufriss.`, ansicht(neu, 'vorne'), [[ansicht(w, 'vorne'), 'wuerfel-verdeckt'], [spiegleZellen(ansicht(neu, 'vorne')), 'riss-gespiegelt']],
        H('E', 'Ein Würfel ganz oben kann einen Turm im Aufriss höher machen.'), { bild: bau(w, { vorne: true }), nachweis: [ANSICHT('vorne', { wuerfel: neu }), { zahl: turm[0] + 1, grund: 'Spalte' }] }); },
    () => faerbeBau('Färbe den Seitenriss des Würfelbaus.', bauMit(4, 3, 4, zz(9, 12), verschiedeneAnsichten('links', 'vorne', 'spiegelLinks')), 'links', 'E', { hilfen: H('E', 'Was vorne ist, liegt im Seitenriss rechts. Verdeckte Würfel ändern nichts.') }),
  ]);
}

export function ansichten() { a1(); a2(); }
