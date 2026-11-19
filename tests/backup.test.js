import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as B from '../src/gemeinsam/backup.js';
import { speicherAblage } from '../src/schueler/speicher.js';

test('Backups: höchstens fünf, der neueste und je der letzte von vier früheren Tagen', () => {
  const namen = ['2026-11-19_08-00', '2026-11-19_09-00', '2026-11-19_10-00', '2026-11-18_11-00', '2026-11-18_13-00',
    '2026-11-17_09-00', '2026-11-13_09-00', '2026-11-12_09-00', '2026-11-11_09-00', 'fremd'];
  assert.deepEqual(B.behalteneBackups(namen), ['2026-11-19_10-00', '2026-11-18_13-00', '2026-11-17_09-00', '2026-11-13_09-00', '2026-11-12_09-00']);
  assert.deepEqual(B.alteBackups(namen).sort(), ['2026-11-11_09-00', '2026-11-18_11-00', '2026-11-19_08-00', '2026-11-19_09-00']);
  assert.deepEqual(B.alteBackups([]), []);
  assert.equal(B.lesbarerStempel('2026-11-19_10-05'), '19.11.2026 um 10:05');
});

test('Backups: sichern, aufräumen, einzeln und ganz wiederherstellen, aus Backups löschen', async () => {
  const klasse = speicherAblage('5a'), lehrer = speicherAblage('5a-lehrer');
  await klasse.schreibe('5A-AAAA.json', JSON.stringify({ code: '5A-AAAA', muenzen: 10, geaendert: '2026-11-01T00:00:00Z' }));
  await klasse.schreibe('5A-BBBB.json', JSON.stringify({ code: '5A-BBBB', muenzen: 20 }));
  await klasse.schreibe('klassendatei.json', 'signiert');
  const backup = await lehrer.unterordner('backup');
  for (let tag = 10; tag <= 16; tag++) await B.sichereKlasse({ klassenordner: klasse, backupOrdner: backup, zusatz: { 'klasse.json': '{"namen":{}}' }, jetzt: new Date(2026, 10, tag, 9, 0) });
  const namen = (await backup.ordnernamen()).sort();
  assert.deepEqual(namen, ['2026-11-12_09-00', '2026-11-13_09-00', '2026-11-14_09-00', '2026-11-15_09-00', '2026-11-16_09-00']);
  const neuester = await backup.ordner('2026-11-16_09-00');
  assert.deepEqual((await neuester.liste()).sort(), ['5A-AAAA.json', '5A-BBBB.json', 'klasse.json', 'klassendatei.json']);

  await klasse.schreibe('5A-AAAA.json', JSON.stringify({ code: '5A-AAAA', muenzen: 99999 }));
  await B.stelleStandWiederHer({ backupOrdner: backup, stempel: '2026-11-16_09-00', code: '5A-AAAA', klassenordner: klasse, jetzt: '2026-11-19T10:00:00Z' });
  const zurueck = JSON.parse(await klasse.lies('5A-AAAA.json'));
  assert.equal(zurueck.muenzen, 10);
  assert.equal(zurueck.geaendert, '2026-11-19T10:00:00.000Z');
  await assert.rejects(B.stelleStandWiederHer({ backupOrdner: backup, stempel: '2026-11-16_09-00', code: '5A-ZZZZ', klassenordner: klasse }));

  await klasse.schreibe('5A-BBBB.json', '{}');
  const ganz = await B.stelleKlasseWiederHer({ backupOrdner: backup, stempel: '2026-11-15_09-00', klassenordner: klasse });
  assert.deepEqual(ganz.codes.sort(), ['5A-AAAA', '5A-BBBB']);
  assert.equal(ganz.zusatz['klasse.json'], '{"namen":{}}');
  assert.equal(JSON.parse(await klasse.lies('5A-BBBB.json')).muenzen, 20);

  assert.equal(await B.loescheAusBackups(backup, '5A-BBBB'), 5);
  assert.deepEqual((await neuester.liste()).sort(), ['5A-AAAA.json', 'klasse.json', 'klassendatei.json']);
});
