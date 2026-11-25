// Versionsanzeige unten in der Ecke beider Dashboards. Die Angaben setzt tools/baue.mjs aus VERSIONEN.md ein.
import { h } from '../schueler/dom.js';

/* global MK_VERSION */
const V = typeof MK_VERSION !== 'undefined' ? MK_VERSION : { nummer: 'Entwicklung', datum: '', schueler: [], lehrkraft: [] };

const QUELLEN = {
  kopie: 'Kopie aus dem Klassenordner',
  'kopie-lehrer': 'Kopie vom Lehrerlaufwerk',
  'ohne-netz': 'Datei ohne Netz, aktualisiert sich nicht',
};

export const versionsnummer = () => V.nummer;
export const versionstext = () => `Version ${V.nummer}${V.datum ? ` vom ${V.datum}` : ''}`;

// Liefert immer dasselbe Element, damit es beim Neuzeichnen offen bleibt.
let element;
export function versionsHinweis(seite) {
  if (element) return element;
  const quelle = QUELLEN[window.MK_QUELLE];
  const liste = (titel, punkte) => punkte.length > 0 && h('div', {}, h('b', {}, titel), h('ul', {}, punkte.map((p) => h('li', {}, p))));
  const tafel = h('div', { class: 'mk-version-tafel', hidden: true },
    h('strong', {}, `Neu in ${versionstext()}`),
    seite === 'lehrkraft'
      ? [liste('Für die Lehrkraft', V.lehrkraft), liste('Für die Schüler', V.schueler)]
      : liste('Was ist neu', V.schueler),
    seite === 'lehrkraft' && h('p', {}, 'Alle Versionen stehen in VERSIONEN.md im Repository.'));
  const knopf = h('button', { class: 'mk-version-knopf', id: 'version', 'aria-expanded': 'false', onclick: () => {
    tafel.hidden = !tafel.hidden; knopf.setAttribute('aria-expanded', String(!tafel.hidden));
  } }, versionstext(), quelle && ` (${quelle})`);
  element = h('div', { class: 'mk-version' }, tafel, knopf);
  return element;
}

export const VERSION_STIL = `
.mk-version { position: fixed; right: 10px; bottom: 8px; z-index: 50; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; max-width: calc(100vw - 20px); }
.mk-version-knopf { font: 12px/1.3 "Segoe UI", system-ui, sans-serif; color: var(--grau); background: var(--karte); border: 1px solid var(--rand); border-radius: 99px; padding: 3px 10px; cursor: pointer; opacity: .85; }
.mk-version-knopf:hover { opacity: 1; }
.mk-version-tafel { font: 13.5px/1.45 "Segoe UI", system-ui, sans-serif; color: var(--tinte); background: var(--karte); border: 1px solid var(--rand); border-radius: 12px; padding: 12px 14px; width: 340px; max-width: 100%; max-height: 60vh; overflow: auto; box-shadow: 0 6px 20px rgba(0,0,0,.12); }
.mk-version-tafel[hidden] { display: none; }
.mk-version-tafel ul { margin: 4px 0 8px; padding-left: 18px; }
.mk-version-tafel p { margin: 4px 0 0; font-size: 12px; color: var(--grau); }
@media print { .mk-version { display: none; } }
`;
