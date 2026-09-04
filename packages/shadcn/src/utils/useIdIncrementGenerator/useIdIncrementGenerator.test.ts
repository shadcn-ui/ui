import { useIdIncrementGenerator } from './useIdIncrementGenerator'; import assert from 'node:assert/strict';
assert.equal(useIdIncrementGenerator("id").startsWith("id-"), true);