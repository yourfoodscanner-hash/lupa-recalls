'use strict';
/**
 * The build: hand-written notices that must be right, sources that may fail, and a file that is
 * published only when it is sound. Nothing here touches the network or the repository's own files.
 */
const { verify } = require('./no-network');   // first: no test may touch the network
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { build, loadCurated, describe, nextState } = require('../lib/build');
const { unhealthy } = require('../lib/health');
const C = require('../lib/contract');
const RC = require('../sources/rappelconso');
const rows = require('./fixtures/rappelconso-v2.json');

const NOW = new Date('2026-11-26T04:10:00Z');
const CONFIG = { userAgent: 'lupa-recalls/1.0 (test)', curatedWindowDays: 180, sources: { rappelconso: { enabled: true, windowDays: 45 } } };
const notice = (id, over = {}) => ({
  id, country: 'HR', published: '2026-11-24', category: 'baby', hazard: 'foreign', name: 'Dječja kašica jabuka i kruška, 190 g',
  reason: 'komadići stakla', source: 'Državni inspektorat Republike Hrvatske', url: 'https://dirh.gov.hr/obavijesti/123', gtins: ['3850123456782'], ...over,
});
const checked = (list) => list.map((n) => { const c = C.checkNotice(n); assert.equal(c.ok, true, c.why); return c.notice; });
const live = (body = rows, status = 200) => async () => ({ ok: status < 300, status, json: async () => body });
const down = async () => { throw new Error('getaddrinfo ENOTFOUND data.economie.gouv.fr'); };
const run = (options) => build({ now: NOW, config: CONFIG, curated: [], ...options });
/** A folder of hand-written files for loadCurated. */
function curatedDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lupa-recalls-'));
  for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), typeof content === 'string' ? content : JSON.stringify(content));
  return dir;
}

test('hand-written notices and a source together: one file, newest first, readable by the app', async () => {
  const curated = checked([notice('hr-2026-11-24-kasica'), notice('ba-2026-11-10-formula', { country: 'BA', published: '2026-11-10' })]);
  const { text, recalls, report } = await run({ curated, fetchImpl: live() });
  assert.deepEqual(recalls.map((n) => n.id), ['fr-rc-2026-11-0101', 'hr-2026-11-24-kasica', 'fr-rc-2026-11-0102', 'fr-rc-2026-11-0103', 'fr-rc-2026-11-0104', 'fr-rc-2026-11-0105', 'fr-rc-2026-11-0106', 'fr-rc-2026-11-0113', 'fr-rc-2026-11-0114', 'ba-2026-11-10-formula']);
  const file = JSON.parse(text);
  assert.equal(file.version, 1);
  assert.equal(file.generated, '2026-11-26T04:10:00Z');
  assert.deepEqual(C.readFeed(text).recalls, recalls);                 // read back as the app reads it: the same notices
  assert.ok(text.endsWith('\n'));
  assert.deepEqual(report.byCountry, { BA: 1, FR: 8, HR: 1 });
  assert.equal(report.sources.rappelconso.ok, true);
  assert.equal(report.sources.rappelconso.published, 8);
  assert.equal(report.total, 10);
  assert.equal(report.withBarcode, 6);
  assert.match(describe(report), /Obavijesti u fajlu: 10 · s barkodom: 6/);
  // the same input gives the same file: nothing in it depends on the order things arrived in
  const again = await run({ curated: [...curated].reverse(), fetchImpl: live([...rows].reverse()) });
  assert.equal(again.text, text);
});

