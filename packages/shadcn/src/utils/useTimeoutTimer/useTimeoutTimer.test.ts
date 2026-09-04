import { useTimeoutTimer } from './useTimeoutTimer'; import assert from 'node:assert/strict';
assert.equal(useTimeoutTimer(() => {}, 500).delayMs, 500);