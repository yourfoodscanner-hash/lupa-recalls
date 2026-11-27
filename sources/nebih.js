'use strict';
/**
 * Hungary — Nébih (Nemzeti Élelmiszerlánc-biztonsági Hivatal, the national food chain safety office),
 * "Termékvisszahívás": the product recalls the office publishes.
 *
 * Seen on the live data (27 Nov 2026): the list (a Liferay table, newest first) gives only a link per
 * recall (/l/termekvisszahivas/2829237189); its columns are empty, so the page of every recall not read
 * before is read (`known` after that). The list is read with 50 rows when it offers that. The page of a
 * recall has the fields "Dátum" (2026-11-26), "Termék neve", "Probléma jellege" and "Részletek" — the
 * last one a request to the buyers ("A Nébih kéri … ne fogyasszák el!") and labeled lines:
 * "RASFF referencia szám:", "Márka:", "Minőségmegőrzési idő:", "Tételszám:" …
 *
 * A recall with a RASFF reference gets the group of that RASFF notification (`rasff-<ref>`), so the app
 * shows it together with the EU's notice of the same product. Feed, pet food and kitchenware are left out.
 */
const { decodeEntities, htmlToText, oneLine, idOf, cut, labeledGtins, labeledLots, labeledDates, labeledValue, alignedFold } = require('../lib/text');
const { getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');

const NAME = 'nebih';
const PREFIX = 'hu-nebih-';
const COUNTRY = 'HU';
const SOURCE = 'Nébih';
const SITE = 'https://portal.nebih.gov.hu';
const LIST = `${SITE}/termekvisszahivas`;
const MAX_PAGES = 60;
const ROUND = 6;

/** The recalls on the list, and the address of the same list with 50 rows if it offers one. Throws when the page is not the list. */
function listRows(html) {
  const page = String(html ?? '');
  if (!/ocerSearchContainer/.test(page)) throw new Error('stranica nije lista termékvisszahívás (format se promijenio?)');
  const rows = [];
  for (const m of page.matchAll(/href="\/l\/termekvisszahivas\/(\d+)"/g)) {
    if (!rows.some((r) => r.key === m[1])) rows.push({ key: m[1], url: `${SITE}/l/termekvisszahivas/${m[1]}` });
  }
  const more = /href="([^"]*_delta=50(?:&amp;|&|")[^"]*)"/.exec(page) ?? /href="([^"]*_delta=50)"/.exec(page);
  return { rows, more: more ? decodeEntities(more[1]) : null };
}

const idOfKey = (key) => idOf(PREFIX, key);

/** A recall's page → { fields, lines, paragraphs } or null when it is not a recall. */
function pageParts(html) {
  const page = String(html ?? '');
  const fields = {};
  let details = null;
  for (const m of page.matchAll(/<div class="field-wrapper-content[^"]*">\s*<label>([\s\S]*?)<\/label>([\s\S]*?)<\/div>\s*(?=<div class="field-wrapper-content|<\/div>)/g)) {
    const label = alignedFold(oneLine(m[1]));
    if (label === 'reszletek') details = m[2];
    else if (label && !(label in fields)) fields[label] = oneLine(m[2]);
  }
  if (!fields.datum || !('termek neve' in fields)) return null;
  // "Részletek": one paragraph each — "Label: value" lines and the office's own sentences
  const paragraphs = [...String(details ?? '').matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((p) => oneLine(htmlToText(p[1]).replace(/\s+/g, ' '))).filter(Boolean);
  return { fields, paragraphs };
}

const NOT_FOOD = /takarmany|allateledel|kutya|macska|kisallat|haziallat|elelmiszerrel erintkez|konyhai eszkoz|bogre|tanyer|pohar|evoeszkoz|melamin/;

function categoryOf(text) {
  const f = alignedFold(text ?? '');
  if (/csecsemo|bebietel|anyatej-helyettesit|tapszer|kisgyermek/.test(f)) return 'baby';
  if (/etrend-kiegeszito|etrendkiegeszito/.test(f)) return 'supplement';
  return 'food';
}

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const LABELED = /^[^:]{2,60}:\s*\S/;
const BOILERPLATE = /kizarolag a fenti adatokkal|bovebben ide kattintva|ide kattintva olvashat/;

