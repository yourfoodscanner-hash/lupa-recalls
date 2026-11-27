'use strict';
/**
 * Spain — Agencia Española de Seguridad Alimentaria y Nutrición (AESAN), "Red de alerta alimentaria":
 * the agency's own food alerts (https://www.aesan.gob.es/alertas/buscador-alertas).
 *
 * Seen on the live data (27 Nov 2026): the list, newest first, 20 a page (/buscador-alertas/2 …), each a
 * card with a link (/alertas/2026_89), the title ("Alerta por posible presencia de fragmentos de vidrio
 * en frutos secos procedentes de España. (Ref. ES2026/712)"), an icon for its kind (cookie: allergies
 * and intolerances, pill: food supplements, error_outline: everyone) and the day ("27 Noviembre 2026").
 * An alert that is updated or withdrawn gets a new card with the same reference: "Ampliación de
 * información sobre la alerta …" (its page has the products as they now are) and "Retirada de la alerta …"
 * (the alert no longer holds — none of its cards is published). The page of an alert: a summary, the
 * agency's text and per product a list of labeled values — "Nombre del producto", "Marca" / "Nombre de
 * marca comercial", "Número de lote", "Fecha de consumo preferente" / "Fecha de caducidad", "Número de
 * lote y fecha de consumo preferente" (then "1127091 - 12/12/2026" each), "EAN …". A page is read once
 * (`known` after that).
 */
const { htmlToText, oneLine, idOf, cut, alignedFold, labeledGtins } = require('../lib/text');
const { getText, mapLimit } = require('../lib/http');
const { hazardOf } = require('../lib/classify');

const NAME = 'aesan';
const PREFIX = 'es-aesan-';
const COUNTRY = 'ES';
const SOURCE = 'Agencia Española de Seguridad Alimentaria y Nutrición (AESAN)';
const SITE = 'https://www.aesan.gob.es';
const LIST = `${SITE}/alertas/buscador-alertas`;
const MAX_LIST_PAGES = 4;
const MAX_PAGES = 40;
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const unique = (xs) => [...new Set(xs.filter(Boolean))];
const keyOf = (label) => alignedFold(String(label)).replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

/** "27 Noviembre 2026" → "2026-11-27". */
function dayOfSpanish(text) {
  const m = /^\s*(\d{1,2})\s+([A-Za-zÁÉÍÓÚáéíóú]+)\s+(\d{4})\s*$/.exec(String(text ?? ''));
  const month = m ? MONTHS.indexOf(alignedFold(m[2])) + 1 : 0;
  return month ? `${m[3]}-${String(month).padStart(2, '0')}-${m[1].padStart(2, '0')}` : null;
}

/** "(Ref. ES2026/712)" → "ES2026/712" (or null). */
const refOf = (title) => ((/\(\s*Ref\.?\s*:?\s*([A-Z]{2}\d{4}\/\d+)\s*\)/i.exec(title) ?? [])[1] ?? null);