test('a source that cannot be read keeps what it gave last time — and says so', async () => {
  const first = await run({ fetchImpl: live() });
  for (const fetchImpl of [down, live(rows, 503), live({ error: 'maintenance' }), live(rows.map((r) => ({ autre: r.libelle })))]) {
    const next = await run({ now: new Date('2026-11-27T04:10:00Z'), previous: first.text, fetchImpl });
    assert.deepEqual(next.recalls.map((n) => n.id), first.recalls.map((n) => n.id));
    assert.equal(next.report.sources.rappelconso.ok, false);
    assert.equal(next.report.sources.rappelconso.carried, 8);
    assert.equal(next.report.warnings.length, 1);
    assert.match(next.report.warnings[0], /nije pročitan .* Zadržano 8/);
    assert.equal(JSON.parse(next.text).generated, '2026-11-27T04:10:00Z');   // the file is made anew: the app sees the job is alive
  }
  // a source that suddenly gives nothing, having given many, has failed too
  const many = Array.from({ length: 12 }, (_, i) => ({ ...rows[0], numero_fiche: `2026-11-9${String(i).padStart(3, '0')}` }));
  const full = await run({ fetchImpl: live(many) });
  assert.equal(full.recalls.length, 12);
  const emptied = await run({ previous: full.text, fetchImpl: live([rows[6]]) });   // only a scooter: nothing LUPA shows
  assert.equal(emptied.report.sources.rappelconso.ok, false);
  assert.match(emptied.report.sources.rappelconso.error, /0 obavijesti, a prošli put 12/);
  assert.equal(emptied.recalls.length, 12);
  // carried notices still leave when they are older than the window
  const later = await run({ now: new Date('2027-01-20T04:10:00Z'), previous: first.text, fetchImpl: down });
  assert.deepEqual(later.recalls, []);
});

test('--offline reads no source and keeps the previous notices', async () => {
  const first = await run({ fetchImpl: live() });
  let asked = 0;
  const off = await run({ previous: first.text, offline: true, fetchImpl: async () => { asked += 1; throw new Error('must not be called'); } });
  assert.equal(asked, 0);
  assert.equal(off.recalls.length, 8);
  assert.deepEqual(off.report.warnings, []);
});

test('a switched-off source is not read, and its notices leave the file', async () => {
  const first = await run({ fetchImpl: live() });
  const off = await run({ previous: first.text, config: { ...CONFIG, sources: { rappelconso: { enabled: false } } }, fetchImpl: down, curated: checked([notice('hr-2026-11-24-kasica')]), force: true });
  assert.deepEqual(off.recalls.map((n) => n.id), ['hr-2026-11-24-kasica']);
  assert.match(describe(off.report), /Izvor rappelconso: isključen/);
});

test('a hand-written notice wins over a source; its id may not look like a source\'s', async () => {
  await assert.rejects(run({ curated: checked([notice('fr-rc-2026-11-0101')]), fetchImpl: live() }), /rezervisan za izvor/);
});

test('windows: a source\'s notices 45 days, hand-written ones 180; nothing dated after tomorrow', async () => {
  const curated = checked([
    notice('hr-inside', { published: '2026-05-31' }), notice('hr-outside', { published: '2026-05-29' }),
    notice('hr-tomorrow', { published: '2026-11-27' }), notice('hr-future', { published: '2026-12-05' }),
  ]);
  const { recalls, report } = await run({ curated, fetchImpl: live() });
  const ids = recalls.map((n) => n.id);
  assert.ok(ids.includes('hr-inside') && ids.includes('hr-tomorrow'));
  assert.ok(!ids.includes('hr-outside') && !ids.includes('hr-future'));
  assert.ok(report.warnings.some((w) => /hr-future.*budućnosti/.test(w)));
  assert.ok(!ids.includes('fr-rc-2026-09-0001'));                      // 1 Sep: older than 45 days
});

