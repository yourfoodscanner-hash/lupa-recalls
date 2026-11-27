'use strict';
/**
 * The adapters of Denmark, Czechia, Greece and the EU's RASFF Consumers' Portal, on what their sources
 * really answered on 27 Nov 2026 (test/fixtures/live/*-2026-11-27.json: the answers as recorded on
 * GitHub Actions, cut to fewer notices and to the part of a page the adapter reads). And what each does
 * when its source answers something else: it stops with a message — it never publishes a guess.
 */
const { verify } = require('./no-network');   // first: no test may touch the network
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../lib/contract');
const DK = require('../sources/fvst');
const CZ = require('../sources/pranyr');
const GR = require('../sources/efet');
const EU = require('../sources/rasff');

const live = (name) => require(`./fixtures/live/${name}-2026-11-27.json`);
/** A fetch that answers from recorded pages (404 for anything else) and remembers what it was asked. */
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
/** Every notice: the format's checks, the adapter's prefix and country, an id only once. */
function sound(adapter, notices, countries = [adapter.country]) {
  const ids = new Set();
  for (const n of notices) {
    const c = C.checkNotice(n);
    assert.equal(c.ok, true, `${n.id}: ${c.why}`);
    assert.ok(n.id.startsWith(adapter.prefix), n.id);
    assert.ok(countries.includes(n.country), n.id);
    assert.equal(ids.has(n.id), false, `${n.id} twice`);
    ids.add(n.id);
  }
}
const withPage = (pages, url, body) => ({ ...pages, [url]: body });

// ── Denmark ──────────────────────────────────────────────────────────────────────────────────────────
const DK_FEED = DK.defaultUrl;
const DK_KEBAB = 'https://www.foedevarestyrelsen.dk/nyheder/tilbagekaldte-produkter/2026/nov/tilbagekald-af-oksekebab';

test('DK: the feed and each notice\'s page — the product, its barcode and dates as the page labels them', async () => {
  const { fetchImpl } = server(live('fvst'));
  const got = await DK.fetchNotices({ fetchImpl, since: '2026-10-01' });
  sound(DK, got.notices);
  const n = byId(got.notices);
  assert.deepEqual(n['dk-fvst-2026-nov-tilbagekald-af-oksekebab'], {
    id: 'dk-fvst-2026-nov-tilbagekald-af-oksekebab', country: 'DK', published: '2026-11-26', category: 'food', hazard: 'other',
    name: "Heat'n Eat Okse kebab", brand: undefined, reason: 'Der er ved analyse påvist hjernevæv fra kvæg i produktet',
    details: 'Der er ved analyse påvist hjernevæv fra kvæg i produktet. Hjernevæv fra kvæg på over 12 måneder er specificeret risikomateriale, som potentielt kan indeholde sygdomsfremkaldende prioner, og må ikke bruges til fødevarer.',
    lots: undefined, bestBefore: '7/4-2028, 12/4-2028',
    action: 'Har du produktet, bør du enten levere det tilbage til butikken, hvor det er købt, eller kassere det.',
    source: 'Fødevarestyrelsen', url: DK_KEBAB, gtins: ['5705518183096'],
  });
  // many products: the notice's own title names them; the products and their dates are in details
  const many = n['dk-fvst-2026-nov-tilbagekald-aebleskiver-og-smaakager'];
  assert.equal(many.name, 'Risiko for mykotoksiner i flere typer af æbleskiver, kiks og småkager');
  assert.equal(many.hazard, 'toxin');
  assert.match(many.details, /^Favorina æbleskiver 560g; bedst før: 06-10-2027 og 13-10-2027; Karen Volf Skibskiks;/);
  assert.match(many.bestBefore, /^06-10-2027, 13-10-2027, 29-09-2027/);
  // headings written as <h1> on one page, with "Brand:" and "EAN nr" lines
  const pb = n['dk-fvst-2026-nov-tilbagekald-chlorpyrifos-i-peanut-butter'];
  assert.equal(pb.brand, 'Urtekram');
  assert.deepEqual(pb.gtins, ['5701058014432', '5701058014449']);
  assert.equal(pb.hazard, 'chemical');
  // "EAN-stregkode: …" and "Bedst før: 10.04.2027"
  const ch = n['dk-fvst-2026-nov-tilbagekald-kikaerter'];
  assert.deepEqual([ch.name, ch.gtins, ch.bestBefore, ch.hazard], ['ØKO Änglamark Kikærte', ['7340191175181'], '10.04.2027', 'foreign']);
  // "af mærket Eridanous" is not a labeled brand
  assert.equal(n['dk-fvst-2026-nov-tilbagekald-salmonella-i-chicken-gyros'].brand, undefined);
  assert.equal(got.skipped['stavka nije obavijest o povlačenju'], 1);   // a press release in the same feed
});

