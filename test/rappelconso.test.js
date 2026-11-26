'use strict';
/**
 * The French register's adapter. The rows are invented, in the two spellings of the columns the
 * adapter accepts. NOT tested here: the live register — see the note at the top of sources/rappelconso.js.
 */
const { verify } = require('./no-network');   // first: no test may touch the network
const test = require('node:test');
const assert = require('node:assert/strict');
const RC = require('../sources/rappelconso');
const C = require('../lib/contract');
const rows = require('./fixtures/rappelconso-v2.json');

const reply = (body, status = 200) => async () => ({ ok: status >= 200 && status < 300, status, json: async () => body });
const read = (body, since = '2026-10-12') => RC.fetchNotices({ fetchImpl: reply(body), since });

test('rows of the register become notices of the format — only food, baby food, supplements and cosmetics', async () => {
  const got = await read(rows);
  assert.equal(got.seen, rows.length);
  assert.deepEqual(got.notices.map((n) => n.id), ['fr-rc-2026-11-0101', 'fr-rc-2026-11-0102', 'fr-rc-2026-11-0103', 'fr-rc-2026-11-0104', 'fr-rc-2026-11-0105', 'fr-rc-2026-11-0106', 'fr-rc-2026-11-0113', 'fr-rc-2026-11-0114']);
  assert.deepEqual(got.skipped, { 'kategorija koju LUPA ne prikazuje': 2, 'link ne vodi na rappel.conso.gouv.fr': 1, 'starije od prozora': 1, 'bez broja, datuma ili linka': 1 });
  // every one passes the checks of the format, as it stands
  for (const n of got.notices) assert.equal(C.checkNotice(n).ok, true, `${n.id}: ${C.checkNotice(n).why}`);
  const by = Object.fromEntries(got.notices.map((n) => [n.id, n]));
  const first = by['fr-rc-2026-11-0101'];
  assert.deepEqual(
    { country: first.country, published: first.published, category: first.category, hazard: first.hazard, name: first.name, brand: first.brand, reason: first.reason, source: first.source, url: first.url },
    { country: 'FR', published: '2026-11-24', category: 'food', hazard: 'microbe', name: 'Rillettes de poulet rôti 220 g', brand: 'Exemple', reason: 'Présence de Listeria monocytogenes', source: 'RappelConso', url: 'https://rappel.conso.gouv.fr/fiche-rappel/90001/Interne' },
  );
  assert.equal(first.details, 'Listeria monocytogenes (agent responsable de la listériose)');
  assert.equal(first.action, 'Ne plus consommer. Rapporter le produit au point de vente. Contacter le service consommateur.');
  // the same notice listed once per product: one notice, all its barcodes
  assert.deepEqual(first.gtins, ['3017620422003', '3017620425035', '8000000000019']);
  // categories and kinds
  assert.deepEqual([by['fr-rc-2026-11-0102'].category, by['fr-rc-2026-11-0102'].hazard], ['baby', 'toxin']);
  assert.deepEqual([by['fr-rc-2026-11-0103'].category, by['fr-rc-2026-11-0103'].hazard], ['supplement', 'chemical']);
  assert.deepEqual([by['fr-rc-2026-11-0104'].category, by['fr-rc-2026-11-0104'].hazard], ['cosmetic', 'chemical']);
  assert.deepEqual([by['fr-rc-2026-11-0105'].category, by['fr-rc-2026-11-0105'].hazard], ['food', 'allergen']);
  assert.deepEqual([by['fr-rc-2026-11-0106'].category, by['fr-rc-2026-11-0106'].hazard], ['food', 'foreign']);
  assert.equal(by['fr-rc-2026-11-0113'].hazard, 'label');
  assert.equal(by['fr-rc-2026-11-0114'].hazard, 'other');
  // dates in every spelling; a barcode given as a number; wrong barcodes dropped, the notice kept
  assert.equal(by['fr-rc-2026-11-0102'].published, '2026-11-23');
  assert.equal(by['fr-rc-2026-11-0103'].published, '2026-11-22');
  assert.deepEqual(by['fr-rc-2026-11-0102'].gtins, ['4006381333931']);
  assert.deepEqual(by['fr-rc-2026-11-0105'].gtins, ['96385074']);
  assert.deepEqual(by['fr-rc-2026-11-0103'].gtins, []);
  // batches and dates are never guessed
  for (const n of got.notices) { assert.equal('lots' in n, false); assert.equal('bestBefore' in n, false); }
});

