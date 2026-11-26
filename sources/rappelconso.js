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
 * What is NOT taken: batch numbers and dates — the register packs them into one field
 * ("identification_produits", entries like "$26317$date limite de consommation$2026-11-22$")
 * whose layout has been seen on one day's data only, and a wrongly read batch would be worse
 * than none. The notice itself (one tap away in the app) has them.
 *
 * Seen on the live data (26 Nov 2026, 19 336 rows): the columns are the first spelling of each
 * entry in COLUMNS below; there is no barcode column; every text is in lower case ("tarte 3
 * fromages", "montauzer"); a product without a brand says "sans marque".
 */
const { gtinsIn, isValidGtin } = require('../lib/gtin');
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
  ident: ['identification_produits'],
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

// ── Text as the register gives it, made readable ──────────────────────────────────────────────
// The register gives every text in lower case. A text with no capital letter at all gets one where
// a reader expects it; a text that has any capital letter is left exactly as it is.
const LOCALE = 'fr-FR';
const hasNoCapital = (s) => s === s.toLocaleLowerCase(LOCALE);
const upFirst = (s) => s.replace(/^\p{L}/u, (c) => c.toLocaleUpperCase(LOCALE));
/** "détection de présence de listeria" → "Détection de présence de listeria". */
function sentence(value) {
  if (value === null) return null;
  const s = String(value).trim();
  return s !== '' && hasNoCapital(s) ? upFirst(s) : s;
}
/** Words that stay small inside a brand name ("Ferme de la Motte"). */
const SMALL_WORDS = new Set(['de', 'du', 'des', 'la', 'le', 'les', 'et', 'en', 'à', 'au', 'aux', 'sur', 'par', 'pour', 'd', 'l']);
/** "le cabrichou" → "Le Cabrichou"; "saint-marc" → "Saint-Marc"; a brand written with capitals is left as it is. */
function brandCase(s) {
  if (!hasNoCapital(s)) return s;
  return s.split(/\s+/).map((word, i) => (i > 0 && SMALL_WORDS.has(word.replace(/['’].*$/, '')) ? word : word.replace(/(^|[-.])(\p{L})/gu, (m, p, c) => p + c.toLocaleUpperCase(LOCALE)))).join(' ');
}
const MAX_BRAND = 40;
/** The register's ways of saying "no brand" — the app then shows no brand row at all. */
const NO_BRAND = new Set(['sans marque', 'sans-marque', 'aucune', 'aucune marque', 'pas de marque', 'non applicable', 'n/a', 'na', '-', 'inconnue', 'inconnu', 'marque inconnue', 'multiple', 'multiples', 'diverses', 'diverses marques', 'plusieurs marques', 'plusieurs', 'toutes marques']);
function brandOf(value) {
  if (value === null) return undefined;
  const s = String(value).trim();
  if (s === '' || NO_BRAND.has(fold(s).replace(/\s+/g, ' '))) return undefined;
  if (!/[\p{L}\p{N}]/u.test(s)) return undefined;   // "/", "–": a filler, not a brand
  if (s.length > MAX_BRAND) return undefined;        // a sentence typed into the brand field (seen live) is not a brand
  return brandCase(s);
}
/** "ne plus consommer|rapporter le produit au point de vente" → "Ne plus consommer. Rapporter le produit au point de vente." (with `close`: a full stop at the end) */
function listText(value, close = false) {
  if (value === null) return null;
  const parts = String(value).split('|').map((x) => sentence(x)).filter(Boolean);
  if (parts.length === 0) return null;
  const text = parts.join('. ').replace(/\.\.+/g, '.');
  return close && !/[.!?…]$/.test(text) ? `${text}.` : text;
}
/**
 * The product's barcodes. A barcode column, when the register has one, is read whole. The
 * "identification_produits" field (entries "$lot$kind of date$date$", with the barcode as one of
 * the fields where the product has one) gives a barcode only as a WHOLE field that is a valid
 * GTIN of 12, 13 or 14 digits — never assembled from pieces, and never an 8-digit field, which a
 * batch number written like a date ("20261122") can look like.
 */
function gtinsOf(row) {
  const out = gtinsIn(pick(row, 'gtin'));
  const ident = pick(row, 'ident');
  const entries = Array.isArray(ident) ? ident : ident === null ? [] : [ident];
  for (const entry of entries) {
    for (const field of String(entry).split(/[$|]/)) {
      const f = field.trim();
      if (f.length >= 12 && isValidGtin(f) && !out.includes(f)) out.push(f);
    }
  }
  return out.slice(0, 50);
}

/** One row of the register → a notice in the feed's format (unchecked: lib/contract checks it), or null with the reason. */
function toNotice(row) {
  const ref = pick(row, 'ref');
  const link = pick(row, 'link');
  const day = dayOf(pick(row, 'date'));
  if (ref === null || link === null || day === null) return { skip: 'bez broja, datuma ili linka' };
  if (hostOf(String(link)) !== HOST) return { skip: 'link ne vodi na rappel.conso.gouv.fr' };
  const category = categoryOf(pick(row, 'category'), pick(row, 'subcategory'));
  if (category === null) return { skip: 'kategorija koju LUPA ne prikazuje' };
  const brand = brandOf(pick(row, 'brand'));
  const title = sentence(pick(row, 'title') ?? pick(row, 'model'));
  if (title === null || title === '') return { skip: 'bez naziva' };
  const motive = sentence(pick(row, 'motive'));
  if (motive === null || motive === '') return { skip: 'bez razloga' };
  const risks = listText(pick(row, 'risks'));
  const id = `${PREFIX}${String(ref).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`.slice(0, 80);
  return {
    notice: {
      id,
      country: COUNTRY,
      published: day,
      category,
      hazard: hazardOf(motive, risks),
      name: title,
      brand,
      reason: motive,
      details: risks ?? undefined,
      action: listText(pick(row, 'action'), true) ?? undefined,
      source: SOURCE,
      url: String(link),
      gtins: gtinsOf(row),
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

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: DEFAULT_URL, fetchNotices, toNotice, dayOf, categoryOf, sentence, brandOf, gtinsOf, COLUMNS };
