// src/shared/flags.js
// Thin wrapper around node's built-in util.parseArgs. Each command declares
// its flags; unknown flags throw. No positional args yet — we'll add them
// if a command needs them.

import { parseArgs } from 'node:util';

/**
 * @param {string[]} argv - raw argv for this command (already sliced past the command name)
 * @param {Record<string, { type: 'string' | 'boolean', default?: any, short?: string }>} spec
 * @returns {Record<string, any>}
 */
export function parseFlags(argv, spec) {
  const options = {};
  for (const [name, cfg] of Object.entries(spec)) {
    options[name] = { type: cfg.type };
    if (cfg.short) options[name].short = cfg.short;
  }

  let parsed;
  try {
    parsed = parseArgs({ args: argv, options, allowPositionals: false });
  } catch (err) {
    throw new Error(`invalid flags: ${err.message}`);
  }

  const result = {};
  for (const [name, cfg] of Object.entries(spec)) {
    result[name] = parsed.values[name] ?? cfg.default;
  }
  return result;
}
