// Kapitel 7 „Kreis und Winkel“ (ADR 0034): Der Prüfer rechnet Winkel, Kreise, Dreiecke und das Gradnetz nach.
// Wie der übrige Prüfer benutzt diese Datei nichts aus den Erzeugern und nichts aus dem Dashboard.
// Ein Winkel im Bild: Scheitel s (Pixel, y nach oben), erster Schenkel in Richtung `von` (Grad gegen den Uhrzeigersinn, 0° nach rechts),
// der zweite Schenkel liegt `groesse` Grad weiter gegen den Uhrzeigersinn.

const GEO_R = 230; // halbe lange Seite des Geodreiecks im Bild (wie im Dashboard: 8 cm)
const norm360 = (w) => ((w % 360) + 360) % 360;
const rad = (g) => (g * Math.PI) / 180;
const richtung = (g) => [Math.cos(rad(g)), Math.sin(rad(g))];
const plus = (p, v, k = 1) => [p[0] + k * v[0], p[1] + k * v[1]];
const ganz = (x, von, bis) => Number.isInteger(x) && x >= von && x <= bis;
const zahlenIn = (s) => [...String(s).matchAll(/\d+/g)].map((m) => Number(m[0]));
export const WINKELBILDER = ['winkel', 'kreislineal', 'gradnetz'];

// ---------- Winkelarten ----------
export function art(grad) {
  if (grad > 0 && grad < 90) return 'spitz';
  if (grad === 90) return 'recht';
  if (grad > 90 && grad < 180) return 'stumpf';
  if (grad === 180) return 'gestreckt';
  if (grad > 180 && grad < 360) return 'überstumpf';
  if (grad === 360) return 'voll';
  return null;
}
// Welche Winkelart nennt eine Antwort? Nur eine darf genannt sein.
function artIn(text) {
  const t = String(text);
  const gefunden = [[/überstumpf/i, 'überstumpf'], [/(?<!über)stumpf(?!winklig)/i, 'stumpf'], [/spitz(?!winklig)/i, 'spitz'], [/recht(?!winklig)(?:er|en|e)? Winkel|^recht$/i, 'recht'], [/gestreckt/i, 'gestreckt'], [/Vollwinkel/i, 'voll']].filter(([m]) => m.test(t)).map(([, a]) => a);
  return gefunden.length === 1 ? gefunden[0] : gefunden.length ? 'mehrere' : null;
}

// ---------- Bilder ----------
const winkelVon = (a, i) => (a.bild?.art === 'winkel' ? (typeof i === 'number' ? a.bild.winkel[i] : a.bild.winkel.find((w) => w.n === i)) : null);
// Wo trifft ein Strahl vom Nullpunkt unter dem Winkel θ (zur Grundrichtung) die kurzen Seiten des Geodreiecks?
const kante = (t) => GEO_R / (Math.abs(Math.cos(rad(t))) + Math.sin(rad(t)));
const geoEcken = (geo) => { const n0 = plus(geo.s, geo.versatz ?? [0, 0]); return [plus(n0, richtung(geo.grund), GEO_R), plus(n0, richtung(geo.grund + 90), GEO_R), plus(n0, richtung(geo.grund), -GEO_R)]; };
const drin = (b, p, rand = 6) => p[0] >= rand && p[1] >= rand && p[0] <= b.b - rand && p[1] <= b.h - rand;