/** The cards of a page of the list. Throws when the page is not the list. */
function listRows(html) {
  const page = String(html ?? '');
  if (!/Buscador de alertas alimentarias/.test(page) || !/seeMoreCard/.test(page)) throw new Error('stranica nije lista upozorenja AESAN-a (format se promijenio?)');
  const rows = [];
  for (const m of page.matchAll(/<a class="seeMoreCard[^"]*" href="(\/alertas\/(\d{4}_\d+))" title="([^"]*)">\s*<div class="seeMoreCard-heading">\s*<div class="seeMoreCard-heading__icon[^"]*"[^>]*>\s*([a-z_]+)\s*<\/div>\s*<span class="seeMoreCard-heading__value">([^<]+)<\/span>/g)) {
    const title = oneLine(m[3]);
    const day = dayOfSpanish(m[5]);
    if (day && !rows.some((r) => r.key === m[2])) rows.push({ key: m[2], url: SITE + m[1], title, icon: m[4], day, ref: refOf(title) });
  }
  return rows;
}

/** Every <li> of a fragment with its depth and its own text (nested lists not in it). */
function listItems(html) {
  const items = [];
  const open = [];
  let depth = 0;
  let pos = 0;
  for (const m of String(html).matchAll(/<(\/?)(ul|ol|li)\b[^>]*>/gi)) {
    if (open.length) items[open[open.length - 1]].html += html.slice(pos, m.index);
    pos = m.index + m[0].length;
    if (m[2].toLowerCase() === 'li') {
      if (m[1]) open.pop();
      else { items.push({ depth, html: '' }); open.push(items.length - 1); }
    } else depth += m[1] ? -1 : 1;
  }
  return items.map((i) => ({ depth: i.depth, text: oneLine(i.html).replace(/\s+([,.;:])/g, '$1') })).filter((i) => i.text);
}

/** An alert's page → { title, day, kind, summary, text, products: [{ key: [values] }], loose: [names] } or null. */
function pageParts(html) {
  const page = String(html ?? '').replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '');
  const title = oneLine((/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(page) ?? [])[1] ?? '');
  const date = /<div class="pageInfo__date">[\s\S]*?<span>(\d{2})\/(\d{2})\/(\d{4})<\/span>/.exec(page);
  const containers = [...page.matchAll(/<div class="post-container[^"]*">([\s\S]*?)<\/div>/g)].map((m) => m[1]);
  if (!title || !date || containers.length === 0) return null;
  const kind = oneLine((/<div class="pageInfo__category">[\s\S]*?<p>([\s\S]*?)<\/p>/.exec(page) ?? [])[1] ?? '');
  const tidy = (t) => t.replace(/[ \t]+([,.;:])/g, '$1');
  const summary = tidy(htmlToText(containers.length > 1 ? containers[0] : ''));
  const main = containers[containers.length - 1];
  const text = tidy(htmlToText(main));
  // the products: the lists after "Los datos del producto implicado son" (or of the whole text)
  const from = main.search(/datos\s+(?:actualizados\s+)?de(?:l| los)\s+productos?\s+implicados?/i);
  const items = listItems(from >= 0 ? main.slice(from) : main);
  const products = [];
  const loose = [];
  let current = null;
  let lastKey = null;
  for (const item of items) {
    const m = /^([^:]{2,70}):\s*(.*)$/.exec(item.text);
    if (item.depth === 1 && m) {
      const key = keyOf(m[1]);
      if (!current || (key === 'nombre del producto' && current[key])) { current = {}; products.push(current); }
      // a label without a value has its values in the list under it; one with a value, a description there
      lastKey = m[2].trim() ? null : key;
      current[key] = current[key] ?? [];
      if (m[2].trim()) current[key].push(m[2].trim());
    } else if (item.depth > 1 && current && m && m[1].length <= 40) {
      const key = keyOf(m[1]);           // a labeled value of its own ("Fecha de caducidad: 14/11/2026" under a batch)
      current[key] = current[key] ?? [];
      if (m[2].trim()) current[key].push(m[2].trim());
    } else if (item.depth > 1 && current && lastKey) {
      current[lastKey].push(item.text);   // the values of the label above
    } else if (item.depth === 1 && !m) {
      loose.push(item.text);
    }
  }
  return { title, day: `${date[3]}-${date[2]}-${date[1]}`, kind, summary, text, products, loose };
}

/** "Alerta por posible presencia de X en Y procedentes de Z. (Ref. …)" → { reason: "Posible presencia de X", product: "Y" }. */
function titleParts(title) {
  let t = String(title).replace(/\s*\(\s*Ref[^)]*\)\s*\.?\s*$/i, '').replace(/\.\s*$/, '').trim();
  t = t.replace(/^Ampliaci[oó]n de (?:la )?informaci[oó]n (?:sobre|de) (?:la )?/i, '');
  if (/^Advertencia\b/i.test(t) && t.includes(':')) t = t.slice(t.indexOf(':') + 1).trim();
  t = t.replace(/^(?:Alerta|Advertencia)\s+(?:alimentaria\s+)?(?:por|de|sobre)\s+/i, '');
  const m = /^(.*?)\s+en\s+(.+?)(?:\s+(?:procedentes?|de origen)\s+(?:de\s+)?.+)?$/i.exec(t);
  return m ? { reason: capital(m[1].trim()), product: m[2].trim() } : { reason: capital(t), product: null };
}

