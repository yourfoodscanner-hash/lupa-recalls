'use strict';
/**
 * Builds the files LUPA reads: public/v2/ (a file per country and an index — lib/contract.js) and, for
 * the apps that read one file, public/v1/recalls.json (the countries of v1, cut to its limits).
 *
 *   1. the hand-written notices (curated/*.json) — every one must pass every check, or the job
 *      stops and nothing is published: a typing mistake never silently loses a notice;
 *   2. the sources the job reads itself (sources/*.js, those config.json names) — a row that fails a check is left out and
 *      counted; a source that cannot be read at all is skipped, and the notices it gave last time
 *      are kept (from the previous file), so one bad day does not empty the list;
 *   3. together: no id twice (a hand-written notice wins), nothing older than its window, newest
 *      first, never more or larger than the app accepts;
 *   4. the result is read back exactly as the app reads it, and written only if it is sound — and
 *      not if the list has suddenly shrunk to less than half (then something is wrong, and the
 *      file that is already published stays).
 *
 * Usage:  node lib/build.js            reads the sources, writes public/v1/recalls.json
 *         node lib/build.js --offline  hand-written notices only + what the previous file had
 *         node lib/build.js --check    builds and reports, writes nothing
 *         node lib/build.js --force    writes even if the list has shrunk to less than half
 */
const fs = require('fs');
const path = require('path');
const C = require('./contract');
const { isShopNumber } = require('./gtin');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'v1', 'recalls.json');
const OUT_V2 = path.join(ROOT, 'public', 'v2');
const STATE = path.join(ROOT, 'state', 'last-run.json');
/** Every source the job can read. A source is read only when config.json names it (and does not switch it off). */
const SOURCES = {
  rappelconso: require('../sources/rappelconso'),
  lebensmittelwarnung: require('../sources/lebensmittelwarnung'),
  govsi: require('../sources/govsi'),
  hapih: require('../sources/hapih'),
  fsaba: require('../sources/fsaba'),
  ages: require('../sources/ages'),
  fvst: require('../sources/fvst'),
  pranyr: require('../sources/pranyr'),
  efet: require('../sources/efet'),
  favv: require('../sources/favv'),
  fsai: require('../sources/fsai'),
  gis: require('../sources/gis'),
  nebih: require('../sources/nebih'),
  ruokavirasto: require('../sources/ruokavirasto'),
  nvwa: require('../sources/nvwa'),
  fda: require('../sources/fda'),
  fsa: require('../sources/fsa'),
  recallswiss: require('../sources/recallswiss'),
  mattilsynet: require('../sources/mattilsynet'),
  mast: require('../sources/mast'),
  fva: require('../sources/fva'),
  aesan: require('../sources/aesan'),
  alva: require('../sources/alva'),
  rasff: require('../sources/rasff'),
};
/** A source that gave at least this many notices last time and gives none now has failed, whatever it says. */
const EMPTY_IS_FAILURE_FROM = 10;
/** The list may not shrink below this share of the previous one in a single run. */
const SHRINK_LIMIT = 0.5;
const SHRINK_APPLIES_FROM = 20;

const dayBefore = (now, days) => new Date(now.getTime() - days * 86400000).toISOString().slice(0, 10);
const readText = (file) => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null);
function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}

/** Every country's file of v2 as published last time, as one list — or null when there is no v2 yet. */
function readPublishedV2(dir = OUT_V2) {
  const index = C.readIndex(readText(path.join(dir, 'index.json')) ?? '');
  if (index === null) return null;
  const all = [];
  for (const c of index.countries) {
    const file = C.readCountryFile(readText(path.join(dir, c.file)) ?? '', c.country);
    if (file === null) return null;   // a file that cannot be read: the v1 file is the safer memory
    all.push(...file.recalls);
  }
  return all;
}

