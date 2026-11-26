'use strict';
/**
 * GS1 product codes (GTIN): EAN-8, UPC-A (12), EAN-13, GTIN-14 — the numbers under a barcode.
 * The last digit is a check digit: from the right, the digits before it are weighted 3, 1, 3, 1 …;
 * the weighted sum plus the check digit is a multiple of ten. The same rule as the app's (lib/gtin.ts).
 */
const LENGTHS = [8, 12, 13, 14];

function isValidGtin(code) {
  if (typeof code !== 'string' || !LENGTHS.includes(code.length) || !/^[0-9]+$/.test(code)) return false;
  let sum = 0;
  for (let i = code.length - 2, weight = 3; i >= 0; i--, weight = 4 - weight) sum += (code.charCodeAt(i) - 48) * weight;
  return (10 - (sum % 10)) % 10 === code.charCodeAt(code.length - 1) - 48;
}

/** Every valid GTIN found in a text or a list ("3017620422003 3017620425035", [3017620422003]) — each once, in order. */
function gtinsIn(value) {
  const text = Array.isArray(value) ? value.join(' ') : value === null || value === undefined ? '' : String(value);
  const out = [];
  for (const m of text.matchAll(/(?<![0-9])[0-9]{8,14}(?![0-9])/g)) {
    if (isValidGtin(m[0]) && !out.includes(m[0])) out.push(m[0]);
  }
  return out;
}

/**
 * Numbers that are NOT one product's own, although they are valid GTINs: GS1 sets them aside for
 * shops and companies to give out themselves ("restricted circulation") — typically for goods sold
 * by weight. The same number means a different product in every shop, so the app must never warn
 * on one, and the job never publishes one. The same rule as the app's (lib/gtin.ts — isShopNumber).
 *
 *   GS1 prefix 020–029, 040–049, 200–299   numbers a shop or a company assigns itself
 *              050–059, 980–984, 990–999   coupons and refund receipts
 *   EAN-8 beginning with 0 or 2            the same, among the short numbers
 */
function isShopNumber(code) {
  if (!isValidGtin(code)) return false;
  const full = code.padStart(14, '0');
  if (full.startsWith('000000')) return full[6] === '0' || full[6] === '2';
  const prefix = Number(full.slice(1, 4));
  return (prefix >= 20 && prefix <= 29) || (prefix >= 40 && prefix <= 59) || (prefix >= 200 && prefix <= 299)
    || (prefix >= 980 && prefix <= 984) || prefix >= 990;
}

module.exports = { isValidGtin, isShopNumber, gtinsIn };
