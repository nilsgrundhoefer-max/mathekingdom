// Betriebsprotokoll (siehe CONTEXT.md und docs/adr/0013): Woher die Dashboards geladen wurden und was technisch schiefging.
// Reine Logik ohne Oberfläche und Dateizugriff. Ein Eintrag: { t, art, text, klasse? }.
// Arten: start, problem, ok (wieder ok), ende (Sitzung beendet, Version 0.54), info (kein Problem, Version 0.54),
// lehrkraft (Handlung von Lehrkraft oder Administrator, etwa eine Münzgabe, Version 0.54).

export const MAX_SCHUELER = 50;
export const MAX_LEHRER = 200;

// Hängt einen Eintrag an und behält nur die neuesten `max`.
export function trage(liste, eintrag, max) {
  liste.push(eintrag);
  if (liste.length > max) liste.splice(0, liste.length - max);
  return liste;
}

export const QUELLE_TEXT = {
  online: 'online von GitHub',
  kopie: 'aus der Kopie im Klassenordner',
  'kopie-lehrer': 'aus der Kopie auf dem Lehrerlaufwerk',
  'ohne-netz': 'aus der Datei ohne Netz',
  eingebettet: 'aus der Datei ohne Netz',
  klassenordner: 'aus der Kopie im Klassenordner',
  mitgeliefert: 'aus dem Dashboard selbst',
};
const quelle = (q) => QUELLE_TEXT[q] ?? (q ? String(q) : 'unbekannt');

// „Edge 131“, „Chrome 130“ oder der Anfang der Kennung.
export function browserName(ua = '') {
  const m = ua.match(/Edg\/(\d+)/) ?? ua.match(/OPR\/(\d+)/);
  if (m) return `${m[0].startsWith('Edg') ? 'Edge' : 'Opera'} ${m[1]}`;
  const c = ua.match(/Chrome\/(\d+)/);
  if (c) return `Chrome ${c[1]}`;
  const f = ua.match(/Firefox\/(\d+)/);
  if (f) return `Firefox ${f[1]}`;
  return ua ? ua.slice(0, 40) : 'unbekannter Browser';
}

// Der Eintrag beim Start eines Dashboards. Ein Grund (GitHub nicht erreichbar) macht ihn zum Problem.
// angaben: { t, version, dashboard, grund?, aufgaben?, aufgabenGrund?, klassendatei?, browser }
export function starteintrag(a) {
  const teile = [`Start ${quelle(a.dashboard)}`, a.version];
  if (a.aufgaben) teile.push(`Aufgaben ${quelle(a.aufgaben)}`);
  if (a.klassendatei) teile.push(`Klassendatei ${a.klassendatei}`);
  teile.push(a.browser);
  // Eine Kopie startet nur, wenn GitHub nicht geklappt hat. Ältere Startdateien nennen noch keinen Grund.
  const grund = a.grund ?? (['kopie', 'kopie-lehrer'].includes(a.dashboard) ? 'GitHub nicht erreichbar' : null);
  const gruende = [grund, a.aufgabenGrund].filter(Boolean);
  if (gruende.length) teile.push(`Grund: ${[...new Set(gruende)].join('; ')}`);
  return { t: a.t, art: gruende.length ? 'problem' : 'start', text: teile.join(', ') };
}

// Warum eine Anfrage an GitHub nicht geklappt hat, in Worten.
export function fehlergrund(fehler, status) {
  if (status === 404) return 'GitHub antwortet 404: Die Datei fehlt. Ist GitHub Pages für main eingeschaltet?';
  if (status) return `GitHub antwortet mit Fehler ${status}`;
  if (fehler?.name === 'AbortError' || fehler?.name === 'TimeoutError') return 'GitHub hat nicht rechtzeitig geantwortet';
  return `GitHub nicht erreichbar${fehler?.message ? ` (${fehler.message})` : ''}`;
}

// Das Protokoll der Klasse: Einträge aller Speicherstände und der Lehrkraft, neueste zuerst.
export function sammle(staende, lehrerEintraege, klasse, name) {
  const alle = [];
  for (const { code, stand } of staende) for (const e of stand.betrieb ?? []) alle.push({ ...e, wer: name(code), code });
  for (const e of lehrerEintraege ?? []) if (!e.klasse || e.klasse === klasse) alle.push({ ...e, wer: 'Lehrkraft' });
  return alle.sort((a, b) => (a.t < b.t ? 1 : a.t > b.t ? -1 : 0));
}

export const ART_TEXT = { start: 'Start', problem: 'Problem', ok: 'wieder ok', ende: 'Ende', info: 'Info', lehrkraft: 'Lehrkraft' };
const ART = { ...ART_TEXT, problem: 'PROBLEM' };

// Ende einer Sitzung (Version 0.54), etwa „Sitzung beendet nach 23 min“. Ohne Lerndaten (ADR 0013).
export function endeText(start, ende) {
  const min = Math.max(0, Math.round((new Date(ende) - new Date(start)) / 60000));
  return `Sitzung beendet nach ${min} min`;
}
// Ob die vorige Sitzung ordentlich endete: 'beendet', 'ohne-ende' oder null, solange es noch kein Ende im Protokoll gibt
// (Speicherstände von vor Version 0.54 hätten sonst bei jedem ersten Start „ohne Ende“).
export function vorigeSitzung(betrieb = []) {
  if (!betrieb.some((e) => e.art === 'ende')) return null;
  return betrieb.at(-1).art === 'ende' ? 'beendet' : 'ohne-ende';
}

// Ein Programmfehler in einer Zeile (Version 0.54): Meldung, Ansicht und Stelle, gekürzt.
export function programmfehlerText(meldung, ansicht, stelle) {
  const m = String(meldung ?? 'unbekannter Fehler').replace(/\s+/g, ' ').slice(0, 160);
  return `Programmfehler in der Ansicht „${ansicht ?? '?'}“: ${m}${stelle ? ` (${String(stelle).slice(0, 80)})` : ''}`;
}
// Für die Weitergabe, etwa an die Schul-IT: Schüler erscheinen nur mit Code, nie mit Namen.
// Ohne Klasse (Administrator-Dashboard) steht die Klasse in jeder Zeile.
export function alsText(eintraege, klasse, jetzt) {
  const zeit = (t) => new Date(t).toLocaleString('de-DE');
  return [`Mathekingdom, Betriebsprotokoll ${klasse ? `der Klasse ${klasse}` : 'aller Klassen'}, erstellt ${zeit(jetzt)}`, '',
    ...eintraege.map((e) => [zeit(e.t), ...(klasse ? [] : [e.klasse ?? '–']), e.code ?? e.wer, ART[e.art] ?? e.art, e.text].join('\t'))].join('\r\n');
}
