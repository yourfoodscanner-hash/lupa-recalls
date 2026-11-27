'use strict';
/**
 * Netherlands — NVWA (Nederlandse Voedsel- en Warenautoriteit), "Veiligheidswaarschuwingen": the
 * companies' warnings about unsafe food (and about other products, which are left out) that the authority
 * publishes as news (/actueel/nieuws/2026/11/26/veiligheidswaarschuwing-…).
 *
 * Seen on the live data (27 Nov 2026): the site's own list of warnings is drawn in the browser from the
 * site's search (/api/search: the browser posts its search and a SHA-256 of it as "hash"); its RSS feeds
 * answer "feeds offline". The job asks the search what the browser asks for "veiligheidswaarschuwing",
 * newest first, 50 at a time, until the results are older than the window. Beside it, what the server
 * shows on its pages: the news sitemap (/news/sitemap.xml — every news item of the last two days) and
 * the three latest warnings on /actueel/veiligheidswaarschuwingen. When the search does not answer, the
 * short lists still see every new warning (the job runs every day), and a warning read before is kept
 * while it is in the window.
 *
 * The page of a warning: the title ("Veiligheidswaarschuwing diverse salades van Marqt Keuken"), an
 * opening paragraph ("Udea waarschuwt voor … Er bestaat een kans dat deze producten witte harde plastic
 * stukjes bevatten. Eet de salades niet."), "Om welke producten gaat het?" with the products (a heading
 * each, then labeled lines: "EAN: …", "Ten minste houdbaar tot (THT): …"), and at the end the e-mail
 * subscription it belongs to — "… over levensmiddelen en diervoeders" (food) or "… over
 * consumentenartikelen" (anything else, left out).
 */
