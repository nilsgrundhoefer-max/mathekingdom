// Belohnungsspiele (ADR 0018): reiner Spaß, eine Runde von höchstens drei Minuten, nur Pfeiltasten, ohne Ton.
// Eigene Spiele im Stil der Karte, keine Nachbauten bekannter Spiele. Die Spielregeln sind reine Funktionen
// (testbar ohne Browser); `starteSpiel` zeichnet sie auf ein Canvas.

const PERGAMENT = '#f6efdf', TINTE = '#2f2820', SEPIA = '#5b4632', ROT = '#9e2f28', BLAU = '#2f5f8a', GRUEN = '#3e6b3a';

// ---------- Botenritt: Schlangenspiel ----------
// Ein Reiter sammelt Briefe; mit jedem Brief wird sein Gefolge länger und er ein wenig schneller.
export const RITT = { spalten: 24, zeilen: 16, start: 7, schrittMs: 150, schnellerJeBrief: 4, schnellstens: 70 };
const RICHTUNG = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };

export function neuerRitt(zufall = Math.random) {
  const y = Math.floor(RITT.zeilen / 2);
  const zustand = { glieder: [[5, y], [4, y], [3, y]], richtung: [1, 0], naechste: [1, 0], brief: null, punkte: 0, vorbei: false };
  zustand.brief = freiesFeld(zustand.glieder, zufall);
  return zustand;
}
function freiesFeld(belegt, zufall) {
  const frei = [];
  for (let x = 0; x < RITT.spalten; x++) for (let y = 0; y < RITT.zeilen; y++) if (!belegt.some(([a, b]) => a === x && b === y)) frei.push([x, y]);
  return frei[Math.floor(zufall() * frei.length)] ?? null;
}
// Richtungswechsel gilt erst beim nächsten Schritt; umkehren geht nicht.
export function lenkeRitt(zustand, taste) {
  const r = RICHTUNG[taste];
  if (!r) return false;
  if (r[0] === -zustand.richtung[0] && r[1] === -zustand.richtung[1]) return true;
  zustand.naechste = r;
  return true;
}
export function rittSchritt(zustand, zufall = Math.random) {
  if (zustand.vorbei) return zustand;
  zustand.richtung = zustand.naechste;
  const [kx, ky] = zustand.glieder[0];
  const kopf = [kx + zustand.richtung[0], ky + zustand.richtung[1]];
  const frisst = zustand.brief && kopf[0] === zustand.brief[0] && kopf[1] === zustand.brief[1];
  const koerper = frisst ? zustand.glieder : zustand.glieder.slice(0, -1);
  const draussen = kopf[0] < 0 || kopf[1] < 0 || kopf[0] >= RITT.spalten || kopf[1] >= RITT.zeilen;
  if (draussen || koerper.some(([a, b]) => a === kopf[0] && b === kopf[1])) { zustand.vorbei = true; return zustand; }
  zustand.glieder = [kopf, ...koerper];
  if (frisst) { zustand.punkte++; zustand.brief = freiesFeld(zustand.glieder, zufall); }
  return zustand;
}
export const rittTakt = (zustand) => Math.max(RITT.schnellstens, RITT.schrittMs - zustand.punkte * RITT.schnellerJeBrief);

// ---------- Burgmauer: Abwehrspiel ----------
// Raben stoßen einzeln in Bögen auf die Mauer herab; die Armbrust fährt unten hin und her und schießt nach oben.
// Erreicht ein Rabe die Mauer, ist ein Banner verloren. Mit der Zeit kommen sie öfter und schneller.
export const MAUER = { breite: 480, hoehe: 320, mauerY: 286, banner: 3, armbrustTempo: 260, bolzenTempo: 420, nachladenMs: 320, rabeTempo: 46, abstandMs: 1500 };

