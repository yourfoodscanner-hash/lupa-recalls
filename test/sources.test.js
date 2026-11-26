'use strict';
/**
 * The adapters of Germany, Slovenia, Croatia, Bosnia and Herzegovina and Austria, on what their
 * sources really answered on 26 Nov 2026 (test/fixtures/live: the answers as recorded on GitHub
 * Actions, cut to fewer notices and to the part of a page the adapter reads). And what each does when
 * its source answers something else: it stops with a message — it never publishes a guess.
 */
const { verify } = require('./no-network');   // first: no test may touch the network
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../lib/contract');
const DE = require('../sources/lebensmittelwarnung');
const SI = require('../sources/govsi');
const HR = require('../sources/hapih');
const BA = require('../sources/fsaba');
const AT = require('../sources/ages');

const live = (name) => require(`./fixtures/live/${name}-2026-11-26.json`);
/** A fetch that answers from recorded pages (404 for anything else) and remembers what it was asked. */
function server(pages, { fail = () => false } = {}) {
  const asked = [];
  const fetchImpl = async (url, options = {}) => {
    asked.push({ url: String(url), options });
    if (fail(String(url))) throw new Error('getaddrinfo ENOTFOUND');
    const body = pages[url];
    if (body === undefined) return { ok: false, status: 404, text: async () => 'not found', json: async () => { throw new SyntaxError('Unexpected token n'); } };
    return { ok: true, status: 200, text: async () => body, json: async () => JSON.parse(body) };
  };
  return { fetchImpl, asked };
}
const byId = (notices) => Object.fromEntries(notices.map((n) => [n.id, n]));
const published = (n) => { const c = C.checkNotice(n); assert.equal(c.ok, true, `${n.id}: ${c.why}`); return c.notice; };
/** Every notice: the format's checks, the adapter's prefix and country, an id only once. */
function sound(adapter, notices) {
  const ids = new Set();
  for (const n of notices) {
    published(n);
    assert.ok(n.id.startsWith(adapter.prefix), n.id);
    assert.equal(n.country, adapter.country);
    assert.equal(ids.has(n.id), false, `${n.id} twice`);
    ids.add(n.id);
  }
}

// ── Germany ─────────────────────────────────────────────────────────────────────────────────────
test('DE: the food and cosmetics feeds, completed with the page of each notice', async () => {
  const { fetchImpl, asked } = server(live('lebensmittelwarnung'));
  const got = await DE.fetchNotices({ fetchImpl, since: '2026-10-12', userAgent: 'lupa-recalls/1.0 (test)' });
  sound(DE, got.notices);
  assert.equal(got.notices.length, 12);
  assert.deepEqual(got.skipped, { 'starije od prozora': 7, 'stranica obavijesti nije pročitana (objavljeno iz feeda)': 6 });
  const n = byId(got.notices);
  assert.deepEqual(published(n['de-lmw-261126-28-by-maniokmehl']), {
    id: 'de-lmw-261126-28-by-maniokmehl', country: 'DE', published: '2026-11-26', category: 'food', hazard: 'chemical',
    name: 'Maniokmehl „Kokonte-Cassave-Flour“, 900 Gramm', brand: 'Bigi-mama', reason: 'Rückstände und Kontaminanten, Gesundheitsschädliche Substanz',
    details: 'Bei einer amtlichen Marktkontrolle in den Niederlanden wurde in einer Probe des Produktes ein überhöhter Gehalt an Blausäure festgestellt. Das Bayerische Landesamt für Gesundheit und Lebensmittelsicherheit (LGL) beurteilt das Produkt aufgrund dieses Gehaltes als gesundheitsschädlich.',
    lots: 'Losnummer 020726', bestBefore: 'Mindesthaltbarkeitsdatum 02.07.2028',
    action: 'Empfehlung der Firma Afroshop Afrikanischer Supermarkt: Kunden, die den entsprechenden Artikel gekauft haben, werden gebeten, ihn nicht zu verzehren. Sie können ihn gegen Erstattung des Kaufpreises selbstverständlich auch ohne Vorlage des Kassenbons im Geschäft in Weilheim zurückgeben. Weitere Informationen erhalten Sie unter der Telefonnummer 0163 8523972.',
    source: 'lebensmittelwarnung.de', url: 'https://www.lebensmittelwarnung.de/___lebensmittelwarnung.de/Meldungen/2026/11_November/261126_28_BY_Maniokmehl/261126_28_BY_Maniokmehl.html',
  });
  // the barcode the page names ("EAN: 0653998013240"); the kinds the portal's own reasons give
  assert.deepEqual(n['de-lmw-261125-25-nw-saflorgewuerz'].gtins, ['0653998013240']);
  assert.equal(n['de-lmw-261125-25-nw-saflorgewuerz'].hazard, 'foreign');
  assert.equal(n['de-lmw-261126-27-bw-gaensebrust'].hazard, 'microbe');
  assert.equal(n['de-lmw-261113-18-bw-thunfisch-salat'].hazard, 'allergen');
  // a page that could not be read: the notice as the feed gives it — and it is asked again next time
  const salami = published(n['de-lmw-261120-21-ni-wildsalami']);
  assert.deepEqual([salami.reason, salami.details, salami.action, salami.published], ['Krankheitserreger', undefined, undefined, '2026-11-23']);
  // two feeds, the job's name, then one page per notice — at most two at a time
  assert.deepEqual(asked.slice(0, 2).map((a) => a.url.replace(/^.*type=/, '')), ['lebensmittel', 'kosmetischemittel']);
  assert.equal(asked[0].options.headers['User-Agent'], 'lupa-recalls/1.0 (test)');
  assert.equal(asked.length, 2 + 12);
});

