// Gemeinsame Bausteine der Erzeuger zu Klasse 6, Kapitel 3 „Körper“ (ADR 0045).
// Grilling mit Nils (2026-11-25): Schrägbild in 45°, 1 cm Tiefe ist eine Kästchendiagonale, verdeckte Kanten gestrichelt.
// Die Ecken des Quaders heißen unten A, B, C, D gegen den Uhrzeigersinn, vorne links beginnend, oben E, F, G, H.
// Bildkarten: Auswahl mit Bildern, die Antworten heißen A, B, C … in der Reihenfolge, in der sie gezeigt werden.
// Operator am Satzanfang (ab Kapitel 3 eine Prüfregel): keine Frage mit Fragezeichen, sondern „Gib an, …“, „Kreuze an.“, „Zeichne …“.
import { zz, wahl, mische, suche, Z, opt, auswahl as auswahlRoh, zahl as zahlRoh, luecken as lueckenRoh, sach, teil, teilWahl, zuordnen, ordnen,
  gitterPunkte, gitterZellen, gitterLinie, GT, PT, LN, FG, B, kind, zweiKinder, U } from '../werkzeug.mjs';
import { faltung, istWuerfelnetz } from '../../src/schueler/geo.js';

export { zz, wahl, mische, suche, Z, opt, sach, teil, teilWahl, zuordnen, ordnen, gitterPunkte, gitterZellen, gitterLinie, GT, PT, LN, FG, B, kind, zweiKinder, U, istWuerfelnetz, faltung };
const STUFE = { F: 0, G: 1, M: 2, E: 3 };
export const stufe = (n) => STUFE[n];
// Hilfekärtchen: F und G Tipp, Beispiel, Lösungsschritt; M Tipp und Lösungsschritt; E nur der Tipp.
export const H = (n, tipp, beispiel, schritt) => (STUFE[n] <= 1 ? { tipp, beispiel, loesungsschritt: schritt } : STUFE[n] === 2 ? { tipp, loesungsschritt: schritt ?? beispiel } : { tipp });
// Typische Fehler als [[wert, fehlvorstellung]]: nie die Lösung, nie doppelt, nie 0 oder negativ.
export const fehler = (loesung, liste) => liste.filter(([w], i, l) => w !== loesung && w > 0 && Number.isInteger(w) && l.findIndex(([x]) => x === w) === i).map(([wert, fehlvorstellung]) => ({ wert, fehlvorstellung }));
export const zahl = (text, loesung, fl, hilfen, extra) => zahlRoh(text, loesung, fehler(loesung, fl ?? []), hilfen, extra);
export const lk = (loesung, fl = []) => [loesung, fehler(loesung, fl)];
export const luecken = lueckenRoh;
export const auswahl = auswahlRoh;

// ---------- Nachweise (tools/pruefe-koerper.mjs rechnet sie unabhängig nach) ----------
export const KZ = (form, was, wert, extra = {}) => ({ art: 'koerperzahl', form, was, wert, ...extra }); // extra: n, teil, luecke, bild
export const KA = (form, extra = {}) => ({ art: 'koerperart', form, ...extra }); // extra: n, gegenstand, teil, bild
export const NETZ = (ziel, extra = {}) => ({ art: 'netz', ziel, ...extra }); // extra: faltbar, teil
export const GEGEN = (flaeche, extra = {}) => ({ art: 'gegenueber', flaeche, ...extra }); // extra: gegen, welche
export const ANSICHT = (von, extra = {}) => ({ art: 'ansicht', von, ...extra }); // extra: wuerfel, quader, wert, teil
export const WZ = (wert, extra = {}) => ({ art: 'wuerfelzahl', wert, ...extra });
export const SB = (a, b, c, o, extra = {}) => ({ art: 'schraegbild', a, b, c, o, ...extra }); // extra: kante, ecke, kanten, frage, wert
export const AF = (form, von, extra = {}) => ({ art: 'ansichtform', form, von, ...extra });
export const KIPP = (start, schritte, wert) => ({ art: 'kippen', start, schritte, frage: 'oben', wert });
export const SICHT = (was, wert, extra = {}) => ({ art: 'sichtbar', was, verdeckt: true, wert, ...extra });
export const KL = (kante, wert, extra = {}) => ({ art: 'kantenlaenge', kante, wert, ...extra });
export const LAGE = (zu, lage, extra = {}) => ({ art: 'kantenlage', zu, lage, ...extra }); // lage: parallel, senkrecht, gleich
export const QF = (zu, lage) => ({ art: 'quaderflaeche', zu, lage }); // lage: gegenueber, nachbar

