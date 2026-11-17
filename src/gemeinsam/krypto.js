// Signatur der Klassendatei (siehe docs/adr/0006): Das Lehrer-Dashboard unterschreibt, das Schüler-Dashboard prüft.
// Datei-Inhalt: { inhalt: "<JSON-Text>", signatur: "<Base64>" }. Unterschrieben wird genau der Text in `inhalt`.

const VERFAHREN = { name: 'ECDSA', namedCurve: 'P-256' };
const HASH = { name: 'ECDSA', hash: 'SHA-256' };
const b64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const bytes = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
const kodiere = (text) => new TextEncoder().encode(text);

export async function erzeugeSchluessel() {
  const paar = await crypto.subtle.generateKey(VERFAHREN, true, ['sign', 'verify']);
  return {
    privat: await crypto.subtle.exportKey('jwk', paar.privateKey),
    oeffentlich: await crypto.subtle.exportKey('jwk', paar.publicKey),
  };
}
export async function unterschreibe(daten, privaterSchluessel) {
  const schluessel = await crypto.subtle.importKey('jwk', privaterSchluessel, VERFAHREN, false, ['sign']);
  const inhalt = JSON.stringify(daten);
  return JSON.stringify({ inhalt, signatur: b64(await crypto.subtle.sign(HASH, schluessel, kodiere(inhalt))) });
}
// Liefert die Daten, wenn die Unterschrift stimmt, sonst null.
export async function pruefeUnterschrift(dateitext, oeffentlicherSchluessel) {
  try {
    const { inhalt, signatur } = JSON.parse(dateitext);
    const schluessel = await crypto.subtle.importKey('jwk', oeffentlicherSchluessel, VERFAHREN, false, ['verify']);
    return (await crypto.subtle.verify(HASH, schluessel, bytes(signatur), kodiere(inhalt))) ? JSON.parse(inhalt) : null;
  } catch { return null; }
}
// ---------- PIN ----------
// In der Klassendatei steht nie die PIN selbst, sondern ein absichtlich langsam berechneter Prüfwert (siehe docs/adr/0008).
const PIN_RUNDEN = 150000;
export function neuePin() {
  const zahl = new Uint32Array(1);
  do crypto.getRandomValues(zahl); while (zahl[0] >= 4294960000); // gleichmäßig verteilt
  return String(zahl[0] % 10000).padStart(4, '0');
}
async function pinWert(pin, salz) {
  const basis = await crypto.subtle.importKey('raw', kodiere(pin), 'PBKDF2', false, ['deriveBits']);
  return b64(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: bytes(salz), iterations: PIN_RUNDEN }, basis, 256));
}
export async function pinEintrag(pin) {
  const salz = b64(crypto.getRandomValues(new Uint8Array(12)));
  return { salz, wert: await pinWert(pin, salz) };
}
export async function pruefePin(pin, eintrag) {
  try { return (await pinWert(String(pin).trim(), eintrag.salz)) === eintrag.wert; } catch { return false; }
}

// Ohne Prüfung lesen: für das Lehrer-Dashboard selbst und für Tests ohne Schlüssel.
export function liesUngeprueft(dateitext) {
  try {
    const aussen = JSON.parse(dateitext);
    return typeof aussen?.inhalt === 'string' ? JSON.parse(aussen.inhalt) : aussen;
  } catch { return null; }
}
