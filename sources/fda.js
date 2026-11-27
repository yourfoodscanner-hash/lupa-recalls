'use strict';
/**
 * United States — U.S. Food and Drug Administration, the weekly Enforcement Report for food (and dietary
 * supplements), through openFDA: https://api.fda.gov/food/enforcement.json — every recall of a food the
 * FDA regulates, product by product, with the FDA's own words.
 *
 * Seen on the live data (27 Nov 2026): a record per product, the recall it belongs to as "event_id"
 * (one recall of 50 products is 50 records), "report_date" (the week the FDA published it, 20261118),
 * "product_description" ("Brad's Crunchy Kale Original, 2 oz (57g) bags with UPC 813104021679."),
 * "reason_for_recall", "code_info" ("Lots 33525-1, 33525-2 …", "Lot code: 10/2027 Best By: 10/2027"),
 * "classification", "status", "recalling_firm", "distribution_pattern". Human food has recall numbers
 * "H-…"; others (veterinary "V-…") are left out.
 *
 * One notice per recall (event): its products' names, every barcode the descriptions label ("UPC …",
 * written also as "0 11152 64246 8"), the batches and dates "code_info" labels. Published: the week of
 * the report. Meat, poultry and eggs are USDA's (FSIS), whose service does not answer GitHub's servers.
 *
 * Company announcements — the recalls a company announces to the public, which the FDA posts the same
 * day on its list "Recalls, Market Withdrawals, & Safety Alerts" (weeks before the Enforcement Report
 * has them). Seen on the live data (27 Nov 2026): the list's own JSON (the table of the page, 100 rows,
 * newest first: the day, the brand and a link to the announcement, the product, the product types —
 * "Food & Beverages, Allergens", "Dietary Supplements", "Drugs", "Animal & Veterinary" … —, the reason,
 * the company). The page of an announcement: a summary (the same values) and the company's text, often
 * with a table of the products ("UPC", "Lot", "Best By" columns). Only food and dietary supplements for
 * people; an announcement in Spanish beside the same company's in English is the same recall.
 *
 * One recall, one notice: a recall the company announced is published as the announcement (from its
 * day, with its page's link), and its record in the Enforcement Report — the same company, started
 * within three weeks of the announcement, a product word in common, or a barcode in common — is not
 * published again; the barcodes it lists are added to the announcement's. A page is read once (`known`).
 */
