'use strict';
/**
 * Slovenia — "Nevarni in neskladni izdelki" on GOV.SI: the one list on which the food authority (UVHVVR),
 * the health and market inspectorates publish withdrawals and recalls. Read from the list's own JSON
 * export (one request, the whole list).
 *
 * Seen on the live data (26 Nov 2026, 1 443 entries): every entry has the keys in COLUMNS; "Datum" is
 * "dd. mm. yyyy"; the texts of risk, measure and advice are HTML; the product's identification
 * ("Opis izdelka (tip/oznaka)") is free text in which batches, dates and barcodes are written with
 * labels ("lot: 1630104; rok uporabe: 27.11.2026; EAN 3831115348162"). Only labeled values are taken
 * (lib/text). The dedicated "EAN črtna koda" field is read whole.
 *
 * Taken: food, food for infants, food supplements, cosmetics — and only what reached consumers: an
 * entry whose own text says the goods were stopped at the border or never sold in Slovenia is left out.
 */
const { htmlToText, dayOfDotted, idOf, cut, labeledGtins, labeledLots, labeledDates, becauseClause, labeledValue, firstSentence, alignedFold } = require('../lib/text');
const { getJson } = require('../lib/http');
const { gtinsIn, isShopNumber } = require('../lib/gtin');
const { hazardOf } = require('../lib/classify');

const NAME = 'govsi';
const PREFIX = 'si-gov-';
const COUNTRY = 'SI';
const LIST = 'https://www.gov.si/podrocja/podjetnistvo-in-gospodarstvo/varstvo-potrosnikov-in-konkurence/nevarni-in-neskladni-izdelki/';
const EXPORT = `${LIST}export/json/`;
const COLUMNS = ['Naziv', 'URLSegment', 'Datum', 'Kategorija'];

/** The list's category and sub-category → the app's category, or null for what LUPA does not show. */
function categoryOf(category, subcategory, name) {
  const c = alignedFold(category ?? '');
  const s = alignedFold(`${subcategory ?? ''} ${name ?? ''}`);
  if (c.startsWith('zivila za posebne skupine')) return /dojenc|otrok|otrosk|zacetn|nadaljevaln/.test(s) ? 'baby' : 'food';
  if (c.startsWith('zivila')) return /za dojencke|zacetn[a-z]* formul|otrosk[a-z]* hran|kasic[a-z]* za otrok/.test(s) ? 'baby' : 'food';
  if (c.startsWith('prehransk')) return 'supplement';
  if (c.startsWith('kozmeti')) return 'cosmetic';
  return null;
}

/** The entry's own words saying the goods never reached a shop in Slovenia. */
const NEVER_SOLD = /distribuiran[aoi]? (?:le |samo )?v obrat[a-z]* javne prehrane|ni bil[aoi]? dan[aoi]? v promet|ni (?:bil[aoi]? )?doseg[a-z]*|ni bil[aoi]? sproscen|zadrzan[aoi]? (?:ob vstopu|na meji|v skladiscu)|prepoved uvoza|zavrnitev uvoza|ni bil[aoi]? v prodaji v sloveniji/;

const plain = (s) => String(s ?? '').replace(/[\s.]+$/, '').replace(/\s+/g, ' ').trim();
const text = (html) => htmlToText(typeof html === 'string' ? html : '');

