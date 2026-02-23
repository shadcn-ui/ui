import path from "path"
import { describe, expect, test } from "vitest"

import {
  createConfig,
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
    style: "default",
    tailwind: {
      config: "./tailwind.config.ts",
      css: "./src/assets/css/tailwind.css",
      baseColor: "neutral",
      cssVariables: false,
    },
    rsc: false,
    tsx: true,
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
    },
  })

  await expect(
    getRawConfig(path.resolve(__dirname, "../fixtures/config-invalid"))
  ).rejects.toThrowError()
})

test("get config", async () => {
  expect(
    await getConfig(path.resolve(__dirname, "../fixtures/config-none"))
  ).toEqual(null)

  await expect(
    getConfig(path.resolve(__dirname, "../fixtures/config-invalid"))
  ).rejects.toThrowError()

  expect(
    await getConfig(path.resolve(__dirname, "../fixtures/config-partial"))
  ).toEqual({
    style: "default",
    tailwind: {
      config: "./tailwind.config.ts",
      css: "./src/assets/css/tailwind.css",
      baseColor: "neutral",
      cssVariables: false,
    },
    rsc: false,
    tsx: true,
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
    },
    resolvedPaths: {
      cwd: path.resolve(__dirname, "../fixtures/config-partial"),
      tailwindConfig: path.resolve(
        __dirname,
        "../fixtures/config-partial",
        "tailwind.config.ts"
      ),
      tailwindCss: path.resolve(
        __dirname,
        "../fixtures/config-partial",
        "./src/assets/css/tailwind.css"
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
      ui: path.resolve(
        __dirname,
        "../fixtures/config-partial",
        "./components/ui"
      ),
      hooks: path.resolve(__dirname, "../fixtures/config-partial", "./hooks"),
      lib: path.resolve(__dirname, "../fixtures/config-partial", "./lib"),
    },
    iconLibrary: "lucide",
    registries: {
      "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
    },
  })

  expect(
    await getConfig(path.resolve(__dirname, "../fixtures/config-full"))
  ).toEqual({
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      config: "tailwind.config.ts",
      baseColor: "zinc",
      css: "src/app/globals.css",
      cssVariables: true,
      prefix: "tw-",
    },
    aliases: {
      components: "~/components",
      utils: "~/lib/utils",
      lib: "~/lib",
      hooks: "~/lib/hooks",
      ui: "~/ui",
    },
    iconLibrary: "lucide",
    resolvedPaths: {
      cwd: path.resolve(__dirname, "../fixtures/config-full"),
      tailwindConfig: path.resolve(
        __dirname,
        "../fixtures/config-full",
        "tailwind.config.ts"
      ),
      tailwindCss: path.resolve(
        __dirname,
        "../fixtures/config-full",
        "./src/app/globals.css"
      ),
      components: path.resolve(
        __dirname,
        "../fixtures/config-full",
        "./src/components"
      ),
      ui: path.resolve(__dirname, "../fixtures/config-full", "./src/ui"),
      hooks: path.resolve(
        __dirname,
        "../fixtures/config-full",
        "./src/lib/hooks"
      ),
      lib: path.resolve(__dirname, "../fixtures/config-full", "./src/lib"),
      utils: path.resolve(
        __dirname,
        "../fixtures/config-full",
        "./src/lib/utils"
      ),
    },
    registries: {
      "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
    },
  })

  expect(
    await getConfig(path.resolve(__dirname, "../fixtures/config-jsx"))
  ).toEqual({
    style: "default",
    tailwind: {
      config: "./tailwind.config.js",
      css: "./src/assets/css/tailwind.css",
      baseColor: "neutral",
      cssVariables: false,
    },
    rsc: false,
    tsx: false,
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
    },
    iconLibrary: "radix",
    resolvedPaths: {
      cwd: path.resolve(__dirname, "../fixtures/config-jsx"),
      tailwindConfig: path.resolve(
        __dirname,
        "../fixtures/config-jsx",
        "tailwind.config.js"
      ),
      tailwindCss: path.resolve(
        __dirname,
        "../fixtures/config-jsx",
        "./src/assets/css/tailwind.css"
      ),
      components: path.resolve(
        __dirname,
        "../fixtures/config-jsx",
        "./components"
      ),
      ui: path.resolve(__dirname, "../fixtures/config-jsx", "./components/ui"),
      utils: path.resolve(__dirname, "../fixtures/config-jsx", "./lib/utils"),
      hooks: path.resolve(__dirname, "../fixtures/config-jsx", "./hooks"),
      lib: path.resolve(__dirname, "../fixtures/config-jsx", "./lib"),
    },
    registries: {
      "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
    },
  })
})

