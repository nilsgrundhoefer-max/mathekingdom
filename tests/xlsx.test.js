import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { xlsx } from '../src/lehrer/xlsx.js';

test('Excel-Datei lässt sich von einem fremden Programm lesen', () => {
  const datei = join(mkdtempSync(join(tmpdir(), 'mk-')), 'test.xlsx');
  writeFileSync(datei, xlsx([
    { name: 'Übersicht', zeilen: [['Name', 'Sterne'], ['Müller, Lena <5a> & Co', 7], ['Öztürk', 0]] },
    { name: 'Leer', zeilen: [['Spalte']] },
  ]));
  const aus = execFileSync('python3', ['-c', `
import sys, json
from openpyxl import load_workbook
wb = load_workbook(sys.argv[1])
print(json.dumps({ws.title: [[c.value for c in row] for row in ws.iter_rows()] for ws in wb}))`, datei], { encoding: 'utf8' });
  assert.deepEqual(JSON.parse(aus), { 'Übersicht': [['Name', 'Sterne'], ['Müller, Lena <5a> & Co', 7], ['Öztürk', 0]], Leer: [['Spalte']] });
});
