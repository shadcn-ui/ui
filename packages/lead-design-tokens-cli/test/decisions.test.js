// test/decisions.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  parseDecisionReferences,
  parseDecisionsLog,
} from '../src/shared/decisions.js';

test('parseDecisionsLog: extracts all D## from markdown table rows', () => {
  const doc = `
Some prose.

| #   | Decision               |
|-----|------------------------|
| D1  | First decision         |
| D2  | Second decision        |
| D15 | Fifteenth              |

| D100 | A later one |
`;
  const ids = parseDecisionsLog(doc);
  assert.deepEqual([...ids].sort((a, b) => a - b), [1, 2, 15, 100]);
});

test('parseDecisionsLog: ignores non-table D## mentions', () => {
  const doc = `
Per [D1], we do X. In prose: D5 should not be parsed as a log entry.

| D7 | Real entry |
`;
  const ids = parseDecisionsLog(doc);
  assert.deepEqual([...ids].sort((a, b) => a - b), [7]);
});

test('parseDecisionReferences: single reference', () => {
  assert.deepEqual([...parseDecisionReferences('see [D1]')], [1]);
});

test('parseDecisionReferences: comma-separated list', () => {
  const ids = parseDecisionReferences('per [D1, D3, D7]');
  assert.deepEqual([...ids].sort((a, b) => a - b), [1, 3, 7]);
});

test('parseDecisionReferences: hyphen range', () => {
  const ids = parseDecisionReferences('see [D9-D11]');
  assert.deepEqual([...ids].sort((a, b) => a - b), [9, 10, 11]);
});

test('parseDecisionReferences: en-dash range', () => {
  const ids = parseDecisionReferences('see [D9–D11]');
  assert.deepEqual([...ids].sort((a, b) => a - b), [9, 10, 11]);
});

test('parseDecisionReferences: mixed comma and range', () => {
  const ids = parseDecisionReferences('per [D1, D3–D5, D7]');
  assert.deepEqual([...ids].sort((a, b) => a - b), [1, 3, 4, 5, 7]);
});

test('parseDecisionReferences: whitespace-free form', () => {
  const ids = parseDecisionReferences('[D1,D3]');
  assert.deepEqual([...ids].sort((a, b) => a - b), [1, 3]);
});

test('parseDecisionReferences: multiple references in one text', () => {
  const text = 'see [D1] and also [D5–D7] and [D10]';
  const ids = parseDecisionReferences(text);
  assert.deepEqual([...ids].sort((a, b) => a - b), [1, 5, 6, 7, 10]);
});

test('parseDecisionReferences: ignores non-D bracketed content', () => {
  const text = 'in [brackets] and [some text] and [D5]';
  const ids = parseDecisionReferences(text);
  assert.deepEqual([...ids], [5]);
});

test('parseDecisionReferences: malformed range (start>end) skipped silently', () => {
  // The CI step fails on unresolved, not on malformed ranges. This keeps
  // the parser forgiving; enforcement happens elsewhere.
  const ids = parseDecisionReferences('[D10-D5]');
  assert.deepEqual([...ids], []);
});

test('parseDecisionReferences: D## inside sentence text is ignored (must be bracketed)', () => {
  // This guards against false positives from narrative prose that happens
  // to mention D## without brackets.
  const ids = parseDecisionReferences('decision D5 is important');
  assert.deepEqual([...ids], []);
});
