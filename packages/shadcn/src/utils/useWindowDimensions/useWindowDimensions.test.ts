import { useWindowDimensions } from './useWindowDimensions'; import assert from 'node:assert/strict';
assert.equal(useWindowDimensions().width, 1024);