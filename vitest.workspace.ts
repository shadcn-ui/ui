import { resolve } from "node:path"
import { defineWorkspace } from "vitest/config"

export default defineWorkspace([resolve(__dirname, "./vitest.config.ts")])
