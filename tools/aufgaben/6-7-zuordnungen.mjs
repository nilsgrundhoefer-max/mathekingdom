// Gemeinsame Bausteine für Klasse 6, Kapitel 7 „Zuordnungen“ (ADR 0050).
// Grilling mit Nils (2026-11-25): F ganze Zahlen, Verdoppeln und Halbieren, Faktor bis 5, Geld in ganzen Euro oder mit ,50.
// G Faktor bis 10 und Geld mit Cent. M prüft den Quotienten, rechnet mit Dezimalzahlen und gleicht Einheiten an.
// E begründet, sucht Fehler und ordnet ein: proportional, antiproportional oder keines von beiden.
// Schreibweise mit Pfeil („2 Hefte → 3 €“). Wertetabellen liegen waagrecht und haben zwei Zeilen. Nirgends wird gerundet.
// Gerechnet wird mit ganzen Zahlen: Jeder Wert steht in Tausendsteln (1,50 € ist 1500).

import { zz, wahl, mische, suche, Z, opt, auswahl, kind, zweiKinder, sechs } from '../werkzeug.mjs';
import { H, ohneUndefined } from './6-3-koerper.mjs';
import { FREI } from './5-9-brueche.mjs';

export { zz, wahl, mische, suche, Z, opt, auswahl, kind, zweiKinder, sechs, H, FREI };

// ---------- Zahlen ----------
export const E = (n) => Math.round(n * 1000);
// Text einer Zahl: so viele Stellen nach dem Komma wie nötig. Geld hat keine oder zwei Stellen (3 € und 4,50 €).
export const t = (v) => { const s = (v / 1000).toFixed(3).replace(/\.?0+$/, ''); return s.replace('.', ','); };
export const g = (v) => (v % 1000 === 0 ? String(v / 1000) : (v / 1000).toFixed(2).replace('.', ','));
export const ganz = (v) => v % 1000 === 0;
// Lösung im Pool: eine natürliche Zahl als Zahl, eine Dezimalzahl als Text.
export const lo = (v, f = t) => (ganz(v) ? v / 1000 : f(v));
// Typische Fehler [[wert, fehlvorstellung]]: nie die Lösung, nie doppelt, nie 0 oder negativ, höchstens drei Stellen nach dem Komma.
export const fl = (v, liste, f = t) => (liste ?? []).filter(([w], i, l) => Number.isInteger(w) && w > 0 && w !== v && l.findIndex(([x]) => x === w) === i).map(([w, fehlvorstellung]) => ({ wert: lo(w, f), fehlvorstellung }));
export const lk = (v, liste, f = t) => [lo(v, f), fl(v, liste, f)];
const mit = (extra) => Object.fromEntries(Object.entries(extra ?? {}).filter(([, x]) => x != null));

