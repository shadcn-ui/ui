import { describe, expect, it } from "vitest"

import {
  decodePreset,
  DEFAULT_PRESET_CONFIG,
  encodePreset,
  fromBase62,
  generateRandomPreset,
  isPresetCode,
  isValidPreset,
  PRESET_BASE_COLORS,
  PRESET_FONTS,
  PRESET_ICON_LIBRARIES,
  PRESET_MENU_ACCENTS,
  PRESET_MENU_COLORS,
  PRESET_RADII,
  PRESET_STYLES,
  PRESET_THEMES,
  toBase62,
  type PresetConfig,
} from "./preset"

describe("base62", () => {
  it("should round-trip numbers", () => {
    for (const n of [0, 1, 61, 62, 100, 1000, 8388607]) {
      expect(fromBase62(toBase62(n))).toBe(n)
    }
  })

  it("should encode 0 as '0'", () => {
    expect(toBase62(0)).toBe("0")
  })

  it("should return -1 for invalid base62 characters", () => {
    expect(fromBase62("!@#")).toBe(-1)
  })
})

describe("encodePreset / decodePreset", () => {
  it("should round-trip the default config", () => {
    const code = encodePreset(DEFAULT_PRESET_CONFIG)
    const decoded = decodePreset(code)
    expect(decoded).toEqual(DEFAULT_PRESET_CONFIG)
  })

  it("should round-trip a custom config", () => {
    const config: PresetConfig = {
      style: "lyra",
      baseColor: "zinc",
      theme: "blue",
      iconLibrary: "tabler",
      font: "jetbrains-mono",
      radius: "large",
      menuAccent: "bold",
      menuColor: "inverted",
    }
    const code = encodePreset(config)
    const decoded = decodePreset(code)
    expect(decoded).toEqual(config)
  })

  it("should produce short codes (max 9 chars)", () => {
    const code = encodePreset(DEFAULT_PRESET_CONFIG)
    expect(code.length).toBeLessThanOrEqual(9)
  })

  it("should start with the version character", () => {
    const code = encodePreset(DEFAULT_PRESET_CONFIG)
    expect(code[0]).toBe("a")
  })

  it("should handle partial config by filling defaults", () => {
    const code = encodePreset({ style: "lyra" })
    const decoded = decodePreset(code)
    expect(decoded).not.toBeNull()
    expect(decoded!.style).toBe("lyra")
    expect(decoded!.theme).toBe(DEFAULT_PRESET_CONFIG.theme)
  })

  it("should round-trip all styles", () => {
    for (const style of PRESET_STYLES) {
      const code = encodePreset({ style })
      const decoded = decodePreset(code)
      expect(decoded).not.toBeNull()
      expect(decoded!.style).toBe(style)
    }
  })

  it("should round-trip all themes", () => {
    for (const theme of PRESET_THEMES) {
      const code = encodePreset({ theme })
      const decoded = decodePreset(code)
      expect(decoded!.theme).toBe(theme)
    }
  })

  it("should round-trip all fonts", () => {
    for (const font of PRESET_FONTS) {
      const code = encodePreset({ font })
      const decoded = decodePreset(code)
      expect(decoded!.font).toBe(font)
    }
  })

  it("should round-trip all icon libraries", () => {
    for (const iconLibrary of PRESET_ICON_LIBRARIES) {
      const code = encodePreset({ iconLibrary })
      const decoded = decodePreset(code)
      expect(decoded!.iconLibrary).toBe(iconLibrary)
    }
  })

  it("should round-trip all radii", () => {
    for (const radius of PRESET_RADII) {
      const code = encodePreset({ radius })
      const decoded = decodePreset(code)
      expect(decoded!.radius).toBe(radius)
    }
  })

  it("should round-trip all base colors", () => {
    for (const baseColor of PRESET_BASE_COLORS) {
      const code = encodePreset({ baseColor })
      const decoded = decodePreset(code)
      expect(decoded!.baseColor).toBe(baseColor)
    }
  })

  it("should round-trip all menu accents and colors", () => {
    for (const menuAccent of PRESET_MENU_ACCENTS) {
      for (const menuColor of PRESET_MENU_COLORS) {
        const code = encodePreset({ menuAccent, menuColor })
        const decoded = decodePreset(code)
        expect(decoded!.menuAccent).toBe(menuAccent)
        expect(decoded!.menuColor).toBe(menuColor)
      }
    }
  })

  it("should round-trip default-translucent menu color", () => {
    const code = encodePreset({ menuColor: "default-translucent" })
    const decoded = decodePreset(code)
    expect(decoded!.menuColor).toBe("default-translucent")
  })
})

describe("decodePreset edge cases", () => {
  it("should return null for empty string", () => {
    expect(decodePreset("")).toBeNull()
  })

  it("should return null for single character", () => {
    expect(decodePreset("A")).toBeNull()
  })

  it("should return null for wrong version prefix", () => {
    expect(decodePreset("b123")).toBeNull()
  })

  it("should return null for invalid base62 characters", () => {
    expect(decodePreset("A!@#")).toBeNull()
  })
})

describe("isPresetCode", () => {
  it("should return true for valid preset codes", () => {
    const code = encodePreset(DEFAULT_PRESET_CONFIG)
    expect(isPresetCode(code)).toBe(true)
  })

  it("should return false for empty string", () => {
    expect(isPresetCode("")).toBe(false)
  })

  it("should return false for URLs", () => {
    expect(isPresetCode("https://ui.shadcn.com/init?foo=bar")).toBe(false)
  })

  it("should return false for named presets", () => {
    expect(isPresetCode("radix-nova")).toBe(false)
  })

  it("should return false for strings that are too long", () => {
    expect(isPresetCode("A1234567890")).toBe(false)
  })

  it("should return false for invalid characters after version", () => {
    expect(isPresetCode("A!@#")).toBe(false)
  })
})

describe("isValidPreset", () => {
  it("should return true for encodable presets", () => {
    const code = encodePreset(DEFAULT_PRESET_CONFIG)
    expect(isValidPreset(code)).toBe(true)
  })

  it("should return false for invalid codes", () => {
    expect(isValidPreset("")).toBe(false)
    expect(isValidPreset("b123")).toBe(false)
  })
})

describe("generateRandomPreset", () => {
  it("should produce a valid preset code", () => {
    const code = generateRandomPreset()
    expect(isPresetCode(code)).toBe(true)
    expect(isValidPreset(code)).toBe(true)
  })

  it("should round-trip through decode", () => {
    const code = generateRandomPreset()
    const decoded = decodePreset(code)
    expect(decoded).not.toBeNull()
    const reEncoded = encodePreset(decoded!)
    expect(reEncoded).toBe(code)
  })
})