test('the live register (as seen on 26 Nov 2026): lower-case texts get their capitals, "sans marque" is no brand, barcodes come from whole fields only', async () => {
  const live = require('./fixtures/rappelconso-live-2026-11-26.json');
  const got = await read(live, '2026-11-01');
  assert.equal(got.notices.length, 3);
  for (const n of got.notices) assert.equal(C.checkNotice(n).ok, true, `${n.id}: ${C.checkNotice(n).why}`);
  const by = Object.fromEntries(got.notices.map((n) => [n.id, n]));
  const tarte = by['fr-rc-2026-11-0201'];
  assert.equal(tarte.name, 'Tarte 3 fromages');
  assert.equal(tarte.brand, undefined);                                                   // "sans marque"
  assert.equal(tarte.reason, 'Détection de présence de listeria monocytogenes');
  assert.equal(tarte.details, 'Listeria monocytogenes (agent responsable de la listériose)');
  assert.equal(tarte.action, 'Ne plus consommer. Contacter le point de vente. Détruire le produit.');
  assert.deepEqual(tarte.gtins, []);                                                      // "$26317$…" is a batch, not a barcode
  assert.equal(tarte.hazard, 'microbe');
  assert.deepEqual([tarte.category, tarte.published], ['food', '2026-11-26']);
  const buche = by['fr-rc-2026-11-0190'];
  assert.equal(buche.name, 'Buche fraiche nature');
  assert.equal(buche.brand, 'Le Cabrichou');
  assert.deepEqual(buche.gtins, ['3017620422003', '3017620425035']);                    // whole fields; the 8-digit "96385074" is not taken
  // a text that already has capitals is left exactly as it is; a lot written like a date never becomes a barcode
  const creme = by['fr-rc-2026-11-0150'];
  assert.deepEqual([creme.name, creme.brand, creme.reason, creme.details, creme.action], ['Crème visage 50 ml', 'Maison BLANCHE', 'Présence de Pseudomonas aeruginosa', 'Infection', 'Ne plus utiliser le produit. Rapporter le produit au point de vente.']);
  assert.deepEqual(creme.gtins, []);                                                      // "GTIN: 4006381333931 - Lot: …" is not a whole field: not taken from this text
  assert.equal(creme.category, 'cosmetic');
  // the small parts
  assert.equal(RC.sentence('  présence de listéria '), 'Présence de listéria');
  assert.equal(RC.sentence('E.coli STEC'), 'E.coli STEC');
  assert.equal(RC.sentence(''), '');
  assert.equal(RC.sentence(null), null);
  for (const none of ['sans marque', 'SANS MARQUE', 'Sans-marque', 'aucune', 'n/a', '-', '', '  ', 'diverses marques', '/', '–', 'en attente des résultats d\'analyses, blocage des coquillages', null]) assert.equal(RC.brandOf(none), undefined, String(none));
  assert.deepEqual(['montauzer', 'ferme de la motte', 'saint-marc', "l'atelier du pain", 'E.Leclerc', 'u', 'carrefour bio', 'e.leclerc ibos'].map(RC.brandOf), ['Montauzer', 'Ferme de la Motte', 'Saint-Marc', "L'atelier du Pain", 'E.Leclerc', 'U', 'Carrefour Bio', 'E.Leclerc Ibos']);
  assert.deepEqual(RC.gtinsOf({ gtin: '96385074 3017620425035', identification_produits: '$4006381333931$1$dlc$2026-01-01$' }), ['96385074', '3017620425035', '4006381333931']);   // a barcode column is read whole
  assert.deepEqual(RC.gtinsOf({ gtin: '2609898025201 3017620425035', identification_produits: ['$0202558000000$1$dlc$2026-01-01$', '$293134000002$x$y$', '$3505870000343$x$y$'] }), ['3017620425035', '3505870000343']);   // sold by weight: a shop's own numbers are left out
  assert.deepEqual(RC.gtinsOf({ identification_produits: ['$3 017 620 422 003$1$dlc$2026-01-01$', '$30176204220031$x$y$'] }), []);   // never assembled from pieces; a wrong check digit is not a barcode
});

test('the older spelling of the columns is read the same', async () => {
  const OLD = { numero_fiche: 'reference_fiche', marque_produit: 'nom_de_la_marque_du_produit', categorie_produit: 'categorie_de_produit', sous_categorie_produit: 'sous_categorie_de_produit',
    date_publication: 'date_de_publication', motif_rappel: 'motif_du_rappel', risques_encourus: 'risques_encourus_par_le_consommateur', libelle: 'noms_des_modeles_ou_references' };
  const old = rows.map((row) => Object.fromEntries(Object.entries(row).map(([k, v]) => [OLD[k] ?? k, v])));
  const a = await read(rows);
  const b = await read(old);
  assert.deepEqual(b.notices, a.notices);
});

