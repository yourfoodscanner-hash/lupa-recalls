'use strict';
/**
 * The adapter of the United States (FDA's Enforcement Report through openFDA, and the companies'
 * announcements the FDA posts), on what both really answered on 27 Nov 2026
 * (test/fixtures/live/fda-2026-11-27.json: the answers as recorded on GitHub Actions — the report cut to
 * eight recalls, the list of announcements to a few rows, their pages to the announcement). And what it
 * does when they answer something else.
 */
const { verify } = require('./no-network');   // first: no test may touch the network
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../lib/contract');
const US = require('../sources/fda');

const live = require('./fixtures/live/fda-2026-11-27.json');
const NOW = new Date('2026-11-27T12:00:00Z');
function server(pages, status = 200) {
  const asked = [];
  const fetchImpl = async (url) => {
    asked.push(String(url));
    const body = pages[url];
    if (body === undefined || status !== 200) return { ok: false, status: body === undefined ? 404 : status, text: async () => '{"error":{"code":"NOT_FOUND"}}', json: async () => ({ error: { code: 'NOT_FOUND' } }) };
    return { ok: true, status: 200, text: async () => body, json: async () => JSON.parse(body) };
  };
  return { fetchImpl, asked };
}
const byId = (notices) => Object.fromEntries(notices.map((n) => [n.id, n]));

const LIST = US.ANNOUNCEMENTS;
const PAGE = (slug) => `https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts/${slug}`;

test('US: one notice per recall — its products, barcodes and batches as the report labels them', async () => {
  const { fetchImpl, asked } = server(live);
  const got = await US.fetchNotices({ fetchImpl, since: '2026-10-13', now: NOW });
  assert.deepEqual(asked.slice(0, 2), ['https://api.fda.gov/food/enforcement.json?search=report_date:[20261013+TO+20261127]&limit=1000&sort=report_date:desc', LIST]);
  for (const n of got.notices) {
    const c = C.checkNotice(n, C.COUNTRIES_V2);
    assert.equal(c.ok, true, `${n.id}: ${c.why}`);
    assert.equal(n.country, 'US');
    assert.equal(C.checkNotice(n).ok, false);                           // a notice of v2 only: v1 does not take US
  }
  const n = byId(got.notices);
  assert.deepEqual(n['us-fda-100258'], {
    id: 'us-fda-100258', country: 'US', published: '2026-11-18', category: 'food', hazard: 'foreign',
    name: 'Ground Up Nut Butter Cups filled with Almond & Cashew Butter Dark Chocolate Two Pack', reason: 'Foreign material: plastic fiber',
    details: 'Breath of Fresh Air PDX LLC (Portland, OR). FDA Class II. Product was distributed in Oregon and sold nationwide through online orders.',
    lots: '10/2027', bestBefore: '10/2027',
    source: 'U.S. Food and Drug Administration (FDA)', url: 'https://api.fda.gov/food/enforcement.json?search=event_id:100258&limit=100',
    gtins: ['850017637221'],                                             // written "UPC 8 50017 63722 1"
  });
  // a recall of 50 products is one notice: every product's barcode, every batch
  const many = n['us-fda-99727'];
  assert.match(many.name, /^Jovy Gummy Worms Neon, Milk Chocolate Covered Raisins/);
  assert.ok(many.gtins.length >= 5 && many.gtins.every((g) => /^\d{12,13}$/.test(g)));
  assert.match(many.lots, /^6156, 630-715, 14250/);
  // "- Product Name: 7-Eleven Horchata FD 4:1 BIB - Brand: …" and "28 oz …": the product's name
  assert.equal(n['us-fda-100191'].name, '7-Eleven Horchata FD 4:1 BIB');
  assert.match(n['us-fda-99991'].name, /^Gatorade Lemon Lime/);
});

