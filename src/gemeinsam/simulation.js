// Simulation einer Testklasse (ADR 0028). Reine Logik ohne Dateien und ohne Uhr: Das Administrator-Dashboard ruft
// `schritt(bot, ctx, bis)` im Takt auf und schreibt danach die geänderten Speicherstände in den Klassenordner.
// Simulierte Schüler arbeiten mit derselben Spiellogik wie echte (logik.js), deshalb sieht das Lehrer-Dashboard sie
// wie jede andere Klasse.
//
// Ein Bot ist { code, profil, stand, zufall, naechster (ms), lauf, ende (ms|null), fertig, geaendert, bonus, ignoriert }.
// `lauf` ist die Aufgabe, an der er gerade sitzt: { art, aufgabe, kapitel, beginn, versuch, hilfen, haengt }.
// Holt `schritt` verpasste Zeit nach (der Browser bremst Hintergrund-Tabs), bekommen alle Ereignisse ihre richtige Zeit.

import * as L from '../schueler/logik.js';

const MIN = 60000;

// Profile: wie sicher, wie schnell, wie oft Hilfekärtchen, Hilferuf, Raten, Stille, Hängen.
export const PROFILE = {
  sicher: { text: 'sicher', ziel: 'M', koennen: 0.88, tempo: [25, 70], karten: 0.05, hilferuf: 0, raten: 0, still: 0, haengt: 0, wahl: 0 },
  schnell: { text: 'schnell, unterschätzt sich', ziel: 'M', koennen: 0.95, tempo: [15, 45], karten: 0, hilferuf: 0, raten: 0, still: 0, haengt: 0, wahl: -1 },
  durchschnitt: { text: 'durchschnittlich', ziel: 'M', koennen: 0.72, tempo: [35, 100], karten: 0.2, hilferuf: 0.02, raten: 0, still: 0.01, haengt: 0.01, wahl: 0 },
  wackelig: { text: 'wackelig, braucht oft Kärtchen', ziel: 'G', koennen: 0.55, tempo: [40, 120], karten: 0.5, hilferuf: 0.05, raten: 0, still: 0.01, haengt: 0.03, wahl: 1 },
  raet: { text: 'rät', ziel: 'G', koennen: 0.6, tempo: [30, 90], karten: 0.1, hilferuf: 0, raten: 0.3, still: 0, haengt: 0, wahl: 1 },
  blockiert: { text: 'blockiert oft', ziel: 'G', koennen: 0.42, tempo: [60, 200], karten: 0.6, hilferuf: 0.1, raten: 0, still: 0, haengt: 0.12, wahl: 0 },
  hilferufer: { text: 'ruft oft Hilfe', ziel: 'G', koennen: 0.6, tempo: [40, 110], karten: 0.3, hilferuf: 0.25, raten: 0, still: 0, haengt: 0.02, wahl: 0 },
  traeumer: { text: 'wird oft inaktiv', ziel: 'M', koennen: 0.68, tempo: [40, 120], karten: 0.15, hilferuf: 0.02, raten: 0, still: 0.12, haengt: 0, wahl: 0 },
};
// Reihenfolge der Profile beim Anlegen: Die ersten acht decken jedes Profil ab, danach wird es eine übliche Klasse.
// Gründe der simulierten Hilferufe reihum, ohne Zufall, damit ein Lauf wiederholbar bleibt.
const SIM_GRUENDE = ['schwer', 'verstehe', 'schwer', 'falsch', 'technik', 'verstehe'];
const FOLGE = ['sicher', 'durchschnitt', 'wackelig', 'raet', 'blockiert', 'hilferufer', 'traeumer', 'schnell',
  'durchschnitt', 'sicher', 'durchschnitt', 'wackelig', 'durchschnitt', 'sicher', 'traeumer', 'durchschnitt',
  'wackelig', 'durchschnitt', 'hilferufer', 'sicher', 'durchschnitt', 'blockiert', 'durchschnitt', 'raet', 'wackelig',
  'durchschnitt', 'sicher', 'durchschnitt', 'wackelig', 'durchschnitt'];
