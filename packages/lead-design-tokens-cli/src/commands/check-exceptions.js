// src/commands/check-exceptions.js
// Implements: design-tokens check-exceptions [--json]
// Spec: docs/cli-spec.md §1.5
//
// Shared pre-stage consumed by both normalize and lint.
// Parses /tokens/authored/sourceExceptions.json once per pipeline run.

import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { parseFlags } from '../shared/flags.js';
import { resolveDeadline, isOverdue } from '../shared/dates.js';

const SCHEMA_PATH = 'schemas/sourceExceptions.schema.json';
const EXCEPTIONS_PATH = 'tokens/authored/sourceExceptions.json';

/**
 * Resolve the exception set. Exposed separately from `run` so normalize and
 * lint can call it directly without going through argv parsing.
 *
 * @param {object} opts
 * @param {string} [opts.cwd] - Project root. Defaults to process.cwd().
 * @param {Date} [opts.now] - Current time for overdue comparison. Defaults to new Date().
 *                            Useful for testing.
 * @returns {Promise<{exceptions: Array, warnings: Array}>}
 */
export async function resolveExceptions({ cwd = process.cwd(), now = new Date() } = {}) {
  const exceptionsPath = resolve(cwd, EXCEPTIONS_PATH);
  const schemaPath = resolve(cwd, SCHEMA_PATH);

  // Step 1: Expected state is that import seeded this file. Missing is
  //         defense-in-depth, not expected path. [D37]
  let raw;
  try {
    await access(exceptionsPath);
    raw = await readFile(exceptionsPath, 'utf-8');
  } catch {
    return {
      exceptions: [],
      warnings: [
        `sourceExceptions.json not found at ${EXCEPTIONS_PATH}. ` +
          `Expected to be seeded by 'import'. Returning empty exception set.`,
      ],
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`sourceExceptions.json is not valid JSON: ${err.message}`);
  }

  // Step 2: Schema validation
  const schema = JSON.parse(await readFile(schemaPath, 'utf-8'));
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  if (!validate(parsed)) {
    const errors = validate.errors
      .map((e) => `  - ${e.instancePath || '(root)'}: ${e.message}`)
      .join('\n');
    throw new Error(`sourceExceptions.json failed schema validation:\n${errors}`);
  }

  const entries = parsed.exceptions ?? [];

  // Step 3: Resolve deadlines to absolute instants in America/New_York
  const withDeadlines = entries.map((ex) => ({
    ...ex,
    resolvedByInstant: resolveDeadline(ex.resolvedBy),
  }));

  // Step 4: Check for duplicate (tokenPath, rule) pairs
  const seen = new Set();
  const duplicates = [];
  for (const ex of withDeadlines) {
    const key = `${ex.tokenPath}::${ex.rule}`;
    if (seen.has(key)) duplicates.push(key);
    seen.add(key);
  }
  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate (tokenPath, rule) pairs in sourceExceptions.json: ${duplicates.join(', ')}`
    );
  }

  // Step 5: Tag overdue
  const tagged = withDeadlines.map((ex) => ({
    ...ex,
    overdue: isOverdue(ex.resolvedByInstant, now),
  }));

  return { exceptions: tagged, warnings: [] };
}

export async function run(argv) {
  const flags = parseFlags(argv, {
    json: { type: 'boolean', default: false },
  });

  const { exceptions, warnings } = await resolveExceptions();

  if (flags.json) {
    console.log(JSON.stringify({ exceptions, warnings }, null, 2));
  } else {
    for (const w of warnings) console.warn(`WARN: ${w}`);
    console.log(`Resolved ${exceptions.length} exception(s).`);
    for (const ex of exceptions) {
      const status = ex.overdue ? ' [OVERDUE]' : '';
      console.log(`  ${ex.tokenPath}  rule=${ex.rule}  resolvedBy=${ex.resolvedBy}${status}`);
    }
  }
  return 0;
}
