'use strict';
/**
 * Poland — GIS (Główny Inspektorat Sanitarny, the chief sanitary inspectorate), "Ostrzeżenia": the public
 * warnings about food that the inspectorate publishes on gov.pl.
 *
 * Seen on the live data (27 Nov 2026): the list, newest first, 10 a page ("?page=1&size=10" is the first),
 * each row a day ("26.11.2026") and a title ("Ostrzeżenie publiczne dotyczące żywności: wykrycie obecności
 * bakterii Listeria monocytogenes w filetach śledziowych w oleju"). Warnings about kitchenware
 * ("… dotyczące wyrobu do kontaktu z żywnością") are on the same list and are left out; updates
 * ("Aktualizacja ostrzeżenia publicznego dotyczącego żywności …") are kept as notices of their own. The page
 * of a warning has the sections "Zagrożenie:", "Szczegóły dotyczące produktów:" (labeled: "Nazwa produktu:",
 * "Numer partii:", "Termin przydatności do spożycia:" …) and "Zalecenia dla konsumentów".
 *
 * A page is read only for a warning not read before (`known`). Batches, dates and barcodes: only where
 * the page labels them (lib/text).
 */
const { htmlToText, oneLine, dayOfDotted, idOf, cut, labeledGtins, labeledLots, labeledDates, labeledValue, firstSentence, alignedFold } = require('../lib/text');
const { getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');

const NAME = 'gis';
const PREFIX = 'pl-gis-';
const COUNTRY = 'PL';
const SOURCE = 'Główny Inspektorat Sanitarny';
const SITE = 'https://www.gov.pl';
const LIST = `${SITE}/web/gis/ostrzezenia`;
const MAX_LIST_PAGES = 6;
const MAX_PAGES = 40;

/** A warning about food (folded title), not about kitchenware or anything else. */
const ABOUT_FOOD = /dotycz[a-z]* zywnosci/;

/** The rows of a page of the list. Throws when the page is not the list. */
function listRows(html) {
  const page = String(html ?? '');
  if (!/class="art-prev/.test(page)) throw new Error('stranica nije lista ostrzeżeń (format se promijenio?)');
  const rows = [];
  for (const m of page.matchAll(/<span class="date">\s*([^<]*?)\s*<\/span>[\s\S]{0,400}?<div class="title">\s*<a href="(\/web\/gis\/[^"?#]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const slug = m[2].split('/').pop();
    rows.push({ slug, url: SITE + m[2], day: dayOfDotted(m[1]), title: oneLine(m[3]) });
  }
  return rows;
}

/** The id: the page's address without the words every warning starts with. */
function idOfSlug(slug) {
  return idOf(PREFIX, String(slug).replace(/^ostrzezenie-publiczne-dotyczace-zywnosci-/, ''));
}

/** The text of a section: from its heading to the next of the known headings. */
function section(text, heading) {
  const folded = alignedFold(text);
  const at = folded.search(heading);
  if (at < 0) return '';
  const from = at + folded.slice(at).indexOf('\n') + 1;
  if (from <= at) return '';
  const next = folded.slice(from).search(/^(?:zagrozenie|szczegoly dotyczace produkt|dzialania podjete|zalecenia dla konsument|informacje (?:dla konsument|na temat)|zdjecia \()/m);
  return text.slice(from, next < 0 ? undefined : from + next).trim();
}

/** A warning's page → its text, or null when it is not a warning. */
function pageText(html) {
  const page = String(html ?? '');
  const m = /<article class="article-area__article[^"]*"[^>]*>([\s\S]*?)<\/article>/.exec(page);
  if (!m || !/class="event-date"/.test(m[1])) return null;
  return htmlToText(m[1]);
}

function categoryOf(text) {
  const f = alignedFold(text ?? '');
  if (/suplement[a-z]* diety/.test(f)) return 'supplement';
  if (/niemowl|dla dzieci|mleko modyfikowane|mleko poczatkowe|zywnosc dla dzieci/.test(f)) return 'baby';
  return 'food';
}

/** One row and its page → a notice (unchecked), or { skip }. */
function toNotice(row, text) {
  const products = section(text, /^szczegoly dotyczace produkt[a-z]*:?/m);
  const hazard = section(text, /^zagrozenie:?/m);
  const advice = section(text, /^zalecenia dla konsument[a-z]*:?/m);
  const named = products || text;
  const name = labeledValue(named, 'nazwa (?:produktu|handlowa(?: produktu)?|srodka spozywczego)', 160);
  if (!name) return { skip: 'bez naziva proizvoda' };
  const why = row.title.includes(':') ? row.title.slice(row.title.indexOf(':') + 1).trim() : '';
  const reason = cut(why.charAt(0).toUpperCase() + why.slice(1), 160);
  if (!reason) return { skip: 'bez razloga' };
  const lots = labeledLots(named);
  const dates = labeledDates(named);
  return {
    notice: {
      id: idOfSlug(row.slug), country: COUNTRY, published: row.day, category: categoryOf(`${row.title}\n${text}`),
      hazard: hazardOf(reason, text),
      name: cut(name, 160), brand: labeledValue(named, 'marka', 60) ?? undefined, reason,
      details: hazard ? cut(hazard.replace(/\n+/g, ' '), 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      action: advice ? (firstSentence(advice, 500) ?? undefined) : undefined,
      source: SOURCE, url: row.url, gtins: labeledGtins(named).slice(0, 50),
    },
  };
}

/** Reads the list. Resolves to { notices, seen, skipped }; throws when the list is not as described above. */
async function fetchNotices({ fetchImpl = fetch, url = LIST, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const rows = [];
  for (let n = 1; n <= MAX_LIST_PAGES; n++) {
    const got = listRows(await getText(fetchImpl, `${url}?page=${n}&size=10`, { userAgent }));
    if (n === 1 && got.length === 0) throw new Error('lista ostrzeżeń je prazna (format se promijenio?)');
    if (n === 1 && !got.some((r) => r.day)) throw new Error('redovi liste nemaju datum (format se promijenio?)');
    const fresh = got.filter((r) => !rows.some((x) => x.slug === r.slug));
    rows.push(...fresh);
    if (fresh.length === 0 || got.some((r) => r.day && r.day < since)) break;
  }
  const notices = [];
  const toRead = [];
  for (const row of rows) {
    if (!row.day) { count('bez datuma'); continue; }
    if (row.day < since) { count('starije od prozora'); continue; }
    if (!ABOUT_FOOD.test(alignedFold(row.title))) { count('nije hrana (posuđe, druge obavijesti)'); continue; }
    const k = known.get(idOfSlug(row.slug));
    if (k && k.published === row.day) notices.push(k);
    else toRead.push(row);
  }
  const now = toRead.slice(0, MAX_PAGES);
  const pages = await mapLimit(now, 2, async (row) => pageText(await getText(fetchImpl, row.url, { userAgent })));
  let odd = 0;
  let read = 0;
  now.forEach((row, i) => {
    if (!pages[i].ok) { count('stranica nije pročitana (pokušava se sljedeći put)'); return; }
    if (pages[i].value === null) { odd += 1; count('stranica nije u obliku ostrzeżenia'); return; }
    read += 1;
    const out = toNotice(row, pages[i].value);
    if (out.skip) count(out.skip);
    else notices.push(out.notice);
  });
  if (odd > 0 && read === 0) throw new Error(`nijedna pročitana stranica nije u obliku ostrzeżenia (${odd}) — format se promijenio?`);
  for (let i = MAX_PAGES; i < toRead.length; i++) count('stranica ostavljena za sljedeće pokretanje');
  return { notices, seen: rows.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: LIST, fetchNotices, listRows, pageText, section, toNotice, idOfSlug, MAX_PAGES };
