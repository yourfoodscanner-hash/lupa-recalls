'use strict';
/**
 * Finland — Ruokavirasto (the Finnish Food Authority), "Elintarvikkeiden takaisinvedot": the food recalls
 * the authority publishes for consumers.
 *
 * Seen on the live data (27 Nov 2026): one list of all recalls, newest first, each a day ("25. marraskuuta
 * 2026") and a title ("Välipalapatukoissa metalliriski" — what is wrong, in which product). The page of a
 * recall says it in sentences: "… yhden erän tuotetta <strong>Corny … 120 g</strong>. Tuotteen EAN-koodi/
 * GTIN on 4011800429218 ja … parasta ennen -merkintä 10.09.2027." The product is the first highlighted
 * name; barcodes and dates only where labeled (lib/text). Kitchenware ("kontaktimateriaalivirhe",
 * "lautasista", "pannusta") is on the same list and is left out.
 */
const { htmlToText, oneLine, idOf, cut, labeledGtins, labeledLots, labeledDates, alignedFold } = require('../lib/text');
const { getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');

const NAME = 'ruokavirasto';
const PREFIX = 'fi-ruokavirasto-';
const COUNTRY = 'FI';
const SOURCE = 'Ruokavirasto';
const SITE = 'https://www.ruokavirasto.fi';
const LIST = `${SITE}/elintarvikkeet/ohjeita-kuluttajille/takaisinvedot/`;
const MAX_PAGES = 40;
const MONTHS = ['tammikuuta', 'helmikuuta', 'maaliskuuta', 'huhtikuuta', 'toukokuuta', 'kesakuuta', 'heinakuuta', 'elokuuta', 'syyskuuta', 'lokakuuta', 'marraskuuta', 'joulukuuta'];

/** "25. marraskuuta 2026" → "2026-11-25". */
function dayOfFinnish(value) {
  const m = /(\d{1,2})\.\s*([a-zäö]+)\s+(\d{4})/i.exec(alignedFold(String(value ?? '')));
  const month = m ? MONTHS.indexOf(m[2]) + 1 : 0;
  if (!m || month === 0) return null;
  return `${m[3]}-${String(month).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

/** The rows of the list. Throws when the page is not the list. */
function listRows(html) {
  const page = String(html ?? '');
  if (!/content-list-block__list/.test(page)) throw new Error('stranica nije lista takaisinvedot (format se promijenio?)');
  const rows = [];
  for (const m of page.matchAll(/<li class="content-list-block__list-item">([\s\S]*?)<\/li>/g)) {
    const href = (/<a[^>]*href="([^"]+)"/.exec(m[1]) ?? [])[1];
    if (!href) continue;
    const path = href.replace(/^https?:\/\/[^/]+/, '');
    const slug = path.replace(/\/+$/, '').split('/').pop();
    rows.push({
      slug, url: SITE + path,
      day: dayOfFinnish(oneLine((/<p class="content-list-block__date">([\s\S]*?)<\/p>/.exec(m[1]) ?? [])[1] ?? '')),
      title: oneLine((/<a[^>]*>([\s\S]*?)<\/a>/.exec(m[1]) ?? [])[1] ?? ''),
    });
  }
  return rows;
}

const idOfRow = (row) => idOf(PREFIX, row.slug);

/** A recall's page → { title, paragraphs, highlighted } or null when it is not a recall. */
function pageParts(html) {
  const page = String(html ?? '');
  const main = /<main[^>]*>([\s\S]*?)<\/main>/.exec(page);
  const article = main ? /<article>([\s\S]*?)<\/article>/.exec(main[1]) : null;
  if (!article || !/<p class="date">/.test(main[1])) return null;
  const title = oneLine((/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(main[1]) ?? [])[1] ?? '');
  const paragraphs = [];
  for (const p of article[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>|<li[^>]*>([\s\S]*?)<\/li>/g)) {
    const text = htmlToText(p[1] ?? p[2]).replace(/\s+([.,])/g, '$1').replace(/\s+/g, ' ').trim();
    if (text) paragraphs.push(text);
  }
  const highlighted = [...article[1].matchAll(/<strong>([\s\S]*?)<\/strong>/g)].map((s) => oneLine(s[1]).replace(/[.,:;]+$/, '').trim()).filter(Boolean);
  return { title, paragraphs, highlighted };
}

const NOT_FOOD = /kontaktimateriaal|lusik|lautas|pannusta|pannuista|astioi|astiast|kupeista|mukeista|elintarvikekosketus/;
/** A highlighted text that is a label or a date, not a product. */
const NOT_A_NAME = /parasta ennen|viimeinen kayttopaiva|ean|gtin|eranumero|eratunnus|pakkauskoko|lisatietoja|kuva|^\d[\d.\s/-]*$/;
/** Where the text ends: contacts, pictures, the authority's own staff. */
const TAIL = /^(?:lisatietoja|asiaa hoitaa|kuva tuotteesta|yrityksen tiedote|tilaa )/;

function categoryOf(text) {
  const f = alignedFold(text ?? '');
  if (/vauva|lastenruoka|aidinmaidonkorvike|pikkulasten ruoka|imeavai/.test(f)) return 'baby';
  if (/ravintolisa|vitamiinivalmiste/.test(f)) return 'supplement';
  return 'food';
}

/** One row and its page → a notice (unchecked), or { skip }. */
function toNotice(row, parts) {
  const title = parts.title || row.title;
  if (NOT_FOOD.test(alignedFold(title))) return { skip: 'nije hrana (posuđe, kontaktni materijal)' };
  const body = parts.paragraphs.filter((p) => !TAIL.test(alignedFold(p)));
  const text = body.join('\n');
  const highlighted = parts.highlighted.find((h) => h.length >= 2 && h.length <= 160 && !NOT_A_NAME.test(alignedFold(h)));
  const said = /(?:nimell[aä]|tuotetta|tuotteita|tuotteen)\s+([^.]{2,120}?)\s*\./i.exec(text);
  const name = cut(highlighted ?? (said ? said[1] : '') ?? '', 160) || cut(title, 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const reason = cut(title.replace(/^p[aä]ivitys[^:]*:\s*/i, ''), 160);
  if (!reason) return { skip: 'bez razloga' };
  const sentences = text.split(/(?<=[.!?])\s+/);
  const action = sentences.find((s) => /kuluttaj/i.test(s) && /(?:hävit|palaut|lopett|ei (?:tule )?(?:syö|käyt)|älä|kehot|pyytä|pyydetään)/i.test(s));
  const lots = labeledLots(text);
  const dates = labeledDates(text);
  return {
    notice: {
      id: idOfRow(row), country: COUNTRY, published: row.day, category: categoryOf(`${title}\n${text}`),
      hazard: hazardOf(reason, text),
      name, reason,
      details: body.length ? cut(body[0], 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      action: action ? cut(action.trim(), 500) : undefined,
      source: SOURCE, url: row.url, gtins: labeledGtins(text).slice(0, 50),
    },
  };
}

/** Reads the list. Resolves to { notices, seen, skipped }; throws when the list is not as described above. */
async function fetchNotices({ fetchImpl = fetch, url = LIST, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const rows = listRows(await getText(fetchImpl, url, { userAgent }));
  if (rows.length === 0) throw new Error('lista takaisinvedot je prazna (format se promijenio?)');
  if (!rows.some((r) => r.day)) throw new Error('redovi liste nemaju datum (format se promijenio?)');
  const notices = [];
  const toRead = [];
  for (const row of rows) {
    if (!row.day) { count('bez datuma'); continue; }
    if (row.day < since) { count('starije od prozora'); continue; }
    const k = known.get(idOfRow(row));
    if (k && k.published === row.day) notices.push(k);
    else toRead.push(row);
  }
  const now = toRead.slice(0, MAX_PAGES);
  const pages = await mapLimit(now, 2, async (row) => pageParts(await getText(fetchImpl, row.url, { userAgent })));
  let odd = 0;
  let read = 0;
  now.forEach((row, i) => {
    if (!pages[i].ok) { count('stranica nije pročitana (pokušava se sljedeći put)'); return; }
    if (pages[i].value === null) { odd += 1; count('stranica nije u obliku takaisinveto'); return; }
    read += 1;
    const out = toNotice(row, pages[i].value);
    if (out.skip) count(out.skip);
    else notices.push(out.notice);
  });
  if (odd > 0 && read === 0) throw new Error(`nijedna pročitana stranica nije u obliku takaisinveto (${odd}) — format se promijenio?`);
  for (let i = MAX_PAGES; i < toRead.length; i++) count('stranica ostavljena za sljedeće pokretanje');
  return { notices, seen: rows.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: LIST, fetchNotices, listRows, pageParts, toNotice, dayOfFinnish, MAX_PAGES };
