// test/check-exceptions.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { resolveDeadline, isOverdue } from '../src/shared/dates.js';
import { resolveExceptions } from '../src/commands/check-exceptions.js';

// ---------- resolveDeadline ----------

test('resolveDeadline: YYYY-Q1 → last moment of March 31 ET', () => {
  const d = resolveDeadline('2026-Q1');
  // March 31, 2026 23:59:59.999 ET = April 1, 2026 03:59:59.999 UTC (DST active)
  const utcMonth = d.getUTCMonth(); // 3 = April
  const utcDate = d.getUTCDate();
  assert.equal(utcMonth, 3);
  assert.equal(utcDate, 1);
  assert.equal(d.getUTCHours(), 3);
  assert.equal(d.getUTCMinutes(), 59);
});

test('resolveDeadline: YYYY-Q2 → last moment of June 30 ET', () => {
  const d = resolveDeadline('2026-Q2');
  // June 30, 2026 23:59:59.999 ET = July 1, 2026 03:59:59.999 UTC
  assert.equal(d.getUTCMonth(), 6);
  assert.equal(d.getUTCDate(), 1);
});

test('resolveDeadline: YYYY-Q4 → last moment of December 31 ET', () => {
  const d = resolveDeadline('2025-Q4');
  // Dec 31, 2025 23:59:59.999 ET = Jan 1, 2026 04:59:59.999 UTC (EST, no DST)
  assert.equal(d.getUTCFullYear(), 2026);
  assert.equal(d.getUTCMonth(), 0);
  assert.equal(d.getUTCDate(), 1);
  assert.equal(d.getUTCHours(), 4);
});

test('resolveDeadline: YYYY-MM-DD → end of that day ET', () => {
  const d = resolveDeadline('2026-07-15');
  // Jul 15, 2026 23:59:59.999 ET = Jul 16 03:59:59.999 UTC (DST)
  assert.equal(d.getUTCMonth(), 6);
  assert.equal(d.getUTCDate(), 16);
  assert.equal(d.getUTCHours(), 3);
});

test('resolveDeadline: rejects malformed input', () => {
  assert.throws(() => resolveDeadline('2026'), /Invalid resolvedBy/);
  assert.throws(() => resolveDeadline('2026-Q5'), /Invalid resolvedBy/);
  assert.throws(() => resolveDeadline('not-a-date'), /Invalid resolvedBy/);
});

// ---------- isOverdue ----------

test('isOverdue: true when deadline is before now', () => {
  const deadline = new Date('2025-01-01T00:00:00Z');
  const now = new Date('2026-01-01T00:00:00Z');
  assert.equal(isOverdue(deadline, now), true);
});

test('isOverdue: false when deadline is after now', () => {
  const deadline = new Date('2027-01-01T00:00:00Z');
  const now = new Date('2026-01-01T00:00:00Z');
  assert.equal(isOverdue(deadline, now), false);
});

// ---------- resolveExceptions (end-to-end) ----------

async function setupProject(exceptionsContent) {
  const dir = await mkdtemp(join(tmpdir(), 'lead-tokens-test-'));
  await mkdir(join(dir, 'tokens', 'authored'), { recursive: true });
  await mkdir(join(dir, 'schemas'), { recursive: true });

  // Copy the real schema so the test validates against the canonical one
  const schemaSrc = join(process.cwd(), 'schemas', 'sourceExceptions.schema.json');
  await cp(schemaSrc, join(dir, 'schemas', 'sourceExceptions.schema.json'));

  if (exceptionsContent !== null) {
    await writeFile(
      join(dir, 'tokens', 'authored', 'sourceExceptions.json'),
      JSON.stringify(exceptionsContent, null, 2)
    );
  }
  return dir;
}

test('resolveExceptions: empty file → empty exception set', async () => {
  const cwd = await setupProject({ exceptions: [] });
  const result = await resolveExceptions({ cwd });
  assert.equal(result.exceptions.length, 0);
  assert.equal(result.warnings.length, 0);
});

test('resolveExceptions: missing file → empty set + warning (defense in depth)', async () => {
  const cwd = await setupProject(null);
  const result = await resolveExceptions({ cwd });
  assert.equal(result.exceptions.length, 0);
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /not found/);
});

