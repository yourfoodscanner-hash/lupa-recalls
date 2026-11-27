'use strict';
/**
 * Croatia — the consumer notices of the State Inspectorate (Državni inspektorat RH, DIRH) on food
 * recalls, as the Croatian Agency for Agriculture and Food (HAPIH) publishes them under "Obavijesti za
 * potrošače". Read from that category's RSS feed (page by page, as far back as the window reaches) and
 * from the page of each notice.
 *
 * Seen on the live data (26 Nov 2026, 30 notices since July): the notices follow one wording —
 * "Državni inspektorat Republike Hrvatske obavještava potrošače o opozivu proizvoda <name>, lot …,
 * najbolje upotrijebiti do …, zbog <reason>." — then "Podaci o proizvodu". All 30 name their reason
 * after "zbog". Batches, dates and barcodes are taken only where they are labeled (lib/text).
 *
 * The feed's own text is a short excerpt; the page has the whole notice. A page is read for a notice
 * this job has not read whole before (`known`); a page that cannot be read leaves the notice with the
 * excerpt, and it is asked again on the next run.
 *
 * Taken: food, food for infants, food supplements. Pet food and kitchenware (materials in contact with
 * food) are notices of the same list that LUPA does not show.
 */
const { rssItems, htmlToText, dayIn, idOf, cut, labeledGtins, labeledLots, labeledDates, becauseClause, alignedFold } = require('../lib/text');
const { getText, mapLimit } = require('../lib/http');
const { hazardOf, sentenceNaming } = require('../lib/classify');
const { hostOf } = require('../lib/contract');

const NAME = 'hapih';
const PREFIX = 'hr-hapih-';
const COUNTRY = 'HR';
const SOURCE = 'Državni inspektorat RH (HAPIH)';
const HOST = 'hapih.hr';
const FEED = 'https://www.hapih.hr/kategorija/obavijesti-za-potrosace/feed/';
const TIME_ZONE = 'Europe/Zagreb';
const MAX_FEED_PAGES = 8;
const MAX_PAGES = 40;

const IS_RECALL = /opoziv|povla[čc]enj|povla[čc]i se|povu[čc]en/i;
/** "Opoziv obavijesti objavljene 19.06.2026." — the inspectorate withdraws an earlier notice: the product is not recalled after all. */
const IS_RETRACTION = /opoziv[a-z]*\s+obavijest/i;
const PET = /(?<![a-z])(?:za pse|za psa|za macke|za mace|za zivotinje|kucn[a-z]* ljubim|barf|psec[a-z]*|hrana za ribe|hrana za ptice)(?![a-z])/;
const KITCHENWARE = /migracij|u dodiru s hranom|pribor|posud|(?<![a-z])tav[aeu](?![a-z])|(?<![a-z])wok(?![a-z])|(?<![a-z])cas[aeu](?![a-z])|zdjel|salic|kalup|tanjur|termos|daska za|premaz/;

/** The page's notice text: from "OBAVIJEST ZA POTROŠAČE" (or the inspectorate's first sentence) to "Obavijest se odnosi …". */
function noticeText(html) {
  const all = htmlToText(html);
  let start = all.search(/OBAVIJEST ZA POTRO[SŠ]A[CČ]E/);
  if (start < 0) start = all.search(/Državni inspektorat[^\n]{0,40}obavje[sš]tava/);
  if (start < 0) return null;
  const rest = all.slice(start);
  const end = rest.search(/Obavijest se odnosi|Pretraga stranice|\nPoveznice\n/);
  return (end > 0 ? rest.slice(0, end) : rest.slice(0, 4000)).trim();
}

/** The inspectorate's sentence: "Državni inspektorat … obavještava potrošače …" up to the end of its paragraph. */
function mainParagraph(text) {
  const lines = String(text ?? '').split('\n');
  return lines.find((l) => /obavje[sš]tava potro[sš]a[cč]e/i.test(l)) ?? lines.find((l) => l.length > 80) ?? null;
}

