import os from "os"
import path from "path"
import { getFixturesDir } from "@/src/test-helpers"
import { getProjectConfig } from "@/src/utils/get-project-info"
import fs from "fs-extra"
import { describe, expect, it } from "vitest"

import {
  createConfig,
  getBase,
  getConfig,
  getRawConfig,
  getWorkspaceConfig,
} from "./get-config"

describe("getRawConfig", () => {
  it("get raw config", async () => {
    expect(await getRawConfig(getFixturesDir("config-none"))).toEqual(null)

    expect(await getRawConfig(getFixturesDir("config-partial"))).toEqual({
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
      getRawConfig(getFixturesDir("config-invalid"))
    ).rejects.toThrowError()
  })
})

describe("getProjectConfig", () => {
  it("get project config from package imports", async () => {
    const cwd = getFixturesDir("frameworks/next-app-imports")

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

  it("get project config from generic package import prefix", async () => {
    const cwd = getFixturesDir("frameworks/vite-app-imports")

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

  it("get project config from root package imports", async () => {
    const cwd = getFixturesDir("frameworks/vite-root-imports")

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

  it("get project config from partial package imports", async () => {
    const cwd = getFixturesDir("frameworks/vite-partial-imports")

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
})

describe("getConfig", () => {
  it("get config", async () => {
    expect(await getConfig(getFixturesDir("config-none"))).toEqual(null)

    await expect(
      getConfig(getFixturesDir("config-invalid"))
    ).rejects.toThrowError()

    expect(await getConfig(getFixturesDir("config-partial"))).toEqual({
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
        cwd: getFixturesDir("config-partial"),
        tailwindConfig: path.resolve(
          getFixturesDir("config-partial"),
          "tailwind.config.ts"
        ),
        tailwindCss: path.resolve(
          getFixturesDir("config-partial"),
          "./src/assets/css/tailwind.css"
        ),
        components: path.resolve(
          getFixturesDir("config-partial"),
          "./components"
        ),
        utils: path.resolve(getFixturesDir("config-partial"), "./lib/utils"),
        ui: path.resolve(getFixturesDir("config-partial"), "./components/ui"),
        hooks: path.resolve(getFixturesDir("config-partial"), "./hooks"),
        lib: path.resolve(getFixturesDir("config-partial"), "./lib"),
      },
      iconLibrary: "lucide",
      registries: {
        "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
      },
    })

    expect(await getConfig(getFixturesDir("config-full"))).toEqual({
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
        cwd: getFixturesDir("config-full"),
        tailwindConfig: path.resolve(
          getFixturesDir("config-full"),
          "tailwind.config.ts"
        ),
        tailwindCss: path.resolve(
          getFixturesDir("config-full"),
          "./src/app/globals.css"
        ),
        components: path.resolve(
          getFixturesDir("config-full"),
          "./src/components"
        ),
        ui: path.resolve(getFixturesDir("config-full"), "./src/ui"),
        hooks: path.resolve(getFixturesDir("config-full"), "./src/lib/hooks"),
        lib: path.resolve(getFixturesDir("config-full"), "./src/lib"),
        utils: path.resolve(getFixturesDir("config-full"), "./src/lib/utils"),
      },
      registries: {
        "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
      },
    })

    expect(await getConfig(getFixturesDir("config-jsx"))).toEqual({
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
        cwd: getFixturesDir("config-jsx"),
        tailwindConfig: path.resolve(
          getFixturesDir("config-jsx"),
          "tailwind.config.js"
        ),
        tailwindCss: path.resolve(
          getFixturesDir("config-jsx"),
          "./src/assets/css/tailwind.css"
        ),
        components: path.resolve(getFixturesDir("config-jsx"), "./components"),
        ui: path.resolve(getFixturesDir("config-jsx"), "./components/ui"),
        utils: path.resolve(getFixturesDir("config-jsx"), "./lib/utils"),
        hooks: path.resolve(getFixturesDir("config-jsx"), "./hooks"),
        lib: path.resolve(getFixturesDir("config-jsx"), "./lib"),
      },
      registries: {
        "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
      },
    })

    expect(await getConfig(getFixturesDir("config-imports"))).toEqual({
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
        cwd: getFixturesDir("config-imports"),
        tailwindConfig: path.resolve(
          getFixturesDir("config-imports"),
          "tailwind.config.ts"
        ),
        tailwindCss: path.resolve(
          getFixturesDir("config-imports"),
          "src/app/globals.css"
        ),
        components: path.resolve(
          getFixturesDir("config-imports"),
          "src/components"
        ),
        ui: path.resolve(getFixturesDir("config-imports"), "src/components/ui"),
        lib: path.resolve(getFixturesDir("config-imports"), "src/lib"),
        hooks: path.resolve(getFixturesDir("config-imports"), "src/hooks"),
        utils: path.resolve(
          getFixturesDir("config-imports"),
          "src/lib/utils.ts"
        ),
      },
      registries: {
        "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
      },
    })

    expect(
      await getConfig(getFixturesDir("config-imports-extensions"))
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
        cwd: getFixturesDir("config-imports-extensions"),
        tailwindConfig: "",
        tailwindCss: path.resolve(
          getFixturesDir("config-imports-extensions"),
          "src/index.css"
        ),
        components: path.resolve(
          getFixturesDir("config-imports-extensions"),
          "src/components"
        ),
        ui: path.resolve(
          getFixturesDir("config-imports-extensions"),
          "src/components/ui"
        ),
        lib: path.resolve(
          getFixturesDir("config-imports-extensions"),
          "src/lib"
        ),
        hooks: path.resolve(
          getFixturesDir("config-imports-extensions"),
          "src/hooks"
        ),
        utils: path.resolve(
          getFixturesDir("config-imports-extensions"),
          "src/lib/utils.ts"
        ),
      },
      registries: {
        "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
      },
    })

    expect(
      await getConfig(
        getFixturesDir("frameworks/vite-monorepo-imports/apps/web")
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
        cwd: getFixturesDir("frameworks/vite-monorepo-imports/apps/web"),
        tailwindConfig: "",
        tailwindCss: getFixturesDir(
          "frameworks/vite-monorepo-imports/packages/ui/src/styles/globals.css"
        ),
        components: getFixturesDir(
          "frameworks/vite-monorepo-imports/apps/web/src/components"
        ),
        ui: getFixturesDir(
          "frameworks/vite-monorepo-imports/packages/ui/src/components"
        ),
        lib: getFixturesDir(
          "frameworks/vite-monorepo-imports/apps/web/src/lib"
        ),
        hooks: getFixturesDir(
          "frameworks/vite-monorepo-imports/apps/web/src/hooks"
        ),
        utils: getFixturesDir(
          "frameworks/vite-monorepo-imports/packages/ui/src/lib/utils.ts"
        ),
      },
      registries: {
        "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
      },
    })
  })
})

describe("getWorkspaceConfig", () => {
  it("get workspace config resolves cross-package aliases without tsconfig paths", async () => {
    const appCwd = getFixturesDir("frameworks/vite-monorepo-imports/apps/web")
    const uiCwd = getFixturesDir("frameworks/vite-monorepo-imports/packages/ui")

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

  it("get workspace config shows an actionable error when a workspace package is missing imports", async () => {
    const fixtureRoot = getFixturesDir("frameworks/vite-monorepo-imports")
    const tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "shadcn-workspace-config-")
    )

    try {
      await fs.copy(fixtureRoot, tempDir)

      const uiPackageJsonPath = path.resolve(
        tempDir,
        "packages/ui/package.json"
      )
      const uiPackageJson = await fs.readJson(uiPackageJsonPath)
      delete uiPackageJson.imports
      await fs.writeJson(uiPackageJsonPath, uiPackageJson, { spaces: 2 })

      const config = await getConfig(path.resolve(tempDir, "apps/web"))
      if (!config) {
        throw new Error("Failed to load broken monorepo app config")
      }

      await expect(getWorkspaceConfig(config)).rejects.toThrowError(
        new RegExp(
          "Could not resolve the following aliases.*packages/ui.*components, ui, lib, hooks, utils",
          "s"
        )
      )
    } finally {
      await fs.remove(tempDir)
    }
  })

  it("get workspace config shows an actionable error when a workspace package is missing components.json", async () => {
    const fixtureRoot = getFixturesDir("frameworks/vite-monorepo-imports")
    const tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "shadcn-workspace-config-")
    )

    try {
      await fs.copy(fixtureRoot, tempDir)
      await fs.remove(path.resolve(tempDir, "packages/ui/components.json"))

      const config = await getConfig(path.resolve(tempDir, "apps/web"))
      if (!config) {
        throw new Error("Failed to load broken monorepo app config")
      }

      await expect(getWorkspaceConfig(config)).rejects.toThrowError(
        new RegExp(
          "Could not load the workspace config.*packages/ui.*components.json.*path aliases or package imports",
          "s"
        )
      )
    } finally {
      await fs.remove(tempDir)
    }
  })
})

