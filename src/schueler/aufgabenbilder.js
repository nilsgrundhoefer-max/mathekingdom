// Schematische Bilder zu Aufgaben (ADR 0015): Plättchen, Zehnermaterial, Punktefelder, Streifen.
// Jedes Bild zeigt genau die Zahlen aus dem Feld "bild" der Aufgabe. tools/pruefe-pool.mjs prüft,
// dass diese Zahlen zur Aufgabe gehören. Eine Unbekannte ({ wert, frage: true }) wird als „?“ gezeichnet.
import { s } from './dom.js';
import { RATIONALBILDER } from './rationalbilder.js';
import { zahlenstrahl } from './bilder.js';
import { DEZIMALBILDER } from './dezimalbilder.js';
import { ZUORDNUNGSBILDER } from './zuordnungsbilder.js';
import { DATENBILDER } from './datenbilder.js';
import { ZAHLENBILDER } from './zahlenbilder.js';
import { GEOBILDER } from './geobilder.js';
import { GROESSENBILDER } from './groessenbilder.js';
import { WINKELBILDER } from './winkelbilder.js';
import { FLAECHENBILDER } from './flaechenbilder.js';
import { BRUCHBILDER } from './bruchbilder.js';
import { FIGURBILDER } from './figurbilder.js';
import { KOERPERBILDER } from './koerperbilder.js';

const DUNKEL = '#2f4f7f';
const HELL = '#fbf6e9';
const LINIE = '#5b4632';
const ROT = '#a3302a';

const istFrage = (x) => typeof x === 'object' && x !== null && x.frage === true;
const wertVon = (x) => (istFrage(x) ? x.wert : x);
// Tausenderlücke wie im Aufgabentext (schmales geschütztes Leerzeichen ab fünf Stellen).
const lies = (x) => (istFrage(x) ? '?' : String(x).replace(/\B(?=(\d{3})+(?!\d))/g, x >= 10000 ? ' ' : ''));

function rahmen(breite, hoehe, titel, ...kinder) {
  return s('svg', { class: 'aufgabenbild', viewBox: `0 0 ${breite} ${hoehe}`, width: breite, height: hoehe, role: 'img', 'aria-label': titel }, ...kinder);
}
// Ein Plättchen. art: 'voll' (dunkel), 'hell' (kommt dazu), 'leer' (freier Platz). weg: durchgestrichen.
function plaettchen(x, y, r, art = 'voll', weg = false) {
  return s('g', { class: `plaettchen ${art}${weg ? ' weg' : ''}` },
    art === 'leer' ? null : s('circle', { cx: x, cy: y, r, fill: art === 'hell' ? HELL : DUNKEL, stroke: DUNKEL, 'stroke-width': 2 }),
    weg && s('path', { d: `M${x - r - 2} ${y - r - 2} L${x + r + 2} ${y + r + 2} M${x + r + 2} ${y - r - 2} L${x - r - 2} ${y + r + 2}`, stroke: ROT, 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }));
}
const mehrzahl = (n, eins, viele) => `${n} ${n === 1 ? eins : viele}`;

// Zehnerfeld: 2 Reihen mit je 5 Feldern, bei 20 Feldern zwei Zehnerfelder nebeneinander. Gefüllt wird reihenweise.
function zehnerfeld({ felder, belegt, dazu = 0 }) {
  const k = 34, rand = 8, luecke = 22, anzahl = felder / 10;
  const breite = rand * 2 + anzahl * 5 * k + (anzahl - 1) * luecke, hoehe = rand * 2 + 2 * k;
  const teile = [];
  for (let f = 0; f < anzahl; f++) {
    const x0 = rand + f * (5 * k + luecke);
    for (let i = 0; i < 10; i++) {
      const nr = f * 10 + i, x = x0 + (i % 5) * k, y = rand + Math.floor(i / 5) * k;
      teile.push(s('rect', { x, y, width: k, height: k, fill: '#fff', stroke: LINIE, 'stroke-width': 1.5 }));
      if (nr < belegt + dazu) teile.push(plaettchen(x + k / 2, y + k / 2, k / 2 - 6, nr < belegt ? 'voll' : 'hell'));
    }
    teile.push(s('rect', { x: x0, y: rand, width: 5 * k, height: 2 * k, fill: 'none', stroke: LINIE, 'stroke-width': 3 }));
  }
  const titel = `${felder === 10 ? 'Zehnerfeld' : 'Zwanzigerfeld'}: ${mehrzahl(belegt, 'dunkles Plättchen', 'dunkle Plättchen')}${dazu ? ` und ${mehrzahl(dazu, 'helles Plättchen', 'helle Plättchen')}` : ''}`;
  return rahmen(breite, hoehe, titel, teile);
}

