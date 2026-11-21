// Aufgaben zu 5.6.5 „Länge“ (Lernziele L1 und L2) nach ADR 0015 und ADR 0033.
// L1: Längen umwandeln (mm, cm, dm, m, km). L2: mit Längen rechnen.

import { zahl, auswahl, opt, Z, B, G, h1, h3, zz, mische, fehlerliste } from '../werkzeug.mjs';
import { gr, FAKTOR } from './5-6-groessen.mjs';
import { umwandeln, rechnen } from './5-6-umwandeln.mjs';

export function laenge() {
  umwandeln('5.6.5-L1', {
    art: 'laenge',
    nachbarn: [['m', 'cm', 'm-cm'], ['cm', 'mm', 'cm-mm'], ['km', 'm', 'km-m']],
    nachbarnG: [['m', 'cm', 'm-cm'], ['cm', 'mm', 'cm-mm'], ['km', 'm', 'km-m'], ['dm', 'cm', null], ['m', 'dm', null]],
    zweiStufen: [['m', 'mm'], ['km', 'dm'], ['dm', 'mm']],
    komma: [['km', 'm'], ['m', 'cm'], ['cm', 'mm']],
    knobel: () => { const n = zz(2, 8), werte = mische([[n * FAKTOR.km / 100, 'km'], [(n * 10 - 2) * FAKTOR.m, 'm'], [(n * 10 + 3) * 10 * FAKTOR.dm, 'dm'], [n * 1000 * FAKTOR.cm, 'cm']]);
      const max = Math.max(...werte.map(([w]) => w));
      return auswahl('Welche Länge ist am größten?', werte.map(([w, e]) => opt(gr(w, e), w === max, w === max ? undefined : 'umrechnungszahl')), h1('Wandle alle Längen in dieselbe Einheit um, zum Beispiel in m.'), { nachweis: [{ art: 'extrem', was: 'groesste' }] }); },
  });
  rechnen('5.6.5-L2', {
    art: 'laenge', gross: 'm', klein: 'cm', einheiten: ['mm', 'cm', 'm', 'km', 'kg'],
    bilderF: [
      () => { const von = zz(1, 4), bis = von + zz(3, 6);
        return zahl(Z('Schau auf das Lineal.', `Der Strich beginnt bei ${von} cm.`, `Er endet bei ${bis} cm.`, 'Wie lang ist der Strich?'), bis - von, fehlerliste(bis - von, [[bis, 'sach-schritt-vergessen'], [bis + von, 'sub-addiert']]),
          h3('Der Strich beginnt nicht bei 0. Ziehe den Anfang vom Ende ab.', 'Von 2 cm bis 7 cm sind es 7 cm − 2 cm = 5 cm.', `Rechne ${bis} − ${von}.`), { einheit: 'cm', bild: B.lineal(von * 10, bis * 10), nachweis: [G(`${bis} cm − ${von} cm = ${bis - von} cm`)] }); },
    ],
    texte: {
      plus: [['Das rote Band ist ▢ lang.', 'Das blaue Band ist ▢ lang.', 'Wie lang sind beide Bänder zusammen?'], ['Das erste Brett ist ▢ lang.', 'Das zweite Brett ist ▢ lang.', 'Wie lang sind beide Bretter zusammen?']],
      minus: [['Ein Brett ist ▢ lang.', 'Der Tischler sägt ▢ ab.', 'Wie lang ist das Brett jetzt?'], ['Auf der Rolle sind ▢ Schnur.', 'Die Gärtnerin schneidet ▢ ab.', 'Wie viel Schnur bleibt auf der Rolle?']],
      mal: [['Ein Regalbrett ist ▢ lang.', 'Die Tischlerin legt ▢ Bretter hintereinander.', 'Wie lang ist die Reihe?'], ['Eine Fliese ist ▢ lang.', 'In einer Reihe liegen ▢ Fliesen.', 'Wie lang ist die Reihe?']],
      geteilt: [['Ein Seil ist ▢ lang.', 'Es wird in ▢ gleiche Stücke geschnitten.', 'Wie lang ist ein Stück?'], ['Eine Leiste ist ▢ lang.', 'Der Tischler sägt daraus ▢ gleiche Stücke.', 'Wie lang ist ein Stück?']],
      zwei: [['Ein Weg hat ▢ Platten mit je ◇.', 'Davon sind schon ▢ verlegt.', 'Wie lang ist der Weg?', 'Wie viel fehlt noch?'], ['Eine Mauer hat ▢ Abschnitte mit je ◇.', 'Davon sind schon ▢ verputzt.', 'Wie lang ist die Mauer?', 'Wie viel muss noch verputzt werden?']],
      malM: [['Ein Brett ist ▢ lang.', 'Es liegen ▢ Bretter hintereinander.', 'Wie lang ist die Reihe?'], ['Eine Bahn Stoff ist ▢ breit.', 'Die Schneiderin näht ▢ Bahnen nebeneinander.', 'Wie breit ist das Tuch?']],
      wieOft: [['Ein Band ist ▢ lang.', 'Es wird in Stücke von ▢ geschnitten.', 'Wie viele Stücke entstehen?', 'Stücke'], ['Eine Leiste ist ▢ lang.', 'Der Tischler sägt Stücke von ▢ ab.', 'Wie viele Stücke bekommt er?', 'Stücke']],
      gemischtM: [['Für ein Regal braucht die Tischlerin 3 Bretter mit je ▢ und 2 Leisten mit je ◇.', 'Wie viel Holz ist das zusammen?'], ['Der Gärtner steckt 3 Zäune mit je ▢ und 2 Tore mit je ◇ aneinander.', 'Wie lang ist alles zusammen?']],
      ueberschlag: [['Drei Stoffreste sind ▢ lang.'], ['Drei Bretter sind ▢ lang.']],
      dreiE: [['Von einer Rolle mit ▢ Kabel werden erst ◇ und dann ○ abgeschnitten.', 'Wie viel Kabel ist noch auf der Rolle?'], ['Von einem Balken mit ▢ sägt der Zimmermann erst ◇ und dann ○ ab.', 'Wie lang ist der Balken jetzt?']],
      wieOftE: [['Ein Regal ist ▢ breit.', 'Ein Buch ist ▢ dick.', 'Wie viele Bücher passen nebeneinander?', 'Bücher'], ['Eine Leiste ist ▢ lang.', 'Die Tischlerin sägt Stücke von ▢ ab.', 'Wie viele Stücke bekommt sie?', 'Stücke']],
      teilenE: [['Ein Seil von ▢ wird in ◇ gleiche Stücke geschnitten.', 'Davon werden ▢ Stücke aneinandergeknotet.', 'Wie lang sind diese Stücke zusammen?'], ['Eine Leiste von ▢ wird in ◇ gleiche Stücke gesägt.', 'Der Tischler verbaut ▢ Stücke.', 'Wie lang sind die verbauten Stücke zusammen?']],
      rueckE: [['▢ gleiche Bretter und ein Balken von ◇ sind zusammen ○ lang.', 'Wie lang ist ein Brett?'], ['▢ gleiche Zaunfelder und eine Mauer von ◇ sind zusammen ○ lang.', 'Wie lang ist ein Zaunfeld?']],
    },
  });
}
