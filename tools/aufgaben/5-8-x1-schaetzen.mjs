// Aufgaben zum Abstecher 5.8.X1 „Flächen schätzen“ (Lernziel A1) nach ADR 0015 und ADR 0035.
// A1: Flächen mit Stützgrößen schätzen. Wie oft passt eine bekannte Fläche (Heftseite, Zeitung, Klassenzimmer) hinein?
// Auf F und G zeigt ein Kästchenraster, wie oft die Stützgröße hineinpasst; die Legende nennt das Ding („= 1 Heftseite“).

import { sechs, zahl, groesse, Z, G, h1, h2, h3, fehlerliste } from '../werkzeug.mjs';
import { QF, q, form, setze, rasterBild, NF, inhaltVon, zz, wahl } from './5-8-flaechen.mjs';
import { VORSTELLUNG, VORSTELLUNG_G, einheitWaehlen, angabeWaehlen, dingeZuordnen, urteilDing, DINGE } from './5-8-2-flaechenmasse.mjs';

const A1 = '5.8.X1-A1';
// Stützgrößen für das Raster: [Ding im Bild, Name in der Legende, Satz zur Größe, Zahl, Einheit, Fläche, Frage, Bereich der Anzahl]
const AUSLEGEN = [
  ['Heftseite', 'Eine Heftseite ist ungefähr 6 dm² groß.', 6, 'dm²', 'die Tischplatte', [8, 20]],
  ['Zeitung', 'Eine aufgeklappte Zeitung ist ungefähr 1 m² groß.', 1, 'm²', 'der Boden des Kinderzimmers', [9, 18]],
  ['Postkarte', 'Eine Postkarte ist ungefähr 150 cm² groß.', 150, 'cm²', 'das Brett', [4, 9]],
];
// Ein Rechteck aus n Kästchen auf dem Raster, jedes Kästchen ist ein Ding.
function auslegen(ding, n) {
  const teiler = [...Array(n + 1).keys()].filter((w) => w >= 2 && n % w === 0 && w <= 12 && n / w >= 2 && n / w <= 7);
  if (!teiler.length) return null;
  const w = wahl(teiler), g = setze([{ rechtecke: [[0, 0, w, n / w]] }], { maxB: 14 });
  return g && rasterBild('kaestchen', g, null, `1 ${ding}`);
}
function auslegenAufgabe(hilfen, { nur = null, satzEinzeln = true } = {}) {
  const [ding, satz, zahlW, e, was, [von, bis]] = nur ? AUSLEGEN.find((x) => x[0] === nur) : wahl(AUSLEGEN), n = zz(von, bis), bild = auslegen(ding, n);
  if (!bild) return null;
  const w = n * zahlW, Was = was[0].toUpperCase() + was.slice(1);
  const text = satzEinzeln ? Z(`${Was} ist mit ${ding === 'Zeitung' ? 'Zeitungen' : `${ding}n`} ausgelegt.`, satz, `Wie groß ist ${was} ungefähr?`) : `${Was} ist mit ${ding === 'Zeitung' ? 'Zeitungen' : `${ding}n`} ausgelegt. ${satz} Wie groß ist ${was} ungefähr?`;
  return zahl(text, w, fehlerliste(w, [[n, 'schaetzen-nicht-hochgerechnet'], [n + zahlW, 'schaetzen-addiert']]), hilfen,
    { einheit: e, bild, nachweis: [NF('inhalt', n), G(`${n} · ${q(zahlW, e)} = ${q(w, e)}`)] });
}
// Wie oft passt eine Fläche in eine andere? Beide Größen stehen im Text, wenn nötig in verschiedenen Einheiten.
function wieOft(text, gross, klein, hilfen, umweg = null) {
  const [gw, ge] = gross, [kw, ke] = klein, n = (gw * QF[ge]) / (kw * QF[ke]);
  if (!Number.isInteger(n)) return null;
  const nachweis = umweg ? [G(`${q(gw, ge)} = ${q((gw * QF[ge]) / QF[ke], ke)}`), G(`${q((gw * QF[ge]) / QF[ke], ke)} : ${q(kw, ke)} = ${n}`)] : [G(`${q(gw, ge)} : ${q(kw, ke)} = ${n}`)];
  return zahl(text, n, fehlerliste(n, [[gw * kw, 'div-falsche-rechenart'], [n / 100, 'umrechnungszahl-flaeche'], [n * 100, 'umrechnungszahl-flaeche']].filter(([x]) => Number.isInteger(x))), hilfen, { nachweis });
}

