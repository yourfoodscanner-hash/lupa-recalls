'use strict';
/**
 * United Kingdom — Food Standards Agency, food alerts: allergy alerts (AA), product recall information
 * notices (PRIN) and food alerts for action (FAFA), through the FSA's own open API:
 * https://data.food.gov.uk/food-alerts/id (JSON with "Accept: application/json"; "_view=full" gives each
 * alert whole).
 *
 * Seen on the live data (27 Nov 2026): an alert has "notation" (FSA-AA-43-2026, FSA-PRIN-48-2026,
 * FSA-AA-45-2026-update-1), "created" (2026-10-02), "title" ("Unilever recalls Pot Noodle Piri Piri
 * Chicken Flavour because of undeclared milk"), "productDetails" (each product: "productName",
 * "packSizeDescription", "productCode", "batchDescription" with "batchCode", "bestBeforeDescription",
 * "useByDescription"), "problem" (each with "riskStatement", allergens), "consumerAdvice" and "alertURL"
 * (the alert's page on food.gov.uk). Every value comes from its own field, so batches and dates are what
 * those fields say; a product code is a barcode only when it is a valid GTIN that no shop gives out itself.
 */
const { idOf, cut, firstSentence } = require('../lib/text');
const { getJson } = require('../lib/http');
const { hazardOf } = require('../lib/classify');
const { isValidGtin, isShopNumber } = require('../lib/gtin');

const NAME = 'fsa';
const PREFIX = 'gb-fsa-';
const COUNTRY = 'GB';
const SOURCE = 'Food Standards Agency (FSA)';
const API = 'https://data.food.gov.uk/food-alerts/id';
const PAGE = 100;
const MAX_PAGES = 4;

const text = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');
const list = (v) => (Array.isArray(v) ? v : v && typeof v === 'object' ? [v] : []);
const unique = (xs) => [...new Set(xs.filter(Boolean))];
const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** The alert's kind from its types: "AA", "PRIN", "FAFA" (or null). */
function kindOf(item) {
  const types = list(item.type).map((t) => String(t && typeof t === 'object' ? t['@id'] : t));
  for (const k of ['AA', 'PRIN', 'FAFA']) if (types.some((t) => t.endsWith(`/${k}`))) return k;
  return null;
}

/** "… because of undeclared milk" / "… due to the presence of Salmonella" → "Undeclared milk" / "Presence of Salmonella". */
function reasonOf(item) {
  const title = text(item.title).replace(/\s*\(update \d+\)\s*$/i, '');
  const m = /\b(?:because of|due to|as it contains|as they contain)\s+(?:the\s+|a\s+|an\s+)?(.+)$/i.exec(title);
  if (m) return capital(m[1].replace(/\.$/, ''));
  const risk = list(item.problem).map((p) => text(p.riskStatement)).find(Boolean);
  return risk ? firstSentence(risk, 160) : null;
}

/** One alert → a notice (unchecked), or { skip }. */
function toNotice(item) {
  const notation = text(item.notation);
  if (!/^FSA-[A-Z]+-\d+-\d{4}/i.test(notation)) return { skip: 'bez oznake upozorenja' };
  const published = /^\d{4}-\d{2}-\d{2}/.test(text(item.created)) ? text(item.created).slice(0, 10) : null;
  if (!published) return { skip: 'bez datuma' };
  const status = text(item.status && typeof item.status === 'object' ? item.status.label : item.status);
  if (status && !/^published$/i.test(status)) return { skip: 'upozorenje nije objavljeno (povučeno)' };
  const kind = kindOf(item);
  const products = list(item.productDetails);
  const names = unique(products.map((p) => text(p.productName)));
  const name = cut(names.join(', ') || text(item.shortTitle), 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const reason = cut(reasonOf(item) ?? '', 160);
  if (!reason) return { skip: 'bez razloga' };
  const batches = products.flatMap((p) => list(p.batchDescription));
  // "All batches", "All best before dates": no batch, no date
  const lots = unique(batches.map((b) => text(b.batchCode))).filter((l) => /\d/.test(l));
  const dates = unique(batches.flatMap((b) => [text(b.bestBeforeDescription), text(b.useByDescription), text(b.bestBeforeDate), text(b.useByDate)])).filter((d) => /\d/.test(d));
  const gtins = unique(products.map((p) => text(p.productCode).replace(/\s+/g, ''))).filter((c) => /^\d{8,14}$/.test(c) && isValidGtin(c) && !isShopNumber(c));
  const risks = unique(list(item.problem).map((p) => text(p.riskStatement)));
  const sizes = products.map((p) => [text(p.productName), text(p.packSizeDescription)].filter(Boolean).join(' ')).filter(Boolean);
  const business = text(item.reportingBusiness && item.reportingBusiness.commonName);
  const details = [business, unique(sizes).join('; '), risks[0] ?? ''].filter(Boolean).map((t) => t.replace(/[.\s]+$/, '')).join('. ');
  const url = text(item.alertURL && typeof item.alertURL === 'object' ? item.alertURL['@id'] : item.alertURL);
  const names_ = names.join(' ').toLowerCase();
  return {
    notice: {
      id: idOf(PREFIX, notation.toLowerCase().replace(/^fsa-/, '')), country: COUNTRY, published,
      category: /\binfant|\bbaby\b|follow-on formula/.test(names_) ? 'baby' : /supplement/.test(names_) ? 'supplement' : 'food',
      hazard: kind === 'AA' ? 'allergen' : hazardOf(reason, risks.join('\n')),
      name, reason,
      details: details ? cut(details, 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join('; '), 120) : undefined,
      action: text(item.consumerAdvice) ? cut(text(item.consumerAdvice), 500) : undefined,
      source: SOURCE, url, gtins: gtins.slice(0, 50),
    },
  };
}

/** Reads the alerts created since `since`. Resolves to { notices, seen, skipped }; throws when the answer is not the FSA's. */
async function fetchNotices({ fetchImpl = fetch, since = '2000-01-01', userAgent } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const items = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const url = `${API}?since=${since}T00:00:00Z&_limit=${PAGE}&_view=full${page ? `&_offset=${page * PAGE}` : ''}`;
    const data = await getJson(fetchImpl, url, { userAgent });
    if (!data || !Array.isArray(data.items)) throw new Error('FSA API nije odgovorio listom „items” (format se promijenio?)');
    items.push(...data.items);
    if (data.items.length < PAGE) break;
  }
  const notices = [];
  for (const item of items) {
    const out = toNotice(item);
    if (out.skip) { count(out.skip); continue; }
    if (out.notice.published < since) { count('starije od prozora'); continue; }
    if (!/^https:\/\//.test(out.notice.url)) { count('bez linka na stranicu upozorenja'); continue; }
    if (notices.some((n) => n.id === out.notice.id)) continue;
    notices.push(out.notice);
  }
  if (items.length > 0 && notices.length === 0 && Object.keys(skipped).every((k) => k !== 'starije od prozora')) {
    throw new Error(`nijedno FSA upozorenje nije u očekivanom obliku (${JSON.stringify(skipped)}) — format se promijenio?`);
  }
  return { notices, seen: items.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: API, fetchNotices, toNotice, reasonOf, kindOf };