test('never more or larger than the app accepts: the oldest notices of the sources go first, hand-written ones stay', async () => {
  const many = Array.from({ length: 900 }, (_, i) => ({ ...rows[0], numero_fiche: `2026-11-${String(i).padStart(4, '0')}`, date_publication: `2026-11-${String(1 + (i % 25)).padStart(2, '0')}` }));
  const curated = checked([notice('hr-old-but-kept', { published: '2026-07-01' })]);
  const { recalls, report, text } = await run({ curated, fetchImpl: live(many) });
  assert.equal(recalls.length, C.MAX_RECALLS);
  assert.ok(recalls.some((n) => n.id === 'hr-old-but-kept'));
  assert.ok(report.warnings.some((w) => /Izostavljeno 101 najstarijih/.test(w)));
  assert.ok(text.length <= C.MAX_CHARS);                              // the file as written — what the app downloads and measures
  // large texts: the size limit trims as well
  const big = Array.from({ length: 700 }, (_, i) => ({ ...rows[0], numero_fiche: `2026-11-${String(i).padStart(4, '0')}`, risques_encourus: 'x'.repeat(900), conduites_a_tenir_par_le_consommateur: 'y'.repeat(600) }));
  const trimmed = await run({ fetchImpl: live(big) });
  assert.ok(trimmed.recalls.length < 700 && trimmed.recalls.length > 100);
  assert.ok(trimmed.text.length <= C.MAX_CHARS);
  assert.ok(trimmed.text.length > C.MAX_CHARS - 3000);                // … and no more is left out than needed
});

test('a list that suddenly shrinks to less than half is not published', async () => {
  const curated = checked(Array.from({ length: 30 }, (_, i) => notice(`hr-n-${i}`)));
  const first = await run({ curated, fetchImpl: live() });
  assert.equal(first.recalls.length, 38);
  await assert.rejects(run({ curated: curated.slice(0, 5), previous: first.text, config: { ...CONFIG, sources: { rappelconso: { enabled: false } } } }), /smanjila s 38 na 5/);
  const forced = await run({ curated: curated.slice(0, 5), previous: first.text, config: { ...CONFIG, sources: { rappelconso: { enabled: false } } }, force: true });
  assert.equal(forced.recalls.length, 5);
  // more than half left: fine; a small list may shrink freely
  assert.equal((await run({ curated: curated.slice(0, 20), previous: first.text, fetchImpl: live() })).recalls.length, 28);
  const small = await run({ curated: curated.slice(0, 4), fetchImpl: down });
  assert.equal((await run({ curated: [], previous: small.text, offline: true })).recalls.length, 0);
});

test('a number a shop gives out itself is never published as a barcode — whatever way it came', async () => {
  // from a source: left out of the notice, the notice stays
  const weighed = [{ ...rows[0], numero_fiche: '2026-11-0901', gtin: '2609898025201 3017620422003 0202558000000' }, { ...rows[0], numero_fiche: '2026-11-0902', gtin: '293134000002' }];
  const out = await run({ fetchImpl: live(weighed) });
  assert.deepEqual(out.recalls.map((n) => [n.id, n.gtins ?? []]), [['fr-rc-2026-11-0901', ['3017620422003']], ['fr-rc-2026-11-0902', []]]);
  // carried over from a file made before this rule: cleaned on the way
  const old = JSON.stringify({ version: 1, generated: '2026-11-25T04:10:00Z', recalls: [
    { ...out.recalls[0], gtins: ['2609898025201', '3017620422003'] }, { ...out.recalls[1], gtins: ['0202558000000'] },
  ] });
  const carried = await run({ previous: old, fetchImpl: down });
  assert.deepEqual(carried.recalls.map((n) => n.gtins ?? []), [['3017620422003'], []]);
  assert.equal(carried.report.sources.rappelconso.carried, 2);
  for (const n of carried.recalls) assert.equal(C.checkNotice(n).ok, true);
  // by hand (should loadCurated ever be bypassed): the build refuses to publish
  await assert.rejects(run({ curated: checked([notice('hr-weighed', { gtins: ['2609898025201'] })]), fetchImpl: down }), /brojevi koje prodavnice dodjeljuju same \(hr-weighed: 2609898025201\)/);
});

test('a previous file that is not the format is simply not used', async () => {
  for (const previous of ['', '{', 'null', '<!doctype html>', JSON.stringify({ version: 2, generated: '2026-11-25T04:10:00Z', recalls: [notice('fr-rc-x1')] })]) {
    const out = await run({ previous, fetchImpl: down });
    assert.deepEqual(out.recalls, []);
    assert.equal(out.report.previous, null);
  }
});

