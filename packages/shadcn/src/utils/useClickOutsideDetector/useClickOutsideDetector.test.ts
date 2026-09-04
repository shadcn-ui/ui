import { useClickOutsideDetector } from "./useClickOutsideDetector"; import assert from "node:assert/strict";
assert.equal(useClickOutsideDetector().isListening, true);