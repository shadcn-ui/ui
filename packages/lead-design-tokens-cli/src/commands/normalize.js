// src/commands/normalize.js
// Implements: design-tokens normalize [--from <kind>] [--input <path>] [--out <path>] [--force]
// Spec: docs/cli-spec.md §3
//
// v1 modes:
//
//   --from figma  (Lane 2 v1, default)
//     1. Read /tokens/raw/figma/variables.raw.json (or --input <path>).
//     2. Convert via normalizeFigmaVariables() into the nested-token shape
//        that `build` consumes.
//     3. Write the result to /tokens/normalized/tokens.json (or --out <path>)
//        as deterministic, sorted JSON.
//
//   --from paper  (NOT YET IMPLEMENTED)
//     Throws a clear error pointing at docs/cli-spec.md §3 — the paper
//     normalize path is documented but out of scope for Lane 2 v1.

import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { parseFlags } from '../shared/flags.js';
import { normalizeFigmaVariables } from '../shared/figma-normalize.js';

const FIGMA_DEFAULT_INPUT = 'tokens/raw/figma/variables.raw.json';
const FIGMA_DEFAULT_OUT = 'tokens/normalized/tokens.json';

export async function run(argv) {
  const flags = parseFlags(argv, {
    from: { type: 'string', default: 'figma' },
    input: { type: 'string', default: null },
    out: { type: 'string', default: null },
    force: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
  });

  if (flags.from === 'paper') {
    throw new Error(
      "normalize --from paper is not yet implemented. See docs/cli-spec.md §3 for the paper normalize contract."
    );
  }

  if (flags.from !== 'figma') {
    throw new Error(
      `normalize: unknown --from "${flags.from}". Expected "figma" or "paper".`
    );
  }

  const result = await normalizeFigmaArtifact({
    cwd: process.cwd(),
    input: flags.input ?? FIGMA_DEFAULT_INPUT,
    out: flags.out ?? FIGMA_DEFAULT_OUT,
    force: flags.force,
    dryRun: flags['dry-run'],
  });

  if (result.dryRun) {
    console.log(
      `normalize (dry-run): would write ${result.tokenCount} token(s) to ${result.outRelative}.`
    );
  } else {
    console.log(
      `normalize: wrote ${result.tokenCount} token(s) -> ${result.outRelative}.`
    );
  }
  return 0;
}

/**
 * Read a raw figma artifact and write the normalized token tree.
 *
 * @param {object} opts
 * @param {string} [opts.cwd]
 * @param {string} [opts.input]
 * @param {string} [opts.out]
 * @param {boolean} [opts.force]
 * @param {boolean} [opts.dryRun]
 * @returns {Promise<{
 *   inputRelative: string,
 *   outRelative: string,
 *   tokenCount: number,
 *   dryRun: boolean,
 *   tree: Record<string, unknown>,
 * }>}
 */
export async function normalizeFigmaArtifact({
  cwd = process.cwd(),
  input = FIGMA_DEFAULT_INPUT,
  out = FIGMA_DEFAULT_OUT,
  force = false,
  dryRun = false,
} = {}) {
  const inputPath = resolve(cwd, input);
  const outPath = resolve(cwd, out);

  let raw;
  try {
    raw = JSON.parse(await readFile(inputPath, 'utf-8'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(
        `normalize: raw figma artifact not found at ${input}. Run \`design-tokens import --from figma --figma-export <path>\` first.`
      );
    }
    throw new Error(
      `normalize: raw figma artifact at ${input} is not valid JSON: ${err.message}`
    );
  }

  const tree = normalizeFigmaVariables(raw);
  const tokenCount = countLeaves(tree);

  if (!dryRun) {
    if (await pathExists(outPath) && !force) {
      throw new Error(
        `normalize: output already exists at ${out}. Use --force to overwrite.`
      );
    }
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, `${JSON.stringify(tree, null, 2)}\n`, 'utf-8');
  }

  return {
    inputRelative: input,
    outRelative: out,
    tokenCount,
    dryRun,
    tree,
  };
}

function countLeaves(node) {
  if (!isPlainObject(node)) return 1;
  let total = 0;
  for (const key of Object.keys(node)) {
    total += countLeaves(node[key]);
  }
  return total;
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

async function pathExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}
