'use strict';
/**
 * The file LUPA reads — format "v1" — and the checks every notice must pass before it is published.
 *
 * These are the SAME checks the app makes when it reads the file (app: lib/recalls.ts, parseFeed).
 * The app is the last line of defence; this is the first: a notice the app would refuse is never
 * published, so what the job reports as "published" is what users see. Both sides are tested against
 * the same cases (test/fixtures/contract-cases.json — the app has a copy in tests/fixtures).
 *
 *   {
 *     "version": 1,
 *     "generated": "2026-11-26T04:10:00Z",
 *     "recalls": [ {
 *        "id":        "hr-2026-11-24-kasica"        a–z 0–9 and "-", 3–80 characters, unique, never reused
 *        "country":   "HR"                          where the notice was published (EU member, BA or RS)
 *        "published": "2026-11-24"                  the day of publication
 *        "category":  "baby" | "food" | "supplement" | "cosmetic" | "other"
 *        "hazard":    "microbe" | "allergen" | "foreign" | "chemical" | "toxin" | "label" | "other"
 *        "name":      the product, as the notice names it            (2–160)
 *        "reason":    the thing itself, in the notice's words        (1–160)  "komadići stakla"
 *        "source":    who published the notice                       (1–120)
 *        "url":       the official notice — https only               (≤ 500)
 *        "brand", "details", "lots", "bestBefore", "action"          optional texts
 *        "gtins":     ["3850123456782"]                              optional; every one a valid GTIN
 *        "group":     "rasff-2026-10406"                             optional; the same product recalled in
 *                     several countries: every notice with the same group is that product (same RASFF
 *                     notification, or the same manufacturer's barcode). Same form as an id. An app
 *                     that does not know it ignores it; a group in another form is ignored.
 *     } ]
 *   }
 *
 * Format "v2" (public/v2/): the same notices, one file per country, so that one country's many notices
 * never push another country's few out of the file, and countries outside Europe can be added:
 *
 *   index.json   { "version": 2, "generated": "…", "countries": [ { "country": "FR", "file": "fr.json",
 *                  "recalls": 169, "chars": 123456, "newest": "2026-11-27" }, … ] }
 *   fr.json      { "version": 2, "generated": "…", "country": "FR", "recalls": [ notice, … ] }
 *
 * A notice in v2 is the notice above, its country one of COUNTRIES_V2 (v1's, the United States and Europe
 * outside the EU) and
 * the same as its file's. "group" links notices across files. v1 (public/v1/recalls.json) stays as it
 * is for the apps that read it: the countries of v1 only, cut to v1's limits.
 */
const { isValidGtin } = require('./gtin');

const FEED_VERSION = 1;
const CATEGORIES = ['baby', 'food', 'supplement', 'cosmetic', 'other'];
const HAZARDS = ['microbe', 'allergen', 'foreign', 'chemical', 'toxin', 'label', 'other'];
const EU_COUNTRIES = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
const COUNTRIES = [...EU_COUNTRIES, 'BA', 'RS'];
/**
 * v2: the countries of v1, the United States, and the European countries outside the EU whose official
 * lists the job reads or is to read (United Kingdom, Switzerland, Norway, Iceland, North Macedonia,
 * Moldova, Ukraine, Montenegro, Albania). A country here without a source simply has no file.
 */
const COUNTRIES_V2 = [...COUNTRIES, 'US', 'GB', 'CH', 'NO', 'IS', 'MK', 'MD', 'UA', 'ME', 'AL'];
const FEED_VERSION_2 = 2;

/** The app cuts longer texts; the job refuses to guess where, and cuts them the same way. */
const MAX = { id: 80, name: 160, brand: 80, reason: 160, details: 800, lots: 300, bestBefore: 120, action: 500, source: 120, url: 500, gtins: 50 };
/** What the app accepts at most … */
const APP_MAX_RECALLS = 1000;
const APP_MAX_CHARS = 600000;
/** … and what the job publishes at most, with room to spare. */
const MAX_RECALLS = 800;
const MAX_CHARS = 500000;
/** v2: the same, for each country's file. */
const MAX_RECALLS_COUNTRY = 800;
const MAX_CHARS_COUNTRY = 500000;

const ID = /^[a-z0-9][a-z0-9-]{2,79}$/;
const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;
const TEXT_FIELDS = ['name', 'reason', 'source', 'brand', 'details', 'lots', 'bestBefore', 'action'];
const KNOWN_FIELDS = ['id', 'country', 'published', 'category', 'hazard', 'url', 'gtins', 'group', ...TEXT_FIELDS];

