'use strict';
/**
 * The adapters of Belgium, Ireland, Poland, Hungary, Finland and the Netherlands, on what their sources
 * really answered on 27 Nov 2026 (test/fixtures/live/*-2026-11-27.json: the answers as recorded on
 * GitHub Actions, cut to fewer notices and to the part of a page the adapter reads). And what each does
 * when its source answers something else: it stops with a message — it never publishes a guess.
 */
const { verify } = require('./no-network');   // first: no test may touch the network
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../lib/contract');
const BE = require('../sources/favv');
const IE = require('../sources/fsai');
const PL = require('../sources/gis');
const HU = require('../sources/nebih');
const FI = require('../sources/ruokavirasto');
const NL = require('../sources/nvwa');

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
function sound(adapter, notices) {
  const ids = new Set();
  for (const n of notices) {
    const c = C.checkNotice(n);
    assert.equal(c.ok, true, `${n.id}: ${c.why}`);
    assert.ok(n.id.startsWith(adapter.prefix), n.id);
    assert.equal(n.country, adapter.country, n.id);
    assert.equal(ids.has(n.id), false, `${n.id} twice`);
    ids.add(n.id);
  }
}
/** The recorded answers with every page whose address matches `re` replaced by `body`. */
const replacing = (pages, re, body) => Object.fromEntries(Object.entries(pages).map(([u, b]) => [u, re.test(u) ? body : b]));
const MAINTENANCE = '<html><body><h1>Onderhoud — maintenance</h1></body></html>';

// ── Belgium ──────────────────────────────────────────────────────────────────────────────────────────
test('BE: the list and each recall\'s page — product, brand, batches and dates as the description labels them', async () => {
  const { fetchImpl } = server(live('favv'));
  const got = await BE.fetchNotices({ fetchImpl, since: '2026-10-28' });
  sound(BE, got.notices);
  assert.equal(got.notices.length, 15);
  assert.deepEqual(got.skipped, { 'starije od prozora': 7, 'nije hrana (hrana za životinje, posuđe)': 2 });
  const n = byId(got.notices);
  assert.deepEqual(n['be-favv-terugroeping-van-coprospect-srl'], {
    id: 'be-favv-terugroeping-van-coprospect-srl', country: 'BE', published: '2026-11-26', category: 'food', hazard: 'microbe',
    name: 'Eieren vrije uitloop', brand: 'Othentique', reason: 'Mogelijke aanwezigheid van Salmonella',
    details: 'Naam van het product: Eieren vrije uitloop; Merk: Othentique; Houdbaarheidsdata (Ten minste houdbaar tot): vanaf 07-12-26 tot 13-12-26; Lotnummers: 07/12 – 08/12 – 09/12 – 10/12 – 11/12 – 12/12 – 13/12; Periode van verkoop: vanaf 10/11 tot 20/11; Aard van de verpakking: dozen van 6 eieren en van 1kg',
    lots: '07/12, 08/12, 09/12, 10/12, 11/12, 12/12, 13/12', bestBefore: '07-12-26 – 13-12-26',
    action: 'Coprospect SRLvraagt haar klanten om dit product niet te consumeren en het terug te brengen naar het verkooppunt waar het is gekocht, waar ze een terugbetaling zullen ontvangen.',
    source: 'FAVV', url: 'https://favv-afsca.be/nl/producten/terugroeping-van-coprospect-srl', gtins: [],
  });
  // the barcode the description labels ("EAN: …"); the shops the product was sold in are not details
  assert.deepEqual(n['be-favv-terugroeping-van-carrefour-37'].gtins, ['3560071221058']);
  assert.equal(n['be-favv-terugroeping-van-carrefour-37'].brand, 'Carrefour Classic');
  assert.ok(got.notices.every((x) => !/verkooppunt|Delhaize Hannut/.test(x.details ?? '')));
});

