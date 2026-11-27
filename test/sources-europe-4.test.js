'use strict';
/**
 * The adapters of Iceland (MAST), North Macedonia (АХВ), Spain (AESAN) and Luxembourg (ALVA), on what
 * their sources really answered on 27 Nov 2026 (test/fixtures/live/*-2026-11-27.json: the answers as
 * recorded on GitHub Actions, cut to fewer notices). Iceland and North Macedonia are in v2 only; Spain
 * and Luxembourg were read through the EU's RASFF portal before.
 */
const { verify } = require('./no-network');   // first: no test may touch the network
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../lib/contract');
const IS = require('../sources/mast');
const MK = require('../sources/fva');
const ES = require('../sources/aesan');
const LU = require('../sources/alva');
const config = require('../config.json');

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
function sound(adapter, notices, { v1 }) {
  for (const n of notices) {
    const c = C.checkNotice(n, C.COUNTRIES_V2);
    assert.equal(c.ok, true, `${n.id}: ${c.why}`);
    assert.ok(n.id.startsWith(adapter.prefix), n.id);
    assert.equal(n.country, adapter.country);
    assert.equal(C.checkNotice(n).ok, v1, v1 ? 'a v1 country' : 'v2 only');
  }
}
const MAINTENANCE = '<html><body>Viðhald — maintenance</body></html>';

test('IS: MAST\'s list of recalls, each product from its labeled list — barcode, batch, best-before', async () => {
  const pages = live('mast');
  const { fetchImpl, asked } = server(pages);
  const got = await IS.fetchNotices({ fetchImpl, since: '2026-11-15' });
  assert.equal(asked[0], 'https://www.mast.is/is/um-mast/frettir/innkallanir');
  assert.equal(asked.length, 5);                                         // the list and the 4 recalls in the window
  assert.deepEqual(got.skipped, { 'starije od prozora': 2 });
  sound(IS, got.notices, { v1: false });
  const n = byId(got.notices);
  assert.deepEqual(Object.keys(n), ['is-mast-adskotahlutur-i-orkustykki', 'is-mast-adskotahlutur-i-smakokudeigi', 'is-mast-myglueitur-i-hveiti', 'is-mast-adskotaefni-yfir-morkum-i-kexi-1']);
  const corny = n['is-mast-adskotahlutur-i-orkustykki'];
  assert.equal(corny.name, 'Corny 0% Added sugar Chocolate Multi pack 6x20g');
  assert.equal(corny.brand, 'Corny');
  assert.equal(corny.reason, 'Aðskotahlutur í orkustykki');
  assert.equal(corny.hazard, 'foreign');
  assert.equal(corny.published, '2026-11-26');
  assert.deepEqual(corny.gtins, ['4011800593063']);
  assert.equal(corny.bestBefore, '10.09.2027');
  assert.equal(corny.lots, undefined);
  assert.match(corny.action, /^Neytendur sem eiga umrædda vöru eru beðnir um/);
  assert.equal(n['is-mast-adskotahlutur-i-smakokudeigi'].lots, undefined);          // "Lotur: Allar lotur"
  const flour = n['is-mast-myglueitur-i-hveiti'];                                    // three products on one page
  assert.equal(flour.name, 'Kornax rautt, blátt og heilhveiti, First Price hveiti, Euro Shopper Hveiti');
  assert.equal(flour.hazard, 'toxin');
  assert.equal(flour.bestBefore, '15-09-2026, 29-09-2026, 01.09.2026, 15.09.2026');
  assert.equal(n['is-mast-adskotaefni-yfir-morkum-i-kexi-1'].lots, 'LM00018430');
  await assert.rejects(IS.fetchNotices({ fetchImpl: server({ [asked[0]]: MAINTENANCE }).fetchImpl, since: '2026-11-15' }), /format se promijenio/);
});

test('IS: "Vara" names the product too; "Lota 25/16/11, best fyrir 12.06.2028" is a batch and a date', () => {
  const pages = live('mast');
  const yoghurt = IS.pageParts(pages['https://www.mast.is/is/um-mast/frettir/innkallanir/adskotahlutur-plast-i-jogurt']);
  const row = { slug: 'adskotahlutur-plast-i-jogurt', url: 'https://www.mast.is/is/um-mast/frettir/innkallanir/adskotahlutur-plast-i-jogurt', title: 'Aðskotahlutur (plast) í jógúrt', day: '2026-11-02' };
  const y = IS.toNotice(row, yoghurt).notice;
  assert.equal(y.name, 'Arna Örnujógúrt með jarðarberjum og AB-gerlum');
  assert.deepEqual(y.gtins, ['5694230157044']);                                      // "Strikanúmer"
  assert.equal(y.bestBefore, '13.11.26');
  const husk = IS.pageParts(pages['https://www.mast.is/is/um-mast/frettir/innkallanir/adskotaefni-yfir-morkum-i-faedubotarefnum']);
  const h = IS.toNotice({ ...row, slug: 'guli', title: 'Aðskotaefni yfir mörkum í fæðubótarefnum' }, husk).notice;
  assert.equal(h.name, 'Guli miðinn Husk, Guli miðinn Colon Cleanser');
  assert.equal(h.category, 'supplement');
  assert.equal(h.lots, '25/16/11, 25/24/11, 25/35/15, 25/50/17, 25/5/59, 061225');
  assert.equal(h.bestBefore, '12.06.2028, 09.07.2028, 16.9.2028, 23.4.2029, 23.04.2028, 10.09.2028');
  assert.deepEqual(IS.lotsAndDates({ lotur: 'Allar lotur', 'best fyrir dagsetningar': 'Allar' }), { lots: [], dates: [] });
});