export function flaechenSchaetzen() {
  const tippA = h3('Zähle, wie oft das Ding hineinpasst.', 'Passen 10 Heftseiten auf den Tisch, sind es 10 · 6 dm² = 60 dm².', 'Rechne: Anzahl mal die Größe eines Dings.');
  sechs(A1, 'F', [
    () => auslegenAufgabe(tippA, { nur: 'Heftseite' }),
    () => angabeWaehlen('F', h3('Vergleiche mit der Tabelle.', 'Eine Briefmarke ist ungefähr so groß wie ein paar Fingernägel.', 'Stell dir das Ding vor.'), { daten: VORSTELLUNG }),
    () => auslegenAufgabe(tippA, { nur: 'Zeitung' }),
    () => dingeZuordnen(['F'], 3, h3('Kleine Dinge haben cm², große Räume m².', 'Ein Klassenzimmer ist ungefähr 60 m² groß.', 'Beginne mit dem größten Ding.'), { daten: VORSTELLUNG }),
    () => auslegenAufgabe(tippA, { nur: 'Postkarte' }),
    () => einheitWaehlen('F', h3('Vergleiche mit der Tabelle.', 'Eine Heftseite ist größer als eine Handfläche. Also passt dm².', 'Stell dir das Ding vor.'), { extra: { daten: VORSTELLUNG } }),
  ]);
  sechs(A1, 'G', [
    () => auslegenAufgabe(h3('Zähle die Kästchen. Jedes Kästchen ist ein Ding.', 'Passen 12 Zeitungen auf den Boden, sind es 12 · 1 m² = 12 m².', 'Rechne: Anzahl mal die Größe eines Dings.'), { nur: wahl(['Heftseite', 'Zeitung']) }),
    () => einheitWaehlen('G', h3('Vergleiche mit Dingen, die du kennst.', 'Eine Stadt ist riesig. Dafür nimmt man km².', 'Ist das Ding sehr klein oder sehr groß?'), { extra: { daten: VORSTELLUNG_G } }),
    () => { const n = wahl([20, 25, 30]);
      return wieOft(Z('Eine Briefmarke ist ungefähr 6 cm² groß.', `Ein Blatt ist ungefähr ${q(n * 6, 'cm²')} groß.`, 'Wie viele Briefmarken passen ungefähr auf das Blatt?'), [n * 6, 'cm²'], [6, 'cm²'], h3('Teile die große Fläche durch die kleine.', '60 cm² : 6 cm² = 10. Es passen ungefähr 10 Briefmarken darauf.', 'Rechne die große Fläche geteilt durch die Stützgröße.')); },
    () => auslegenAufgabe(h3('Zähle die Kästchen. Jedes Kästchen ist ein Ding.', 'Passen 5 Postkarten auf das Brett, sind es 5 · 150 cm² = 750 cm².', 'Rechne: Anzahl mal die Größe eines Dings.'), { nur: 'Postkarte' }),
    () => urteilDing([...DINGE.F, ...DINGE.G], wahl([true, false]), h3('Stell dir das Ding vor.', 'Ein Klassenzimmer ist ungefähr 60 m² groß.', 'Passt die Einheit zur Größe des Dings?'), true),
    () => { const k = wahl([60, 70, 80]), n = wahl([50, 100]);
      return wieOft(Z(`Ein Klassenzimmer ist ungefähr ${q(k, 'm²')} groß.`, `Ein Sportplatz ist ungefähr ${q(k * n, 'm²')} groß.`, 'Wie viele Klassenzimmer passen ungefähr auf den Sportplatz?'), [k * n, 'm²'], [k, 'm²'], h3('Teile die große Fläche durch die Stützgröße.', '600 m² : 60 m² = 10.', 'Rechne die Fläche des Sportplatzes geteilt durch die Fläche eines Klassenzimmers.')); },
  ]);
  sechs(A1, 'M', [
    () => einheitWaehlen('M', h2('Vergleiche mit Flächen, die du kennst.', 'Ein Klassenzimmer hat etwa 60 m², ein Fußballfeld etwa 70 a.')),
    () => wieOft('Ein Fußballfeld ist ungefähr 70 a groß, ein Klassenzimmer ungefähr 70 m². Wie viele Klassenzimmer passen ungefähr auf ein Fußballfeld?', [70, 'a'], [70, 'm²'], h2('Wandle zuerst in dieselbe Einheit um.', '1 a sind 100 m².'), true),
    () => { const n = zz(8, 15), w = n * 6;
      return groesse(`Ein Tisch ist so groß wie ${n} Heftseiten. Eine Heftseite ist ungefähr 6 dm² groß. Gib einen Schätzwert für die Fläche des Tisches an. Wähle dazu eine passende Einheit.`, 'flaeche', w * QF['dm²'], 'dm²', [[n * QF['dm²'], 'schaetzen-nicht-hochgerechnet'], [(n + 6) * QF['dm²'], 'schaetzen-addiert']],
        h2('Rechne Anzahl mal Stützgröße.', 'Du kannst das Ergebnis in dm² oder in cm² angeben.'), { einheiten: ['cm²', 'dm²', 'm²'], nachweis: [G(`${n} · 6 dm² = ${q(w, 'dm²')}`)] }); },
    () => urteilDing([...DINGE.G, ...DINGE.M], wahl([true, false]), h2('Stell dir das Ding vor.', 'Vergleiche mit Flächen, die du kennst.')),
    () => dingeZuordnen(['G', 'M'], 4, h2('Kleine Dinge haben kleine Einheiten.', 'Ordne zuerst das kleinste und das größte Ding zu.')),
    () => { const a = wahl([21, 28, 35]);
      return wieOft(`Ein Schulhof ist ungefähr ${q(a, 'a')} groß. Ein Klassenzimmer ist ungefähr 70 m² groß. Wie viele Klassenzimmer passen ungefähr auf den Schulhof?`, [a, 'a'], [70, 'm²'], h2('Wandle zuerst in m² um.', 'Teile dann durch die Fläche eines Klassenzimmers.'), true); },
  ]);
  sechs(A1, 'E', [
    () => einheitWaehlen('E', h1('Vergleiche mit Flächen, die du kennst.')),
    () => wieOft('Der Bodensee ist ungefähr 540 km² groß. Eine Stadt ist ungefähr 90 km² groß. Wie viele solcher Städte hätten ungefähr im Bodensee Platz?', [540, 'km²'], [90, 'km²'], h1('Teile die große Fläche durch die kleine.')),
    () => { const n = wahl([200, 300, 400]), w = n * 70;
      return groesse(`Ein Wald ist ungefähr so groß wie ${n} Fußballfelder. Ein Fußballfeld ist ungefähr 70 a groß. Wie groß ist der Wald ungefähr? Wähle eine passende Einheit.`, 'flaeche', w * QF.a, 'ha', [[n * QF.a, 'schaetzen-nicht-hochgerechnet'], [w * QF['m²'], 'umrechnungszahl-flaeche']],
        h1('Rechne Anzahl mal Stützgröße und wandle in ha um.'), { einheiten: ['a', 'ha', 'km²'], nachweis: [G(`${n} · 70 a = ${q(w, 'a')}`), G(`${q(w, 'a')} = ${q(w / 100, 'ha')}`)] }); },
    () => urteilDing([...DINGE.M, ...DINGE.E], wahl([true, false]), h1('Vergleiche mit Flächen, die du kennst.')),
    () => dingeZuordnen(['F', 'G', 'M', 'E'], 5, h1('Ordne zuerst das kleinste und das größte Ding zu.')),
    () => { const t = wahl([3, 6]), s = 6;
      return wieOft(`Eine Tafel ist ungefähr ${q(t, 'm²')} groß. Eine Heftseite ist ungefähr ${q(s, 'dm²')} groß. Wie viele Heftseiten braucht man ungefähr, um die Tafel ganz zu bedecken?`, [t, 'm²'], [s, 'dm²'], h1('Wandle zuerst in dieselbe Einheit um.'), true); },
  ]);
}
