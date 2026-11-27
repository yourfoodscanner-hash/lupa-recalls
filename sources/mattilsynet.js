'use strict';
/**
 * Norway — Mattilsynet (the Norwegian Food Safety Authority), "Tilbakekallinger": the recalls the
 * authority publishes, theme "Mat og drikke" (?category=mat).
 *
 * Seen on the live data (27 Nov 2026): the list, newest first, 10 a page (?index=0, 1 …), each row a link
 * and a title ("Arla Protein Pudding Chocolate og Salted Caramel tilbakekalles på grunn av fare for
 * glassbiter i produktene") — no day. The page of a recall: the day it was published
 * (<time data-testid="published-date">), an opening paragraph, and a card per product with labeled
 * fields: "Produktnavn", "Virksomhet som kaller tilbake varen", "Holdbarhetsdato" (Best før: dates),
 * "Varenummer, for eksempel EAN-nummer" ("GTIN: 7033330896817"), "Lot-nummer", "Batchnummer" …
 * Food contact materials are a theme of food too ("mat/matkontaktmaterialer"); the recalls on that list
 * are left out. A page is read once (`known` after that).
 */
const { htmlToText, oneLine, idOf, cut, labeledGtins, alignedFold } = require('../lib/text');
const { getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');
const { isValidGtin, isShopNumber } = require('../lib/gtin');

const NAME = 'mattilsynet';
const PREFIX = 'no-mattilsynet-';
const COUNTRY = 'NO';
const SOURCE = 'Mattilsynet';
const SITE = 'https://www.mattilsynet.no';
const LIST = `${SITE}/tilbakekallinger`;
const MAX_LIST_PAGES = 6;
const MAX_PAGES = 40;

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** The recalls on a page of the list. Throws when the page is not the list. */
function listRows(html) {
  const page = String(html ?? '');
  if (!/Treff:\s*\d+\s*tilbakekalling/.test(page)) throw new Error('stranica nije lista tilbakekallinger (format se promijenio?)');
  const rows = [];
  for (const m of page.matchAll(/<li><a href="(\/tilbakekallinger\/[a-z0-9.-]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const slug = m[1].split('/').pop();
    if (!rows.some((r) => r.slug === slug)) rows.push({ slug, url: SITE + m[1], title: oneLine(m[2]) });
  }
  return rows;
}

const idOfRow = (row) => idOf(PREFIX, row.slug);

/** A recall's page → { title, day, intro, products: [{ field: value }] } or null when it is not a recall. */
function pageParts(html) {
  const page = String(html ?? '');
  const day = (/<time datetime="(\d{4}-\d{2}-\d{2})[^"]*" data-testid="published-date"/.exec(page) ?? [])[1] ?? null;
  const cards = [...page.matchAll(/<article class="[^"]*report-recall[^"]*">([\s\S]*?)<\/article>/g)];
  if (!day || cards.length === 0) return null;
  const title = oneLine((/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(page) ?? [])[1] ?? '');
  const before = page.slice(0, cards[0].index);
  const paragraphs = [...before.slice(before.search(/<h1/)).matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((p) => oneLine(p[1])).filter((p) => p.length > 20);
  const products = cards.map((c) => {
    const fields = {};
    for (const m of c[1].matchAll(/<dt>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/g)) {
      const label = alignedFold(oneLine(m[1]));
      const dates = [...m[2].matchAll(/data-testid="recall-expiration-date">([^<]+)</g)].map((d) => d[1].trim());
      fields[label] = dates.length ? dates : htmlToText(m[2].replace(/<figure[\s\S]*?<\/figure>/g, '')).replace(/\s+/g, ' ').trim();
    }
    return fields;
  });
  return { title, day, paragraphs, products };
}

/** "… tilbakekalles på grunn av fare for glassbiter i produktene" → "Fare for glassbiter i produktene". */
function reasonOf(title, paragraphs) {
  const m = /\b(?:på grunn av|pga\.?|grunnet|etter funn av|etter påvist|etter at det er påvist)\s+(.+)$/i.exec(title);
  if (m) return capital(m[1]);
  const because = paragraphs.map((p) => /Årsaken er at\s+([^.]+)/i.exec(p)).find(Boolean);
  if (because) return capital(because[1]);
  return title || null;
}

function categoryOf(t) {
  const f = alignedFold(t ?? '');
  if (/morsmelkerstatning|barnemat|spedbarn|smabarn/.test(f)) return 'baby';
  if (/kosttilskudd/.test(f)) return 'supplement';
  return 'food';
}

/** One row and its page → a notice (unchecked), or { skip }. */
function toNotice(row, parts) {
  const field = (p, ...labels) => { for (const l of labels) if (p[l] !== undefined) return p[l]; return undefined; };
  const names = [...new Set(parts.products.map((p) => field(p, 'produktnavn')).filter((n) => typeof n === 'string' && n.length >= 2))];
  const name = cut(names.join(', ') || parts.title, 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const reason = cut(reasonOf(parts.title || row.title, parts.paragraphs) ?? '', 160);
  if (!reason) return { skip: 'bez razloga' };
  // "Lot: 153726", "62104654 (best før 18.01.2027)": the number, not the words around it
  const lots = [...new Set(parts.products.flatMap((p) => [field(p, 'lot-nummer', 'lotnummer'), field(p, 'batchnummer')])
    .filter((v) => typeof v === 'string')
    .flatMap((v) => v.replace(/\([^)]*\)/g, ' ').replace(/\bbest før[^,;]*/gi, ' ').split(/\s*(?:,|;|\/|\bog\b|\band\b)\s*/i))
    .map((v) => v.replace(/^(?:lot|batch)(?:-?nummer)?\s*:?\s*/i, '').trim())
    .filter((v) => /\d/.test(v) && v.length <= 40))];
  const dates = [...new Set(parts.products.flatMap((p) => { const d = field(p, 'holdbarhetsdato'); return Array.isArray(d) ? d : []; }))];
  const codes = parts.products.map((p) => field(p, 'varenummer, for eksempel ean-nummer', 'varenummer')).filter((v) => typeof v === 'string');
  const gtins = [...new Set(codes.flatMap((c) => {
    const labeled = labeledGtins(c);
    if (labeled.length) return labeled;
    const bare = c.replace(/\s+/g, '');
    return /^\d{8}$|^\d{12,14}$/.test(bare) && isValidGtin(bare) && !isShopNumber(bare) ? [bare] : [];
  }))];
  const companies = [...new Set(parts.products.map((p) => field(p, 'virksomhet som kaller tilbake varen')).filter((v) => typeof v === 'string'))];
  const text = parts.paragraphs.join('\n');
  const action = parts.paragraphs.flatMap((p) => p.split(/(?<=[.!?])\s+/)).find((s) => /\bbes om\b|kan returnere|returnere|lever(?:e)? (?:dem|den|det|de)? ?tilbake|\bkast|ikke spise|ikke bruke|ikke drikke/i.test(s));
  const details = [companies.join(', '), parts.paragraphs[0] ?? ''].filter(Boolean).join('. ');
  return {
    notice: {
      id: idOfRow(row), country: COUNTRY, published: parts.day, category: categoryOf(`${parts.title}\n${name}\n${text}`),
      hazard: hazardOf(reason, text),
      name, reason,
      details: details ? cut(details, 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      action: action ? cut(action.trim(), 500) : undefined,
      source: SOURCE, url: row.url, gtins: gtins.slice(0, 50),
    },
  };
}

/** Reads the list of food recalls. Resolves to { notices, seen, skipped }; throws when the list is not as described above. */
async function fetchNotices({ fetchImpl = fetch, url = LIST, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const contact = new Set(listRows(await getText(fetchImpl, `${url}?category=mat%2Fmatkontaktmaterialer`, { userAgent })).map((r) => r.slug));
  const notices = [];
  const seen = new Set();
  let reads = 0;
  let odd = 0;
  let read = 0;
  for (let n = 0; n < MAX_LIST_PAGES; n++) {
    const rows = listRows(await getText(fetchImpl, `${url}?category=mat${n ? `&index=${n}` : ''}`, { userAgent })).filter((r) => !seen.has(r.slug));
    if (n === 0 && rows.length === 0) throw new Error('lista tilbakekallinger je prazna (format se promijenio?)');
    if (rows.length === 0) break;
    rows.forEach((r) => seen.add(r.slug));
    const days = [];
    const toRead = [];
    for (const row of rows) {
      if (contact.has(row.slug)) { count('materijal u dodiru s hranom (posuđe)'); continue; }
      const k = known.get(idOfRow(row));
      if (k) { days.push(k.published); if (k.published >= since) notices.push(k); else count('starije od prozora'); }
      else toRead.push(row);
    }
    const now = toRead.slice(0, Math.max(0, MAX_PAGES - reads));
    reads += now.length;
    for (let i = now.length; i < toRead.length; i++) count('stranica ostavljena za sljedeće pokretanje');
    const pages = await mapLimit(now, 2, async (row) => pageParts(await getText(fetchImpl, row.url, { userAgent })));
    now.forEach((row, i) => {
      if (!pages[i].ok) { count('stranica nije pročitana (pokušava se sljedeći put)'); return; }
      if (pages[i].value === null) { odd += 1; count('stranica nije u obliku tilbakekalling'); return; }
      read += 1;
      const parts = pages[i].value;
      days.push(parts.day);
      if (parts.day < since) { count('starije od prozora'); return; }
      const out = toNotice(row, parts);
      if (out.skip) count(out.skip);
      else notices.push(out.notice);
    });
    if (days.length > 0 && days.every((d) => d < since)) break;
    if (reads >= MAX_PAGES || (odd > 0 && read === 0)) break;
  }
  if (odd > 0 && read === 0) throw new Error(`nijedna pročitana stranica nije u obliku tilbakekalling (${odd}) — format se promijenio?`);
  return { notices, seen: seen.size, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: LIST, fetchNotices, listRows, pageParts, toNotice, reasonOf };
