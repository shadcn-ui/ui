import path from "path"
import { describe, expect, test } from "vitest"

import {
  createConfig,
  getBase,
  getConfig,
  getRawConfig,
  getWorkspaceConfig,
} from "../../src/utils/get-config"
import { getProjectConfig } from "../../src/utils/get-project-info"

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

test("get project config from package imports", async () => {
  const cwd = path.resolve(__dirname, "../fixtures/frameworks/next-app-imports")

  expect(await getProjectConfig(cwd)).toEqual({
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: true,
    tsx: true,
    tailwind: {
      config: "tailwind.config.ts",
      baseColor: "zinc",
      css: "src/app/styles.css",
      cssVariables: true,
      prefix: "",
    },
    iconLibrary: "lucide",
    aliases: {
      components: "#components",
      ui: "#components/ui",
      lib: "#lib",
      hooks: "#hooks",
      utils: "#utils",
    },
    resolvedPaths: {
      cwd,
      tailwindConfig: path.resolve(cwd, "tailwind.config.ts"),
      tailwindCss: path.resolve(cwd, "src/app/styles.css"),
      components: path.resolve(cwd, "src/components"),
      ui: path.resolve(cwd, "src/components/ui"),
      lib: path.resolve(cwd, "src/lib"),
      hooks: path.resolve(cwd, "src/hooks"),
      utils: path.resolve(cwd, "src/lib/utils.ts"),
    },
    registries: {
      "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
    },
  })
})

test("get project config from generic package import prefix", async () => {
  const cwd = path.resolve(__dirname, "../fixtures/frameworks/vite-app-imports")

  expect(await getProjectConfig(cwd)).toEqual({
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      config: "",
      baseColor: "zinc",
      css: "src/index.css",
      cssVariables: true,
      prefix: "",
    },
    iconLibrary: "lucide",
    aliases: {
      components: "#custom/components",
      ui: "#custom/components/ui",
      lib: "#custom/lib",
      hooks: "#custom/hooks",
      utils: "#custom/lib/utils",
    },
    resolvedPaths: {
      cwd,
      tailwindConfig: "",
      tailwindCss: path.resolve(cwd, "src/index.css"),
      components: path.resolve(cwd, "src/components"),
      ui: path.resolve(cwd, "src/components/ui"),
      lib: path.resolve(cwd, "src/lib"),
      hooks: path.resolve(cwd, "src/hooks"),
      utils: path.resolve(cwd, "src/lib/utils"),
    },
    registries: {
      "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
    },
  })
})

test("get project config from root package imports", async () => {
  const cwd = path.resolve(__dirname, "../fixtures/frameworks/vite-root-imports")

  expect(await getProjectConfig(cwd)).toEqual({
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      config: "",
      baseColor: "zinc",
      css: "src/index.css",
      cssVariables: true,
      prefix: "",
    },
    iconLibrary: "lucide",
    aliases: {
      components: "#components",
      ui: "#components/ui",
      lib: "#lib",
      hooks: "#hooks",
      utils: "#lib/utils",
    },
    resolvedPaths: {
      cwd,
      tailwindConfig: "",
      tailwindCss: path.resolve(cwd, "src/index.css"),
      components: path.resolve(cwd, "src/components"),
      ui: path.resolve(cwd, "src/components/ui"),
      lib: path.resolve(cwd, "src/lib"),
      hooks: path.resolve(cwd, "src/hooks"),
      utils: path.resolve(cwd, "src/lib/utils"),
    },
    registries: {
      "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
    },
  })
})