export function winkelBildMaengel(b, a) {
  const m = [];
  if (b.art === 'winkel') {
    if (!ganz(b.b, 200, 720) || !ganz(b.h, 120, 560)) return ['Bildgröße passt nicht'];
    if (!Array.isArray(b.winkel) || b.winkel.length < 1 || b.winkel.length > 4) return ['ein bis vier Winkel'];
    const namen = b.winkel.map((w) => w.n).filter(Boolean);
    if (new Set(namen).size !== namen.length) m.push('Winkelname doppelt');
    for (const w of b.winkel) {
      if (!ganz(w.groesse, 1, 360) || !Number.isFinite(w.von)) { m.push('Winkel ohne Größe oder Richtung'); continue; }
      if (!(w.l1 >= 40) || !(w.l2 >= 40)) m.push('Schenkel kürzer als 40 Pixel');
      const ende1 = plus(w.s, richtung(w.von), w.l1 + (w.punkte?.a ? 24 : 0)), ende2 = plus(w.s, richtung(w.von + w.groesse), w.l2 + (w.punkte?.b ? 24 : 0));
      if (!drin(b, w.s, 14) || !drin(b, ende1) || !drin(b, ende2)) m.push(`Winkel ${w.n ?? ''} ragt aus dem Bild`);
      if (w.n && !/^[αβγδεφ]$/.test(w.n)) m.push(`Winkelname ${w.n} ist kein griechischer Buchstabe`);
    }
    if (b.geo) {
      if (!geoEcken(b.geo).every((p) => drin(b, p, 2))) m.push('Geodreieck ragt aus dem Bild');
      // Ohne Versatz liegt der Nullpunkt auf einem Scheitel. Jeder Schenkel dieses Winkels, der unter dem Geodreieck liegt, reicht über die Skala hinaus.
      if (!b.geo.versatz) {
        const w = b.winkel.find((x) => x.s[0] === b.geo.s[0] && x.s[1] === b.geo.s[1]);
        if (!w) m.push('Nullpunkt liegt auf keinem Scheitel');
        else for (const [r, l] of [[w.von, w.l1], [w.von + w.groesse, w.l2]]) {
          const t = norm360(r - b.geo.grund);
          if (t <= 180 && l < kante(t) + 18) m.push('ein Schenkel endet unter dem Geodreieck und lässt sich nicht ablesen');
        }
      }
    }
  } else if (b.art === 'kreislineal') {
    if (!ganz(b.lang, 50, 120) || b.lang % 10 !== 0 || !ganz(b.von, 0, b.lang) || !ganz(b.bis, 1, b.lang) || b.von >= b.bis) m.push('Kreis passt nicht auf das Lineal');
    if ((b.bis - b.von) % 2 !== 0) m.push('Durchmesser ungerade: Der Radius wäre keine ganze Zahl von Millimetern');
    if (b.bis - b.von < 16 || b.bis - b.von > 70) m.push('Kreis zu klein oder zu groß');
  } else if (b.art === 'gradnetz') {
    const [s, n] = b.breite ?? [], [w, o] = b.laenge ?? [];
    if (![5, 10, 20, 30].includes(b.schritt) || [s, n, w, o].some((x) => !Number.isInteger(x) || x % b.schritt !== 0) || !(s < n && w < o) || s < -90 || n > 90 || w < -180 || o > 180) return ['Gradnetz passt nicht'];
    if (!Array.isArray(b.orte) || b.orte.length < 1 || b.orte.length > 8) return ['ein bis acht Orte'];
    if (new Set(b.orte.map((x) => x.n)).size !== b.orte.length) m.push('Ort doppelt');
    for (const x of b.orte) if (!ganz(x.b, s, n) || !ganz(x.l, w, o)) m.push(`${x.n} liegt nicht im Gradnetz`);
    for (const x of b.orte) for (const y of b.orte) if (x !== y && x.b === y.b && x.l === y.l) m.push(`${x.n} und ${y.n} liegen an derselben Stelle`);
  }
  return m;
}
// Zahlen, die ein Bild sichtbar zeigt.
export function winkelBildZahlen(b) {
  if (b.art === 'winkel') return [...(b.geo ? Array.from({ length: 19 }, (_, i) => i * 10) : []), ...(b.texte ?? []).flatMap((t) => zahlenIn(t.t))];
  if (b.art === 'kreislineal') return Array.from({ length: b.lang / 10 + 1 }, (_, i) => i);
  if (b.art === 'gradnetz') { const z = []; for (let x = b.breite[0]; x <= b.breite[1]; x += b.schritt) z.push(Math.abs(x)); for (let x = b.laenge[0]; x <= b.laenge[1]; x += b.schritt) z.push(Math.abs(x)); return z; }
  return [];
}

// ---------- Dreiecke ----------
const d2 = (p, q) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
function dreieckVon(ecken) {
  const [A, B, C] = ecken, s = [d2(B, C), d2(A, C), d2(A, B)].sort((x, y) => x - y);
  const gleich = (s[0] === s[1]) + (s[1] === s[2]);
  const seiten = gleich === 2 ? 'gleichseitig' : gleich === 1 ? 'gleichschenklig' : 'unregelmäßig';
  // Größte Seite gegenüber dem größten Winkel: rechtwinklig, wenn a² + b² = c², stumpfwinklig, wenn größer.
  const winkel = s[0] + s[1] === s[2] ? 'rechtwinklig' : s[0] + s[1] < s[2] ? 'stumpfwinklig' : 'spitzwinklig';
  return { seiten, winkel };
}
// Welche Namen passen? Ein gleichseitiges Dreieck ist auch gleichschenklig (wie im Haus der Vierecke, ADR 0032).
const passt = (d, name) => name === d.winkel || name === d.seiten || (name === 'gleichschenklig' && d.seiten === 'gleichseitig');
const DREIECKSNAMEN = ['gleichseitig', 'gleichschenklig', 'unregelmäßig', 'rechtwinklig', 'spitzwinklig', 'stumpfwinklig'];
const namenIn = (t) => DREIECKSNAMEN.filter((n) => new RegExp(n, 'i').test(t));

// ---------- Dreieck aus Seiten und Winkeln (Heftaufgaben) ----------
// gegeben in mm und Grad, Ecken A, B, C mit den Seiten a, b, c gegenüber und den Winkeln alpha, beta, gamma.
function dreieckRechnen(g) {
  let { a, b, c, alpha, beta, gamma } = g;
  const cosSatz = (x, y, w) => Math.sqrt(x * x + y * y - 2 * x * y * Math.cos(rad(w)));
  const winkelAus = (x, y, z) => (Math.acos((y * y + z * z - x * x) / (2 * y * z)) * 180) / Math.PI;
  if (a != null && b != null && c != null) { alpha = winkelAus(a, b, c); beta = winkelAus(b, a, c); gamma = 180 - alpha - beta; }
  else if (b != null && c != null && alpha != null) { a = cosSatz(b, c, alpha); beta = winkelAus(b, a, c); gamma = 180 - alpha - beta; }
  else if (a != null && c != null && beta != null) { b = cosSatz(a, c, beta); alpha = winkelAus(a, b, c); gamma = 180 - alpha - beta; }
  else if (a != null && b != null && gamma != null) { c = cosSatz(a, b, gamma); alpha = winkelAus(a, b, c); beta = 180 - alpha - gamma; }
  else if (c != null && alpha != null && beta != null) { gamma = 180 - alpha - beta; a = (c * Math.sin(rad(alpha))) / Math.sin(rad(gamma)); b = (c * Math.sin(rad(beta))) / Math.sin(rad(gamma)); }
  else return null;
  if (![alpha, beta, gamma].every((x) => x > 0)) return null;
  return { a, b, c, alpha, beta, gamma };
}

