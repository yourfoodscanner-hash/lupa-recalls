'use strict';
/**
 * Germany — lebensmittelwarnung.de, the portal on which the 16 Länder and the BVL publish product
 * warnings and recalls. Read from the portal's own RSS feeds, one per product type (food; cosmetics),
 * and from the page of each notice.
 *
 * Seen on the live data (26 Nov 2026): every feed item carries the notice's fields in its description
 * as "<b>Label:</b> value<br/>" — Produktbezeichnung, Grund der Meldung (the portal's own fixed reasons:
 * "Krankheitserreger", "Fremdkörper", "Allergene" …), Haltbarkeit, Chargennummer / Los-Kennzeichnung,
 * Hersteller / Inverkehrbringer. The page of a notice adds, as <dt>/<dd> pairs, "Weitere Informationen"
 * (what was found), "Empfehlung" (what to do), "Weitere Kennzeichnung" (where the EAN is) and
 * "Datum der Erstveröffentlichung". The notice's day is the feed's: the day the portal last published it
 * (an update of an older notice — "Update zu …" — is news again and is shown as of its update).
 *
 * A page is read only for a notice this job has not read whole before (`known`), or whose feed fields
 * have changed since — a few pages a day, not the whole list. A page that cannot be read leaves the
 * notice with what the feed says, and it is asked again on the next run.
 *
 * Batches and dates are the portal's own fields, published as they are written there. A barcode is
 * taken only where the text names it (lib/text — labeledGtins).
 */
const { rssItems, oneLine, htmlToText, dayIn, idOf, cut, labeledGtins, alignedFold } = require('../lib/text');
const { getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');
const { hostOf } = require('../lib/contract');

const NAME = 'lebensmittelwarnung';
const PREFIX = 'de-lmw-';
const COUNTRY = 'DE';
const SOURCE = 'lebensmittelwarnung.de';
const HOST = 'lebensmittelwarnung.de';
const FEED = 'https://www.lebensmittelwarnung.de/___LMW-Redaktion/RSSNewsfeed/Functions/RssFeeds/rssnewsfeed_Alle_DE.xml?nn=314268';
/** product type of the portal → the feed's "type" and the app's category */
const FEEDS = [['lebensmittel', 'food'], ['kosmetischemittel', 'cosmetic']];
const TIME_ZONE = 'Europe/Berlin';
/** At most this many pages of notices are read in one run; the rest on the next. */
const MAX_PAGES = 60;

/** "<b>Grund der Meldung:</b> Fremdkörper<br/>…" → { 'grund der meldung': 'Fremdkörper', … } (labels folded). */
function feedFields(html) {
  const out = {};
  for (const part of String(html ?? '').split(/<b>/i).slice(1)) {
    const close = part.search(/<\/b>/i);
    if (close < 0) continue;
    const label = alignedFold(oneLine(part.slice(0, close))).replace(/:\s*$/, '').trim();
    const value = oneLine(part.slice(close + 4).replace(/<br\s*\/?>\s*$/i, ''));
    if (label && value && !(label in out)) out[label] = value;
  }
  return out;
}
const field = (fields, start) => { for (const [k, v] of Object.entries(fields)) if (k.startsWith(start)) return v; return null; };

/** The <dt>/<dd> pairs of a notice's page (labels folded), or null when the page is not a notice. */
function pageFields(html) {
  const out = {};
  for (const m of String(html ?? '').matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi)) {
    const label = alignedFold(oneLine(m[1])).replace(/:\s*$/, '').trim();
    const value = htmlToText(m[2]).replace(/\n/g, ' ').trim();
    if (label && value && !(label in out)) out[label] = value;
  }
  return field(out, 'grund der meldung') === null ? null : out;
}

/** "…/261126_28_BY_Maniokmehl/261126_28_BY_Maniokmehl.html" → "de-lmw-261126-28-by-maniokmehl" (the notice's folder). */
function idOfLink(link) {
  const m = /\/Meldungen\/\d{4}\/[^/]+\/([^/]+)\/[^/]+$/.exec(String(link));
  if (!m) return null;
  let folder;
  try { folder = decodeURIComponent(m[1]); } catch { return null; }
  return idOf(PREFIX, folder);
}

/** food → baby food or a supplement, by the words of the product's own name. */
function categoryOf(type, text) {
  if (type !== 'food') return type;
  const f = alignedFold(text);
  if (/sauglingsnahrung|sauglingsanfangsnahrung|anfangsnahrung|folgenahrung|babynahrung|babybrei|kleinkindnahrung|kindernahrung|beikost|fur sauglinge|ab dem \d+\. monat|nach dem \d+\. monat/.test(f)) return 'baby';
  if (/nahrungserganzungsmittel/.test(f)) return 'supplement';
  return 'food';
}

