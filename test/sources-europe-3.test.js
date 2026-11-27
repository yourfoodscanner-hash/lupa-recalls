'use strict';
/**
 * The adapters of the United Kingdom (FSA), Switzerland (RecallSwiss) and Norway (Mattilsynet), on what
 * their sources really answered on 27 Nov 2026 (test/fixtures/live/*-2026-11-27.json: the answers as
 * recorded on GitHub Actions, cut to fewer notices). These countries are in v2 only.
 */
const { verify } = require('./no-network');   // first: no test may touch the network
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../lib/contract');
const GB = require('../sources/fsa');
const CH = require('../sources/recallswiss');
const NO = require('../sources/mattilsynet');

const live = (name) => require(`./fixtures/live/${name}-2026-11-27.json`);
function server(pages) {
  const asked = [];
  const fetchImpl = async (url) => {
    asked.push(String(url));
    const body = pages[url];
    if (body === undefined) return { ok: false, status: 404, text: async () => 'not found', json: async () => { throw new SyntaxError('Unexpected token n'); } };
    return { ok: true, status: 200, text: async () => body, json: async () => JSON.parse(body) };
  };
  return { fetchImpl, asked };
}
const byId = (notices) => Object.fromEntries(notices.map((n) => [n.id, n]));
function sound(adapter, notices) {
  for (const n of notices) {
    const c = C.checkNotice(n, C.COUNTRIES_V2);
    assert.equal(c.ok, true, `${n.id}: ${c.why}`);
    assert.ok(n.id.startsWith(adapter.prefix), n.id);
    assert.equal(n.country, adapter.country);
    assert.equal(C.checkNotice(n).ok, false, 'v2 only');
  }
}
const MAINTENANCE = '<html><body>Wartung — maintenance</body></html>';

test('GB: the FSA\'s alerts, each from its own fields — batch, date, advice; "All batches" is no batch', async () => {
  const { fetchImpl, asked } = server(live('fsa'));
  const got = await GB.fetchNotices({ fetchImpl, since: '2026-10-13' });
  assert.deepEqual(asked, ['https://data.food.gov.uk/food-alerts/id?since=2026-10-13T00:00:00Z&_limit=100&_view=full']);
  sound(GB, got.notices);
  const n = byId(got.notices);
  assert.deepEqual(Object.keys(n), ['gb-fsa-aa-45-2026', 'gb-fsa-prin-49-2026', 'gb-fsa-aa-55-2026', 'gb-fsa-aa-45-2026-update-1']);
  const aa = n['gb-fsa-aa-45-2026'];
  assert.equal(aa.name, 'Skinny Crunch Light Peanut Butter Bars');
  assert.equal(aa.reason, 'Undeclared peanuts');
  assert.equal(aa.hazard, 'allergen');
  assert.equal(aa.lots, '6238 (08:30 – 10:30)');
  assert.equal(aa.bestBefore, 'August 2027');
  assert.match(aa.action, /^If you have bought the above product/);
  assert.match(aa.url, /^https:\/\/alerts\.food\.gov\.uk\/news-alerts\/alert\/fsa-aa-45-2026$/);
  const muesli = n['gb-fsa-aa-55-2026'];                                // "All batches", "All best before dates"
  assert.equal(muesli.lots, undefined);
  assert.equal(muesli.bestBefore, undefined);
  assert.equal(n['gb-fsa-prin-49-2026'].reason, 'Incorrect use-by date');
  await assert.rejects(GB.fetchNotices({ fetchImpl: server({ [asked[0]]: '{"error":"maintenance"}' }).fetchImpl, since: '2026-10-13' }), /format se promijenio/);
});

test('GB: a product code is a barcode only when it is a valid GTIN no shop gives out itself', () => {
  const item = {
    notation: 'FSA-PRIN-48-2026', created: '2026-10-08', title: 'Greencore recalls several products due to the presence of Salmonella',
    type: ['http://data.food.gov.uk/food-alerts/def/PRIN'], status: { label: 'Published' },
    alertURL: { '@id': 'https://alerts.food.gov.uk/news-alerts/alert/fsa-prin-48-2026' },
    productDetails: [
      { productName: 'Pinch Pan Poppin’ Chicken Pasanda', productCode: '5051873005819', packSizeDescription: '400g' },
      { productName: 'M&S Super Nutty Wholefood', productCode: '00797016' },                 // M&S's own number
      { productName: 'Another', productCode: '5051873005818' },                                // wrong check digit
    ],
    problem: [{ riskStatement: 'The presence of Salmonella in the products listed above.' }],
  };
  const { notice } = GB.toNotice(item);
  assert.deepEqual(notice.gtins, ['5051873005819']);
  assert.equal(notice.reason, 'Presence of Salmonella');
  assert.equal(notice.hazard, 'microbe');
  assert.equal(GB.toNotice({ ...item, status: { label: 'Withdrawn' } }).skip, 'upozorenje nije objavljeno (povučeno)');
});

