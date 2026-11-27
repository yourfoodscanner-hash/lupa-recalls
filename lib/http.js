'use strict';
/**
 * Asking an authority's server — the same way for every source: the job's name in User-Agent, a time
 * limit, an error that names the address and the status. A source asks for several pages one or two
 * at a time, never in a flood (mapLimit).
 */
const TIMEOUT_MS = 60000;

async function request(fetchImpl, url, { userAgent, accept = '*/*', method, headers = {}, body, timeoutMs = TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      signal: controller.signal,
      ...(method ? { method } : {}),
      ...(body !== undefined ? { body } : {}),
      headers: { Accept: accept, ...(userAgent ? { 'User-Agent': userAgent } : {}), ...headers },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} (${shortUrl(url)})`);
    return response;
  } catch (e) {
    if (e && e.name === 'AbortError') throw new Error(`nema odgovora ${Math.round(timeoutMs / 1000)} s (${shortUrl(url)})`);
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

const shortUrl = (url) => String(url).replace(/^https:\/\/(www\.)?/, '').slice(0, 90);
const getText = async (fetchImpl, url, options) => (await request(fetchImpl, url, { accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', ...options })).text();
const getJson = async (fetchImpl, url, options) => (await request(fetchImpl, url, { accept: 'application/json', ...options })).json();

/** fn over every item, at most `limit` at a time; each result is { ok: true, value } or { ok: false, error } — in the items' order. */
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      try { out[i] = { ok: true, value: await fn(items[i], i) }; } catch (error) { out[i] = { ok: false, error }; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

module.exports = { request, getText, getJson, mapLimit, TIMEOUT_MS };
