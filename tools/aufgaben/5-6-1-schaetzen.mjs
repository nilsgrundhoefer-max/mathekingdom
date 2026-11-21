// Aufgaben zu 5.6.1 „Größen schätzen“ (Lernziele S1 und S2) nach ADR 0015 und ADR 0033.
// S1: passende Einheit und Stützgrößen aus dem Alltag (Auswahl und Zuordnen).
// S2: mit einer Vergleichsgröße im Bild schätzen. F und G: Rechenweg in zwei Schritten, Hilfslinien im Bild.
// Ab M zählt der Schätzbereich (ein Fünftel nach oben und nach unten), und die Hilfslinien fallen weg.

import { sechs, zahl, auswahl, opt, sach, teil, zuordnen, schaetzeGroesse, Z, B, G, h1, h2, h3, zz, wahl, mische, fehlerliste, kind, HILFSGROESSE } from '../werkzeug.mjs';
import { EINHEITEN_TABELLE, gr, FAKTOR } from './5-6-groessen.mjs';

const S_ = (kurz) => `5.6.1-${kurz}`;
// Stützgrößen: [Ding, Frage, Satz mit Lücke für die Größe, richtige Größe, falsche Größen]
const STUETZ = {
  laenge: [
    ['Tür', 'Wie hoch ist eine Tür ungefähr?', 'Eine Tür ist ungefähr ▢ hoch.', '2 m', ['2 cm', '2 km', '20 m', '2 mm']],
    ['Schritt', 'Wie lang ist ein großer Schritt ungefähr?', 'Ein großer Schritt ist ungefähr ▢ lang.', '1 m', ['1 cm', '1 km', '10 m', '1 mm']],
    ['Fingerbreite', 'Wie breit ist ein Finger ungefähr?', 'Eine Fingerbreite ist ungefähr ▢.', '1 cm', ['1 m', '1 mm', '10 cm', '1 km']],
    ['Bleistift', 'Wie lang ist ein neuer Bleistift ungefähr?', 'Ein neuer Bleistift ist ungefähr ▢ lang.', '18 cm', ['18 mm', '18 m', '180 cm', '18 km']],
    ['Auto', 'Wie lang ist ein Auto ungefähr?', 'Ein Auto ist ungefähr ▢ lang.', '4 m', ['4 cm', '40 m', '4 km', '4 mm']],
    ['Fußballfeld', 'Wie lang ist ein Fußballfeld ungefähr?', 'Ein Fußballfeld ist ungefähr ▢ lang.', '100 m', ['100 cm', '10 m', '100 km', '10 km']],
    ['Schulheft', 'Wie lang ist ein großes Schulheft ungefähr?', 'Ein großes Schulheft ist ungefähr ▢ lang.', '30 cm', ['30 mm', '30 m', '3 cm', '3 m']],
    ['Bus', 'Wie lang ist ein Bus ungefähr?', 'Ein Bus ist ungefähr ▢ lang.', '12 m', ['12 cm', '120 m', '12 km', '120 cm']],
  ],
  gewicht: [
    ['Tafel Schokolade', 'Wie viel wiegt eine Tafel Schokolade?', 'Eine Tafel Schokolade wiegt ▢.', '100 g', ['100 kg', '1 g', '10 kg', '1 t']],
    ['Liter Milch', 'Wie viel wiegt ein Liter Milch ungefähr?', 'Ein Liter Milch wiegt ungefähr ▢.', '1 kg', ['1 g', '1 t', '100 g', '10 kg']],
    ['Apfel', 'Wie viel wiegt ein Apfel ungefähr?', 'Ein Apfel wiegt ungefähr ▢.', '200 g', ['200 kg', '2 g', '20 kg', '2 t']],
    ['Auto', 'Wie viel wiegt ein kleines Auto ungefähr?', 'Ein kleines Auto wiegt ungefähr ▢.', '1 t', ['1 kg', '100 kg', '10 g', '100 t']],
    ['Fahrrad', 'Wie viel wiegt ein Fahrrad ungefähr?', 'Ein Fahrrad wiegt ungefähr ▢.', '15 kg', ['15 g', '15 t', '150 g', '150 kg']],
    ['Schulranzen', 'Wie viel wiegt ein voller Schulranzen ungefähr?', 'Ein voller Schulranzen wiegt ungefähr ▢.', '5 kg', ['5 g', '5 t', '50 kg', '50 g']],
    ['Ei', 'Wie viel wiegt ein Ei ungefähr?', 'Ein Ei wiegt ungefähr ▢.', '60 g', ['60 kg', '6 kg', '600 g', '6 t']],
    ['Elefant', 'Wie viel wiegt ein Elefant ungefähr?', 'Ein Elefant wiegt ungefähr ▢.', '5 t', ['5 kg', '50 kg', '500 g', '500 kg']],
  ],
  zeit: [
    ['Schulstunde', 'Wie lange dauert eine Schulstunde?', 'Eine Schulstunde dauert ▢.', '45 min', ['45 s', '45 h', '4 h', '5 min']],
    ['Zähneputzen', 'Wie lange dauert das Zähneputzen ungefähr?', 'Das Zähneputzen dauert ungefähr ▢.', '3 min', ['3 s', '3 h', '30 min', '30 h']],
    ['Händeklatschen', 'Wie lange dauert einmal Händeklatschen?', 'Einmal Händeklatschen dauert ungefähr ▢.', '1 s', ['1 min', '1 h', '10 min', '10 s']],
    ['Nachtschlaf', 'Wie lange dauert der Nachtschlaf ungefähr?', 'Der Nachtschlaf dauert ungefähr ▢.', '10 h', ['10 min', '10 s', '1 h', '100 h']],
    ['Fußballspiel', 'Wie lange dauert ein Fußballspiel ohne Pause?', 'Ein Fußballspiel dauert ohne Pause ▢.', '90 min', ['90 s', '9 h', '90 h', '9 min']],
    ['Schultag', 'Wie lange dauert ein Schultag ungefähr?', 'Ein Schultag dauert ungefähr ▢.', '6 h', ['6 min', '6 s', '60 h', '60 s']],
  ],
  geld: [
    ['Brötchen', 'Wie viel kostet ein Brötchen ungefähr?', 'Ein Brötchen kostet ungefähr ▢.', '50 ct', ['50 €', '5 €', '500 €', '1 ct']],
    ['Kinokarte', 'Wie viel kostet eine Kinokarte ungefähr?', 'Eine Kinokarte kostet ungefähr ▢.', '8 €', ['8 ct', '80 ct', '800 €', '80 €']],
    ['Brot', 'Wie viel kostet ein Brot ungefähr?', 'Ein Brot kostet ungefähr ▢.', '3 €', ['3 ct', '30 ct', '300 €', '30 €']],
    ['Fahrrad', 'Wie viel kostet ein neues Fahrrad ungefähr?', 'Ein neues Fahrrad kostet ungefähr ▢.', '400 €', ['4 €', '40 ct', '4 ct', '40 €']],
  ],
};
const ARTEN = ['laenge', 'gewicht', 'zeit', 'geld'];
const ARTNAME = { laenge: 'Länge', gewicht: 'Gewicht', zeit: 'Zeit', geld: 'Geld' };
const einheitVon = (g) => g.split(' ')[1];
const zahlVon = (g) => Number(g.split(' ')[0]);
const stuetze = (arten = ARTEN, ohneMg = true) => { const art = wahl(arten); const [ding, frage, satz, wert, falsch] = wahl(STUETZ[art]); return { art, ding, frage, satz, wert, falsch: falsch.filter((f) => !ohneMg || !/ mg$/.test(f)) }; };
// Drei Vergleiche aus dem Alltag als kleine Tabelle (ohne das gefragte Ding).
const vergleichsTabelle = (ohne, art) => ({ kopf: ['Das kennst du', 'So groß ist es'], zeilen: mische(STUETZ[art].filter(([d]) => d !== ohne)).slice(0, 3).map(([d, , , w]) => [d, w]) });
const SG = (extra) => ({ art: 'stuetzgroesse', ...extra });
const TIPP_S = 'Vergleiche mit Dingen, die du kennst.';
// Drei oder vier Paare Ding und Größe, jede Größe passt nur zu einem Ding.
function paare(anzahl, arten) {
  const gewaehlt = mische(arten).slice(0, Math.min(arten.length, anzahl)), liste = [];
  for (let i = 0; i < anzahl; i++) { const art = gewaehlt[i % gewaehlt.length]; const frei = STUETZ[art].filter(([d]) => !liste.some((p) => p[0] === d)); liste.push(wahl(frei)); }
  return liste.map(([d, , , w]) => [d, w]);
}

