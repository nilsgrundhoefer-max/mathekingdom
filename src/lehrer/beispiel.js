// Erfundene Beispielklasse, damit sich das Lehrer-Dashboard ohne Schulnetz ausprobieren lässt.
import * as L from '../schueler/logik.js';
import { erzeugeCode } from './auswertung.js';

const NAMEN = ['Ayla Demir', 'Ben Hoffmann', 'Carla Rossi', 'David Nowak', 'Elif Kaya', 'Finn Becker', 'Greta Lang', 'Hamza Aydin',
  'Ida Schneider', 'Jonas Weber', 'Kira Petrova', 'Leon Maier', 'Mia Vogel', 'Noah Schmid'];

export function beispielklasse(pool, index, jetzt = Date.now()) {
  let saat = 7;
  const zufall = () => { saat = (saat * 1103515245 + 12345) & 0x7fffffff; return saat / 0x7fffffff; };
  const namen = {}, zielniveaus = {}, staende = [];
  const lernziele = pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).filter((l) => index.lernzielMitAufgaben.has(l.id) && l.id.startsWith('5.3.3'));
  NAMEN.forEach((name, i) => {
    const code = erzeugeCode('5a', Object.keys(namen), zufall);
    namen[code] = name;
    const koennen = 0.35 + 0.6 * zufall();              // wie sicher der Schüler rechnet
    const ziel = koennen > 0.85 ? 'M' : koennen < 0.45 ? 'F' : 'G';
    if (ziel !== 'G') zielniveaus[code] = ziel;
    const stand = L.neuerSpeicherstand(code, '5a', new Date(jetzt - 40 * 60000).toISOString());
    let zeit = jetzt - 38 * 60000;
    const menge = 6 + Math.floor(zufall() * 16);
    let niveau = i === 3 ? 'F' : ziel;                  // einer arbeitet nur im Training
    for (let n = 0; n < menge; n++) {
      const lz = lernziele.find((l) => !stand.lernziele[l.id]) ?? lernziele.at(-1);
      const aufgabe = L.naechsteAufgabe(index, stand, lz.id, niveau, zufall);
      const raet = i === 6 && n > menge - 6;            // einer rät am Ende
      const geloest = !raet && zufall() < koennen;
      const fehler = aufgabe.typischeFehler ?? aufgabe.optionen?.filter((o) => o.fehlvorstellung) ?? [];
      const hilfen = geloest ? (zufall() < 0.25 ? 1 : 0) : Math.floor(zufall() * 4);
      const dauer = raet ? 3 + Math.floor(zufall() * 3) : 25 + Math.floor(zufall() * 90);
      zeit += (dauer + 5 + zufall() * 20) * 1000;
      L.verbuche(stand, aufgabe, { geloest, versuche: geloest && zufall() < 0.8 ? 1 : 2, eingaben: [geloest ? String(aufgabe.loesung ?? '') : '?'],
        fehlvorstellungen: !geloest && fehler.length && zufall() < 0.7 ? [fehler[Math.floor(zufall() * fehler.length)].fehlvorstellung] : [],
        hilfen, dauer }, ziel, new Date(Math.min(zeit, jetzt - 20000)).toISOString());
      const vorschlag = L.niveauVorschlag(stand, '5.3', niveau);
      if (vorschlag && i !== 3) { niveau = L.NIVEAUS[L.NIVEAUS.indexOf(niveau) + (vorschlag === 'hoch' ? 1 : -1)]; L.setzeNiveau(stand, '5.3', niveau); }
    }
    const still = i === 9 ? 9 * 60000 : Math.floor(zufall() * 60000); // einer ist seit neun Minuten still
    stand.geaendert = new Date(jetzt - still).toISOString();
    const offene = index.nach.get(`${lernziele[1].id}|${niveau}`);
    if (i === 1 || i === 7) L.rufeHilfe(stand, offene[0].id, new Date(jetzt - (i === 1 ? 4 : 2) * 60000).toISOString());
    if (i === 11) stand.muenzen += 5000;                // einer hat an seiner Datei gedreht
    staende.push({ code, stand });
  });
  return { namen, zielniveaus, staende };
}
