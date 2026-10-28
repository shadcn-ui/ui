import { describe, expect, it } from "vitest"

import {
  getPrimaryForeground,
  hexToOklch,
  normalizeHex,
} from "./custom-primary"

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

describe("normalizeHex", () => {
  it("accepts short and long hex with or without a hash", () => {
    expect(normalizeHex("#abc")).toBe("aabbcc")
    expect(normalizeHex("abc")).toBe("aabbcc")
    expect(normalizeHex(" #AABBCC ")).toBe("aabbcc")
  })

  it("rejects values that are not hex colors", () => {
    expect(normalizeHex("")).toBeNull()
    expect(normalizeHex("abcd")).toBeNull()
    expect(normalizeHex("#ggg")).toBeNull()
    expect(normalizeHex("#aabbccdd")).toBeNull()
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
