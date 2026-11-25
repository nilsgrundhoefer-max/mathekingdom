// Schreibt eine lesbare Übersicht aller Aufgaben zur Durchsicht durch die Lehrkraft.
// Aufruf: node tools/uebersicht.mjs [Klassenstufe, z. B. 6]

import { readFileSync, writeFileSync } from 'node:fs';
import { zustand } from '../src/gemeinsam/kontrolle.js';
import { schreibe } from '../src/schueler/groessen.js';

const stufe = parseInt(process.argv[2] ?? '5', 10);
const pool = JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${stufe}.json`, import.meta.url), 'utf8'));
// Kontrollliste (0.37): ✔ vor jeder Aufgabe, die der Administrator im Aufgabentester kontrolliert hat und die sich seitdem nicht geändert hat.
let kontrolliert = {};
try { kontrolliert = JSON.parse(readFileSync(new URL('../aufgabenpool/kontrolliert.json', import.meta.url), 'utf8')).aufgaben ?? {}; } catch { /* noch keine */ }
const haken = (a) => (zustand(a, kontrolliert).kontrolliert ? '✔ ' : '');
const anzahlKontrolliert = pool.aufgaben.filter((a) => haken(a)).length;
const NAMEN = { F: 'Grundlage (Basiskompetenzen, nur über die Grundlagen-Schleife)', G: 'Grundlegendes Niveau (Hauptschulabschluss)', M: 'Mittleres Niveau (Realschulabschluss)', E: 'Erweitertes Niveau (Zugabe Richtung Gymnasium)' };
const flach = (t) => String(t).replace(/\n/g, ' / ');
const fehler = (liste) => (liste?.length ? ` Typische Fehler: ${liste.map((f) => `${f.wert} (${f.fehlvorstellung})`).join(', ')}.` : '');
const zahl = (a) => `**${a.loesung}${a.einheit ? ' ' + a.einheit : ''}**${a.toleranz ? ` (bis ${a.toleranz} ${a.einheit ?? ''} daneben gilt als richtig)` : ''}.${fehler(a.typischeFehler)}`;

// Kapitel 9 (ADR 0036): ein Bruchbild und ein Bruchstrahl in Worten.
const FORMWORT = { kreis: 'Kreis', rechteck: 'Rechteck', streifen: 'Streifen', menge: 'Kugeln', hundert: 'Hunderterfeld' };
const figurText = (f, leer = false) => { const je = f.form === 'rechteck' ? f.reihen * f.spalten : f.form === 'hundert' ? 100 : f.teile;
  return `${f.n ? `${f.n}: ` : ''}${f.ganze > 1 ? `${f.ganze} Ganze, je ` : ''}${FORMWORT[f.form]}${f.form === 'rechteck' ? ` ${f.reihen} × ${f.spalten}` : ''} mit ${je} ${f.ungleich ? 'ungleich großen ' : ''}Teilen${leer ? '' : `, ${(f.gefaerbt ?? []).length} gefärbt`}`; };
const amStrahl = (st, w) => { const T = st.teiler ?? 1; if (T === 1 || typeof w !== 'number') return w; if (w < 0) return `−${amStrahl(st, -w)}`; if (!/^10*$/.test(String(T))) return w % T === 0 ? String(w / T) : `${w}⁄${T}`;
  const nach = String(w % T).padStart(String(T).length - 1, '0').replace(/0+$/, ''); return `${Math.floor(w / T)}${nach ? `,${nach}` : ''}`; };
// Bild zur Aufgabe in Worten, damit die Durchsicht auch ohne Dashboard sieht, was gezeichnet wird.
const wert = (w) => (typeof w === 'object' ? (w.frage ? '?' : w.wert) : w);
// Kapitel 5 (ADR 0032): ein Karogitter in Worten.
const pt = (p) => `(${p[0]}|${p[1]})`;
const LINIE = { strecke: 'Strecke', strahl: 'Strahl', gerade: 'Gerade' };
const gitterText = (g) => [`${g.achsen ? 'Koordinatensystem' : 'Karogitter'} ${g.b} × ${g.h}${g.ursprung ? ` mit vier Quadranten, Nullpunkt bei Kästchen ${g.ursprung.join('|')}` : ''}`,
  g.punkte?.length && `Punkte ${g.punkte.map((p) => `${p.n ?? ''}${pt([p.x, p.y])}`).join(', ')}`,
  g.linien?.length && g.linien.map((l) => `${l.stil === 'achse' ? 'Symmetrieachse' : LINIE[l.art]}${l.n ? ` ${l.n}` : ''} durch ${pt(l.a)} und ${pt(l.b)}`).join(', '),
  g.figuren?.length && g.figuren.map((f) => `Figur${f.n ? ` ${f.n}` : ''} mit den Ecken ${f.ecken.map(pt).join(' ')}`).join(', '),
  g.zellen?.length && `${g.zellen.length} gefärbte Kästchen ${g.zellen.map(pt).join(' ')}`,
  g.zentrum && `Symmetriezentrum Z${pt(g.zentrum)}`,
  g.kreise?.length && g.kreise.map((k) => `Kreis um ${pt(k.m)} mit Radius ${k.r} Kästchen`).join(', ')].filter(Boolean).join('; ');
const bild = (b) => {
  if (!b) return '';
  const text = {
    zehnerfeld: () => `Zehnerfeld mit ${b.felder} Feldern, ${b.belegt} belegt${b.dazu ? `, ${b.dazu} dazu` : ''}${b.weg ? `, ${b.weg} durchgestrichen` : ''}`,
    mengenbild: () => `Mengenbild: ${b.anzahl} Plättchen${b.dazu ? `, ${b.dazu} dazu` : ''}${b.weg ? `, ${b.weg} durchgestrichen` : ''}`,
    gruppenbild: () => `${b.gruppen} Gruppen mit je ${b.je} Plättchen${b.rest ? `, ${b.rest} einzeln daneben` : ''}`,
    quadratbild: () => (b.schichten ? `Würfel aus ${b.schichten} Schichten mit je ${b.seite} · ${b.seite} Würfelchen` : `Quadrat aus ${b.seite} · ${b.seite} Kästchen`),
    paeckchen: () => `${b.einzeln ? `${b.einzeln} einzelne Plättchen und ` : ''}${b.paeckchen} Päckchen mit je ${b.je} Plättchen`,
    punktefeld: () => `Punktefeld mit ${b.reihen} Reihen zu je ${b.spalten} Punkten${b.trenn ? `, Trennlinie nach ${b.trenn} Reihen` : ''}`,
    zehnermaterial: () => `Zehnermaterial: ${b.h ? `${b.h} Hunderterplatten, ` : ''}${b.z} Zehnerstangen, ${b.e} Einerwürfel${b.weg ? `, durchgestrichen: ${JSON.stringify(b.weg)}` : ''}`,
    stellenwerttafel: () => `Stellenwerttafel ${b.spalten.map((x, i) => `${x}: ${b.plaettchen[i]}`).join(', ')}`,
    streifen: () => `Streifenbild: Ganzes ${wert(b.ganz)}, Teile ${b.teile.map(wert).join(' und ')}`,
    vergleich: () => `Vergleichsbild: ${b.oben.name} ${wert(b.oben.wert)}, ${b.unten.name} ${wert(b.unten.wert)}${b.unterschied != null ? `, Unterschied ${wert(b.unterschied)}` : ''}`,
    strichliste: () => `Strichliste${b.titel ? ` „${b.titel}“` : ''}: ${b.zeilen.map((x) => `${x.name} ${x.anzahl}${x.striche ? ` (gezeichnet als ${x.striche})` : ''}`).join(', ')}`,
    saeulen: () => `${b.liegend ? 'Balkendiagramm' : 'Säulendiagramm'} ${b.ohne?.includes('titel') ? 'ohne Titel' : `„${b.titel}“`}${b.ohne?.includes('einheit') ? ', ohne Einheit' : ''}; Achse ${b.ab ?? 0} bis ${b.max}, Linien alle ${b.fein ?? b.schritt}, beschriftet alle ${b.schritt}; ${b.saeulen.map((x) => `${x.name} ${wert(x.wert)}`).join(', ')}`,
    bilddiagramm: () => `Bilddiagramm „${b.titel}“, ein Bild (${b.symbol}) = ${b.je} ${b.einheit}; ${b.zeilen.map((x) => `${x.name} ${wert(x.wert)}`).join(', ')}`,
    bruch: () => `Bruchbild: ${b.figuren.map((f) => figurText(f)).join('; ')}`,
    tafel: () => `Stellenwerttafel${b.basis === 2 ? ' im Zweiersystem' : ''}${b.plaettchen ? ' mit Plättchen' : ''}${b.komma != null ? ` mit Komma nach ${b.spalten[b.komma]}` : ''}, Spalten ${b.spalten.join(' ')}: ${[b.werte, ...(b.weitere ?? [])].map((z) => z.map((w) => (w == null ? '·' : typeof w === 'object' ? '?' : w)).join(' ')).join(' / ')}`,
    schaetzbild: () => `Schätzbild mit ${b.felder.flat().reduce((x, y) => x + y, 0)} Symbolen (${b.symbol}) in ${b.felder.length} mal ${b.felder[0].length} Feldern, Raster ${{ fest: 'sichtbar', wahl: 'zum Einschalten', ohne: 'keines' }[b.raster]}${b.markiert ? `, ein Feld markiert${b.gezaehlt ? ' und ausgezählt' : ''}` : ''}; je Feld ${b.felder.map((z) => z.join(' ')).join(' / ')}`,
    zeichentafel: () => `Zeichentafel ${b.zeichen.join(', ')} mit Werten`,
    gitter: () => gitterText(b),
    lineal: () => `Lineal, ${b.lang / 10} cm lang; die Strecke ${(b.namen ?? ['A', 'B']).join('')} beginnt bei ${b.von} mm und endet bei ${b.bis} mm`,
    // Kapitel 6 (ADR 0033)
    geld: () => `Geld: ${b.stuecke.map((x) => (x >= 100 ? `${x / 100} €` : `${x} ct`)).join(', ')}`,
    // Kapitel 7 (ADR 0034)
    kreislineal: () => `Kreis am Lineal (${b.lang / 10} cm): Durchmesser von ${b.von} mm bis ${b.bis} mm`,
    winkel: () => `Winkel ${b.winkel.map((w) => `${w.n ?? (w.punkte ? `∢${w.punkte.a}${w.punkte.s}${w.punkte.b}` : '')} ${w.groesse}°`.trim()).join(', ')}${b.geo ? `; Geodreieck angelegt${b.geo.versatz ? ', aber verschoben' : ''}` : ''}`,
    gradnetz: () => `Gradnetz ${b.breite[0]}° bis ${b.breite[1]}° Breite, ${b.laenge[0]}° bis ${b.laenge[1]}° Länge, Linien alle ${b.schritt}°: ${b.orte.map((o) => o.n).join(', ')}`,
    uhr: () => `${b.uhren.length > 1 ? 'Zeigeruhren' : 'Zeigeruhr'}: ${b.uhren.map((u) => `${u.text ? `${u.text} ` : ''}${u.h}:${String(u.min).padStart(2, '0')} Uhr`).join(', ')}`,
    waage: () => `Balkenwaage im Gleichgewicht: links ${b.links}${b.linksDazu ? ` und ${b.linksDazu.map((x) => `${x} g`).join(', ')}` : ''}, rechts ${b.gewichte.map((x) => `${x} g`).join(', ')}`,
    einheitentafel: () => `Einheitentafel ${b.gruppen.map((g) => g.name).join(' | ')}, Spalten ${b.spalten.join(' ')}: ${[b.werte, ...(b.weitere ?? [])].map((z) => z.map((w) => (w == null ? '·' : typeof w === 'object' ? '?' : w)).join(' ')).join(' / ')}`,
    vergleichsbild: () => `Vergleichsbild: ${b.klein} als Vergleichsgröße neben ${b.gross}, ${b.richtung === 'hoch' ? 'Höhe' : 'Länge'} ${String(b.zehntel / 10).replace('.', ',')}-mal so groß${b.hilfslinien ? ', mit Hilfslinien' : ''}`,
    karte: () => `Karte mit Lineal (${b.lang / 10} cm): ${b.orte.map((o) => `${o.n} bei ${o.mm / 10} cm`).join(', ')}${b.massstab ? `; Maßstab 1:${b.massstab}` : ''}${b.leiste ? `; Maßstabsleiste: ${b.leiste.mm / 10} cm sind ${b.leiste.text}` : ''}`,
    grundriss: () => `Plan „${b.name}“: ${b.b / 10} cm lang und ${b.h / 10} cm breit${b.massstab ? `; Maßstab 1:${b.massstab}` : ''}${b.leiste ? `; Maßstabsleiste: ${b.leiste.mm / 10} cm sind ${b.leiste.text}` : ''}`,
    zeitleiste: () => `Zeitleiste: ${b.punkte.map((x) => (typeof x === 'object' ? '?' : `${x} Uhr`)).join(' → ')}; Zeitspannen ${b.spruenge.map((x) => (typeof x === 'object' ? '?' : x)).join(', ')}`,
    // Kapitel 8 (ADR 0035): Figuren aus Rechtecken am Raster oder als Skizze mit Maßen.
    flaeche: () => {
      const e = { kaestchen: 'Kästchen', cm: 'cm', m: 'm' }[b.einheit] ?? b.einheit;
      const masz = (r) => `${r[2] - r[0]} × ${r[3] - r[1]}`;
      const figur = (f) => `${f.n ? `${f.n}: ` : ''}${f.rechtecke.length === 1 ? `Rechteck ${masz(f.rechtecke[0])}` : `Figur aus den Rechtecken ${f.rechtecke.map(masz).join(', ')}${f.zerlegt ? ' (Zerlegung gestrichelt, Teilflächen nummeriert)' : ''}`}${f.loecher?.length ? `, Loch ${f.loecher.map(masz).join(', ')}` : ''}`;
      const masse = (b.masse ?? []).map((x) => (x.frage ? '?' : x.text ?? `${Math.abs(x.q[0] - x.p[0]) + Math.abs(x.q[1] - x.p[1])} ${e}`));
      return `${b.skizze ? 'Skizze, nicht maßstäblich' : `${{ kaestchen: 'Kästchenraster', cm: 'Zentimeterraster, 1 Feld = 1 cm²', m: 'Raster, 1 Feld = 1 m²' }[b.raster] ?? 'Raster'}${b.legende ? `, 1 Kästchen = ${b.legende}` : ''}`}; ${b.figuren.map(figur).join('; ')}${b.skizze ? ` (in ${e})` : ''}${masse.length ? `; Maße ${masse.join(', ')}` : ''}`;
    },
    // Klasse 7 Kapitel 1 (ADR 0043)
    thermometer: () => `${b.saeulen.length > 1 ? `${b.saeulen.length} Thermometer` : 'Thermometer'} von ${b.von} °C bis ${b.bis} °C, Striche alle ${b.schritt} Grad: ${b.saeulen.map((x) => `${x.n ?? x.name ?? x.text ?? ''} ${x.wert == null || typeof x.wert === 'object' ? '?' : `${x.wert} °C`}`.trim()).join(', ')}`,
    zahlenstrahl: () => `${b.von < 0 ? 'Zahlengerade' : 'Zahlenstrahl'} ${amStrahl(b, b.von)} bis ${amStrahl(b, b.bis)}${b.schritt ? `, Teilstriche alle ${amStrahl(b, b.schritt)}` : ''}${b.ausschnitt ? ', Ausschnitt mit Bruchzeichen' : ''}${b.pfeil != null ? `, Pfeil auf ${amStrahl(b, wert(b.pfeil))}` : ''}${b.punkte?.length ? `, Punkte bei ${b.punkte.map((x) => amStrahl(b, x)).join(', ')}` : ''}${b.start != null ? `, Startpunkt ${amStrahl(b, b.start)}` : ''}${b.spruenge?.length ? `, Sprünge ${b.spruenge.map((x) => `${amStrahl(b, x.von)} nach ${amStrahl(b, x.nach)} (${x.text})`).join(', ')}` : ''}`,
  }[b.art];
  return ` _(Bild: ${text ? text() : b.art})_`;
};

// Kapitel 1: die Antworten einer Umfrage und eine Tabelle zum Ablesen.
const daten = (a) => [a.urliste && ` _(Antwortkärtchen: ${a.urliste.join(', ')})_`, a.daten && ` _(Tabelle: ${a.daten.kopf.join(' | ')} / ${a.daten.zeilen.map((z) => z.join(' | ')).join(' / ')})_`].filter(Boolean).join('');
const loesung = (a) => {
  if (a.format === 'zahl') return `Lösung: ${zahl(a)}`;
  // Kapitel 6 (ADR 0033): Größe mit Einheit. Richtig ist jede Schreibweise mit demselben Wert.
  if (a.format === 'groesse') return `_(Größe eingeben${a.einheiten ? `, Einheit wählen aus ${a.einheiten.join(', ')}` : `, Einheit ${a.einheit} steht fest`})_ Lösung: **${schreibe(a.loesung, a.einheit)}**.${a.typischeFehler?.length ? ` Typische Fehler: ${a.typischeFehler.map((f) => `${schreibe(f.wert, a.einheit)} (${f.fehlvorstellung})`).join(', ')}.` : ''}`;

  if (a.format === 'zahlenstrahl') {
    const st = a.strahl;
    if (st.teiler) return `_(Zahlenstrahl ${amStrahl(st, st.von)} bis ${amStrahl(st, st.bis)}, Teilstriche alle ${amStrahl(st, st.schritt)}${st.ausschnitt ? ', Ausschnitt' : ''}${st.pfeil != null ? `, Pfeil auf ${amStrahl(st, st.pfeil)}` : ''}; ${a.eingabe === 'markieren' ? 'antippen' : 'Zahl eintragen'})_ Lösung: **${amStrahl(st, a.loesung)}**.${a.typischeFehler?.length ? ` Typische Fehler: ${a.typischeFehler.map((f) => `${amStrahl(st, f.wert)} (${f.fehlvorstellung})`).join(', ')}.` : ''}`;
    return `_(Zahlenstrahl ${st.von} bis ${st.bis}, Teilstriche alle ${st.schritt}${st.spruenge ? `, Sprung ${st.spruenge.map((x) => `von ${x.von}: ${x.text}`).join('; ')}` : ''}; ${a.eingabe === 'markieren' ? 'antippen' : 'Zahl eintragen'})_ Lösung: ${zahl(a)}`;
  }
  // Kapitel 9 (ADR 0036): Brucheingabe und „Teile färben“.
  // Kapitel 6.4 (ADR 0047): Periode in zwei Feldern, Vorschau mit Überstrich.
  if (a.format === 'periode') return `_(Periodeneingabe: Ziffern vor der Periode und Periode in zwei Feldern)_ Lösung: ${zahl(a)}`;
  if (a.format === 'bruch') return `_(Brucheingabe${a.gemischt ? ' mit Feld für die Ganzen' : ''}; ${a.genau ? 'nur genau dieser Bruch ist richtig' : a.gekuerzt ? 'nur vollständig gekürzt richtig, sonst Hinweis „fast richtig“' : a.form === 'gemischt' ? 'nur als gemischte Zahl richtig, sonst Hinweis „fast richtig“' : 'jeder gleichwertige Bruch ist richtig'})_ Lösung: ${zahl(a)}`;
  if (a.format === 'faerben') return `_(Teile färben: ${figurText(a.faerben, true)}; jede Auswahl mit der richtigen Anzahl ist richtig)_ Lösung: **${a.loesung} Teile gefärbt**.${fehler(a.typischeFehler)}`;
  if (a.format === 'diagramm') return `\n  _(Säulendiagramm „${a.diagramm.titel}“: ${a.diagramm.saeulen.map((x) => `${x.name} ${x.wert}`).join(', ')}; Werte ${a.diagramm.werteZeigen ? 'stehen an den Säulen' : 'müssen abgelesen werden'})_\n${a.teile.map((t, i) => `  - ${'abcdef'[i]}) ${flach(t.text)} ${zahl(t)}`).join('\n')}`;
  if (a.format === 'tabelle') {
    const zelle = (c) => (typeof c !== 'object' ? c : c.endnull ? '_0_' : c.notiz ? '▫' : `**${a.luecken[c.luecke].loesung}**`);
    const t = a.tabelle;
    if (t.art === 'mauer') return `_(${t.rechenart === '·' ? 'Mal-Mauer' : 'Zahlenmauer'}, von oben nach unten; fett = Eingabefeld)_ ${t.zeilen.map((r) => r.map(zelle).join(' · ')).join(' / ')}`;
    if (t.art === 'malkreuz') return `_(Malkreuz; fett = Eingabefeld)_\n\n  | ${t.kopf.join(' | ')} |\n  |${t.kopf.map(() => '---').join('|')}|\n${t.zeilen.map((z) => `  | ${z.map(zelle).join(' | ')} |`).join('\n')}\n\n  ${t.rechnung.faktoren.join(' · ')} = **${a.luecken[t.rechnung.summe].loesung}**\n`;
    if (t.art === 'raster' && t.rechnung?.zeichen === '·') return ` _(Rechenraster wie im Heft, hier mit Lösung)_\n\n\`\`\`\n${t.zeilen.map((z) => z.map((c) => (typeof c === 'object' ? a.luecken[c.luecke].loesung : c || ' ')).join(' ')).join('\n')}\n\`\`\`\n${t.ablesen ? `\n  Komma setzen: ${t.ablesen.text} **${a.luecken[t.ablesen.luecke].loesung}**\n` : ''}`;
    // Klasse 6, Kapitel 5 (ADR 0048): Rechenraster mit Kommaspalte (kursive 0 = grau vorgezeichnete Endnull, ▫ = Notizfeld für die Endnull) und Raster ohne Komma mit Kommafeld darunter.
    if (t.art === 'raster' && t.komma != null) return ` _(Rechenraster mit Kommaspalte; fett = Eingabefeld, kursive 0 = vorgezeichnete Endnull, ▫ = Notizfeld für die Endnull; Übertragsfelder werden nicht bewertet)_\n\n  | ${t.kopf.join(' | ')} |\n  |${t.kopf.map(() => '---').join('|')}|\n${t.zeilen.map((z) => `  | ${z.map(zelle).join(' | ')} |`).join('\n')}\n`;
    if (t.art === 'einheitentafel') return ` _(Einheitentafel ${t.gruppen.map((g) => g.name).join(' | ')} zum Eintragen; fett = Eingabefeld)_\n\n  | ${t.kopf.join(' | ')} |\n  |${t.kopf.map(() => '---').join('|')}|\n${t.zeilen.map((z) => `  | ${z.map(zelle).join(' | ')} |`).join('\n')}\n${t.ablesen ? `\n  ${t.ablesen.text} **${a.luecken[t.ablesen.luecke].loesung}** ${t.ablesen.einheit}.\n` : ''}`;
    return `${a.tabelle.art === 'raster' ? ' _(Rechenraster mit Ziffernfeldern)_' : ''}${a.tabelle.art === 'stellentafel' && a.tabelle.komma != null ? ` _(Stellenwerttafel mit Komma nach ${a.tabelle.kopf[a.tabelle.komma]}; fett = Eingabefeld)_` : ''}\n\n  | ${a.tabelle.kopf.join(' | ')} |\n  |${a.tabelle.kopf.map(() => '---').join('|')}|\n${a.tabelle.zeilen.map((z) => `  | ${z.map(zelle).join(' | ')} |`).join('\n')}\n`;
  }
  if (a.format === 'auswahl') return a.optionen.map((o) => `  - ${o.richtig ? '☑' : '☐'} ${flach(o.text)}`).join('\n');
  if (a.format === 'luecken') return `Lösung: ${Object.entries(a.luecken).map(([n, l]) => `${n} = **${l.loesung}**`).join(', ')}`;
  if (a.format === 'strichliste') return `_(Strichliste anlegen, ${a.buendeln === 'auto' ? 'der fünfte Strich wird von selbst quer gesetzt' : 'das Kind setzt den Querstrich selbst'})_ Lösung: ${a.zeilen.map((z) => `${z.name} **${z.loesung}**${z.start ? ` (schon ${z.start})` : ''}`).join(', ')}`;
  if (a.format === 'zeichnen') { const d = a.diagramm; return `_(Säulen zeichnen „${d.titel}“, Achse 0 bis ${d.max}, Linien alle ${d.fein}, beschriftet alle ${d.schritt})_ Lösung: ${d.saeulen.map((x) => (x.offen ? `${x.name} **${x.wert}**${x.start != null ? ` (steht bei ${x.start})` : ''}` : `${x.name} ${x.wert} (vorgegeben)`)).join(', ')}`; }
  if (a.format === 'zuordnen') return `Lösung: ${a.paare.map((p) => `${p.links} → ${p.rechts}`).join(', ')}`;
  // Kapitel 2 (ADR 0030)
  if (a.format === 'ordnen') return `_(Ordnen; die Karten liegen so da: ${a.karten.join(', ')})_ Lösung: **${a.loesung.join(', ')}**`;
  if (a.format === 'zeichen') return `_(Zeichen tippen mit den Tasten ${a.tasten.join(' ')})_ Lösung: **${a.loesung}**`;
  if (a.format === 'schaetzen') return `_(Schätzen)_ Wahre Anzahl: **${a.loesung}**${a.einheit ? ` ${a.einheit}` : ''}, richtig von ${a.bereich[0]} bis ${a.bereich[1]}`;
  // Kapitel 7 (ADR 0034): Winkel am Geodreieck einstellen, Kreis im Gitter zeichnen.
  if (a.format === 'winkel') return `_(Schenkel drehen, fester Schenkel in Richtung ${a.winkelfeld.von}°)_ Lösung: ${zahl({ ...a, einheit: '°' })}`;
  if (a.format === 'gitter' && a.eingabe === 'kreis') return `_(Gitterzeichnen, Kreis: erst Mittelpunkt, dann Punkt der Kreislinie; ${gitterText(a.gitter)})_ Lösung: **Kreis um ${pt(a.bedingung.m)} mit Radius ${a.bedingung.r} Kästchen**, zum Beispiel durch ${pt(a.beispiel[1])}`;
  if (a.format === 'gitter') {
    const was = { punkte: a.offen ? 'alle passenden Punkte antippen' : `${a.loesung?.length === 1 ? 'einen Punkt' : `${a.loesung?.length} Punkte`} antippen`, zellen: 'Kästchen färben', linie: `${LINIE[a.linie] ?? 'Linie'} durch zwei Punkte zeichnen` }[a.eingabe];
    // Kapitel 8 (ADR 0035): Kästchen färben mit Bedingung, jede passende Figur ist richtig.
    if (a.bedingung?.art === 'flaeche') {
      const bd = a.bedingung, regel = [bd.n && `${bd.n} Kästchen`, bd.umfang && `einem Rand von ${bd.umfang} Kästchenseiten`].filter(Boolean).join(' und ');
      return `_(Gitterzeichnen, ${was}; ${gitterText(a.gitter)})_ Lösung: **${bd.rechteck ? 'jedes Rechteck' : 'jede zusammenhängende Figur'} mit ${regel}**, zum Beispiel ${a.loesung.map(pt).join(' ')}`;
    }
    return `_(Gitterzeichnen, ${was}; ${gitterText(a.gitter)})_ Lösung: **${a.eingabe === 'linie' ? `zum Beispiel durch ${a.beispiel.map(pt).join(' und ')}` : a.loesung.map(pt).join(' ')}**`;
  }
  return a.teile.map((t, i) => (t.optionen ? `  - ${'abcdef'[i]}) ${flach(t.text)}${t.mehrfach ? ' _(mehrere antippen)_' : ''} ${t.optionen.map((o) => `${o.richtig ? '☑' : '☐'} ${flach(o.text)}`).join(' · ')}` : `  - ${'abcdef'[i]}) ${flach(t.text)} ${zahl(t)}`)).join('\n');
};

