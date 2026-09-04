import { useKeyboardShortcut } from './useKeyboardShortcut'; import assert from 'node:assert/strict';
assert.equal(useKeyboardShortcut("Escape", () => {}).key, "escape");