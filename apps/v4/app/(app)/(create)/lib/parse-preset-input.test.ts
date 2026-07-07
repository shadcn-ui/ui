import { describe, expect, it } from "vitest"

import { parsePresetInput } from "./parse-preset-input"

describe("parsePresetInput", () => {
  it("accepts a raw preset code", () => {
    expect(parsePresetInput("b0")).toBe("b0")
  })

  it("accepts a --preset flag", () => {
    expect(parsePresetInput(" --preset b0 ")).toBe("b0")
  })

  it("rejects invalid preset input", () => {
    expect(parsePresetInput("open sesame")).toBeNull()
  })
})
