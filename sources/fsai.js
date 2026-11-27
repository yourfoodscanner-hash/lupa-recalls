'use strict';
/**
 * Ireland — FSAI (Food Safety Authority of Ireland): food alerts and food allergen alerts, both on one
 * list, "All Alerts" (/news-alert/all-alerts), newest first, 10 a page, each row a link and a title.
 *
 * Seen on the live data (27 Nov 2026): the page of an alert (/news-and-alerts/food-alerts/… or
 * /news-and-alerts/allergen-alerts/…) has the full title ("Recall of specific batches of Ready brek
 * Original … due to the possible presence of flour beetles"), the day ("Tuesday, 13 October 2026"), a
 * summary table ("Alert Notification:", "Allergen(s):", "Product Identification:", "Batch Code",
 * "Country Of Origin:") and the sections "Message:", "Nature Of Danger:", "Action Required:" →
 * "Consumers:". Products are often listed in a table ("Product name | Pack size | Best-before dates"),
 * which is read here as "Header: value" lines, so batches and dates are still taken only where labeled.
 *
 * The list has no days, so the page of an alert is read once (`known` after that); the list is read
 * page by page until a whole page is older than the window. Updates ("Update to recall of …") are
 * alerts of their own and are kept.
 */
const { decodeEntities, htmlToText, oneLine, idOf, cut, labeledGtins, labeledLots, labeledDates, firstSentence, alignedFold } = require('../lib/text');
const { getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');

const NAME = 'fsai';
const PREFIX = 'ie-fsai-';
const COUNTRY = 'IE';
const SOURCE = 'FSAI';
const SITE = 'https://www.fsai.ie';
const LIST = `${SITE}/news-alert/all-alerts`;
const MAX_LIST_PAGES = 6;
const MAX_PAGES = 40;
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

/** "Tuesday, 13 October 2026" → "2026-10-13". */
function dayOfEnglish(value) {
  const m = /(\d{1,2})\s+([a-z]+)\s+(\d{4})/i.exec(String(value ?? ''));
  const month = m ? MONTHS.indexOf(m[2].toLowerCase()) + 1 : 0;
  if (!m || month === 0) return null;
  return `${m[3]}-${String(month).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

/** The rows of a page of the list. Throws when the page is not the list. */
function listRows(html) {
  const page = String(html ?? '');
  if (!/name="fromDate"/.test(page)) throw new Error('stranica nije lista FSAI upozorenja (format se promijenio?)');
  const rows = [];
  for (const m of page.matchAll(/<a class="feature-card[^"]*" href="(\/news-and-alerts\/(food|allergen)-alerts\/([^"?#\/]+))"[^>]*title="([^"]*)"/g)) {
    if (rows.some((r) => r.url === SITE + m[1])) continue;
    rows.push({ url: SITE + m[1], allergen: m[2] === 'allergen', slug: m[3].toLowerCase(), title: oneLine(m[4]) });
  }
  return rows;
}

function idOfRow(row) {
  return idOf(PREFIX, `${row.allergen ? 'a-' : ''}${row.slug}`);
}

/** A table → "Header: value" lines, one block per row; a table without headers → its cells, one per line. */
function tableLines(html) {
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((r) => [...r[1].matchAll(/<t([hd])[^>]*>([\s\S]*?)<\/t[hd]>/g)].map((c) => ({ head: c[1] === 'h', text: oneLine(c[2]).replace(/:$/, '') })));
  if (rows.length === 0) return '';
  const header = rows[0].length > 1 && rows[0].every((c) => c.head) ? rows[0].map((c) => c.text) : null;
  const body = header ? rows.slice(1) : rows;
  return body.map((cells) => cells.map((c, i) => (header && header[i] ? `${header[i]}: ${c.text}` : c.text)).filter((s) => s.trim()).join('\n')).join('\n\n');
}

/** An alert's page → { title, day, fields, sections } or null when it is not an alert. */
function pageParts(html) {
  const page = String(html ?? '');
  const article = /<article class="wysiwyg">([\s\S]*?)<\/article>/.exec(page);
  if (!article || !/Alert Summary/.test(article[1])) return null;
  const a = article[1];
  const title = oneLine((/<h2[^>]*>([\s\S]*?)<\/h2>/.exec(a) ?? [])[1] ?? '');
  const day = dayOfEnglish(oneLine((/<p class="date">([\s\S]*?)<\/p>/.exec(a) ?? [])[1] ?? ''));
  const summaryEnd = a.indexOf('</table>');
  const summary = summaryEnd > 0 ? a.slice(0, summaryEnd) : '';
  const fields = {};
  for (const m of summary.matchAll(/<td>\s*<strong>([\s\S]*?)<\/strong>\s*<\/td>\s*<td>([\s\S]*?)<\/td>/g)) {
    const label = alignedFold(oneLine(m[1])).replace(/:$/, '').trim();
    const value = htmlToText(m[2].replace(/<br\s*\/?>/gi, '\n')).trim();
    if (label && !(label in fields)) fields[label] = value;
  }
  const rest = summaryEnd > 0 ? a.slice(summaryEnd + 8) : a;
  const marks = [...rest.matchAll(/<p>\s*<strong>([^<]{2,90}?)\s*<\/strong>/g)];
  const sections = {};
  marks.forEach((m, i) => {
    const label = alignedFold(decodeEntities(m[1])).replace(/:$/, '').trim();
    const end = i + 1 < marks.length ? marks[i + 1].index : rest.length;
    const body = rest.slice(m.index + m[0].length, end).replace(/<table[\s\S]*?<\/table>/g, (t) => `\n${tableLines(t)}\n`);
    if (!(label in sections)) sections[label] = htmlToText(body.replace(/<img[^>]*>/g, '')).trim();
  });
  return { title, day, fields, sections };
}

const NOT_FOOD = /food contact material|kitchenware|utensil|melamine|pet food|dog food|cat food|animal feed/;

function categoryOf(text) {
  const f = alignedFold(text ?? '');
  if (/infant formula|follow-on formula|baby food|infant/.test(f)) return 'baby';
  if (/food supplement|supplement/.test(f)) return 'supplement';
  return 'food';
}

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** The product's name: the summary's own words, else the names in the products table, else the title. */
function nameOf(parts) {
  // "Aneto Natural Chicken Broth; pack size: 1000 ml;" — a product a line, its name before the ";"
  const pi = parts.fields['product identification'] ?? '';
  const named = pi.split('\n').map((l) => l.split(';')[0].replace(/,?\s*pack size.*$/i, '').replace(/[.,]+$/, '').trim()).filter((n, i, xs) => n.length >= 2 && xs.indexOf(n) === i);
  if (named.length && !/see (?:the )?table|see below|please see/i.test(pi)) return named.join(', ');
  const all = Object.values(parts.sections).join('\n');
  const names = [...all.matchAll(/^(?:product(?: name)?|name of product|description)\s*:\s*(.+)$/gim)].map((m) => m[1].trim()).filter((n, i, xs) => n && xs.indexOf(n) === i);
  if (names.length) return names.join(', ');
  const t = parts.title.replace(/\s*\(update \d+\)\s*$/i, '').replace(/\s+due to\s.*$/i, '');
  const m = /^(?:update to )?recall of (?:a |an |the )?(?:specific |several |certain |various |all )?(?:batch(?:es)? |lots? |products? )?(?:of )?(.+)$/i.exec(t);
  return (m ? m[1] : t).trim();
}

/** Why: the title's "due to …" clause; for allergen alerts, the allergens. */
function reasonOf(parts, allergen) {
  const title = parts.title.replace(/\s*\(update \d+\)\s*$/i, '');
  const due = /\bdue to (?:the |a |an )?(.+)$/i.exec(title);
  if (due) return capital(due[1].trim());
  const allergens = (parts.fields['allergen(s)'] ?? parts.fields.allergens ?? parts.fields.allergen ?? '').replace(/\s+/g, ' ').trim();
  if (allergen && /not labell?ed in english/i.test(title) && allergens) return `${capital(allergens.toLowerCase())}: allergen not labelled in English`;
  if (allergen && !/^(?:update to )?recall\b/i.test(title)) {
    const before = title.split(/\s+in\s+(?=(?:a|an|the|specific|several|certain|various|all|some|one|two|three|\d+)\b|[A-Z])/)[0].trim();
    if (before.length >= 4 && before.length <= 100 && before !== title) return capital(before);
  }
  if (allergens) return `Undeclared allergen: ${allergens.toLowerCase()}`;
  const danger = parts.sections['nature of danger'];
  return danger ? firstSentence(danger, 160) : null;
}

/** One row and its page → a notice (unchecked), or { skip }. */
function toNotice(row, parts) {
  if (!parts.day) return { skip: 'bez datuma' };
  const everything = [parts.title, ...Object.values(parts.fields), ...Object.values(parts.sections)].join('\n');
  if (NOT_FOOD.test(alignedFold(parts.title))) return { skip: 'nije hrana (posuđe, hrana za životinje)' };
  const name = cut(nameOf(parts), 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const reason = cut(reasonOf(parts, row.allergen) ?? '', 160);
  if (!reason) return { skip: 'bez razloga' };
  // batches and dates: the summary's "Batch Code" line by line, and the products tables
  const batches = (parts.fields['batch code'] ?? '').split(/\n|\s+and\s*$/m).map((l) => l.trim()).filter(Boolean).map((l) => `Batch code: ${l}`).join('\n');
  const labeled = `${batches}\n${parts.sections.message ?? ''}\n${parts.fields['product identification'] ?? ''}`;
  const lots = labeledLots(labeled);
  const dates = labeledDates(labeled);
  const consumers = parts.sections.consumers ?? (parts.sections.message ?? '').split(/(?<=[.!?])\s+/).find((s) => /consumers\b.*\b(?:should not|not to|advised)/i.test(s));
  const danger = parts.sections['nature of danger'] ?? (row.allergen ? firstSentence(parts.sections.message ?? '', 800) : null);
  return {
    notice: {
      id: idOfRow(row), country: COUNTRY, published: parts.day, category: categoryOf(`${parts.title}\n${name}\n${parts.fields['product identification'] ?? ''}`),
      hazard: row.allergen ? 'allergen' : hazardOf(reason, everything),
      name, reason,
      details: danger ? cut(danger.replace(/\n+/g, ' '), 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      action: consumers ? cut(consumers.replace(/\n+/g, ' ').trim(), 500) : undefined,
      source: SOURCE, url: row.url, gtins: labeledGtins(labeled).slice(0, 50),
    },
  };
}

/** Reads the list. Resolves to { notices, seen, skipped }; throws when the list is not as described above. */
async function fetchNotices({ fetchImpl = fetch, url = LIST, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const notices = [];
  const seen = new Set();
  let reads = 0;
  let odd = 0;
  let read = 0;
  for (let n = 1; n <= MAX_LIST_PAGES; n++) {
    const rows = listRows(await getText(fetchImpl, n === 1 ? url : `${url}?page=${n}`, { userAgent })).filter((r) => !seen.has(r.url));
    if (n === 1 && rows.length === 0) throw new Error('lista FSAI upozorenja je prazna (format se promijenio?)');
    if (rows.length === 0) break;
    rows.forEach((r) => seen.add(r.url));
    const days = [];
    const toRead = [];
    for (const row of rows) {
      const k = known.get(idOfRow(row));
      if (k) { days.push(k.published); if (k.published >= since) notices.push(k); else count('starije od prozora'); }
      else toRead.push(row);
    }
    const now = toRead.slice(0, Math.max(0, MAX_PAGES - reads));
    reads += now.length;
    for (let i = now.length; i < toRead.length; i++) count('stranica ostavljena za sljedeće pokretanje');
    const pages = await mapLimit(now, 2, async (row) => pageParts(await getText(fetchImpl, row.url, { userAgent })));
    now.forEach((row, i) => {
      if (!pages[i].ok) { count('stranica nije pročitana (pokušava se sljedeći put)'); return; }
      if (pages[i].value === null) { odd += 1; count('stranica nije u obliku upozorenja'); return; }
      read += 1;
      const parts = pages[i].value;
      if (parts.day) days.push(parts.day);
      if (parts.day && parts.day < since) { count('starije od prozora'); return; }
      const out = toNotice(row, parts);
      if (out.skip) count(out.skip);
      else notices.push(out.notice);
    });
    if (days.length > 0 && days.every((d) => d < since)) break;
    if (reads >= MAX_PAGES || (odd > 0 && read === 0)) break;   // no page in the form of an alert: stop here (below)
  }
  if (odd > 0 && read === 0) throw new Error(`nijedna pročitana stranica nije u obliku upozorenja (${odd}) — format se promijenio?`);
  return { notices, seen: seen.size, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: LIST, fetchNotices, listRows, pageParts, tableLines, toNotice, nameOf, reasonOf, dayOfEnglish, MAX_PAGES };