// ---------- Formate ----------
// Zahl mit fester Einheit hinter dem Feld. f: t (Zahl) oder g (Geld).
export const zahl = (text, v, einheit, fehler, hilfen, extra, f = t) => ({ format: 'zahl', text, loesung: lo(v, f), ...(einheit ? { einheit } : {}), typischeFehler: fl(v, fehler, f), hilfen, ...mit(extra) });
export const luecken = (text, werte, hilfen, extra) => ({ format: 'luecken', text, luecken: Object.fromEntries(Object.entries(werte).map(([n, [l, f]]) => [n, { loesung: l, typischeFehler: f }])), hilfen, ...mit(extra) });
// Wertetabelle zum Ergänzen. namen: [obere Zeile, untere Zeile]. spalten: [[x, y]], jeder Wert ein Text oder eine Lücke LK(name, v, fehler, f).
export const LK = (name, v, fehler, f = t) => ({ name, v, fehler, f });
export function wertetabelle(text, namen, spalten, hilfen, extra) {
  const werte = {}, zelle = (c) => { if (typeof c !== 'object') return String(c); werte[c.name] = { loesung: lo(c.v, c.f), typischeFehler: fl(c.v, c.fehler, c.f) }; return { luecke: c.name }; };
  const zeilen = [[namen[0], ...spalten.map((s) => zelle(s[0]))], [namen[1], ...spalten.map((s) => zelle(s[1]))]];
  return { format: 'tabelle', text, tabelle: { art: 'werte', kopf: [], zeilen }, luecken: werte, hilfen, ...mit(extra) };
}
// Dreisatztabelle. zeilen: drei Paare [links, rechts], jeder Wert ein Text (mit Einheit) oder LK(name, v, fehler, f) mit einheit.
// pfeile: [[links, rechts], [links, rechts]], jeder ein Text („: 4“), null oder PF(zeichen, name, zahl).
export const PF = (zeichen, name, zahl) => ({ zeichen, name, zahl });
export function dreisatz(text, kopf, zeilen, pfeile, hilfen, extra) {
  const werte = {};
  const zelle = (c) => { if (typeof c !== 'object') return String(c); werte[c.name] = { loesung: lo(c.v, c.f), typischeFehler: fl(c.v, c.fehler, c.f) }; return { luecke: c.name, ...(c.einheit ? { einheit: c.einheit } : {}) }; };
  const pfeil = (p) => { if (p == null || typeof p !== 'object') return p; werte[p.name] = { loesung: p.zahl, typischeFehler: [] }; return { zeichen: p.zeichen, luecke: p.name }; };
  const z = zeilen.map((r) => r.map(zelle)), pf = pfeile.map(([l, r]) => ({ links: pfeil(l), rechts: pfeil(r) }));
  return { format: 'tabelle', text, tabelle: { art: 'dreisatz', kopf, zeilen: z, pfeile: pf }, luecken: werte, hilfen, ...mit(extra) };
}
export const mitEinheit = (lkWert, einheit) => ({ ...lkWert, einheit });

// ---------- Bilder ----------
// Wertetabellen als Bild: tabs [{ n?, namen: [oben, unten], paare: [[x, y]] }], Werte als Text.
export const wbild = (...tabs) => ({ art: 'wertetabellen', tabellen: tabs.map((x) => ohneUndefined({ n: x.n, zeilen: [[x.namen[0], ...x.paare.map((p) => String(p[0]))], [x.namen[1], ...x.paare.map((p) => String(p[1]))]] })) });
// Dreisatztabelle als Bild (zum Lesen oder für die Fehlersuche).
export const dbild = (kopf, zeilen, pfeile) => ({ art: 'dreisatz', kopf, zeilen, pfeile: pfeile.map(([l, r]) => ({ links: l, rechts: r })) });
// Schaubild. a: { x: [name, schritt, jede?], y: [name, schritt, jede?], b, h }, Schritte in Tausendsteln.
// punkte: [[x, y]] in Tausendsteln; zuege: [{ punkte: [[x, y]], n?, stil? }] ebenso. Im Bild steht alles in Kästchen.
const stellen = (schritt) => (schritt % 1000 === 0 ? 0 : schritt % 100 === 0 ? 1 : 2);
export const achsen = (x, y, b, h) => ({ x, y, b, h });
export const skala = (a) => ({ x: ohneUndefined({ name: a.x[0], schritt: a.x[1] / 1000, jede: a.x[2], stellen: a.x[3] ?? stellen(a.x[1]) }), y: ohneUndefined({ name: a.y[0], schritt: a.y[1] / 1000, jede: a.y[2], stellen: a.y[3] ?? stellen(a.y[1]) }) });
export const zelleVon = (a, [x, y]) => [x / a.x[1], y / a.y[1]];
export const gitterVon = (a) => ({ b: a.b, h: a.h, achsen: true, skala: skala(a) });
export function sbild(a, { punkte = [], zuege = [] } = {}) {
  return ohneUndefined({ art: 'gitter', ...gitterVon(a), ...(punkte.length ? { punkte: punkte.map((p) => { const [x, y] = zelleVon(a, p); return { x, y }; }) } : {}),
    ...(zuege.length ? { zuege: zuege.map((z) => ({ ...z, punkte: z.punkte.map((p) => zelleVon(a, p)) })) } : {}) });
}
// Gerade durch den Nullpunkt mit y = m · x (m als Bruch my/mx), bis zum Rand des Bildes.
export function strahl(a, [mx, my], von = 0) {
  const xr = Math.min(a.b * a.x[1], (a.h * a.y[1] * mx) / my);
  return [[von, (von * my) / mx], [xr, (xr * my) / mx]];
}
// Kurve einer antiproportionalen Zuordnung x · y = k (k in Tausendstel · Tausendstel), als Linienzug mit vielen Punkten.
export function kurve(a, k) {
  const pts = [];
  for (let c = 0.25; c <= a.b + 1e-9; c += 0.25) { const x = c * a.x[1], y = k / x; if (y <= a.h * a.y[1] * 1.0001) pts.push([x, y]); }
  return pts;
}
// Punkte im Schaubild eintragen. loesung in Tausendsteln. nachfrage: { text, optionen: [opt] }.
export function punkteEintragen(text, a, paare, fehler, hilfen, extra = {}) {
  const loesung = paare.map((p) => zelleVon(a, p));
  const schl = (l) => JSON.stringify([...l].map((p) => p.join()).sort());
  const tf = (fehler ?? []).map(([pp, fv]) => ({ punkte: pp.map((p) => zelleVon(a, p)), fehlvorstellung: fv }))
    .filter((f) => f.punkte.every(([x, y]) => Number.isInteger(x) && Number.isInteger(y) && x >= 0 && y >= 0 && x <= a.b && y <= a.h) && schl(f.punkte) !== schl(loesung));
  const { vorgabe, ...rest } = extra;
  return { format: 'gitter', eingabe: 'punkte', text, gitter: ohneUndefined({ ...gitterVon(a), ...(vorgabe ?? {}) }), loesung, typischeFehler: tf, hilfen, ...mit(rest) };
}