// ---------- Körperbilder ----------
export const quader = (a, b, c, o = {}) => ({ art: 'koerper', form: 'quader', a, b, c, ...o });
export const wuerfelBild = (a, o = {}) => quader(a, a, a, o);
// Prismen: dreiseitig liegend wie ein Zelt, sonst stehend. Pyramiden: dreiseitig leicht gedreht, damit man sie räumlich sieht.
// Drehungen so gewählt, dass keine Seitenfläche fast flach von der Kante her zu sehen ist (geprüft im Bilderbogen).
export const prisma = (n, o = {}) => (n === 3 && o.liegend !== false ? { art: 'koerper', form: 'prisma', n, r: 1.2, h: 4, liegend: true, ...o } : { art: 'koerper', form: 'prisma', n, r: 1.5, h: n >= 6 ? 2.5 : 3, ...(n === 6 ? { dreh: 10 } : {}), ...o, liegend: undefined });
export const pyramide = (n, o = {}) => ({ art: 'koerper', form: 'pyramide', n, r: 1.6, h: 3, ...({ 3: { dreh: -25 }, 5: { dreh: -10 }, 6: { dreh: 20 } }[n] ?? {}), ...o });
export const rund = (form, o = {}) => ({ art: 'koerper', form, r: 1.5, ...(form === 'kugel' ? {} : { h: form === 'kegel' ? 3 : 3 }), ...o });
export const bau = (wuerfel, o = {}) => ({ art: 'koerper', form: 'wuerfelbau', wuerfel, ...o });
export const ohneUndefined = (b) => JSON.parse(JSON.stringify(b));

export const SEITIG = { 3: 'dreiseitig', 4: 'vierseitig', 5: 'fünfseitig', 6: 'sechsseitig', 8: 'achtseitig' };
export const ECK = { 3: 'Dreieck', 4: 'Viereck', 5: 'Fünfeck', 6: 'Sechseck', 8: 'Achteck' };
export const prismaName = (n) => `${SEITIG[n]}es Prisma`;
export const pyramidenName = (n) => `${SEITIG[n]}e Pyramide`;
export const PRISMA = { ecken: (n) => 2 * n, kanten: (n) => 3 * n, flaechen: (n) => n + 2 };
export const PYRAMIDE = { ecken: (n) => n + 1, kanten: (n) => 2 * n, flaechen: (n) => n + 1 };

