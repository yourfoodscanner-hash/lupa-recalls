'use strict';
/**
 * France — RappelConso (rappel.conso.gouv.fr), the French government's register of product
 * recalls, published as open data by the DGCCRF on data.economie.gouv.fr under the
 * "Licence Ouverte / Open Licence 2.0" (the source and the date of the data must be named:
 * the app shows "RappelConso" with every notice and links to the notice itself).
 *
 * ── Read this before trusting it ──────────────────────────────────────────────
 * This adapter was written WITHOUT access to the live data (the place it was written in could
 * not reach data.economie.gouv.fr). The names of the dataset's columns are therefore taken from
 * its public descriptions, and several spellings are accepted for each. If the real columns are
 * called something else, the adapter does not guess: it stops with a message that lists the
 * columns it saw, the job publishes without this source, and nothing wrong reaches the app.
 * "node tools/probe.js rappelconso" shows what the live data looks like and what would be published.
 *
 * What is taken: food, baby food, food supplements and cosmetics. Everything else in the
 * register (cars, toys, electrical goods …) is outside what LUPA shows.
 * What is NOT taken: batch numbers and dates — the register packs them into one field whose
 * format could not be checked, and a wrongly read batch would be worse than none. The notice
 * itself (one tap away in the app) has them.
 */
const { gtinsIn } = require('../lib/gtin');
const { fold, hazardOf } = require('../lib/classify');
const { hostOf } = require('../lib/contract');

const NAME = 'rappelconso';
const PREFIX = 'fr-rc-';
const COUNTRY = 'FR';
const SOURCE = 'RappelConso';
const HOST = 'rappel.conso.gouv.fr';
const DEFAULT_URL = 'https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-espaces/exports/json';
const TIMEOUT_MS = 180000;

/** What the adapter needs → the column names it accepts for it (first found wins). */
const COLUMNS = {
  ref: ['numero_fiche', 'reference_fiche', 'numero_de_fiche'],
  title: ['libelle', 'titre', 'titre_de_la_fiche'],
  model: ['modeles_ou_references', 'noms_des_modeles_ou_references'],
  brand: ['marque_produit', 'nom_de_la_marque_du_produit'],
  category: ['categorie_produit', 'categorie_de_produit'],
  subcategory: ['sous_categorie_produit', 'sous_categorie_de_produit'],
  date: ['date_publication', 'date_de_publication'],
  motive: ['motif_rappel', 'motif_du_rappel'],
  risks: ['risques_encourus', 'risques_encourus_par_le_consommateur'],
  action: ['conduites_a_tenir_par_le_consommateur', 'conduites_a_tenir'],
  link: ['lien_vers_la_fiche_rappel'],
  gtin: ['gtin', 'code_barre', 'codes_barres'],
};
/** Without these a notice cannot be published at all. */
const REQUIRED = ['ref', 'date', 'category', 'motive', 'link'];

const pick = (row, what) => {
  for (const column of COLUMNS[what]) {
    const value = row[column];
    if (value !== undefined && value !== null && String(value).trim() !== '') return value;
  }
  return null;
};

/** "2026-11-24T10:15:00+01:00", "2026-11-24", "24/11/2026 10:15" → "2026-11-24" (the day as the register writes it). */
function dayOf(value) {
  const text = String(value ?? '').trim();
  let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(text);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return null;
}

/** The register's category and sub-category → the app's category, or null for what LUPA does not show. */
function categoryOf(category, subcategory) {
  const c = fold(category);
  const s = fold(subcategory);
  if (c.includes('alimentation')) {
    if (s.includes('animaux')) return null;                       // pet food
    if (s.includes('bebe') || s.includes('nourrisson') || s.includes('infantile')) return 'baby';
    if (s.includes('complement')) return 'supplement';
    return 'food';
  }
  if (c.includes('hygiene') || c.includes('beaute') || c.includes('cosmeti')) return 'cosmetic';
  return null;
}

/** "Ne plus consommer|Rapporter le produit au point de vente" → one readable line. */
const listText = (value) => (value === null ? null : String(value).split('|').map((x) => x.trim()).filter(Boolean).join('. ').replace(/\.\.+/g, '.'));

