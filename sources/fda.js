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
 */
const { idOf, cut, labeledGtins, labeledLots, labeledDates } = require('../lib/text');
const { getJson } = require('../lib/http');
const { hazardOf } = require('../lib/classify');

const NAME = 'fda';
const PREFIX = 'us-fda-';
const COUNTRY = 'US';
const SOURCE = 'U.S. Food and Drug Administration (FDA)';
const API = 'https://api.fda.gov/food/enforcement.json';
const LIMIT = 1000;

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

/** Reads the Enforcement Report since `since`. Resolves to { notices, seen, skipped }; throws when the answer is not openFDA's. */
async function fetchNotices({ fetchImpl = fetch, since = '2000-01-01', userAgent, now = new Date() } = {}) {
  const skipped = {};
  const count = (why, n = 1) => { skipped[why] = (skipped[why] ?? 0) + n; };
  let data;
  try {
    data = await getJson(fetchImpl, urlFor(since, now.toISOString().slice(0, 10)), { userAgent });
  } catch (e) {
    if (/HTTP 404/.test(String(e && e.message))) return { notices: [], seen: 0, skipped };   // openFDA: "No matches found"
    throw e;
  }
  if (!data || !data.meta || !Array.isArray(data.results)) throw new Error('openFDA nije odgovorio listom „results” (format se promijenio?)');
  const events = new Map();
  for (const r of data.results) {
    if (!/^H-/.test(String(r.recall_number ?? ''))) { count('nije hrana za ljude (FDA broj nije H-…)'); continue; }
    if (!r.event_id) { count('bez broja opoziva (event_id)'); continue; }
    if (!events.has(r.event_id)) events.set(r.event_id, []);
    events.get(r.event_id).push(r);
  }
  const notices = [];
  for (const [event, records] of events) {
    const out = toNotice(String(event), records);
    if (out.skip) { count(out.skip); continue; }
    if (out.notice.published < since) { count('starije od prozora'); continue; }
    notices.push(out.notice);
  }
  if (data.meta.results && data.meta.results.total > data.results.length) count('više od 1000 zapisa u prozoru — najstariji izostavljeni', data.meta.results.total - data.results.length);
  return { notices, seen: data.results.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: API, fetchNotices, toNotice, productName, joinedBarcodes, urlFor, eventUrl };
