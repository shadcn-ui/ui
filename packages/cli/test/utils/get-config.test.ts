import path from "path"
import { expect, test } from "vitest"

import {
  DEFAULT_STYLES,
  DEFAULT_TAILWIND_CONFIG,
  getConfig,
  getRawConfig,
} from "../../src/utils/get-config"

test("get raw config", async () => {
  expect(
    await getRawConfig(path.resolve(__dirname, "../fixtures/config-none"))
  ).toEqual(null)

  expect(
    await getRawConfig(path.resolve(__dirname, "../fixtures/config-partial"))
  ).toEqual({
    tailwindConfig: DEFAULT_TAILWIND_CONFIG,
    importPaths: {
      styles: DEFAULT_STYLES,
      "components:ui": "@/components/ui",
      "utils:cn": "@/utils/cn.ts",
    },
  })

  expect(
    getRawConfig(path.resolve(__dirname, "../fixtures/config-invalid"))
  ).rejects.toThrowError()
})

test("get config", async () => {
  expect(
    await getConfig(path.resolve(__dirname, "../fixtures/config-none"))
  ).toEqual(null)

  expect(
    getConfig(path.resolve(__dirname, "../fixtures/config-invalid"))
  ).rejects.toThrowError()

  expect(
    await getConfig(path.resolve(__dirname, "../fixtures/config-partial"))
  ).toEqual({
    tailwindConfig: path.resolve(
      __dirname,
      "../fixtures/config-partial",
      DEFAULT_TAILWIND_CONFIG
    ),
    importPaths: {
      styles: "app/globals.css",
      "components:ui": "@/components/ui",
      "utils:cn": "@/utils/cn.ts",
    },
    resolvedPaths: {
      styles: path.resolve(
        __dirname,
        "../fixtures/config-partial",
        "./app/globals.css"
      ),
      "components:ui": path.resolve(
        __dirname,
        "../fixtures/config-partial",
        "./components/ui"
      ),
      "utils:cn": path.resolve(
        __dirname,
        "../fixtures/config-partial",
        "./utils/cn.ts"
      ),
    },
  })

  expect(
    await getConfig(path.resolve(__dirname, "../fixtures/config-full"))
  ).toEqual({
    tailwindConfig: path.resolve(
      __dirname,
      "../fixtures/config-full",
      "tailwind.config.ts"
    ),
    importPaths: {
      styles: "~/styles/globals.css",
      "components:ui": "~/components/ui",
      "utils:cn": "~/lib/cn.ts",
    },
    resolvedPaths: {
      styles: path.resolve(
        __dirname,
        "../fixtures/config-full",
        "./src/styles/globals.css"
      ),
      "components:ui": path.resolve(
        __dirname,
        "../fixtures/config-full",
        "./src/components/ui"
      ),
      "utils:cn": path.resolve(
        __dirname,
        "../fixtures/config-full",
        "./src/lib/cn.ts"
      ),
    },
  })
})
