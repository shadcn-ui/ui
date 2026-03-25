import { REGISTRY_URL } from "@/src/registry/constants"
import { describe, expect, it } from "vitest"

import { resolveCreateUrl, resolveInitUrl } from "./presets"

const SHADCN_URL = REGISTRY_URL.replace(/\/r\/?$/, "")

const mockPreset = {
  name: "default",
  title: "Default",
  description: "The default preset.",
  base: "radix",
  style: "new-york-v4",
  baseColor: "neutral",
  theme: "default",
  iconLibrary: "lucide",
  font: "inter",
  rtl: false,
  menuAccent: "subtle" as const,
  menuColor: "default" as const,
  radius: "0.5",
}

describe("createPresetUrl", () => {
  it("should not include rtl by default", () => {
    const url = resolveCreateUrl()
    const parsed = new URL(url)
    expect(parsed.origin + parsed.pathname).toBe(`${SHADCN_URL}/create`)
    expect(parsed.searchParams.has("rtl")).toBe(false)
  })

  it("should append search params when provided", () => {
    const url = resolveCreateUrl({ rtl: true, template: "next" })
    const parsed = new URL(url)
    expect(parsed.searchParams.get("rtl")).toBe("true")
    expect(parsed.searchParams.get("template")).toBe("next")
  })
})

describe("buildInitUrl", () => {
  it("should build url with all preset fields as query params", () => {
    const url = resolveInitUrl(mockPreset)
    const parsed = new URL(url)
    expect(parsed.origin + parsed.pathname).toBe(`${SHADCN_URL}/init`)
    expect(parsed.searchParams.get("base")).toBe("radix")
    expect(parsed.searchParams.get("style")).toBe("new-york-v4")
    expect(parsed.searchParams.get("baseColor")).toBe("neutral")
    expect(parsed.searchParams.get("theme")).toBe("default")
    expect(parsed.searchParams.get("iconLibrary")).toBe("lucide")
    expect(parsed.searchParams.get("font")).toBe("inter")
    expect(parsed.searchParams.get("rtl")).toBe("false")
    expect(parsed.searchParams.get("menuAccent")).toBe("subtle")
    expect(parsed.searchParams.get("menuColor")).toBe("default")
    expect(parsed.searchParams.get("radius")).toBe("0.5")
  })

  it("should set rtl=true when preset.rtl is true", () => {
    const url = resolveInitUrl({ ...mockPreset, rtl: true })
    const parsed = new URL(url)
    expect(parsed.searchParams.get("rtl")).toBe("true")
  })

  it("should include template when provided", () => {
    const url = resolveInitUrl(mockPreset, { template: "next" })
    const parsed = new URL(url)
    expect(parsed.searchParams.get("template")).toBe("next")
  })

  it("should not include template when not provided", () => {
    const url = resolveInitUrl(mockPreset)
    const parsed = new URL(url)
    expect(parsed.searchParams.has("template")).toBe(false)
  })
})