// Mengenbild: Plättchen in Reihen zu 10 mit einer Lücke nach 5. Helle kommen dazu, durchgestrichene gehen weg.
function mengenbild({ anzahl, dazu = 0, weg = 0 }) {
  const k = 30, rand = 8, luecke = 12, alle = anzahl + dazu;
  const spalten = Math.min(10, alle), reihen = Math.ceil(alle / 10);
  const breite = rand * 2 + spalten * k + (spalten > 5 ? luecke : 0), hoehe = rand * 2 + reihen * k;
  const teile = [];
  for (let i = 0; i < alle; i++) {
    const sp = i % 10, x = rand + sp * k + (sp >= 5 ? luecke : 0) + k / 2, y = rand + Math.floor(i / 10) * k + k / 2;
    teile.push(plaettchen(x, y, k / 2 - 4, i < anzahl ? 'voll' : 'hell', i >= alle - weg));
  }
  const titel = `${mehrzahl(anzahl, 'Plättchen', 'Plättchen')}${dazu ? `, ${dazu} helle kommen dazu` : ''}${weg ? `, ${weg} sind durchgestrichen` : ''}`;
  return rahmen(breite, hoehe, titel, teile);
}

// Gruppenbild: gleich große Gruppen in Kästen, der Rest liegt lose daneben.
function gruppenbild({ gruppen, je, rest = 0 }) {
  const k = 22, innen = 8, abstand = 12, rand = 6;
  const proReihe = Math.min(5, je), reihenInnen = Math.ceil(je / 5);
  const kb = innen * 2 + proReihe * k, kh = innen * 2 + reihenInnen * k;
  const kaestenProZeile = Math.min(gruppen, 5), zeilen = Math.ceil(gruppen / 5);
  const restBreite = rest ? abstand + Math.min(rest, 5) * k + innen : 0;
  const breite = rand * 2 + kaestenProZeile * kb + (kaestenProZeile - 1) * abstand + restBreite;
  const hoehe = rand * 2 + zeilen * kh + (zeilen - 1) * abstand;
  const teile = [];
  for (let g = 0; g < gruppen; g++) {
    const x0 = rand + (g % 5) * (kb + abstand), y0 = rand + Math.floor(g / 5) * (kh + abstand);
    teile.push(s('rect', { x: x0, y: y0, width: kb, height: kh, rx: 8, fill: '#fff', stroke: LINIE, 'stroke-width': 2 }));
    for (let i = 0; i < je; i++) teile.push(plaettchen(x0 + innen + (i % 5) * k + k / 2, y0 + innen + Math.floor(i / 5) * k + k / 2, k / 2 - 3));
  }
  const xr = rand + kaestenProZeile * kb + (kaestenProZeile - 1) * abstand + abstand;
  for (let i = 0; i < rest; i++) teile.push(plaettchen(xr + (i % 5) * k + k / 2, rand + innen + Math.floor(i / 5) * k + k / 2, k / 2 - 3));
  const titel = `${mehrzahl(gruppen, 'Gruppe', 'Gruppen')} mit je ${je}${rest ? `, ${rest} einzeln daneben` : ''}`;
  return rahmen(breite, hoehe, titel, teile);
}