// ---------- Nachweise (tools/pruefe-zuordnungen.mjs rechnet sie unabhängig nach) ----------
// Die Tabelle der Aufgabe (mit eingesetzten Lösungen) folgt der Regel: 'prop', 'anti' oder { m, b } für y = m · x + b (Texte).
export const TAB = (regel, extra = {}) => ({ art: 'tabelle', regel, ...extra });
// Dreisatz: aus dem Paar von → [x, y] folgt für `x` der Wert `y` (regel 'prop' oder 'anti'). Mit gesucht: 'x' ist der erste Wert gesucht.
export const DS = (regel, von, x, y, extra = {}) => ({ art: 'dreisatz', regel, von, x, y, ...extra });
// Einordnen: Die Paare sind proportional, antiproportional oder keines von beiden. wenn: { prop, anti, keines } nennt je die richtige Antwort.
export const EIN = (paare, wenn, extra = {}) => ({ art: 'einordnung', paare, ...(wenn ? { wenn } : {}), ...extra });
// Ablesen am Schaubild: Der Punkt (x|y) liegt auf der Linie oder ist eingezeichnet.
export const ABL = (x, y, extra = {}) => ({ art: 'ablesen', x, y, ...extra });
// Punkte eintragen: Die Lösung im Gitter sind genau diese Paare.
export const PKT = (paare, extra = {}) => ({ art: 'punkte', paare, ...extra });
export const WERT = (wert, extra = {}) => ({ art: 'wert', wert, ...extra });
export const URTEIL = (stimmt) => ({ art: 'urteil', stimmt });
// Bildkarten: Die richtige Karte ist das Schaubild mit dieser Eigenschaft.
export const KARTE = (regel) => ({ art: 'karte', regel });
export const KPAARE = (paare, extra = {}) => ({ art: 'kartenpaare', paare, ...extra });
// Bildkarten: liste [[name, bild, richtig, fehlvorstellung?]], in der Reihenfolge der Namen.
export const karten = (text, liste, hilfen, extra) => ({ ...auswahl(text, [opt('x', true), opt('y')], hilfen, extra), optionen: [...liste].sort((p, q) => p[0].localeCompare(q[0])).map(([n, bild, r, fv]) => ({ ...opt(n, Boolean(r), fv), bild })) });

