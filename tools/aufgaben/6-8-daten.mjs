// Gemeinsame Bausteine für Klasse 6, Kapitel 8 „Daten auswerten und darstellen“ (ADR 0058).
// Grilling mit Nils (2026-11-28): Mittelwert F ganz und geht auf, G eine Stelle nach dem Komma, M gerundet auf zwei Stellen, E rückwärts.
// Zentralwert ab G (ungerade Anzahl), ab M auch gerade Anzahl. Relative Häufigkeit F Gesamtzahl 10, 20, 50, 100 als Bruch, G auch Prozent.
// Kreisdiagramme ergeben ganze Grad, Streifendiagramme sind 10 cm oder 20 cm lang. Kontexte aus dem Alltag und von der Burg.
// Gerechnet wird mit ganzen Zahlen in Zehnteln, damit nichts ungenau wird (3,2 m ist 32).

import { zz, wahl, mische, Z, opt, auswahl as auswahlRoh, kind, zweiKinder, sechs, zwoelf } from '../werkzeug.mjs';
import { H } from './6-3-koerper.mjs';
import { FREI } from './5-9-brueche.mjs';

export { zz, wahl, mische, Z, opt, kind, zweiKinder, sechs, zwoelf, H, FREI };
export const auswahl = auswahlRoh;
const mit = (extra) => Object.fromEntries(Object.entries(extra ?? {}).filter(([, x]) => x != null));

