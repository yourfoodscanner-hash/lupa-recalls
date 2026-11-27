'use strict';
/**
 * Kosovo — Agjencia e Ushqimit dhe Veterinarisë (AUV), the Food and Veterinary Agency: its news
 * (https://auvk.rks-gov.net), read through the site's own WordPress API.
 *
 * Seen on the live data (27 Nov 2026): one list of news, newest first, a few recalls a year among news
 * of animal diseases and import bans. The text of most news is not in the page but in a Word document
 * the page shows (an Office viewer whose address carries the document's: …/wp-content/uploads/….docx).
 * The document: the agency's letterhead, "Prishtinë, 26.09.2026", the title ("Produkti ushqimore
 * “Flips Ketchup” … tërhiqet nga tregu"), then the text — the RASFF notification it follows ("nr.
 * 2026.8267"), the product, "Lot FK 04/26", "datë skadimi: 05.01.2027", sometimes labeled values
 * ("Emri i produktit:", "Brendi:", "Arsyeja e njoftimit:"), and what consumers are asked to do.
 *
 * A news item is a notice only when its text says a product is withdrawn from the market ("tërheq …",
 * "largim nga tregu", "bllokim") and the product is food for people (not feed for cattle). The same RASFF
 * notification in two news items (a later "will be destroyed") is one notice; its number links the
 * notice to the same notification in other countries ("group"). A document is read once (`known`).
 * Kosovo is "XK" — not an ISO 3166 code; the owner decided to show it (27 Nov 2026).
 */
