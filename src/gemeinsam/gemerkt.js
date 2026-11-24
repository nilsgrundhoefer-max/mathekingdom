// Gemerkte Ordner (ADR 0024): Ein Browser kann den Zugriff auf einen Ordner nicht als Text speichern, nur als
// Eintrag in seinem eigenen Profil. Gilt also nur in diesem Browser auf diesem Konto.

function oeffne(name) {
  return new Promise((ok, nein) => {
    const r = indexedDB.open(name, 1);
    r.onupgradeneeded = () => r.result.createObjectStore('ordner');
    r.onsuccess = () => ok(r.result); r.onerror = () => nein(r.error);
  });
}
export function gemerkteOrdner(name) {
  return {
    // Mit Frist: Hängt die Datenbank des Browsers, startet Mathekingdom eben ohne gemerkten Ordner (Version 0.46).
    async hole(schluessel) {
      try {
        const d = await mitFrist(oeffne(name), FRIST, null);
        if (!d) return null;
        return await mitFrist(new Promise((ok) => { const r = d.transaction('ordner').objectStore('ordner').get(schluessel); r.onsuccess = () => ok(r.result ?? null); r.onerror = () => ok(null); }), FRIST, null);
      } catch { return null; }
    },
    async merke(schluessel, handle) {
      try {
        const d = await oeffne(name);
        await new Promise((ok) => { const t = d.transaction('ordner', 'readwrite'); t.objectStore('ordner').put(handle, schluessel); t.oncomplete = ok; t.onerror = ok; });
      } catch { /* dann eben beim nächsten Mal neu wählen */ }
    },
    async vergiss(schluessel) {
      try {
        const d = await oeffne(name);
        await new Promise((ok) => { const t = d.transaction('ordner', 'readwrite'); t.objectStore('ordner').delete(schluessel); t.oncomplete = ok; t.onerror = ok; });
      } catch { /* nichts zu tun */ }
    },
  };
}
// Ist der Zugriff schon erlaubt? Sonst fragen (geht nur direkt nach einem Klick).
// Antwortet der Ordner nicht (Laufwerk nicht erreichbar, Version 0.47), wird gar nicht erst gefragt: Die Frage nach
// der Erlaubnis bliebe sonst ohne Antwort hängen.
export async function zugriff(handle, fragen = true) {
  try {
    const stand = await antwort(handle);
    if (stand === STUMM) return 'stumm';
    if (stand === 'granted') return 'ja';
    return fragen && (await handle.requestPermission({ mode: 'readwrite' })) === 'granted' ? 'ja' : 'nein';
  } catch { return 'nein'; }
}
export const erlaube = async (handle, fragen = true) => (await zugriff(handle, fragen)) === 'ja';
// Wie steht es um die Erlaubnis? STUMM, wenn der Ordner in der Frist gar nicht antwortet.
export const STUMM = 'stumm';
export const antwort = (handle) => mitFrist(Promise.resolve().then(() => handle.queryPermission({ mode: 'readwrite' })), FRIST, STUMM);
// Derselbe Ordner? Antwortet einer nicht, gilt er als ein anderer.
export const gleicherOrdner = (a, b) => mitFrist(Promise.resolve().then(() => a.isSameEntry(b)), FRIST, false).catch(() => false);

