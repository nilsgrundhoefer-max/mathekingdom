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
export async function erlaube(handle, fragen = true) {
  try {
    if ((await mitFrist(handle.queryPermission({ mode: 'readwrite' }), FRIST, 'prompt')) === 'granted') return true;
    return fragen && (await handle.requestPermission({ mode: 'readwrite' })) === 'granted';
  } catch { return false; }
}

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
