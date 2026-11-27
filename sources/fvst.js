'use strict';
/**
 * Denmark — Fødevarestyrelsen (the Danish food authority), "Tilbagekaldte produkter": every recall of
 * food that has reached consumers in Denmark. Read from the authority's own RSS feed of that list and
 * from the page of each notice.
 *
 * Seen on the live data (27 Nov 2026, 526 items back to 2021): a feed item has the notice's title,
 * link and day, and a one-sentence summary; nothing else. The page of a notice is always the same
 * form: a category label ("Tilbagekaldte fødevarer"), a lead, and sections under fixed headings —
 * "Hvilken fødevare tilbagekaldes" (the product, then "Nettoindhold:", "Bedst før …", "EAN: …"),
 * "Hvor er produktet solgt", "Hvorfor tilbagekaldes produktet", "Hvad skal du gøre som forbruger",
 * "Hvem tilbagekalder produktet" (singular or plural: "produkterne", "fødevarer").
 *
 * A page is read only for a notice not read before (`known`) — a few pages a day. A notice whose page
 * cannot be read is left for the next run (the feed alone does not say what the product is).
 *
 * Batches, dates and barcodes: only where the product section labels them (lib/text).
 */
const { rssItems, htmlToText, oneLine, dayIn, idOf, cut, labeledGtins, labeledLots, labeledDates, firstSentence, alignedFold } = require('../lib/text');
const { getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');
const { hostOf } = require('../lib/contract');

const NAME = 'fvst';
const PREFIX = 'dk-fvst-';
const COUNTRY = 'DK';
const SOURCE = 'Fødevarestyrelsen';
const HOST = 'foedevarestyrelsen.dk';
const FEED = 'https://foedevarestyrelsen.dk/handlers/DynamicRss.ashx?id=8c2cdc12-6a58-43d1-8b4e-97aa96dedd0c';
const LIST_PATH = '/nyheder/tilbagekaldte-produkter/';
const TIME_ZONE = 'Europe/Copenhagen';
const MAX_PAGES = 60;

/** ".../nyheder/tilbagekaldte-produkter/2026/nov/tilbagekald-af-oksekebab" → "dk-fvst-2026-nov-tilbagekald-af-oksekebab". */
function idOfLink(link) {
  if (hostOf(link) !== HOST) return null;
  const at = String(link).indexOf(LIST_PATH);
  if (at < 0) return null;
  const rest = String(link).slice(at + LIST_PATH.length).replace(/[?#].*$/, '').replace(/\/+$/, '');
  if (!/^\d{4}\/[a-z]+\/[^/]+$/i.test(rest)) return null;
  return idOf(PREFIX, rest);
}

/** The page's sections: heading (folded) → plain text; plus the category label and the lead. null when it is not a notice. */
function pageParts(html) {
  const page = String(html ?? '');
  const label = oneLine((/<div class="labels">([\s\S]*?)<\/div>/i.exec(page) ?? [])[1] ?? '');
  const lead = oneLine((/<p class="lead">([\s\S]*?)<\/p>/i.exec(page) ?? [])[1] ?? '');
  const rich = (/<div class="rich-text">([\s\S]*?)<\/div>\s*<\/div>/i.exec(page) ?? [])[1] ?? '';
  const sections = {};
  const parts = rich.split(/<h2\b[^>]*>/i).slice(1);
  for (const part of parts) {
    const close = part.search(/<\/h2>/i);
    if (close < 0) continue;
    const heading = alignedFold(oneLine(part.slice(0, close)));
    const body = htmlToText(part.slice(close + 5));
    if (heading && !(heading in sections)) sections[heading] = body;
  }
  const section = (start) => { for (const [k, v] of Object.entries(sections)) if (k.startsWith(start)) return v; return null; };
  const why = section('hvorfor');
  if (why === null) return null;
  return { label, lead, product: section('hvilk') ?? '', why, action: section('hvad skal'), who: section('hvem') };
}

/** Lines of the product section that name a value ("Nettoindhold: 400 g", "Bedst før 7/4-2028") rather than a product. */
const VALUE_LINE = /^(?:nettoindhold|netto|vægt|vaegt|bedst f|sidste anvendelses|anvendes senest|holdbar|mindst holdbar|ean|stregkode|lot|batch|parti|emballage|pakning|oprindelse|producent|varenummer|varenr|solgt|størrelse|storrelse|indhold)|:/;
/** The product named in the product section, when it names exactly one; null otherwise. */
function singleProduct(product) {
  const lines = String(product ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
  const names = lines.filter((l) => !VALUE_LINE.test(alignedFold(l)));
  return names.length === 1 && names[0].length >= 2 && names[0].length <= 160 ? names[0] : null;
}

/** "Tilbagekald af oksekebab" → "Oksekebab"; "Tilbagekald - Risiko for … i X" → "Risiko for … i X". */
function titleName(title) {
  const t = String(title ?? '').replace(/^\s*tilbagekald(?:else)?(?:\s+af\s+|\s*[-–:]\s*)/i, '').trim();
  return t ? t[0].toUpperCase() + t.slice(1) : '';
}

/** What LUPA shows: food (by the page's category label), and within it baby food and supplements by the notice's own words. */
function categoryOf(label, text) {
  const l = alignedFold(label ?? '');
  if (/foder|kontaktmateriale|emballage|legetoj|kosmetik/.test(l)) return null;
  const f = alignedFold(text ?? '');
  if (/modermælkserstatning|modermaelkserstatning|tilskudsblanding|babymad|babygrod|grod til born|til spædborn|til spaedborn|spædbornsmad|spaedbornsmad|fra \d+ maneder/.test(f)) return 'baby';
  if (/kosttilskud/.test(f)) return 'supplement';
  return 'food';
}

/** The notice from its feed item and its page (unchecked: lib/contract checks it), or { skip }. */
function toNotice(item, parts, day) {
  const category = categoryOf(parts.label, `${item.title}\n${parts.product}\n${parts.lead}`);
  if (category === null) return { skip: 'kategorija koju LUPA ne prikazuje' };
  const single = singleProduct(parts.product);
  const name = cut(single ?? titleName(item.title), 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const reason = firstSentence(parts.why, 160);
  if (!reason) return { skip: 'bez razloga' };
  const whyText = parts.why.replace(/\n/g, ' ').trim();
  const products = single === null && parts.product.trim() ? parts.product.replace(/:\s*\n+/g, ': ').replace(/\n+/g, '; ').trim() : null;
  const details = products ?? (whyText.replace(/\.$/, '') !== reason.replace(/…$/, '') ? whyText : null);
  const lots = labeledLots(parts.product);
  const dates = labeledDates(parts.product);
  return {
    notice: {
      id: idOfLink(item.link), country: COUNTRY, published: day, category, hazard: hazardOf(reason, parts.why, parts.lead),
      name, reason,
      details: details ? cut(details, 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      action: parts.action ? cut(parts.action.replace(/\n/g, ' '), 500) : undefined,
      source: SOURCE, url: item.link, gtins: labeledGtins(parts.product).slice(0, 50),
    },
  };
}

/**
 * Reads the list. Resolves to { notices, seen, skipped }. Throws when the feed cannot be read or is not
 * the list as described above, or when no page read is a notice in the form described above.
 */
async function fetchNotices({ fetchImpl = fetch, url = FEED, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const items = rssItems(await getText(fetchImpl, url, { userAgent }));
  if (items.length > 0 && !items.some((it) => idOfLink(it.link))) throw new Error('nijedna stavka feeda ne vodi na obavijest o povlačenju (format se promijenio?)');
  const wanted = [];
  const ids = new Set();
  for (const item of items) {
    const id = idOfLink(item.link);
    if (!id) { count('stavka nije obavijest o povlačenju'); continue; }
    const day = dayIn(item.pubDate, TIME_ZONE);
    if (!day) { count('bez datuma'); continue; }
    if (day < since) { count('starije od prozora'); continue; }
    if (ids.has(id)) { count('ista obavijest dvaput'); continue; }
    ids.add(id);
    wanted.push({ item, id, day });
  }
  const notices = [];
  const toRead = [];
  for (const w of wanted) {
    const k = known.get(w.id);
    if (k && k.published === w.day) notices.push(k);
    else toRead.push(w);
  }
  const now = toRead.slice(0, MAX_PAGES);
  const pages = await mapLimit(now, 2, async (w) => pageParts(await getText(fetchImpl, w.item.link, { userAgent })));
  let notNotice = 0;
  let read = 0;
  now.forEach((w, i) => {
    if (!pages[i].ok) { count('stranica obavijesti nije pročitana (pokušava se sljedeći put)'); return; }
    if (pages[i].value === null) { notNotice += 1; count('stranica nije u obliku obavijesti'); return; }
    read += 1;
    const out = toNotice(w.item, pages[i].value, w.day);
    if (out.skip) count(out.skip);
    else notices.push(out.notice);
  });
  if (notNotice > 0 && read === 0) throw new Error(`nijedna pročitana stranica nije u obliku obavijesti (${notNotice}) — format se promijenio?`);
  for (let i = MAX_PAGES; i < toRead.length; i++) count('stranica ostavljena za sljedeće pokretanje');
  return { notices, seen: items.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: FEED, fetchNotices, pageParts, idOfLink, singleProduct, titleName, categoryOf, toNotice, MAX_PAGES };
