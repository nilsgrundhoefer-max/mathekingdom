// Kleine Helfer zum Aufbau der Oberfläche ohne Bibliothek.

function setze(el, attribute) {
  for (const [name, wert] of Object.entries(attribute ?? {})) {
    if (wert == null || wert === false) continue;
    if (name.startsWith('on')) el.addEventListener(name.slice(2), wert);
    else if (name === 'class') el.setAttribute('class', wert);
    else if (name in el && !(el instanceof SVGElement)) el[name] = wert;
    else el.setAttribute(name, wert === true ? '' : wert);
  }
}
// Kapitel 9 (ADR 0036): Ein Bruch im Text („3⁄4“, gemischt „1 3⁄4“ mit schmalem Leerzeichen) wird gestapelt gezeichnet,
// Zähler über Nenner mit waagerechtem Bruchstrich. In Auswahllisten (option) und in Zeichnungen bleibt er Text.
const BRUCH = /(?:(\d+|▢|\?)\u202f)?(\d+|▢|\?)\u2044(\d+|▢|\?)([?.!,:;“”]*)/g;
export function mitBruch(text) {
  const teile = [];
  let ende = 0;
  for (const m of text.matchAll(BRUCH)) {
    if (m.index > ende) teile.push(text.slice(ende, m.index));
    const bruch = document.createElement('span');
    bruch.className = 'bruch'; bruch.setAttribute('role', 'img'); bruch.setAttribute('aria-label', `${m[1] ? `${m[1]} und ` : ''}${m[2]} durch ${m[3]}`);
    const z = document.createElement('span'); z.className = 'bz'; z.textContent = m[2];
    const n = document.createElement('span'); n.className = 'bn'; n.textContent = m[3];
    bruch.append(z, n);
    let stueck = bruch;
    if (m[1]) { stueck = document.createElement('span'); stueck.className = 'gemischt'; stueck.append(m[1], bruch); }
    // Ein Satzzeichen direkt nach dem Bruch bleibt in derselben Zeile wie der Bruch.
    if (m[4]) { const satz = document.createElement('span'); satz.className = 'bruchsatz'; satz.append(stueck, m[4]); stueck = satz; }
    teile.push(stueck);
    ende = m.index + m[0].length;
  }
  if (ende < text.length) teile.push(text.slice(ende));
  return teile;
}
function fuelle(el, kinder) {
  const stapeln = !(el instanceof SVGElement) && el.tagName !== 'OPTION';
  for (const k of kinder.flat(Infinity)) if (k != null && k !== false) {
    if (stapeln && typeof k === 'string' && k.includes('\u2044')) el.append(...mitBruch(k)); else el.append(k);
  }
  return el;
}
export function h(tag, attribute, ...kinder) {
  const el = document.createElement(tag);
  setze(el, attribute);
  return fuelle(el, kinder);
}
export function s(tag, attribute, ...kinder) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  setze(el, attribute);
  return fuelle(el, kinder);
}
export const mische = (liste) => {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
