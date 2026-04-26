#!/usr/bin/env node
// scripts/validate-schemas.js
// Sanity check that our authored-tier JSON Schemas are themselves well-formed
// and that the example fixtures in this script validate against them.
// Run via: npm run lint:schemas
//
// Not a substitute for check-exceptions (which validates real user data) —
// this is a meta-check to catch regressions when someone edits a schema file.

import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const cases = [
  {
    schema: 'schemas/paperTokens.schema.json',
    valid: [
      {
        version: '0.1.0',
        modes: {
          theme: ['light'],
          density: ['comfortable', 'snug', 'compact'],
          defaultDensity: 'snug',
        },
        primitives: {
          colors: {
            grey: {
              0: { $value: '#FFFFFF', $type: 'color' },
            },
          },
          numbers: {
            2: { $value: 2, $type: 'number' },
          },
        },
        semantic: {
          foundation: {},
          feedback: {},
          interactive: {},
        },
        spacing: {
          gap: {},
          padding: {},
        },
        radius: {},
        typography: {
          roles: {},
          sizes: {},
          lineHeights: {},
        },
      },
    ],
    invalid: [
      // missing required typography block
      {
        version: '0.1.0',
        modes: { theme: ['light'], density: ['snug'], defaultDensity: 'snug' },
        primitives: { colors: {}, numbers: {} },
        semantic: { foundation: {}, feedback: {}, interactive: {} },
        spacing: { gap: {}, padding: {} },
        radius: {},
      },
      // invalid default density
      {
        version: '0.1.0',
        modes: { theme: ['light'], density: ['snug'], defaultDensity: 'dense' },
        primitives: { colors: {}, numbers: {} },
        semantic: { foundation: {}, feedback: {}, interactive: {} },
        spacing: { gap: {}, padding: {} },
        radius: {},
        typography: { roles: {}, sizes: {}, lineHeights: {} },
      },
    ],
  },
  {
    schema: 'schemas/sourceExceptions.schema.json',
    valid: [
      {
        exceptions: [],
      },
      {
        $description: 'demo',
        exceptions: [
          {
            tokenPath: 'typography.sizes.caption-sm',
            rule: 'L5-size-floor',
            reason: '11px in source',
            resolvedBy: '2026-Q2',
          },
          {
            tokenPath: 'typography.roles.body-sm',
            rule: 'L7-weight-mismatch',
            reason: 'leading vs no-leading',
            resolvedBy: '2026-06-30',
            tiebreak: 'leading',
          },
        ],
      },
    ],
    invalid: [
      // L7 without tiebreak
      {
        exceptions: [
          {
            tokenPath: 'typography.roles.body-sm',
            rule: 'L7-weight-mismatch',
            reason: 'x',
            resolvedBy: '2026-Q2',
          },
        ],
      },
      // L5 with tiebreak
      {
        exceptions: [
          {
            tokenPath: 'typography.sizes.caption-sm',
            rule: 'L5-size-floor',
            reason: 'x',
            resolvedBy: '2026-Q2',
            tiebreak: 'leading',
          },
        ],
      },
      // unknown rule
      {
        exceptions: [
          {
            tokenPath: 'typography.sizes.caption-sm',
            rule: 'L99-made-up',
            reason: 'x',
            resolvedBy: '2026-Q2',
          },
        ],
      },
      // malformed date
      {
        exceptions: [
          {
            tokenPath: 'typography.sizes.caption-sm',
            rule: 'L5-size-floor',
            reason: 'x',
            resolvedBy: 'sometime',
          },
        ],
      },
    ],
  },
  {
    schema: 'schemas/approvedPairs.schema.json',
    valid: [
      { pairs: [] },
      {
        pairs: [
          {
            fg: 'semantic.foundation.content.default',
            bg: 'semantic.foundation.surface.0',
            textSize: 'normal',
            targetLevel: 'AA',
            usage: 'body text on default surface',
          },
          {
            fg: 'semantic.feedback.alert',
            bg: 'semantic.foundation.surface.1',
            textSize: 'non-text',
            targetLevel: 'AA',
            usage: 'alert icon',
          },
        ],
      },
    ],
    invalid: [
      // missing required textSize
      {
        pairs: [
          {
            fg: 'semantic.foundation.content.default',
            bg: 'semantic.foundation.surface.0',
            targetLevel: 'AA',
            usage: 'x',
          },
        ],
      },
      // invalid enum for textSize
      {
        pairs: [
          {
            fg: 'semantic.foundation.content.default',
            bg: 'semantic.foundation.surface.0',
            textSize: 'huge',
            targetLevel: 'AA',
            usage: 'x',
          },
        ],
      },
      // invalid enum for targetLevel
      {
        pairs: [
          {
            fg: 'semantic.foundation.content.default',
            bg: 'semantic.foundation.surface.0',
            textSize: 'normal',
            targetLevel: 'A',
            usage: 'x',
          },
        ],
      },
    ],
  },
];

let failures = 0;

for (const { schema: schemaPath, valid, invalid } of cases) {
  const fullPath = resolve(repoRoot, schemaPath);
  let schema;
  try {
    schema = JSON.parse(await readFile(fullPath, 'utf-8'));
  } catch (err) {
    console.error(`FAIL  ${schemaPath}: cannot read or parse — ${err.message}`);
    failures++;
    continue;
  }

  let validate;
  try {
    validate = ajv.compile(schema);
  } catch (err) {
    console.error(`FAIL  ${schemaPath}: schema is itself invalid — ${err.message}`);
    failures++;
    continue;
  }

  console.log(`\n${schemaPath}`);

  for (const [i, fixture] of valid.entries()) {
    if (validate(fixture)) {
      console.log(`  OK    valid fixture #${i + 1} accepted`);
    } else {
      console.error(`  FAIL  valid fixture #${i + 1} rejected:`);
      for (const e of validate.errors) {
        console.error(`          ${e.instancePath || '(root)'}: ${e.message}`);
      }
      failures++;
    }
  }

  for (const [i, fixture] of invalid.entries()) {
    if (!validate(fixture)) {
      console.log(`  OK    invalid fixture #${i + 1} rejected`);
    } else {
      console.error(`  FAIL  invalid fixture #${i + 1} accepted (should have been rejected)`);
      failures++;
    }
  }
}

console.log('');
if (failures > 0) {
  console.error(`${failures} schema check(s) failed.`);
  process.exit(1);
}
console.log('All schema checks passed.');