const VORNAMEN = ['Ayla', 'Ben', 'Carla', 'David', 'Elif', 'Finn', 'Greta', 'Hamza', 'Ida', 'Jonas', 'Kira', 'Leon', 'Mia', 'Noah', 'Ole',
  'Paula', 'Quentin', 'Rana', 'Samuel', 'Tara', 'Umut', 'Vera', 'Wim', 'Xenia', 'Yusuf', 'Zoe', 'Anton', 'Bela', 'Cem', 'Dana'];

export const ANZAHL_MIN = 5, ANZAHL_MAX = 30, ANZAHL_STANDARD = 25;
export const PROBE_CODES = 3;
export const VORLAUF_WOCHEN = [0, 1, 3, 6];
export const DAUERN = [45, 90, null]; // Minuten, null: bis zum Anhalten
export const TEMPI = [1, 3];
export const STUNDE_MIN = 45;

// Wiederholbarer Zufall (mulberry32), je Schüler aus Zufallswert und Code.
export function zufallAus(...teile) {
  let s = 0;
  for (const c of teile.join('|')) s = (Math.imul(s, 31) + c.charCodeAt(0)) | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const zwischen = (z, [a, b]) => a + z() * (b - a);
const iso = (ms) => new Date(ms).toISOString();

// Die simulierten Schüler einer neuen Testklasse: [{ name, profil }].
export function besetzung(anzahl) {
  const n = Math.max(ANZAHL_MIN, Math.min(ANZAHL_MAX, Math.round(Number(anzahl) || ANZAHL_STANDARD)));
  return Array.from({ length: n }, (_, i) => ({ name: VORNAMEN[i], profil: FOLGE[i] }));
}
export const notizFuer = (profil) => `Simulierter Schüler, Profil: ${PROFILE[profil]?.text ?? profil}`;

export function neuerBot(code, profil, stand, zufallswert) {
  return { code, profil, stand, zufall: zufallAus(zufallswert, code, stand.versuche.length), naechster: 0, lauf: null, ende: null, fertig: false, geaendert: false, bonus: 0, ignoriert: new Set() };
}
// Nach dem Schließen des Administrator-Dashboards: Der Bot macht dort weiter, wo sein Speicherstand steht. Was damals
// offen war (Aufgabe, Hilferuf), ist vorbei; die Lücke wird nicht nachgeholt.
export function setzeFort(bot, jetzt) {
  const s = bot.stand;
  if (s.hilferuf) L.beendeHilferuf(s, 'erledigt', iso(jetzt));
  s.aktiv = null;
  bot.lauf = null; bot.fertig = false; bot.ende = null; bot.bonus = 0;
  bot.naechster = jetzt + bot.zufall() * MIN;
}

// Beginn einer Simulation: Jeder Schüler fängt in der ersten Minute an und hört zum Ende gestaffelt auf
// (in den letzten zehn Minuten, bei 45 Minuten in den letzten fünf).
export function starteStunde(bots, jetzt, dauerMin) {
  for (const b of bots) {
    setzeFort(b, jetzt);
    b.ende = dauerMin ? jetzt + dauerMin * MIN - b.zufall() * (dauerMin > 45 ? 10 : 5) * MIN : null;
  }
}

const aenderung = (bot, t) => { bot.stand.geaendert = iso(t); bot.geaendert = true; };

// Arbeitet den Bot bis zum Zeitpunkt `bis` ab. ctx: { pool, index, klassendatei, tempo, vorlauf }
export function schritt(bot, ctx, bis) {
  let runden = 0;
  const wann = () => (bot.ende != null ? Math.min(bot.naechster, bot.ende) : bot.naechster);
  while (!bot.fertig && wann() <= bis && runden++ < 500) ereignis(bot, ctx, wann());
}

function ereignis(bot, ctx, t) {
  const s = bot.stand, z = bot.zufall, p = PROFILE[bot.profil] ?? PROFILE.durchschnitt, tempo = ctx.tempo || 1;
  const sek = (x) => (x * 1000) / tempo;
  if (bot.ende != null && t >= bot.ende) {
    if (s.aktiv) { (s.abbrueche ??= []).push({ t: iso(t), aufgabe: s.aktiv.aufgabe, fehlversuche: s.aktiv.fehlversuche, hilfen: s.aktiv.hilfen }); s.aktiv = null; }
    if (s.hilferuf) L.beendeHilferuf(s, 'erledigt', iso(t));
    bot.lauf = null; bot.fertig = true;
    aenderung(bot, t);
    return;
  }
  const einst = L.einstellungen(ctx.klassendatei, bot.code, ctx.pool);
  if (L.gleicheSonderauftragAb(s, einst.sonderauftrag)) { if (bot.lauf?.art === 'sonderauftrag') { bot.lauf = null; s.aktiv = null; } aenderung(bot, t); }

  // Wartet auf Hilfe: Antwortet die Lehrkraft, geht es nach ein bis zwei Minuten weiter, und es klappt danach besser.
  // Im Vorlauf gibt es keine Lehrkraft: Dort ist die Hilfe nach zwei bis vier Minuten da.
  if (s.hilferuf) {
    const antwort = einst.hilfeAntwort;
    const geholfen = (antwort?.zu === s.hilferuf.seit && antwort.status === 'erledigt') || (ctx.vorlauf && t - new Date(s.hilferuf.seit) > zwischen(z, [2, 4]) * MIN);
    if (geholfen) {
      L.beendeHilferuf(s, 'erledigt', iso(t));
      bot.bonus = 0.3;
      aenderung(bot, t);
      bot.naechster = t + sek(zwischen(z, [60, 120]));
    } else bot.naechster = t + 10000 / tempo;
    return;
  }
  // Eine Nachricht der Lehrkraft wird bestätigt.
  if (!ctx.vorlauf && einst.nachricht && s.gelesen !== einst.nachricht.t) { s.gelesen = einst.nachricht.t; aenderung(bot, t); }

  if (bot.lauf) return beendeVersuch(bot, ctx, einst, t);

  // Münzgaben: Der Brief wird geöffnet.
  if (!ctx.vorlauf) {
    const gaben = L.offeneMuenzgaben(s, einst.muenzgaben);
    if (gaben.length) {
      for (const g of gaben) L.oeffneMuenzgabe(s, g, iso(t));
      aenderung(bot, t);
      bot.naechster = t + sek(zwischen(z, [10, 30]));
      return;
    }
  }
  // Still: Der Schüler tut ein paar Minuten nichts, ohne dass sich sein Speicherstand ändert.
  if (z() < p.still) { bot.naechster = t + sek(zwischen(z, [4, 9]) * 60); return; }
  // Spielpause oder ab und zu ein Spiel, wenn es erlaubt ist und die Münzen reichen; ab und zu ein Wappenteil.
  const spielen = einst.spielpause ? 0.5 : 0.04;
  if (z() < spielen) {
    const moegliche = L.SPIELE.filter((sp) => L.spielErlaubt(s, einst, sp.id) === 'ok' && s.muenzen >= sp.preis);
    if (moegliche.length) {
      const sp = moegliche[Math.floor(z() * moegliche.length)];
      if (L.starteMinispiel(s, einst, sp.id) === 'ok') {
        const dauer = sek(sp.sekunden);
        L.trageSpielEin(s, sp.id, Math.round(zwischen(z, [3, 12]) * (0.5 + p.koennen)), iso(t + dauer));
        aenderung(bot, t);
        bot.naechster = t + dauer + sek(zwischen(z, [5, 20]));
        return;
      }
    }
  }
  if (z() < 0.03) {
    const teil = L.WAPPEN_TEILE.filter((w) => w.preis != null && !s.wappen.gekauft.includes(w.id) && w.preis <= s.muenzen).sort((a, b) => a.preis - b.preis)[0];
    if (teil && L.kaufe(s, teil.id) === 'ok') { aenderung(bot, t); bot.naechster = t + sek(zwischen(z, [20, 60])); return; }
  }
  const lauf = waehleAufgabe(bot, ctx, einst, t);
  if (!lauf) { bot.naechster = t + sek(120); return; }
  bot.lauf = lauf;
  s.aktiv = { aufgabe: lauf.aufgabe.id, seit: iso(t), fehlversuche: 0, hilfen: 0 };
  aenderung(bot, t);
  bot.naechster = t + sek(dauerVon(bot, p, lauf));
}

function dauerVon(bot, p, lauf) {
  const z = bot.zufall;
  if (lauf.raet) return zwischen(z, [2, 3]);
  if (lauf.haengt) return zwischen(z, [5.5, 8]) * 60;
  return zwischen(z, p.tempo) * (lauf.versuch > 1 ? 0.6 : 1);
}

// Was als Nächstes dran ist, in der Reihenfolge des Schüler-Dashboards: Sonderauftrag, Rückblick, Einstiegscheck, Meilenstein.
function waehleAufgabe(bot, ctx, einst, t) {
  const s = bot.stand, z = bot.zufall, p = PROFILE[bot.profil] ?? PROFILE.durchschnitt, { index, pool } = ctx;
  const neu = (art, id, extra = {}) => {
    const aufgabe = index.aufgabe.get(id);
    return aufgabe ? { art, aufgabe, beginn: t, versuch: 1, hilfen: 0, raet: p.raten > 0 && z() < p.raten, haengt: z() < p.haengt, ...extra } : null;
  };
  // Sonderauftrag: Starke Schüler erfüllen ihn, schwache lassen ihn teils liegen.
  const auftrag = !ctx.vorlauf && L.offenerSonderauftrag(s, einst.sonderauftrag);
  if (auftrag && !bot.ignoriert.has(auftrag.id)) {
    if (!auftrag.geoeffnet && p.koennen < 0.6 && z() < 0.35) bot.ignoriert.add(auftrag.id);
    else {
      L.oeffneSonderauftrag(s, einst.sonderauftrag, null, iso(t));
      const id = L.naechsteSonderauftragAufgabe(s, einst.sonderauftrag);
      if (id) return neu('sonderauftrag', id);
    }
  }
  // Rückblick: zu Beginn des Tages, wenn Lernziele fällig sind.
  const r = L.rueckblickAngebot(s, index, iso(t));
  if (r) {
    if (r.art === 'neu') L.stelleRueckblick(s, index, einst.zielniveau, iso(t), z);
    const id = L.naechsteRueckblickAufgabe(s);
    if (id) return neu('rueckblick', id);
  }
  const e = L.etappe(pool, index, s, einst);
  if (!e?.milestone) return e ? hoehereKrone(bot, ctx, einst, t, neu) : null;
  const kapitel = e.kapitel;
  // Einstiegscheck: Pflicht, wenn die Lehrkraft es so will, sonst machen ihn die meisten.
  const zustand = L.einstiegsZustand(s, index, kapitel);
  if (zustand === 'offen') {
    if (einst.einstiegPflicht.has(kapitel.id) || z() < 0.7) L.stelleEinstieg(s, index, kapitel, iso(t), z);
    else L.ueberspringeEinstieg(s, kapitel.id, iso(t));
  }
  if (L.einstiegsZustand(s, index, kapitel) === 'laeuft') {
    const id = L.naechsteEinstiegsAufgabe(s, kapitel.id);
    if (id) return neu('einstieg', id, { kapitel: kapitel.id });
  }
  // Am Meilenstein: Kronenwahl beim ersten Mal, dann das nächste Lernziel auf der gewählten Krone.
  const u = e.milestone;
  if (!s.einschaetzung?.[u.id] && !s.versuche.some((v) => !v.einstieg && index.meilensteinVon.get(v.lernziel)?.id === u.id)) {
    const wahl = L.wahlNiveaus(einst.zielniveau);
    const gewaehlt = wahl[Math.max(0, Math.min(wahl.length - 1, wahl.indexOf(einst.zielniveau) + (z() < 0.5 ? p.wahl : 0)))] ?? einst.zielniveau;
    L.setzeNiveau(s, kapitel.id, gewaehlt);
    L.merkeWahl(s, index, u, gewaehlt, iso(t));
  }
  const niveau = L.arbeitsniveau(s, kapitel.id, einst.zielniveau);
  const lz = L.naechstesLernziel(index, s, u, niveau);
  if (!lz) return null;
  const a = L.naechsteAufgabe(index, s, lz.id, L.aufgabenNiveau(s, lz.id, niveau), z);
  return a ? neu('meilenstein', a.id, { kapitel: kapitel.id }) : null;
}

// Alles in den offenen Kapiteln gemeistert: Wie echte Schüler spielt der Bot an einem Meilenstein um die nächsthöhere Krone,
// statt untätig zu werden. Hat er überall Purpur, bleibt er still.
function hoehereKrone(bot, ctx, einst, t, neu) {
  const s = bot.stand, { index, pool } = ctx;
  const zu = einst.gesperrteMeilensteine ?? new Set();
  for (const k of pool.kapitel.filter((x) => einst.offeneKapitel.has(x.id))) {
    for (const u of k.unterkapitel.filter((x) => !x.extra && !zu.has(x.id) && L.milestoneStatus(index, s, x) !== 'leer')) {
      const stufe = L.NIVEAUS.indexOf(L.krone(index, s, u) ?? einst.zielniveau);
      if (stufe >= 3) continue;
      const niveau = L.NIVEAUS[stufe + 1];
      const lz = L.naechstesLernziel(index, s, u, niveau);
      const a = lz && L.naechsteAufgabe(index, s, lz.id, niveau, bot.zufall);
      if (a) return neu('meilenstein', a.id, { kapitel: k.id });
    }
  }
  return null;
}

function beendeVersuch(bot, ctx, einst, t) {
  const s = bot.stand, z = bot.zufall, p = PROFILE[bot.profil] ?? PROFILE.durchschnitt, lauf = bot.lauf, a = lauf.aufgabe, tempo = ctx.tempo || 1;
  const sek = (x) => (x * 1000) / tempo;
  let chance = p.koennen + bot.bonus + 0.1 * lauf.hilfen - (a.afb === 3 ? 0.12 : 0) - (L.NIVEAUS.indexOf(a.niveau) > L.NIVEAUS.indexOf(einst.zielniveau) ? 0.15 : 0);
  if (lauf.raet) chance = 0.1;
  const richtig = z() < Math.min(0.97, chance);
  const fehler = !richtig ? (a.typischeFehler ?? a.optionen?.filter((o) => o.fehlvorstellung) ?? []) : [];
  const fehlvorstellungen = fehler.length && z() < 0.6 ? [fehler[Math.floor(z() * fehler.length)].fehlvorstellung].filter(Boolean) : [];
  const eingabe = richtig ? String(a.loesung ?? '') : String(Number(a.loesung) ? Number(a.loesung) + (z() < 0.5 ? 10 : -1) : '?');
  const dauer = Math.max(2, Math.round((t - lauf.beginn) / 1000 * tempo));

  if (lauf.art === 'einstieg') {
    L.trageEinstiegEin(s, lauf.kapitel, a, { geloest: richtig, eingaben: [eingabe], fehlvorstellungen, dauer }, iso(t));
    return fertigMitAufgabe(bot, t, sek);
  }
  if (!richtig && lauf.versuch < 2) {
    lauf.versuch = 2;
    if (lauf.hilfen === 0 && L.tippVonSelbst(a)) lauf.hilfen = 1;
    if (z() < p.karten) lauf.hilfen = Math.min(3, lauf.hilfen + 1 + (z() < p.karten ? 1 : 0));
    s.aktiv = { ...s.aktiv, fehlversuche: 1, hilfen: lauf.hilfen };
    (lauf.eingaben ??= []).push(eingabe);
    // Hilferuf nach dem ersten Fehlversuch; im Vorlauf seltener.
    if (!lauf.raet && z() < p.hilferuf * (ctx.vorlauf ? 0.3 : 1)) L.rufeHilfe(s, a.id, iso(t), SIM_GRUENDE[(s.hilferufe?.length ?? 0) % SIM_GRUENDE.length]);
    lauf.raet = lauf.raet && z() < 0.8;
    lauf.haengt = false;
    aenderung(bot, t);
    bot.naechster = t + sek(dauerVon(bot, p, lauf));
    return;
  }
  const karten = L.KARTEN.slice(0, lauf.hilfen);
  const buchung = L.verbuche(s, a, { geloest: richtig, versuche: lauf.versuch, eingaben: [...(lauf.eingaben ?? []), eingabe], fehlvorstellungen, hilfen: lauf.hilfen, karten, dauer },
    einst.zielniveau, iso(t), ctx.index, { rueckblick: lauf.art === 'rueckblick', sonderauftrag: lauf.art === 'sonderauftrag' ? einst.sonderauftrag?.id ?? null : null });
  if (lauf.art === 'rueckblick') L.trageRueckblickEin(s, a, richtig, iso(t));
  if (lauf.art === 'sonderauftrag') L.trageSonderauftragEin(s, einst.sonderauftrag, a, richtig, iso(t));
  if (lauf.art !== 'rueckblick') L.trageWegstueckEin(s, a, { richtig, muenzen: buchung.muenzen }, iso(t));
  if (lauf.art === 'meilenstein') {
    const kap = lauf.kapitel, n = L.arbeitsniveau(s, kap, einst.zielniveau);
    const vorschlag = L.niveauVorschlag(s, kap, n, einst.zielniveau);
    // Höher geht nur, wer sicher rechnet; tiefer gehen die meisten mit.
    if (vorschlag && z() < (vorschlag === 'hoch' ? (p.koennen >= 0.8 ? 0.7 : 0.2) : 0.7)) L.setzeNiveau(s, kap, L.NIVEAUS[L.NIVEAUS.indexOf(n) + (vorschlag === 'hoch' ? 1 : -1)]);
    else if (vorschlag) L.lehneVorschlagAb(s, kap);
  }
  bot.bonus = Math.max(0, bot.bonus - 0.1);
  return fertigMitAufgabe(bot, t, sek);
}
function fertigMitAufgabe(bot, t, sek) {
  bot.stand.aktiv = null;
  bot.lauf = null;
  aenderung(bot, t);
  bot.naechster = t + sek(zwischen(bot.zufall, [5, 25]));
}

// Vorlauf: Unterrichtsstunden der letzten `wochen` Wochen (Montag, Mittwoch, Donnerstag, je 45 Minuten ab 9:45 Uhr),
// gerechnet bis gestern. Ein Schüler fehlt mit 5 % Wahrscheinlichkeit.
export function stundenDesVorlaufs(wochen, jetzt) {
  const stunden = [];
  const heute = new Date(jetzt); heute.setHours(0, 0, 0, 0);
  for (let d = wochen * 7; d >= 1; d--) {
    const tag = new Date(heute); tag.setDate(heute.getDate() - d);
    if (![1, 3, 4].includes(tag.getDay())) continue;
    tag.setHours(9, 45, 0, 0);
    stunden.push(tag.getTime());
  }
  return stunden;
}
export function vorlauf(bots, ctx, wochen, jetzt) {
  const stunden = stundenDesVorlaufs(wochen, jetzt);
  for (const beginn of stunden) {
    for (const b of bots) {
      if (b.zufall() < 0.05) continue;
      b.fertig = false; b.lauf = null; b.bonus = 0;
      b.naechster = beginn + b.zufall() * 3 * MIN;
      b.ende = beginn + STUNDE_MIN * MIN - b.zufall() * 5 * MIN;
      schritt(b, { ...ctx, tempo: 1, vorlauf: true }, b.ende + 1);
    }
  }
  for (const b of bots) { b.fertig = false; b.ende = null; b.lauf = null; b.stand.aktiv = null; }
  return stunden.length;
}