// ---------- Würfelnetze ----------
// Die 11 Würfelnetze als Kästchen [x, y]. 1-4-1: sechs Netze, 2-3-1: drei, 2-2-2 und 3-3: je eins.
export const WUERFELNETZE = [
  ...[[0, 0], [0, 1], [0, 2], [0, 3], [1, 1], [1, 2]].map(([o, u]) => [[0, 1], [1, 1], [2, 1], [3, 1], [o, 2], [u, 0]]),
  ...[1, 2, 3].map((u) => [[0, 2], [1, 2], [1, 1], [2, 1], [3, 1], [u, 0]]),
  [[0, 2], [1, 2], [1, 1], [2, 1], [2, 0], [3, 0]],
  [[0, 1], [1, 1], [2, 1], [2, 0], [3, 0], [4, 0]],
];
export const KREUZ = [[1, 0], [1, 1], [1, 2], [1, 3], [0, 2], [2, 2]];
for (const n of WUERFELNETZE) if (!istWuerfelnetz(n)) throw new Error(`kein Würfelnetz: ${JSON.stringify(n)}`);
const schl = (p) => `${p[0]},${p[1]}`;
export const normiere = (zellen) => { const x0 = Math.min(...zellen.map((p) => p[0])), y0 = Math.min(...zellen.map((p) => p[1])); return zellen.map(([x, y]) => [x - x0, y - y0]); };
// Drehen (Vierteldrehung) und Spiegeln, damit dasselbe Netz verschieden aussieht.
export const dreheZellen = (zellen, mal = 1) => { let z = zellen; for (let i = 0; i < mal; i++) z = z.map(([x, y]) => [y, -x]); return normiere(z); };
export const spiegleZellen = (zellen) => normiere(zellen.map(([x, y]) => [-x, y]));
export const zufallsLage = (zellen) => { let z = dreheZellen(zellen, zz(0, 3)); if (zz(0, 1)) z = spiegleZellen(z); return z; };
export const zusammenhaengend = (zellen) => {
  const frei = new Set(zellen.map(schl)), gesehen = new Set([schl(zellen[0])]), liste = [zellen[0]];
  while (liste.length) { const [x, y] = liste.pop(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = schl([x + dx, y + dy]); if (frei.has(k) && !gesehen.has(k)) { gesehen.add(k); liste.push([x + dx, y + dy]); } } }
  return gesehen.size === zellen.length;
};
// Sechs Kästchen, die zusammenhängen, aber kein Würfelnetz sind: Ein Kästchen eines Netzes wandert an eine andere Stelle.
export function keinNetz() {
  return suche(() => {
    const n = wahl(WUERFELNETZE), weg = zz(0, 5), rest = n.filter((_, i) => i !== weg);
    const rand = [];
    for (const [x, y] of rest) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const p = [x + dx, y + dy]; if (!rest.some((q) => schl(q) === schl(p)) && !rand.some((q) => schl(q) === schl(p))) rand.push(p); }
    return normiere([...rest, wahl(rand)]);
  }, (z) => zusammenhaengend(z) && !istWuerfelnetz(z) && Math.max(...z.map((p) => p[0])) <= 4 && Math.max(...z.map((p) => p[1])) <= 4);
}
// Netzbild aus Kästchen. namen: je Kästchen ein Name oder null, farben: je Kästchen eine Farbe (1, 2) oder null.
export const netzBild = (zellen, { namen = null, farben = null, groesse = 1 } = {}) => ({
  art: 'netz', flaechen: zellen.map(([x, y], i) => ({ ecken: [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]].map(([u, v]) => [u * groesse, v * groesse]), ...(namen?.[i] != null ? { n: namen[i] } : {}), ...(farben?.[i] != null ? { farbe: farben[i] } : {}) })),
});
// Gegenüberliegende Kästchen eines Würfelnetzes (zum Bauen der Aufgaben; der Prüfer faltet selbst).
export function gegenueberVon(zellen, i) {
  const f = faltung(zellen), [x, y, z] = f[i].split(',').map(Number);
  return f.findIndex((g) => g === [-x, -y, -z].join(','));
}