/** One entry of the list → a notice in the feed's format (unchecked: lib/contract checks it), or { skip }. */
function toNotice(row) {
  const segment = typeof row.URLSegment === 'string' ? row.URLSegment.trim() : '';
  const id = idOf(PREFIX, segment);
  if (!id || !/^[a-z0-9-]+$/.test(segment)) return { skip: 'bez oznake obavijesti' };
  const first = typeof row['Datum prve objave'] === 'string' ? dayOfDotted(row['Datum prve objave']) : null;
  const day = first ?? dayOfDotted(row.Datum);
  if (!day) return { skip: 'bez datuma' };
  const name = cut(String(row['Naziv proizvoda'] || row.Naziv || '').replace(/\s+/g, ' ').trim(), 160);
  const category = categoryOf(row.Kategorija, row.Podkategorija, name);
  if (category === null) return { skip: 'kategorija koju LUPA ne prikazuje' };
  if (name.length < 2) return { skip: 'bez naziva' };
  const measure = text(row.Ukrep);
  const advice = text(row['Priporočila uporabniku']);
  if (NEVER_SOLD.test(alignedFold(`${measure}\n${advice}`))) return { skip: 'nije stiglo do potrošača u Sloveniji' };
  const risk = text(row['Opis tveganja']) || text(row['Opis neskladnosti']);
  const kinds = (Array.isArray(row['Vrsta tveganja']) ? row['Vrsta tveganja'] : [row['Vrsta tveganja']]).filter((k) => typeof k === 'string' && k.trim() !== '').join(', ');
  const reason = becauseClause(risk, ['zaradi', 'zbog']) ?? firstSentence(risk, 160) ?? (kinds || null);
  if (!reason) return { skip: 'bez razloga' };
  const ident = [text(row['Opis izdelka (tip/oznaka)']), text(row['Seznam izdelkov']), text(row['Podatku o vzorcu'])].filter(Boolean).join('\n');
  const gtins = gtinsIn(typeof row['EAN črtna koda'] === 'string' ? row['EAN črtna koda'] : '').filter((g) => !isShopNumber(g));
  for (const g of labeledGtins(ident)) if (!gtins.includes(g)) gtins.push(g);
  const lots = labeledLots(ident);
  const dates = labeledDates(ident);
  const brand = labeledValue(ident, 'blagovn[a-z]* znamk[a-z]*|trgovsk[a-z]* znamk[a-z]*', 40);
  return {
    notice: {
      id, country: COUNTRY, published: day, category, hazard: hazardOf(reason, risk, kinds),
      name, brand: brand ?? undefined, reason: cut(reason, 160),
      details: risk && plain(risk) !== plain(reason) ? cut(risk.replace(/\n/g, ' '), 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      action: advice ? cut(advice.replace(/\n/g, ' '), 500) : undefined,
      source: cut(typeof row.Institucija === 'string' && row.Institucija.trim() ? row.Institucija.trim() : 'GOV.SI', 120),
      url: `${LIST}${segment}/`,
      gtins: gtins.slice(0, 50),
    },
  };
}

/** Reads the list. Resolves to { notices, seen, skipped }; throws when the answer is not the list as described above. */
async function fetchNotices({ fetchImpl = fetch, url = EXPORT, since = '2000-01-01', userAgent } = {}) {
  const rows = await getJson(fetchImpl, url, { userAgent, timeoutMs: 120000 });
  if (!Array.isArray(rows)) throw new Error('odgovor nije lista obavijesti');
  if (rows.length === 0) throw new Error('lista je prazna');
  const keys = new Set();
  for (const row of rows.slice(0, 200)) if (row && typeof row === 'object') for (const k of Object.keys(row)) keys.add(k);
  const missing = COLUMNS.filter((c) => !keys.has(c));
  if (missing.length > 0) throw new Error(`polja liste nisu ona koja adapter poznaje (nedostaje: ${missing.join(', ')}). Viđena polja: ${[...keys].sort().join(', ')}`);
  const skipped = {};
  const byId = new Map();
  for (const row of rows) {
    if (!row || typeof row !== 'object') { skipped['red nije objekat'] = (skipped['red nije objekat'] ?? 0) + 1; continue; }
    const out = toNotice(row);
    if (out.skip) { skipped[out.skip] = (skipped[out.skip] ?? 0) + 1; continue; }
    if (out.notice.published < since) { skipped['starije od prozora'] = (skipped['starije od prozora'] ?? 0) + 1; continue; }
    if (byId.has(out.notice.id)) { skipped['ista obavijest dvaput'] = (skipped['ista obavijest dvaput'] ?? 0) + 1; continue; }
    byId.set(out.notice.id, out.notice);
  }
  return { notices: [...byId.values()], seen: rows.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: 'GOV.SI', defaultUrl: EXPORT, fetchNotices, toNotice, categoryOf, COLUMNS };
