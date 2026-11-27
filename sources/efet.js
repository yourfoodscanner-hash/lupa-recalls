'use strict';
/**
 * Greece — EFET (Ε.Φ.Ε.Τ., the Hellenic Food Authority), its press releases in the category
 * "Ανακλήσεις" (recalls). Read from the category's RSS feed (the newest ten, with their day), the
 * category's list (newest first) and the page of each release.
 *
 * Seen on the live data (27 Nov 2026, 527 releases): a release is prose — "ΔΕΛΤΙΟ ΤΥΠΟΥ", the place
 * and day ("Αθήνα, 25 Νοεμβρίου 2026"), a title naming the product, and a paragraph that names the
 * product, its batch ("αριθμό παρτίδας Lot 18726", "παρτίδα L07 26 27") and its date ("ημερομηνία
 * ανάλωσης 06/07/2027"), and what was found ("διαπιστώθηκε η παρουσία …"). Only labeled batches and
 * dates are taken (lib/text). EFET also recalls kitchenware (spoons, straws): those are left out.
 *
 * A page is read only for a release not read before (`known`); the list is read down to the first
 * release older than the window.
 */
const { rssItems, htmlToText, oneLine, dayIn, idOf, cut, labeledGtins, labeledLots, labeledDates, becauseClause, firstSentence, alignedFold } = require('../lib/text');
const { getText } = require('../lib/http');
const { hazardOf, sentenceNaming } = require('../lib/classify');
const { hostOf } = require('../lib/contract');

const NAME = 'efet';
const PREFIX = 'gr-efet-';
const COUNTRY = 'GR';
const SOURCE = 'ΕΦΕΤ';
const HOST = 'efet.gr';
const BASE = 'https://www.efet.gr';
const CATEGORY = `${BASE}/index.php/el/enimerosi/deltia-typou/anakleiseis-cat`;
const FEED = `${CATEGORY}?format=feed&type=rss`;
const TIME_ZONE = 'Europe/Athens';
const MAX_PAGES = 30;

const MONTHS = ['ιανουαριου', 'φεβρουαριου', 'μαρτιου', 'απριλιου', 'μαιου', 'ιουνιου', 'ιουλιου', 'αυγουστου', 'σεπτεμβριου', 'οκτωβριου', 'νοεμβριου', 'δεκεμβριου'];

/** ".../anakleiseis-cat/item/5431-deltio-typou-…" → "5431". */
function numberOfLink(link) {
  if (hostOf(link) !== HOST) return null;
  const m = /\/anakleiseis-cat\/item\/(\d+)-/.exec(String(link));
  return m ? m[1] : null;
}

