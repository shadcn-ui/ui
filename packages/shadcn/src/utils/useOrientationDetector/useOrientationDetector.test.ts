import { useOrientationDetector } from './useOrientationDetector'; import assert from 'node:assert/strict';
assert.equal(useOrientationDetector().orientation, "portrait");