// Voraussetzungen können in der Vorstufe liegen (Klasse 6 baut auf Klasse 5, ADR 0037).
const alleLernziele = new Map([...(pool.vorstufe?.lernziele ?? []), ...pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele)].map((l) => [l.id, l.text]));
// Prozessbezogene Kompetenz (ADR 0017): Haupt, in Klammern die Nebenkompetenz.
const kompetenzText = (a) => `${pool.kompetenzen[a.kompetenz[0]]}${a.kompetenz[1] ? ` (+ ${pool.kompetenzen[a.kompetenz[1]]})` : ''}`;
let md = `# Aufgaben Klasse ${stufe}: Übersicht zur Durchsicht\n\nAutomatisch erzeugt aus \`aufgabenpool/klasse-${stufe}.json\` (${pool.aufgaben.length} Aufgaben). Nicht von Hand bearbeiten.\n\nBei Auswahlaufgaben ist ☑ die Antwort, die der Schüler ankreuzen muss.\n\n✔ vor einer Aufgabe: vom Administrator im Aufgabentester kontrolliert (${anzahlKontrolliert} von ${pool.aufgaben.length}).\n`;
for (const k of pool.kapitel) for (const u of k.unterkapitel) for (const l of u.lernziele) {
  const eigene = pool.aufgaben.filter((a) => a.lernziel === l.id);
  if (!eigene.length) continue;
  const vor = l.voraussetzungen?.length ? l.voraussetzungen.map((v) => `${v} (${alleLernziele.get(v)})`).join(', ') : 'nur Grundschulstoff';
  md += `\n## ${l.id}: ${l.text}\n\nGrundlage, die F übt: ${l.grundlage}\n\nBaut auf: ${vor}\n`;
  for (const n of Object.keys(NAMEN)) {
    const gruppe = eigene.filter((a) => a.niveau === n);
    md += `\n### ${n} · ${NAMEN[n]}\n\n`;
    // Je Niveaustufe gibt es unterschiedlich viele Hilfekärtchen (ADR 0015). Zeilenumbrüche der einfachen Sprache werden zu " / ".
    const karten = (h) => [['tipp', 'Tipp'], ['beispiel', 'Beispiel'], ['loesungsschritt', 'Lösungsschritt']].filter(([f]) => h[f]).map(([f, n]) => `*${n}:* ${flach(h[f])}`).join(' ');
    if (!gruppe.length) continue;
    md += `Hilfekärtchen der ersten Aufgabe: ${karten(gruppe[0].hilfen)}\n\n`;
    for (const a of gruppe) {
      const mehrzeilig = a.format === 'auswahl' || a.format === 'sachaufgabe';
      md += `- ${haken(a)}\`${a.id.split('-').pop()}\` AFB ${'I'.repeat(a.afb)} · _${kompetenzText(a)}_ · ${a.heftaufgabe ? '**[Heftaufgabe]** ' : ''}${flach(a.text).replace(/\{\{(\w+)\}\}/g, '▢')}${bild(a.bild)}${a.tippBild ? bild(a.tippBild).replace('(Bild:', '(Bild im Tipp:') : ''}${daten(a)}${mehrzeilig ? '\n' : ' '}${loesung(a)}\n`;
    }
  }
}
md += `\n## Typische Fehler und Aha-Momente\n\nJe Fehlvorstellung: was die Lehrkraft liest, was der Schüler nach dem ersten Fehlversuch liest, und der Satz für den Aha-Moment, wenn er den Fehler überwunden hat (ADR 0017).\n\n| Kürzel | Für die Lehrkraft | Hinweis an den Schüler | Aha-Moment |\n|---|---|---|---|\n`;
for (const [id, f] of Object.entries(pool.fehlvorstellungen)) md += `| \`${id}\` | ${f.beschreibung} | ${f.hinweis} | ${f.kind} |\n`;
md += `\n## Voraussetzungen der Lernziele ohne Aufgaben\n\n`;
for (const k of pool.kapitel) for (const u of k.unterkapitel) for (const l of u.lernziele) {
  if (pool.aufgaben.some((a) => a.lernziel === l.id)) continue;
  md += `- ${l.id} ${l.text} Baut auf: ${l.voraussetzungen?.length ? l.voraussetzungen.map((v) => `${v} (${alleLernziele.get(v)})`).join(', ') : 'nur Grundschulstoff'}\n`;
}
// Ab Klasse 7 (ADR 0043) stehen negative Zahlen mit dem echten Minuszeichen in der Übersicht, so wie die App sie zeigt.
if (stufe >= 7) md = md.replace(/(?<![\w−-])-(?=\d)/g, '−');
const ziel = stufe === 5 ? 'aufgaben-klasse-5-pilot.md' : `aufgaben-klasse-${stufe}.md`;
writeFileSync(new URL(`../docs/${ziel}`, import.meta.url), md);
console.log(`Übersicht geschrieben: docs/${ziel}`);
