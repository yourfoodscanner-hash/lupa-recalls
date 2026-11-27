'use strict';
/**
 * The EU's RASFF Consumers' Portal — the European Commission's list, per country, of the RASFF
 * notifications about food on that country's market (recalls and withdrawals that may concern
 * consumers there). Used for the countries whose own authority cannot be read by this job yet: their
 * site does not answer from outside the country, has no list, or its adapter is not written yet.
 *
 * Seen on the live data (27 Nov 2026): the portal's own JSON list of countries ("markets", each with
 * its id and ISO code), and per country an RSS feed whose items are "2026.10497 - excess glycyrrhizin
 * in candy", a link to the notification, and "Notified by France on 25/11/2026". The notification
 * itself is public JSON: the product as the notification names it ("Fisherman's Friend"), its
 * category, the findings ("glycyrrhizin - high content - composition"), and the measures taken in
 * each country ("recall from consumer", "withdrawal from the market" …). The portal gives no batches,
 * dates or barcodes; the notice says so by having none.
 *
 * A notification is read only once (`known`); one notification may be on several countries' lists,
 * and is then one notice per country.
 */
const { rssItems, oneLine, idOf, cut, alignedFold } = require('../lib/text');
const { getText, getJson, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');

const NAME = 'rasff';
const PREFIX = 'eu-rasff-';
const SOURCE = 'RASFF – European Commission';
const BASE = 'https://webgate.ec.europa.eu/rasff-window/';
const MARKETS = `${BASE}backend/public/organization/single/market/list/en/`;
/** EU members without an adapter of their own in this job (yet) — the ones that have one are read there. */
const COUNTRIES = ['BE', 'BG', 'CY', 'EE', 'ES', 'FI', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SK'];
const MAX_VIEWS = 150;

/** "Notified by France on 25/11/2026" → "2026-11-25". */
function dayOfItem(description) {
  const m = /\bon\s+(\d{2})\/(\d{2})\/(\d{4})\b/.exec(String(description ?? ''));
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}
/** "25-11-2026 17:21:55" → "2026-11-25". */
function dayOfStamp(stamp) {
  const m = /^(\d{2})-(\d{2})-(\d{4})/.exec(String(stamp ?? ''));
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}
/** ".../screen/notification/889479" → "889479". */
function notificationOf(link) {
  const m = /^https:\/\/webgate\.ec\.europa\.eu\/rasff-window\/screen\/notification\/(\d+)\/?$/.exec(String(link ?? '').trim());
  return m ? m[1] : null;
}

/** The notification's product type and category → the app's category, or null for what LUPA does not show (feed, food contact materials). */
function categoryOf(view) {
  const type = alignedFold(view?.productType?.description ?? '');
  if (type !== 'food') return null;
  const cat = alignedFold(view?.product?.productCategory?.description ?? '');
  const words = alignedFold(`${view?.subject ?? ''} ${view?.product?.description ?? ''}`);
  if (/infant|baby|babies|follow-on formula|young children/.test(words)) return 'baby';
  if (/food supplement/.test(cat) || /food supplement/.test(words)) return 'supplement';
  return 'food';
}

const capital = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const clean = (s) => oneLine(String(s ?? '').replace(/\p{Co}/gu, ' ')).replace(/\s+-\s+/g, ' - ').replace(/\s{2,}/g, ' ').replace(/^[\s\p{Z}\p{Cf}]+|[\s\p{Z}\p{Cf}]+$/gu, '');
/** A subject as a reason: without the full stop some subjects end with. */
const sentence = (s) => s.replace(/\.+$/, '').trim();

/** One notification on one country's list → a notice (unchecked), or { skip }. */
function toNotice(view, country, day) {
  const nid = String(view?.id ?? '');
  const reference = clean(view?.reference);
  if (!/^\d+$/.test(nid) || !reference) return { skip: 'notifikacija bez broja' };
  const category = categoryOf(view);
  if (category === null) return { skip: 'nije hrana (hrana za životinje, materijali u dodiru s hranom …)' };
  const subject = clean(view.subject);
  if (subject.length < 3) return { skip: 'bez opisa' };
  const product = clean(view.product?.description);
  const findings = (Array.isArray(view.product?.findings) ? view.product.findings : []).map((f) => clean(f?.name)).filter((f) => f && !/not in catalogue|not determined/i.test(f));
  const measures = [...new Set((Array.isArray(view.product?.measures) ? view.product.measures : [])
    .filter((m) => m?.takenBy?.isoCode === country).map((m) => clean(m?.actionTaken?.description)).filter(Boolean))];
  return {
    notice: {
      id: idOf(PREFIX, `${country}-${reference}`), country, published: dayOfStamp(view.ecValidationDate) ?? day, category,
      hazard: hazardOf(subject, findings.join('; ')),
      name: cut(capital(product.length >= 2 ? product : subject), 160),
      reason: cut(capital(sentence(subject)), 160),
      details: findings.length ? cut(findings.join('; '), 800) : undefined,
      action: measures.length ? cut(capital(measures.join(', ')), 500) : undefined,
      source: SOURCE, url: `${BASE}screen/notification/${nid}`,
      // one notification on several countries' lists is one recall: the build keeps this only when it links notices
      group: idOf('rasff-', reference),
    },
  };
}

/**
 * Reads the portal for the given countries. Resolves to { notices, seen, skipped }. Throws when the
 * list of countries or a country's feed is not as described above.
 */
async function fetchNotices({ fetchImpl = fetch, url = MARKETS, since = '2000-01-01', userAgent, known = new Map(), countries = COUNTRIES } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const markets = await getJson(fetchImpl, url, { userAgent });
  const list = Array.isArray(markets?.organizations) ? markets.organizations : null;
  if (!list || !list.some((o) => o && typeof o.code === 'string' && Number.isInteger(o.id))) throw new Error('lista zemalja nije u obliku koji adapter poznaje (organizations[].id/code)');
  const wanted = [];   // { country, nid, day }
  let seen = 0;
  for (const country of countries) {
    const market = list.find((o) => o.code === country);
    if (!market) { count(`zemlja ${country} nije na portalu`); continue; }
    const items = rssItems(await getText(fetchImpl, `${BASE}backend/public/consumer/rss/${market.id}/en/`, { userAgent }));
    seen += items.length;
    for (const item of items) {
      const nid = notificationOf(item.link);
      const day = dayOfItem(item.description);
      if (!nid || !day) { count('stavka bez notifikacije ili datuma'); continue; }
      if (day < since) { count('starije od prozora'); continue; }
      if (wanted.some((w) => w.country === country && w.nid === nid)) continue;
      wanted.push({ country, nid, day, reference: (/^\s*(\d{4}\.\d{3,6})\s+-/.exec(item.title) ?? [])[1] ?? null });
    }
  }
  // a notification already read keeps its notice; the others are read once each, whatever number of countries list them
  const notices = [];
  const toRead = [];
  for (const w of wanted) {
    const k = w.reference ? known.get(idOf(PREFIX, `${w.country}-${w.reference}`)) : null;
    if (k) notices.push(k);
    else if (!toRead.includes(w.nid)) toRead.push(w.nid);
  }
  const now = toRead.slice(0, MAX_VIEWS);
  const views = await mapLimit(now, 2, (nid) => getJson(fetchImpl, `${BASE}backend/public/notification/view/id/${nid}/`, { userAgent }));
  const byNid = new Map();
  let odd = 0;
  now.forEach((nid, i) => {
    if (!views[i].ok) { count('notifikacija nije pročitana (pokušava se sljedeći put)'); return; }
    const v = views[i].value;
    if (!v || typeof v !== 'object' || String(v.id) !== nid || typeof v.subject !== 'string' || !v.product) { odd += 1; count('notifikacija nije u poznatom obliku'); return; }
    byNid.set(nid, v);
  });
  if (odd > 0 && byNid.size === 0) throw new Error(`nijedna pročitana notifikacija nije u obliku koji adapter poznaje (${odd}) — format se promijenio?`);
  for (const w of wanted) {
    const v = byNid.get(w.nid);
    if (!v) continue;
    const out = toNotice(v, w.country, w.day);
    if (out.skip) { count(out.skip); continue; }
    if (out.notice.published < since) { count('starije od prozora'); continue; }
    if (notices.some((n) => n.id === out.notice.id)) continue;
    notices.push(out.notice);
  }
  for (let i = MAX_VIEWS; i < toRead.length; i++) count('notifikacija ostavljena za sljedeće pokretanje');
  return { notices, seen, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: 'EU', countries: COUNTRIES, source: SOURCE, defaultUrl: MARKETS, fetchNotices, toNotice, categoryOf, dayOfItem, notificationOf, MAX_VIEWS };
