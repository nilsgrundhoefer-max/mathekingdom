// Backups einer Klasse (ADR 0025): Das Lehrer-Dashboard sichert stündlich still, das Administrator-Dashboard sichert
// auf Knopfdruck und stellt wieder her. Je Klasse bleiben höchstens fünf Stände: der neueste und je der letzte der
// vier Tage davor, an denen gesichert wurde (also Unterrichtstage).
//
//   backup/2026-11-19_14-05/  <Code>.json …, klassendatei.json, klasse.json (oder lehrerdaten.json bis 0.20)

export const CODE_DATEI = /^(\d{1,2}[A-Z]-[A-Z0-9]{4})\.json$/;
export const KLASSENDATEI = 'klassendatei.json';
export const MAX_BACKUPS = 5;

const zwei = (n) => String(n).padStart(2, '0');
export const stempel = (d) => `${d.getFullYear()}-${zwei(d.getMonth() + 1)}-${zwei(d.getDate())}_${zwei(d.getHours())}-${zwei(d.getMinutes())}`;
const istStempel = (n) => /^\d{4}-\d\d-\d\d_\d\d-\d\d$/.test(n);
// Ortszeit des Backups aus dem Ordnernamen, sonst null.
export function backupZeit(n) {
  if (!istStempel(n)) return null;
  return new Date(`${n.slice(0, 10)}T${n.slice(11, 13)}:${n.slice(14, 16)}:00`);
}
// „19.11.2026 um 14:05“
export const lesbarerStempel = (n) => (istStempel(n) ? `${n.slice(8, 10)}.${n.slice(5, 7)}.${n.slice(0, 4)} um ${n.slice(11, 13)}:${n.slice(14, 16)}` : n);

// Welche Backup-Ordner weg können. Ordner mit fremden Namen bleiben unberührt.
export function alteBackups(namen, max = MAX_BACKUPS) {
  const stände = namen.filter(istStempel).sort().reverse();
  if (!stände.length) return [];
  const behalten = new Set([stände[0]]);
  const tage = new Set([stände[0].slice(0, 10)]);
  for (const n of stände) {
    if (behalten.size >= max) break;
    if (tage.has(n.slice(0, 10))) continue;
    tage.add(n.slice(0, 10));
    behalten.add(n);
  }
  return stände.filter((n) => !behalten.has(n));
}
// Die Stände, die nach dem Aufräumen bleiben, neueste zuerst.
export const behalteneBackups = (namen) => { const weg = new Set(alteBackups(namen)); return namen.filter((n) => istStempel(n) && !weg.has(n)).sort().reverse(); };

// Sichert alle Speicherstände und die Klassendatei aus dem Klassenordner, dazu `zusatz` ({ dateiname: text }).
// `staende` (optional): schon gelesene [{ code, roh }], damit das Lehrer-Dashboard nicht doppelt liest.
export async function sichereKlasse({ klassenordner, backupOrdner, zusatz = {}, staende = null, jetzt = new Date() }) {
  const name = stempel(jetzt);
  const ziel = await backupOrdner.unterordner(name);
  let anzahl = 0;
  if (staende) for (const { code, roh } of staende) { await ziel.schreibe(`${code}.json`, roh); anzahl++; }
  else {
    for (const datei of await klassenordner.liste()) {
      if (!CODE_DATEI.test(datei)) continue;
      const roh = await klassenordner.lies(datei).catch(() => null);
      if (roh) { await ziel.schreibe(datei, roh); anzahl++; }
    }
  }
  await ziel.schreibe(KLASSENDATEI, (await klassenordner.lies(KLASSENDATEI).catch(() => null)) ?? '');
  for (const [datei, text] of Object.entries(zusatz)) await ziel.schreibe(datei, text);
  for (const alt of alteBackups(await backupOrdner.ordnernamen())) await backupOrdner.entferne(alt);
  return { stempel: name, anzahl };
}

// Ersetzt einen Speicherstand im Klassenordner durch die gesicherte Fassung. Das neue Änderungsdatum sorgt dafür,
// dass eine ältere Sicherung im Browser des Schülers nicht gewinnt.
export async function stelleStandWiederHer({ backupOrdner, stempel: s, code, klassenordner, jetzt = new Date() }) {
  const quelle = await backupOrdner.ordner(s);
  const roh = quelle && await quelle.lies(`${code}.json`);
  if (!roh) throw new Error(`In diesem Backup gibt es keinen Speicherstand ${code}.`);
  const stand = JSON.parse(roh);
  stand.geaendert = new Date(jetzt).toISOString();
  await klassenordner.schreibe(`${code}.json`, JSON.stringify(stand));
}
// Alle Speicherstände eines Backups zurück in den Klassenordner. Liefert die Codes und die gesicherten Zusatzdateien.
export async function stelleKlasseWiederHer({ backupOrdner, stempel: s, klassenordner, jetzt = new Date() }) {
  const quelle = await backupOrdner.ordner(s);
  if (!quelle) throw new Error('Dieses Backup gibt es nicht mehr.');
  const codes = [], zusatz = {};
  for (const datei of await quelle.liste()) {
    const m = datei.match(CODE_DATEI);
    if (m) { await stelleStandWiederHer({ backupOrdner, stempel: s, code: m[1], klassenordner, jetzt }); codes.push(m[1]); }
    else if (datei !== KLASSENDATEI) zusatz[datei] = await quelle.lies(datei);
  }
  return { codes, zusatz };
}

// Löscht einen Speicherstand aus allen Backups einer Klasse.
export async function loescheAusBackups(backupOrdner, code) {
  let geloescht = 0;
  for (const s of await backupOrdner.ordnernamen()) {
    const o = await backupOrdner.ordner(s);
    if (o && (await o.liste()).includes(`${code}.json`)) { await o.entferne(`${code}.json`); geloescht++; }
  }
  return geloescht;
}
