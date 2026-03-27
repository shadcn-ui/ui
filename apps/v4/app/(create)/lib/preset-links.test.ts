import { describe, expect, it } from "vitest"

import { buildCreateShareUrl, buildPresetArgs } from "./preset-links"

describe("buildPresetArgs", () => {
  it("omits the base flag for radix presets", () => {
    expect(buildPresetArgs("aurk9Z2", { base: "radix" })).toBe(
      "--preset aurk9Z2"
    )
  })

  it("preserves the base flag for base-ui presets", () => {
    expect(buildPresetArgs("aurk9Z2", { base: "base" })).toBe(
      "--preset aurk9Z2 --base base"
    )
  })
})

describe("buildCreateShareUrl", () => {
  it("keeps base-ui in shared create URLs", () => {
    expect(
      buildCreateShareUrl({
        origin: "https://ui.shadcn.com",
        presetCode: "aurk9Z2",
        item: "Item",
        base: "base",
      })
    ).toBe("https://ui.shadcn.com/create?preset=aurk9Z2&item=Item&base=base")
  })

  it("omits the base query param for radix presets", () => {
    expect(
      buildCreateShareUrl({
        origin: "https://ui.shadcn.com",
        presetCode: "aurk9Z2",
        item: "Item",
        base: "radix",
      })
    ).toBe("https://ui.shadcn.com/create?preset=aurk9Z2&item=Item")
  })
})