test('BE: a recall read before is not read again; a list that is not the list stops the source', async () => {
  const first = await BE.fetchNotices({ fetchImpl: server(live('favv')).fetchImpl, since: '2026-10-28' });
  const { fetchImpl, asked } = server(live('favv'));
  const again = await BE.fetchNotices({ fetchImpl, since: '2026-10-28', known: new Map(first.notices.map((x) => [x.id, x])) });
  assert.deepEqual(again.notices, first.notices);
  const read = new Set(first.notices.map((x) => x.url));
  assert.ok(asked.every((u) => !read.has(u)), asked.join('\n'));   // the list, and only pages that gave no notice
  await assert.rejects(BE.fetchNotices({ fetchImpl: server(replacing(live('favv'), /\?/, MAINTENANCE)).fetchImpl, since: '2026-10-28' }), /format se promijenio/);
});

// ── Ireland ──────────────────────────────────────────────────────────────────────────────────────────
test('IE: food alerts and allergen alerts — the summary, the products table, the consumers\' section', async () => {
  const { fetchImpl } = server(live('fsai'));
  const got = await IE.fetchNotices({ fetchImpl, since: '2026-10-13' });
  sound(IE, got.notices);
  assert.equal(got.notices.length, 13);
  const n = byId(got.notices);
  // a products table read as "Header: value" lines: batches ("Lot") and dates ("Best Before") as labeled
  assert.deepEqual(n['ie-fsai-update-to-recall-of-a-batch-of-bialetti-perfetto-m'], {
    id: 'ie-fsai-update-to-recall-of-a-batch-of-bialetti-perfetto-m', country: 'IE', published: '2026-11-23', category: 'food', hazard: 'toxin',
    name: 'Perfetto Moka Ground Coffee Flavoured with Hazelnut, Multipack Perfetto Moka Ground Coffee flavoured with Hazelnut, Universal Grind Ground Coffee Flavoured…',
    reason: 'Elevated level of Ochratoxin A',
    details: 'The implicated batches contain Ochratoxin A above the legal maximum level. Ochratoxin A is a naturally occurring toxin produced by certain moulds. Ochratoxin A mainly forms after harvest during the storage of crops and foodstuffs. Although the consumption of the contaminated product does not pose an immediate risk to health, continuous consumption over a long period of time may pose a potential risk to health. Therefore, exposure to Ochratoxin A needs to be minimised.',
    lots: 'BD160B, BD161B', bestBefore: '09.06.2027, 10.06.2027, 29.05.2027',
    action: 'Consumers are advised not to use the implicated batches.',
    source: 'FSAI', url: 'https://www.fsai.ie/news-and-alerts/food-alerts/update-to-recall-of-a-batch-of-bialetti-perfetto-m', gtins: [],
  });
  // an allergen alert: every product of "Product Identification", the allergen in the reason
  const celery = n['ie-fsai-a-incorrectly-declared-celery-in-aneto-natural-chick'];
  assert.equal(celery.name, 'Aneto Natural Chicken Broth, Aneto Natural Fish Broth');
  assert.equal(celery.reason, 'Incorrectly declared celery');
  assert.equal(celery.hazard, 'allergen');
  assert.equal(celery.lots, undefined);                                        // "All batches …" is not a batch
  // "Batch Code: Use-by-date: 04/11/2026" — a date, no batch
  const lasagne = n['ie-fsai-a-undeclared-milk-and-egg-in-a-batch-carroll-s-of-tu'];
  assert.equal(lasagne.lots, undefined);
  assert.equal(lasagne.bestBefore, '04/11/2026');
  // "4245 THT:06-2027; best-before end date: 06-2027 and / 4343 THT:07-2027 …" — one batch a line
  assert.equal(n['ie-fsai-a-presence-of-peanut-in-specific-batches-of-healthyf'].lots, '4245, 4343');
  // the Listeria warning for "pregnant women and infants" does not make smoked salmon baby food
  assert.ok(got.notices.every((x) => x.category === 'food'));
});

