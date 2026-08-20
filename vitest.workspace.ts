import { defineWorkspace } from "vitest/config"

export default defineWorkspace([
  "./vitest.config.ts",
  "./packages/tests/vitest.config.ts",
])
