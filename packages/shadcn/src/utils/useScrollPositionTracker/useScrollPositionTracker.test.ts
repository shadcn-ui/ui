import { useScrollPositionTracker } from './useScrollPositionTracker'; import assert from 'node:assert/strict';
assert.equal(useScrollPositionTracker().y, 0);