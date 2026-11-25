// Klasse 6, Kapitel 3 „Körper“ (ADR 0045): Der Prüfer zählt Ecken, Kanten und Flächen selbst, faltet Netze nach,
// bildet Ansichten aus den Würfeln und rechnet Schrägbilder im Gitter nach.
// Wie der übrige Prüfer benutzt diese Datei nichts aus den Erzeugern und nichts aus dem Dashboard.
// Festlegungen (Grilling mit Nils, 2026-11-25): Kegel 2 Flächen, 1 Kante, 1 Spitze, keine Ecke. Zylinder 3 Flächen, 2 Kanten. Kugel 1 Fläche.
// Schrägbild: 1 cm nach rechts oder oben sind 2 Kästchen, 1 cm nach hinten ist eine Kästchendiagonale (1 Kästchen nach rechts und 1 nach oben).
// Die Ecken des Quaders: unten A, B, C, D gegen den Uhrzeigersinn, vorne links beginnend, oben E, F, G, H. Verdeckt sind D und die Kanten AD, CD, DH.

export const KOERPERBILDER = ['koerper', 'netz', 'risse'];
const FORMEN = ['quader', 'prisma', 'pyramide', 'zylinder', 'kegel', 'kugel', 'wuerfelbau'];
const EPS = 0.06;
const schl = (p) => p.join(',');
const zahlenIn = (s) => [...String(s ?? '').matchAll(/\d+(?:,\d+)?/g)].map((m) => Number(m[0].replace(',', '.')));

// ---------- Zählen ----------
// Ecken, Kanten und Flächen nach der Form. „wuerfel“ ist ein Quader mit gleichen Kanten.
export function zaehle(form, n) {
  switch (form) {
    case 'wuerfel': case 'quader': return { ecken: 8, kanten: 12, flaechen: 6 };
    case 'prisma': return n >= 3 ? { ecken: 2 * n, kanten: 3 * n, flaechen: n + 2 } : null;
    case 'pyramide': return n >= 3 ? { ecken: n + 1, kanten: 2 * n, flaechen: n + 1 } : null;
    case 'zylinder': return { ecken: 0, kanten: 2, flaechen: 3 };
    case 'kegel': return { kanten: 1, flaechen: 2, spitzen: 1 };
    case 'kugel': return { ecken: 0, kanten: 0, flaechen: 1 };
    default: return null;
  }
}
const formVonBild = (b) => (b?.art !== 'koerper' ? null : b.form === 'quader' && b.a === b.b && b.b === b.c ? { form: 'wuerfel' } : { form: b.form, n: b.n });

// ---------- Ecken des Quaders ----------
const QE = { A: [0, 0, 0], B: [1, 0, 0], C: [1, 1, 0], D: [0, 1, 0], E: [0, 0, 1], F: [1, 0, 1], G: [1, 1, 1], H: [0, 1, 1] };
const QUADERKANTEN = ['AB', 'BC', 'CD', 'DA', 'EF', 'FG', 'GH', 'HE', 'AE', 'BF', 'CG', 'DH'];
const VERDECKT = new Set(['CD', 'DA', 'DH']);
const kanteGleich = (k, l) => k === l || k === `${l[1]}${l[0]}`;
const istKante = (k) => QUADERKANTEN.some((l) => kanteGleich(k, l));
// Richtung einer Kante: 0 Länge (a), 1 Tiefe (b), 2 Höhe (c).
const richtung = (k) => { const p = QE[k[0]], q = QE[k[1]]; return p && q ? [0, 1, 2].find((i) => p[i] !== q[i]) : undefined; };
const laengeVon = (q, k) => [q.a, q.b, q.c][richtung(k)];
const istFlaeche = (f) => f.length === 4 && [0, 1, 2].some((i) => [0, 1].some((w) => [...f].every((n) => QE[n]?.[i] === w)));
const flaechenLage = (f) => { for (const i of [0, 1, 2]) for (const w of [0, 1]) if ([...f].every((n) => QE[n]?.[i] === w)) return [i, w]; return null; };

// ---------- Sichtbarkeit (Schrägbild nach rechts hinten oben) ----------
// Eine Fläche ist sichtbar, wenn ihre äußere Normale zum Betrachter zeigt: Blick von vorne (−y), etwas von rechts (+x) und von oben (+z).
function eckigerKoerper(b) {
  const p = new Map(), f = [];
  if (b.form === 'quader') {
    for (const [n, [x, y, z]] of Object.entries(QE)) p.set(n, [x * b.a, y * b.b, z * b.c]);
    f.push(['A', 'B', 'C', 'D'], ['E', 'F', 'G', 'H'], ['A', 'B', 'F', 'E'], ['B', 'C', 'G', 'F'], ['C', 'D', 'H', 'G'], ['D', 'A', 'E', 'H']);
  } else if (b.form === 'prisma' || b.form === 'pyramide') {
    const n = b.n, ring = (z) => Array.from({ length: n }, (_, i) => { const w = ((-90 - 180 / n + (i * 360) / n + (b.dreh ?? 0)) * Math.PI) / 180, u = b.r + b.r * Math.cos(w), v = b.r + b.r * Math.sin(w); return b.liegend ? [u, z, v] : [u, v, z]; });
    const unten = ring(0).map((q, i) => { const name = `U${i}`; p.set(name, q); return name; });
    if (b.form === 'prisma') {
      const oben = ring(b.h).map((q, i) => { const name = `O${i}`; p.set(name, q); return name; });
      f.push(unten, oben, ...unten.map((x, i) => [x, unten[(i + 1) % n], oben[(i + 1) % n], oben[i]]));
    } else { p.set('S', [b.r, b.r, b.h]); f.push(unten, ...unten.map((x, i) => [x, unten[(i + 1) % n], 'S'])); }
  } else return null;
  return { p, f };
}
export function sichtbar(b) {
  const k = eckigerKoerper(b);
  if (!k) return null;
  const alle = [...k.p.values()], m = [0, 1, 2].map((i) => alle.reduce((s, q) => s + q[i], 0) / alle.length);
  const blick = [-0.5, 1, -0.5]; // ein Punkt weiter hinten liegt im Bild rechts oben: Blickrichtung nach hinten, links, unten
  const sicht = k.f.map((f) => {
    const q = f.map((n) => k.p.get(n)), u = q[1].map((x, i) => x - q[0][i]), v = q[2].map((x, i) => x - q[0][i]);
    let nv = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const c = [0, 1, 2].map((i) => q.reduce((s, x) => s + x[i], 0) / q.length);
    if (nv.reduce((s, x, i) => s + x * (c[i] - m[i]), 0) < 0) nv = nv.map((x) => -x);
    return nv.reduce((s, x, i) => s + x * blick[i], 0) < -1e-9;
  });
  const kanten = new Map();
  k.f.forEach((f, i) => f.forEach((x, j) => { const y = f[(j + 1) % f.length], key = [x, y].sort().join('-'); kanten.set(key, (kanten.get(key) ?? false) || sicht[i]); }));
  const sichtbareEcken = new Set([...kanten].filter(([, s]) => s).flatMap(([key]) => key.split('-')));
  return { flaechen: sicht.filter((x) => !x).length, kanten: [...kanten.values()].filter((x) => !x).length, ecken: [...k.p.keys()].filter((n) => !sichtbareEcken.has(n)).length,
    alle: { flaechen: k.f.length, kanten: kanten.size, ecken: k.p.size } };
}

