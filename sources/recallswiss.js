'use strict';
/**
 * Switzerland — RecallSwiss, the federal register of recalls and public warnings
 * (https://www.recallswiss.admin.ch), food only: sector "Lebensmittel" (wirtschaftszweigId=2) and
 * published by the BLV (Bundesamt für Lebensmittelsicherheit und Veterinärwesen).
 *
 * Seen on the live data (27 Nov 2026): the register's own service (the one its page reads),
 * /customer-access-backend/resources/recalls?page=1&wirtschaftszweigId=2 → { entries, page, pages,
 * count }, newest first, 10 a page. An entry: "id", "headerDe" ("Rückruf: Migros ruft das Produkt «Anna's
 * Best Momos Beef» wegen nicht deklarierten Allergenen (Milch und Sesam) zurück"), "metaDe" ("Bern,
 * 27.11.2026"), "descriptionDe", "image.altDe" (the product's name) and "marktaufsichtsbehoerde".
 *
 * The BLV often publishes both its public warning ("Öffentliche Warnung: …") and the company's recall
 * ("Rückruf: …") of the same products. A warning is left out when a recall of exactly the same products
 * (the register's own product name) is published within three days of it; otherwise it is kept.
 * Texts are the register's German ones. The link is the entry on recallswiss.admin.ch.
 */
const { idOf, cut, labeledLots, labeledDates, labeledGtins, alignedFold } = require('../lib/text');
const { getJson } = require('../lib/http');
const { hazardOf } = require('../lib/classify');

const NAME = 'recallswiss';
const PREFIX = 'ch-recallswiss-';
const COUNTRY = 'CH';
const SOURCE = 'RecallSwiss / BLV';
const SITE = 'https://www.recallswiss.admin.ch';
const API = `${SITE}/customer-access-backend/resources/recalls`;
const FOOD = 2;   // "Lebensmittel"
const MAX_LIST_PAGES = 8;

const text = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');
const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Bern, 27.11.2026" → "2026-11-27". */
function dayOf(meta) {
  const m = /(\d{1,2})\.(\d{1,2})\.(\d{4})/.exec(String(meta ?? ''));
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null;
}

