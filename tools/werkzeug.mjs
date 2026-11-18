// Gemeinsames Werkzeug aller Aufgaben-Erzeuger: Zufall mit fester Saat, Bausteine je Aufgabenformat, Bilder, Sammeln der Gruppen.
// Regeln der Niveaustufen: docs/adr/0015-niveaustufen-nach-abschluss.md

export const NIVEAUS = ['F', 'G', 'M', 'E'];
export const PRO_GRUPPE = 6;
// Anforderungsbereiche der sechs Aufgaben je Niveaustufe (ADR 0015).
export const AFB_FOLGE = { F: [1, 1, 1, 1, 2, 1], G: [1, 1, 2, 1, 2, 3], M: [1, 2, 2, 1, 2, 3], E: [1, 2, 2, 3, 2, 3] };
// Auf F und G höchstens drei Antworten zur Auswahl.
export const MAX_OPTIONEN = { F: 3, G: 3, M: 4, E: 5 };

// ---------- Zufall ----------
let saat = 1;
export const setzeSaat = (s) => { saat = s; };
const zufall = () => {
  saat |= 0; saat = (saat + 0x6d2b79f5) | 0;
  let t = Math.imul(saat ^ (saat >>> 15), 1 | saat);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export const zz = (von, bis) => von + Math.floor(zufall() * (bis - von + 1));
export const wahl = (liste) => liste[zz(0, liste.length - 1)];
export const mische = (liste) => {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) { const j = zz(0, i); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
export const suche = (erzeuge, passt) => {
  for (let i = 0; i < 100000; i++) { const x = erzeuge(); if (passt(x)) return x; }
  throw new Error('Keine passenden Zahlen gefunden');
};

// ---------- Zahlen ----------
// Ab fünf Stellen mit geschütztem Leerzeichen gliedern, wie im Schulbuch.
export const fz = (n) => (n >= 10000 ? String(n).replace(/\B(?=(\d{3})+$)/g, ' ') : String(n));
export const nullen = (n) => (String(n).match(/0/g) || []).length;
export const runde = (n, auf) => Math.round(n / auf) * auf;
export const ziffern = (n, laenge = 0) => String(n).padStart(laenge, ' ').split('').map((c) => (c === ' ' ? '' : c));
export const summe = (liste) => liste.reduce((s, x) => s + x, 0);

// Anzahl der Stellen, an denen beim schriftlichen Subtrahieren getauscht werden muss.
export const subUebertraege = (a, b) => {
  let anzahl = 0, u = 0;
  while (a > 0 || b > 0) {
    if (a % 10 < b % 10 + u) { anzahl++; u = 1; } else u = 0;
    a = Math.floor(a / 10); b = Math.floor(b / 10);
  }
  return anzahl;
};
// Anzahl der Überträge beim schriftlichen Addieren.
export const addUebertraege = (...zahlen) => {
  let anzahl = 0, u = 0, rest = [...zahlen];
  while (rest.some((x) => x > 0)) {
    const s = summe(rest.map((x) => x % 10)) + u;
    u = Math.floor(s / 10); if (u > 0) anzahl++;
    rest = rest.map((x) => Math.floor(x / 10));
  }
  return anzahl;
};
// Typischer Fehler: stellenweise immer die kleinere von der größeren Ziffer abziehen.
export const kleinerVonGroesser = (a, b) => {
  let ergebnis = 0, stelle = 1;
  while (a > 0 || b > 0) {
    ergebnis += Math.abs((a % 10) - (b % 10)) * stelle;
    stelle *= 10; a = Math.floor(a / 10); b = Math.floor(b / 10);
  }
  return ergebnis;
};
// Typischer Fehler: tauschen, aber den Übertrag in der nächsten Stelle nicht abziehen.
export const subUebertragVergessen = (a, b) => {
  let ergebnis = 0, stelle = 1;
  while (a > 0 || b > 0) {
    const x = a % 10, y = b % 10;
    ergebnis += (x < y ? x + 10 - y : x - y) * stelle;
    stelle *= 10; a = Math.floor(a / 10); b = Math.floor(b / 10);
  }
  return ergebnis;
};
// Typischer Fehler: stellenweise addieren, ohne die Überträge mitzunehmen.
export const addOhneUebertrag = (...zahlen) => {
  let ergebnis = 0, stelle = 1, rest = [...zahlen];
  while (rest.some((x) => x > 0)) {
    ergebnis += (summe(rest.map((x) => x % 10)) % 10) * stelle;
    stelle *= 10; rest = rest.map((x) => Math.floor(x / 10));
  }
  return ergebnis;
};
export const fehlerliste = (loesung, kandidaten) => {
  const gesehen = new Set([loesung]);
  return kandidaten.filter(([wert]) => {
    if (!Number.isInteger(wert) || wert < 0 || gesehen.has(wert)) return false;
    gesehen.add(wert); return true;
  }).map(([wert, fehlvorstellung]) => ({ wert, fehlvorstellung }));
};

// Rechnet einen Ausdruck aus Zahlen, +, −, ·, : und Klammern aus. Eine Division muss aufgehen.
export function rechne(ausdruck) {
  const t = ausdruck.replace(/[\s\u00a0]/g, '').match(/\d+|[+−·:()]/g) ?? [];
  let i = 0;
  const faktor = () => {
    if (t[i] === '(') { i++; const w = summe_(); if (t[i++] !== ')') throw new Error(`Klammer fehlt: ${ausdruck}`); return w; }
    if (!/^\d+$/.test(t[i] ?? '')) throw new Error(`Kein Rechenausdruck: ${ausdruck}`);
    return Number(t[i++]);
  };
  const produkt = () => {
    let w = faktor();
    while (t[i] === '·' || t[i] === ':') {
      const z = t[i++], r = faktor();
      if (z === ':' && (r === 0 || w % r !== 0)) throw new Error(`Division geht nicht auf: ${ausdruck}`);
      w = z === '·' ? w * r : w / r;
    }
    return w;
  };
  const summe_ = () => {
    let w = produkt();
    while (t[i] === '+' || t[i] === '−') { const z = t[i++], r = produkt(); w = z === '+' ? w + r : w - r; }
    return w;
  };
  const w = summe_();
  if (i !== t.length) throw new Error(`Kein Rechenausdruck: ${ausdruck}`);
  return w;
}
// Nachweis: die Rechnungen, mit denen sich die Lösung aus den Angaben der Aufgabe ergibt. pruefe-pool rechnet sie unabhängig nach.
// Ein Ausdruck ohne Gleichheitszeichen wird ausgerechnet ("58 − 25" wird zu "58 − 25 = 33").
export const N = (...zeilen) => zeilen.filter((z) => z != null && z !== false).map((z) => (typeof z === 'string' && !/[=≈]/.test(z) ? `${z} = ${rechne(z)}` : z));

// Sonderarten im Nachweis für Auswahlaufgaben (tools/pruefe-pool.mjs prüft jede davon selbst nach).
// Urteil über eine Behauptung: U(false, '48 + 17', 55) heißt: „48 + 17 = 55“ wird behauptet, und das ist falsch.
export const U = (stimmt, rechnung, behauptet, rest) => ({ art: 'urteil', stimmt, ...(rechnung != null ? { rechnung, behauptet } : {}), ...(rest != null ? { rest } : {}) });
export const GROESSTES = { art: 'extrem', was: 'groesstes' };
export const KLEINSTES = { art: 'extrem', was: 'kleinstes' };
export const WERT = (wert) => ({ art: 'wert', wert });
export const HILFSZAHL = (zahl, grund) => ({ zahl, grund });
export const UEBERFLUESSIG = (zahl) => ({ zahl, grund: 'überflüssige Angabe' });

export const KINDER = ['Mia', 'Tom', 'Lena', 'Ali', 'Ben', 'Mara', 'Jonas', 'Finn', 'Ida', 'Ole', 'Lina', 'Paul', 'Emre', 'Noah', 'Elif', 'Sara'];
export const kind = () => wahl(KINDER);
export const zweiKinder = () => mische(KINDER).slice(0, 2);

// ---------- Fehlvorstellungen ----------
// beschreibung: für die Diagnose der Lehrkraft. hinweis: Rückmeldung an den Schüler nach dem ersten falschen Versuch.
const fv = (beschreibung, hinweis) => ({ beschreibung, hinweis });
export const fehlvorstellungen = {
  'begriffe-verwechselt': fv('Verwechselt die Fachbegriffe der Rechenart.', 'Schau dir die Fachbegriffe noch einmal an: Welche Zahl steht wo?'),
  'sub-kleiner-von-groesser': fv('Zieht in jeder Stelle die kleinere von der größeren Ziffer ab, statt zu tauschen.', 'Achte auf die Reihenfolge: Es wird immer die untere von der oberen Ziffer abgezogen. Geht das nicht, musst du tauschen.'),
  'sub-uebertrag-vergessen': fv('Tauscht richtig, berücksichtigt den Übertrag in der nächsten Stelle aber nicht.', 'Schau dir deine Überträge noch einmal an. Hast du sie in der nächsten Stelle mitgerechnet?'),
  'sub-addiert': fv('Addiert, statt zu subtrahieren.', 'Schau auf das Rechenzeichen: Hier wird abgezogen.'),
  'sub-klammerfehler': fv('Rechnet a − (b − c) statt a − b − c: Der zweite Subtrahend wird addiert.', 'Jede Zahl hinter einem Minus wird abgezogen. Prüfe, ob du eine davon addiert hast.'),
  'add-uebertrag-vergessen': fv('Addiert stellenweise, berücksichtigt den Übertrag aber nicht.', 'Schau dir deine Überträge noch einmal an. Hast du sie in der nächsten Stelle mitgerechnet?'),
  'add-subtrahiert': fv('Subtrahiert, statt zu addieren.', 'Schau auf das Rechenzeichen: Hier wird addiert.'),
  'stellenwert': fv('Verwechselt Stellenwerte (Einer, Zehner, Hunderter).', 'Prüfe die Stellen: Welche Ziffer steht bei den Einern, welche bei den Zehnern?'),
  'kopf-stellenwert': fv('Verrechnet sich beim Kopfrechnen um eine Stelle.', 'Prüfe die Stellen: Rechnest du mit Einern, Zehnern oder Hundertern?'),
  'ergaenzen-zu-viel': fv('Ergänzt jede Stelle einzeln bis zur vollen Zehn und erhält dadurch zu viel.', 'Nur die Einer werden bis 10 ergänzt. Alle anderen Stellen ergänzt du bis 9.'),
  'geschickt-nicht-ausgeglichen': fv('Rechnet mit der glatten Nachbarzahl, gleicht danach aber nicht aus.', 'Du hast mit einer glatten Zahl gerechnet. Jetzt musst du noch ausgleichen.'),
  'geschickt-falsch-ausgeglichen': fv('Gleicht nach dem Rechnen mit der glatten Nachbarzahl in die falsche Richtung aus.', 'Überlege: Hast du zu viel oder zu wenig gerechnet? In welche Richtung musst du ausgleichen?'),
  'ueberschlag-nicht-gerundet': fv('Rechnet genau, statt mit gerundeten Zahlen zu überschlagen.', 'Du hast genau gerechnet. Beim Überschlag rundest du zuerst und rechnest dann.'),
  'falsch-gerundet': fv('Rundet immer ab, statt nach der Rundungsregel zu runden.', 'Prüfe dein Runden: Bei 5, 6, 7, 8 und 9 wird aufgerundet.'),
  'probe-falsche-umkehr': fv('Wählt für die Probe nicht die Umkehraufgabe.', 'Die Probe macht die Rechnung rückgängig. Sie muss wieder zur ersten Zahl der Aufgabe führen.'),
  'klammer-ignoriert': fv('Rechnet von links nach rechts und beachtet die Klammer nicht.', 'Was in der Klammer steht, wird zuerst berechnet.'),
  'klammer-falsch-gesetzt': fv('Setzt die Klammer an die falsche Stelle.', 'Lies genau: Was soll zuerst zusammengefasst werden? Das gehört in die Klammer.'),
  'gesetz-auf-subtraktion': fv('Überträgt das Vertauschungs- oder Verbindungsgesetz auf die Subtraktion.', 'Die beiden Gesetze gelten nur für die Addition. Rechne beide Seiten aus.'),
  'div-null-vergessen': fv('Lässt eine Null im Quotienten aus.', 'Passt der Divisor einmal nicht hinein, gehört an diese Stelle eine 0 ins Ergebnis.'),
  'div-stellenwert': fv('Irrt sich beim Stellenwert des Quotienten (eine Null zu viel oder zu wenig).', 'Prüfe mit einem Überschlag, wie viele Stellen dein Ergebnis haben muss.'),
  'div-rest-nicht-gedeutet': fv('Berechnet den Quotienten richtig, deutet den Rest aber nicht im Sachzusammenhang.', 'Deine Rechnung stimmt. Überlege jetzt, was mit dem Rest in dieser Situation passiert.'),
  'div-rest-vergessen': fv('Gibt den Rest nicht oder falsch an.', 'Prüfe den Rest: Was bleibt übrig, wenn du Ergebnis mal Divisor vom Dividenden abziehst?'),
  'div-vertauscht': fv('Vertauscht bei der Division die beiden Zahlen.', 'Beim Teilen darfst du die Zahlen nicht tauschen. Die erste Zahl wird geteilt.'),
  'div-falsche-rechenart': fv('Wählt statt der Division eine andere Rechenart.', 'Überlege: Wird hier gerecht verteilt oder in gleiche Gruppen aufgeteilt? Dann wird geteilt.'),
  'div-rest-zu-gross': fv('Lässt einen Rest stehen, der so groß wie der Divisor oder größer ist.', 'Der Rest muss kleiner sein als die Zahl, durch die du teilst. Passt sie noch einmal hinein?'),
  'div-einmaleins': fv('Irrt sich im kleinen Einmaleins.', 'Prüfe mit der Mal-Aufgabe: Ergebnis mal die zweite Zahl muss die erste Zahl ergeben.'),
  'teilbar-summe': fv('Erkennt nicht, dass die Summe zweier Vielfacher wieder ein Vielfaches ist.', 'Zerlege in Päckchen: Was passiert, wenn du zu vollen Päckchen weitere volle Päckchen legst?'),
  '1x1-nachbar': fv('Irrt sich im Einmaleins um eine Reihe (Ergebnis der Nachbaraufgabe).', 'Geh von einer Kernaufgabe aus, zum Beispiel 5 mal. Rechne dann eine Reihe weiter.'),
  '1x1-addiert': fv('Addiert, statt zu multiplizieren.', 'Schau auf das Zeichen ·. Hier wird mal gerechnet, nicht plus.'),
  '1x1-null': fv('Meint, eine Zahl mal 0 ergibt die Zahl selbst.', 'Stell dir 0 Päckchen vor. Wie viel ist dann darin?'),
  'div-durch-sich-selbst': fv('Meint, eine Zahl geteilt durch sich selbst ergibt 0.', 'Verteile 4 Äpfel an 4 Kinder. Wie viele bekommt jedes Kind?'),
  'sach-falsche-rechnung': fv('Wählt eine Rechnung, die nicht zur Situation passt.', 'Lies die Frage noch einmal: Kommt etwas dazu, oder geht etwas weg?'),
  'sach-unnoetige-angabe': fv('Verrechnet eine Angabe, die für die Frage nicht gebraucht wird.', 'Nicht jede Zahl im Text wird gebraucht. Welche Angaben gehören wirklich zur Frage?'),
  'sach-schritt-vergessen': fv('Führt nur einen von mehreren nötigen Rechenschritten aus.', 'Du bist noch nicht fertig: Es fehlt noch ein Rechenschritt.'),
};

// ---------- Bausteine ----------
// Einfache Sprache: jeder Satz in einer eigenen Zeile.
export const Z = (...zeilen) => zeilen.filter((z) => z != null && z !== false).join('\n');
export const h3 = (tipp, beispiel, loesungsschritt) => ({ tipp, beispiel, loesungsschritt });
export const h2 = (tipp, loesungsschritt) => ({ tipp, loesungsschritt });
export const h1 = (tipp) => ({ tipp });

// `extra`: { einheit, bild, nachweis, ziffernfelder }. Als Text gilt es als Einheit (alte Schreibweise).
const mit = (extra) => (typeof extra === 'string' ? { einheit: extra } : Object.fromEntries(Object.entries(extra ?? {}).filter(([, v]) => v != null)));
export const zahl = (text, loesung, typischeFehler, hilfen, extra) => ({ format: 'zahl', text, loesung, typischeFehler: typischeFehler ?? [], hilfen, ...mit(extra) });
export const opt = (text, richtig = false, fehlvorstellung) => ({ text, richtig, ...(fehlvorstellung ? { fehlvorstellung } : {}) });
export const auswahl = (text, optionen, hilfen, extra) => ({
  format: 'auswahl', text, mehrfach: extra === true || extra?.mehrfach === true, optionen: mische(optionen), hilfen,
  ...(typeof extra === 'object' ? mit({ ...extra, mehrfach: undefined }) : {}),
});
const lueckenVon = (werte) => Object.fromEntries(Object.entries(werte).map(([n, w]) => [n, Array.isArray(w) ? { loesung: w[0], typischeFehler: w[1] ?? [] } : { loesung: w, typischeFehler: [] }]));
// Lückentext: Im Text stehen {{name}}, `werte` nennt je Lücke die Lösung oder [Lösung, typische Fehler].
export const luecken = (text, werte, hilfen, extra) => ({ format: 'luecken', text, luecken: lueckenVon(werte), hilfen, ...mit(extra) });
export const L = (name) => ({ luecke: name });
export const tabelle = (text, kopf, zeilen, werte, hilfen, extra) => ({
  format: 'tabelle', text,
  tabelle: { kopf: kopf.map(String), zeilen: zeilen.map((z) => z.map((c) => (typeof c === 'object' ? c : String(c)))) },
  luecken: lueckenVon(werte), hilfen, ...mit(extra),
});
export const teil = (text, loesung, einheit, typischeFehler = []) => ({ format: 'zahl', text, loesung, ...(einheit ? { einheit } : {}), typischeFehler });
export const sach = (text, teile, hilfen, extra) => ({ format: 'sachaufgabe', text, teile, hilfen, ...mit(extra) });
// Säulendiagramm: d = { titel, einheit, max, schritt, hilfslinien?, werteZeigen?, saeulen: [[name, wert]] }
export const diagramm = (text, d, teile, hilfen, extra) => ({ format: 'diagramm', text, diagramm: { ...d, saeulen: d.saeulen.map(([name, wert]) => ({ name, wert })) }, teile, hilfen, ...mit(extra) });
export const zuordnen = (text, paare, hilfen, extra) => ({ format: 'zuordnen', text, paare: paare.map(([links, rechts]) => ({ links: String(links), rechts: String(rechts) })), hilfen, ...mit(extra) });
export const strahl = (eingabe, text, bild, loesung, typischeFehler, hilfen, extra) => ({ format: 'zahlenstrahl', eingabe, text, strahl: bild, loesung, typischeFehler: typischeFehler ?? [], hilfen, ...mit(extra) });

// Stellenraster: schriftliches Rechnen mit einem Feld je Stelle (Niveaustufe F).
// `zeichen` ist '+' oder '−'. Bei einem Tausch oder Übertrag steht er schon im Raster (`hilfe`: true).
const STELLEN = ['E', 'Z', 'H', 'T'];
export function raster(text, zeichen, a, b, hilfen, { hilfe = false, extra } = {}) {
  const unten = Array.isArray(b) ? b : [b];
  if (zeichen === '−' && unten.length !== 1) throw new Error('Raster: Minus nur mit zwei Zahlen');
  const ergebnis = zeichen === '+' ? a + summe(unten) : a - unten[0];
  const n = Math.max(...[a, ...unten, ergebnis].map((x) => String(x).length));
  const stellen = (x) => String(x).padStart(n, '0').split('').map(Number);
  const kopf = ['', ...STELLEN.slice(0, n).reverse()];
  const zeilen = [['', ...ziffern(a, n)]];
  if (hilfe && zeichen === '−') {
    // Getauscht: Wo die obere Ziffer zu klein ist, steht sie um 10 größer, die Stelle links davon um 1 kleiner.
    const oben = stellen(a), u = stellen(unten[0]);
    for (let i = n - 1; i > 0; i--) if (oben[i] < u[i]) { oben[i] += 10; oben[i - 1] -= 1; }
    zeilen.push(['getauscht', ...oben.map((x, i) => (i < n - String(a).length ? '' : x))]);
  }
  for (const x of unten) zeilen.push([zeichen, ...ziffern(x, n)]);
  if (hilfe && zeichen === '+') {
    // Gemerkt: der Zehner aus einer Spalte, eingetragen in der Spalte links daneben.
    const gemerkt = Array(n).fill('');
    let u = 0;
    for (let i = n - 1; i >= 0; i--) {
      const s = summe([a, ...unten].map((x) => stellen(x)[i])) + u;
      u = Math.floor(s / 10); if (u && i > 0) gemerkt[i - 1] = u;
    }
    zeilen.push(['gemerkt', ...gemerkt]);
  }
  const namen = STELLEN.slice(0, n).reverse().map((s) => s.toLowerCase());
  const loesung = stellen(ergebnis);
  zeilen.push(['Ergebnis', ...namen.map((name) => L(name))]);
  const t = tabelle(text, kopf, zeilen, Object.fromEntries(namen.map((name, i) => [name, loesung[i]])), hilfen,
    { nachweis: [`${[a, ...unten].join(` ${zeichen} `)} = ${ergebnis}`], ...extra });
  t.tabelle.art = 'raster';
  t.tabelle.rechnung = { zeichen, zahlen: [a, ...unten], ergebnis };
  return t;
}

// ---------- Bilder ----------
// Jedes Bild ist reine Beschreibung; gezeichnet wird es im Dashboard (src/schueler/bilder.js).
// Ein Wert mit { wert, frage: true } wird als Fragezeichen gezeichnet.
export const frage = (wert) => ({ wert, frage: true });
export const B = {
  tafel: (spalten, plaettchen) => ({ art: 'stellenwerttafel', spalten, plaettchen }),
  material: ({ h = 0, z = 0, e = 0 }, weg = null) => ({ art: 'zehnermaterial', h, z, e, ...(weg ? { weg: { h: weg.h ?? 0, z: weg.z ?? 0, e: weg.e ?? 0 } } : {}) }),
  // `trenn`: nach so vielen Reihen steht eine Lücke (Zerlegen in eine Kernaufgabe und den Rest).
  feld: (reihen, spalten, trenn = 0) => ({ art: 'punktefeld', reihen, spalten, ...(trenn ? { trenn } : {}) }),
  menge: (anzahl, { weg = 0, dazu = 0 } = {}) => ({ art: 'mengenbild', anzahl, ...(weg ? { weg } : {}), ...(dazu ? { dazu } : {}) }),
  gruppen: (gruppen, je, rest = 0) => ({ art: 'gruppenbild', gruppen, je, ...(rest ? { rest } : {}) }),
  streifen: (ganz, teile) => ({ art: 'streifen', ganz, teile }),
  vergleich: (oben, unten, unterschied) => ({ art: 'vergleich', oben, unten, unterschied }),
  zehnerfeld: (belegt, { dazu = 0, felder = 10 } = {}) => ({ art: 'zehnerfeld', felder, belegt, ...(dazu ? { dazu } : {}) }),
  strahl: (s) => ({ art: 'zahlenstrahl', ...s }),
};

// ---------- Aufgaben sammeln ----------
export const aufgaben = [];
const schluessel = (a) => a.text + JSON.stringify(a.optionen?.map((o) => o.text).sort() ?? '') + JSON.stringify([a.strahl, a.tabelle, a.diagramm, a.paare, a.bild].filter(Boolean));
function nachbearbeiten(a, niveau) {
  if (a.optionen) {
    // Einfache Sprache auf F und G: auch in den Antworten steht jeder Satz in einer eigenen Zeile.
    if (niveau === 'F' || niveau === 'G') a.optionen = a.optionen.map((o) => ({ ...o, text: o.text.replace(/(?<=[.?!]) (?=[A-ZÄÖÜ„\d])/g, '\n') }));
    // Zu viele Antworten: zuerst falsche ohne Fehlvorstellung streichen, dann die letzten.
    const max = MAX_OPTIONEN[niveau];
    while (a.optionen.length > max && !a.mehrfach) {
      const weg = a.optionen.findLast((o) => !o.richtig && !o.fehlvorstellung) ?? a.optionen.findLast((o) => !o.richtig);
      a.optionen = a.optionen.filter((o) => o !== weg);
    }
  }
  return a;
}
// Sechs Plätze je Lernziel und Niveaustufe. Jeder Platz ist ein Erzeuger; der Anforderungsbereich folgt aus dem Platz.
export function sechs(lernziel, niveau, plaetze) {
  if (plaetze.length !== PRO_GRUPPE) throw new Error(`${lernziel} ${niveau}: ${plaetze.length} statt ${PRO_GRUPPE} Plätze`);
  const gesehen = new Set();
  plaetze.forEach((erzeuge, i) => {
    for (let versuch = 0; ; versuch++) {
      if (versuch > 300) throw new Error(`Keine neue Aufgabe für ${lernziel} ${niveau}, Platz ${i + 1}`);
      const a = nachbearbeiten(erzeuge(), niveau);
      const k = schluessel(a);
      if (gesehen.has(k)) continue;
      gesehen.add(k);
      aufgaben.push({ id: `${lernziel}-${niveau}-${String(i + 1).padStart(2, '0')}`, lernziel, niveau, afb: AFB_FOLGE[niveau][i], ...a });
      break;
    }
  });
}
// Für Erzeuger, die je Anforderungsbereich Varianten liefern: je[afb](k), k zählt die Aufgaben desselben Bereichs.
export function stufen(lernziel, niveau, je) {
  const folge = AFB_FOLGE[niveau];
  sechs(lernziel, niveau, folge.map((afb, i) => () => je[afb](folge.slice(0, i).filter((x) => x === afb).length)));
}
