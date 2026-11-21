// Aufgaben zu 5.6.4 „Gewicht“ (Lernziele W1 und W2) nach ADR 0015 und ADR 0033.
// W1: Gewichte umwandeln (g, kg, t, ab M auch mg). W2: mit Gewichten rechnen.

import { zahl, auswahl, opt, Z, B, G, BG, h1, h3, zz, wahl, mische, fehlerliste } from '../werkzeug.mjs';
import { gr, FAKTOR } from './5-6-groessen.mjs';
import { umwandeln, rechnen } from './5-6-umwandeln.mjs';

const DINGE_WAAGE = ['Kürbis', 'Paket', 'Korb', 'Kohlkopf', 'Brot', 'Sack'];

export function gewicht() {
  umwandeln('5.6.4-W1', {
    art: 'gewicht',
    nachbarn: [['kg', 'g', 'kg-g'], ['t', 'kg', 't-kg']],
    nachbarnG: [['kg', 'g', 'kg-g'], ['t', 'kg', 't-kg']],
    zweiStufen: [['t', 'g'], ['kg', 'mg']],
    komma: [['kg', 'g'], ['t', 'kg']],
    knobel: () => { const n = zz(2, 8), werte = mische([[n * FAKTOR.t / 100, 't'], [(n * 10 - 2) * FAKTOR.kg / 10 * 10, 'kg'], [(n * 10 + 3) * 1000 * FAKTOR.g / 10, 'g'], [n * 1000000 * FAKTOR.mg, 'mg']]);
      const max = Math.max(...werte.map(([w]) => w));
      return auswahl('Welches Gewicht ist am größten?', werte.map(([w, e]) => opt(gr(w, e), w === max, w === max ? undefined : 'umrechnungszahl')), h1('Wandle alle Gewichte in dieselbe Einheit um, zum Beispiel in kg.'), { nachweis: [{ art: 'extrem', was: 'groesste' }] }); },
  });
  rechnen('5.6.4-W2', {
    art: 'gewicht', gross: 'kg', klein: 'g', einheiten: ['g', 'kg', 't', 'm'],
    bilderF: [
      () => { const stuecke = wahl([[500, 200, 100], [500, 200], [200, 100, 50], [500, 100, 50], [200, 200, 100], [500, 200, 200]]), sum = stuecke.reduce((s, x) => s + x, 0), ding = wahl(DINGE_WAAGE);
        return zahl(Z('Schau auf die Waage.', 'Die Waage ist im Gleichgewicht.', `Wie schwer ist ${['Kürbis', 'Korb', 'Kohlkopf', 'Sack'].includes(ding) ? 'der' : 'das'} ${ding}?`), sum, fehlerliste(sum, [[stuecke.length, 'liste-verzaehlt'], [stuecke[0], 'sach-schritt-vergessen']]),
          h3('Beide Seiten sind gleich schwer. Zähle die Gewichtsstücke zusammen.', '500 g + 100 g = 600 g', 'Rechne alle Gewichtsstücke zusammen.'), { einheit: 'g', bild: B.waage(ding, stuecke), nachweis: [G(`${stuecke.map((x) => `${x} g`).join(' + ')} = ${sum} g`)] }); },
    ],
    texte: {
      plus: [['Die erste Tüte wiegt ▢.', 'Die zweite Tüte wiegt ▢.', 'Wie schwer sind beide Tüten zusammen?'], ['Im Korb liegen ▢ Äpfel.', 'Dazu kommen ▢ Birnen.', 'Wie schwer ist das Obst zusammen?'], ['Das Paket wiegt ▢.', 'Der Karton dazu wiegt ▢.', 'Wie schwer ist beides zusammen?']],
      minus: [['Im Sack sind ▢ Mehl.', 'Der Bäcker nimmt ▢ heraus.', 'Wie viel Mehl bleibt im Sack?'], ['In der Kiste sind ▢ Kartoffeln.', 'Die Köchin verbraucht ▢.', 'Wie viel bleibt in der Kiste?'], ['Im Eimer sind ▢ Futter.', 'Die Pferde fressen ▢.', 'Wie viel Futter bleibt im Eimer?']],
      mal: [['Eine Packung wiegt ▢.', 'Im Karton sind ▢ Packungen.', 'Wie schwer sind alle Packungen zusammen?'], ['Ein Beutel wiegt ▢.', 'Im Korb liegen ▢ Beutel.', 'Wie schwer sind alle Beutel zusammen?']],
      geteilt: [['Ein Käse wiegt ▢.', 'Er wird in ▢ gleiche Stücke geteilt.', 'Wie schwer ist ein Stück?'], ['Ein Teig wiegt ▢.', 'Die Bäckerin formt daraus ▢ gleiche Brote.', 'Wie schwer ist ein Brot?']],
      zwei: [['Im Regal stehen ▢ Dosen mit je ◇.', 'Die Köchin verbraucht ▢.', 'Wie schwer sind alle Dosen zusammen?', 'Wie viel bleibt übrig?'], ['Der Müller füllt ▢ Beutel mit je ◇.', 'Er verkauft davon ▢.', 'Wie schwer sind alle Beutel zusammen?', 'Wie viel bleibt übrig?']],
      malM: [['Ein Brot wiegt ▢.', 'Der Bäcker liefert ▢ Brote.', 'Wie schwer ist die Lieferung?'], ['Eine Kiste wiegt ▢.', 'Auf dem Wagen stehen ▢ Kisten.', 'Wie schwer ist die Ladung?']],
      wieOft: [['Im Sack sind ▢ Reis.', 'In jede Tüte kommen ▢.', 'Wie viele Tüten werden voll?', 'Tüten'], ['Der Imker hat ▢ Honig.', 'In jedes Glas passen ▢.', 'Wie viele Gläser füllt er?', 'Gläser']],
      gemischtM: [['Im Korb liegen 3 Melonen mit je ▢ und 2 Mangos mit je ◇.', 'Wie schwer ist das Obst zusammen?'], ['Auf dem Wagen liegen 3 Säcke mit je ▢ und 2 Beutel mit je ◇.', 'Wie schwer ist die Ladung?']],
      ueberschlag: [['Drei Pakete wiegen ▢.'], ['Drei Kürbisse wiegen ▢.']],
      dreiE: [['Von ▢ Kartoffeln werden erst ◇ und dann ○ verkauft.', 'Wie viel bleibt übrig?'], ['Aus einem Fass mit ▢ Mehl nimmt die Bäckerin erst ◇ und dann ○.', 'Wie viel Mehl bleibt im Fass?']],
      wieOftE: [['Der Müller hat ▢ Mehl gemahlen.', 'In jeden Beutel füllt er ▢.', 'Wie viele Beutel werden voll?', 'Beutel'], ['Die Köchin hat ▢ Suppengemüse.', 'Für eine Portion braucht sie ▢.', 'Für wie viele Portionen reicht es?', 'Portionen']],
      teilenE: [['Ein Käse von ▢ wird in ◇ gleiche Stücke geteilt.', 'Davon werden ▢ Stücke verkauft.', 'Wie schwer sind die verkauften Stücke zusammen?'], ['Ein Teig von ▢ wird zu ◇ gleichen Broten geformt.', 'Ein Kunde kauft ▢ Brote.', 'Wie schwer ist sein Einkauf?']],
      rueckE: [['▢ gleiche Dosen und eine Kiste von ◇ wiegen zusammen ○.', 'Wie schwer ist eine Dose?'], ['▢ gleiche Säcke liegen in einer Kiste von ◇. Zusammen wiegt alles ○.', 'Wie schwer ist ein Sack?']],
    },
  });
}