test('IE: pages are read until a whole list page is older than the window; a changed page stops the source', async () => {
  const { fetchImpl, asked } = server(live('fsai'));
  await IE.fetchNotices({ fetchImpl, since: '2026-11-20' });
  // page 2 is all older than the window: page 3 is not asked for
  assert.deepEqual(asked.filter((u) => /all-alerts/.test(u)), ['https://www.fsai.ie/news-alert/all-alerts', 'https://www.fsai.ie/news-alert/all-alerts?page=2']);
  await assert.rejects(IE.fetchNotices({ fetchImpl: server(replacing(live('fsai'), /all-alerts/, MAINTENANCE)).fetchImpl, since: '2026-10-13' }), /format se promijenio/);
  const odd = replacing(live('fsai'), /alerts\/[a-z]/, MAINTENANCE);
  await assert.rejects(IE.fetchNotices({ fetchImpl: server(odd).fetchImpl, since: '2026-10-13' }), /nijedna pročitana stranica/);
});

// ── Poland ───────────────────────────────────────────────────────────────────────────────────────────
test('PL: warnings about food — kitchenware left out, updates kept, batches and dates as labeled', async () => {
  const { fetchImpl } = server(live('gis'));
  const got = await PL.fetchNotices({ fetchImpl, since: '2026-09-28' });
  sound(PL, got.notices);
  assert.equal(got.notices.length, 10);
  assert.deepEqual(got.skipped, { 'nije hrana (posuđe, druge obavijesti)': 2, 'starije od prozora': 4 });
  const n = byId(got.notices);
  assert.deepEqual(n['pl-gis-wykrycie-obecnosci-bakterii-listeria-monocytogenes-w-filetach-sle-0ewgcgs'], {
    id: 'pl-gis-wykrycie-obecnosci-bakterii-listeria-monocytogenes-w-filetach-sle-0ewgcgs', country: 'PL', published: '2026-11-26', category: 'food', hazard: 'microbe',
    name: "K-Classic a'la Matjas Filety śledziowe solone w oleju", brand: undefined,
    reason: 'Wykrycie obecności bakterii Listeria monocytogenes w filetach śledziowych w oleju',
    details: 'Główny Inspektorat Sanitarny został poinformowany o prowadzonym przez producenta SEKO S.A. wycofaniu dwóch partii filetów śledziowych w oleju ze względu na wykrycie Listeria monocytogenes w badaniach właścicielskich. Produkt objęty wycofaniem był sprzedawany w sklepach Kaufland. Spożycie żywności zanieczyszczonej Listeria monocytogenes może prowadzić do choroby zwanej listeriozą.',
    lots: '264WO, 265KE', bestBefore: '05.12.2026, 06.12.2026',
    action: 'Nie należy spożywać partii produktu wskazanych w komunikacie',
    source: 'Główny Inspektorat Sanitarny', url: 'https://www.gov.pl/web/gis/ostrzezenie-publiczne-dotyczace-zywnosci-wykrycie-obecnosci-bakterii-listeria-monocytogenes-w-filetach-sledziowych-w-oleju', gtins: [],
  });
  const update = got.notices.find((x) => x.id.startsWith('pl-gis-aktualizacja-'));
  assert.equal(update.category, 'supplement');
  assert.equal(update.reason, 'Stwierdzenie substancji psychoaktywnej w suplemencie diety');
  await assert.rejects(PL.fetchNotices({ fetchImpl: server(replacing(live('gis'), /ostrzezenia\?/, MAINTENANCE)).fetchImpl, since: '2026-09-28' }), /format se promijenio/);
});

