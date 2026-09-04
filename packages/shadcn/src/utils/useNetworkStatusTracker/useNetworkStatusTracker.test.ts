import { useNetworkStatusTracker } from './useNetworkStatusTracker'; import assert from 'node:assert/strict';
assert.equal(useNetworkStatusTracker().isOnline, true);