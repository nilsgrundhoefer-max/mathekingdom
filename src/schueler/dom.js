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
// Klasse 7 (ADR 0043): Ein Vorzeichen direkt vor dem Bruch („−3⁄4“, „(−1 1⁄2)“) bleibt in derselben Zeile wie der Bruch.
const BRUCH = /([(]?[−+])?(?:(\d+|▢|\?)\u202f)?(\d+|▢|\?)\u2044(\d+|▢|\?)([?.!,:;“”)]*)/g;
export function mitBruch(text) {
  const teile = [];
  let ende = 0;
  for (const m of text.matchAll(BRUCH)) {
    if (m.index > ende) teile.push(text.slice(ende, m.index));
    const bruch = document.createElement('span');
    bruch.className = 'bruch'; bruch.setAttribute('role', 'img'); bruch.setAttribute('aria-label', `${m[1]?.includes('−') ? 'minus ' : ''}${m[2] ? `${m[2]} und ` : ''}${m[3]} durch ${m[4]}`);
    const z = document.createElement('span'); z.className = 'bz'; z.textContent = m[3];
    const n = document.createElement('span'); n.className = 'bn'; n.textContent = m[4];
    bruch.append(z, n);
    let stueck = bruch;
    if (m[2]) { stueck = document.createElement('span'); stueck.className = 'gemischt'; stueck.append(m[2], bruch); }
    // Ein Satzzeichen direkt nach dem Bruch bleibt in derselben Zeile wie der Bruch.
    if (m[5] || m[1]) { const satz = document.createElement('span'); satz.className = m[1] ? 'bruchsatz vorzeichenbruch' : 'bruchsatz'; satz.append(m[1] ?? '', stueck, m[5] ?? ''); stueck = satz; }
    teile.push(stueck);
    ende = m.index + m[0].length;
  }
  if (ende < text.length) teile.push(text.slice(ende));
  return teile;
}
// Klasse 6, Kapitel 4 (ADR 0047): Über den Ziffern der Periode steht ein Strich (im Text U+0305 nach jeder Ziffer: „0,16̅“).
// Gezeichnet wird er als Überstrich über den Ziffern, damit er in jeder Schrift gleich aussieht.
const PERIODE = /((?:\d\u0305)+)/;
export function mitPeriode(text) {
  return text.split(PERIODE).filter((t) => t !== '').map((t, i) => (PERIODE.test(t) && /^(?:\d\u0305)+$/.test(t)
    ? Object.assign(document.createElement('span'), { className: 'periode', textContent: t.replace(/\u0305/g, '') }) : t));
}
// Version 0.65: Ein Index im Text („h_c“, die Höhe auf c) wird tiefgestellt gezeichnet. In Auswahllisten und Zeichnungen bleibt er Text.
const INDEX = /(?<![A-Za-zÄÖÜäöüß0-9_])([A-Za-zα-ω])_([a-z0-9])(?![A-Za-zÄÖÜäöüß0-9_])/g;
export function mitIndex(text) {
  const teile = [];
  let ende = 0;
  for (const m of text.matchAll(INDEX)) {
    teile.push(text.slice(ende, m.index) + m[1]);
    teile.push(Object.assign(document.createElement('sub'), { textContent: m[2] }));
    ende = m.index + m[0].length;
  }
  if (ende < text.length) teile.push(text.slice(ende));
  return teile.filter((t) => t !== '');
}
function fuelle(el, kinder) {
  const stapeln = !(el instanceof SVGElement) && el.tagName !== 'OPTION';
  for (const k of kinder.flat(Infinity)) if (k != null && k !== false) {
    if (!stapeln && typeof k === 'string' && k.includes('_')) { el.append(k.replace(INDEX, '$1$2')); continue; }
    const stuecke = stapeln && typeof k === 'string' && k.includes('\u2044') ? mitBruch(k) : [k];
    for (const x of stuecke) {
      const mitStrich = stapeln && typeof x === 'string' && x.includes('\u0305') ? mitPeriode(x) : [x];
      for (const y of mitStrich) if (stapeln && typeof y === 'string' && y.includes('_')) el.append(...mitIndex(y)); else el.append(y);
    }
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
