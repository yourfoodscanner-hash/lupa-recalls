'use strict';
/**
 * Austria — the product warnings and recalls the Austrian Agency for Health and Food Safety (AGES)
 * publishes on behalf of the ministry. Read from the list on ages.at: one category at a time (food,
 * food for children, food supplements, cosmetics — through the links the list itself gives, with the
 * site's own "cHash"), page by page as far back as the window reaches (ten notices a page). The
 * unfiltered list is not paged through: seen live, its "next page" links lead into one category only.
 *
 * Seen on the live data (26 Nov 2026): every notice of the list is a <section class="product-item">
 * with its name (<h2>), its kind ("Lebensmittel-Rückruf", "Kosmetik-Rückruf", "Spielzeug &
 * Kinderbedarf-Warnung" …), its day (<time datetime="21.11.2026">) and labeled rows — "Rückrufgrund",
 * "Chargennummer", "Ablaufdatum", "In Verkehr gebracht von", "Hersteller" — and a link to its page.
 * The list's own fields are published as they are; nothing is taken from free text. A batch row that
 * holds a barcode ("Barcode: 4061459455298", seen live) gives a barcode, not a batch.
 *
 * Taken: food, food for children, food supplements, cosmetics.
 */
const { htmlToText, oneLine, dayOfDotted, idOf, cut, alignedFold, decodeEntities, labeledGtins } = require('../lib/text');
const { getText } = require('../lib/http');
const { hazardOf } = require('../lib/classify');
const { hostOf } = require('../lib/contract');

const NAME = 'ages';
const PREFIX = 'at-ages-';
const COUNTRY = 'AT';
const SOURCE = 'AGES';
const HOST = 'ages.at';
const LIST = 'https://www.ages.at/mensch/produktwarnungen-produktrueckrufe';
const MAX_LIST_PAGES = 10;

/** The kind written on the notice ("Lebensmittel-Rückruf") → the app's category, or null for what LUPA does not show. */
function categoryOf(kind) {
  const k = alignedFold(kind).replace(/-(?:ruckruf|warnung|information|info)$/, '').trim();
  if (k === 'lebensmittel') return 'food';
  if (k === 'kindernahrung' || k === 'sauglingsnahrung' || k === 'babynahrung') return 'baby';
  if (k === 'nahrungserganzungsmittel') return 'supplement';
  if (k === 'kosmetik' || k === 'kosmetische mittel') return 'cosmetic';
  return null;
}

/** The notices of one page of the list: [{ name, kind, day, rows, href }]. Throws when the page is not the list. */
function listItems(html) {
  const parts = String(html ?? '').split(/<section class="product-item">/).slice(1);
  return parts.map((part) => {
    const section = part.split(/<\/section>/)[0];
    const header = /<h2[^>]*>([\s\S]*?)<\/h2>\s*<p>\s*<span>([\s\S]*?)<\/span>\s*<span>\s*<time datetime="([^"]+)"/.exec(section);
    const rows = {};
    for (const m of section.matchAll(/product-info-row-left">([\s\S]*?)<\/div>\s*<div class="product-info-row-right">([\s\S]*?)<\/div>/g)) {
      rows[alignedFold(oneLine(m[1]))] = htmlToText(m[2]).replace(/\n/g, ' ').trim();
    }
    const href = /<a href="(\/mensch\/produktwarnungen-produktrueckrufe\/produkt\/[^"#?]+)"/.exec(section);
    return { name: header ? oneLine(header[1]) : '', kind: header ? oneLine(header[2]) : '', day: header ? dayOfDotted(header[3]) : null, rows, href: href ? decodeEntities(href[1]) : null };
  });
}

/** The address of page `n` of category `cat`, as the page itself links it (the site needs its own "cHash"). */
function pageLink(html, n, cat) {
  for (const m of String(html ?? '').matchAll(/href="([^"]*tx_agesrecall_pi1%5Bcat%5D=(\d*)[^"]*tx_agesrecall_pi1%5Bpage%5D=(\d+)[^"]*)"/g)) {
    if (m[2] === String(cat) && Number(m[3]) === n) return new URL(decodeEntities(m[1]), LIST).href;
  }
  return null;
}

