// Baut die auslieferbaren Dateien nach dist/.
// Aufruf: node tools/baue.mjs
//
//   dist/schueler-dashboard.js           das Schüler-Dashboard (liegt online und als Kopie im Klassenordner)
//   dist/Mathekingdom.html               die Startdatei für das Schülerlaufwerk (siehe docs/adr/0005)
//   dist/Mathekingdom-ohne-Netz.html     Schüler-Dashboard mit allem in einer Datei, zum Ausprobieren ohne Netz
//   dist/lehrer-paket.js                 das Lehrer-Dashboard mit Pools (liegt online und als Kopie auf dem Lehrerlaufwerk)
//   dist/Mathekingdom-Lehrer.html        die Startdatei für den Lehrer-PC (siehe docs/adr/0011)
//   dist/Mathekingdom-Lehrer-ohne-Netz.html  Lehrer-Dashboard in einer Datei, aktualisiert sich nicht
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

await build({
  entryPoints: [new URL('src/schueler/app.js', wurzel).pathname],
  outfile: new URL('dist/schueler-dashboard.js', wurzel).pathname,
  bundle: true, format: 'iife', minify: true, target: 'chrome110',
  loader: { '.css': 'text' }, logLevel: 'warning', define,
});
const dashboard = readFileSync(new URL('dist/schueler-dashboard.js', wurzel), 'utf8');

await build({
  entryPoints: [new URL('src/lehrer/app.js', wurzel).pathname],
  outfile: new URL('dist/lehrer-dashboard.js', wurzel).pathname,
  bundle: true, format: 'iife', minify: true, target: 'chrome110',
  loader: { '.css': 'text' }, logLevel: 'warning', define,
});
const lehrer = readFileSync(new URL('dist/lehrer-dashboard.js', wurzel), 'utf8');

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

// Startdatei: lädt das aktuelle Dashboard online. Gelingt das nicht, nimmt sie die Kopie aus dem Klassenordner.
const startdatei = seite(`<script>
(function () {
  var BASIS = ${JSON.stringify(BASIS)};
  var ziel = document.getElementById('mathekingdom');
  var fertig = false;
  function ausOrdner() {
    if (fertig) return; fertig = true;
    ziel.innerHTML = '<div style="font:17px Segoe UI,system-ui,sans-serif;max-width:460px;margin:12vh auto;padding:0 16px;text-align:center">'
      + '<h1 style="color:#1d2b4f">Mathekingdom</h1><p>Das Internet ist gerade nicht erreichbar. Wähle den Ordner deiner Klasse, dann geht es trotzdem los.</p>'
      + '<button id="mk-ordner" style="font:inherit;padding:12px 18px;border-radius:10px;border:0;background:#1d2b4f;color:#fff;cursor:pointer">Klassenordner wählen</button>'
      + '<p id="mk-fehler" style="color:#b3372f;font-weight:600"></p></div>';
    document.getElementById('mk-ordner').onclick = function () {
      if (!window.showDirectoryPicker) { document.getElementById('mk-fehler').textContent = 'Öffne diese Datei bitte mit Edge oder Chrome.'; return; }
      window.showDirectoryPicker({ id: 'mathekingdom', mode: 'readwrite' }).then(function (ordner) {
        return ordner.getDirectoryHandle('_mathekingdom').then(function (system) { return system.getFileHandle('schueler-dashboard.js'); })
          .then(function (datei) { return datei.getFile(); }).then(function (datei) { return datei.text(); })
          .then(function (code) {
            window.MK_ORDNER = ordner;
            window.MK_QUELLE = 'kopie';
            ziel.innerHTML = '';
            var skript = document.createElement('script');
            skript.textContent = code;
            document.body.appendChild(skript);
          });
      }).catch(function (e) {
        if (e.name !== 'AbortError') document.getElementById('mk-fehler').textContent = 'In diesem Ordner liegt kein Mathekingdom. Hast du den Ordner deiner Klasse gewählt?';
      });
    };
  }
  window.MK_BASIS = BASIS;
  // Öffentlicher Schlüssel der Lehrkraft. Das Lehrer-Dashboard trägt ihn ein, wenn es die Startdatei ausgibt (siehe docs/adr/0006).
  window.MK_SCHLUESSEL = /*SCHLUESSEL*/null;
  window.MK_QUELLE = 'online';
  var skript = document.createElement('script');
  skript.src = BASIS + 'dist/schueler-dashboard.js';
  skript.onload = function () { fertig = true; };
  // Der Grund landet im Betriebsprotokoll (ADR 0013).
  skript.onerror = function () { window.MK_GRUND = 'GitHub nicht erreichbar oder Datei fehlt (dist/schueler-dashboard.js)'; ausOrdner(); };
  setTimeout(function () { if (!fertig) { window.MK_GRUND = 'GitHub hat nicht innerhalb von 6 Sekunden geantwortet'; skript.remove(); ausOrdner(); } }, 6000);
  document.body.appendChild(skript);
})();
</script>`);
writeFileSync(new URL('dist/Mathekingdom.html', wurzel), startdatei);