test('DK: a notice read before is not read again; a page that cannot be read is left for the next run', async () => {
  const pages = live('fvst');
  const first = await DK.fetchNotices({ fetchImpl: server(pages).fetchImpl, since: '2026-11-20' });
  const { fetchImpl, asked } = server(pages);
  const again = await DK.fetchNotices({ fetchImpl, since: '2026-11-20', known: new Map(first.notices.map((n) => [n.id, n])) });
  assert.deepEqual(asked, [DK_FEED]);
  assert.deepEqual(again.notices, first.notices);
  const broken = { ...pages };
  delete broken[DK_KEBAB];
  const partial = await DK.fetchNotices({ fetchImpl: server(broken).fetchImpl, since: '2026-11-20' });
  assert.equal(partial.notices.some((n) => n.url === DK_KEBAB), false);
  assert.equal(partial.skipped['stranica obavijesti nije pročitana (pokušava se sljedeći put)'], 1);
});

test('DK: a feed or pages in another form stop the adapter', async () => {
  const pages = live('fvst');
  await assert.rejects(DK.fetchNotices({ fetchImpl: server(withPage(pages, DK_FEED, '<html>Fejl</html>')).fetchImpl }), /nije RSS/);
  const noLinks = pages[DK_FEED].replace(/foedevarestyrelsen\.dk\/nyheder\/tilbagekaldte-produkter/g, 'foedevarestyrelsen.dk/nyheder/arkiv');
  await assert.rejects(DK.fetchNotices({ fetchImpl: server(withPage(pages, DK_FEED, noLinks)).fetchImpl }), /nijedna stavka feeda/);
  const blank = Object.fromEntries(Object.entries(pages).map(([u, b]) => [u, u === DK_FEED ? b : '<html><body><div class="news-page"><h1>x</h1></div></body></html>']));
  await assert.rejects(DK.fetchNotices({ fetchImpl: server(blank).fetchImpl, since: '2026-10-01' }), /nijedna pročitana stranica/);
});

// ── Czechia ──────────────────────────────────────────────────────────────────────────────────────────
test('CZ: unsafe foods sold in shops — restaurants and canteens left out; the batch as the page labels it', async () => {
  const { fetchImpl } = server(live('pranyr'));
  const got = await CZ.fetchNotices({ fetchImpl, since: '2026-10-13' });
  sound(CZ, got.notices);
  assert.deepEqual(got.notices.map((n) => n.id).sort(), ['cz-pranyr-202382', 'cz-pranyr-202396', 'cz-pranyr-202401']);
  assert.equal(got.skipped['pronađeno u ugostiteljstvu, ne u prodaji'], 2);   // "Restaurace", "Zaměstnanecké stravování"
  const n = byId(got.notices);
  assert.deepEqual(n['cz-pranyr-202401'], {
    id: 'cz-pranyr-202401', country: 'CZ', published: '2026-11-23', category: 'food', hazard: 'other',
    name: 'REBEL ENERGY POUCHES ENERGY DRINK VITAMIN C',
    reason: 'Výrobek obsahoval kofein v podstatně vyšším množství, které již není možné považovat za bezpečné',
    details: 'Výrobek obsahoval kofein v podstatně vyšším množství, které již není možné považovat za bezpečné. Potravina byla vyhodnocena jako zdraví škodlivá.',
    lots: 'B 5K32535', bestBefore: undefined,
    source: 'Státní zemědělská a potravinářská inspekce', url: 'https://www.potravinynapranyri.cz/Detail.aspx?id=202401', gtins: [],
  });
  assert.deepEqual([n['cz-pranyr-202396'].hazard, n['cz-pranyr-202396'].lots, n['cz-pranyr-202396'].bestBefore], ['microbe', '0092511605', '19.09.2026']);
  assert.equal(n['cz-pranyr-202382'].hazard, 'foreign');   // "živých škůdců"
});

test('CZ: a list in another form stops the adapter; a known food is not read again', async () => {
  const pages = live('pranyr');
  await assert.rejects(CZ.fetchNotices({ fetchImpl: server(withPage(pages, CZ.defaultUrl, '<html><body>Údržba</body></html>')).fetchImpl }), /nije tabela/);
  const first = await CZ.fetchNotices({ fetchImpl: server(pages).fetchImpl, since: '2026-10-13' });
  const { fetchImpl, asked } = server(pages);
  await CZ.fetchNotices({ fetchImpl, since: '2026-10-13', known: new Map(first.notices.map((n) => [n.id, n])) });
  assert.equal(asked.some((u) => u.includes('Detail.aspx')), false);
  assert.equal(CZ.batchOf('údaj uvedený na obalu: B 5K32535'), 'B 5K32535');
  assert.equal(CZ.batchOf('neuvedeno'), null);
});

