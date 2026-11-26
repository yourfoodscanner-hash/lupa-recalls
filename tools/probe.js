'use strict';
/**
 * Looks at a live source and says what the job would do with it — without writing anything.
 *
 *   node tools/probe.js rappelconso
 *
 * Prints: the columns of the live data, how many rows there are, how many would be published and
 * why the others would not, and three of the notices as they would be published. Run it when the
 * job reports that a source was not read ("kolone registra nisu one koje adapter poznaje …").
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
  const url = settings.url || adapter.defaultUrl;
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
