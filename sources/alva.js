'use strict';
/**
 * Luxembourg — Administration luxembourgeoise vétérinaire et alimentaire (ALVA), "Alertes
 * alimentaires" on securite-alimentaire.public.lu: the recalls and warnings that concern Luxembourg.
 *
 * Seen on the live data (27 Nov 2026): the list's own RSS feed (…/fr/actualites/alertes.rss), the last
 * 50 alerts, each a title ("Rappel : Yerba Mate de la marque Sabrosa", "Avertissement allergène : …",
 * "Mise à jour - Rappel : …"), the alert's page (…/alertes/2026/11/….html; allergy warnings under
 * …/Avertissementsallergenes/…, pet food under …/rappels-aliments-pour-animaux/… — left out) and the day
 * it was last changed. The page: the day it
 * was created (<time datetime="2026-11-19">), the reason as its subtitle ("Teneur trop élevée en
 * anthraquinone (résidu de pesticide)") and a table per product — "Nom", "Marque", "Unité", "Code barre",
 * "Date limite de consommation (DLC)" / "Date de durabilité minimale (DDM)", "Lot", "Période de vente".
 * Utensils are on the same list ("Migration d'amines aromatiques primaires" from a nylon spatula) and
 * are left out. A page is read once (`known` after that).
 */
const { htmlToText, oneLine, rssItems, dayIn, idOf, cut, alignedFold } = require('../lib/text');
const { getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');
const { isValidGtin, isShopNumber } = require('../lib/gtin');

const NAME = 'alva';
const PREFIX = 'lu-alva-';
const COUNTRY = 'LU';
const SOURCE = 'Administration luxembourgeoise vétérinaire et alimentaire (ALVA)';
const FEED = 'https://securite-alimentaire.public.lu/fr/actualites/alertes.rss';
const ALERTS = /^https:\/\/securite-alimentaire\.public\.lu\/fr\/actualites\/(?:alertes|Avertissementsallergenes)\/(\d{4}\/\d{2}\/[a-z0-9-]+)\.html$/;
const MAX_PAGES = 40;

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const unique = (xs) => [...new Set(xs.filter(Boolean))];
const keyOf = (label) => alignedFold(String(label)).replace(/\([^)]*\)/g, ' ').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

