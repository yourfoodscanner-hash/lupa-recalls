'use strict';
/**
 * Czechia — "Potraviny na pranýři", the inspection authorities' (SZPI, SVS) public list of foods found
 * to break food law. Only its "Nebezpečné potraviny" (unsafe foods) are taken — not the ones that are
 * only of poor quality or falsely described — and only those sold to consumers in shops: a dish found
 * in a restaurant is not a product anyone can buy or scan.
 *
 * Seen on the live data (27 Nov 2026): the list of unsafe foods still on the site ("archive=actual"),
 * newest first, 50 rows a page, each row with the product, its group, the day it was published, the
 * kind of place it was found in (an icon: "Restaurace", "Maloobchod", "Internetový obchod" …) and the
 * producer. The page of each food has the measured parameter that failed ("Nevyhovující parametr"),
 * the inspectors' comment, and a table of labeled fields ("Šarže:", "Datum použitelnosti:" …).
 *
 * A page is read only for a food not read before (`known`).
 */
const { htmlToText, oneLine, dayOfDotted, idOf, cut, labeledGtins, firstSentence, alignedFold } = require('../lib/text');
const { getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');

const NAME = 'pranyr';
const PREFIX = 'cz-pranyr-';
const COUNTRY = 'CZ';
const SITE = 'https://www.potravinynapranyri.cz/';
const LIST = `${SITE}Search.aspx?scategory=3&ext=y&lang=cs&design=default&archive=actual&listtype=table`;
const MAX_LIST_PAGES = 8;
const MAX_PAGES = 60;

/** Places that serve food rather than sell products (folded). */
const FOOD_SERVICE = /restaura|stravov|obcerstv|jideln|kantyn|bistro|bufet|catering|kavarn|hostin|pizzer|cukrar|hotel|skolni|nemocni/;

/** The rows of a page of the list. Throws when the page is not the list. */
function listRows(html) {
  const page = String(html ?? '');
  const table = /<table\b[^>]*id="MainContent_gvDocListTable"[^>]*>([\s\S]*?)<\/table>/i.exec(page);
  if (!table) {
    if (/MainContent_(?:lblNoResults|pnlNoResults)|Nebyl[ay]? nalezen/i.test(page)) return [];
    throw new Error('stranica liste nije tabela nebezpečnih potravina (format se promijenio?)');
  }
  const rows = [];
  for (const m of table[1].matchAll(/<tr\b[^>]*onclick="[^"]*Detail\.aspx\?id=(\d+)[^"]*"[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...m[2].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((c) => c[1]);
    if (cells.length < 8) continue;
    const title = (cell) => oneLine((/title="([^"]*)"/i.exec(cell) ?? [])[1] ?? '');
    rows.push({
      id: m[1],
      category: title(cells[1]),
      name: oneLine(cells[2]),
      group: oneLine(cells[3]),
      day: dayOfDotted(oneLine(cells[4])),
      place: title(cells[5]),
      producer: oneLine(cells[7]),
    });
  }
  return rows;
}

/** The labeled fields of a food's page (labels folded, without ":"), plus the failed parameters and the comment. null when not a food's page. */
function pageFields(html) {
  const page = String(html ?? '');
  if (!/id="MainContent_pnlDocDetail"/i.test(page)) return null;
  const fields = {};
  for (const m of page.matchAll(/<tr\b[^>]*id="MainContent_pnlDocDetail\w+"[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const label = alignedFold(oneLine((/<span[^>]*class="itname"[^>]*>([\s\S]*?)<\/span>/i.exec(m[1]) ?? [])[1] ?? '')).replace(/:\s*$/, '').trim();
    const value = oneLine((/<td\b[^>]*class="c2"[^>]*>([\s\S]*?)<\/td>/i.exec(m[1]) ?? [])[1] ?? '');
    if (label && value && !(label in fields)) fields[label] = value;
  }
  const brief = /id="MainContent_pnlDocDetailLaboratoryBrief"[^>]*>([\s\S]*?)<div id="MainContent_pnlDocDetailLaboratoryBriefComment"/i.exec(page);
  const params = brief ? [...brief[1].matchAll(/<div class="param">([\s\S]*?)<\/div>/gi)].map((p) => oneLine(p[1])).filter(Boolean) : [];
  const comment = htmlToText((/id="MainContent_pnlDocDetailLaboratoryBriefComment"[^>]*>([\s\S]*?)<\/div>/i.exec(page) ?? [])[1] ?? '').replace(/\n/g, ' ').trim();
  const info = oneLine((/id="lblDocDetailSupervisorAuthorityInfo"[^>]*>([\s\S]*?)<\/span>/i.exec(page) ?? [])[1] ?? '');
  const name = oneLine((/id="MainContent_lblDocDetailProductName"[^>]*>([\s\S]*?)<\/span>/i.exec(page) ?? [])[1] ?? '');
  return { fields, params, comment, info, name };
}
const field = (fields, start) => { for (const [k, v] of Object.entries(fields)) if (k.startsWith(start)) return v; return null; };

/** "Vzorek byl zjištěn úřední kontrolou Státní zemědělské a potravinářské inspekce." → who found it, in the site's words. */
function sourceOf(info) {
  const m = /kontrolou\s+(.+?)\.?$/i.exec(String(info ?? ''));
  if (!m) return 'Potraviny na pranýři';
  const who = m[1].trim();
  if (/zemědělské a potravinářské inspekce/i.test(who)) return 'Státní zemědělská a potravinářská inspekce';
  if (/veterinární správ/i.test(who)) return 'Státní veterinární správa';
  return cut(who, 120);
}

/** The group of foods → the app's category, or null for prepared dishes (not a product on a shelf). */
function categoryOf(group, name) {
  const g = alignedFold(group ?? '');
  if (/^pokrmy/.test(g)) return null;
  const f = `${g} ${alignedFold(name ?? '')}`;
  if (/doplnk[a-z]* stravy/.test(f)) return 'supplement';
  if (/kojen|pocatecni mlec|pokracovaci mlec|pro deti|detsk[a-z]* vyziv|prikrm/.test(f)) return 'baby';
  return 'food';
}

/** "údaj uvedený na obalu: B 5K32535" → "B 5K32535"; "neuvedeno" → null. */
function batchOf(value) {
  const v = String(value ?? '').replace(/^\s*údaj\s+uveden[ýá]\s+na\s+obalu\s*:\s*/i, '').trim();
  if (!v || !/\d/.test(v) || /^(?:neuveden|nen[ií] uveden)/i.test(v)) return null;
  return v;
}

/** One row of the list and its page → a notice (unchecked), or { skip }. */
function toNotice(row, page) {
  if (!/nebezpe/i.test(row.category)) return { skip: 'nije među nebezpečnim potravinama' };
  if (FOOD_SERVICE.test(alignedFold(row.place))) return { skip: 'pronađeno u ugostiteljstvu, ne u prodaji' };
  const category = categoryOf(row.group, row.name);
  if (category === null) return { skip: 'gotovo jelo, ne proizvod iz prodaje' };
  const name = cut(page.name || row.name, 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  // the inspectors' own sentence says what was wrong; the measured parameter alone ("kofein") when there is none
  const reason = firstSentence(page.comment, 160) ?? (page.params.length ? cut(page.params.join(', '), 160) : null);
  if (!reason) return { skip: 'bez razloga' };
  const lots = batchOf(field(page.fields, 'sarze'));
  const dates = Object.entries(page.fields).filter(([k]) => /^datum (?:pouzitelnosti|minimalni trvanlivosti)/.test(k)).map(([, v]) => v);
  const marks = Object.entries(page.fields).filter(([k]) => /ean|carov/.test(k)).map(([k, v]) => `EAN ${v} ${k}`).join('\n');
  return {
    notice: {
      id: idOf(PREFIX, row.id), country: COUNTRY, published: row.day, category, hazard: hazardOf(page.params.join(', '), reason, page.comment),
      name, reason,
      details: page.comment ? cut(page.comment, 800) : undefined,
      lots: lots ? cut(lots, 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      source: sourceOf(page.info), url: `${SITE}Detail.aspx?id=${row.id}`,
      gtins: labeledGtins(marks).slice(0, 50),
    },
  };
}

/** Reads the list. Resolves to { notices, seen, skipped }; throws when the list is not as described above. */
async function fetchNotices({ fetchImpl = fetch, url = LIST, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const rows = [];
  for (let n = 1; n <= MAX_LIST_PAGES; n++) {
    const got = listRows(await getText(fetchImpl, n === 1 ? url : `${url}&page=${n}`, { userAgent }));
    if (n === 1 && got.length > 0 && !got.some((r) => r.day)) throw new Error('redovi liste nemaju datum objave (format se promijenio?)');
    const fresh = got.filter((r) => !rows.some((x) => x.id === r.id));
    rows.push(...fresh);
    if (fresh.length === 0 || got.some((r) => r.day && r.day < since)) break;
  }
  const wanted = [];
  for (const row of rows) {
    if (!row.day) { count('bez datuma'); continue; }
    if (row.day < since) { count('starije od prozora'); continue; }
    if (!/nebezpe/i.test(row.category)) { count('nije među nebezpečnim potravinama'); continue; }
    if (FOOD_SERVICE.test(alignedFold(row.place))) { count('pronađeno u ugostiteljstvu, ne u prodaji'); continue; }
    if (categoryOf(row.group, row.name) === null) { count('gotovo jelo, ne proizvod iz prodaje'); continue; }
    wanted.push(row);
  }
  const notices = [];
  const toRead = [];
  for (const row of wanted) {
    const k = known.get(idOf(PREFIX, row.id));
    if (k && k.published === row.day) notices.push(k);
    else toRead.push(row);
  }
  const now = toRead.slice(0, MAX_PAGES);
  const pages = await mapLimit(now, 2, async (row) => pageFields(await getText(fetchImpl, `${SITE}Detail.aspx?id=${row.id}`, { userAgent })));
  let notFood = 0;
  let read = 0;
  now.forEach((row, i) => {
    if (!pages[i].ok) { count('stranica nije pročitana (pokušava se sljedeći put)'); return; }
    if (pages[i].value === null) { notFood += 1; count('stranica nije u obliku detalja'); return; }
    read += 1;
    const out = toNotice(row, pages[i].value);
    if (out.skip) count(out.skip);
    else notices.push(out.notice);
  });
  if (notFood > 0 && read === 0) throw new Error(`nijedna pročitana stranica nije u obliku detalja (${notFood}) — format se promijenio?`);
  for (let i = MAX_PAGES; i < toRead.length; i++) count('stranica ostavljena za sljedeće pokretanje');
  return { notices, seen: rows.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: 'Potraviny na pranýři', defaultUrl: LIST, fetchNotices, listRows, pageFields, toNotice, categoryOf, batchOf, sourceOf, MAX_PAGES };
