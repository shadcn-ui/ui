import { type Config } from "@/src/utils/get-config"
import { transform } from "../transformers"
import { transformImport } from "./transform-import"
import { describe, expect, test } from "vitest"

const baseConfig: Config = {
  style: "new-york",
  tsx: true,
  rsc: true,
  tailwind: {
    baseColor: "neutral",
    cssVariables: true,
    config: "tailwind.config.ts",
    css: "tailwind.css",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
    // ui/lib/hooks left undefined by default
  },
  resolvedPaths: {
    cwd: "/",
    components: "/components",
    utils: "/lib/utils",
    ui: "/ui",
    lib: "/lib",
    hooks: "/hooks",
    tailwindConfig: "tailwind.config.ts",
    tailwindCss: "tailwind.css",
  },
}

describe("transformImport", () => {
  test("rewrites registry ui (with style) to components/ui when ui alias missing", async () => {
    const raw = `import { Button } from "@/registry/new-york/ui/button"\n`
    const out = await transform(
      { filename: "a.ts", raw, config: baseConfig },
      [transformImport]
    )
    expect(out).toContain('from "@/components/ui/button"')
  })

  test("rewrites registry components to custom components alias", async () => {
    const config: Config = {
      ...baseConfig,
      aliases: { ...baseConfig.aliases, components: "@acme/components" },
    }
    const raw = `import x from "@/registry/new-york/components/input"\n`
    const out = await transform(
      { filename: "a.ts", raw, config },
      [transformImport]
    )
    expect(out).toContain('from "@acme/components/input"')
  })

  test("rewrites bare lib alias to custom lib alias", async () => {
    const config: Config = {
      ...baseConfig,
      aliases: {
        ...baseConfig.aliases,
        lib: "@acme/lib",
      },
    }
    const raw = `import { foo } from "@/lib/foo"\n`
    const out = await transform(
      { filename: "a.ts", raw, config },
      [transformImport]
    )
    expect(out).toContain('from "@acme/lib/foo"')
  })

  test("cn special-case rewrites lib/utils to utils alias when importing cn", async () => {
    const config: Config = {
      ...baseConfig,
      aliases: {
        ...baseConfig.aliases,
        lib: "@acme/lib",
        utils: "@acme/utils",
      },
    }
    const raw = `import { cn } from "@/lib/utils"\n`
    const out = await transform(
      { filename: "a.ts", raw, config },
      [transformImport]
    )
    expect(out).toContain('from "@acme/utils"')
  })

  test("handles isRemote by prefixing registry style and rewriting", async () => {
    const raw = `import { Button } from "@/ui/button"\n`
    const out = await transform(
      { filename: "a.ts", raw, config: baseConfig, isRemote: true },
      [transformImport]
    )
    expect(out).toContain('from "@/components/ui/button"')
  })

  test("unknown registry bucket falls back to components alias", async () => {
    const config: Config = {
      ...baseConfig,
      aliases: { ...baseConfig.aliases, components: "@acme/components" },
    }
    const raw = `import x from "@/registry/new-york/payload/field"\n`
    const out = await transform(
      { filename: "a.ts", raw, config },
      [transformImport]
    )
    expect(out).toContain('from "@acme/components/payload/field"')
  })

  test("style segment optional in registry path", async () => {
    const raw = `import { Button } from "@/registry/ui/button"\n`
    const out = await transform(
      { filename: "a.ts", raw, config: baseConfig },
      [transformImport]
    )
    expect(out).toContain('from "@/components/ui/button"')
  })
})
