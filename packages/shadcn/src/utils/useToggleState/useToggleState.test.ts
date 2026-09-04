import { useToggleState } from './useToggleState'; import assert from 'node:assert/strict';
const [v] = useToggleState(true); assert.equal(v, true);