describe("createConfig", () => {
  test("creates default config when called without arguments", () => {
    const config = createConfig()

    expect(config).toMatchObject({
      resolvedPaths: {
        cwd: expect.any(String),
        tailwindConfig: "",
        tailwindCss: "",
        utils: "",
        components: "",
        ui: "",
        lib: "",
        hooks: "",
      },
      style: "",
      tailwind: {
        config: "",
        css: "",
        baseColor: "",
        cssVariables: false,
      },
      rsc: false,
      tsx: true,
      aliases: {
        components: "",
        utils: "",
      },
    })
  })

  test("overrides cwd in resolvedPaths", () => {
    const customCwd = "/custom/path"
    const config = createConfig({
      resolvedPaths: {
        cwd: customCwd,
      },
    })

    expect(config.resolvedPaths.cwd).toBe(customCwd)
    expect(config.resolvedPaths.components).toBe("")
    expect(config.resolvedPaths.utils).toBe("")
  })

  test("overrides style", () => {
    const config = createConfig({
      style: "new-york",
    })

    expect(config.style).toBe("new-york")
  })

  test("overrides tailwind settings", () => {
    const config = createConfig({
      tailwind: {
        baseColor: "slate",
        cssVariables: true,
      },
    })

    expect(config.tailwind.baseColor).toBe("slate")
    expect(config.tailwind.cssVariables).toBe(true)
    expect(config.tailwind.config).toBe("")
    expect(config.tailwind.css).toBe("")
  })

  test("overrides boolean flags", () => {
    const config = createConfig({
      rsc: true,
      tsx: false,
    })

    expect(config.rsc).toBe(true)
    expect(config.tsx).toBe(false)
  })

  test("overrides aliases", () => {
    const config = createConfig({
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
      },
    })

    expect(config.aliases.components).toBe("@/components")
    expect(config.aliases.utils).toBe("@/lib/utils")
  })

  test("handles complex partial overrides", () => {
    const config = createConfig({
      style: "default",
      resolvedPaths: {
        cwd: "/my/project",
        components: "/my/project/src/components",
      },
      tailwind: {
        baseColor: "zinc",
        prefix: "tw-",
      },
      aliases: {
        ui: "@/components/ui",
      },
    })

    expect(config.style).toBe("default")
    expect(config.resolvedPaths.cwd).toBe("/my/project")
    expect(config.resolvedPaths.components).toBe("/my/project/src/components")
    expect(config.resolvedPaths.utils).toBe("")
    expect(config.tailwind.baseColor).toBe("zinc")
    expect(config.tailwind.prefix).toBe("tw-")
    expect(config.tailwind.css).toBe("")
    expect(config.aliases.ui).toBe("@/components/ui")
    expect(config.aliases.components).toBe("")
  })

  test("returns new object instances", () => {
    const config1 = createConfig()
    const config2 = createConfig()

    expect(config1).not.toBe(config2)
    expect(config1.resolvedPaths).not.toBe(config2.resolvedPaths)
    expect(config1.tailwind).not.toBe(config2.tailwind)
    expect(config1.aliases).not.toBe(config2.aliases)
  })
})
