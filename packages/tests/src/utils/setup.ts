/* eslint-disable turbo/no-undeclared-env-vars */
import path from "path"
import { fileURLToPath } from "url"
import { rimraf } from "rimraf"
import { afterAll, beforeAll } from "vitest"

import { Registry } from "./registry"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMP_DIR = path.join(__dirname, "../../temp")

let globalRegistry: Registry | null = null

beforeAll(async () => {
  await rimraf(TEMP_DIR)

  if (!globalRegistry) {
    globalRegistry = new Registry()
    await globalRegistry.start()

    process.env.TEST_REGISTRY_URL = globalRegistry.url
  }
}, 120000)

afterAll(async () => {
  if (globalRegistry) {
    await globalRegistry.stop()
    globalRegistry = null
  }

  // Also clean up temp directory after all tests
  await rimraf(TEMP_DIR)
})

export function getRegistryUrl(): string {
  return process.env.TEST_REGISTRY_URL || "http://localhost:4000/r"
}
