import path from "path"
import { loadConfig, type ConfigLoaderSuccessResult } from "tsconfig-paths"
import { describe, expect, test } from "vitest"

import { resolveImport } from "../../src/utils/resolve-import"

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

describe("resolve subpath imports", () => {
  const cwd = path.resolve(__dirname, "../fixtures/with-subpath-imports")
  const config = {
    absoluteBaseUrl: cwd,
    paths: {},
  }

  test("should resolve wildcard subpath import", async () => {
    expect(await resolveImport("#src/components/ui", config)).toEqual(
      path.resolve(cwd, "src/components/ui")
    )
  })

  test("should resolve more specific wildcard pattern", async () => {
    expect(await resolveImport("#components/button", config)).toEqual(
      path.resolve(cwd, "src/components/button")
    )
  })

  test("should resolve exact match subpath import", async () => {
    expect(await resolveImport("#hooks", config)).toEqual(
      path.resolve(cwd, "src/hooks/index.ts")
    )
  })

  test("should resolve conditional subpath import to first local path", async () => {
    // #dep has { "node": "dep-node-native", "default": "./dep-polyfill.js" }
    // Should skip "dep-node-native" (not local) and pick "./dep-polyfill.js"
    expect(await resolveImport("#dep", config)).toEqual(
      path.resolve(cwd, "dep-polyfill.js")
    )
  })

  test("should return null for unmatched subpath import", async () => {
    expect(await resolveImport("#nonexistent/foo", config)).toBeNull()
  })
})