// ---------- Netze ----------
const gleich = (x, y) => Math.abs(x - y) < EPS;
const pGleich = (p, q) => gleich(p[0], q[0]) && gleich(p[1], q[1]);
const abst = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const istRechteck = (e) => e.length === 4 && e.every((p, i) => { const q = e[(i + 1) % 4]; return gleich(p[0], q[0]) || gleich(p[1], q[1]); });
const kantenVon = (e) => e.map((p, i) => [p, e[(i + 1) % e.length]]);
const gemeinsam = (e1, e2) => { for (const [p, q] of kantenVon(e1)) for (const [r, s] of kantenVon(e2)) if ((pGleich(p, s) && pGleich(q, r)) || (pGleich(p, r) && pGleich(q, s))) return [p, q]; return null; };
const neg = (v) => v.map((x) => -x);
// Quader- und Würfelnetze: achsenparallele Rechtecke über gemeinsame Kanten abrollen.
function quaderFalten(flaechen) {
  if (flaechen.length !== 6 || !flaechen.every((f) => istRechteck(f.ecken))) return null;
  const box = (e) => { const xs = e.map((p) => p[0]), ys = e.map((p) => p[1]); return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }; };
  const r = flaechen.map((f) => box(f.ecken)), lage = new Map([[0, { n: [0, 0, -1], r: [1, 0, 0], u: [0, 1, 0] }]]), liste = [0], masse = [null, null, null];
  const achse = (v) => v.findIndex((x) => x !== 0);
  const setze = (v, l) => { const i = achse(v); if (masse[i] == null) masse[i] = l; return gleich(masse[i], l); };
  let passt = true;
  while (liste.length) {
    const i = liste.pop(), o = lage.get(i), a = r[i];
    passt = setze(o.r, a.x1 - a.x0) && setze(o.u, a.y1 - a.y0) && passt;
    for (let j = 0; j < 6; j++) {
      if (lage.has(j)) continue;
      const k = gemeinsam(flaechen[i].ecken, flaechen[j].ecken);
      if (!k) continue;
      const b = r[j];
      const neu = gleich(b.x0, a.x1) ? { n: o.r, r: neg(o.n), u: o.u } : gleich(b.x1, a.x0) ? { n: neg(o.r), r: o.n, u: o.u } : gleich(b.y0, a.y1) ? { n: o.u, r: o.r, u: neg(o.n) } : { n: neg(o.u), r: o.r, u: o.n };
      lage.set(j, neu); liste.push(j);
    }
  }
  if (lage.size !== 6) return { faltbar: false, grund: 'hängt nicht zusammen' };
  const normalen = new Set([...lage.values()].map((o) => schl(o.n)));
  if (normalen.size !== 6) return { faltbar: false, grund: 'zwei Flächen liegen aufeinander' };
  // Jede Fläche nachmessen: Ihre Seiten müssen zu den Maßen des Quaders passen.
  for (const [i, o] of lage) if (!(gleich(masse[achse(o.r)], r[i].x1 - r[i].x0) && gleich(masse[achse(o.u)], r[i].y1 - r[i].y0))) passt = false;
  if (!passt) return { faltbar: false, grund: 'Kanten passen nicht aufeinander' };
  return { faltbar: true, masse, lage, zellen: r };
}
const regelmaessig = (e) => { const s = abst(e[0], e[1]); return e.every((p, i) => gleich(abst(p, e[(i + 1) % e.length]), s)) ? s : null; };
function prismaFalten(flaechen) {
  const rechtecke = flaechen.filter((f) => istRechteck(f.ecken)), vielecke = flaechen.filter((f) => !istRechteck(f.ecken) || f.vieleck);
  if (rechtecke.length + vielecke.length !== flaechen.length || vielecke.length !== 2) return null;
  const n = rechtecke.length, s = regelmaessig(vielecke[0].ecken);
  const breiten = rechtecke.map((f) => Math.max(...f.ecken.map((p) => p[0])) - Math.min(...f.ecken.map((p) => p[0]))), y0 = Math.min(...rechtecke.flatMap((f) => f.ecken.map((p) => p[1]))), y1 = Math.max(...rechtecke.flatMap((f) => f.ecken.map((p) => p[1])));
  if (!s || !rechtecke.every((f) => gleich(Math.min(...f.ecken.map((p) => p[1])), y0) && gleich(Math.max(...f.ecken.map((p) => p[1])), y1))) return null;
  const xs = rechtecke.map((f) => Math.min(...f.ecken.map((p) => p[0]))).sort((x, y) => x - y);
  const streifen = xs.every((x, i) => i === 0 || gleich(x, xs[i - 1] + breiten[0])) && breiten.every((b) => gleich(b, breiten[0]));
  if (!streifen) return null;
  const ecken = vielecke.map((f) => f.ecken.length), seite = vielecke.map((f) => regelmaessig(f.ecken));
  const an = vielecke.map((f) => { const r = rechtecke.find((g) => gemeinsam(f.ecken, g.ecken)); if (!r) return null; const k = gemeinsam(f.ecken, r.ecken); return gleich(k[0][1], y0) && gleich(k[1][1], y0) ? 'unten' : gleich(k[0][1], y1) && gleich(k[1][1], y1) ? 'oben' : null; });
  const faltbar = ecken.every((e) => e === n) && seite.every((x) => x && gleich(x, breiten[0])) && an.includes('oben') && an.includes('unten');
  return { faltbar, n: faltbar ? n : null };
}
function pyramideFalten(flaechen) {
  const grund = flaechen.filter((f) => f.ecken.length !== 3), dreiecke = flaechen.filter((f) => f.ecken.length === 3);
  if (grund.length !== 1 || !regelmaessig(grund[0].ecken) || !dreiecke.length) return null;
  const g = grund[0].ecken, n = g.length, belegt = new Set();
  let schenkel = null, ok = true;
  for (const d of dreiecke) {
    const k = gemeinsam(d.ecken, g);
    if (!k) { ok = false; continue; }
    const i = g.findIndex((p, j) => (pGleich(p, k[0]) && pGleich(g[(j + 1) % n], k[1])) || (pGleich(p, k[1]) && pGleich(g[(j + 1) % n], k[0])));
    if (belegt.has(i)) ok = false;
    belegt.add(i);
    const spitze = d.ecken.find((p) => !pGleich(p, k[0]) && !pGleich(p, k[1])), l1 = abst(spitze, k[0]), l2 = abst(spitze, k[1]);
    if (!gleich(l1, l2) || (schenkel != null && !gleich(schenkel, l1))) ok = false;
    schenkel = l1;
  }
  // Damit sich die Dreiecke in einer Spitze treffen, muss der Schenkel länger sein als der Umkreisradius der Grundfläche.
  const s = regelmaessig(g), umkreis = s / (2 * Math.sin(Math.PI / n));
  return { faltbar: ok && dreiecke.length === n && belegt.size === n && schenkel > umkreis + EPS, n };
}
function rundFalten(b) {
  const f = b.flaechen ?? [], k = b.kreise ?? [], sek = b.sektoren ?? [];
  if (f.length === 1 && k.length === 2 && !sek.length && istRechteck(f[0].ecken)) {
    const xs = f[0].ecken.map((p) => p[0]), ys = f[0].ecken.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const lage = k.map((c) => (c.m[0] < x0 - EPS || c.m[0] > x1 + EPS ? null : gleich(c.m[1], y0 - c.r) ? 'unten' : gleich(c.m[1], y1 + c.r) ? 'oben' : null));
    return { form: 'zylinder', faltbar: gleich(k[0].r, k[1].r) && Math.abs(x1 - x0 - 2 * Math.PI * k[0].r) < 0.05 && lage.includes('oben') && lage.includes('unten') };
  }
  if (!f.length && k.length === 1 && sek.length === 1) {
    const s = sek[0], c = k[0], bogen = (s.r * (s.bis - s.von) * Math.PI) / 180;
    return { form: 'kegel', faltbar: Math.abs(bogen - 2 * Math.PI * c.r) < 0.05 && Math.abs(abst(s.m, c.m) - s.r - c.r) < 0.05 };
  }
  return null;
}
// Was sich aus einem Netz falten lässt: { faltbar, form, n?, masse? } oder null, wenn sich das Netz nicht einordnen lässt.
export function netzFalten(b) {
  if (b?.art !== 'netz') return null;
  if ((b.kreise ?? []).length || (b.sektoren ?? []).length) return rundFalten(b);
  const f = b.flaechen ?? [];
  if (f.length && f.every((x) => istRechteck(x.ecken))) {
    const q = quaderFalten(f);
    if (!q) return { faltbar: false, form: 'quader', grund: `${f.length} Flächen` };
    return { ...q, form: q.faltbar && q.masse.every((m) => gleich(m, q.masse[0])) ? 'wuerfel' : 'quader' };
  }
  const p = prismaFalten(f);
  if (p) return { ...p, form: 'prisma' };
  const y = pyramideFalten(f);
  if (y) return { ...y, form: 'pyramide' };
  return null;
}
// Würfelnetz aus Einheitsquadraten mit Namen: Name → Normale nach dem Falten.
function seitenNachNamen(b) {
  const q = netzFalten(b);
  if (!q?.faltbar || !q.lage) return null;
  const m = new Map();
  for (const [i, o] of q.lage) if (b.flaechen[i].n != null) m.set(String(b.flaechen[i].n), schl(o.n));
  return m;
}
const gegenueber = (m, x, y) => m.has(x) && m.has(y) && schl(m.get(x).split(',').map((z) => -Number(z))) === m.get(y);

