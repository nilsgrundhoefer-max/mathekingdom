// Gemeinsame Bausteine für Kapitel 6 „Größen und Sachaufgaben“ (ADR 0033).
// Die Erzeuger führen jede Größe in ihrer kleinsten Einheit: Cent, Millimeter, Milligramm, Sekunde.
// Schreibweisen (Nils, 2026-11-21): „25 kg“, „3,50 €“, „0,05 €“, „14:35 Uhr“, „2 h 15 min“, auf F gemischt „3 € 50 ct“.

import { fz, zz, wahl, mische, B, L } from '../werkzeug.mjs';

export const FAKTOR = { ct: 1, '€': 100, mm: 1, cm: 10, dm: 100, m: 1000, km: 1000000, mg: 1, g: 1000, kg: 1000000, t: 1000000000, s: 1, min: 60, h: 3600, d: 86400 };
// Eine Größe in einer Einheit, wenn nötig mit Komma: gr(2500000, 'km') wird „2,5 km“, gr(350, '€') wird „3,50 €“.
export function gr(wert, einheit) {
  const f = FAKTOR[einheit];
  if (wert % f === 0) return `${fz(wert / f)} ${einheit}`;
  let nach = String(wert % f).padStart(String(f).length - 1, '0').replace(/0+$/, '');
  if (einheit === '€') nach = nach.padEnd(2, '0');
  return `${fz(Math.floor(wert / f))},${nach} ${einheit}`;
}
// Gemischte Schreibweise: mix(350, '€', 'ct') wird „3 € 50 ct“, mix(8100, 'h', 'min') wird „2 h 15 min“.
export function mix(wert, ...einheiten) {
  const teile = [];
  let rest = wert;
  einheiten.forEach((e, i) => { const f = FAKTOR[e], n = i === einheiten.length - 1 ? rest / f : Math.floor(rest / f); rest -= n * f; if (n) teile.push(`${fz(n)} ${e}`); });
  return teile.length ? teile.join(' ') : `0 ${einheiten.at(-1)}`;
}
// Geld: mit Komma und zwei Stellen (ab G), glatte Beträge ohne Komma.
export const eur = (ct) => (ct % 100 === 0 ? `${fz(ct / 100)} €` : ct < 100 ? `${ct} ct` : `${fz(Math.floor(ct / 100))},${String(ct % 100).padStart(2, '0')} €`);
export const eurK = (ct) => `${fz(Math.floor(ct / 100))},${String(ct % 100).padStart(2, '0')} €`;
export const geldF = (ct) => mix(ct, '€', 'ct');
// Uhrzeit aus Minuten seit Mitternacht und Zeitspanne aus Minuten.
export const uhr = (minuten) => `${Math.floor((((minuten % 1440) + 1440) % 1440) / 60)}:${String((((minuten % 1440) + 1440) % 1440) % 60).padStart(2, '0')} Uhr`;
export const uhrKurz = (minuten) => uhr(minuten).replace(' Uhr', '');
export const dauer = (minuten) => mix(minuten * 60, 'h', 'min');
// Münzen und Scheine für einen Betrag, möglichst wenige Stücke.
const STUECKE = [10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
export function stuecke(ct) { const liste = []; let rest = ct; for (const s of STUECKE) while (rest >= s) { liste.push(s); rest -= s; } return liste; }
export const geldBild = (ct) => B.geld(stuecke(ct));
// Gewichtsstücke in Gramm für ein Gewicht.
const GEWICHTE = [5000, 2000, 1000, 500, 200, 100, 50, 20, 10];
export function gewichtsstuecke(g) { const liste = []; let rest = g; for (const s of GEWICHTE) while (rest >= s && liste.length < 4) { liste.push(s); rest -= s; } return rest === 0 ? liste : null; }

// ---------- Einheitentafeln ----------
// Tafel für zwei Nachbareinheiten: tafel('km', 'm') hat die Spalten km | H Z E von m.
export const TAFELN = {
  'km-m': { gruppen: [['km', 2], ['m', 3]], kopf: ['Z', 'E', 'H', 'Z', 'E'] },
  'm-cm': { gruppen: [['m', 2], ['cm', 2]], kopf: ['Z', 'E', 'Z', 'E'] },
  'cm-mm': { gruppen: [['cm', 2], ['mm', 1]], kopf: ['Z', 'E', 'E'] },
  'kg-g': { gruppen: [['kg', 2], ['g', 3]], kopf: ['Z', 'E', 'H', 'Z', 'E'] },
  't-kg': { gruppen: [['t', 2], ['kg', 3]], kopf: ['Z', 'E', 'H', 'Z', 'E'] },
  '€-ct': { gruppen: [['€', 2], ['ct', 2]], kopf: ['Z', 'E', 'Z', 'E'] },
};
// Ziffern einer Größe für eine Tafel: führende Felder bleiben leer (null).
export function tafelZiffern(name, wert) {
  const t = TAFELN[name], klein = t.gruppen.at(-1)[0], stellen = t.kopf.length;
  const text = String(wert / FAKTOR[klein]).padStart(stellen, ' ');
  return text.length > stellen ? null : [...text].map((c) => (c === ' ' ? null : Number(c)));
}
export const tafelBild = (name, wert, weitere = null) => B.etafel(TAFELN[name].gruppen, TAFELN[name].kopf, tafelZiffern(name, wert), weitere ? weitere.map((w) => tafelZiffern(name, w)) : null);
// Zeile zum Eintragen: jede Ziffer eine Lücke, führende Felder bleiben leer.
export function tafelZeile(name, wert, vorsilbe = 'z') {
  const z = tafelZiffern(name, wert), werte = {};
  const zeile = z.map((x, i) => { if (x == null) return ''; werte[`${vorsilbe}${i}`] = x; return L(`${vorsilbe}${i}`); });
  return { zeile, werte };
}

// ---------- Kleine Tabellen als Bild (auf F) ----------
export const EINHEITEN_TABELLE = { kopf: ['Das misst du', 'Einheiten'], zeilen: [['Länge', 'mm, cm, m, km'], ['Gewicht', 'g, kg, t'], ['Zeit', 's, min, h'], ['Geld', 'ct, €']] };
export const merktabelle = (...zeilen) => ({ kopf: ['Merke', ''], zeilen });
export const MERK = {
  geld: ['1 €', '100 ct'], hmin: ['1 h', '60 min'], mins: ['1 min', '60 s'], tag: ['1 Tag', '24 h'],
  kgg: ['1 kg', '1000 g'], tkg: ['1 t', '1000 kg'], cmmm: ['1 cm', '10 mm'], mcm: ['1 m', '100 cm'], kmm: ['1 km', '1000 m'], dmcm: ['1 dm', '10 cm'], mdm: ['1 m', '10 dm'], gmg: ['1 g', '1000 mg'],
};

// ---------- Namen und Dinge ----------
export const LAEDEN = ['Bäcker', 'Markt', 'Hofladen', 'Kiosk', 'Schreibwarenladen'];
export const WAREN = [['Brötchen', 40], ['Brezel', 80], ['Apfel', 50], ['Heft', 90], ['Bleistift', 60], ['Radiergummi', 70], ['Eis', 150], ['Saft', 120], ['Brot', 320], ['Käse', 280], ['Lineal', 130], ['Kleber', 190]];
export const ware = (max = 9999, min = 0) => wahl(WAREN.filter(([, p]) => p <= max && p >= min));
export const zweiWaren = (max = 9999) => mische(WAREN.filter(([, p]) => p <= max)).slice(0, 2);
export const ORTE = [['Burg', 'burg'], ['Dorf', 'dorf'], ['Mühle', 'muehle'], ['Hafen', 'hafen'], ['Wald', 'wald'], ['Turm', 'turm'], ['Brücke', 'bruecke']];
export const zweiOrte = () => mische(ORTE).slice(0, 2);
export const dreiOrte = () => mische(ORTE).slice(0, 3);
export const runde5 = (von, bis) => zz(von / 5, bis / 5) * 5;
export { zz, wahl, mische };