test('CH: the register\'s food entries of the BLV — a public warning beside the recall of the same products is left out', async () => {
  const { fetchImpl, asked } = server(live('recallswiss'));
  const got = await CH.fetchNotices({ fetchImpl, since: '2026-10-20' });
  assert.equal(asked[0], 'https://www.recallswiss.admin.ch/customer-access-backend/resources/recalls?page=1&wirtschaftszweigId=2');
  sound(CH, got.notices);
  const n = byId(got.notices);
  // "Öffentliche Warnung" 1200 and 1201 are the BLV's warnings about the products of recalls 1199 and 1198
  assert.ok(!n['ch-recallswiss-1200'] && !n['ch-recallswiss-1201']);
  assert.equal(got.skipped['upozorenje BLV-a za isti proizvod kao objavljeni opoziv'], 2);
  assert.deepEqual(n['ch-recallswiss-1199'], {
    id: 'ch-recallswiss-1199', country: 'CH', published: '2026-11-27', category: 'food', hazard: 'allergen',
    name: "Anna's Best Momos Beef", reason: 'Nicht deklarierten Allergenen (Milch und Sesam)',
    details: "In Zusammenarbeit mit der zuständigen kantonalen Vollzugsbehörde ruft Migros das Produkt «Anna's Best Momos Beef» wegen nicht deklarierten Allergenen (Milch und Sesam) zurück.",
    lots: undefined, bestBefore: undefined, action: undefined,
    source: 'RecallSwiss / BLV', url: 'https://www.recallswiss.admin.ch/customer-access/#Recalls/1199', gtins: [],
  });
  // a warning with no recall of the same products stays
  assert.equal(n['ch-recallswiss-1192'].reason, 'Listerien in Mini-Hähnchenbrust-Filetstücken 150g, verkauft bei ALDI SUISSE AG');
  assert.equal(n['ch-recallswiss-1177'].reason, 'Listerien');                // "… wegen Listerien zurück (verkauft bei …)"
  await assert.rejects(CH.fetchNotices({ fetchImpl: server({ [asked[0]]: '{"error":"maintenance"}' }).fetchImpl, since: '2026-10-20' }), /format se promijenio/);
});

test('NO: food recalls — the products\' fields; kitchenware left out; the list read until a page is older than the window', async () => {
  const { fetchImpl, asked } = server(live('mattilsynet'));
  const got = await NO.fetchNotices({ fetchImpl, since: '2026-11-20' });
  sound(NO, got.notices);
  assert.ok(asked.includes('https://www.mattilsynet.no/tilbakekallinger?category=mat%2Fmatkontaktmaterialer'));
  assert.ok(!asked.includes('https://www.mattilsynet.no/tilbakekallinger?category=mat&index=2'));   // page 2 was all older
  assert.equal(got.notices.length, 3);
  const n = byId(got.notices);
  const cocoa = n['no-mattilsynet-sunkost-superfood-kakaopulver-tilbakekalles'];
  assert.equal(cocoa.name, 'Sunkost Superfood Kakaopulver, økologisk');
  assert.equal(cocoa.reason, 'PAH og Benzo(a)pyren over grenseverdi');
  assert.equal(cocoa.hazard, 'chemical');
  assert.equal(cocoa.lots, '411599');
  assert.equal(cocoa.bestBefore, '31.03.2028');
  assert.deepEqual(cocoa.gtins, ['7340051803612']);
  const butter = got.notices.find((x) => /strandamor/.test(x.id));
  assert.equal(butter.lots, '62104654, 62104661');                       // "62104654 (best før …) og 62104661 (…)"
  assert.equal(butter.hazard, 'microbe');                                  // "Mugg"
  await assert.rejects(NO.fetchNotices({ fetchImpl: server({ ...live('mattilsynet'), 'https://www.mattilsynet.no/tilbakekallinger?category=mat': MAINTENANCE }).fetchImpl, since: '2026-11-20' }), /format se promijenio/);
});

verify();