function isDay(value) {
  if (typeof value !== 'string') return false;
  const m = DAY.exec(value);
  if (!m) return false;
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (year < 2000 || year > 2100 || month < 1 || month > 12 || day < 1) return false;
  return day <= new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** One line of text: control characters, line breaks and direction marks become a space; trimmed; cut to a length. */
function cleanLine(value, max) {
  if (typeof value !== 'string') return null;
  let out = '';
  let space = false;
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    const odd = code < 0x20 || (code >= 0x7F && code <= 0x9F) || code === 0x2028 || code === 0x2029
      || (code >= 0x202A && code <= 0x202E) || (code >= 0x2066 && code <= 0x2069) || code === 0xFEFF;
    if (odd || code === 0x20) { space = out.length > 0; continue; }
    if (space) { out += ' '; space = false; }
    out += value[i];
  }
  if (out.length === 0) return null;
  return out.length > max ? `${out.slice(0, max - 1).trimEnd()}…` : out;
}

/** An https address on a real host — the only kind of link the app opens. */
function isSafeLink(value) {
  if (typeof value !== 'string' || value.length > MAX.url || !value.startsWith('https://')) return false;
  return /^https:\/\/[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+(:\d{2,5})?(\/[^\s<>"\\^`{|}]*)?$/i.test(value);
}

function hostOf(url) {
  const m = /^https:\/\/([^/:?#]+)/i.exec(String(url));
  return m ? m[1].toLowerCase().replace(/^www\./, '') : '';
}

/**
 * One notice → { ok: true, notice } (exactly as it will be published) or { ok: false, why }.
 * Strict where the app is strict; the texts come out cleaned and cut as the app would show them.
 */
function checkNotice(raw, countries = COUNTRIES) {
  const no = (why) => ({ ok: false, why });
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return no('nije objekat');
  if (typeof raw.id !== 'string' || !ID.test(raw.id)) return no(`id „${String(raw.id).slice(0, 40)}” — dozvoljeno: mala slova a–z, cifre i „-”, 3–80 znakova`);
  if (typeof raw.country !== 'string' || !countries.includes(raw.country)) return no(`country „${raw.country}” — treba ISO kod zemlje ${countries === COUNTRIES ? 'EU, BA ili RS' : `iz liste ${countries.join(', ')}`} (velikim slovima)`);
  if (!isDay(raw.published)) return no(`published „${raw.published}” — treba dan u obliku GGGG-MM-DD`);
  if (!CATEGORIES.includes(raw.category)) return no(`category „${raw.category}” — jedno od: ${CATEGORIES.join(', ')}`);
  if (!HAZARDS.includes(raw.hazard)) return no(`hazard „${raw.hazard}” — jedno od: ${HAZARDS.join(', ')}`);
  const name = cleanLine(raw.name, MAX.name);
  const reason = cleanLine(raw.reason, MAX.reason);
  const source = cleanLine(raw.source, MAX.source);
  if (name === null || name.length < 2) return no('name — nedostaje naziv proizvoda');
  if (reason === null) return no('reason — nedostaje razlog');
  if (source === null) return no('source — nedostaje izvor');
  if (!isSafeLink(raw.url)) return no(`url „${String(raw.url).slice(0, 60)}” — treba https adresa službene obavijesti`);
  const gtins = [];
  if (raw.gtins !== undefined && raw.gtins !== null) {
    if (!Array.isArray(raw.gtins) || raw.gtins.length > MAX.gtins) return no('gtins — treba lista (najviše 50) barkodova');
    for (const g of raw.gtins) {
      if (typeof g !== 'string' || !isValidGtin(g)) return no(`gtins — „${String(g).slice(0, 20)}” nije ispravan barkod (8, 12, 13 ili 14 cifara, s ispravnom kontrolnom cifrom)`);
      if (!gtins.includes(g)) gtins.push(g);
    }
  }
  const notice = { id: raw.id, country: raw.country, published: raw.published, category: raw.category, hazard: raw.hazard, name };
  const brand = cleanLine(raw.brand, MAX.brand);
  if (brand !== null) notice.brand = brand;
  notice.reason = reason;
  for (const key of ['details', 'lots', 'bestBefore', 'action']) {
    const text = cleanLine(raw[key], MAX[key]);
    if (text !== null) notice[key] = text;
  }
  notice.source = source;
  notice.url = raw.url;
  if (gtins.length > 0) notice.gtins = gtins;
  if (typeof raw.group === 'string' && ID.test(raw.group)) notice.group = raw.group;
  return { ok: true, notice };
}

/** Fields of a hand-written notice that the format does not know — almost always a typing mistake ("lot" for "lots"). */
function unknownFields(raw) {
  return raw && typeof raw === 'object' ? Object.keys(raw).filter((k) => !KNOWN_FIELDS.includes(k)) : [];
}

/** Newest first; the same day by id — the order the app shows, and a stable one (the file changes only when a notice does). */
function byNewest(a, b) {
  return a.published < b.published ? 1 : a.published > b.published ? -1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

/**
 * A whole file, as the app reads it → { generated, recalls } or null. Used on the previous file
 * (to carry notices over when a source cannot be read) and on the new one before it is written.
 */
function readFeed(text) {
  if (typeof text !== 'string' || text.length === 0) return null;
  let raw;
  try { raw = JSON.parse(text); } catch { return null; }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.version !== FEED_VERSION) return null;
  if (typeof raw.generated !== 'string' || Number.isNaN(Date.parse(raw.generated)) || !Array.isArray(raw.recalls)) return null;
  const lastDay = new Date(Date.parse(raw.generated) + 86400000).toISOString().slice(0, 10);
  const seen = new Set();
  const recalls = [];
  for (const item of raw.recalls) {
    const checked = checkNotice(item);
    if (!checked.ok || seen.has(checked.notice.id) || checked.notice.published > lastDay) continue;
    seen.add(checked.notice.id);
    recalls.push(checked.notice);
  }
  recalls.sort(byNewest);
  return { generated: new Date(Date.parse(raw.generated)).toISOString(), recalls };
}

/**
 * One country's file of v2, as the app reads it → { generated, country, recalls } or null. A notice of
 * another country than the file's, or a country the format does not know, is left out.
 */
function readCountryFile(text, country) {
  if (typeof text !== 'string' || text.length === 0) return null;
  let raw;
  try { raw = JSON.parse(text); } catch { return null; }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.version !== FEED_VERSION_2 || raw.country !== country || !COUNTRIES_V2.includes(country)) return null;
  if (typeof raw.generated !== 'string' || Number.isNaN(Date.parse(raw.generated)) || !Array.isArray(raw.recalls)) return null;
  const lastDay = new Date(Date.parse(raw.generated) + 86400000).toISOString().slice(0, 10);
  const seen = new Set();
  const recalls = [];
  for (const item of raw.recalls) {
    const checked = checkNotice(item, COUNTRIES_V2);
    if (!checked.ok || checked.notice.country !== country || seen.has(checked.notice.id) || checked.notice.published > lastDay) continue;
    seen.add(checked.notice.id);
    recalls.push(checked.notice);
  }
  recalls.sort(byNewest);
  return { generated: new Date(Date.parse(raw.generated)).toISOString(), country, recalls };
}

/** v2's index, as the app reads it → { generated, countries: [{ country, file, recalls, chars, newest }] } or null. */
function readIndex(text) {
  let raw;
  try { raw = JSON.parse(text); } catch { return null; }
  if (!raw || typeof raw !== 'object' || raw.version !== FEED_VERSION_2 || typeof raw.generated !== 'string' || Number.isNaN(Date.parse(raw.generated)) || !Array.isArray(raw.countries)) return null;
  const countries = [];
  for (const c of raw.countries) {
    if (!c || !COUNTRIES_V2.includes(c.country) || c.file !== `${c.country.toLowerCase()}.json` || countries.some((x) => x.country === c.country)) continue;
    countries.push({ country: c.country, file: c.file, recalls: Number(c.recalls) || 0, chars: Number(c.chars) || 0, newest: isDay(c.newest) ? c.newest : null });
  }
  return { generated: new Date(Date.parse(raw.generated)).toISOString(), countries };
}

module.exports = {
  FEED_VERSION, FEED_VERSION_2, CATEGORIES, HAZARDS, EU_COUNTRIES, COUNTRIES, COUNTRIES_V2, MAX, MAX_RECALLS, MAX_CHARS, MAX_RECALLS_COUNTRY, MAX_CHARS_COUNTRY, APP_MAX_RECALLS, APP_MAX_CHARS, KNOWN_FIELDS,
  isDay, cleanLine, isSafeLink, hostOf, checkNotice, unknownFields, byNewest, readFeed, readCountryFile, readIndex,
};