// Schüler-Dashboard ohne Netz: Dashboard und alle Aufgabenpools eingebettet.
const pools = {};
for (const name of readdirSync(new URL('aufgabenpool/', wurzel))) {
  const m = name.match(/^klasse-(\d+)\.json$/);
  if (m) pools[m[1]] = JSON.parse(readFileSync(new URL(`aufgabenpool/${name}`, wurzel), 'utf8'));
}
writeFileSync(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel),
  seite(`<script>window.MK_POOLS = ${sicher(JSON.stringify(pools))}; window.MK_QUELLE = 'ohne-netz';</script>\n<script>${sicher(dashboard)}</script>`));

// Lehrer-Paket: bringt Pools, Schüler-Dashboard und Startdatei mit, um sie in den Klassenordner zu legen.
const paket = `window.MK_POOLS = ${JSON.stringify(pools)};
window.MK_BASIS = ${JSON.stringify(BASIS)};
window.MK_SCHUELER_JS = ${JSON.stringify(dashboard)};
window.MK_STARTDATEI = ${JSON.stringify(startdatei)};
${lehrer}`;
writeFileSync(new URL('dist/lehrer-paket.js', wurzel), paket);

// Lehrer-Dashboard ohne Netz: das Paket in einer Datei. Aktualisiert sich nicht.
writeFileSync(new URL('dist/Mathekingdom-Lehrer-ohne-Netz.html', wurzel), seite(
  `<script>window.MK_QUELLE = 'ohne-netz';</script>\n<script>${sicher(paket)}</script>`, 'Mathekingdom Lehrer', 'mathekingdom-lehrer'));