// ---------- Quadernetze, Prismen- und Pyramidennetze, runde Netze (Einheit Kästchen) ----------
const R2 = (x) => Math.round(x * 100) / 100;
const rechteck = (x, y, b, h, n) => ({ ecken: [[x, y], [x + b, y], [x + b, y + h], [x, y + h]], ...(n != null ? { n } : {}) });
// Quadernetz als Kreuz: Boden a × b in der Mitte, vorne und hinten a × c unten und oben, links und rechts c × b daneben, Deckel a × b ganz oben.
// fehler: 'deckel-falsch' (Deckel neben der Vorderseite), 'zu-kurz' (Seiten zu schmal)
export function quaderNetz(a, b, c, { fehlerArt = null } = {}) {
  const f = [rechteck(c, c, a, b), rechteck(c, 0, a, c), rechteck(c, c + b, a, c), rechteck(0, c, c, b), rechteck(c + a, c, fehlerArt === 'zu-kurz' ? c + 1 : c, b)];
  f.push(fehlerArt === 'deckel-falsch' ? rechteck(c + a, 0, b, c) : rechteck(c, c + b + c, a, b));
  return { art: 'netz', flaechen: f };
}
// Regelmäßiges n-Eck mit der Seite s auf der Strecke p → q (die Ecken laufen links von p → q).
function vieleckAn(p, q, n) {
  const ecken = [p, q];
  let a = p, b = q;
  for (let i = 2; i < n; i++) {
    const d = [b[0] - a[0], b[1] - a[1]], w = (2 * Math.PI) / n, c = [Math.cos(w) * d[0] - Math.sin(w) * d[1], Math.sin(w) * d[0] + Math.cos(w) * d[1]];
    const neu = [b[0] + c[0], b[1] + c[1]]; ecken.push(neu); a = b; b = neu;
  }
  return ecken.map(([x, y]) => [R2(x), R2(y)]);
}
// Prismennetz: n Rechtecke s × h nebeneinander, die Grundflächen an Rechteck `unten` (unten) und `oben` (oben).
// gleicheSeite: beide Vielecke oben (kein Netz). seiten: so viele Rechtecke (zu wenige: kein Netz).
export function prismaNetz(n, s, h, { unten = 0, oben = null, gleicheSeite = false, seiten = n, eckenzahl = n } = {}) {
  const f = [];
  for (let i = 0; i < seiten; i++) f.push(rechteck(i * s, 0, s, h));
  const o = oben ?? Math.min(seiten - 1, Math.floor(seiten / 2)), u2 = (unten + 2) % seiten;
  const darunter = (i) => ({ ecken: vieleckAn([i * s + s, 0], [i * s, 0], eckenzahl) }), darueber = (i) => ({ ecken: vieleckAn([i * s, h], [i * s + s, h], eckenzahl) });
  f.push(darunter(unten), gleicheSeite ? darunter(u2) : darueber(o));
  return { art: 'netz', flaechen: f };
}
// Pyramidennetz (Stern): regelmäßiges n-Eck mit Seite s, an jeder Seite ein gleichschenkliges Dreieck mit Höhe hd. fehlt: so viele Dreiecke fehlen.
export function pyramideNetz(n, s, hd, { fehlt = 0, extra = 0 } = {}) {
  const grund = vieleckAn([0, 0], [s, 0], n), f = [{ ecken: grund }];
  for (let i = 0; i < n - fehlt; i++) {
    const p = grund[i], q = grund[(i + 1) % n], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], d = [q[0] - p[0], q[1] - p[1]], l = Math.hypot(...d), nrm = [d[1] / l, -d[0] / l];
    f.push({ ecken: [q, p, [R2(m[0] + hd * nrm[0]), R2(m[1] + hd * nrm[1])]] });
  }
  for (let i = 0; i < extra; i++) { // ein Dreieck zu viel: an einem Dreieck außen angesetzt
    const t = f[1].ecken, p = t[1], q = t[2], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], d = [q[0] - p[0], q[1] - p[1]], l = Math.hypot(...d), nrm = [d[1] / l, -d[0] / l];
    f.push({ ecken: [q, p, [R2(m[0] + 1.2 * nrm[0]), R2(m[1] + 1.2 * nrm[1])]] });
  }
  return { art: 'netz', flaechen: f };
}
// Zylindernetz: Rechteck (Umfang × Höhe) mit zwei Kreisen. gleicheSeite: beide Kreise oben. umfang: Breite des Rechtecks (falsch, wenn ≠ 2πr).
export function zylinderNetz(r, h, { gleicheSeite = false, umfang = null } = {}) {
  const u = R2(umfang ?? 2 * Math.PI * r), mx = R2(u / 2);
  return { art: 'netz', flaechen: [rechteck(0, 0, u, h)], kreise: [{ m: [gleicheSeite ? R2(mx - r - 0.2) : mx, gleicheSeite ? R2(h + r) : R2(-r)], r }, { m: [gleicheSeite ? R2(mx + r + 0.2) : mx, R2(h + r)], r }] };
}
// Kegelnetz: Kreisausschnitt mit Radius s und Winkel 360 · r : s, darunter der Kreis mit Radius r. falschR: Kreis mit anderem Radius.
export function kegelNetz(r, s, { falschR = null } = {}) {
  const w = R2((360 * r) / s), von = R2(90 - w / 2), bis = R2(90 + w / 2), rk = falschR ?? r;
  return { art: 'netz', sektoren: [{ m: [0, 0], r: s, von, bis }], kreise: [{ m: [0, R2(-rk)], r: rk }] };
}

