// Baut die auslieferbaren Dateien nach dist/.
// Aufruf: node tools/baue.mjs
//
// Seit Version 0.21 (ADR 0024):
//   dist/schueler.js                     das Schüler-Dashboard (online und als Kopie im Mathekingdom-Ordner der Schüler)
//   dist/lehrer.js                       das Lehrer-Dashboard mit Pools (online und als Kopie auf dem Lehrertauschlaufwerk)
//   dist/admin.js                        das Administrator-Dashboard mit Pools und den Vorlagen der Startdateien
//   dist/Mathekingdom-Admin.html         die Startdatei des Administrators. Die Startdateien für Schüler und
//                                        Lehrkräfte erstellt das Administrator-Dashboard (mit Schlüssel, Kürzel, Pfad).
//   dist/Mathekingdom-ohne-Netz.html, dist/Mathekingdom-Lehrer-ohne-Netz.html  nur für die Tests
//
// Eingefroren auf Version 0.20, damit die alten Startdateien bis zum Umzug weiterlaufen (nicht mehr gebaut):
//   dist/schueler-dashboard.js, dist/Mathekingdom.html, dist/lehrer-paket.js, dist/lehrer-dashboard.js, dist/Mathekingdom-Lehrer.html
//
// Versionsnummer, Datum und Neuerungen kommen aus VERSIONEN.md (oberster Eintrag).

import { build } from 'esbuild';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

// Adresse, unter der dieses Repository über GitHub Pages erreichbar ist.
const BASIS = 'https://nilsgrundhoefer-max.github.io/mathekingdom/';
const wurzel = new URL('../', import.meta.url);

