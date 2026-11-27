'use strict';
/**
 * Reading the authorities' own pages and feeds, and the few things taken out of a notice's text.
 *
 * Pages and feeds become plain text (htmlToText, rssItems). From that text, three things are taken —
 * and ONLY where the text itself names them with a label ("EAN:", "lot", "rok trajanja" …):
 *
 *   labeledGtins   barcodes: whole numbers right after a barcode label, each with a valid check digit,
 *                  never a number a shop gives out itself (lib/gtin — isShopNumber)
 *   labeledLots    batches: the value right after a batch label — short, with a digit, not prose
 *   labeledDates   best-before dates: dates right after a date label
 *
 * Nothing is assembled from pieces and nothing unlabeled is taken: a number in the middle of a
 * sentence is not a barcode, and a wrongly read batch is worse than none (the notice itself, one tap
 * away in the app, has everything). When in doubt, the field stays empty.
 */
const { isValidGtin, isShopNumber } = require('./gtin');

// ── HTML and feeds ─────────────────────────────────────────────────────────────────────────────────
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '', ensp: ' ', emsp: ' ', thinsp: ' ',
  ndash: '–', mdash: '—', hellip: '…', bdquo: '„', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', sbquo: '‚', laquo: '«', raquo: '»',
  szlig: 'ß', auml: 'ä', ouml: 'ö', uuml: 'ü', Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', eacute: 'é', Eacute: 'É', egrave: 'è', agrave: 'à', aacute: 'á',
  iacute: 'í', oacute: 'ó', uacute: 'ú', ntilde: 'ñ', Ntilde: 'Ñ', ccedil: 'ç', ecirc: 'ê', ocirc: 'ô', acirc: 'â', icirc: 'î', ucirc: 'û',
  scaron: 'š', Scaron: 'Š', ccaron: 'č', Ccaron: 'Č', zcaron: 'ž', Zcaron: 'Ž', cacute: 'ć', Cacute: 'Ć', dstrok: 'đ', Dstrok: 'Đ',
  aelig: 'æ', AElig: 'Æ', oslash: 'ø', Oslash: 'Ø', aring: 'å', Aring: 'Å', euml: 'ë', iuml: 'ï', atilde: 'ã', otilde: 'õ', ograve: 'ò', ugrave: 'ù', igrave: 'ì',
  yacute: 'ý', Yacute: 'Ý', Aacute: 'Á', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', ecaron: 'ě', Ecaron: 'Ě', rcaron: 'ř', Rcaron: 'Ř', uring: 'ů', Uring: 'Ů',
  deg: '°', middot: '·', bull: '•', euro: '€', copy: '©', reg: '®', trade: '™', times: '×', micro: 'µ', frac12: '½',
};
/** "&#8222;Bär&#8220; &amp; &szlig;" → "„Bär“ & ß" (one pass: an escaped entity stays escaped once). */
function decodeEntities(text) {
  return String(text ?? '').replace(/&(#\d{1,7}|#x[0-9a-f]{1,6}|[a-z][a-z0-9]{1,8});/gi, (whole, name) => {
    if (name[0] === '#') {
      const code = name[1] === 'x' || name[1] === 'X' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
      return code > 0 && code <= 0x10FFFF && !(code >= 0xD800 && code <= 0xDFFF) ? String.fromCodePoint(code) : whole;
    }
    return Object.prototype.hasOwnProperty.call(ENTITIES, name) ? ENTITIES[name] : whole;
  });
}

