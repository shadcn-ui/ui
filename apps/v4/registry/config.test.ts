import { describe, expect, it } from "vitest"

import publicSchema from "../public/schema.json"
import {
  BASES,
  buildPartialRegistryBase,
  buildRegistryBase,
  buildThemeForPreset,
  DEFAULT_CONFIG,
  designSystemConfigSchema,
  parseRegistryBaseParts,
  POINTER_CURSOR_SELECTOR,
  PRESETS,
  STYLES,
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

  it("defaults pointer to false when omitted", () => {
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

    expect(result.pointer).toBe(false)
  })

  it("does not include pointer cursor css by default", () => {
    const result = buildRegistryBase(DEFAULT_CONFIG)

    expect(
      result.css?.["@layer base"]?.[POINTER_CURSOR_SELECTOR]
    ).toBeUndefined()
  })

  it("includes pointer cursor css when pointer is enabled", () => {
    const result = buildRegistryBase({
      ...DEFAULT_CONFIG,
      pointer: true,
    })

    expect(result.css?.["@layer base"]?.[POINTER_CURSOR_SELECTOR]).toEqual({
      cursor: "pointer",
    })
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

  it("defines every base and style preset exactly once", () => {
    const presetNames = PRESETS.map((preset) => preset.name)
    const expectedPresetNames = BASES.flatMap((base) =>
      STYLES.map((style) => `${base.name}-${style.name}`)
    )

    expect([...presetNames].sort()).toEqual([...expectedPresetNames].sort())
    expect(new Set(presetNames).size).toBe(presetNames.length)
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

describe("buildThemeForPreset", () => {
  it("builds a copyable registry theme item", () => {
    const result = buildThemeForPreset({
      ...DEFAULT_CONFIG,
      baseColor: "taupe",
      theme: "taupe",
      chartColor: "taupe",
      menuAccent: "bold",
      radius: "large",
    })

    expect(result).toMatchObject({
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "taupe-taupe",
      type: "registry:theme",
    })
    expect(result.cssVars?.light?.radius).toBe("0.875rem")
    expect(result.cssVars?.light?.accent).toBe(result.cssVars?.light?.primary)
    expect(result.cssVars?.dark?.accent).toBe(result.cssVars?.dark?.primary)
    expect(result.cssVars?.light?.background).toBeDefined()
    expect(result.cssVars?.dark?.background).toBeDefined()
    expect(result.css).toBeUndefined()
  })
})

describe("custom primary", () => {
  const VIOLET = "oklch(0.541 0.247 293.009)"

  it("replaces primary in light and dark with the OKLCH value", () => {
    const result = buildThemeForPreset({ ...DEFAULT_CONFIG, primary: "7c3aed" })

    expect(result.cssVars?.light?.primary).toBe(VIOLET)
    expect(result.cssVars?.dark?.primary).toBe(VIOLET)
    expect(result.cssVars?.light?.["primary-foreground"]).toBe(
      "oklch(0.985 0 0)"
    )
  })

  it("picks dark foreground text on a light primary", () => {
    const result = buildThemeForPreset({ ...DEFAULT_CONFIG, primary: "fde047" })

    expect(result.cssVars?.light?.["primary-foreground"]).toBe(
      "oklch(0.205 0 0)"
    )
  })

  it("leaves the theme primary alone without a custom primary", () => {
    const result = buildThemeForPreset(DEFAULT_CONFIG)

    expect(result.cssVars?.light?.primary).toBe("oklch(0.205 0 0)")
  })

  it("feeds the custom primary into the bold menu accent", () => {
    const result = buildThemeForPreset({
      ...DEFAULT_CONFIG,
      menuAccent: "bold",
      primary: "7c3aed",
    })

    expect(result.cssVars?.light?.accent).toBe(VIOLET)
    expect(result.cssVars?.dark?.accent).toBe(VIOLET)
  })

  it("includes the custom primary in the registry base", () => {
    const result = buildRegistryBase({ ...DEFAULT_CONFIG, primary: "7c3aed" })

    expect(result.cssVars?.light?.primary).toBe(VIOLET)
  })

  it("accepts only 6-digit lowercase hex in the schema", () => {
    const parse = (primary: string) =>
      designSystemConfigSchema.safeParse({ ...DEFAULT_CONFIG, primary }).success

    expect(parse("7c3aed")).toBe(true)
    expect(parse("#7c3aed")).toBe(false)
    expect(parse("7C3AED")).toBe(false)
    expect(parse("fff")).toBe(false)
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