/** An alert's page → { title, day, reason, products: [{ key: value }], paragraphs } or null when it is not an alert. */
function pageParts(html) {
  const page = String(html ?? '').replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '');
  const title = oneLine((/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(page) ?? [])[1] ?? '');
  const day = (/<time datetime="(\d{4}-\d{2}-\d{2})"/.exec(page) ?? [])[1] ?? null;
  if (!title || !day || !/class="page-content-metas"/.test(page)) return null;
  const subtitle = oneLine((/<p class="page-subtitle">([\s\S]*?)<\/p>/.exec(page) ?? [])[1] ?? '');
  const motif = oneLine((/<strong>\s*Motif\s*<\/strong>\s*:?\s*([\s\S]*?)<\/p>/.exec(page) ?? [])[1] ?? '').replace(/^:\s*/, '');
  // the alert itself: the wide column, not the box beside it
  const start = page.search(/section-type--8-4/);
  const end = page.indexOf('<aside', start);
  const main = start >= 0 ? page.slice(start, end > start ? end : undefined) : page;
  const products = [];
  for (const table of main.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/g)) {
    const fields = {};
    for (const row of table[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)) {
      const cells = [...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((c) => c[1]);
      if (cells.length >= 2) fields[keyOf(oneLine(cells[0]))] = htmlToText(cells[1]).replace(/\n/g, ' ; ').replace(/\s+/g, ' ').trim();
    }
    if (Object.keys(fields).length) products.push(fields);
  }
  const paragraphs = [...main.matchAll(/<div[^>]*class="cmp-text[^"]*"[^>]*>([\s\S]*?)<\/div>/g)]
    .map((d) => oneLine(d[1]).replace(/\s+([,.;:])/g, '$1')).filter((p) => p.length > 20 && !/^Motif\b/.test(p));
  return { title, day, reason: subtitle || motif, products, paragraphs };
}

/** "Rappel : Yerba Mate de la marque Sabrosa" → "Yerba Mate". */
function nameOfTitle(title) {
  const t = String(title).replace(/^(?:Mise à jour\s*-\s*)?[^:]{3,40}:\s*/i, '');
  return t.replace(/\s+de la marque\s+.+$/i, '').trim();
}

const field = (product, test) => { for (const [k, v] of Object.entries(product)) if (test.test(k) && v) return v; return undefined; };

/** One feed item and its page → a notice (unchecked), or { skip }. */
function toNotice(item, parts) {
  const reason = cut(capital(parts.reason || ''), 160);
  if (!reason) return { skip: 'bez razloga' };
  if (/^migration\b/.test(alignedFold(reason))) return { skip: 'materijal u dodiru s hranom (posuđe)' };
  const names = unique(parts.products.map((p) => (field(p, /^nom$|^denomination|^produit$/) ?? '').replace(/\s*\*+$/, '')));
  const name = cut(names.join(', ') || nameOfTitle(parts.title), 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const brands = unique(parts.products.map((p) => field(p, /^marque/)));
  const lots = unique(parts.products.map((p) => field(p, /^(?:numeros? de )?lots?$|^lot/))).filter((v) => /\d/.test(v));
  const dates = unique(parts.products.map((p) => field(p, /^date limite|^date de durabilite|^dlc|^ddm|^a consommer/))).filter((v) => /\d/.test(v)).map((v) => v.replace(/\*+/g, '').trim());
  // the barcode cell is labeled: every valid number in it is a barcode
  const gtins = unique(parts.products.flatMap((p) => (field(p, /^code(?:s)? ?(?:barre|barres|ean)|^ean|^gtin/) ?? '').match(/\d{8,14}/g) ?? []))
    .filter((g) => isValidGtin(g) && !isShopNumber(g));
  const sales = unique(parts.products.map((p) => field(p, /^periode de vente/)));
  const text = parts.paragraphs.join('\n');
  const sentences = text.split(/\n|(?<=[.!?])\s+/);
  const action = sentences.find((s) => /ne (?:pas )?(?:le |la |les )?consommer|pas consommer|rapporter|retourner|ramener/i.test(s));
  const details = [sales.length ? `Période de vente : ${sales.join(' ; ')}` : '', parts.paragraphs[0] ?? ''].filter(Boolean).join('. ');
  const all = `${parts.title}\n${name}\n${text}`;
  return {
    notice: {
      id: idOf(PREFIX, ALERTS.exec(item.link)[1]), country: COUNTRY, published: parts.day,
      category: /lait (?:de )?croissance|nourrisson|infantile|b[eé]b[eé]|baby/i.test(all) ? 'baby' : /compl[eé]ment alimentaire/i.test(all) ? 'supplement' : 'food',
      hazard: /allerg[eè]ne/i.test(parts.title) && hazardOf(reason) === 'other' ? 'allergen' : hazardOf(reason, text),
      name, reason,
      brand: brands.length === 1 && brands[0].length <= 80 ? brands[0] : undefined,
      details: details ? cut(details, 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      action: action ? cut(action.trim(), 500) : undefined,
      source: SOURCE, url: item.link, gtins: gtins.slice(0, 50),
    },
  };
}

/** Reads the alerts of the feed. Resolves to { notices, seen, skipped }; throws when the feed is not as described above. */
async function fetchNotices({ fetchImpl = fetch, url = FEED, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const items = rssItems(await getText(fetchImpl, url, { userAgent }));
  if (items.length === 0) throw new Error('feed upozorenja je prazan (format se promijenio?)');
  const notices = [];
  const toRead = [];
  const seen = new Set();
  for (const item of items) {
    const m = ALERTS.exec(item.link);
    if (!m) { count(/rappels-aliments-pour-animaux/.test(item.link) ? 'hrana za životinje' : 'link nije na stranicu upozorenja'); continue; }
    if (seen.has(item.link)) continue;
    seen.add(item.link);
    // the feed's day is the last change: an alert changed in the window may be older — its page says
    const changed = dayIn(item.pubDate, 'Europe/Luxembourg');
    if (changed && changed < since) { count('starije od prozora'); continue; }
    const k = known.get(idOf(PREFIX, m[1]));
    if (k) { if (k.published >= since) notices.push(k); else count('starije od prozora'); }
    else toRead.push(item);
  }
  const now = toRead.slice(0, MAX_PAGES);
  for (let i = now.length; i < toRead.length; i++) count('stranica ostavljena za sljedeće pokretanje');
  const pages = await mapLimit(now, 2, async (item) => pageParts(await getText(fetchImpl, item.link, { userAgent })));
  let odd = 0;
  now.forEach((item, i) => {
    if (!pages[i].ok) { count('stranica nije pročitana (pokušava se sljedeći put)'); return; }
    if (pages[i].value === null) { odd += 1; count('stranica nije u obliku upozorenja'); return; }
    if (pages[i].value.day < since) { count('starije od prozora'); return; }
    const out = toNotice(item, pages[i].value);
    if (out.skip) count(out.skip);
    else notices.push(out.notice);
  });
  if (odd > 0 && odd === now.length) throw new Error(`nijedna pročitana stranica nije u obliku upozorenja (${odd}) — format se promijenio?`);
  return { notices, seen: seen.size, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: FEED, fetchNotices, pageParts, toNotice, nameOfTitle };
