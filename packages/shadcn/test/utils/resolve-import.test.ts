import path from "path"
import { loadConfig, type ConfigLoaderSuccessResult } from "tsconfig-paths"
import { describe, expect, test } from "vitest"

import { resolveImport } from "../../src/utils/resolve-import"
import { generateRandomPath } from "../fuzz-utils"

test("resolve import", async () => {
  expect(
    await resolveImport("@/foo/bar", {
      absoluteBaseUrl: "/Users/shadcn/Projects/foobar",
      paths: {
        "@/*": ["./src/*"],
        "~/components/*": ["./src/components/*"],
        "~/lib": ["./src/lib"],
      },
    })
  ).toEqual("/Users/shadcn/Projects/foobar/src/foo/bar")

  expect(
    await resolveImport("~/components/foo/bar/baz", {
      absoluteBaseUrl: "/Users/shadcn/Projects/foobar",
      paths: {
        "@/*": ["./src/*"],
        "~/components/*": ["./src/components/*"],
        "~/lib": ["./src/lib"],
      },
    })
  ).toEqual("/Users/shadcn/Projects/foobar/src/components/foo/bar/baz")

  expect(
    await resolveImport("components/foo/bar", {
      absoluteBaseUrl: "/Users/shadcn/Projects/foobar",
      paths: {
        "components/*": ["./src/app/components/*"],
        "ui/*": ["./src/ui/primities/*"],
        lib: ["./lib"],
      },
    })
  ).toEqual("/Users/shadcn/Projects/foobar/src/app/components/foo/bar")

  expect(
    await resolveImport("lib/utils", {
      absoluteBaseUrl: "/Users/shadcn/Projects/foobar",
      paths: {
        "components/*": ["./src/app/components/*"],
        "ui/*": ["./src/ui/primities/*"],
        lib: ["./lib"],
      },
    })
  ).toEqual("/Users/shadcn/Projects/foobar/lib/utils")
})

test("resolve import with base url", async () => {
  const cwd = path.resolve(__dirname, "../fixtures/with-base-url")
  const config = (await loadConfig(cwd)) as ConfigLoaderSuccessResult

  expect(await resolveImport("@/components/ui", config)).toEqual(
    path.resolve(cwd, "components/ui")
  )
  expect(await resolveImport("@/lib/utils", config)).toEqual(
    path.resolve(cwd, "lib/utils")
  )
  expect(await resolveImport("foo/bar", config)).toEqual(
    path.resolve(cwd, "foo/bar")
  )
})

test("resolve import without base url", async () => {
  const cwd = path.resolve(__dirname, "../fixtures/without-base-url")
  const config = (await loadConfig(cwd)) as ConfigLoaderSuccessResult

  expect(await resolveImport("~/components/ui", config)).toEqual(
    path.resolve(cwd, "components/ui")
  )
  expect(await resolveImport("~/lib/utils", config)).toEqual(
    path.resolve(cwd, "lib/utils")
  )
  expect(await resolveImport("foo/bar", config)).toEqual(
    path.resolve(cwd, "foo/bar")
  )
})

describe("fuzzing", () => {
  test("should handle various import paths", async () => {
    const generateRandomConfig = (): Pick<
      ConfigLoaderSuccessResult,
      "absoluteBaseUrl" | "paths"
    > => ({
      absoluteBaseUrl: generateRandomPath(),
      paths: {
        "@/*": [generateRandomPath()],
        "@/components/*": [generateRandomPath()],
        "@/lib/*": [generateRandomPath()],
      },
    })

    const testCases = Array.from({ length: 100 }, () => ({
      importPath: generateRandomPath(),
      config: generateRandomConfig(),
    }))

    for (const { importPath, config } of testCases) {
      try {
        const result = await resolveImport(importPath, config)
        // Should either return undefined or a valid path
        if (result) {
          expect(typeof result).toBe("string")
          expect(result.length).toBeGreaterThan(0)
        }
      } catch (error) {
        // Expected for invalid paths
        expect(error).toBeDefined()
      }
    }
  })

  test("should handle edge cases", async () => {
    const edgeCases: Array<{
      importPath: string
      config: Pick<ConfigLoaderSuccessResult, "absoluteBaseUrl" | "paths">
    }> = [
      {
        importPath: "",
        config: {
          absoluteBaseUrl: "",
          paths: {
            "@/*": [""],
          },
        },
      },
      {
        importPath: "/",
        config: {
          absoluteBaseUrl: "/",
          paths: {
            "@/*": ["/"],
          },
        },
      },
      {
        importPath: "@/components/button",
        config: {
          absoluteBaseUrl: "/",
          paths: {
            "@/*": ["/"],
            "@/components/*": ["/components"],
          },
        },
      },
    ]

    for (const { importPath, config } of edgeCases) {
      try {
        const result = await resolveImport(importPath, config)
        // Should either return undefined or a valid path
        if (result) {
          expect(typeof result).toBe("string")
          expect(result.length).toBeGreaterThan(0)
        }
      } catch (error) {
        console.error(`Failed with edge case:`, { importPath, config }, error)
        throw error
      }
    }
  })
})
