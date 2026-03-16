import path from "path"
import fs from "fs-extra"
import { rimraf } from "rimraf"

export const TEMP_DIR = path.join(__dirname, "../../temp")

const SHADCN_CLI_PATH = path.join(__dirname, "../../../shadcn/dist/index.js")

async function waitForCondition(
  label: string,
  check: () => Promise<boolean>,
  timeoutMs = 60000
) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (await check()) return
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`Timed out waiting for: ${label} (${timeoutMs}ms)`)
}

export default async function setup() {
  await fs.ensureDir(TEMP_DIR)

  // The v4 dev script runs `pnpm --filter=shadcn build` in the background
  // while `next dev` starts immediately. On fast CI runs the server can be
  // ready before the CLI binary is built, so we wait for it explicitly.
  await waitForCondition("shadcn CLI binary", () =>
    fs.pathExists(SHADCN_CLI_PATH)
  )

  // Wait for the registry to actually serve responses. /r itself is a
  // directory and returns 404; /r/index.json is a real static file.
  const registryUrl = process.env.REGISTRY_URL || "http://localhost:4000/r"
  const registryCheckUrl = `${registryUrl}/index.json`
  await waitForCondition("registry", async () => {
    try {
      const res = await fetch(registryCheckUrl)
      return res.ok
    } catch {
      return false
    }
  })

  return async () => {
    try {
      await rimraf(TEMP_DIR)
    } catch (error) {
      console.error("Failed to clean up temp directory:", error)
    }
  }
}
