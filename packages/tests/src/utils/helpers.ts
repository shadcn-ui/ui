import path from "path"
import { fileURLToPath } from "url"
import { execa } from "execa"
import fs from "fs-extra"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES_DIR = path.join(__dirname, "../../fixtures")
const TEMP_DIR = path.join(__dirname, "../../temp")
const CACHE_DIR = path.join(__dirname, "../../.cache")
const SHADCN_CLI_PATH = path.join(__dirname, "../../../shadcn/dist/index.js")

export async function createFixtureTestDirectory(fixtureName: string) {
  const fixturePath = path.join(FIXTURES_DIR, fixtureName)
  const testDir = path.join(
    TEMP_DIR,
    `test-${Date.now()}-${Math.random().toString(36).substring(7)}`
  )

  await fs.ensureDir(TEMP_DIR)
  await fs.copy(fixturePath, testDir)

  return testDir
}

export async function runCommand(
  cwd: string,
  args: string[],
  options?: {
    env?: Record<string, string>
    input?: string
  }
) {
  try {
    const childProcess = execa("node", [SHADCN_CLI_PATH, ...args], {
      cwd,
      env: {
        ...process.env,
        FORCE_COLOR: "0",
        CI: "true",
        ...options?.env,
      },
      input: options?.input,
      reject: false,
      timeout: 30000,
    })

    const result = await childProcess

    return {
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      exitCode: result.exitCode ?? 0,
    }
  } catch (error: any) {
    return {
      stdout: error.stdout || "",
      stderr: error.stderr || error.message || "",
      exitCode: error.exitCode ?? 1,
    }
  }
}

export async function npxShadcn(cwd: string, args: string[]) {
  const { getRegistryUrl } = await import("./setup")

  // Create a unique cache directory for each test to prevent interference
  const testCacheDir = path.join(
    CACHE_DIR,
    `test-cache-${Date.now()}-${Math.random().toString(36).substring(7)}`
  )
  await fs.ensureDir(testCacheDir)

  return runCommand(cwd, args, {
    env: {
      REGISTRY_URL: getRegistryUrl(),
      SHADCN_CACHE_DIR: testCacheDir,
    },
  })
}

export function cssHasProperties(
  cssContent: string,
  checks: Array<{
    selector: string
    properties: Record<string, string>
  }>
) {
  return checks.every(({ selector, properties }) => {
    const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const regex = new RegExp(`${escapedSelector}\\s*{([^}]+)}`, "s")
    const match = cssContent.match(regex)
    const block = match ? match[1] : ""

    return Object.entries(properties).every(([property, value]) =>
      block.includes(`${property}: ${value};`)
    )
  })
}

export async function createLocalFileServer(filePath: string) {
  const { createServer } = await import("http")
  const content = await fs.readFile(filePath, "utf-8")

  const server = createServer((_, res) => {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    })
    res.end(content)
  })

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      resolve()
    })
  })

  const address = server.address()
  const port = typeof address === "object" && address ? address.port : 0

  return {
    url: `http://127.0.0.1:${port}/file.json`,
    close: () =>
      new Promise<void>((resolve) => {
        server.close(() => resolve())
      }),
  }
}

export async function createRemoteRegistryItemFromPayload(payload: any) {
  const { createServer } = await import("http")
  const content = JSON.stringify(payload)
  const name = payload.name || "item"

  const server = createServer((req, res) => {
    if (req.url?.includes(`/${name}.json`)) {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      res.end(content)
    } else {
      res.writeHead(404)
      res.end("Not found")
    }
  })

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      resolve()
    })
  })

  const address = server.address()
  const port = typeof address === "object" && address ? address.port : 0

  return {
    url: `http://127.0.0.1:${port}/r/${name}.json`,
    close: () =>
      new Promise<void>((resolve) => {
        server.close(() => resolve())
      }),
  }
}