// ---------- Ansichten ----------
const normiere = (z) => { const x0 = Math.min(...z.map((p) => p[0])), y0 = Math.min(...z.map((p) => p[1])); return z.map(([x, y]) => [x - x0, y - y0]); };
const zellenGleich = (a, b) => { const A = new Set(normiere(a).map(schl)), B = new Set(normiere(b).map(schl)); return A.size === B.size && [...A].every((x) => B.has(x)); };
export function ansichtVon(wuerfel, von) {
  const mx = Math.max(...wuerfel.map((w) => w[0])), my = Math.max(...wuerfel.map((w) => w[1]));
  const bild = { vorne: (w) => [w[0], w[2]], oben: (w) => [w[0], w[1]], links: (w) => [my - w[1], w[2]], rechts: (w) => [w[1], w[2]], hinten: (w) => [mx - w[0], w[2]] }[von];
  if (!bild) return null;
  return [...new Map(wuerfel.map((w) => { const p = bild(w); return [schl(p), p]; })).values()];
}
const quaderAnsicht = (q, von) => { const [b, h] = { vorne: [q.a, q.c], hinten: [q.a, q.c], oben: [q.a, q.b], links: [q.b, q.c], rechts: [q.b, q.c] }[von]; const z = []; for (let x = 0; x < b; x++) for (let y = 0; y < h; y++) z.push([x, y]); return z; };
const ANSICHTFORM = (form, n, von, liegend) => {
  const oben = von === 'oben';
  switch (form) {
    case 'wuerfel': return 'Quadrat';
    case 'zylinder': return oben ? 'Kreis' : 'Rechteck';
    case 'kegel': return oben ? 'Kreis' : 'Dreieck';
    case 'kugel': return 'Kreis';
    case 'pyramide': return oben ? { 3: 'Dreieck', 4: 'Quadrat', 5: 'Fünfeck', 6: 'Sechseck' }[n] : 'Dreieck';
    case 'prisma': return liegend && n === 3 ? (von === 'vorne' ? 'Dreieck' : 'Rechteck') : oben ? { 3: 'Dreieck', 4: 'Quadrat', 5: 'Fünfeck', 6: 'Sechseck', 8: 'Achteck' }[n] : 'Rechteck';
    default: return null;
  }
};

