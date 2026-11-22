// Kapitel 8 „Flächeninhalt und Umfang“ (ADR 0035): Der Prüfer rechnet Flächeninhalt und Umfang der Figuren selbst nach.
// Wie der übrige Prüfer benutzt diese Datei nichts aus den Erzeugern und nichts aus dem Dashboard.
// Eine Figur besteht aus Rechtecken [x0, y0, x1, y1] und Löchern. Gerechnet wird anders als im Dashboard:
// Der Umfang ist die Summe der Rechteckumfänge, weniger zweimal die Stücke, an denen zwei Rechtecke aneinanderstoßen, plus die Ränder der Löcher.

const ganz = (x, von, bis) => Number.isInteger(x) && x >= von && x <= bis;
// Längenfaktor der Einheit in Millimetern; 'kaestchen' zählt ohne Einheit.
const LAENGE = { mm: 1, cm: 10, dm: 100, m: 1000, km: 1000000, kaestchen: 1 };
const flaeche = ([x0, y0, x1, y1]) => (x1 - x0) * (y1 - y0);
const umfangR = ([x0, y0, x1, y1]) => 2 * (x1 - x0) + 2 * (y1 - y0);
const istRechteck = (r) => Array.isArray(r) && r.length === 4 && r.every(Number.isInteger) && r[2] > r[0] && r[3] > r[1];
const ueberdecken = (r, q) => Math.min(r[2], q[2]) > Math.max(r[0], q[0]) && Math.min(r[3], q[3]) > Math.max(r[1], q[1]);
// Länge, auf der zwei Rechtecke aneinanderstoßen (0, wenn sie sich nur in einer Ecke oder gar nicht berühren).
function gemeinsam(r, q) {
  if (r[2] === q[0] || q[2] === r[0]) return Math.max(0, Math.min(r[3], q[3]) - Math.max(r[1], q[1]));
  if (r[3] === q[1] || q[3] === r[1]) return Math.max(0, Math.min(r[2], q[2]) - Math.max(r[0], q[0]));
  return 0;
}
const streng = (l, r) => l[0] > r[0] && l[1] > r[1] && l[2] < r[2] && l[3] < r[3];

export const figurInhalt = (f) => f.rechtecke.reduce((s, r) => s + flaeche(r), 0) - (f.loecher ?? []).reduce((s, r) => s + flaeche(r), 0);
export function figurUmfang(f) {
  let u = f.rechtecke.reduce((s, r) => s + umfangR(r), 0);
  for (let i = 0; i < f.rechtecke.length; i++) for (let k = i + 1; k < f.rechtecke.length; k++) u -= 2 * gemeinsam(f.rechtecke[i], f.rechtecke[k]);
  return u + (f.loecher ?? []).reduce((s, r) => s + umfangR(r), 0);
}
// Mängel einer Figur: Rechtecke überdecken sich nicht und hängen über Seiten zusammen, Löcher liegen ganz in einem Rechteck.
function figurMaengel(f) {
  const m = [], r = f.rechtecke ?? [];
  if (!r.length || !r.every(istRechteck)) return ['Figur ohne gültige Rechtecke'];
  for (let i = 0; i < r.length; i++) for (let k = i + 1; k < r.length; k++) if (ueberdecken(r[i], r[k])) m.push('zwei Rechtecke überdecken sich');
  const verbunden = new Set([0]);
  for (let weiter = true; weiter;) { weiter = false; r.forEach((x, i) => { if (!verbunden.has(i) && [...verbunden].some((k) => gemeinsam(x, r[k]) > 0)) { verbunden.add(i); weiter = true; } }); }
  if (verbunden.size !== r.length) m.push('die Rechtecke hängen nicht zusammen');
  for (const l of f.loecher ?? []) {
    if (!istRechteck(l) || !r.some((x) => streng(l, x))) m.push('Loch liegt nicht ganz in einem Rechteck');
  }
  if ((f.loecher ?? []).some((l, i) => (f.loecher ?? []).some((q, k) => k > i && (ueberdecken(l, q) || gemeinsam(l, q) > 0)))) m.push('Löcher berühren sich');
  return m;
}
// Liegt die Strecke p–q auf dem Rand der Figur? Dann ist an ihrer Mitte auf genau einer Seite Figur.
const inF = (f, x, y) => f.rechtecke.some((r) => x > r[0] && x < r[2] && y > r[1] && y < r[3]) && !(f.loecher ?? []).some((r) => x > r[0] && x < r[2] && y > r[1] && y < r[3]);
function aufRand(f, p, q) {
  const waag = p[1] === q[1], e = 0.01;
  // Die ganze Strecke: an vielen Stellen geprüft.
  for (let t = 0.05; t < 1; t += 0.1) {
    const x = p[0] + (q[0] - p[0]) * t, y = p[1] + (q[1] - p[1]) * t;
    const a = waag ? inF(f, x, y + e) : inF(f, x + e, y), b = waag ? inF(f, x, y - e) : inF(f, x - e, y);
    if (a === b) return false;
  }
  return true;
}