/** One row of the register → a notice in the feed's format (unchecked: lib/contract checks it), or null with the reason. */
function toNotice(row) {
  const ref = pick(row, 'ref');
  const link = pick(row, 'link');
  const day = dayOf(pick(row, 'date'));
  if (ref === null || link === null || day === null) return { skip: 'bez broja, datuma ili linka' };
  if (hostOf(String(link)) !== HOST) return { skip: 'link ne vodi na rappel.conso.gouv.fr' };
  const category = categoryOf(pick(row, 'category'), pick(row, 'subcategory'));
  if (category === null) return { skip: 'kategorija koju LUPA ne prikazuje' };
  const brand = pick(row, 'brand');
  const title = pick(row, 'title') ?? pick(row, 'model');
  if (title === null) return { skip: 'bez naziva' };
  const motive = pick(row, 'motive');
  if (motive === null) return { skip: 'bez razloga' };
  const risks = listText(pick(row, 'risks'));
  const id = `${PREFIX}${String(ref).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`.slice(0, 80);
  return {
    notice: {
      id,
      country: COUNTRY,
      published: day,
      category,
      hazard: hazardOf(motive, risks),
      name: String(title),
      brand: brand === null ? undefined : String(brand),
      reason: String(motive),
      details: risks ?? undefined,
      action: listText(pick(row, 'action')) ?? undefined,
      source: SOURCE,
      url: String(link),
      gtins: gtinsIn(pick(row, 'gtin')),
    },
  };
}

/**
 * Reads the register. Resolves to { notices, seen, skipped } — notices in the feed's format,
 * not yet checked. Throws when the answer is not the register as described above.
 * `since`: the oldest day wanted ("2026-10-01"); older rows are left out here already.
 */
async function fetchNotices({ fetchImpl = fetch, url = DEFAULT_URL, since = '2000-01-01', userAgent } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let rows;
  try {
    const response = await fetchImpl(url, { signal: controller.signal, headers: { Accept: 'application/json', ...(userAgent ? { 'User-Agent': userAgent } : {}) } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    rows = await response.json();
  } finally {
    clearTimeout(timer);
  }
  if (rows && !Array.isArray(rows) && Array.isArray(rows.results)) rows = rows.results; // the "records" form of the same API
  if (!Array.isArray(rows)) throw new Error('odgovor nije lista redova');
  if (rows.length === 0) throw new Error('registar je vratio 0 redova');
  // the columns must be the ones this adapter knows — judged on the rows themselves, never guessed
  const seenColumns = new Set();
  for (const row of rows.slice(0, 200)) if (row && typeof row === 'object') for (const key of Object.keys(row)) seenColumns.add(key);
  const missing = REQUIRED.filter((what) => !COLUMNS[what].some((column) => seenColumns.has(column)));
  if (missing.length > 0) {
    throw new Error(`kolone registra nisu one koje adapter poznaje (nedostaje: ${missing.join(', ')}). Viđene kolone: ${[...seenColumns].sort().join(', ')}`);
  }
  const skipped = {};
  const byId = new Map();
  for (const row of rows) {
    if (!row || typeof row !== 'object') { skipped['red nije objekat'] = (skipped['red nije objekat'] ?? 0) + 1; continue; }
    const out = toNotice(row);
    if (out.skip) { skipped[out.skip] = (skipped[out.skip] ?? 0) + 1; continue; }
    if (out.notice.published < since) { skipped['starije od prozora'] = (skipped['starije od prozora'] ?? 0) + 1; continue; }
    if (!byId.has(out.notice.id)) byId.set(out.notice.id, []);
    byId.get(out.notice.id).push(out.notice);
  }
  // The register may list one notice once per product. It becomes ONE notice: the fullest of its
  // rows, with the barcodes of all of them — the same whatever order the rows arrive in.
  const filled = (n) => Object.values(n).filter((v) => v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0)).length;
  const notices = [];
  for (const group of byId.values()) {
    const best = group.map((n) => ({ n, score: filled(n), key: JSON.stringify(n) })).sort((x, y) => y.score - x.score || (x.key < y.key ? -1 : x.key > y.key ? 1 : 0))[0].n;
    const gtins = [...new Set(group.flatMap((n) => n.gtins))].sort().slice(0, 50);
    notices.push({ ...best, gtins });
  }
  return { notices, seen: rows.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: DEFAULT_URL, fetchNotices, toNotice, dayOf, categoryOf, COLUMNS };