// ── Hungary ──────────────────────────────────────────────────────────────────────────────────────────
test('HU: the list of 50, each recall\'s fields — pet food and kitchenware left out, the RASFF reference as the group', async () => {
  const { fetchImpl, asked } = server(live('nebih'));
  const got = await HU.fetchNotices({ fetchImpl, since: '2026-10-13' });
  sound(HU, got.notices);
  assert.ok(asked.some((u) => /_delta=50/.test(u)), 'the list with 50 rows');
  assert.equal(got.notices.length, 6);
  assert.deepEqual(got.skipped, { 'nije hrana (hrana za životinje, posuđe)': 2 });
  assert.deepEqual(byId(got.notices)['hu-nebih-2829237189'], {
    id: 'hu-nebih-2829237189', country: 'HU', published: '2026-11-26', category: 'food', hazard: 'allergen',
    name: 'Inglese gluténmentes natúr keksz, 200 g', brand: 'Inglese Glutenfree', reason: 'Nem jelölt allergén jelenléte (mandula)',
    details: undefined, lots: '260513050', bestBefore: '05.2027',
    action: 'A Nébih kéri a mandulára érzékeny vásárlókat, hogy az alábbi azonosító adatokkal megegyező terméket ne fogyasszák el!',
    source: 'Nébih', url: 'https://portal.nebih.gov.hu/l/termekvisszahivas/2829237189', gtins: [], group: 'rasff-2026-10359',
  });
  // "Frissítve:" (updated) is not part of the product's name; "2026.12.27" is a date
  assert.ok(got.notices.some((x) => x.name === 'Tesco barna rizs főzőtasakban 4 x 125 g (500 g)'));
  assert.ok(got.notices.some((x) => x.bestBefore === '2026.12.27'));
  await assert.rejects(HU.fetchNotices({ fetchImpl: server(replacing(live('nebih'), /termekvisszahivas($|\?)/, MAINTENANCE)).fetchImpl, since: '2026-10-13' }), /format se promijenio/);
});

// ── Finland ──────────────────────────────────────────────────────────────────────────────────────────
test('FI: the product as the page names it — a list, "… -tuotetta", "nimellä …" — and kitchenware left out', async () => {
  const { fetchImpl } = server(live('ruokavirasto'));
  const got = await FI.fetchNotices({ fetchImpl, since: '2026-09-28' });
  sound(FI, got.notices);
  assert.equal(got.notices.length, 6);
  assert.deepEqual(got.skipped, { 'nije hrana (posuđe, kontaktni materijal)': 2 });
  const n = byId(got.notices);
  assert.deepEqual(n['fi-ruokavirasto-kahden-maapahkinavoituotteen-takaisinveto'], {
    id: 'fi-ruokavirasto-kahden-maapahkinavoituotteen-takaisinveto', country: 'FI', published: '2026-11-23', category: 'food', hazard: 'chemical',
    name: 'Urtekram Peanut Butter Crunchy 230 g, Urtekram Peanut Butter Smooth 230 g', reason: 'Kahden maapähkinävoituotteen takaisinveto',
    details: 'Midsona Finland Oy on ilmoittanut vetävänsä myynnistä yhden erän Urtekram Peanut Butter Crunchy 230 g -tuotetta siinä todetun torjunta-ainejäämän vuoksi. Lisäksi yksi erä Urtekram Peanut Butter Smooth 230 g -tuotetta vedetään myynnistä varotoimenpiteenä.',
    lots: undefined, bestBefore: '15.4.2027, 14.4.2027',
    action: 'Midsona Finland neuvoo kyseisiä tuote-eriä ostaneita kuluttajia olemaan käyttämättä tuotteita ja hävittämään ne sekajätteenä.',
    source: 'Ruokavirasto', url: 'https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/takaisinvedot-2023-/kahden-maapahkinavoituotteen-takaisinveto/', gtins: [],
  });
  assert.equal(n['fi-ruokavirasto-pakastetussa-chilissa-kadmiumylitys'].name, 'Coop Chopped Chili');
  assert.deepEqual(n['fi-ruokavirasto-valipalapatukoissa-metalliriski'].gtins, ['4011800429218']);
  assert.deepEqual(n['fi-ruokavirasto-kananmunien-takaisinveto2'].gtins, ['6415715101210', '6430017904017', '6430017900576', '6410405224316']);
  await assert.rejects(FI.fetchNotices({ fetchImpl: server(replacing(live('ruokavirasto'), /\/takaisinvedot\/$/, MAINTENANCE)).fetchImpl, since: '2026-09-28' }), /format se promijenio/);
});

