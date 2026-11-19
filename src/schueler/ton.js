// Dezenter Ton bei richtigen Aufgaben (ADR 0016). Nur wenn die Lehrkraft ihn für die Klasse eingeschaltet hat.
// Ein kurzer, leiser Klang aus zwei Sinustönen, ohne Audiodatei; fehlt Web Audio, bleibt es still.
let kontext = null;
export function klinge(art = 'klein') {
  try {
    kontext ??= new (window.AudioContext || window.webkitAudioContext)();
    const toene = art === 'gross' ? [523.25, 659.25, 783.99] : [659.25, 880];
    const start = kontext.currentTime;
    toene.forEach((frequenz, i) => {
      const osz = kontext.createOscillator(), laut = kontext.createGain();
      osz.type = 'sine'; osz.frequency.value = frequenz;
      const t = start + i * 0.09;
      laut.gain.setValueAtTime(0, t);
      laut.gain.linearRampToValueAtTime(0.06, t + 0.02);
      laut.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osz.connect(laut).connect(kontext.destination);
      osz.start(t); osz.stop(t + 0.4);
    });
  } catch { /* ohne Ton weiter */ }
}
