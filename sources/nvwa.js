'use strict';
/**
 * Netherlands — NVWA (Nederlandse Voedsel- en Warenautoriteit), "Veiligheidswaarschuwingen": the
 * companies' warnings about unsafe food (and about other products, which are left out) that the authority
 * publishes as news (/actueel/nieuws/2026/11/26/veiligheidswaarschuwing-…).
 *
 * Seen on the live data (27 Nov 2026): the site's full list of warnings is drawn in the browser from a
 * search service that cannot be read here, and its RSS feeds answer "feeds offline". What is on the
 * server's pages: the news sitemap (/news/sitemap.xml — every news item of the last two days, with its
 * day and title) and the three latest warnings on /actueel/veiligheidswaarschuwingen. The feed job runs
 * every day, so both together see every new warning; a warning read once is kept (`known`) for as long
 * as it is in the window.
 *
 * The page of a warning: the title ("Veiligheidswaarschuwing diverse salades van Marqt Keuken"), an
 * opening paragraph ("Udea waarschuwt voor … Er bestaat een kans dat deze producten witte harde plastic
 * stukjes bevatten. Eet de salades niet."), "Om welke producten gaat het?" with the products (a heading
 * each, then labeled lines: "EAN: …", "Ten minste houdbaar tot (THT): …"), and at the end the e-mail
 * subscription it belongs to — "… over levensmiddelen en diervoeders" (food) or "… over
 * consumentenartikelen" (anything else, left out).
 */
const { decodeEntities, htmlToText, oneLine, idOf, cut, labeledGtins, labeledLots, labeledDates, alignedFold } = require('../lib/text');
const { getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');

const NAME = 'nvwa';
const PREFIX = 'nl-nvwa-';
const COUNTRY = 'NL';
const SOURCE = 'NVWA';
const SITE = 'https://www.nvwa.nl';
const SITEMAP = `${SITE}/news/sitemap.xml`;
const LATEST = `${SITE}/actueel/veiligheidswaarschuwingen`;
const MAX_PAGES = 30;
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
  const kind = /veiligheidswaarschuwingen over levensmiddelen/.test(f) ? 'food' : /veiligheidswaarschuwingen over consumenten/.test(f) ? 'other' : null;
  const intro = text.split('\n').find((l) => /\bwaarschuwt\b/i.test(l)) ?? '';
  // "Om welke producten gaat het?": a heading per product, then its labeled lines
  const block = /<h2[^>]*>\s*Om welke? product(?:en)? gaat het\??\s*<\/h2>([\s\S]*?)(?:<\/div>|<h2)/i.exec(main[1]);
  const products = [];
  if (block) {
    for (const m of block[1].matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>|<li[^>]*>([\s\S]*?)<\/li>/g)) {
      if (m[1] !== undefined) { const n = oneLine(m[1]); if (n) products.push({ name: n, lines: [] }); }
      else {
        const l = oneLine(m[2]);
        if (!l) continue;
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

/** "Eet de salades niet." — what the consumer is asked to do. */
const ACTION = /^(?:eet|drink|gebruik|geef|consumeer|breng|lever)\b.*\bniet\b|niet (?:op)?eten|niet (?:te )?gebruiken|niet (?:op)?drinken|niet (?:te )?consumeren|terugbrengen/i;

/** One row and its page → a notice (unchecked), or { skip }. */
function toNotice(row, parts) {
  if (parts.kind !== 'food') return { skip: parts.kind === 'other' ? 'nije hrana (consumentenartikelen)' : 'vrsta upozorenja nije prepoznata' };
  const title = parts.title || row.title;
  if (NOT_FOOD.test(alignedFold(`${title}\n${parts.intro}`))) return { skip: 'hrana za životinje' };
  const sentences = parts.intro.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  const action = sentences.find((s) => ACTION.test(s));
  const why = sentences.filter((s) => s !== action && !/\bwaarschuwt\b/i.test(s));
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
      hazard: hazardOf(reason, `${parts.intro}\n${labeled}`),
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
  const rows = [];
  for (const row of [...sitemapRows(await getText(fetchImpl, SITEMAP, { userAgent })), ...latestRows(await getText(fetchImpl, LATEST, { userAgent }))]) {
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
  // the lists show only the last days: what was read before stays while it is in the window
  for (const k of known.values()) {
    if (k.published >= since && !notices.some((n) => n.id === k.id)) notices.push(k);
  }
  return { notices, seen: rows.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: SITEMAP, fetchNotices, sitemapRows, latestRows, pageParts, toNotice, idOfRow, MAX_PAGES };