const valuesOf = (product, test) => Object.entries(product).filter(([k]) => test.test(k)).flatMap(([, v]) => v);

/** The card whose page is read: the update ("Ampliación …", the products as they now are), else the first. */
const pageCard = (cards) => cards.find((c) => /^Ampliaci[oó]n/i.test(c.title)) ?? cards[0];

/** One alert's cards and the page of its pageCard → a notice (unchecked), or { skip }. */
function toNotice(rows, parts) {
  const row = pageCard(rows);
  const { reason: said, product } = titleParts(parts.title || row.title);
  const names = parts.products.map((p) => {
    const n = valuesOf(p, /^nombre del producto$|^producto$|^denominacion/)[0];
    const b = valuesOf(p, /^(?:nombre de )?marca(?: comercial)?$/)[0];
    if (!n) return null;
    const name = n.replace(/[.\s]+$/, '');
    return b && !alignedFold(name).includes(alignedFold(b.replace(/[.\s]+$/, ''))) ? `${b.replace(/[.\s]+$/, '')} ${name}` : name;
  }).filter(Boolean);
  // no product lists: the names listed without labels, else the name the summary quotes (“Enerup Premium”), else the title's
  const quoted = (/[“"«]([^”"»]{2,60})[”"»]/.exec(parts.summary) ?? [])[1];
  const fallback = parts.loose.length && parts.loose.length <= 12 ? parts.loose : quoted ? [quoted.trim()] : product ? [capital(product)] : [];
  const name = cut(unique(names.length ? names : fallback).join(', '), 160);
  if (name.length < 2) return { skip: 'bez naziva' };
  const reason = cut(said, 160);
  if (!reason) return { skip: 'bez razloga' };
  const lots = [];
  const dates = [];
  for (const p of parts.products) {
    for (const [key, values] of Object.entries(p)) {
      const lotKey = /\blotes?\b/.test(key);
      const dateKey = /fechas? de (?:consumo preferente|caducidad)|consumir preferentemente/.test(key);
      if (!lotKey && !dateKey) continue;
      for (const value of values) {
        // "1127091 - 12/12/2026": a batch and its date
        const pair = lotKey && dateKey ? /^([A-Za-z0-9][A-Za-z0-9/.\-]*?)\s+[-–]\s+(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}\/\d{4})\b/.exec(value) : null;
        if (pair) { lots.push(pair[1]); dates.push(pair[2]); continue; }
        const v = value.replace(/\([^)]*\)/g, ' ').replace(/\*+/g, ' ').replace(/\s+/g, ' ').trim().replace(/[.;\s]+$/, '');
        if (!/\d/.test(v)) continue;
        if (dateKey && !lotKey) { dates.push(v); continue; }
        for (const part of v.replace(/^(?:n[uú]mero de )?lotes?\s*:?\s*/i, '').split(/\s*[,;]\s*|\s+y\s+/)) {
          const date = /^fechas? de (?:caducidad|consumo preferente)\s*:?\s*(.+)$/i.exec(part);   // "62100902, Fecha de caducidad: 14/11/2026"
          if (date) dates.push(date[1]);
          else if (/\d/.test(part) && part.length <= 40 && !/[a-záéíóúñ]{3,}/.test(part)) lots.push(part);   // a code, not "Botellas de 500 ml"
        }
      }
    }
  }
  // the barcodes: labeled in the products' lists ("EAN: 8480010184778")
  const gtins = unique(parts.products.flatMap((p) => labeledGtins(Object.entries(p).map(([k, v]) => `${k}: ${v.join(' ')}`).join('\n'))));
  const allergy = /alergi|intoleranci/i.test(parts.kind) || row.icon === 'cookie';
  const supplement = /complementos? alimenticios?/i.test(`${parts.kind}\n${parts.title}`) || row.icon === 'pill';
  const all = `${parts.title}\n${name}\n${parts.text}`;
  const sentences = parts.summary.replace(/\n/g, ' ').split(/(?<=[.!?])\s+/);
  const action = sentences.find((s) => /se recomienda|se abstengan|no consum/i.test(s));
  const where = parts.text.split('\n').find((l) => /^Seg[uú]n la informaci[oó]n disponible/i.test(l));
  const details = [sentences[0] ?? '', where ?? ''].filter(Boolean).join(' ');
  return {
    notice: {
      id: idOf(PREFIX, row.ref ?? row.key), country: COUNTRY, published: rows.map((r) => r.day).sort()[0],
      category: supplement ? 'supplement' : /lactantes|infantil|beb[eé]s?\b|continuaci[oó]n/i.test(all) ? 'baby' : 'food',
      // AESAN files allergy warnings apart: another alert is not about an allergen ("sildenafilo no declarado")
      hazard: allergy ? 'allergen' : [hazardOf(reason, parts.summary, parts.text)].map((h) => (h === 'allergen' ? hazardOf(reason) : h))[0],
      name, reason,
      details: details ? cut(details, 800) : undefined,
      lots: lots.length ? cut(unique(lots).join(', '), 300) : undefined,
      bestBefore: dates.length ? cut(unique(dates).join(', '), 120) : undefined,
      action: action ? cut(action.trim(), 500) : undefined,
      source: SOURCE, url: row.url, gtins: gtins.slice(0, 50),
    },
  };
}

