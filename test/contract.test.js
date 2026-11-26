'use strict';
/** The format "v1": what is published is exactly what the app accepts — the same cases as the app's own test. */
const { verify } = require('./no-network');   // first: no test may touch the network
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../lib/contract');
const { isValidGtin, isShopNumber, gtinsIn } = require('../lib/gtin');
const { cases } = require('./fixtures/contract-cases.json');

test('the shared cases: accepted or refused exactly as the app does', () => {
  assert.ok(cases.length > 100);
  for (const c of cases) {
    const got = C.checkNotice(c.notice);
    assert.equal(got.ok, c.ok, `${c.what}${got.ok ? '' : ` — ${got.why}`}`);
    if (!got.ok) { assert.equal(typeof got.why, 'string'); assert.ok(got.why.length > 3, c.what); continue; }
    for (const [key, value] of Object.entries(c.expect || {})) {
      // the app holds a missing text as null and missing barcodes as []; the file simply leaves them out
      const mine = got.notice[key] === undefined ? (key === 'gtins' ? [] : null) : got.notice[key];
      assert.deepEqual(mine, value, `${c.what}: ${key}`);
    }
  }
});

test('a published notice carries only the fields of the format, the optional ones only when they have a value', () => {
  const full = C.checkNotice(cases[0].notice).notice;
  assert.deepEqual(Object.keys(full), ['id', 'country', 'published', 'category', 'hazard', 'name', 'brand', 'reason', 'details', 'lots', 'bestBefore', 'action', 'source', 'url', 'gtins']);
  const bare = C.checkNotice(cases[1].notice).notice;
  assert.deepEqual(Object.keys(bare), ['id', 'country', 'published', 'category', 'hazard', 'name', 'reason', 'source', 'url']);
  assert.deepEqual(C.unknownFields({ ...cases[0].notice, lot: 'L1', Name: 'x' }), ['lot', 'Name']);
  assert.deepEqual(C.unknownFields(cases[0].notice), []);
});

test('countries: the 27 member states, Bosnia and Herzegovina and Serbia', () => {
  assert.equal(C.EU_COUNTRIES.length, 27);
  assert.equal(new Set(C.COUNTRIES).size, 29);
  for (const c of ['BA', 'RS', 'HR', 'SI', 'FR', 'DE']) assert.ok(C.COUNTRIES.includes(c));
  for (const c of ['GB', 'CH', 'US', 'ME', 'MK', 'XK']) assert.ok(!C.COUNTRIES.includes(c));
});

test('a whole file is read as the app reads it', () => {
  const n = (id, published) => ({ ...cases[0].notice, id, published });
  const text = JSON.stringify({ version: 1, generated: '2026-11-26T04:10:00Z', recalls: [n('old-1', '2026-11-01'), n('new-1', '2026-11-25'), n('new-1', '2026-11-25'), n('bad id', '2026-11-25'), n('future-1', '2026-11-28')] });
  const feed = C.readFeed(text);
  assert.equal(feed.generated, '2026-11-26T04:10:00.000Z');
  assert.deepEqual(feed.recalls.map((r) => r.id), ['new-1', 'old-1']);   // newest first; twice → once; a bad one and a future one left out
  for (const bad of ['', '{', 'null', '[]', JSON.stringify({ version: 2, generated: '2026-11-26T04:10:00Z', recalls: [] }), JSON.stringify({ version: 1, recalls: [] }), JSON.stringify({ version: 1, generated: 'x', recalls: [] }), JSON.stringify({ version: 1, generated: '2026-11-26T04:10:00Z', recalls: {} })]) {
    assert.equal(C.readFeed(bad), null, bad.slice(0, 40));
  }
  assert.equal(C.readFeed(null), null);
});

test('the job publishes less than the app accepts at most', () => {
  assert.ok(C.MAX_RECALLS < C.APP_MAX_RECALLS);
  assert.ok(C.MAX_CHARS < C.APP_MAX_CHARS);
  assert.equal(C.APP_MAX_RECALLS, 1000);
  assert.equal(C.APP_MAX_CHARS, 600000);
});

test('barcodes: the check digit decides; every valid one in a text is found once', () => {
  for (const good of ['3017620422003', '5449000000996', '96385074', '012345678905', '10012345678902', '3850123456782']) assert.equal(isValidGtin(good), true, good);
  for (const bad of ['3017620422004', '123456789', '12345678901234567', '', 'abcdefgh', null, 3017620422003, '3850123456785']) assert.equal(isValidGtin(bad), false, String(bad));
  assert.deepEqual(gtinsIn('3017620422003 3017620425035'), ['3017620422003', '3017620425035']);
  assert.deepEqual(gtinsIn('3017620422003,3017620422003;96385074'), ['3017620422003', '96385074']);
  assert.deepEqual(gtinsIn(3017620422003), ['3017620422003']);
  assert.deepEqual(gtinsIn(['3017620422003', 5449000000996]), ['3017620422003', '5449000000996']);
  assert.deepEqual(gtinsIn('lot 123456789 GTIN 1234567890123 tel 0612345678'), []);      // wrong check digits are not barcodes
  assert.deepEqual(gtinsIn('130176204220031'), []);                                       // a longer number is not cut into one
  for (const none of [null, undefined, '', [], {}]) assert.deepEqual(gtinsIn(none), []);
});

test('numbers that shops give out themselves: told apart exactly as the app does (the same lists as its test)', () => {
  const SHOP = ['2609898025201', '0202558000000', '293134000002', '02609898025201', '2000000000008', '0400000000008', '0500000000005', '9900000000004', '9800000000007', '20123451', '00000017'];
  const OWN = ['3505870000343', '3850123456782', '4337182082293', '5099821001919', '8715342048819', '03456772024237', '366528701912', '012345678905', '96385074', '10012345678902', '1999999999992', '3000000000007', '0300000000001', '0600000000002', '9790000000001'];
  for (const code of SHOP) { assert.equal(isValidGtin(code), true, code); assert.equal(isShopNumber(code), true, code); }
  for (const code of OWN) { assert.equal(isValidGtin(code), true, code); assert.equal(isShopNumber(code), false, code); }
  for (const none of ['2609898025202', '', '26', 'abc', null, undefined, 2609898025201]) assert.equal(isShopNumber(none), false, String(none));
});

verify();
