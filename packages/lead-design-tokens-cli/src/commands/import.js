// src/commands/import.js
// Implements: design-tokens import [--from paper|figma] [--source <path>] [--figma-export <path>] [--force]
// Spec: docs/cli-spec.md §2
//
// Two modes:
//   --from paper  (default; existing behavior)
//     1. Copy paper-authored token source into /tokens/raw/paper/
//     2. Validate tokens.paper.json before snapshotting
//     3. Seed /tokens/authored/ files if missing [D37]
//     4. Write _manifest.json with sha256 hashes
//
//   --from figma  (Lane 2 v1)
//     1. Read a local Figma variables JSON export from --figma-export <path>
//     2. Validate it parses through parseFigmaVariablesExport()
//     3. Write the validated raw artifact to /tokens/raw/figma/variables.raw.json
//     4. Write /tokens/raw/figma/_manifest.json with the source path + sha256
//     v1 does not call the Figma API directly — file-based input only.

import { createHash } from 'node:crypto';
import {
  access,
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { parseFlags } from '../shared/flags.js';
import { parseFigmaVariablesExport } from '../shared/figma-import.js';

const DEFAULT_SOURCE = 'tokens/source/paper';
const RAW_DEST = 'tokens/raw/paper';
const PAPER_SOURCE_FILE = 'tokens.paper.json';
const PAPER_SCHEMA = 'schemas/paperTokens.schema.json';

const FIGMA_RAW_DEST = 'tokens/raw/figma';
const FIGMA_RAW_FILE = 'variables.raw.json';

const AUTHORED_FILES = {
  'approvedPairs.json': {
    $description:
      'Designer-approved foreground/background pairs for contrast linting. Edit this file directly.',
    pairs: [
      {
        fg: 'semantic.foundation.content.default',
        bg: 'semantic.foundation.surface.0',
        textSize: 'normal',
        targetLevel: 'AA',
        usage: 'body text on default surface',
      },
      {
        fg: 'semantic.interactive.primary',
        bg: 'semantic.foundation.surface.1',
        textSize: 'normal',
        targetLevel: 'AA',
        usage: 'links and primary CTAs',
      },
    ],
  },
  'sourceExceptions.json': {
    $description:
      'Known temporary source-data exceptions. Keep empty unless a rule violation is intentionally tolerated.',
    exceptions: [],
  },
};

const AUTHORED_SCHEMAS = {
  'approvedPairs.schema.json': 'schemas/approvedPairs.schema.json',
  'sourceExceptions.schema.json': 'schemas/sourceExceptions.schema.json',
};

export async function run(argv) {
  const flags = parseFlags(argv, {
    from: { type: 'string', default: 'paper' },
    source: { type: 'string', default: DEFAULT_SOURCE },
    'figma-export': { type: 'string', default: null },
    force: { type: 'boolean', default: false },
  });

  if (flags.from === 'figma') {
    if (!flags['figma-export']) {
      throw new Error(
        "import --from figma requires --figma-export <path> to a local Figma variables JSON export."
      );
    }
    const result = await importFigmaExport({
      cwd: process.cwd(),
      exportPath: flags['figma-export'],
      force: flags.force,
    });
    console.log(
      `imported ${result.variableCount} variable(s) and ${result.collectionCount} collection(s) from ${result.source} into ${FIGMA_RAW_DEST}/.`
    );
    return 0;
  }

  if (flags.from !== 'paper') {
    throw new Error(
      `import: unknown --from "${flags.from}". Expected "paper" or "figma".`
    );
  }

  const result = await importPaperSource({
    cwd: process.cwd(),
    source: flags.source,
    force: flags.force,
  });

  const seededSummary =
    result.seeded.length > 0
      ? `seeded ${result.seeded.join(', ')}`
      : 'authored files already present';
  console.log(
    `imported ${result.files.length} file(s) from ${result.source} into ${RAW_DEST}/; ${seededSummary}.`
  );
  return 0;
}

/**
 * Import a local Figma variables JSON export into /tokens/raw/figma/.
 * v1: file-based input only; no direct Figma API calls.
 *
 * @param {object} opts
 * @param {string} [opts.cwd]
 * @param {string} opts.exportPath - path to a local Figma export JSON
 * @param {boolean} [opts.force]
 * @returns {Promise<{
 *   source: string,
 *   destination: string,
 *   variableCount: number,
 *   collectionCount: number,
 *   sha256: string,
 * }>}
 */
export async function importFigmaExport({
  cwd = process.cwd(),
  exportPath,
  force = false,
} = {}) {
  if (!exportPath) {
    throw new Error('importFigmaExport: exportPath is required.');
  }
  const sourceFullPath = resolve(cwd, exportPath);
  await assertFile(sourceFullPath, `figma export file not found: ${exportPath}`);

  let parsed;
  let bytes;
  try {
    bytes = await readFile(sourceFullPath);
    parsed = JSON.parse(bytes.toString('utf-8'));
  } catch (err) {
    throw new Error(
      `figma export "${exportPath}" is not valid JSON: ${err.message}`
    );
  }

  // Validate by parsing through the shared shape parser. Throws on bad shape.
  const raw = parseFigmaVariablesExport(parsed);

  const destDir = resolve(cwd, FIGMA_RAW_DEST);
  const destFile = resolve(destDir, FIGMA_RAW_FILE);
  if (await exists(destFile) && !force) {
    throw new Error(
      `raw figma snapshot already exists at ${FIGMA_RAW_DEST}/${FIGMA_RAW_FILE}. Use --force to overwrite.`
    );
  }

  await mkdir(destDir, { recursive: true });
  // Write deterministic JSON with stable key order (parseFigmaVariablesExport
  // already sorts variables/collections by id).
  await writeFile(
    destFile,
    `${JSON.stringify(raw, null, 2)}\n`,
    'utf-8'
  );

  const sourceHash = sha256(bytes);
  const manifest = {
    importedAt: new Date().toISOString(),
    sourceKind: 'figma',
    source: relative(cwd, sourceFullPath),
    destination: `${FIGMA_RAW_DEST}/${FIGMA_RAW_FILE}`,
    sourceSha256: sourceHash,
    variableCount: raw.variables.length,
    collectionCount: raw.collections.length,
  };
  await writeFile(
    resolve(destDir, '_manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf-8'
  );

  return {
    source: relative(cwd, sourceFullPath),
    destination: `${FIGMA_RAW_DEST}/${FIGMA_RAW_FILE}`,
    variableCount: raw.variables.length,
    collectionCount: raw.collections.length,
    sha256: sourceHash,
  };
}

/**
 * Snapshot the paper-authored source bundle into /tokens/raw/paper.
 *
 * @param {object} opts
 * @param {string} [opts.cwd]
 * @param {string} [opts.source]
 * @param {boolean} [opts.force]
 * @returns {Promise<{source: string, files: Array, seeded: Array<string>}>}
 */
export async function importPaperSource({
  cwd = process.cwd(),
  source = DEFAULT_SOURCE,
  force = false,
} = {}) {
  const sourcePath = resolve(cwd, source);
  const destPath = resolve(cwd, RAW_DEST);
  const paperSourcePath = resolve(sourcePath, PAPER_SOURCE_FILE);

  await assertDirectory(sourcePath, `paper source directory not found: ${source}`);
  await assertFile(paperSourcePath, `missing required paper source file: ${source}/${PAPER_SOURCE_FILE}`);
  await validatePaperSource(cwd, paperSourcePath);

  if (await exists(destPath)) {
    if (!force) {
      throw new Error(`raw paper snapshot already exists at ${RAW_DEST}. Use --force to overwrite.`);
    }
    await rm(destPath, { recursive: true, force: true });
  }

  await mkdir(destPath, { recursive: true });
  const sourceFiles = await listFiles(sourcePath);
  const manifestSources = [];

  for (const fullSourceFile of sourceFiles) {
    const rel = relative(sourcePath, fullSourceFile);
    const to = resolve(destPath, rel);
    await mkdir(dirname(to), { recursive: true });
    await copyFile(fullSourceFile, to);
    const bytes = await readFile(fullSourceFile);
    manifestSources.push({
      from: relative(cwd, fullSourceFile),
      to: rel,
      sha256: sha256(bytes),
    });
  }

  const manifest = {
    importedAt: new Date().toISOString(),
    sourceKind: 'paper',
    source: relative(cwd, sourcePath),
    destination: RAW_DEST,
    sources: manifestSources,
  };
  await writeFile(resolve(destPath, '_manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  const seeded = await seedAuthoredFiles(cwd);

  return {
    source: relative(cwd, sourcePath),
    files: manifestSources,
    seeded,
  };
}

async function validatePaperSource(cwd, paperSourcePath) {
  let parsed;
  try {
    parsed = JSON.parse(await readFile(paperSourcePath, 'utf-8'));
  } catch (err) {
    throw new Error(`${PAPER_SOURCE_FILE} is not valid JSON: ${err.message}`);
  }

  const schema = JSON.parse(await readFile(resolve(cwd, PAPER_SCHEMA), 'utf-8'));
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  if (!validate(parsed)) {
    const errors = validate.errors
      .map((e) => `  - ${e.instancePath || '(root)'}: ${e.message}`)
      .join('\n');
    throw new Error(`${PAPER_SOURCE_FILE} failed schema validation:\n${errors}`);
  }
}

async function seedAuthoredFiles(cwd) {
  const authoredPath = resolve(cwd, 'tokens/authored');
  await mkdir(authoredPath, { recursive: true });
  const seeded = [];

  for (const [filename, contents] of Object.entries(AUTHORED_FILES)) {
    const out = resolve(authoredPath, filename);
    if (await exists(out)) continue;
    await writeFile(out, `${JSON.stringify(contents, null, 2)}\n`);
    seeded.push(`tokens/authored/${filename}`);
  }

  for (const [filename, schemaPath] of Object.entries(AUTHORED_SCHEMAS)) {
    const out = resolve(authoredPath, filename);
    if (await exists(out)) continue;
    await copyFile(resolve(cwd, schemaPath), out);
    seeded.push(`tokens/authored/${filename}`);
  }

  return seeded;
}

async function listFiles(root) {
  const out = [];
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue;
    const full = resolve(root, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await listFiles(full)));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out.sort();
}

async function assertDirectory(path, message) {
  try {
    const s = await stat(path);
    if (!s.isDirectory()) throw new Error(message);
  } catch {
    throw new Error(message);
  }
}

async function assertFile(path, message) {
  try {
    const s = await stat(path);
    if (!s.isFile()) throw new Error(message);
  } catch {
    throw new Error(message);
  }
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}