// ── Netherlands ──────────────────────────────────────────────────────────────────────────────────────
test('NL: the site\'s search, the news sitemap and the latest warnings — food only, each product with its barcode and dates', async () => {
  const { fetchImpl, asked } = server(live('nvwa'));
  const got = await NL.fetchNotices({ fetchImpl, since: '2026-10-13' });
  sound(NL, got.notices);
  assert.equal(asked[0], NL.searchRequest(1).url);                  // the search, as the site's page posts it
  assert.deepEqual(got.skipped, { 'nije hrana (consumentenartikelen)': 4 });
  assert.deepEqual(got.notices.map((x) => x.id), ['nl-nvwa-diverse-salades-van-marqt-keuken', 'nl-nvwa-jumbo-kiprollade-rolletje-met-roomkaas-allergenen', 'nl-nvwa-healthyfit-vegan-protein-bar-hazelnut-nougat', 'nl-nvwa-ah-spinazie-a-la-creme-750-gram']);
  assert.deepEqual(got.notices[0], {
    id: 'nl-nvwa-diverse-salades-van-marqt-keuken', country: 'NL', published: '2026-11-26', category: 'food', hazard: 'foreign',
    name: 'Buddha bowl, Powerful pumpkin salade, Turmeric tango salade', brand: 'Marqt Keuken',
    reason: 'Er bestaat een kans dat deze producten witte harde plastic stukjes bevatten',
    details: 'Buddha bowl: Artikelnummer: 6001335, EAN: 8711521160525, Ten minste houdbaar tot (THT): 28-11-2026 & 29-11-2026; Powerful pumpkin salade: Artikelnummer: 6001337, EAN: 8711521160501, Ten minste houdbaar tot (THT): 27-11-2026 & 28-11-2026 & 29-11-2026; Turmeric tango salade: Artikelnummer: 6001338, EAN: 8711521160518, Ten minste houdbaar tot (THT): 27-11-2026 & 28-11-2026 & 29-11-2026',
    lots: undefined, bestBefore: '28-11-2026, 29-11-2026, 27-11-2026', action: 'Eet de salades niet.',
    source: 'NVWA', url: 'https://www.nvwa.nl/actueel/nieuws/2026/11/26/veiligheidswaarschuwing-diverse-salades-van-marqt-keuken',
    gtins: ['8711521160525', '8711521160501', '8711521160518'],
  });
  const kip = got.notices[1];
  assert.equal(kip.hazard, 'allergen');
  assert.equal(kip.bestBefore, '15-11-2026 – 11-12-2026');          // "van 15-11-2026 t/m 11-12-2026" stays a range
  assert.equal(got.notices[2].lots, '4245');                          // "(batch 4245)"
});

test('NL: without the search, the short lists — and a warning read before stays while it is in the window', async () => {
  const older = { id: 'nl-nvwa-kipfilet-van-voorbeeld', country: 'NL', published: '2026-11-10', category: 'food', hazard: 'microbe', name: 'Kipfilet', reason: 'Listeria', source: 'NVWA', url: 'https://www.nvwa.nl/actueel/nieuws/2026/11/10/veiligheidswaarschuwing-kipfilet-van-voorbeeld', gtins: [] };
  const tooOld = { ...older, id: 'nl-nvwa-oud', published: '2026-09-01' };
  const known = new Map([[older.id, older], [tooOld.id, tooOld]]);
  const noSearch = replacing(live('nvwa'), /\/api\/search/, '{"ok":false,"message":"Invalid search request"}');
  const got = await NL.fetchNotices({ fetchImpl: server(noSearch).fetchImpl, since: '2026-10-13', known });
  const ids = got.notices.map((x) => x.id);
  assert.ok(ids.includes('nl-nvwa-diverse-salades-van-marqt-keuken'));   // on the sitemap and the latest warnings
  assert.ok(ids.includes(older.id));
  assert.ok(!ids.includes(tooOld.id));
  assert.ok(Object.keys(got.skipped).some((k) => /^pretraga NVWA nije odgovorila/.test(k)));
  // with the search answering, what the search no longer finds is not kept
  const withSearch = await NL.fetchNotices({ fetchImpl: server(live('nvwa')).fetchImpl, since: '2026-10-13', known });
  assert.ok(!withSearch.notices.some((x) => x.id === older.id));
  await assert.rejects(NL.fetchNotices({ fetchImpl: server(replacing(live('nvwa'), /sitemap\.xml$/, MAINTENANCE)).fetchImpl, since: '2026-10-13' }), /format se promijenio/);
});

verify();