describe("getBase", () => {
  it("returns radix for radix styles", () => {
    expect(getBase("radix-nova")).toBe("radix")
    expect(getBase("radix-vega")).toBe("radix")
  })

  it("returns base for base styles", () => {
    expect(getBase("base-nova")).toBe("base")
    expect(getBase("base-vega")).toBe("base")
  })

  it("returns aria for aria styles", () => {
    expect(getBase("aria-nova")).toBe("aria")
    expect(getBase("aria-vega")).toBe("aria")
  })

  it("returns base for undefined", () => {
    expect(getBase(undefined)).toBe("base")
  })

  it("returns radix for legacy unprefixed styles", () => {
    expect(getBase("new-york")).toBe("radix")
    expect(getBase("new-york-v4")).toBe("radix")
    expect(getBase("default")).toBe("radix")
  })

  it("returns radix for an empty string style", () => {
    expect(getBase("")).toBe("radix")
  })
})

describe("createConfig", () => {
  it("creates default config when called without arguments", () => {
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

  it("overrides cwd in resolvedPaths", () => {
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

  it("overrides style", () => {
    const config = createConfig({
      style: "new-york",
    })

    expect(config.style).toBe("new-york")
  })

  it("overrides tailwind settings", () => {
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

  it("overrides boolean flags", () => {
    const config = createConfig({
      rsc: true,
      tsx: false,
    })

    expect(config.rsc).toBe(true)
    expect(config.tsx).toBe(false)
  })

  it("overrides aliases", () => {
    const config = createConfig({
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
      },
    })

    expect(config.aliases.components).toBe("@/components")
    expect(config.aliases.utils).toBe("@/lib/utils")
  })

  it("handles complex partial overrides", () => {
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

  it("returns new object instances", () => {
    const config1 = createConfig()
    const config2 = createConfig()

    expect(config1).not.toBe(config2)
    expect(config1.resolvedPaths).not.toBe(config2.resolvedPaths)
    expect(config1.tailwind).not.toBe(config2.tailwind)
    expect(config1.aliases).not.toBe(config2.aliases)
  })
})
