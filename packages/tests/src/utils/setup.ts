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

  // The CLI's first request goes to the dynamic /init route. On a cold Next.js
  // dev server, this route needs to be compiled on first access (~1.8s). That
  // compilation time, on top of everything else init does, pushes the first
  // test over the 30s CLI timeout. Warming up the route here ensures it is
  // already compiled before any test starts.
  const registryUrl = process.env.REGISTRY_URL || "http://localhost:4000/r"
  const shadcnUrl = registryUrl.replace(/\/r\/?$/, "")
  const initWarmupUrl = `${shadcnUrl}/init?base=base&style=nova&baseColor=neutral&theme=neutral&iconLibrary=lucide&font=geist&rtl=false&menuAccent=subtle&menuColor=default&radius=default&template=next`

  await waitForCondition("init route warm-up", async () => {
    try {
      const res = await fetch(initWarmupUrl)
      return res.ok
    } catch {
      return false
    }
  })

  // The CLI fetches registry paths that may not exist (e.g. font files),
  // causing Next.js to compile the /_not-found/page route on first 404.
  // That compilation takes ~4-5s and contributes to the first test timing
  // out. Trigger one 404 here so the not-found page is pre-compiled.
  try {
    await fetch(`${shadcnUrl}/r/styles/new-york-v4/font-geist.json`)
  } catch {
    // Best effort — don't block setup if this fails.
  }

  return async () => {
    try {
      await rimraf(TEMP_DIR)
    } catch (error) {
      console.error("Failed to clean up temp directory:", error)
    }
  }
}
