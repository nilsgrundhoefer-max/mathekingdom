// Aufklappbare Karten (Version 0.32): In den Reitern von Lehrer- und Administrator-Dashboard wird jede Karte mit
// Überschrift zu einer Zeile, die man auf- und zuklappt. Die Karte bleibt dabei dieselbe Karte (kein Umbau zu <details>),
// damit Verweise darauf und spät nachgeladene Inhalte weiter funktionieren. Der Zustand bleibt beim Neuzeichnen
// und über das Schließen hinaus erhalten: pro Browser, für alle Klassen gleich.
import { h } from '../schueler/dom.js';

// Schlüssel einer Karte: ihre id oder ihre Überschrift ohne Zahlen und Klammern („Akut-Zone (2)“ → „Akut-Zone“).
export const titelSchluessel = (text) => text.replace(/\(.*?\)/g, '').replace(/\d+/g, '').replace(/[\s:–-]+$/u, '').replace(/\s+/g, ' ').trim();

// Kopf einer Karte: die führenden Kinder bis einschließlich der Überschrift (h2 direkt oder in der ersten .reihe).
export function kopfLaenge(kinder) {
  const i = kinder.findIndex((c, n) => n < 3 && (c.tagName === 'H2' || (c.classList?.contains('reihe') && c.querySelector(':scope > h2'))));
  return i < 0 ? 0 : i + 1;
}

const BEDIENT = 'button, a, input, select, textarea, label, summary, [contenteditable]';

export function aufklapper(name, { anfangsOffen = () => false } = {}) {
  const speicher = `mk-aufgeklappt-${name}`;
  let zustand = {};
  try { zustand = JSON.parse(localStorage.getItem(speicher)) ?? {}; } catch { zustand = {}; }
  const merke = () => { try { localStorage.setItem(speicher, JSON.stringify(zustand)); } catch { /* dann eben nur bis zum Schließen */ } };
  // '*' im gespeicherten Zustand gilt für alle Karten ohne eigenen Eintrag (für Tests und „alles offen“).
  const offen = (id, allein) => (id in zustand ? zustand[id] : '*' in zustand ? zustand['*'] : allein || anfangsOffen(id));

  function stelle(karte, auf) {
    karte.classList.toggle('zu', !auf);
    const kopf = karte.querySelector(':scope > .klappkopf h2, :scope > h2.klappkopf');
    kopf?.setAttribute('aria-expanded', String(auf));
  }
  function schalte(karte, auf = karte.classList.contains('zu')) {
    zustand[karte.dataset.klapp] = auf; merke();
    stelle(karte, auf);
  }

  // Macht alle Karten unter `behaelter` aufklappbar. `bereich(karte)` liefert den Reiter, zu dem die Karte gehört.
  // Mehrfach aufrufbar: Bereits vorbereitete Karten bekommen nur ihren Zustand neu.
  function wandle(behaelter, bereich) {
    if (!behaelter) return;
    const karten = [...behaelter.querySelectorAll('section.karte')].filter((k) => !k.parentElement.closest('section.karte'));
    const mitKopf = karten.map((k) => [k, kopfLaenge([...k.children])]).filter(([, n]) => n > 0);
    const proBereich = {};
    for (const [k] of mitKopf) { const b = bereich(k); proBereich[b] = (proBereich[b] ?? 0) + 1; }
    for (const [k, n] of mitKopf) {
      const kinder = [...k.children];
      const titel = kinder[n - 1].tagName === 'H2' ? kinder[n - 1] : kinder[n - 1].querySelector(':scope > h2');
      const b = bereich(k);
      const id = `${b}|${k.id || titelSchluessel(titel.textContent)}`;
      kinder.slice(0, n).forEach((c) => c.classList.add('klappkopf'));
      kinder.slice(n).forEach((c) => c.classList.remove('klappkopf'));
      titel.tabIndex = 0;
      titel.setAttribute('role', 'button');
      k.classList.add('klappbar');
      k.dataset.klapp = id;
      // Eine Karte allein im Reiter ist anfangs offen.
      stelle(k, offen(id, proBereich[b] === 1));
    }
  }

  // Klicks und Tasten an einer Stelle abfangen, damit neu gezeichnete Karten nichts anmelden müssen.
  function binde(wurzel) {
    wurzel.addEventListener('click', (ev) => {
      const kopf = ev.target.closest?.('.klappkopf');
      if (!kopf) return;
      // Knöpfe und Auswahlfelder im Kopf (z. B. „Neu laden“) tun weiter nur ihre eigene Sache.
      const bedient = ev.target.closest(BEDIENT);
      if (bedient && kopf.contains(bedient)) return;
      const karte = kopf.closest('section.klappbar');
      if (karte) schalte(karte);
    });
    wurzel.addEventListener('keydown', (ev) => {
      if ((ev.key !== 'Enter' && ev.key !== ' ') || !ev.target.matches?.('.klappbar > .klappkopf h2, .klappbar > h2.klappkopf')) return;
      ev.preventDefault();
      schalte(ev.target.closest('section.klappbar'));
    });
  }

  // „Alle aufklappen“ und „Alle zuklappen“ für die Karten unter dem Behälter, den `wo()` beim Klick liefert.
  const alleKnoepfe = (wo) => h('span', { class: 'klappalle' },
    h('button', { class: 'schlicht', id: 'alle-auf', onclick: () => wo()?.querySelectorAll('section.klappbar').forEach((k) => schalte(k, true)) }, 'Alle aufklappen'),
    h('button', { class: 'schlicht', id: 'alle-zu', onclick: () => wo()?.querySelectorAll('section.klappbar').forEach((k) => schalte(k, false)) }, 'Alle zuklappen'));

  return { wandle, binde, alleKnoepfe, offen };
}

export const AUFKLAPP_STIL = `
#mathekingdom-lehrer .karte.klappbar > .klappkopf { cursor: pointer; }
#mathekingdom-lehrer .karte.klappbar > .klappkopf h2, #mathekingdom-lehrer .karte.klappbar > h2.klappkopf { margin: 0; }
#mathekingdom-lehrer .karte.klappbar > h2.klappkopf::before, #mathekingdom-lehrer .karte.klappbar > .klappkopf > h2::before { content: '▾'; color: var(--grau); display: inline-block; width: 1.1em; }
#mathekingdom-lehrer .karte.klappbar.zu > h2.klappkopf::before, #mathekingdom-lehrer .karte.klappbar.zu > .klappkopf > h2::before { content: '▸'; }
#mathekingdom-lehrer .karte.klappbar:not(.zu) > h2.klappkopf { margin-bottom: 12px; }
#mathekingdom-lehrer .karte.klappbar.zu > .klappkopf { margin-bottom: 0; }
#mathekingdom-lehrer .karte.klappbar.zu > :not(.klappkopf) { display: none !important; }
#mathekingdom-lehrer .karte.klappbar.zu { padding-top: 12px; padding-bottom: 12px; }
#mathekingdom-lehrer .karte.klappbar > .klappkopf h2:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; border-radius: 4px; }
#mathekingdom-lehrer .klappalle { margin-left: auto; display: flex; gap: 6px; }
#mathekingdom-lehrer .klappalle { align-self: center; }
#mathekingdom-lehrer .tabs .klappalle button, #mathekingdom-lehrer .tabs.bereiche .klappalle button { font-size: .85rem; padding: 4px 10px; margin: 0 0 6px; border: 1px solid var(--rand); border-radius: 6px; background: #fff; color: var(--tinte); }
`;
