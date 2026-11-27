'use strict';
/**
 * Scaffolding for writing a new source adapter against LIVE data (runs on GitHub Actions, which can
 * reach the authorities' sites; the place adapters are written in cannot).
 *
 *   node tools/explore.js <requests.json> <out-dir>
 *
 * requests.json: [{ name, url, method?, headers?, body?, scan?, max? }]
 *   - every answer is saved whole (up to `max` bytes, default 3 MB) as <out-dir>/<name>.<ext>
 *   - scan: true → the page's feed links, script files and links that look like recalls / feeds /
 *     APIs are listed in <out-dir>/<name>.scan.json; the page's own scripts are searched for API paths.
 * <out-dir>/_index.json says what every request answered.
 */
const fs = require('fs');
const path = require('path');

const UA = 'lupa-recalls/1.0 (+https://github.com/yourfoodscanner-hash/lupa-recalls; yourfoodscanner@gmail.com)';
const TIMEOUT = 90000;
const KEYWORDS = /(opoziv|povla|povuc|obavijest|obavje|odpokl|umik|nevarn|r(?:ü|ue|%C3%BC)ckruf|warnung|richiam|avvis|alerta|retirad|recall|alert|rss|feed|atom|\.xml|json|api|export|download|csv|terugroep|waarschuw|rappel|återkall|aterkall|tilbagekald|tilbakekall|tilbaketrekk|takaisinveto|wycofan|ostrze|stažen|stazen|stahov|pranýř|pranyr|stiahnut|nebezpe|visszahív|visszahiv|retrage|retras|изтегл|ανάκλη|ανακλη|atšauk|atsauk|atsauc|tagasikutsu|tagasivõt|recolha|retirada|povlač|povlac|повлек|отповик|tërheq|terheq|отзыв|відклик|innköll|innkoll|odvolan|food-alerts|warnings)/i;

async function get(req) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), req.timeout ?? TIMEOUT);
  const started = Date.now();
  try {
    const response = await fetch(req.url, {
      method: req.method ?? 'GET',
      headers: { 'User-Agent': UA, Accept: '*/*', ...(req.headers ?? {}) },
      body: req.body === undefined ? undefined : typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
      redirect: 'follow',
      signal: controller.signal,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    return { status: response.status, finalUrl: response.url, type: response.headers.get('content-type') ?? '', headers: Object.fromEntries(response.headers), buffer, ms: Date.now() - started };
  } catch (e) {
    return { error: String(e && e.cause ? `${e.message} (${e.cause.code ?? e.cause.message ?? e.cause})` : e), ms: Date.now() - started };
  } finally {
    clearTimeout(timer);
  }
}

function extOf(type, url) {
  if (/json/i.test(type)) return 'json';
  if (/(rss|atom|xml)/i.test(type)) return 'xml';
  if (/html/i.test(type)) return 'html';
  if (/csv/i.test(type)) return 'csv';
  if (/javascript/i.test(type)) return 'js';
  const m = /\.([a-z0-9]{2,5})(?:[?#]|$)/i.exec(url);
  return m ? m[1].toLowerCase() : 'txt';
}

const abs = (href, base) => { try { return new URL(href.replace(/&amp;/g, '&'), base).href; } catch { return null; } };

async function scan(html, base) {
  const feeds = [];
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    if (/rel=["']?alternate/i.test(tag) && /(rss|atom|json|xml)/i.test(tag)) {
      const href = /href=["']([^"']+)/i.exec(tag);
      if (href) feeds.push({ href: abs(href[1], base), type: (/type=["']([^"']+)/i.exec(tag) ?? [])[1], title: (/title=["']([^"']+)/i.exec(tag) ?? [])[1] });
    }
  }
  const links = new Map();
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]{0,300}?)<\/a>/gi)) {
    const href = abs(m[1], base);
    const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140);
    if (href && (KEYWORDS.test(href) || KEYWORDS.test(text)) && !links.has(href)) links.set(href, text);
  }
  const scripts = [...html.matchAll(/<script\b[^>]*src=["']([^"']+)["']/gi)].map((m) => abs(m[1], base)).filter(Boolean);
  const apiPaths = new Set();
  const host = new URL(base).host;
  for (const src of scripts.slice(0, 12)) {
    if (new URL(src).host !== host) continue;
    const got = await get({ url: src, max: 8e6 });
    if (!got.buffer) continue;
    const js = got.buffer.toString('utf8');
    for (const m of js.matchAll(/["'`]((?:https?:\/\/[^"'`\s]{3,120})?\/?[A-Za-z0-9_.\-/{}$]*(?:api|rest|services?|export|feed|rss|search)[A-Za-z0-9_.\-/{}$?=&]*)["'`]/g)) {
      if (m[1].length > 3 && m[1].length < 200 && /\//.test(m[1])) apiPaths.add(m[1]);
    }
  }
  return { feeds, links: [...links].map(([href, text]) => ({ href, text })).slice(0, 300), scripts, apiPaths: [...apiPaths].sort().slice(0, 600) };
}

async function main() {
  const [file, outDir] = process.argv.slice(2);
  const requests = JSON.parse(fs.readFileSync(file, 'utf8'));
  fs.mkdirSync(outDir, { recursive: true });
  const index = [];
  const queue = [...requests];
  async function worker() {
    for (let req = queue.shift(); req; req = queue.shift()) {
      const got = await get(req);
      const entry = { name: req.name, url: req.url, method: req.method ?? 'GET', ms: got.ms };
      if (got.error) { entry.error = got.error; index.push(entry); console.log(`✗ ${req.name}: ${got.error}`); continue; }
      Object.assign(entry, { status: got.status, finalUrl: got.finalUrl, type: got.type, bytes: got.buffer.length, headers: got.headers });
      const ext = extOf(got.type, got.finalUrl);
      const max = req.max ?? 3e6;
      fs.writeFileSync(path.join(outDir, `${req.name}.${ext}`), got.buffer.subarray(0, max));
      entry.saved = `${req.name}.${ext}`;
      if (got.buffer.length > max) entry.truncated = true;
      if (req.scan && /html/i.test(got.type)) {
        try { fs.writeFileSync(path.join(outDir, `${req.name}.scan.json`), JSON.stringify(await scan(got.buffer.toString('utf8'), got.finalUrl), null, 1)); entry.scanned = true; } catch (e) { entry.scanError = String(e); }
      }
      index.push(entry);
      console.log(`${got.status} ${req.name} ${got.type} ${got.buffer.length} B`);
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()]);
  index.sort((a, b) => (a.name < b.name ? -1 : 1));
  fs.writeFileSync(path.join(outDir, '_index.json'), JSON.stringify({ at: new Date().toISOString(), index }, null, 1));
}

main();