/** "… der Marke „Bigi-mama“, 900 Gramm" → "Bigi-mama" — only a brand the text names in quotes or after "Marke:". */
function brandOf(text) {
  const s = String(text ?? '');
  const m = /\bMarke\s*[„"“»‚']([^“”"«‘’]{2,40})[“”"«‘’]/.exec(s) || /\bMarke:\s*([^,;()]{2,40}?)(?:[,;()]|$)/.exec(s);
  return m ? m[1].trim() : undefined;
}

/** One feed item → the notice as the feed alone gives it (unchecked), or { skip }. */
function fromFeed(item, category) {
  const id = idOfLink(item.link);
  if (!id || hostOf(item.link) !== HOST) return { skip: 'link nije obavijest na lebensmittelwarnung.de' };
  const day = dayIn(item.pubDate, TIME_ZONE);
  if (!day) return { skip: 'bez datuma' };
  const f = feedFields(item.description);
  const reason = field(f, 'grund der meldung');
  if (!reason) return { skip: 'bez razloga' };
  const name = cut(item.title, 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const product = field(f, 'produktbezeichnung') ?? '';
  const lots = field(f, 'chargennummer');
  const bestBefore = field(f, 'haltbarkeit');
  return {
    notice: {
      id, country: COUNTRY, published: day, category: categoryOf(category, `${item.title} ${product} ${decodeURIComponent(item.link.split('/').slice(-2, -1)[0] || '')}`), hazard: hazardOf(reason),
      name, brand: brandOf(product), reason: cut(reason, 160),
      lots: lots ? cut(lots, 300) : undefined, bestBefore: bestBefore ? cut(bestBefore, 120) : undefined,
      source: SOURCE, url: item.link, gtins: labeledGtins(`${product}\n${lots ?? ''}`),
    },
  };
}

/** The feed's notice completed with its page. */
function withPage(notice, page) {
  const more = field(page, 'weitere informationen');
  const action = field(page, 'empfehlung');
  const marks = field(page, 'weitere kennzeichnung') ?? '';
  const gtins = [...notice.gtins];
  for (const g of labeledGtins(`${marks}\n${field(page, 'produktbezeichnung') ?? ''}`)) if (!gtins.includes(g)) gtins.push(g);
  return {
    ...notice,
    hazard: hazardOf(notice.reason, more),
    brand: notice.brand ?? brandOf(field(page, 'produktbezeichnung')),
    details: more ? cut(more, 800) : undefined,
    action: action ? cut(action, 500) : undefined,
    gtins: gtins.slice(0, 50),
  };
}

const same = (a, b) => (a ?? null) === (b ?? null);

/**
 * Reads the portal. Resolves to { notices, seen, skipped }. Throws when a feed cannot be read or is
 * not the portal's feed as described above (then the build keeps this source's previous notices).
 */
async function fetchNotices({ fetchImpl = fetch, url = FEED, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const byId = new Map();
  let seen = 0;
  for (const [type, category] of FEEDS) {
    const items = rssItems(await getText(fetchImpl, `${url}&type=${type}`, { userAgent }));
    seen += items.length;
    if (items.length > 0 && !items.some((it) => /<b>\s*Grund der Meldung/i.test(it.description))) {
      throw new Error(`stavke feeda „${type}” nisu u obliku koji adapter poznaje (nema polja „Grund der Meldung”)`);
    }
    for (const item of items) {
      const out = fromFeed(item, category);
      if (out.skip) { count(out.skip); continue; }
      if (out.notice.published < since) { count('starije od prozora'); continue; }
      if (byId.has(out.notice.id)) { count('ista obavijest u dva feeda'); continue; }
      byId.set(out.notice.id, out.notice);
    }
  }
  // a page is read for what is new or has changed; a notice read whole before is kept as it was
  const toRead = [];
  const notices = [];
  for (const n of byId.values()) {
    const k = known.get(n.id);
    if (k && k.details && same(k.name, n.name) && same(k.lots, n.lots) && same(k.bestBefore, n.bestBefore) && same(k.reason, n.reason)) notices.push(k);
    else toRead.push(n);
  }
  const now = toRead.slice(0, MAX_PAGES);
  const pages = await mapLimit(now, 2, async (n) => {
    const page = pageFields(await getText(fetchImpl, n.url, { userAgent }));
    if (page === null) throw new Error('stranica nije obavijest');
    return page;
  });
  now.forEach((n, i) => {
    if (pages[i].ok) notices.push(withPage(n, pages[i].value));
    else { count('stranica obavijesti nije pročitana (objavljeno iz feeda)'); notices.push(n); }
  });
  for (const n of toRead.slice(MAX_PAGES)) { count('stranica ostavljena za sljedeće pokretanje'); notices.push(n); }
  return { notices, seen, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: FEED, fetchNotices, feedFields, pageFields, idOfLink, categoryOf, brandOf, MAX_PAGES };
