'use strict';
/**
 * node tools/follow.js <file> <regex> <count> <prefix> <base>
 * Fetches the first <count> distinct links that <regex> (group 1) finds in <file>, as <prefix>-<n>.<ext>
 * next to it, and appends what each answered to <prefix>.follow.txt.
 */
const fs = require('fs');
const path = require('path');

const UA = 'lupa-recalls/1.0 (+https://github.com/yourfoodscanner-hash/lupa-recalls; yourfoodscanner@gmail.com)';
const [file, pattern, count, prefix, base] = process.argv.slice(2);

(async () => {
  const dir = path.dirname(file);
  const log = path.join(dir, `${prefix}.follow.txt`);
  if (!fs.existsSync(file)) { fs.writeFileSync(log, `no file ${file}\n`); return; }
  const text = fs.readFileSync(file, 'utf8');
  const urls = [];
  for (const m of text.matchAll(new RegExp(pattern, 'g'))) {
    let u;
    try { u = new URL(m[1].replace(/&amp;/g, '&'), base).href; } catch { continue; }
    if (!urls.includes(u)) urls.push(u);
    if (urls.length >= Number(count)) break;
  }
  let n = 0;
  for (const url of urls) {
    n += 1;
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: '*/*' }, signal: AbortSignal.timeout(90000) });
      const buf = Buffer.from(await r.arrayBuffer());
      const type = r.headers.get('content-type') ?? '';
      const ext = /json/.test(type) ? 'json' : /xml|rss/.test(type) ? 'xml' : 'html';
      fs.writeFileSync(path.join(dir, `${prefix}-${n}.${ext}`), buf);
      fs.appendFileSync(log, `${n} ${r.status} ${buf.length} ${url}\n`);
    } catch (e) {
      fs.appendFileSync(log, `${n} ERROR ${e.message} ${e.cause?.code ?? ''} ${url}\n`);
    }
  }
})();