/** One recall's page → a notice (unchecked), or { skip }. */
function toNotice(row, parts) {
  const day = /^\d{4}-\d{2}-\d{2}$/.test(parts.fields.datum) ? parts.fields.datum : null;
  if (!day) return { skip: 'bez datuma' };
  const lines = parts.paragraphs.filter((p) => LABELED.test(p));
  const prose = parts.paragraphs.filter((p) => !LABELED.test(p) && !/:$/.test(p) && !BOILERPLATE.test(alignedFold(p)));
  const labeled = lines.join('\n');
  const name = cut(parts.fields['termek neve'] || labeledValue(labeled, 'termek megnevezese', 160) || '', 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const everything = `${name}\n${parts.fields['problema jellege'] ?? ''}\n${parts.paragraphs.join('\n')}`;
  if (NOT_FOOD.test(alignedFold(`${name}\n${parts.fields['problema jellege'] ?? ''}`))) return { skip: 'nije hrana (hrana za životinje, posuđe)' };
  const reason = cut(capital(parts.fields['problema jellege'] ?? ''), 160);
  if (!reason) return { skip: 'bez razloga' };
  const action = prose.find((p) => /kéri|kerjuk|ne fogyassz|ne hasznalj|ne fogyasszak/i.test(alignedFold(p)) || /kéri/.test(p));
  const rasff = (/rasff[^:\n]{0,30}:\s*(\d{4}\.\d{3,5})/i.exec(labeled) ?? [])[1];
  const lots = labeledLots(labeled);
  const dates = labeledDates(labeled);
  const more = prose.filter((p) => p !== action);
  return {
    notice: {
      id: idOfKey(row.key), country: COUNTRY, published: day, category: categoryOf(everything),
      hazard: hazardOf(reason, everything),
      name, brand: labeledValue(labeled, 'marka', 60) ?? undefined, reason,
      details: more.length ? cut(more.join(' '), 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      action: action ? cut(action, 500) : undefined,
      source: SOURCE, url: row.url, gtins: labeledGtins(labeled).slice(0, 50),
      ...(rasff ? { group: idOf('rasff-', rasff) } : {}),
    },
  };
}

/** Reads the list. Resolves to { notices, seen, skipped }; throws when the list is not as described above. */
async function fetchNotices({ fetchImpl = fetch, url = LIST, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  let list = listRows(await getText(fetchImpl, url, { userAgent }));
  if (list.more) {
    const bigger = listRows(await getText(fetchImpl, list.more.startsWith('http') ? list.more : SITE + list.more, { userAgent }));
    if (bigger.rows.length >= list.rows.length) list = bigger;
  }
  if (list.rows.length === 0) throw new Error('lista termékvisszahívás je prazna (format se promijenio?)');
  const notices = [];
  const toRead = [];
  for (const row of list.rows) {
    const k = known.get(idOfKey(row.key));
    if (k) { if (k.published >= since) notices.push(k); else count('starije od prozora'); }
    else toRead.push(row);
  }
  // the list is newest first: pages are read a few at a time, until two rounds in a row are all older than the window
  let odd = 0;
  let read = 0;
  let reads = 0;
  let olderRounds = 0;
  let i = 0;
  for (; i < toRead.length && reads < MAX_PAGES && olderRounds < 2; i += ROUND) {
    const round = toRead.slice(i, Math.min(i + ROUND, i + MAX_PAGES - reads));
    reads += round.length;
    const pages = await mapLimit(round, 2, async (row) => pageParts(await getText(fetchImpl, row.url, { userAgent })));
    let older = 0;
    round.forEach((row, j) => {
      if (!pages[j].ok) { count('stranica nije pročitana (pokušava se sljedeći put)'); return; }
      if (pages[j].value === null) { odd += 1; count('stranica nije u obliku visszahívás'); return; }
      read += 1;
      const out = toNotice(row, pages[j].value);
      if (out.skip) { count(out.skip); return; }
      if (out.notice.published < since) { older += 1; count('starije od prozora'); return; }
      notices.push(out.notice);
    });
    olderRounds = older === round.length ? olderRounds + 1 : 0;
  }
  if (odd > 0 && read === 0) throw new Error(`nijedna pročitana stranica nije u obliku visszahívás (${odd}) — format se promijenio?`);
  for (let j = Math.min(i, toRead.length); j < toRead.length; j++) count(olderRounds >= 2 ? 'iza prozora (nije čitano)' : 'stranica ostavljena za sljedeće pokretanje');
  return { notices, seen: list.rows.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: LIST, fetchNotices, listRows, pageParts, toNotice, MAX_PAGES };
