import { describe, expect, it } from "vitest"

import { BASE_COLORS } from "./base-colors"

describe("BASE_COLORS", () => {
  it("includes the full neutral Tailwind base color set used by create", () => {
    expect(BASE_COLORS.map((color) => color.name)).toEqual(
      expect.arrayContaining([
        "slate",
        "gray",
        "neutral",
        "stone",
        "zinc",
        "mauve",
        "olive",
        "mist",
        "taupe",
      ])
    )
  })
})