// ---------- Namen von Körpern in Antworten ----------
const ZAHLWORT = { drei: 3, vier: 4, fünf: 5, sechs: 6, acht: 8 };
function koerperIn(t) {
  const m = t.match(/(drei|vier|fünf|sechs|acht)seitige[sn]? (Prisma|Pyramide)/);
  if (m) return { form: m[2] === 'Prisma' ? 'prisma' : 'pyramide', n: ZAHLWORT[m[1]] };
  const treffer = [['Würfel', 'wuerfel'], ['Quader', 'quader'], ['Zylinder', 'zylinder'], ['Kegel', 'kegel'], ['Kugel', 'kugel'], ['Prisma', 'prisma'], ['Pyramide', 'pyramide']].filter(([w]) => new RegExp(`(^|[^A-Za-zäöüß])${w}`).test(t));
  return treffer.length === 1 ? { form: treffer[0][1] } : undefined;
}
const passtForm = (soll, ist) => Boolean(ist) && (ist.form === soll.form || (soll.form === 'wuerfel' && ist.form === 'quader' && false)) && (soll.n == null || ist.n == null || soll.n === ist.n);
const GEGENSTAND = { zylinder: ['Dose', 'Kerze', 'Rolle Küchenpapier', 'Trommel', 'Litfaßsäule'], kegel: ['Eistüte', 'Partyhut', 'Pylon', 'Turmspitze'], kugel: ['Ball', 'Murmel', 'Orange', 'Globus', 'Seifenblase'],
  quader: ['Schuhkarton', 'Ziegelstein', 'Buch', 'Brotdose', 'Schrank'], wuerfel: ['Spielwürfel', 'Zuckerwürfel', 'Zauberwürfel', 'Eiswürfel'], prisma: ['Zelt', 'Dachbalken'], pyramide: ['Turmdach'] };
const formDesGegenstands = (g) => Object.entries(GEGENSTAND).find(([, l]) => l.includes(g))?.[0] ?? null;

// ---------- Antworten einstufen ----------
const polar = (t) => (/^(Nein|Falsch|Stimmt nicht|Es ist falsch)(?![a-zäöü])/.test(t) ? false : /^(Ja|Stimmt|Richtig|Es ist richtig)(?![a-zäöü])/.test(t) ? true : undefined);
let mitUrteil = false;
function stufe(optionen, trifft, locker = false) {
  if (!Array.isArray(optionen) || !optionen.length) return 'Antworten fehlen';
  let geprueft = 0;
  for (const o of optionen) {
    const w = trifft(String(o.text).replace(/\n/g, ' ').trim(), o);
    if (w === undefined) { if (locker) continue; return `Antwort „${o.text}“ lässt sich nicht prüfen`; }
    geprueft++;
    if (w !== o.richtig) return `Antwort „${String(o.text).replace(/\n/g, ' ')}“ ist falsch eingestuft`;
  }
  return geprueft || mitUrteil ? null : 'keine Antwort lässt sich prüfen';
}
const optionenVon = (a, n) => (n.teil != null ? a.teile?.[n.teil]?.optionen : a.optionen);
const loesungVon = (a, n) => (n.teil != null ? a.teile?.[n.teil]?.loesung : n.luecke != null ? a.luecken?.[n.luecke]?.loesung : a.loesung);
const mitZahl = (a, n, wert) => { // Zahl als Lösung oder als Antwort
  const l = loesungVon(a, n);
  if (typeof l === 'number' && n.ergebnisFrei !== true && l !== wert && n.zwischen !== true && a.format !== 'auswahl') return null; // eine andere Lösung: Die Zahl ist ein Zwischenschritt
  const o = optionenVon(a, n);
  if (o && a.format === 'auswahl' && o.every((x) => /^\d+$/.test(String(x.text).trim()))) return stufe(o, (t) => Number(t) === wert);
  return null;
};
const quaderVon = (a, n) => n.quader ?? (a.bild?.art === 'koerper' && a.bild.form === 'quader' ? a.bild : null);
const wuerfelVon = (a, n) => n.wuerfel ?? (a.bild?.art === 'koerper' && a.bild.form === 'wuerfelbau' ? a.bild.wuerfel : null);
const gitterVon = (a) => a.gitter ?? (a.bild?.art === 'gitter' ? a.bild : null);

