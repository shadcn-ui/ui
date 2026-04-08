import { REGISTRY_URL } from "@/src/registry/constants"
import { describe, expect, it } from "vitest"

import { resolveApplyInitUrl } from "./apply"

const SHADCN_URL = REGISTRY_URL.replace(/\/r\/?$/, "")

describe("resolveApplyInitUrl", () => {
  it("should include the inferred template for preset codes", () => {
    const initUrl = resolveApplyInitUrl("a0", "base", {
      template: "next",
      rtl: true,
    })
    const parsed = new URL(initUrl)

    expect(parsed.origin + parsed.pathname).toBe(`${SHADCN_URL}/init`)
    expect(parsed.searchParams.get("template")).toBe("next")
    expect(parsed.searchParams.get("preset")).toBe("a0")
    expect(parsed.searchParams.get("base")).toBe("base")
    expect(parsed.searchParams.get("rtl")).toBe("true")
  })

  it("should include the inferred template for named presets", () => {
    const initUrl = resolveApplyInitUrl("lyra", "base", {
      template: "next",
      rtl: true,
    })
    const parsed = new URL(initUrl)

    expect(parsed.origin + parsed.pathname).toBe(`${SHADCN_URL}/init`)
    expect(parsed.searchParams.get("template")).toBe("next")
    expect(parsed.searchParams.get("base")).toBe("base")
    expect(parsed.searchParams.get("rtl")).toBe("true")
  })

  it("should keep the current base for raw preset URLs without injecting a template", () => {
    const presetUrl = `${SHADCN_URL}/init?base=radix&style=nova&baseColor=neutral&theme=neutral&iconLibrary=lucide&font=inter&rtl=false&menuAccent=subtle&menuColor=default&radius=default`
    const initUrl = resolveApplyInitUrl(presetUrl, "base", {
      template: "next",
      rtl: true,
    })
    const parsed = new URL(initUrl)

    expect(parsed.searchParams.get("template")).toBeNull()
    expect(parsed.searchParams.get("track")).toBe("1")
    expect(parsed.searchParams.get("base")).toBe("base")
    expect(parsed.searchParams.get("rtl")).toBe("true")
  })
})
