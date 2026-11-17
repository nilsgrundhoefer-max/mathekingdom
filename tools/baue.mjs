// Baut die auslieferbaren Dateien nach dist/.
// Aufruf: node tools/baue.mjs
//
//   dist/schueler-dashboard.js           das Schüler-Dashboard (liegt online und als Kopie im Klassenordner)
//   dist/Mathekingdom.html               die Startdatei für das Schülerlaufwerk (siehe docs/adr/0005)
//   dist/Schueler-Dashboard-komplett.html  alles in einer Datei, zum Ausprobieren ohne Netz
//   dist/Lehrer-Dashboard.html           das Lehrer-Dashboard in einer Datei (liegt auf dem Lehrer-PC)

import { build } from 'esbuild';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

// Adresse, unter der dieses Repository über GitHub Pages erreichbar ist.
const BASIS = 'https://nilsgrundhoefer-max.github.io/mathekingdom/';
const wurzel = new URL('../', import.meta.url);

await build({
  entryPoints: [new URL('src/schueler/app.js', wurzel).pathname],
  outfile: new URL('dist/schueler-dashboard.js', wurzel).pathname,
  bundle: true, format: 'iife', minify: true, target: 'chrome110',
  loader: { '.css': 'text' }, logLevel: 'warning',
});
const dashboard = readFileSync(new URL('dist/schueler-dashboard.js', wurzel), 'utf8');

await build({
  entryPoints: [new URL('src/lehrer/app.js', wurzel).pathname],
  outfile: new URL('dist/lehrer-dashboard.js', wurzel).pathname,
  bundle: true, format: 'iife', minify: true, target: 'chrome110',
  loader: { '.css': 'text' }, logLevel: 'warning',
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
  var skript = document.createElement('script');
  skript.src = BASIS + 'dist/schueler-dashboard.js';
  skript.onload = function () { fertig = true; };
  skript.onerror = ausOrdner;
  setTimeout(function () { if (!fertig) { skript.remove(); ausOrdner(); } }, 6000);
  document.body.appendChild(skript);
})();
</script>`);
writeFileSync(new URL('dist/Mathekingdom.html', wurzel), startdatei);

// Komplettdatei: Dashboard und alle Aufgabenpools eingebettet.
const pools = {};
for (const name of readdirSync(new URL('aufgabenpool/', wurzel))) {
  const m = name.match(/^klasse-(\d+)\.json$/);
  if (m) pools[m[1]] = JSON.parse(readFileSync(new URL(`aufgabenpool/${name}`, wurzel), 'utf8'));
}
writeFileSync(new URL('dist/Schueler-Dashboard-komplett.html', wurzel),
  seite(`<script>window.MK_POOLS = ${sicher(JSON.stringify(pools))};</script>\n<script>${sicher(dashboard)}</script>`));

// Lehrer-Dashboard: bringt Pools, Schüler-Dashboard und Startdatei mit, um sie in den Klassenordner zu legen.
writeFileSync(new URL('dist/Lehrer-Dashboard.html', wurzel), seite(
  `<script>window.MK_POOLS = ${sicher(JSON.stringify(pools))};
window.MK_BASIS = ${JSON.stringify(BASIS)};
window.MK_SCHUELER_JS = ${sicher(JSON.stringify(dashboard))};
window.MK_STARTDATEI = ${sicher(JSON.stringify(startdatei))};</script>\n<script>${sicher(lehrer)}</script>`,
  'Mathekingdom Lehrer-Dashboard', 'mathekingdom-lehrer'));

console.log(`Gebaut: Dashboard ${Math.round(dashboard.length / 1024)} KB, Pools für Klasse ${Object.keys(pools).join(', ')}.`);
