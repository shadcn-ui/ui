import { describe, expect, it } from "vitest"

import { docs, resolveDocsBase } from "./docs"

describe("resolveDocsBase", () => {
  it("accepts aria explicitly", () => {
    expect(resolveDocsBase("aria", undefined)).toBe("aria")
    expect(docs.helpInformation()).toContain("base, radix, or aria")
  })

  it("infers aria from the project style", () => {
    expect(resolveDocsBase(undefined, "aria-nova")).toBe("aria")
  })

  it("rejects unsupported bases", () => {
    expect(() => resolveDocsBase("unsupported", undefined)).toThrow(
      "Expected one of: radix, base, aria"
    )
  })
})