const { htmlToText, oneLine, idOf, cut, alignedFold, labeledLots, firstSentence } = require('../lib/text');
const { getJson, request, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');
const { docxText } = require('../lib/docx');

const NAME = 'auv';
const PREFIX = 'xk-auv-';
const COUNTRY = 'XK';
const SOURCE = 'Agjencia e Ushqimit dhe Veterinarisë (AUV)';
const SITE = 'https://auvk.rks-gov.net';
const API = `${SITE}/wp-json/wp/v2/posts?per_page=100&_fields=id,date,link,title,content`;
const MAX_DOCUMENTS = 25;

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const unique = (xs) => [...new Set(xs.filter(Boolean))];
const fold = (s) => alignedFold(String(s ?? ''));
/** Words of a withdrawal from the market (folded): "tërheq", "tërhiqet", "largim nga tregu", "bllokim". */
const WITHDRAWN = /t[e]rhe?q|t[e]rhiq|largim\w* nga tregu|bllokim/;
/** A title or document name worth opening: a withdrawal, a batch, a notice to the public. */
const WORTH_READING = /t[e]rheq|t[e]rhiq|largim|\blote?\b|bllok|nga tregu|opinion|rasff/;
/** Not recalls: import bans and refusals, destruction or isolation of what was already withdrawn. */
const NOT_A_RECALL = /import|asgj[e]so|izolo/;
/** Feed for animals (the RASFF's own name, "Ushqim dhe Ushqim për Kafshë", is not). */
const FEED = /(?<!ushqim dhe )ushqim\w* p[e]r kafsh|p[e]r lop[e]|koncentrat\w* p[e]r/;

/** The address of the Word document a news item shows, or null. */
function documentOf(html) {
  const page = String(html ?? '');
  const viewer = /officeapps\.live\.com\/op\/embed\.aspx\?src=([^"&]+)/.exec(page);
  const raw = viewer ? (() => { try { return decodeURIComponent(viewer[1]); } catch { return null; } })() : (/href="([^"]+\.docx)"/i.exec(page) ?? [])[1];
  return raw && /^https:\/\/auvk\.rks-gov\.net\/wp-content\/uploads\/[^?#]+\.docx$/i.test(raw) ? raw : null;
}

/** The news items of the API's answer. Throws when the answer is not WordPress's list of posts. */
function listItems(data) {
  if (!Array.isArray(data) || (data.length > 0 && !data.every((p) => p && Number.isInteger(p.id) && p.title && p.content && typeof p.link === 'string'))) {
    throw new Error('AUV API nije odgovorio listom vijesti (format se promijenio?)');
  }
  return data.map((p) => ({
    id: p.id, day: String(p.date ?? '').slice(0, 10), url: p.link, title: oneLine(p.title.rendered ?? ''),
    text: htmlToText(p.content.rendered ?? ''), document: documentOf(p.content.rendered),
  })).filter((p) => /^\d{4}-\d{2}-\d{2}$/.test(p.day) && /^https:\/\//.test(p.url));
}

/** A document's text → { title, body } — the title is the line after "Prishtinë, <date>". */
function documentParts(text) {
  const lines = String(text ?? '').split('\n');
  const at = lines.findIndex((l) => /^Prishtin[eë],?\s/i.test(l));
  if (at < 0) return { title: '', body: lines.join('\n') };
  return { title: lines[at + 1] ?? '', body: lines.slice(at + 2).join('\n') };
}

/** "Emri i produktit: Ujë Mineral" → "Ujë Mineral" (the value to the end of its line). */
function labeled(text, label) {
  const m = new RegExp(`(?:^|\\n)\\s*${label}\\s*:\\s*([^\\n]+)`, 'i').exec(String(text ?? ''));
  return m ? m[1].trim().replace(/[.\s]+$/, '') : null;
}

/** The product a title names: quoted ("“Flips Ketchup”"), or what follows the withdrawal ("… nga tregu të formulave …"). */
function productOfTitle(title) {
  const t = String(title ?? '').trim();
  const quoted = /[“"„«‘’']{1,2}([^“”"„«»‘’']{2,80})[”"»‘’']{1,2}/.exec(t);
  if (quoted) return quoted[1].trim();
  const after = /nga tregu\s+(?:(?:e|t[eë])\s+)?(?:(?:produkteve|produktit|produktin)\s+(?:ushqimor[e]?\s+)?)?(.+)$/i.exec(t);
  const about = /opinionin(?: publik)? p[eë]r\s+(.+)$/i.exec(t);
  const named = after ? after[1] : about ? about[1] : t;
  // "formulave për foshnje Aptamil Pronutra 1 …" → "Aptamil Pronutra 1 …"; "… të prodhuara në Japoni" → without where it was made
  return named.replace(/^(?:(?:formul|q[uü]m[eë]sht|produkt)\S*\s+(?:ushqimor\S*\s+)?)?p[eë]r foshnje\s+/i, '')
    .replace(/\s+t[eë] prodhuar\S*\s+n[eë]\s+.+$/i, '').trim();
}

/**
 * Why: "Arsyeja e njoftimit: …"; else what the RASFF notification is about ("… RASFF … lidhur me praninë
 * e …"); else what was found ("konstatimin e Aflatoksinës M1 …", "prania e …"); else the first sentence.
 */
function reasonOf(body) {
  const said = labeled(body, 'Arsyeja e njoftimit');
  if (said) return said;
  const text = String(body ?? '').replace(/\n/g, ' ');
  // the clause, up to who made it or where it comes from ("… të prodhuar nga kompania Nutricia Cuijk B.V.")
  const clause = (c) => c.split(/,\s(?!\d)/)[0].split(/\s+(?:t[eë] prodhuar\S*|prodhuar|me origjin[eë]|t[eë] importuar\S*|nga kompania)\b/i)[0].trim();
  const rasff = text.split(/(?<=[.!?])\s+(?=[A-ZËÇ])/).find((x) => /RASFF/.test(x)) ?? '';
  // to the end of its sentence — "3.2%" is not one
  const sentenceFrom = (t) => t.split(/\.(?=\s|$)|;/)[0];
  const about = /lidhur me\s+(?!produktin|produktet|praninë e produktit)(.{8,240})/i.exec(rasff);
  if (about) return clause(sentenceFrom(about[1]));
  const found = /(?:konstatimin e|u konstatua|[eë]sht[eë] konstatuar|[eë]sht[eë] identifikuar)\s+(.{6,200})|(prania e .{4,200}|pranin[eë] e .{4,200})/i.exec(text);
  if (found) return clause(sentenceFrom(found[1] ?? found[2]));
  return firstSentence(text, 160);
}

/** "datë skadimi: 05.01.2027 dhe 07.04.2027", "me datën e skadimit 11/06/2026" → the dates. */
function expiryDates(text) {
  const out = [];
  const t = String(text ?? '');
  for (const m of t.matchAll(/dat[eë]n?\s+(?:e\s+)?skadimi?t?|afati?\s+i\s+(?:skadimit|p[eë]rdorimit)/gi)) {
    const rest = t.slice(m.index + m[0].length, m.index + m[0].length + 120).split(/[\n;]|\.\s|,\s(?!\d)/)[0];
    for (const d of rest.matchAll(/\b\d{1,2}[./]\d{1,2}[./]\d{4}\b/g)) out.push(d[0]);
  }
  return unique(out);
}

function categoryOf(text) {
  const f = fold(text);
  if (/foshnj|bebe|formul\w* (?:ushqimore )?p[e]r foshnje/.test(f)) return 'baby';
  if (/suplement|shtes\w* ushqimor/.test(f)) return 'supplement';
  return 'food';
}

/** One news item and its text → a notice (unchecked), or { skip }. */
function toNotice(item, text) {
  const doc = documentParts(text);
  const title = doc.title || item.title;
  const all = `${title}\n${doc.body}`;
  const f = fold(all);
  if (!WITHDRAWN.test(f)) return { skip: 'nije povlačenje proizvoda' };
  if (FEED.test(f)) return { skip: 'hrana za životinje' };
  // the product: its labeled name; else the title's, when the title is about it; else the name the
  // withdrawal itself quotes ("… tërheqjen e menjëhershme nga tregu të qumështit UHT “Land” 3.2% …")
  const brand = labeled(doc.body, 'Brendi');
  const product = labeled(doc.body, 'Emri i produktit');
  let named = null;
  if (product) named = brand && !fold(product).includes(fold(brand)) ? `${brand} ${product}` : product;
  else if (/t[e]rheq|t[e]rhiq|largim|opinionin(?: publik)? p[e]r/.test(fold(title))) named = productOfTitle(title);
  else {
    const sentence = doc.body.replace(/\n/g, ' ').split(/(?<=[.!?])\s+(?=[A-ZËÇ])/).find((x) => WITHDRAWN.test(fold(x)));
    const quoted = sentence && /((?:\S+\s+){0,2})[“"„]([^”"“]{2,60})[”"]((?:\s+[\d.,]+\s*(?:%|(?:g|kg|ml|l)\b))?)/i.exec(sentence);
    if (quoted) named = `${quoted[1]}“${quoted[2]}”${quoted[3]}`.trim();
  }
  if (!named) return { skip: 'bez naziva' };
  const name = cut(capital(named.replace(/[.,\s]+$/, '')), 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const reason = cut(capital(reasonOf(doc.body) ?? ''), 160);
  if (!reason) return { skip: 'bez razloga' };
  const rasff = /RASFF/.test(doc.body) ? ((/(?:nr\.?|num[eë]r(?:\s+reference)?|reference)\s*:?\s*(20\d{2}\.\d{3,5})\b/i.exec(doc.body.replace(/\n/g, ' ')) ?? [])[1] ?? null) : null;
  const lots = labeledLots(doc.body.replace(/\bLOT-et\b/g, 'LOT'));
  const dates = expiryDates(all);
  const sentences = doc.body.replace(/\n/g, ' ').split(/(?<=[.!?])\s+/);
  const action = sentences.find((s) => /konsumator\w*[^.]*(?:t[eë] mos|kthe|k[eë]shilluar|mos e p[eë]rdor)/i.test(s));
  return {
    notice: {
      id: idOf(PREFIX, String(item.id)), country: COUNTRY, published: item.day, category: categoryOf(all),
      hazard: hazardOf(reason, doc.body),
      name, reason,
      details: cut(firstSentence(doc.body.replace(/\n/g, ' '), 800) ?? '', 800) || undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      action: action ? cut(action.trim(), 500) : undefined,
      source: SOURCE, url: item.url, gtins: [],
      ...(rasff ? { group: idOf('rasff-', rasff) } : {}),
    },
  };
}

/** Reads the agency's news. Resolves to { notices, seen, skipped }; throws when the list is not as described above. */
async function fetchNotices({ fetchImpl = fetch, url = API, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const items = listItems(await getJson(fetchImpl, url, { userAgent }));
  if (items.length === 0) throw new Error('lista vijesti AUV-a je prazna (format se promijenio?)');
  const notices = [];
  const toRead = [];
  for (const item of items) {
    if (item.day < since) { count('starije od prozora'); continue; }
    const k = known.get(idOf(PREFIX, String(item.id)));
    if (k) { notices.push(k); continue; }
    const name = fold(`${item.title} ${item.document ? decodeURIComponent(item.document.split('/').pop()) : ''}`);
    if (NOT_A_RECALL.test(fold(item.title))) { count('nije povlačenje proizvoda'); continue; }
    if (item.text.length >= 200) toRead.push({ item, text: item.text });           // the text is in the page
    else if (item.document && WORTH_READING.test(name)) toRead.push({ item, document: item.document });
    else count('nije povlačenje proizvoda');
  }
  const now = toRead.slice(0, MAX_DOCUMENTS);
  for (let i = now.length; i < toRead.length; i++) count('dokument ostavljen za sljedeće pokretanje');
  const texts = await mapLimit(now, 2, async (r) => (r.text !== undefined ? r.text
    : docxText(Buffer.from(await (await request(fetchImpl, r.document, { userAgent, accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,*/*' })).arrayBuffer()))));
  now.forEach((r, i) => {
    if (!texts[i].ok) { count('dokument nije pročitan (pokušava se sljedeći put)'); return; }
    const out = toNotice(r.item, texts[i].value);
    if (out.skip) count(out.skip);
    else notices.push(out.notice);
  });
  // the same RASFF notification in two news items is one notice: the first
  const kept = [];
  for (const n of notices.sort((a, b) => a.published.localeCompare(b.published) || a.id.localeCompare(b.id))) {
    if (n.group && kept.some((k) => k.group === n.group)) { count('ista RASFF notifikacija kao ranija vijest'); continue; }
    kept.push(n);
  }
  return { notices: kept.reverse(), seen: items.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: API, fetchNotices, listItems, documentOf, documentParts, toNotice, productOfTitle, reasonOf, expiryDates };