// Startdatei der Lehrkraft (ADR 0011): lädt das aktuelle Lehrer-Paket online und merkt es sich,
// damit das Dashboard eine Kopie aufs Lehrerlaufwerk legen kann. Ohne Netz kommt die Kopie von dort.
const lehrerStart = seite(`<script>
(function () {
  var BASIS = ${JSON.stringify(BASIS)};
  var ziel = document.getElementById('mathekingdom-lehrer');
  var KASTEN = 'font:16px Segoe UI,system-ui,sans-serif;max-width:480px;margin:12vh auto;padding:0 16px;text-align:center;color:#1f2533';
  var KNOPF = 'font:inherit;padding:11px 16px;border-radius:10px;border:0;background:#1d2b4f;color:#fff;cursor:pointer;margin:4px';
  function starte(code, quelle, ordner) {
    window.MK_QUELLE = quelle;
    if (ordner) window.MK_LEHRER_ORDNER = ordner;
    ziel.innerHTML = '';
    var skript = document.createElement('script');
    skript.textContent = code;
    document.body.appendChild(skript);
  }
  function ausKopie(ordner) {
    return ordner.getDirectoryHandle('_mathekingdom').then(function (system) { return system.getFileHandle('lehrer-paket.js'); })
      .then(function (datei) { return datei.getFile(); }).then(function (datei) { return datei.text(); })
      .then(function (code) { starte(code, 'kopie-lehrer', ordner); });
  }
  function gemerkt() {
    return new Promise(function (ok) {
      try {
        var r = indexedDB.open('mathekingdom-lehrer', 1);
        r.onupgradeneeded = function () { r.result.createObjectStore('ordner'); };
        r.onerror = function () { ok(null); };
        r.onsuccess = function () {
          try { var g = r.result.transaction('ordner').objectStore('ordner').get('lehrer'); g.onsuccess = function () { ok(g.result || null); }; g.onerror = function () { ok(null); }; }
          catch (e) { ok(null); }
        };
      } catch (e) { ok(null); }
    });
  }
  function ohneNetz() {
    ziel.innerHTML = '<div style="' + KASTEN + '"><h1 style="color:#1d2b4f">Mathekingdom Lehrer</h1>'
      + '<p>GitHub ist gerade nicht erreichbar. Wähle deinen Ordner auf dem Lehrerlaufwerk, dann startet die dort gesicherte Kopie.</p>'
      + '<p style="font-size:13px;color:#5b6475" id="mk-grund"></p>'
      + '<p id="mk-weiter"></p><button id="mk-lehrerordner" style="' + KNOPF + '">Ordner auf dem Lehrerlaufwerk wählen</button>'
      + '<p id="mk-fehler" style="color:#b3372f;font-weight:600"></p></div>';
    document.getElementById('mk-grund').textContent = window.MK_GRUND || '';
    var fehler = function (e) {
      if (e && e.name === 'AbortError') return;
      document.getElementById('mk-fehler').textContent = 'In diesem Ordner liegt noch keine Kopie. Öffne das Dashboard einmal mit Internet, dann wird sie angelegt.';
    };
    gemerkt().then(function (handle) {
      if (!handle) return;
      var b = document.createElement('button');
      b.id = 'mk-weiter-knopf'; b.style.cssText = KNOPF; b.textContent = 'Weiter mit Ordner „' + handle.name + '“';
      b.onclick = function () {
        handle.requestPermission({ mode: 'readwrite' }).then(function (r) { if (r === 'granted') return ausKopie(handle); }).catch(fehler);
      };
      document.getElementById('mk-weiter').appendChild(b);
    });
    document.getElementById('mk-lehrerordner').onclick = function () {
      if (!window.showDirectoryPicker) { document.getElementById('mk-fehler').textContent = 'Öffne diese Datei bitte mit Edge oder Chrome.'; return; }
      window.showDirectoryPicker({ id: 'mathekingdom-lehrer', mode: 'readwrite' }).then(ausKopie).catch(fehler);
    };
  }
  ziel.innerHTML = '<p style="' + KASTEN + '">Mathekingdom wird geladen …</p>';
  var abbruch = new AbortController();
  var uhr = setTimeout(function () { abbruch.abort(); }, 10000);
  fetch(BASIS + 'dist/lehrer-paket.js', { cache: 'no-cache', signal: abbruch.signal })
    .then(function (antwort) {
      if (!antwort.ok) { var f = new Error('Status ' + antwort.status); f.status = antwort.status; throw f; }
      return antwort.text();
    })
    .then(function (code) { clearTimeout(uhr); window.MK_LEHRER_PAKET = code; starte(code, 'online'); })
    .catch(function (e) {
      clearTimeout(uhr);
      // Der Grund landet im Betriebsprotokoll (ADR 0013) und steht auf dieser Seite.
      window.MK_GRUND = e.status === 404 ? 'GitHub antwortet 404: Die Datei fehlt. Ist GitHub Pages für main eingeschaltet?'
        : e.status ? 'GitHub antwortet mit Fehler ' + e.status
        : e.name === 'AbortError' ? 'GitHub hat nicht innerhalb von 10 Sekunden geantwortet'
        : 'GitHub nicht erreichbar (' + e.message + ')';
      ohneNetz();
    });
})();
</script>`, 'Mathekingdom Lehrer', 'mathekingdom-lehrer');
writeFileSync(new URL('dist/Mathekingdom-Lehrer.html', wurzel), lehrerStart);

console.log(`Gebaut: Version ${version.nummer} vom ${version.datum}, Schüler-Dashboard ${Math.round(dashboard.length / 1024)} KB, Lehrer-Paket ${Math.round(paket.length / 1024)} KB, Pools für Klasse ${Object.keys(pools).join(', ')}.`);