// Mängel eines Flächenbildes. Regeln aus dem Grilling mit Nils (2026-11-22):
// 8.1 zählt auf dem Karogitter in Kästchen, ab 8.2 ist das Raster ein Zentimeterraster; bis G maßstäblich am Raster, ab M (außer 8.1) eine Skizze mit Maßen.
export function flaecheBildMaengel(b, a, gRechne) {
  const m = [], stufe = ['F', 'G', 'M', 'E'].indexOf(a.niveau), zaehlen = a.lernziel.startsWith('5.8.1');
  if (!LAENGE[b.einheit]) return ['Einheit der Figur fehlt'];
  // Raster: 'kaestchen' (zählen ohne Einheit, in 8.1; im Abstecher mit Legende wie „1 Heftseite“), 'cm' (Zentimeterraster) oder 'm' (Plan, ein Feld 1 m²).
  const schaetzen = a.lernziel.startsWith('5.8.X1');
  if (b.raster && !['kaestchen', 'cm', 'm'].includes(b.raster)) m.push('Raster ist kaestchen, cm oder m');
  if (b.raster === 'kaestchen' && (!(zaehlen || (schaetzen && b.legende)) || b.einheit !== 'kaestchen')) m.push('In Kästchen ohne Einheit wird nur in 8.1 gezählt, im Abstecher nur mit Legende');
  if (['cm', 'm'].includes(b.raster) && (zaehlen || b.einheit !== b.raster)) m.push('Zentimeterraster und Plan gibt es ab 8.2, mit Maßen in der Einheit des Rasters');
  if (b.legende != null && (b.raster !== 'kaestchen' || !/^1 [A-ZÄÖÜ][a-zäöüß]+$/.test(b.legende))) m.push('eine eigene Legende gibt es nur im Kästchenraster, als „1 Ding“');
  if (!b.raster && !b.skizze) m.push('ohne Raster ist die Figur eine Skizze');
  if (b.raster && b.skizze) m.push('eine Skizze hat kein Raster');
  if (b.skizze && stufe < 2) m.push('Skizzen gibt es erst ab M');
  if (stufe >= 2 && !zaehlen && b.raster) m.push('ab M ist die Figur eine Skizze mit Maßen');
  if (b.raster && (!ganz(b.b, 4, 16) || !ganz(b.h, 3, 11))) m.push('Raster ist 4 bis 16 Felder breit und 3 bis 11 hoch');
  if (!Array.isArray(b.figuren) || !ganz(b.figuren.length, 1, 3)) return [...m, 'ein bis drei Figuren'];
  for (const f of b.figuren) {
    m.push(...figurMaengel(f));
    // Auf dem Raster bleibt um jede Figur ein Feld frei.
    if (b.raster && f.rechtecke.some((r) => r[0] < 1 || r[1] < 1 || r[2] > b.b - 1 || r[3] > b.h - 1)) m.push('Figur berührt den Rand des Rasters');
    if (f.n && !/^[A-Z]$/.test(f.n)) m.push('Figurname ist ein Großbuchstabe');
  }
  const alle = b.figuren.flatMap((f) => [...f.rechtecke]);
  for (let i = 0; i < b.figuren.length; i++) for (let k = i + 1; k < b.figuren.length; k++) {
    // Zwischen zwei Figuren bleibt mindestens eine Einheit Platz, waagerecht oder senkrecht.
    if (b.figuren[i].rechtecke.some((r) => b.figuren[k].rechtecke.some((q) => Math.max(r[0], q[0]) - Math.min(r[2], q[2]) < 1 && Math.max(r[1], q[1]) - Math.min(r[3], q[3]) < 1))) m.push('zwei Figuren berühren sich');
  }
  if (b.figuren.length > 1 && b.figuren.some((f) => !f.n)) m.push('mehrere Figuren brauchen Namen');
  if (new Set(b.figuren.map((f) => f.n)).size !== b.figuren.length) m.push('Figurname doppelt');
  if (b.skizze) {
    const w = Math.max(...alle.map((r) => r[2])) - Math.min(...alle.map((r) => r[0])), h = Math.max(...alle.map((r) => r[3])) - Math.min(...alle.map((r) => r[1]));
    if (w / h > 4 || h / w > 3) m.push('die Skizze ist zu lang und schmal');
    if ((b.masse ?? []).length < 2) m.push('eine Skizze braucht Maße');
  }
  for (const x of b.masse ?? []) {
    const ok = Array.isArray(x.p) && Array.isArray(x.q) && (x.p[0] === x.q[0]) !== (x.p[1] === x.q[1]);
    if (!ok) { m.push('Maß liegt nicht an einer waagerechten oder senkrechten Seite'); continue; }
    if (!b.figuren.some((f) => aufRand(f, x.p, x.q))) m.push(`Maß von (${x.p}) nach (${x.q}) liegt nicht auf dem Rand`);
    if (x.text != null) {
      const l = (Math.abs(x.q[0] - x.p[0]) + Math.abs(x.q[1] - x.p[1])) * LAENGE[b.einheit], v = gRechne(x.text);
      if (!v || v.art !== 'laenge' || v.w !== l) m.push(`Maß „${x.text}“ passt nicht zur Seite`);
    }
  }
  return m;
}
// Was ein Flächenbild zeigt: die Längen der Maße (ohne Fragezeichen); auf einem Raster auch jede Seite jedes Rechtecks, die man abzählen kann.
export function flaecheGroessen(b) {
  const f = LAENGE[b.einheit] ?? 1, art = b.einheit === 'kaestchen' ? 'zahl' : 'laenge';
  const liste = (b.masse ?? []).filter((x) => !x.frage).map((x) => ({ art, w: (Math.abs(x.q[0] - x.p[0]) + Math.abs(x.q[1] - x.p[1])) * f }));
  if (b.raster) for (const fig of b.figuren) {
    for (const r of [...fig.rechtecke, ...(fig.loecher ?? [])]) liste.push({ art, w: (r[2] - r[0]) * f }, { art, w: (r[3] - r[1]) * f });
    for (const l of randLaengen(fig, b)) liste.push({ art, w: l * f });
  }
  // Die Legende unter dem Raster zeigt die Größe eines Felds (1 cm² oder 1 m²).
  if (b.raster === 'cm' || b.raster === 'm') liste.push({ art: 'flaeche', w: f * f });
  return liste;
}
// Am Raster lassen sich alle Randstücke abzählen: Kästchenweise wird geprüft, wo Figur an Nicht-Figur grenzt; Stücke in einer Linie werden zusammengefasst.
function randLaengen(fig, b) {
  const voll = (x, y) => inF(fig, x + 0.5, y + 0.5), laengen = [];
  // kante(i): 0 ohne Rand, sonst +1 oder −1 je nachdem, auf welcher Seite die Figur liegt. Gleiche Seite in Folge ist ein Stück.
  const zaehle = (n, kante) => { let lauf = 0, seite = 0; for (let i = 0; i <= n; i++) { const k = i < n ? kante(i) : 0; if (k && k === seite) lauf++; else { if (lauf) laengen.push(lauf); lauf = k ? 1 : 0; seite = k; } } };
  for (let y = 0; y <= b.h; y++) zaehle(b.b, (x) => voll(x, y) - voll(x, y - 1));
  for (let x = 0; x <= b.b; x++) zaehle(b.h, (y) => voll(x, y) - voll(x - 1, y));
  return laengen;
}
// Flächeninhalt oder Umfang einer Figur des Bildes als Größe (Kästchen als Zahl). wer: Name der Figur, ohne Namen die einzige.
export function figurGroesse(b, was, wer) {
  const f = wer ? b.figuren.find((x) => x.n === wer) : b.figuren.length === 1 ? b.figuren[0] : null;
  if (!f || !LAENGE[b.einheit]) return null;
  const l = LAENGE[b.einheit], z = b.einheit === 'kaestchen';
  if (was === 'inhalt') return { art: z ? 'zahl' : 'flaeche', w: figurInhalt(f) * l * l };
  if (was === 'umfang') return { art: z ? 'zahl' : 'laenge', w: figurUmfang(f) * l };
  return null;
}

