'use strict';
/**
 * North Macedonia — Агенција за храна и ветеринарство (АХВ / Food and Veterinary Agency), "Известување
 * за отповикување небезбедни производи": the agency's list of recalls of unsafe products
 * (https://fva.gov.mk/mk/izvestuvanje-otpovikuvanje-nebezbedni-proizvodi).
 *
 * Seen on the live data (27 Nov 2026): a list of articles, newest first ("view-id-a_povlekuvanje"),
 * each with its node id, a link, the title ("Се отповикува Чипс со вкус на балсамико и домат 150 гр,
 * поради зголемено присуство на акриламид") and the time it was published (schema:dateCreated). Few a
 * year (one in 2026 so far). The article: the agency's text with the product lines and labeled values —
 * "Лот 51520346АЕ", "серија 1507482842", "Рок на траење 30.06.2027", "Причина за отповикувањето - …" —
 * and its appeal to consumers. A page is read once (`known` after that).
 */
const { htmlToText, oneLine, idOf, cut } = require('../lib/text');
const { getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');

const NAME = 'fva';
const PREFIX = 'mk-fva-';
const COUNTRY = 'MK';
const SOURCE = 'Агенција за храна и ветеринарство (АХВ)';
const SITE = 'https://fva.gov.mk';
const LIST = `${SITE}/mk/izvestuvanje-otpovikuvanje-nebezbedni-proizvodi`;
const MAX_PAGES = 20;

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const unique = (xs) => [...new Set(xs.filter(Boolean))];
/** What the titles say before the product: "Отповикување на небезбедни производи", "Се отповикува" … */
const LEAD = /^(?:(?:отповикување|повлекување)(?:\s+на)?(?:\s+небезбед[а-џ]*)?(?:\s+(?:производ[а-џ]*|прибор[а-џ]*(?:\s+за\s+јадење)?))?|се\s+отповикува(?:ат)?|од\s+пазарот\s+се\s+повлекуваат(?:\s+серии\s+од\s+производите)?)\s*[,:–-]?\s*/i;

/** The articles of the list. Throws when the page is not the list. */
function listRows(html) {
  const page = String(html ?? '').replace(/<!--[\s\S]*?-->/g, '');
  const view = page.indexOf('view-id-a_povlekuvanje');
  if (view < 0) throw new Error('stranica nije lista otpovikuvanja (format se promijenio?)');
  const rows = [];
  for (const m of page.slice(view).matchAll(/<article data-history-node-id="(\d+)"[^>]*about="(\/mk\/[^"]+)"[\s\S]*?<span property="schema:name">([\s\S]*?)<\/span>[\s\S]*?schema:dateCreated" content="(\d{4}-\d{2}-\d{2})/g)) {
    if (!rows.some((r) => r.node === m[1])) rows.push({ node: m[1], url: SITE + m[2], title: oneLine(m[3]), day: m[4] });
  }
  return rows;
}

const idOfRow = (row) => idOf(PREFIX, row.node);

/** An article's page → { text } (its body as lines) or null when it is not an article. */
function pageParts(html) {
  const page = String(html ?? '').replace(/<!--[\s\S]*?-->/g, '');
  const body = /<div property="schema:text"[^>]*>([\s\S]*?)<\/div>/.exec(page);
  if (!/<article data-history-node-id="\d+"/.test(page) || !body) return null;
  return { text: htmlToText(body[1]) };
}

/** "Се отповикува Чипс … 150 гр, поради зголемено присуство на акриламид" → { name, reason }. */
function titleParts(title) {
  const rest = String(title).replace(LEAD, '').trim();
  const m = /^(.*?),?\s+поради\s+(.+)$/i.exec(rest);
  return m ? { name: m[1].trim(), reason: m[2].trim() } : { name: rest, reason: null };
}

