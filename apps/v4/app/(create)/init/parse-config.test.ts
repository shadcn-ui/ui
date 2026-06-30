import { describe, expect, it } from "vitest"

import { parseDesignSystemConfig } from "./parse-config"

describe("parseDesignSystemConfig", () => {
  it("defaults pointer to false when omitted", () => {
    const result = parseDesignSystemConfig(
      new URLSearchParams(
        "base=base&style=sera&baseColor=taupe&theme=taupe&iconLibrary=lucide&font=noto-sans&rtl=false&menuAccent=subtle&menuColor=default&radius=default&fontHeading=playfair-display&template=vite&track=1"
      )
    )

    expect(result.success).toBe(true)
    if (!result.success) {
      throw new Error(result.error)
    }

    expect(result.data.pointer).toBe(false)
  })

  it("parses pointer=true", () => {
    const result = parseDesignSystemConfig(
      new URLSearchParams(
        "base=base&style=sera&baseColor=taupe&theme=taupe&iconLibrary=lucide&font=noto-sans&rtl=false&pointer=true&menuAccent=subtle&menuColor=default&radius=default&fontHeading=playfair-display&template=vite&track=1"
      )
    )

    expect(result.success).toBe(true)
    if (!result.success) {
      throw new Error(result.error)
    }

    expect(result.data.pointer).toBe(true)
  })

  it("defaults missing chartColor from the selected theme", () => {
    const result = parseDesignSystemConfig(
      new URLSearchParams(
        "base=base&style=sera&baseColor=taupe&theme=taupe&iconLibrary=lucide&font=noto-sans&rtl=false&menuAccent=subtle&menuColor=default&radius=default&fontHeading=playfair-display&template=vite&track=1"
      )
    )

    expect(result.success).toBe(true)
    if (!result.success) {
      throw new Error(result.error)
    }

    expect(result.data.chartColor).toBe("taupe")
  })

  it("honors explicit fontHeading and chartColor overrides when a preset is present", () => {
    const result = parseDesignSystemConfig(
      new URLSearchParams(
        "preset=a0&fontHeading=playfair-display&chartColor=emerald"
      )
    )

    expect(result.success).toBe(true)
    if (!result.success) {
      throw new Error(result.error)
    }

    expect(result.data.fontHeading).toBe("playfair-display")
    expect(result.data.chartColor).toBe("emerald")
  })

  it("keeps pointer outside preset decoding", () => {
    const result = parseDesignSystemConfig(
      new URLSearchParams("preset=a0&pointer=true")
    )

    expect(result.success).toBe(true)
    if (!result.success) {
      throw new Error(result.error)
    }

    expect(result.data.pointer).toBe(true)
  })
})
