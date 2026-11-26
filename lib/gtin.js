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

module.exports = { isValidGtin, gtinsIn };
