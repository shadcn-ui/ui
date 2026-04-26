// src/commands/check-decisions.js
// Implements: design-tokens check-decisions
// Spec: docs/cli-spec.md §6.1 [D35]
//
// Validates:
//   1. Decisions log in DESIGN-DECISIONS.md is monotonic from D1 with no gaps.
//   2. Every [D##] reference across docs resolves to an entry in the log.
//
// Grammar (whitespace permitted around separators):
//   reference  := '[' WS? id-or-range (WS? ',' WS? id-or-range)* WS? ']'
//   id-or-range := 'D' digit+ (WS? ('–' | '-') WS? 'D'? digit+)?

import { readFile, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';

import { parseFlags } from '../shared/flags.js';
import { parseDecisionReferences, parseDecisionsLog } from '../shared/decisions.js';

const DECISIONS_DOC = 'DESIGN-DECISIONS.md';
const DEFAULT_SCAN_PATHS = [
  'DESIGN-DECISIONS.md',
  'DESIGN.md',
  'docs/cli-spec.md',
  'docs/', // recursively scanned below
];

/**
 * Run the check without touching argv. Exposed so it can be composed into
 * other stages or called from tests.
 *
 * @param {object} opts
 * @param {string} [opts.cwd] - Project root.
 * @returns {Promise<{ok: boolean, errors: Array<string>, stats: object}>}
 */
export async function checkDecisions({ cwd = process.cwd() } = {}) {
  const errors = [];

  // Step 1: Parse decisions log
  let logIds;
  try {
    const doc = await readFile(resolve(cwd, DECISIONS_DOC), 'utf-8');
    logIds = parseDecisionsLog(doc);
  } catch (err) {
    return { ok: false, errors: [`Could not read ${DECISIONS_DOC}: ${err.message}`], stats: {} };
  }

  // Step 2: Verify monotonic
  const sorted = [...logIds].sort((a, b) => a - b);
  const maxId = sorted[sorted.length - 1];
  const expected = Array.from({ length: maxId }, (_, i) => i + 1);
  const missing = expected.filter((n) => !logIds.has(n));
  if (missing.length > 0) {
    errors.push(`Decisions log has gaps: missing D${missing.join(', D')}`);
  }

  // Step 3: Scan all docs for [D##] references
  const files = await collectMarkdownFiles(cwd, DEFAULT_SCAN_PATHS);
  const referenced = new Set();
  for (const path of files) {
    const text = await readFile(path, 'utf-8');
    // Strip code blocks to avoid matching grammar examples
    const stripped = text.replace(/```[\s\S]*?```/g, '');
    for (const id of parseDecisionReferences(stripped)) {
      referenced.add(id);
    }
  }

  // Step 4: Unresolved references
  const unresolved = [...referenced].filter((id) => !logIds.has(id));
  if (unresolved.length > 0) {
    errors.push(
      `Unresolved decision references: D${unresolved.sort((a, b) => a - b).join(', D')}. ` +
      `Each reference must correspond to an entry in ${DECISIONS_DOC}.`
    );
  }

  const unused = [...logIds].filter((id) => !referenced.has(id)).sort((a, b) => a - b);

  return {
    ok: errors.length === 0,
    errors,
    stats: {
      logSize: logIds.size,
      maxId,
      referencesFound: referenced.size,
      unresolved: unresolved.length,
      unusedInformational: unused,
      filesScanned: files.length,
    },
  };
}

async function collectMarkdownFiles(cwd, paths) {
  const out = new Set();
  for (const p of paths) {
    const full = resolve(cwd, p);
    try {
      const stat = await readdir(full, { withFileTypes: true }).catch(() => null);
      if (stat) {
        // It's a directory
        for (const entry of stat) {
          if (entry.isFile() && entry.name.endsWith('.md')) {
            out.add(join(full, entry.name));
          }
        }
      } else if (p.endsWith('.md')) {
        out.add(full);
      }
    } catch {
      // skip missing
    }
  }
  return [...out];
}

export async function run(argv) {
  parseFlags(argv, {}); // no flags yet
  const result = await checkDecisions();

  console.log(
    `Decisions log: D1–D${result.stats.maxId} (${result.stats.logSize} entries) | ` +
    `${result.stats.referencesFound} references across ${result.stats.filesScanned} files`
  );
  if (result.stats.unusedInformational.length > 0) {
    console.log(
      `  unreferenced (informational): D${result.stats.unusedInformational.join(', D')}`
    );
  }

  if (!result.ok) {
    for (const e of result.errors) console.error(`FAIL: ${e}`);
    return 1;
  }

  console.log('OK');
  return 0;
}