export function neueMauer() {
  return { x: MAUER.breite / 2, raben: [], bolzen: [], banner: MAUER.banner, punkte: 0, zeit: 0, bisRabe: 600, nachladen: 0, vorbei: false };
}
// eingabe: { links, rechts, schiessen } (gedrückte Tasten), dt in Millisekunden.
export function mauerSchritt(zustand, dt, eingabe = {}, zufall = Math.random) {
  if (zustand.vorbei) return zustand;
  const s = dt / 1000;
  zustand.zeit += dt;
  const stufe = 1 + zustand.zeit / 60000; // nach einer Minute doppelt so lebhaft wie am Anfang
  zustand.x = Math.min(MAUER.breite - 20, Math.max(20, zustand.x + ((eingabe.rechts ? 1 : 0) - (eingabe.links ? 1 : 0)) * MAUER.armbrustTempo * s));
  zustand.nachladen = Math.max(0, zustand.nachladen - dt);
  if (eingabe.schiessen && zustand.nachladen === 0) { zustand.bolzen.push({ x: zustand.x, y: MAUER.mauerY - 18 }); zustand.nachladen = MAUER.nachladenMs; }
  zustand.bisRabe -= dt;
  if (zustand.bisRabe <= 0) {
    zustand.raben.push({ x0: 40 + zufall() * (MAUER.breite - 80), y: -16, weite: 30 + zufall() * 70, phase: zufall() * Math.PI * 2, tempo: MAUER.rabeTempo * (0.8 + zufall() * 0.5) * stufe, t: 0 });
    zustand.bisRabe = MAUER.abstandMs / stufe;
  }
  for (const r of zustand.raben) { r.t += s; r.y += r.tempo * s; r.x = Math.min(MAUER.breite - 14, Math.max(14, r.x0 + Math.sin(r.phase + r.t * 1.8) * r.weite)); }
  for (const b of zustand.bolzen) b.y -= MAUER.bolzenTempo * s;
  for (const b of zustand.bolzen) {
    const treffer = zustand.raben.find((r) => !r.weg && Math.abs(r.x - b.x) < 16 && Math.abs(r.y - b.y) < 14);
    if (treffer) { treffer.weg = true; b.weg = true; zustand.punkte++; }
  }
  for (const r of zustand.raben) if (!r.weg && r.y >= MAUER.mauerY - 6) { r.weg = true; zustand.banner--; }
  zustand.raben = zustand.raben.filter((r) => !r.weg);
  zustand.bolzen = zustand.bolzen.filter((b) => !b.weg && b.y > -10);
  if (zustand.banner <= 0) zustand.vorbei = true;
  return zustand;
}

// ---------- Zeichnen ----------
function rittMalen(g, zustand, zelle) {
  g.fillStyle = PERGAMENT; g.fillRect(0, 0, RITT.spalten * zelle, RITT.zeilen * zelle);
  g.strokeStyle = 'rgba(91,70,50,.12)'; g.lineWidth = 1;
  for (let x = 0; x <= RITT.spalten; x++) { g.beginPath(); g.moveTo(x * zelle, 0); g.lineTo(x * zelle, RITT.zeilen * zelle); g.stroke(); }
  for (let y = 0; y <= RITT.zeilen; y++) { g.beginPath(); g.moveTo(0, y * zelle); g.lineTo(RITT.spalten * zelle, y * zelle); g.stroke(); }
  if (zustand.brief) {
    const [bx, by] = zustand.brief, x = bx * zelle + 3, y = by * zelle + 5, b = zelle - 6, hh = zelle - 10;
    g.fillStyle = '#fffaf0'; g.strokeStyle = SEPIA; g.lineWidth = 1.5; g.fillRect(x, y, b, hh); g.strokeRect(x, y, b, hh);
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + b / 2, y + hh / 2); g.lineTo(x + b, y); g.stroke();
    g.fillStyle = ROT; g.beginPath(); g.arc(x + b / 2, y + hh / 2, 3, 0, Math.PI * 2); g.fill();
  }
  zustand.glieder.forEach(([gx, gy], i) => {
    const mx = gx * zelle + zelle / 2, my = gy * zelle + zelle / 2;
    g.fillStyle = i === 0 ? ROT : i % 2 ? BLAU : GRUEN; g.strokeStyle = TINTE; g.lineWidth = 1.5;
    g.beginPath(); g.arc(mx, my, i === 0 ? zelle / 2 - 1 : zelle / 2 - 3, 0, Math.PI * 2); g.fill(); g.stroke();
    if (i === 0) { // Wimpel des Boten in Laufrichtung
      const [rx, ry] = zustand.richtung;
      g.fillStyle = '#f3e7c9'; g.beginPath(); g.moveTo(mx + rx * 4 - ry * 4, my + ry * 4 + rx * 4); g.lineTo(mx + rx * 9, my + ry * 9); g.lineTo(mx + rx * 4 + ry * 4, my + ry * 4 - rx * 4); g.fill();
    }
  });
}
function rabe(g, x, y, t) {
  const schlag = Math.sin(t * 12) * 5;
  g.fillStyle = TINTE;
  g.beginPath(); g.ellipse(x, y, 7, 5, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(x - 4, y - 1); g.quadraticCurveTo(x - 12, y - 8 - schlag, x - 18, y - 2 - schlag); g.quadraticCurveTo(x - 10, y + 1, x - 4, y + 2); g.fill();
  g.beginPath(); g.moveTo(x + 4, y - 1); g.quadraticCurveTo(x + 12, y - 8 - schlag, x + 18, y - 2 - schlag); g.quadraticCurveTo(x + 10, y + 1, x + 4, y + 2); g.fill();
  g.fillStyle = '#c39a2c'; g.beginPath(); g.moveTo(x - 2, y + 4); g.lineTo(x, y + 9); g.lineTo(x + 2, y + 4); g.fill();
}
function mauerMalen(g, zustand) {
  g.fillStyle = PERGAMENT; g.fillRect(0, 0, MAUER.breite, MAUER.hoehe);
  g.strokeStyle = 'rgba(91,70,50,.25)'; g.lineWidth = 1.2; // ferne Hügel
  g.beginPath(); g.moveTo(0, 200); g.quadraticCurveTo(120, 150, 240, 190); g.quadraticCurveTo(360, 230, 480, 170); g.stroke();
  const y = MAUER.mauerY;
  g.fillStyle = '#d9cbb0'; g.strokeStyle = SEPIA; g.lineWidth = 1.5;
  g.fillRect(0, y, MAUER.breite, MAUER.hoehe - y);
  for (let x = 0; x < MAUER.breite; x += 32) { g.fillRect(x, y - 10, 18, 10); g.strokeRect(x, y - 10, 18, 10); }
  g.beginPath(); g.moveTo(0, y); g.lineTo(MAUER.breite, y); g.stroke();
  for (let i = 0; i < MAUER.banner; i++) { // Banner rechts unten
    const bx = MAUER.breite - 26 - i * 22, by = y + 8;
    g.strokeStyle = TINTE; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by + 22); g.stroke();
    g.fillStyle = i < zustand.banner ? ROT : 'rgba(91,70,50,.25)'; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + 14, by + 4); g.lineTo(bx, by + 10); g.fill();
  }
  const ax = zustand.x; // Armbrust
  g.strokeStyle = TINTE; g.lineWidth = 3;
  g.beginPath(); g.moveTo(ax, y - 4); g.lineTo(ax, y - 24); g.stroke();
  g.lineWidth = 2.5; g.beginPath(); g.moveTo(ax - 13, y - 12); g.quadraticCurveTo(ax, y - 22, ax + 13, y - 12); g.stroke();
  g.fillStyle = SEPIA; g.fillRect(ax - 6, y - 6, 12, 6);
  g.strokeStyle = TINTE; g.lineWidth = 2;
  for (const b of zustand.bolzen) { g.beginPath(); g.moveTo(b.x, b.y); g.lineTo(b.x, b.y + 12); g.stroke(); g.beginPath(); g.moveTo(b.x - 3, b.y + 3); g.lineTo(b.x, b.y - 1); g.lineTo(b.x + 3, b.y + 3); g.stroke(); }
  for (const r of zustand.raben) rabe(g, r.x, r.y, r.t);
}

