// Berichtserfassung nach den Teststunden vom 25.11.2026 (Version 0.54, ADR 0046).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import * as AN from '../src/gemeinsam/aufgabenanalyse.js';
import * as P from '../src/gemeinsam/protokoll.js';
import { falscheTeile } from '../src/gemeinsam/statistik.js';

const pool6 = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-6.json', import.meta.url), 'utf8'));
const aufgabe = (id) => pool6.aufgaben.find((a) => a.id === id);
const neu = (code) => L.neuerSpeicherstand(code, '6a', '2026-11-25T07:00:00Z');

test('Feedback: Schüler beginnen versetzt, über eine Klasse kommen alle zehn Fragen vor', () => {
  const codes = Array.from({ length: 30 }, (_, i) => `6A-${String(1000 + i * 37).slice(0, 4).replace(/0/g, 'K')}`);
  const erste = new Set(codes.map((c) => L.feedbackStart(c)));
  assert.ok(erste.size >= 6, `nur ${erste.size} verschiedene Startfragen`);
  assert.equal(L.feedbackStart('6A-AAAA'), L.feedbackStart('6A-AAAA'), 'fest je Code');
  const st = neu('6A-B7QX');
  assert.equal(L.naechsteFeedbackFrage(st, { tipp: true, bild: true }).nr, L.feedbackStart('6A-B7QX'));
});

test('Bearbeitungen merken sich die Version des Schüler-Dashboards', () => {
  const st = neu('6A-AAAA');
  st.dashboardVersion = '0.54';
  const a = aufgabe('6.1.1-B1-G-01');
  L.verbuche(st, a, { geloest: true, versuche: 1, eingaben: ['5⁄4'], fehlvorstellungen: [], hilfen: 0, dauer: 20 }, 'G', '2026-11-25T08:00:00Z');
  assert.equal(st.versuche.at(-1).version, '0.54');
});

test('Falsche Antworten nennen die bekannte Fehlvorstellung', () => {
  assert.deepEqual(falscheTeile(aufgabe('6.1.1-B1-G-01'), '5/8').map((t) => t.fehlvorstellung), ['ganzes-mehrere-figuren']);
  const zahl = falscheTeile(aufgabe('6.1.1-B1-M-03'), '13');
  assert.equal(zahl[0].fehlvorstellung, 'bruchteil-zaehler-vergessen');
  assert.equal(falscheTeile(aufgabe('6.1.1-B1-M-03'), '38')[0].fehlvorstellung, undefined);
});

// Drei Schüler, Klasse 6a mit Version 0.54, einer arbeitet nur allein an einer Aufgabe.
function klassen() {
  const a = aufgabe('6.1.1-B1-G-01'), b = aufgabe('6.1.1-B1-G-04'), c = aufgabe('6.1.1-B1-G-02');
  const staende = ['6A-AAA1', '6A-AAA2', '6A-AAA3', '6A-AAA4'].map((code, i) => {
    const st = neu(code);
    const v = (x, richtig, eingaben, version = '0.54') => st.versuche.push({ t: '2026-11-25T08:10:00Z', aufgabe: x.id, lernziel: x.lernziel, niveau: x.niveau, richtig, versuche: eingaben.length, eingaben, hilfen: 0, dauer: 30, version });
    if (i < 3) { v(a, false, ['5/8']); v(c, true, ['1']); }
    if (i === 3) { v(b, false, ['4/12']); v(b, false, ['4/12']); v(b, false, ['4/12']); v(a, true, ['5/4'], null); st.abbrueche = [{ t: '2026-11-25T08:11:00Z', aufgabe: a.id }]; }
    st.feedback = [{ t: '2026-11-25T08:12:00Z', frage: i % 2 ? 'leicht' : 'text', antwort: 1, aufgabe: a.id }];
    return { code, stand: st };
  });
  return [{ klasse: '6a', staende }];
}