// ---------- Zahlen ----------
// Text einer Zahl mit höchstens `stellen` Stellen nach dem Komma, ohne Endnullen. Mit fest: genau so viele Stellen.
export const dz = (v, stellen = 2, fest = false) => { const s = Number(v).toFixed(stellen); return (fest ? s : s.replace(/\.?0+$/, '')).replace('.', ','); };
// Lösung im Pool: ganze Zahl als Zahl, sonst Text.
export const lo = (v, stellen = 2) => (Number.isInteger(v) ? v : dz(v, stellen));
export const ggT = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
export const bruch = (z, n) => { const d = ggT(z, n); return `${z / d}⁄${n / d}`; };
export const roh = (z, n) => `${z}⁄${n}`;
export const summe = (l) => l.reduce((x, y) => x + y, 0);
export const sortiert = (l) => [...l].sort((x, y) => x - y);
export const zentral = (l) => { const s = sortiert(l), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
export const mittel = (l) => summe(l) / l.length;
// Typische Fehler [[wert, fehlvorstellung]]: nie die Lösung, nie doppelt, nie negativ.
export const fl = (loesung, liste, stellen = 2) => (liste ?? []).map(([w, f]) => [lo(w, stellen), f]).filter(([w, f], i, l) => f && String(w) !== String(loesung) && !String(w).startsWith('-') && l.findIndex(([x]) => String(x) === String(w)) === i).map(([wert, fehlvorstellung]) => ({ wert, fehlvorstellung }));

// ---------- Formate ----------
export const zahl = (text, v, einheit, fehler, hilfen, extra, stellen = 2) => ({ format: 'zahl', text, loesung: lo(v, stellen), ...(einheit ? { einheit } : {}), typischeFehler: fl(lo(v, stellen), fehler, stellen), hilfen, ...mit(extra) });
// Lückentext: werte { name: [v, fehler, stellen?] }.
export const luecken = (text, werte, hilfen, extra) => ({ format: 'luecken', text, luecken: Object.fromEntries(Object.entries(werte).map(([n, [v, f, st = 2]]) => [n, { loesung: lo(v, st), typischeFehler: fl(lo(v, st), f, st) }])), hilfen, ...mit(extra) });
// Bruch, vollständig gekürzt. fehler: [[„3⁄10“, fv]].
export const bruchAufgabe = (text, z, n, fehler, hilfen, extra) => { const l = bruch(z, n); return { format: 'bruch', text, loesung: l, typischeFehler: (fehler ?? []).filter(([w], i, a) => w !== l && a.findIndex(([x]) => x === w) === i).map(([wert, fehlvorstellung]) => ({ wert, fehlvorstellung })), gekuerzt: true, hilfen, ...mit(extra) }; };
// Tabelle mit Lücken: kopf, zeilen (Texte oder { luecke }), werte { name: [v, fehler] }.
export const tabelle = (text, kopf, zeilen, werte, hilfen, extra) => ({ format: 'tabelle', text, tabelle: { kopf, zeilen }, luecken: Object.fromEntries(Object.entries(werte).map(([n, [v, f, st = 2]]) => [n, { loesung: lo(v, st), typischeFehler: fl(lo(v, st), f, st) }])), hilfen, ...mit(extra) });
export const LU = (name) => ({ luecke: name });
// Streifen färben: farben [[name, kästchen]], fehler [[[k1, k2, …], fv]].
export const streifenFaerben = (text, farben, fehler, hilfen, extra, laenge = null) => ({ format: 'streifenfaerben', text, streifen: { kaestchen: 20, ...(laenge ? { laenge } : {}) }, farben: farben.map(([name, loesung]) => ({ name, loesung })),
  typischeFehler: (fehler ?? []).filter(([w]) => w.length === farben.length && w.some((x, i) => x !== farben[i][1]) && w.every((x) => x >= 0) && summe(w) <= 20).map(([werte, fehlvorstellung]) => ({ werte, fehlvorstellung })), hilfen, ...mit(extra) });
// Datensatz erfinden: anzahl Lücken a, b, c …; bedingung { mittelwert?, spannweite?, zentralwert? }; beispiel eine passende Reihe.
export const datensatz = (text, anzahl, bedingung, beispiel, hilfen, extra, von = 0, bis = 100) => {
  const namen = 'abcdefgh'.slice(0, anzahl).split('');
  return { format: 'luecken', text: `${text}\n${namen.map((n) => `{{${n}}}`).join(' ')}`, luecken: Object.fromEntries(namen.map((n, i) => [n, { loesung: beispiel[i], typischeFehler: [] }])), datensatz: { anzahl, von, bis, ...bedingung }, hilfen, ...mit(extra) };
};

// ---------- Bilder ----------
// Datentabelle (unter dem Text): kopf, zeilen als Texte.
export const daten = (kopf, zeilen) => ({ kopf, zeilen: zeilen.map((z) => z.map(String)) });
// Messreihe als Tabelle mit Namen: werte in Zehnteln oder ganz, einheit im Kopf.
export const reihe = (kopf, namen, werte, stellen = 1) => daten(kopf, werte.map((w, i) => [namen[i], dz(w, stellen)]));
// Kreisdiagramm: teile [[name, winkel, text?]].
export const kreis = (teile, titel) => mit({ art: 'kreisdiagramm', titel, teile: teile.map(([name, winkel, text]) => mit({ name, winkel, text })) });
// Streifendiagramm: laenge in cm, teile [[name, mm, text?]].
export const streifen = (laenge, teile, titel) => mit({ art: 'streifendiagramm', titel, laenge, teile: teile.map(([name, mm, text]) => mit({ name, mm, text })) });
// Säulendiagramm aus Klasse 5 (für Irreführung und Vergleich).
export const saeulen = (titel, einheit, max, schritt, liste, extra = {}) => ({ art: 'saeulen', titel, einheit, max, schritt, saeulen: liste.map(([name, wert]) => ({ name, wert })), ...extra });

// ---------- Nachweise (tools/pruefe-daten.mjs rechnet sie unabhängig nach) ----------
// Kenngröße einer Datenreihe. was: minimum, maximum, spannweite, mittelwert, zentralwert, summe, anzahl. werte als Texte („3,2“).
// Mit luecke: Lösung dieser Lücke. Mit gerundet: auf so viele Stellen gerundet. Mit zwischen: nur ein Zwischenschritt.
export const KENN = (was, werte, wert, extra = {}) => ({ art: 'kenngroesse', was, werte: werte.map(String), wert: String(wert), ...extra });
// Zählen in einer Urliste: name kommt anzahl-mal vor.
export const ZAEHL = (name, anzahl, extra = {}) => ({ art: 'zaehlen', name, anzahl, ...extra });
// Anteil: anzahl von gesamt ist wert (als bruch, prozent, dezimal oder grad). Mit anzahl/gesamt als Zahlen.
export const ANTEIL = (anzahl, gesamt, wert, als, extra = {}) => ({ art: 'anteil', anzahl, gesamt, wert: String(wert), als, ...extra });
// Rückwärts: Ein Anteil (prozent/grad/mm von laenge) von gesamt ist anzahl.
export const ANZAHL = (anteil, als, gesamt, anzahl, extra = {}) => ({ art: 'anzahl', anteil: String(anteil), als, gesamt, anzahl, ...extra });
// Diagramm lesen: Der Teil `name` im Bild hat den Anteil wert (prozent, bruch, grad).
export const LESEN = (name, wert, als, extra = {}) => ({ art: 'lesen', name, wert: String(wert), als, ...extra });
export const URTEIL = (stimmt) => ({ art: 'urteil', stimmt });
export const WERT = (wert) => ({ art: 'wert', wert: String(wert) });

// ---------- Kontexte ----------
// Umfragen mit Antworten (Kategorien).
export const UMFRAGEN = {
  sport: { frage: 'Lieblingssport', genus: 'm', wer: 'Kinder', antworten: ['Fußball', 'Schwimmen', 'Reiten', 'Basketball', 'Turnen', 'Tanzen'] },
  obst: { frage: 'Lieblingsobst', genus: 'n', wer: 'Kinder', antworten: ['Apfel', 'Banane', 'Erdbeere', 'Kirsche', 'Traube', 'Birne'] },
  weg: { frage: 'Schulweg', genus: 'm', wer: 'Kinder', antworten: ['Bus', 'Fahrrad', 'zu Fuß', 'Auto', 'Roller'] },
  tier: { frage: 'Lieblingstier', genus: 'n', wer: 'Kinder', antworten: ['Hund', 'Katze', 'Pferd', 'Hase', 'Hamster', 'Vogel'] },
  burg: { frage: 'Lieblingsübung', genus: 'f', wer: 'Knappen', antworten: ['Reiten', 'Bogenschießen', 'Schwertkampf', 'Falknerei', 'Lanzenstechen'] },
  essen: { frage: 'Lieblingsessen', genus: 'n', wer: 'Kinder', antworten: ['Pizza', 'Nudeln', 'Pommes', 'Salat', 'Suppe', 'Reis'] },
};
// Mit den gebeugten Formen: zum (zum Schulweg, zur Lieblingsübung), dem (dem Schulweg, der Lieblingsübung), ihr (ihren Schulweg, ihr Lieblingsobst, ihre Lieblingsübung).
const gebeugt = (u) => ({ ...u, zum: `${u.genus === 'f' ? 'zur' : 'zum'} ${u.frage}`, dem: `${u.genus === 'f' ? 'der' : 'dem'} ${u.frage}`, ihr: `${{ m: 'ihren', n: 'ihr', f: 'ihre' }[u.genus]} ${u.frage}` });
export const umfrage = (...namen) => gebeugt(UMFRAGEN[wahl(namen.length ? namen : Object.keys(UMFRAGEN))]);
// Messreihen: werte in Zehnteln (stellen 1) oder ganz (stellen 0). von, bis: Bereich der Werte (in derselben Einheit wie die Werte).
export const MESSUNGEN = {
  weitsprung: { kopf: ['Kind', 'Weite in m'], einheit: 'm', stellen: 1, von: 22, bis: 42, wer: 'Kinder', satz: 'Kinder springen weit.' },
  ballwurf: { kopf: ['Kind', 'Weite in m'], einheit: 'm', stellen: 0, von: 12, bis: 38, wer: 'Kinder', satz: 'Kinder werfen einen Ball.' },
  lauf: { kopf: ['Kind', 'Zeit in s'], einheit: 's', stellen: 1, von: 72, bis: 98, wer: 'Kinder', satz: 'Kinder laufen 50 m.' },
  bogen: { kopf: ['Knappe', 'Punkte'], einheit: 'Punkte', stellen: 0, von: 4, bis: 30, wer: 'Knappen', satz: 'Knappen schießen beim Turnier mit dem Bogen.' },
  temperatur: { kopf: ['Tag', 'Temperatur in °C'], einheit: '°C', stellen: 0, von: 8, bis: 26, wer: 'Tage', satz: 'Die Klasse misst jeden Mittag die Temperatur.', namen: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'] },
  groesse: { kopf: ['Kind', 'Größe in cm'], einheit: 'cm', stellen: 0, von: 138, bis: 162, wer: 'Kinder', satz: 'Kinder messen ihre Körpergröße.' },
  taschengeld: { kopf: ['Kind', 'Taschengeld in €'], einheit: '€', stellen: 0, von: 3, bis: 20, wer: 'Kinder', satz: 'Kinder nennen ihr Taschengeld in der Woche.' },
};
export const messung = (...namen) => { const k = wahl(namen.length ? namen : Object.keys(MESSUNGEN)); return { name: k, ...MESSUNGEN[k] }; };
export const NAMEN = ['Mia', 'Tom', 'Lena', 'Ali', 'Ben', 'Mara', 'Jonas', 'Finn', 'Ida', 'Ole', 'Lina', 'Paul', 'Emre', 'Noah', 'Elif', 'Sara'];
export const KNAPPEN = ['Konrad', 'Hagen', 'Gunther', 'Ortwin', 'Dietrich', 'Volker', 'Rüdiger', 'Gernot'];
export const namenFuer = (m, n) => (m.namen ? m.namen.slice(0, n) : mische(m.wer === 'Knappen' ? KNAPPEN : NAMEN).slice(0, n));
// n Werte im Bereich der Messung, verschieden. Mit summeTeilbar: Die Summe ist durch n teilbar (Mittelwert geht auf, in Zehnteln).
export function werte(m, n, { summeTeilbar = false, verschieden = true } = {}) {
  for (;;) {
    const l = Array.from({ length: n }, () => zz(m.von, m.bis));
    if (verschieden && new Set(l).size !== n) continue;
    if (summeTeilbar && summe(l) % n !== 0) continue;
    return l;
  }
}
// Werte in Zehnteln als Text der Messung („3,2“) oder ganz („24“).
export const wt = (m, v) => (m.stellen ? dz(v / 10, 1, true) : String(v));
export const wv = (m, v) => (m.stellen ? v / 10 : v);
export const tab = (m, namen, l) => daten(m.kopf, l.map((v, i) => [namen[i], wt(m, v)]));
export const ME = (m, v) => `${wt(m, v)} ${m.einheit}`;
