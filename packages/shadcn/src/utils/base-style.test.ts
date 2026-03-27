import { describe, expect, it } from "vitest"

import { applyBaseToStyle } from "./base-style"

describe("applyBaseToStyle", () => {
  it("should switch radix-prefixed styles to base", () => {
    expect(applyBaseToStyle("radix-nova", "base")).toBe("base-nova")
  })

  it("should switch base-prefixed styles to radix", () => {
    expect(applyBaseToStyle("base-vega", "radix")).toBe("radix-vega")
  })

  it("should leave unprefixed styles unchanged", () => {
    expect(applyBaseToStyle("new-york", "base")).toBe("new-york")
  })
})