// ---------- S2: Vergleichsbilder ----------
// [klein, groß, Richtung, Satz zur Vergleichsgröße, Größe in mm, Name des Großen mit Artikel, Frage]
const VERGLEICHE = [
  ['tuer', 'turm', 'hoch', 'Die Tür ist 2 m hoch.', 2000, 'der Turm', 'Wie hoch ist der Turm ungefähr?', 'Tür'],
  ['tuer', 'haus', 'hoch', 'Die Tür ist 2 m hoch.', 2000, 'das Haus', 'Wie hoch ist das Haus ungefähr?', 'Tür'],
  ['tuer', 'baum', 'hoch', 'Die Tür ist 2 m hoch.', 2000, 'der Baum', 'Wie hoch ist der Baum ungefähr?', 'Tür'],
  ['tuer', 'leuchtturm', 'hoch', 'Die Tür ist 2 m hoch.', 2000, 'der Leuchtturm', 'Wie hoch ist der Leuchtturm ungefähr?', 'Tür'],
  ['tuer', 'mast', 'hoch', 'Die Tür ist 2 m hoch.', 2000, 'der Fahnenmast', 'Wie hoch ist der Fahnenmast ungefähr?', 'Tür'],
  ['auto', 'bus', 'lang', 'Das Auto ist 4 m lang.', 4000, 'der Bus', 'Wie lang ist der Bus ungefähr?', 'Auto'],
  ['auto', 'lkw', 'lang', 'Das Auto ist 4 m lang.', 4000, 'der Lastwagen', 'Wie lang ist der Lastwagen ungefähr?', 'Auto'],
  ['auto', 'schiff', 'lang', 'Das Auto ist 4 m lang.', 4000, 'das Schiff', 'Wie lang ist das Schiff ungefähr?', 'Auto'],
  ['auto', 'bruecke', 'lang', 'Das Auto ist 4 m lang.', 4000, 'die Brücke', 'Wie lang ist die Brücke ungefähr?', 'Auto'],
];
const KIND_BILDER = [
  ['kind', 'baum', 'hoch', 'Das Kind ist 150 cm groß.', 1500, 'der Baum', 'Wie hoch ist der Baum ungefähr?', 'Kind'],
  ['kind', 'haus', 'hoch', 'Das Kind ist 150 cm groß.', 1500, 'das Haus', 'Wie hoch ist das Haus ungefähr?', 'Kind'],
  ['kind', 'turm', 'hoch', 'Das Kind ist 150 cm groß.', 1500, 'der Turm', 'Wie hoch ist der Turm ungefähr?', 'Kind'],
  ['kind', 'mast', 'hoch', 'Das Kind ist 150 cm groß.', 1500, 'der Fahnenmast', 'Wie hoch ist der Fahnenmast ungefähr?', 'Kind'],
];
const BUS_BILDER = [
  ['bus', 'schiff', 'lang', 'Der Bus ist 12 m lang.', 12000, 'das Schiff', 'Wie lang ist das Schiff ungefähr?', 'Bus'],
  ['bus', 'bruecke', 'lang', 'Der Bus ist 12 m lang.', 12000, 'die Brücke', 'Wie lang ist die Brücke ungefähr?', 'Bus'],
];
const gross = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// Ein Vergleich mit ganzzahligem Vielfachen: liefert Bild, Texte und Nachweis.
function vergleich(liste, malVon, malBis, hilfslinien) {
  const [klein, gro, richtung, satz, mm, name, frage, kurz] = wahl(liste), mal = zz(malVon, Math.min(malBis, gro === 'bus' || gro === 'lkw' ? 4 : malBis));
  return { satz, mm, name, frage, kurz, mal, richtung, bild: B.vergleichsbild(klein, gro, richtung, mal * 10, hilfslinien), vb: (teilNr) => ({ art: 'vergleichsbild', zehntel: mal * 10, mal, ...(teilNr ? { teil: teilNr } : {}) }) };
}
// Ein Vergleich mit Zehnteln (3,5-mal) für den Schätzbereich ab M.
function vergleichFein(liste, zehntelVon, zehntelBis, schritt) {
  const [klein, gro, richtung, satz, mm, name, frage, kurz] = wahl(liste), zehntel = zz(zehntelVon / schritt, Math.min(zehntelBis, gro === 'bus' || gro === 'lkw' ? 45 : zehntelBis) / schritt) * schritt;
  return { satz, mm, name, frage, kurz, zehntel, richtung, bild: B.vergleichsbild(klein, gro, richtung, zehntel), vb: { art: 'vergleichsbild', zehntel } };
}
const passt = (v) => `${v.kurz === 'Kind' ? 'Das Kind' : v.kurz === 'Bus' ? 'Der Bus' : v.kurz === 'Auto' ? 'Das Auto' : 'Die Tür'} passt ${v.mal}-mal in ${v.name.replace(/^der /, 'den ')}.`;
const wieOft = (v) => `Wie oft passt ${v.kurz === 'Kind' ? 'das Kind' : v.kurz === 'Bus' ? 'der Bus' : v.kurz === 'Auto' ? 'das Auto' : 'die Tür'} in ${v.name.replace(/^der /, 'den ')}?`;
const H_S2 = (v) => h3('Zähle, wie oft die Vergleichsgröße hineinpasst. Rechne dann mal.', 'Die Tür ist 2 m hoch. Sie passt 3-mal hinein. Dann sind es ungefähr 3 · 2 m = 6 m.', `Die Vergleichsgröße passt ${v.mal}-mal hinein. Rechne ${v.mal} mal ${gr(v.mm, v.mm % 1000 ? 'cm' : 'm')}.`);

