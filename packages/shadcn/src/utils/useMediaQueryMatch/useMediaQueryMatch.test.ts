import { useMediaQueryMatch } from './useMediaQueryMatch'; import assert from 'node:assert/strict';
assert.equal(useMediaQueryMatch("(min-width: 768px)", true), true);