import { useIdleTimerDetector } from './useIdleTimerDetector'; import assert from 'node:assert/strict';
assert.equal(useIdleTimerDetector(30000).timeoutMs, 30000);