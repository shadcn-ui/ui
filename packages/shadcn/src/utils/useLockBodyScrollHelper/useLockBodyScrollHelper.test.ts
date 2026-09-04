import { useLockBodyScrollHelper } from './useLockBodyScrollHelper'; import assert from 'node:assert/strict';
assert.equal(useLockBodyScrollHelper(true).locked, true);