test('US: a recall the company announced is one notice — the announcement, with the report\'s batches and barcodes', async () => {
  const { fetchImpl } = server(live);
  const got = await US.fetchNotices({ fetchImpl, since: '2026-10-13', now: NOW });
  const n = byId(got.notices);
  assert.equal(n['us-fda-100177'], undefined, 'the report\'s record of Brad\'s recall is not published again');
  assert.equal(got.skipped['isti opoziv kao saopćenje firme'], 1);
  const brads = got.notices.find((x) => x.url === PAGE('snack-right-super-foods-inc-dba-brads-raw-chips-recalls-brads-crunchy-kale-veggie-chips-due'));
  assert.equal(brads.published, '2026-11-03');
  assert.equal(brads.name, 'Brad’s Crunchy Kale and Veggie Chips Kale');
  assert.equal(brads.reason, 'Product may contain thallium');
  assert.equal(brads.hazard, 'chemical');
  assert.match(brads.lots, /^33525-1, 33525-2, 33525-3, 34525-1, 35125-2/);
  assert.match(brads.bestBefore, /^February 1, 2027, February 11, 2027/);   // "Best By February 1, 2027"
  assert.ok(brads.gtins.includes('813104021679'));
  assert.match(brads.action, /consumers/i);
  // the products' table: "UPC" and "Best By/Expiration Date" columns ("6-926664705713" is one barcode)
  const sanniu = got.notices.find((x) => /shanghai-san-niu/.test(x.url));
  assert.deepEqual(sanniu.gtins, ['6926664703467', '6926664700435', '6926664706048', '6926664705713']);
  assert.equal(sanniu.hazard, 'allergen');
  const osteo = got.notices.find((x) => /bioquad/.test(x.url));     // "LOT#0524100", "8 57294 00722 8"
  assert.equal(osteo.category, 'supplement');
  assert.equal(osteo.lots, '0524100, 0625041');
  assert.ok(osteo.gtins.includes('857294007228'));
  // undeclared tadalafil in a "supplement" is a drug in it, not an allergen
  assert.equal(got.notices.find((x) => /eros-apothecary/.test(x.url)).hazard, 'chemical');
  // the same announcement in Spanish beside the English one: once; drugs and pet food: not at all
  assert.equal(got.notices.filter((x) => /pan-pepin/.test(x.url)).length, 1);
  assert.equal(got.skipped['isto saopćenje na španskom'], 1);
  assert.ok(!got.notices.some((x) => /par-health|fromm|laubs/.test(x.url)));
  // a page that cannot be read: the notice from the list, the page asked again next time
  const forza = got.notices.find((x) => /tonight-we-ride/.test(x.url));
  assert.equal(forza.name, 'Ultimate Forza Male Supplement');
  assert.equal(got.skipped['stranica saopćenja nije pročitana (objavljeno iz liste)'], 1);
  // read once: next time the page is not asked for
  const again = server(live);
  await US.fetchNotices({ fetchImpl: again.fetchImpl, since: '2026-10-13', now: NOW, known: new Map(got.notices.map((x) => [x.id, x])) });
  assert.ok(!again.asked.includes(brads.url));
});

test('US: nothing reported in the window is no failure; an answer that is not openFDA\'s or the FDA\'s list stops the source', async () => {
  const none = await US.fetchNotices({ fetchImpl: server({ [LIST]: live[LIST] }).fetchImpl, since: '2026-10-13', now: NOW });   // openFDA: 404 "No matches found"
  assert.ok(none.notices.length > 0 && none.notices.every((x) => x.url.startsWith('https://www.fda.gov/')));
  const url = Object.keys(live)[0];
  await assert.rejects(US.fetchNotices({ fetchImpl: server({ ...live, [url]: '{"maintenance":true}' }).fetchImpl, since: '2026-10-13', now: NOW }), /format se promijenio/);
  await assert.rejects(US.fetchNotices({ fetchImpl: server({ ...live, [LIST]: '{"maintenance":true}' }).fetchImpl, since: '2026-10-13', now: NOW }), /format se promijenio/);
  await assert.rejects(US.fetchNotices({ fetchImpl: server(live, 503).fetchImpl, since: '2026-10-13', now: NOW }), /HTTP 503/);
});

test('US: a barcode in groups is one number; a name is not a size', () => {
  assert.equal(US.joinedBarcodes('UPC: 0 11152 64246 8 and UPC 8-50017-63722-1'), 'UPC: 011152642468 and UPC 850017637221');
  assert.equal(US.productName("Brad's Crunchy Kale Original, 2 oz (57g) bags with UPC 813104021679."), "Brad's Crunchy Kale Original, 2 oz (57g) bags");
  assert.equal(US.productName('28 oz. jar of Brand X Salsa Picante, UPC 012345678905'), 'jar of Brand X Salsa Picante');
});

verify();
