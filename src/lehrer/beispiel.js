// Erfundene Beispielklasse, damit sich das Lehrer-Dashboard ohne Schulnetz ausprobieren lässt.
import * as L from '../schueler/logik.js';
import { erzeugeCode } from './auswertung.js';

const NAMEN = ['Ayla Demir', 'Ben Hoffmann', 'Carla Rossi', 'David Nowak', 'Elif Kaya', 'Finn Becker', 'Greta Lang', 'Hamza Aydin',
  'Ida Schneider', 'Jonas Weber', 'Kira Petrova', 'Leon Maier', 'Mia Vogel', 'Noah Schmid'];

export function beispielklasse(pool, index, jetzt = Date.now()) {
  let saat = 7;
  const zufall = () => { saat = (saat * 1103515245 + 12345) & 0x7fffffff; return saat / 0x7fffffff; };
  const namen = {}, zielniveaus = {}, staende = [];
  const frueher = pool.kapitel.flatMap((k) => k.unterkapitel).filter((u) => ['5.3.1', '5.3.2', '5.3.4'].includes(u.id));
  const lernziele = pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).filter((l) => index.lernzielMitAufgaben.has(l.id) && l.id.startsWith('5.3.3'));
  NAMEN.forEach((name, i) => {
    const code = erzeugeCode('5a', Object.keys(namen), zufall);
    namen[code] = name;
    const koennen = 0.35 + 0.6 * zufall();              // wie sicher der Schüler rechnet
    const ziel = koennen > 0.85 ? 'M' : koennen < 0.45 ? 'F' : 'G';
    zielniveaus[code] = ziel; // ausdrücklich gesetzt, unabhängig vom Standard
    const stand = L.neuerSpeicherstand(code, '5a', new Date(jetzt - 40 * 60000).toISOString());
    // Vor vier Tagen: Einstiegscheck zum Kapitel, mit eigenem Zufall, damit der Rest der Beispielklasse gleich bleibt (ADR 0014).
    const kap = pool.kapitel.find((k) => k.id === '5.3');
    const t0 = new Date(jetzt - 4 * 86400000).toISOString();
    if (i === 4) L.ueberspringeEinstieg(stand, kap.id, t0);
    else {
      let s2 = 11 + i;
      const z2 = () => { s2 = (s2 * 1103515245 + 12345) & 0x7fffffff; return s2 / 0x7fffffff; };
      const e = L.stelleEinstieg(stand, index, kap, t0, z2);
      for (const id of [...e.aufgaben]) {
        const a = index.aufgabe.get(id);
        L.trageEinstiegEin(stand, kap.id, a, { geloest: z2() < koennen - (a.niveau === 'M' ? 0.15 : 0) - (a.lernziel.startsWith('5.3.3') ? 0.2 : 0), eingaben: [], fehlvorstellungen: [], dauer: 40 }, t0);
      }
    }
    // Frühere Tage: drei Meilensteine mit Kronenwahl und Krone, damit die Selbsteinschätzung etwas zeigt (ADR 0012).
    frueher.forEach((u, k) => {
      const t = new Date(jetzt - (3 - k) * 86400000).toISOString();
      const stufe = L.NIVEAUS.indexOf(ziel) + (koennen > 0.75 ? 1 : koennen < 0.45 ? -1 : 0);
      const geschafft = L.NIVEAUS[Math.max(0, Math.min(3, stufe))];
      const daneben = i === 2 ? -1 : Math.floor(zufall() * 3) - 1;    // Carla traut sich jedes Mal zu wenig zu
      const gewaehlt = L.NIVEAUS[Math.max(0, Math.min(3, L.NIVEAUS.indexOf(geschafft) + daneben))];
      L.merkeWahl(stand, index, u, gewaehlt, t);
      for (const l of u.lernziele.filter((x) => index.lernzielMitAufgaben.has(x.id))) {
        for (const a of [...index.nach.get(`${l.id}|${geschafft}`)].sort((x, y) => y.afb - x.afb).slice(0, 3)) {
          L.verbuche(stand, a, { geloest: true, versuche: 1, eingaben: [String(a.loesung ?? '')], fehlvorstellungen: [], hilfen: 0, dauer: 40 }, ziel, t, index);
        }
      }
    });
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
    if (i === 3) stand.aktiv = { aufgabe: offene[1].id, seit: new Date(jetzt - 6 * 60000).toISOString(), fehlversuche: 1, hilfen: 2 }; // einer steckt fest
    if (i === 12) stand.aktiv = { aufgabe: offene[2].id, seit: new Date(jetzt - 60000).toISOString(), fehlversuche: 0, hilfen: 1 };    // eine hat einen Tipp gezogen
    if (i === 5) stand.abbrueche.push({ t: new Date(jetzt - 5 * 60000).toISOString(), aufgabe: offene[0].id, fehlversuche: 1, hilfen: 0 });
    if (i === 11) stand.muenzen += 5000;                // einer hat an seiner Datei gedreht
    staende.push({ code, stand });
  });
  return { namen, zielniveaus, staende };
}