/** Text without the sentences that only name regulations ("Proizvod nije u skladu s Uredbom …"). */
const withoutLaw = (text) => String(text ?? '').split('\n').filter((l) => !/^Proizvod nije u skladu|Uredb[aeiou]m? \(?E[ZU]\)?|Pravilnik/i.test(l)).join('\n');

/** "Opoziv proizvoda: J.D. Gross Tamna čokolada 70%, 125g" → "J.D. Gross Tamna čokolada 70%, 125g". */
function nameOf(title) {
  let s = String(title ?? '').replace(/\s+/g, ' ').trim();
  const extra = /dodatna obavijest/i.test(s);
  s = s.replace(/^(?:obavijest o\s+)?(?:opoziv[a-z]*|povla[čc]enj[a-z]*)(?:\s+(?:i\s+(?:opoziv[a-z]*|povla[čc]enj[a-z]*)\s+)?proizvoda)?\s*(?:[:–—-]\s*)?/i, '');
  s = s.replace(/^dodatna obavijest\s*[:–—-]?\s*/i, '').replace(/\s*[–—-]?\s*dodatna obavijest\s*[:–—-]?\s*/i, ' ').trim();
  if (s.length < 2) return null;
  return extra ? `${s} (dodatna obavijest)` : s;
}

function categoryOf(name, text) {
  const n = alignedFold(name);
  const t = alignedFold(text);
  if (PET.test(n) || PET.test(t.slice(0, 400))) return null;
  if (KITCHENWARE.test(n)) return null;
  if (/dojencad|dojence|za bebe|djecj[a-z]* hran|kasic|pocetn[a-z]* (?:hran|formul)|prijelazn[a-z]* (?:hran|formul)/.test(n)) return 'baby';
  if (/dodat[a-z]* prehrani|dodac[a-z]* prehrani/.test(`${n} ${t.slice(0, 600)}`)) return 'supplement';
  return 'food';
}