test('MK: АХВ\'s list of recalls — batches and dates where the text labels them; the reason from the title or the text', async () => {
  const { fetchImpl, asked } = server(live('fva'));
  const got = await MK.fetchNotices({ fetchImpl, since: '2024-09-01' });
  assert.equal(asked.length, 4);
  sound(MK, got.notices, { v1: false });
  const n = byId(got.notices);
  assert.deepEqual(Object.keys(n), ['mk-fva-2603', 'mk-fva-2384', 'mk-fva-2300']);
  const nan = n['mk-fva-2603'];
  assert.equal(nan.name, 'NAN LACTOSE FREE NLNWB333 12х400гр. RO и NAN CONFORT 1 LR DENWHSPB290 6х800гр. ES');
  assert.equal(nan.category, 'baby');
  assert.equal(nan.hazard, 'toxin');
  assert.match(nan.reason, /^Присуство на цереулид продуциран од Bacillus cereus/);   // "Причина за отповикувањето - …"
  assert.equal(nan.lots, '51520346АЕ, 52620742F2');
  assert.equal(nan.bestBefore, '30.06.2027, 31.07.2027');
  assert.equal(nan.published, '2026-01-09');
  const chips = n['mk-fva-2384'];                                                     // "…, поради …" in the title
  assert.equal(chips.name, 'Чипс со вкус на балсамико и домат 150 гр');
  assert.equal(chips.reason, 'Зголемено присуство на акриламид');
  assert.equal(chips.hazard, 'chemical');
  assert.equal(chips.lots, 'L1100526');
  assert.match(chips.action, /да не ги консумираат/);
  assert.equal(n['mk-fva-2300'].reason, 'Можност за присуство на надворешно тело');     // "поради …" in the text
  assert.equal(n['mk-fva-2300'].hazard, 'foreign');
  assert.equal(MK.toNotice({ node: '1875', url: 'https://fva.gov.mk/mk/x', day: '2023-01-04', title: 'Отповикување на небезбеден прибор за јадење изработен од бамбусови влакна' }, { text: '…' }).skip, 'materijal u dodiru s hranom (posuđe)');
  await assert.rejects(MK.fetchNotices({ fetchImpl: server({ [asked[0]]: MAINTENANCE }).fetchImpl, since: '2024-09-01' }), /format se promijenio/);
});

test('ES: AESAN\'s alerts — one notice per reference; an update is read instead of the first page; a withdrawn alert is not published', async () => {
  const { fetchImpl, asked } = server(live('aesan'));
  const got = await ES.fetchNotices({ fetchImpl, since: '2026-11-09' });
  assert.deepEqual(asked.slice(0, 2), ['https://www.aesan.gob.es/alertas/buscador-alertas', 'https://www.aesan.gob.es/alertas/buscador-alertas/2']);
  assert.ok(!asked.includes('https://www.aesan.gob.es/alertas/2026_87'), 'the update (2026_86) is read, not the first page');
  assert.deepEqual(got.skipped, { 'upozorenje povučeno (retirada)': 1, 'starije od prozora': 5 });
  sound(ES, got.notices, { v1: true });
  const n = byId(got.notices);
  assert.deepEqual(Object.keys(n), ['es-aesan-es2026-716', 'es-aesan-es2026-712', 'es-aesan-es2026-711', 'es-aesan-es2026-678']);
  const noodles = n['es-aesan-es2026-716'];
  assert.equal(noodles.name, 'Hakubaku Organic Soba Noodles');
  assert.equal(noodles.reason, 'Presencia de mostaza');
  assert.equal(noodles.hazard, 'allergen');                                         // AESAN's own kind of alert
  assert.equal(noodles.bestBefore, '01.06.2028');
  const eggs = n['es-aesan-es2026-711'];
  assert.equal(eggs.url, 'https://www.aesan.gob.es/alertas/2026_86');
  assert.equal(eggs.published, '2026-11-20');
  assert.deepEqual(eggs.gtins, ['8480010184778', '8480010184785', '8480010190106', '8480010190076', '8480010196733']);
  assert.equal(eggs.hazard, 'microbe');
  const nuts = n['es-aesan-es2026-712'];                                            // "Número de lote y fecha …": "1127091 - 12/12/2026"
  assert.match(nuts.lots, /^1127091, 1128091, 1127474, /);
  assert.match(nuts.bestBefore, /^12\/12\/2026, 15\/03\/2027, /);
  assert.equal(nuts.hazard, 'foreign');
  assert.match(n['es-aesan-es2026-678'].name, /^Leche Fresca Entera Priégola 1 Litro, /);   // products listed without labels
  await assert.rejects(ES.fetchNotices({ fetchImpl: server({ [asked[0]]: MAINTENANCE }).fetchImpl, since: '2026-11-09' }), /format se promijenio/);
});

