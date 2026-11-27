'use strict';
/**
 * The adapter of Kosovo (AUV), on what its site really answered on 27 Nov 2026
 * (test/fixtures/live/auv-2026-11-27.json: the list of news cut to thirteen, and the Word documents of
 * the recalls — each kept as a document with only its text, "base64:…"). Kosovo is in v2 only, as "XK".
 */
const { verify } = require('./no-network');   // first: no test may touch the network
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../lib/contract');
const XK = require('../sources/auv');
const { docxText, zipEntry } = require('../lib/docx');

const live = require('./fixtures/live/auv-2026-11-27.json');
function server(pages) {
  const asked = [];
  const fetchImpl = async (url) => {
    asked.push(String(url));
    const body = pages[url];
    if (body === undefined) return { ok: false, status: 404, text: async () => 'not found', json: async () => { throw new SyntaxError('Unexpected token n'); }, arrayBuffer: async () => new ArrayBuffer(0) };
    const bytes = body.startsWith('base64:') ? Buffer.from(body.slice(7), 'base64') : Buffer.from(body, 'utf8');
    return { ok: true, status: 200, text: async () => bytes.toString('utf8'), json: async () => JSON.parse(bytes.toString('utf8')), arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length) };
  };
  return { fetchImpl, asked };
}
const byId = (notices) => Object.fromEntries(notices.map((n) => [n.id, n]));
const DOC = (part) => Object.keys(live).find((u) => u.includes(part));

test('XK: the AUV\'s news — a withdrawal of a food from the market is a notice; its Word document is read', async () => {
  const { fetchImpl, asked } = server(live);
  const got = await XK.fetchNotices({ fetchImpl, since: '2026-02-15' });
  assert.equal(asked[0], 'https://auvk.rks-gov.net/wp-json/wp/v2/posts?per_page=100&_fields=id,date,link,title,content');
  assert.equal(asked.length, 6);                                     // the list and five documents — not the import bans
  for (const n of got.notices) {
    const c = C.checkNotice(n, C.COUNTRIES_V2);
    assert.equal(c.ok, true, `${n.id}: ${c.why}`);
    assert.equal(n.country, 'XK');
    assert.equal(C.checkNotice(n).ok, false, 'v2 only');
  }
  const n = byId(got.notices);
  assert.deepEqual(Object.keys(n).sort(), ['xk-auv-4283', 'xk-auv-4291', 'xk-auv-4316', 'xk-auv-4384', 'xk-auv-4410', 'xk-auv-4423']);
  const flips = n['xk-auv-4423'];
  assert.equal(flips.name, 'Flips Ketchup');
  assert.equal(flips.hazard, 'allergen');                            // "alergjenit qumësht"
  assert.equal(flips.lots, 'FK 04/26');
  assert.equal(flips.bestBefore, '11.02.2027');
  assert.equal(flips.group, 'rasff-2026-8267');                      // the same RASFF notification elsewhere
  const water = n['xk-auv-4384'];                                    // a title that says only "Njoftim"
  assert.equal(water.name, 'UJË KLLOKOTI Ujë Mineral');                // "Brendi:", "Emri i produktit:"
  assert.equal(water.reason, 'Përmbajtje e lartë e Borit (Boron) në ujë mineral');   // "Arsyeja e njoftimit:"
  assert.equal(water.bestBefore, '05.01.2027, 07.04.2027, 16.02.2027, 19.02.2027, 04.04.2027');
  assert.match(water.action, /konsumatorët/);
  const milk = n['xk-auv-4410'];                                     // the text in the page itself
  assert.equal(milk.name, 'Qumështit UHT “Land” 3.2%');
  assert.equal(milk.hazard, 'toxin');
  assert.equal(n['xk-auv-4316'].category, 'baby');
  assert.equal(n['xk-auv-4283'].name, 'Aptamil Pronutra 1, Pronutra 2 dhe Bebelac 1');
  assert.equal(got.skipped['hrana za životinje'], 1);                // "SELECT MILK GR" for dairy cows
  await assert.rejects(XK.fetchNotices({ fetchImpl: server({ [asked[0]]: '{"code":"rest_no_route"}' }).fetchImpl, since: '2026-02-15' }), /format se promijenio/);
});

test('XK: read once; a document that cannot be read is asked for again next time', async () => {
  const first = await XK.fetchNotices({ fetchImpl: server(live).fetchImpl, since: '2026-02-15' });
  const again = server(live);
  const got = await XK.fetchNotices({ fetchImpl: again.fetchImpl, since: '2026-02-15', known: new Map(first.notices.map((n) => [n.id, n])) });
  assert.equal(again.asked.length, 1);
  assert.equal(got.notices.length, first.notices.length);
  const broken = { ...live, [DOC('Flips-Ketchup')]: '<html>404</html>' };
  const once = await XK.fetchNotices({ fetchImpl: server(broken).fetchImpl, since: '2026-02-15' });
  assert.equal(once.skipped['dokument nije pročitan (pokušava se sljedeći put)'], 1);
  assert.ok(!once.notices.some((n) => n.id === 'xk-auv-4423'));
});

test('XK: titles and the words of a document', () => {
  assert.equal(XK.productOfTitle('AUV njofton për tërheqjen nga tregu të disa produkteve ushqimore për foshnje APTAMIL'), 'APTAMIL');
  assert.equal(XK.productOfTitle('Agjencia e Ushqimit dhe Veterinarisë tërheq nga tregu ëmbëlsirat xhelatinoze (Jelly) të prodhuara në Japoni'), 'ëmbëlsirat xhelatinoze (Jelly)');
  assert.deepEqual(XK.expiryDates('Paketim: 1.5 L, datë skadimi: 05.01.2027 dhe 07.04.2027\nme datën e skadimit 11/06/2026 dhe peshë 150g'), ['05.01.2027', '07.04.2027', '11/06/2026']);
  assert.equal(XK.documentOf('<iframe src="//view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Fauvk.rks-gov.net%2Fwp-content%2Fuploads%2F2026%2F09%2FA.docx&amp;wdStartOn=1">'), 'https://auvk.rks-gov.net/wp-content/uploads/2026/09/A.docx');
  assert.equal(XK.documentOf('<iframe src="//view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Fexample.com%2Fx.docx">'), null);   // only the agency's own
});

test('docx: the text of a Word document, a line per paragraph; anything else is refused', () => {
  const bytes = Buffer.from(live[DOC('Ujit-mineral-Kllokoti')].slice(7), 'base64');
  const text = docxText(bytes);
  assert.match(text, /^Republika e Kosovës\n/);
  assert.match(text, /\nEmri i produktit: Ujë Mineral\n/);
  assert.equal(zipEntry(bytes, 'word/missing.xml'), null);
  assert.throws(() => docxText(Buffer.from('<html>not a document</html>')), /nije ZIP/);
});

test('no test reached for the network', () => verify());