function categoryOf(text) {
  if (/доенч|бебе|за деца до|адаптиран/i.test(text)) return 'baby';
  if (/додат[оо]?к\s+(?:на|во)\s+исхрана|додатоци\s+(?:на|во)\s+исхрана|суплемент/i.test(text)) return 'supplement';
  return 'food';
}

/** One row and its page → a notice (unchecked), or { skip }. */
function toNotice(row, parts) {
  if (/прибор за јадење|материјал[а-џ]* (?:и предмети )?(?:во|за) контакт со храна/i.test(`${row.title}\n${parts.text}`)) return { skip: 'materijal u dodiru s hranom (posuđe)' };
  const { name: titleName, reason: titleReason } = titleParts(row.title);
  const name = cut(titleName.replace(/[.\s]+$/, ''), 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const text = parts.text;
  const said = /причина за (?:отповикувањето|повлекувањето)\s*[-–:]\s*([^\n]+?)(?:\.\s|\.?$|\n)/i.exec(text) ?? /(?:^|\s)поради\s+([^\n.,:]+)/i.exec(text);
  const reason = cut(capital((titleReason ?? (said ? said[1] : '')).replace(/[.\s]+$/, '')), 160);
  if (!reason) return { skip: 'bez razloga' };
  // batches and dates only where the text labels them
  const lots = unique([...text.matchAll(/(?:^|[\s(,–-])(?:лот|серија|сериски број\/лот|lot)\s*:?\s*([0-9A-Za-zА-Яа-я][0-9A-Za-zА-Яа-я\/-]{2,30})/gi)].map((m) => m[1]).filter((v) => /\d/.test(v)));
  const dates = unique([...text.matchAll(/рок(?:ови)? на (?:траење|употреба)\s*:?\s*(\d{1,2}\.\s?\d{1,2}\.\s?\d{4})/gi)].map((m) => m[1].replace(/\s/g, '')));
  const sentences = text.replace(/\n/g, ' ').split(/(?<=[.!?])\s+/);
  const action = sentences.find((s) => /апел|да не (?:ги|го) консумира|да (?:ги|го) врат/i.test(s));
  return {
    notice: {
      id: idOfRow(row), country: COUNTRY, published: row.day, category: categoryOf(`${row.title}\n${text}`),
      hazard: hazardOf(reason, text),
      name, reason,
      details: cut(text.split('\n')[0], 800) || undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      action: action ? cut(action.trim(), 500) : undefined,
      source: SOURCE, url: row.url, gtins: [],
    },
  };
}

/** Reads the list of recalls. Resolves to { notices, seen, skipped }; throws when the list is not as described above. */
async function fetchNotices({ fetchImpl = fetch, url = LIST, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const rows = listRows(await getText(fetchImpl, url, { userAgent }));
  if (rows.length === 0) throw new Error('lista otpovikuvanja je prazna (format se promijenio?)');
  const notices = [];
  const toRead = [];
  for (const row of rows) {
    if (row.day < since) { count('starije od prozora'); continue; }
    const k = known.get(idOfRow(row));
    if (k) notices.push(k);
    else toRead.push(row);
  }
  const now = toRead.slice(0, MAX_PAGES);
  for (let i = now.length; i < toRead.length; i++) count('stranica ostavljena za sljedeće pokretanje');
  const pages = await mapLimit(now, 2, async (row) => pageParts(await getText(fetchImpl, row.url, { userAgent })));
  let odd = 0;
  now.forEach((row, i) => {
    if (!pages[i].ok) { count('stranica nije pročitana (pokušava se sljedeći put)'); return; }
    if (pages[i].value === null) { odd += 1; count('stranica nije u obliku članka'); return; }
    const out = toNotice(row, pages[i].value);
    if (out.skip) count(out.skip);
    else notices.push(out.notice);
  });
  if (odd > 0 && odd === now.length) throw new Error(`nijedna pročitana stranica nije u obliku članka (${odd}) — format se promijenio?`);
  return { notices, seen: rows.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: LIST, fetchNotices, listRows, pageParts, toNotice, titleParts };