test('DE: a notice read whole before is not asked for again — unless the feed shows it changed', async () => {
  const first = await DE.fetchNotices({ fetchImpl: server(live('lebensmittelwarnung')).fetchImpl, since: '2026-10-12' });
  const known = new Map(first.notices.map((n) => [n.id, published(n)]));
  const again = server(live('lebensmittelwarnung'));
  const next = await DE.fetchNotices({ fetchImpl: again.fetchImpl, since: '2026-10-12', known });
  assert.equal(again.asked.length, 2 + 6);                       // only the 6 pages that could not be read before
  assert.deepEqual(next.notices.map((n) => n.id).sort(), first.notices.map((n) => n.id).sort());
  known.set('de-lmw-261126-28-by-maniokmehl', { ...known.get('de-lmw-261126-28-by-maniokmehl'), lots: 'Losnummer 999999' });
  const changed = server(live('lebensmittelwarnung'));
  await DE.fetchNotices({ fetchImpl: changed.fetchImpl, since: '2026-10-12', known });
  assert.ok(changed.asked.some((a) => a.url.includes('Maniokmehl')));
});

test('DE: an answer that is not the portal\'s feed is an error, never an empty list', async () => {
  const pages = live('lebensmittelwarnung');
  const food = Object.keys(pages).find((u) => u.endsWith('type=lebensmittel'));
  await assert.rejects(DE.fetchNotices({ fetchImpl: server({ ...pages, [food]: '<!doctype html><title>Wartung</title>' }).fetchImpl }), /nije RSS/);
  await assert.rejects(DE.fetchNotices({ fetchImpl: server({ ...pages, [food]: pages[food].replace(/Grund der Meldung/g, 'Anlass') }).fetchImpl }), /nema polja „Grund der Meldung”/);
  await assert.rejects(DE.fetchNotices({ fetchImpl: server({}).fetchImpl }), /HTTP 404/);
  await assert.rejects(DE.fetchNotices({ fetchImpl: server(pages, { fail: () => true }).fetchImpl }), /ENOTFOUND/);
});

test('DE: small parts — categories, brands, ids', () => {
  assert.equal(DE.categoryOf('food', 'BEBA- und ALFAMINO-Produkte 260105_02_HE_Babynahrung'), 'baby');
  assert.equal(DE.categoryOf('food', 'Babyspinat, 150 Gramm'), 'food');                    // "baby" in a name is not baby food
  assert.equal(DE.categoryOf('food', 'Nahrungsergänzungsmittel „Vital“, 60 Kapseln'), 'supplement');
  assert.equal(DE.categoryOf('cosmetic', 'Creme'), 'cosmetic');
  assert.equal(DE.brandOf('Maniokmehl „Kokonte-Cassave-Flour“ der Marke „Bigi-mama“, 900 Gramm'), 'Bigi-mama');
  assert.equal(DE.brandOf('Weismainer Hefe-Weißbier'), undefined);
  assert.equal(DE.idOfLink('https://www.lebensmittelwarnung.de/___lebensmittelwarnung.de/Meldungen/2026/11_November/261126_29_BY_Wei%C3%9Fbier/261126_29_BY_Wei%C3%9Fbier.html'), 'de-lmw-261126-29-by-weissbier');
  assert.equal(DE.idOfLink('https://www.lebensmittelwarnung.de/DE/Home/home_node.html'), null);
});

