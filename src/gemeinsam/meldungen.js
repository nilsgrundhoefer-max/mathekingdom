// Aufgabenmeldungen und gesperrte Aufgaben (ADR 0025). Reine Logik ohne Oberfläche und Dateizugriff.
//
// Eine Lehrkraft meldet eine fehlerhafte Aufgabe; die Meldung steht in ihrer Datei <Kürzel>/lehrer.json unter
// `meldungen`: { id, t, kennung, art, satz, klasse }. Den Stand je Aufgabenkennung setzt der Administrator in
// Mathekingdom/aufgabenmeldungen.json auf dem Lehrertauschlaufwerk: { [kennung]: { status, t } }.
// Gesperrte Aufgaben stehen im Schulverzeichnis unter `gesperrt` (Liste von Aufgabenkennungen).

import { gitterLoesung } from '../schueler/geo.js';

export const STATUS_DATEI = 'aufgabenmeldungen.json';
export const ARTEN = { loesung: 'Lösung falsch', unloesbar: 'nicht lösbar', unklar: 'unklar formuliert', bild: 'Bild falsch' };
export const STATUS = { offen: 'offen', behoben: 'behoben', 'kein-fehler': 'kein Fehler' };
export const MAX_SATZ = 300;

export function neueMeldung({ kennung, art, satz = '', klasse = null, t }) {
  const k = String(kennung ?? '').trim();
  if (!k) throw new Error('Gib die Kennung der Aufgabe an, zum Beispiel 5.3.1-K1-F-01.');
  if (!ARTEN[art]) throw new Error('Wähle, was an der Aufgabe nicht stimmt.');
  return { id: `${t}-${Math.random().toString(36).slice(2, 7)}`, t, kennung: k, art, satz: String(satz).trim().slice(0, MAX_SATZ), ...(klasse ? { klasse } : {}) };
}

// Der Stand einer Kennung. Eine Meldung, die nach „behoben“ oder „kein Fehler“ kam, macht sie wieder offen.
export function statusVon(statusListe, kennung, meldungen = []) {
  const s = statusListe?.[kennung];
  if (!s || s.status === 'offen') return 'offen';
  return meldungen.some((m) => m.kennung === kennung && m.t > s.t) ? 'offen' : s.status;
}

// Alle Meldungen aller Lehrkräfte, zusammengefasst je Aufgabenkennung, neueste zuerst.
// lehrkraefte: { [kuerzel]: [meldung] }
export function sammle(lehrkraefte, statusListe = {}, gesperrt = []) {
  const je = new Map();
  for (const [kuerzel, liste] of Object.entries(lehrkraefte)) {
    for (const m of liste ?? []) {
      if (!je.has(m.kennung)) je.set(m.kennung, { kennung: m.kennung, meldungen: [] });
      je.get(m.kennung).meldungen.push({ ...m, kuerzel });
    }
  }
  const sperre = new Set(gesperrt);
  return [...je.values()].map((g) => {
    g.meldungen.sort((a, b) => (a.t < b.t ? 1 : -1));
    const alle = g.meldungen;
    return { ...g, zuletzt: alle[0].t, arten: [...new Set(alle.map((m) => m.art))], klassen: [...new Set(alle.map((m) => m.klasse).filter(Boolean))],
      status: statusVon(statusListe, g.kennung, alle), gesperrt: sperre.has(g.kennung) };
  }).sort((a, b) => (a.zuletzt < b.zuletzt ? 1 : -1));
}