const BLOCK = /<\/?(?:p|div|br|li|ul|ol|tr|table|thead|tbody|h[1-6]|dt|dd|dl|section|article|header|footer|blockquote|figure|figcaption|main|aside|nav|hr)\b[^>]*>/gi;
/** A page or a fragment of one → plain text: one line per block, spaces collapsed, no empty lines. */
function htmlToText(html) {
  const text = String(html ?? '')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|template|svg)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<(?:td|th)\b[^>]*>/gi, ' ')
    .replace(BLOCK, '\n')
    .replace(/<[^>]*>/g, ' ');
  return decodeEntities(text)
    .split('\n')
    .map((line) => line.replace(/[\s ​]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

/** One line of plain text: a fragment of HTML (or plain text) with every break and run of spaces made one space. */
const oneLine = (html) => htmlToText(html).replace(/\n/g, ' ').trim();

function tagText(xml, name) {
  const m = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i').exec(xml);
  if (!m) return null;
  const inner = m[1].trim();
  const cdata = /^<!\[CDATA\[([\s\S]*?)\]\]>$/.exec(inner);
  return cdata ? cdata[1] : decodeEntities(inner);
}
/**
 * The items of an RSS 2.0 feed: { title, link, guid, pubDate, description, content, categories }.
 * description and content are HTML as the feed gives it; title is plain text. Throws when the text
 * is not an RSS feed at all (an error page, a login page …) — never "no items".
 */
function rssItems(xml) {
  const text = String(xml ?? '');
  if (!/<rss\b[\s\S]*<channel\b/i.test(text)) throw new Error(`odgovor nije RSS feed (počinje s: ${JSON.stringify(text.slice(0, 60))})`);
  return [...text.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((m) => {
    const it = m[1];
    return {
      title: oneLine(tagText(it, 'title') ?? ''),
      link: (tagText(it, 'link') ?? '').trim(),
      guid: (tagText(it, 'guid') ?? '').trim(),
      pubDate: (tagText(it, 'pubDate') ?? '').trim(),
      description: tagText(it, 'description') ?? '',
      content: tagText(it, 'content:encoded') ?? '',
      categories: [...it.matchAll(/<category\b[^>]*>([\s\S]*?)<\/category>/gi)].map((c) => oneLine(c[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, '$1'))),
    };
  });
}

/** An instant (an RFC 822 date of a feed, an ISO time …) → the day it was where the authority is: "2026-11-26". */
function dayIn(value, timeZone) {
  const t = typeof value === 'number' ? value : Date.parse(String(value ?? ''));
  if (!Number.isFinite(t)) return null;
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(t));
  const get = (type) => parts.find((p) => p.type === type).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** "26.11.2026", "4. 7. 2028", "26.11.2026." → "2026-11-26"; anything else → null. */
function dayOfDotted(value) {
  const m = /^\s*(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4})\.?\s*$/.exec(String(value ?? ''));
  if (!m) return null;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (mo < 1 || mo > 12 || d < 1 || d > new Date(Date.UTC(y, mo, 0)).getUTCDate()) return null;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Text → a piece of an id: "261126_29_BY_Weißbier" → "261126-29-by-weissbier". */
function slug(text) {
  return String(text ?? '').replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/đ/g, 'd').replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
/** A stable id of at most 80 characters: prefix + slug; a slug too long is cut and given a short hash of the whole. */
function idOf(prefix, text) {
  const s = slug(text);
  if (s === '') return null;
  const room = 80 - prefix.length;
  if (s.length <= room) return prefix + s;
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return `${prefix}${s.slice(0, room - 8).replace(/-+$/, '')}-${h.toString(36).padStart(7, '0').slice(-7)}`;
}

/** A text cut to `max` characters at a word, with "…" — the same rule the app would apply, but at a word. */
function cut(text, max) {
  const s = String(text ?? '').trim();
  if (s.length <= max) return s;
  const head = s.slice(0, max - 1);
  const at = head.lastIndexOf(' ');
  return `${(at > max * 0.6 ? head.slice(0, at) : head).replace(/[\s,;:–-]+$/, '')}…`;
}

// ── Labeled values ─────────────────────────────────────────────────────────────────────────────────
/**
 * Lower case without accents, of EXACTLY the same length as the text: every position in the folded
 * text is the same position in the original, so a value found in the one is cut from the other.
 */
function alignedFold(text) {
  let out = '';
  for (const ch of String(text)) {
    let f = ch === 'ł' || ch === 'Ł' ? 'l' : ch.normalize('NFD')[0].toLowerCase();   // ł has no accent to take off
    if (f.length !== ch.length) f = ch.toLowerCase().length === ch.length ? ch.toLowerCase() : ch;
    out += f;
  }
  return out;
}

/** Words that name a barcode (folded): EAN, GTIN, bar kod, črtna koda, Strichcode, código de barras … */
const GTIN_LABEL = /(?<![a-z])(?:(?:ean|gtin|upc)(?:[- ]?(?:13|14|12|8)(?!\d))?(?:[- ]?(?:kod[a-z]*|koodi|code|codes|nummer|nr|number|broj[a-z]*|stevilk[a-z]*))?|bar[- ]?(?:kod|cod|code)[a-z]*|crtn[a-z]* kod[a-z]*|strichcode[a-z]*|codigos? de barras|code[- ]barres?|codice (?:ean|a barre)|stregkode[a-z]*|streckkod[a-z]*|carov[a-z]* kod[a-z]*|kod[a-z]* kreskow[a-z]*|vonalkod[a-z]*|viivakoodi[a-z]*|streepjescode[a-z]*|γραμμωτ[α-ω]* κωδικ[α-ως]*)(?![a-z])/g;
/** Between a label and its numbers, or between two numbers: punctuation, "i/und/and/…" — nothing else. */
const GTIN_RUN = /(?:[\s:#.,;/\-–()]|(?<![a-z])(?:i|und|and|et|y|e|ili|in|oder|or|ou|o|te|ter|sa|s|nr|br|no|og|och|eller|en|ja|oraz|es|on)(?![a-z])\.?|(?<![α-ω])(?:και|η)(?![α-ω]))*(\d{8,14})(?!\d)/y;

/** Barcodes the text names as such (see GTIN_LABEL), in order, each once. */
function labeledGtins(text) {
  const folded = alignedFold(text ?? '');
  const out = [];
  for (const label of folded.matchAll(GTIN_LABEL)) {
    GTIN_RUN.lastIndex = label.index + label[0].length;
    for (let m = GTIN_RUN.exec(folded); m; m = GTIN_RUN.exec(folded)) {
      const g = m[1];
      if (isValidGtin(g) && !isShopNumber(g) && !out.includes(g)) out.push(g);
    }
  }
  return out;
}

/** Words that name a batch (folded): lot, serija, šarža, Charge, Losnummer, lote, lotto, batch … */
const LOT_LABEL = /(?<![a-z])(?:(?:(?:broj[a-z]*|oznak[a-z]*|stevilk[a-z]*|numero(?: de)?|number|nummer)\s+)?(?:lot(?:a|om|u|e|ov|i)?|lotto|lote|lots|serij[a-z]*|sarz[a-z]*|charge(?:n(?:nummer)?)?|chargennr|batch(?:es)?(?: code)?|losnummer|los-?kennzeichnung|los-?nr|lotnummers?|lotnrs?|lotcodes?|batchnummers?|batchnr|productiecodes?|partinummer|partinr|parti(?=\s*(?:nr\.?\s*)?[:\d])|partijnummers?|partijcodes?|partij(?=\s*[:\d])|chargenummer|eranumero|eratunnus|era(?=\s*:)|(?:nr|numer) partii|partii(?=\s*:)|partia(?=\s*:)|tetelszam|gyartasi tetel|tetel(?=\s*:))(?:\s*\/\s*(?:lot|serija|serije)(?![a-z]))?(?:\s+(?:broj[a-z]*|br|nr|no|number|nummer|stevilk[a-z]*|codes?|numbers?)\.?)?|los(?=\s*:)|(?:αριθμο[ςυ]? )?παρτιδ[α-ως]*)(?![a-z])/g;
/** What ends a batch value: a new line or clause, or the start of another labeled value. */
const LOT_STOP = /\n|;|\s[–—\/]\s|,(?=\s|$)|,(?=\s*(?:[a-zα-ω]|$))|\s(?:i|und|and|ili|te|in|s|sa|z|mit|with|con|rok|roka|rokom|najbolje|upotrijebiti|upotrebiti|uporabno|porabiti|datum[a-z]*|mhd|mindesthaltbarkeit[a-z]*|verbrauch[a-z]*|ablauf[a-z]*|best|bbd|exp|fecha|da consumarsi|ean|gtin|bar|crtn[a-z]*|neto|tezin[a-z]*|pakiranj[a-z]*|zbog|zaradi|wegen|due|proizvod[a-z]*|izdelk[a-z]*|produkt[a-z]*|og|och|bedst|bast|sidste|holdbar[a-z]*|nettoindhold|stregkode|streckkod|datum|spotrebujte|minimaln[a-z]*|en|ten minste|tht|houdbaar[a-z]*|ja|parasta|viimeinen|oraz|data|najlepiej|termin|es|minosegmegorzesi|fogyaszthatosagi|lejarat[a-z]*|bb|exp|upc)(?![a-z])|\s+(?=[α-ωϊϋ])|\.(?=\s+\S|\s*$)|\(|\)/;
const LOT_VALUE = /^[A-Za-z0-9][A-Za-z0-9./:\-–_ ]{0,39}$/;
/** Right after a batch label, these words mean the batch was not given — a date was (folded). */
const DATE_WORD = /^(?:use|best|bbd|exp|mhd|tht|date|datum|rok)(?![a-z])/;
/** A value that begins with one of these words is the next labeled value, not another batch. */
const NOT_A_LOT = /^(?:rok|roka|rokom|najbolje|upotrijebiti|upotrebiti|uporabno|porabiti|datum|mhd|mindesthaltbarkeit|verbrauch|ablauf|best|bbd|exp|fecha|ean|gtin|upc|bar|crtn|neto|tezin|pakiranj|charge|lot|serij|bedst|bast|sidste|holdbar|stregkode|streckkod|houdbaar|tht|parasta|viimeinen|data|najlepiej|minosegmegorzesi|fogyaszthatosagi)(?![a-z])/;
/** One batch value: short, at least one digit, not a date alone, not a run of words. */
function lotValue(raw) {
  const v = raw.replace(/^[\s:#.\-–]+/, '').replace(/^(?:lot|batch)(?:\s*(?:nr|no)\.?)?[\s:#.]+(?=\S*\d)/i, '').replace(/[\s.:\-–\/]+$/, '').replace(/\s+/g, ' ');
  if (!LOT_VALUE.test(v) || !/\d/.test(v)) return null;
  if (v.split(' ').length > 4 || /[a-zčćšžđ]{5,}/i.test(v.replace(/[A-Z0-9]{5,}/g, ''))) return null;   // prose, not a code
  if (/^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}$/.test(v)) return null;                                     // a date, not a batch
  return v;
}

/** Batches the text names as such (see LOT_LABEL): "L233249A2", "2521, 2532" — in order, each once. */
function labeledLots(text) {
  const original = String(text ?? '');
  const folded = alignedFold(original);
  const out = [];
  for (const label of folded.matchAll(LOT_LABEL)) {
    let at = label.index + label[0].length;
    for (let guard = 0; guard < 12; guard++) {
      const rest = folded.slice(at, at + 80);
      const stop = LOT_STOP.exec(rest);
      const end = stop ? stop.index : rest.length;
      if (guard > 0 && NOT_A_LOT.test(folded.slice(at, at + 20))) break;
      if (guard === 0 && DATE_WORD.test(folded.slice(at, at + 24).replace(/^[\s:#.\-–]+/, ''))) break;   // "Batch code: Use by date: …" — no batch
      const value = lotValue(original.slice(at, at + end));
      if (value === null) break;
      if (!out.includes(value)) out.push(value);
      // another batch after "i", "und", ",", "/": the list goes on
      const next = /^\s*(?:,|\/|[–—]|i|und|and|ili|te|in|et|y|og|och|και|en|ja|oraz|es)\s+(?=[a-z0-9])/i.exec(folded.slice(at + end, at + end + 12));
      if (!next) break;
      at += end + next[0].length;
    }
  }
  return out;
}

/** Words that name a best-before or use-by date (folded). */
const DATE_LABEL = /(?<![a-z])(?:najbolje upotrijebiti do|najbolje upotrebiti do|upotrijebiti do|upotrebiti do|rok[a-z]* (?:trajanja|upotreb[a-z]*|valjanosti|uporab[a-z]*)|datum[a-z]* (?:minimalne trajnosti|najbolje upotreb[a-z]*|isteka roka)|uporabno najmanj do|porabiti do|mindesthaltbarkeitsdatum|mhd|verbrauchsdatum|zu verbrauchen bis|mindestens haltbar bis|ablaufdatum|best[- ]before(?:[- ]end)?(?:[- ]dates?)?|use[- ]by(?:[- ]dates?)?|best[- ]by(?:[- ]dates?)?|best if used by|bb(?=\s*[:.]?\s*\d)|expiration(?:[- ]dates?)?|exp(?:iry)?(?:[- ]dates?)?|fecha de (?:caducidad|consumo preferente)|da consumarsi (?:preferibilmente )?entro|bedst f(?:ø|oe|o)r|sidste anvendelsesdato|anvendes senest|mindst holdbar til|holdbarhedsdato|bast fore|sista forbrukningsdag|datum pouzitelnosti|datum minimalni trvanlivosti|minimalni trvanlivost(?: do)?|spotrebujte do|ημερομηνια (?:αναλωσης|ληξης)(?: κατα προτιμηση πριν(?: απο)?)?|αναλωση κατα προτιμηση πριν(?: απο)?|ten minste houdbaar tot|(?:minimale )?houdbaarheidsdatum|tht(?:-dat(?:um|a))?|te gebruiken tot|tgt(?:-datum)?|uiterste consumptiedatum|parasta ennen(?: -(?:merkin[a-z]*|paivay[a-z]*|paivamaar[a-z]*))?|viimeinen kayttopaiva|data minimalnej trwa[lł]osci|najlepiej spozyc przed(?: ko[nń]cem)?|na[lł]ezy spozyc do|termin przydatnosci do spozycia|minosegmegorzesi (?:idok?|hatarid(?:o|ok))|fogyaszthatosagi (?:idok?|hatarid(?:o|ok))|minoseget megorzi|lejarati (?:ido|datum))(?![a-z])/g;
const DATE = /^\s*["”'’)\]]*\s*(?:[:.\-–]\s*)?((?:\d{4}\.\s?\d{1,2}\.\s?\d{1,2}\.?)|(?:\d{1,2}\.\s?\d{1,2}\.\s?\d{2,4}\.?)|(?:\d{1,2}\/\d{1,2}\/\d{2,4})|(?:\d{1,2}\/\d{1,2}-\d{4})|(?:\d{4}-\d{2}-\d{2})|(?:\d{1,2}-\d{1,2}-\d{4})|(?:\d{1,2}-\d{1,2}-\d{2}(?!\d))|(?:\d{1,2}[./]\d{4})|(?:\d{1,2}-\d{4}))(?!\d)/;
/** "vanaf" / "from" / "od" … before the first date: what follows may be a range (folded). */
const DATE_FROM = /^\s*["”'’)\]]*\s*(?:[:\-–]\s*)?(?:vanaf|van|from|od|ab|von|alkaen|des|du|dal|desde)\s+(?=\d)/;
/** The end of such a range: "tot", "to", "do", "bis" … */
const DATE_TO = /^\s*(?:tot(?: en met)?|t\/m|to|till|until|bis|do|au|al|hasta|[-–—])\s+(?=\d)/;
/** Dates the text names as best-before / use-by dates, as written there: "20.03.2027.", "4. 7. 2028", "07-12-26 – 13-12-26" — in order, each once. */
function labeledDates(text) {
  const original = String(text ?? '');
  const folded = alignedFold(original);
  const out = [];
  const clean = (m) => m[1].replace(/\.$/, '').replace(/\s+/g, ' ');
  for (const label of folded.matchAll(DATE_LABEL)) {
    let at = label.index + label[0].length;
    for (let guard = 0; guard < 12; guard++) {
      const from = guard === 0 ? DATE_FROM.exec(folded.slice(at, at + 24)) : null;
      if (from) at += from[0].length;
      const m = DATE.exec(original.slice(at, at + 40));
      if (!m) break;
      let value = clean(m);
      at += m[0].length;
      // a range: "vanaf 07-12-26 tot 13-12-26" → "07-12-26 – 13-12-26"
      const to = from ? DATE_TO.exec(folded.slice(at, at + 16)) : null;
      const end = to ? DATE.exec(original.slice(at + to[0].length, at + to[0].length + 40)) : null;
      if (end) { value = `${value} – ${clean(end)}`; at += to[0].length + end[0].length; }
      else if (from) break;   // "from X" and an end that cannot be read: not a date to publish alone
      if (!out.includes(value)) out.push(value);
      const next = /^\s*(?:,|;|\/|&|i|und|and|ili|te|in|et|y|do|og|och|a|και|en|ja|oraz|es)\s+(?=\d)/i.exec(folded.slice(at, at + 12));
      if (!next) break;
      at += next[0].length;
    }
  }
  return out;
}

/**
 * The words after "zbog …" / "zaradi …" / "wegen …" — the notice's own words for why — up to the end of
 * that clause: "zbog utvrđene prisutnosti kikirikija koji nije označen na ambalaži." → "utvrđene prisutnosti
 * kikirikija koji nije označen na ambalaži". A comma inside brackets does not end the clause. null when
 * the text says no "because".
 */
function becauseClause(text, words = ['zbog', 'zaradi', 'wegen', 'radi']) {
  const original = String(text ?? '');
  const folded = alignedFold(original);
  const re = new RegExp(`(?<![a-z])(?:${words.join('|')})\\s+`, 'g');
  for (const m of folded.matchAll(re)) {
    const start = m.index + m[0].length;
    let depth = 0;
    let end = original.length;
    for (let i = start; i < original.length; i++) {
      const c = original[i];
      if (c === '(' || c === '[') depth++;
      else if ((c === ')' || c === ']') && depth > 0) depth--;
      else if (depth === 0 && (c === '\n' || c === ';' || (c === ',' && !/\d/.test(original[i - 1] ?? '') ) || (c === ',' && !/\d/.test(original[i + 1] ?? '')) || (c === '.' && /^(?:\s+[\p{Lu}"„“]|\s*$)/u.test(original.slice(i + 1, i + 3)) && !/(?:\b(?:br|tzv|npr|spp|sp|st|d\.o|o)|\d)$/i.test(original.slice(Math.max(start, i - 4), i))))) { end = i; break; }
    }
    const clause = original.slice(start, end).replace(/\s+/g, ' ').trim().replace(/[.:,\s]+$/, '');
    if (clause.length >= 4 && /\p{L}{3}/u.test(clause)) return clause;
  }
  return null;
}

/** The first sentence of a text (not cut at "spp." or "d.o.o."), at most `max` characters, cut at a word. */
function firstSentence(text, max = 160) {
  const s = String(text ?? '').replace(/\s+/g, ' ').trim();
  const m = /^.*?[.!?](?=\s+[\p{Lu}„"“(]|$)/u.exec(s);
  let out = m ? m[0] : s;
  while (/(?:\b(?:br|tzv|npr|spp|sp|st|d\.o|d\.d|z\.B|bzw|ca|inkl|Nr)\.|\d\.)$/.test(out) && out.length < s.length) {
    const more = /^.*?[.!?](?=\s+[\p{Lu}„"“(]|$)/u.exec(s.slice(out.length));
    out += more ? more[0] : s.slice(out.length);
  }
  return cut(out.replace(/\.$/, ''), max) || null;
}

/** The value right after a label up to the end of its line or clause: "blagovna znamka: S BUDGET; pakiranje …" → "S BUDGET". */
function labeledValue(text, labelPattern, max = 60) {
  const original = String(text ?? '');
  const folded = alignedFold(original);
  const m = new RegExp(`(?<![a-z])(?:${labelPattern})\\s*[:\\-–]?\\s*`).exec(folded);
  if (!m) return null;
  const start = m.index + m[0].length;
  const rest = original.slice(start, start + max + 1);
  const end = rest.search(/[;\n)]|,\s|\.\s|\s\(|\s\/\s|$/);
  const v = rest.slice(0, end).trim().replace(/^[„“"'‘’]+|[”“"'‘’.]+$/g, '').trim();
  return v.length >= 2 && v.length <= max ? v : null;
}

module.exports = { decodeEntities, htmlToText, oneLine, rssItems, dayIn, dayOfDotted, slug, idOf, cut, alignedFold, labeledGtins, labeledLots, labeledDates, becauseClause, labeledValue, firstSentence };