export function groessenSchaetzen() {
  // =====================================================================
  // S1 Passende Einheit und Vergleich aus dem Alltag
  // =====================================================================
  const groessenart = () => { const e = wahl(['m', 'cm', 'km', 'kg', 'g', 't', 'min', 'h', 's', '€', 'ct']), art = Object.keys(STUETZ).find((a) => STUETZ[a].some(([, , , w]) => einheitVon(w) === e)) ?? (['km', 'mm'].includes(e) ? 'laenge' : 'gewicht');
    return auswahl(Z('Schau in die Tabelle.', `Was misst du mit der Einheit ${e}?`), ARTEN.filter((a) => a === art).concat(mische(ARTEN.filter((a) => a !== art)).slice(0, 2)).map((a) => opt(ARTNAME[a], a === art, a === art ? undefined : 'einheit-fehlt')),
      h3('Suche die Einheit in der Tabelle.', 'Die Einheit cm steht bei der Länge. Mit cm misst du also eine Länge.', `Suche ${e} in der rechten Spalte. Lies links ab.`), { daten: EINHEITEN_TABELLE, nachweis: [{ art: 'groessenart', einheit: e }] }); };
  const dingZuGroesse = (anzahl, arten, mitTabelle) => () => { const s = stuetze(arten);
    return auswahl(mitTabelle ? Z('Die Tabelle hilft dir beim Vergleichen.', s.frage) : s.frage, [opt(s.wert, true), ...mische(s.falsch).slice(0, anzahl - 1).map((f) => opt(f, false, 'groesse-ohne-vorstellung'))],
      anzahl <= 3 ? h3(TIPP_S, 'Ein großer Schritt ist 1 m lang. Eine Tür ist höher: ungefähr 2 m.', 'Stell dir das Ding vor. Welche Angabe ist viel zu klein, welche viel zu groß?') : anzahl === 4 ? h2(TIPP_S, 'Streiche zuerst, was viel zu klein oder viel zu groß ist.') : h1(TIPP_S),
      { ...(mitTabelle ? { daten: vergleichsTabelle(s.ding, s.art) } : {}), nachweis: [SG({ ding: s.ding })] }); };
  const einheitWaehlen = (anzahl, mitTabelle) => () => { const s = stuetze(), e = einheitVon(s.wert), andere = [...new Set(s.falsch.filter((f) => zahlVon(f) === zahlVon(s.wert)).map(einheitVon))].filter((x) => x !== e);
    if (andere.length < anzahl - 1) return null;
    return auswahl(Z(mitTabelle && 'Schau in die Tabelle.', 'Welche Einheit passt?', s.satz.replace('▢', `${zahlVon(s.wert)} ▢`)), [opt(e, true), ...andere.slice(0, anzahl - 1).map((x) => opt(x, false, 'groesse-ohne-vorstellung'))],
      anzahl <= 3 ? h3('Setze jede Einheit ein. Was kann stimmen?', 'Eine Tür ist 2 ▢ hoch. 2 cm ist viel zu klein, 2 km viel zu groß. Es passt 2 m.', 'Stell dir die Größe mit jeder Einheit vor.') : h2('Setze jede Einheit ein. Was kann stimmen?', 'Stell dir die Größe mit jeder Einheit vor.'),
      { ...(mitTabelle ? { daten: EINHEITEN_TABELLE } : {}), nachweis: [SG({ ding: s.ding, zahl: zahlVon(s.wert) })] }); };
  const groesseZuDing = (anzahl, mitTabelle) => () => { const art = wahl(['laenge', 'gewicht', 'zeit']), liste = mische(STUETZ[art]), [ding, , , wert] = liste[0];
    // Die falschen Dinge müssen deutlich anders groß sein.
    const klein = (w) => zahlVon(w) * FAKTOR[einheitVon(w)], andere = liste.slice(1).filter(([, , , w]) => klein(w) > klein(wert) * 3 || klein(w) * 3 < klein(wert)).slice(0, anzahl - 1);
    if (andere.length < anzahl - 1) return null;
    const verb = art === 'laenge' ? 'ist ungefähr' : art === 'gewicht' ? 'wiegt ungefähr' : 'dauert ungefähr';
    return auswahl(Z(mitTabelle && 'Schau in die Tabelle.', `Was ${verb} ${wert}${art === 'laenge' ? ' lang oder hoch' : ''}?`), [opt(ding, true), ...andere.map(([d]) => opt(d, false, 'groesse-ohne-vorstellung'))],
      anzahl <= 3 ? h3(TIPP_S, 'Was wiegt ungefähr 1 kg? Ein Liter Milch. Ein Auto ist viel schwerer.', 'Stell dir jedes Ding vor. Ist es viel kleiner oder viel größer?') : anzahl === 4 ? h2(TIPP_S, 'Stell dir jedes Ding vor. Ist es viel kleiner oder viel größer?') : h1(TIPP_S),
      { ...(mitTabelle ? { daten: EINHEITEN_TABELLE } : {}), nachweis: [SG({ groesse: wert })] }); };
  const zuordnung = (anzahl, arten, mitTabelle) => () => { const p = paare(anzahl, arten);
    return zuordnen(Z(mitTabelle && 'Schau in die Tabelle.', 'Was passt zusammen?'), p, anzahl <= 3 ? h3(TIPP_S, 'Eine Tafel Schokolade wiegt 100 g. Ein Auto wiegt 1 t.', 'Achte zuerst auf die Einheit: Länge, Gewicht oder Zeit?') : anzahl === 4 ? h2(TIPP_S, 'Achte zuerst auf die Einheit: Länge, Gewicht oder Zeit?') : h1(TIPP_S),
      { ...(mitTabelle ? { daten: EINHEITEN_TABELLE } : {}), nachweis: [SG({})] }); };
  const urteilDing = (niveau) => () => { const s = stuetze(niveau === 'G' ? ['laenge', 'gewicht', 'zeit'] : ARTEN), stimmt = wahl([true, false, false]), genannt = stimmt ? s.wert : wahl(s.falsch), k = kind();
    return auswahl(Z(`${k} sagt:`, `„${s.satz.replace('▢', genannt)}“`, 'Stimmt das?'), [opt('Stimmt.', stimmt), opt(`Falsch. Es sind ungefähr ${s.wert}.`, !stimmt), opt(`Falsch. Es sind ungefähr ${stimmt ? s.falsch[0] : s.falsch.find((f) => f !== genannt)}.`, false, 'groesse-ohne-vorstellung')],
      niveau === 'G' ? h3(TIPP_S, 'Eine Tür ist 2 m hoch. Die Angabe 2 cm kann nicht stimmen.', 'Stell dir die genannte Größe vor. Passt sie zu dem Ding?') : niveau === 'M' ? h2(TIPP_S, 'Stell dir die genannte Größe vor. Passt sie zu dem Ding?') : h1(TIPP_S),
      { nachweis: [{ art: 'urteil', stimmt, ding: s.ding, groesse: genannt }, HILFSGROESSE(s.wert, `Stützgröße: ${s.ding}`)] }); };
  const saetze = (anzahl) => () => { const alle = mische(ARTEN.flatMap((a) => STUETZ[a])).slice(0, anzahl), richtige = zz(1, anzahl - 2);
    const optionen = alle.map(([ding, , , wert, falsch], i) => (i < richtige ? opt(`${ding}: ${wert}`, true) : opt(`${ding}: ${wahl(falsch)}`, false, 'groesse-ohne-vorstellung')));
    return auswahl(Z('Welche Angaben können stimmen?', 'Kreuze alle an.'), optionen, anzahl <= 4 ? h3(TIPP_S, 'Tür: 2 m kann stimmen. Tür: 2 km kann nicht stimmen.', 'Prüfe jede Angabe einzeln.') : anzahl === 5 ? h2(TIPP_S, 'Prüfe jede Angabe einzeln.') : h1(TIPP_S),
      { mehrfach: true, nachweis: [SG({ saetze: true })] }); };
  // Mit Stützgrößen rechnen: Wie viele Tafeln Schokolade wiegen so viel wie ein Liter Milch?
  const RECHNEN = [
    ['Wie viele große Schritte brauchst du ungefähr für die Länge eines Fußballfelds?', '100 m', '1 m', 'Ein Fußballfeld ist ungefähr 100 m lang.', 'Ein großer Schritt ist ungefähr 1 m lang.', 'Schritte'],
    ['Wie viele Tafeln Schokolade wiegen zusammen so viel wie ein Liter Milch?', '1 kg', '100 g', 'Ein Liter Milch wiegt ungefähr 1 kg.', 'Eine Tafel Schokolade wiegt 100 g.', 'Tafeln'],
    ['Wie viele Autos passen hintereinander auf die Länge eines Fußballfelds?', '100 m', '4 m', 'Ein Fußballfeld ist ungefähr 100 m lang.', 'Ein Auto ist ungefähr 4 m lang.', 'Autos'],
    ['Wie viele Schulstunden dauern zusammen so lange wie zwei Fußballspiele ohne Pause?', '180 min', '45 min', 'Zwei Fußballspiele dauern ohne Pause 180 min.', 'Eine Schulstunde dauert 45 min.', 'Schulstunden'],
    ['Wie viele Fahrräder wiegen zusammen ungefähr so viel wie ein Elefant mit 6 t?', '6 t', '15 kg', null, 'Ein Fahrrad wiegt ungefähr 15 kg.', 'Fahrräder'],
    ['Wie viele Türen übereinander sind ungefähr so hoch wie ein Turm mit 30 m?', '30 m', '2 m', null, 'Eine Tür ist ungefähr 2 m hoch.', 'Türen'],
    ['Wie viele Äpfel wiegen zusammen ungefähr so viel wie ein Schulranzen mit 5 kg?', '5 kg', '200 g', null, 'Ein Apfel wiegt ungefähr 200 g.', 'Äpfel'],
  ];
  const rechnen = (liste, niveau) => () => { const [frage, ganz, stueck, grund1, grund2, einheit] = wahl(liste), wert = (g) => zahlVon(g) * FAKTOR[einheitVon(g)], n = wert(ganz) / wert(stueck);
    return zahl(frage, n, fehlerliste(n, [[zahlVon(ganz) * zahlVon(stueck), 'sach-falsche-rechnung'], [n * 10, 'umrechnungszahl'], [n / 10, 'umrechnungszahl']]),
      niveau === 'M' ? h2('Du brauchst zwei Stützgrößen. Rechne beide in dieselbe Einheit um.', `${grund1 ?? ''} ${grund2} Wie oft passt das Kleine in das Große?`.trim()) : h1('Du brauchst Stützgrößen. Rechne in dieselbe Einheit um.'),
      { einheit, nachweis: [...(grund1 ? [HILFSGROESSE(ganz, grund1)] : []), HILFSGROESSE(stueck, grund2), G(`${ganz} : ${stueck} = ${n}`)] }); };
  const sinnvoll = () => { const [satz, ding, n, e, falsch] = wahl([['Der Schulweg von Mia ist 2 ▢ lang.', 'Schulweg', 2, 'km', ['m', 'cm', 'mm']], ['Ein Pferd wiegt 600 ▢.', 'Pferd', 600, 'kg', ['g', 't', 'mg']], ['Ein Spielfilm dauert 90 ▢.', 'Spielfilm', 90, 'min', ['s', 'h', 'd']], ['Ein Zimmer ist 250 ▢ hoch.', 'Zimmer', 250, 'cm', ['mm', 'm', 'km']], ['Eine Feder wiegt 10 ▢.', 'Feder', 10, 'mg', ['g', 'kg', 't']]]);
    return auswahl(Z('Welche Einheit ist sinnvoll?', satz.replace('▢', '▢').replace(`${n} ▢`, `${n} ▢`)), [opt(e, true), ...falsch.map((x) => opt(x, false, 'groesse-ohne-vorstellung'))], h2('Setze jede Einheit ein. Was kann stimmen?', 'Vergleiche mit einer Stützgröße, die du kennst.'), { nachweis: [SG({ ding, zahl: n })] }); };

  sechs(S_('S1'), 'F', [groessenart, dingZuGroesse(3, ['laenge'], true), dingZuGroesse(3, ['gewicht', 'zeit'], true), einheitWaehlen(3, true), zuordnung(3, ['laenge', 'gewicht', 'zeit'], true), groesseZuDing(3, true)]);
  sechs(S_('S1'), 'G', [dingZuGroesse(3, ARTEN, true), groesseZuDing(3, true), zuordnung(3, ARTEN, true), einheitWaehlen(3, false), saetze(4), urteilDing('G')]);
  sechs(S_('S1'), 'M', [dingZuGroesse(4, ARTEN, false), zuordnung(4, ARTEN, false), saetze(5), sinnvoll, groesseZuDing(4, false), rechnen(RECHNEN.slice(0, 4), 'M')]);
  sechs(S_('S1'), 'E', [dingZuGroesse(5, ARTEN, false), saetze(6), zuordnung(5, ARTEN, false), urteilDing('E'), rechnen(RECHNEN.slice(4), 'E'), rechnen(RECHNEN.slice(1, 5), 'E')]);

  // =====================================================================
  // S2 Mit einer Vergleichsgröße schätzen
  // =====================================================================
  const einheitF = (v) => (v.mm % 1000 ? 'cm' : 'm');
  const zweiSchritte = (liste, von, bis, linien) => () => { const v = vergleich(liste, von, bis, linien), e = einheitF(v), n = (v.mal * v.mm) / FAKTOR[e];
    return sach(Z('Schau auf das Bild.', v.satz), [teil(wieOft(v), v.mal, 'mal', fehlerliste(v.mal, [[v.mal + 1, 'vergleich-nicht-genutzt'], [v.mal - 1, 'vergleich-nicht-genutzt']])), teil(v.frage, n, e, fehlerliste(n, [[v.mm / FAKTOR[e], 'vergleich-nicht-genutzt'], [v.mal, 'vergleich-nicht-genutzt'], [v.mal + v.mm / FAKTOR[e], 'schaetzen-addiert']]))],
      H_S2(v), { bild: v.bild, nachweis: [v.vb(1), G(`${v.mal} · ${gr(v.mm, e)} = ${gr(v.mal * v.mm, e)}`, 2)] }); };
  const einSchritt = (liste, von, bis, linien, inM = false) => () => { const v = vergleich(liste, von, bis, linien), e = inM ? 'm' : einheitF(v), roh = einheitF(v), n = (v.mal * v.mm) / FAKTOR[e];
    if (!Number.isInteger(n)) return null;
    return zahl(Z(v.satz, passt(v), v.frage), n, fehlerliste(n, [[v.mm / FAKTOR[roh], 'vergleich-nicht-genutzt'], [v.mal + v.mm / FAKTOR[roh], 'schaetzen-addiert'], ...(e !== roh ? [[(v.mal * v.mm) / FAKTOR[roh], 'einheit-fehlt']] : [])]),
      H_S2(v), { einheit: e, bild: v.bild, nachweis: [v.vb(), G(`${v.mal} · ${gr(v.mm, roh)} = ${gr(v.mal * v.mm, roh)}${e !== roh ? ` = ${gr(v.mal * v.mm, e)}` : ''}`)] }); };
  const rechnungWahl = (liste, linien) => () => { const v = vergleich(liste, 3, 6, linien), e = einheitF(v), g = gr(v.mm, e);
    return auswahl(Z(v.satz, passt(v), 'Welche Rechnung passt zum Schätzen?'), [opt(`${v.mal} · ${g}`, true), opt(`${g} + ${gr(v.mal * FAKTOR[e], e)}`, false, 'schaetzen-addiert'), opt(`${gr(v.mm * v.mal, e)} : ${v.mal}`, false, 'vergleich-nicht-genutzt')],
      H_S2(v), { bild: v.bild, nachweis: [v.vb(), G(`${v.mal} · ${g} = ${gr(v.mal * v.mm, e)}`)] }); };
  // Rückwärts: Das Große ist bekannt, gesucht ist die Vergleichsgröße.
  const rueckwaerts = (linien) => () => { const mal = zz(2, 4), bild = B.vergleichsbild('auto', wahl(['bus', 'lkw']), 'lang', mal * 10, linien), ganz = mal * 4, name = bild.gross === 'bus' ? 'Bus' : 'Lastwagen';
    return zahl(Z(`Der ${name} ist ${ganz} m lang.`, `Das Auto passt ${mal}-mal hinein.`, 'Wie lang ist das Auto ungefähr?'), 4, fehlerliste(4, [[ganz * mal, 'umrechnungsrichtung'], [ganz - mal, 'sach-falsche-rechnung']]),
      h3('Das Große ist bekannt. Teile durch die Anzahl.', 'Der Bus ist 12 m lang. Das Auto passt 3-mal hinein. Dann ist es 12 m : 3 = 4 m lang.', `Rechne ${ganz} m geteilt durch ${mal}.`), { einheit: 'm', bild, nachweis: [{ art: 'vergleichsbild', zehntel: mal * 10, mal }, G(`${ganz} m : ${mal} = 4 m`)] }); };
  const urteilSchaetzung = (liste, niveau, fein) => () => { const v = fein ? vergleichFein(liste, 25, 65, 5) : vergleich(liste, 3, 6, niveau === 'G'), e = einheitF(v), zehntel = v.zehntel ?? v.mal * 10, wahr = (v.mm * zehntel) / 10;
    if (wahr % FAKTOR[e]) return null;
    const stimmt = wahl([true, false, false]), behauptet = stimmt ? wahr : wahl([wahr * 2, v.mm * 10, wahr + v.mm * 3]), k = kind();
    const rechnung = fein ? `${gr(v.mm, e)} · ${zehntel} : 10 = ${gr(wahr, e)}` : `${v.mal} · ${gr(v.mm, e)} = ${gr(wahr, e)}`;
    return auswahl(Z(v.satz, `${k} schätzt: ${gross(v.name)} ist ungefähr ${gr(behauptet, e)} ${v.richtung === 'hoch' ? 'hoch' : 'lang'}.`, 'Stimmt das?'),
      [opt(`Stimmt. Das passt zum Bild.`, stimmt), opt(`Falsch. Es sind ungefähr ${gr(stimmt ? wahr * 2 : wahr, e)}.`, !stimmt, stimmt ? 'schaetzen-addiert' : undefined), opt(`Falsch. Es sind ungefähr ${gr(v.mm, e)}.`, false, 'vergleich-nicht-genutzt')],
      niveau === 'G' ? H_S2(v) : niveau === 'M' ? h2('Schätze selbst mit der Vergleichsgröße. Vergleiche dann.', 'Wie oft passt die Vergleichsgröße hinein? Auch halbe zählen.') : h1('Schätze selbst mit der Vergleichsgröße. Vergleiche dann.'),
      { bild: v.bild, nachweis: [fein ? v.vb : v.vb(), G(rechnung), { art: 'urteil', stimmt, behauptet: gr(behauptet, e) }] }); };
  // Ab M: Schätzen mit Schätzbereich. Die Lösung ist das genaue Maß.
  const bereich = (liste, von, bis, schritt, e, niveau) => () => { const v = vergleichFein(liste, von, bis, schritt), wahr = (v.mm * v.zehntel) / 10, n = wahr / FAKTOR[e];
    if (!Number.isInteger(n) || n < 5) return null;
    const unten = Math.ceil(n * 0.8), kl = v.mm / FAKTOR[e];
    return schaetzeGroesse(Z(v.satz, v.frage), v.bild, n, e, [[kl, Math.min(kl, unten - 1), 'vergleich-nicht-genutzt']].filter(([a, b]) => a <= b),
      niveau === 'M' ? h2('Wie oft passt die Vergleichsgröße hinein? Rechne dann mal.', 'Miss mit dem Finger am Bildschirm ab. Auch eine halbe Vergleichsgröße zählt.') : h1('Wie oft passt die Vergleichsgröße hinein? Rechne dann mal.'),
      { nachweis: [v.vb, G(`${gr(v.mm, e)} · ${v.zehntel} : 10 = ${gr(wahr, e)}`)] }); };
  const besteSchaetzung = (liste) => () => { const v = vergleichFein(liste, 25, 65, 5), e = 'm', wahr = (v.mm * v.zehntel) / 10;
    if (wahr % 1000) return null;
    return auswahl(Z(v.satz, v.frage, 'Welche Schätzung passt am besten?'), [opt(gr(wahr, e), true), opt(gr(v.mm, e), false, 'vergleich-nicht-genutzt'), opt(gr(wahr * 3, e), false), opt(gr(wahr * 10, e), false, 'umrechnungszahl')],
      h2('Wie oft passt die Vergleichsgröße hinein? Rechne dann mal.', 'Auch eine halbe Vergleichsgröße zählt.'), { bild: v.bild, nachweis: [v.vb, G(`${gr(v.mm, e)} · ${v.zehntel} : 10 = ${gr(wahr, e)}`)] }); };
  const unterschied = () => { const v = vergleichFein(KIND_BILDER, 30, 70, 10), wahr = (v.mm * v.zehntel) / 10, n = (wahr - v.mm) / 10;
    return schaetzeGroesse(Z(v.satz, `Um wie viele Zentimeter ist ${v.name} ungefähr höher als das Kind?`), v.bild, n, 'cm', [[150, Math.min(150, Math.ceil(n * 0.8) - 1), 'vergleich-nicht-genutzt']].filter(([a, b]) => a <= b),
      h1('Schätze zuerst die ganze Höhe. Ziehe dann die Größe des Kindes ab.'), { nachweis: [v.vb, G(`150 cm · ${v.zehntel} : 10 = ${gr(wahr, 'cm')}`), G(`${gr(wahr, 'cm')} − 150 cm = ${n} cm`)] }); };

  sechs(S_('S2'), 'F', [zweiSchritte(VERGLEICHE.slice(0, 5), 2, 5, true), einSchritt(VERGLEICHE.slice(0, 5), 2, 5, true), rechnungWahl(VERGLEICHE, true), einSchritt(VERGLEICHE.slice(5), 2, 5, true), einSchritt(KIND_BILDER, 2, 4, true), zweiSchritte(VERGLEICHE.slice(5), 2, 5, true)]);
  sechs(S_('S2'), 'G', [zweiSchritte(VERGLEICHE, 3, 7, false), einSchritt(BUS_BILDER, 2, 5, true), einSchritt(KIND_BILDER, 2, 6, false, true), zweiSchritte(KIND_BILDER, 3, 6, true), rueckwaerts(false), urteilSchaetzung(VERGLEICHE, 'G', false)]);
  sechs(S_('S2'), 'M', [bereich(VERGLEICHE.slice(0, 5), 25, 65, 5, 'm', 'M'), bereich(VERGLEICHE.slice(5), 25, 65, 5, 'm', 'M'), bereich(KIND_BILDER, 25, 65, 5, 'cm', 'M'), bereich(BUS_BILDER, 25, 55, 5, 'm', 'M'), besteSchaetzung(VERGLEICHE), urteilSchaetzung(VERGLEICHE, 'M', true)]);
  sechs(S_('S2'), 'E', [bereich(KIND_BILDER, 22, 78, 1, 'cm', 'E'), bereich(VERGLEICHE, 22, 78, 1, 'cm', 'E'), bereich(BUS_BILDER, 22, 58, 1, 'dm', 'E'), urteilSchaetzung(KIND_BILDER, 'E', true), bereich(VERGLEICHE.slice(0, 5), 82, 118, 1, 'dm', 'E'), unterschied]);
}