test('hand-written files: every mistake stops the build and is named with its file and entry', () => {
  const good = curatedDir({ 'hr.json': [notice('hr-2026-11-24-kasica')], 'ba.json': [], 'eu.json': [notice('fi-2026-11-20-x', { country: 'FI' })], '_draft.json': 'not read at all {' });
  assert.deepEqual(loadCurated(good).map((n) => n.id), ['fi-2026-11-20-x', 'hr-2026-11-24-kasica']);
  assert.deepEqual(loadCurated(path.join(os.tmpdir(), 'no-such-folder-lupa')), []);
  const wrong = [
    [{ 'hr.json': '[ { "id": "x" ' }, /curated\/hr\.json: nije ispravan JSON/],
    [{ 'hr.json': { recalls: [] } }, /curated\/hr\.json: treba lista/],
    [{ 'hr.json': [notice('hr-1', { url: 'http://dirh.gov.hr/x' })] }, /curated\/hr\.json, obavijest 1 \(„hr-1”\): url .* treba https/],
    [{ 'hr.json': [notice('hr-1', { gtins: ['3850123456785'] })] }, /nije ispravan barkod/],
    [{ 'hr.json': [notice('hr-1', { gtins: ['3850123456782', '2609898025201'] })] }, /barkod „2609898025201” je broj koji prodavnica dodjeljuje sama/],
    [{ 'hr.json': [notice('hr-1', { published: '24.11.2026' })] }, /published „24\.11\.2026” — treba dan u obliku GGGG-MM-DD/],
    [{ 'hr.json': [notice('hr-1', { hazard: 'bacteria' })] }, /hazard „bacteria” — jedno od: microbe, allergen/],
    [{ 'hr.json': [notice('hr-1', { category: 'hrana' })] }, /category „hrana” — jedno od: baby, food/],
    [{ 'hr.json': [notice('HR 1')] }, /id „HR 1” — dozvoljeno/],
    [{ 'hr.json': [notice('hr-1', { country: 'SI' })] }, /country je „SI”, a fajl je za „HR”/],
    [{ 'hr.json': [notice('hr-1', { lot: 'L24318' })] }, /nepoznato polje „lot”/],
    [{ 'hr.json': [notice('hr-1', { name: 'n'.repeat(161) })] }, /name ima 161 znakova, najviše 160/],
    [{ 'hr.json': [notice('hr-1'), notice('hr-1')] }, /obavijest 2 \(„hr-1”\): id već postoji u curated\/hr\.json/],
    [{ 'hr.json': [notice('hr-1')], 'eu.json': [notice('hr-1')] }, /id već postoji u curated\/eu\.json/],
    [{ 'hr.json': [notice('hr-1'), 'text', notice('hr-3', { reason: '' })] }, /2 grešku[\s\S]*obavijest 2: nije objekat[\s\S]*obavijest 3 \(„hr-3”\): reason/],
  ];
  for (const [files, message] of wrong) assert.throws(() => loadCurated(curatedDir(files)), message, JSON.stringify(files).slice(0, 80));
});

test('the repository\'s own hand-written files and settings are sound', () => {
  const curated = loadCurated();
  for (const n of curated) assert.equal(C.checkNotice(n).ok, true);
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8'));
  assert.match(config.feedUrl, /^https:\/\/[a-z0-9-]+\.github\.io\/lupa-recalls\/v1\/recalls\.json$/);
  assert.ok(config.sources.rappelconso.windowDays >= 14);
  assert.match(config.userAgent, /lupa-recalls\/\d/);
  // what is committed as the published file is the format
  const published = fs.readFileSync(path.join(__dirname, '..', 'public', 'v1', 'recalls.json'), 'utf8');
  assert.notEqual(C.readFeed(published), null);
});

