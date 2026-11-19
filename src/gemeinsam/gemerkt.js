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
    async hole(schluessel) {
      try {
        const d = await oeffne(name);
        return await new Promise((ok) => { const r = d.transaction('ordner').objectStore('ordner').get(schluessel); r.onsuccess = () => ok(r.result ?? null); r.onerror = () => ok(null); });
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
    if ((await handle.queryPermission({ mode: 'readwrite' })) === 'granted') return true;
    return fragen && (await handle.requestPermission({ mode: 'readwrite' })) === 'granted';
  } catch { return false; }
}
