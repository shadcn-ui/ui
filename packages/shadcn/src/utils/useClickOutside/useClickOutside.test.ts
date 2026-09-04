import { useClickOutside } from './useClickOutside'; import assert from 'node:assert/strict';
assert.equal(useClickOutside(() => {}).registered, true);