// ── Greece ───────────────────────────────────────────────────────────────────────────────────────────
test('GR: releases from the feed and the list — the batch and date the release labels; kitchenware left out', async () => {
  const { fetchImpl } = server(live('efet'));
  const got = await GR.fetchNotices({ fetchImpl, since: '2026-08-29' });
  sound(GR, got.notices);
  const n = byId(got.notices);
  const burger = n['gr-efet-5431'];
  assert.deepEqual([burger.name, burger.lots, burger.bestBefore, burger.hazard, burger.published], ['ΜΠΙΦΤΕΚΙ ΚΟΤΟΠΟΥΛΟ HAMBURGER ΚΑΤΕΨΥΓΜΕΝΟ', '18726', '06/07/2027', 'microbe', '2026-11-25']);
  assert.equal(burger.reason, 'παρουσία του παθογόνου μικροοργανισμού Salmonella spp. στο ανωτέρω δείγμα');
  assert.match(burger.action, /^Καλούνται οι καταναλωτές/);
  const cakes = n['gr-efet-5428'];
  assert.deepEqual([cakes.name, cakes.lots, cakes.bestBefore, cakes.reason, cakes.hazard], ['Rice Up Parmesan Rice Cakes', 'L07 26 27', '01.07.27', 'παρουσία σκουληκιών', 'foreign']);
  assert.equal(n['gr-efet-5419'].reason, 'άθροισμα της αλοΐνης Α και αλοΐνης Β ανέρχεται στα 3,2 mg/kg');   // "3,2" is one number
  assert.equal(got.skipped['nije hrana (posuđe i sl.)'], 1);   // a soup ladle
});

test('GR: a list in another form stops the adapter; known releases are not read again', async () => {
  const pages = live('efet');
  const list = 'https://www.efet.gr/index.php/el/enimerosi/deltia-typou/anakleiseis-cat';
  await assert.rejects(GR.fetchNotices({ fetchImpl: server(withPage(pages, list, '<html>maintenance</html>')).fetchImpl }), /nije lista kategorije/);
  const first = await GR.fetchNotices({ fetchImpl: server(pages).fetchImpl, since: '2026-08-29' });
  const { fetchImpl, asked } = server(pages);
  const again = await GR.fetchNotices({ fetchImpl, since: '2026-08-29', known: new Map(first.notices.map((x) => [x.id, x])) });
  assert.deepEqual(again.notices.map((x) => x.id), first.notices.map((x) => x.id));
  assert.ok(asked.filter((u) => u.includes('/item/')).length <= 2);   // only what was not a notice before
});

// ── EU: RASFF Consumers' Portal ──────────────────────────────────────────────────────────────────────
test('EU: per country, the notifications the portal lists for its market — each read once, a notice per country', async () => {
  const { fetchImpl, asked } = server(live('rasff'));
  const countries = ['IT', 'PT', 'LT'];
  const got = await EU.fetchNotices({ fetchImpl, since: '2026-09-01', countries });
  sound(EU, got.notices, countries);
  const n = byId(got.notices);
  assert.deepEqual(n['eu-rasff-it-2026-10359'], {
    id: 'eu-rasff-it-2026-10359', country: 'IT', published: '2026-11-20', category: 'food', hazard: 'allergen',
    name: 'Biscotti senza glutine confezionati/Packaged gluten-free cookies',
    reason: "Proteine di mandorle (allergeni) non dichiarate in etichetta in biscotti senza glutine dall'Italia/Almond proteins (allergens) not declared on the label in…",
    details: 'almond - undeclared - allergens - faulty labelling or claims', action: 'Recall from consumer, detained by operator',
    source: 'RASFF – European Commission', url: 'https://webgate.ec.europa.eu/rasff-window/screen/notification/887984', group: 'rasff-2026-10359',
  });
  // the same notification on two countries' lists: two notices, one request
  assert.ok(n['eu-rasff-it-2026-10406'] && n['eu-rasff-pt-2026-10406']);
  assert.equal(n['eu-rasff-pt-2026-10406'].reason, 'Undeclared allergen mustard in soba noodles, from Australia via the Netherlands');
  assert.equal(asked.filter((u) => u.endsWith('/view/id/888857/')).length, 1);
  assert.equal(n['eu-rasff-it-2026-10469'].details, undefined);   // "not in catalogue - not determined" says nothing
  assert.equal(got.notices.some((x) => x.gtins || x.lots), false);   // the portal gives no batches or barcodes
});

test('EU: a list of countries or a notification in another form stops the adapter', async () => {
  const pages = live('rasff');
  await assert.rejects(EU.fetchNotices({ fetchImpl: server(withPage(pages, EU.defaultUrl, '{"items":[]}')).fetchImpl, countries: ['IT'] }), /lista zemalja/);
  const odd = Object.fromEntries(Object.entries(pages).map(([u, b]) => [u, u.includes('/view/id/') ? '{"error":"maintenance"}' : b]));
  await assert.rejects(EU.fetchNotices({ fetchImpl: server(odd).fetchImpl, since: '2026-09-01', countries: ['IT'] }), /nijedna pročitana notifikacija/);
  const got = await EU.fetchNotices({ fetchImpl: server(pages).fetchImpl, since: '2026-09-01', countries: ['IT', 'XX'] });
  assert.equal(got.skipped['zemlja XX nije na portalu'], 1);
  assert.ok(got.notices.every((x) => x.country === 'IT'));
});

verify();
