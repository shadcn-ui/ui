import { describe, expect, it, vi } from "vitest"

import { docs, normalizeLinks, resolveDocsBase } from "./docs"

vi.mock(
  "@shadcn/registry/internal/registry/constants",
  async (importOriginal) => ({
    ...(await importOriginal<
      typeof import("@shadcn/registry/internal/registry/constants")
    >()),
    SHADCN_URL: "http://localhost:4000",
  })
)

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

describe("normalizeLinks", () => {
  it("points ui.shadcn.com links at SHADCN_URL", () => {
    expect(
      normalizeLinks({
        doc: "https://ui.shadcn.com/docs/components/button",
        home: "https://ui.shadcn.com",
      })
    ).toEqual({
      doc: "http://localhost:4000/docs/components/button",
      home: "http://localhost:4000",
    })
  })

  it("leaves other hosts alone", () => {
    const links = {
      lookalike: "https://ui.shadcn.com.example.com/docs",
      other: "https://base-ui.com/react/components/button",
    }
    expect(normalizeLinks(links)).toEqual(links)
  })
})