const crypto = require('crypto');
const { decodeEntities, htmlToText, oneLine, idOf, cut, labeledGtins, labeledLots, labeledDates, alignedFold } = require('../lib/text');
const { request, getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');

const NAME = 'nvwa';
const PREFIX = 'nl-nvwa-';
const COUNTRY = 'NL';
const SOURCE = 'NVWA';
const SITE = 'https://www.nvwa.nl';
const SITEMAP = `${SITE}/news/sitemap.xml`;
const LATEST = `${SITE}/actueel/veiligheidswaarschuwingen`;
const SEARCH = `${SITE}/api/search`;
const PER_PAGE = 50;
const MAX_SEARCH_PAGES = 4;
const MAX_PAGES = 60;
const WARNING = /\/actueel\/nieuws\/(\d{4})\/(\d{2})\/(\d{2})\/(veiligheidswaarschuwing-[a-z0-9-]+)/;

function rowOf(path, title) {
  const m = WARNING.exec(path);
  if (!m) return null;
  return { url: `${SITE}/actueel/nieuws/${m[1]}/${m[2]}/${m[3]}/${m[4]}`, day: `${m[1]}-${m[2]}-${m[3]}`, slug: m[4], title: oneLine(title ?? '') };
}

/** The warnings in the news sitemap. Throws when it is not a sitemap. */
function sitemapRows(xml) {
  const text = String(xml ?? '');
  if (!/<urlset[\s>]/.test(text)) throw new Error('news sitemap nije sitemap (format se promijenio?)');
  const rows = [];
  for (const m of text.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = decodeEntities((/<loc>([\s\S]*?)<\/loc>/.exec(m[1]) ?? [])[1] ?? '').trim();
    const title = decodeEntities((/<news:title>([\s\S]*?)<\/news:title>/.exec(m[1]) ?? [])[1] ?? '');
    const row = rowOf(loc, title);
    if (row) rows.push(row);
  }
  return rows;
}

/** The latest warnings on the warnings page. Throws when the page is not that page. */
function latestRows(html) {
  const page = String(html ?? '');
  if (!/Laatste veiligheidswaarschuwingen/.test(page)) throw new Error('stranica veiligheidswaarschuwingen nema „Laatste veiligheidswaarschuwingen” (format se promijenio?)');
  const rows = [];
  for (const m of page.matchAll(/href="(\/actueel\/nieuws\/\d{4}\/\d{2}\/\d{2}\/veiligheidswaarschuwing-[a-z0-9-]+)"/g)) {
    const row = rowOf(m[1]);
    if (row && !rows.some((r) => r.url === row.url)) rows.push(row);
  }
  return rows;
}

/** What the site's search page posts for a search, with its "hash" (the SHA-256 of exactly that text). */
function searchRequest(page) {
  const body = JSON.stringify({
    requestState: { current: page, filters: [], resultsPerPage: PER_PAGE, searchTerm: 'veiligheidswaarschuwing', sortDirection: '', sortField: '', sortList: [] },
    queryConfig: {
      filters: [{ field: 'topic', values: ['Veiligheidswaarschuwingen'], type: 'all' }, { field: 'content_type', values: ['pro:newsDocument'], type: 'all' }],
      result_fields: { url: { raw: {} }, page_title: { raw: {} }, meta_description: { raw: {}, snippet: { size: 140, fallback: true } }, sort_date: { raw: {} }, information_type: { raw: {} } },
      disjunctiveFacets: ['information_type', 'activity_type'], facets: { information_type: { type: 'value', size: 100 } },
      sortList: [{ field: 'sort_date', direction: 'desc' }],
    },
  });
  return { url: `${SEARCH}?hash=${crypto.createHash('sha256').update(body).digest('hex')}`, body };
}

/** The warnings the search finds, newest first, until they are older than the window. Throws when the answer is not a search result. */
async function searchRows(fetchImpl, { userAgent, since }) {
  const rows = [];
  for (let page = 1; page <= MAX_SEARCH_PAGES; page++) {
    const { url, body } = searchRequest(page);
    const response = await request(fetchImpl, url, { userAgent, method: 'POST', body, accept: 'application/json', headers: { 'Content-Type': 'application/json' } });
    const data = JSON.parse(await response.text());
    if (!data || !Array.isArray(data.results)) throw new Error('pretraga NVWA nema "results" (format se promijenio?)');
    for (const r of data.results) {
      const row = rowOf(String(r?.url?.raw ?? ''), r?.page_title?.raw);
      if (row && !rows.some((x) => x.url === row.url)) rows.push(row);
    }
    const days = data.results.map((r) => String(r?.sort_date?.raw ?? '').slice(0, 10)).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
    if (data.results.length < PER_PAGE || days.length === 0 || days.some((d) => d < since)) break;
  }
  return rows;
}

function idOfRow(row) {
  return idOf(PREFIX, row.slug.replace(/^veiligheidswaarschuwing-/, ''));
}

/** A warning's page → { title, kind, intro, names, lines } or null when it is not a news item. */
function pageParts(html) {
  const page = String(html ?? '');
  const main = /<main[^>]*>([\s\S]*?)<\/main>/.exec(page);
  if (!main || !/is-news-document/.test(page)) return null;
  const title = oneLine((/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(page) ?? [])[1] ?? '');
  const text = htmlToText(main[1]);
  const f = alignedFold(text);
  const kind = /veiligheidswaarschuwingen over (?:levensmiddelen|voeding)/.test(f) ? 'food' : /veiligheidswaarschuwingen over consumenten/.test(f) ? 'other' : null;
  // the opening paragraph: "… waarschuwt voor …" / "… waarschuwen voor …" / "… roept … terug …"
  const opening = text.split('\n').filter((l) => /\bwaarschuw(?:t|en)\b|\broep(?:t|en)\b.*\bterug\b/i.test(l));
  const intro = opening.find((l) => !/^update\b/i.test(l)) ?? opening[0] ?? '';   // not "Update 13 oktober 2026: Ook … waarschuwt …"
  // "Om welke producten gaat het?": a heading per product, then its labeled lines
  const block = /<h2[^>]*>\s*Om welke? product(?:en)? gaat het\??\s*<\/h2>([\s\S]*?)(?:<\/div>|<h2)/i.exec(main[1]);
  const products = [];
  if (block) {
    for (const m of block[1].matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>|<li[^>]*>([\s\S]*?)<\/li>/g)) {
      if (m[1] !== undefined) { const n = oneLine(m[1]); if (n) products.push({ name: n, lines: [] }); }
      else {
        const l = oneLine(m[2]);
        if (!l || !l.includes(':')) continue;   // "Label: value" lines; the shops it was sold in are not

        if (products.length === 0) products.push({ name: null, lines: [] });
        products[products.length - 1].lines.push(l);
      }
    }
  }
  const names = products.map((p) => p.name).filter(Boolean);
  const lines = products.flatMap((p) => p.lines);
  return { title, kind, intro, products, names, lines };
}

const NOT_FOOD = /diervoe|hondenvoe|kattenvoe|huisdier|honden|katten|paarden|knaagdier|vogelvoer/;

function categoryOf(text) {
  const f = alignedFold(text ?? '');
  if (/zuigeling|babyvoeding|opvolgmelk|kindervoeding|peutermelk/.test(f)) return 'baby';
  if (/voedingssupplement|supplement/.test(f)) return 'supplement';
  return 'food';
}

/** The sentences of a paragraph; "Anstelfood b.v. waarschuwt …" is one sentence, not two. */
function sentencesOf(text) {
  const out = [];
  for (const piece of String(text ?? '').split(/(?<=[.!?])\s+/)) {
    if (out.length > 0 && /(?:^|\s)(?:\p{L}{1,2}\.){1,3}$/u.test(out[out.length - 1])) out[out.length - 1] += ` ${piece}`;
    else out.push(piece);
  }
  return out.map((s) => s.trim()).filter(Boolean);
}

