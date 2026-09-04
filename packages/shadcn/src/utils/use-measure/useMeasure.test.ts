import { useMeasure } from "./useMeasure"; import assert from "node:assert/strict";
assert.deepEqual(useMeasure(), { width: 0, height: 0 });