/** The hand-written notices. Throws with every problem found, each with its file and entry. */
function loadCurated(dir = path.join(ROOT, 'curated')) {
  const problems = [];
  const notices = [];
  const ids = new Map();
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort() : [];
  for (const file of files) {
    let list;
    try { list = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')); } catch (e) { problems.push(`curated/${file}: nije ispravan JSON (${e.message})`); continue; }
    if (!Array.isArray(list)) { problems.push(`curated/${file}: treba lista [ … ] obavijesti`); continue; }
    const country = /^[a-z]{2}\.json$/.test(file) ? file.slice(0, 2).toUpperCase() : null;
    list.forEach((raw, i) => {
      const at = `curated/${file}, obavijest ${i + 1}${raw && typeof raw.id === 'string' ? ` („${raw.id}”)` : ''}`;
      const checked = C.checkNotice(raw, C.COUNTRIES_V2);
      if (!checked.ok) { problems.push(`${at}: ${checked.why}`); return; }
      const odd = C.unknownFields(raw);
      if (odd.length > 0) { problems.push(`${at}: nepoznato polje ${odd.map((k) => `„${k}”`).join(', ')} — dozvoljena su: ${C.KNOWN_FIELDS.join(', ')}`); return; }
      // a text that had to be cut would be published cut: better to shorten it by hand
      for (const key of ['name', 'reason', 'source', 'brand', 'details', 'lots', 'bestBefore', 'action']) {
        if (typeof raw[key] === 'string' && raw[key].trim().length > C.MAX[key]) problems.push(`${at}: ${key} ima ${raw[key].trim().length} znakova, najviše ${C.MAX[key]}`);
      }
      for (const g of checked.notice.gtins ?? []) {
        if (isShopNumber(g)) problems.push(`${at}: barkod „${g}” je broj koji prodavnica dodjeljuje sama (počinje s 2, 02 ili 04 — roba na vagu); isti broj u drugoj prodavnici je drugi proizvod, pa se ne objavljuje — izostavi ga`);
      }
      if (country !== null && C.COUNTRIES_V2.includes(country) && checked.notice.country !== country) problems.push(`${at}: country je „${checked.notice.country}”, a fajl je za „${country}”`);
      if (ids.has(checked.notice.id)) problems.push(`${at}: id već postoji u curated/${ids.get(checked.notice.id)}`);
      ids.set(checked.notice.id, file);
      notices.push(checked.notice);
    });
  }
  if (problems.length > 0) {
    const error = new Error(`Ručno unesene obavijesti imaju ${problems.length} grešku/grešaka:\n - ${problems.join('\n - ')}`);
    error.problems = problems;
    throw error;
  }
  return notices;
}

/** A notice without the numbers that shops give out themselves (lib/gtin — isShopNumber). */
function withoutShopNumbers(notice) {
  if (!Array.isArray(notice.gtins) || !notice.gtins.some(isShopNumber)) return notice;
  const gtins = notice.gtins.filter((g) => !isShopNumber(g));
  const { gtins: _, ...rest } = notice;
  return gtins.length > 0 ? { ...rest, gtins } : rest;
}

/**
 * The whole build, without touching the disk (tests call it directly).
 *   curated   checked hand-written notices
 *   previous  the file published last time, as text (or null)
 *   sources   { name: adapter }   config: see config.json   offline: read no source
 */
async function build({ now = new Date(), curated, previous = null, previousAll = null, sources = SOURCES, config = {}, offline = false, fetchImpl = fetch, force = false } = {}) {
  // what was published last time: every country's file of v2 when there are such, else the v1 file
  const before = Array.isArray(previousAll) ? { recalls: previousAll } : previous === null ? null : C.readFeed(previous);
  const report = { generated: now.toISOString().replace(/\.\d{3}Z$/, 'Z'), curated: curated.length, sources: {}, warnings: [] };
  const taken = new Map();
  for (const n of curated) taken.set(n.id, n);
  const prefixes = Object.values(sources).map((s) => s.prefix);
  for (const n of curated) {
    const clash = prefixes.find((p) => n.id.startsWith(p));
    if (clash) throw new Error(`Ručno unesena obavijest „${n.id}” počinje s „${clash}” — taj početak je rezervisan za izvor koji se čita automatski`);
  }

  for (const [name, adapter] of Object.entries(sources)) {
    const listed = Boolean(config.sources && config.sources[name]);
    const settings = listed ? config.sources[name] : {};
    const entry = { enabled: listed && settings.enabled !== false, ok: false, seen: 0, published: 0, dropped: {}, carried: 0, error: null };
    report.sources[name] = entry;
    if (!entry.enabled) continue;
    const since = dayBefore(now, settings.windowDays ?? 45);
    // a source for several countries (the EU's portal) publishes only for the countries listed for it
    const countries = Array.isArray(adapter.countries) ? (Array.isArray(settings.countries) ? settings.countries.filter((c) => C.COUNTRIES_V2.includes(c)) : adapter.countries) : null;
    const allowed = countries ?? [adapter.country];
    // what the source gave last time — without barcodes that a file made before this rule may still carry
    const had = before ? before.recalls.filter((n) => n.id.startsWith(adapter.prefix)).map(withoutShopNumbers) : [];
    let fresh = null;
    if (!offline) {
      try {
        // what this source gave last time, by id: an adapter that reads a page per notice reads only the new ones
        const known = new Map(had.map((n) => [n.id, n]));
        const got = await adapter.fetchNotices({ fetchImpl, since, userAgent: config.userAgent, known, ...(settings.url ? { url: settings.url } : {}), ...(countries ? { countries } : {}) });
        entry.seen = got.seen;
        entry.dropped = { ...got.skipped };
        fresh = [];
        for (const raw of got.notices) {
          const checked = C.checkNotice(raw, C.COUNTRIES_V2);
          if (!checked.ok) { const why = checked.why.split(' ')[0]; entry.dropped[`provjera: ${why}`] = (entry.dropped[`provjera: ${why}`] ?? 0) + 1; continue; }
          if (!checked.notice.id.startsWith(adapter.prefix) || !allowed.includes(checked.notice.country)) { entry.dropped['tuđi id ili zemlja'] = (entry.dropped['tuđi id ili zemlja'] ?? 0) + 1; continue; }
          fresh.push(checked.notice);
        }
        if (fresh.length === 0 && had.length >= EMPTY_IS_FAILURE_FROM) throw new Error(`izvor je dao 0 obavijesti, a prošli put ${had.length}`);
        entry.ok = true;
      } catch (e) {
        entry.error = String(e && e.message ? e.message : e).slice(0, 600);
        fresh = null;
      }
    } else {
      entry.error = 'nije čitano (--offline)';
    }
    // a source that could not be read keeps what it gave last time
    const use = fresh ?? had;
    if (fresh === null) { entry.carried = had.length; if (!offline) report.warnings.push(`Izvor „${name}” nije pročitan (${entry.error}). Zadržano ${had.length} njegovih obavijesti iz prethodnog fajla.`); }
    for (const n of use) {
      if (n.published < since || taken.has(n.id)) continue;
      taken.set(n.id, n);
      entry.published += 1;
    }
  }

  // nothing dated after tomorrow (a mistake in the date), nothing older than its window
  const lastDay = new Date(now.getTime() + 86400000).toISOString().slice(0, 10);
  const curatedSince = dayBefore(now, config.curatedWindowDays ?? 180);
  const isAuto = (n) => prefixes.some((p) => n.id.startsWith(p));
  let recalls = [...taken.values()].filter((n) => {
    if (n.published > lastDay) { report.warnings.push(`„${n.id}” ima datum u budućnosti (${n.published}) — izostavljeno.`); return false; }
    return isAuto(n) || n.published >= curatedSince;
  });
  recalls.sort(C.byNewest);

  recalls = withGroups(recalls);

  // v2 — a file per country: each within the app's limits on its own; when one is over, that country's
  // oldest notices from the sources go first (a hand-written one stays)
  const generated = report.generated;
  const countryText = (country, list) => `${JSON.stringify({ version: C.FEED_VERSION_2, generated, country, recalls: list }, null, 1)}\n`;
  const byCountry = new Map();
  for (const n of recalls) { if (!byCountry.has(n.country)) byCountry.set(n.country, []); byCountry.get(n.country).push(n); }
  let trimmedV2 = 0;
  for (const [country, list] of byCountry) {
    let kept = list;
    while (kept.length > C.MAX_RECALLS_COUNTRY || countryText(country, kept).length > C.MAX_CHARS_COUNTRY) {
      let at = -1;
      for (let i = kept.length - 1; i >= 0; i--) if (isAuto(kept[i])) { at = i; break; }
      if (at < 0) at = kept.length - 1;
      kept = kept.filter((_, i) => i !== at);
      trimmedV2 += 1;
    }
    byCountry.set(country, kept);
  }
  if (trimmedV2 > 0) report.warnings.push(`v2: izostavljeno ${trimmedV2} najstarijih obavijesti da fajl zemlje ostane u granicama (${C.MAX_RECALLS_COUNTRY} obavijesti, ${C.MAX_CHARS_COUNTRY} znakova).`);
  const all = withGroups([...byCountry.values()].flat().sort(C.byNewest));   // a group is counted again over what is published
  const files = {};
  const index = [];
  for (const country of [...new Set(all.map((n) => n.country))].sort()) {
    const list = all.filter((n) => n.country === country);
    const file = `${country.toLowerCase()}.json`;
    files[file] = countryText(country, list);
    const back = C.readCountryFile(files[file], country);
    if (back === null || back.recalls.length !== list.length) throw new Error(`v2: aplikacija ne bi prihvatila fajl ${file} kako je napisan — ne objavljuje se.`);
    if (files[file].length > C.APP_MAX_CHARS || list.length > C.APP_MAX_RECALLS) throw new Error(`v2: fajl ${file} je veći nego što aplikacija prihvata — ne objavljuje se.`);
    index.push({ country, file, recalls: list.length, chars: files[file].length, newest: list[0].published });
  }
  const indexText = `${JSON.stringify({ version: C.FEED_VERSION_2, generated, countries: index }, null, 1)}\n`;
  if (C.readIndex(indexText)?.countries.length !== index.length) throw new Error('v2: indeks nije u dogovorenom obliku — ne objavljuje se.');

  // v1 — one file, the countries of v1 only, never more or larger than the app accepts: when it is over,
  // the country with the most notices loses its oldest one from a source, so one country's many notices
  // never push another's few out (a hand-written notice stays). The size that counts is the size of the
  // file as it is written — the app measures what it downloads.
  recalls = withGroups(all.filter((n) => C.COUNTRIES.includes(n.country)));
  const text = () => `${JSON.stringify({ version: C.FEED_VERSION, generated, recalls }, null, 1)}\n`;
  let trimmed = 0;
  while (recalls.length > C.MAX_RECALLS || text().length > C.MAX_CHARS) {
    const counts = new Map();
    for (const n of recalls) if (isAuto(n)) counts.set(n.country, (counts.get(n.country) ?? 0) + 1);
    let most = null;
    for (const [country, k] of counts) if (most === null || k > counts.get(most) || (k === counts.get(most) && country < most)) most = country;
    let at = -1;
    for (let i = recalls.length - 1; i >= 0; i--) if (isAuto(recalls[i]) && recalls[i].country === most) { at = i; break; }
    if (at < 0) at = recalls.length - 1;
    recalls = recalls.filter((_, i) => i !== at);
    trimmed += 1;
  }
  if (trimmed > 0) recalls = withGroups(recalls);   // a group that lost a notice to the limits may no longer link two
  if (trimmed > 0) report.warnings.push(`Izostavljeno ${trimmed} najstarijih obavijesti da fajl ostane u granicama (${C.MAX_RECALLS} obavijesti, ${C.MAX_CHARS} znakova) — iz zemalja s najviše obavijesti; u v2 (fajl po zemlji) ostaju.`);

  // the result, read back exactly as the app reads it
  const out = text();
  const back = C.readFeed(out);
  if (back === null) throw new Error('Novi fajl nije u dogovorenom obliku — ne objavljuje se.');
  if (back.recalls.length !== recalls.length) throw new Error(`Aplikacija bi prihvatila ${back.recalls.length} od ${recalls.length} obavijesti — ne objavljuje se.`);
  if (out.length > C.APP_MAX_CHARS || recalls.length > C.APP_MAX_RECALLS) throw new Error('Novi fajl je veći nego što aplikacija prihvata — ne objavljuje se.');
  // whatever path a notice came by: no number a shop gives out itself is ever published as a product's barcode
  const shop = all.flatMap((n) => (n.gtins ?? []).filter(isShopNumber).map((g) => `${n.id}: ${g}`));
  if (shop.length > 0) throw new Error(`U fajlu su brojevi koje prodavnice dodjeljuju same (${shop.slice(0, 5).join('; ')}) — ne objavljuje se.`);

  report.total = recalls.length;
  report.previous = before ? before.recalls.filter((n) => C.COUNTRIES.includes(n.country)).length : null;
  report.chars = out.length;
  report.v2 = { total: all.length, previous: before ? before.recalls.length : null, countries: index.length, largest: Math.max(0, ...index.map((c) => c.chars)) };
  report.byCountry = {};
  for (const n of all) report.byCountry[n.country] = (report.byCountry[n.country] ?? 0) + 1;
  report.withBarcode = recalls.filter((n) => n.gtins && n.gtins.length > 0).length;
  report.groups = new Set(all.filter((n) => n.group).map((n) => n.group)).size;
  report.grouped = all.filter((n) => n.group).length;
  if (before && before.recalls.length >= SHRINK_APPLIES_FROM && all.length < before.recalls.length * SHRINK_LIMIT && !force) {
    const error = new Error(`Lista bi se smanjila s ${before.recalls.length} na ${all.length} obavijesti — to izgleda kao greška, pa se NE objavljuje. (Ako je namjerno: node lib/build.js --force)`);
    error.report = report;
    throw error;
  }
  return { text: out, recalls, report, v2: { index: indexText, files } };
}

/**
 * The same product in several notices — usually recalled in several countries — gets one "group":
 *   - notices a source itself marks as one recall (the same RASFF notification on several countries'
 *     lists: "rasff-2026-10406"), and
 *   - notices that name the same manufacturer's barcode ("gtin-3850123456782"; a number a shop gives
 *     out itself is never in a notice).
 * Never by name: two products with similar names may be different products, batches or problems, and a
 * wrong link is worse than none. Every notice keeps its own country, link and words; the group only says
 * which notices are the same product. A group is written only when it links two notices or more.
 */
function withGroups(recalls) {
  const parent = recalls.map((_, i) => i);
  const find = (i) => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
  const keysOf = (n) => [...(n.group ? [n.group] : []), ...(n.gtins ?? []).map((g) => `gtin-${g}`)];
  const firstWith = new Map();
  recalls.forEach((n, i) => {
    for (const key of keysOf(n)) {
      if (!firstWith.has(key)) firstWith.set(key, i);
      else parent[find(i)] = find(firstWith.get(key));
    }
  });
  // a component's name: the smallest key that two of its notices share — the same every day for the same notices
  const shared = new Map();
  recalls.forEach((n, i) => { for (const key of keysOf(n)) shared.set(key, (shared.get(key) ?? 0) + 1); });
  const size = new Map();
  const name = new Map();
  recalls.forEach((n, i) => {
    const root = find(i);
    size.set(root, (size.get(root) ?? 0) + 1);
    for (const key of keysOf(n)) if (shared.get(key) > 1 && (!name.has(root) || key < name.get(root))) name.set(root, key);
  });
  return recalls.map((n, i) => {
    const { group, ...rest } = n;
    const root = find(i);
    return size.get(root) > 1 && name.has(root) ? { ...rest, group: name.get(root) } : rest;
  });
}

/** What the run did, for the log and for GitHub's summary page. */
function describe(report) {
  const lines = [`Obavijesti u fajlu: ${report.total}${report.previous === null ? '' : ` (prethodno ${report.previous})`} · s barkodom: ${report.withBarcode} · veličina: ${report.chars} znakova`];
  if (report.v2) lines.push(`v2 (fajl po zemlji): ${report.v2.total} obavijesti u ${report.v2.countries} fajlova${report.v2.previous === null ? '' : ` (prethodno ${report.v2.previous})`} · najveći fajl: ${report.v2.largest} znakova`);
  if (report.groups) lines.push(`Isti proizvod u više obavijesti: ${report.groups} grupa (${report.grouped} obavijesti)`);
  lines.push(`Ručno unesene: ${report.curated}`);
  for (const [name, s] of Object.entries(report.sources)) {
    if (!s.enabled) { lines.push(`Izvor ${name}: isključen`); continue; }
    const dropped = Object.entries(s.dropped).map(([k, v]) => `${k}: ${v}`).join('; ');
    lines.push(s.ok
      ? `Izvor ${name}: pročitano ${s.seen} redova → objavljeno ${s.published}${dropped ? ` (izostavljeno — ${dropped})` : ''}`
      : `Izvor ${name}: NIJE pročitan — ${s.error}. Zadržano iz prethodnog fajla: ${s.carried}`);
  }
  lines.push(`Po zemljama: ${Object.entries(report.byCountry).sort().map(([k, v]) => `${k} ${v}`).join(', ') || '—'}`);
  for (const w of report.warnings) lines.push(`UPOZORENJE: ${w}`);
  return lines.join('\n');
}

/** For how many days in a row each source has not been read — kept between runs in state/last-run.json. */
function nextState(prev, report) {
  const failing = {};
  for (const [name, s] of Object.entries(report.sources)) {
    if (!s.enabled || s.ok) continue;
    const since = prev && prev.failing && prev.failing[name] ? prev.failing[name] : report.generated.slice(0, 10);
    failing[name] = since;
  }
  return { generated: report.generated, total: report.total, curated: report.curated, byCountry: report.byCountry, sources: report.sources, failing, warnings: report.warnings };
}

async function main(argv) {
  const flags = new Set(argv);
  const config = readJson(path.join(ROOT, 'config.json'), {});
  let result;
  try {
    const curated = loadCurated();
    result = await build({ curated, previous: readText(OUT), previousAll: readPublishedV2(), config, offline: flags.has('--offline'), force: flags.has('--force') });
  } catch (e) {
    console.error(`\nNIJE OBJAVLJENO — objavljeni fajl ostaje kakav je bio.\n${e.message}\n`);
    if (e.report) console.error(describe(e.report));
    process.exitCode = 1;
    return;
  }
  const summary = describe(result.report);
  console.log(summary);
  for (const w of result.report.warnings) console.log(`::warning::${w.replace(/\n/g, ' ')}`);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### LUPA — povučeni proizvodi\n\n\`\`\`\n${summary}\n\`\`\`\n`);
  if (flags.has('--check')) { console.log('\n(--check: ništa nije upisano)'); return; }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, result.text);
  // v2: every country's file, then the index; a country that has no notice any more has no file
  fs.mkdirSync(OUT_V2, { recursive: true });
  for (const [file, text] of Object.entries(result.v2.files)) fs.writeFileSync(path.join(OUT_V2, file), text);
  fs.writeFileSync(path.join(OUT_V2, 'index.json'), result.v2.index);
  for (const file of fs.readdirSync(OUT_V2)) if (/^[a-z]{2}\.json$/.test(file) && !(file in result.v2.files)) fs.unlinkSync(path.join(OUT_V2, file));
  if (!flags.has('--offline')) {
    fs.mkdirSync(path.dirname(STATE), { recursive: true });
    fs.writeFileSync(STATE, `${JSON.stringify(nextState(readJson(STATE, null), result.report), null, 1)}\n`);
  }
  console.log(`\nUpisano: public/v1/recalls.json`);
}

if (require.main === module) main(process.argv.slice(2));

module.exports = { build, loadCurated, readPublishedV2, describe, nextState, withGroups, SOURCES, OUT, OUT_V2, STATE };