// ---------- Gradnetz ----------
const GRAD = /(\d+)° ?([NSOW])/g;
const koordIn = (t) => { const z = [...String(t).matchAll(GRAD)].map((m) => (m[2] === 'S' || m[2] === 'W' ? -1 : 1) * Number(m[1]) * (m[2] === 'N' || m[2] === 'S' ? 1 : 1)); const arten = [...String(t).matchAll(GRAD)].map((m) => m[2]); return { z, arten }; };
const ortVon = (a, n) => (a.bild?.art === 'gradnetz' ? a.bild.orte.find((o) => o.n === n) : null);

// ---------- Nachweis ----------
function einstufen(a, trifft) {
  let richtige = 0;
  for (const o of a.optionen ?? []) {
    const w = trifft(o.text);
    if (w === undefined) return `Antwort „${o.text}“ lässt sich nicht prüfen`;
    if (w !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    if (w) richtige++;
  }
  return richtige >= 1 ? null : 'keine Antwort trifft zu';
}
const griechIn = (t) => [...String(t).matchAll(/[αβγδεφ]/g)].map((m) => m[0]);

export const WINKEL_SONDER = {
  // Die Größe eines Winkels im Bild. Mit `art`: Die Antworten nennen Winkelarten.
  groesse: (n, a) => {
    const w = winkelVon(a, n.winkel);
    const wert = w ? w.groesse : n.wert;
    if (!w && n.winkel != null) return `Winkel ${n.winkel} steht nicht im Bild`;
    if (n.wert != null && wert !== n.wert) return `der Winkel hat ${wert}°, nicht ${n.wert}°`;
    if (a.format === 'auswahl' && a.optionen.every((o) => artIn(o.text) && artIn(o.text) !== 'mehrere')) return einstufen(a, (t) => artIn(t) === art(wert));
    return null;
  },
  // Ablesen am Geodreieck: Beide Schenkel liegen unter dem Geodreieck; abgelesen wird der Unterschied auf der Skala.
  geoAblesen: (n, a) => {
    const w = winkelVon(a, n.winkel), geo = a.bild?.geo;
    if (!w || !geo) return 'Winkel oder Geodreieck fehlt im Bild';
    if (geo.versatz) return 'das Geodreieck ist verschoben';
    if (geo.s[0] !== w.s[0] || geo.s[1] !== w.s[1]) return 'der Nullpunkt liegt nicht auf dem Scheitel';
    const t1 = norm360(w.von - geo.grund), t2 = norm360(w.von + w.groesse - geo.grund);
    if (t1 > 180 || t2 > 180) return 'ein Schenkel liegt nicht unter dem Geodreieck';
    if (t1 % 180 !== 0 && t2 % 180 !== 0) return 'kein Schenkel liegt auf der langen Seite';
    const wert = Math.abs(t2 - t1);
    if (wert !== n.wert) return `am Geodreieck stehen ${wert}°, nicht ${n.wert}°`;
    if (w.groesse !== wert && w.groesse !== 360 - wert) return 'die Ablesung passt nicht zum Winkel';
    return null;
  },
  // Welche Winkel im Bild erfüllen das Merkmal? Die Antworten nennen Winkel mit ihren Buchstaben.
  winkelwahl: (n, a) => {
    const alle = a.bild?.art === 'winkel' ? a.bild.winkel.filter((w) => w.n) : [];
    if (alle.length < 2) return 'zu wenige benannte Winkel';
    const max = Math.max(...alle.map((w) => w.groesse)), min = Math.min(...alle.map((w) => w.groesse));
    const ref = n.ref ? alle.find((w) => w.n === n.ref) : null, rang = [...alle].sort((x, y) => y.groesse - x.groesse);
    if (n.ref && !ref) return `Winkel ${n.ref} fehlt`;
    if (n.was === 'rang' && new Set(alle.map((w) => w.groesse)).size !== alle.length) return 'zwei Winkel sind gleich groß';
    const trifft = (w) => (['groesster', 'vergleich'].includes(n.was) ? w.groesse === max : n.was === 'kleinster' ? w.groesse === min : n.was === 'gleich' ? alle.filter((x) => x.groesse === w.groesse).length > 1
      : n.was === 'groesserAls' ? w.groesse > ref.groesse : n.was === 'kleinerAls' ? w.groesse < ref.groesse : n.was === 'rang' ? rang[n.rang - 1] === w : art(w.groesse) === n.was);
    if (['groesster', 'kleinster'].includes(n.was) && alle.filter(trifft).length !== 1) return 'der Winkel ist nicht eindeutig';
    // Vergleich zweier Winkel: Sind beide gleich groß, ist nur „Beide sind gleich groß“ richtig.
    if (n.was === 'vergleich') return einstufen(a, (t) => (/^Beide|^Gleich/.test(t) ? alle.every((w) => w.groesse === alle[0].groesse) : griechIn(t).length === 1 && alle.find((w) => w.n === griechIn(t)[0]) ? alle.filter(trifft).length === 1 && trifft(alle.find((w) => w.n === griechIn(t)[0])) : undefined));
    return einstufen(a, (t) => { const g = griechIn(t); if (/^(Alle|Keine|Beide|Gleich)/.test(t)) { if (/^Gleich|^Beide/.test(t)) return alle.every((w) => w.groesse === alle[0].groesse); return undefined; } if (!g.length) return undefined; const ws = g.map((x) => alle.find((w) => w.n === x)); if (ws.some((x) => !x)) return undefined; return a.mehrfach ? trifft(ws[0]) : ws.every(trifft) && alle.filter(trifft).length === ws.length; });
  },
  // Scheitel, Schenkel oder Name eines Winkels.
  benennen: (n, a) => {
    const w = winkelVon(a, n.winkel);
    if (!w?.punkte) return 'Winkel ohne Punktnamen';
    const { s: S, a: A, b: B } = w.punkte;
    const soll = { scheitel: [S], schenkel: [`${S}${A} und ${S}${B}`, `${S}${B} und ${S}${A}`], name: [`∢${A}${S}${B}`] }[n.was];
    if (!soll) return `unbekannt: ${n.was}`;
    return einstufen(a, (t) => soll.includes(t.replace(/^Der Scheitel ist |^Die Schenkel sind |^Der Winkel heißt /, '').replace(/\.$/, '')));
  },
  // Schätzen auf F: Richtig ist die Antwort, die dem Winkel am nächsten liegt. Die anderen liegen mindestens 40° daneben.
  schaetzwahl: (n, a) => {
    const w = winkelVon(a, n.winkel);
    if (!w) return 'Winkel fehlt im Bild';
    const werte = a.optionen.map((o) => zahlenIn(o.text)[0]);
    if (werte.some((x) => x == null)) return 'Antwort ohne Gradzahl';
    return einstufen(a, (t) => { const x = zahlenIn(t)[0]; return Math.abs(x - w.groesse) <= 15 && werte.every((y) => y === x || Math.abs(y - w.groesse) >= 40); });
  },
  // Das Geodreieck ist falsch angelegt oder falsch abgelesen. Die richtige Antwort nennt genau diesen Fehler.
  falschAngelegt: (n, a) => {
    const geo = a.bild?.geo, w = a.bild?.winkel?.[0];
    if (!geo || !w) return 'Geodreieck fehlt';
    const fehler = geo.versatz ? 'nullpunkt' : ![w.von, w.von + w.groesse].some((r) => norm360(r - geo.grund) % 180 === 0) ? 'grundlinie' : 'skala';
    if (fehler !== n.fehler) return `im Bild ist der Fehler ${fehler}, nicht ${n.fehler}`;
    const WORT = { nullpunkt: /Nullpunkt/, grundlinie: /lange Seite/, skala: /Skala/ };
    return einstufen(a, (t) => (/^(Nichts|Er hat alles richtig|Sie hat alles richtig)/.test(t) ? false : Object.entries(WORT).filter(([, r]) => r.test(t)).map(([k]) => k).join() === fehler));
  },
  // Radius und Durchmesser: d = 2 · r, am Lineal abgelesen.
  kreislineal: (n, a) => {
    const b = a.bild;
    if (b?.art !== 'kreislineal') return 'kein Kreis am Lineal';
    const d = b.bis - b.von, soll = n.was === 'r' ? d / 2 : d;
    return soll === n.wert ? null : `am Lineal sind es ${soll} mm, nicht ${n.wert}`;
  },
  // Kreis am Gitter: Radius in Kästchen, dazu die Angabe im Text in cm oder mm (2 Kästchen sind 1 cm).
  kreisGitter: (n, a) => {
    if (a.format !== 'gitter' || a.eingabe !== 'kreis') return 'braucht Gitterzeichnen mit einem Kreis';
    const bed = a.bedingung, [m, p] = a.beispiel ?? [];
    if (!m || !p || m[0] !== bed.m[0] || m[1] !== bed.m[1] || d2(m, p) !== bed.r ** 2) return 'das Beispiel liegt nicht auf dem Kreis';
    if (bed.r !== n.r) return `der Radius ist ${bed.r} Kästchen, nicht ${n.r}`;
    if (n.cm != null && n.cm * 2 !== n.r) return `${n.cm} cm sind nicht ${n.r} Kästchen`;
    if (n.mm != null && n.mm !== n.r * 5) return `${n.mm} mm sind nicht ${n.r} Kästchen`;
    const g = a.gitter;
    if (bed.m[0] - bed.r < 0 || bed.m[1] - bed.r < 0 || bed.m[0] + bed.r > g.b || bed.m[1] + bed.r > g.h) return 'der Kreis ragt aus dem Gitter';
    if (!(g.punkte ?? []).some((q) => q.x === bed.m[0] && q.y === bed.m[1]) && !/\(\d+\|\d+\)/.test(a.text)) return 'der Mittelpunkt steht nicht im Bild';
    for (const f of a.typischeFehler ?? []) if ((f.bedingung.m ?? bed.m)[0] === bed.m[0] && (f.bedingung.m ?? bed.m)[1] === bed.m[1] && f.bedingung.r === bed.r) return 'typischer Fehler ist gleich der Lösung';
    return null;
  },
  // Heftaufgabe: Winkel mit zwei gleich langen Schenkeln, gemessen wird die Verbindung der Endpunkte.
  heftWinkel: (n) => { const soll = 2 * n.schenkel * Math.sin(rad(n.winkel / 2)); return Math.abs(soll - n.wert) <= 0.5 ? null : `die Strecke ist ${soll.toFixed(1)} mm lang, nicht ${n.wert}`; },
  // Heftaufgabe: Dreieck aus Seiten und Winkeln. Gesucht ist eine Seite (mm) oder ein Winkel (Grad).
  heftDreieck: (n) => {
    const d = dreieckRechnen(n.gegeben);
    if (!d) return 'das Dreieck lässt sich so nicht zeichnen';
    const soll = d[n.gesucht];
    return Math.abs(soll - n.wert) <= 0.5 ? null : `${n.gesucht} ist ${soll.toFixed(1)}, nicht ${n.wert}`;
  },
  // Zwei Kreise mit Radius r, deren Mittelpunkte d auseinander liegen, schneiden sich in zwei Punkten. Ihr Abstand ist 2 · √(r² − (d/2)²).
  kreisschnitt: (n) => { const h2 = n.r * n.r - (n.d / 2) ** 2; return h2 > 0 && 4 * h2 === n.wert * n.wert ? null : `die Schnittpunkte liegen nicht ${n.wert} mm auseinander`; },
  // Gradnetz: die Lage eines Ortes. Mit Antworten aus Koordinaten ist genau die richtige als richtig markiert.
  gradnetz: (n, a) => {
    const o = ortVon(a, n.ort);
    if (!o) return `${n.ort} steht nicht im Gradnetz`;
    if (n.b != null && o.b !== n.b) return `${n.ort} liegt bei ${o.b}° Breite`;
    if (n.l != null && o.l !== n.l) return `${n.ort} liegt bei ${o.l}° Länge`;
    if (a.format === 'auswahl' && a.optionen.every((x) => koordIn(x.text).z.length === 2)) {
      return einstufen(a, (t) => { const { z, arten } = koordIn(t); return /[NS]/.test(arten[0]) && /[OW]/.test(arten[1]) && z[0] === o.b && z[1] === o.l; });
    }
    return null;
  },
  // Gradnetz: Welcher Ort passt? Die Antworten sind Ortsnamen.
  ortwahl: (n, a) => {
    const orte = a.bild?.art === 'gradnetz' ? a.bild.orte : [];
    const wert = { nord: (o) => o.b, sued: (o) => -o.b, ost: (o) => o.l, west: (o) => -o.l };
    const trifft = n.was in wert ? (o) => wert[n.was](o) === Math.max(...orte.map(wert[n.was])) : n.was === 'suedhalb' ? (o) => o.b < 0 : n.was === 'nordhalb' ? (o) => o.b > 0 : n.was === 'westhalb' ? (o) => o.l < 0 : n.was === 'osthalb' ? (o) => o.l > 0 : (o) => o.b === n.b && o.l === n.l;
    if (!a.mehrfach && orte.filter(trifft).length !== 1) return 'der Ort ist nicht eindeutig';
    return einstufen(a, (t) => { const o = orte.find((x) => x.n === t); return o ? trifft(o) : undefined; });
  },
  // Gradunterschied zwischen zwei Orten in Breite oder Länge.
  gradunterschied: (n, a) => {
    const p = ortVon(a, n.von), q = ortVon(a, n.nach);
    if (!p || !q) return 'Ort fehlt im Gradnetz';
    const soll = Math.abs(p[n.achse] - q[n.achse]);
    return soll === n.wert ? null : `der Unterschied ist ${soll}°, nicht ${n.wert}°`;
  },
  // Dreieck im Gitter: nach Seiten und Winkeln eingeteilt. Antworten nennen Namen (eine oder alle passenden) oder Dreiecke.
  dreieckGitter: (n, a) => {
    const g = a.gitter ?? (a.bild?.art === 'gitter' ? a.bild : null), figuren = (g?.figuren ?? []).filter((f) => f.ecken.length === 3);
    if (!figuren.length) return 'kein Dreieck im Bild';
    if (n.figur != null) {
      const f = figuren.find((x) => x.n === n.figur) ?? (figuren.length === 1 && n.figur === '' ? figuren[0] : null);
      if (!f) return `Dreieck ${n.figur} fehlt`;
      const d = dreieckVon(f.ecken);
      if (n.seiten && d.seiten !== n.seiten) return `das Dreieck ist ${d.seiten}, nicht ${n.seiten}`;
      if (n.winkel && d.winkel !== n.winkel) return `das Dreieck ist ${d.winkel}, nicht ${n.winkel}`;
      if (a.format === 'auswahl') {
        const genau = !a.mehrfach;
        return einstufen(a, (t) => {
          const namen = namenIn(t); if (!namen.length) return undefined;
          if (genau) return namen.length === 1 && (namen[0] === d.seiten || namen[0] === d.winkel) && (n.frage !== 'seiten' || namen[0] === d.seiten) && (n.frage !== 'winkel' || namen[0] === d.winkel);
          return namen.every((x) => passt(d, x));
        });
      }
      return null;
    }
    // Welche Dreiecke haben die Eigenschaft? Antworten wie „Dreieck 2“.
    return einstufen(a, (t) => { const f = figuren.find((x) => t === `Dreieck ${x.n}`); return f ? passt(dreieckVon(f.ecken), n.was) : undefined; });
  },
  // Zeigerwinkel einer Uhr: Der Stundenzeiger wandert in einer Stunde 30°, der Minutenzeiger in einer Minute 6°.
  uhrwinkel: (n, a) => {
    const u = a.bild?.art === 'uhr' ? a.bild.uhren?.[0] : null;
    if (!u || u.h !== n.h || u.min !== n.min) return 'die Uhr zeigt eine andere Zeit';
    const x = Math.abs(((u.h % 12) * 30 + u.min / 2) - u.min * 6), soll = Math.min(x, 360 - x);
    if (soll !== n.wert) return `zwischen den Zeigern sind ${soll}°, nicht ${n.wert}°`;
    if (a.format === 'auswahl' && a.optionen.every((o) => artIn(o.text) && artIn(o.text) !== 'mehrere')) return einstufen(a, (t) => artIn(t) === art(soll));
    return null;
  },
  // Kreis im Gitterbild: Radius oder Durchmesser in Kästchen, cm oder mm, der Mittelpunkt, Punkte auf, in oder außerhalb des Kreises.
  kreisBild: (n, a) => {
    const g = a.bild?.art === 'gitter' ? a.bild : null, k = g?.kreise?.[n.kreis ?? 0];
    if (!k) return 'kein Kreis im Gitter';
    const lage = (p) => { const q = d2([p.x, p.y], k.m); return q === k.r * k.r ? 'aufKreis' : q < k.r * k.r ? 'innen' : 'aussen'; };
    if (['mittelpunkt', 'aufKreis', 'innen', 'aussen'].includes(n.was)) return einstufen(a, (t) => { const p = (g.punkte ?? []).find((x) => x.n === t); return p ? (n.was === 'mittelpunkt' ? p.x === k.m[0] && p.y === k.m[1] : lage(p) === n.was && !(p.x === k.m[0] && p.y === k.m[1])) : undefined; });
    const kae = n.was === 'd' ? 2 * k.r : k.r;
    if (n.einheit === 'cm' && kae % 2) return 'keine ganzen Zentimeter';
    const soll = n.einheit === 'cm' ? kae / 2 : n.einheit === 'mm' ? kae * 5 : kae;
    return soll === n.wert ? null : `im Gitter sind es ${soll}, nicht ${n.wert}`;
  },
  // Welcher Winkel hat diesen Scheitel? Die Antworten sind griechische Buchstaben.
  scheitelVon: (n, a) => {
    const alle = a.bild?.art === 'winkel' ? a.bild.winkel : [];
    const treffer = alle.filter((w) => w.punkte?.s === n.scheitel);
    if (treffer.length !== 1) return `kein eindeutiger Winkel mit dem Scheitel ${n.scheitel}`;
    return einstufen(a, (t) => (alle.some((w) => w.n === t) ? treffer[0].n === t : /^[αβγδ]$/.test(t) ? false : undefined));
  },
  // Welcher Winkel liegt zwischen den Schenkeln zu den Punkten a und b (gegen den Uhrzeigersinn von a nach b)?
  winkelPunkte: (n, a) => {
    const alle = a.bild?.art === 'winkel' ? a.bild.winkel : [];
    const lage = punktLagen(alle), S = lage.get(n.s), A = lage.get(n.a), Bp = lage.get(n.b);
    if (!S || !A || !Bp) return 'Punkt fehlt im Bild';
    const ri = (p) => norm360(Math.round((Math.atan2(p[1] - S[1], p[0] - S[0]) * 180) / Math.PI));
    const passtW = (w) => w.s[0] === S[0] && w.s[1] === S[1] && norm360(w.von) === ri(A) && norm360(w.von + w.groesse) === ri(Bp);
    if (alle.filter(passtW).length !== 1) return 'kein eindeutiger Winkel zwischen diesen Schenkeln';
    if (a.format !== 'auswahl') return null;
    return einstufen(a, (t) => { const w = alle.find((x) => x.n === t); return w ? passtW(w) : undefined; });
  },
  // Aus welchen Winkeln im Bild setzt sich ∢ASB zusammen? (Mehrfachauswahl)
  teilwinkel: (n, a) => {
    const alle = a.bild?.art === 'winkel' ? a.bild.winkel : [];
    const lage = punktLagen(alle), S = lage.get(n.s), A = lage.get(n.a), Bp = lage.get(n.b);
    if (!S || !A || !Bp) return 'Punkt fehlt im Bild';
    const ri = (p) => norm360(Math.round((Math.atan2(p[1] - S[1], p[0] - S[0]) * 180) / Math.PI)), von = ri(A), weite = norm360(ri(Bp) - von);
    const drinnen = (w) => w.s[0] === S[0] && w.s[1] === S[1] && norm360(w.von - von) + w.groesse <= weite;
    const summe = alle.filter(drinnen).reduce((x, w) => x + w.groesse, 0);
    if (summe !== weite) return 'die Teilwinkel füllen den Winkel nicht aus';
    return einstufen(a, (t) => { const w = alle.find((x) => x.n === t); return w ? drinnen(w) : undefined; });
  },
  // Welche Winkelgrößen gehören zu einer Winkelart? Die Antworten sind Gradzahlen.
  artwahl: (n, a) => einstufen(a, (t) => { const z = zahlenIn(t); return z.length === 1 ? art(z[0]) === n.was : undefined; }),
  // Welcher Winkel ist ungefähr so groß? Genau einer liegt höchstens 10° daneben, die anderen mindestens 30°.
  ungefaehr: (n, a) => {
    const alle = a.bild?.art === 'winkel' ? a.bild.winkel.filter((w) => w.n) : [];
    const nah = alle.filter((w) => Math.abs(w.groesse - n.wert) <= 10), fern = alle.filter((w) => Math.abs(w.groesse - n.wert) >= 30);
    if (nah.length !== 1 || nah.length + fern.length !== alle.length) return 'die Winkel liegen zu nah beieinander';
    return einstufen(a, (t) => { const w = alle.find((x) => x.n === t); return w ? w === nah[0] : undefined; });
  },
  // Dreieck aus Seitenlängen oder Winkeln im Text. Gleiche Winkel gehören zu gleichen Seiten.
  dreieckDaten: (n, a) => {
    let d;
    if (n.winkel) {
      if (n.winkel.length !== 3 || n.winkel.reduce((x, y) => x + y, 0) !== 180 || n.winkel.some((x) => !(x > 0))) return 'die Winkel ergeben nicht 180°';
      const s = [...n.winkel].sort((x, y) => x - y), gleich = (s[0] === s[1]) + (s[1] === s[2]);
      d = { seiten: gleich === 2 ? 'gleichseitig' : gleich === 1 ? 'gleichschenklig' : 'unregelmäßig', winkel: s[2] === 90 ? 'rechtwinklig' : s[2] > 90 ? 'stumpfwinklig' : 'spitzwinklig' };
    } else if (n.seiten) {
      const s = [...n.seiten].sort((x, y) => x - y);
      if (s.length !== 3 || !(s[0] + s[1] > s[2])) return 'aus diesen Seiten entsteht kein Dreieck';
      const gleich = (s[0] === s[1]) + (s[1] === s[2]);
      d = { seiten: gleich === 2 ? 'gleichseitig' : gleich === 1 ? 'gleichschenklig' : 'unregelmäßig', winkel: s[0] ** 2 + s[1] ** 2 === s[2] ** 2 ? 'rechtwinklig' : s[0] ** 2 + s[1] ** 2 < s[2] ** 2 ? 'stumpfwinklig' : 'spitzwinklig' };
    } else return 'Seiten oder Winkel fehlen';
    if (a.format !== 'auswahl') return null;
    return einstufen(a, (t) => { const namen = namenIn(t); if (!namen.length) return undefined; if (a.mehrfach) return namen.every((x) => passt(d, x));
      return namen.length === 1 && (n.frage === 'winkel' ? namen[0] === d.winkel : n.frage === 'seiten' ? namen[0] === d.seiten : namen[0] === d.seiten || namen[0] === d.winkel); });
  },
  // Die dritte Ecke C eines Dreiecks ABC im Gitter: Genau ein Gitterpunkt erfüllt alle Bedingungen, und er ist die Lösung.
  dritteEcke: (n, a) => {
    if (a.format !== 'gitter' || a.eingabe !== 'punkte' || a.loesung?.length !== 1) return 'braucht Gitterzeichnen mit genau einem Punkt';
    const g = a.gitter, A = n.a, Bq = n.b, kreuz = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
    const pt = (name, C) => ({ A, B: Bq, C })[name];
    const ok = (C) => {
      if (kreuz(A, Bq, C) === 0) return false;
      if (n.oben != null && (kreuz(A, Bq, C) > 0) !== n.oben) return false;
      if (n.rechtBei) { const P = pt(n.rechtBei, C), [Q, R] = ['A', 'B', 'C'].filter((x) => x !== n.rechtBei).map((x) => pt(x, C)); if ((Q[0] - P[0]) * (R[0] - P[0]) + (Q[1] - P[1]) * (R[1] - P[1]) !== 0) return false; }
      for (const [s1, s2] of n.gleich ?? []) if (d2(pt(s1[0], C), pt(s1[1], C)) !== d2(pt(s2[0], C), pt(s2[1], C))) return false;
      for (const [s, q] of n.laenge ?? []) if (d2(pt(s[0], C), pt(s[1], C)) !== q) return false;
      if (n.hoehe != null && kreuz(A, Bq, C) ** 2 !== n.hoehe ** 2 * d2(A, Bq)) return false;
      if (n.seiten || n.winkel) { const d = dreieckVon([A, Bq, C]); if ((n.seiten && d.seiten !== n.seiten) || (n.winkel && d.winkel !== n.winkel)) return false; }
      return true;
    };
    const alle = [];
    for (let x = 0; x <= g.b; x++) for (let y = 0; y <= g.h; y++) if (ok([x, y])) alle.push([x, y]);
    if (alle.length !== 1) return `${alle.length} Gitterpunkte passen, nicht genau einer`;
    return alle[0][0] === a.loesung[0][0] && alle[0][1] === a.loesung[0][1] ? null : 'die Lösung erfüllt die Bedingungen nicht';
  },
  // Heftaufgabe: Winkel bei a im Dreieck aus drei Koordinaten, gemessen in Grad.
  heftKoordWinkel: (n) => {
    const u = [n.b[0] - n.a[0], n.b[1] - n.a[1]], v = [n.c[0] - n.a[0], n.c[1] - n.a[1]];
    const soll = (Math.acos((u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)) * 180) / Math.PI;
    return Math.abs(soll - n.wert) <= 0.5 ? null : `der Winkel ist ${soll.toFixed(1)}°, nicht ${n.wert}°`;
  },
  // Winkeldrehen: Die Lösung ist die verlangte Gradzahl gegen den Uhrzeigersinn.
  drehen: (n, a) => (a.format === 'winkel' && a.loesung === n.wert ? null : `die Lösung ist ${a.loesung}, nicht ${n.wert}`),
};
// Wo liegen die benannten Punkte (Scheitel und Endpunkte der Schenkel)? Ein Name gehört zu genau einer Stelle.
function punktLagen(alle) {
  const lage = new Map();
  const setze = (n, p) => { if (!n) return; const q = [Math.round(p[0]), Math.round(p[1])], alt = lage.get(n); lage.set(n, alt && (alt[0] !== q[0] || alt[1] !== q[1]) ? null : q); };
  for (const w of alle) { setze(w.punkte?.s, w.s); setze(w.punkte?.a, plus(w.s, richtung(w.von), w.l1)); setze(w.punkte?.b, plus(w.s, richtung(w.von + w.groesse), w.l2)); }
  return lage;
}
export const WINKEL_ERGEBNIS = {
  groesse: (n) => n.wert ?? [], geoAblesen: (n) => n.wert, kreislineal: (n) => n.wert, kreisGitter: (n) => [n.r, n.cm, n.mm].filter((x) => x != null),
  heftWinkel: (n) => n.wert, heftDreieck: (n) => n.wert, kreisschnitt: (n) => n.wert, gradunterschied: (n) => n.wert, uhrwinkel: (n) => n.wert, drehen: (n) => n.wert,
  gradnetz: (n) => [n.b, n.l].filter((x) => x != null).map(Math.abs), kreisBild: (n) => n.wert ?? [], heftKoordWinkel: (n) => n.wert,
};
export const WINKEL_ARTEN = Object.keys(WINKEL_SONDER);

// ---------- Winkeldrehen ----------
export function winkelfeldMaengel(a, fehlvorstellungen) {
  const m = [], f = a.winkelfeld;
  if (!f || !ganz(f.b, 300, 720) || !ganz(f.h, 200, 560) || !Array.isArray(f.s) || !Number.isFinite(f.von) || !(f.l > 0)) return ['Winkelfeld unvollständig'];
  if (f.l < GEO_R + 24) m.push('der feste Schenkel ist kürzer als das Geodreieck');
  const lagen = f.umlegen ? [f.von, f.von + 180] : [f.von];
  for (const grund of lagen) if (!geoEcken({ s: f.s, grund }).every((p) => drin(f, p, 2))) m.push('Geodreieck ragt aus dem Feld');
  if (!drin(f, plus(f.s, richtung(f.von), f.l + 20))) m.push('der feste Schenkel ragt aus dem Feld');
  if (!ganz(a.loesung, 1, 359)) m.push('Lösung liegt nicht zwischen 1° und 359°');
  // Der gesuchte Schenkel muss auf einer Seite des Geodreiecks liegen, die das Kind auch hinlegen kann.
  if (a.loesung > 180 && !f.umlegen) m.push('überstumpfer Winkel ohne Umlegen des Geodreiecks');
  if (!drin(f, plus(f.s, richtung(f.von + a.loesung), f.l), 0)) m.push('der gesuchte Schenkel ragt aus dem Feld');
  if (a.toleranz !== 2) m.push('Winkeldrehen hat 2° Spielraum');
  for (const x of a.typischeFehler ?? []) {
    const ab = Math.abs(norm360(x.wert - a.loesung)); if (Math.min(ab, 360 - ab) <= 2) m.push('typischer Fehler liegt im Spielraum der Lösung');
    if (!(x.fehlvorstellung in fehlvorstellungen)) m.push(`unbekannte Fehlvorstellung ${x.fehlvorstellung}`);
  }
  return m;
}
// Kreis am Gitter: Mittelpunkt und Radius in Kästchen.
export function kreisMaengel(a) {
  const bed = a.bedingung, g = a.gitter;
  if (bed?.art !== 'kreis' || !Array.isArray(bed.m) || !ganz(bed.r, 1, 12)) return ['Kreis: Mittelpunkt oder Radius fehlt'];
  if (!Array.isArray(a.beispiel) || a.beispiel.length !== 2 || !a.beispiel.every((q) => ganz(q?.[0], 0, g.b) && ganz(q?.[1], 0, g.h))) return ['Kreis: Beispiel fehlt'];
  return (a.typischeFehler ?? []).some((f) => !ganz(f.bedingung?.r, 1, 20)) ? ['Kreis: typischer Fehler ohne Radius'] : [];
}
// Sprache in Kapitel 7: ∢ASB erst ab M, keine Kommazahlen.
export function winkelSprachMaengel(niveau, texte) {
  const m = [];
  if (['F', 'G'].includes(niveau) && texte.some((t) => /∢/.test(t))) m.push('die Schreibweise ∢ASB gibt es erst ab M');
  if (texte.some((t) => /\d,\d/.test(t))) m.push('Kapitel 7 kommt ohne Kommazahlen aus');
  return m;
}
