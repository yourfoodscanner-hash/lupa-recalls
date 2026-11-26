'use strict';
/**
 * The last step of the scheduled job: after the file is published, fail the run when a source has
 * not been readable for three days or more — GitHub then sends its "run failed" e-mail, so a
 * source that has gone silent is noticed by a person, not only by the app's "data not updated".
 * (A single bad day is only a warning: the previous notices are kept.)
 */
const fs = require('fs');
const path = require('path');

const LIMIT_DAYS = 3;

function unhealthy(state, today) {
  const out = [];
  for (const [name, since] of Object.entries((state && state.failing) || {})) {
    const days = Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${since}T00:00:00Z`)) / 86400000);
    if (days >= LIMIT_DAYS - 1) out.push({ name, since, days: days + 1 });
  }
  return out;
}

if (require.main === module) {
  let state = null;
  try { state = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'state', 'last-run.json'), 'utf8')); } catch { /* no state yet */ }
  const bad = unhealthy(state, new Date().toISOString().slice(0, 10));
  if (bad.length > 0) {
    for (const b of bad) console.error(`::error::Izvor „${b.name}” nije pročitan ${b.days} dana zaredom (od ${b.since}). Fajl je objavljen s njegovim starim obavijestima; provjeri izvor (node tools/probe.js ${b.name}).`);
    process.exitCode = 1;
  } else {
    console.log('Svi izvori su pročitani (ili je ispad kraći od 3 dana).');
  }
}

module.exports = { unhealthy, LIMIT_DAYS };
