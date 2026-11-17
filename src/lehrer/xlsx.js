// Schreibt eine echte .xlsx-Datei ohne Bibliothek: Tabellenblätter als XML in einem unkomprimierten ZIP.

const TABELLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
function crc32(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) c = TABELLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function zip(dateien) {
  const kodierer = new TextEncoder();
  const teile = [], verzeichnis = [];
  let versatz = 0;
  for (const { name, text } of dateien) {
    const n = kodierer.encode(name), d = kodierer.encode(text), crc = crc32(d);
    const kopf = new DataView(new ArrayBuffer(30));
    kopf.setUint32(0, 0x04034b50, true); kopf.setUint16(4, 20, true); kopf.setUint16(6, 0x0800, true);
    kopf.setUint32(14, crc, true); kopf.setUint32(18, d.length, true); kopf.setUint32(22, d.length, true); kopf.setUint16(26, n.length, true);
    const eintrag = new DataView(new ArrayBuffer(46));
    eintrag.setUint32(0, 0x02014b50, true); eintrag.setUint16(4, 20, true); eintrag.setUint16(6, 20, true); eintrag.setUint16(8, 0x0800, true);
    eintrag.setUint32(16, crc, true); eintrag.setUint32(20, d.length, true); eintrag.setUint32(24, d.length, true); eintrag.setUint16(28, n.length, true);
    eintrag.setUint32(42, versatz, true);
    teile.push(new Uint8Array(kopf.buffer), n, d);
    verzeichnis.push(new Uint8Array(eintrag.buffer), n);
    versatz += 30 + n.length + d.length;
  }
  const groesse = verzeichnis.reduce((s, x) => s + x.length, 0);
  const ende = new DataView(new ArrayBuffer(22));
  ende.setUint32(0, 0x06054b50, true); ende.setUint16(8, dateien.length, true); ende.setUint16(10, dateien.length, true);
  ende.setUint32(12, groesse, true); ende.setUint32(16, versatz, true);
  const alle = [...teile, ...verzeichnis, new Uint8Array(ende.buffer)];
  const aus = new Uint8Array(alle.reduce((s, x) => s + x.length, 0));
  let p = 0;
  for (const x of alle) { aus.set(x, p); p += x.length; }
  return aus;
}

const xml = (s) => String(s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c]).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
const spalte = (i) => { let s = ''; for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s; return s; };

function blatt(zeilen) {
  const breiten = [];
  const reihen = zeilen.map((zeile, r) => `<row r="${r + 1}">${zeile.map((wert, c) => {
    breiten[c] = Math.min(60, Math.max(breiten[c] ?? 8, String(wert ?? '').length + 2));
    if (wert === '' || wert == null) return '';
    const ort = `${spalte(c)}${r + 1}`, stil = r === 0 ? ' s="1"' : '';
    return typeof wert === 'number' && Number.isFinite(wert)
      ? `<c r="${ort}"${stil}><v>${wert}</v></c>`
      : `<c r="${ort}"${stil} t="inlineStr"><is><t xml:space="preserve">${xml(wert)}</t></is></c>`;
  }).join('')}</row>`).join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">`
    + `<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`
    + `<cols>${breiten.map((b, i) => `<col min="${i + 1}" max="${i + 1}" width="${b}" customWidth="1"/>`).join('')}</cols>`
    + `<sheetData>${reihen}</sheetData></worksheet>`;
}

// blaetter: [{ name, zeilen: [[...]] }]; die erste Zeile jedes Blatts ist die fett gesetzte Kopfzeile.
export function xlsx(blaetter) {
  const kopf = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  const ns = 'http://schemas.openxmlformats.org/';
  return zip([
    { name: '[Content_Types].xml', text: `${kopf}<Types xmlns="${ns}package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${blaetter.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>` },
    { name: '_rels/.rels', text: `${kopf}<Relationships xmlns="${ns}package/2006/relationships"><Relationship Id="rId1" Type="${ns}officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
    { name: 'xl/workbook.xml', text: `${kopf}<workbook xmlns="${ns}spreadsheetml/2006/main" xmlns:r="${ns}officeDocument/2006/relationships"><sheets>${blaetter.map((b, i) => `<sheet name="${xml(b.name.replace(/[\\/?*[\]:]/g, ' ').slice(0, 31))}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>` },
    { name: 'xl/_rels/workbook.xml.rels', text: `${kopf}<Relationships xmlns="${ns}package/2006/relationships">${blaetter.map((_, i) => `<Relationship Id="rId${i + 1}" Type="${ns}officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${blaetter.length + 1}" Type="${ns}officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>` },
    { name: 'xl/styles.xml', text: `${kopf}<styleSheet xmlns="${ns}spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs></styleSheet>` },
    ...blaetter.map((b, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, text: blatt(b.zeilen) })),
  ]);
}
