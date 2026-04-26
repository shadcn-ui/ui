// test/import.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { importPaperSource } from '../src/commands/import.js';

async function setupProject() {
  const cwd = await mkdtemp(join(tmpdir(), 'lead-paper-import-'));
  await cp(join(process.cwd(), 'schemas'), join(cwd, 'schemas'), { recursive: true });
  await cp(join(process.cwd(), 'tokens', 'source'), join(cwd, 'tokens', 'source'), {
    recursive: true,
  });
  return cwd;
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf-8'));
}

test('importPaperSource snapshots the paper source and seeds authored files', async () => {
  const cwd = await setupProject();

  const result = await importPaperSource({ cwd });

  assert.equal(result.source, 'tokens/source/paper');
  assert.ok(result.files.some((file) => file.to === 'tokens.paper.json'));
  assert.ok(result.files.some((file) => file.to === 'sections/01-primitives.md'));
  assert.deepEqual(
    result.seeded.sort(),
    [
      'tokens/authored/approvedPairs.json',
      'tokens/authored/approvedPairs.schema.json',
      'tokens/authored/sourceExceptions.json',
      'tokens/authored/sourceExceptions.schema.json',
    ].sort()
  );

  const manifest = await readJson(join(cwd, 'tokens', 'raw', 'paper', '_manifest.json'));
  assert.equal(manifest.sourceKind, 'paper');
  assert.equal(manifest.destination, 'tokens/raw/paper');
  assert.ok(manifest.sources.every((source) => /^[a-f0-9]{64}$/.test(source.sha256)));

  const imported = await readJson(join(cwd, 'tokens', 'raw', 'paper', 'tokens.paper.json'));
  assert.equal(imported.modes.defaultDensity, 'snug');

  const exceptions = await readJson(join(cwd, 'tokens', 'authored', 'sourceExceptions.json'));
  assert.deepEqual(exceptions.exceptions, []);
});

test('importPaperSource refuses to overwrite unless force is set', async () => {
  const cwd = await setupProject();

  await importPaperSource({ cwd });
  await assert.rejects(() => importPaperSource({ cwd }), /Use --force to overwrite/);

  const result = await importPaperSource({ cwd, force: true });
  assert.ok(result.files.length > 0);
  assert.deepEqual(result.seeded, []);
});

test('importPaperSource rejects a schema-invalid paper source', async () => {
  const cwd = await setupProject();
  const paperPath = join(cwd, 'tokens', 'source', 'paper', 'tokens.paper.json');
  const paper = await readJson(paperPath);
  delete paper.typography;
  await writeFile(paperPath, `${JSON.stringify(paper, null, 2)}\n`);

  await assert.rejects(
    () => importPaperSource({ cwd }),
    /tokens\.paper\.json failed schema validation/
  );
});
