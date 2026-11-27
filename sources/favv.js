'use strict';
/**
 * Belgium — FAVV / AFSCA (the federal food chain safety agency), "Terugroepingen": the recalls of
 * products from consumers that the agency publishes (in Dutch; the same notices exist in French).
 *
 * Seen on the live data (27 Nov 2026, 793 recalls): the agency's list, newest first, 10 a page, each
 * row with the notice's title ("Terugroeping van Albert Heijn"), the product ("AH spinazie à la crème
 * van het merk Albert Heijn"), the problem ("Mogelijke aanwezigheid van stukjes plastic") and the day.
 * The page of each notice repeats these as labeled fields and describes the product line by line
 * ("Naam van het product:", "Merk:", "Minimale houdbaarheidsdatum (THT …): 04-2028", "Lotnummer:" …).
 *
 * A page is read only for a notice not read before (`known`). Batches, dates and barcodes: only
 * where the description labels them (lib/text). Feed, pet food and kitchenware are left out.
 */
const { htmlToText, oneLine, idOf, cut, labeledGtins, labeledLots, labeledDates, labeledValue, firstSentence, alignedFold } = require('../lib/text');
const { getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');

const NAME = 'favv';
const PREFIX = 'be-favv-';
const COUNTRY = 'BE';
const SOURCE = 'FAVV';
const SITE = 'https://favv-afsca.be';
const LIST = `${SITE}/nl/producten?f%5B0%5D=products_issue_type%3A13`;
const MAX_LIST_PAGES = 10;
const MAX_PAGES = 60;

/** "26/11/2026" → "2026-11-26". */
function dayOfSlashed(value) {
  const m = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/.exec(String(value ?? ''));
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null;
}

/** The rows of a page of the list. Throws when the page is not the list. */
function listRows(html) {
  const page = String(html ?? '');
  if (!/class="view--products--page|view--products-search-api/.test(page)) throw new Error('stranica nije lista terugroepingen (format se promijenio?)');
  const rows = [];
  for (const m of page.matchAll(/<li class="view__row">([\s\S]*?)<\/li>\s*(?=<li class="view__row">|<\/ul>)/g)) {
    const item = m[1];
    const href = (/<a href="(\/nl\/producten\/[^"?#]+)"/.exec(item) ?? [])[1];
    if (!href) continue;
    const slug = href.split('/').pop();
    const all = (cls) => [...item.matchAll(new RegExp(`<span class="${cls}">([\\s\\S]*?)<\\/span>`, 'g'))].map((x) => oneLine(x[1])).filter(Boolean);
    rows.push({
      slug, url: SITE + href,
      title: oneLine((/<span class="node__title">([\s\S]*?)<\/span>/.exec(item) ?? [])[1] ?? ''),
      products: all('initiator'),
      reasons: all('reason'),
      day: dayOfSlashed((/<time[^>]*datetime="([^"]+)"/.exec(item) ?? [])[1]),
    });
  }
  return rows;
}

/** Where the description ends: the shops the product was sold in, or the contact. */
const SHOPS = /verdeeld|verkooppunt|voor (?:meer|bijkomende) informatie|contact opnemen/i;

/** A notice's page → { text, description, fields } or null when it is not a notice. */
function pageParts(html) {
  const page = String(html ?? '');
  const body = /<div class="[^"]*field--name-body[^"]*">([\s\S]*?)<\/div>\s*<div class="node__after">/.exec(page);
  if (!body || !/node--type-product/.test(page)) return null;
  const fields = {};
  for (const m of page.matchAll(/<div class="field__label">([\s\S]*?)<\/div>\s*<div class="field__item">([\s\S]*?)<\/div>/g)) {
    const label = alignedFold(oneLine(m[1]));
    if (label && !(label in fields)) fields[label] = oneLine(m[2]);
  }
  const text = htmlToText(body[1]).replace(/^[•·\-–]\s*/gm, '');
  // "Beschrijving van het product:" and the "Label: value" lines under it, up to the shops it was sold in
  const at = text.search(/beschrijving van (?:het product|de producten)\s*:?/i);
  const description = [];
  if (at >= 0) {
    for (const line of text.slice(at).split('\n').slice(1)) {
      if (SHOPS.test(line)) break;
      if (/^[^:]{2,80}:\s*\S/.test(line)) description.push(line.trim());
    }
  }
  return { text, description: description.join('\n'), fields };
}

/** Feed, pet food and things that are not food (folded). */
const NOT_FOOD = /diervoeder|diervoeding|hondenvoe|kattenvoe|honden|katten|petfood|kauwsnack|voeder voor|materialen in contact|contact met levensmiddelen|beker|servies|keukengerei|bestek|lepel|melamine|bamboe/;

function categoryOf(text) {
  const f = alignedFold(text ?? '');
  if (/zuigeling|babyvoeding|opvolgmelk|kindervoeding|peutermelk/.test(f)) return 'baby';
  if (/voedingssupplement|supplement/.test(f)) return 'supplement';
  return 'food';
}

/** "AH spinazie à la crème van het merk Albert Heijn" → { name, brand }. */
function productOf(text) {
  const m = /^(.*?)\s+van het merk\s+(.+)$/i.exec(String(text ?? '').trim());
  return m ? { name: m[1].replace(/^[“"']|[”"']$/g, '').trim(), brand: m[2].trim() } : { name: String(text ?? '').trim(), brand: null };
}

/** One row and its page → a notice (unchecked), or { skip }. */
function toNotice(row, parts) {
  const product = productOf(parts.fields['product(en)'] ?? row.products[0] ?? '');
  const everything = `${row.title}\n${product.name}\n${parts.text}`;
  if (NOT_FOOD.test(alignedFold(`${product.name}\n${row.title}`))) return { skip: 'nije hrana (hrana za životinje, posuđe)' };
  const name = cut(labeledValue(parts.description, 'naam van (?:het )?product(?:en)?', 160) ?? product.name, 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const reason = cut(parts.fields.probleemstelling ?? row.reasons[0] ?? '', 160);
  if (!reason) return { skip: 'bez razloga' };
  const action = parts.text.split(/(?<=[.!?])\s+|\n/).find((s) => /vraagt .*(?:niet te consumeren|terug te brengen|niet te gebruiken)/i.test(s));
  const lots = labeledLots(parts.description);
  const dates = labeledDates(parts.description);
  return {
    notice: {
      id: idOf(PREFIX, row.slug), country: COUNTRY, published: row.day, category: categoryOf(everything),
      hazard: hazardOf(reason, parts.text),
      name, brand: labeledValue(parts.description, 'merk', 60) ?? product.brand ?? undefined, reason,
      details: parts.description ? cut(parts.description.replace(/\n/g, '; '), 800) : (firstSentence(parts.text, 800) ?? undefined),
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      action: action ? cut(action.trim(), 500) : undefined,
      source: SOURCE, url: row.url, gtins: labeledGtins(parts.description || parts.text).slice(0, 50),
    },
  };
}

/** Reads the list. Resolves to { notices, seen, skipped }; throws when the list is not as described above. */
async function fetchNotices({ fetchImpl = fetch, url = LIST, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const rows = [];
  for (let n = 0; n < MAX_LIST_PAGES; n++) {
    const got = listRows(await getText(fetchImpl, n === 0 ? url : `${url}&page=${n}`, { userAgent }));
    if (n === 0 && got.length > 0 && !got.some((r) => r.day)) throw new Error('redovi liste nemaju datum (format se promijenio?)');
    const fresh = got.filter((r) => !rows.some((x) => x.slug === r.slug));
    rows.push(...fresh);
    if (fresh.length === 0 || got.some((r) => r.day && r.day < since)) break;
  }
  const notices = [];
  const toRead = [];
  for (const row of rows) {
    if (!row.day) { count('bez datuma'); continue; }
    if (row.day < since) { count('starije od prozora'); continue; }
    const k = known.get(idOf(PREFIX, row.slug));
    if (k && k.published === row.day) notices.push(k);
    else toRead.push(row);
  }
  const now = toRead.slice(0, MAX_PAGES);
  const pages = await mapLimit(now, 2, async (row) => pageParts(await getText(fetchImpl, row.url, { userAgent })));
  let odd = 0;
  let read = 0;
  now.forEach((row, i) => {
    if (!pages[i].ok) { count('stranica nije pročitana (pokušava se sljedeći put)'); return; }
    if (pages[i].value === null) { odd += 1; count('stranica nije u obliku obavijesti'); return; }
    read += 1;
    const out = toNotice(row, pages[i].value);
    if (out.skip) count(out.skip);
    else notices.push(out.notice);
  });
  if (odd > 0 && read === 0) throw new Error(`nijedna pročitana stranica nije u obliku obavijesti (${odd}) — format se promijenio?`);
  for (let i = MAX_PAGES; i < toRead.length; i++) count('stranica ostavljena za sljedeće pokretanje');
  return { notices, seen: rows.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: LIST, fetchNotices, listRows, pageParts, productOf, categoryOf, toNotice, MAX_PAGES };