test('columns the adapter does not know: it stops and says what it saw — it never guesses', async () => {
  const renamed = rows.map((row) => Object.fromEntries(Object.entries(row).map(([k, v]) => [`x_${k}`, v])));
  await assert.rejects(read(renamed), (e) => /kolone registra nisu one koje adapter poznaje/.test(e.message) && /x_motif_rappel/.test(e.message) && /nedostaje: ref, date, category, motive, link/.test(e.message));
  const noLink = rows.map(({ lien_vers_la_fiche_rappel: _, ...rest }) => rest);
  await assert.rejects(read(noLink), /nedostaje: link/);
});

test('an answer that is not the register is an error, never an empty list', async () => {
  await assert.rejects(read([]), /0 redova/);
  await assert.rejects(read({ error: 'x' }), /nije lista/);
  await assert.rejects(read('<!doctype html>'), /nije lista/);
  await assert.rejects(RC.fetchNotices({ fetchImpl: reply(rows, 503) }), /HTTP 503/);
  await assert.rejects(RC.fetchNotices({ fetchImpl: async () => { throw new Error('getaddrinfo ENOTFOUND'); } }), /ENOTFOUND/);
  await assert.rejects(RC.fetchNotices({ fetchImpl: async () => ({ ok: true, status: 200, json: async () => { throw new SyntaxError('Unexpected token <'); } }) }), /Unexpected token/);
  // the "records" form of the same API ({ results: [...] }) is read too
  assert.equal((await read({ total_count: rows.length, results: rows })).notices.length, 8);
});

test('the request: one GET for JSON, with the job\'s name; the window is applied', async () => {
  let seen = null;
  await RC.fetchNotices({ fetchImpl: async (url, options) => { seen = { url, options }; return { ok: true, status: 200, json: async () => rows }; }, userAgent: 'lupa-recalls/1.0 (test)', since: '2026-11-20' });
  assert.equal(seen.url, RC.defaultUrl);
  assert.match(seen.url, /^https:\/\/data\.economie\.gouv\.fr\/api\/explore\/v2\.1\/catalog\/datasets\/rappelconso-[a-z0-9-]+\/exports\/json$/);
  assert.equal(seen.options.headers['User-Agent'], 'lupa-recalls/1.0 (test)');
  assert.equal(seen.options.method, undefined);
  const recent = await read(rows, '2026-11-20');
  assert.deepEqual(recent.notices.map((n) => n.published).sort(), ['2026-11-20', '2026-11-21', '2026-11-22', '2026-11-23', '2026-11-24']);
});

test('small parts: days, categories, ids', () => {
  assert.equal(RC.dayOf('2026-11-24T09:15:00+01:00'), '2026-11-24');
  assert.equal(RC.dayOf('2026-11-24'), '2026-11-24');
  assert.equal(RC.dayOf('24/11/2026 10:00:00'), '2026-11-24');
  for (const bad of ['', null, undefined, 'hier', '24.11.2026', 20261124]) assert.equal(RC.dayOf(bad), null, String(bad));
  assert.equal(RC.categoryOf('Alimentation', 'Aliments pour bébés'), 'baby');
  assert.equal(RC.categoryOf('Alimentation', 'Compléments alimentaires'), 'supplement');
  assert.equal(RC.categoryOf('Alimentation', 'Viandes'), 'food');
  assert.equal(RC.categoryOf('Alimentation', 'Aliments pour animaux'), null);
  assert.equal(RC.categoryOf('Hygiène-Beauté', 'Cosmétiques'), 'cosmetic');
  for (const other of ['Automobiles et moyens de déplacement', 'Bébés-Enfants (hors alimentaire)', 'Maison-Habitat', 'Sports-loisirs', '', null]) assert.equal(RC.categoryOf(other, ''), null, String(other));
  const odd = RC.toNotice({ numero_fiche: 'SR/00123/24 (v2)', date_publication: '2026-11-24', categorie_produit: 'Alimentation', libelle: 'Produit', motif_rappel: 'Motif', lien_vers_la_fiche_rappel: 'https://rappel.conso.gouv.fr/fiche-rappel/1/Interne' });
  assert.equal(odd.notice.id, 'fr-rc-sr-00123-24-v2');
  assert.equal(C.checkNotice(odd.notice).ok, true);
});

verify();