// ── Slovenia ────────────────────────────────────────────────────────────────────────────────────
test('SI: the list\'s JSON export — food, supplements and cosmetics that reached consumers', async () => {
  const { fetchImpl, asked } = server(live('govsi'));
  const got = await SI.fetchNotices({ fetchImpl, since: '2026-05-30' });
  sound(SI, got.notices);
  assert.equal(asked.length, 1);
  assert.equal(got.seen, 40);
  assert.equal(got.notices.length, 25);
  assert.deepEqual(got.skipped, { 'nije stiglo do potrošača u Sloveniji': 5, 'kategorija koju LUPA ne prikazuje': 6, 'starije od prozora': 4 });
  const n = byId(got.notices);
  assert.deepEqual(published(n['si-gov-pizza-sunka-narezek']), {
    id: 'si-gov-pizza-sunka-narezek', country: 'SI', published: '2026-11-11', category: 'food', hazard: 'microbe',
    name: 'Pizza šunka narezek', brand: 'S BUDGET', reason: 'Prisotnost bakterije Listera monocytogenes', lots: '1630104', bestBefore: '27.11.2026',
    action: 'Potrošnikom svetujemo, da živilo ne uživajo in ga vrnejo na mesto nakupa.', source: 'Uprava za varno hrano, veterinarstvo in varstvo rastlin',
    url: 'https://www.gov.si/podrocja/podjetnistvo-in-gospodarstvo/varstvo-potrosnikov-in-konkurence/nevarni-in-neskladni-izdelki/pizza-sunka-narezek/', gtins: ['3831115348162'],
  });
  const cream = n['si-gov-hello-baby-vlazilna-in-blazilna-krema-100-ml'];
  assert.deepEqual([cream.category, cream.hazard, cream.source], ['cosmetic', 'allergen', 'Zdravstveni inšpektorat']);
  assert.deepEqual(n['si-gov-pinjole-4'].gtins, ['4021851457863']);
  assert.equal(n['si-gov-pinjole-4'].lots, 'L CA09036');
  assert.equal(n['si-gov-toast-3'].reason, 'potencialne občasne prisotnosti plesni v posameznih pakiranjih');   // the words after "zaradi"
  assert.equal(n['si-gov-suhe-fige-5'].hazard, 'toxin');
});

test('SI: small parts — categories, and what never reached a shop', () => {
  assert.equal(SI.categoryOf('Živila za posebne skupine', 'Začetne formule za dojenčke', 'Formula'), 'baby');
  assert.equal(SI.categoryOf('Živila', 'Sadje in zelenjava', 'Limete'), 'food');
  assert.equal(SI.categoryOf('Prehranska dopolnila', '', 'Dr.Hard+'), 'supplement');
  assert.equal(SI.categoryOf('Kozmetika', '', 'Krema'), 'cosmetic');
  for (const other of ['Igrače', 'Krma', 'Materiali v stiku z živili', 'Električne naprave in oprema', '', null]) assert.equal(SI.categoryOf(other, '', ''), null, String(other));
  const row = { Naziv: 'Limete', URLSegment: 'limete-9', Datum: '19. 11. 2026', Kategorija: 'Živila', 'Opis tveganja': '<p>Presežene vrednost pesticida.</p>', Ukrep: '<p>Umik.</p>' };
  assert.equal(SI.toNotice(row).notice.reason, 'Presežene vrednost pesticida');
  for (const never of ['Živilo ni bilo dano v promet v Sloveniji.', 'Pošiljka je bila zadržana ob vstopu v Evropsko unijo.', 'Uvozna pošiljka ni dosegla potrošnikov.', 'Živilo je bilo distribuirano v obrate javne prehrane.']) {
    assert.equal(SI.toNotice({ ...row, 'Priporočila uporabniku': `<p>${never}</p>` }).skip, 'nije stiglo do potrošača u Sloveniji', never);
  }
});

