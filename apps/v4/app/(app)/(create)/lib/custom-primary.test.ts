import { describe, expect, it } from "vitest"

import { normalizeHex } from "./custom-primary"

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
