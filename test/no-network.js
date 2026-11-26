'use strict';
/**
 * Tests never touch the network. Every test file requires this first and calls verify() last.
 *
 * Why it exists: a build that is given no answer of its own asks the real register. Such a test
 * passes on a machine without a connection and fails on one with it — the first run on GitHub
 * failed exactly so. Here the real fetch is taken away for the whole file: a test that reaches for
 * it gets an error, and verify() fails the file on every machine alike.
 */
const test = require('node:test');
const assert = require('node:assert/strict');

const asked = [];
globalThis.fetch = async (url) => {
  asked.push(String(url));
  throw new Error(`a test asked the network for ${url}`);
};

/** The last test of a file: nothing before it reached for the network. */
const verify = () => test('no test reached for the network', () => assert.deepEqual(asked, []));

module.exports = { verify };
