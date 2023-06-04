import path from "path"
import { expect, test } from "vitest"

import { getConfig, getRawConfig } from "../../src/utils/get-config"

test("get raw config", async () => {
  expect(
    await getRawConfig(path.resolve(__dirname, "../fixtures/config-none"))
  ).toEqual(null)

  expect(
    await getRawConfig(path.resolve(__dirname, "../fixtures/config-partial"))
  ).toEqual({
    style: "default",
    tailwind: "tailwind.config.js",
    css: "app/globals.css",
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
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
    style: "default",
    tailwind: "tailwind.config.js",
    css: "app/globals.css",
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
    },
    resolvedPaths: {
      tailwind: path.resolve(
        __dirname,
        "../fixtures/config-partial",
        "tailwind.config.js"
      ),
      css: path.resolve(
        __dirname,
        "../fixtures/config-partial",
        "./app/globals.css"
      ),
      components: path.resolve(
        __dirname,
        "../fixtures/config-partial",
        "./components"
      ),
      utils: path.resolve(
        __dirname,
        "../fixtures/config-partial",
        "./lib/utils"
      ),
    },
  })

  expect(
    await getConfig(path.resolve(__dirname, "../fixtures/config-full"))
  ).toEqual({
    style: "default",
    tailwind: "./tailwind.config.ts",
    css: "src/app/globals.css",
    aliases: {
      components: "~/components",
      utils: "~/lib/utils",
    },
    resolvedPaths: {
      tailwind: path.resolve(
        __dirname,
        "../fixtures/config-full",
        "tailwind.config.ts"
      ),
      css: path.resolve(
        __dirname,
        "../fixtures/config-full",
        "./src/app/globals.css"
      ),
      components: path.resolve(
        __dirname,
        "../fixtures/config-full",
        "./src/components"
      ),
      utils: path.resolve(
        __dirname,
        "../fixtures/config-full",
        "./src/lib/utils"
      ),
    },
  })
})