// ---------- Kontexte: proportionale Zuordnungen ----------
// xn, yn: Namen der Achsen und Tabellenzeilen. xe, ye: Einheiten. geg(x, y): Satz mit einem Wertepaar. auf(x): Auftrag für den gesuchten Wert.
// kurz(x): „4 kg“. bed: der Satz, der die Zuordnung proportional macht. je: mögliche Werte für 1 (Tausendstel), nach Niveaustufe.
// stueck: Die erste Größe ist eine Anzahl (im Schaubild nur Punkte).
const ez = (v, eins, viele) => `${t(v)} ${v === 1000 ? eins : viele}`;
export const KONTEXTE = {
  hefte: { xn: 'Anzahl Hefte', yn: 'Preis in €', xe: 'Hefte', ye: '€', geld: true, stueck: true, bed: 'Jedes Heft kostet gleich viel.',
    kurz: (x) => ez(x, 'Heft', 'Hefte'), geg: (x, y) => `${ez(x, 'Heft kostet', 'Hefte kosten')} ${g(y)} €.`, auf: (x) => `Berechne den Preis für ${ez(x, 'Heft', 'Hefte')}.`, je: { F: [1000, 2000, 1500], G: [800, 900, 1200, 1400], M: [1250, 1350, 850, 950] } },
  broetchen: { xn: 'Anzahl Brötchen', yn: 'Preis in €', xe: 'Brötchen', ye: '€', geld: true, stueck: true, bed: 'Jedes Brötchen kostet gleich viel.',
    kurz: (x) => `${t(x)} Brötchen`, geg: (x, y) => `${t(x)} Brötchen ${x === 1000 ? 'kostet' : 'kosten'} ${g(y)} €.`, auf: (x) => `Berechne den Preis für ${t(x)} Brötchen.`, je: { F: [500, 1000], G: [400, 600, 700], M: [450, 550, 650] } },
  eis: { xn: 'Anzahl Kugeln', yn: 'Preis in €', xe: 'Kugeln', ye: '€', geld: true, stueck: true, bed: 'Jede Kugel Eis kostet gleich viel.',
    kurz: (x) => ez(x, 'Kugel Eis', 'Kugeln Eis'), geg: (x, y) => `${ez(x, 'Kugel Eis kostet', 'Kugeln Eis kosten')} ${g(y)} €.`, auf: (x) => `Berechne den Preis für ${ez(x, 'Kugel Eis', 'Kugeln Eis')}.`, je: { F: [1000, 1500, 2000], G: [1200, 1300, 1600], M: [1350, 1450, 1650] } },
  kartoffeln: { xn: 'Gewicht in kg', yn: 'Preis in €', xe: 'kg', ye: '€', geld: true, bed: 'Jedes Kilogramm kostet gleich viel.',
    kurz: (x) => `${t(x)} kg`, geg: (x, y) => `${t(x)} kg Kartoffeln ${x === 1000 ? 'kostet' : 'kosten'} ${g(y)} €.`, auf: (x) => `Berechne den Preis für ${t(x)} kg Kartoffeln.`, je: { F: [1000, 2000, 1500], G: [1200, 1400, 1600, 1800], M: [1250, 1350, 1450, 1750] } },
  aepfel: { xn: 'Gewicht in kg', yn: 'Preis in €', xe: 'kg', ye: '€', geld: true, bed: 'Jedes Kilogramm kostet gleich viel.',
    kurz: (x) => `${t(x)} kg`, geg: (x, y) => `${t(x)} kg Äpfel ${x === 1000 ? 'kostet' : 'kosten'} ${g(y)} €.`, auf: (x) => `Berechne den Preis für ${t(x)} kg Äpfel.`, je: { F: [2000, 3000, 2500], G: [2200, 2400, 2800], M: [2250, 2750, 3250] } },
  wandern: { xn: 'Zeit in h', yn: 'Strecke in km', xe: 'h', ye: 'km', bed: 'Die Gruppe wandert immer gleich schnell.',
    kurz: (x) => `${t(x)} h`, geg: (x, y) => `In ${ez(x, 'Stunde', 'Stunden')} wandert die Gruppe ${t(y)} km.`, auf: (x) => `Berechne die Strecke für ${ez(x, 'Stunde', 'Stunden')}.`, je: { F: [3000, 4000, 5000], G: [4000, 5000, 6000], M: [3500, 4500, 5500] } },
  rad: { xn: 'Zeit in h', yn: 'Strecke in km', xe: 'h', ye: 'km', bed: 'Das Fahrrad fährt immer gleich schnell.',
    kurz: (x) => `${t(x)} h`, geg: (x, y) => `In ${ez(x, 'Stunde', 'Stunden')} fährt das Fahrrad ${t(y)} km.`, auf: (x) => `Berechne die Strecke für ${ez(x, 'Stunde', 'Stunden')}.`, je: { F: [10000, 20000], G: [12000, 15000, 18000], M: [14500, 16500, 17500] } },
  hahn: { xn: 'Zeit in min', yn: 'Wasser in l', xe: 'min', ye: 'l', bed: 'Das Wasser fließt gleichmäßig.',
    kurz: (x) => `${t(x)} min`, geg: (x, y) => `In ${ez(x, 'Minute fließt', 'Minuten fließen')} ${t(y)} l Wasser in die Wanne.`, auf: (x) => `Berechne die Wassermenge für ${ez(x, 'Minute', 'Minuten')}.`, je: { F: [5000, 10000, 4000], G: [6000, 8000, 12000], M: [7500, 8500, 12500] } },
  hafer: { xn: 'Anzahl Pferde', yn: 'Hafer in kg', xe: 'Pferde', ye: 'kg', stueck: true, bed: 'Jedes Pferd im Burgstall bekommt gleich viel Hafer.',
    kurz: (x) => ez(x, 'Pferd', 'Pferde'), geg: (x, y) => `${ez(x, 'Pferd im Burgstall frisst', 'Pferde im Burgstall fressen')} am Tag ${t(y)} kg Hafer.`, auf: (x) => `Berechne den Hafer für ${ez(x, 'Pferd', 'Pferde')}.`, je: { F: [2000, 3000, 4000], G: [3000, 4000, 5000], M: [2500, 3500, 4500] } },
  schmied: { xn: 'Zeit in h', yn: 'Anzahl Hufeisen', xe: 'h', ye: 'Hufeisen', bed: 'Der Schmied auf der Burg arbeitet gleichmäßig.',
    kurz: (x) => `${t(x)} h`, geg: (x, y) => `In ${ez(x, 'Stunde', 'Stunden')} schmiedet der Burgschmied ${t(y)} Hufeisen.`, auf: (x) => `Berechne die Anzahl der Hufeisen für ${ez(x, 'Stunde', 'Stunden')}.`, je: { F: [2000, 3000, 4000], G: [4000, 6000, 8000], M: [6000, 8000, 12000] } },
  mehl: { xn: 'Anzahl Personen', yn: 'Mehl in g', xe: 'Personen', ye: 'g', stueck: true, bed: 'Für jede Person rechnet das Rezept gleich viel Mehl.',
    kurz: (x) => ez(x, 'Person', 'Personen'), geg: (x, y) => `Für ${ez(x, 'Person', 'Personen')} braucht das Rezept ${t(y)} g Mehl.`, auf: (x) => `Berechne das Mehl für ${ez(x, 'Person', 'Personen')}.`, je: { F: [50000, 100000], G: [60000, 80000, 120000], M: [75000, 125000, 135000] } },
  benzin: { xn: 'Benzin in l', yn: 'Preis in €', xe: 'l', ye: '€', geld: true, bed: 'Jeder Liter kostet gleich viel.',
    kurz: (x) => `${t(x)} l`, geg: (x, y) => `${t(x)} l Benzin ${x === 1000 ? 'kostet' : 'kosten'} ${g(y)} €.`, auf: (x) => `Berechne den Preis für ${t(x)} l Benzin.`, je: { F: [2000], G: [1500, 1800], M: [1650, 1750, 1850] } },
  akku: { xn: 'Zeit in min', yn: 'Ladung in %', xe: 'min', ye: '%', bed: 'Der Akku lädt gleichmäßig.',
    kurz: (x) => `${t(x)} min`, geg: (x, y) => `In ${ez(x, 'Minute', 'Minuten')} lädt der Akku um ${t(y)} %.`, auf: (x) => `Berechne die Ladung für ${ez(x, 'Minute', 'Minuten')}.`, je: { F: [1000, 2000], G: [2000, 3000], M: [1500, 2500] } },
};
export const kx = (...namen) => KONTEXTE[wahl(namen)];
export const fy = (k) => (k.geld ? g : t);
export const Y = (k, v) => `${fy(k)(v)} ${k.ye}`;
// Wert für 1 je Niveaustufe.
export const je = (k, n) => wahl(k.je[n] ?? k.je.M);