// Punktefeld: Reihen mal Spalten, mit einer Lücke nach 5 Spalten. trenn: Linie nach so vielen Reihen (Zerlegen in zwei Aufgaben).
function punktefeld({ reihen, spalten, trenn = null }) {
  const k = 26, rand = 8, luecke = 10, spalt = trenn ? 14 : 0;
  const breite = rand * 2 + spalten * k + (spalten > 5 ? luecke : 0), hoehe = rand * 2 + reihen * k + spalt;
  const teile = [];
  for (let r = 0; r < reihen; r++) for (let c = 0; c < spalten; c++) {
    teile.push(plaettchen(rand + c * k + (c >= 5 ? luecke : 0) + k / 2, rand + r * k + (trenn && r >= trenn ? spalt : 0) + k / 2, k / 2 - 4));
  }
  if (trenn) teile.push(s('line', { x1: 2, x2: breite - 2, y1: rand + trenn * k + spalt / 2, y2: rand + trenn * k + spalt / 2, stroke: ROT, 'stroke-width': 3, 'stroke-dasharray': '8 5', class: 'trennlinie' }));
  const titel = `Punktefeld mit ${mehrzahl(reihen, 'Reihe', 'Reihen')} und ${spalten} Punkten in jeder Reihe${trenn ? `, geteilt nach ${mehrzahl(trenn, 'Reihe', 'Reihen')}` : ''}`;
  return rahmen(breite, hoehe, titel, teile);
}

