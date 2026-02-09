import { randomUUID } from "crypto"
import path from "path"
import { fileURLToPath } from "url"
import { execa } from "execa"
import fs from "fs-extra"

import { TEMP_DIR } from "./setup"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES_DIR = path.join(__dirname, "../../fixtures")
const SHADCN_CLI_PATH = path.join(__dirname, "../../../shadcn/dist/index.js")

export function getRegistryUrl() {
  return process.env.REGISTRY_URL || "http://localhost:4000/r"
}

export async function createFixtureTestDirectory(fixtureName: string) {
  const fixturePath = path.join(FIXTURES_DIR, fixtureName)

  const uniqueId = `${process.pid}-${randomUUID().substring(0, 8)}`
  let testDir = path.join(TEMP_DIR, `test-${uniqueId}-${fixtureName}`)

  await fs.ensureDir(testDir)
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

export async function npxShadcn(
  cwd: string,
  args: string[],
  {
    debug = false,
  }: {
    debug?: boolean
  } = {}
) {
  const result = await runCommand(cwd, args, {
    env: {
      REGISTRY_URL: getRegistryUrl(),
    },
  })

  if (debug) {
    console.log(result)
  }

  return result
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
