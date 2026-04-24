import { describe, expect, it } from "vitest"

import publicSchema from "../public/schema.json"
import {
  buildPartialRegistryBase,
  buildRegistryBase,
  DEFAULT_CONFIG,
  designSystemConfigSchema,
  parseRegistryBaseParts,
  PRESETS,
} from "./config"

const legacyPublicSchemaStyles = ["default", "new-york"] as const

describe("buildRegistryBase", () => {
  it("seeds a font-heading fallback when heading inherits the body font", () => {
    const result = buildRegistryBase(DEFAULT_CONFIG)

    expect(result.registryDependencies).toContain("font-inter")
    expect(result.registryDependencies).not.toContain("font-heading-inter")
    expect(result.cssVars?.theme?.["--font-heading"]).toBe("var(--font-sans)")
  })

  it("adds a heading font dependency when a distinct heading font is selected", () => {
    const result = buildRegistryBase({
      ...DEFAULT_CONFIG,
      fontHeading: "playfair-display",
    })

    expect(result.registryDependencies).toContain("font-inter")
    expect(result.registryDependencies).toContain(
      "font-heading-playfair-display"
    )
    expect(result.cssVars?.theme?.["--font-heading"]).toBeUndefined()
  })

  it("normalizes a matching heading font back to inherit", () => {
    const result = buildRegistryBase({
      ...DEFAULT_CONFIG,
      fontHeading: "inter",
    })

    expect(result.registryDependencies).not.toContain("font-heading-inter")
    expect(result.cssVars?.theme?.["--font-heading"]).toBe("var(--font-sans)")
  })

  it("inherits the selected body font variable for non-sans body fonts", () => {
    const result = buildRegistryBase({
      ...DEFAULT_CONFIG,
      font: "jetbrains-mono",
      fontHeading: "inherit",
    })

    expect(result.registryDependencies).toContain("font-jetbrains-mono")
    expect(result.cssVars?.theme?.["--font-heading"]).toBe("var(--font-mono)")
  })

  it("defaults chartColor to neutral when omitted", () => {
    const result = designSystemConfigSchema.parse({
      base: "radix",
      style: "nova",
      iconLibrary: "lucide",
      theme: "neutral",
      font: "inter",
      fontHeading: "inherit",
      menuAccent: "subtle",
      menuColor: "default",
      radius: "default",
    })

    expect(result.chartColor).toBe("neutral")
  })

  it("defaults chartColor to the selected theme when omitted", () => {
    const result = designSystemConfigSchema.parse({
      base: "base",
      style: "sera",
      iconLibrary: "lucide",
      baseColor: "taupe",
      theme: "taupe",
      font: "noto-sans",
      fontHeading: "playfair-display",
      menuAccent: "subtle",
      menuColor: "default",
      radius: "default",
    })

    expect(result.chartColor).toBe("taupe")
  })

  it("keeps the public schema style enum in sync with presets", () => {
    expect([...publicSchema.properties.style.enum].sort()).toEqual(
      [
        ...legacyPublicSchemaStyles,
        ...PRESETS.map((preset) => preset.name),
      ].sort()
    )
  })

  it("rejects chartColor values that are unavailable for the selected base color", () => {
    const result = designSystemConfigSchema.safeParse({
      base: "radix",
      style: "nova",
      iconLibrary: "lucide",
      baseColor: "neutral",
      theme: "neutral",
      chartColor: "stone",
      font: "inter",
      fontHeading: "inherit",
      menuAccent: "subtle",
      menuColor: "default",
      radius: "default",
    })

    expect(result.success).toBe(false)
  })
})

describe("parseRegistryBaseParts", () => {
  it("returns undefined parts when only is omitted", () => {
    expect(parseRegistryBaseParts(null)).toEqual({
      success: true,
      parts: undefined,
    })
  })

  it("normalizes and dedupes only values", () => {
    expect(parseRegistryBaseParts("theme,fonts,font")).toEqual({
      success: true,
      parts: ["theme", "font"],
    })
  })

  it("rejects invalid only values", () => {
    const result = parseRegistryBaseParts("theme,colors")

    expect(result.success).toBe(false)
  })
})

describe("buildPartialRegistryBase", () => {
  it("builds a sparse theme payload", () => {
    const result = buildPartialRegistryBase(
      {
        ...DEFAULT_CONFIG,
        baseColor: "taupe",
        theme: "taupe",
        chartColor: "taupe",
        menuAccent: "bold",
        menuColor: "inverted",
        radius: "large",
      },
      ["theme"]
    )

    expect(result.type).toBe("registry:base")
    expect(result.extends).toBe("none")
    expect(result.config).toEqual({
      menuColor: "inverted",
      menuAccent: "bold",
      tailwind: {
        baseColor: "taupe",
      },
    })
    expect(result.cssVars?.light?.radius).toBe("0.875rem")
    expect(result.cssVars?.light).toBeDefined()
    expect(result.cssVars?.dark).toBeDefined()
    expect(result.registryDependencies).toBeUndefined()
    expect("dependencies" in result).toBe(false)
  })

  it("builds a sparse font payload", () => {
    const result = buildPartialRegistryBase(
      {
        ...DEFAULT_CONFIG,
        font: "noto-sans",
        fontHeading: "playfair-display",
      },
      ["font"]
    )

    expect(result.registryDependencies).toEqual([
      "font-noto-sans",
      "font-heading-playfair-display",
    ])
    expect(result.cssVars).toBeUndefined()
    expect(result.config).toBeUndefined()
  })

  it("adds a heading fallback when font heading inherits", () => {
    const result = buildPartialRegistryBase(
      {
        ...DEFAULT_CONFIG,
        font: "jetbrains-mono",
        fontHeading: "inherit",
      },
      ["font"]
    )

    expect(result.registryDependencies).toEqual(["font-jetbrains-mono"])
    expect(result.cssVars?.theme?.["--font-heading"]).toBe("var(--font-mono)")
  })

  it("merges combined partial payloads", () => {
    const result = buildPartialRegistryBase(
      {
        ...DEFAULT_CONFIG,
        font: "figtree",
      },
      ["theme", "font"]
    )

    expect(result.config?.tailwind?.baseColor).toBe("neutral")
    expect(result.registryDependencies).toEqual(["font-figtree"])
    expect(result.cssVars?.light?.radius).toBe("0.625rem")
    expect(result.cssVars?.light).toBeDefined()
    expect(result.cssVars?.theme?.["--font-heading"]).toBe("var(--font-sans)")
  })
})
