import { useEventListenerHelper } from './useEventListenerHelper'; import assert from 'node:assert/strict';
assert.equal(useEventListenerHelper("resize", () => {}).attached, true);