// Zehnermaterial: Hunderterplatten, Zehnerstangen, Einerwürfel. weg: so viele Teile jeder Sorte sind durchgestrichen.
function zehnermaterial({ h = 0, z = 0, e = 0, weg = null }) {
  const w = 7, rand = 8, abstand = 10, block = 22;
  const teile = [];
  const kreuz = (x, y, b, hh) => s('path', { class: 'weg', d: `M${x - 2} ${y - 2} L${x + b + 2} ${y + hh + 2} M${x + b + 2} ${y - 2} L${x - 2} ${y + hh + 2}`, stroke: ROT, 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' });
  let x = rand;
  const hoehe = rand * 2 + 10 * w;
  for (let i = 0; i < h; i++) {
    const g = s('g', { class: 'platte' }, s('rect', { x, y: rand, width: 10 * w, height: 10 * w, fill: '#dfe7f3', stroke: DUNKEL, 'stroke-width': 2 }));
    for (let j = 1; j < 10; j++) g.append(s('line', { x1: x + j * w, x2: x + j * w, y1: rand, y2: rand + 10 * w, stroke: DUNKEL, 'stroke-width': 0.6 }), s('line', { x1: x, x2: x + 10 * w, y1: rand + j * w, y2: rand + j * w, stroke: DUNKEL, 'stroke-width': 0.6 }));
    teile.push(g);
    if (weg && i >= h - (weg.h ?? 0)) teile.push(kreuz(x, rand, 10 * w, 10 * w));
    x += 10 * w + abstand;
  }
  if (h && (z || e)) x += block;
  for (let i = 0; i < z; i++) {
    const g = s('g', { class: 'stange' }, s('rect', { x, y: rand, width: w + 3, height: 10 * w, fill: '#dfe7f3', stroke: DUNKEL, 'stroke-width': 2 }));
    for (let j = 1; j < 10; j++) g.append(s('line', { x1: x, x2: x + w + 3, y1: rand + j * w, y2: rand + j * w, stroke: DUNKEL, 'stroke-width': 0.8 }));
    teile.push(g);
    if (weg && i >= z - (weg.z ?? 0)) teile.push(kreuz(x, rand, w + 3, 10 * w));
    x += w + 3 + abstand;
  }
  if (z && e) x += block;
  // Würfel einzeln mit Abstand, in Reihen zu 5 (damit eine Reihe nicht wie eine Stange aussieht).
  const wk = 12, wa = 7;
  for (let i = 0; i < e; i++) {
    const cx = x + (i % 5) * (wk + wa), cy = rand + Math.floor(i / 5) * (wk + wa);
    teile.push(s('rect', { class: 'wuerfel', x: cx, y: cy, width: wk, height: wk, fill: '#dfe7f3', stroke: DUNKEL, 'stroke-width': 2 }));
    if (weg && i >= e - (weg.e ?? 0)) teile.push(kreuz(cx, cy, wk, wk));
  }
  if (e) x += Math.min(e, 5) * (wk + wa);
  const sorten = [h && mehrzahl(h, 'Hunderterplatte', 'Hunderterplatten'), z && mehrzahl(z, 'Zehnerstange', 'Zehnerstangen'), e && mehrzahl(e, 'Einerwürfel', 'Einerwürfel')].filter(Boolean);
  const wegText = weg ? [weg.h && mehrzahl(weg.h, 'Platte', 'Platten'), weg.z && mehrzahl(weg.z, 'Stange', 'Stangen'), weg.e && mehrzahl(weg.e, 'Würfel', 'Würfel')].filter(Boolean).join(', ') : '';
  return rahmen(Math.max(x + rand - 6, 60), hoehe, `${sorten.join(', ')}${wegText ? `. Durchgestrichen: ${wegText}` : ''}`, teile);
}

// Stellenwerttafel: je Spalte so viele Plättchen wie angegeben, in Reihen zu 5.
function stellenwerttafel({ spalten, plaettchen: anzahlen }) {
  const k = 22, innen = 8, kopf = 30, rand = 4;
  const sb = innen * 2 + 5 * k, reihen = Math.max(1, ...anzahlen.map((n) => Math.ceil(wertVon(n) / 5)));
  const breite = rand * 2 + spalten.length * sb, hoehe = rand * 2 + kopf + innen * 2 + reihen * k;
  const teile = [];
  spalten.forEach((name, i) => {
    const x0 = rand + i * sb;
    teile.push(s('rect', { x: x0, y: rand, width: sb, height: kopf, fill: '#f1e7cf', stroke: LINIE, 'stroke-width': 1.5 }),
      s('rect', { x: x0, y: rand + kopf, width: sb, height: hoehe - rand * 2 - kopf, fill: '#fff', stroke: LINIE, 'stroke-width': 1.5 }),
      s('text', { x: x0 + sb / 2, y: rand + kopf - 9, 'text-anchor': 'middle', class: 'bildkopf' }, name));
    if (istFrage(anzahlen[i])) teile.push(s('text', { x: x0 + sb / 2, y: rand + kopf + innen + k, 'text-anchor': 'middle', class: 'bildfrage' }, '?'));
    else for (let j = 0; j < anzahlen[i]; j++) teile.push(plaettchen(x0 + innen + (j % 5) * k + k / 2, rand + kopf + innen + Math.floor(j / 5) * k + k / 2, k / 2 - 3));
  });
  const titel = `Stellenwerttafel: ${spalten.map((n, i) => `${n} ${istFrage(anzahlen[i]) ? 'gesucht' : mehrzahl(anzahlen[i], 'Plättchen', 'Plättchen')}`).join(', ')}`;
  return rahmen(breite, hoehe, titel, teile);
}

// Breiten für nebeneinanderliegende Teile: im Verhältnis der Werte, aber jedes Teil mindestens so breit, dass seine Zahl hineinpasst.
export function teilBreiten(werte, gesamt, mindest) {
  const summe = werte.reduce((a, b) => a + b, 0) || 1;
  let breiten = werte.map((w) => (w / summe) * gesamt);
  const klein = breiten.map((b) => b < mindest);
  if (klein.some(Boolean)) {
    const fest = klein.filter(Boolean).length * mindest;
    const rest = breiten.reduce((a, b, i) => a + (klein[i] ? 0 : b), 0) || 1;
    breiten = breiten.map((b, i) => (klein[i] ? mindest : (b / rest) * (gesamt - fest)));
  }
  return breiten;
}

// Streifen: oben das Ganze, darunter die Teile. Die gesuchte Zahl ist ein „?“.
function streifen({ ganz, teile: stuecke }) {
  const B = 520, rand = 6, hoch = 44;
  const breiten = teilBreiten(stuecke.map(wertVon), B, 64);
  const feld = (x, y, b, inhalt, klasse) => [
    s('rect', { x, y, width: b, height: hoch, fill: istFrage(inhalt) ? '#fff6d6' : klasse === 'ganz' ? '#f1e7cf' : '#dfe7f3', stroke: LINIE, 'stroke-width': 2, class: `streifen-${klasse}${istFrage(inhalt) ? ' gesucht' : ''}` }),
    s('text', { x: x + b / 2, y: y + hoch / 2 + 7, 'text-anchor': 'middle', class: istFrage(inhalt) ? 'bildfrage' : 'bildzahl' }, lies(inhalt))];
  const el = [feld(rand, rand, B, ganz, 'ganz')];
  let x = rand;
  stuecke.forEach((t, i) => { el.push(feld(x, rand + hoch, breiten[i], t, 'teil')); x += breiten[i]; });
  const titel = `Streifen: Das Ganze ist ${istFrage(ganz) ? 'gesucht' : ganz}. Die Teile sind ${stuecke.map((t) => (istFrage(t) ? 'gesucht' : t)).join(', ')}.`;
  return rahmen(B + rand * 2, hoch * 2 + rand * 2, titel, el);
}

// Vergleich: zwei Streifen untereinander, links bündig. Am längeren Streifen ist der Unterschied gestrichelt abgesetzt.
// Die Zahl jedes Streifens steht rechts daneben, weil sie für den ganzen Streifen gilt.
function vergleich({ oben, unten, unterschied }) {
  const B = 360, rand = 6, hoch = 40, namen = 120, luecke = 14, zahl = 78;
  const wo = wertVon(oben.wert), wu = wertVon(unten.wert), gross = Math.max(wo, wu), klein = Math.min(wo, wu);
  const [bKlein, bDiff] = teilBreiten([klein, gross - klein], B, 70);
  const zeile = (p, y) => {
    const lang = wertVon(p.wert) === gross && gross !== klein;
    const b = lang ? bKlein + bDiff : bKlein;
    return [s('text', { x: rand, y: y + hoch / 2 + 6, class: 'bildname' }, p.name),
      s('rect', { x: namen, y, width: bKlein, height: hoch, fill: '#dfe7f3', stroke: 'none' }),
      lang && s('rect', { x: namen + bKlein, y, width: bDiff, height: hoch, fill: istFrage(unterschied) ? '#fff6d6' : '#f1e7cf', stroke: 'none', class: 'unterschied' }),
      s('rect', { x: namen, y, width: b, height: hoch, fill: 'none', stroke: LINIE, 'stroke-width': 2 }),
      lang && s('line', { x1: namen + bKlein, x2: namen + bKlein, y1: y, y2: y + hoch, stroke: LINIE, 'stroke-width': 2, 'stroke-dasharray': '5 4' }),
      lang && s('text', { x: namen + bKlein + bDiff / 2, y: y + hoch / 2 + 7, 'text-anchor': 'middle', class: istFrage(unterschied) ? 'bildfrage' : 'bildzahl klein' }, lies(unterschied)),
      s('text', { x: namen + b + 12, y: y + hoch / 2 + 7, class: istFrage(p.wert) ? 'bildfrage' : 'bildzahl' }, lies(p.wert))];
  };
  const titel = `Vergleich: ${oben.name} ${istFrage(oben.wert) ? 'gesucht' : oben.wert}, ${unten.name} ${istFrage(unten.wert) ? 'gesucht' : unten.wert}, Unterschied ${istFrage(unterschied) ? 'gesucht' : unterschied}`;
  return rahmen(namen + B + zahl, rand * 2 + hoch * 2 + luecke, titel, zeile(oben, rand), zeile(unten, rand + hoch + luecke));
}

// Quadratbild: ein Quadrat aus seite · seite Kästchen. Mit mehreren Schichten liegen gleiche Quadrate nebeneinander
// (3 Schichten mit je 3 · 3 Würfeln sind 3 · 3 · 3 = 27 Würfel). So wird eine Potenz abzählbar.
function quadratbild({ seite, schichten = 1 }) {
  const k = Math.max(12, Math.min(26, Math.floor(150 / seite))), rand = 8, abstand = 18;
  const q = seite * k, breite = rand * 2 + schichten * q + (schichten - 1) * abstand, hoehe = rand * 2 + q;
  const teile = [];
  for (let n = 0; n < schichten; n++) {
    const x0 = rand + n * (q + abstand);
    for (let r = 0; r < seite; r++) for (let c = 0; c < seite; c++) teile.push(s('rect', { class: 'kaestchen', x: x0 + c * k, y: rand + r * k, width: k, height: k, fill: '#dfe7f3', stroke: DUNKEL, 'stroke-width': 1.5 }));
    teile.push(s('rect', { x: x0, y: rand, width: q, height: q, fill: 'none', stroke: DUNKEL, 'stroke-width': 3 }));
  }
  const titel = schichten === 1 ? `Quadrat aus ${seite} Reihen mit je ${seite} Kästchen` : `${schichten} Schichten, jede ein Quadrat aus ${seite} Reihen mit je ${seite} Würfeln`;
  return rahmen(breite, hoehe, titel, teile);
}

// Päckchenbild: einzelne Plättchen links, daneben volle Päckchen mit je gleich vielen Plättchen (3 + 2 · 4).
function paeckchenbild({ einzeln = 0, paeckchen, je }) {
  const k = 22, innen = 8, abstand = 14, rand = 6;
  const proReihe = Math.min(5, je), reihenInnen = Math.ceil(je / 5);
  const kb = innen * 2 + proReihe * k, kh = innen * 2 + reihenInnen * k;
  const lose = einzeln ? Math.min(einzeln, 5) * k + abstand + 12 : 0, loseReihen = Math.ceil(einzeln / 5);
  const proZeile = Math.min(paeckchen, 4), zeilen = Math.ceil(paeckchen / 4);
  const breite = rand * 2 + lose + proZeile * kb + (proZeile - 1) * abstand;
  const hoehe = rand * 2 + Math.max(zeilen * kh + (zeilen - 1) * abstand, loseReihen * k);
  const teile = [];
  for (let i = 0; i < einzeln; i++) teile.push(plaettchen(rand + (i % 5) * k + k / 2, rand + Math.floor(i / 5) * k + k / 2, k / 2 - 3, 'voll'));
  if (einzeln) teile.push(s('line', { x1: rand + lose - abstand / 2 - 6, x2: rand + lose - abstand / 2 - 6, y1: rand, y2: hoehe - rand, stroke: LINIE, 'stroke-width': 1.5, 'stroke-dasharray': '4 4' }));
  for (let g = 0; g < paeckchen; g++) {
    const x0 = rand + lose + (g % 4) * (kb + abstand), y0 = rand + Math.floor(g / 4) * (kh + abstand);
    teile.push(s('rect', { class: 'paeckchen', x: x0, y: y0, width: kb, height: kh, rx: 4, fill: '#f4dcc3', stroke: '#8a5a3b', 'stroke-width': 2.5 }));
    for (let i = 0; i < je; i++) teile.push(plaettchen(x0 + innen + (i % 5) * k + k / 2, y0 + innen + Math.floor(i / 5) * k + k / 2, k / 2 - 3, 'hell'));
  }
  const titel = `${einzeln ? `${mehrzahl(einzeln, 'einzelnes Plättchen', 'einzelne Plättchen')} und ` : ''}${mehrzahl(paeckchen, 'Päckchen', 'Päckchen')} mit je ${je} Plättchen`;
  return rahmen(breite, hoehe, titel, teile);
}

const ARTEN = { quadratbild, paeckchen: paeckchenbild, zehnerfeld, mengenbild, gruppenbild, punktefeld, zehnermaterial, stellenwerttafel, streifen, vergleich, zahlenstrahl: (b) => zahlenstrahl(b, { startwort: Boolean(b.spruenge?.length) }), ...DATENBILDER, ...ZAHLENBILDER, ...GEOBILDER, ...GROESSENBILDER, ...WINKELBILDER, ...FLAECHENBILDER, ...BRUCHBILDER, ...RATIONALBILDER, ...FIGURBILDER, ...KOERPERBILDER, ...DEZIMALBILDER, ...ZUORDNUNGSBILDER };
export const BILDARTEN = Object.keys(ARTEN);
export function aufgabenBild(bild) {
  return ARTEN[bild?.art]?.(bild) ?? null;
}
