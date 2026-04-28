import path from "path"
import fs from "fs-extra"
import { describe, expect, it, beforeAll, afterAll } from "vitest"
import { loadTsConfigWithFallback } from "./load-tsconfig"

const TEST_DIR = path.resolve(__dirname, "../../test/fixtures/tsconfig-fallback")

describe("loadTsConfigWithFallback", () => {
  beforeAll(async () => {
    // Create test fixtures for project references
    await fs.ensureDir(path.join(TEST_DIR, "project-references"))
    await fs.writeJSON(
      path.join(TEST_DIR, "project-references", "tsconfig.json"),
      {
        files: [],
        references: [{ path: "./tsconfig.web.json" }],
      }
    )
    await fs.writeJSON(
      path.join(TEST_DIR, "project-references", "tsconfig.web.json"),
      {
        compilerOptions: {
          composite: true,
          jsx: "react-jsx",
          baseUrl: ".",
          paths: {
            "@renderer/*": ["src/renderer/src/*"],
          },
        },
      }
    )

    // Create test fixtures for standard tsconfig with paths
    await fs.ensureDir(path.join(TEST_DIR, "standard"))
    await fs.writeJSON(path.join(TEST_DIR, "standard", "tsconfig.json"), {
      compilerOptions: {
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"],
        },
      },
    })

    // Create test fixtures for tsconfig.app.json fallback
    await fs.ensureDir(path.join(TEST_DIR, "app-fallback"))
    await fs.writeJSON(
      path.join(TEST_DIR, "app-fallback", "tsconfig.json"),
      {
        files: [],
        references: [{ path: "./tsconfig.app.json" }],
      }
    )
    await fs.writeJSON(
      path.join(TEST_DIR, "app-fallback", "tsconfig.app.json"),
      {
        compilerOptions: {
          baseUrl: ".",
          paths: {
            "@/*": ["./src/*"],
          },
        },
      }
    )
  })

  afterAll(async () => {
    await fs.remove(TEST_DIR)
  })

  it("should resolve paths from project references", () => {
    const result = loadTsConfigWithFallback(
      path.join(TEST_DIR, "project-references")
    )

    expect(result.resultType).toBe("success")
    if (result.resultType === "success") {
      expect(result.paths).toEqual({
        "@renderer/*": ["src/renderer/src/*"],
      })
    }
  })

  it("should resolve paths from standard tsconfig.json", () => {
    const result = loadTsConfigWithFallback(path.join(TEST_DIR, "standard"))

    expect(result.resultType).toBe("success")
    if (result.resultType === "success") {
      expect(result.paths).toEqual({
        "@/*": ["./src/*"],
      })
    }
  })

  it("should resolve paths from tsconfig.app.json fallback", () => {
    const result = loadTsConfigWithFallback(
      path.join(TEST_DIR, "app-fallback")
    )

    expect(result.resultType).toBe("success")
    if (result.resultType === "success") {
      expect(result.paths).toEqual({
        "@/*": ["./src/*"],
      })
    }
  })
})
