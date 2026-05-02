// test/normalize-figma.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  normalizeFigmaVariables,
  rgbaToCss,
} from '../src/shared/figma-normalize.js';
import { parseFigmaVariablesExport } from '../src/shared/figma-import.js';
import { importFigmaExport } from '../src/commands/import.js';
import { normalizeFigmaArtifact } from '../src/commands/normalize.js';
import { run as runBuild } from '../src/commands/build.js';

const FIXTURE_PATH = new URL(
  './fixtures/figma-variables.fixture.json',
  import.meta.url
).pathname;

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf-8'));
}

// --- rgbaToCss (pure) ---

test('rgbaToCss: opaque rgb(1,1,1) -> #ffffff', () => {
  assert.equal(rgbaToCss({ r: 1, g: 1, b: 1, a: 1 }), '#ffffff');
});

test('rgbaToCss: opaque rgb(0,0,0) -> #000000', () => {
  assert.equal(rgbaToCss({ r: 0, g: 0, b: 0, a: 1 }), '#000000');
});

test('rgbaToCss: alpha < 1 emits rgba() with trimmed decimal', () => {
  assert.equal(
    rgbaToCss({ r: 0, g: 0, b: 0, a: 0.6 }),
    'rgba(0, 0, 0, 0.6)'
  );
});

test('rgbaToCss: missing alpha defaults to opaque', () => {
  assert.equal(rgbaToCss({ r: 1, g: 0, b: 0 }), '#ff0000');
});

test('rgbaToCss: throws on non-numeric channels', () => {
  assert.throws(
    () => rgbaToCss({ r: 'x', g: 0, b: 0, a: 1 }, 'broken/var'),
    /variable "broken\/var" has invalid COLOR value/
  );
});

// --- normalizeFigmaVariables (pure) ---

test('normalizeFigmaVariables: produces the nested shape `build` consumes', async () => {
  const fixture = await readJson(FIXTURE_PATH);
  const raw = parseFigmaVariablesExport(fixture);
  const tree = normalizeFigmaVariables(raw);

  assert.deepEqual(tree, {
    color: {
      surface: {
        default: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.6)',
      },
      text: {
        default: '#15161a',
      },
    },
    space: {
      '1': 4,
      '2': 8,
    },
  });
});

test('normalizeFigmaVariables: emits keys in sorted (deterministic) order', async () => {
  const fixture = await readJson(FIXTURE_PATH);
  const raw = parseFigmaVariablesExport(fixture);
  const tree = normalizeFigmaVariables(raw);

  // Top-level groups sorted alphabetically.
  assert.deepEqual(Object.keys(tree), ['color', 'space']);
  // Within color, sub-keys sorted alphabetically.
  assert.deepEqual(Object.keys(tree.color), ['surface', 'text']);
});

test('normalizeFigmaVariables: throws on unsupported resolvedType', () => {
  assert.throws(
    () =>
      normalizeFigmaVariables({
        variables: [
          {
            id: 'X',
            name: 'foo/bar',
            resolvedType: 'STRING',
            collectionId: 'C',
            defaultModeValue: 'hello',
          },
        ],
      }),
    /unsupported resolvedType "STRING"/
  );
});

test('normalizeFigmaVariables: throws on VARIABLE_ALIAS values', () => {
  assert.throws(
    () =>
      normalizeFigmaVariables({
        variables: [
          {
            id: 'X',
            name: 'foo/bar',
            resolvedType: 'COLOR',
            collectionId: 'C',
            defaultModeValue: { type: 'VARIABLE_ALIAS', id: 'V:1' },
          },
        ],
      }),
    /v1 does not resolve aliases yet/
  );
});

test('normalizeFigmaVariables: throws on empty path segments', () => {
  assert.throws(
    () =>
      normalizeFigmaVariables({
        variables: [
          {
            id: 'X',
            name: 'color//default',
            resolvedType: 'COLOR',
            collectionId: 'C',
            defaultModeValue: { r: 1, g: 1, b: 1, a: 1 },
          },
        ],
      }),
    /empty path segment/
  );
});

test('normalizeFigmaVariables: throws on zero variables', () => {
  assert.throws(
    () => normalizeFigmaVariables({ variables: [] }),
    /zero variables/
  );
});

test('normalizeFigmaVariables: throws on duplicate token names', () => {
  assert.throws(
    () =>
      normalizeFigmaVariables({
        variables: [
          {
            id: 'X1',
            name: 'color/x',
            resolvedType: 'COLOR',
            collectionId: 'C',
            defaultModeValue: { r: 1, g: 0, b: 0, a: 1 },
          },
          {
            id: 'X2',
            name: 'color/x',
            resolvedType: 'COLOR',
            collectionId: 'C',
            defaultModeValue: { r: 0, g: 1, b: 0, a: 1 },
          },
        ],
      }),
    /duplicate token name "color\/x"/
  );
});

