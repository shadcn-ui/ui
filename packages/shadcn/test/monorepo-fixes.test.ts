import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { promises as fs } from "fs"
import path from "path"
import os from "os"
import { getTsConfigAliasPrefix } from "../src/utils/get-project-info"

describe("Monorepo fixes", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "shadcn-test-"))
  })

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true })
  })

  it("should detect alias prefix in monorepo tsconfig", async () => {
    // Create a monorepo-style tsconfig.json
    const tsConfigContent = {
      extends: "@workspace/typescript-config/nextjs.json",
      compilerOptions: {
        baseUrl: ".",
        paths: {
          "@/*": ["./*"],
          "@workspace/ui/*": ["../../packages/ui/src/*"]
        }
      }
    }

    await fs.writeFile(
      path.join(tempDir, "tsconfig.json"),
      JSON.stringify(tsConfigContent, null, 2)
    )

    const aliasPrefix = await getTsConfigAliasPrefix(tempDir)
    expect(aliasPrefix).toBe("@")
  })

  it("should handle string paths in tsconfig", async () => {
    // Create tsconfig with string paths instead of arrays
    const tsConfigContent = {
      compilerOptions: {
        baseUrl: ".",
        paths: {
          "@/*": "./*",
          "@/components/*": "./components/*"
        }
      }
    }

    await fs.writeFile(
      path.join(tempDir, "tsconfig.json"),
      JSON.stringify(tsConfigContent, null, 2)
    )

    const aliasPrefix = await getTsConfigAliasPrefix(tempDir)
    expect(aliasPrefix).toBe("@")
  })

  it("should return null when no valid alias is found", async () => {
    // Create tsconfig without valid alias patterns
    const tsConfigContent = {
      compilerOptions: {
        baseUrl: ".",
        paths: {
          "some-package": ["./node_modules/some-package"]
        }
      }
    }

    await fs.writeFile(
      path.join(tempDir, "tsconfig.json"),
      JSON.stringify(tsConfigContent, null, 2)
    )

    const aliasPrefix = await getTsConfigAliasPrefix(tempDir)
    expect(aliasPrefix).toBe("some-package")
  })
})