test('SI: an export that is not the list is an error, never an empty list', async () => {
  const url = Object.keys(live('govsi'))[0];
  const rows = JSON.parse(live('govsi')[url]);
  await assert.rejects(SI.fetchNotices({ fetchImpl: server({ [url]: '[]' }).fetchImpl }), /prazna/);
  await assert.rejects(SI.fetchNotices({ fetchImpl: server({ [url]: '{"error":"x"}' }).fetchImpl }), /nije lista/);
  const renamed = rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k === 'URLSegment' ? 'Povezava' : k, v])));
  await assert.rejects(SI.fetchNotices({ fetchImpl: server({ [url]: JSON.stringify(renamed) }).fetchImpl }), (e) => /nedostaje: URLSegment/.test(e.message) && /Povezava/.test(e.message));
});

// ── Croatia ─────────────────────────────────────────────────────────────────────────────────────
test('HR: the inspectorate\'s notices from HAPIH\'s feed, completed with their pages', async () => {
  const { fetchImpl, asked } = server(live('hapih'));
  const got = await HR.fetchNotices({ fetchImpl, since: '2026-05-30' });
  sound(HR, got.notices);
  assert.equal(got.notices.length, 37);
  assert.deepEqual(got.skipped, { 'hrana za životinje ili posuđe (LUPA ne prikazuje)': 7, 'povlačenje ranije obavijesti': 2, 'obavijest koju je inspektorat povukao': 1, 'starije od prozora': 3, 'stranica obavijesti nije pročitana (objavljeno iz sažetka)': 28 });
  assert.deepEqual(asked.slice(0, 5).map((a) => a.url.replace(/^.*feed\//, 'feed/')), ['feed/', 'feed/?paged=2', 'feed/?paged=3', 'feed/?paged=4', 'feed/?paged=5']);
  const n = byId(got.notices);
  assert.deepEqual(published(n['hr-hapih-32948']), {
    id: 'hr-hapih-32948', country: 'HR', published: '2026-11-17', category: 'food', hazard: 'allergen',
    name: 'J.D. Gross Tamna čokolada 70%, 125g', reason: 'utvrđene prisutnosti kikirikija koji nije označen na ambalaži',
    details: 'Državni inspektorat Republike Hrvatske obavještava potrošače da subjekt u poslovanju s hranom Lidl Hrvatska d.o.o. k.d., Velika Gorica opoziva proizvod J.D. Gross Tamna čokolada 70%, 125g s rokom trajanja 04.04.2028., lot L233249A2, zbog utvrđene prisutnosti kikirikija koji nije označen na ambalaži.',
    lots: 'L233249A2', bestBefore: '04.04.2028', source: 'Državni inspektorat RH (HAPIH)', url: 'https://www.hapih.hr/opoziv-proizvoda-j-d-gross-tamna-cokolada-70-125g/',
  });
  assert.deepEqual([n['hr-hapih-32717'].lots, n['hr-hapih-32717'].bestBefore, n['hr-hapih-32717'].gtins], ['257502493', '30.12.2027', ['6224008286721']]);
  assert.equal(n['hr-hapih-32898'].name, '„Okusi zavičaja“ Dalmatinska panceta, narezak, 100g (dodatna obavijest)');
  assert.deepEqual([n['hr-hapih-31260'].category, n['hr-hapih-31260'].hazard], ['food', 'chemical']);   // tea: aluminium from its tin — a food all the same
  // what the inspectorate took back is not published: neither the withdrawal nor the notice it withdraws
  assert.equal(got.notices.some((x) => /FREE FROM Kruh/i.test(x.name)), false);
  // kitchenware and pet food are not shown
  assert.equal(got.notices.some((x) => /Wok|Čaša|kuhinjskog pribora|BARF|ZA PSE/i.test(x.name)), false);
});

test('HR: a notice read whole before is kept; a page that cannot be read leaves the excerpt', async () => {
  const first = await HR.fetchNotices({ fetchImpl: server(live('hapih')).fetchImpl, since: '2026-10-01' });
  const known = new Map(first.notices.map((n) => [n.id, published(n)]));
  const again = server(live('hapih'));
  await HR.fetchNotices({ fetchImpl: again.fetchImpl, since: '2026-10-01', known });
  assert.equal(again.asked.filter((a) => !a.url.includes('/feed/')).length, first.notices.filter((n) => !n.details).length);
  const down = await HR.fetchNotices({ fetchImpl: server(live('hapih'), { fail: (u) => !u.includes('/feed/') }).fetchImpl, since: '2026-10-01' });
  assert.equal(down.notices.length, first.notices.length);
  assert.ok(down.notices.every((n) => n.details === undefined && n.reason.length > 3));
});

test('HR: a feed that is not the notices is an error; withdrawals are read for what they take back', async () => {
  const pages = live('hapih');
  const feed = Object.keys(pages).find((u) => u.endsWith('/feed/'));
  await assert.rejects(HR.fetchNotices({ fetchImpl: server({ [feed]: '<html>Prijava</html>' }).fetchImpl }), /nije RSS/);
  await assert.rejects(HR.fetchNotices({ fetchImpl: server({ [feed]: pages[feed].replace(/opoziv/gi, 'vijest') }).fetchImpl }), /nema nijednu obavijest o opozivu/);
  const item = { title: 'OPOZIV OBAVIJESTI OBJAVLJENE 19.06.2026.: FREE FROM Kruh sa sjemenkama 200 g', description: '… o opozivu obavijesti za potrošače objavljene dana 19.06.2026. … za proizvod FREE FROM Kruh sa sjemenkama 200g, najbolje …' };
  const r = HR.retracted(item);
  assert.deepEqual([...new Set(r.days)], ['2026-06-19']);
  assert.equal(HR.isRetracted({ published: '2026-06-19', name: 'FREE FROM Kruh sa sjemenkama 200 g' }, r), true);
  assert.equal(HR.isRetracted({ published: '2026-06-19', name: 'Dalmatinska panceta' }, r), false);
  assert.equal(HR.isRetracted({ published: '2026-07-19', name: 'FREE FROM Kruh sa sjemenkama 200 g' }, r), false);
  assert.equal(HR.nameOf('OPOZIV PROIZVODA: ARKAN, Tahini od čistih sjemenki sezama, 400 g'), 'ARKAN, Tahini od čistih sjemenki sezama, 400 g');
  assert.equal(HR.nameOf('OPOZIV PROIZVODA – Dodatna obavijest: S-Budget Rebra dimljena VP'), 'S-Budget Rebra dimljena VP (dodatna obavijest)');
});

// ── Bosnia and Herzegovina ──────────────────────────────────────────────────────────────────────
test('BA: the Agency\'s recall posts — and only those', async () => {
  const { fetchImpl, asked } = server(live('fsaba'));
  const got = await BA.fetchNotices({ fetchImpl, since: '2024-01-01' });
  sound(BA, got.notices);
  assert.equal(asked.length, 1);
  assert.match(asked[0].url, /^https:\/\/fsa\.gov\.ba\/wp-json\/wp\/v2\/posts\?categories=238&/);
  assert.deepEqual(got.skipped, { 'posuđe ili hrana za životinje (LUPA ne prikazuje)': 2, 'nije obavijest o povlačenju': 3 });
  const n = byId(got.notices);
  assert.deepEqual(
    Object.fromEntries(Object.entries(n).map(([id, x]) => [id, [x.category, x.hazard, x.reason.slice(0, 60)]])),
    {
      'ba-fsa-27026': ['food', 'toxin', 'Povećane količine cijanovodonične kiseline'],
      'ba-fsa-26438': ['food', 'chemical', 'Ostaci hlorata'],
      'ba-fsa-25495': ['food', 'microbe', 'moguće kontaminacije salmonelom'],
      'ba-fsa-25124': ['food', 'other', 'Rizik od gušenja'],
      'ba-fsa-24957': ['baby', 'toxin', 'Povlačenje i opoziv koje je inicirao proizvođač provodi se u'],
      'ba-fsa-24833': ['baby', 'toxin', 'mikrobiološka kontaminacija – cereulid'],
      'ba-fsa-24319': ['baby', 'toxin', 'Cereulid (toksin)'],
      'ba-fsa-24299': ['baby', 'toxin', 'potencijalnog prisustva cereulida'],
      'ba-fsa-22920': ['food', 'foreign', 'potencijalnog prisustva stranog tijela metalnog porijekla'],
      'ba-fsa-19356': ['food', 'foreign', 'utvrđeno prisustvo tvrđih šećernih komadića u proizvodu'],
      'ba-fsa-18011': ['food', 'microbe', 'za seriju proizvoda postoji mogućnost napuhnutih doza'],
      'ba-fsa-17550': ['food', 'foreign', 'mogućeg prisustva stranih tijela'],
    },
  );
  assert.deepEqual([n['ba-fsa-22920'].name, n['ba-fsa-22920'].lots, n['ba-fsa-22920'].bestBefore], ['Njoki premium, 500 g, L:250312, rok trajanja: 12.03.2026.', 'L:250312', '12.03.2026']);
  assert.equal(n['ba-fsa-17550'].name, 'NŽ COOKIES NOISETTE 145G');                       // a post without a product in its title: the first product it lists
  assert.equal(n['ba-fsa-25495'].name, 'Rosabella moringa');
  const window = await BA.fetchNotices({ fetchImpl, since: '2026-05-30' });
  assert.deepEqual(window.notices.map((x) => x.id), ['ba-fsa-27026']);
});

test('BA: an answer that is not the posts is an error, never an empty list', async () => {
  const url = Object.keys(live('fsaba'))[0];
  await assert.rejects(BA.fetchNotices({ fetchImpl: server({ [url]: '[]' }).fetchImpl }), /prazna/);
  await assert.rejects(BA.fetchNotices({ fetchImpl: server({ [url]: '{"code":"rest_forbidden"}' }).fetchImpl }), /nije lista/);
  await assert.rejects(BA.fetchNotices({ fetchImpl: server({ [url]: '[{"id":1,"title":"x"}]' }).fetchImpl }), /nisu u obliku/);
  assert.equal(BA.nameOf('Obavijest o povlačenju i opozivu određenih serija „Bebelac 1“, 400 g, Nutricia'), 'Bebelac 1, 400 g, Nutricia');
  assert.equal(BA.statedReason('Razlog povlačenja i opoziva je utvrđeno prisustvo stranog tijela (šaraf) u proizvodu.'), 'utvrđeno prisustvo stranog tijela (šaraf) u proizvodu');
});

// ── Austria ─────────────────────────────────────────────────────────────────────────────────────
test('AT: the list, one category LUPA shows at a time, as far back as the window', async () => {
  const { fetchImpl, asked } = server(live('ages'));
  const got = await AT.fetchNotices({ fetchImpl, since: '2026-09-27' });
  sound(AT, got.notices);
  assert.equal(got.notices.length, 10);
  assert.deepEqual(asked.map((a) => (/cat%5D=(\d+)/.exec(a.url) || [0, 'alle'])[1] + (/page%5D=(\d+)/.exec(a.url) ? `/${/page%5D=(\d+)/.exec(a.url)[1]}` : '')), ['alle', '7', '4', '8', '8/2', '19']);
  const n = byId(got.notices);
  assert.deepEqual(published(n['at-ages-finis-feinstes-bio-weizenkeime-150g']), {
    id: 'at-ages-finis-feinstes-bio-weizenkeime-150g', country: 'AT', published: '2026-11-12', category: 'food', hazard: 'microbe',
    name: 'Fini\'s Feinstes Bio-Weizenkeime (150g)', reason: 'Schimmel', details: 'In Verkehr gebracht von: GoodMills Österreich GmbH. Hersteller: GoodMills Österreich GmbH',
    lots: 'GM3051 (MHD 03.12.2026); GM3053 (MHD 31.12.2026)', bestBefore: '31.12.2026', source: 'AGES', url: 'https://www.ages.at/mensch/produktwarnungen-produktrueckrufe/produkt/finis-feinstes-bio-weizenkeime-150g',
  });
  const gummies = published(n['at-ages-sweet-land-veganer-fruchtgummi-sour-fruit-mix-180-g']);
  assert.deepEqual([gummies.gtins, gummies.lots, gummies.hazard], [['4061459455298'], undefined, 'foreign']);   // "Barcode: …" in the batch row
  assert.equal(n['at-ages-lidl-nautica-regenbogen-forellenfilets-natur-125g-und-nautica-re-0zkb9me'].id.length, 80);
});

test('AT: a list that is not the list is an error', async () => {
  const pages = live('ages');
  const first = Object.keys(pages)[0];
  await assert.rejects(AT.fetchNotices({ fetchImpl: server({ [first]: '<html><main>Wartung</main></html>' }).fetchImpl }), /nije lista obavijesti/);
  await assert.rejects(AT.fetchNotices({ fetchImpl: server({ ...pages, [first]: pages[first].replace(/<nav>[\s\S]*<\/nav>/, '') }).fetchImpl }), /nema link na kategoriju „Lebensmittel”/);
  assert.deepEqual(['Lebensmittel-Rückruf', 'Kindernahrung-Warnung', 'Nahrungsergänzungsmittel-Rückruf', 'Kosmetik-Rückruf', 'Spielzeug & Kinderbedarf-Rückruf', 'Arzneimittel-Rückruf'].map(AT.categoryOf), ['food', 'baby', 'supplement', 'cosmetic', null, null]);
});

verify();