// Oberster Eintrag aus VERSIONEN.md: „## 0.1 vom 17.11.2026“, darunter „### Schüler“ und „### Lehrkraft“.
function liesVersion(text) {
  const teile = text.split(/^## /m).slice(1);
  if (!teile.length) throw new Error('VERSIONEN.md enthält keine Version.');
  const [kopf, ...rest] = teile[0].split('\n');
  const m = kopf.trim().match(/^(\d+\.\d+(?:\.\d+)?) vom (\d\d\.\d\d\.\d{4})$/);
  if (!m) throw new Error(`Versionszeile nicht lesbar: „## ${kopf.trim()}“`);
  const abschnitte = {};
  let aktuell = null;
  for (const zeile of rest) {
    const ab = zeile.match(/^### (.+)/);
    if (ab) { aktuell = ab[1].trim().toLowerCase(); abschnitte[aktuell] = []; continue; }
    const punkt = zeile.match(/^- (.+)/);
    if (punkt && aktuell) abschnitte[aktuell].push(punkt[1].replace(/`/g, '').trim());
  }
  return { nummer: m[1], datum: m[2], schueler: abschnitte['schüler'] ?? [], lehrkraft: abschnitte.lehrkraft ?? [] };
}
const version = liesVersion(readFileSync(new URL('VERSIONEN.md', wurzel), 'utf8'));
const define = { MK_VERSION: JSON.stringify(version) };

const bundle = async (eingang, ausgang) => {
  await build({
    entryPoints: [new URL(eingang, wurzel).pathname],
    outfile: new URL(ausgang, wurzel).pathname,
    bundle: true, format: 'iife', minify: true, target: 'chrome110',
    loader: { '.css': 'text' }, logLevel: 'warning', define,
  });
  return readFileSync(new URL(ausgang, wurzel), 'utf8');
};
const dashboard = await bundle('src/schueler/app.js', 'dist/schueler.js');
const lehrer = await bundle('src/lehrer/app.js', 'build/lehrer-dashboard.js');
const admin = await bundle('src/admin/app.js', 'build/admin-dashboard.js');

const seite = (inhalt, titel = 'Mathekingdom', halter = 'mathekingdom') => `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titel}</title>
</head>
<body>
<div id="${halter}"></div>
${inhalt}
</body>
</html>
`;
// In ein <script> eingebetteter Text darf das Skript nicht vorzeitig beenden.
const sicher = (text) => text.replace(/<\/script/gi, '<\\/script');
const KASTEN = 'font:16px Segoe UI,system-ui,sans-serif;max-width:480px;margin:12vh auto;padding:0 16px;text-align:center;color:#1f2533';
const KNOPF = 'font:inherit;padding:11px 16px;border-radius:10px;border:0;background:#1d2b4f;color:#fff;cursor:pointer;margin:4px';

// Gemeinsamer Teil der Startdateien: gemerkten Ordner aus dem Browser holen (ADR 0024).
const gemerktJs = `function gemerkt(db, schluessel) {
    return new Promise(function (ok) {
      try {
        var r = indexedDB.open(db, 1);
        r.onupgradeneeded = function () { r.result.createObjectStore('ordner'); };
        r.onerror = function () { ok(null); };
        r.onsuccess = function () {
          try { var g = r.result.transaction('ordner').objectStore('ordner').get(schluessel); g.onsuccess = function () { ok(g.result || null); }; g.onerror = function () { ok(null); }; }
          catch (e) { ok(null); }
        };
      } catch (e) { ok(null); }
    });
  }
  function merke(db, schluessel, handle) {
    try { var r = indexedDB.open(db, 1); r.onupgradeneeded = function () { r.result.createObjectStore('ordner'); };
      r.onsuccess = function () { try { r.result.transaction('ordner', 'readwrite').objectStore('ordner').put(handle, schluessel); } catch (e) {} }; } catch (e) {}
  }
  // Der Mathekingdom-Ordner: er selbst oder ein Unterordner „Mathekingdom“.
  function schulordner(ordner) {
    return ordner.getFileHandle('schulverzeichnis.json').then(function () { return ordner; }, function () {
      return ordner.getDirectoryHandle('Mathekingdom').then(function (u) { return u.getFileHandle('schulverzeichnis.json').then(function () { return u; }); });
    });
  }
  function kopie(ordner, datei) {
    return ordner.getDirectoryHandle('_mathekingdom').then(function (s) { return s.getFileHandle(datei); })
      .then(function (d) { return d.getFile(); }).then(function (d) { return d.text(); });
  }
  function fuehreAus(code) {
    ziel.innerHTML = '';
    var skript = document.createElement('script');
    skript.textContent = code;
    document.body.appendChild(skript);
  }
  // Ohne Internet: die Kopie aus dem gemerkten oder einmal gewählten Mathekingdom-Ordner.
  function ohneNetz(titel, db, schluessel, datei, pfad, weiter) {
    ziel.innerHTML = '<div style="${KASTEN}"><h1 style="color:#1d2b4f">' + titel + '</h1>'
      + '<p>Das Internet ist gerade nicht erreichbar. Dann startet die Kopie aus dem Ordner „Mathekingdom“' + (pfad ? ' (' + pfad + ')' : '') + '.</p>'
      + '<p style="font-size:13px;color:#5b6475" id="mk-grund"></p><p id="mk-weiter"></p>'
      + '<button id="mk-ordner" style="${KNOPF}">Ordner „Mathekingdom“ wählen</button>'
      + '<p id="mk-fehler" style="color:#b3372f;font-weight:600"></p></div>';
    document.getElementById('mk-grund').textContent = window.MK_GRUND || '';
    var fehler = function (e) {
      if (e && e.name === 'AbortError') return;
      document.getElementById('mk-fehler').textContent = 'In diesem Ordner liegt keine Kopie. Wähle den Ordner „Mathekingdom“' + (pfad ? ' (' + pfad + ')' : '') + '.';
    };
    var los = function (ordner) { return kopie(ordner, datei).then(function (code) { weiter(ordner); fuehreAus(code); }); };
    gemerkt(db, schluessel).then(function (handle) {
      if (!handle) return;
      var b = document.createElement('button');
      b.id = 'mk-weiter-knopf'; b.style.cssText = '${KNOPF}'; b.textContent = 'Weiter mit Ordner „' + handle.name + '“';
      b.onclick = function () { handle.requestPermission({ mode: 'readwrite' }).then(function (r) { if (r === 'granted') return los(handle); }).catch(fehler); };
      document.getElementById('mk-weiter').appendChild(b);
    });
    document.getElementById('mk-ordner').onclick = function () {
      if (!window.showDirectoryPicker) { document.getElementById('mk-fehler').textContent = 'Öffne diese Datei bitte mit Edge oder Chrome.'; return; }
      window.showDirectoryPicker({ id: 'mk-' + schluessel, mode: 'readwrite' }).then(schulordner).then(function (o) { merke(db, schluessel, o); return los(o); }).catch(fehler);
    };
  }
  function grund(e) {
    return e.status === 404 ? 'GitHub antwortet 404: Die Datei fehlt. Ist GitHub Pages für main eingeschaltet?'
      : e.status ? 'GitHub antwortet mit Fehler ' + e.status
      : e.name === 'AbortError' ? 'GitHub hat nicht innerhalb von 10 Sekunden geantwortet'
      : 'GitHub nicht erreichbar (' + e.message + ')';
  }
  // Lädt den Code online; danach läuft er in dieser Seite.
  function online(datei, gelungen, misslungen) {
    var abbruch = new AbortController();
    var uhr = setTimeout(function () { abbruch.abort(); }, 10000);
    fetch(BASIS + 'dist/' + datei, { cache: 'no-cache', signal: abbruch.signal })
      .then(function (antwort) { if (!antwort.ok) { var f = new Error('Status ' + antwort.status); f.status = antwort.status; throw f; } return antwort.text(); })
      .then(function (code) { clearTimeout(uhr); gelungen(code); })
      .catch(function (e) { clearTimeout(uhr); window.MK_GRUND = grund(e); misslungen(); });
  }`;

// Schüler-Startdatei (Vorlage): Das Administrator-Dashboard setzt Schlüssel und Pfad ein.
const schuelerStart = seite(`<script>
(function () {
  var BASIS = ${JSON.stringify(BASIS)};
  var ziel = document.getElementById('mathekingdom');
  ${gemerktJs}
  window.MK_BASIS = BASIS;
  window.MK_SCHULE = true;
  // Öffentlicher Schlüssel des Administrators (ADR 0024) und Pfad für den Hinweis.
  window.MK_SCHLUESSEL = /*SCHLUESSEL*/null;
  window.MK_PFAD = /*PFAD*/null;
  window.MK_QUELLE = 'online';
  ziel.innerHTML = '<p style="${KASTEN}">Mathekingdom wird geladen …</p>';
  online('schueler.js', fuehreAus, function () {
    ohneNetz('Mathekingdom', 'mathekingdom-schueler', 'schule', 'schueler.js', window.MK_PFAD, function (o) { window.MK_WURZEL = o; window.MK_QUELLE = 'kopie'; });
  });
})();
</script>`);

// Lehrer-Startdatei (Vorlage): mit Kürzel, Schlüssel des Administrators und Pfaden.
const lehrerStart = seite(`<script>
(function () {
  var BASIS = ${JSON.stringify(BASIS)};
  var ziel = document.getElementById('mathekingdom-lehrer');
  ${gemerktJs}
  window.MK_SCHULE = true;
  window.MK_SCHLUESSEL = /*SCHLUESSEL*/null;
  window.MK_KUERZEL = /*KUERZEL*/null;
  window.MK_PFAD_SCHUELER = /*PFAD_SCHUELER*/null;
  window.MK_PFAD_LEHRER = /*PFAD_LEHRER*/null;
  ziel.innerHTML = '<p style="${KASTEN}">Mathekingdom wird geladen …</p>';
  online('lehrer.js', function (code) { window.MK_QUELLE = 'online'; window.MK_LEHRER_PAKET = code; fuehreAus(code); }, function () {
    ohneNetz('Mathekingdom Lehrer', 'mathekingdom-lehrer', 'schule-lehrer', 'lehrer.js', window.MK_PFAD_LEHRER, function () { window.MK_QUELLE = 'kopie-lehrer'; });
  });
})();
</script>`, 'Mathekingdom Lehrer', 'mathekingdom-lehrer');

// Administrator-Startdatei: nur online.
const adminStart = seite(`<script>
(function () {
  var BASIS = ${JSON.stringify(BASIS)};
  var ziel = document.getElementById('mathekingdom-lehrer');
  ${gemerktJs}
  window.MK_QUELLE = 'online';
  ziel.innerHTML = '<p style="${KASTEN}">Mathekingdom wird geladen …</p>';
  online('admin.js', fuehreAus, function () {
    ziel.innerHTML = '<div style="${KASTEN}"><h1 style="color:#1d2b4f">Mathekingdom Administrator</h1><p>Das Administrator-Dashboard braucht Internet. Versuche es gleich noch einmal.</p><p style="font-size:13px;color:#5b6475" id="mk-grund"></p></div>';
    document.getElementById('mk-grund').textContent = window.MK_GRUND || '';
  });
})();
</script>`, 'Mathekingdom Administrator', 'mathekingdom-lehrer');
writeFileSync(new URL('dist/Mathekingdom-Admin.html', wurzel), adminStart);

// Alte Schüler-Startdatei (0.20). Nur noch für das Lehrer-Dashboard ohne Schulverzeichnis (Ausprobieren).
const alteStartdatei = readFileSync(new URL('dist/Mathekingdom.html', wurzel), 'utf8');

const pools = {};
for (const name of readdirSync(new URL('aufgabenpool/', wurzel))) {
  const m = name.match(/^klasse-(\d+)\.json$/);
  if (m) pools[m[1]] = JSON.parse(readFileSync(new URL(`aufgabenpool/${name}`, wurzel), 'utf8'));
}
const gemeinsam = `window.MK_POOLS = ${JSON.stringify(pools)};
window.MK_BASIS = ${JSON.stringify(BASIS)};
window.MK_SCHUELER_JS = ${JSON.stringify(dashboard)};
window.MK_STARTDATEI = ${JSON.stringify(alteStartdatei)};
window.MK_STARTDATEI_SCHUELER = ${JSON.stringify(schuelerStart)};
window.MK_STARTDATEI_LEHRER = ${JSON.stringify(lehrerStart)};
`;
const paket = `${gemeinsam}${lehrer}`;
writeFileSync(new URL('dist/lehrer.js', wurzel), paket);
writeFileSync(new URL('dist/admin.js', wurzel), `${gemeinsam}${admin}`);

// Nur für die Tests: alles in einer Datei, aktualisiert sich nicht.
writeFileSync(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel),
  seite(`<script>window.MK_POOLS = ${sicher(JSON.stringify(pools))}; window.MK_QUELLE = 'ohne-netz';</script>\n<script>${sicher(dashboard)}</script>`));
writeFileSync(new URL('dist/Mathekingdom-Lehrer-ohne-Netz.html', wurzel), seite(
  `<script>window.MK_QUELLE = 'ohne-netz';</script>\n<script>${sicher(paket)}</script>`, 'Mathekingdom Lehrer', 'mathekingdom-lehrer'));
writeFileSync(new URL('build/Mathekingdom-Admin-ohne-Netz.html', wurzel), seite(
  `<script>window.MK_QUELLE = 'ohne-netz';</script>\n<script>${sicher(`${gemeinsam}${admin}`)}</script>`, 'Mathekingdom Administrator', 'mathekingdom-lehrer'));

console.log(`Gebaut: Version ${version.nummer} vom ${version.datum}, Schüler-Dashboard ${Math.round(dashboard.length / 1024)} KB, Lehrer-Paket ${Math.round(paket.length / 1024)} KB, Pools für Klasse ${Object.keys(pools).join(', ')}.`);
