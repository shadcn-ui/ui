import { type Config } from "@/src/utils/get-config"
import { describe, expect, test } from "vitest"
import { transform } from "../transformers"
import { transformStringAliases } from "./transform-string-aliases"

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

describe("transformStringAliases", () => {
  test("rewrites registry string literal to alias", async () => {
    const config: Config = {
      ...baseConfig,
      aliases: { ...baseConfig.aliases, lib: "@acme/lib" },
    }
    const raw = `export const admin = { field: "@/registry/new-york/lib/fields/color" }\n`
    const out = await transform(
      { filename: "a.ts", raw, config },
      [transformStringAliases]
    )
    expect(out).toContain('"@acme/lib/fields/color"')
  })

  test("supports optional style in registry path", async () => {
    const config: Config = {
      ...baseConfig,
      aliases: { ...baseConfig.aliases, lib: "@acme/lib" },
    }
    const raw = `const s = "@/registry/lib/fields/color"\n`
    const out = await transform(
      { filename: "a.ts", raw, config },
      [transformStringAliases]
    )
    expect(out).toContain('"@acme/lib/fields/color"')
  })

  test("rewrites bare alias string", async () => {
    const config: Config = {
      ...baseConfig,
      aliases: { ...baseConfig.aliases, hooks: "@acme/hooks" },
    }
    const raw = `const x = "@/hooks/use-thing"\n`
    const out = await transform(
      { filename: "a.ts", raw, config },
      [transformStringAliases]
    )
    expect(out).toContain('"@acme/hooks/use-thing"')
  })

  test("unknown bucket falls back to components alias", async () => {
    const config: Config = {
      ...baseConfig,
      aliases: { ...baseConfig.aliases, components: "@acme/components" },
    }
    const raw = `const x = "@/registry/new-york/payload/my-field"\n`
    const out = await transform(
      { filename: "a.ts", raw, config },
      [transformStringAliases]
    )
    expect(out).toContain('"@acme/components/payload/my-field"')
  })

  test("non-alias strings are unchanged", async () => {
    const raw = `const t = "hello world"\n`
    const out = await transform(
      { filename: "a.ts", raw, config: baseConfig },
      [transformStringAliases]
    )
    expect(out).toContain('"hello world"')
  })
})
