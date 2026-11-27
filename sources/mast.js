'use strict';
/**
 * Iceland — Matvælastofnun (MAST), "Innkallanir": the authority's own list of food recalls
 * (https://www.mast.is/is/um-mast/frettir/innkallanir).
 *
 * Seen on the live data (27 Nov 2026): one page with every recall since 2022, newest first, each row a
 * link (/is/um-mast/frettir/innkallanir/<slug>), a title that names the problem ("Aðskotahlutur í
 * orkustykki", "Grunur um myglueitur í hveiti", "Salmonella í kryddi") and the day ("26.11.2026"). The
 * page of a recall: an opening paragraph ("Matvælastofnun varar við … vegna …"), then a list per product
 * with labeled values — "Vörumerki" (brand), "Vöruheiti" (product), "Nettómagn", "Strikamerki"
 * (barcode), "Lotunúmer" (batch), "Best fyrir dagsetning", "Síðasti notkunardagur", "Framleiðandi",
 * "Innflytjandi", "Dreifing" — and what consumers are asked to do ("Neytendur … eru beðnir um …").
 * "Allar lotur" / "Öll" (all batches) and the like are no batch and no date. A page is read once
 * (`known` after that).
 */
const { htmlToText, oneLine, dayOfDotted, idOf, cut } = require('../lib/text');
const { getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');
const { isValidGtin, isShopNumber } = require('../lib/gtin');

const NAME = 'mast';
const PREFIX = 'is-mast-';
const COUNTRY = 'IS';
const SOURCE = 'Matvælastofnun (MAST)';
const SITE = 'https://www.mast.is';
const LIST = `${SITE}/is/um-mast/frettir/innkallanir`;
const MAX_PAGES = 40;

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const unique = (xs) => [...new Set(xs.filter(Boolean))];
/** A label as one key: lower case, no accents, ð → d, þ → th, æ → ae ("Síðasti notkunardagur" → "sidasti notkunardagur"). */
const keyOf = (label) => String(label).toLowerCase().replace(/ð/g, 'd').replace(/þ/g, 'th').replace(/æ/g, 'ae').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z/ ]+/g, ' ').replace(/\s+/g, ' ').trim();
const DATE = /^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}$/;
/** The labels of the product's name: "Vöruheiti", "Vara", "Heiti vöru". */
const NAME_KEY = /^(?:voruheiti|vara|heiti voru|vorulysing)$/;

/** The rows of the list. Throws when the page is not the list. */
function listRows(html) {
  const page = String(html ?? '');
  if (!/class="entries innkallanir"/.test(page)) throw new Error('stranica nije lista „Innkallanir” (format se promijenio?)');
  const rows = [];
  for (const m of page.matchAll(/<a href="(\/is\/um-mast\/frettir\/innkallanir\/([a-z0-9-]+))">([\s\S]*?)<\/a>\s*<\/h3>\s*<div class="date">\s*([^<]+?)\s*<\/div>/g)) {
    const day = dayOfDotted(m[4]);
    if (day && !rows.some((r) => r.slug === m[2])) rows.push({ slug: m[2], url: SITE + m[1], title: oneLine(m[3]), day });
  }
  return rows;
}

const idOfRow = (row) => idOf(PREFIX, row.slug);

/** A recall's page → { title, day, paragraphs, products: [{ key: value }] } or null when it is not a recall's page. */
function pageParts(html) {
  const page = String(html ?? '');
  const body = /<div class="entryContent">([\s\S]*?)<div class="entryFooter">/.exec(page);
  const day = dayOfDotted((/<span class="date">\s*([^<]+?)\s*<\/span>/.exec(page) ?? [])[1] ?? '');
  if (!body || !day) return null;
  const title = oneLine((/<div class="boxTitle"><h1>([\s\S]*?)<\/h1>/.exec(page) ?? [])[1] ?? '');
  const content = body[1].replace(/<h2[\s\S]*$/i, '');   // "Ítarefni" (links to press releases) and below
  const paragraphs = [...content.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((p) => oneLine(p[1]).replace(/\s+([,.;:!?])/g, '$1')).filter((p) => p.length > 20);
  // every "Label: value" of the lists, a new product where a brand or product name comes again
  const products = [];
  let current = null;
  for (const li of content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)) {
    const text = oneLine(li[1]);
    const m = /^([^:]{3,60}):\s*(.*)$/.exec(text);
    if (!m) continue;
    const key = keyOf(m[1]);
    const value = m[2].trim();
    if (!current || ((key === 'vorumerki' || NAME_KEY.test(key)) && current[key] !== undefined)) { current = {}; products.push(current); }
    if (current[key] === undefined) current[key] = value;
  }
  return { title, day, paragraphs, products };
}

/** The value of the first label that matches, in a product. */
function field(product, test) {
  for (const [k, v] of Object.entries(product)) if (test.test(k) && v) return v;
  return undefined;
}