test('ES: a date under a batch is a date; a supplement named only in the summary; undeclared sildenafil is not an allergen', () => {
  const pages = live('aesan');
  const kefir = ES.toNotice([{ key: '2026_79', url: 'https://www.aesan.gob.es/alertas/2026_79', title: 'Alerta por presencia de Salmonella en kéfir de cabra procedente de España. (Ref. ES2026/659).', icon: 'error_outline', day: '2026-11-04', ref: 'ES2026/659' }],
    ES.pageParts(pages['https://www.aesan.gob.es/alertas/2026_79'])).notice;
  assert.equal(kefir.lots, '62100902, 62102102');
  assert.equal(kefir.bestBefore, '14/11/2026, 25/11/2026');
  const pill = ES.toNotice([{ key: '2026_78', url: 'https://www.aesan.gob.es/alertas/2026_78', title: 'Alerta por presencia de sildenafilo en complemento alimenticio procedente de Perú (Ref. ES2026/654)', icon: 'pill', day: '2026-10-28', ref: 'ES2026/654' }],
    ES.pageParts(pages['https://www.aesan.gob.es/alertas/2026_78'])).notice;
  assert.equal(pill.name, 'Enerup Premium');
  assert.equal(pill.category, 'supplement');
  assert.equal(pill.hazard, 'chemical');
  assert.deepEqual(ES.titleParts('Advertencia para personas con alergia a la mostaza: presencia de mostaza en noodles procedentes de Australia (Ref.ES2026/716)'), { reason: 'Presencia de mostaza', product: 'noodles' });
  assert.equal(ES.dayOfSpanish('04 Noviembre 2026'), '2026-11-04');
});

test('LU: ALVA\'s alerts from the feed — each product from its table; utensils and pet food are left out', async () => {
  const pages = live('alva');
  const { fetchImpl, asked } = server(pages);
  const got = await LU.fetchNotices({ fetchImpl, since: '2026-11-15' });
  assert.equal(asked[0], 'https://securite-alimentaire.public.lu/fr/actualites/alertes.rss');
  assert.deepEqual(got.skipped, { 'starije od prozora': 1, 'materijal u dodiru s hranom (posuđe)': 1 });
  sound(LU, got.notices, { v1: true });
  const n = byId(got.notices);
  assert.equal(got.notices.length, 6);
  const yerba = n['lu-alva-2026-11-rappel-yerba-mate-de-la-marque-sabrosa'];
  assert.equal(yerba.name, 'Yerba Mate');
  assert.equal(yerba.brand, 'Sabrosa');
  assert.equal(yerba.reason, 'Teneur trop élevée en anthraquinone (résidu de pesticide)');
  assert.equal(yerba.hazard, 'chemical');
  assert.equal(yerba.lots, '06-2027/21');
  assert.equal(yerba.bestBefore, '30/06/2027');
  assert.deepEqual(yerba.gtins, ['6217000144113']);
  assert.equal(n['lu-alva-2026-11-avertissement-coca-cola-zero-de-la-marque-coca-cola'].hazard, 'label');
  const soba = got.notices.find((x) => /soba/.test(x.id));                          // an allergy warning: …/Avertissementsallergenes/…
  assert.equal(soba.hazard, 'allergen');
  assert.equal(soba.name, 'Organic Soba noodles');
  // pet food is on the same feed
  const feed = pages[asked[0]].replace('<item>', '<item><title>Rappel : Croquettes</title><link>https://securite-alimentaire.public.lu/fr/actualites/rappels-aliments-pour-animaux/2026/11/rappel-croquettes.html</link><pubDate>Fri, 27 Nov 2026 10:00:02 +0100</pubDate></item><item>');
  const again = await LU.fetchNotices({ fetchImpl: server({ ...pages, [asked[0]]: feed }).fetchImpl, since: '2026-11-15' });
  assert.equal(again.skipped['hrana za životinje'], 1);
  await assert.rejects(LU.fetchNotices({ fetchImpl: server({ [asked[0]]: MAINTENANCE }).fetchImpl, since: '2026-11-15' }), /RSS/);
});

test('Spain and Luxembourg are read at their agencies now, no longer through the EU\'s portal', () => {
  for (const c of ['ES', 'LU']) assert.ok(!config.sources.rasff.countries.includes(c), c);
  for (const name of ['mast', 'fva', 'aesan', 'alva']) assert.equal(config.sources[name].enabled, true, name);
  assert.ok(C.COUNTRIES_V2.includes('IS') && C.COUNTRIES_V2.includes('MK'));
});

test('no test reached for the network', () => verify());
