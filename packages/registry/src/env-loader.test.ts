import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { afterEach, describe, expect, it } from "vitest"

import { loadEnvFiles } from "./env-loader"

const TEST_ENV_KEY = "SHADCN_ENV_LOADER_TEST_TOKEN"
let testDirectory: string | undefined

afterEach(async () => {
  if (testDirectory) {
    await fs.rm(testDirectory, { recursive: true, force: true })
    testDirectory = undefined
  }
})

describe("loadEnvFiles", () => {
  it("can load project variables without mutating process.env", async () => {
    testDirectory = await fs.mkdtemp(path.join(tmpdir(), "shadcn-env-"))
    await fs.writeFile(
      path.join(testDirectory, ".env.local"),
      `${TEST_ENV_KEY}=project\n`,
      "utf8"
    )

    const originalValue = process.env[TEST_ENV_KEY]
    const processEnv = { ...process.env }
    const result = await loadEnvFiles(testDirectory, { processEnv })

    expect(result).toBe(processEnv)
    expect(result[TEST_ENV_KEY]).toBe("project")
    expect(process.env[TEST_ENV_KEY]).toBe(originalValue)
  })

  it("preserves existing values and env file priority", async () => {
    testDirectory = await fs.mkdtemp(path.join(tmpdir(), "shadcn-env-"))
    await fs.writeFile(
      path.join(testDirectory, ".env.local"),
      "LOCAL_PRIORITY=local\nEXISTING_VALUE=file\n",
      "utf8"
    )
    await fs.writeFile(
      path.join(testDirectory, ".env"),
      "LOCAL_PRIORITY=env\nFALLBACK_VALUE=env\n",
      "utf8"
    )

    const processEnv = {
      EXISTING_VALUE: "process",
    }
    const result = await loadEnvFiles(testDirectory, { processEnv })

    expect(result).toMatchObject({
      EXISTING_VALUE: "process",
      FALLBACK_VALUE: "env",
      LOCAL_PRIORITY: "local",
    })
  })
})
