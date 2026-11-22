import { describe, expect, it } from "vitest"

import {
  formatColor,
  getColorFormat,
  hsvToRgb,
  isOklchInGamut,
  oklchToRgb,
  parseColor,
  rgbToHsv,
  rgbToOklch,
  type HsvaColor,
} from "./color"

function parse(value: string) {
  const color = parseColor(value)

  if (!color) {
    throw new Error(`Expected "${value}" to parse.`)
  }

  return color
}

function readOklch(value: string) {
  const match = /^oklch\((\S+) (\S+) (\S+?)(?: \/ (\S+)%)?\)$/.exec(value)

  if (!match) {
    throw new Error(`"${value}" is not in token format.`)
  }

  return {
    l: Number(match[1]),
    c: Number(match[2]),
    h: Number(match[3]),
    alpha: match[4] === undefined ? 100 : Number(match[4]),
  }
}

describe("parseColor", () => {
  it.each([
    ["#3b82f6", "#3b82f6"],
    ["3b82f6", "#3b82f6"],
    ["#3B82F6", "#3b82f6"],
    ["  #3b82f6  ", "#3b82f6"],
    ["#fff", "#ffffff"],
    ["#fff8", "#ffffff88"],
    ["#3b82f680", "#3b82f680"],
    ["#3b82f6ff", "#3b82f6"],
  ])("parses hex %j", (input, expected) => {
    expect(formatColor(parse(input), "hex")).toBe(expected)
  })

  it.each([
    "",
    "#",
    "#12",
    "#12345",
    "#1234567",
    "#ggg",
    "red",
    "rgb(0 0 0)",
    "oklch(0.7 0.1)",
    "oklch(0.7, 0.1, 200)",
    "oklch(a b c)",
    "oklch(0.7 0.1 200 /)",
    "oklch(0.7 0.1 200 / 0.5 / 0.5)",
    "oklch(0.7 0.1% 200deg / 50deg)",
    "oklch(0.7 0.1deg 200)",
    "oklch(0.7 0.1 200%)",
  ])("rejects %j", (input) => {
    expect(parseColor(input)).toBeNull()
  })

  it("reads oklch percentages using the CSS Color 4 references", () => {
    expect(formatColor(parse("oklch(62.8% 64.5% 29.234)"), "oklch")).toBe(
      formatColor(parse("oklch(0.628 0.258 29.234)"), "oklch")
    )
  })

  it.each([
    ["oklch(0.7 0.1 180deg)", "oklch(0.7 0.1 180)"],
    ["oklch(0.7 0.1 0.5turn)", "oklch(0.7 0.1 180)"],
    ["oklch(0.7 0.1 200grad)", "oklch(0.7 0.1 180)"],
    [`oklch(0.7 0.1 ${Math.PI}rad)`, "oklch(0.7 0.1 180)"],
    ["oklch(0.7 0.1 -180)", "oklch(0.7 0.1 180)"],
    ["oklch(0.7 0.1 540)", "oklch(0.7 0.1 180)"],
    ["OKLCH(0.7 0.1 180)", "oklch(0.7 0.1 180)"],
    ["oklch( 0.7   0.1 180 )", "oklch(0.7 0.1 180)"],
  ])("normalizes oklch hue %j", (input, expected) => {
    expect(formatColor(parse(input), "oklch")).toBe(
      formatColor(parse(expected), "oklch")
    )
  })

  it("treats none as zero", () => {
    expect(formatColor(parse("oklch(0.5 none none)"), "oklch")).toBe(
      "oklch(0.5 0 0)"
    )
  })

  it.each([
    ["oklch(0.7 0.1 180 / 0.5)", 0.5],
    ["oklch(0.7 0.1 180/50%)", 0.5],
    ["oklch(0.7 0.1 180 / 2)", 1],
    ["oklch(0.7 0.1 180 / -1)", 0],
  ])("reads and clamps alpha in %j", (input, alpha) => {
    expect(parse(input).a).toBe(alpha)
  })

  it("clamps lightness and negative chroma", () => {
    expect(formatColor(parse("oklch(1.5 0 0)"), "hex")).toBe("#ffffff")
    expect(formatColor(parse("oklch(-0.5 0 0)"), "hex")).toBe("#000000")
    expect(formatColor(parse("oklch(0.5 -0.1 0)"), "oklch")).toBe(
      "oklch(0.5 0 0)"
    )
  })
})

