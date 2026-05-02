// test/import-figma.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { importFigmaExport } from '../src/commands/import.js';
import { parseFigmaVariablesExport } from '../src/shared/figma-import.js';

const FIXTURE_PATH = new URL(
  './fixtures/figma-variables.fixture.json',
  import.meta.url
).pathname;

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf-8'));
}

async function setupCwdWithFixture() {
  const cwd = await mkdtemp(join(tmpdir(), 'lead-figma-import-'));
  await mkdir(join(cwd, 'input'), { recursive: true });
  const fixtureBytes = await readFile(FIXTURE_PATH);
  await writeFile(join(cwd, 'input', 'figma-export.json'), fixtureBytes);
  return cwd;
}

// --- parseFigmaVariablesExport (pure) ---

test('parseFigmaVariablesExport: accepts a full API response with `meta` wrapper', async () => {
  const fixture = await readJson(FIXTURE_PATH);
  const raw = parseFigmaVariablesExport(fixture);
  assert.equal(raw.importedKind, 'figma');
  assert.equal(raw.collections.length, 2);
  assert.equal(raw.variables.length, 5);
});

test('parseFigmaVariablesExport: accepts a bare meta object (no wrapper)', async () => {
  const fixture = await readJson(FIXTURE_PATH);
  const raw = parseFigmaVariablesExport(fixture.meta);
  assert.equal(raw.variables.length, 5);
});

test('parseFigmaVariablesExport: sorts collections and variables by id deterministically', async () => {
  const fixture = await readJson(FIXTURE_PATH);
  const raw = parseFigmaVariablesExport(fixture);
  const ids = raw.variables.map((v) => v.id);
  assert.deepEqual(
    ids,
    [...ids].sort((a, b) => a.localeCompare(b))
  );
  const collIds = raw.collections.map((c) => c.id);
  assert.deepEqual(
    collIds,
    [...collIds].sort((a, b) => a.localeCompare(b))
  );
});

test('parseFigmaVariablesExport: throws on non-object input', () => {
  assert.throws(() => parseFigmaVariablesExport(null), /expected a JSON object/);
  assert.throws(() => parseFigmaVariablesExport([]), /expected a JSON object/);
  assert.throws(() => parseFigmaVariablesExport('x'), /expected a JSON object/);
});

test('parseFigmaVariablesExport: throws on missing variables', () => {
  assert.throws(
    () =>
      parseFigmaVariablesExport({
        meta: { variableCollections: { 'C:1': {} } },
      }),
    /missing or invalid `meta\.variables`/
  );
});

test('parseFigmaVariablesExport: throws on missing variableCollections', () => {
  assert.throws(
    () => parseFigmaVariablesExport({ meta: { variables: {} } }),
    /missing or invalid `meta\.variableCollections`/
  );
});

test('parseFigmaVariablesExport: throws when a variable references an unknown collection', async () => {
  const fixture = await readJson(FIXTURE_PATH);
  const broken = JSON.parse(JSON.stringify(fixture));
  broken.meta.variables['VariableID:1:5'].variableCollectionId =
    'VariableCollectionId:does-not-exist';
  assert.throws(
    () => parseFigmaVariablesExport(broken),
    /references unknown collection "VariableCollectionId:does-not-exist"/
  );
});

test('parseFigmaVariablesExport: throws when a variable has no value for the default mode', async () => {
  const fixture = await readJson(FIXTURE_PATH);
  const broken = JSON.parse(JSON.stringify(fixture));
  broken.meta.variables['VariableID:1:5'].valuesByMode = {};
  assert.throws(
    () => parseFigmaVariablesExport(broken),
    /has no value for defaultModeId "1:0"/
  );
});

test('parseFigmaVariablesExport: throws when there are zero collections or variables', () => {
  assert.throws(
    () =>
      parseFigmaVariablesExport({
        meta: { variables: {}, variableCollections: {} },
      }),
    /zero variable collections/
  );
});

// --- importFigmaExport (I/O) ---

test('importFigmaExport: writes a deterministic raw artifact + manifest', async () => {
  const cwd = await setupCwdWithFixture();

  const result = await importFigmaExport({
    cwd,
    exportPath: 'input/figma-export.json',
  });

  assert.equal(result.variableCount, 5);
  assert.equal(result.collectionCount, 2);
  assert.equal(result.destination, 'tokens/raw/figma/variables.raw.json');
  assert.match(result.sha256, /^[a-f0-9]{64}$/);

  const raw = await readJson(
    join(cwd, 'tokens', 'raw', 'figma', 'variables.raw.json')
  );
  assert.equal(raw.importedKind, 'figma');
  assert.equal(raw.variables.length, 5);
  // Variables sorted by id (deterministic).
  const ids = raw.variables.map((v) => v.id);
  assert.deepEqual(
    ids,
    [...ids].sort((a, b) => a.localeCompare(b))
  );

  const manifest = await readJson(
    join(cwd, 'tokens', 'raw', 'figma', '_manifest.json')
  );
  assert.equal(manifest.sourceKind, 'figma');
  assert.equal(manifest.variableCount, 5);
  assert.equal(manifest.collectionCount, 2);
  assert.match(manifest.sourceSha256, /^[a-f0-9]{64}$/);
});

test('importFigmaExport: refuses to overwrite unless force is set', async () => {
  const cwd = await setupCwdWithFixture();

  await importFigmaExport({ cwd, exportPath: 'input/figma-export.json' });

  await assert.rejects(
    () => importFigmaExport({ cwd, exportPath: 'input/figma-export.json' }),
    /Use --force to overwrite/
  );

  const result = await importFigmaExport({
    cwd,
    exportPath: 'input/figma-export.json',
    force: true,
  });
  assert.equal(result.variableCount, 5);
});

test('importFigmaExport: errors when the export file does not exist', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'lead-figma-import-'));
  await assert.rejects(
    () => importFigmaExport({ cwd, exportPath: 'nope.json' }),
    /figma export file not found/
  );
});

test('importFigmaExport: errors when the export is not valid JSON', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'lead-figma-import-'));
  await mkdir(join(cwd, 'input'), { recursive: true });
  await writeFile(join(cwd, 'input', 'broken.json'), '{ not json', 'utf-8');
  await assert.rejects(
    () => importFigmaExport({ cwd, exportPath: 'input/broken.json' }),
    /is not valid JSON/
  );
});

test('importFigmaExport: errors when the export has zero variables', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'lead-figma-import-'));
  await mkdir(join(cwd, 'input'), { recursive: true });
  await writeFile(
    join(cwd, 'input', 'empty.json'),
    JSON.stringify({
      meta: {
        variables: {},
        variableCollections: { 'C:1': {} },
      },
    }),
    'utf-8'
  );
  await assert.rejects(
    () => importFigmaExport({ cwd, exportPath: 'input/empty.json' }),
    /zero variable collections|zero variables|expected non-empty string/
  );
});
