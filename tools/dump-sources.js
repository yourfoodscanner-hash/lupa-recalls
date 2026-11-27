'use strict';
// Development only (probe branch): every source read live, every answer recorded, every notice written out for review.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const C = require('../lib/contract');
const { SOURCES } = require('../lib/build');
const config = require('../config.json');
const out = process.argv[2] || 'probe-out';
fs.mkdirSync(path.join(out, 'raw'), { recursive: true });
const index = [];
const recording = async (url, options) => {
  const r = await fetch(url, options);
  const body = Buffer.from(await r.arrayBuffer());
  const file = `${crypto.createHash('sha1').update(String(url)).digest('hex').slice(0, 12)}.txt`;
  fs.writeFileSync(path.join(out, 'raw', file), body);
  index.push({ url: String(url), status: r.status, type: r.headers.get('content-type'), bytes: body.length, file });
  return { ok: r.ok, status: r.status, headers: r.headers, text: async () => body.toString('utf8'), json: async () => JSON.parse(body.toString('utf8')) };
};
(async () => {
  const summary = {};
  const only = (process.env.ONLY || '').split(',').filter(Boolean);
  for (const [name, adapter] of Object.entries(SOURCES)) {
    if (name === 'rappelconso' || (only.length && !only.includes(name))) continue;
    const s = config.sources[name] || {};
    const since = new Date(Date.now() - (s.windowDays ?? 45) * 86400000).toISOString().slice(0, 10);
    const started = Date.now();
    try {
      const got = await adapter.fetchNotices({ fetchImpl: recording, since, userAgent: config.userAgent, ...(s.countries ? { countries: s.countries } : {}) });
      const checked = got.notices.map((n) => C.checkNotice(n));
      const bad = checked.filter((c) => !c.ok).map((c) => c.why);
      const ok = checked.filter((c) => c.ok).map((c) => c.notice);
      fs.writeFileSync(path.join(out, `notices-${name}.json`), JSON.stringify(ok, null, 1));
      summary[name] = { since, seen: got.seen, notices: ok.length, bad, skipped: got.skipped, withBarcode: ok.filter((n) => n.gtins).length, withLots: ok.filter((n) => n.lots).length, ms: Date.now() - started };
    } catch (e) {
      summary[name] = { error: String(e && e.stack || e), ms: Date.now() - started };
    }
  }
  fs.writeFileSync(path.join(out, 'summary.json'), JSON.stringify(summary, null, 1));
  fs.writeFileSync(path.join(out, 'raw', '_index.json'), JSON.stringify(index, null, 1));
  console.log(JSON.stringify(summary, null, 1));
})();