/** "Lota 25/16/11, best fyrir 12.06.2028; lota 25/24/11, best fyrir 09.07.2028" → lots and dates; "Allar lotur" → none. */
function lotsAndDates(product) {
  const lots = [];
  const dates = [];
  for (const [key, value] of Object.entries(product)) {
    const isLot = /^lot|framleidslulot/.test(key);
    const isDate = /^best fyrir|^sidasti notkunardagur|^notist fyrir|^sidasti sold/.test(key);
    if (!isLot && !isDate) continue;
    const parts = value.replace(/\([^)]*\)/g, ' ').split(/\s*(?:[,;]|\bog\b|\s&\s)\s*/i).map((p) => p.trim()).filter(Boolean);
    for (const part of parts) {
      const bb = /^(?:best fyrir(?: dagsetning)?|bf)\s*:?\s*(.+)$/i.exec(part);
      const lot = /^(?:lota|lotur|lotunúmer|lotunumer|lot)\s*:?\s*(.+)$/i.exec(part);
      const v = (bb ? bb[1] : lot ? lot[1] : part).replace(/[.\s]+$/, '').trim();
      if (!/\d/.test(v) || v.length > 40) continue;
      // "Lota 25/16/11" is a batch even when it looks like a date; a date alone under a batch label is a date
      if (lot) lots.push(v);
      else if (bb || isDate || DATE.test(v)) dates.push(v);
      else lots.push(v);
    }
  }
  return { lots: unique(lots), dates: unique(dates) };
}

function categoryOf(text) {
  const f = keyOf(text);
  if (/ungbarn|barnamat|thurrmjolk|ungbornum/.test(f)) return 'baby';
  if (/faedubot/.test(f)) return 'supplement';
  return 'food';
}

/** One row and its page → a notice (unchecked), or { skip }. */
function toNotice(row, parts) {
  const named = parts.products.map((p) => {
    const brand = field(p, /^vorumerki$/);
    const product = field(p, NAME_KEY);
    if (!product) return null;
    return brand && !product.toLowerCase().startsWith(brand.toLowerCase()) ? `${brand} ${product}` : product;
  }).filter(Boolean);
  const name = cut(unique(named).join(', '), 160);
  if (name.length < 2) return { skip: 'bez naziva proizvoda' };
  const reason = cut(capital(parts.title || row.title), 160);
  if (!reason) return { skip: 'bez razloga' };
  const brands = unique(parts.products.map((p) => field(p, /^vorumerki$/)));
  const lots = [];
  const dates = [];
  for (const p of parts.products) { const ld = lotsAndDates(p); lots.push(...ld.lots); dates.push(...ld.dates); }
  // the barcode field is labeled: every valid number in it is a barcode
  const gtins = unique(parts.products.flatMap((p) => (field(p, /^strikamerki|^strikanumer/) ?? '').match(/\d{8,14}/g) ?? []))
    .filter((g) => isValidGtin(g) && !isShopNumber(g));
  // who recalls, else who imports, else who makes it — at most two
  const companies = unique(parts.products.map((p) => field(p, /^heiti og heimilisfang/) ?? field(p, /^innflytjandi/) ?? field(p, /^framleidandi$/))
    .map((c) => c && c.replace(/[.\s]+$/, ''))).slice(0, 2);
  const text = parts.paragraphs.join('\n');
  const action = parts.paragraphs.slice(1).find((p) => /\bbeðnir um\b|\bbent á\b|\bráðið frá\b|\bskulu ekki\b|\bfarga\b|\bskila\b/i.test(p));
  const details = [companies.join(', '), parts.paragraphs[0] ?? ''].filter(Boolean).join('. ');
  return {
    notice: {
      id: idOfRow(row), country: COUNTRY, published: parts.day, category: categoryOf(`${parts.title}\n${name}\n${text}`),
      hazard: hazardOf(reason, text),
      name, reason,
      brand: brands.length === 1 && brands[0].length <= 80 ? brands[0] : undefined,
      details: details ? cut(details, 800) : undefined,
      lots: lots.length ? cut(unique(lots).join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(unique(dates).join(', '), 120) : undefined,
      action: action ? cut(action, 500) : undefined,
      source: SOURCE, url: row.url, gtins: gtins.slice(0, 50),
    },
  };
}

/** Reads the list of recalls. Resolves to { notices, seen, skipped }; throws when the list is not as described above. */
async function fetchNotices({ fetchImpl = fetch, url = LIST, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const rows = listRows(await getText(fetchImpl, url, { userAgent }));
  if (rows.length === 0) throw new Error('lista „Innkallanir” je prazna (format se promijenio?)');
  const notices = [];
  const toRead = [];
  for (const row of rows) {
    if (row.day < since) { count('starije od prozora'); continue; }
    const k = known.get(idOfRow(row));
    if (k) notices.push(k);
    else toRead.push(row);
  }
  const now = toRead.slice(0, MAX_PAGES);
  for (let i = now.length; i < toRead.length; i++) count('stranica ostavljena za sljedeće pokretanje');
  const pages = await mapLimit(now, 2, async (row) => pageParts(await getText(fetchImpl, row.url, { userAgent })));
  let odd = 0;
  now.forEach((row, i) => {
    if (!pages[i].ok) { count('stranica nije pročitana (pokušava se sljedeći put)'); return; }
    if (pages[i].value === null) { odd += 1; count('stranica nije u obliku obavijesti'); return; }
    const out = toNotice(row, pages[i].value);
    if (out.skip) count(out.skip);
    else notices.push(out.notice);
  });
  if (odd > 0 && odd === now.length) throw new Error(`nijedna pročitana stranica nije u obliku obavijesti (${odd}) — format se promijenio?`);
  return { notices, seen: rows.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: LIST, fetchNotices, listRows, pageParts, toNotice, lotsAndDates };