/** The releases the category's list links to, newest first: [{ number, link, title }]. Throws when the page is not the list. */
function listLinks(html) {
  const page = String(html ?? '');
  if (!/id="k2Container"[^>]*class="itemListView"/i.test(page)) throw new Error('stranica nije lista kategorije „Ανακλήσεις” (format se promijenio?)');
  const out = [];
  for (const m of page.matchAll(/<h3 class="catItemTitle">\s*<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const link = new URL(m[1], BASE).href;
    const number = numberOfLink(link);
    if (number && !out.some((x) => x.number === number)) out.push({ number, link, title: oneLine(m[2]) });
  }
  return out;
}

/** The release's page → { title, text, day } (text: the release's words, plain), or null when it is not a release. */
function pageParts(html) {
  const page = String(html ?? '');
  const title = oneLine((/<h2 class="itemTitle">([\s\S]*?)<\/h2>/i.exec(page) ?? [])[1] ?? '');
  const body = /<div class="itemFullText">([\s\S]*?)<div class="itemContentFooter">/i.exec(page);
  if (!title || !body) return null;
  const lines = htmlToText(body[1]).split('\n').filter((l) => !/^(?:Βρίσκεστε εδώ|Αρχική|Ενημέρωση|Δελτία Τύπου|ΔΕΛΤΙΟ ΤΥΠΟΥ)\s*:?\s*$/iu.test(l));
  const dated = lines.find((l) => /^[Α-ΩΆ-Ώα-ωά-ώ .]+,\s*\d{1,2}\s+[Α-ΩΆ-Ώα-ωά-ώ]+\s+\d{4}$/.test(l));
  let day = null;
  if (dated) {
    const m = /(\d{1,2})\s+(\S+)\s+(\d{4})$/.exec(alignedFold(dated));
    const month = m ? MONTHS.indexOf(m[2]) : -1;
    if (m && month >= 0) day = `${m[3]}-${String(month + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  }
  const text = lines.filter((l) => l !== dated).join('\n');
  return { title, text, day };
}

/** "ΔΕΛΤΙΟ ΤΥΠΟΥ: Ανάκληση μη ασφαλούς τροφίμου: ΜΠΙΦΤΕΚΙ …" → "ΜΠΙΦΤΕΚΙ …"; "… Ανάκληση τυριού Brie" → "Τυριού Brie". */
function titleName(title) {
  let t = String(title ?? '').replace(/^\s*ΔΕΛΤΙΟ ΤΥΠΟΥ\s*:\s*/i, '');
  const f = alignedFold(t);
  const head = /^(?:(?:ενημερωση|συμπληρωματικη ανακοινωση)(?:\s+(?:σχετικα με|για)\s+(?:την|τη))?\s+)?(?:επεκταση\s+)?ανακλησ[α-ω]*(?:\s+(?:του|της|των))?(?:\s+(?:μη\s+)?(?:ασφαλ[α-ω]*|επικινδυν[α-ω]*))?(?:\s+(?:προιον[α-ω]*|τροφιμ[α-ω]*))?\s*[:\-–]?\s*(?:(?:σε|του|της|των|στο|στη|στον|στην)\s+)?/.exec(f);
  if (head) t = t.slice(head[0].length);
  const because = alignedFold(t).search(/\s(?:λογω|εξαιτιας)\s/);
  if (because > 0) t = t.slice(0, because);
  t = t.trim().replace(/[.,;:\s]+$/, '');
  const wrapped = /^[(«"“]\s*([^()«»"“”]+?)\s*[)»"”]$/.exec(t);
  if (wrapped) t = wrapped[1].trim();
  return t ? t[0].toUpperCase() + t.slice(1) : '';
}

/** A trade name the release quotes: "εμπορικής ονομασίας ‘Rice Up Parmesan Rice Cakes’" → "Rice Up Parmesan Rice Cakes". */
function tradeName(text) {
  const m = /(?:εμπορικ[ήής]+ ονομασ[ίι]ας?|εμπορικ[όο] σήμα|με την ονομασία)\s*[‘'"«“]([^’'"»”]{2,80})[’'"»”]/i.exec(String(text ?? ''));
  return m ? m[1].trim() : null;
}

/** Kitchenware and other things that are not food (folded). */
const NOT_FOOD = /κουταλ|καλαμακ|μαχαιροπιρουν|πιρουν|σκευ|ποτηρ|πιατ|κατσαρολ|τηγαν|δοχει|μπιμπερ|πιπιλ|μπαμπου|μελαμιν|υλικ[α-ω]* (?:και αντικειμεν[α-ω]* )?(?:που )?(?:προοριζ|σε επαφη)/;

function categoryOf(text) {
  const f = alignedFold(text ?? '');
  if (/βρεφικ|για βρεφη|παιδικ[α-ω]* τροφ|παρασκευασμα[α-ω]* για βρεφ/.test(f)) return 'baby';
  if (/συμπληρωμ[α-ω]* διατροφης/.test(f)) return 'supplement';
  return 'food';
}

/** One release → a notice (unchecked), or { skip }. */
function toNotice(number, link, parts, day) {
  const title = parts.title;
  if (NOT_FOOD.test(alignedFold(title))) return { skip: 'nije hrana (posuđe i sl.)' };
  const name = cut(tradeName(parts.text) ?? titleName(title), 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const text = parts.text;
  const found = becauseClause(text, ['διαπιστωθηκε', 'διαπιστωθηκαν', 'ανιχνευθηκε', 'ανιχνευθηκαν', 'ενημερωνει τους καταναλωτες για']);
  const reason = cut((found ? found.replace(/^(?:η|ο|το|οι|τα|την|τη|τον|ότι|οτι)\s+/i, '') : null) ?? becauseClause(title, ['λογω']) ?? sentenceNaming(text) ?? '', 160);
  if (!reason) return { skip: 'bez razloga' };
  const paragraphs = text.split('\n').filter((l) => !/^(?:Ανάκληση|Επέκταση ανάκλησης)(?!\p{L})/iu.test(l) && l.length > 40);
  const action = paragraphs.find((l) => /καλουνται οι καταναλωτες/.test(alignedFold(l)));
  const details = paragraphs.filter((l) => l !== action).join(' ');
  const lots = labeledLots(text);
  const dates = labeledDates(text);
  return {
    notice: {
      id: idOf(PREFIX, number), country: COUNTRY, published: day, category: categoryOf(`${title}\n${text}`), hazard: hazardOf(reason, title, text),
      name, reason,
      details: details ? cut(details, 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      action: action ? cut(action, 500) : undefined,
      source: SOURCE, url: link, gtins: labeledGtins(text).slice(0, 50),
    },
  };
}

/** Reads the category. Resolves to { notices, seen, skipped }; throws when the feed or the list is not as described above. */
async function fetchNotices({ fetchImpl = fetch, url = FEED, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const feedDay = new Map();
  const releases = [];
  for (const item of rssItems(await getText(fetchImpl, url, { userAgent }))) {
    const number = numberOfLink(item.link);
    if (!number) { count('stavka feeda nije obavijest o povlačenju'); continue; }
    const day = dayIn(item.pubDate, TIME_ZONE);
    if (day) feedDay.set(number, day);
    if (!releases.some((r) => r.number === number)) releases.push({ number, link: item.link, title: item.title });
  }
  for (const r of listLinks(await getText(fetchImpl, CATEGORY, { userAgent }))) if (!releases.some((x) => x.number === r.number)) releases.push(r);
  releases.sort((a, b) => Number(b.number) - Number(a.number));
  const notices = [];
  let pagesRead = 0;
  let notRelease = 0;
  for (const r of releases) {
    if (NOT_FOOD.test(alignedFold(titleName(r.title)))) { count('nije hrana (posuđe i sl.)'); continue; }
    const k = known.get(idOf(PREFIX, r.number));
    if (k) {
      if (k.published < since) break;
      notices.push(k);
      continue;
    }
    if (pagesRead >= MAX_PAGES) { count('stranica ostavljena za sljedeće pokretanje'); continue; }
    pagesRead += 1;
    let parts;
    try {
      parts = pageParts(await getText(fetchImpl, r.link, { userAgent }));
    } catch {
      count('stranica nije pročitana (pokušava se sljedeći put)');
      continue;
    }
    if (parts === null) { notRelease += 1; count('stranica nije u obliku saopćenja'); continue; }
    const day = parts.day ?? feedDay.get(r.number) ?? null;
    if (!day) { count('bez datuma'); continue; }
    if (day < since) { count('starije od prozora'); break; }
    const out = toNotice(r.number, r.link, parts, day);
    if (out.skip) count(out.skip);
    else notices.push(out.notice);
  }
  if (notRelease > 0 && notRelease === pagesRead) throw new Error(`nijedna pročitana stranica nije u obliku saopćenja (${notRelease}) — format se promijenio?`);
  return { notices, seen: releases.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: FEED, fetchNotices, listLinks, pageParts, titleName, tradeName, categoryOf, toNotice, MAX_PAGES };
