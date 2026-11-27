'use strict';
/**
 * The text of a Word document (.docx) — for authorities that publish their notices only as such a file.
 *
 * A .docx is a ZIP archive; its text is in "word/document.xml". This reads the archive's own table of
 * contents (the central directory), takes that one entry (stored or deflated — the two ways Word
 * writes), and turns its paragraphs into lines: one line per <w:p>, the text of its <w:t> runs, a tab
 * or a line break where Word has one. No other part of the document is read, and nothing is run.
 */
const zlib = require('zlib');
const { decodeEntities } = require('./text');

const MAX_SIZE = 20 * 1024 * 1024;

/** The uncompressed bytes of one entry of a ZIP archive, or null when the archive has no such entry. Throws when it is not a ZIP archive. */
function zipEntry(buffer, name) {
  const buf = Buffer.from(buffer);
  // the end of the central directory: its signature, searched from the end (a comment may follow it)
  let end = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 0xffff); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { end = i; break; }
  }
  if (end < 0) throw new Error('nije ZIP arhiva (nema kraja centralnog direktorija)');
  const entries = buf.readUInt16LE(end + 10);
  let at = buf.readUInt32LE(end + 16);
  for (let n = 0; n < entries; n++) {
    if (at + 46 > buf.length || buf.readUInt32LE(at) !== 0x02014b50) throw new Error('ZIP: centralni direktorij nije ispravan');
    const method = buf.readUInt16LE(at + 10);
    const compressed = buf.readUInt32LE(at + 20);
    const size = buf.readUInt32LE(at + 24);
    const nameLength = buf.readUInt16LE(at + 28);
    const extraLength = buf.readUInt16LE(at + 30);
    const commentLength = buf.readUInt16LE(at + 32);
    const local = buf.readUInt32LE(at + 42);
    const entryName = buf.toString('utf8', at + 46, at + 46 + nameLength);
    at += 46 + nameLength + extraLength + commentLength;
    if (entryName !== name) continue;
    if (size > MAX_SIZE || local + 30 > buf.length || buf.readUInt32LE(local) !== 0x04034b50) throw new Error('ZIP: zapis nije ispravan');
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const data = buf.subarray(start, start + compressed);
    if (method === 0) return Buffer.from(data);
    if (method === 8) return zlib.inflateRawSync(data, { maxOutputLength: MAX_SIZE });
    throw new Error(`ZIP: nepoznat način sažimanja (${method})`);
  }
  return null;
}

/** A .docx (bytes) → its text, a line per paragraph. Throws when the bytes are not a Word document. */
function docxText(buffer) {
  const xml = zipEntry(buffer, 'word/document.xml');
  if (!xml) throw new Error('nije Word dokument (nema word/document.xml)');
  const body = xml.toString('utf8');
  const lines = [];
  for (const p of body.matchAll(/<w:p\b[^>]*>([\s\S]*?)<\/w:p>|<w:p\b[^>]*\/>/g)) {
    const inner = p[1] ?? '';
    let line = '';
    for (const piece of inner.matchAll(/<w:t\b[^>]*>([^<]*)<\/w:t>|<w:tab\b[^>]*\/>|<w:br\b[^>]*\/>/g)) {
      if (piece[1] !== undefined) line += decodeEntities(piece[1]);
      else line += piece[0].startsWith('<w:tab') ? ' ' : '\n';
    }
    lines.push(...line.split('\n').map((l) => l.replace(/\s+/g, ' ').trim()));
  }
  return lines.filter(Boolean).join('\n');
}

module.exports = { zipEntry, docxText };