// Startet ein Belohnungsspiel auf `canvas`. melde(stand) bekommt { punkte, rest, vorbei } nach jedem Bild.
// Die Runde endet nach `sekunden` oder wenn das Spiel vorbei ist. Liefert eine Funktion zum Abbrechen.
export function starteSpiel(id, canvas, { sekunden = 180, melde = () => {}, zufall = Math.random } = {}) {
  const g = canvas.getContext('2d');
  const ende = Date.now() + sekunden * 1000;
  const tasten = {};
  let zustand, letzte = performance.now(), sammel = 0, laeuft = true, rahmen = 0;
  if (id === 'botenritt') { const zelle = 20; canvas.width = RITT.spalten * zelle; canvas.height = RITT.zeilen * zelle; zustand = neuerRitt(zufall); }
  else { canvas.width = MAUER.breite; canvas.height = MAUER.hoehe; zustand = neueMauer(); }
  const unten = (e) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    tasten[e.key] = true;
    if (id === 'botenritt') lenkeRitt(zustand, e.key);
  };
  const oben = (e) => { tasten[e.key] = false; };
  window.addEventListener('keydown', unten);
  window.addEventListener('keyup', oben);
  const stopp = () => { laeuft = false; cancelAnimationFrame(rahmen); window.removeEventListener('keydown', unten); window.removeEventListener('keyup', oben); };
  const bild = (t) => {
    if (!laeuft) return;
    const dt = Math.min(100, t - letzte); letzte = t;
    if (id === 'botenritt') {
      sammel += dt;
      while (sammel >= rittTakt(zustand) && !zustand.vorbei) { sammel -= rittTakt(zustand); rittSchritt(zustand, zufall); }
      rittMalen(g, zustand, 20);
    } else {
      mauerSchritt(zustand, dt, { links: tasten.ArrowLeft, rechts: tasten.ArrowRight, schiessen: tasten.ArrowUp }, zufall);
      mauerMalen(g, zustand);
    }
    const rest = Math.max(0, Math.ceil((ende - Date.now()) / 1000));
    const vorbei = zustand.vorbei || rest === 0;
    melde({ punkte: zustand.punkte, rest, vorbei, banner: zustand.banner });
    if (vorbei) stopp(); else rahmen = requestAnimationFrame(bild);
  };
  rahmen = requestAnimationFrame(bild);
  return stopp;
}
