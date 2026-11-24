// Feedbackfragen, Aufgabenanalyse und Export „Teststunde“ (ADR 0042).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import * as AN from '../src/gemeinsam/aufgabenanalyse.js';
import * as SCH from '../src/gemeinsam/schule.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const neu = (code = '5A-AAAA') => L.neuerSpeicherstand(code, '5a', '2026-11-24T08:00:00Z');

test('Feedback: aus ohne Einstellung, an mit Standard 5, nur erlaubte Abstände', () => {
  assert.equal(L.einstellungen({}, '5A-AAAA', pool).feedback, null);
  assert.equal(L.gueltigesFeedback({ an: false, alle: 3 }), null);
  assert.deepEqual(L.gueltigesFeedback({ an: true }), { alle: 5 });
  assert.deepEqual(L.gueltigesFeedback({ an: true, alle: 10 }), { alle: 10 });
  assert.deepEqual(L.gueltigesFeedback({ an: true, alle: 7 }), { alle: 5 });
  // Die Klassendatei trägt die Einstellung zum Schüler.
  const daten = SCH.neueKlassendaten(['5.1']);
  daten.einst.feedback = { an: true, alle: 3 };
  assert.deepEqual(L.einstellungen(SCH.klassendateiInhalt('5a', daten, 't'), '5A-AAAA', pool).feedback, { alle: 3 });
});

test('Feedback: nach jeder n-ten Aufgabe, Fragen reihum, unpassende übersprungen, zwei Antworten', () => {
  const st = neu(), fb = { alle: 3 };
  for (let i = 0; i < 2; i++) L.zaehleFuerFeedback(st, fb);
  assert.equal(L.feedbackFaellig(st, fb), false);
  L.zaehleFuerFeedback(st, fb);
  assert.equal(L.feedbackFaellig(st, fb), true);
  assert.equal(L.feedbackFaellig(st, null), false, 'aus: nie');
  const erste = L.naechsteFeedbackFrage(st, {});
  assert.equal(erste.id, 'aussehen');
  L.trageFeedbackEin(st, erste, 0, 'x', '2026-11-24T09:00:00Z');
  assert.equal(st.feedback[0].aufgabe, undefined, 'Fragen ohne Bezug zur Aufgabe merken sich keine Kennung');
  assert.equal(L.feedbackFaellig(st, fb), false);
  const zweite = L.naechsteFeedbackFrage(st, {});
  assert.equal(zweite.id, 'schwer');
  L.trageFeedbackEin(st, zweite, 1, '5.1.1-H1-G-01', '2026-11-24T09:05:00Z');
  assert.deepEqual(st.feedback[1], { t: '2026-11-24T09:05:00Z', frage: 'schwer', antwort: 1, aufgabe: '5.1.1-H1-G-01' });
  // Ohne offenen Tipp wird die Tippfrage übersprungen, ohne Bild die Bildfrage.
  st.feedbackNaechste = L.FEEDBACK_FRAGEN.findIndex((f) => f.id === 'tipp');
  assert.equal(L.naechsteFeedbackFrage(st, {}).id, 'karte');
  assert.equal(L.naechsteFeedbackFrage(st, { tipp: true }).id, 'tipp');
  assert.ok(L.FEEDBACK_FRAGEN.every((f) => f.antworten.length === 2));
  assert.equal(L.FEEDBACK_FRAGEN.length, 10);
});

test('Aufgabenanalyse: lange Dauer und viele Fehler im Vergleich, Zeitraum, keine Codes', () => {
  const gruppe = pool.aufgaben.filter((a) => a.lernziel === pool.aufgaben[0].lernziel && a.niveau === 'G').slice(0, 3);
  assert.equal(gruppe.length, 3);
  const [lang, normal1, normal2] = gruppe;
  const staende = [1, 2, 3, 4].map((i) => {
    const st = neu(`5A-AAA${i}`);
    const v = (a, richtig, dauer, t = '2026-11-24T09:00:00Z') => st.versuche.push({ t, aufgabe: a.id, lernziel: a.lernziel, niveau: a.niveau, richtig, versuche: richtig ? 1 : 2, eingaben: richtig ? ['1'] : ['999', '998'], hilfen: 1, dauer });
    v(lang, i === 1, 200); v(normal1, true, 40); v(normal2, true, 50);
    v(normal1, true, 40, '2026-11-20T09:00:00Z'); // anderer Tag
    st.feedback = [{ t: '2026-11-24T09:01:00Z', frage: 'schwer', antwort: 0, aufgabe: lang.id }];
    return { code: st.code, stand: st };
  });
  const an = AN.aufgabenanalyse([{ klasse: '5a', staende }], pool.aufgaben, { tag: '2026-11-24' });
  const z = an.zeilen[0];
  assert.equal(z.aufgabe, lang.id, 'die auffällige Aufgabe steht oben');
  assert.equal(z.bearbeitet, 4);
  assert.equal(z.quote, 0.25);
  assert.equal(z.dauer, 200);
  assert.equal(z.vergleichDauer, 45);
  assert.ok(z.gruende.some((g) => /dauert lange/.test(g)));
  assert.ok(z.gruende.some((g) => /viele Fehler/.test(g)));
  assert.ok(z.gruende.some((g) => /4-mal „zu schwer“/.test(g)));
  assert.equal(an.zeilen.find((x) => x.aufgabe === normal1.id).bearbeitet, 4, 'der andere Tag zählt nicht');
  assert.equal(AN.aufgabenanalyse([{ klasse: '5a', staende }], pool.aufgaben, {}).zeilen.find((x) => x.aufgabe === normal1.id).bearbeitet, 8);
  const fb = AN.feedbackAuswertung([{ klasse: '5a', staende }], { tag: '2026-11-24' });
  assert.equal(fb.antworten, 4);
  assert.deepEqual(fb.fragen.find((f) => f.id === 'schwer').zahlen, [4, 0]);
  const md = AN.teststundeMarkdown({ klassen: 'Klasse 5a', zeitraum: '24.11.2026', version: 'Version 0.49', erstellt: 'jetzt' }, an, fb, (id) => pool.aufgaben.find((a) => a.id === id));
  assert.match(md, /# Mathekingdom: Teststunde/);
  assert.match(md, new RegExp(`### ${lang.id.replace(/\./g, '\\.')}`));
  assert.match(md, /War diese Aufgabe zu schwer\? \| Ja: 4 \| Nein: 0/);
  assert.doesNotMatch(md, /5A-AAA/, 'keine Schülercodes im Export');
});
