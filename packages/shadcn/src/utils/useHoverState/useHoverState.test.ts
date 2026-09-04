import { useHoverState } from './useHoverState'; import assert from 'node:assert/strict';
assert.equal(useHoverState().isHovered, false);