/** "Eet de salades niet." — what the consumer is asked to do. */
const ACTION = /^(?:eet|drink|gebruik|geef|consumeer|breng|lever)\b.*\bniet\b|niet (?:op)?eten|niet (?:te )?gebruiken|niet (?:op)?drinken|niet (?:te )?consumeren|terugbrengen/i;

/** One row and its page → a notice (unchecked), or { skip }. */
function toNotice(row, parts) {
  if (parts.kind !== 'food') return { skip: parts.kind === 'other' ? 'nije hrana (consumentenartikelen)' : 'vrsta upozorenja nije prepoznata' };
  const title = parts.title || row.title;
  if (NOT_FOOD.test(alignedFold(`${title}\n${parts.intro}`))) return { skip: 'hrana za životinje' };
  const sentences = sentencesOf(parts.intro);
  const action = sentences.find((s) => ACTION.test(s));
  const why = sentences.filter((s) => s !== action && !/\bwaarschuw(?:t|en)\b/i.test(s));
  const reason = cut(why.slice(0, 2).join(' ').replace(/\.$/, ''), 160);
  if (!reason) return { skip: 'bez razloga' };
  const labeledName = parts.lines.map((l) => /^product(?:naam)?\s*:\s*(.+)$/i.exec(l)).filter(Boolean).map((m) => m[1]);
  const fromTitle = title.replace(/^veiligheidswaarschuwing\s+/i, '').trim();
  const name = cut((labeledName.length ? labeledName : parts.names).join(', ') || fromTitle, 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const brand = (/\svan\s+(?:de |het )?([^()]{2,40})$/i.exec(fromTitle) ?? [])[1];
  const labeled = parts.lines.join('\n');
  const lots = labeledLots(labeled);
  const dates = labeledDates(labeled);
  return {
    notice: {
      id: idOfRow(row), country: COUNTRY, published: row.day, category: categoryOf(`${title}\n${parts.intro}\n${labeled}`),
      hazard: hazardOf(reason, `${title}\n${parts.intro}\n${labeled}`),
      name, brand: brand ? brand.trim() : undefined, reason,
      details: parts.lines.length ? cut(parts.products.map((p) => (p.name ? `${p.name}: ${p.lines.join(', ')}` : p.lines.join(', '))).join('; '), 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      action: action ? cut(action, 500) : undefined,
      source: SOURCE, url: row.url, gtins: labeledGtins(labeled).slice(0, 50),
    },
  };
}

/** Reads the sitemap and the latest warnings. Resolves to { notices, seen, skipped }; throws when they are not as described above. */
async function fetchNotices({ fetchImpl = fetch, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  let searched = [];
  let searchFailed = false;
  try {
    searched = await searchRows(fetchImpl, { userAgent, since });
  } catch (e) {
    searchFailed = true;
    count(`pretraga NVWA nije odgovorila (${String(e && e.message ? e.message : e).slice(0, 80)}) — samo kratke liste`);
  }
  const rows = [];
  for (const row of [...searched, ...sitemapRows(await getText(fetchImpl, SITEMAP, { userAgent })), ...latestRows(await getText(fetchImpl, LATEST, { userAgent }))]) {
    if (!rows.some((r) => r.url === row.url)) rows.push(row);
  }
  const notices = [];
  const toRead = [];
  for (const row of rows) {
    if (row.day < since) { count('starije od prozora'); continue; }
    const k = known.get(idOfRow(row));
    if (k) notices.push(k);
    else toRead.push(row);
  }
  const now = toRead.slice(0, MAX_PAGES);
  const pages = await mapLimit(now, 2, async (row) => pageParts(await getText(fetchImpl, row.url, { userAgent })));
  let odd = 0;
  let read = 0;
  now.forEach((row, i) => {
    if (!pages[i].ok) { count('stranica nije pročitana (pokušava se sljedeći put)'); return; }
    if (pages[i].value === null || pages[i].value.kind === null) { odd += 1; count('stranica nije u obliku upozorenja'); return; }
    read += 1;
    const out = toNotice(row, pages[i].value);
    if (out.skip) count(out.skip);
    else notices.push(out.notice);
  });
  if (odd > 0 && read === 0) throw new Error(`nijedna pročitana stranica nije u obliku upozorenja (${odd}) — format se promijenio?`);
  for (let i = MAX_PAGES; i < toRead.length; i++) count('stranica ostavljena za sljedeće pokretanje');
  // without the search, the lists show only the last days: what was read before stays while it is in the window
  if (searchFailed) {
    for (const k of known.values()) {
      if (k.published >= since && !notices.some((n) => n.id === k.id)) notices.push(k);
    }
  }
  return { notices, seen: rows.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: SITEMAP, fetchNotices, searchRequest, searchRows, sitemapRows, latestRows, pageParts, toNotice, idOfRow, MAX_PAGES };