// ---------- Ansichten von Würfelbauten ----------
// Ein Würfel [x, y, z]: x nach rechts, y nach hinten, z nach oben. Ansicht von vorne: (x, z), von oben: (x, y),
// von links: (größtes y − y, z), denn wer von links schaut, hat vorne rechts. Von rechts: (y, z). Von hinten: (größtes x − x, z).
export function ansicht(wuerfel, von) {
  const mx = Math.max(...wuerfel.map((w) => w[0])), my = Math.max(...wuerfel.map((w) => w[1]));
  const p = { vorne: ([x, , z]) => [x, z], oben: ([x, y]) => [x, y], links: ([, y, z]) => [my - y, z], rechts: ([, y, z]) => [y, z], hinten: ([x, , z]) => [mx - x, z] }[von];
  const m = new Map(); for (const w of wuerfel) { const q = p(w); m.set(schl(q), q); }
  return normiere([...m.values()]).sort((u, v) => u[1] - v[1] || u[0] - v[0]);
}
export const gleicheZellen = (a, b) => { const A = normiere(a).map(schl).sort(), Bz = normiere(b).map(schl).sort(); return A.length === Bz.length && A.every((x, i) => x === Bz[i]); };
export const riss = (n, zellen, zahlen = null) => { const z = normiere(zellen); return { ...(n ? { n } : {}), b: Math.max(...z.map((p) => p[0])) + 1, h: Math.max(...z.map((p) => p[1])) + 1, zellen: z, ...(zahlen ? { zahlen } : {}) }; };
export const risseBild = (...r) => ({ art: 'risse', risse: r });
// Grundriss mit Zahlen: In jedem Kästchen steht, wie viele Würfel dort übereinander stehen.
export function grundrissMitZahlen(wuerfel) {
  const m = new Map(); for (const [x, y] of wuerfel) m.set(schl([x, y]), [x, y, (m.get(schl([x, y]))?.[2] ?? 0) + 1]);
  const z = [...m.values()], x0 = Math.min(...z.map((p) => p[0])), y0 = Math.min(...z.map((p) => p[1]));
  return riss('von oben', z.map(([x, y]) => [x, y]), z.map(([x, y, h]) => [x - x0, y - y0, h]));
}
// Ein Würfelbau aus Türmen: hoehen[y][x] (y = 0 vorne). Höhe 0 heißt: kein Würfel.
export const ausTuermen = (hoehen) => hoehen.flatMap((reihe, y) => reihe.flatMap((h, x) => Array.from({ length: h }, (_, z) => [x, y, z])));
// Zufälliger Würfelbau: höchstens b × t Grundfläche, Türme bis hmax, jeder Turm steht auf dem Boden, alles hängt zusammen.
export function zufallsBau(b, t, hmax, anzahl) {
  return suche(() => ausTuermen(Array.from({ length: t }, () => Array.from({ length: b }, () => (zz(0, 3) ? zz(1, hmax) : 0)))), (w) => w.length === anzahl
    && zusammenhaengend(ansicht(w, 'oben')) && Math.min(...w.map((p) => p[0])) === 0 && Math.min(...w.map((p) => p[1])) === 0);
}
// Würfel, die man im Bild nicht sieht (zum Zählen auf F und G zu vermeiden): verdeckt, wenn vorne, rechts und oben je ein Würfel davor liegt.
export const verdeckteWuerfel = (w) => { const s = new Set(w.map(schl3)); return w.filter(([x, y, z]) => s.has(schl3([x, y - 1, z])) && s.has(schl3([x + 1, y, z])) && s.has(schl3([x, y, z + 1]))).length; };
const schl3 = (p) => p.join(',');

