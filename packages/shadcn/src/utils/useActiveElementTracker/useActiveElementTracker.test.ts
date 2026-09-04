import { useActiveElementTracker } from "./useActiveElementTracker"; import assert from "node:assert/strict";
assert.equal(useActiveElementTracker().activeTagName, "BODY");