// ---------- Kontexte: antiproportionale Zuordnungen (nur E) ----------
// Das Produkt k bleibt gleich. geg(x, y), auf(x), kurz(x) wie oben; bed nennt die Bedingung.
export const ANTI = {
  pumpen: { xn: 'Anzahl Pumpen', yn: 'Zeit in h', xe: 'Pumpen', ye: 'h', stueck: true, bed: 'Alle Pumpen arbeiten gleich schnell.', k: [24, 36, 48, 60],
    kurz: (x) => ez(x, 'Pumpe', 'Pumpen'), geg: (x, y) => `${ez(x, 'Pumpe leert', 'gleiche Pumpen leeren')} ein Becken in ${ez(y, 'Stunde', 'Stunden')}.`, auf: (x) => `Berechne die Zeit für ${ez(x, 'Pumpe', 'Pumpen')}.`, rueck: (y, v = 'Berechne') => `${v}, wie viele Pumpen das Becken in ${ez(y, 'Stunde', 'Stunden')} leeren.` },
  handwerker: { xn: 'Anzahl Handwerker', yn: 'Zeit in Tagen', xe: 'Handwerker', ye: 'Tage', stueck: true, bed: 'Alle Handwerker arbeiten gleich schnell.', k: [24, 30, 36, 48],
    kurz: (x) => `${t(x)} Handwerker`, geg: (x, y) => `${t(x)} Handwerker ${x === 1000 ? 'braucht' : 'brauchen'} für die Burgmauer ${ez(y, 'Tag', 'Tage')}.`, auf: (x) => `Berechne die Zeit für ${t(x)} Handwerker.`, rueck: (y, v = 'Berechne') => `${v}, wie viele Handwerker die Burgmauer in ${ez(y, 'Tag', 'Tagen')} schaffen.` },
  futter: { xn: 'Anzahl Pferde', yn: 'Zeit in Tagen', xe: 'Pferde', ye: 'Tage', stueck: true, bed: 'Jedes Pferd frisst jeden Tag gleich viel.', k: [40, 60, 72, 120],
    kurz: (x) => ez(x, 'Pferd', 'Pferde'), geg: (x, y) => `Der Hafer im Burgstall reicht für ${ez(x, 'Pferd', 'Pferde')} ${ez(y, 'Tag', 'Tage')}.`, auf: (x) => `Berechne, wie viele Tage der Hafer für ${ez(x, 'Pferd', 'Pferde')} reicht.`, rueck: (y, v = 'Berechne') => `${v}, für wie viele Pferde der Hafer ${ez(y, 'Tag', 'Tage')} reicht.` },
  tempo: { xn: 'Geschwindigkeit in km/h', yn: 'Fahrzeit in h', xe: 'km/h', ye: 'h', bed: 'Die Strecke bleibt gleich.', k: [120, 180, 240, 360], xs: [20, 30, 40, 45, 60, 80, 90, 120],
    kurz: (x) => `${t(x)} km/h`, geg: (x, y) => `Mit ${t(x)} km/h dauert die Fahrt ${ez(y, 'Stunde', 'Stunden')}.`, auf: (x) => `Berechne die Fahrzeit mit ${t(x)} km/h.`, rueck: (y) => `Berechne die Geschwindigkeit für eine Fahrzeit von ${ez(y, 'Stunde', 'Stunden')}.` },
  bus: { xn: 'Anzahl Personen', yn: 'Preis je Person in €', xe: 'Personen', ye: '€', geld: true, stueck: true, bed: 'Die Miete für den Bus bleibt gleich. Alle zahlen gleich viel.', k: [240, 360, 480, 600],
    kurz: (x) => ez(x, 'Person', 'Personen'), geg: (x, y) => `Fahren ${t(x)} Personen mit, zahlt jede Person ${g(y)} € für den Bus.`, auf: (x) => `Berechne den Preis je Person bei ${ez(x, 'Person', 'Personen')}.`, rueck: (y) => `Berechne die Anzahl der Personen für einen Preis von ${g(y)} € je Person.` },
  flaschen: { xn: 'Inhalt einer Flasche in l', yn: 'Anzahl Flaschen', xe: 'l', ye: 'Flaschen', bed: 'Die Menge Saft bleibt gleich.', k: [12, 18, 24, 30],
    kurz: (x) => `${t(x)} l`, geg: (x, y) => `Der Saft füllt ${t(y)} Flaschen mit je ${t(x)} l.`, auf: (x) => `Berechne die Anzahl der Flaschen mit je ${t(x)} l.`, rueck: (y) => `Berechne den Inhalt einer Flasche für ${ez(y, 'Flasche', 'Flaschen')}.` },
  rechteck: { xn: 'Länge in cm', yn: 'Breite in cm', xe: 'cm', ye: 'cm', bed: 'Der Flächeninhalt bleibt gleich.', k: [24, 36, 48, 60],
    kurz: (x) => `${t(x)} cm`, geg: (x, y) => `Ein Rechteck mit der Länge ${t(x)} cm ist ${t(y)} cm breit.`, auf: (x) => `Berechne die Breite bei der Länge ${t(x)} cm.`, rueck: (y) => `Berechne die Länge bei der Breite ${t(y)} cm.` },
  lkw: { xn: 'Anzahl Lastwagen', yn: 'Anzahl Fahrten', xe: 'Lastwagen', ye: 'Fahrten', stueck: true, bed: 'Alle Lastwagen laden gleich viel.', k: [24, 36, 48, 72],
    kurz: (x) => `${t(x)} Lastwagen`, geg: (x, y) => `${t(x)} Lastwagen ${x === 1000 ? 'braucht' : 'brauchen'} für den Kies je ${ez(y, 'Fahrt', 'Fahrten')}.`, auf: (x) => `Berechne die Fahrten je Lastwagen bei ${t(x)} Lastwagen.`, rueck: (y, v = 'Berechne') => `${v}, wie viele Lastwagen bei je ${ez(y, 'Fahrt', 'Fahrten')} nötig sind.` },
};
export const ax = (...namen) => ANTI[wahl(namen)];
// Teiler einer natürlichen Zahl von `von` bis `bis`.
export const teiler = (n, von = 2, bis = n) => { const l = []; for (let d = von; d <= Math.min(bis, n); d++) if (n % d === 0) l.push(d); return l; };
// k verschiedene Werte aus einer Liste, aufsteigend.
export const auswahlAus = (liste, k) => mische(liste).slice(0, k).sort((p, q) => p - q);
// Paare als Texte für Nachweise und Bilder.
export const paarText = (paare, f = t) => paare.map(([x, y]) => [t(x), f(y)]);
