/* eslint-disable turbo/no-undeclared-env-vars */
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs-extra"
import { rimraf } from "rimraf"

import { Registry } from "./registry"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMP_DIR = path.join(__dirname, "../../temp")

let globalRegistry: Registry | null = null

export async function setup() {
  await rimraf(TEMP_DIR)
  await fs.ensureDir(TEMP_DIR)

  if (!globalRegistry) {
    globalRegistry = new Registry()
    await globalRegistry.start()
    process.env.REGISTRY_URL = globalRegistry.url
  }
}

export async function teardown() {
  try {
    const { execa } = await import("execa")
    await execa("pnpm", ["install"], {
      cwd: path.join(__dirname, "../../../.."),
      stdio: "inherit",
    })

    await rimraf(TEMP_DIR)

    if (globalRegistry) {
      await globalRegistry.stop()
      globalRegistry = null
    }
  } catch (error) {
    console.error("Failed to restore lockfile:", error)
  }
}