/** The register's product name, compared without quotes, apostrophe kinds and spacing. */
const sameName = (s) => alignedFold(String(s ?? '').replace(/[«»"“”„]/g, '').replace(/[’‘`´]/g, "'")).replace(/\s+/g, ' ').trim();

/** The products: the image's description, unless it is only "picture of the product"; else the «…» of the title. */
function nameOf(entry) {
  const alt = text(entry.image && entry.image.altDe).replace(/^«|»$/g, '').trim();
  if (alt.length >= 2 && !/^bild\b|betroffenen produkt/i.test(alt)) return alt;
  const quoted = [...text(entry.headerDe).matchAll(/«\s*([^»]{2,120}?)\s*»/g)].map((m) => m[1]);
  return quoted.length ? quoted.join(', ') : null;
}

/** Why: "… wegen nicht deklarierten Allergenen (Milch und Sesam) zurück" / "Öffentliche Warnung: Listerien in …". */
function reasonOf(header) {
  const h = text(header);
  const why = /\b(?:wegen|aufgrund(?:\s+(?:eines|einer|von))?)\s+(.+?)\s+zurück\b/i.exec(h) ?? /\b(?:wegen|aufgrund(?:\s+(?:eines|einer|von))?)\s+(.+?)\.?$/i.exec(h);
  if (why) return capital(why[1]);
  const warning = /^Öffentliche Warnung:\s*(.+)$/i.exec(h);
  return warning ? capital(warning[1]) : null;
}

function categoryOf(t) {
  const f = alignedFold(t ?? '');
  if (/kosmetik|korperbutter|shampoo|duschgel|deodorant|haarspray|blondspray|lippenstift|make-up|parfum|sonnencreme|zahnpasta|hautreizung/.test(f)) return 'cosmetic';
  if (/sauglings|säuglings|babynahrung|kleinkind|folgemilch/.test(f)) return 'baby';
  if (/nahrungserganzung|nahrungsergänzung/.test(f)) return 'supplement';
  return 'food';
}

/** One entry → a notice (unchecked), or { skip }. */
function toNotice(entry) {
  const published = dayOf(entry.metaDe);
  if (!published) return { skip: 'bez datuma' };
  const name = cut(nameOf(entry) ?? '', 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const reason = cut(reasonOf(entry.headerDe) ?? '', 160);
  if (!reason) return { skip: 'bez razloga' };
  const description = String(entry.descriptionDe ?? '').trim();
  const sentences = description.split(/(?<=[.!?])\s+|\n/).map((s) => s.trim()).filter(Boolean);
  const action = sentences.find((s) => /empfiehlt|nicht (?:zu )?konsumieren|nicht mehr zu konsumieren|zurückbringen|zurückzubringen|entsorgen/i.test(s));
  const lots = labeledLots(description);
  const dates = labeledDates(description);
  return {
    notice: {
      id: idOf(PREFIX, String(entry.id)), country: COUNTRY, published, category: categoryOf(`${entry.headerDe}\n${name}\n${description}`),
      hazard: hazardOf(reason, description),
      name, reason,
      details: description ? cut(description.replace(/\s+/g, ' '), 800) : undefined,
      lots: lots.length ? cut(lots.join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(dates.join(', '), 120) : undefined,
      action: action ? cut(action, 500) : undefined,
      source: SOURCE, url: `${SITE}/customer-access/#Recalls/${entry.id}`, gtins: labeledGtins(description).slice(0, 50),
    },
    kind: /^Öffentliche Warnung/i.test(text(entry.headerDe)) ? 'warning' : 'recall',
    same: sameName(nameOf(entry)),
  };
}

/** Reads the register's food entries since `since`. Resolves to { notices, seen, skipped }; throws when the answer is not the register's. */
async function fetchNotices({ fetchImpl = fetch, since = '2000-01-01', userAgent } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const entries = [];
  for (let page = 1; page <= MAX_LIST_PAGES; page++) {
    const data = await getJson(fetchImpl, `${API}?page=${page}&wirtschaftszweigId=${FOOD}`, { userAgent });
    if (!data || !Array.isArray(data.entries)) throw new Error('RecallSwiss nije odgovorio listom „entries” (format se promijenio?)');
    entries.push(...data.entries.filter((e) => !entries.some((x) => x.id === e.id)));
    const days = data.entries.map((e) => dayOf(e.metaDe)).filter(Boolean);
    if (data.entries.length === 0 || page >= Number(data.pages ?? 1) || (days.length > 0 && days.every((d) => d < since))) break;
  }
  const read = [];
  for (const entry of entries) {
    const agency = text(entry.marktaufsichtsbehoerde && entry.marktaufsichtsbehoerde.kuerzelDe);
    if (agency && agency !== 'BLV') { count('nije BLV (druga vrsta proizvoda)'); continue; }
    const out = toNotice(entry);
    if (out.skip) { count(out.skip); continue; }
    if (out.notice.published < since) { count('starije od prozora'); continue; }
    read.push(out);
  }
  const notices = [];
  for (const out of read) {
    if (out.kind === 'warning' && out.same && read.some((r) => r.kind === 'recall' && r.same === out.same
      && Math.abs(Date.parse(r.notice.published) - Date.parse(out.notice.published)) <= 3 * 86400000)) {
      count('upozorenje BLV-a za isti proizvod kao objavljeni opoziv');
      continue;
    }
    notices.push(out.notice);
  }
  if (entries.length > 0 && read.length === 0 && !skipped['starije od prozora']) throw new Error(`nijedan unos RecallSwissa nije u očekivanom obliku (${JSON.stringify(skipped)}) — format se promijenio?`);
  return { notices, seen: entries.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: API, fetchNotices, toNotice, nameOf, reasonOf, dayOf };