/** The list's own links to the categories LUPA shows: [{ cat: '8', label: 'Lebensmittel', url }]. */
function categoryLinks(html) {
  const out = [];
  for (const m of String(html ?? '').matchAll(/<a\b[^>]*href="([^"]*tx_agesrecall_pi1%5Bcat%5D=(\d+)&(?:amp;)?cHash=[0-9a-f]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const label = oneLine(m[3]);
    if (categoryOf(label) !== null && !out.some((c) => c.cat === m[2])) out.push({ cat: m[2], label, url: new URL(decodeEntities(m[1]), LIST).href });
  }
  return out;
}

function toNotice(item) {
  if (!item.href || !item.day) return { skip: 'bez linka ili datuma' };
  const category = categoryOf(item.kind);
  if (category === null) return { skip: 'kategorija koju LUPA ne prikazuje' };
  const slug = item.href.replace(/^.*\/produkt\//, '');
  const id = idOf(PREFIX, slug);
  const url = new URL(item.href, LIST).href;
  if (!id || hostOf(url) !== HOST) return { skip: 'bez oznake obavijesti' };
  const reason = item.rows.ruckrufgrund;
  if (!reason) return { skip: 'bez razloga' };
  const name = cut(item.name, 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  // the batch row sometimes holds a barcode instead ("Barcode: 4061459455298"): it is published as one, not as a batch
  const gtins = labeledGtins(`${item.rows.chargennummer ?? ''}\n${item.rows.ean ?? ''}\n${item.rows.barcode ?? ''}`);
  const batch = item.rows.chargennummer;
  const lots = batch && /\d/.test(batch.replace(/(?:barcode|ean|gtin)[\s:]*\d{8,14}/gi, '')) ? batch : undefined;
  const bestBefore = item.rows.ablaufdatum;
  const by = [item.rows['in verkehr gebracht von'] && `In Verkehr gebracht von: ${item.rows['in verkehr gebracht von']}`, item.rows.hersteller && `Hersteller: ${item.rows.hersteller}`].filter(Boolean).join('. ');
  return {
    notice: {
      id, country: COUNTRY, published: item.day, category, hazard: hazardOf(reason),
      name, reason: cut(reason, 160), details: by ? cut(by, 800) : undefined,
      lots: lots ? cut(lots, 300) : undefined, bestBefore: bestBefore ? cut(bestBefore, 120) : undefined,
      source: SOURCE, url, gtins,
    },
  };
}

/**
 * Reads the list: its first page for the links to the categories LUPA shows, then each of those
 * categories page by page as far back as `since`. Resolves to { notices, seen, skipped }; throws when
 * the list or a category cannot be read, or is not the list as described above.
 */
async function fetchNotices({ fetchImpl = fetch, url = LIST, since = '2000-01-01', userAgent } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const byId = new Map();
  let seen = 0;
  const first = await getText(fetchImpl, url, { userAgent });
  const firstItems = listItems(first);
  if (firstItems.length === 0) throw new Error('stranica nije lista obavijesti (nema nijedne „product-item”)');
  if (!firstItems.some((it) => it.day && it.rows.ruckrufgrund !== undefined)) throw new Error('obavijesti na listi nisu u obliku koji adapter poznaje (nema datuma ili polja „Rückrufgrund”)');
  const categories = categoryLinks(first);
  if (!categories.some((c) => categoryOf(c.label) === 'food')) throw new Error(`lista nema link na kategoriju „Lebensmittel” (nađene: ${categories.map((c) => c.label).join(', ') || 'nijedna'})`);
  for (const { cat, url: start } of categories) {
    let address = start;
    for (let n = 1; n <= MAX_LIST_PAGES && address; n++) {
      const html = await getText(fetchImpl, address, { userAgent });
      const items = listItems(html);
      seen += items.length;
      for (const item of items) {
        const out = toNotice(item);
        if (out.skip) { count(out.skip); continue; }
        if (out.notice.published < since) { count('starije od prozora'); continue; }
        if (!byId.has(out.notice.id)) byId.set(out.notice.id, out.notice);
      }
      const days = items.map((it) => it.day).filter(Boolean).sort();
      if (days.length === 0 || days[0] < since) break;
      address = pageLink(html, n + 1, cat);
    }
  }
  return { notices: [...byId.values()], seen, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: LIST, fetchNotices, listItems, pageLink, categoryLinks, categoryOf, toNotice };
