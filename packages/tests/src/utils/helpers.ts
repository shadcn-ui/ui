import path from "path"
import { fileURLToPath } from "url"
import { execa } from "execa"
import fs from "fs-extra"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES_DIR = path.join(__dirname, "../../fixtures")
const TEMP_DIR = path.join(__dirname, "../../temp")
const CACHE_DIR = path.join(__dirname, "../../.cache")
const SHADCN_CLI_PATH = path.join(__dirname, "../../../shadcn/dist/index.js")

export async function fileExists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath)
}

export async function readJson(filePath: string): Promise<any> {
  return fs.readJSON(filePath)
}

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

  await fs.ensureDir(CACHE_DIR)

  const result = await runCommand(cwd, args, {
    env: {
      REGISTRY_URL: getRegistryUrl(),
      SHADCN_CACHE_DIR: CACHE_DIR,
    },
  })

  return result
}