// ---------- Schrägbild im Gitter ----------
// Ein Quader a × b × c (cm) mit der Ecke A im Gitterpunkt o: 1 cm nach rechts oder oben sind 2 Kästchen, 1 cm nach hinten ist eine Kästchendiagonale.
export const ECKEN3 = { A: [0, 0, 0], B: [1, 0, 0], C: [1, 1, 0], D: [0, 1, 0], E: [0, 0, 1], F: [1, 0, 1], G: [1, 1, 1], H: [0, 1, 1] };
export const KANTEN = ['AB', 'BC', 'CD', 'DA', 'EF', 'FG', 'GH', 'HE', 'AE', 'BF', 'CG', 'DH'];
export const VERDECKT = ['CD', 'DA', 'DH'];
export const gitterEcke = (a, b, c, o, n) => { const [x, y, z] = ECKEN3[n]; return [o[0] + 2 * a * x + b * y, o[1] + 2 * c * z + b * y]; };
// Das Gitter mit den Kanten `kanten` (Standard: alle außer `ohne`). namen: Ecken mit Namen zeigen.
export function schraegGitter(a, b, c, { ohne = [], kanten = null, namen = false, rand = 1, extraB = 0, extraH = 0 } = {}) {
  const o = [rand, rand], liste = (kanten ?? KANTEN.filter((k) => !ohne.includes(k)));
  const linien = liste.map((k) => LN(null, gitterEcke(a, b, c, o, k[0]), gitterEcke(a, b, c, o, k[1]), 'strecke', VERDECKT.includes(k) ? 'verdeckt' : 'kante'));
  const pos = { A: 'lu', B: 'ru', C: 'r', D: 'lo', E: 'l', F: 'lu', G: 'ro', H: 'lo' };
  const punkte = namen ? (Array.isArray(namen) ? namen : Object.keys(ECKEN3)).map((n) => { const [x, y] = gitterEcke(a, b, c, o, n); return PT(n, x, y, pos[n]); }) : [];
  return { o, gitter: GT(2 * a + b + 2 * rand + extraB, 2 * c + b + 2 * rand + extraH, { linien, ...(punkte.length ? { punkte } : {}) }) };
}
export const streckeVon = (a, b, c, o, k) => ({ art: 'strecke', a: gitterEcke(a, b, c, o, k[0]), b: gitterEcke(a, b, c, o, k[1]) });

// ---------- Spielwürfel ----------
// Augen oben, vorne, rechts. Gegenüber ergeben zusammen 7. Kippen: nach rechts kommt die linke Fläche nach oben.
export function kippe(w, richtung) {
  const { oben, vorne, rechts } = w;
  if (richtung === 'rechts') return { oben: 7 - rechts, vorne, rechts: oben };
  if (richtung === 'links') return { oben: rechts, vorne, rechts: 7 - oben };
  if (richtung === 'vorne') return { oben: 7 - vorne, vorne: oben, rechts };
  return { oben: vorne, vorne: 7 - oben, rechts };
}
// Ein gültiger Spielwürfel (Augen oben, vorne, rechts paarweise nicht gegenüber).
export const spielwuerfel = () => suche(() => ({ oben: zz(1, 6), vorne: zz(1, 6), rechts: zz(1, 6) }), (w) => new Set([w.oben, w.vorne, w.rechts, 7 - w.oben, 7 - w.vorne, 7 - w.rechts]).size === 6);

// Bildkarten: Antworten mit Bildern, benannt A, B, C … nach dem Mischen. karten: [[bild, richtig, fehlvorstellung?]].
export function bildkarten(text, karten, hilfen, extra = {}) {
  const m = mische(karten);
  const a = auswahlRoh(text, m.map(([bild, richtig, fv], i) => ({ ...opt('ABCDE'[i], richtig, richtig ? undefined : fv), bild: ohneUndefined(bild) })), hilfen, extra);
  // auswahl mischt noch einmal: Namen nach der gezeigten Reihenfolge neu vergeben.
  a.optionen = a.optionen.map((o, i) => ({ ...o, text: 'ABCDE'[i] }));
  return a;
}
export const GEGENSTAENDE = {
  zylinder: ['Dose', 'Kerze', 'Rolle Küchenpapier', 'Trommel', 'Litfaßsäule'],
  kegel: ['Eistüte', 'Partyhut', 'Pylon', 'Turmspitze'],
  kugel: ['Ball', 'Murmel', 'Orange', 'Globus', 'Seifenblase'],
  quader: ['Schuhkarton', 'Ziegelstein', 'Buch', 'Brotdose', 'Schrank'],
  wuerfel: ['Spielwürfel', 'Zuckerwürfel', 'Zauberwürfel', 'Eiswürfel'],
  prisma: ['Zelt', 'Dachbalken'],
  pyramide: ['Turmdach'],
};