test("get project config from partial package imports", async () => {
  const cwd = path.resolve(
    __dirname,
    "../fixtures/frameworks/vite-partial-imports"
  )

  expect(await getProjectConfig(cwd)).toEqual({
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      config: "",
      baseColor: "zinc",
      css: "src/index.css",
      cssVariables: true,
      prefix: "",
    },
    iconLibrary: "lucide",
    aliases: {
      components: "#components",
      ui: "#components/ui",
      lib: "#lib",
      utils: "#lib/utils",
    },
    resolvedPaths: {
      cwd,
      tailwindConfig: "",
      tailwindCss: path.resolve(cwd, "src/index.css"),
      components: path.resolve(cwd, "src/components"),
      ui: path.resolve(cwd, "src/components/ui"),
      lib: path.resolve(cwd, "src/lib"),
      hooks: path.resolve(cwd, "src/hooks"),
      utils: path.resolve(cwd, "src/lib/utils"),
    },
    registries: {
      "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
    },
  })
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

  expect(
    await getConfig(path.resolve(__dirname, "../fixtures/config-imports"))
  ).toEqual({
    style: "new-york",
    rsc: true,
    tsx: true,
    tailwind: {
      config: "tailwind.config.ts",
      baseColor: "zinc",
      css: "src/app/globals.css",
      cssVariables: true,
    },
    aliases: {
      components: "#components",
      ui: "#components/ui",
      lib: "#lib",
      hooks: "#hooks",
      utils: "#utils",
    },
    iconLibrary: "radix",
    resolvedPaths: {
      cwd: path.resolve(__dirname, "../fixtures/config-imports"),
      tailwindConfig: path.resolve(
        __dirname,
        "../fixtures/config-imports",
        "tailwind.config.ts"
      ),
      tailwindCss: path.resolve(
        __dirname,
        "../fixtures/config-imports",
        "src/app/globals.css"
      ),
      components: path.resolve(
        __dirname,
        "../fixtures/config-imports",
        "src/components"
      ),
      ui: path.resolve(
        __dirname,
        "../fixtures/config-imports",
        "src/components/ui"
      ),
      lib: path.resolve(__dirname, "../fixtures/config-imports", "src/lib"),
      hooks: path.resolve(__dirname, "../fixtures/config-imports", "src/hooks"),
      utils: path.resolve(
        __dirname,
        "../fixtures/config-imports",
        "src/lib/utils.ts"
      ),
    },
    registries: {
      "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
    },
  })

  expect(
    await getConfig(
      path.resolve(__dirname, "../fixtures/config-imports-extensions")
    )
  ).toEqual({
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      css: "src/index.css",
      baseColor: "zinc",
      cssVariables: true,
    },
    aliases: {
      components: "#components",
      ui: "#components/ui",
      lib: "#lib",
      utils: "#lib/utils",
    },
    iconLibrary: "radix",
    resolvedPaths: {
      cwd: path.resolve(__dirname, "../fixtures/config-imports-extensions"),
      tailwindConfig: "",
      tailwindCss: path.resolve(
        __dirname,
        "../fixtures/config-imports-extensions",
        "src/index.css"
      ),
      components: path.resolve(
        __dirname,
        "../fixtures/config-imports-extensions",
        "src/components"
      ),
      ui: path.resolve(
        __dirname,
        "../fixtures/config-imports-extensions",
        "src/components/ui"
      ),
      lib: path.resolve(
        __dirname,
        "../fixtures/config-imports-extensions",
        "src/lib"
      ),
      hooks: path.resolve(
        __dirname,
        "../fixtures/config-imports-extensions",
        "src/hooks"
      ),
      utils: path.resolve(
        __dirname,
        "../fixtures/config-imports-extensions",
        "src/lib/utils.ts"
      ),
    },
    registries: {
      "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
    },
  })

  expect(
    await getConfig(
      path.resolve(
        __dirname,
        "../fixtures/frameworks/vite-monorepo-imports/apps/web"
      )
    )
  ).toEqual({
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      config: "",
      css: "../../packages/ui/src/styles/globals.css",
      baseColor: "zinc",
      cssVariables: true,
    },
    aliases: {
      components: "#components",
      ui: "@workspace/ui/components",
      lib: "#lib",
      hooks: "#hooks",
      utils: "@workspace/ui/lib/utils",
    },
    iconLibrary: "radix",
    resolvedPaths: {
      cwd: path.resolve(
        __dirname,
        "../fixtures/frameworks/vite-monorepo-imports/apps/web"
      ),
      tailwindConfig: "",
      tailwindCss: path.resolve(
        __dirname,
        "../fixtures/frameworks/vite-monorepo-imports/packages/ui/src/styles/globals.css"
      ),
      components: path.resolve(
        __dirname,
        "../fixtures/frameworks/vite-monorepo-imports/apps/web/src/components"
      ),
      ui: path.resolve(
        __dirname,
        "../fixtures/frameworks/vite-monorepo-imports/packages/ui/src/components"
      ),
      lib: path.resolve(
        __dirname,
        "../fixtures/frameworks/vite-monorepo-imports/apps/web/src/lib"
      ),
      hooks: path.resolve(
        __dirname,
        "../fixtures/frameworks/vite-monorepo-imports/apps/web/src/hooks"
      ),
      utils: path.resolve(
        __dirname,
        "../fixtures/frameworks/vite-monorepo-imports/packages/ui/src/lib/utils.ts"
      ),
    },
    registries: {
      "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
    },
  })
})

test("get workspace config resolves cross-package aliases without tsconfig paths", async () => {
  const appCwd = path.resolve(
    __dirname,
    "../fixtures/frameworks/vite-monorepo-imports/apps/web"
  )
  const uiCwd = path.resolve(
    __dirname,
    "../fixtures/frameworks/vite-monorepo-imports/packages/ui"
  )

  const config = await getConfig(appCwd)
  if (!config) {
    throw new Error("Failed to load monorepo app config")
  }

  expect(await getWorkspaceConfig(config)).toMatchObject({
    components: {
      resolvedPaths: {
        cwd: appCwd,
      },
    },
    ui: {
      resolvedPaths: {
        cwd: uiCwd,
      },
    },
    lib: {
      resolvedPaths: {
        cwd: appCwd,
      },
    },
    hooks: {
      resolvedPaths: {
        cwd: appCwd,
      },
    },
  })
})

describe("getBase", () => {
  test("returns radix for radix styles", () => {
    expect(getBase("radix-nova")).toBe("radix")
    expect(getBase("radix-vega")).toBe("radix")
  })

  test("returns base for base styles", () => {
    expect(getBase("base-nova")).toBe("base")
    expect(getBase("base-vega")).toBe("base")
  })

  test("returns radix for undefined", () => {
    expect(getBase(undefined)).toBe("radix")
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
