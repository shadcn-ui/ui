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

  // if (!globalRegistry) {
  //   globalRegistry = new Registry()
  //   await globalRegistry.start()

  //   process.env.TEST_REGISTRY_URL = globalRegistry.url
  // }
})

afterAll(async () => {
  // if (globalRegistry) {
  //   await globalRegistry.stop()
  //   globalRegistry = null
  // }

  await rimraf(TEMP_DIR)

  const { execa } = await import("execa")
  try {
    await execa("pnpm", ["install"], {
      cwd: path.join(__dirname, "../../../.."),
      stdio: "inherit",
    })
  } catch (error) {
    console.error("Failed to restore lockfile:", error)
  }
})

export function getRegistryUrl(): string {
  return process.env.REGISTRY_URL || "https://ui.shadcn.com/r"
}
