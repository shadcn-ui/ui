import { useUnmountCallback } from './useUnmountCallback'; import assert from 'node:assert/strict';
assert.equal(useUnmountCallback(() => {}).cleanupRegistered, true);