// Eigenschaften für Aufgaben „Kreuze alle Körper an, die …“ (Festlegung: Der Kegel hat eine Spitze, aber keine Ecke).
const EIGENSCHAFT = { gekruemmt: ['zylinder', 'kegel', 'kugel'], spitze: ['kegel', 'pyramide'], ohneEcke: ['zylinder', 'kegel', 'kugel'], nurEben: ['quader', 'wuerfel', 'prisma', 'pyramide'], eineKante: ['kegel'] };
export const KOERPER_SONDER = {
  // Ecken, Kanten oder Flächen eines Körpers. Mit `bild` muss der Körper im Bild dieselbe Form haben.
  koerperzahl: (n, a) => {
    const z = zaehle(n.form, n.n);
    if (!z || z[n.was] == null) return `${n.form} hat keine ${n.was}`;
    if (z[n.was] !== n.wert) return `${n.form}${n.n ? ` (n = ${n.n})` : ''} hat ${z[n.was]} ${n.was}, nicht ${n.wert}`;
    if (n.bild) { const f = formVonBild(a.bild); if (!f || (f.form !== n.form && !(n.form === 'quader' && f.form === 'wuerfel')) || (n.n != null && f.n !== n.n)) return 'der Körper im Bild hat eine andere Form'; }
    return mitZahl(a, n, n.wert);
  },
  // Name eines Körpers: am Bild, an einem Gegenstand oder an einem Netz. Antworten sind Namen oder Bildkarten.
  koerperart: (n, a) => {
    const soll = { form: n.form, n: n.n };
    if (n.gegenstand) { if (formDesGegenstands(n.gegenstand) !== n.form) return `${n.gegenstand} ist kein ${n.form}`; if (!a.text.includes(n.gegenstand)) return `${n.gegenstand} steht nicht im Text`; }
    if (n.bild) { const f = formVonBild(a.bild); if (!passtForm(soll, f)) return 'der Körper im Bild hat eine andere Form'; }
    if (n.netz) { const f = netzFalten(a.bild); if (!f?.faltbar || !passtForm(soll, f)) return 'aus dem Netz lässt sich dieser Körper nicht falten'; }
    const o = optionenVon(a, n);
    if (!o) return null;
    return stufe(o, (t, opt) => (opt.bild ? passtForm(soll, opt.bild.art === 'netz' ? netzFalten(opt.bild) : formVonBild(opt.bild)) && (opt.bild.art !== 'netz' || netzFalten(opt.bild).faltbar) : formDesGegenstands(t) ? formDesGegenstands(t) === soll.form : (() => { const k = koerperIn(t); return k === undefined ? undefined : passtForm(soll, k) || (soll.form === 'quader' && k.form === 'quader'); })()));
  },
  // Netze: Bildkarten, ein Netz im Bild (mit Ja/Nein-Antworten oder `faltbar`) oder ein Netz im Gitter ergänzen.
  netz: (n, a) => {
    const ziel = (f) => f && f.faltbar && (f.form === n.ziel || (n.ziel === 'quader' && f.form === 'wuerfel')) && (!n.quader || [...f.masse].sort().join() === [n.quader.a, n.quader.b, n.quader.c].sort().join()) && (!n.bild || a.bild?.art !== 'koerper' || [...f.masse].sort().join() === [a.bild.a, a.bild.b, a.bild.c].sort().join());
    if (a.format === 'gitter') {
      const b = a.bedingung, zellen = (l) => ({ art: 'netz', flaechen: [...b.gegeben, ...l].map(([x, y]) => ({ ecken: [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]] })) });
      if (b?.art !== 'netz') return 'braucht die Bedingung netz';
      if (a.loesung.length !== b.fehlt || !ziel(netzFalten(zellen(a.loesung)))) return 'die Lösung ergibt kein Würfelnetz';
      for (const f of a.typischeFehler ?? []) if (f.punkte && f.punkte.length === b.fehlt && ziel(netzFalten(zellen(f.punkte)))) return 'ein typischer Fehler ergibt doch ein Würfelnetz';
      return null;
    }
    const o = optionenVon(a, n);
    if (o?.some((x) => x.bild)) return stufe(o, (t, x) => (x.bild ? Boolean(ziel(netzFalten(x.bild))) : undefined));
    const f = netzFalten(a.bild);
    if (!f) return 'das Netz im Bild lässt sich nicht einordnen';
    const ok = Boolean(ziel(f));
    if (n.faltbar != null && n.faltbar !== ok) return ok ? 'das Netz lässt sich doch falten' : 'das Netz lässt sich nicht falten';
    // gruende: mehrere „Nein, …“-Antworten mit verschiedenen Gründen. Dann muss „Ja“ zum Netz passen und genau ein Grund richtig sein, wenn es nicht faltbar ist.
    if (o && a.format === 'auswahl' && n.gruende) {
      const ja = o.filter((x) => polar(x.text) === true), nein = o.filter((x) => polar(x.text) === false);
      if (!ja.every((x) => x.richtig === ok)) return 'die Antwort „Ja“ ist falsch eingestuft';
      if (ok ? nein.some((x) => x.richtig) : nein.filter((x) => x.richtig).length !== 1) return 'die Gründe mit „Nein“ sind falsch eingestuft';
      return null;
    }
    if (o && a.format === 'auswahl') return stufe(o, (t) => { const p = polar(t); return p === undefined ? undefined : p === ok; }, true);
    return null;
  },
  // Gegenüberliegende oder benachbarte Flächen eines Würfelnetzes mit Namen.
  gegenueber: (n, a) => {
    const m = seitenNachNamen(a.bild);
    if (!m) return 'braucht ein Würfelnetz mit Namen';
    if (n.gegen != null) return gegenueber(m, String(n.flaeche), String(n.gegen)) ? null : `${n.flaeche} und ${n.gegen} liegen nicht gegenüber`;
    const o = optionenVon(a, n);
    if (n.welche === 'paare') return stufe(o, (t) => { const p = t.split(' und '); return p.length === 2 && m.has(p[0]) && m.has(p[1]) ? gegenueber(m, p[0], p[1]) : undefined; });
    return stufe(o, (t) => (!m.has(t) || t === String(n.flaeche) ? undefined : n.welche === 'gegen' ? gegenueber(m, String(n.flaeche), t) : !gegenueber(m, String(n.flaeche), t)));
  },
  // Ansicht eines Würfelbaus oder Quaders: im Gitter gezeichnet, als Bildkarte gewählt oder zu einer gezeigten Ansicht der passende Bau.
  ansicht: (n, a) => {
    const w = wuerfelVon(a, n), q = quaderVon(a, n), soll = w ? ansichtVon(w, n.von) : q ? quaderAnsicht(q, n.von) : null;
    const o = optionenVon(a, n);
    if (a.bild?.art === 'risse' && o?.some((x) => x.bild?.form === 'wuerfelbau')) { // Welcher Bau passt zur Ansicht?
      const riss = a.bild.risse[0].zellen;
      return stufe(o, (t, x) => (x.bild?.form === 'wuerfelbau' ? zellenGleich(ansichtVon(x.bild.wuerfel, n.von), riss) : undefined));
    }
    if (!soll) return 'braucht einen Würfelbau oder Quader';
    if (n.wert != null && n.wert !== soll.length) return `die Ansicht hat ${soll.length} Kästchen, nicht ${n.wert}`;
    if (a.format === 'gitter') {
      if (a.bedingung?.art !== 'form' || !zellenGleich(a.bedingung.zellen, soll) || !zellenGleich(a.loesung, soll)) return `die Ansicht von ${n.von} ist eine andere`;
      for (const f of a.typischeFehler ?? []) if (f.punkte && zellenGleich(f.punkte, soll)) return 'ein typischer Fehler ist die richtige Ansicht';
      return null;
    }
    if (o?.some((x) => x.bild)) return stufe(o, (t, x) => (x.bild?.art === 'risse' && x.bild.risse.length === 1 ? zellenGleich(x.bild.risse[0].zellen, soll) : undefined));
    return n.wert != null ? mitZahl(a, n, n.wert) : null;
  },
  // Würfel eines Würfelbaus (Bild) oder eines Grundrisses mit Zahlen.
  wuerfelzahl: (n, a) => {
    const b = a.bild, ist = b?.form === 'wuerfelbau' ? b.wuerfel.length : b?.art === 'risse' && b.risse[0].zahlen ? b.risse[0].zahlen.reduce((s, z) => s + z[2], 0) : n.wuerfel ? n.wuerfel.length : null;
    if (ist == null) return 'braucht einen Würfelbau';
    if (ist !== n.wert) return `es sind ${ist} Würfel, nicht ${n.wert}`;
    return mitZahl(a, n, n.wert);
  },
  // Schrägbild eines Quaders im Gitter: Ecken, gezeichnete Kanten, verdeckte Kanten gestrichelt, fehlende Kante oder Ecke. Oder Maße im Heft.
  schraegbild: (n, a) => {
    const { a: la, b: lb, c: lc } = n, P = (e) => [n.o[0] + 2 * la * QE[e][0] + lb * QE[e][1], n.o[1] + 2 * lc * QE[e][2] + lb * QE[e][1]];
    if (n.frage) {
      const soll = { tiefe: lb, breite: 2 * la + lb, hoehe: 2 * lc + lb }[n.frage];
      if (soll !== n.wert) return `${n.frage} im Schrägbild ist ${soll} Kästchen, nicht ${n.wert}`;
      return mitZahl(a, n, n.wert);
    }
    const g = gitterVon(a);
    if (!g) return 'braucht ein Gitter';
    const gezeichnet = n.kanten ?? QUADERKANTEN.filter((k) => !n.kante || !kanteGleich(k, n.kante));
    const linien = g.linien ?? [];
    if (linien.length !== gezeichnet.length) return `im Gitter sind ${linien.length} Kanten, erwartet ${gezeichnet.length}`;
    for (const k of gezeichnet) {
      const l = linien.find((x) => (pGleich(x.a, P(k[0])) && pGleich(x.b, P(k[1]))) || (pGleich(x.a, P(k[1])) && pGleich(x.b, P(k[0]))));
      if (!l) return `die Kante ${k} fehlt im Gitter`;
      const verdeckt = [...VERDECKT].some((v) => kanteGleich(k, v));
      if ((l.stil === 'verdeckt') !== verdeckt) return `die Kante ${k} ist ${verdeckt ? 'verdeckt und muss gestrichelt sein' : 'sichtbar und darf nicht gestrichelt sein'}`;
    }
    for (const p of g.punkte ?? []) if (p.n && QE[p.n] && !pGleich([p.x, p.y], P(p.n))) return `der Name ${p.n} steht an der falschen Ecke`;
    if (n.kante) {
      const b = a.bedingung, soll = [P(n.kante[0]), P(n.kante[1])];
      if (b?.art !== 'strecke' || !((pGleich(b.a, soll[0]) && pGleich(b.b, soll[1])) || (pGleich(b.a, soll[1]) && pGleich(b.b, soll[0])))) return `die Bedingung ist nicht die Kante ${n.kante}`;
      for (const f of a.typischeFehler ?? []) if (f.bedingung?.art === 'strecke' && ((pGleich(f.bedingung.a, soll[0]) && pGleich(f.bedingung.b, soll[1])) || (pGleich(f.bedingung.a, soll[1]) && pGleich(f.bedingung.b, soll[0])))) return 'ein typischer Fehler ist die richtige Kante';
    }
    if (n.ecke) {
      if (!Array.isArray(a.loesung) || a.loesung.length !== 1 || !pGleich(a.loesung[0], P(n.ecke))) return `die Lösung ist nicht die Ecke ${n.ecke}`;
      for (const f of a.typischeFehler ?? []) if (f.punkte?.length === 1 && pGleich(f.punkte[0], P(n.ecke))) return 'ein typischer Fehler ist die richtige Ecke';
    }
    return null;
  },
  // Form einer Ansicht eines Körpers (Kreis, Rechteck, Dreieck …).
  ansichtform: (n, a) => {
    let soll = ANSICHTFORM(n.form, n.n, n.von, n.liegend);
    if (n.form === 'quader') { const q = n.quader ?? a.bild; const [x, y] = { vorne: [q.a, q.c], oben: [q.a, q.b], links: [q.b, q.c] }[n.von]; soll = x === y ? 'Quadrat' : 'Rechteck'; }
    if (!soll) return 'unbekannte Ansicht';
    const o = optionenVon(a, n);
    return o ? stufe(o, (t) => (/^(Kreis|Rechteck|Quadrat|Dreieck|Fünfeck|Sechseck|Achteck)$/.test(t) ? t === soll : undefined)) : null;
  },
  // Form einer Fläche des Quaders im Bild.
  flaechenform: (n, a) => {
    const q = a.bild;
    if (q?.form !== 'quader' || !istFlaeche(n.flaeche)) return 'braucht einen Quader und eine seiner Flächen';
    const [i] = flaechenLage(n.flaeche), d = [q.a, q.b, q.c].filter((_, j) => j !== i), soll = d[0] === d[1] ? 'Quadrat' : 'Rechteck';
    if (!(q.markiert?.flaechen ?? []).some((f) => f.length === 4 && f.every((e) => n.flaeche.includes(e)))) return 'die Fläche ist im Bild nicht markiert';
    return stufe(optionenVon(a, n), (t) => (/^(Kreis|Rechteck|Quadrat|Dreieck)$/.test(t) ? t === soll : undefined));
  },
  // Wie viele Kanten eines Quaders eine bestimmte Länge haben.
  kantenzahl: (n, a) => {
    const q = quaderVon(a, n);
    if (!q) return 'braucht einen Quader';
    const ist = QUADERKANTEN.filter((k) => laengeVon(q, k) === n.laenge).length;
    if (ist !== n.wert) return `${ist} Kanten sind ${n.laenge} cm lang, nicht ${n.wert}`;
    if (!n.quader && !(q.masse ?? []).some((m) => zahlenIn(m.t).includes(n.laenge)) && !a.text.includes(String(n.laenge))) return `die Länge ${n.laenge} cm steht nicht im Bild`;
    return mitZahl(a, n, n.wert);
  },
  // Länge einer Kante des Quaders.
  kantenlaenge: (n, a) => {
    const q = quaderVon(a, n);
    if (!q || !istKante(n.kante)) return 'braucht einen Quader und eine seiner Kanten';
    if (laengeVon(q, n.kante) !== n.wert) return `${n.kante} ist ${laengeVon(q, n.kante)} cm lang, nicht ${n.wert}`;
    return mitZahl(a, n, n.wert);
  },
  // Lage von Kanten zu einer Kante: parallel, senkrecht (mit gemeinsamer Ecke) oder gleich lang.
  kantenlage: (n, a) => {
    const q = quaderVon(a, n);
    if (!istKante(n.zu)) return `${n.zu} ist keine Kante`;
    const r = richtung(n.zu);
    return stufe(optionenVon(a, n), (t) => {
      if (!istKante(t) || kanteGleich(t, n.zu)) return undefined;
      if (n.lage === 'parallel') return richtung(t) === r;
      if (n.lage === 'senkrecht') return richtung(t) !== r && [...t].some((e) => n.zu.includes(e));
      return q ? laengeVon(q, t) === laengeVon(q, n.zu) : undefined;
    });
  },
  // Flächen des Quaders: gegenüber oder benachbart.
  quaderflaeche: (n, a) => {
    if (n.lage === 'verdeckt') return stufe(optionenVon(a, n), (t) => (istFlaeche(t) ? t.includes('D') : undefined)); // verdeckt sind die Flächen an der Ecke D
    if (!istFlaeche(n.zu)) return `${n.zu} ist keine Fläche`;
    const [i, w] = flaechenLage(n.zu);
    return stufe(optionenVon(a, n), (t) => {
      if (!istFlaeche(t) || t === n.zu) return undefined;
      const [j, v] = flaechenLage(t), gegen = i === j && w !== v;
      return n.lage === 'gegenueber' ? gegen : !gegen && i !== j;
    });
  },
  // Ist eine Kante des Quaders im Schrägbild verdeckt? Antworten: „verdeckt“/„gestrichelt“ oder „sichtbar“/„sieht“.
  kantensicht: (n, a) => {
    if (!istKante(n.kante)) return `${n.kante} ist keine Kante`;
    const verdeckt = [...VERDECKT].some((v) => kanteGleich(n.kante, v));
    return stufe(optionenVon(a, n), (t) => (/verdeckt|gestrichelt/.test(t) ? verdeckt : /sichtbar|sieht/.test(t) ? !verdeckt : undefined));
  },
  // Welche Ecke des Quaders ist verdeckt? Nur D.
  eckensicht: (n, a) => stufe(optionenVon(a, n), (t) => (QE[t] ? t === 'D' : undefined)),
  // Richtig gezeichnetes Schrägbild: verdeckte Kanten gestrichelt, Tiefe eine halbe Kästchendiagonale je cm. Bildkarten oder das Bild der Aufgabe.
  darstellung: (n, a) => {
    const richtig = (b) => b?.art === 'koerper' && (b.verdeckt ?? 'gestrichelt') === 'gestrichelt' && (b.tiefe ?? 0.5) === 0.5;
    const o = optionenVon(a, n);
    if (o?.some((x) => x.bild)) return stufe(o, (t, x) => (x.bild ? richtig(x.bild) : undefined));
    if (n.stimmt != null && n.stimmt !== richtig(a.bild)) return n.stimmt ? 'das Bild ist falsch gezeichnet' : 'das Bild ist doch richtig gezeichnet';
    return null;
  },
  // Verdeckte Ecken, Kanten oder Flächen im Schrägbild.
  sichtbar: (n, a) => {
    const s = sichtbar(a.bild ?? {});
    if (!s) return 'braucht einen eckigen Körper im Bild';
    const ist = n.verdeckt === false ? s.alle[n.was] - s[n.was] : s[n.was];
    if (ist !== n.wert) return `im Bild sind ${ist} ${n.was} ${n.verdeckt === false ? 'sichtbar' : 'verdeckt'}, nicht ${n.wert}`;
    return mitZahl(a, n, n.wert);
  },
  // Eigenschaften von Körpern: Antworten sind Namen, Gegenstände, Körperbilder oder Netze (nur faltbare zählen).
  eigenschaft: (n, a) => {
    const liste = EIGENSCHAFT[n.welche];
    if (!liste) return `unbekannte Eigenschaft ${n.welche}`;
    const formVon = (t, x) => (x.bild ? (x.bild.art === 'netz' ? (netzFalten(x.bild)?.faltbar ? netzFalten(x.bild).form : 'keine') : formVonBild(x.bild)?.form) : formDesGegenstands(t) ?? koerperIn(t)?.form);
    return stufe(optionenVon(a, n), (t, x) => { const f = formVon(t, x); return f == null ? undefined : liste.includes(f); });
  },
  // Teile eines Netzes im Bild zählen: Flächen mit `ecken` Ecken (3 Dreiecke, 4 Vierecke), Kreise (`kreise: true`) oder alle Flächen.
  netzteile: (n, a) => {
    const b = a.bild;
    if (b?.art !== 'netz') return 'braucht ein Netz im Bild';
    const f = b.flaechen ?? [], k = b.kreise ?? [], sek = b.sektoren ?? [];
    const ist = n.kreise ? k.length : n.ecken ? f.filter((x) => x.ecken.length === n.ecken).length : f.length + k.length + sek.length;
    if (ist !== n.wert) return `im Netz sind ${ist}, nicht ${n.wert}`;
    return mitZahl(a, n, n.wert);
  },
  // Spielwürfel kippen: Augen oben, vorne, rechts; gegenüber ergeben zusammen 7.
  kippen: (n, a) => {
    let { oben, vorne, rechts } = n.start;
    if (new Set([oben, vorne, rechts, 7 - oben, 7 - vorne, 7 - rechts]).size !== 6) return 'kein Spielwürfel';
    if (a.bild?.augen && (a.bild.augen.oben !== oben || a.bild.augen.vorne !== vorne || a.bild.augen.rechts !== rechts)) return 'das Bild zeigt andere Augen';
    for (const r of n.schritte) {
      if (r === 'rechts') [oben, rechts] = [7 - rechts, oben];
      else if (r === 'links') [oben, rechts] = [rechts, 7 - oben];
      else if (r === 'vorne') [oben, vorne] = [7 - vorne, oben];
      else if (r === 'hinten') [oben, vorne] = [vorne, 7 - oben];
      else return `unbekannte Richtung ${r}`;
    }
    const ist = { oben, vorne, rechts }[n.frage];
    if (ist !== n.wert) return `nach dem Kippen liegt ${ist} ${n.frage}, nicht ${n.wert}`;
    return mitZahl(a, n, n.wert);
  },
};
export const KOERPER_ERGEBNIS = Object.fromEntries(Object.keys(KOERPER_SONDER).map((k) => [k, (n) => (n.wert != null ? n.wert : [])]));
export const KOERPER_ARTEN = Object.keys(KOERPER_SONDER);
export const setzeUrteil = (a) => { mitUrteil = (a.nachweis ?? []).some((n) => n?.art === 'urteil'); };

