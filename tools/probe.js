'use strict';
/**
 * Looks at a live source and says what the job would do with it — without writing anything.
 *
 *   node tools/probe.js rappelconso
 *   node tools/probe.js rappelconso https://…/another-dataset/exports/json    (another address of the same source)
 *
 * Prints: the columns of the live data, how many rows there are, what the product-identification
 * field looks like and how many rows carry a barcode, how many notices would be published and why
 * the others would not, and three of the notices as they would be published. Run it when the job
 * reports that a source was not read ("kolone registra nisu one koje adapter poznaje …") or when
 * the Summary says "s barkodom: 0".
 */
const path = require('path');
const C = require('../lib/contract');
const { SOURCES } = require('../lib/build');

async function main() {
  const name = process.argv[2];
  const adapter = SOURCES[name];
  if (!adapter) { console.error(`Izvor „${name ?? ''}” ne postoji. Postoje: ${Object.keys(SOURCES).join(', ')}`); process.exitCode = 1; return; }
  const config = require(path.join(__dirname, '..', 'config.json'));
  const settings = (config.sources && config.sources[name]) || {};
  const url = process.argv[3] || settings.url || adapter.defaultUrl;
  console.log(`Izvor: ${name}\nAdresa: ${url}\n`);
  let raw;
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': config.userAgent } });
    console.log(`Odgovor: HTTP ${response.status}, ${response.headers.get('content-type')}`);
    raw = await response.json();
  } catch (e) { console.error(`Nije pročitano: ${e.message}`); process.exitCode = 1; return; }
  const rows = Array.isArray(raw) ? raw : Array.isArray(raw && raw.results) ? raw.results : null;
  if (!rows) { console.error('Odgovor nije lista redova.'); process.exitCode = 1; return; }
  const columns = new Set();
  for (const row of rows.slice(0, 500)) if (row && typeof row === 'object') for (const key of Object.keys(row)) columns.add(key);
  console.log(`Redova: ${rows.length}\nKolone (${columns.size}): ${[...columns].sort().join(', ')}\n`);
  console.log('Prvi red, kako ga izvor daje:\n', JSON.stringify(rows[0], null, 1).slice(0, 3000), '\n');
  // the product-identification field and the barcodes: what the newest rows look like
  const identColumns = (adapter.COLUMNS && adapter.COLUMNS.ident) || ['identification_produits'];
  const identOf = (row) => { for (const c of identColumns) if (row && row[c] !== undefined && row[c] !== null) return row[c]; return null; };
  const samples = new Set();
  let withIdent = 0; let withLongDigits = 0; let withBarcode = 0;
  for (const row of rows) {
    const ident = identOf(row);
    if (ident === null) continue;
    withIdent += 1;
    const entries = Array.isArray(ident) ? ident : [ident];
    const text = entries.map(String).join(' ');
    if (/(?<![0-9])[0-9](?:[ \u00a0]?[0-9]){11,13}(?![0-9])/.test(text)) withLongDigits += 1;
    if (adapter.gtinsOf && adapter.gtinsOf(row).length > 0) withBarcode += 1;
    if (samples.size < 8 && entries.length > 0) samples.add(String(entries[0]).slice(0, 160));
  }
  console.log(`Polje s identifikacijom proizvoda (${identColumns.join(' / ')}): ima ga ${withIdent} redova; s nizom od 12–14 cifara (i s razmacima): ${withLongDigits}; s barkodom kako ga adapter čita: ${withBarcode}`);
  console.log('Primjeri (prvi unos reda):'); for (const x of samples) console.log(`  ${x}`);
  console.log('');
  const since = new Date(Date.now() - (settings.windowDays ?? 45) * 86400000).toISOString().slice(0, 10);
  try {
    const got = await adapter.fetchNotices({ fetchImpl: async () => ({ ok: true, status: 200, json: async () => rows }), since });
    const ok = []; const why = {};
    for (const n of got.notices) { const c = C.checkNotice(n); if (c.ok) ok.push(c.notice); else why[c.why.split(' ')[0]] = (why[c.why.split(' ')[0]] ?? 0) + 1; }
    console.log(`Od ${since}: bilo bi objavljeno ${ok.length} obavijesti.`);
    console.log('Izostavljeno u adapteru:', got.skipped);
    console.log('Izostavljeno na provjeri:', why);
    const kinds = {}; for (const n of ok) kinds[`${n.category}/${n.hazard}`] = (kinds[`${n.category}/${n.hazard}`] ?? 0) + 1;
    console.log('Po kategoriji/vrsti:', kinds);
    console.log(`S barkodom: ${ok.filter((n) => n.gtins).length}\n`);
    console.log('Tri obavijesti, kako bi bile objavljene:\n', JSON.stringify(ok.slice(0, 3), null, 1));
  } catch (e) {
    console.error(`Adapter je stao: ${e.message}`);
    process.exitCode = 1;
  }
}

main();