describe("formatColor", () => {
  // Published OKLCH values for the sRGB primaries (CSS Color 4 sample code).
  it.each([
    ["#ff0000", 0.628, 0.2577, 29.234],
    ["#00ff00", 0.8664, 0.2948, 142.495],
    ["#0000ff", 0.452, 0.3132, 264.052],
  ])("converts %s to oklch", (hex, l, c, h) => {
    const oklch = readOklch(formatColor(parse(hex), "oklch"))

    expect(oklch.l).toBeCloseTo(l, 3)
    expect(oklch.c).toBeCloseTo(c, 3)
    expect(oklch.h).toBeCloseTo(h, 3)
  })

  it.each([
    ["#ffffff", "oklch(1 0 0)"],
    ["#000000", "oklch(0 0 0)"],
    ["#808080", "oklch(0.6 0 0)"],
    ["#ffffff1a", "oklch(1 0 0 / 10.2%)"],
  ])("formats achromatic %s like the theme tokens", (hex, expected) => {
    expect(formatColor(parse(hex), "oklch")).toBe(expected)
  })

  it("round-trips every 8-bit step of 15 through hex", () => {
    for (let r = 0; r <= 255; r += 15) {
      for (let g = 0; g <= 255; g += 15) {
        for (let b = 0; b <= 255; b += 15) {
          const hex = `#${[r, g, b]
            .map((channel) => channel.toString(16).padStart(2, "0"))
            .join("")}`

          expect(formatColor(parse(hex), "hex")).toBe(hex)
        }
      }
    }
  })

  it("round-trips every alpha byte through hex", () => {
    for (let alpha = 0; alpha < 255; alpha++) {
      const hex = `#3b82f6${alpha.toString(16).padStart(2, "0")}`

      expect(formatColor(parse(hex), "hex")).toBe(hex)
    }
  })

  it.each([
    "oklch(0.145 0 0)",
    "oklch(0.708 0 0)",
    "oklch(0.488 0.243 264.376)",
    "oklch(0.546 0.245 262.881)",
    "oklch(0.865 0.127 207.078)",
    "oklch(1 0 0 / 10%)",
    "oklch(1 0 0 / 15%)",
  ])("round-trips the in-gamut theme token %s", (token) => {
    expect(isOklchInGamut(readOklch(token))).toBe(true)
    expect(formatColor(parse(token), "oklch")).toBe(token)
  })

  // Near-white tokens sit on the sRGB edge, and at chroma 0.001 a rounding
  // error in a channel moves the hue by about 0.001 degrees.
  it("keeps near-zero chroma hue within rounding", () => {
    const token = "oklch(0.985 0.001 106.423)"
    const oklch = readOklch(formatColor(parse(token), "oklch"))

    expect(oklch.l).toBe(0.985)
    expect(oklch.c).toBe(0.001)
    expect(Math.abs(oklch.h - 106.423)).toBeLessThanOrEqual(0.002)
  })

  it("wraps a hue that rounds to 360 back to 0", () => {
    const color: HsvaColor = {
      ...rgbToHsv(oklchToRgb({ l: 0.6, c: 0.1, h: 359.9999 })),
      a: 1,
    }

    expect(readOklch(formatColor(color, "oklch")).h).toBe(0)
  })

  it("omits alpha when it rounds to opaque", () => {
    expect(formatColor({ h: 0, s: 1, v: 1, a: 0.9999 }, "hex")).toBe("#ff0000")
    expect(formatColor({ h: 0, s: 0, v: 1, a: 0.99999 }, "oklch")).toBe(
      "oklch(1 0 0)"
    )
  })
})

describe("gamut mapping", () => {
  it("reduces chroma and keeps lightness and hue", () => {
    const input = { l: 0.7, c: 0.4, h: 150 }

    expect(isOklchInGamut(input)).toBe(false)

    // Checked before rounding, which could push a maximal chroma out of gamut.
    const mapped = rgbToOklch(hsvToRgb(parse("oklch(0.7 0.4 150)")))

    expect(mapped.l).toBeCloseTo(0.7, 3)
    expect(mapped.h).toBeCloseTo(150, 1)
    expect(mapped.c).toBeLessThan(0.4)
    expect(isOklchInGamut(mapped)).toBe(true)
    expect(isOklchInGamut({ ...mapped, c: mapped.c + 0.005 })).toBe(false)
  })

  it("returns channels inside sRGB", () => {
    const { r, g, b } = oklchToRgb({ l: 0.9, c: 0.37, h: 330 })

    for (const channel of [r, g, b]) {
      expect(channel).toBeGreaterThanOrEqual(0)
      expect(channel).toBeLessThanOrEqual(1)
    }
  })
})

describe("hsv", () => {
  it.each([
    [
      { h: 0, s: 1, v: 1 },
      { r: 1, g: 0, b: 0 },
    ],
    [
      { h: 120, s: 1, v: 1 },
      { r: 0, g: 1, b: 0 },
    ],
    [
      { h: 240, s: 1, v: 1 },
      { r: 0, g: 0, b: 1 },
    ],
    [
      { h: 360, s: 1, v: 1 },
      { r: 1, g: 0, b: 0 },
    ],
    [
      { h: 200, s: 0, v: 0.5 },
      { r: 0.5, g: 0.5, b: 0.5 },
    ],
    [
      { h: 200, s: 1, v: 0 },
      { r: 0, g: 0, b: 0 },
    ],
  ])("converts %j to rgb", (hsv, rgb) => {
    const result = hsvToRgb(hsv)

    expect(result.r).toBeCloseTo(rgb.r, 10)
    expect(result.g).toBeCloseTo(rgb.g, 10)
    expect(result.b).toBeCloseTo(rgb.b, 10)
  })

  it("reports hue 0 and saturation 0 for grays", () => {
    expect(rgbToHsv({ r: 0.4, g: 0.4, b: 0.4 })).toEqual({ h: 0, s: 0, v: 0.4 })
    expect(rgbToHsv({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, v: 0 })
  })

  it("measures oklch chroma 0 for white", () => {
    expect(rgbToOklch({ r: 1, g: 1, b: 1 }).c).toBeLessThan(1e-6)
  })
})

describe("getColorFormat", () => {
  it.each([
    ["#3b82f6", "hex"],
    ["3b82f6", "hex"],
    ["oklch(0.7 0.1 200)", "oklch"],
    [" OKLCH(0.7 0.1 200 / 50%) ", "oklch"],
    ["red", null],
    ["", null],
  ])("detects %j as %j", (input, format) => {
    expect(getColorFormat(input)).toBe(format)
  })
})
