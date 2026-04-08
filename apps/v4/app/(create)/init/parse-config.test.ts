import { describe, expect, it } from "vitest"

import { parseDesignSystemConfig } from "./parse-config"

describe("parseDesignSystemConfig", () => {
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
})