/** Reads the list of alerts. Resolves to { notices, seen, skipped }; throws when the list is not as described above. */
async function fetchNotices({ fetchImpl = fetch, url = LIST, since = '2000-01-01', userAgent, known = new Map() } = {}) {
  const skipped = {};
  const count = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };
  const rows = [];
  for (let n = 1; n <= MAX_LIST_PAGES; n++) {
    const page = listRows(await getText(fetchImpl, n === 1 ? url : `${url}/${n}`, { userAgent }));
    if (n === 1 && page.length === 0) throw new Error('lista upozorenja AESAN-a je prazna (format se promijenio?)');
    rows.push(...page.filter((r) => !rows.some((o) => o.key === r.key)));
    if (page.length === 0 || page.every((r) => r.day < since)) break;
  }
  // one alert, however many cards: withdrawn → none; otherwise its newest page, its first day
  const alerts = new Map();
  for (const row of rows) {
    const k = row.ref ?? row.key;
    if (!alerts.has(k)) alerts.set(k, []);
    alerts.get(k).push(row);
  }
  const notices = [];
  const toRead = [];
  for (const cards of alerts.values()) {
    if (cards.some((c) => /^Retirada de la alerta/i.test(c.title))) { count('upozorenje povučeno (retirada)'); continue; }
    if (cards.every((c) => c.day < since)) { count('starije od prozora'); continue; }
    const k = known.get(idOf(PREFIX, cards[0].ref ?? cards[0].key));
    if (k && k.url === pageCard(cards).url) notices.push(k);
    else toRead.push(cards);
  }
  const now = toRead.slice(0, MAX_PAGES);
  for (let i = now.length; i < toRead.length; i++) count('stranica ostavljena za sljedeće pokretanje');
  const pages = await mapLimit(now, 2, async (cards) => pageParts(await getText(fetchImpl, pageCard(cards).url, { userAgent })));
  let odd = 0;
  now.forEach((cards, i) => {
    if (!pages[i].ok) { count('stranica nije pročitana (pokušava se sljedeći put)'); return; }
    if (pages[i].value === null) { odd += 1; count('stranica nije u obliku upozorenja'); return; }
    const out = toNotice(cards, pages[i].value);
    if (out.skip) count(out.skip);
    else notices.push(out.notice);
  });
  if (odd > 0 && odd === now.length) throw new Error(`nijedna pročitana stranica nije u obliku upozorenja (${odd}) — format se promijenio?`);
  return { notices, seen: rows.length, skipped };
}

module.exports = { name: NAME, prefix: PREFIX, country: COUNTRY, source: SOURCE, defaultUrl: LIST, fetchNotices, listRows, pageParts, toNotice, titleParts, dayOfSpanish, pageCard };