test('a source that stays silent for three days fails the run — one bad day does not', () => {
  const report = (ok) => ({ generated: '2026-11-26T04:10:00Z', total: 1, curated: 1, byCountry: {}, warnings: [], sources: { rappelconso: { enabled: true, ok } } });
  let state = nextState(null, report(false));
  assert.deepEqual(state.failing, { rappelconso: '2026-11-26' });
  assert.deepEqual(unhealthy(state, '2026-11-26'), []);
  state = nextState(state, { ...report(false), generated: '2026-11-27T04:10:00Z' });
  assert.deepEqual(state.failing, { rappelconso: '2026-11-26' });                 // the first day is remembered
  assert.deepEqual(unhealthy(state, '2026-11-27'), []);
  assert.deepEqual(unhealthy(state, '2026-11-28'), [{ name: 'rappelconso', since: '2026-11-26', days: 3 }]);
  state = nextState(state, { ...report(true), generated: '2026-11-28T04:10:00Z' });
  assert.deepEqual(state.failing, {});                                              // read again: forgotten
  assert.deepEqual(unhealthy(state, '2026-12-28'), []);
  assert.deepEqual(unhealthy(null, '2026-11-26'), []);
  assert.deepEqual(nextState(null, { ...report(false), sources: { rappelconso: { enabled: false, ok: false } } }).failing, {});
});

test('the adapter is the one the build uses, with a prefix nothing else may use', () => {
  assert.equal(RC.prefix, 'fr-rc-');
  assert.equal(RC.country, 'FR');
  assert.equal(require('../lib/build').SOURCES.rappelconso, RC);
});

test('only the sources config.json names are read — and each is given what it published last time', async () => {
  const calls = [];
  const fake = (name, prefix, country) => ({
    name, prefix, country,
    fetchNotices: async ({ since, known }) => {
      calls.push({ name, since, known: [...known.keys()] });
      return { notices: [{ id: `${prefix}1`, country, published: '2026-11-25', category: 'food', hazard: 'other', name: 'Proizvod', reason: 'razlog', source: name, url: 'https://example.org/1' }], seen: 1, skipped: {} };
    },
  });
  const sources = { one: fake('one', 'xa-one-', 'AT'), two: fake('two', 'xb-two-', 'SI') };
  const config = { ...CONFIG, sources: { one: { windowDays: 10 } } };
  const first = await build({ now: NOW, config, curated: [], sources });
  assert.deepEqual(calls, [{ name: 'one', since: '2026-11-16', known: [] }]);
  assert.deepEqual(first.recalls.map((n) => n.id), ['xa-one-1']);
  assert.deepEqual([first.report.sources.one.enabled, first.report.sources.two.enabled], [true, false]);
  await build({ now: NOW, config, curated: [], sources, previous: first.text });
  assert.deepEqual(calls[1].known, ['xa-one-1']);
});

test('every source the job can read: its own prefix and country; config.json names only these, each with a window', () => {
  const { SOURCES } = require('../lib/build');
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8'));
  const prefixes = Object.values(SOURCES).map((s) => s.prefix);
  for (const [name, adapter] of Object.entries(SOURCES)) {
    assert.equal(adapter.name, name);
    assert.match(adapter.prefix, /^[a-z]{2}-[a-z]+-$/);
    assert.ok(C.COUNTRIES.includes(adapter.country), name);
    assert.ok(adapter.prefix.startsWith(adapter.country.toLowerCase()), name);
    assert.equal(typeof adapter.fetchNotices, 'function');
    assert.match(adapter.defaultUrl, /^https:\/\//);
    assert.equal(prefixes.filter((p) => p.startsWith(adapter.prefix) || adapter.prefix.startsWith(p)).length, 1, `${name}: a prefix that overlaps another`);
  }
  for (const [name, settings] of Object.entries(config.sources)) {
    assert.ok(SOURCES[name], `config.json names „${name}”, which the job does not know`);
    assert.ok(Number.isInteger(settings.windowDays) && settings.windowDays >= 14 && settings.windowDays <= 365, name);
  }
});

verify();
