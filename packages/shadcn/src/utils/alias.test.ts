import {
  deriveAliasFromComponents,
  getInitAliasDefaults,
} from "@/src/utils/alias"
import { describe, expect, test } from "vitest"

describe("deriveAliasFromComponents", () => {
  test("derives ui aliases from components", () => {
    expect(deriveAliasFromComponents("@/components", "ui")).toBe(
      "@/components/ui"
    )
  })

  test("derives utils aliases from lib aliases", () => {
    expect(deriveAliasFromComponents("#components", "utils")).toBe("#lib/utils")
    expect(
      deriveAliasFromComponents("#custom/components", "utils", "#custom/lib")
    ).toBe("#custom/lib/utils")
  })

  test("derives sibling lib and hooks aliases from components", () => {
    expect(deriveAliasFromComponents("@/components", "lib")).toBe("@/lib")
    expect(deriveAliasFromComponents("#custom/components", "hooks")).toBe(
      "#custom/hooks"
    )
  })

  test("returns an empty string when components alias has no sibling base", () => {
    expect(deriveAliasFromComponents("#custom/ui", "lib")).toBe("")
  })
})

describe("getInitAliasDefaults", () => {
  test("derives standard aliases from components", () => {
    expect(getInitAliasDefaults("@/components")).toEqual({
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
      utils: "@/lib/utils",
    })
  })

  test("derives package import aliases from #components", () => {
    expect(getInitAliasDefaults("#components")).toEqual({
      ui: "#components/ui",
      lib: "#lib",
      hooks: "#hooks",
      utils: "#lib/utils",
    })
  })

  test("derives sibling aliases for nested custom aliases", () => {
    expect(getInitAliasDefaults("#custom/components")).toEqual({
      ui: "#custom/components/ui",
      lib: "#custom/lib",
      hooks: "#custom/hooks",
      utils: "#custom/lib/utils",
    })
  })

  test("preserves existing aliases when components alias is unchanged", () => {
    expect(
      getInitAliasDefaults("#components", {
        components: "#components",
        ui: "#components/ui",
        lib: "#lib",
        hooks: "#hooks",
        utils: "#lib/utils",
      })
    ).toEqual({
      ui: "#components/ui",
      lib: "#lib",
      hooks: "#hooks",
      utils: "#lib/utils",
    })
  })
})