test('Aufgabenanalyse: ab 3 Schülern auffällig, Abbrecher getrennt, alle Fragen zur Aufgabe, je Klasse', () => {
  const an = AN.aufgabenanalyse(klassen(), pool6.aufgaben, { tag: '2026-11-25' });
  const a = an.zeilen.find((x) => x.aufgabe === '6.1.1-B1-G-01');
  assert.equal(a.schueler, 4);
  assert.equal(a.angefangen, 4);
  assert.ok(a.gruende.some((g) => /viele Fehler/.test(g)));
  assert.deepEqual(a.falsch[0], ['5/8', 3, 'ganzes-mehrere-figuren']);
  assert.deepEqual(a.feedback.text, { ja: 0, nein: 2 });
  assert.deepEqual(a.feedback.leicht, { ja: 0, nein: 2 });
  assert.ok(a.gruende.some((g) => /2-mal „Text nicht verstanden“/.test(g)));
  const b = an.zeilen.find((x) => x.aufgabe === '6.1.1-B1-G-04');
  assert.equal(b.bearbeitet, 3);
  assert.deepEqual(b.gruende, [], 'ein einzelner Schüler macht eine Aufgabe nicht auffällig');
  assert.equal(an.klassen.length, 1);
  assert.equal(an.klassen[0].bearbeitungen, 10);
  assert.equal(an.klassen[0].feedback, 4);
  assert.deepEqual(an.klassen[0].versionen, [['0.54', 9], ['vor 0.54', 1]]);
});

test('Feedback nach Niveau und Export mit Lösung, Fehlvorstellung, Klassen und Versionen', () => {
  const k = klassen();
  const an = AN.aufgabenanalyse(k, pool6.aufgaben, { tag: '2026-11-25' });
  const fb = AN.feedbackAuswertung(k, { tag: '2026-11-25' }, pool6.aufgaben);
  assert.deepEqual(fb.fragen.find((f) => f.id === 'leicht').nachNiveau.G, [0, 2]);
  assert.equal(fb.fragen.find((f) => f.id === 'aussehen').nachNiveau, undefined);
  const md = AN.teststundeMarkdown({ klassen: 'alle', zeitraum: '25.11.2026', version: 'Version 0.54', erstellt: 'jetzt' }, an, fb,
    (id) => pool6.aufgaben.find((a) => a.id === id), (id) => pool6.fehlvorstellungen[id]);
  assert.match(md, /- Lösung im Pool: 5⁄4/);
  assert.match(md, /„5\/8“ \(3, bekannte Fehlvorstellung ganzes-mehrere-figuren: Nimmt/);
  assert.match(md, /\| 6a \| 4 \| 4 \| 10 \| 4 \| 0\.54 \(9\), vor 0\.54 \(1\) \|/);
  assert.match(md, /Schüler-Dashboard bei den Bearbeitungen: 0\.54 \(9\), vor 0\.54 \(1\)/);
  assert.match(md, /Exportiert mit: Version 0\.54/);
  assert.match(md, /### Fragen zur Aufgabe nach Niveau/);
  assert.match(md, /Feedback zur Aufgabe \(ja\/nein\): zu leicht 0\/2, Text verstanden 0\/2/);
  assert.doesNotMatch(md, /6A-AAA/);
});

test('Betriebsprotokoll: Ende, vorige Sitzung, Programmfehler, eigene Arten', () => {
  assert.equal(P.endeText('2026-11-25T08:00:00Z', '2026-11-25T08:41:20Z'), 'Sitzung beendet nach 41 min');
  assert.equal(P.vorigeSitzung([{ art: 'start' }]), null, 'alte Protokolle ohne Ende sagen nichts');
  assert.equal(P.vorigeSitzung([{ art: 'start' }, { art: 'ende' }]), 'beendet');
  assert.equal(P.vorigeSitzung([{ art: 'ende' }, { art: 'start' }]), 'ohne-ende');
  assert.equal(P.programmfehlerText('x is not\na function', 'aufgabe', 'schueler.js:12'), 'Programmfehler in der Ansicht „aufgabe“: x is not a function (schueler.js:12)');
  assert.equal(P.ART_TEXT.lehrkraft, 'Lehrkraft');
  const text = P.alsText([{ t: '2026-11-25T08:00:00Z', art: 'lehrkraft', text: 'Münzgabe +250 Münzen an 6A-AAAA', code: '6A-AAAA', klasse: '6a' }], null, '2026-11-25T09:00:00Z');
  assert.match(text, /\tLehrkraft\tMünzgabe/);
});
