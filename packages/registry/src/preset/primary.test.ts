import { describe, expect, it } from "vitest"

import { getPrimaryForeground, hexToOklch, oklchToHex } from "./primary"

describe("hexToOklch", () => {
  it("matches reference OKLCH values for sRGB primaries", () => {
    expect(hexToOklch("ff0000")).toBe("oklch(0.628 0.258 29.234)")
    expect(hexToOklch("00ff00")).toBe("oklch(0.866 0.295 142.495)")
    expect(hexToOklch("0000ff")).toBe("oklch(0.452 0.313 264.052)")
  })

  it("formats grays without chroma or hue like the registry", () => {
    expect(hexToOklch("ffffff")).toBe("oklch(1 0 0)")
    expect(hexToOklch("000000")).toBe("oklch(0 0 0)")
    expect(hexToOklch("171717")).toBe("oklch(0.205 0 0)")
  })

  it("wraps negative hue angles into the 0-360 range", () => {
    expect(hexToOklch("ff00ff")).toBe("oklch(0.702 0.322 328.363)")
  })
})

describe("oklchToHex", () => {
  it("recovers the hex that produced an OKLCH value", () => {
    for (const hex of [
      "7c3aed",
      "fde047",
      "ff0000",
      "171717",
      "ffffff",
      "000000",
    ]) {
      expect(oklchToHex(hexToOklch(hex))).toBe(hex)
    }
  })

  it("finds a hex with the same OKLCH value across the sRGB cube", () => {
    const steps = ["00", "33", "66", "99", "cc", "ff", "0f", "a7", "e3"]
    for (const r of steps) {
      for (const g of steps) {
        for (const b of steps) {
          const value = hexToOklch(`${r}${g}${b}`)
          expect(hexToOklch(oklchToHex(value)!)).toBe(value)
        }
      }
    }
  })

  it("returns null for values the converter did not produce", () => {
    expect(oklchToHex("oklch(0.488 0.243 264.376)")).toBeNull()
    expect(oklchToHex("oklch(1 0 0 / 10%)")).toBeNull()
    expect(oklchToHex("#7c3aed")).toBeNull()
    expect(oklchToHex("var(--blue-600)")).toBeNull()
  })
})

describe("getPrimaryForeground", () => {
  it("uses light text on dark colors", () => {
    expect(getPrimaryForeground("7c3aed")).toBe("oklch(0.985 0 0)")
  })

  it("uses dark text on light colors", () => {
    expect(getPrimaryForeground("fde047")).toBe("oklch(0.205 0 0)")
  })
})
