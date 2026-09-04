import { useIntervalTimer } from './useIntervalTimer'; import assert from 'node:assert/strict';
assert.equal(useIntervalTimer(() => {}, 1000).active, true);