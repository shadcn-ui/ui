import path from "path"
import { loadConfig, type ConfigLoaderSuccessResult } from "tsconfig-paths"
import { describe, expect, test } from "vitest"

import {
  loadTsConfig,
  resolveImport,
  substituteConfigDir,
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

// Ensures the TypeScript 5.5 `${configDir}` template variable is substituted
// when resolving tsconfig paths. Without this, the CLI creates components at
// literal `${configDir}/src/components/ui` paths in monorepos that rely on
// `${configDir}` in a shared base tsconfig.
// See: https://github.com/shadcn-ui/ui/issues/10428
describe("substituteConfigDir", () => {
  test("returns the input unchanged when no ${configDir} tokens exist", () => {
    const input: ConfigLoaderSuccessResult = {
      resultType: "success",
      configFileAbsolutePath: "/Users/shadcn/project/tsconfig.json",
      baseUrl: ".",
      absoluteBaseUrl: "/Users/shadcn/project",
      paths: {
        "@/*": ["./src/*"],
      },
    }

    const result = substituteConfigDir(input)

    expect(result).toBe(input)
  })

  test("substitutes ${configDir} in baseUrl and paths, recomputes absoluteBaseUrl", () => {
    const configDir = "/Users/shadcn/project"
    const input: ConfigLoaderSuccessResult = {
      resultType: "success",
      configFileAbsolutePath: path.join(configDir, "tsconfig.json"),
      baseUrl: "${configDir}",
      absoluteBaseUrl: path.join(configDir, "${configDir}"),
      paths: {
        "@/*": ["${configDir}/src/*"],
        "~/components/*": ["${configDir}/src/components/*"],
        "~/lib": ["${configDir}/src/lib"],
      },
    }

    const result = substituteConfigDir(input) as ConfigLoaderSuccessResult

    expect(result.baseUrl).toBe(configDir)
    expect(result.absoluteBaseUrl).toBe(configDir)
    expect(result.paths).toEqual({
      "@/*": [`${configDir}/src/*`],
      "~/components/*": [`${configDir}/src/components/*`],
      "~/lib": [`${configDir}/src/lib`],
    })
  })

  test("leaves absoluteBaseUrl intact when only paths reference ${configDir}", () => {
    const configDir = "/Users/shadcn/project"
    const input: ConfigLoaderSuccessResult = {
      resultType: "success",
      configFileAbsolutePath: path.join(configDir, "tsconfig.json"),
      baseUrl: ".",
      absoluteBaseUrl: configDir,
      paths: {
        "@/*": ["${configDir}/src/*"],
      },
    }

    const result = substituteConfigDir(input) as ConfigLoaderSuccessResult

    expect(result.baseUrl).toBe(".")
    expect(result.absoluteBaseUrl).toBe(configDir)
    expect(result.paths).toEqual({
      "@/*": [`${configDir}/src/*`],
    })
  })

  test("passes through failure results untouched", () => {
    const failure = {
      resultType: "failed" as const,
      message: "could not load",
    }

    expect(substituteConfigDir(failure)).toBe(failure)
  })
})

test("resolve import with ${configDir} in tsconfig", async () => {
  const cwd = path.resolve(__dirname, "../fixtures/with-config-dir")
  const config = loadTsConfig(cwd) as ConfigLoaderSuccessResult

  expect(config.resultType).toBe("success")
  expect(config.absoluteBaseUrl).toBe(cwd)
  expect(config.paths).toEqual({
    "@/*": [path.join(cwd, "src/*")],
    "~/components/*": [path.join(cwd, "src/components/*")],
    "~/lib": [path.join(cwd, "src/lib")],
  })

  expect(await resolveImport("@/components/ui", config)).toEqual(
    path.resolve(cwd, "src/components/ui")
  )
  expect(await resolveImport("~/components/button", config)).toEqual(
    path.resolve(cwd, "src/components/button")
  )
  expect(await resolveImport("~/lib", config)).toEqual(
    path.resolve(cwd, "src/lib")
  )
})
