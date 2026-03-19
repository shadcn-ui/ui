import { describe, expect, it } from "vitest"

import {
  buildRegistryBase,
  DEFAULT_CONFIG,
  designSystemConfigSchema,
} from "./config"

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