// ---------- Kästchen färben mit Bedingung ----------
const nachbarn = ([x, y]) => [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
function zellenPassen(bed, zellen) {
  const k = new Set(zellen.map(String));
  if (k.size !== zellen.length || !zellen.length) return false;
  const gesehen = new Set([String(zellen[0])]), offen = [zellen[0]];
  while (offen.length) for (const n of nachbarn(offen.pop())) if (k.has(String(n)) && !gesehen.has(String(n))) { gesehen.add(String(n)); offen.push(n); }
  if (gesehen.size !== k.size) return false;
  // Umfang: Jede Kästchenseite, an der kein gefärbtes Nachbarkästchen liegt, gehört zum Rand.
  const u = zellen.reduce((s, z) => s + nachbarn(z).filter((n) => !k.has(String(n))).length, 0);
  if (bed.n != null && zellen.length !== bed.n) return false;
  if (bed.umfang != null && u !== bed.umfang) return false;
  if (bed.rechteck) { const xs = zellen.map((z) => z[0]), ys = zellen.map((z) => z[1]); if ((Math.max(...xs) - Math.min(...xs) + 1) * (Math.max(...ys) - Math.min(...ys) + 1) !== zellen.length) return false; }
  return true;
}
export function zellenMaengel(a, fehlvorstellungen) {
  const m = [], g = a.gitter, bed = a.bedingung;
  if (bed.n == null && bed.umfang == null) m.push('Bedingung nennt weder Anzahl noch Umfang');
  if (!Array.isArray(a.loesung) || !a.loesung.every((z) => ganz(z?.[0], 0, g.b - 1) && ganz(z?.[1], 0, g.h - 1))) return [...m, 'Beispiel liegt nicht im Gitter'];
  if (!zellenPassen(bed, a.loesung)) m.push('das Beispiel erfüllt die Bedingung nicht');
  for (const f of a.typischeFehler ?? []) {
    if (!(f.fehlvorstellung in fehlvorstellungen)) m.push(`unbekannte Fehlvorstellung ${f.fehlvorstellung}`);
    if (!f.bedingung || JSON.stringify(f.bedingung) === JSON.stringify(bed) || zellenPassen(f.bedingung, a.loesung)) m.push('typischer Fehler ist gleich der Bedingung oder passt zum Beispiel');
  }
  if ((g.zellen ?? []).length) m.push('beim Färben mit Bedingung ist noch nichts gefärbt');
  // Die Zahlen der Bedingung stehen im Text.
  for (const z of [bed.n, bed.umfang].filter((x) => x != null)) if (!new RegExp(`(^|\\D)${z}(\\D|$)`).test(a.text)) m.push(`${z} aus der Bedingung steht nicht im Text`);
  return m;
}

// ---------- Sprache ----------
// Grilling mit Nils (2026-11-22): Flächen ohne Komma; mm² und km² ab G, Ar und Hektar ab M.
export function flaecheSprachMaengel(niveau, texte) {
  const m = [], stufe = ['F', 'G', 'M', 'E'].indexOf(niveau), alle = texte.join('\n');
  if (/\d,\d/.test(alle)) m.push('in Kapitel 8 steht keine Kommazahl (gemischte Schreibweise: 3 m² 25 dm²)');
  if (stufe < 1 && /\d (?:mm²|km²)/.test(alle)) m.push('mm² und km² gibt es erst ab G');
  if (stufe < 2 && /\d (?:a|ha)(?![A-Za-zÄÖÜäöüß²])|\bAr\b|\bHektar\b/.test(alle)) m.push('Ar und Hektar gibt es erst ab M');
  if (/\d(?:mm|cm|dm|km|m)²?(?![a-zäöü])|\d²/.test(alle.replace(/[a-zäöü]\d/g, ''))) m.push('zwischen Zahl und Einheit steht ein Leerzeichen');
  return m;
}