/** One feed item (and, when it was read, its page) → a notice (unchecked), or { skip }. */
function toNotice(item, page) {
  if (!IS_RECALL.test(item.title)) return { skip: 'nije obavijest o opozivu' };
  if (IS_RETRACTION.test(item.title)) return { skip: 'povlačenje ranije obavijesti' };
  if (hostOf(item.link) !== HOST) return { skip: 'link ne vodi na hapih.hr' };
  const post = /[?&]p=(\d+)/.exec(item.guid);
  const id = post ? `${PREFIX}${post[1]}` : idOf(PREFIX, item.link.replace(/^https:\/\/[^/]+\//, ''));
  if (!id) return { skip: 'bez oznake obavijesti' };
  const day = dayIn(item.pubDate, TIME_ZONE);
  if (!day) return { skip: 'bez datuma' };
  const name = nameOf(item.title);
  if (!name) return { skip: 'bez naziva' };
  const body = page ?? htmlToText(item.description).replace(/\s*\[(?:…|&#8230;|\.\.\.)\]\s*$/, '');
  const category = categoryOf(name, body);
  if (category === null) return { skip: 'hrana za životinje ili posuđe (LUPA ne prikazuje)' };
  const main = mainParagraph(body) ?? body;
  const reason = becauseClause(main) ?? becauseClause(withoutLaw(body)) ?? sentenceNaming(withoutLaw(body));
  if (!reason) return { skip: 'bez razloga' };
  const facts = withoutLaw(body);
  const lots = labeledLots(facts);
  const dates = labeledDates(facts);
  return {
    notice: {
      id, country: COUNTRY, published: day, category, hazard: hazardOf(reason, main, facts),
      name: cut(name, 160), reason: cut(reason, 160),
      details: page ? cut(main.replace(/\n/g, ' '), 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      source: SOURCE, url: item.link, gtins: labeledGtins(facts).slice(0, 50),
    },
  };
}

/**
 * What a withdrawal of earlier notices takes back: the days of those notices and the words of the
 * product ("… o opozivu obavijesti za potrošače objavljene dana 19.06.2026. … za proizvod FREE FROM
 * Kruh sa sjemenkama 200g, …") → { days: ['2026-06-19'], words: ['free', 'from', 'kruh', 'sjemenkama'] }.
 */
function retracted(item) {
  const text = `${item.title}\n${htmlToText(item.description)}`;
  const days = [];
  for (const m of text.matchAll(/(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4})/g)) {
    const before = alignedFold(text.slice(Math.max(0, m.index - 60), m.index));
    if (/objavljen[a-z]*(?:\s+dana)?\s*(?:\d{1,2}\.\s?\d{1,2}\.\s?\d{4}\.?\s*(?:i|,)\s*)?$/.test(before)) {
      days.push(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`);
    }
  }
  const product = /za proizvod[a-z]*\s+([^,\n]{3,120})/i.exec(text) ?? /objavljen[a-z]*[^:]*:\s*([^,\n]{3,120})/i.exec(item.title);
  const words = product ? alignedFold(product[1]).split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !/^\d+[a-z]*$/.test(w)) : [];
  return { days, words };
}
/** A notice that a withdrawal takes back: published on one of its days (± 1), its name has the product's words. */
function isRetracted(notice, r) {
  const near = r.days.some((d) => Math.abs(Date.parse(`${d}T00:00:00Z`) - Date.parse(`${notice.published}T00:00:00Z`)) <= 86400000);
  if (!near || r.words.length === 0) return false;
  const name = alignedFold(notice.name);
  const hits = r.words.filter((w) => name.includes(w)).length;
  return hits >= Math.min(2, r.words.length);
}

/** Reads the feed (as many pages as the window needs) and the pages of new notices. Resolves to { notices, seen, skipped }. */
async function fetchNotices({ fetchImpl = fetch, url = FEED, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const items = [];
  for (let n = 1; n <= MAX_FEED_PAGES; n++) {
    let page;
    try {
      page = rssItems(await getText(fetchImpl, n === 1 ? url : `${url}?paged=${n}`, { userAgent }));
    } catch (e) {
      if (n === 1) throw e;
      break;                                           // past the last page the site answers 404
    }
    items.push(...page);
    const days = page.map((it) => dayIn(it.pubDate, TIME_ZONE)).filter(Boolean).sort();
    if (page.length === 0 || days.length === 0 || days[0] < since) break;
  }
  if (items.length > 0 && !items.some((it) => IS_RECALL.test(it.title))) throw new Error('feed nema nijednu obavijest o opozivu — izgleda da to više nije kategorija „Obavijesti za potrošače”');
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const wanted = [];
  const withdrawals = items.filter((it) => IS_RETRACTION.test(it.title)).map(retracted);
  for (const item of items) {
    const out = toNotice(item, null);
    if (out.skip) { count(out.skip); continue; }
    if (out.notice.published < since) { count('starije od prozora'); continue; }
    if (wanted.some((w) => w.notice.id === out.notice.id)) { count('ista obavijest dvaput'); continue; }
    if (withdrawals.some((r) => isRetracted(out.notice, r))) { count('obavijest koju je inspektorat povukao'); continue; }
    wanted.push({ item, notice: out.notice });
  }
  const notices = [];
  const toRead = [];
  for (const w of wanted) {
    const k = known.get(w.notice.id);
    if (k && k.details) notices.push(k);
    else toRead.push(w);
  }
  const now = toRead.slice(0, MAX_PAGES);
  const pages = await mapLimit(now, 2, async (w) => {
    const text = noticeText(await getText(fetchImpl, w.item.link, { userAgent }));
    if (text === null) throw new Error('stranica nije obavijest');
    return text;
  });
  now.forEach((w, i) => {
    if (!pages[i].ok) { count('stranica obavijesti nije pročitana (objavljeno iz sažetka)'); notices.push(w.notice); return; }
    const out = toNotice(w.item, pages[i].value);
    if (out.skip) { count(out.skip); return; }
    notices.push(out.notice);
  });
  for (const w of toRead.slice(MAX_PAGES)) { count('stranica ostavljena za sljedeće pokretanje'); notices.push(w.notice); }
  return { notices, seen: items.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: FEED, fetchNotices, toNotice, noticeText, nameOf, categoryOf, retracted, isRetracted };
