import path from "path"
import fs from "fs-extra"
import { rimraf } from "rimraf"

export const TEMP_DIR = path.join(__dirname, "../../temp")

async function waitForRegistry(url: string, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch {
      // Not ready yet, keep polling.
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(
    `Registry at ${url} did not become available within ${timeoutMs}ms`
  )
}

export default async function setup() {
  await fs.ensureDir(TEMP_DIR)

  const registryUrl = process.env.REGISTRY_URL || "http://localhost:4000/r"
  await waitForRegistry(registryUrl)

  return async () => {
    try {
      await rimraf(TEMP_DIR)
    } catch (error) {
      console.error("Failed to clean up temp directory:", error)
    }
  }
}