// ---------- Bilder ----------
export function koerperBildZahlen(b) {
  if (b.art === 'koerper') return [b.a, b.b, b.c, b.n, b.form === 'wuerfelbau' ? b.wuerfel.length : null, ...(b.masse ?? []).flatMap((m) => zahlenIn(m.t)), ...Object.values(b.augen ?? {})].filter((x) => x != null);
  if (b.art === 'netz') return (b.flaechen ?? []).filter((f) => /^\d+$/.test(String(f.n ?? ''))).map((f) => Number(f.n));
  if (b.art === 'risse') return b.risse.flatMap((r) => (r.zahlen ?? []).map((z) => z[2]));
  return [];
}
export function koerperBildMaengel(b) {
  const m = [];
  if (b.art === 'koerper') {
    if (!FORMEN.includes(b.form)) return [`unbekannte Form ${b.form}`];
    if (b.form === 'quader') {
      if (![b.a, b.b, b.c].every((x) => Number.isInteger(x) && x >= 1 && x <= 12)) m.push('Quader braucht ganze Maße von 1 bis 12 cm');
      for (const x of b.masse ?? []) {
        const k = `${x.von}${x.bis}`;
        if (!istKante(k)) m.push(`Maß an ${k}: keine Kante`);
        else if (zahlenIn(x.t)[0] !== laengeVon(b, k)) m.push(`Maß an ${k}: ${x.t}, die Kante ist ${laengeVon(b, k)} cm lang`);
      }
      for (const k of b.markiert?.kanten ?? []) if (!istKante(k.join(''))) m.push(`markierte Kante ${k.join('')} gibt es nicht`);
      for (const f of b.markiert?.flaechen ?? []) if (!istFlaeche(f.join(''))) m.push(`markierte Fläche ${f.join('')} gibt es nicht`);
      for (const e of b.markiert?.ecken ?? []) if (!QE[e]) m.push(`markierte Ecke ${e} gibt es nicht`);
      if (b.augen) { const z = [b.augen.oben, b.augen.vorne, b.augen.rechts]; if (!z.every((x) => Number.isInteger(x) && x >= 1 && x <= 6) || new Set([...z, ...z.map((x) => 7 - x)]).size !== 6) m.push('Augen: kein Spielwürfel (gegenüber zusammen 7)'); }
    } else if (b.form === 'prisma' || b.form === 'pyramide') {
      if (!Number.isInteger(b.n) || b.n < 3 || b.n > 8) m.push('n muss 3 bis 8 sein');
      if (!(b.r > 0) || !(b.h > 0)) m.push('Radius und Höhe fehlen');
      if (b.masse?.length || b.augen) m.push('Maße und Augen gibt es nur am Quader');
    } else if (b.form === 'wuerfelbau') {
      const s = new Set((b.wuerfel ?? []).map(schl));
      if (!b.wuerfel?.length || s.size !== b.wuerfel.length) m.push('Würfelbau: Würfel fehlen oder doppelt');
      for (const [x, y, z] of b.wuerfel ?? []) if (![x, y, z].every((v) => Number.isInteger(v) && v >= 0) || (z > 0 && !s.has(schl([x, y, z - 1])))) { m.push(`Würfel (${x}|${y}|${z}) schwebt`); break; }
    } else if (!(b.r > 0) || (b.form !== 'kugel' && !(b.h > 0))) m.push('Radius oder Höhe fehlt');
    if (b.verdeckt && !['gestrichelt', 'ohne', 'durchgezogen'].includes(b.verdeckt)) m.push(`unbekannte Darstellung verdeckter Kanten ${b.verdeckt}`);
    if (b.tiefe != null && b.tiefe !== 0.5 && !b.fehlerbild) m.push('verkürzte Tiefe nur im Fehlerbild');
  } else if (b.art === 'netz') {
    const f = b.flaechen ?? [];
    if (!f.length && !(b.kreise ?? []).length) m.push('Netz ohne Flächen');
    for (const x of f) if (!Array.isArray(x.ecken) || x.ecken.length < 3 || !x.ecken.every((p) => p.every(Number.isFinite))) m.push('Netz: Fläche mit weniger als 3 Ecken');
    // Einheitsquadrate dürfen sich nicht überlappen.
    const quadrate = f.filter((x) => istRechteck(x.ecken)).map((x) => schl([Math.min(...x.ecken.map((p) => p[0])), Math.min(...x.ecken.map((p) => p[1])), Math.max(...x.ecken.map((p) => p[0])), Math.max(...x.ecken.map((p) => p[1]))]));
    if (new Set(quadrate).size !== quadrate.length) m.push('Netz: zwei Flächen liegen aufeinander');
    for (const k of [...(b.kreise ?? []), ...(b.sektoren ?? [])]) if (!(k.r > 0)) m.push('Netz: Kreis ohne Radius');
  } else if (b.art === 'risse') {
    for (const r of b.risse ?? []) {
      if (!r.zellen?.length || !r.zellen.every(([x, y]) => x >= 0 && y >= 0 && x < r.b && y < r.h)) m.push(`Riss ${r.n ?? ''}: Kästchen außerhalb`);
      for (const [x, y, z] of r.zahlen ?? []) if (!r.zellen.some((p) => p[0] === x && p[1] === y) || !(z >= 1)) m.push(`Riss ${r.n ?? ''}: Zahl ${z} steht nicht in einem Kästchen`);
      if (r.n && !/^von (vorne|oben|links|rechts|hinten)$/.test(r.n)) m.push(`Riss: Name „${r.n}“ nennt keine Richtung`);
    }
  }
  return m;
}

// ---------- Sprache ----------
// Operator am Satzanfang (Abgleich mit der Niveauübersicht, ab Kapitel 3 eine Prüfregel): keine Frage mit Fragezeichen im Aufgabentext.
// Zitate in „…“ dürfen Fragen sein. Die Ansicht von der Seite heißt immer „von links“.
export function koerperSprachMaengel(a) {
  const m = [], texte = [a.text, ...(a.teile ?? []).map((t) => t.text)].filter(Boolean);
  for (const t of texte) if (/\?/.test(t.replace(/„[^“]*“/g, ''))) m.push(`Operator am Satzanfang: keine Frage mit Fragezeichen („${t.replace(/\n/g, ' / ').slice(0, 60)}“)`);
  const alle = [a.text, ...(a.optionen ?? []).map((o) => o.text), ...Object.values(a.hilfen ?? {})].join(' ');
  if (/Ansicht von der Seite|von der Seite/.test(alle) && !/von links/.test(alle)) m.push('Seitenansicht heißt „von links“');
  if (/Kegel/.test(a.text) && /Ecken/.test(a.text) && !/keine Ecke/.test(a.text)) m.push('am Kegel werden keine Ecken gezählt (Festlegung: Spitze)');
  return m;
}
