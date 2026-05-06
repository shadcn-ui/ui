import path from "path"
import { loadConfig, type ConfigLoaderSuccessResult } from "tsconfig-paths"
import { describe, expect, test } from "vitest"

import { resolvePackageImport } from "../../src/utils/package-imports"
import {
  isLocalAliasImport,
  resolveImport,
  resolveImportWithMetadata,
} from "../../src/utils/resolve-import"

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

describe("resolve package imports", () => {
  const cwd = path.resolve(__dirname, "../fixtures/with-package-imports")
  const config = {
    absoluteBaseUrl: cwd,
    paths: {},
    cwd,
  }

  test("resolves wildcard imports that preserve extensions", async () => {
    const result = await resolveImportWithMetadata(
      "#components/button.tsx",
      config
    )

    expect(result).toEqual({
      path: path.resolve(cwd, "src/components/button.tsx"),
      source: "package_imports",
      matchedAlias: "#components/*",
      matchedTarget: "./src/components/*",
      emitMode: "preserve_extension",
    })
  })

  test("resolves wildcard imports that strip extensions", async () => {
    const result = await resolveImportWithMetadata(
      "#components-ext/button",
      config
    )

    expect(result).toEqual({
      path: path.resolve(cwd, "src/components/button.tsx"),
      source: "package_imports",
      matchedAlias: "#components-ext/*",
      matchedTarget: "./src/components/*.tsx",
      emitMode: "strip_extension",
    })
  })

  test("resolves the root alias for wildcard package imports", async () => {
    expect(await resolveImport("#components", config)).toEqual(
      path.resolve(cwd, "src/components")
    )
  })

  test("resolves exact imports and prefers local conditional targets", async () => {
    expect(await resolveImport("#hooks", config)).toEqual(
      path.resolve(cwd, "src/hooks/index.ts")
    )

    expect(await resolveImport("#dep", config)).toEqual(
      path.resolve(cwd, "dep-polyfill.js")
    )
  })

  test("ignores package import targets outside the package", async () => {
    expect(resolvePackageImport("#outside/file", cwd)).toBeNull()
  })

  test("falls back to tsconfig paths when package imports do not match", async () => {
    expect(
      await resolveImportWithMetadata("#/components/ui", {
        absoluteBaseUrl: "/Users/shadcn/Projects/foobar",
        cwd,
        paths: {
          "#/*": ["./src/*"],
        },
      })
    ).toEqual({
      path: "/Users/shadcn/Projects/foobar/src/components/ui",
      source: "tsconfig_paths",
      matchedAlias: "#/*",
      matchedTarget: "./src/components/ui",
      emitMode: "strip_extension",
    })
  })

  test("resolves @/ via tsconfig paths and #/ via package imports in a mixed project", async () => {
    const tsconfigPath = await resolveImportWithMetadata(
      "@/components/button",
      {
        absoluteBaseUrl: cwd,
        cwd,
        paths: {
          "@/*": ["./src/*"],
        },
      }
    )
    expect(tsconfigPath?.source).toBe("tsconfig_paths")
    expect(tsconfigPath?.path).toBe(path.resolve(cwd, "src/components/button"))

    const packageImportPath = await resolveImportWithMetadata(
      "#components/button.tsx",
      {
        absoluteBaseUrl: cwd,
        cwd,
        paths: {
          "@/*": ["./src/*"],
        },
      }
    )
    expect(packageImportPath?.source).toBe("package_imports")
    expect(packageImportPath?.path).toBe(
      path.resolve(cwd, "src/components/button.tsx")
    )
  })
})

describe("resolve workspace package exports", () => {
  const root = path.resolve(
    __dirname,
    "../fixtures/frameworks/vite-monorepo-imports"
  )
  const cwd = path.resolve(root, "apps/web")
  const config = {
    absoluteBaseUrl: cwd,
    paths: {},
    cwd,
  }

  test("resolves workspace package wildcard exports for file imports", async () => {
    const result = await resolveImportWithMetadata(
      "@workspace/ui/components/button",
      config
    )

    expect(result).toEqual({
      path: path.resolve(root, "packages/ui/src/components/button.tsx"),
      source: "workspace_package_exports",
      matchedAlias: "@workspace/ui/components/*",
      matchedTarget: "./src/components/*.tsx",
      emitMode: "strip_extension",
    })
  })

  test("resolves bare alias roots from workspace package wildcard exports", async () => {
    expect(await resolveImport("@workspace/ui/components", config)).toEqual(
      path.resolve(root, "packages/ui/src/components")
    )

    expect(await resolveImport("@workspace/ui/lib/utils", config)).toEqual(
      path.resolve(root, "packages/ui/src/lib/utils.ts")
    )
  })

  test("does not treat workspace package exports as local alias imports", () => {
    expect(isLocalAliasImport("@workspace/ui/components/button", "#")).toBe(
      false
    )
  })
})
