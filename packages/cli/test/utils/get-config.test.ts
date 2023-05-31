import path from "path"
import { expect, test } from "vitest"

import {
  DEFAULT_IMPORT_ALIAS,
  DEFAULT_STYLES,
  DEFAULT_TAILWIND_CONFIG,
  DEFAULT_UTILS,
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
    components: "./components",
    ui: "./ui",
    utils: DEFAULT_UTILS,
    styles: DEFAULT_STYLES,
    tailwindConfig: DEFAULT_TAILWIND_CONFIG,
    importAlias: DEFAULT_IMPORT_ALIAS,
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
    await getConfig(path.resolve(__dirname, "../fixtures/config-partial"))
  ).toEqual({
    components: path.resolve(
      __dirname,
      "../fixtures/config-partial",
      "./components"
    ),
    ui: path.resolve(__dirname, "../fixtures/config-partial", "./ui"),
    utils: path.resolve(__dirname, "../fixtures/config-partial", DEFAULT_UTILS),
    styles: path.resolve(
      __dirname,
      "../fixtures/config-partial",
      DEFAULT_STYLES
    ),
    tailwindConfig: path.resolve(
      __dirname,
      "../fixtures/config-partial",
      DEFAULT_TAILWIND_CONFIG
    ),
    importAlias: DEFAULT_IMPORT_ALIAS,
  })

  expect(
    getConfig(path.resolve(__dirname, "../fixtures/config-invalid"))
  ).rejects.toThrowError()
})