// --- normalizeFigmaArtifact (I/O integration) ---

test('normalizeFigmaArtifact: import -> normalize round trips through default paths', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'lead-figma-norm-'));
  await mkdir(join(cwd, 'input'), { recursive: true });
  await writeFile(
    join(cwd, 'input', 'figma-export.json'),
    await readFile(FIXTURE_PATH)
  );

  await importFigmaExport({ cwd, exportPath: 'input/figma-export.json' });

  const result = await normalizeFigmaArtifact({ cwd });

  assert.equal(result.tokenCount, 5);
  assert.equal(result.outRelative, 'tokens/normalized/tokens.json');
  assert.equal(result.dryRun, false);

  const tree = await readJson(
    join(cwd, 'tokens', 'normalized', 'tokens.json')
  );
  assert.equal(tree.color.surface.default, '#ffffff');
  assert.equal(tree.color.surface.overlay, 'rgba(0, 0, 0, 0.6)');
  assert.equal(tree.space['1'], 4);
});

test('normalizeFigmaArtifact: errors clearly when raw artifact is missing', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'lead-figma-norm-'));
  await assert.rejects(
    () => normalizeFigmaArtifact({ cwd }),
    /raw figma artifact not found at tokens\/raw\/figma\/variables\.raw\.json.*Run `design-tokens import --from figma/s
  );
});

test('normalizeFigmaArtifact: errors when raw artifact is malformed JSON', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'lead-figma-norm-'));
  await mkdir(join(cwd, 'tokens', 'raw', 'figma'), { recursive: true });
  await writeFile(
    join(cwd, 'tokens', 'raw', 'figma', 'variables.raw.json'),
    '{ not json',
    'utf-8'
  );
  await assert.rejects(
    () => normalizeFigmaArtifact({ cwd }),
    /is not valid JSON/
  );
});

test('normalizeFigmaArtifact: refuses to overwrite without --force', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'lead-figma-norm-'));
  await mkdir(join(cwd, 'input'), { recursive: true });
  await writeFile(
    join(cwd, 'input', 'figma-export.json'),
    await readFile(FIXTURE_PATH)
  );
  await importFigmaExport({ cwd, exportPath: 'input/figma-export.json' });

  await normalizeFigmaArtifact({ cwd });
  await assert.rejects(
    () => normalizeFigmaArtifact({ cwd }),
    /Use --force to overwrite/
  );

  const result = await normalizeFigmaArtifact({ cwd, force: true });
  assert.equal(result.tokenCount, 5);
});

test('normalizeFigmaArtifact: --dry-run does not write but reports counts', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'lead-figma-norm-'));
  await mkdir(join(cwd, 'input'), { recursive: true });
  await writeFile(
    join(cwd, 'input', 'figma-export.json'),
    await readFile(FIXTURE_PATH)
  );
  await importFigmaExport({ cwd, exportPath: 'input/figma-export.json' });

  const result = await normalizeFigmaArtifact({ cwd, dryRun: true });
  assert.equal(result.dryRun, true);
  assert.equal(result.tokenCount, 5);

  // Output file must NOT have been written.
  await assert.rejects(
    () => readFile(join(cwd, 'tokens', 'normalized', 'tokens.json'), 'utf-8'),
    /ENOENT/
  );
});

// --- end-to-end: import -> normalize -> build ---

test('end-to-end: figma export -> import -> normalize -> build emits CSS', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'lead-figma-e2e-'));
  try {
    await mkdir(join(cwd, 'input'), { recursive: true });
    await writeFile(
      join(cwd, 'input', 'figma-export.json'),
      await readFile(FIXTURE_PATH)
    );

    await importFigmaExport({ cwd, exportPath: 'input/figma-export.json' });
    await normalizeFigmaArtifact({ cwd });

    const repoCwd = process.cwd();
    process.chdir(cwd);
    try {
      await runBuild([
        '--input',
        'tokens/normalized/tokens.json',
        '--out',
        'out/tokens.css',
      ]);
    } finally {
      process.chdir(repoCwd);
    }

    const css = await readFile(join(cwd, 'out', 'tokens.css'), 'utf-8');
    assert.match(css, /--lead-color-surface-default: #ffffff;/);
    assert.match(css, /--lead-color-surface-overlay: rgba\(0, 0, 0, 0\.6\);/);
    assert.match(css, /--lead-color-text-default: #15161a;/);
    assert.match(css, /--lead-space-1: 4;/);
    assert.match(css, /--lead-space-2: 8;/);
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});
