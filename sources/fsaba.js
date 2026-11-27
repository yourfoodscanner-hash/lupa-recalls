'use strict';
/**
 * Bosnia and Herzegovina — the Food Safety Agency of BiH (Agencija za sigurnost hrane BiH, fsa.gov.ba):
 * the posts of its category "Povlačenje i opoziv hrane", read through the site's own WordPress API
 * (one request; the posts come with their whole text).
 *
 * Seen on the live data (26 Nov 2026, 102 posts since 2019, one or two a month): the category holds
 * the Agency's own recall notices ("Obavijest o povlačenju …", "Povlačenje i opoziv …"), EU RASFF and
 * INFOSAN notices about products that reached BiH — and a few posts that are not recalls (a ban on an
 * import, a border rejection, stepped-up controls, an addition to an earlier post). Only the first
 * three kinds are taken. The texts are written freely: a reason is taken only where its words name a
 * hazard (lib/classify), batches, dates and barcodes only where they are labeled (lib/text).
 *
 * Taken: food, food for infants, food supplements. Kitchenware (materials in contact with food) and
 * pet food are posts of the same category that LUPA does not show.
 */
const { htmlToText, oneLine, idOf, cut, labeledGtins, labeledLots, labeledDates, becauseClause, labeledValue, alignedFold } = require('../lib/text');
const { getJson } = require('../lib/http');
const { hazardOf, sentenceNaming } = require('../lib/classify');
const { hostOf } = require('../lib/contract');

const NAME = 'fsaba';
const PREFIX = 'ba-fsa-';
const COUNTRY = 'BA';
const SOURCE = 'Agencija za sigurnost hrane BiH';
const HOST = 'fsa.gov.ba';
const CATEGORY = 238;   // "Povlačenje i opoziv hrane"
const API = `https://fsa.gov.ba/wp-json/wp/v2/posts?categories=${CATEGORY}&per_page=50&_fields=id,date,link,title,content`;

const INCLUDE = /povla[cč]|opoziv|rasff|infosan/i;
const EXCLUDE = /odbijanj|s granice|na granici|zabran[a-z]* uvoz|uvoz[a-z]* zabran|poja[cč]an[a-z]* (?:mjer|kontrol)|dopuna informacij|potencijalnom riziku/i;
const ALERT = /^(?:eu\s+)?(?:rasff|infosan)\b[^:]*:\s*/i;
const PET = /(?<![a-z])(?:za pse|za psa|za macke|za zivotinje|kucn[a-z]* ljubim|psec[a-z]*)(?![a-z])/;
const KITCHENWARE = /kasik|kasick|kalup|zdjel|posud|pribor|(?<![a-z])tav[aeu](?![a-z])|(?<![a-z])cas[aeu](?![a-z])|salic|tanjur|premaz|migracij|keramick/;