test('resolveExceptions: valid L5 exception passes schema', async () => {
  const cwd = await setupProject({
    exceptions: [
      {
        tokenPath: 'typography.sizes.caption-sm',
        rule: 'L5-size-floor',
        reason: 'temporary paper source floor exception',
        resolvedBy: '2026-Q2',
      },
    ],
  });
  const result = await resolveExceptions({ cwd, now: new Date('2026-04-01T00:00:00Z') });
  assert.equal(result.exceptions.length, 1);
  assert.equal(result.exceptions[0].overdue, false);
});

test('resolveExceptions: L7 exception requires tiebreak', async () => {
  const cwd = await setupProject({
    exceptions: [
      {
        tokenPath: 'typography.roles.body-sm',
        rule: 'L7-weight-mismatch',
        reason: 'weight conflict',
        resolvedBy: '2026-Q2',
        // tiebreak missing
      },
    ],
  });
  await assert.rejects(() => resolveExceptions({ cwd }), /schema/i);
});

test('resolveExceptions: L5 exception forbids tiebreak', async () => {
  const cwd = await setupProject({
    exceptions: [
      {
        tokenPath: 'typography.sizes.caption-sm',
        rule: 'L5-size-floor',
        reason: 'below floor',
        resolvedBy: '2026-Q2',
        tiebreak: 'leading', // should not be allowed here
      },
    ],
  });
  await assert.rejects(() => resolveExceptions({ cwd }), /schema/i);
});

test('resolveExceptions: L7 with valid tiebreak passes', async () => {
  const cwd = await setupProject({
    exceptions: [
      {
        tokenPath: 'typography.roles.body-sm',
        rule: 'L7-weight-mismatch',
        reason: 'leading=Regular, no-leading=Medium',
        resolvedBy: '2026-Q2',
        tiebreak: 'leading',
      },
    ],
  });
  const result = await resolveExceptions({ cwd });
  assert.equal(result.exceptions.length, 1);
  assert.equal(result.exceptions[0].tiebreak, 'leading');
});

test('resolveExceptions: duplicate (tokenPath, rule) pair fails', async () => {
  const cwd = await setupProject({
    exceptions: [
      {
        tokenPath: 'typography.sizes.caption-sm',
        rule: 'L5-size-floor',
        reason: 'first',
        resolvedBy: '2026-Q2',
      },
      {
        tokenPath: 'typography.sizes.caption-sm',
        rule: 'L5-size-floor',
        reason: 'duplicate',
        resolvedBy: '2026-Q3',
      },
    ],
  });
  await assert.rejects(() => resolveExceptions({ cwd }), /Duplicate/);
});

test('resolveExceptions: overdue tagging uses injected now', async () => {
  const cwd = await setupProject({
    exceptions: [
      {
        tokenPath: 'typography.sizes.caption-sm',
        rule: 'L5-size-floor',
        reason: 'old one',
        resolvedBy: '2025-Q1',
      },
      {
        tokenPath: 'typography.roles.body-sm',
        rule: 'L7-weight-mismatch',
        reason: 'future',
        resolvedBy: '2027-Q1',
        tiebreak: 'leading',
      },
    ],
  });
  const now = new Date('2026-06-01T00:00:00Z');
  const result = await resolveExceptions({ cwd, now });
  const overdue = result.exceptions.filter((e) => e.overdue);
  const current = result.exceptions.filter((e) => !e.overdue);
  assert.equal(overdue.length, 1);
  assert.equal(overdue[0].tokenPath, 'typography.sizes.caption-sm');
  assert.equal(current.length, 1);
  assert.equal(current[0].tokenPath, 'typography.roles.body-sm');
});

test('resolveExceptions: invalid rule enum rejected', async () => {
  const cwd = await setupProject({
    exceptions: [
      {
        tokenPath: 'typography.sizes.caption-sm',
        rule: 'L99-made-up',
        reason: 'nope',
        resolvedBy: '2026-Q2',
      },
    ],
  });
  await assert.rejects(() => resolveExceptions({ cwd }), /schema/i);
});