const { htmlToText, oneLine, idOf, cut, labeledGtins, labeledLots, labeledDates, alignedFold } = require('../lib/text');
const { getJson, getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');
const { isValidGtin, isShopNumber } = require('../lib/gtin');

const NAME = 'fda';
const PREFIX = 'us-fda-';
const COUNTRY = 'US';
const SOURCE = 'U.S. Food and Drug Administration (FDA)';
const API = 'https://api.fda.gov/food/enforcement.json';
const LIMIT = 1000;
const SITE = 'https://www.fda.gov';
const ANNOUNCEMENTS = `${SITE}/datatables/views/ajax?search_api_fulltext=&field_regulated_product_field=All&field_terminated_recall=All&draw=1&start=0&length=100&view_name=recall_solr_index&view_display_id=recall_datatable_block_1`;
const MAX_PAGES = 40;
const MATCH_DAYS = 21;

const compact = (day) => day.replace(/-/g, '');
const dayOf = (yyyymmdd) => (/^\d{8}$/.test(String(yyyymmdd ?? '')) ? `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}` : null);

/** The address of the records reported since `since` (a day) up to `until`, newest first. */
function urlFor(since, until) {
  return `${API}?search=report_date:[${compact(since)}+TO+${compact(until)}]&limit=${LIMIT}&sort=report_date:desc`;
}

/** The link of a recall: the FDA's own record of it (openFDA), every product of the recall. */
const eventUrl = (event) => `${API}?search=event_id:${encodeURIComponent(event)}&limit=100`;

/** "UPC 8 50017 63722 1" → "UPC 850017637221": a barcode written in groups is one number. */
function joinedBarcodes(text) {
  return String(text ?? '').replace(/\b(\d)[\s-](\d{5})[\s-](\d{5})[\s-](\d)\b/g, '$1$2$3$4');
}

/** "Brad's Crunchy Kale Original, 2 oz (57g) bags with UPC 813104021679." → "Brad's Crunchy Kale Original, 2 oz (57g) bags". */
function productName(description) {
  let s = String(description ?? '').replace(/\s+/g, ' ').trim();
  const labeled = /Product Name:\s*(.+?)(?:\s+-\s+[A-Z][A-Za-z ]{2,20}:|\s+Brand:|$)/i.exec(s);   // "- Product Name: X - Brand: Y …"
  if (labeled) s = labeled[1];
  // the first piece that names something — not a size alone ("28 oz")
  const pieces = s.split(/\.\s+(?=[A-Z])|;\s|\s+(?:with\s+)?UPC\b|\s+Net\s+w(?:ei)?t|\s+NET\s+WT|\s+SKU\b|\s+Item\s*#|\s+Distributed by\b|\s+Manufactured (?:by|for)\b/i);
  const named = pieces.find((p) => (p.match(/[A-Za-z]/g) ?? []).length >= 4 && !/^[\d.,\s/]*(?:fl\.?\s*)?(?:oz|lbs?|g|kg|ml|l|ct|count|gallon)\b/i.test(p.trim())) ?? '';
  return named.replace(/[\s,;:.-]+$/, '').trim();
}

function categoryOf(text) {
  const f = String(text ?? '').toLowerCase();
  if (/\binfant|baby food|toddler/.test(f)) return 'baby';
  if (/dietary supplement|supplement facts|food supplement/.test(f)) return 'supplement';
  return 'food';
}

/** The records of one recall → a notice (unchecked), or { skip }. */
function toNotice(event, records) {
  const published = records.map((r) => dayOf(r.report_date)).filter(Boolean).sort().pop();
  if (!published) return { skip: 'bez datuma' };
  const names = [...new Set(records.map((r) => productName(r.product_description)).filter((n) => n.length >= 2))];
  const name = cut(names.join(', '), 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const reasons = [...new Set(records.map((r) => String(r.reason_for_recall ?? '').replace(/\s+/g, ' ').trim()).filter(Boolean))];
  const reason = cut(reasons[0] ?? '', 160);
  if (!reason) return { skip: 'bez razloga' };
  const first = records[0];
  const codes = records.map((r) => joinedBarcodes(`${r.code_info ?? ''}\n${r.more_code_info ?? ''}`)).join('\n');
  const gtins = [...new Set(records.flatMap((r) => labeledGtins(joinedBarcodes(r.product_description))))];
  const lots = [...new Set(records.flatMap((r) => labeledLots(r.code_info ?? '')))];
  const dates = [...new Set(records.flatMap((r) => labeledDates(r.code_info ?? '')))];
  const where = [first.city, first.state].filter(Boolean).join(', ');
  const classes = [...new Set(records.map((r) => r.classification).filter((c) => /^Class I{1,3}$/.test(c ?? '')))];
  const details = [
    `${first.recalling_firm ?? ''}${where ? ` (${where})` : ''}`.trim(),
    classes.length ? `FDA ${classes.join(', ')}` : '',
    String(first.distribution_pattern ?? '').replace(/\s+/g, ' ').trim(),
  ].filter(Boolean).join('. ');
  return {
    notice: {
      id: idOf(PREFIX, event), country: COUNTRY, published, category: categoryOf(records.map((r) => r.product_description).join('\n')),
      hazard: hazardOf(reason, codes),
      name, reason,
      details: details ? cut(details, 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      source: SOURCE, url: eventUrl(event), gtins: gtins.slice(0, 50),
    },
  };
}

// ── Company announcements ──────────────────────────────────────────────────────────────────────────
/** The rows of the list's JSON: { day, url, slug, brand, product, types, reason, company }. Throws when it is not the list. */
function announcementRows(data) {
  if (!data || !Array.isArray(data.data) || typeof data.recordsTotal !== 'number') throw new Error('FDA lista saopćenja nije u očekivanom obliku (format se promijenio?)');
  const rows = [];
  for (const r of data.data) {
    if (!Array.isArray(r) || r.length < 6) continue;
    const day = (/datetime="(\d{4}-\d{2}-\d{2})/.exec(String(r[0])) ?? [])[1];
    const href = (/href="(\/safety\/recalls-market-withdrawals-safety-alerts\/([a-z0-9-]+))"/.exec(String(r[1])) ?? []);
    if (!day || !href[1]) continue;
    rows.push({ day, url: SITE + href[1], slug: href[2], brand: oneLine(r[1]), product: oneLine(r[2]), types: oneLine(r[3]), reason: oneLine(r[4]), company: oneLine(r[5]) });
  }
  if (data.data.length > 0 && rows.length === 0) throw new Error('nijedan red FDA liste saopćenja nije u očekivanom obliku (format se promijenio?)');
  return rows;
}

const isFood = (row) => /food & beverages|dietary supplements/i.test(row.types) && !/animal & veterinary/i.test(row.types);
/** "Snack Right Super Foods, Inc. dba Brad's Raw Chips" → "snack right super foods". */
const firmKey = (name) => alignedFold(String(name ?? '')).replace(/\b(?:dba|d\/b\/a|doing business as)\b[\s\S]*$/, '')
  .replace(/[^a-z0-9 ]+/g, ' ').replace(/\b(?:inc|llc|ltd|co|corp|corporation|company|incorporated|the)\b/g, ' ').replace(/\s+/g, ' ').trim();
const sameFirm = (a, b) => { const x = firmKey(a); const y = firmKey(b); return !!x && !!y && (x === y || (Math.min(x.length, y.length) >= 5 && (x.startsWith(y) || y.startsWith(x)))); };
const COMMON = new Set(['with', 'from', 'that', 'this', 'product', 'products', 'brand', 'recall', 'recalls', 'size', 'count', 'pack', 'packs', 'bags', 'ounce', 'ounces', 'each', 'case', 'cases', 'units', 'net', 'contains', 'organic', 'natural', 'original']);
const words = (text) => new Set((alignedFold(String(text ?? '')).match(/[a-z]{4,}/g) ?? []).filter((w) => !COMMON.has(w)));
const daysBetween = (a, b) => Math.abs((Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / 86400000);

/** An announcement in Spanish ("… emite alerta por alérgenos …") beside the same company's in English. */
const SPANISH = /(?:^|-)(?:emite|alerta|retira|retiro|debido|presencia|producto|alergenos|posible|del|por|los|las)(?=-|$)/g;
const isSpanish = (row) => (row.slug.match(SPANISH) ?? []).length >= 2;

/** The values of an Enforcement Report recall that an announcement is matched by. */
function eventFacts(records) {
  const first = records[0];
  return {
    firm: first.recalling_firm, started: dayOf(first.recall_initiation_date),
    words: words(records.map((r) => r.product_description).join(' ')),
    gtins: [...new Set(records.flatMap((r) => labeledGtins(joinedBarcodes(r.product_description))))],
  };
}

/** Is this Enforcement Report recall the one the company announced? (`gtins`: the barcodes of the announcement's page, if read) */
function sameRecall(row, facts, gtins = []) {
  if (gtins.length && facts.gtins.some((g) => gtins.includes(g))) return true;
  if (!sameFirm(row.company, facts.firm) || !facts.started || daysBetween(row.day, facts.started) > MATCH_DAYS) return false;
  const mine = words(row.product);
  return [...mine].some((w) => facts.words.has(w));
}

/** The barcodes, batches and dates of the tables of an announcement: the "UPC", "Lot", "Best By" … columns. */
function tableValues(html) {
  const out = { gtins: [], lots: [], dates: [] };
  for (const t of String(html ?? '').matchAll(/<table\b[\s\S]*?<\/table>/gi)) {
    const rows = [...t[0].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((r) => [...r[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((c) => htmlToText(c[1])));
    if (rows.length < 2) continue;
    const head = rows[0].map((h) => h.toLowerCase().replace(/\s+/g, ' '));
    const column = (re, taken) => head.findIndex((h, i) => re.test(h) && !taken.includes(i));
    const upc = column(/\bupc\b|gtin|bar ?code|\bean\b/, []);
    const lot = column(/\blot\b|\bbatch\b|julian/, [upc]);
    const date = column(/best\s*(?:by|before|if used)|use\s*by|sell\s*by|\bexp|\bdate\b/, [upc, lot]);
    for (const row of rows.slice(1)) {
      if (upc >= 0 && row[upc]) {
        for (const piece of joinedBarcodes(row[upc]).split(/\n|,|\bor\b|\band\b/)) {
          const digits = piece.replace(/[\s-]/g, '');
          if (/^\d{8,14}$/.test(digits) && isValidGtin(digits) && !isShopNumber(digits)) out.gtins.push(digits);
        }
      }
      if (lot >= 0 && row[lot]) {
        for (const piece of row[lot].split(/\n|,|\bor\b|\band\b/)) {
          const v = piece.replace(/^\s*lot\s*(?:#|no\.?|number|code)?\s*:?\s*/i, '').trim();
          if (/\d/.test(v) && v.length <= 30 && !/[a-z]{4,}/.test(v)) out.lots.push(v);
        }
      }
      if (date >= 0 && row[date]) {
        const v = row[date].replace(/\s+/g, ' ').replace(/^(?:best\s*(?:by|before|if used by)|expiration\s*date|exp\.?|use\s*by)\s*:?\s*/i, '').trim();
        if (/\d/.test(v) && v.length <= 60) out.dates.push(v);
      }
    }
  }
  return out;
}

const MONTH = '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?';
/** Drugs found in "supplements": sildenafil, tadalafil, DMAA, fluoxetine … */
const DRUG = /sildenafil|tadalafil|taladalfil|vardenafil|sibutramine?|dmaa|dimethylamylamine|yohimbine|fluoxetine|dinitrophenol|\bdnp\b|phenolphthalein|acetaminophen|diclofenac|dexamethasone|meloxicam/i;
/** "Best By February 1, 2027", "BB:Oct/05/2027": the dates written with a month's name after a date label. */
function namedMonthDates(text) {
  const re = new RegExp(`(?:best(?:\\s+if\\s+used)?\\s+by|use\\s+by|sell\\s+by|exp(?:iration)?(?:\\s+date)?|\\bbb)\\s*[:.]?\\s*(${MONTH}[\\s/,]*\\d{1,2}(?:st|nd|rd|th)?[\\s/,]+\\d{4})`, 'gi');
  return [...String(text ?? '').matchAll(re)].map((m) => m[1].replace(/\s+/g, ' ').trim());
}

/** An announcement's page → { text, firstParagraph, gtins, lots, dates, action } or null when it is not an announcement. */
function announcementParts(html) {
  const page = String(html ?? '').replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '');
  const start = page.search(/<h2[^>]*id="recall-announcement"/);
  if (start < 0) return null;
  const rest = page.slice(start);
  const end = rest.search(/<h2[^>]*id="recall-photos"|id="recall-photos"|<h2[^>]*>\s*Company Contact Information/);
  const body = rest.slice(0, end > 0 ? end : 40000).replace(/<h2[\s\S]*?<\/h2>/, '');
  const text = joinedBarcodes(htmlToText(body));
  const tables = tableValues(body);
  const prose = joinedBarcodes(htmlToText(body.replace(/<table\b[\s\S]*?<\/table>/gi, ' ')));
  const paragraphs = [...body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((p) => oneLine(p[1])).filter((p) => p.length > 30);
  const sentences = paragraphs.join(' ').split(/(?<=[.!?])\s+(?=[A-Z“"])/);
  const action = sentences.find((x) => /\bconsumers?\b[^.]*\b(?:should|are urged|are advised|can return|may return|who have purchased)\b|\bshould not (?:eat|consume|use)\b|\bdiscard\b|\breturn (?:it|them|the product)/i.test(x));
  return {
    text, firstParagraph: paragraphs[0] ?? '',
    gtins: [...new Set([...labeledGtins(prose), ...tables.gtins])],
    lots: [...new Set([...labeledLots(prose), ...tables.lots])],
    dates: [...new Set([...labeledDates(prose), ...namedMonthDates(prose), ...tables.dates])],
    action: action ? action.trim() : null,
  };
}

/** An announcement (its row, its page if read, the Enforcement Report recalls it matched) → a notice (unchecked), or { skip }. */
function announcementNotice(row, parts, matched = []) {
  const brand = /^no brand(?: name)?$|^none$|^n\/a$/i.test(row.brand) ? '' : row.brand;
  const name = cut((brand && !alignedFold(row.product).includes(alignedFold(brand)) ? `${brand} ${row.product}` : row.product).replace(/[\s,;:.]+$/, ''), 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const reason = cut(row.reason.replace(/^\w/, (c) => c.toUpperCase()).replace(/\.$/, ''), 160);
  if (!reason) return { skip: 'bez razloga' };
  const gtins = [...new Set([...(parts?.gtins ?? []), ...matched.flatMap((f) => f.gtins)])];
  const lots = parts?.lots ?? [];
  const dates = parts?.dates ?? [];
  const all = `${row.types}\n${name}\n${parts?.text ?? ''}`;
  const details = [row.company, parts?.firstParagraph ?? ''].filter(Boolean).join('. ');
  return {
    notice: {
      id: idOf(PREFIX, row.slug), country: COUNTRY, published: row.day,
      category: /dietary supplements/i.test(row.types) ? 'supplement' : /\binfant|baby food|toddler/i.test(all) ? 'baby' : 'food',
      // "undeclared sildenafil" in a supplement is a drug in it, not an allergen
      hazard: DRUG.test(reason) ? 'chemical' : /allergens/i.test(row.types) && hazardOf(reason) === 'other' ? 'allergen' : hazardOf(reason, parts?.text ?? ''),
      name, reason,
      details: details ? cut(details, 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      action: parts?.action ? cut(parts.action, 500) : undefined,
      source: SOURCE, url: row.url, gtins: gtins.slice(0, 50),
    },
  };
}

/** Reads the Enforcement Report since `since`. Resolves to { notices, seen, skipped }; throws when the answer is not openFDA's. */
async function fetchNotices({ fetchImpl = fetch, since = '2000-01-01', userAgent, now = new Date(), known = new Map() } = {}) {
  const skipped = {};
  const count = (why, n = 1) => { skipped[why] = (skipped[why] ?? 0) + n; };
  let data;
  try {
    data = await getJson(fetchImpl, urlFor(since, now.toISOString().slice(0, 10)), { userAgent });
  } catch (e) {
    if (!/HTTP 404/.test(String(e && e.message))) throw e;
    data = { meta: {}, results: [] };   // openFDA: "No matches found" — no recall reported in the window
  }
  if (!data || !data.meta || !Array.isArray(data.results)) throw new Error('openFDA nije odgovorio listom „results” (format se promijenio?)');
  const events = new Map();
  for (const r of data.results) {
    if (!/^H-/.test(String(r.recall_number ?? ''))) { count('nije hrana za ljude (FDA broj nije H-…)'); continue; }
    if (!r.event_id) { count('bez broja opoziva (event_id)'); continue; }
    if (!events.has(r.event_id)) events.set(r.event_id, []);
    events.get(r.event_id).push(r);
  }
  // the companies' announcements: the list, then the page of each new one in the window
  const food = announcementRows(await getJson(fetchImpl, ANNOUNCEMENTS, { userAgent })).filter(isFood);
  const english = (row) => food.some((o) => o !== row && !isSpanish(o) && sameFirm(o.company, row.company) && daysBetween(o.day, row.day) <= 3);
  const rows = [];
  for (const row of food) {
    if (isSpanish(row) && english(row)) { count('isto saopćenje na španskom'); continue; }
    rows.push(row);
  }
  const inWindow = rows.filter((r) => r.day >= since);
  const reused = new Map();
  const toRead = [];
  for (const row of inWindow) {
    const k = known.get(idOf(PREFIX, row.slug));
    if (k) reused.set(row.slug, k);
    else toRead.push(row);
  }
  const now_ = toRead.slice(0, MAX_PAGES);
  const pages = await mapLimit(now_, 2, async (row) => announcementParts(await getText(fetchImpl, row.url, { userAgent })));
  const parts = new Map();
  now_.forEach((row, i) => {
    if (pages[i].ok && pages[i].value) parts.set(row.slug, pages[i].value);
    else count('stranica saopćenja nije pročitana (objavljeno iz liste)');
  });

  // one recall, one notice: an Enforcement Report recall the company announced is the announcement
  const facts = new Map([...events].map(([event, records]) => [event, eventFacts(records)]));
  const matchedBy = new Map(rows.map((r) => [r.slug, []]));
  const announced = new Set();
  for (const [event, f] of facts) {
    for (const row of rows) {
      if (sameRecall(row, f, parts.get(row.slug)?.gtins ?? reused.get(row.slug)?.gtins ?? [])) { announced.add(event); matchedBy.get(row.slug).push(f); }
    }
  }
  const notices = [];
  for (const [event, records] of events) {
    if (announced.has(event)) { count('isti opoziv kao saopćenje firme'); continue; }
    const out = toNotice(String(event), records);
    if (out.skip) { count(out.skip); continue; }
    if (out.notice.published < since) { count('starije od prozora'); continue; }
    notices.push(out.notice);
  }
  for (const row of inWindow) {
    const k = reused.get(row.slug);
    if (k) {   // read before: as it was, with any barcode a matching report has added since
      const gtins = [...new Set([...(k.gtins ?? []), ...matchedBy.get(row.slug).flatMap((f) => f.gtins)])].slice(0, 50);
      notices.push({ ...k, gtins });
      continue;
    }
    const out = announcementNotice(row, parts.get(row.slug) ?? null, matchedBy.get(row.slug));
    if (out.skip) count(out.skip);
    else notices.push(out.notice);
  }
  for (let i = now_.length; i < toRead.length; i++) count('stranica ostavljena za sljedeće pokretanje');
  if (data.meta.results && data.meta.results.total > data.results.length) count('više od 1000 zapisa u prozoru — najstariji izostavljeni', data.meta.results.total - data.results.length);
  return { notices, seen: data.results.length + rows.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: API, fetchNotices, toNotice, productName, joinedBarcodes, urlFor, eventUrl, ANNOUNCEMENTS, announcementRows, announcementParts, announcementNotice, tableValues, namedMonthDates, sameRecall, eventFacts, firmKey };