const unquote = (s) => s.replace(/[„“”"«»]/g, '').replace(/\s+/g, ' ').trim();
/** "Obavijest o povlačenju i opozivu određenih serija „Bebelac 1“, 400 g, Nutricia" → "Bebelac 1, 400 g, Nutricia". */
function nameOf(title) {
  const subject = title.replace(ALERT, '').trim();
  return unquote(subject.replace(/^(?:obavijest\s+o\s+)?(?:(?:preventivnom|dobrovoljnom)\s+)?(?:povla[cč]enj[a-z]*|opoziv[a-z]*)(?:\s+i\s+(?:povla[cč]enj[a-z]*|opoziv[a-z]*))?(?:\s+s\s+tr[zž]i[sš]ta)?(?:\s+odre[dđ]enih\s+(?:serija|lotova|proizvoda))?(?:\s+proizvoda)?\s*[:–—-]?\s*/i, ''));
}

/** "Razlog povlačenja i opoziva je utvrđeno prisustvo stranog tijela (šaraf) u proizvodu …" → "utvrđeno prisustvo stranog tijela (šaraf) u proizvodu …". */
function statedReason(text) {
  const m = /(?:^|[.!?]\s+|\n)(?:kao\s+)?razlog[a-z]*(?:\s+(?:povla[cč]enj[a-z]*|opoziv[a-z]*)(?:\s+i\s+(?:povla[cč]enj[a-z]*|opoziv[a-z]*))?)?(?:\s+u\s+obavijesti)?\s+(?:je|se\s+navodi(?:\s+da)?|navodi\s+se(?:\s+da)?)\s+([^\n]+?)(?:[.!?](?=\s|$)|\n|$)/i.exec(String(text ?? ''));
  return m && m[1].length >= 6 ? m[1].trim() : null;
}

/** "… sljedećih proizvoda …:\nNŽ COOKIES NOISETTE 145G, serija 1207483391, …" → "NŽ COOKIES NOISETTE 145G" (the first product listed). */
function listedFirst(text) {
  const lines = String(text ?? '').split('\n');
  const at = lines.findIndex((l) => /proizvod[a-z]*\b[^\n]*:\s*$/i.test(l));
  if (at < 0 || at + 1 >= lines.length) return null;
  const v = lines[at + 1].split(/,\s*(?:serij|lot|s rok|rok|datum)/i)[0].trim();
  return v.length >= 2 && v.length <= 120 ? v : null;
}

/** "… zato što „za seriju proizvoda postoji mogućnost napuhnutih doza“ …" → the quoted words. */
function quotedReason(text) {
  const m = /(?<![a-zčćšžđ])(?:jer|zato [sš]to|budu[cć]i da)\s*[„"“,]{1,2}([^“”"„]{6,300})[“”"]/i.exec(String(text ?? ''));
  return m ? m[1].trim() : null;
}

/** Words after "zbog …" — only when they name a hazard ("zbog uništenja" does not). */
function namedBecause(text) {
  const c = becauseClause(text);
  return c && hazardOf(c) !== 'other' ? c : null;
}

function toNotice(post) {
  if (!post || typeof post !== 'object') return { skip: 'post nije objekat' };
  const title = oneLine(post.title && post.title.rendered);
  if (!INCLUDE.test(title) || EXCLUDE.test(title)) return { skip: 'nije obavijest o povlačenju' };
  if (hostOf(post.link) !== HOST) return { skip: 'link ne vodi na fsa.gov.ba' };
  const id = Number.isInteger(post.id) ? `${PREFIX}${post.id}` : idOf(PREFIX, String(post.link));
  const day = /^(\d{4}-\d{2}-\d{2})T/.exec(String(post.date ?? ''));
  if (!id || !day) return { skip: 'bez oznake ili datuma' };
  const body = htmlToText(post.content && post.content.rendered).split('\n').filter((l) => !/appeared first on/i.test(l)).join('\n');
  const name = nameOf(title).length >= 2 ? nameOf(title) : unquote(labeledValue(body, 'naziv proizvoda', 120) ?? listedFirst(body) ?? '');
  if (name.length < 2) return { skip: 'bez naziva' };
  const n = alignedFold(name);
  if (PET.test(n) || KITCHENWARE.test(n)) return { skip: 'posuđe ili hrana za životinje (LUPA ne prikazuje)' };
  const alert = ALERT.test(title);
  const subjectReason = alert ? name.split(/\s+(?:u|uslijed|zbog)\s+/)[0] : null;
  const reason = (subjectReason && subjectReason !== name ? subjectReason : null) ?? labeledValue(body, 'opasnost', 160) ?? statedReason(body) ?? quotedReason(body) ?? namedBecause(body) ?? sentenceNaming(body) ?? becauseClause(body, ['jer']) ?? (alert ? name : null);
  if (!reason) return { skip: 'bez razloga' };
  const all = alignedFold(`${name}\n${body}`);
  const category = /dojenc|za bebe|djecj[a-z]* hran|kasic[ae]|pocetn[a-z]* (?:hran|formul)|formul[a-z]* za/.test(all.slice(0, 600)) ? 'baby'
    : /dodac[a-z]* prehrani|dodatak prehrani|dodatka prehrani|dijetetsk/.test(all.slice(0, 600)) ? 'supplement' : 'food';
  const lots = labeledLots(body);
  const dates = labeledDates(`${title}\n${body}`);
  const first = body.split('\n').find((l) => l.length > 60) ?? body;
  return {
    notice: {
      id, country: COUNTRY, published: day[1], category, hazard: hazardOf(reason, body),
      name: cut(name, 160), reason: cut(reason, 160),
      details: first ? cut(first, 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      source: SOURCE, url: String(post.link), gtins: labeledGtins(body).slice(0, 50),
    },
  };
}

/** Reads the category. Resolves to { notices, seen, skipped }; throws when the answer is not a list of posts. */
async function fetchNotices({ fetchImpl = fetch, url = API, since = '2000-01-01', userAgent } = {}) {
  const posts = await getJson(fetchImpl, url, { userAgent });
  if (!Array.isArray(posts)) throw new Error('odgovor nije lista objava');
  if (posts.length === 0) throw new Error('kategorija je prazna');
  if (!posts.every((p) => p && p.title && typeof p.title.rendered === 'string' && p.content && typeof p.content.rendered === 'string' && typeof p.link === 'string' && typeof p.date === 'string')) {
    throw new Error(`objave nisu u obliku koji adapter poznaje (polja prve: ${Object.keys(posts[0] ?? {}).join(', ')})`);
  }
  const skipped = {};
  const notices = [];
  for (const post of posts) {
    const out = toNotice(post);
    if (out.skip) { skipped[out.skip] = (skipped[out.skip] ?? 0) + 1; continue; }
    if (out.notice.published < since) { skipped['starije od prozora'] = (skipped['starije od prozora'] ?? 0) + 1; continue; }
    notices.push(out.notice);
  }
  return { notices, seen: posts.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: API, fetchNotices, toNotice, nameOf, statedReason, quotedReason };