// Die Lösung einer Aufgabe in einer Zeile, für Tafelbild und Export.
const gliedere = (n) => (Number(n) >= 10000 ? String(n).replace(/\B(?=(\d{3})+$)/g, '\u00a0') : String(n));
const zahlMitEinheit = (t) => `${gliedere(t.loesung)}${t.einheit ? ` ${t.einheit}` : ''}`;
export function loesungVon(a) {
  switch (a.format) {
    case 'zahl': case 'zahlenstrahl': return zahlMitEinheit(a);
    case 'sachaufgabe': case 'diagramm': return a.teile.map((t, i) => `${'abcdef'[i]}) ${zahlMitEinheit(t)}`).join('   ');
    case 'luecken': return a.text.replace(/\{\{(\w+)\}\}/g, (_, n) => a.luecken[n].loesung);
    case 'tabelle': return Object.values(a.luecken).map((l) => l.loesung).join(', ');
    case 'auswahl': return a.optionen.filter((o) => o.richtig).map((o) => o.text).join(' · ');
    case 'zuordnen': return a.paare.map((p) => `${p.links} → ${p.rechts}`).join(', ');
    case 'strichliste': return a.zeilen.map((z) => `${z.name}: ${z.loesung} Striche`).join(', ');
    case 'ordnen': return a.loesung.join(', ');
    case 'zeichen': return zahlMitEinheit(a);
    case 'schaetzen': return `${zahlMitEinheit(a)} (richtig von ${gliedere(a.bereich[0])} bis ${gliedere(a.bereich[1])})`;
    case 'zeichnen': return a.diagramm.saeulen.filter((x) => x.offen).map((x) => `${x.name} bis ${x.wert}`).join(', ');
    case 'gitter': return gitterLoesung(a);
    default: return '';
  }
}

// Text zum Weitergeben, damit die Aufgaben im Erzeuger korrigiert werden können. Ohne Schülernamen und Codes.
// aufgabe(kennung) liefert die Aufgabe aus dem Pool oder null.
export function alsText(gruppen, aufgabe, jetzt) {
  const datum = (t) => new Date(t).toLocaleDateString('de-DE');
  const teile = [`Mathekingdom, Aufgabenmeldungen, erstellt ${new Date(jetzt).toLocaleString('de-DE')}`, `${gruppen.length} Aufgaben`, ''];
  for (const g of gruppen) {
    const a = aufgabe(g.kennung);
    teile.push(`## ${g.kennung}${g.gesperrt ? ' (gesperrt)' : ''}`);
    if (a) {
      teile.push(`Lernziel ${a.lernziel}, Niveau ${a.niveau}, AFB ${a.afb ?? '–'}, Format ${a.format}`);
      teile.push(`Aufgabe: ${a.text.replace(/\s*\n\s*/g, ' / ')}`);
      teile.push(`Lösung im Pool: ${loesungVon(a)}`);
    } else teile.push('Diese Kennung gibt es im Aufgabenpool nicht.');
    for (const m of g.meldungen) teile.push(`- ${datum(m.t)}, ${m.kuerzel}${m.klasse ? `, Klasse ${m.klasse}` : ''}: ${ARTEN[m.art] ?? m.art}${m.satz ? `. ${m.satz}` : ''}`);
    teile.push('');
  }
  return teile.join('\r\n');
}

// ---------- Gesperrte Aufgaben beim Schüler ----------
// Der Pool ohne gesperrte Aufgaben: So wählt keine Auswahl sie mehr aus.
export function ohneGesperrte(pool, gesperrt) {
  if (!gesperrt?.length) return pool;
  const sperre = new Set(gesperrt);
  return { ...pool, aufgaben: pool.aufgaben.filter((a) => !sperre.has(a.id)) };
}
// Nimmt gesperrte Aufgaben aus angefangenen Rückblicken, Brücken und Einstiegschecks und markiert frühere
// Fehlversuche an ihnen, damit sie nicht zählen (etwa für „wackelig“). Liefert true, wenn sich etwas geändert hat.
export function beachteSperren(stand, gesperrt) {
  if (!gesperrt?.length) return false;
  const sperre = new Set(gesperrt);
  let geaendert = false;
  const raus = (liste) => { const vorher = liste.length; const rest = liste.filter((id) => !sperre.has(id)); if (rest.length !== vorher) geaendert = true; return rest; };
  if (stand.rueckblickAktiv) stand.rueckblickAktiv.aufgaben = raus(stand.rueckblickAktiv.aufgaben);
  if (stand.brueckeAktiv) stand.brueckeAktiv.aufgaben = raus(stand.brueckeAktiv.aufgaben);
  for (const e of Object.values(stand.einstieg ?? {})) if (e && !e.fertig && Array.isArray(e.aufgaben)) e.aufgaben = raus(e.aufgaben);
  for (const v of stand.versuche ?? []) if (!v.richtig && !v.gesperrt && sperre.has(v.aufgabe)) { v.gesperrt = true; geaendert = true; }
  if (stand.aktiv && sperre.has(stand.aktiv.aufgabe)) { stand.aktiv = null; geaendert = true; }
  return geaendert;
}
