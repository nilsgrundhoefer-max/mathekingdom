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
function fuelle(el, kinder) {
  for (const k of kinder.flat(Infinity)) if (k != null && k !== false) el.append(k);
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
