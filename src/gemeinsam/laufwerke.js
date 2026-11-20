// Schild „Laufwerke verbunden“ oben rechts in der Kopfzeile von Lehrer- und Administrator-Dashboard (Version 0.32).
// Grün, wenn alle Ordner verbunden und die nötigen Dateien gefunden sind, sonst rot mit dem, was fehlt.
// Ein Klick öffnet die Liste der Laufwerke, dort lässt sich ein anderer Ordner wählen.
import { h } from '../schueler/dom.js';

// eintraege: [{ art, titel, ordner, funde: [{ text, ok }] }]
export function laufwerkSchild(eintraege, { offen, umschalten, waehle }) {
  const fehlt = eintraege.flatMap((e) => e.funde.filter((f) => !f.ok).map((f) => `${e.titel}: ${f.text}`));
  const ok = fehlt.length === 0;
  const zeilen = eintraege.map((e) => `${e.titel}: Ordner „${e.ordner}“, ${e.funde.map((f) => f.text).join(', ')}`);
  return [
    h('button', { class: `laufwerk-schild ${ok ? 'ok' : 'fehlt'}`, id: 'laufwerke', title: zeilen.join('\n'), 'aria-expanded': String(Boolean(offen)), onclick: umschalten },
      ok ? '✓ Laufwerke verbunden' : `! ${fehlt.length === 1 ? fehlt[0] : `${fehlt.length} Dinge fehlen`}`),
    offen && h('div', { class: 'laufwerk-panel', id: 'laufwerk-panel', role: 'dialog', 'aria-label': 'Laufwerke' },
      h('h2', {}, 'Laufwerke'),
      h('ul', {}, eintraege.map((e) => h('li', { 'data-laufwerk': e.art },
        h('b', {}, e.titel), h('span', { class: 'klein' }, ` Ordner „${e.ordner}“`),
        h('ul', {}, e.funde.map((f) => h('li', { class: f.ok ? 'gut' : 'schlecht' }, `${f.ok ? '✓' : '✗'} ${f.text}`))),
        h('button', { class: 'schlicht', 'data-anderer': e.art, onclick: () => waehle(e.art) }, 'Anderen Ordner wählen')))),
      h('button', { class: 'schlicht', id: 'laufwerk-panel-zu', onclick: umschalten }, 'Schließen')),
  ];
}

export const LAUFWERK_STIL = `
#mathekingdom-lehrer .kopf { position: relative; }
#mathekingdom-lehrer .kopf button.laufwerk-schild { margin-left: auto; font-size: .85rem; padding: 4px 12px; border-radius: 999px; border: 1px solid transparent; font-weight: 600; cursor: pointer; }
#mathekingdom-lehrer .laufwerk-schild.ok { background: #1f7a4d; color: #fff; }
#mathekingdom-lehrer .laufwerk-schild.fehlt { background: #b3261e; color: #fff; }
#mathekingdom-lehrer .laufwerk-panel { position: absolute; right: 18px; top: calc(100% + 6px); z-index: 50; background: #fff; color: var(--tinte); border: 1px solid var(--rand); border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.18); padding: 14px 16px; width: min(420px, calc(100vw - 36px)); }
#mathekingdom-lehrer .kopf .laufwerk-panel button { margin-left: 0; }
#mathekingdom-lehrer .laufwerk-panel h2 { color: var(--nacht); }
#mathekingdom-lehrer .laufwerk-panel > ul { list-style: none; padding: 0; margin: 0 0 10px; display: grid; gap: 12px; }
#mathekingdom-lehrer .laufwerk-panel ul ul { list-style: none; padding: 0; margin: 4px 0 6px; font-size: .9rem; }
#mathekingdom-lehrer .laufwerk-panel li.gut { color: #1f7a4d; }
#mathekingdom-lehrer .laufwerk-panel li.schlecht { color: #b3261e; font-weight: 600; }
#mathekingdom-lehrer .karte.hinterlegt { cursor: pointer; border: 2px solid var(--gold); }
#mathekingdom-lehrer .karte.hinterlegt:hover { box-shadow: 0 6px 18px rgba(0,0,0,.12); }
#mathekingdom-lehrer .karte.hinterlegt:focus-visible { outline: 3px solid var(--gold); outline-offset: 3px; }
#mathekingdom-lehrer .karte.hinterlegt ul.laufwerke { list-style: none; padding: 0; margin: 10px 0 14px; display: grid; gap: 6px; }
#mathekingdom-lehrer .karte.hinterlegt .haken { color: #1f7a4d; font-weight: 700; margin-right: 8px; }
#mathekingdom-lehrer .karte.hinterlegt .zum-oeffnen { font-weight: 700; color: var(--nacht); }
`;