// ---------- Ordnersätze (Version 0.47, ADR 0040) ----------
// Jedes Dashboard merkt sich bis zu zwei Ordnersätze, etwa einen für die Schule und einen für zu Hause. Beim Öffnen
// werden alle Ordner beider Sätze zugleich gefragt; genommen wird ein vollständiger Satz, dessen Ordner alle antworten,
// der zuletzt benutzte zuerst. Antwortet keiner, wird neu gewählt, und zwar in einen freien Satz oder in den, der
// länger nicht benutzt wurde. Der andere Satz bleibt gemerkt.
export const SAETZE = 2;
const schluesselIn = (art, nr) => (nr === 0 ? art : `${art}#${nr + 1}`);
export function ordnersaetze(gemerkt, arten) {
  return {
    // Liefert { nr, ordner: { art: handle }, erlaubt, stumm: [{ art, name }] }.
    async finde() {
      const saetze = await Promise.all([...Array(SAETZE).keys()].map(async (nr) => {
        const ordner = {};
        for (const art of arten) ordner[art] = await gemerkt.hole(schluesselIn(art, nr));
        return { nr, ordner };
      }));
      const zuletzt = Number(await gemerkt.hole('satz-zuletzt')) || 0;
      await Promise.all(saetze.flatMap((s) => arten.filter((a) => s.ordner[a]).map(async (a) => { (s.antwort ??= {})[a] = await antwort(s.ordner[a]); })));
      for (const s of saetze) {
        s.voll = arten.every((a) => s.ordner[a]);
        s.leer = arten.every((a) => !s.ordner[a]);
        s.stumm = arten.filter((a) => s.ordner[a] && s.antwort[a] === STUMM);
      }
      const reihe = [...saetze].sort((a, b) => (b.nr === zuletzt) - (a.nr === zuletzt));
      const gut = reihe.find((s) => s.voll && !s.stumm.length);
      const stumm = saetze.flatMap((s) => s.stumm.map((a) => ({ art: a, name: s.ordner[a].name })));
      if (gut) return { nr: gut.nr, ordner: gut.ordner, erlaubt: arten.every((a) => gut.antwort[a] === 'granted'), stumm: [] };
      // Kein Satz geht: weiter am angefangenen Satz, sonst ein freier, sonst der länger nicht benutzte.
      const ziel = reihe.find((s) => !s.leer && !s.voll && !s.stumm.length) ?? saetze.find((s) => s.leer) ?? reihe.find((s) => s.nr !== zuletzt) ?? saetze[0];
      const ordner = Object.fromEntries(arten.map((a) => [a, ziel.stumm.includes(a) ? null : ziel.ordner[a]]));
      return { nr: ziel.nr, ordner, erlaubt: false, stumm };
    },
    merke: (nr, art, handle) => gemerkt.merke(schluesselIn(art, nr), handle),
    vergiss: (nr, art) => gemerkt.vergiss(schluesselIn(art, nr)),
    benutzt: (nr) => gemerkt.merke('satz-zuletzt', nr),
  };
}
// Hinweis über Ordner, die beim Öffnen nicht geantwortet haben. titel(art) nennt das Laufwerk.
export const stummText = (stumm, titel) => `${stumm.length > 1 ? 'Diese hinterlegten Ordner antworten' : 'Dieser hinterlegte Ordner antwortet'} gerade nicht: ${stumm.map((s) => `${titel(s.art)} (Ordner „${s.name}“)`).join(', ')}. Bist du nicht in der Schule? Dann wähle hier die Ordner, mit denen du jetzt arbeitest. Die hinterlegten bleiben gemerkt, und dort, wo sie erreichbar sind, öffnet Mathekingdom wieder mit ihnen.`;

// ---------- Start ohne Hängenbleiben (Version 0.46) ----------
// Im Schulnetz kann ein Schritt beim Öffnen ewig dauern, etwa wenn ein Tauschlaufwerk gerade nicht erreichbar ist
// oder die Datenbank des Browsers klemmt. Dann soll nicht „Mathekingdom öffnet …“ stehen bleiben.
export const FRIST = 4000;
// Liefert das Ergebnis des Versprechens oder nach ms Millisekunden den Ersatz.
export function mitFrist(versprechen, ms, ersatz) {
  let uhr;
  return Promise.race([versprechen, new Promise((ok) => { uhr = setTimeout(() => ok(ersatz), ms); })]).finally(() => clearTimeout(uhr));
}
// Wache über das Öffnen: Merkt sich den laufenden Schritt. Ist sie nach ms nicht fertig, ruft sie beiHaenger(schritt).
export function startwache(ms, beiHaenger) {
  let schritt = 'gemerkte Ordner lesen', fertig = false;
  const uhr = setTimeout(() => { if (!fertig) { fertig = true; console.warn(`Mathekingdom: Öffnen hängt beim Schritt „${schritt}“`); beiHaenger(schritt); } }, ms);
  return {
    schritt(s) { schritt = s; },
    fertig() { fertig = true; clearTimeout(uhr); },
  };
}
export const haengerText = (schritt) => `Mathekingdom kommt beim Schritt „${schritt}“ nicht weiter. Meist ist ein Laufwerk gerade nicht erreichbar. Prüfe, ob die Tauschlaufwerke verbunden sind, und lade die Seite neu oder wähle die Ordner hier neu. Deine Daten bleiben dabei, wie sie sind.`;
